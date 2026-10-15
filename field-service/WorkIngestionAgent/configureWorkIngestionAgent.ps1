Param(
    [Parameter(Mandatory = $true, HelpMessage = "Dataverse environment id")]
    [string]$environmentId = "",

    [Parameter(Mandatory = $true, HelpMessage = "Dataverse environment URL")]
    [string]$dataverseUrl = "",

    [Parameter(Mandatory = $true, HelpMessage = "Microsoft Dataverse connection name")]
    [string]$DVConnectionName = "",

    [Parameter(Mandatory = $true, HelpMessage = "Microsoft Copilot Studio connection name")]
    [string]$MCSConnectionName = ""
)

# Check PS version
if ($PSVersionTable.PSVersion.Major -lt 7) {
    Write-Error 'This script requires at least PowerShell version 7' -ErrorAction Stop
}

$ErrorActionPreference = 'Stop'

# Install the required modules if not already installed
if (-not (Get-Module -ListAvailable -Name Microsoft.PowerApps.PowerShell)) {
    Write-Warning -Message 'Installing module Microsoft.PowerApps.PowerShell'
    Install-Module -Name Microsoft.PowerApps.PowerShell -AllowClobber -Scope CurrentUser
}

# Install the required modules if not already installed
if (-not (Get-Module -ListAvailable -Name Az.Accounts | Where-Object Version -ge 2.17)) {
    Write-Warning -Message 'Installing required version of module Az.Accounts'
    Install-Module -Name Az.Accounts -AllowClobber -Scope CurrentUser -Force -MinimumVersion 2.17
}

# Import required modules
Import-Module Az.Accounts -MinimumVersion 2.17
Import-Module Microsoft.PowerApps.PowerShell

function Get-AccessToken {
    # Retrieve the access token for the Dataverse environment
    $accessToken = Get-AzAccessToken -ResourceUrl "$dataverseUrl" -AsSecureString
    $token = $accessToken.Token
    $userId = $accessToken.UserId
    Write-Host "Access token for $userId retrieved successfully." -ForegroundColor Green

    return $token
}

function Get-ConnectionId {
    param (
        [string]$userProvidedName,
        [string]$providerName
    )

    $matchedConnectionId = $null

    $connections = Get-PowerAppConnection -EnvironmentName $environmentId -ConnectorNameFilter $providerName
    foreach ($con in $connections) {
        if (($con.ConnectionName -eq $userProvidedName) -or ($con.DisplayName -eq $userProvidedName)) {
            $matchedConnectionId = $con.ConnectionName
            break
        }
    }

    if ($null -eq $matchedConnectionId) {
        Write-Error -Message "Unable to find connection $userProvidedName ($providerName)" -ErrorAction Stop
    }

    Write-Host "Found connection id $matchedConnectionId for connection $userProvidedName"

    return $matchedConnectionId
}

function Get-ConnectionReferenceId {
    param(
        [string]$connectionReferenceLogicalName,
        [securestring]$accessToken
    )

    $uri = "$dataverseUrl/api/data/v9.2/connectionreferences?`$filter=connectionreferencelogicalname eq '$connectionReferenceLogicalName'"
    $response = Invoke-RestMethod -Method Get -Uri $uri -Authentication Bearer -Token $accessToken -ContentType 'application/json'

    if ($null -eq $response -or @($response.value).Count -ne 1 -or
        [string]::IsNullOrWhiteSpace($response.value[0].connectionreferenceid)) {
        Write-Error -Message "Expected one connection reference with an id for logical name $connectionReferenceLogicalName" -ErrorAction Stop
    }

    $connectionReferenceDisplayName = $response.value[0].connectionreferencedisplayname
    $connectionReferenceId = $response.value[0].connectionreferenceid

    Write-Host "Found connection reference id $connectionReferenceId for $connectionReferenceDisplayName ($connectionReferenceLogicalName)"

    return $connectionReferenceId
}

function Set-ConnectionReferenceConnection {
    param (
        [string]$connectionReferenceLogicalName,
        [string]$userProvidedConnectionName,
        [string]$providerName,
        [securestring]$accessToken
    )

    Write-Host "Updating connection reference ${connectionReferenceLogicalName}..."

    $connectionReferenceId = Get-ConnectionReferenceId -connectionReferenceLogicalName $connectionReferenceLogicalName -accessToken $accessToken
    $connectionId = Get-ConnectionId -userProvidedName $userProvidedConnectionName -providerName $providerName

    $body = @{
        "connectionid" = "$connectionId"
    } | ConvertTo-Json -Depth 1

    $uri = "$dataverseUrl/api/data/v9.2/connectionreferences($connectionReferenceId)"
    Write-Host "Updating connection reference URI: $uri with connection id $connectionId"

    Invoke-RestMethod -Method Patch -Uri $uri -Authentication Bearer -Token $accessToken -ContentType 'application/json' -Body $body

    Write-Host "Connection reference updated successfully." -ForegroundColor Green
    Write-Host
}

function ValidateUserEnvironment {
    param (
        [string]$environmentId
    )

    $env = Get-PowerAppEnvironment -EnvironmentName $environmentId
    if ($null -eq $env) {
        Write-Error -Message "Environment $environmentId was not found" -ErrorAction Stop
    }

    $displayName = $env.DisplayName
    Write-Host "Connected to environment: $displayName ($environmentId)"
}

function Enable-TriggerFlow {
    param (
        [string]$flowId,
        [securestring]$accessToken
    )

    $flowUri = "$dataverseUrl/api/data/v9.2/workflows($flowId)"
    $flow = $null

    Write-Host "Enabling flow $flowId with uri $flowUri"

    try {
        $flow = Invoke-RestMethod -Method Get -Uri $flowUri -Authentication Bearer -Token $accessToken -ContentType 'application/json'
    }
    catch {
        Write-Error -Message $_.Exception -ErrorAction Stop
    }

    $displayName = $flow.name
    Write-Host "Activating flow $displayName for id $flowId"

    $body = @{
        "statecode"  = 1  # Activated
        "statuscode" = 2 # Activated
    } | ConvertTo-Json -Depth 1 -Compress

    try {
        Invoke-RestMethod -Method Patch -Uri $flowUri -Authentication Bearer -Token $accessToken -ContentType 'application/json' -Body $body
    }
    catch {
        Write-Error -Message $_.Exception -ErrorAction Stop
    }

    Write-Host "Activated flow $displayName" -ForegroundColor Green
    Write-Host
}

# Actual script body

Write-Host
Write-Host "Authenticating interactively..."
Write-Host

Connect-AzAccount -UseDeviceAuthentication
$accessToken = Get-AccessToken
ValidateUserEnvironment -environmentId $environmentId

Write-Host
Write-Host 'Setting up connection references...'
Write-Host

# Updated connection reference logical names for FS Field Service Email Agent
Set-ConnectionReferenceConnection -userProvidedConnectionName $DVConnectionName -providerName "/providers/Microsoft.PowerApps/apis/shared_commondataserviceforapps" -connectionReferenceLogicalName "msdyn_FieldServiceEmailAgent.shared_commondataserviceforapps.shared-commondataser-7aa8cd39-8fb8-4011-baff-f48550f37a04" -accessToken $accessToken

Set-ConnectionReferenceConnection -userProvidedConnectionName $MCSConnectionName -providerName "/providers/Microsoft.PowerApps/apis/shared_microsoftcopilotstudio" -connectionReferenceLogicalName "msdyn_FieldServiceEmailAgent.shared_microsoftcopilotstudio.0b7756f761ce46f1a76751aa0d457d7f" -accessToken $accessToken

Write-Host
Write-Host 'Activating flows...'
Write-Host

# Updated Flow IDs for FS Field Service Email Agent workflows
Enable-TriggerFlow -flowId '8fa8d877-0928-4e0a-b462-9ebf46915ff3' -accessToken $accessToken # Microsoft Dataverse (FS Email Agent)

Enable-TriggerFlow -flowId '77a708ea-a1b2-4042-951b-93011306f83b' -accessToken $accessToken # Microsoft Copilot Studio (FS Email Agent)

Write-Host
Write-Host 'FS Field Service Email Agent is ready for use' -ForegroundColor Green

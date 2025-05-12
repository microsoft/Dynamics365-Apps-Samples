### Define script parameters
param 
(
 [string]$OrgURL,
 [string]$ClientId,        
 [string]$ClientSecret,
 [string]$TenantId
)

if($OrgURL.LastIndexOf("/") -eq ($OrgURL.Length - 1))
{
	$OrgURL = $OrgURL.Substring(0, $OrgURL.Length - 1)
}

function AddBotToWorkstream($workstreamId, $bothandle)
{
	Write-Host "Processing $workstreamId`: $bothandle"
	
	$oauthBody = @{
		grant_type = 'client_credentials'
		resource = $OrgURL
		client_id = $ClientId
		client_secret = $ClientSecret
	}
	$contentType = 'application/x-www-form-urlencoded' 
	$getTokenUrl = "https://login.microsoftonline.com/" + $TenantId + "/oauth2/token"
	$response = Invoke-RestMethod -Uri $getTokenUrl -Method Post -Body $oauthBody -ContentType $contentType -UseBasicParsing
	$token =  $response.access_token
	$headers = @{
		"Content-Type" = "application/json"
		"Authorization" = "Bearer $token"
		"Accept" = "application/json"
	}
	
	$uri = $OrgURL + "/api/data/v9.0/systemusers?`$filter=msdyn_bothandle eq '" + $bothandle + "'"
	
	Write-Host $uri

	$responseDetails = Invoke-RestMethod -Uri $uri -Headers $headers -Method Get -ContentType "application/json" 
	$systemuser = $responseDetails.value
	$systemuserid = $systemuser.systemuserid
	
	Write-Host $systemuserid

	$workstreamdata = @{"msdyn_bot_user@odata.bind" = "/systemusers($systemuserid)"
}
	$workstreambody = $workstreamdata | ConvertTo-Json
	Write-Host $workstreambody
	
	$workstreamUri = $OrgURL + "/api/data/v9.0/msdyn_liveworkstreams(" + $workstreamId + ")"

	Write-Host $workstreamUri
	$workstreamResponse = Invoke-RestMethod -Method PATCH -Uri $workstreamUri -Headers $headers -Body $workstreambody -ContentType "application/json" 
	Write-Host "Request successful"
	Write-Host "Response:"
	$workstreamResponse | ConvertTo-Json
}

Write-Host $PSScriptRoot 
$csvPath = Join-Path $PSScriptRoot "WorkstreamToBotMap.csv"

# Check if the file exists
if (-not (Test-Path $csvPath)) {
    Write-Error "File not found: $csvPath"
    exit 1
}

$csvData = Import-Csv -Path $csvPath
    
if ($null -eq $csvData -or $csvData.Count -eq 0) {
	Write-Warning "The CSV file is empty or could not be parsed correctly."
	exit 0
}

# Get the header names
$headers = $csvData[0].PSObject.Properties.Name

# Print the row count
Write-Host "Total rows found: $($csvData.Count)" -ForegroundColor Yellow

foreach ($row in $csvData) {
	$workstreamId = ""
	$bothandle = ""
	foreach ($header in $headers) {
		$value = $row.$header
		
		if ($header -eq "WorkstreamId")
		{
			$workstreamId = $value
		}
		elseif ($header -eq "BotHandle")
		{
			$bothandle = $value
		}
	}
	
	AddBotToWorkstream -workstreamId $workstreamId -bothandle $bothandle
}
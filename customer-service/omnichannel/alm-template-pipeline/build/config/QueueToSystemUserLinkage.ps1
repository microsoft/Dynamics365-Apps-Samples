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

function AddSystemUserToQueue($queueId, $aadId)
{
	Write-Host "Processing $queueId`: $aadId"
	
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
	
	$uri = $OrgURL + "/api/data/v9.0/systemusers?`$filter=azureactivedirectoryobjectid eq " + $aadId
	
	Write-Host $uri

	$responseDetails = Invoke-RestMethod -Uri $uri -Headers $headers -Method Get -ContentType "application/json" 
	$systemuser = $responseDetails.value
	$systemuserid = $systemuser.systemuserid
	
	Write-Host $systemuserid

	$queuedata = @{"@odata.id" = $OrgURL + "/api/data/v9.0/systemusers(" + $systemuserid + ")"}
	$queuebody = $queuedata | ConvertTo-Json
	Write-Host $queuebody
	
	$queuemembershipUri = $OrgURL + "/api/data/v9.0/queues(" + $queueId + ")/queuemembership_association/`$ref"

	Write-Host $queuemembershipUri
	$queuemembershipResponse = Invoke-RestMethod -Method POST -Uri $queuemembershipUri -Headers $headers -Body $queuebody -ContentType "application/json" 
	Write-Host "Request successful"
	Write-Host "Response:"
	$queuemembershipResponse | ConvertTo-Json
}

Write-Host $PSScriptRoot 
$csvPath = Join-Path $PSScriptRoot "QueueToSystemUserMap.csv"

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
	$queueId = ""
	$aadId = ""
	foreach ($header in $headers) {
		$value = $row.$header
		
		if ($header -eq "QueueId")
		{
			$queueId = $value
		}
		elseif ($header -eq "AzureActiveDirectoryId")
		{
			$aadId = $value
		}
	}
	
	AddSystemUserToQueue -queueId $queueId -aadId $aadId
}
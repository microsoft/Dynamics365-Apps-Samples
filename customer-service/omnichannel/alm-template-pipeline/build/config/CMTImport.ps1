### Define script parameters
param 
(
 ## migration parameters
 [string]$OrgURL,
 [string]$ConfigFolder,
 [string]$DataFileName,

 ## connection parameters
 [string]$AppUserClientId,        
 [string]$AppUserSecret
)

### Install CMT module if it doesn't exist
if (Get-Module -ListAvailable -Name Microsoft.Xrm.Tooling.ConfigurationMigration) 
{
 Write-Output "CMT module is already installed"
}
else
{
 Write-Output "Installing CMT module..."
 Install-Module -Name Microsoft.Xrm.Tooling.ConfigurationMigration -Force
} 

Write-Output "Installing CrmConnector module"
Install-Module -Name Microsoft.Xrm.Tooling.CrmConnector.PowerShell -Force

Write-Output "Importing CrmConnector module"
Import-Module Microsoft.Xrm.Tooling.CrmConnector.PowerShell -Force

### Set up connection
$connstr = "AuthType=ClientSecret;url=" + $OrgURL + ";ClientId=" + $AppUserClientId + ";ClientSecret=" + $AppUserSecret
$CRMConn = Get-CrmConnection -ConnectionString $connstr

Write-Output "connstr $connstr"

### Import configurations to destination environment
$datafilepath = $ConfigFolder + $DataFileName

Write-Output "Import now"
Import-CrmDataFile -CrmConnection $CRMConn -Datafile $datafilepath
Write-Output "Import done"
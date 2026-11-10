<#
.SYNOPSIS
  Adds minimal Recommended Actions ranking signals for one table (replaces the old "minimum rule" flow).

.DESCRIPTION
  Reads the Recommended Actions settings row (msdyn_salesagentconfigurationsv2, msdyn_microagenttype = 11),
  adds a section for the table under salesconfig (signals + floor rules) and a value benchmark, and saves it
  back with an ETag check so a concurrent change is never overwritten. A backup of the original JSON is
  written first. Existing table sections are never changed unless -Replace is given.

  Run it once per table, after importing that table's package (step 2). Opportunity, Lead, Contact and
  Account already have shipped signals and don't need this. Newly saved settings can take up to ~60 minutes
  to be picked up by ranking (config cache).

.EXAMPLE
  .\Set-RaaTableSignals.ps1 -OrgUrl https://contoso.crm.dynamics.com -Table quote -WhatIf
  .\Set-RaaTableSignals.ps1 -OrgUrl https://contoso.crm.dynamics.com -Table cr123_project -ValueColumn cr123_amount -DateColumn cr123_duedate
#>
[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [Parameter(Mandatory = $true)] [ValidatePattern('^https://[a-z0-9-]+\.crm[0-9]*\.dynamics\.com/?$')] [string] $OrgUrl,
    [Parameter(Mandatory = $true)] [ValidatePattern('^[a-z][a-z0-9_]{1,63}$')] [string] $Table,
    [ValidatePattern('^[a-z][a-z0-9_]{1,99}$')] [string] $ValueColumn,
    [ValidatePattern('^[a-z][a-z0-9_]{1,99}$')] [string] $DateColumn,
    [switch] $IsActivity,
    [switch] $Replace,
    [string] $BackupFolder = '.'
)
$ErrorActionPreference = 'Stop'
$OrgUrl = $OrgUrl.TrimEnd('/')

# Defaults for the ready-made table packages. Explicit parameters win.
$presets = @{
    quote       = @{ Value = 'totalamount'; Date = 'effectiveto' }
    salesorder  = @{ Value = 'totalamount'; Date = 'requestdeliveryby' }
    invoice     = @{ Value = 'totalamount'; Date = 'duedate' }
    incident    = @{ Value = '';            Date = 'followupby' }
    email       = @{ Value = '';            Date = 'scheduledend'; Activity = $true }
    appointment = @{ Value = '';            Date = 'scheduledend'; Activity = $true }
    task        = @{ Value = '';            Date = 'scheduledend'; Activity = $true }
    phonecall   = @{ Value = '';            Date = 'scheduledend'; Activity = $true }
}
if ($Table -in 'opportunity', 'lead', 'contact', 'account') {
    Write-Output "$Table already has shipped ranking signals. Nothing to do."
    return
}
if ($presets.ContainsKey($Table)) {
    if (-not $PSBoundParameters.ContainsKey('ValueColumn')) { $ValueColumn = $presets[$Table].Value }
    if (-not $PSBoundParameters.ContainsKey('DateColumn'))  { $DateColumn  = $presets[$Table].Date }
    if ($presets[$Table].Activity) { $IsActivity = [switch]::Present }
}
if (-not $ValueColumn -and -not $DateColumn) {
    Write-Warning 'No value or date column given. Suggestions will be stored and ranked but are likely to be filtered out as not important or not urgent.'
}

# Sign-in: uses the signed-in Azure CLI account. Run 'az login' first.
$token = az account get-access-token --resource $OrgUrl --query accessToken -o tsv
if ($LASTEXITCODE -ne 0 -or -not $token) { throw "Could not get a token for $OrgUrl. Run 'az login' with an account that has access." }
$headers = @{ Authorization = "Bearer $token"; Accept = 'application/json'; 'OData-Version' = '4.0' }
$api = "$OrgUrl/api/data/v9.2"

# Check the table and columns exist, and the columns have usable types.
$entity = Invoke-RestMethod -Headers $headers "$api/EntityDefinitions(LogicalName='$Table')?`$select=LogicalName,IsActivity"
if ($entity.IsActivity) { $IsActivity = [switch]::Present }
foreach ($pair in @(@($ValueColumn, @('Money', 'Decimal', 'Double', 'Integer', 'BigInt')), @($DateColumn, @('DateTime')))) {
    if (-not $pair[0]) { continue }
    $attr = Invoke-RestMethod -Headers $headers "$api/EntityDefinitions(LogicalName='$Table')/Attributes(LogicalName='$($pair[0])')?`$select=LogicalName,AttributeType"
    if ($attr.AttributeType -notin $pair[1]) { throw "Column $($pair[0]) is $($attr.AttributeType); expected one of: $($pair[1] -join ', ')." }
}

# Read the settings row with its ETag.
$rows = (Invoke-RestMethod -Headers $headers "$api/msdyn_salesagentconfigurationsv2?`$select=msdyn_salesagentconfigurationv2id,msdyn_microagentconfiguration&`$filter=msdyn_microagenttype eq 11").value
if ($rows.Count -ne 1) { throw "Expected exactly one Recommended Actions settings row (msdyn_microagenttype eq 11); found $($rows.Count). Configure Recommended Actions first." }
$row = $rows[0]
$etag = $row.'@odata.etag'
$raw = $row.msdyn_microagentconfiguration
if (-not $raw) { throw 'The Recommended Actions settings JSON is empty. Open Recommended Actions in AI hub and save it once, then rerun.' }
$config = $raw | ConvertFrom-Json -AsHashtable -Depth 100
if (-not $config.ContainsKey('salesconfig')) { throw 'Unexpected settings shape: no salesconfig section.' }
$sales = $config['salesconfig']

if ($sales.ContainsKey($Table) -and -not $Replace) {
    Write-Output "Ranking signals for '$Table' already exist. Nothing changed. Use -Replace to overwrite them."
    return
}

# Minimal entry: record state + optional value and due-date signals, with exclusion (floor) rules.
$signals = [System.Collections.Generic.List[object]]::new()
$signals.Add([ordered]@{ name = 'record_state'; type = 'number'; source = $Table; dimension_influence = @{ confidence = 'weak' }
    fetch_info = [ordered]@{ fetch_type = 'entity_field'; crm_entity = $Table; crm_field = 'statecode' } })
$floor = [System.Collections.Generic.List[object]]::new()
if ($IsActivity) {
    $floor.Add([ordered]@{ id = 'F-RAA-STATE'; reason = 'Activity was canceled'; expression = [ordered]@{ field = 'record_state'; op = 'eq'; value = 2 } })
} else {
    $floor.Add([ordered]@{ id = 'F-RAA-STATE'; reason = 'Record is no longer active'; expression = [ordered]@{ field = 'record_state'; op = 'gt'; value = 0 } })
}
if ($ValueColumn) {
    $signals.Add([ordered]@{ name = 'record_value'; type = 'number'; source = $Table; dimension_influence = @{ impact = 'strong' }
        interpretation = 'Compare against org benchmarks. Higher-value records increase impact.'; reliability = 'high'; required = $true
        fetch_info = [ordered]@{ fetch_type = 'entity_field'; crm_entity = $Table; crm_field = $ValueColumn } })
    $floor.Add([ordered]@{ id = 'F-RAA-VALUE'; reason = 'Record has no value assigned - impact is not material'; expression = [ordered]@{ field = 'record_value'; op = 'lte'; value = 0 } })
}
if ($DateColumn) {
    $signals.Add([ordered]@{ name = 'due_date_days'; type = 'number'; source = 'derived'; dimension_influence = @{ urgency = 'strong' }
        interpretation = 'Negative = overdue. Low positive = deadline pressure. >30 = low urgency.'; reliability = 'high'
        fetch_info = [ordered]@{ fetch_type = 'derived'; crm_entity = $Table; crm_field = $DateColumn; derivation = 'days_until_date' } })
}
$sales[$Table] = [ordered]@{ signals = $signals.ToArray(); prefilter_rules = [ordered]@{ floor = $floor.ToArray(); ceiling = @() } }

if ($ValueColumn) {
    $benchId = "${Table}_estimated_value"
    $existing = @($sales['benchmark_definitions'] | Where-Object { $_ -and $_['id'] -ne $benchId })
    $existing += [ordered]@{ id = $benchId; target_entity = $Table; crm_entity = $Table; crm_field = $ValueColumn
        base_filter = [ordered]@{ field = 'statecode'; op = 'eq'; value = 0 }; lookback_days = 365; min_count = 10
        fallback = [ordered]@{ P10 = 5000; P50 = 50000; P75 = 250000; P90 = 1000000 } }
    $sales['benchmark_definitions'] = $existing
}

$newJson = $config | ConvertTo-Json -Depth 100 -Compress
Write-Output "Table:   $Table  (activity: $([bool]$IsActivity))"
Write-Output "Signals: $(($signals | ForEach-Object { $_.name }) -join ', ')"
Write-Output "Floors:  $(($floor | ForEach-Object { $_.id }) -join ', ')"
Write-Output "Benchmark: $(if ($ValueColumn) { "${Table}_estimated_value on $ValueColumn" } else { 'none' })"

if ($PSCmdlet.ShouldProcess("Recommended Actions settings in $OrgUrl", "add ranking signals for '$Table'")) {
    $backup = Join-Path (Resolve-Path $BackupFolder).Path ("raa-settings-backup-{0:yyyyMMdd-HHmmss}.json" -f (Get-Date))
    [IO.File]::WriteAllText($backup, $raw, [Text.UTF8Encoding]::new($false))
    Write-Output "Backup:  $backup"
    $body = @{ msdyn_microagentconfiguration = $newJson } | ConvertTo-Json -Depth 3 -Compress
    try {
        Invoke-RestMethod -Method Patch -Headers ($headers + @{ 'If-Match' = $etag }) -ContentType 'application/json; charset=utf-8' `
            -Body ([Text.Encoding]::UTF8.GetBytes($body)) "$api/msdyn_salesagentconfigurationsv2($($row.msdyn_salesagentconfigurationv2id))" | Out-Null
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 412) { throw 'The settings were changed by someone else while this ran. Nothing was saved; run again.' }
        throw
    }
    $check = Invoke-RestMethod -Headers $headers "$api/msdyn_salesagentconfigurationsv2($($row.msdyn_salesagentconfigurationv2id))?`$select=msdyn_microagentconfiguration"
    if (-not (($check.msdyn_microagentconfiguration | ConvertFrom-Json -AsHashtable -Depth 100)['salesconfig'].ContainsKey($Table))) { throw 'Saved, but the table section was not found on read-back.' }
    Write-Output 'Saved and verified. Ranking picks this up within about 60 minutes.'
}

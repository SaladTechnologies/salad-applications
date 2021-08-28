if ([string]::IsNullOrEmpty($Env:WHITELIST_DIR)) {
  exit 1
}

$i = New-Object System.Diagnostics.ProcessStartInfo
$i.Arguments = "Add-MpPreference -ExclusionPath `"${Env:WHITELIST_DIR}`""
$i.CreateNoWindow = $false
$i.FileName = 'powershell.exe'
$i.UseShellExecute = $true
$i.Verb = 'runAs'
$p = New-Object System.Diagnostics.Process
$p.StartInfo = $i
try {
  $p.Start()
} catch {
  $e = $Error[0]
  if ($e -ne $null -and $e.Exception -ne $null -and $e.Exception.InnerException -ne $null -and $e.Exception.InnerException.NativeErrorCode -ne $null) {
    exit $e.Exception.InnerException.NativeErrorCode
  } else {
    exit 1
  }
}

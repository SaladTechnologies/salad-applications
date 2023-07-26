#!/usr/bin/env pwsh
[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Path $PSScriptRoot -Parent
Push-Location -Path $projectRoot
try {
    . (Join-Path -Path $projectRoot -ChildPath '.azure-pipelines' -AdditionalChildPath 'utilities.ps1')

    # Inject Azure PAT
    Show-LogSection -Content 'Injecting Azure PAT...'
    $npmrcFile = Join-Path -Path $projectRoot -ChildPath ".npmrc"
    (Get-Content -Path $npmrcFile -Raw).replace('"${NPM_BASE64_TOKEN}"', "${Env:DEVOPS_PAT_BASE64}") | Set-Content -Path $npmrcFile

}
catch {
    if (($null -ne $_.ErrorDetails) -and ($null -ne $_.ErrorDetails.Message)) {
        Show-LogError -Content $_.ErrorDetails.Message
    }
    elseif (($null -ne $_.Exception) -and ($null -ne $_.Exception.Message)) {
        Show-LogError -Content $_.Exception.Message
    }
    else {
        Show-LogError -Content $_
    }

    exit 1
}
finally {
    Pop-Location
}

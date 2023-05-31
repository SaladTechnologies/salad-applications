#!/usr/bin/env pwsh
[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Path $PSScriptRoot -Parent
Push-Location -Path $projectRoot
try {
    . (Join-Path -Path $projectRoot -ChildPath '.azure-pipelines' -AdditionalChildPath 'utilities.ps1')

    # Verify Yarn
    Write-LogSection -Content 'Verifying Yarn...'

    $yarnVersion = Get-YarnVersion
    if ($null -eq $yarnVersion) {
        Write-Error -Message 'Yarn is not installed'
    }

    Write-LogInfo -Content "Yarn ${yarnVersion} is installed"

    # Install dependencies
    Write-LogSection -Content 'Yarn build...'

    Write-LogCommand -Content 'yarn run build'
    & yarn run build
    Assert-LastExitCodeSuccess -LastExecutableName 'yarn'
}
catch {
    if (($null -ne $_.ErrorDetails) -and ($null -ne $_.ErrorDetails.Message)) {
        Write-LogError -Content $_.ErrorDetails.Message
    }
    elseif (($null -ne $_.Exception) -and ($null -ne $_.Exception.Message)) {
        Write-LogError -Content $_.Exception.Message
    }
    else {
        Write-LogError -Content $_
    }

    exit 1
}
finally {
    Pop-Location
}

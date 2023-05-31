#!/usr/bin/env pwsh
#Requires -Version 7
[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Path $PSScriptRoot -Parent
Push-Location -Path $projectRoot
try {
    . (Join-Path -Path $projectRoot -ChildPath '.azure-pipelines' -AdditionalChildPath 'utilities.ps1')

    $solutionPath = Join-Path -Path $projectRoot -ChildPath Salad.Cloud.sln

    # Build projects.
    Write-LogSection -Content 'Building projects...'
    Write-LogCommand -Content "yarn run build ${solutionPath}"
    & yarn build $solutionPath --configuration Release --no-incremental --no-restore
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

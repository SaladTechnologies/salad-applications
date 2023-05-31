#!/usr/bin/env pwsh
#Requires -Version 7
[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Path (Split-Path -Path $PSScriptRoot -Parent) -Parent
Push-Location -Path $projectRoot
try {
    . (Join-Path -Path $projectRoot -ChildPath '.azure-pipelines' -AdditionalChildPath 'utilities.ps1')

    # Build image.
    Write-LogSection -Content 'Building image...'
    $Env:DOCKER_BUILDKIT = 1
    $dockerFile = Join-Path -Path $projectRoot -ChildPath 'src\Salad.Cloud.Admin\Dockerfile'
    Write-LogCommand -Content "docker image build --file ${dockerFile} --secret id=azure_credential --tag cloud-admin:latest ."
    & docker image build --file $dockerFile --secret id=azure_credential --tag cloud-admin:latest .
    Assert-LastExitCodeSuccess -LastExecutableName 'docker'
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

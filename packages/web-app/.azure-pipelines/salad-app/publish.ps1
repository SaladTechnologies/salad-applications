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

    # Prepare tarball.
    Write-LogSection -Content 'Preparing tarball...'
    Write-LogCommand -Content 'docker image save -o saladcloud-admin.tar cloud-admin'
    & docker image save -o saladcloud-admin.tar cloud-admin
    Assert-LastExitCodeSuccess -LastExecutableName 'docker'

    Write-LogCommand -Content '7z a -tgzip saladcloud-admin.tar.gz saladcloud-admin.tar'
    & 7z a -tgzip saladcloud-admin.tar.gz saladcloud-admin.tar
    Assert-LastExitCodeSuccess -LastExecutableName '7z'

    if (Test-AzureDevOpsEnvironment) {
        # Publish to GCR
        Write-LogSection -Content 'Publishing to GCR...'

        Write-LogInfo -Content 'Passing json key file to the following command:'
        Write-LogCommand -Content 'docker login -u _json_key --password-stdin https://us.gcr.io'
        Get-Content $Env:KEY_FILE_PATH |
            & docker login -u _json_key --password-stdin https://us.gcr.io
        Assert-LastExitCodeSuccess -LastExecutableName 'docker'

        Write-LogInfo -Content 'Tagging image with commit hash.'
        Write-LogCommand -Content '$hash = git rev-parse --short HEAD'
        $shortHash = & git rev-parse --short HEAD
        Assert-LastExitCodeSuccess -LastExecutableName 'git'

        Write-LogCommand -Content "docker tag cloud-admin:latest us.gcr.io/salad-app/salad-admin-api:${shortHash}"
        & docker tag cloud-admin:latest us.gcr.io/salad-app/salad-admin-api:$shortHash
        Assert-LastExitCodeSuccess -LastExecutableName 'docker'

        Write-LogCommand -Content 'docker tag cloud-admin:latest us.gcr.io/salad-app/salad-admin-api:latest'
        & docker tag cloud-admin:latest us.gcr.io/salad-app/salad-admin-api:latest
        Assert-LastExitCodeSuccess -LastExecutableName 'docker'

        Write-LogCommand -Content 'docker push us.gcr.io/salad-app/salad-admin-api:latest'
        & docker push us.gcr.io/salad-app/salad-admin-api:latest
        Assert-LastExitCodeSuccess -LastExecutableName 'docker'

        Write-LogCommand -Content "docker push us.gcr.io/salad-app/salad-admin-api:${shortHash}"
        & docker push us.gcr.io/salad-app/salad-admin-api:$shortHash
        Assert-LastExitCodeSuccess -LastExecutableName 'docker'
    }

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

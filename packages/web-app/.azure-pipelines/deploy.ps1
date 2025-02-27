#!/usr/bin/env pwsh
[CmdletBinding()]
param(
    [Parameter(Mandatory = $True)]
    [string]$Context
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Path $PSScriptRoot -Parent
Push-Location -Path $projectRoot
try {
    . (Join-Path -Path $projectRoot -ChildPath '.azure-pipelines' -AdditionalChildPath 'utilities.ps1')

    $buildDirectory = Join-Path -Path $projectRoot -ChildPath 'build'

    # Deploy to Netlify
    Show-LogSection -Content 'Deploying to Netlify...'
    if ($Context -eq 'production') {
        Show-LogCommand -Content "netlify deploy --dir ${buildDirectory} --prod-if-unlocked"
        & netlify deploy --dir $buildDirectory --prod-if-unlocked
        Assert-LastExitCodeSuccess -LastExecutableName 'netlify'
    }
    else {
        $alias = ''
        $message = ''
        if (Test-AzureDevOpsEnvironment) {
            $shortHash = $Env:BUILD_SOURCEVERSION.Substring(0, 7)
            $message = "Deploy Preview #${Env:SYSTEM_PULLREQUEST_PULLREQUESTNUMBER}: ${Env:SYSTEM_PULLREQUEST_SOURCEBRANCH}@${shortHash}"
            $alias = "deploy-preview-${Env:SYSTEM_PULLREQUEST_PULLREQUESTNUMBER}"
        }
        else {
            $alias = 'no-alias'
            $message = 'no-message'
        }
        Show-LogCommand -Content "netlify deploy --dir ${buildDirectory} --alias ${alias} --message ${message}"
        & netlify deploy --dir $buildDirectory --alias $alias --message $message
        Assert-LastExitCodeSuccess -LastExecutableName 'netlify'
    }
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

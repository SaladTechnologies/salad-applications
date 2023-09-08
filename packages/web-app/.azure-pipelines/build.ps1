#!/usr/bin/env pwsh
#Requires -Version 7
[CmdletBinding()]
param(
    [Parameter(Mandatory = $True)]
    [string]$SiteName,
    [Parameter(Mandatory = $True)]
    [string]$Context
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Path $PSScriptRoot -Parent
Push-Location -Path $projectRoot
try {
    . (Join-Path -Path $projectRoot -ChildPath '.azure-pipelines' -AdditionalChildPath 'utilities.ps1')

    # Setting up environment variables
    Show-LogSection -Content 'Setting up environment variables...'
    Show-LogInfo -Content "Context: ${Context}"
    Show-LogInfo -Content "SiteName: ${SiteName}"
    if ($Context -eq 'production') {
        Show-LogInfo -Content 'Setting public url and mixpanel token.'
        $Env:PUBLIC_URL = '/app'
        if ($SiteName -eq 'test') {
            Show-LogInfo -Content "test env variables set"
            $Env:REACT_APP_MIXPANEL_TOKEN = '4b245bace4eed86ffdfa35efc3addf1d'
            $Env:REACT_APP_API_URL = 'https://app-api-testing.salad.com'
            $Env:REACT_APP_PAYPAL_URL = 'https://www.sandbox.paypal.com/connect/?flowEntry=static&client_id=AYjYnvjB968mKTIhMqUtLlNa8CJuF9rg_Q4m0Oym5gFvBkZEMPPoooXcG94OjSCjih7kI1_KM25EgfDs&response_type=code&scope=openid%20email%20https%3A%2F%2Furi.paypal.com%2Fservices%2Fpaypalattributes&redirect_uri=https%253A%252F%252Fapp-api-testing.salad.com%252Fapi%252Fv2%252Fpaypal-account-callback'
            $Env:REACT_APP_PROHASHING_USERNAME = 'saladtest'
            $Env:REACT_APP_SEARCH_ENGINE = 'salad-rewards-test'
            $Env:REACT_APP_SEARCH_KEY = 'search-qced4ibef8m4s7xacm9hoqyk'
            $Env:REACT_APP_STRAPI_UPLOAD_URL = 'https://cms-api-testing.salad.io'
            $Env:REACT_APP_UNLEASH_API_KEY = 'zrujLzhnwVZkIOlS74oZZ0DK7ZXs3Ifo'
            $Env:REACT_APP_UNLEASH_URL = 'https://features-testing.salad.com/proxy'
        }
        else {
            Show-LogInfo -Content "prod env variables set"
            $Env:REACT_APP_MIXPANEL_TOKEN = '68db9194f229525012624f3cf368921f'
            $Env:REACT_APP_BUILD = 'production'
        }
    }
    Show-LogInfo -Content "REACT_APP_BUILD env variable set to ${Env:COMMIT_REF}"
    $Env:REACT_APP_BUILD = 'production'
    $Env:REACT_APP_BUILD = $Env:COMMIT_REF

    # Build projects.
    Show-LogSection -Content 'Building projects...'
    Show-LogCommand -Content "yarn run build "
    & yarn run build
    Assert-LastExitCodeSuccess -LastExecutableName 'yarn'
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

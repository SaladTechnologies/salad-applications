#!/usr/bin/env pwsh
[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Path $PSScriptRoot -Parent
Push-Location -Path $projectRoot
try {
    . (Join-Path -Path $projectRoot -ChildPath '.azure-pipelines' -AdditionalChildPath 'utilities.ps1')

    $buildDirectory = Join-Path -Path $projectRoot -ChildPath 'build'
    $srcDirectory = Join-Path -Path $projectRoot -ChildPath 'src'

    # Verify Node.js and npm
    Show-LogSection -Content 'Verifying Node.js, npm, and Yarn...'

    $nodeVersion = Get-NodeVersion
    if ($null -eq $nodeVersion) {
        Write-Error -Message 'Node.js is not installed'
    }

    $nvmrcVersion = Get-NvmrcVersion
    if ($null -eq $nvmrcVersion -or 0 -ne (Compare-NodeVersion -FirstVersion $nodeVersion -SecondVersion $nvmrcVersion)) {
        Write-Error -Message "Node.js ${nvmrcVersion} is not installed (found ${nodeVersion})"
    }

    Show-LogInfo -Content "Node.js ${nodeVersion} is installed"

    $npmVersion = Get-NpmVersion
    if ($null -eq $npmVersion) {
        Write-Error -Message 'npm is not installed'
    }

    # Show-LogInfo -Content "npm ${npmVersion} is installed"

    # $yarnVersion = Get-YarnVersion
    # if ($null -eq $yarnVersion) {
    #     Write-Error -Message 'Yarn is not installed'
    # }

    # Show-LogInfo -Content "Yarn ${yarnVersion} is installed"

    # Install dependencies
    Show-LogSection -Content 'Installing dependencies...'

    Show-LogCommand -Content 'yarn install'
    & yarn install
    Assert-LastExitCodeSuccess -LastExecutableName 'yarn'

    $netlifyVersion = $null
    & npm list netlify-cli --global --depth 0 | Out-Null
    if (0 -eq $LastExitCode) {
        $netlifyVersion = Get-NetlifyVersion
    }

    if ($null -eq $netlifyVersion) {
        Show-LogCommand -Content 'npm install --global netlify-cli'
        & npm install --global netlify-cli
        Assert-LastExitCodeSuccess -LastExecutableName 'npm'

        $netlifyVersion = Get-NetlifyVersion
        if ($null -eq $netlifyVersion) {
            Write-Error -Message 'Failed to install Netlify CLI'
        }
    }

    Show-LogInfo -Content "Netlify CLI ${netlifyVersion} is installed"

    # Clean
    Show-LogSection -Content 'Cleaning...'

    if (Test-Path -Path $buildDirectory) {
        Remove-Item -Path $buildDirectory -Recurse -Force
    }

    New-Item -ItemType Directory -Path $buildDirectory | Out-Null

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

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

    # Verify Node.js and npm (setup-tools-task installs the versions in mise.toml; devEngines in package.json fails npm
    # commands run with older ones)
    Show-LogSection -Content 'Verifying Node.js and npm...'

    $nodeVersion = Get-NodeVersion
    if ($null -eq $nodeVersion) {
        Write-Error -Message 'Node.js is not installed'
    }

    Show-LogInfo -Content "Node.js ${nodeVersion} is installed"

    $npmVersion = Get-NpmVersion
    if ($null -eq $npmVersion) {
        Write-Error -Message 'npm is not installed'
    }

    Show-LogInfo -Content "npm ${npmVersion} is installed"

    # Install dependencies
    Show-LogSection -Content 'Installing dependencies...'

    Show-LogCommand -Content 'npm ci'
    & npm ci
    Assert-LastExitCodeSuccess -LastExecutableName 'npm'

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

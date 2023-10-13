#!/usr/bin/env pwsh
<#
    .SYNOPSIS
    Upgrades the various Node.js projects' dependencies.

    .DESCRIPTION
    The `node-upgrade.ps1` script upgrades the various Node.js projects' dependencies (frameworks, packages, tools, etc.).
#>
[CmdletBinding()]
param()

#Requires -Version 7
#Requires -Modules powershell-yaml
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# The Node.js LTS release to use.
$lts = 'Hydrogen'

function Sort-ProjectPath {
    [CmdletBinding()]
    [OutputType([string[]])]
    param(
        [Parameter(Mandatory = $true, ValueFromPipeline = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $InputObject
    )

    begin {
        $list = New-Object -TypeName System.Collections.Generic.List[System.String]
    }

    process {
        $list.Add("${InputObject}~")
    }

    end {
        $list.Sort([string]::CompareOrdinal)
        foreach ($item in $list) {
            $item.Remove($item.Length - 1)
        }
    }
}

$projectRoot = Split-Path -Path $PSScriptRoot -Parent
Push-Location -Path $projectRoot
try {
    # Upgrade Node.js...

    $releases = Invoke-RestMethod -Uri https://nodejs.org/download/release/index.json
    $release = @($releases) | Where-Object -Property lts -EQ -Value $lts | Sort-Object -Stable -Descending -Property date | Select-Object -First 1 -ExpandProperty version
    $release = $release.TrimStart('v')

    $install = & nvm list | Select-String -Pattern "\b${release}\b" -Raw | Select-Object -First 1
    if ([string]::IsNullOrWhiteSpace($install)) {
        & nvm install $release
        & nvm use $release
    }
    elseif (-not $install.Contains('*')) {
        & nvm use $release
    }

    Get-ChildItem -Filter .nvmrc -Recurse | Split-Path -Parent | Select-String -Pattern '.yarn', 'node_modules' -SimpleMatch -NotMatch | Sort-ProjectPath | ForEach-Object -Process {
        Push-Location -Path $_
        try {
            $release | Out-File -FilePath .\.nvmrc -Encoding utf8 -NoNewline
        }
        finally {
            Pop-Location
        }
    }

    # Upgrade npm...

    & npm install --global corepack@latest npm@latest
    & npm install --global npm-check-updates@latest sort-package-json@latest
    & corepack enable

    # Upgrade Yarn...

    Get-ChildItem -Filter .yarnrc.yml -Recurse | Split-Path -Parent | Select-String -Pattern '.yarn', 'node_modules' -SimpleMatch -NotMatch | Sort-ProjectPath | ForEach-Object -Process {
        Push-Location -Path $_
        try {
            & yarn set version latest
            $config = Get-Content -Path .\.yarnrc.yml -Encoding utf8 | ConvertFrom-Yaml
            if ($null -ne $config['plugins']) {
                @($config['plugins']) | Select-Object -ExpandProperty spec | ForEach-Object -Process {
                    & yarn plugin import $_
                }
            }
        }
        finally {
            Pop-Location
        }
    }

    # Upgrade the project dependencies...

    Get-ChildItem -Filter package.json -Recurse | Split-Path -Parent | Select-String -Pattern '.yarn', 'node_modules' -SimpleMatch -NotMatch | Sort-ProjectPath | ForEach-Object -Process {
        Push-Location -Path $_
        try {
            & npm-check-updates --target minor --upgrade
            & sort-package-json

            if (Test-Path -Path .\yarn.lock) {
                Clear-Content -Path .\yarn.lock
                & yarn install

                $package = Get-Content -Path .\package.json -Encoding utf8 | ConvertFrom-Json -AsHashtable
                if (($null -ne $package['dependencies'] -and $package['dependencies'].ContainsKey('@yarnpkg/sdks')) -or ($null -ne $package['devDependencies'] -and $package['devDependencies'].ContainsKey('@yarnpkg/sdks'))) {
                    & yarn sdks vscode
                }
            }

            if (Test-Path -Path .\package-lock.json) {
                Clear-Content -Path .\package-lock.json
                & npm install
            }
        }
        finally {
            Pop-Location
        }
    }
}
finally {
    Pop-Location
}

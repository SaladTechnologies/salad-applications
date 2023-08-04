Set-StrictMode -Version Latest

function Assert-LastExitCodeSuccess {
    [CmdletBinding()]
    [OutputType([void])]
    param(
        # The first version to compare.
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $LastExecutableName
    )

    process {
        if (0 -lt $LastExitCode) {
            Write-Error -Message "${LastExecutableName} exited with code ${LastExitCode}"
        }
    }
}

function Compare-NodeVersion {
    [CmdletBinding()]
    [OutputType([int])]
    param(
        # The first version to compare.
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $FirstVersion,

        # The second version to compare.
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $SecondVersion
    )

    process {
        $FirstVersion = [System.Management.Automation.SemanticVersion]::new($FirstVersion.TrimStart('v'))
        $SecondVersion = [System.Management.Automation.SemanticVersion]::new($SecondVersion.TrimStart('v'))
        $FirstVersion.CompareTo($SecondVersion)
    }
}

function Get-NetlifyVersion {
    [CmdletBinding()]
    [OutputType([string])]
    param()

    process {
        Get-ToolVersion -ScriptBlock { & netlify --version }
        Assert-LastExitCodeSuccess -LastExecutableName 'netlify'
    }
}

function Get-BuildContainerPath {
    [CmdletBinding()]
    [OutputType([string])]
    param(
        # The property name.
        [Parameter()]
        [ValidateNotNullOrEmpty()]
        [string]
        $Path
    )

    process {
        if ([string]::IsNullOrEmpty($Path)) {
            '/project'
        }
        else {
            $projectRoot = Split-Path -Path $PSScriptRoot -Parent
            $relativePath = [System.IO.Path]::GetRelativePath($projectRoot, $Path)
            if ($relativePath.Equals($Path)) {
                throw 'The specified path is not a child of the project.'
            }

            "/project/$($relativePath -replace '\\', '/')"
        }
    }
}

function Get-BuildContainerVolume {
    [CmdletBinding()]
    [OutputType([string])]
    param()

    process {
        $projectRoot = Split-Path -Path $PSScriptRoot -Parent
        "$($projectRoot):/project"
    }
}

function Get-JsonContent {
    [CmdletBinding()]
    [OutputType([bool])]
    param(
        # The path to the JSON file.
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $Path
    )

    process {
        Get-Content -Path $Path -Raw -Encoding utf8 | ConvertFrom-Json
    }
}

function Get-JsonTable {
    [CmdletBinding()]
    [OutputType([bool])]
    param(
        # The path to the JSON file.
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $Path
    )

    process {
        Get-Content -Path $Path -Raw -Encoding utf8 | ConvertFrom-Json -AsHashtable
    }
}

function Get-NodeVersion {
    [CmdletBinding()]
    [OutputType([string])]
    param()

    process {
        Get-ToolVersion -ScriptBlock { & node --version }
        Assert-LastExitCodeSuccess -LastExecutableName 'node'
    }
}

function Get-NpmVersion {
    [CmdletBinding()]
    [OutputType([string])]
    param()

    process {
        Get-ToolVersion -ScriptBlock { & npm --version }
        Assert-LastExitCodeSuccess -LastExecutableName 'npm'
    }
}

function Get-NvmrcVersion {
    [CmdletBinding()]
    [OutputType([string])]
    param()

    process {
        $projectRoot = Split-Path -Path $PSScriptRoot -Parent
        try {
            $version = Get-Content -Path (Join-Path -Path $projectRoot -ChildPath '.nvmrc') -Raw -Encoding utf8
            if ([string]::IsNullOrWhiteSpace($version)) {
                $version = $null
            }
            else {
                $version = $version.Trim()
                if (-not $version.StartsWith('v', [System.StringComparison]::Ordinal)) {
                    $version = "v${version}"
                }
            }
        }
        catch {
            $version = $null
        }

        $version
    }
}

function Get-ToolVersion {
    [CmdletBinding()]
    [OutputType([string])]
    param(
        # The script block used to get the tool version.
        [Parameter(Mandatory = $true)]
        [ValidateNotNull()]
        [scriptblock]
        $ScriptBlock
    )

    process {
        try {
            $version = Invoke-Command -ScriptBlock $ScriptBlock
            if ([string]::IsNullOrWhiteSpace($version)) {
                $version = $null
            }
            else {
                $version = $version.Trim()
            }
        }
        catch {
            $version = $null
        }

        $version
    }
}

function Get-WorkspacePackages {
    [CmdletBinding()]
    [OutputType([string[]])]
    param()

    process {
        $projectRoot = Split-Path -Path $PSScriptRoot -Parent
        Push-Location -Path $projectRoot
        try {
            & yarn workspaces list --verbose --json | `
                    ConvertFrom-Json | `
                    ForEach-Object -Process { Join-Path -Path $projectRoot -ChildPath $_.location -Resolve } | `
                    Where-Object -FilterScript { (Test-Path -Path (Join-Path -Path $_ -ChildPath 'buf.yaml')) -and (Test-Path -Path (Join-Path -Path $_ -ChildPath 'buf.gen.yaml')) }
            Assert-LastExitCodeSuccess -LastExecutableName 'yarn'
        }
        finally {
            Pop-Location
        }
    }
}

function Get-YarnVersion {
    [CmdletBinding()]
    [OutputType([string])]
    param()

    process {
        Get-ToolVersion -ScriptBlock { & yarn --version }
        Assert-LastExitCodeSuccess -LastExecutableName 'yarn'
    }
}

function Test-AzureDevOpsEnvironment {
    [CmdletBinding()]
    [OutputType([bool])]
    param()

    process {
        [string]::Equals($Env:TF_BUILD, 'True', [StringComparison]::OrdinalIgnoreCase)
    }
}

function Test-JsonProperty {
    [CmdletBinding()]
    [OutputType([bool])]
    param(
        # The input object created using `ConvertFrom-Json`.
        [Parameter(Mandatory = $true)]
        [ValidateNotNull()]
        [object]
        $InputObject,

        # The property name.
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $PropertyName
    )

    process {
        $null -ne $InputObject.PSObject.Properties[$PropertyName]
    }
}

function Show-LogCommand {
    [CmdletBinding()]
    [OutputType([void])]
    param(
        # The content to write.
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $Content
    )

    process {
        if (Test-AzureDevOpsEnvironment) {
            Write-Host -Object "##[command]${Content}"
        }
        else {
            Write-Host -Object $Content -ForegroundColor Cyan
        }
    }
}

function Show-LogDebug {
    [CmdletBinding()]
    [OutputType([void])]
    param(
        # The content to write.
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $Content
    )

    process {
        if (Test-AzureDevOpsEnvironment) {
            Write-Host -Object "##[debug]${Content}"
        }
        else {
            Write-Host -Object $Content -ForegroundColor Magenta
        }
    }
}

function Show-LogError {
    [CmdletBinding()]
    [OutputType([void])]
    param(
        # The content to write.
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $Content
    )

    process {
        if (Test-AzureDevOpsEnvironment) {
            Write-Host -Object "##vso[task.logissue type=error;]${Content}"
        }
        else {
            Write-Host -Object $Content -ForegroundColor Red
        }
    }
}

function Show-LogGroupBegin {
    [CmdletBinding()]
    [OutputType([void])]
    param(
        # The content to write.
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $Content
    )

    process {
        if (Test-AzureDevOpsEnvironment) {
            Write-Host -Object "##[group]${Content}"
        }
    }
}

function Show-LogGroupEnd {
    [CmdletBinding()]
    [OutputType([void])]
    param()

    process {
        if (Test-AzureDevOpsEnvironment) {
            Write-Host -Object '##[endgroup]'
        }
    }
}

function Show-LogInfo {
    [CmdletBinding()]
    [OutputType([void])]
    param(
        # The content to write.
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $Content
    )

    process {
        Write-Host -Object $Content
    }
}

function Show-LogSection {
    [CmdletBinding()]
    [OutputType([void])]
    param(
        # The content to write.
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $Content
    )

    process {
        if (Test-AzureDevOpsEnvironment) {
            Write-Host -Object "##[section]${Content}"
        }
        else {
            Write-Host -Object $Content -ForegroundColor Green
        }
    }
}

function Show-LogWarning {
    [CmdletBinding()]
    [OutputType([void])]
    param(
        # The content to write.
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [string]
        $Content
    )

    process {
        if (Test-AzureDevOpsEnvironment) {
            Write-Host -Object "##vso[task.logissue type=warning;]${Content}"
        }
        else {
            Write-Host -Object $Content -ForegroundColor Yellow
        }
    }
}

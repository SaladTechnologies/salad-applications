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

function Get-YarnVersion {
    [CmdletBinding()]
    [OutputType([string])]
    param()

    process {
        Get-ToolVersion -ScriptBlock { & yarn --version }
        Assert-LastExitCodeSuccess -LastExecutableName 'yarn'
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

function Test-AzureDevOpsEnvironment {
    [CmdletBinding()]
    [OutputType([bool])]
    param()

    process {
        [string]::Equals($Env:TF_BUILD, 'True', [StringComparison]::OrdinalIgnoreCase)
    }
}

function Write-LogCommand {
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

function Write-LogDebug {
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

function Write-LogError {
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

function Write-LogInfo {
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

function Write-LogSection {
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

function Write-LogWarning {
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

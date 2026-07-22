[CmdletBinding()]
param(
    [string]$ApplicationDirectory = "C:\momas",
    [string]$ReleaseArchive = "$env:USERPROFILE\gridflex-release.zip",
    [string]$ProductionEnvironmentFile = "$env:USERPROFILE\gridflex-production.env",
    [string]$ScheduledTaskName = "GridflexAlfuttaimFrontend",
    [int]$ApplicationPort = 3000,
    [string]$NodeVersion = "24.18.0"
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$applicationDirectory = [System.IO.Path]::GetFullPath($ApplicationDirectory).TrimEnd([System.IO.Path]::DirectorySeparatorChar)
$applicationParent = Split-Path -Parent $applicationDirectory
$applicationName = Split-Path -Leaf $applicationDirectory
$stagingDirectory = Join-Path $applicationParent "$applicationName.__staging"
$previousDirectory = Join-Path $applicationParent "$applicationName.__previous"
$failedDirectory = Join-Path $applicationParent "$applicationName.__failed"
$currentMoved = $false
$newMoved = $false
$taskExisted = $false
$taskWasRunning = $false
$taskStopped = $false
$nodePath = ""
$npmPath = ""

function Initialize-NodeRuntime {
    $runtimeRoot = Join-Path $env:ProgramData "Gridflex\runtime"
    $archiveName = "node-v$NodeVersion-win-x64.zip"
    $nodeDirectory = Join-Path $runtimeRoot "node-v$NodeVersion-win-x64"
    $nodeExecutable = Join-Path $nodeDirectory "node.exe"
    $npmExecutable = Join-Path $nodeDirectory "npm.cmd"

    if ((Test-Path -LiteralPath $nodeExecutable -PathType Leaf) -and (Test-Path -LiteralPath $npmExecutable -PathType Leaf)) {
        return [PSCustomObject]@{ NodePath = $nodeExecutable; NpmPath = $npmExecutable }
    }

    Write-Host "Installing portable Node.js $NodeVersion"
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    New-Item -ItemType Directory -Path $runtimeRoot -Force | Out-Null

    if (Test-Path -LiteralPath $nodeDirectory) {
        Remove-Item -LiteralPath $nodeDirectory -Recurse -Force
    }

    $archivePath = Join-Path $env:TEMP $archiveName
    $downloadRoot = "https://nodejs.org/dist/v$NodeVersion"

    try {
        Invoke-WebRequest -Uri "$downloadRoot/$archiveName" -OutFile $archivePath -UseBasicParsing
        $checksums = (Invoke-WebRequest -Uri "$downloadRoot/SHASUMS256.txt" -UseBasicParsing).Content
        $checksumPattern = '(?m)^([a-f0-9]{64})\s+{0}\r?$' -f [regex]::Escape($archiveName)
        $checksumMatch = [regex]::Match($checksums, $checksumPattern)
        if (-not $checksumMatch.Success) {
            throw "Could not find the official SHA-256 checksum for $archiveName."
        }

        $expectedChecksum = $checksumMatch.Groups[1].Value.ToUpperInvariant()
        $actualChecksum = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash.ToUpperInvariant()
        if ($actualChecksum -ne $expectedChecksum) {
            throw "The downloaded Node.js archive failed SHA-256 verification."
        }

        Expand-Archive -LiteralPath $archivePath -DestinationPath $runtimeRoot -Force
    }
    finally {
        Remove-Item -LiteralPath $archivePath -Force -ErrorAction SilentlyContinue
    }

    if (-not (Test-Path -LiteralPath $nodeExecutable -PathType Leaf) -or -not (Test-Path -LiteralPath $npmExecutable -PathType Leaf)) {
        throw "Node.js installation did not produce the expected executables in $nodeDirectory."
    }

    return [PSCustomObject]@{ NodePath = $nodeExecutable; NpmPath = $npmExecutable }
}

function Stop-GridflexTask {
    $task = Get-ScheduledTask -TaskName $ScheduledTaskName -ErrorAction SilentlyContinue
    if (-not $task -or $task.State -ne "Running") {
        return
    }

    $runnerPidFile = Join-Path $applicationDirectory "logs\runner.pid"
    if (Test-Path -LiteralPath $runnerPidFile -PathType Leaf) {
        $runnerPid = [int](Get-Content -LiteralPath $runnerPidFile -Raw)
        & taskkill.exe /PID $runnerPid /T /F 2>$null
    }

    Stop-ScheduledTask -TaskName $ScheduledTaskName
    $deadline = (Get-Date).AddSeconds(30)
    do {
        Start-Sleep -Milliseconds 500
        $task = Get-ScheduledTask -TaskName $ScheduledTaskName -ErrorAction SilentlyContinue
    } while ($task -and $task.State -eq "Running" -and (Get-Date) -lt $deadline)

    if ($task -and $task.State -eq "Running") {
        throw "Scheduled task $ScheduledTaskName did not stop within 30 seconds."
    }
}

function Register-GridflexTask {
    $runnerScript = Join-Path $applicationDirectory "scripts\start-gridflex.ps1"
    $powerShellPath = (Get-Command powershell.exe -ErrorAction Stop).Source
    $arguments = "-NoLogo -NoProfile -NonInteractive -ExecutionPolicy Bypass -File `"$runnerScript`" -ApplicationDirectory `"$applicationDirectory`" -NpmPath `"$npmPath`" -Port $ApplicationPort"
    $action = New-ScheduledTaskAction -Execute $powerShellPath -Argument $arguments -WorkingDirectory $applicationDirectory
    $trigger = New-ScheduledTaskTrigger -AtStartup
    $principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
    $settings = New-ScheduledTaskSettingsSet `
        -StartWhenAvailable `
        -RestartCount 999 `
        -RestartInterval (New-TimeSpan -Minutes 1) `
        -ExecutionTimeLimit ([TimeSpan]::Zero)

    Register-ScheduledTask `
        -TaskName $ScheduledTaskName `
        -Action $action `
        -Trigger $trigger `
        -Principal $principal `
        -Settings $settings `
        -Force | Out-Null
}

function Wait-ForGridflex {
    $healthUrl = "http://127.0.0.1:$ApplicationPort/login"
    $deadline = (Get-Date).AddSeconds(90)

    do {
        Start-Sleep -Seconds 2
        try {
            $response = Invoke-WebRequest -Uri $healthUrl -UseBasicParsing -TimeoutSec 5
            if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400) {
                Write-Host "Frontend health check passed at $healthUrl"
                return
            }
        }
        catch {
            Write-Host "Waiting for frontend at $healthUrl"
        }
    } while ((Get-Date) -lt $deadline)

    $task = Get-ScheduledTask -TaskName $ScheduledTaskName -ErrorAction SilentlyContinue
    $taskState = if ($task) { $task.State } else { "Missing" }
    throw "Frontend did not become healthy within 90 seconds. Scheduled task state: $taskState."
}

function Invoke-Npm {
    param([Parameter(Mandatory = $true)][string[]]$Arguments)

    & $npmPath @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "npm $($Arguments -join ' ') failed with exit code $LASTEXITCODE."
    }
}

try {
    if (-not (Test-Path -LiteralPath $ReleaseArchive -PathType Leaf)) {
        throw "Release archive was not found at $ReleaseArchive."
    }

    if (-not (Test-Path -LiteralPath $ProductionEnvironmentFile -PathType Leaf)) {
        throw "Production environment file was not found at $ProductionEnvironmentFile."
    }

    $windowsIdentity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $windowsPrincipal = [Security.Principal.WindowsPrincipal]::new($windowsIdentity)
    if (-not $windowsPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
        throw "The SSH deployment account must run with Administrator rights to create the startup task."
    }

    $nodeRuntime = Initialize-NodeRuntime
    $nodePath = $nodeRuntime.NodePath
    $npmPath = $nodeRuntime.NpmPath
    $env:PATH = "$(Split-Path -Parent $nodePath);$env:PATH"
    Write-Host "Using $(& $nodePath --version) from $nodePath"
    $existingTask = Get-ScheduledTask -TaskName $ScheduledTaskName -ErrorAction SilentlyContinue
    $taskExisted = $null -ne $existingTask
    $taskWasRunning = $taskExisted -and $existingTask.State -eq "Running"
    New-Item -ItemType Directory -Path $applicationParent -Force | Out-Null

    foreach ($path in @($stagingDirectory, $failedDirectory)) {
        if (Test-Path -LiteralPath $path) {
            Remove-Item -LiteralPath $path -Recurse -Force
        }
    }

    Write-Host "Expanding release into $stagingDirectory"
    Expand-Archive -LiteralPath $ReleaseArchive -DestinationPath $stagingDirectory -Force

    # Environment files live only on the server and must survive each release.
    if (Test-Path -LiteralPath $applicationDirectory -PathType Container) {
        Get-ChildItem -LiteralPath $applicationDirectory -Filter ".env*" -File |
            Copy-Item -Destination $stagingDirectory -Force
    }
    Copy-Item -LiteralPath $ProductionEnvironmentFile -Destination (Join-Path $stagingDirectory ".env.production.local") -Force

    Push-Location $stagingDirectory
    try {
        $env:NODE_ENV = "production"
        Write-Host "Installing locked dependencies"
        Invoke-Npm -Arguments @("ci", "--include=dev", "--no-audit", "--no-fund")

        Write-Host "Building the Next.js application"
        Invoke-Npm -Arguments @("run", "build")

        Write-Host "Removing development-only dependencies"
        Invoke-Npm -Arguments @("prune", "--omit=dev", "--no-audit", "--no-fund")
    }
    finally {
        Pop-Location
    }

    if ($taskWasRunning) {
        Write-Host "Stopping scheduled task $ScheduledTaskName"
        Stop-GridflexTask
        $taskStopped = $true
    }

    if (Test-Path -LiteralPath $previousDirectory) {
        Remove-Item -LiteralPath $previousDirectory -Recurse -Force
    }

    if (Test-Path -LiteralPath $applicationDirectory) {
        Move-Item -LiteralPath $applicationDirectory -Destination $previousDirectory
        $currentMoved = $true
    }

    Move-Item -LiteralPath $stagingDirectory -Destination $applicationDirectory
    $newMoved = $true

    Write-Host "Registering startup task $ScheduledTaskName"
    Register-GridflexTask
    Start-ScheduledTask -TaskName $ScheduledTaskName
    Wait-ForGridflex

    Write-Host "Deployment completed successfully at $applicationDirectory"
}
catch {
    [Console]::Error.WriteLine("Deployment failed: $($_.Exception.Message)")

    if ($taskStopped -or $newMoved) {
        try {
            Stop-GridflexTask
        }
        catch {
            [Console]::Error.WriteLine("Could not stop the failed frontend task: $($_.Exception.Message)")
        }
    }

    if ($newMoved -and (Test-Path -LiteralPath $applicationDirectory)) {
        Move-Item -LiteralPath $applicationDirectory -Destination $failedDirectory -ErrorAction SilentlyContinue
    }

    if ($currentMoved -and (Test-Path -LiteralPath $previousDirectory) -and -not (Test-Path -LiteralPath $applicationDirectory)) {
        Move-Item -LiteralPath $previousDirectory -Destination $applicationDirectory -ErrorAction SilentlyContinue
    }

    if (-not $taskExisted) {
        Unregister-ScheduledTask -TaskName $ScheduledTaskName -Confirm:$false -ErrorAction SilentlyContinue
    }
    elseif ($taskWasRunning -and (Test-Path -LiteralPath $applicationDirectory)) {
        Register-GridflexTask
        Start-ScheduledTask -TaskName $ScheduledTaskName -ErrorAction SilentlyContinue
    }

    throw
}
finally {
    Remove-Item -LiteralPath $ReleaseArchive -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $ProductionEnvironmentFile -Force -ErrorAction SilentlyContinue
}

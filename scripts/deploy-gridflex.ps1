[CmdletBinding()]
param(
    [string]$ApplicationRoot = "C:\momas",
    [string]$ApplicationDirectory = "C:\momas\gridflex-frontend",
    [string]$ReleaseArchive = "$env:USERPROFILE\gridflex-release.zip",
    [string]$ReleaseChecksumFile = "$env:USERPROFILE\gridflex-release.zip.sha256",
    [string]$NodeArchive = "$env:USERPROFILE\node-v24.18.0-win-x64.zip",
    [string]$NodeChecksumFile = "$env:USERPROFILE\node-v24.18.0-win-x64.zip.sha256",
    [string]$ServiceWrapperSource = "$env:USERPROFILE\GridflexAlfuttaimFrontend.exe",
    [string]$ServiceWrapperChecksumFile = "$env:USERPROFILE\GridflexAlfuttaimFrontend.exe.sha256",
    [string]$ServiceName = "GridflexAlfuttaimFrontend",
    [int]$ApplicationPort = 3000,
    [string]$NodeVersion = "24.18.0"
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$applicationRoot = [IO.Path]::GetFullPath($ApplicationRoot).TrimEnd([IO.Path]::DirectorySeparatorChar)
$applicationDirectory = [IO.Path]::GetFullPath($ApplicationDirectory).TrimEnd([IO.Path]::DirectorySeparatorChar)
$applicationParent = Split-Path -Parent $applicationDirectory
$applicationName = Split-Path -Leaf $applicationDirectory
$stagingDirectory = Join-Path $applicationParent "$applicationName.__staging"
$previousDirectory = Join-Path $applicationParent "$applicationName.__previous"
$failedDirectory = Join-Path $applicationParent "$applicationName.__failed"
$runtimeRoot = Join-Path $env:ProgramData "Gridflex\runtime"
$nodeDirectory = Join-Path $runtimeRoot "node-v$NodeVersion-win-x64"
$nodePath = Join-Path $nodeDirectory "node.exe"
$serviceRoot = Join-Path $env:ProgramData "Gridflex\service"
$serviceLogDirectory = Join-Path $env:ProgramData "Gridflex\logs"
$serviceWrapperPath = Join-Path $serviceRoot "$ServiceName.exe"
$serviceConfigPath = Join-Path $serviceRoot "$ServiceName.xml"
$currentMoved = $false
$newMoved = $false
$serviceExisted = $false
$serviceWasRunning = $false
$serviceInstalled = $false
$serviceTouched = $false

function Assert-FileChecksum {
    param(
        [Parameter(Mandatory = $true)][string]$FilePath,
        [Parameter(Mandatory = $true)][string]$ChecksumPath
    )

    if (-not (Test-Path -LiteralPath $FilePath -PathType Leaf)) {
        throw "Required file was not found: $FilePath"
    }
    if (-not (Test-Path -LiteralPath $ChecksumPath -PathType Leaf)) {
        throw "Checksum file was not found: $ChecksumPath"
    }

    $expected = ([string](Get-Content -LiteralPath $ChecksumPath -Raw)).Trim().ToUpperInvariant()
    if ($expected -notmatch '^[A-F0-9]{64}$') {
        throw "Checksum file does not contain a valid SHA-256 value: $ChecksumPath"
    }

    $actual = (Get-FileHash -LiteralPath $FilePath -Algorithm SHA256).Hash.ToUpperInvariant()
    if ($actual -ne $expected) {
        throw "SHA-256 verification failed for $FilePath."
    }
}

function Invoke-Wrapper {
    param([Parameter(Mandatory = $true)][string[]]$Arguments)

    & $serviceWrapperPath @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "$ServiceName.exe $($Arguments -join ' ') failed with exit code $LASTEXITCODE."
    }
}

function Stop-FrontendService {
    $service = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
    if (-not $service -or $service.Status -eq [ServiceProcess.ServiceControllerStatus]::Stopped) {
        return
    }

    Stop-Service -Name $ServiceName -Force
    $service.WaitForStatus([ServiceProcess.ServiceControllerStatus]::Stopped, [TimeSpan]::FromSeconds(45))
}

function Write-DeploymentDiagnostics {
    Write-Host "--- Gridflex deployment diagnostics ---"
    $service = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
    if ($service) {
        Write-Host "Service $ServiceName state: $($service.Status)"
    }
    else {
        Write-Host "Service $ServiceName is not installed."
    }

    if (Get-Command Get-NetTCPConnection -ErrorAction SilentlyContinue) {
        $listeners = @(Get-NetTCPConnection -State Listen -LocalPort $ApplicationPort -ErrorAction SilentlyContinue)
        if ($listeners.Count -eq 0) {
            Write-Host "No process is listening on port $ApplicationPort."
        }
        foreach ($listener in $listeners) {
            $process = Get-Process -Id $listener.OwningProcess -ErrorAction SilentlyContinue
            $processName = if ($process) { $process.ProcessName } else { "unknown" }
            Write-Host "Port $ApplicationPort listener: PID $($listener.OwningProcess) ($processName)"
        }
    }

    if (Test-Path -LiteralPath $serviceLogDirectory -PathType Container) {
        $logFiles = Get-ChildItem -LiteralPath $serviceLogDirectory -File -ErrorAction SilentlyContinue |
            Where-Object { $_.Name -like "$ServiceName*.log" } |
            Sort-Object LastWriteTime -Descending |
            Select-Object -First 3
        foreach ($logFile in $logFiles) {
            Write-Host "--- Last 60 lines of $($logFile.FullName) ---"
            Get-Content -LiteralPath $logFile.FullName -Tail 60 -ErrorAction SilentlyContinue
        }
    }
}

function Wait-ForFrontend {
    $healthUrl = "http://127.0.0.1:$ApplicationPort/login"
    $deadline = (Get-Date).AddSeconds(90)

    do {
        Start-Sleep -Seconds 2
        $service = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
        if (-not $service -or $service.Status -eq [ServiceProcess.ServiceControllerStatus]::Stopped) {
            throw "Frontend service stopped before it became healthy. Check logs in $serviceLogDirectory."
        }
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

    $service = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
    $serviceState = if ($service) { $service.Status } else { "Missing" }
    throw "Frontend did not become healthy within 90 seconds. Service state: $serviceState."
}

try {
    if (-not $applicationParent.Equals($applicationRoot, [StringComparison]::OrdinalIgnoreCase)) {
        throw "The frontend must be deployed to a dedicated child directory of $applicationRoot. Received: $applicationDirectory"
    }
    if (-not (Test-Path -LiteralPath $applicationRoot -PathType Container)) {
        throw "The shared application root does not exist or is inaccessible: $applicationRoot"
    }

    $requiredFiles = @(
        $ReleaseArchive,
        $ReleaseChecksumFile,
        $NodeArchive,
        $NodeChecksumFile,
        $ServiceWrapperSource,
        $ServiceWrapperChecksumFile
    )
    foreach ($requiredFile in $requiredFiles) {
        if (-not (Test-Path -LiteralPath $requiredFile -PathType Leaf)) {
            throw "Required deployment file was not found: $requiredFile"
        }
    }

    $windowsIdentity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $windowsPrincipal = [Security.Principal.WindowsPrincipal]::new($windowsIdentity)
    if (-not $windowsPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
        throw "The SSH deployment account must run with Administrator rights to manage the frontend service."
    }

    Assert-FileChecksum -FilePath $ReleaseArchive -ChecksumPath $ReleaseChecksumFile
    Assert-FileChecksum -FilePath $NodeArchive -ChecksumPath $NodeChecksumFile
    Assert-FileChecksum -FilePath $ServiceWrapperSource -ChecksumPath $ServiceWrapperChecksumFile

    foreach ($directory in @($runtimeRoot, $serviceRoot, $serviceLogDirectory)) {
        New-Item -ItemType Directory -Path $directory -Force | Out-Null
    }

    if (-not (Test-Path -LiteralPath $nodePath -PathType Leaf)) {
        Write-Host "Installing uploaded portable Node.js $NodeVersion"
        if (Test-Path -LiteralPath $nodeDirectory) {
            Remove-Item -LiteralPath $nodeDirectory -Recurse -Force
        }
        Expand-Archive -LiteralPath $NodeArchive -DestinationPath $runtimeRoot -Force
    }
    if (-not (Test-Path -LiteralPath $nodePath -PathType Leaf)) {
        throw "Node.js installation did not produce $nodePath."
    }

    $installedNodeVersion = ([string](& $nodePath --version)).Trim()
    if ($LASTEXITCODE -ne 0 -or $installedNodeVersion -ne "v$NodeVersion") {
        throw "Expected Node.js v$NodeVersion at $nodePath, but found '$installedNodeVersion'."
    }
    Write-Host "Using $installedNodeVersion from $nodePath"

    if (-not (Test-Path -LiteralPath $applicationDirectory) -and (Test-Path -LiteralPath $previousDirectory -PathType Container)) {
        Write-Host "Recovering the previous release before starting a new deployment."
        Move-Item -LiteralPath $previousDirectory -Destination $applicationDirectory
    }

    foreach ($path in @($stagingDirectory, $failedDirectory)) {
        if (Test-Path -LiteralPath $path) {
            Remove-Item -LiteralPath $path -Recurse -Force
        }
    }

    Write-Host "Expanding prepared release into $stagingDirectory"
    Expand-Archive -LiteralPath $ReleaseArchive -DestinationPath $stagingDirectory -Force
    if (-not (Test-Path -LiteralPath (Join-Path $stagingDirectory "server.js") -PathType Leaf)) {
        throw "Prepared release does not contain server.js."
    }
    if (-not (Test-Path -LiteralPath (Join-Path $stagingDirectory ".next\static") -PathType Container)) {
        throw "Prepared release does not contain .next\static."
    }

    $service = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
    $serviceExisted = $null -ne $service
    $serviceWasRunning = $serviceExisted -and $service.Status -eq [ServiceProcess.ServiceControllerStatus]::Running
    if ($serviceExisted -and $service.Status -ne [ServiceProcess.ServiceControllerStatus]::Stopped) {
        Write-Host "Stopping Windows service $ServiceName"
        $serviceTouched = $true
        Stop-FrontendService
    }

    Copy-Item -LiteralPath $ServiceWrapperSource -Destination $serviceWrapperPath -Force

    if (Test-Path -LiteralPath $previousDirectory) {
        Remove-Item -LiteralPath $previousDirectory -Recurse -Force
    }
    if (Test-Path -LiteralPath $applicationDirectory) {
        Move-Item -LiteralPath $applicationDirectory -Destination $previousDirectory
        $currentMoved = $true
    }
    Move-Item -LiteralPath $stagingDirectory -Destination $applicationDirectory
    $newMoved = $true

    $serviceConfig = @"
<service>
  <id>$ServiceName</id>
  <name>Gridflex Alfuttaim Frontend</name>
  <description>Gridflex Alfuttaim Next.js frontend</description>
  <executable>$nodePath</executable>
  <arguments>server.js</arguments>
  <workingdirectory>$applicationDirectory</workingdirectory>
  <env name="NODE_ENV" value="production" />
  <env name="PORT" value="$ApplicationPort" />
  <env name="HOSTNAME" value="0.0.0.0" />
  <startmode>Automatic</startmode>
  <stoptimeout>30 sec</stoptimeout>
  <onfailure action="restart" delay="10 sec" />
  <onfailure action="restart" delay="30 sec" />
  <resetfailure>1 hour</resetfailure>
  <logpath>$serviceLogDirectory</logpath>
  <log mode="roll-by-size">
    <sizeThreshold>10240</sizeThreshold>
    <keepFiles>8</keepFiles>
  </log>
</service>
"@
    [IO.File]::WriteAllText($serviceConfigPath, $serviceConfig, [Text.UTF8Encoding]::new($false))

    if (-not $serviceExisted) {
        Write-Host "Installing Windows service $ServiceName with WinSW"
        $serviceTouched = $true
        Invoke-Wrapper -Arguments @("install")
        $serviceInstalled = $true
    }

    $serviceTouched = $true
    Start-Service -Name $ServiceName
    (Get-Service -Name $ServiceName).WaitForStatus([ServiceProcess.ServiceControllerStatus]::Running, [TimeSpan]::FromSeconds(45))
    Wait-ForFrontend
    Write-Host "Deployment completed successfully at $applicationDirectory"
}
catch {
    $deploymentError = $_
    [Console]::Error.WriteLine("Deployment failed: $($deploymentError.Exception.Message)")
    try {
        Write-DeploymentDiagnostics
    }
    catch {
        [Console]::Error.WriteLine("Could not collect deployment diagnostics: $($_.Exception.Message)")
    }

    if ($serviceTouched) {
        try {
            Stop-FrontendService
        }
        catch {
            [Console]::Error.WriteLine("Could not stop the failed frontend service: $($_.Exception.Message)")
        }
    }

    $newServiceExists = $null -ne (Get-Service -Name $ServiceName -ErrorAction SilentlyContinue)
    if (-not $serviceExisted -and ($serviceInstalled -or $newServiceExists)) {
        try {
            Invoke-Wrapper -Arguments @("uninstall")
        }
        catch {
            [Console]::Error.WriteLine("Could not uninstall the failed frontend service: $($_.Exception.Message)")
        }
    }

    if ($newMoved -and (Test-Path -LiteralPath $applicationDirectory)) {
        try {
            if (Test-Path -LiteralPath $failedDirectory) {
                Remove-Item -LiteralPath $failedDirectory -Recurse -Force
            }
            Move-Item -LiteralPath $applicationDirectory -Destination $failedDirectory
        }
        catch {
            [Console]::Error.WriteLine("Could not preserve the failed release: $($_.Exception.Message)")
        }
    }

    if ($currentMoved -and (Test-Path -LiteralPath $previousDirectory) -and -not (Test-Path -LiteralPath $applicationDirectory)) {
        try {
            Move-Item -LiteralPath $previousDirectory -Destination $applicationDirectory
        }
        catch {
            [Console]::Error.WriteLine("Could not restore the previous release: $($_.Exception.Message)")
        }
    }

    if ($serviceExisted -and $serviceWasRunning -and (Test-Path -LiteralPath $applicationDirectory)) {
        try {
            Start-Service -Name $ServiceName
            (Get-Service -Name $ServiceName).WaitForStatus([ServiceProcess.ServiceControllerStatus]::Running, [TimeSpan]::FromSeconds(45))
            Write-Host "Previous frontend release was restored and restarted."
        }
        catch {
            [Console]::Error.WriteLine("Could not restart the previous frontend service: $($_.Exception.Message)")
        }
    }

    throw $deploymentError
}

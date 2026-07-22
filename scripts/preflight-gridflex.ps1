[CmdletBinding()]
param(
    [string]$ApplicationRoot = "C:\momas",
    [string]$ApplicationDirectory = "C:\momas\gridflex-frontend",
    [string]$ServiceName = "GridflexAlfuttaimFrontend",
    [int]$ApplicationPort = 3000,
    [long]$MinimumFreeBytes = 2GB
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

function Assert-DirectoryWritable {
    param([Parameter(Mandatory = $true)][string]$Directory)

    $probeDirectory = Join-Path $Directory ".gridflex-preflight-$([Guid]::NewGuid().ToString('N'))"
    try {
        New-Item -ItemType Directory -Path $probeDirectory | Out-Null
        [IO.File]::WriteAllText(
            (Join-Path $probeDirectory "write-test.txt"),
            "Gridflex deployment write test",
            [Text.UTF8Encoding]::new($false)
        )
    }
    finally {
        if (Test-Path -LiteralPath $probeDirectory) {
            Remove-Item -LiteralPath $probeDirectory -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
}

$applicationRoot = [IO.Path]::GetFullPath($ApplicationRoot).TrimEnd([IO.Path]::DirectorySeparatorChar)
$applicationDirectory = [IO.Path]::GetFullPath($ApplicationDirectory).TrimEnd([IO.Path]::DirectorySeparatorChar)
$applicationParent = Split-Path -Parent $applicationDirectory
$serviceRoot = Join-Path $env:ProgramData "Gridflex\service"
$expectedWrapperPath = Join-Path $serviceRoot "$ServiceName.exe"

if (-not $applicationRoot -or -not $applicationDirectory) {
    throw "Application paths must not be empty."
}
if (-not $applicationParent.Equals($applicationRoot, [StringComparison]::OrdinalIgnoreCase)) {
    throw "The frontend must be deployed to a dedicated child directory of $applicationRoot. Received: $applicationDirectory"
}
if (-not [Environment]::Is64BitOperatingSystem) {
    throw "The deployment requires 64-bit Windows."
}

$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = [Security.Principal.WindowsPrincipal]::new($identity)
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    throw "The SSH deployment account must run with Administrator rights. Current identity: $($identity.Name)"
}

if (-not (Test-Path -LiteralPath $applicationRoot -PathType Container)) {
    throw "The shared application root does not exist or is inaccessible: $applicationRoot"
}

Write-Host "Checking write access without modifying existing applications under $applicationRoot"
Assert-DirectoryWritable -Directory $applicationRoot

$gridflexDataRoot = Join-Path $env:ProgramData "Gridflex"
New-Item -ItemType Directory -Path $gridflexDataRoot -Force | Out-Null
Assert-DirectoryWritable -Directory $gridflexDataRoot

$applicationDriveRoot = [IO.Path]::GetPathRoot($applicationRoot)
$driveName = $applicationDriveRoot.TrimEnd([IO.Path]::DirectorySeparatorChar).TrimEnd(':')
$drive = Get-PSDrive -Name $driveName -PSProvider FileSystem
if ($drive.Free -lt $MinimumFreeBytes) {
    throw "Insufficient free space on $applicationDriveRoot. Required: $MinimumFreeBytes bytes; available: $($drive.Free) bytes."
}

$service = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
if ($service) {
    $serviceRecord = Get-CimInstance Win32_Service -Filter "Name='$ServiceName'"
    if ($serviceRecord.PathName -and -not $serviceRecord.PathName.Trim('"').StartsWith($expectedWrapperPath, [StringComparison]::OrdinalIgnoreCase)) {
        throw "Service name collision: $ServiceName already points to $($serviceRecord.PathName), not $expectedWrapperPath."
    }
    Write-Host "Existing frontend service: $ServiceName ($($service.Status))"
}

$listeners = @()
if (Get-Command Get-NetTCPConnection -ErrorAction SilentlyContinue) {
    $listeners = @(Get-NetTCPConnection -State Listen -LocalPort $ApplicationPort -ErrorAction SilentlyContinue)
}
if ($listeners.Count -gt 0 -and -not $service) {
    $processIds = ($listeners | Select-Object -ExpandProperty OwningProcess -Unique) -join ", "
    throw "Port $ApplicationPort is already in use by process ID(s) $processIds, but service $ServiceName is not installed."
}
if ($listeners.Count -gt 0) {
    Write-Host "Port $ApplicationPort currently has $($listeners.Count) listener(s); the existing service will be stopped before activation."
}

Write-Host "Windows deployment preflight passed."
Write-Host "Identity: $($identity.Name)"
Write-Host "Application root: $applicationRoot"
Write-Host "Frontend directory: $applicationDirectory"
Write-Host "Free space: $([Math]::Round($drive.Free / 1GB, 2)) GB"
Write-Host "Service name: $ServiceName"
Write-Host "Frontend port: $ApplicationPort"

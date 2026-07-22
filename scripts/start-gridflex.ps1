[CmdletBinding()]
param(
    [string]$ApplicationDirectory = "C:\momas",
    [string]$NpmPath = "npm.cmd",
    [int]$Port = 3000
)

$ErrorActionPreference = "Stop"
$applicationDirectory = [System.IO.Path]::GetFullPath($ApplicationDirectory)
$logDirectory = Join-Path $applicationDirectory "logs"
$logFile = Join-Path $logDirectory "application.log"
$previousLogFile = Join-Path $logDirectory "application.previous.log"
$runnerPidFile = Join-Path $logDirectory "runner.pid"

New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null

if ((Test-Path -LiteralPath $logFile) -and (Get-Item -LiteralPath $logFile).Length -gt 10MB) {
    Move-Item -LiteralPath $logFile -Destination $previousLogFile -Force
}

Set-Location $applicationDirectory
$env:NODE_ENV = "production"
$env:PORT = [string]$Port

try {
    [string]$PID | Set-Content -LiteralPath $runnerPidFile -NoNewline
    "[$(Get-Date -Format o)] Starting Gridflex frontend on port $Port" | Out-File -LiteralPath $logFile -Append
    & $NpmPath run start -- --port $Port *>> $logFile
    exit $LASTEXITCODE
}
finally {
    Remove-Item -LiteralPath $runnerPidFile -Force -ErrorAction SilentlyContinue
}

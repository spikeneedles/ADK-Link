$ErrorActionPreference = "Stop"

Write-Host "Checking Node.js and npm..."
$node = Get-Command node -ErrorAction SilentlyContinue
$npm = Get-Command npm -ErrorAction SilentlyContinue

if (-not $node -or -not $npm) {
    Write-Host "Node.js or npm not found."
    Write-Host "Install Node.js from: https://nodejs.org/"
    Pause
    exit 1
}

$nodeVersion = & node -v
$npmVersion = & npm -v

Write-Host "node: $nodeVersion"
Write-Host "npm : $npmVersion"
Write-Host "OK"
Pause

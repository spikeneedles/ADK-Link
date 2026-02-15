$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $projectRoot

Write-Host "Running typecheck..."
& npm run typecheck

Write-Host "Done."
Pause

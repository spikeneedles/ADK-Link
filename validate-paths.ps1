# ADK Link - Dynamic Path Validator
# Runs on startup to ensure all paths are correctly configured

# Get the actual location of ADK Link
$adkLinkPath = $PSScriptRoot
$vbsPath = Join-Path $adkLinkPath "launch_silent.vbs"
$batPath = Join-Path $adkLinkPath "launch_app.bat"
$ps1Path = Join-Path $adkLinkPath "launch_app.ps1"

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ADK Link - Path Validation & Auto-Configuration" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Display detected paths
Write-Host "✓ ADK Link detected at:" -ForegroundColor Green
Write-Host "  $adkLinkPath" -ForegroundColor White
Write-Host ""

# Validate required files
$requiredFiles = @(
    @{ Path = $vbsPath; Name = "launch_silent.vbs" },
    @{ Path = $batPath; Name = "launch_app.bat" },
    @{ Path = $ps1Path; Name = "launch_app.ps1" },
    @{ Path = (Join-Path $adkLinkPath "package.json"); Name = "package.json" }
)

$allValid = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file.Path) {
        Write-Host "  ✓ $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $($file.Name) - NOT FOUND" -ForegroundColor Red
        $allValid = $false
    }
}

Write-Host ""

if (-not $allValid) {
    Write-Host "❌ Some required files are missing!" -ForegroundColor Red
    Write-Host "   Please ensure ADK Link is complete before launching." -ForegroundColor Yellow
    exit 1
}

# Check if desktop shortcut exists and has correct path
$desktopPath = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktopPath "ADK Link.lnk"

if (Test-Path $shortcutPath) {
    $WshShell = New-Object -ComObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut($shortcutPath)
    $currentTarget = $Shortcut.Arguments
    
    if ($currentTarget -notlike "*$vbsPath*") {
        Write-Host "⚠️  Desktop shortcut points to wrong location!" -ForegroundColor Yellow
        Write-Host "   Current: $currentTarget" -ForegroundColor Gray
        Write-Host "   Expected: $vbsPath" -ForegroundColor Gray
        Write-Host ""
        Write-Host "   Would you like to update it now? (Y/N): " -NoNewline -ForegroundColor Cyan
        $response = Read-Host
        
        if ($response -eq 'Y' -or $response -eq 'y') {
            $Shortcut.Arguments = "`"$vbsPath`""
            $Shortcut.WorkingDirectory = $adkLinkPath
            $Shortcut.Save()
            Write-Host "   ✓ Shortcut updated successfully!" -ForegroundColor Green
        }
    } else {
        Write-Host "✓ Desktop shortcut is correctly configured" -ForegroundColor Green
    }
} else {
    Write-Host "ℹ️  No desktop shortcut found" -ForegroundColor Yellow
    Write-Host "   Run create-shortcut.ps1 to create one" -ForegroundColor Gray
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Path validation complete!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

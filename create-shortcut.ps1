# Create corrected desktop shortcut for ADK Link (Dynamic Path Detection)
# This script automatically detects the current location of ADK Link

# Get the script's directory (where ADK Link actually is)
$scriptPath = $PSScriptRoot
$vbsPath = Join-Path $scriptPath "launch_silent.vbs"

# Desktop shortcut path
$desktopPath = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktopPath "ADK Link.lnk"

# Verify the VBS file exists
if (-not (Test-Path $vbsPath)) {
    Write-Host "❌ Error: launch_silent.vbs not found at: $vbsPath" -ForegroundColor Red
    Write-Host "   Make sure this script is in the ADK Link directory!" -ForegroundColor Yellow
    exit 1
}

# Create the shortcut
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut($shortcutPath)
$Shortcut.TargetPath = "C:\WINDOWS\system32\wscript.exe"
$Shortcut.Arguments = "`"$vbsPath`""
$Shortcut.WorkingDirectory = $scriptPath
$Shortcut.Description = "ADK Link - AI Developer Toolkit"
$Shortcut.IconLocation = "C:\WINDOWS\system32\imageres.dll,98"
$Shortcut.Save()

Write-Host "✓ Desktop shortcut created successfully!" -ForegroundColor Green
Write-Host "  Location: $shortcutPath" -ForegroundColor Cyan
Write-Host "  Detected ADK Link at: $scriptPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "Double-click the shortcut to launch ADK Link!" -ForegroundColor Yellow

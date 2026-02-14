@echo off
REM ═══════════════════════════════════════════════════════════════
REM   ADK Link - Portable Launcher
REM   Drag this file to your desktop or anywhere else!
REM   Double-click to launch ADK Link
REM ═══════════════════════════════════════════════════════════════

REM Get the directory where this batch file is located
set "ADK_ROOT=%~dp0"

REM Change to ADK Link directory
cd /d "%ADK_ROOT%"

REM Check if required files exist
if not exist "launch_app.ps1" (
    echo ERROR: Cannot find launch_app.ps1
    echo Make sure this launcher is in the ADK Link folder!
    pause
    exit /b 1
)

REM Launch ADK Link (this will start server and open browser)
echo Starting ADK Link...
powershell -ExecutionPolicy Bypass -File ".\launch_app.ps1"

exit

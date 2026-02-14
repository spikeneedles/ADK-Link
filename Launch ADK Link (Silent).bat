@echo off
REM ═══════════════════════════════════════════════════════════════
REM   ADK Link - Silent Launcher (No Console Window)
REM   Drag this file to your desktop for quick access!
REM   Double-click to launch ADK Link silently in background
REM ═══════════════════════════════════════════════════════════════

REM Get the directory where this batch file is located
set "ADK_ROOT=%~dp0"

REM Launch using VBS script (completely silent)
wscript.exe "%ADK_ROOT%launch_silent.vbs"

exit

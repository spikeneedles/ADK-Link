@echo off
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File ".\launch_app.ps1"
exit

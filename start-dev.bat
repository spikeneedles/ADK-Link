@echo off
echo Starting ADK Link Development Server...
echo.
echo Server will run on: http://localhost:9002
echo.
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "powershell-steps\03-setup-env.ps1" -NoPause
npm run dev

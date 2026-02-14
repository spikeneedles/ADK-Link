Set-Location $PSScriptRoot

$port = 9002
$url = "http://localhost:$port"
$edgePath = "msedge.exe"

# 1. Check if server is already running
$tcpConnection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
$existingServer = $null
if ($tcpConnection) {
    Write-Warning "Port $port is already in use. Assuming server is active."
} else {
    Write-Host "Starting ADK Link Server..." -ForegroundColor Cyan
    # Start npm run dev. We use cmd /c to ensure the process tree is rooted here
    $serverProcess = Start-Process cmd.exe -ArgumentList "/c npm run dev" -PassThru -NoNewWindow
    
    # Wait for server to start listening
    Write-Host "Waiting for connection..." -NoNewline
    $attempts = 0
    while ($attempts -lt 60) {
        $conn = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
        if ($conn) { 
            Write-Host " Ready!" -ForegroundColor Green
            break 
        }
        Start-Sleep -Seconds 1
        Write-Host "." -NoNewline
        $attempts++
    }
}

# 2. Launch Browser in App Mode
# Using a dedicated temp profile allows us to track this specific window process
$tempProfile = Join-Path $Env:TEMP "AdkLink_App_Profile"
Write-Host "`nLaunching App Interface..." -ForegroundColor Green
# --app mode hides the address bar and makes it look like a standalone program
$browserProcess = Start-Process $edgePath -ArgumentList "--app=$url", "--user-data-dir=$tempProfile" -PassThru

# 3. Wait for Browser to Close
if ($browserProcess) {
    Write-Host "App is running. Close the App window to stop the server." -ForegroundColor Cyan
    Wait-Process -Id $browserProcess.Id
}

# 4. Cleanup Server
if ($serverProcess) {
    Write-Host "App closed. Stopping Server..." -ForegroundColor Yellow
    # Kill the process tree (cmd -> npm -> node) to ensure no zombie processes
    Start-Process taskkill.exe -ArgumentList "/F", "/T", "/PID", $serverProcess.Id -NoNewWindow -Wait
    Write-Host "Server Stopped." -ForegroundColor Green
} else {
    Write-Host "App closed."
}

Start-Sleep -Seconds 2

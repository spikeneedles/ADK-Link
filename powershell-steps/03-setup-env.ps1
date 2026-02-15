param(
    [switch]$NoPause
)

$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$envPath = Join-Path $projectRoot ".env"

function Get-EnvKeyValue {
    param(
        [string]$Path
    )

    if (-not (Test-Path $Path)) {
        return $null
    }

    $lines = Get-Content -Path $Path -ErrorAction SilentlyContinue
    foreach ($line in $lines) {
        if ($line -match "^\s*GOOGLE_GENAI_API_KEY\s*=\s*(.+)\s*$") {
            return $Matches[1].Trim()
        }
        if ($line -match "^\s*GEMINI_API_KEY\s*=\s*(.+)\s*$") {
            return $Matches[1].Trim()
        }
    }

    return $null
}

function Set-EnvKeyValues {
    param(
        [string]$Path,
        [string]$KeyValue
    )

    $lines = @()
    if (Test-Path $Path) {
        $lines = Get-Content -Path $Path -ErrorAction SilentlyContinue
    }

    $updated = $false
    $newLines = @()

    foreach ($line in $lines) {
        if ($line -match "^\s*GOOGLE_GENAI_API_KEY\s*=") {
            $newLines += "GOOGLE_GENAI_API_KEY=$KeyValue"
            $updated = $true
            continue
        }
        if ($line -match "^\s*GEMINI_API_KEY\s*=") {
            $newLines += "GEMINI_API_KEY=$KeyValue"
            $updated = $true
            continue
        }

        $newLines += $line
    }

    if (-not $updated) {
        $newLines += "GOOGLE_GENAI_API_KEY=$KeyValue"
        $newLines += "GEMINI_API_KEY=$KeyValue"
    }

    Set-Content -Path $Path -Value $newLines -Encoding ASCII
}

function Test-GenaiKey {
    param(
        [string]$KeyValue
    )

    if (-not $KeyValue) {
        return $false
    }

    try {
        $uri = "https://generativelanguage.googleapis.com/v1beta/models?key=$KeyValue"
        $response = Invoke-RestMethod -Method Get -Uri $uri -TimeoutSec 10
        return $null -ne $response
    } catch {
        return $false
    }
}

if (-not (Test-Path $envPath)) {
    $content = "GOOGLE_GENAI_API_KEY=`nGEMINI_API_KEY=`n"
    Set-Content -Path $envPath -Value $content -Encoding ASCII
    Write-Host "Created .env with empty API key placeholders."
} else {
    Write-Host ".env already exists."
}

$existingKey = Get-EnvKeyValue -Path $envPath
if ($existingKey -and (Test-GenaiKey -KeyValue $existingKey)) {
    Write-Host "Existing API key looks valid."
    if (-not $NoPause) {
        Pause
    }
    exit 0
}

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$script:validatedKey = $null

$form = New-Object System.Windows.Forms.Form
$form.Text = "Set up Google AI Studio API Key"
$form.Size = New-Object System.Drawing.Size(620, 420)
$form.StartPosition = "CenterScreen"
$form.FormBorderStyle = "FixedDialog"
$form.MaximizeBox = $false
$form.MinimizeBox = $false

$label = New-Object System.Windows.Forms.Label
$label.AutoSize = $false
$label.Location = New-Object System.Drawing.Point(12, 12)
$label.Size = New-Object System.Drawing.Size(580, 170)
$label.Text = "Follow these steps to create your API key:`r`n`r`n" +
    "1) Click 'Open Google AI Studio'.`r`n" +
    "2) Sign in if prompted.`r`n" +
    "3) Create a new API key.`r`n" +
    "4) Paste the key below and click 'Validate and Save'.`r`n`r`n" +
    "The window will stay open until a valid key is confirmed."

$openButton = New-Object System.Windows.Forms.Button
$openButton.Text = "Open Google AI Studio"
$openButton.Location = New-Object System.Drawing.Point(12, 190)
$openButton.Size = New-Object System.Drawing.Size(200, 30)
$openButton.Add_Click({
    Start-Process "https://aistudio.google.com/app/apikey"
})

$keyLabel = New-Object System.Windows.Forms.Label
$keyLabel.Text = "API Key:"
$keyLabel.Location = New-Object System.Drawing.Point(12, 235)
$keyLabel.Size = New-Object System.Drawing.Size(60, 20)

$keyBox = New-Object System.Windows.Forms.TextBox
$keyBox.Location = New-Object System.Drawing.Point(80, 232)
$keyBox.Size = New-Object System.Drawing.Size(510, 24)
$keyBox.Text = if ($existingKey) { $existingKey } else { "" }

$validateButton = New-Object System.Windows.Forms.Button
$validateButton.Text = "Validate and Save"
$validateButton.Location = New-Object System.Drawing.Point(12, 270)
$validateButton.Size = New-Object System.Drawing.Size(200, 30)
$validateButton.Add_Click({
    $candidate = $keyBox.Text.Trim()
    if (Test-GenaiKey -KeyValue $candidate) {
        Set-EnvKeyValues -Path $envPath -KeyValue $candidate
        $script:validatedKey = $candidate
        [System.Windows.Forms.MessageBox]::Show("API key saved to .env.", "Success") | Out-Null
        $form.Close()
        return
    }

    [System.Windows.Forms.MessageBox]::Show("Key validation failed. Please check the key and try again.", "Invalid Key") | Out-Null
})

$form.Add_FormClosing({
    if (-not $script:validatedKey) {
        [System.Windows.Forms.MessageBox]::Show("A valid API key is required before closing.", "API Key Required") | Out-Null
        $_.Cancel = $true
    }
})

$form.Controls.Add($label)
$form.Controls.Add($openButton)
$form.Controls.Add($keyLabel)
$form.Controls.Add($keyBox)
$form.Controls.Add($validateButton)

[void]$form.ShowDialog()

Write-Host "API key configured."
if (-not $NoPause) {
    Pause
}

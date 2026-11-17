# GreenGallery PowerShell Launcher
Write-Host "==============================================================" -ForegroundColor Green
Write-Host "            🌿 GREEN GALLERY — BOTANICAL SUITE 🌿" -ForegroundColor DarkGreen
Write-Host "              Cultivating Natural Elegance" -ForegroundColor DarkYellow
Write-Host "==============================================================" -ForegroundColor Green
Write-Host ""

Set-Location -Path $PSScriptRoot

# 1. Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not installed or not in PATH!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org" -ForegroundColor Yellow
    Read-Host "Press Enter to exit..."
    exit 1
}

# 2. Check dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Dependencies not found. Installing packages with npm..." -ForegroundColor Cyan
    npm install
}

# 3. Launch mode
Write-Host "Choose launch mode:"
Write-Host "  [1] Production Server (Fast, optimized, recommended)" -ForegroundColor White
Write-Host "  [2] Development Server (Hot-reload for code editing)" -ForegroundColor Gray
Write-Host ""
$choice = Read-Host "Enter choice [1 or 2] (Default 1)"

if ($choice -eq "2") {
    Write-Host "[INFO] Starting Development Server on port 3000..." -ForegroundColor Cyan
    Start-Process -FilePath "powershell" -ArgumentList "-NoProfile", "-Command", "Start-Sleep -Seconds 4; Start-Process 'http://localhost:3000'"
    npm run dev
} else {
    if (-not (Test-Path ".next")) {
        Write-Host "[INFO] Production build not found. Building application..." -ForegroundColor Yellow
        npm run build
    }
    Write-Host "[INFO] Starting Production Server on port 3000..." -ForegroundColor Green
    Start-Process -FilePath "powershell" -ArgumentList "-NoProfile", "-Command", "Start-Sleep -Seconds 3; Start-Process 'http://localhost:3000'"
    npm start
}

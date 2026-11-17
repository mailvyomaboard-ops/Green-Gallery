@echo off
title GreenGallery Launcher
chcp 65001 >nul
cd /d "%~dp0"

echo ==============================================================
echo             🌿 GREEN GALLERY — BOTANICAL SUITE 🌿
echo               Cultivating Natural Elegance
echo ==============================================================
echo.

:: 1. Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org
    echo.
    pause
    exit /b 1
)

:: 2. Check dependencies
if not exist "node_modules\" (
    echo [INFO] Dependencies not found. Installing packages with npm...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
)

:: 3. Server launch mode selection
echo Choose launch mode:
echo   [1] Production Server (Fast, optimized, recommended)
echo   [2] Development Server (Hot-reload for code editing)
echo.
set choice=1
set /p choice="Enter choice [1 or 2] (Press Enter for Default 1): "

if "%choice%"=="2" (
    goto DEV_MODE
) else (
    goto PROD_MODE
)

:PROD_MODE
echo.
if not exist ".next\" (
    echo [INFO] Production build not found. Building application...
    call npm run build
    if %errorlevel% neq 0 (
        echo [ERROR] Build failed.
        pause
        exit /b 1
    )
)

echo [INFO] Starting GreenGallery Production Server on port 3000...
echo [INFO] Opening http://localhost:3000 in your browser...
start "" "%COMSPEC%" /c "timeout /t 3 >nul 2>nul & start http://localhost:3000"
call npm start
goto END

:DEV_MODE
echo.
echo [INFO] Starting GreenGallery Development Server on port 3000...
echo [INFO] Opening http://localhost:3000 in your browser...
start "" "%COMSPEC%" /c "timeout /t 4 >nul 2>nul & start http://localhost:3000"
call npm run dev
goto END

:END
pause

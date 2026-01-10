@echo off
REM Audio Metadata Editor - Development Server Script
REM This script starts the development server

setlocal enabledelayedexpansion

echo.
echo ========================================
echo Audio Metadata Editor - Development Server
echo ========================================
echo.

REM Check if node_modules exists
if not exist node_modules (
    echo ERROR: Dependencies not installed!
    echo Please run install.bat first
    pause
    exit /b 1
)

REM Check if .env.local exists
if not exist .env.local (
    echo ERROR: .env.local file not found!
    echo Please run install.bat first
    pause
    exit /b 1
)

REM Determine package manager
pnpm --version >nul 2>&1
if errorlevel 1 (
    set "PKG_MANAGER=npm"
) else (
    set "PKG_MANAGER=pnpm"
)

echo.
echo Starting development server using !PKG_MANAGER!...
echo.
echo The application will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the development server
call !PKG_MANAGER! run dev

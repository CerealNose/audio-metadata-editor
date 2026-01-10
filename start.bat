@echo off
REM Audio Metadata Editor - Production Server Script
REM This script runs the production build

setlocal enabledelayedexpansion

echo.
echo ========================================
echo Audio Metadata Editor - Production Server
echo ========================================
echo.

REM Check if dist folder exists
if not exist dist (
    echo ERROR: Production build not found!
    echo Please run build.bat first
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

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Display server info
echo.
echo Server Configuration:
echo =====================
echo.
echo Node.js version:
node --version
echo.
echo Environment: Production
echo Port: 3000
echo URL: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the production server
node dist/index.js

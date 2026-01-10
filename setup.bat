@echo off
REM Audio Metadata Editor - Automated Setup Script
REM This script automates MySQL and .env configuration

setlocal enabledelayedexpansion

echo.
echo ========================================
echo Audio Metadata Editor - Auto Setup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist node_modules (
    echo ERROR: Dependencies not installed!
    echo Please run: npm install --legacy-peer-deps
    pause
    exit /b 1
)

REM Run the setup script
echo Running automated setup...
echo.
call node setup.mjs

if errorlevel 1 (
    echo.
    echo Setup failed. Please try again.
    pause
    exit /b 1
)

pause

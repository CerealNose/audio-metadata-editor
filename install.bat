@echo off
REM Audio Metadata Editor - Windows Installation Script
REM This script automates the setup process for Windows users

setlocal enabledelayedexpansion

echo.
echo ========================================
echo Audio Metadata Editor - Setup
echo ========================================
echo.

REM Check if Node.js is installed
echo Checking for Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo Node.js found: 
node --version

REM Check if pnpm is installed
echo.
echo Checking for pnpm...
pnpm --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo WARNING: pnpm is not installed!
    echo Installing pnpm globally...
    npm install -g pnpm
    if errorlevel 1 (
        echo ERROR: Failed to install pnpm
        pause
        exit /b 1
    )
)
echo pnpm found: 
pnpm --version

REM Install dependencies
echo.
echo ========================================
echo Installing dependencies...
echo ========================================
echo.
pnpm install
if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

REM Check if .env.local exists
echo.
if not exist .env.local (
    echo Creating .env.local file...
    (
        echo # Database Configuration
        echo DATABASE_URL=mysql://root:root@localhost:3306/audio_metadata_editor
        echo.
        echo # OAuth Configuration
        echo VITE_APP_ID=dev-app-id
        echo OAUTH_SERVER_URL=https://api.manus.im
        echo VITE_OAUTH_PORTAL_URL=https://portal.manus.im
        echo JWT_SECRET=dev-secret-key-change-in-production
        echo.
        echo # Owner Information
        echo OWNER_NAME=Developer
        echo OWNER_OPEN_ID=dev-user-id
        echo.
        echo # Built-in APIs
        echo BUILT_IN_FORGE_API_URL=https://api.manus.im
        echo BUILT_IN_FORGE_API_KEY=dev-key
        echo VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
        echo VITE_FRONTEND_FORGE_API_KEY=dev-frontend-key
        echo.
        echo # Analytics
        echo VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
        echo VITE_ANALYTICS_WEBSITE_ID=dev-website-id
        echo.
        echo # AWS S3 Configuration (Optional - for local testing)
        echo AWS_ACCESS_KEY_ID=your_access_key
        echo AWS_SECRET_ACCESS_KEY=your_secret_key
        echo AWS_REGION=us-east-1
        echo AWS_S3_BUCKET=your-bucket-name
    ) > .env.local
    echo .env.local created with default values
    echo Please edit .env.local with your actual credentials
) else (
    echo .env.local already exists
)

REM Setup database
echo.
echo ========================================
echo Setting up database...
echo ========================================
echo.
echo Running database migrations...
pnpm db:push
if errorlevel 1 (
    echo.
    echo WARNING: Database setup may have failed
    echo Make sure MySQL is running and DATABASE_URL is correct in .env.local
    echo.
)

REM Success message
echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env.local with your configuration
echo 2. Make sure MySQL is running
echo 3. Run: run.bat (to start the development server)
echo.
pause

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

REM Install dependencies using npm
echo.
echo ========================================
echo Installing dependencies...
echo ========================================
echo.
echo Note: Using --legacy-peer-deps to resolve dependency conflicts
echo.
call npm install --legacy-peer-deps
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

REM Database setup instructions
echo.
echo ========================================
echo Database Configuration
echo ========================================
echo.
echo IMPORTANT: Before running the app, you need to set up MySQL:
echo.
echo 1. Install MySQL from: https://www.mysql.com/downloads/
echo 2. Start the MySQL service
echo 3. Create the database by running these commands:
echo.
echo    mysql -u root -p
echo    CREATE DATABASE audio_metadata_editor;
echo    EXIT;
echo.
echo 4. Edit .env.local and update DATABASE_URL with your MySQL credentials
echo 5. Run: update.bat (to initialize the database schema)
echo.

REM Success message
echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Run: setup.bat (automated MySQL and .env configuration)
echo 2. Run: update.bat (to initialize the database)
echo 3. Run: run.bat (to start the development server)
echo.
echo OR manually:
echo 1. Install MySQL from https://www.mysql.com/downloads/
echo 2. Run: setup.bat (to configure .env and create database)
echo 3. Run: update.bat
echo 4. Run: run.bat
echo.
pause

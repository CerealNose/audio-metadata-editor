@echo off
REM Audio Metadata Editor - Production Build Script
REM This script creates a production-ready build

setlocal enabledelayedexpansion

echo.
echo ========================================
echo Audio Metadata Editor - Production Build
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

REM Clean previous builds
echo.
echo ========================================
echo Cleaning previous builds...
echo ========================================
echo.
if exist dist (
    echo Removing old dist folder...
    rmdir /s /q dist
)

REM Run tests before building
echo.
echo ========================================
echo Running tests...
echo ========================================
echo.
call !PKG_MANAGER! run test
if errorlevel 1 (
    echo.
    echo WARNING: Some tests failed!
    echo Do you want to continue with the build anyway? (Y/N)
    set /p continue="Enter choice: "
    if /i not "!continue!"=="Y" (
        echo Build cancelled
        pause
        exit /b 1
    )
)

REM Type checking
echo.
echo ========================================
echo Running TypeScript type checking...
echo ========================================
echo.
call !PKG_MANAGER! run check
if errorlevel 1 (
    echo.
    echo WARNING: TypeScript errors found!
    echo Do you want to continue with the build anyway? (Y/N)
    set /p continue="Enter choice: "
    if /i not "!continue!"=="Y" (
        echo Build cancelled
        pause
        exit /b 1
    )
)

REM Build the application
echo.
echo ========================================
echo Building application...
echo ========================================
echo.
call !PKG_MANAGER! run build
if errorlevel 1 (
    echo.
    echo ERROR: Build failed!
    echo Please check the output above for details
    pause
    exit /b 1
)

REM Verify build output
echo.
echo ========================================
echo Verifying build output...
echo ========================================
echo.
if not exist dist (
    echo ERROR: Build output directory not found!
    pause
    exit /b 1
)

echo Build output verified successfully

REM Display build statistics
echo.
echo ========================================
echo Build Statistics
echo ========================================
echo.
echo Build directory: dist
echo.

REM Create build info file
echo.
echo Creating build information file...
(
    echo Build Information
    echo ==================
    echo.
    echo Build Date: %date% %time%
    echo.
    echo Build Command: !PKG_MANAGER! run build
    echo.
    echo Output Directory: dist
    echo.
    echo To start the production server:
    echo   start.bat
    echo.
    echo To deploy:
    echo   Copy the dist folder to your server
    echo   Set environment variables on the server
    echo   Run: node dist/index.js
    echo.
) > dist\BUILD_INFO.txt

REM Success message
echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo Production build ready in: dist\
echo.
echo Next steps:
echo 1. Test the build locally: start.bat
echo 2. Deploy to your server
echo 3. Set environment variables on the server
echo 4. Start with: node dist/index.js
echo.
echo Build information saved to: dist\BUILD_INFO.txt
echo.
pause

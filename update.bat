@echo off
REM Audio Metadata Editor - Update Script
REM This script updates dependencies and database schema

setlocal enabledelayedexpansion

echo.
echo ========================================
echo Audio Metadata Editor - Update
echo ========================================
echo.

REM Determine package manager
pnpm --version >nul 2>&1
if errorlevel 1 (
    set "PKG_MANAGER=npm"
) else (
    set "PKG_MANAGER=pnpm"
)

REM Update dependencies
echo.
echo ========================================
echo Updating dependencies using !PKG_MANAGER!...
echo ========================================
echo.
call !PKG_MANAGER! install
if errorlevel 1 (
    echo.
    echo ERROR: Failed to update dependencies
    pause
    exit /b 1
)

REM Update database schema
echo.
echo ========================================
echo Updating database schema...
echo ========================================
echo.
call !PKG_MANAGER! run db:push
if errorlevel 1 (
    echo.
    echo WARNING: Database update may have failed
    echo Make sure MySQL is running and DATABASE_URL is correct in .env.local
    echo.
)

REM Run tests
echo.
echo ========================================
echo Running tests...
echo ========================================
echo.
call !PKG_MANAGER! run test
if errorlevel 1 (
    echo.
    echo WARNING: Some tests failed
    echo Please check the output above for details
    echo.
)

REM Success message
echo.
echo ========================================
echo Update Complete!
echo ========================================
echo.
echo You can now run: run.bat
echo.
pause

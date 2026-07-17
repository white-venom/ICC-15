@echo off
echo ===================================
echo  MySQL 8.4 Service Installer
echo ===================================

REM Check if running as admin
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Please right-click this file and choose "Run as administrator"
    pause
    exit /b 1
)

echo [1/4] Removing any old MySQL84 service...
sc stop MySQL84 >nul 2>&1
sc delete MySQL84 >nul 2>&1

echo [2/4] Creating MySQL84 Windows service...
sc create MySQL84 binPath= "\"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe\" --defaults-file=\"C:\ProgramData\MySQL\MySQL Server 8.4\my.ini\" MySQL84" DisplayName= "MySQL Server 8.4" start= auto
if %errorLevel% neq 0 (
    echo ERROR: Failed to create service. Check that MySQL is installed.
    pause
    exit /b 1
)

echo [3/4] Starting MySQL Server...
net start MySQL84
if %errorLevel% neq 0 (
    echo ERROR: Failed to start service. Check event log.
    pause
    exit /b 1
)

echo [4/4] Creating database...
timeout /t 3 /nobreak >nul
"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS inkandcottonclub;"

echo.
echo ===================================
echo  SUCCESS! MySQL is now running.
echo  Run: npx prisma db push
echo ===================================
pause

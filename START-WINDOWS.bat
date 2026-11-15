@echo off
setlocal
cd /d "%~dp0"
echo Result Processing System
echo Starting the local website. No npm installation is required.
echo.
where node >nul 2>nul
if errorlevel 1 (
 echo Install Node.js 24 LTS from https://nodejs.org
 echo Then double-click START-WINDOWS.bat again.
 pause
 exit /b 1
)
node scripts\check-runtime.mjs
if errorlevel 1 (
 pause
 exit /b 1
)
node scripts\server-running.mjs
if errorlevel 1 (
 start "Result Processing - Server" /D "%~dp0" node server.mjs
)
node scripts\open-browser.mjs
if errorlevel 1 pause
exit /b

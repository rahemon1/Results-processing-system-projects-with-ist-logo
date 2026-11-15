@echo off
setlocal
cd /d "%~dp0"
if not exist node_modules (
 echo Installing tools for source editing. This is needed only for rebuilding.
 call npm install
 if errorlevel 1 goto failed
)
call npm run build
if errorlevel 1 goto failed
echo Source rebuilt. Refresh the website in your browser.
pause
exit /b 0
:failed
echo Build failed. Read the error above.
pause
exit /b 1

@echo off
title AI Test Case Generator - Quick Start
color 0A

REM Change to the project directory
cd /d "c:\Users\aanto\Desktop\Ashal\AI-TC-Generator"

REM Clear screen and show nice header
cls
echo.
echo     ██████╗ ███████╗███╗   ██╗███████╗██████╗  █████╗ ████████╗ ██████╗ ██████╗ 
echo    ██╔════╝ ██╔════╝████╗  ██║██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗
echo    ██║  ███╗█████╗  ██╔██╗ ██║█████╗  ██████╔╝███████║   ██║   ██║   ██║██████╔╝
echo    ██║   ██║██╔══╝  ██║╚██╗██║██╔══╝  ██╔══██╗██╔══██║   ██║   ██║   ██║██╔══██╗
echo    ╚██████╔╝███████╗██║ ╚████║███████╗██║  ██║██║  ██║   ██║   ╚██████╔╝██║  ██║
echo     ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝
echo.
echo                            AI Test Case Generator
echo                              Starting Server...
echo.

REM Quick file check
if not exist "main_final.py" (
    echo ❌ Error: main_final.py not found in current directory
    echo Please make sure this batch file is in the correct folder
    pause
    exit /b 1
)

if not exist "config.json" (
    echo ⚠️  Warning: config.json not found
    echo Please create config.json with your Azure DevOps and OpenAI credentials
    pause
    exit /b 1
)

echo ✅ Files found, starting Flask server...
echo.
echo 🌐 Server URL: http://127.0.0.1:5000
echo 🔧 Web Interface: http://127.0.0.1:5000/web
echo 📊 Health Check: http://127.0.0.1:5000/health
echo.
echo 💡 Tip: Open Chrome extension and visit an Azure DevOps User Story page
echo 🛑 To stop server: Press Ctrl+C or close this window
echo.
echo ════════════════════════════════════════════════════════════════
echo                            SERVER LOGS
echo ════════════════════════════════════════════════════════════════
echo.

REM Start the Flask server
python main_final.py

REM If server stops, show message
echo.
echo ════════════════════════════════════════════════════════════════
echo 🛑 Server stopped - You can close this window now
echo ════════════════════════════════════════════════════════════════
pause

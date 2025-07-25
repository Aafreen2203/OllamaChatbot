@echo off
echo Starting ChatGPT Clone Application...
echo.

echo Checking if Ollama is running...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Ollama is not running!
    echo Please start Ollama first:
    echo   1. Open a terminal
    echo   2. Run: ollama serve
    echo   3. In another terminal, ensure sam860/amoral-gemma3-1b-v2 is available: ollama pull sam860/amoral-gemma3-1b-v2
    echo.
    pause
    exit /b 1
)

echo Ollama is running ✓
echo.

echo Starting Backend Server...
cd "Chatbot\backend"
start "Backend Server" cmd /k "npm run dev"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
cd "..\chatbotFrontend"
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ================================
echo  ChatGPT Clone is starting up!
echo ================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this script (servers will keep running)
pause >nul

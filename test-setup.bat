@echo off
echo Testing ChatGPT Clone Setup...
echo.

echo [1/5] Testing Backend Server...
curl -s http://localhost:5000/api/chats >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Backend server is running and responding
) else (
    echo ✗ Backend server is not responding
    echo   Make sure to run: cd Chatbot\backend && npm run dev
)

echo.
echo [2/5] Testing Frontend Server...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Frontend server is running and responding
) else (
    echo ✗ Frontend server is not responding
    echo   Make sure to run: cd chatbotFrontend && npm run dev
)

echo.
echo [3/5] Testing Database Connection...
cd "Chatbot\backend"
npx prisma db pull >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Database connection successful
) else (
    echo ✗ Database connection failed
    echo   Check your PostgreSQL server and DATABASE_URL in .env
)
cd ..\..

echo.
echo [4/5] Testing Ollama...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Ollama is running
    curl -s "http://localhost:11434/api/tags" | find "sam860/amoral-gemma3-1b-v2" >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✓ sam860/amoral-gemma3-1b-v2 model is available
    ) else (
        echo ⚠ sam860/amoral-gemma3-1b-v2 model not found - run: ollama pull sam860/amoral-gemma3-1b-v2
    )
) else (
    echo ✗ Ollama is not running
    echo   Start with: ollama serve
)

echo.
echo [5/5] Testing Complete System...
echo.
if exist "Chatbot\backend\node_modules" (
    echo ✓ Backend dependencies installed
) else (
    echo ✗ Backend dependencies missing - run: cd Chatbot\backend && npm install
)

if exist "chatbotFrontend\node_modules" (
    echo ✓ Frontend dependencies installed
) else (
    echo ✗ Frontend dependencies missing - run: cd chatbotFrontend && npm install
)

echo.
echo ================================
echo  System Status Check Complete
echo ================================
echo.
echo If all tests pass, your ChatGPT Clone is ready!
echo Visit: http://localhost:3000
echo.
pause

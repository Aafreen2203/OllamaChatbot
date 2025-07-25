Write-Host "Starting ChatGPT Clone Application..." -ForegroundColor Green
Write-Host ""

Write-Host "Checking if Ollama is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "Ollama is running ✓" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Ollama is not running!" -ForegroundColor Red
    Write-Host "Please start Ollama first:" -ForegroundColor Yellow
    Write-Host "  1. Open a terminal" -ForegroundColor White
    Write-Host "  2. Run: ollama serve" -ForegroundColor White
    Write-Host "  3. In another terminal, ensure sam860/amoral-gemma3-1b-v2 is available: ollama pull sam860/amoral-gemma3-1b-v2" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Set-Location "Chatbot\backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Set-Location "..\chatbotFrontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host " ChatGPT Clone is starting up!" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this script (servers will keep running)" -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

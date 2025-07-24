@echo off
echo Starting Insurance LLM System...
echo.
echo This will start both the frontend (React) and backend (FastAPI) servers.
echo Frontend will be available at: http://localhost:3000
echo Backend will be available at: http://localhost:8000
echo.
echo Press Ctrl+C to stop both servers.
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python from https://python.org/
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing root dependencies...
    npm install
)

if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    npm install
    cd ..
)

if not exist "backend\venv" (
    echo Installing backend dependencies...
    cd backend
    pip install -r requirements.txt
    cd ..
)

echo Starting servers...
npm run dev 
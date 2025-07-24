#!/bin/bash

echo "🚀 Starting Insurance LLM System..."
echo ""
echo "This will start both the frontend (React) and backend (FastAPI) servers."
echo "Frontend will be available at: http://localhost:3000"
echo "Backend will be available at: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop both servers."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "❌ Error: Python is not installed or not in PATH"
    echo "Please install Python from https://python.org/"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

if [ ! -d "backend/venv" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    pip install -r requirements.txt
    cd ..
fi

echo "🚀 Starting servers..."
npm run dev 
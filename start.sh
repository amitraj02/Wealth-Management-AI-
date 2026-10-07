#!/bin/bash

# FinAdvisor AI - One-Click Starter Script for Beginners
# Starts both FastAPI Backend and Vite React Frontend

echo "=================================================="
echo "   🚀 Launching FinAdvisor AI Platform...         "
echo "=================================================="

# Check if Python virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
    ./venv/bin/pip install -r backend/requirements.txt
fi

# Check if frontend node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

echo "1. Starting FastAPI Backend on http://127.0.0.1:8000 ..."
./venv/bin/python backend/run.py &
BACKEND_PID=$!

echo "2. Starting Vite React Frontend on http://127.0.0.1:5173 ..."
cd frontend && npm run dev -- --host 127.0.0.1 --port 5173 &
FRONTEND_PID=$!
cd ..

echo ""
echo "=================================================="
echo "   ✅ Application is Ready!"
echo "   🌐 Open UI:       http://127.0.0.1:5173"
echo "   📄 API Docs:      http://127.0.0.1:8000/docs"
echo "=================================================="
echo "Press CTRL+C at any time to stop both servers."

trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM
wait

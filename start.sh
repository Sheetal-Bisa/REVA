#!/bin/bash
set -e

# Check if frontend build exists, if not build it
if [ ! -d "frontend/build" ]; then
    echo "Building frontend..."
    cd frontend
    npm install
    npm run build
    cd ..
fi

echo "Starting backend..."
cd backend
exec python -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1

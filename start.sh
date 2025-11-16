#!/bin/bash
set -e

echo "REVA - Unified Deployment Starting..."
echo "Working directory: $(pwd)"
echo "Contents: $(ls -la)"

# Check if frontend build exists
if [ -d "frontend/build" ]; then
    echo "✓ Frontend build found"
    echo "  Build contents: $(ls -la frontend/build | head -5)"
else
    echo "⚠ Frontend build not found - frontend will not be served"
fi

# Verify backend exists
if [ -d "backend" ]; then
    echo "✓ Backend directory found"
else
    echo "✗ Backend directory not found!"
    exit 1
fi

echo "Starting FastAPI server on port ${PORT:-8080}..."
cd backend
exec python -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080} --workers 1

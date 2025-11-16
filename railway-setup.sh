#!/bin/bash

# Railway Setup Script for REVA
# This script helps prepare your project for Railway deployment

echo "🚂 REVA Railway Deployment Setup"
echo "=================================="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "⚠️  Railway CLI not found. Install it with:"
    echo "   npm i -g @railway/cli"
    echo "   or visit: https://docs.railway.app/develop/cli"
    echo ""
    read -p "Continue without CLI? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check for OpenAI API key
echo "📝 Checking environment variables..."
if [ -f "backend/.env" ]; then
    if grep -q "OPENAI_API_KEY=sk-" backend/.env; then
        echo "✅ OpenAI API key found in backend/.env"
    else
        echo "⚠️  OpenAI API key not found or invalid in backend/.env"
    fi
else
    echo "⚠️  backend/.env file not found"
    echo "   Copy .env.example and add your OpenAI API key"
fi

echo ""
echo "🔧 Deployment Options:"
echo "1. Deploy Backend Only (recommended for first deployment)"
echo "2. Deploy Backend + Frontend (separate services)"
echo "3. Deploy as Single Service (backend serves frontend)"
echo ""
read -p "Choose option (1-3): " option

case $option in
    1)
        echo ""
        echo "📦 Backend-Only Deployment"
        echo "=========================="
        echo ""
        echo "Steps to deploy:"
        echo "1. Push your code to GitHub/GitLab"
        echo "2. Go to https://railway.app/new"
        echo "3. Select 'Deploy from GitHub repo'"
        echo "4. Choose your repository"
        echo "5. Add environment variables:"
        echo "   - OPENAI_API_KEY=<your-key>"
        echo "   - PORT=8000"
        echo "   - ALLOWED_ORIGINS=*"
        echo "6. Railway will auto-deploy using Procfile"
        echo ""
        echo "After deployment, test with:"
        echo "curl https://your-app.railway.app/health"
        ;;
    2)
        echo ""
        echo "📦 Backend + Frontend Deployment"
        echo "================================"
        echo ""
        echo "Backend Steps:"
        echo "1. Deploy backend first (see option 1)"
        echo "2. Copy the backend URL"
        echo ""
        echo "Frontend Steps:"
        echo "1. In Railway, click 'New' → 'Empty Service'"
        echo "2. Connect same repository"
        echo "3. Set root directory: frontend"
        echo "4. Add environment variable:"
        echo "   - REACT_APP_API_URL=<backend-url>"
        echo "5. Railway will auto-detect React and build"
        echo ""
        echo "Final Step:"
        echo "Update backend ALLOWED_ORIGINS with frontend URL"
        ;;
    3)
        echo ""
        echo "📦 Single Service Deployment"
        echo "============================"
        echo ""
        echo "This requires building frontend first:"
        echo "cd frontend && npm run build"
        echo ""
        echo "Then modify backend to serve static files."
        echo "See RAILWAY_DEPLOYMENT.md for details."
        ;;
    *)
        echo "Invalid option"
        exit 1
        ;;
esac

echo ""
echo "📚 For detailed instructions, see:"
echo "   - RAILWAY_DEPLOYMENT.md"
echo "   - DEPLOYMENT_CHECKLIST.md"
echo ""
echo "✨ Good luck with your deployment!"

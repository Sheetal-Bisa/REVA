@echo off
REM Railway Setup Script for REVA (Windows)
REM This script helps prepare your project for Railway deployment

echo.
echo 🚂 REVA Railway Deployment Setup
echo ==================================
echo.

REM Check if Railway CLI is installed
where railway >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Railway CLI not found. Install it with:
    echo    npm i -g @railway/cli
    echo    or visit: https://docs.railway.app/develop/cli
    echo.
    set /p continue="Continue without CLI? (y/n): "
    if /i not "%continue%"=="y" exit /b 1
)

REM Check for OpenAI API key
echo 📝 Checking environment variables...
if exist "backend\.env" (
    findstr /C:"OPENAI_API_KEY=sk-" backend\.env >nul
    if %ERRORLEVEL% EQU 0 (
        echo ✅ OpenAI API key found in backend\.env
    ) else (
        echo ⚠️  OpenAI API key not found or invalid in backend\.env
    )
) else (
    echo ⚠️  backend\.env file not found
    echo    Copy .env.example and add your OpenAI API key
)

echo.
echo 🔧 Deployment Options:
echo 1. Deploy Backend Only (recommended for first deployment)
echo 2. Deploy Backend + Frontend (separate services)
echo 3. Deploy as Single Service (backend serves frontend)
echo.
set /p option="Choose option (1-3): "

if "%option%"=="1" (
    echo.
    echo 📦 Backend-Only Deployment
    echo ==========================
    echo.
    echo Steps to deploy:
    echo 1. Push your code to GitHub/GitLab
    echo 2. Go to https://railway.app/new
    echo 3. Select 'Deploy from GitHub repo'
    echo 4. Choose your repository
    echo 5. Add environment variables:
    echo    - OPENAI_API_KEY=^<your-key^>
    echo    - PORT=8000
    echo    - ALLOWED_ORIGINS=*
    echo 6. Railway will auto-deploy using Procfile
    echo.
    echo After deployment, test with:
    echo curl https://your-app.railway.app/health
) else if "%option%"=="2" (
    echo.
    echo 📦 Backend + Frontend Deployment
    echo ================================
    echo.
    echo Backend Steps:
    echo 1. Deploy backend first (see option 1)
    echo 2. Copy the backend URL
    echo.
    echo Frontend Steps:
    echo 1. In Railway, click 'New' -^> 'Empty Service'
    echo 2. Connect same repository
    echo 3. Set root directory: frontend
    echo 4. Add environment variable:
    echo    - REACT_APP_API_URL=^<backend-url^>
    echo 5. Railway will auto-detect React and build
    echo.
    echo Final Step:
    echo Update backend ALLOWED_ORIGINS with frontend URL
) else if "%option%"=="3" (
    echo.
    echo 📦 Single Service Deployment
    echo ============================
    echo.
    echo This requires building frontend first:
    echo cd frontend ^&^& npm run build
    echo.
    echo Then modify backend to serve static files.
    echo See RAILWAY_DEPLOYMENT.md for details.
) else (
    echo Invalid option
    exit /b 1
)

echo.
echo 📚 For detailed instructions, see:
echo    - RAILWAY_DEPLOYMENT.md
echo    - DEPLOYMENT_CHECKLIST.md
echo.
echo ✨ Good luck with your deployment!
echo.
pause

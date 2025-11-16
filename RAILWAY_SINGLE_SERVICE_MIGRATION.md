# Railway Single Service Migration Guide

## Current Status
Your code is **already configured** for a unified deployment! The Dockerfile builds both frontend and backend, and the FastAPI backend serves the React frontend.

## Migration Steps

### Step 1: Deploy as Single Service

1. **In Railway Dashboard**:
   - Go to your Railway project
   - Delete the separate frontend service (or keep it inactive)
   - Keep/Create ONE service for the entire application

### Step 2: Configure the Single Service

1. **Service Settings**:
   - **Root Directory**: Leave as `/` (project root)
   - **Builder**: Dockerfile
   - **Dockerfile Path**: `Dockerfile` (already configured in railway.json)

2. **Environment Variables** (Set these in Railway):
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ALLOWED_ORIGINS=*
   ```

   Note: Railway automatically sets `PORT` - don't override it!

### Step 3: Deploy

1. **Push your code** to the repository connected to Railway:
   ```bash
   git add .
   git commit -m "Consolidate to single service deployment"
   git push
   ```

2. **Railway will automatically**:
   - Detect the `railway.json` configuration
   - Use the Dockerfile to build
   - Install Python dependencies
   - Install Node.js and frontend dependencies
   - Build the React app (`npm run build`)
   - Start the FastAPI server
   - The backend serves both API and frontend

### Step 4: Access Your Application

After deployment completes:
- Your app will be available at: `https://your-service.railway.app`
- API endpoints: `https://your-service.railway.app/api`, `/health`, etc.
- Frontend: `https://your-service.railway.app/` (served by FastAPI)

### Step 5: Update Frontend API URL (if needed)

If your frontend has hardcoded API URLs pointing to a separate backend service:

1. Check `frontend/src/App.js` or similar files
2. Update API base URL to use relative paths (recommended):
   ```javascript
   // Instead of: axios.get('https://backend.railway.app/health')
   // Use:
   axios.get('/health')
   ```

Or use environment-based URLs:
```javascript
const API_URL = process.env.REACT_APP_API_URL || '';
```

## How It Works

### Build Process (Dockerfile)
```
1. Install Python 3.10
2. Install Node.js 18
3. Install Python dependencies (requirements.txt)
4. Install frontend dependencies (npm install)
5. Build React app (npm run build) → creates /app/frontend/build
6. Copy backend code
7. Start FastAPI server
```

### Request Routing (FastAPI)
```
Browser Request → FastAPI Server
                    ↓
              Is it an API route?
              (/api, /upload, /query, etc.)
                    ↓
        Yes → Handle with FastAPI endpoints
                    ↓
        No → Serve React static files
             (index.html for all routes)
```

## Verification

After deployment, test these URLs:

1. **Frontend**: `https://your-service.railway.app/`
   - Should show your React app

2. **API Health**: `https://your-service.railway.app/health`
   - Should return JSON with status

3. **API Root**: `https://your-service.railway.app/api`
   - Should return API info

## Troubleshooting

### If frontend doesn't load:
1. Check Railway build logs for `npm run build` success
2. Verify `/app/frontend/build` directory exists in container
3. Check FastAPI logs for static file serving

### If API doesn't work:
1. Verify `OPENAI_API_KEY` is set in Railway
2. Check `/health` endpoint for API key status
3. Review Railway deployment logs

### If you get 404 errors:
1. Make sure API routes don't conflict with frontend routes
2. Verify `main.py:550` excludes API routes from frontend serving
3. Check Railway logs for routing errors

## Cost Savings

With a single service, you'll only pay for:
- ✅ ONE service instead of two
- ✅ ONE set of resources (memory, CPU)
- ✅ Simpler deployment and monitoring

## Architecture Diagram

```
┌─────────────────────────────────────────┐
│     Railway Service (Single Container)   │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │   FastAPI Backend (Python)         │ │
│  │   Port: $PORT (set by Railway)     │ │
│  │                                    │ │
│  │   Routes:                          │ │
│  │   • /api → API info                │ │
│  │   • /upload → File upload          │ │
│  │   • /query → Query documents       │ │
│  │   • /health → Health check         │ │
│  │   • /* → React app (index.html)    │ │
│  │                                    │ │
│  │   Static Files:                    │ │
│  │   • /static → React build/static   │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │   React Frontend (Built)           │ │
│  │   Location: /app/frontend/build    │ │
│  │   Served by: FastAPI               │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Summary

You don't need to change any code! Your setup is already configured for unified deployment. Just:

1. Use ONE Railway service
2. Set environment variables
3. Deploy

The Dockerfile handles everything automatically.

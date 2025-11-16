# Railway Deployment Troubleshooting

## App Crashed After Deployment?

### Most Common Issue: Missing OPENAI_API_KEY

Your app **requires** the `OPENAI_API_KEY` environment variable to start. Without it, the app will crash immediately.

#### Fix:
1. Go to your Railway project
2. Click on your service
3. Go to **"Variables"** tab
4. Click **"New Variable"**
5. Add:
   - **Variable**: `OPENAI_API_KEY`
   - **Value**: `sk-proj-...` (your actual OpenAI API key)
6. Click **"Add"**
7. Railway will automatically redeploy

### Port Configuration

The port you entered (8080) in "Generate Domain" is just for the public URL. Your app automatically uses Railway's `$PORT` environment variable, so this won't cause crashes.

### Check Deployment Logs

1. Go to your Railway project
2. Click on your service
3. Go to **"Deployments"** tab
4. Click on the failed deployment
5. Check **"Build Logs"** and **"Deploy Logs"**

### Common Error Messages and Fixes

#### Error: "OPENAI_API_KEY not found"
```
ValueError: OPENAI_API_KEY not found. Please set it in your environment variables.
```
**Fix**: Add `OPENAI_API_KEY` environment variable (see above)

#### Error: "Module not found"
```
ModuleNotFoundError: No module named 'fastapi'
```
**Fix**: Ensure `requirements.txt` is at the root of your repository

#### Error: "Permission denied: start.sh"
```
bash: start.sh: Permission denied
```
**Fix**: Run locally: `git update-index --chmod=+x start.sh` then commit and push

#### Error: "Address already in use"
```
OSError: [Errno 98] Address already in use
```
**Fix**: This shouldn't happen on Railway, but if it does, Railway will restart automatically

### Verify Your Setup

#### Required Files at Root:
- ✅ `requirements.txt`
- ✅ `start.sh`
- ✅ `Procfile`
- ✅ `railway.json`
- ✅ `backend/main.py`
- ✅ `backend/__init__.py`

#### Required Environment Variables:
- ✅ `OPENAI_API_KEY` (your OpenAI API key)

#### Optional Environment Variables:
- `PORT` (automatically set by Railway)
- `ALLOWED_ORIGINS` (defaults to `*`)

### Test Locally First

Before deploying, test locally:

```bash
# Set environment variable
set OPENAI_API_KEY=sk-proj-...

# Run the start script
bash start.sh
```

Or on Windows:
```cmd
set OPENAI_API_KEY=sk-proj-...
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### Still Not Working?

1. **Check Railway Status**: https://status.railway.app
2. **View Logs**: Railway Dashboard → Your Service → Deployments → View Logs
3. **Check Build**: Make sure the build completed successfully
4. **Verify Environment Variables**: Double-check they're set correctly
5. **Try Redeploying**: Sometimes a fresh deploy helps

### Manual Redeploy

1. Go to your Railway project
2. Click on your service
3. Go to **"Deployments"** tab
4. Click **"Redeploy"** on the latest deployment

### Get Help

If you're still stuck:
1. Copy the error message from Railway logs
2. Check the error message against this guide
3. Verify all environment variables are set
4. Make sure your OpenAI API key is valid and has credits

### Quick Checklist

- [ ] `OPENAI_API_KEY` environment variable is set in Railway
- [ ] OpenAI API key is valid (starts with `sk-proj-` or `sk-`)
- [ ] OpenAI account has available credits
- [ ] All files are committed and pushed to GitHub
- [ ] Build completed successfully (check Build Logs)
- [ ] No error messages in Deploy Logs

### Success Indicators

When deployment is successful, you should see:
- ✅ Green checkmark on deployment
- ✅ Service status: "Active"
- ✅ Logs show: "Uvicorn running on http://0.0.0.0:XXXX"
- ✅ Health endpoint works: `https://your-app.railway.app/health`

### Test Your Deployment

Once deployed, test these endpoints:

```bash
# Health check
curl https://your-app.railway.app/health

# Root endpoint
curl https://your-app.railway.app/

# API docs
# Open in browser: https://your-app.railway.app/docs
```

Expected responses:
- `/health`: `{"status":"healthy","documents_count":0,"total_queries":0}`
- `/`: `{"message":"Enterprise Knowledge Assistant API (OpenAI)","status":"running"}`
- `/docs`: Interactive API documentation

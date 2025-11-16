# 🚂 Quick Start: Deploy REVA to Railway

Get your REVA application deployed to Railway in under 10 minutes!

## Prerequisites ✅

- [ ] GitHub/GitLab account with your code pushed
- [ ] Railway account (sign up at https://railway.app)
- [ ] OpenAI API key (get one at https://platform.openai.com/api-keys)

## Step 1: Push to GitHub (2 minutes)

```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

## Step 2: Deploy Backend (3 minutes)

1. Go to https://railway.app/new
2. Click **"Deploy from GitHub repo"**
3. Select your **REVA repository**
4. Railway will automatically detect the configuration ✨

## Step 3: Set Environment Variables (2 minutes)

In your Railway project dashboard:

1. Click on your service
2. Go to **"Variables"** tab
3. Click **"New Variable"**
4. Add:
   ```
   OPENAI_API_KEY = your_openai_api_key_here
   ```
5. Click **"Add"**

That's it! Railway will automatically redeploy.

## Step 4: Test Your Deployment (1 minute)

1. Copy your Railway URL (e.g., `https://your-app.railway.app`)
2. Open in browser: `https://your-app.railway.app/health`
3. You should see:
   ```json
   {
     "status": "healthy",
     "documents_count": 0,
     "total_queries": 0
   }
   ```

## Step 5: Deploy Frontend (Optional, 3 minutes)

### Option A: Separate Frontend Service

1. In Railway, click **"New"** → **"Empty Service"**
2. Connect the same repository
3. Click **"Settings"** → **"Root Directory"** → Set to `frontend`
4. Go to **"Variables"** → Add:
   ```
   REACT_APP_API_URL = https://your-backend-url.railway.app
   ```
5. Railway will auto-detect React and build it

### Option B: Use Backend URL Directly

Just use the backend URL for testing:
- Update `frontend/.env`:
  ```
  REACT_APP_API_URL=https://your-backend-url.railway.app
  ```
- Run locally: `npm start`

## Step 6: Update CORS (1 minute)

Once frontend is deployed:

1. Go to backend service in Railway
2. Update **"Variables"**:
   ```
   ALLOWED_ORIGINS = https://your-frontend-url.railway.app
   ```
3. Save (auto-redeploys)

## 🎉 You're Done!

Your REVA application is now live on Railway!

## Quick Commands

### View Logs
```bash
railway logs
```

### Set Variables via CLI
```bash
railway variables set OPENAI_API_KEY=sk-proj-...
```

### Redeploy
```bash
railway up
```

## Common Issues & Fixes

### ❌ "OPENAI_API_KEY not found"
**Fix:** Add the environment variable in Railway dashboard

### ❌ CORS errors in browser
**Fix:** Update `ALLOWED_ORIGINS` with your frontend URL

### ❌ "Module not found"
**Fix:** Check that `requirements.txt` is in the backend folder

### ❌ Frontend can't connect to backend
**Fix:** Verify `REACT_APP_API_URL` is set correctly

## What's Next?

- [ ] Upload test documents
- [ ] Try asking questions
- [ ] Add custom domain (Railway Settings → Domains)
- [ ] Set up monitoring
- [ ] Invite team members

## Need Help?

- 📖 Detailed Guide: [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)
- ✅ Checklist: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- 🔧 Environment Vars: [RAILWAY_ENV_VARS.md](RAILWAY_ENV_VARS.md)
- 💬 Railway Discord: https://discord.gg/railway

## Cost

- Railway offers **$5 free credit per month**
- REVA typically uses **$2-3/month** for light usage
- Upgrade to paid plan for production use

---

**Pro Tip:** Bookmark your Railway dashboard for easy access to logs and settings!

# Railway Deployment Guide for REVA

This guide will help you deploy the REVA application to Railway.

## Prerequisites

- A Railway account (sign up at https://railway.app)
- Your OpenAI API key
- Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Prepare Your Repository

Make sure all the Railway configuration files are committed:
- `railway.json`
- `nixpacks.toml`
- `Procfile`
- `runtime.txt`
- `backend/requirements.txt`

### 2. Create a New Railway Project

1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select your REVA repository
4. Railway will automatically detect the configuration

### 3. Configure Environment Variables

In your Railway project dashboard:

1. Go to the "Variables" tab
2. Add the following environment variables:

```
OPENAI_API_KEY=your_openai_api_key_here
PORT=8000
ALLOWED_ORIGINS=https://your-frontend-url.railway.app,https://your-custom-domain.com
```

**Important:** Replace `your_openai_api_key_here` with your actual OpenAI API key.

### 4. Deploy Backend

Railway will automatically:
- Install Python dependencies from `backend/requirements.txt`
- Start the FastAPI server using the command in `Procfile`
- Assign a public URL (e.g., `https://your-app.railway.app`)

### 5. Deploy Frontend (Separate Service)

For the frontend, create a separate Railway service:

1. Click "New" → "Empty Service"
2. Connect the same repository
3. Set the root directory to `frontend`
4. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```
5. Railway will detect it's a React app and build it automatically

### 6. Update Frontend API URL

Update `frontend/src/App.js` to use the environment variable:

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

### 7. Update CORS Settings

After deploying the frontend, update the backend's `ALLOWED_ORIGINS` environment variable:

```
ALLOWED_ORIGINS=https://your-frontend-url.railway.app
```

## Alternative: Single Service Deployment

If you want to deploy both frontend and backend as a single service:

1. Build the frontend first
2. Serve the built files from FastAPI
3. Update the start command in `Procfile`

## Monitoring

- Check logs in the Railway dashboard
- Use the `/health` endpoint to verify the backend is running
- Monitor API usage in the Railway metrics

## Troubleshooting

### Backend won't start
- Check that `OPENAI_API_KEY` is set correctly
- Verify all dependencies are in `requirements.txt`
- Check logs for specific error messages

### CORS errors
- Ensure `ALLOWED_ORIGINS` includes your frontend URL
- Check that the frontend is using the correct backend URL

### File uploads not working
- Railway's ephemeral filesystem means uploaded files won't persist
- Consider using Railway's volume storage or external storage (S3, etc.)

## Cost Optimization

- Railway offers a free tier with $5 credit per month
- Backend typically uses minimal resources
- Consider using Railway's sleep feature for development environments

## Custom Domain

1. Go to Settings → Domains in Railway
2. Add your custom domain
3. Update DNS records as instructed
4. Update `ALLOWED_ORIGINS` to include your custom domain

## Security Best Practices

1. Never commit `.env` files with real API keys
2. Use Railway's environment variables for all secrets
3. Regularly rotate your OpenAI API key
4. Set specific CORS origins in production (not "*")
5. Enable Railway's built-in DDoS protection

## Scaling

Railway automatically scales based on traffic. For high-traffic applications:
- Monitor resource usage in the dashboard
- Consider upgrading to a paid plan for better performance
- Implement caching for frequently accessed documents

## Support

- Railway Documentation: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- REVA Issues: [Your GitHub Issues URL]

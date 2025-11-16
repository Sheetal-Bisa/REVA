# Railway Environment Variables Reference

## Backend Service

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | `sk-proj-...` |

### Optional Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `PORT` | Port for the backend server | `8000` | `8000` |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins | `*` | `https://frontend.railway.app,https://example.com` |

### Railway Auto-Provided Variables

Railway automatically provides these variables:
- `RAILWAY_ENVIRONMENT` - Current environment (production/staging)
- `RAILWAY_PROJECT_ID` - Your project ID
- `RAILWAY_SERVICE_ID` - Your service ID
- `RAILWAY_DEPLOYMENT_ID` - Current deployment ID

## Frontend Service

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `https://your-backend.railway.app` |

### Build-Time Variables

These are used during the build process:
- `NODE_ENV` - Automatically set to `production` by Railway
- `PUBLIC_URL` - Base URL for static assets (optional)

## Setting Environment Variables

### Via Railway Dashboard

1. Go to your project in Railway
2. Select the service (backend or frontend)
3. Click on "Variables" tab
4. Click "New Variable"
5. Enter variable name and value
6. Click "Add"

### Via Railway CLI

```bash
# Set a variable
railway variables set OPENAI_API_KEY=sk-proj-...

# Set multiple variables
railway variables set OPENAI_API_KEY=sk-proj-... PORT=8000

# List all variables
railway variables

# Delete a variable
railway variables delete VARIABLE_NAME
```

### Via railway.toml (Not Recommended for Secrets)

```toml
[env]
PORT = "8000"
# Don't put secrets here!
```

## Security Best Practices

1. ✅ **DO**: Use Railway's environment variables for all secrets
2. ✅ **DO**: Set specific CORS origins in production
3. ✅ **DO**: Rotate API keys regularly
4. ❌ **DON'T**: Commit `.env` files with real values
5. ❌ **DON'T**: Use wildcard (`*`) CORS in production
6. ❌ **DON'T**: Expose API keys in frontend code

## Example Configuration

### Development (Local)

**backend/.env**
```bash
OPENAI_API_KEY=sk-proj-...
PORT=8000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

**frontend/.env**
```bash
REACT_APP_API_URL=http://localhost:8000
```

### Production (Railway)

**Backend Service Variables**
```
OPENAI_API_KEY=sk-proj-...
PORT=8000
ALLOWED_ORIGINS=https://reva-frontend.railway.app
```

**Frontend Service Variables**
```
REACT_APP_API_URL=https://reva-backend.railway.app
```

## Troubleshooting

### CORS Errors
- Ensure `ALLOWED_ORIGINS` includes your frontend URL
- Check that there are no trailing slashes
- Verify the protocol (http vs https)

### API Key Not Working
- Verify the key starts with `sk-proj-` or `sk-`
- Check for extra spaces or newlines
- Ensure the key has sufficient credits

### Frontend Can't Connect to Backend
- Verify `REACT_APP_API_URL` is set correctly
- Check that the backend URL is accessible
- Ensure the backend service is running

### Environment Variables Not Updating
- Redeploy the service after changing variables
- Check that variable names match exactly (case-sensitive)
- Clear browser cache for frontend changes

## Reference Links

- [Railway Environment Variables Docs](https://docs.railway.app/develop/variables)
- [Railway CLI Documentation](https://docs.railway.app/develop/cli)
- [OpenAI API Keys](https://platform.openai.com/api-keys)

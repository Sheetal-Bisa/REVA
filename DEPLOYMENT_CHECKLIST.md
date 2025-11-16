# Railway Deployment Checklist

## Pre-Deployment

- [ ] All code is committed to Git repository
- [ ] Repository is pushed to GitHub/GitLab/Bitbucket
- [ ] OpenAI API key is ready
- [ ] Railway account is created

## Backend Deployment

- [ ] Create new Railway project from GitHub repo
- [ ] Set environment variable: `OPENAI_API_KEY`
- [ ] Set environment variable: `PORT=8000`
- [ ] Wait for deployment to complete
- [ ] Copy the backend URL (e.g., `https://your-app.railway.app`)
- [ ] Test backend health: `https://your-app.railway.app/health`

## Frontend Deployment (Option 1: Separate Service)

- [ ] Create new Railway service in the same project
- [ ] Connect to the same repository
- [ ] Set root directory to `frontend`
- [ ] Set environment variable: `REACT_APP_API_URL=<your-backend-url>`
- [ ] Wait for build and deployment
- [ ] Copy the frontend URL

## Frontend Deployment (Option 2: Local Build + Backend Serve)

- [ ] Build frontend locally: `cd frontend && npm run build`
- [ ] Copy build files to backend static folder
- [ ] Update backend to serve static files
- [ ] Deploy backend with frontend included

## Post-Deployment Configuration

- [ ] Update backend `ALLOWED_ORIGINS` with frontend URL
- [ ] Test CORS by accessing frontend and making API calls
- [ ] Upload a test document
- [ ] Ask a test question
- [ ] Verify chat history works
- [ ] Test theme toggle

## Security Hardening

- [ ] Remove wildcard (`*`) from CORS origins
- [ ] Set specific allowed origins
- [ ] Verify `.env` files are not committed
- [ ] Check that API keys are not exposed in frontend code
- [ ] Enable Railway's security features

## Optional Enhancements

- [ ] Add custom domain
- [ ] Set up monitoring/alerts
- [ ] Configure automatic deployments on push
- [ ] Add volume storage for persistent uploads
- [ ] Set up staging environment
- [ ] Configure CDN for frontend assets

## Testing

- [ ] Test document upload functionality
- [ ] Test query/response with multiple documents
- [ ] Test chat session management
- [ ] Test theme switching
- [ ] Test on mobile devices
- [ ] Test error handling (invalid files, API errors)

## Monitoring

- [ ] Check Railway logs for errors
- [ ] Monitor API response times
- [ ] Track OpenAI API usage
- [ ] Set up uptime monitoring (optional)

## Documentation

- [ ] Update README with production URLs
- [ ] Document environment variables
- [ ] Share deployment guide with team
- [ ] Document any custom configurations

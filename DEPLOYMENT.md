# Cloud Deployment Guide for AI Test Case Generator

This guide covers deploying the AI Test Case Generator Flask backend to various cloud platforms.

## 🚀 Deployment Options

### 1. Heroku (Recommended - Easy & Free)

**Step 1: Prepare for Heroku**
```bash
# Install Heroku CLI from https://devcenter.heroku.com/articles/heroku-cli
# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name-here
```

**Step 2: Set Environment Variables**
```bash
heroku config:set AZURE_DEVOPS_ORGANIZATION="your-org-name"
heroku config:set AZURE_DEVOPS_PROJECT="Your Project Name"
heroku config:set AZURE_DEVOPS_PAT="your-azure-devops-pat-token"
heroku config:set OPENAI_API_KEY="your-openai-api-key"
heroku config:set OPENAI_MODEL="gpt-3.5-turbo"
heroku config:set DEBUG="false"
```

**Step 3: Deploy**
```bash
git add Procfile runtime.txt app.json
git commit -m "Add Heroku deployment files"
git push heroku master
```

**Step 4: Update Chrome Extension**
Update the API_BASE_URL in `browser-extension/content.js`:
```javascript
let API_BASE_URL = 'https://your-app-name.herokuapp.com';
```

### 2. Railway (Simple Alternative)

**Step 1: Connect Repository**
1. Go to https://railway.app
2. Connect your GitHub repository
3. Deploy from the repository

**Step 2: Set Environment Variables**
In Railway dashboard, add these variables:
- `AZURE_DEVOPS_ORGANIZATION`
- `AZURE_DEVOPS_PROJECT` 
- `AZURE_DEVOPS_PAT`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `DEBUG=false`

### 3. Render (Free Tier Available)

**Step 1: Create Web Service**
1. Go to https://render.com
2. Connect your GitHub repository
3. Create a new Web Service

**Step 2: Configuration**
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python main_final.py`
- **Environment Variables**: Add the same variables as Heroku

### 4. Google Cloud Platform (App Engine)

**Create app.yaml:**
```yaml
runtime: python311

env_variables:
  AZURE_DEVOPS_ORGANIZATION: "your-org-name"
  AZURE_DEVOPS_PROJECT: "Your Project Name"
  AZURE_DEVOPS_PAT: "your-azure-devops-pat-token"
  OPENAI_API_KEY: "your-openai-api-key"
  OPENAI_MODEL: "gpt-3.5-turbo"
  DEBUG: "false"

automatic_scaling:
  min_instances: 0
  max_instances: 1
```

**Deploy:**
```bash
gcloud app deploy
```

### 5. AWS (Elastic Beanstalk)

**Step 1: Install EB CLI**
```bash
pip install awsebcli
```

**Step 2: Initialize and Deploy**
```bash
eb init
eb create production
eb setenv AZURE_DEVOPS_ORGANIZATION="your-org" AZURE_DEVOPS_PROJECT="Your Project" AZURE_DEVOPS_PAT="your-token" OPENAI_API_KEY="your-key"
eb deploy
```

## 🔧 Chrome Extension Configuration

After deploying to any platform, update the extension:

**Update `browser-extension/content.js`:**
```javascript
// Replace localhost with your deployed URL
let API_BASE_URL = 'https://your-deployed-app-url.com';
```

**Reload the extension in Chrome:**
1. Go to `chrome://extensions/`
2. Click the reload button for your extension
3. Test on an Azure DevOps User Story page

## 🔒 Security Considerations

### Environment Variables (Recommended for Production)
- ✅ **AZURE_DEVOPS_PAT**: Your Azure DevOps Personal Access Token
- ✅ **OPENAI_API_KEY**: Your OpenAI API key  
- ✅ **DEBUG**: Set to "false" for production
- ✅ All sensitive data in environment variables, not in code

### CORS Configuration
The app is already configured with CORS headers to allow cross-origin requests from browser extensions.

## 📊 Platform Comparison

| Platform | Free Tier | Ease of Setup | Auto-scaling | Custom Domain |
|----------|-----------|---------------|--------------|---------------|
| **Heroku** | ✅ (500h/month) | ⭐⭐⭐⭐⭐ | ✅ | ✅ |
| **Railway** | ✅ (Limited) | ⭐⭐⭐⭐⭐ | ✅ | ✅ |
| **Render** | ✅ (Limited) | ⭐⭐⭐⭐ | ✅ | ✅ |
| **Google Cloud** | ✅ (Quota) | ⭐⭐⭐ | ✅ | ✅ |
| **AWS** | ✅ (12 months) | ⭐⭐ | ✅ | ✅ |

## 🚨 Troubleshooting

### Common Issues

**1. Extension can't connect to deployed API:**
- ✅ Check if the deployed URL is accessible in browser
- ✅ Verify CORS headers are working
- ✅ Update API_BASE_URL in extension
- ✅ Reload the Chrome extension

**2. Environment variables not loading:**
- ✅ Verify all required variables are set
- ✅ Check platform-specific variable syntax
- ✅ Restart the application after setting variables

**3. Azure DevOps authentication errors:**
- ✅ Ensure PAT token is correctly set in environment variables
- ✅ Verify token has required permissions
- ✅ Check token hasn't expired

## 📈 Production Recommendations

### Performance
- Use **gunicorn** for production WSGI server
- Enable **caching** for repeated requests
- Set **DEBUG=false** in production

### Monitoring
- Set up **application monitoring** (New Relic, DataDog)
- Configure **error logging** and alerts
- Monitor **API usage** and costs

### Security
- Use **HTTPS** only (most platforms provide this automatically)
- Rotate **API keys** regularly
- Monitor **access logs** for suspicious activity

---

Choose the platform that best fits your needs. **Heroku** is recommended for beginners due to its simplicity and generous free tier.

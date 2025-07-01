# Quick Heroku Deployment Script for AI Test Case Generator (PowerShell)

Write-Host "🚀 AI Test Case Generator - Heroku Deployment Script" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Check if Heroku CLI is installed
if (-not (Get-Command heroku -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Heroku CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "   https://devcenter.heroku.com/articles/heroku-cli" -ForegroundColor Yellow
    exit 1
}

# Check if user is logged in to Heroku
$loginCheck = heroku auth:whoami 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "🔐 Please login to Heroku:" -ForegroundColor Yellow
    heroku login
}

# Get app name from user
$APP_NAME = Read-Host "📝 Enter your Heroku app name (must be unique)"

if ([string]::IsNullOrEmpty($APP_NAME)) {
    Write-Host "❌ App name cannot be empty" -ForegroundColor Red
    exit 1
}

# Create Heroku app
Write-Host "🏗️  Creating Heroku app: $APP_NAME" -ForegroundColor Green
heroku create $APP_NAME

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create app. Name might be taken." -ForegroundColor Red
    exit 1
}

# Get required environment variables
Write-Host ""
Write-Host "🔧 Setting up environment variables..." -ForegroundColor Green
Write-Host "ℹ️  You need:" -ForegroundColor Blue
Write-Host "   1. Azure DevOps Personal Access Token" -ForegroundColor Blue
Write-Host "   2. OpenAI API Key" -ForegroundColor Blue
Write-Host ""

$AZURE_PAT = Read-Host "🔑 Enter your Azure DevOps Personal Access Token" -AsSecureString
$AZURE_PAT = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($AZURE_PAT))

$OPENAI_KEY = Read-Host "🤖 Enter your OpenAI API Key" -AsSecureString
$OPENAI_KEY = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($OPENAI_KEY))

if ([string]::IsNullOrEmpty($AZURE_PAT) -or [string]::IsNullOrEmpty($OPENAI_KEY)) {
    Write-Host "❌ Both tokens are required" -ForegroundColor Red
    exit 1
}

# Optional environment variables
$AZURE_ORG = Read-Host "🏢 Enter default Azure DevOps Organization (optional)"
$AZURE_PROJECT = Read-Host "📁 Enter default Azure DevOps Project (optional)"

# Set environment variables
Write-Host "⚙️  Setting environment variables..." -ForegroundColor Green
heroku config:set "AZURE_DEVOPS_PAT=$AZURE_PAT" -a $APP_NAME
heroku config:set "OPENAI_API_KEY=$OPENAI_KEY" -a $APP_NAME

if (-not [string]::IsNullOrEmpty($AZURE_ORG)) {
    heroku config:set "AZURE_DEVOPS_ORGANIZATION=$AZURE_ORG" -a $APP_NAME
}

if (-not [string]::IsNullOrEmpty($AZURE_PROJECT)) {
    heroku config:set "AZURE_DEVOPS_PROJECT=$AZURE_PROJECT" -a $APP_NAME
}

heroku config:set "FLASK_ENV=production" -a $APP_NAME

# Deploy to Heroku
Write-Host "🚀 Deploying to Heroku..." -ForegroundColor Green
git push heroku cloud-deployment:main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host "🌐 Your app is available at: https://$APP_NAME.herokuapp.com" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Yellow
    Write-Host "   1. Update your Chrome extension API URL to: https://$APP_NAME.herokuapp.com" -ForegroundColor White
    Write-Host "   2. Reload the extension in Chrome" -ForegroundColor White
    Write-Host "   3. Test on an Azure DevOps User Story page" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 To update the extension:" -ForegroundColor Yellow
    Write-Host "   - Open Chrome extension popup" -ForegroundColor White
    Write-Host "   - Change API Base URL to: https://$APP_NAME.herokuapp.com" -ForegroundColor White
    Write-Host "   - Click Save" -ForegroundColor White
} else {
    Write-Host "❌ Deployment failed. Check the output above for errors." -ForegroundColor Red
    exit 1
}

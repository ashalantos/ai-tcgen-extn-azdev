#!/bin/bash

# Quick Heroku Deployment Script for AI Test Case Generator

echo "🚀 AI Test Case Generator - Heroku Deployment Script"
echo "=================================================="

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI not found. Please install it first:"
    echo "   https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if user is logged in to Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo "🔐 Please login to Heroku:"
    heroku login
fi

# Get app name from user
read -p "📝 Enter your Heroku app name (must be unique): " APP_NAME

if [ -z "$APP_NAME" ]; then
    echo "❌ App name cannot be empty"
    exit 1
fi

# Create Heroku app
echo "🏗️  Creating Heroku app: $APP_NAME"
heroku create $APP_NAME

if [ $? -ne 0 ]; then
    echo "❌ Failed to create app. Name might be taken."
    exit 1
fi

# Get required environment variables
echo ""
echo "🔧 Setting up environment variables..."
echo "ℹ️  You need:"
echo "   1. Azure DevOps Personal Access Token"
echo "   2. OpenAI API Key"
echo ""

read -p "🔑 Enter your Azure DevOps Personal Access Token: " AZURE_PAT
read -p "🤖 Enter your OpenAI API Key: " OPENAI_KEY

if [ -z "$AZURE_PAT" ] || [ -z "$OPENAI_KEY" ]; then
    echo "❌ Both tokens are required"
    exit 1
fi

# Optional environment variables
read -p "🏢 Enter default Azure DevOps Organization (optional): " AZURE_ORG
read -p "📁 Enter default Azure DevOps Project (optional): " AZURE_PROJECT

# Set environment variables
echo "⚙️  Setting environment variables..."
heroku config:set AZURE_DEVOPS_PAT="$AZURE_PAT" -a $APP_NAME
heroku config:set OPENAI_API_KEY="$OPENAI_KEY" -a $APP_NAME

if [ ! -z "$AZURE_ORG" ]; then
    heroku config:set AZURE_DEVOPS_ORGANIZATION="$AZURE_ORG" -a $APP_NAME
fi

if [ ! -z "$AZURE_PROJECT" ]; then
    heroku config:set AZURE_DEVOPS_PROJECT="$AZURE_PROJECT" -a $APP_NAME
fi

heroku config:set FLASK_ENV="production" -a $APP_NAME

# Deploy to Heroku
echo "🚀 Deploying to Heroku..."
git push heroku cloud-deployment:main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo "🌐 Your app is available at: https://$APP_NAME.herokuapp.com"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Update your Chrome extension API URL to: https://$APP_NAME.herokuapp.com"
    echo "   2. Reload the extension in Chrome"
    echo "   3. Test on an Azure DevOps User Story page"
    echo ""
    echo "🔧 To update the extension:"
    echo "   - Open Chrome extension popup"
    echo "   - Change API Base URL to: https://$APP_NAME.herokuapp.com"
    echo "   - Click Save"
else
    echo "❌ Deployment failed. Check the output above for errors."
    exit 1
fi

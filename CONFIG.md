# Configuration Setup

## Overview
The application now uses a JSON configuration file to manage all settings including API keys, Azure DevOps configuration, and server settings.

## Setup Instructions

### 1. Create Configuration File
Copy the template configuration file and add your actual credentials:

```bash
cp config.template.json config.json
```

### 2. Edit Configuration
Open `config.json` and update the following values:

#### Azure DevOps Configuration
- `organization`: Your Azure DevOps organization name
- `project`: Your Azure DevOps project name  
- `personal_access_token`: Your Azure DevOps Personal Access Token

#### OpenAI Configuration
- `api_key`: Your OpenAI API key
- `model`: OpenAI model to use (default: gpt-3.5-turbo)
- `max_tokens`: Maximum tokens for responses (default: 1024)
- `temperature`: Creativity level (default: 0.7)

#### Test Case Configuration
- `max_title_length`: Maximum length for test case titles (default: 255)

#### Server Configuration
- `port`: Port to run the Flask server (default: 5000)
- `debug`: Enable debug mode (default: true)

### 3. Example Configuration
```json
{
  "azure_devops": {
    "organization": "mycompany",
    "project": "My Project",
    "personal_access_token": "your-pat-token"
  },
  "openai": {
    "api_key": "sk-...",
    "model": "gpt-3.5-turbo",
    "max_tokens": 1024,
    "temperature": 0.7
  },
  "test_case": {
    "max_title_length": 255
  },
  "server": {
    "port": 5000,
    "debug": true
  }
}
```

## Security Notes
- The `config.json` file is ignored by git to prevent accidental commit of sensitive data
- Use `config.template.json` as a reference for the required structure
- Never commit actual API keys or tokens to version control

## Environment Variables (Alternative)
You can also set configuration via environment variables:
- `AZURE_DEVOPS_ORGANIZATION`
- `AZURE_DEVOPS_PROJECT` 
- `AZURE_DEVOPS_PAT`
- `OPENAI_API_KEY`

The application will first try to load from `config.json`, then fall back to environment variables if the file is not found.

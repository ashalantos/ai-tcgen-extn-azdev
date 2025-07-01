# AI Test Case Generator for Azure DevOps

An intelligent Chrome extension and Flask backend that automatically generates comprehensive test cases for Azure DevOps User Stories using OpenAI's GPT models.

## 🚀 Features

- **🤖 AI-Powered**: Uses OpenAI GPT to generate comprehensive test cases
- **🌐 Multi-Organization Support**: Works across different Azure DevOps organizations and projects
- **📱 One-Click Generation**: Simple browser extension button on User Story pages
- **🔗 Auto-Linking**: Automatically creates and links test cases to user stories
- **🗑️ Smart Deletion**: Delete all generated test cases with one click
- **⚡ Real-time**: Dynamic configuration extraction from page URLs
- **🔒 Secure**: Sensitive credentials stored securely in backend config

## 📁 Project Structure

```
AI-TC-Generator/
├── main_final.py              # Flask backend API
├── config.json               # Configuration file (create from template)
├── config.template.json      # Configuration template
├── CONFIG.md                 # Configuration documentation
├── requirements.txt          # Python dependencies
├── .gitignore               # Git ignore rules
├── browser-extension/       # Chrome extension files
│   ├── manifest.json        # Extension manifest
│   ├── content.js          # Main extension logic
│   ├── styles.css          # Extension styles
│   ├── popup.html          # Extension popup (optional)
│   ├── popup.js            # Extension popup logic (optional)
│   └── README.md           # Extension-specific documentation
└── README.md               # This file
```

## 📦 Files to Include in Repository

### **Essential Files (Minimum Required):**
```
AI-TC-Generator/
├── main_final.py              # ✅ REQUIRED - Flask backend API
├── browser-extension/         # ✅ REQUIRED - Chrome extension
│   ├── manifest.json          # ✅ REQUIRED - Extension manifest
│   ├── content.js             # ✅ REQUIRED - Main extension logic
│   └── styles.css             # ✅ REQUIRED - Extension styles
└── README.md                  # ✅ RECOMMENDED - This documentation
```

### **Complete Repository (Recommended):**
```
AI-TC-Generator/
├── main_final.py              # ✅ Backend API
├── config.template.json       # ✅ Configuration template
├── CONFIG.md                  # ✅ Configuration docs
├── requirements.txt           # ✅ Python dependencies
├── .gitignore                # ✅ Git ignore rules
├── README.md                  # ✅ Complete documentation
└── browser-extension/         # ✅ Chrome extension folder
    ├── manifest.json          # ✅ Extension manifest
    ├── content.js             # ✅ Main extension logic
    ├── styles.css             # ✅ Extension styles
    ├── popup.html             # 🔸 Optional - Extension popup
    ├── popup.js               # 🔸 Optional - Popup logic
    └── README.md              # 🔸 Optional - Extension docs
```

### **Files to EXCLUDE from Repository:**
```
❌ config.json                 # Contains sensitive credentials
❌ __pycache__/               # Python cache files
❌ *.pyc                      # Python compiled files
❌ .env                       # Environment variables
❌ node_modules/              # If using Node.js dependencies
```

> ⚠️ **Important**: Never commit `config.json` with real credentials to any repository!

## 🚀 Repository Setup for Deployment

### **For Git Repository (Public/Private):**

**Step 1: Create Repository with These Files**
```bash
# Clone or create your repository
git clone <your-repo-url>
cd AI-TC-Generator

# Copy these essential files to your repository:
main_final.py                   # ✅ Core Flask backend
config.template.json            # ✅ Configuration template  
CONFIG.md                       # ✅ Configuration guide
requirements.txt                # ✅ Python dependencies
.gitignore                      # ✅ Security (excludes config.json)
README.md                       # ✅ This documentation
browser-extension/
├── manifest.json               # ✅ Extension manifest
├── content.js                  # ✅ Main extension logic
├── styles.css                  # ✅ Extension styles
├── popup.html                  # ✅ Extension popup
├── popup.js                    # ✅ Popup logic
└── README.md                   # ✅ Extension documentation
```

**Step 2: Commit and Push**
```bash
git add .
git commit -m "Initial commit - AI Test Case Generator"
git push origin main
```

### **For Manual Transfer (USB/Network):**

**Create a deployment package with these files:**
```
AI-TC-Generator-Package/
├── main_final.py               # Core backend
├── config.template.json        # Configuration template
├── requirements.txt            # Dependencies
├── README.md                   # Setup instructions
└── browser-extension/          # Complete extension folder
    ├── manifest.json
    ├── content.js
    ├── styles.css
    ├── popup.html
    ├── popup.js
    └── README.md
```

### **Deployment Commands for New Machine:**

**1. Extract/Clone the files**
```bash
# If from Git:
git clone <your-repo-url>
cd AI-TC-Generator

# If from package:
unzip AI-TC-Generator-Package.zip
cd AI-TC-Generator-Package
```

**2. Setup Backend**
```bash
# Create config from template
cp config.template.json config.json
# Edit config.json with your credentials (use notepad, vim, etc.)

# Install dependencies
pip install -r requirements.txt

# Start server
python main_final.py
```

**3. Setup Chrome Extension**
```
1. Open Chrome → chrome://extensions/
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the browser-extension/ folder
5. Pin extension to toolbar
```

**4. Ready to Use!**
```
✅ Navigate to Azure DevOps User Story
✅ Click "Generate Test Cases" button
✅ AI generates and links test cases automatically
```

## 🛠️ Quick Setup for New Systems

If you only have `main_final.py` and the `browser-extension/` folder, follow these steps:

### Step 1: Backend Setup

1. **Create the required files:**

```bash
# Create config.json (replace with your actual values)
cat > config.json << 'EOF'
{
  "azure_devops": {
    "organization": "your-org-name",
    "project": "Your Project Name",
    "personal_access_token": "your-azure-devops-pat-token"
  },
  "openai": {
    "api_key": "your-openai-api-key",
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
EOF

# Create requirements.txt
cat > requirements.txt << 'EOF'
Flask==3.0.0
requests==2.31.0
openai==1.3.0
Werkzeug==3.0.1
EOF
```

2. **Install Python dependencies:**

```bash
pip install -r requirements.txt
```

3. **Start the Flask backend:**

```bash
python main_final.py
```

The server will start on `http://127.0.0.1:5000` with auto-reload enabled.

### Step 2: Chrome Extension Setup

1. **Open Chrome** and navigate to: `chrome://extensions/`

2. **Enable Developer Mode** (toggle in top-right corner)

3. **Click "Load unpacked"**

4. **Select the `browser-extension` folder** from your project directory

5. **Pin the extension** to your Chrome toolbar (optional but recommended)

### Step 3: Usage

1. **Navigate to any Azure DevOps User Story page**
2. **Look for the "Generate Test Cases" button** (appears automatically on User Story pages)
3. **Click the button** to generate and link test cases
4. **Use "Delete Test Cases"** button to remove generated test cases if needed

## 📋 Prerequisites

### Required Accounts & Tokens

1. **Azure DevOps Account** with:
   - Access to the target organization and project
   - Permissions to create/edit work items
   - Personal Access Token (PAT) with "Work Items (Read & Write)" scope

2. **OpenAI Account** with:
   - API key with sufficient credits
   - Access to GPT-3.5-turbo or GPT-4 models

### System Requirements

- **Python 3.8+**
- **Google Chrome** browser
- **Internet connection** for API calls

## ⚙️ Configuration

### Creating Azure DevOps Personal Access Token

1. Go to Azure DevOps → User Settings → Personal Access Tokens
2. Click "New Token"
3. Set expiration and select scopes:
   - ✅ **Work Items** (Read & Write)
4. Copy the generated token

### Getting OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Go to API Keys section
3. Create a new API key
4. Copy the key (starts with `sk-`)

### Configuration File Setup

Create `config.json` from the template:

```json
{
  "azure_devops": {
    "organization": "your-organization-name",
    "project": "Your Project Name", 
    "personal_access_token": "your-azure-devops-pat"
  },
  "openai": {
    "api_key": "sk-your-openai-api-key",
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

> ⚠️ **Security Note**: Never commit `config.json` to version control. The `.gitignore` file is configured to exclude it.

## 🔧 How It Works

### Dynamic Configuration Extraction

The extension automatically extracts Azure DevOps configuration from the current page URL:

- **Supported URL formats:**
  - `https://dev.azure.com/{organization}/{project}/...`
  - `https://{organization}.visualstudio.com/{project}/...`

- **Fallback**: If extraction fails, uses default config from `config.json`

### Workflow

1. **Detection**: Extension detects User Story pages automatically
2. **Extraction**: Extracts organization, project, and work item ID from page
3. **API Call**: Sends data to Flask backend
4. **AI Generation**: Backend calls OpenAI to generate test cases
5. **Creation**: Creates test cases in Azure DevOps
6. **Linking**: Links test cases to the original user story
7. **Notification**: Shows success/error notifications

## 🧪 Test Case Generation

### AI Prompt Engineering

The system uses optimized prompts to generate:
- **Positive test cases** (happy path scenarios)
- **Negative test cases** (error conditions)
- **Edge cases** (boundary conditions)
- **Concise descriptions** (under 200 characters each)

### Test Case Format

Generated test cases include:
- **Title**: Short, descriptive name
- **Steps**: Test execution steps
- **Automatic linking** to source user story

## 🗑️ Test Case Management

### Deletion Features

- **Delete All**: Remove all test cases linked to a user story
- **Confirmation**: Requires user confirmation before deletion
- **Safe Operation**: Only removes test cases, never modifies user stories
- **Notification**: Shows count of deleted test cases

## 🚨 Troubleshooting

### Common Issues

**1. Extension button not appearing:**
- ✅ Ensure you're on a User Story page (not Task/Bug/Epic)
- ✅ Reload the page
- ✅ Check browser console for errors

**2. "Could not connect to API" error:**
- ✅ Verify Flask server is running on port 5000
- ✅ Check server terminal for error messages
- ✅ Test API manually: `curl http://127.0.0.1:5000/health`

**3. "Azure DevOps API error":**
- ✅ Verify PAT token has correct permissions
- ✅ Check organization/project names in config
- ✅ Ensure work item ID is valid

**4. "OpenAI API error":**
- ✅ Verify API key is correct and active
- ✅ Check OpenAI account has sufficient credits
- ✅ Ensure model name is correct (gpt-3.5-turbo)

### Debug Mode

Enable detailed logging by:
1. Setting `"debug": true` in config.json
2. Checking Flask terminal output
3. Using browser Developer Tools (F12) → Console tab

## 🔒 Security Considerations

### Best Practices

- ✅ **Never commit config.json** to version control
- ✅ **Use environment variables** in production
- ✅ **Rotate PAT tokens** regularly
- ✅ **Limit PAT permissions** to minimum required
- ✅ **Monitor OpenAI usage** to prevent unexpected charges
- ✅ **Use HTTPS** in production deployments

### Data Privacy

- **Local Processing**: Sensitive data processed locally
- **API Calls**: Only necessary data sent to OpenAI
- **No Storage**: No user data permanently stored
- **Temporary**: Generated content cached only during execution

## 🌐 Multi-Organization Support

### Key Benefits

- **Zero Configuration**: Works across different Azure DevOps instances
- **Real-time Detection**: Automatically adapts to current page
- **Fallback Safety**: Uses default config if detection fails
- **Seamless Switching**: No need to modify configuration when changing projects

### Supported Organizations

- Any Azure DevOps organization with valid PAT access
- Both `dev.azure.com` and `visualstudio.com` domains
- Public and private projects (with appropriate permissions)

## 📊 API Endpoints

### Backend API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check (HTML response) |
| `/health` | GET | API status (JSON response) |
| `/create-tests` | POST | Generate and create test cases |
| `/delete_tests` | POST | Delete linked test cases |
| `/web` | GET | Web interface for manual testing |

### Request/Response Examples

**Create Test Cases:**
```json
POST /create-tests
{
  "resource": {
    "id": "12345"
  },
  "azure_config": {
    "organization": "extracted-org",
    "project": "extracted-project"
  }
}
```

**Delete Test Cases:**
```json
POST /delete_tests
{
  "work_item_id": "12345",
  "azure_config": {
    "organization": "extracted-org", 
    "project": "extracted-project"
  }
}
```

## 📈 Performance & Limits

### OpenAI API Limits
- **Rate limits** apply based on your OpenAI plan
- **Token usage** varies with user story complexity
- **Typical usage**: 200-500 tokens per request

### Azure DevOps API Limits
- **Rate limits** based on Azure DevOps plan
- **Batch operations** for efficiency
- **Retry logic** for transient failures

## 🤝 Contributing

### Development Setup

1. **Clone the repository**
2. **Install dependencies**: `pip install -r requirements.txt`
3. **Copy config template**: `cp config.template.json config.json`
4. **Configure your tokens** in `config.json`
5. **Start development server**: `python main_final.py`

### Making Changes

- **Backend**: Edit `main_final.py`, server auto-reloads in debug mode
- **Extension**: Modify files in `browser-extension/`, then reload extension in Chrome
- **Testing**: Use `/web` endpoint for manual API testing

## 📝 License

This project is for internal use. Please ensure compliance with:
- OpenAI API Terms of Service
- Azure DevOps API Terms of Service
- Your organization's security policies

## 🔄 Version History

- **v1.0**: Initial release with basic functionality
- **v1.1**: Added delete functionality and improved error handling
- **v1.2**: Added dynamic configuration extraction
- **v1.3**: Enhanced security and multi-organization support

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Flask terminal logs for errors
3. Use browser Developer Tools for extension debugging
4. Verify all configuration values in `config.json`

**Happy Test Case Generating! 🚀**
```

**To get your Personal Access Token:**
1. Go to Azure DevOps → User Settings → Personal Access Tokens
2. Create a new token with the following scopes:
   - Work Items: Read & Write
   - Test Management: Read & Write

### 2. OpenAI Configuration

Update the OpenAI API key in `main_final.py`:

```python
# OpenAI configuration
openai_api_key = "your-openai-api-key"
```

**To get your OpenAI API key:**
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy and paste it into the configuration

## Usage

### Starting the Application

1. **Run the Flask application**
   ```bash
   python main_final.py
   ```

2. **Access the application**
   - Open your web browser
   - Navigate to: `http://127.0.0.1:5000`

### Using the Web Interface

1. **Navigate to the web interface**
   - Go to: `http://127.0.0.1:5000/web`

2. **Enter User Story ID**
   - Enter the Azure DevOps work item ID of your user story
   - Default example ID is "12345"

3. **Generate Test Cases**
   - Click "Create Tests" button
   - The application will:
     - Fetch the user story from Azure DevOps
     - Clean HTML tags from description and acceptance criteria
     - Generate test cases using OpenAI
     - Create test cases in Azure DevOps
     - Link them to the original user story

4. **View Results**
   - **Debug Information**: Shows the cleaned user story content and prompt sent to OpenAI
   - **Created Test Cases**: Lists all successfully created test cases with their IDs
   - **Console Output**: Check the terminal for detailed logs

5. **Delete Test Cases** (Optional)
   - Click "Delete Linked Test Cases" to remove all test cases linked to the user story

### API Endpoints

#### POST `/create-tests`
Creates test cases for a user story.

**Request Body:**
```json
{
  "resource": {
    "id": "12345"
  }
}
```

**Response:**
```json
{
  "created_cases": [
    {"id": "54321", "name": "Test case description"}
  ],
  "output": "Created and linked test case: 54321 | Name: Test case description",
  "user_story_description": "Clean description text",
  "user_story_acceptance_criteria": "Clean acceptance criteria text",
  "prompt": "Generated prompt sent to OpenAI"
}
```

#### POST `/delete_tests`
Removes all test cases linked to a user story.

**Request Body:**
```json
{
  "work_item_id": "12345"
}
```

## How It Works

1. **Fetch User Story**: Retrieves user story details from Azure DevOps using the REST API
2. **Clean Content**: Removes HTML tags and formatting from description and acceptance criteria
3. **Generate Prompt**: Creates a structured prompt for OpenAI with both description and acceptance criteria
4. **AI Generation**: Sends prompt to OpenAI GPT-3.5-turbo to generate test cases
5. **Parse Results**: Extracts test cases from AI response (handles both numbered and bullet formats)
6. **Create Test Cases**: Creates each test case in Azure DevOps with proper linking
7. **Add Comments**: Adds a summary comment to the original user story with created test case IDs

## Supported Test Case Formats

The application can parse test cases in multiple formats:

### Numbered Format (Preferred)
```
1. Test opening modal for risk validation
2. Test fetching data from external endpoint
3. Test error handling for invalid inputs
```

### Bullet Point Format
```
- Test opening modal for risk validation
- Test fetching data from external endpoint  
- Test error handling for invalid inputs
```

## Troubleshooting

### Common Issues

1. **"No work_item_id provided" Error**
   - Ensure you're entering a valid Azure DevOps work item ID
   - Check that the work item exists in your project

2. **OpenAI API Errors**
   - Verify your OpenAI API key is correct
   - Check your OpenAI account has sufficient credits
   - Ensure you have access to GPT-3.5-turbo model

3. **Azure DevOps Authentication Errors**
   - Verify your Personal Access Token is valid
   - Check the token has required permissions (Work Items: Read & Write)
   - Ensure organization and project names are correct

4. **No Test Cases Generated**
   - Check the terminal output for detailed error messages
   - Verify the user story has description and/or acceptance criteria
   - Check that OpenAI returned a response in the expected format

### Debug Information

- **Terminal Output**: Check the console for detailed logs and debug information
- **Web Interface**: Use the "Debug Information" section to see:
  - Cleaned user story description
  - Cleaned acceptance criteria
  - Exact prompt sent to OpenAI
- **Network Tab**: Use browser developer tools to inspect API responses

## File Structure

```
AI-TC-Generator/
├── main_final.py          # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # This file
└── other_files/          # Other project files
```

## Security Notes

- Keep your Personal Access Token and OpenAI API key secure
- Do not commit these credentials to version control
- Consider using environment variables for sensitive configuration
- Regularly rotate your access tokens

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the terminal output for detailed error messages
3. Verify all configuration settings are correct
4. Test with a simple user story first

## License

This project is for internal use. Please ensure compliance with your organization's policies regarding AI tools and external APIs.
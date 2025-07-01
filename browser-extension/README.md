# Browser Extension Installation Instructions

## What this extension does:

This Chrome extension adds a "🤖 Generate Test Cases" button to every User Story page in Azure DevOps. When clicked, it automatically:
1. Extracts the User Story ID from the current page
2. Calls your Flask API to generate test cases
3. Shows the results in a nice popup

## Installation Steps:

1. **Open Chrome and go to Extensions page:**
   - Type `chrome://extensions/` in the address bar
   - OR go to Chrome menu → More tools → Extensions

2. **Enable Developer Mode:**
   - Toggle the "Developer mode" switch in the top right corner

3. **Load the extension:**
   - Click "Load unpacked" button
   - Navigate to the `browser-extension` folder in your project
   - Select the folder and click "Select Folder"

4. **Configure the extension:**
   - Click the extension icon in the Chrome toolbar (🤖)
   - Set the API Base URL to: `http://127.0.0.1:5000`
   - Click "Save Settings"

## How to use:

1. **Start your Flask application:**
   ```bash
   python main_final.py
   ```

2. **Navigate to Azure DevOps:**
   - Go to any User Story in your Azure DevOps project
   - Look for the blue "🤖 Generate Test Cases" button (usually in the header area)

3. **Generate test cases:**
   - Click the "🤖 Generate Test Cases" button
   - Wait for the AI to process (button will show "Generating...")
   - View results in the popup that appears

## Features:

- ✅ **Automatic Detection**: Only shows on User Story pages
- ✅ **Smart Integration**: Blends seamlessly with Azure DevOps UI
- ✅ **Real-time Feedback**: Shows loading states and notifications
- ✅ **Error Handling**: Clear error messages if something goes wrong
- ✅ **Results Display**: Shows created test cases with IDs and names

## Troubleshooting:

1. **Button not appearing:**
   - Make sure you're on a User Story page (not Epic, Task, etc.)
   - Refresh the page and wait a few seconds
   - Check if the extension is enabled in chrome://extensions/

2. **"Could not connect to API" error:**
   - Make sure your Flask app is running on http://127.0.0.1:5000
   - Check the API URL in extension settings
   - Verify the Flask app is accessible by visiting http://127.0.0.1:5000 in your browser

3. **Extension not working after Azure DevOps navigation:**
   - Azure DevOps is a single-page application - sometimes the extension needs a moment to detect page changes
   - If the button disappears, refresh the page

## Notes:

- The extension only works on Azure DevOps domains (dev.azure.com and *.visualstudio.com)
- Your Flask application must be running for the extension to work
- The extension stores your API URL setting locally in Chrome

## Security:

- The extension only has permissions for Azure DevOps sites and your local Flask app
- No data is sent to external servers (except OpenAI via your Flask app)
- All communication is between Azure DevOps, your local Flask app, and OpenAI

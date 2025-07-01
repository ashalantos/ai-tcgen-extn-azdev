# AI Test Case Generator Chrome Extension

This Chrome extension adds AI-powered test case generation and management capabilities to Azure DevOps User Story pages.

## 🚀 Features

- **🤖 Generate Test Cases**: Automatically generates test cases for Azure DevOps User Stories using OpenAI
- **🗑️ Delete Test Cases**: Remove all AI-generated test cases linked to a User Story
- **📋 Modal Results**: View generated test cases in a user-friendly modal dialog
- **✖️ Enhanced Modal**: Close modal with X button, Close button, Escape key, or click outside
- **🌐 Cross-Origin Support**: Handles CORS requirements for Azure DevOps integration
- **📱 Responsive Design**: Works on desktop and mobile screens

## 📦 Installation

1. **Download the Extension:**
   - Download or clone this repository

2. **Open Chrome Extensions:**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top-right corner

3. **Load the Extension:**
   - Click "Load unpacked"
   - Select the `browser-extension` folder
   - The extension should now appear in your extensions list

## ⚙️ Setup

### Backend Service
1. Start the Flask backend service by running `main_final.py`
2. Ensure the service is running on `http://127.0.0.1:5000` (default)
3. Configure your Azure DevOps and OpenAI credentials in the backend

### Extension Configuration
1. Click the extension icon in the Chrome toolbar
2. Configure the API base URL if different from the default
3. Save your settings

## 📖 Usage

### On Azure DevOps User Story Pages:

#### 🤖 Generate Test Cases
1. Navigate to any Azure DevOps User Story page
2. Look for the "Generate Test Cases" button (🤖) in the top-right corner
3. Click the button to generate AI test cases
4. View the results in the modal dialog
5. Test cases are automatically created and linked in Azure DevOps

#### 🗑️ Delete Test Cases
1. Navigate to the same User Story page
2. Click the "Delete Test Cases" button (🗑️) in the top-right corner
3. Confirm the deletion when prompted
4. All AI-generated test cases for that User Story will be removed

### 📋 Modal Features
- **Close Modal**: 
  - Click the "×" button in the header
  - Click the "Close" button in the footer
  - Click outside the modal area
  - Press the Escape key
- **Delete from Modal**: Use the "Delete Test Cases" button in the modal footer
- **View Details**: See test case IDs and names for all generated test cases

## 📍 Button Locations

The extension automatically detects the best location to place the buttons:
1. **Primary**: In the Azure DevOps toolbar (if available)
2. **Fallback**: As floating buttons in the top-right corner of the page

## 🔧 Troubleshooting

### Buttons Not Visible
1. Refresh the page and wait a few seconds
2. Ensure you're on a User Story page (not Task, Bug, etc.)
3. Open browser console and look for "AI-TC-Generator" messages
4. Try running `forceShowAIButton()` in the browser console

### API Connection Issues
1. Verify the Flask backend is running on the correct port
2. Check the extension popup settings for the correct API URL
3. Ensure CORS is properly configured in the backend
4. Check browser console for network errors

### Test Case Generation Issues
1. Verify Azure DevOps credentials are configured in the backend
2. Ensure OpenAI API key is set up correctly
3. Check that the User Story has description and acceptance criteria
4. Review backend logs for detailed error messages

## 🛠️ Development

### Files Structure
```
browser-extension/
├── manifest.json      # Extension configuration
├── content.js         # Main extension logic and UI injection
├── styles.css         # Styling for buttons and modal
├── popup.html         # Extension settings page
├── popup.js           # Settings page functionality
└── README.md          # This file
```

### Testing
- Test on various Azure DevOps User Story pages
- Verify button placement and responsiveness
- Test both generate and delete functionality
- Confirm modal interactions work correctly

### Debugging
Enable debug mode by opening browser console and looking for "AI-TC-Generator" log messages.

## 🔌 API Endpoints Used

- `POST /create-tests` - Generate and create test cases
- `POST /delete_tests` - Delete test cases for a work item

## 🌍 Browser Compatibility

- Chrome 88+
- Microsoft Edge 88+
- Other Chromium-based browsers

## 🆕 Latest Updates

- ✅ **Fixed Modal Close**: All close methods now work properly (X button, Close button, Escape key, click outside)
- ✅ **Delete Button**: Added standalone "Delete Test Cases" button alongside generate button
- ✅ **Enhanced Modal**: Delete functionality available directly in the modal
- ✅ **Better UI**: Improved button placement and styling with consistent colors
- ✅ **Error Handling**: Enhanced user feedback and error messages
- ✅ **Responsive**: Better mobile screen support

## 🔒 Security & Privacy

- Extension only has permissions for Azure DevOps sites and your local Flask app
- No data is sent to external servers (except OpenAI via your Flask app)
- All communication is between Azure DevOps, your local Flask app, and OpenAI
- API keys and credentials are stored securely in the backend, not the extension

## 📝 Notes

- The extension only works on Azure DevOps domains (dev.azure.com and *.visualstudio.com)
- Your Flask application must be running for the extension to work
- The extension stores your API URL setting locally in Chrome
- Generated test cases are linked to the User Story automatically
- Test case deletion only removes AI-generated test cases, not manually created ones

## 🆘 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify the Flask backend is running and accessible
3. Ensure you have proper Azure DevOps and OpenAI credentials configured
4. Try refreshing the page and waiting for the buttons to appear

// Popup script for AI Test Case Generator extension

document.addEventListener('DOMContentLoaded', function() {
    const apiUrlInput = document.getElementById('apiUrl');
    const saveBtn = document.getElementById('saveBtn');
    const status = document.getElementById('status');
    
    // Load saved settings
    chrome.storage.sync.get(['apiBaseUrl'], function(result) {
        if (result.apiBaseUrl) {
            apiUrlInput.value = result.apiBaseUrl;
        }
    });
    
    // Save settings
    saveBtn.addEventListener('click', function() {
        const apiUrl = apiUrlInput.value.trim();
        
        if (!apiUrl) {
            showStatus('Please enter a valid API URL', 'error');
            return;
        }
        
        // Validate URL format
        try {
            new URL(apiUrl);
        } catch (e) {
            showStatus('Please enter a valid URL (e.g., http://127.0.0.1:5000)', 'error');
            return;
        }
        
        // Save to storage
        chrome.storage.sync.set({
            apiBaseUrl: apiUrl
        }, function() {
            showStatus('Settings saved successfully!', 'success');
            
            // Update content scripts with new URL
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs[0] && (tabs[0].url.includes('dev.azure.com') || tabs[0].url.includes('visualstudio.com'))) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'updateApiUrl',
                        apiUrl: apiUrl
                    }).catch(() => {
                        // Ignore errors if content script is not loaded
                    });
                }
            });
        });
    });
    
    function showStatus(message, type) {
        status.textContent = message;
        status.className = `status ${type}`;
        
        setTimeout(() => {
            status.className = 'status hidden';
        }, 3000);
    }
    
    // Test connection button functionality (optional enhancement)
    function testConnection() {
        const apiUrl = apiUrlInput.value.trim();
        
        if (!apiUrl) {
            showStatus('Please enter an API URL first', 'error');
            return;
        }
        
        fetch(`${apiUrl}/`)
            .then(response => {
                if (response.ok) {
                    showStatus('Connection successful!', 'success');
                } else {
                    showStatus('Connection failed - check if the service is running', 'error');
                }
            })
            .catch(error => {
                showStatus('Connection failed - check if the service is running', 'error');
            });
    }
    
    // Add keyboard shortcuts
    apiUrlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveBtn.click();
        }
    });
});

// AI Test Case Generator Content Script
(function() {
    'use strict';

    // Configuration
    let API_BASE_URL = 'http://127.0.0.1:5000';
    
    // Load configuration from storage
    chrome.storage.sync.get(['apiBaseUrl'], function(result) {
        if (result.apiBaseUrl) {
            API_BASE_URL = result.apiBaseUrl;
        }
    });

    // Utility function to extract Azure DevOps configuration from current page
    function extractAzureDevOpsConfig() {
        console.log('AI-TC-Generator: Extracting Azure DevOps configuration from URL...');
        
        // Extract from URL: https://dev.azure.com/{organization}/{project}/_workitems/edit/{id}
        // or: https://{organization}.visualstudio.com/{project}/_workitems/edit/{id}
        const url = window.location.href;
        let organization = null;
        let project = null;
        
        // Pattern 1: dev.azure.com format
        const devAzureMatch = url.match(/https:\/\/dev\.azure\.com\/([^\/]+)\/([^\/]+)\//);
        if (devAzureMatch) {
            organization = devAzureMatch[1];
            project = decodeURIComponent(devAzureMatch[2]);
        }
        
        // Pattern 2: visualstudio.com format
        const vsMatch = url.match(/https:\/\/([^\.]+)\.visualstudio\.com\/([^\/]+)\//);
        if (vsMatch) {
            organization = vsMatch[1];
            project = decodeURIComponent(vsMatch[2]);
        }
        
        // Also try to extract from page elements as fallback
        if (!organization || !project) {
            // Try to get from breadcrumb or page title
            const breadcrumb = document.querySelector('.ms-Nav-groupContent, .breadcrumb, .work-item-form-header');
            if (breadcrumb) {
                const text = breadcrumb.textContent;
                console.log('AI-TC-Generator: Breadcrumb text:', text);
            }
            
            // Try to get from page metadata
            const metaTags = document.querySelectorAll('meta[name]');
            metaTags.forEach(meta => {
                if (meta.name.includes('project') || meta.name.includes('organization')) {
                    console.log(`AI-TC-Generator: Meta tag ${meta.name}: ${meta.content}`);
                }
            });
        }
        
        if (organization && project) {
            console.log(`AI-TC-Generator: ✅ Extracted Azure DevOps config - Org: ${organization}, Project: ${project}`);
            return {
                organization: organization,
                project: project,
                extracted_from_url: true,
                url: url
            };
        } else {
            console.log('AI-TC-Generator: ❌ Could not extract Azure DevOps config from URL');
            return null;
        }
    }

    // Utility function to extract work item ID from URL or page
    function extractWorkItemId() {
        // Try to get from URL first
        const urlMatch = window.location.href.match(/workitems\/edit\/(\d+)/);
        if (urlMatch) {
            return urlMatch[1];
        }

        // Try to get from page elements
        const titleElement = document.querySelector('[data-automation-key="work-item-form-title"]');
        if (titleElement) {
            const titleMatch = titleElement.textContent.match(/(\d+)/);
            if (titleMatch) {
                return titleMatch[1];
            }
        }

        // Try alternative selectors
        const idElement = document.querySelector('.work-item-form-id');
        if (idElement) {
            const idMatch = idElement.textContent.match(/(\d+)/);
            if (idMatch) {
                return idMatch[1];
            }
        }

        return null;
    }

    // Function to check if current page is a user story
    function isUserStoryPage() {
        console.log('AI-TC-Generator: Checking if this is a User Story page...');
        
        // Method 1: Check work item type in various locations
        const workItemTypeSelectors = [
            '[aria-label*="Work item type"]',
            '[data-automation-key="work-item-type-field"]',
            '.work-item-type-icon-container',
            '.work-item-form-type',
            '.wit-form-header .work-item-type'
        ];
        
        for (const selector of workItemTypeSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                const text = element.textContent.toLowerCase();
                console.log(`AI-TC-Generator: Found work item type element: "${text}"`);
                if (text.includes('user story') || text.includes('userstory')) {
                    console.log('AI-TC-Generator: ✅ This is a User Story page');
                    return true;
                }
            }
        }
        
        // Method 2: Check URL for user story indicators
        const url = window.location.href.toLowerCase();
        if (url.includes('user%20story') || url.includes('userstory')) {
            console.log('AI-TC-Generator: ✅ User Story detected in URL');
            return true;
        }
        
        // Method 3: Check page title
        const title = document.title.toLowerCase();
        if (title.includes('user story')) {
            console.log('AI-TC-Generator: ✅ User Story detected in page title');
            return true;
        }
        
        // Method 4: Check for breadcrumb or navigation elements
        const breadcrumbSelectors = [
            '.breadcrumb',
            '.ms-Nav',
            '.work-item-form-header',
            '.work-item-breadcrumb'
        ];
        
        for (const selector of breadcrumbSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.toLowerCase().includes('user story')) {
                console.log('AI-TC-Generator: ✅ User Story detected in breadcrumb');
                return true;
            }
        }
        
        console.log('AI-TC-Generator: ❌ This does not appear to be a User Story page');
        return false;
    }

    // Function to create the AI Test Case button
    function createAITestCaseButton() {
        const button = document.createElement('button');
        button.id = 'ai-test-case-generator-btn';
        button.className = 'ai-tc-button';
        button.innerHTML = `
            <span class="ai-tc-icon">🤖</span>
            <span class="ai-tc-text">Generate Test Cases</span>
            <span class="ai-tc-spinner" style="display: none;">⚪</span>
        `;
        button.title = 'Generate AI Test Cases for this User Story';
        
        button.addEventListener('click', handleGenerateTestCases);
        
        return button;
    }

    // Function to create the Delete Test Cases button
    function createDeleteTestCasesButton() {
        const button = document.createElement('button');
        button.id = 'ai-delete-test-cases-btn';
        button.className = 'ai-tc-button ai-tc-delete-button';
        button.innerHTML = `
            <span class="ai-tc-icon">🗑️</span>
            <span class="ai-tc-text">Delete Test Cases</span>
            <span class="ai-tc-spinner" style="display: none;">⚪</span>
        `;
        button.title = 'Delete AI Generated Test Cases for this User Story';
        
        button.addEventListener('click', handleDeleteTestCases);
        
        return button;
    }

    // Function to handle test case deletion
    async function handleDeleteTestCases(event) {
        event.preventDefault();
        
        const button = event.target.closest('#ai-delete-test-cases-btn');
        const workItemId = extractWorkItemId();
        const azureConfig = extractAzureDevOpsConfig();
        
        if (!workItemId) {
            showNotification('Could not extract work item ID from this page', 'error');
            return;
        }

        if (!azureConfig) {
            showNotification('Could not extract Azure DevOps configuration from this page', 'error');
            return;
        }

        // Confirm deletion
        if (!confirm('Are you sure you want to delete all AI-generated test cases for this user story?')) {
            return;
        }

        // Update button state
        setDeleteButtonLoading(button, true);
        
        try {
            const payload = {
                work_item_id: workItemId,
                azure_config: azureConfig
            };
            
            const response = await fetch(`${API_BASE_URL}/delete_tests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                // Use the improved messaging from the backend
                const message = data.message || 'Operation completed';
                const notificationType = data.deleted_count > 0 ? 'success' : 'info';
                showNotification(message, notificationType);
            } else {
                showNotification(`Error: ${data.message || 'Failed to delete test cases'}`, 'error');
            }
        } catch (error) {
            console.error('Error deleting test cases:', error);
            showNotification('Error: Could not connect to AI Test Case Generator API. Make sure the service is running.', 'error');
        } finally {
            setDeleteButtonLoading(button, false);
        }
    }

    // Function to handle test case generation
    async function handleGenerateTestCases(event) {
        event.preventDefault();
        
        const button = event.target.closest('#ai-test-case-generator-btn');
        const workItemId = extractWorkItemId();
        const azureConfig = extractAzureDevOpsConfig();
        
        if (!workItemId) {
            showNotification('Could not extract work item ID from this page', 'error');
            return;
        }

        if (!azureConfig) {
            showNotification('Could not extract Azure DevOps configuration from this page', 'error');
            return;
        }

        // Update button state
        setButtonLoading(button, true);
        
        try {
            const payload = {
                resource: {
                    id: workItemId
                },
                azure_config: azureConfig
            };
            
            console.log('AI-TC-Generator: Sending payload:', payload);
            
            const response = await fetch(`${API_BASE_URL}/create-tests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                const testCaseCount = data.created_cases ? data.created_cases.length : 0;
                showNotification(`Successfully generated ${testCaseCount} test cases!`, 'success');
                showTestCaseResults(data);
            } else {
                showNotification(`Error: ${data.message || 'Failed to generate test cases'}`, 'error');
            }
        } catch (error) {
            console.error('Error generating test cases:', error);
            showNotification('Error: Could not connect to AI Test Case Generator API. Make sure the service is running.', 'error');
        } finally {
            setButtonLoading(button, false);
        }
    }

    // Function to set button loading state
    function setButtonLoading(button, isLoading) {
        const text = button.querySelector('.ai-tc-text');
        const spinner = button.querySelector('.ai-tc-spinner');
        const icon = button.querySelector('.ai-tc-icon');
        
        if (isLoading) {
            text.textContent = 'Generating...';
            spinner.style.display = 'inline';
            icon.style.display = 'none';
            button.disabled = true;
            button.classList.add('loading');
        } else {
            text.textContent = 'Generate Test Cases';
            spinner.style.display = 'none';
            icon.style.display = 'inline';
            button.disabled = false;
            button.classList.remove('loading');
        }
    }

    // Function to set delete button loading state
    function setDeleteButtonLoading(button, isLoading) {
        const text = button.querySelector('.ai-tc-text');
        const spinner = button.querySelector('.ai-tc-spinner');
        const icon = button.querySelector('.ai-tc-icon');
        
        if (isLoading) {
            text.textContent = 'Deleting...';
            spinner.style.display = 'inline';
            icon.style.display = 'none';
            button.disabled = true;
            button.classList.add('loading');
        } else {
            text.textContent = 'Delete Test Cases';
            spinner.style.display = 'none';
            icon.style.display = 'inline';
            button.disabled = false;
            button.classList.remove('loading');
        }
    }

    // Function to show notifications
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.ai-tc-notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `ai-tc-notification ai-tc-notification-${type}`;
        notification.innerHTML = `
            <span class="ai-tc-notification-text">${message}</span>
            <button class="ai-tc-notification-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Function to show test case results
    function showTestCaseResults(data) {
        if (!data.created_cases || data.created_cases.length === 0) {
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'ai-tc-modal';
        modal.innerHTML = `
            <div class="ai-tc-modal-content">
                <div class="ai-tc-modal-header">
                    <h3>Generated Test Cases</h3>
                    <button class="ai-tc-modal-close">×</button>
                </div>
                <div class="ai-tc-modal-body">
                    <p><strong>Created ${data.created_cases.length} test cases:</strong></p>
                    <ul class="ai-tc-test-cases-list">
                        ${data.created_cases.map(tc => `
                            <li>
                                <strong>ID:</strong> ${tc.id}<br>
                                <strong>Name:</strong> ${tc.name}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="ai-tc-modal-footer">
                    <button class="ai-tc-modal-close-btn">Close</button>
                    <button class="ai-tc-delete-tests-btn">Delete Test Cases</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners for close functionality
        const closeButton = modal.querySelector('.ai-tc-modal-close');
        const closeFooterButton = modal.querySelector('.ai-tc-modal-close-btn');
        const deleteButton = modal.querySelector('.ai-tc-delete-tests-btn');
        
        function closeModal() {
            modal.remove();
        }
        
        closeButton.addEventListener('click', closeModal);
        closeFooterButton.addEventListener('click', closeModal);
        
        // Add event listener for delete functionality
        deleteButton.addEventListener('click', async function() {
            const workItemId = extractWorkItemId();
            const azureConfig = extractAzureDevOpsConfig();
            
            if (!workItemId) {
                showNotification('Could not extract work item ID', 'error');
                return;
            }
            
            if (!azureConfig) {
                showNotification('Could not extract Azure DevOps configuration', 'error');
                return;
            }
            
            // Confirm deletion
            if (!confirm('Are you sure you want to delete all AI-generated test cases for this user story?')) {
                return;
            }
            
            // Disable button and show loading state
            deleteButton.disabled = true;
            deleteButton.textContent = 'Deleting...';
            
            try {
                const payload = {
                    work_item_id: workItemId,
                    azure_config: azureConfig
                };
                
                const response = await fetch(`${API_BASE_URL}/delete_tests`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (response.ok) {
                    // Use the improved messaging from the backend
                    const message = result.message || 'Operation completed';
                    const notificationType = result.deleted_count > 0 ? 'success' : 'info';
                    showNotification(message, notificationType);
                    closeModal();
                } else {
                    showNotification(`Error: ${result.message || 'Failed to delete test cases'}`, 'error');
                    deleteButton.disabled = false;
                    deleteButton.textContent = 'Delete Test Cases';
                }
            } catch (error) {
                console.error('Error deleting test cases:', error);
                showNotification('Error: Could not connect to API to delete test cases', 'error');
                deleteButton.disabled = false;
                deleteButton.textContent = 'Delete Test Cases';
            }
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
        
        // Close modal with Escape key
        function handleEscape(event) {
            if (event.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        }
        document.addEventListener('keydown', handleEscape);
    }

    // Function to insert the button into the page
    function insertButtonIntoPage() {
        console.log('AI-TC-Generator: Attempting to insert buttons...');
        
        // Remove existing buttons if present
        const existingGenerateButton = document.getElementById('ai-test-case-generator-btn');
        const existingDeleteButton = document.getElementById('ai-delete-test-cases-btn');
        const existingContainer = document.querySelector('.ai-tc-buttons-container');
        
        if (existingGenerateButton) {
            console.log('AI-TC-Generator: Removing existing generate button');
            existingGenerateButton.remove();
        }
        if (existingDeleteButton) {
            console.log('AI-TC-Generator: Removing existing delete button');
            existingDeleteButton.remove();
        }
        if (existingContainer) {
            console.log('AI-TC-Generator: Removing existing button container');
            existingContainer.remove();
        }

        // Try multiple locations to insert the buttons
        const insertionPoints = [
            // Primary toolbar locations
            '.work-item-form-header .toolbar-button-group',
            '.work-item-form-header .work-item-form-header-controls',
            '.work-item-form-header .work-item-form-header-toolbar',
            '.toolbar-container .toolbar-button-group',
            // Secondary locations
            '.work-item-form-header',
            '.work-item-form-main-column .work-item-form-header',
            '.work-item-header',
            '.wit-form-header',
            // Fallback locations
            '.work-item-form-content',
            '.work-item-form',
            '.ms-Fabric',
            'body'
        ];

        for (let i = 0; i < insertionPoints.length; i++) {
            const selector = insertionPoints[i];
            const container = document.querySelector(selector);
            if (container) {
                console.log(`AI-TC-Generator: Found insertion point: ${selector}`);
                
                const generateButton = createAITestCaseButton();
                const deleteButton = createDeleteTestCasesButton();
                
                if (selector.includes('toolbar-button-group')) {
                    // Insert as part of the toolbar
                    container.appendChild(generateButton);
                    container.appendChild(deleteButton);
                    console.log('AI-TC-Generator: ✅ Buttons inserted into toolbar');
                } else {
                    // Insert as a separate floating container
                    const buttonContainer = document.createElement('div');
                    buttonContainer.className = 'ai-tc-buttons-container';
                    buttonContainer.style.cssText = `
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        z-index: 10000;
                        background: white;
                        border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                        padding: 8px;
                        display: flex;
                        gap: 8px;
                        flex-direction: column;
                    `;
                    buttonContainer.appendChild(generateButton);
                    buttonContainer.appendChild(deleteButton);
                    document.body.appendChild(buttonContainer);
                    console.log('AI-TC-Generator: ✅ Buttons inserted as floating buttons');
                }
                
                return true;
            } else {
                console.log(`AI-TC-Generator: Selector not found: ${selector}`);
            }
        }
        
        console.log('AI-TC-Generator: ❌ Could not find suitable location to insert buttons');
        return false;
    }

    // Function to initialize the extension
    function initialize() {
        console.log('AI-TC-Generator: Initializing extension...');
        console.log('AI-TC-Generator: Current URL:', window.location.href);
        console.log('AI-TC-Generator: Page title:', document.title);
        
        // Check if this is a user story page
        if (!isUserStoryPage()) {
            console.log('AI-TC-Generator: Not a User Story page, skipping initialization');
            return;
        }

        // Check if work item ID can be extracted
        const workItemId = extractWorkItemId();
        if (!workItemId) {
            console.log('AI-TC-Generator: Could not extract work item ID');
            // Still try to insert button for debugging
        } else {
            console.log(`AI-TC-Generator: Found User Story ${workItemId}`);
        }
        
        // Insert the buttons
        const buttonsInserted = insertButtonIntoPage();
        if (buttonsInserted) {
            console.log('AI-TC-Generator: ✅ Extension initialized successfully');
        } else {
            console.log('AI-TC-Generator: ⚠️ Extension initialized but button insertion failed');
        }
    }

    // Observer to handle dynamic content loading
    function setupObserver() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if we're on a user story page and buttons are not present
                    if (isUserStoryPage() && 
                        (!document.getElementById('ai-test-case-generator-btn') || 
                         !document.getElementById('ai-delete-test-cases-btn'))) {
                        setTimeout(initialize, 1000); // Delay to ensure page is fully loaded
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initialize, 2000);
            setupObserver();
        });
    } else {
        setTimeout(initialize, 2000);
        setupObserver();
    }

    // Also try to initialize on URL changes (for SPAs)
    let currentUrl = window.location.href;
    setInterval(function() {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            setTimeout(initialize, 3000); // Longer delay for navigation
        }
    }, 1000);

    // Add global function for manual testing
    window.forceShowAIButton = function() {
        console.log('AI-TC-Generator: Force showing buttons...');
        const generateButton = createAITestCaseButton();
        const deleteButton = createDeleteTestCasesButton();
        const container = document.createElement('div');
        container.className = 'ai-tc-buttons-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 8px;
            display: flex;
            gap: 8px;
            flex-direction: column;
        `;
        container.appendChild(generateButton);
        container.appendChild(deleteButton);
        document.body.appendChild(container);
        console.log('AI-TC-Generator: Buttons force-inserted!');
    };

    // Add console message for debugging
    console.log('AI-TC-Generator: Content script loaded! To manually show buttons, run: forceShowAIButton()');

})();

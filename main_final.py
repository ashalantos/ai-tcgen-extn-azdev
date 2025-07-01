from flask import Flask, request, jsonify, make_response
import subprocess
import base64
import requests
import openai
import re
import json
import os

app = Flask(__name__)

# Load configuration from JSON file or environment variables
def load_config():
    # Check if we're in a cloud deployment (environment variables available)
    if os.environ.get('AZURE_DEVOPS_PAT'):
        print("Loading configuration from environment variables (cloud deployment)")
        return {
            "azure_devops": {
                "organization": os.environ.get('AZURE_DEVOPS_ORGANIZATION', 'default-org'),
                "project": os.environ.get('AZURE_DEVOPS_PROJECT', 'Default Project'),
                "personal_access_token": os.environ.get('AZURE_DEVOPS_PAT')
            },
            "openai": {
                "api_key": os.environ.get('OPENAI_API_KEY'),
                "model": os.environ.get('OPENAI_MODEL', 'gpt-3.5-turbo'),
                "max_tokens": int(os.environ.get('OPENAI_MAX_TOKENS', '1024')),
                "temperature": float(os.environ.get('OPENAI_TEMPERATURE', '0.7'))
            },
            "test_case": {
                "max_title_length": int(os.environ.get('TEST_CASE_MAX_TITLE_LENGTH', '255'))
            },
            "server": {
                "port": int(os.environ.get('PORT', '5000')),
                "debug": os.environ.get('DEBUG', 'false').lower() == 'true'
            }
        }
    else:
        # Local development - use config.json
        print("Loading configuration from config.json (local development)")
        config_path = os.path.join(os.path.dirname(__file__), 'config.json')
        try:
            with open(config_path, 'r') as config_file:
                return json.load(config_file)
        except FileNotFoundError:
            print("Error: config.json file not found. Please create it with the required configuration.")
            raise
        except json.JSONDecodeError:
            print("Error: Invalid JSON in config.json file.")
            raise

# Load configuration
config = load_config()

# Extract configuration variables
organization = config['azure_devops']['organization']
project = config['azure_devops']['project']
personal_access_token = config['azure_devops']['personal_access_token']
openai_api_key = config['openai']['api_key']
openai_model = config['openai']['model']
openai_max_tokens = config['openai']['max_tokens']
openai_temperature = config['openai']['temperature']
max_title_length = config['test_case']['max_title_length']
server_port = config['server']['port']
server_debug = config['server']['debug']

# Set OpenAI API key
openai.api_key = openai_api_key

print(f"Configuration loaded successfully:")
print(f"- Azure DevOps Org: {organization}")
print(f"- Azure DevOps Project: {project}")
print(f"- OpenAI Model: {openai_model}")
print(f"- Server Port: {server_port}")

# Simple and direct CORS handling
@app.after_request
def after_request(response):
    print(f"AFTER_REQUEST: Method={request.method}, Origin={request.headers.get('Origin')}")
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
    print(f"AFTER_REQUEST: Added headers: {dict(response.headers)}")
    return response

print("Simple CORS handling enabled")

def get_user_story(work_item_id, azure_config=None):
    # Use dynamic config if provided, fallback to config.json
    org = azure_config.get('organization') if azure_config else organization
    proj = azure_config.get('project') if azure_config else project
    
    url = f"https://dev.azure.com/{org}/{proj}/_apis/wit/workitems/{work_item_id}?api-version=7.0"
    pat_bytes = f":{personal_access_token}".encode("utf-8")
    pat_base64 = base64.b64encode(pat_bytes).decode("utf-8")
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Basic {pat_base64}"
    }
    
    print(f"Fetching work item {work_item_id} from org: {org}, project: {proj}")
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

def generate_test_cases(prompt):
    print("=== DEBUG INFO ===")
    print(f"Prompt: {prompt}")
    print("==================")
    try:
        response = openai.chat.completions.create(
            model=openai_model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=openai_max_tokens,
            temperature=openai_temperature
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print("Error generating test cases with OpenAI API:", e)
        return "[ERROR: Could not generate test cases due to OpenAI API error.]"

def attach_test_cases(work_item_id, created_cases, azure_config=None):
    # Use dynamic config if provided, fallback to config.json
    org = azure_config.get('organization') if azure_config else organization
    proj = azure_config.get('project') if azure_config else project
    
    url = f"https://dev.azure.com/{org}/{proj}/_apis/wit/workitems/{work_item_id}?api-version=7.0"
    pat_bytes = f":{personal_access_token}".encode("utf-8")
    pat_base64 = base64.b64encode(pat_bytes).decode("utf-8")
    headers = {
        "Content-Type": "application/json-patch+json",
        "Authorization": f"Basic {pat_base64}"
    }
    # Format comment as requested
    comment_lines = ["Created Test Cases:"]
    comment_lines += [f"ID: {tc['id']} | Name: {tc['name']}" for tc in created_cases]
    comment = '\n'.join(comment_lines)
    print("Comment Added :")
    print(comment)  # Print the comment to the console
    patch_document = [
        {
            "op": "add",
            "path": "/fields/System.History",
            "value": comment
        }
    ]
    response = requests.patch(url, headers=headers, json=patch_document)
    response.raise_for_status()
    return response.json()

def create_test_case(title, steps, user_story_id, azure_config=None):
    # Truncate title if it's too long (Azure DevOps has field limits)
    if len(title) > max_title_length:
        title = title[:max_title_length-3] + "..."
        print(f"Truncated long title to: {title}")
    
    # Use dynamic config if provided, fallback to config.json
    org = azure_config.get('organization') if azure_config else organization
    proj = azure_config.get('project') if azure_config else project
    
    url = f"https://dev.azure.com/{org}/{proj}/_apis/wit/workitems/$Test%20Case?api-version=7.0"
    pat_bytes = f":{personal_access_token}".encode("utf-8")
    pat_base64 = base64.b64encode(pat_bytes).decode("utf-8")
    headers = {
        "Content-Type": "application/json-patch+json",
        "Authorization": f"Basic {pat_base64}"
    }
    patch_document = [
        {"op": "add", "path": "/fields/System.Title", "value": title},
        {"op": "add", "path": "/fields/Microsoft.VSTS.TCM.Steps", "value": steps},
        {"op": "add", "path": "/relations/-", "value": {
            "rel": "Microsoft.VSTS.Common.TestedBy-Forward",
            "url": f"https://dev.azure.com/{org}/{proj}/_apis/wit/workItems/{user_story_id}",
            "attributes": {"comment": "Linked to user story"}
        }}
    ]
    
    try:
        response = requests.post(url, headers=headers, json=patch_document)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as e:
        print(f"Error creating test case: {e}")
        print(f"Response content: {response.text}")
        print(f"Title length: {len(title)}")
        print(f"Title: {title}")
        raise

def delete_existing_test_cases(user_story_id, azure_config=None):
    org = azure_config.get('organization') if azure_config else organization
    proj = azure_config.get('project') if azure_config else project
    
    url = f"https://dev.azure.com/{org}/{proj}/_apis/wit/workitems/{user_story_id}?$expand=relations&api-version=7.0"
    pat_bytes = f":{personal_access_token}".encode("utf-8")
    pat_base64 = base64.b64encode(pat_bytes).decode("utf-8")
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Basic {pat_base64}"
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    work_item = response.json()
    if "relations" in work_item:
        for rel in work_item["relations"]:
            if rel["rel"] == "Microsoft.VSTS.Common.TestedBy-Forward":
                tc_url = rel["url"]
                tc_id = tc_url.split("/")[-1]
                del_url = f"https://dev.azure.com/{org}/{proj}/_apis/wit/workitems/{tc_id}?api-version=7.0"
                del_headers = headers.copy()
                del_headers["Content-Type"] = "application/json"
                del_response = requests.delete(del_url, headers=del_headers)
                del_response.raise_for_status()
                print(f"Deleted old test case: {tc_id}")

def clean_html_tags(text):
    """Remove HTML tags and decode HTML entities from text"""
    if not text:
        return ""
    # Remove HTML tags
    clean_text = re.sub('<.*?>', '', text)
    # Replace common HTML entities
    clean_text = clean_text.replace('&nbsp;', ' ')
    clean_text = clean_text.replace('&amp;', '&')
    clean_text = clean_text.replace('&lt;', '<')
    clean_text = clean_text.replace('&gt;', '>')
    clean_text = clean_text.replace('&quot;', '"')
    clean_text = clean_text.replace('&#39;', "'")
    # Clean up extra whitespace
    clean_text = re.sub(r'\s+', ' ', clean_text).strip()
    return clean_text

@app.route('/create-tests', methods=['POST', 'OPTIONS'])
def create_tests():
    print(f"Handling {request.method} request for /create-tests from origin: {request.headers.get('Origin')}")
    
    if request.method == 'OPTIONS':
        return ''
    
    data = request.json
    resource = data.get('resource', {})
    work_item_id = resource.get('id')
    azure_config = data.get('azure_config')  # Get dynamic Azure config from request
    
    if azure_config:
        print(f"Using dynamic Azure config - Org: {azure_config.get('organization')}, Project: {azure_config.get('project')}")
    else:
        print("No dynamic Azure config provided, using default config")

    if work_item_id:
        user_story_obj = get_user_story(work_item_id, azure_config)
        description = clean_html_tags(user_story_obj["fields"].get("System.Description", ""))
        acceptance_criteria = clean_html_tags(user_story_obj["fields"].get("Microsoft.VSTS.Common.AcceptanceCriteria", ""))
        
        user_story_combined = f"Description: {description}\n\nAcceptance Criteria: {acceptance_criteria}"
        prompt = f"""Generate concise, one-liner test cases in the following format:
1. <short description - max 200 characters>
2. <short description - max 200 characters>
...

Requirements:
- Keep each test case description under 200 characters
- Use clear, actionable language
- Cover positive, negative, and edge cases
- Generate comprehensive test coverage

Use the following user story and acceptance criteria to create the test cases:
{user_story_combined}

Include all types of test cases: positive, negative, and edge cases. Generate as many relevant test cases as possible to ensure comprehensive coverage"""
        
        test_cases = generate_test_cases(prompt)
        print("Generated test cases:\n")
        print(test_cases)
        ###delete_existing_test_cases(work_item_id)
        
        # Extract test cases - handle both numbered (1. 2. 3.) and bullet point (- * •) formats
        numbered_list = re.findall(r'\d+\.\s*([^\n]+)', test_cases)
        bullet_list = re.findall(r'[-*•]\s*([^\n]+)', test_cases)
        
        # Combine both lists, prioritize numbered format if both exist
        if numbered_list:
            headers_list = numbered_list
            print("Extracted test case names (numbered format):")
        elif bullet_list:
            headers_list = bullet_list
            print("Extracted test case names (bullet format):")
        else:
            headers_list = []
            print("No test cases found in expected format")
        
        print(f"Found {len(headers_list)} test cases:")
        for i, header in enumerate(headers_list, 1):
            print(f"  {i}. {header.strip()}")
            
        created_cases = []
        output_lines = []
        for idx, header in enumerate(headers_list, 1):
            title = header.strip()
            steps = header.strip()
            tc = create_test_case(title, steps, work_item_id, azure_config)
            created_cases.append({'id': tc['id'], 'name': title})
            line = f"Created and linked test case: {tc['id']} | Name: {title}"
            output_lines.append(line)
            print(line)
        attach_test_cases(work_item_id, created_cases, azure_config)
        print("Test cases generated, linked, and attached successfully.")
        return jsonify({
            'created_cases': created_cases, 
            'output': '\n'.join(output_lines),
            'user_story_description': description,
            'user_story_acceptance_criteria': acceptance_criteria,
            'prompt': prompt
        })
    
    return jsonify({'message': 'No work_item_id provided'}), 400

@app.route('/', methods=['GET'])
def home():
    print("Root route accessed!")
    return '<h2>Flask API is running! Use POST /create-tests to activate the workflow.</h2>'

@app.route('/web', methods=['GET'])
def web():
    return '''
    <html>
    <head><title>Trigger Workflow</title></head>
    <body>
        <h2>Trigger Azure DevOps Workflow</h2>
        <label for="workItemId">User Story ID:</label>
        <input type="text" id="workItemId" value="12345" />
        <button onclick="triggerWorkflow()">Create Tests</button>
        <button onclick="deleteTests()">Delete Linked Test Cases</button>
        
        <h3>Debug Information:</h3>
        <div id="debugInfo" style="background-color: #f0f0f0; padding: 10px; margin: 10px 0; border-radius: 5px; display: none;">
            <h4>User Story Description:</h4>
            <pre id="userStoryDescription" style="background-color: white; padding: 10px; border-radius: 3px;"></pre>
            <h4>User Story Acceptance Criteria:</h4>
            <pre id="userStoryAcceptanceCriteria" style="background-color: white; padding: 10px; border-radius: 3px;"></pre>
            <h4>Prompt Sent to OpenAI:</h4>
            <pre id="prompt" style="background-color: white; padding: 10px; border-radius: 3px;"></pre>
        </div>
        
        <pre id="result"></pre>
        <h3>Created Test Cases:</h3>
        <ul id="testcases"></ul>
        <script>
        function triggerWorkflow() {
            var workItemId = document.getElementById('workItemId').value;
            fetch('/create-tests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resource: {
                        id: workItemId
                    }
                })
            })
            .then(response => response.json())
            .then(data => {
                // Display debug information
                if (data.user_story_description && data.prompt) {
                    document.getElementById('debugInfo').style.display = 'block';
                    document.getElementById('userStoryDescription').textContent = data.user_story_description || 'No description available';
                    document.getElementById('userStoryAcceptanceCriteria').textContent = data.user_story_acceptance_criteria || 'No acceptance criteria available';
                    document.getElementById('prompt').textContent = data.prompt;
                }
                
                let output = data.output || '';
                let comment = '';
                if (data.created_cases && data.created_cases.length > 0) {
                    comment = 'Created Test Cases:\\n';
                    for (let tc of data.created_cases) {
                        comment += `ID: ${tc.id} | Name: ${tc.name}\\n`;
                    }
                }
                let pre = document.createElement('pre');
                pre.textContent = comment + (output ? ('\\n' + output) : '');
                let resultDiv = document.getElementById('result');
                resultDiv.innerHTML = '';
                resultDiv.appendChild(pre);
                let testcases = [];
                if (data.output) {
                    let lines = data.output.split('\\n');
                    for (let line of lines) {
                        let match = line.match(/Created and linked test case: (\\d+) \\| Name: (.+)$/);
                        if (match) {
                            testcases.push({id: match[1], name: match[2]});
                        }
                    }
                }
                let ul = document.getElementById('testcases');
                ul.innerHTML = '';
                for (let tc of testcases) {
                    let li = document.createElement('li');
                    li.textContent = `ID: ${tc.id} | Name: ${tc.name}`;
                    ul.appendChild(li);
                }
            })
            .catch(err => {
                document.getElementById('result').textContent = 'Error: ' + err;
            });
        }
        function deleteTests() {
            var workItemId = document.getElementById('workItemId').value;
            fetch('/delete_tests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ work_item_id: workItemId })
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('result').textContent = JSON.stringify(data, null, 2);
                document.getElementById('testcases').innerHTML = '';
                document.getElementById('debugInfo').style.display = 'none';
            })
            .catch(err => {
                document.getElementById('result').textContent = 'Error: ' + err;
            });
        }
        </script>
    </body>
    </html>
    '''

@app.route('/delete_tests', methods=['POST'])
def delete_tests():
    data = request.json
    work_item_id = data.get('work_item_id', 12345)
    azure_config = data.get('azure_config')  # Get dynamic Azure config from request
    
    if not work_item_id:
        return jsonify({'message': 'No work_item_id provided'}), 400
    
    # Use dynamic config if provided, otherwise fall back to default
    org = azure_config.get('organization') if azure_config else organization
    proj = azure_config.get('project') if azure_config else project
    
    if azure_config:
        print(f"Using dynamic Azure config for delete - Org: {org}, Project: {proj}")
    else:
        print("No dynamic Azure config provided for delete, using default config")
    
    url = f"https://dev.azure.com/{org}/{proj}/_apis/wit/workitems/{work_item_id}?$expand=relations&api-version=7.0"
    pat_bytes = f":{personal_access_token}".encode("utf-8")
    pat_base64 = base64.b64encode(pat_bytes).decode("utf-8")
    headers = {
        "Content-Type": "application/json-patch+json",
        "Authorization": f"Basic {pat_base64}"
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    work_item = response.json()
    patch_document = []
    removed = 0
    
    if "relations" in work_item:
        for idx, rel in reversed(list(enumerate(work_item["relations"]))):
            if "testedby" in rel["rel"].lower():
                patch_document.append({
                    "op": "remove",
                    "path": f"/relations/{idx}"
                })
        if patch_document:
            patch_url = f"https://dev.azure.com/{org}/{proj}/_apis/wit/workitems/{work_item_id}?api-version=7.0"
            patch_response = requests.patch(patch_url, headers=headers, json=patch_document)
            patch_response.raise_for_status()
            removed = len(patch_document)
            print(f"Successfully unlinked {removed} test cases from user story {work_item_id}")
    
    # Return appropriate message based on results
    if removed > 0:
        return jsonify({
            'message': 'Test Cases Deleted Successfully', 
            'deleted_count': removed,
            'success': True
        })
    else:
        return jsonify({
            'message': 'No Test Cases Found To Delete',
            'deleted_count': 0,
            'success': True
        })

@app.route('/health', methods=['GET', 'OPTIONS'])
def health_check():
    """Simple health check endpoint to test CORS"""
    return jsonify({
        'status': 'ok',
        'message': 'AI Test Case Generator API is running',
        'cors_enabled': True
    })

if __name__ == '__main__':
    # Use PORT environment variable for cloud deployments (Heroku, etc.)
    port = int(os.environ.get('PORT', server_port))
    host = '0.0.0.0'  # Allow external connections
    app.run(host=host, port=port, debug=server_debug)
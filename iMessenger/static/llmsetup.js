// llmSetup.js

// Export isConnected so it can be used in other modules
export let isConnected = false; // Declare isConnected as a variable that can be exported
export let currentModel = '';

// Function to update the connection status
export function updateConnectionStatus(message, connected) {
    const connectionStatus = document.getElementById('connection-status');
    const connectButton = document.getElementById('connect-button');
    const serverUrlInput = document.getElementById('server-url');
    const userInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button-person2');

    connectionStatus.textContent = message;
    connectionStatus.style.color = connected ? 'var(--accent-color)' : '#f44336';
    connectButton.textContent = connected ? 'Disconnect' : 'Connect';
    serverUrlInput.disabled = connected;
    userInput.disabled = !connected;
    sendButton.disabled = !connected;
}

// Function to connect to the server
export async function connectToServer() {
    const serverUrlInput = document.getElementById('server-url');
    const serverUrl = serverUrlInput.value.trim();
    if (!serverUrl) {
        updateConnectionStatus('Please enter a valid server address', false);
        return;
    }

    try {
        updateConnectionStatus('Connecting...', false);
        const response = await fetch(`${serverUrl}/v1/models`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Server response was not ok');
        }

        const data = await response.json();
        if (data && data.data && data.data.length > 0) {
            currentModel = data.data[0].id;
            isConnected = true;
            updateConnectionStatus('Connected', true);
            return true;
        } else {
            throw new Error('No models available');
        }
    } catch (error) {
        console.error('Error:', error);
        updateConnectionStatus('Failed to connect', false);
        return false;
    }
}

// Function to disconnect from the server
export function disconnectFromServer() {
    isConnected = false;
    updateConnectionStatus('Disconnected', false);
    currentModel = '';
}

// Event listener for the Connect/Disconnect button
export function setupConnectionButton() {
    const connectButton = document.getElementById('connect-button');
    connectButton.addEventListener('click', () => {
        if (isConnected) {
            disconnectFromServer();
        } else {
            connectToServer();
        }
    });
}
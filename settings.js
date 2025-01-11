import { populateChatSelect, markChatAsModified } from './chat.js';
import { loadTextFile } from './textInput.js'; // Import the loadTextFile function

export function openSettings() {
    const settingsMenu = document.getElementById('settings-menu');
    settingsMenu.style.display = 'block';
    populateChatSelect(); // Populate the chat select dropdown

    // Add event listener for the text file input
    const fileInput = document.getElementById('text-file-input');
    fileInput.addEventListener('change', loadTextFile); // Use the imported function

    // Add a click event listener to the document to close settings when clicking outside
    document.addEventListener('click', handleClickOutside);
}

export function closeSettings() {
    const settingsMenu = document.getElementById('settings-menu');
    settingsMenu.style.display = 'none';

    // Remove the click event listener when the settings menu is closed
    document.removeEventListener('click', handleClickOutside);
}

// Function to handle clicks outside the settings menu
function handleClickOutside(event) {
    const settingsMenu = document.getElementById('settings-menu');
    const settingsButton = document.getElementById('settings-button'); // Assuming there's a settings button

    // Check if the click is outside the settings menu and not on the settings button
    if (!settingsMenu.contains(event.target) && !settingsButton.contains(event.target)) {
        closeSettings(); // Close the settings menu
    }
}

// Function to handle changing the chat label
export function changeChatLabel() {
    const newLabel = prompt('Enter a new chat label:');
    if (newLabel) {
        document.getElementById('chat-title').textContent = newLabel.trim();
        markChatAsModified(); // Mark the chat as modified
    }
}

export function toggleDarkMode() {
    const body = document.body;
    const phoneScreen = document.querySelector('.phone-screen');
    const chatHeader = document.querySelector('.chat-header');
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.chat-input');
    const messageInput = document.querySelector('.chat-input input');

    body.classList.toggle('light-mode');
    phoneScreen.classList.toggle('light-mode');
    chatHeader.classList.toggle('light-mode');
    chatMessages.classList.toggle('light-mode');
    chatInput.classList.toggle('light-mode');
    messageInput.classList.toggle('light-mode');

    const isDarkMode = body.classList.contains('light-mode');
    localStorage.setItem('light-mode', isDarkMode);
}

// Attach the function to the window object for global access
window.changeChatLabel = changeChatLabel;
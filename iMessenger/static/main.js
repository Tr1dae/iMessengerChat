import { openDB } from './db.js';
import { sendMessage, saveChat, loadChat, deleteChat, newChat, getCurrentChatId, getChatModifiedStatus, clearChat } from './chat.js';
import { openSettings, closeSettings, changeChatLabel} from './settings.js'; // Import changeChatLabel
import { setupContextMenu, editSelected, deleteSelected, swapSender, replaceWithImage, insertMessageAfter } from './contextMenu.js';
import { setupDragAndDrop } from './dragAndDrop.js';
import { debounce, scalePhoneScreen } from './utils.js';

// Initialize the app
window.onload = async () => {
    try {
        await openDB(); // Initialize IndexedDB
        console.log('Database initialized');

        scalePhoneScreen(); // Ensure the phone screen is scaled correctly

        const currentChatId = getCurrentChatId(); // Debugging line
        console.log('Initial chat ID:', currentChatId); // Debugging line

        await loadChat(currentChatId); // Load the default chat
    } catch (error) {
        console.error('Failed to initialize database:', error);
    }

    // Set up event listeners
    setupEventListeners();
    setupContextMenu();
    setupDragAndDrop();
};

document.getElementById('message-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent the default behavior (e.g., adding a new line)

        if (e.ctrlKey) {
            // Ctrl+Enter: Simulate click on send-button-person1
            document.getElementById('send-button-person1').click();
        } else {
            // Enter: Simulate click on send-button-person2
            document.getElementById('send-button-person2').click();
        }
    }
});

// Function to set up all event listeners
function setupEventListeners() {
    // Send message buttons
    document.getElementById('send-button-person1').addEventListener('click', () => sendMessage('person1'));
    document.getElementById('send-button-person2').addEventListener('click', () => sendMessage('person2'));

    // Resizing
    window.addEventListener('resize', debounce(scalePhoneScreen, 100));
    window.addEventListener('load', scalePhoneScreen);
    window.addEventListener('resize', scalePhoneScreen);

    // Settings menu buttons
    document.getElementById('settings-button').addEventListener('click', openSettings);
    document.getElementById('close-settings-button').addEventListener('click', closeSettings);
    document.getElementById('change-label-button').addEventListener('click', changeChatLabel); // New event listener
    // document.getElementById('toggle-dark-mode-button').addEventListener('click', toggleDarkMode);


    // Get references to the screens and buttons
    const mainSettingsScreen = document.getElementById('main-settings-screen');
    const liveChatSettingsScreen = document.getElementById('live-chat-settings-screen');
    const liveChatSettingsButton = document.getElementById('live-chat-settings-button');
    const backToMainSettingsButton = document.getElementById('back-to-main-settings-button');
    const closeSettingsButton = document.getElementById('close-settings-button');

    // Function to switch to Live Chat Settings
    liveChatSettingsButton.addEventListener('click', () => {
        mainSettingsScreen.style.display = 'none'; // Hide main settings
        liveChatSettingsScreen.classList.add('active'); // Show live chat settings
    });

    // Function to switch back to Main Settings
    backToMainSettingsButton.addEventListener('click', () => {
        liveChatSettingsScreen.classList.remove('active'); // Hide live chat settings
        mainSettingsScreen.style.display = 'block'; // Show main settings
    });

    // Close settings menu (same behavior for both screens)
    closeSettingsButton.addEventListener('click', () => {
        const settingsMenu = document.getElementById('settings-menu');
        settingsMenu.style.display = 'none'; // Hide the entire settings menu
        mainSettingsScreen.style.display = 'block'; // Ensure main settings are visible when reopened
        liveChatSettingsScreen.classList.remove('active'); // Ensure live chat settings are hidden when reopened
    });


    // Media menu buttons
    // document.getElementById('media-button').addEventListener('click', openMedia);
    // document.getElementById('media-input').addEventListener('change', sendMedia);

    // Chat management buttons
    document.getElementById('new-chat-button').addEventListener('click', newChat);
    document.getElementById('delete-chat-button').addEventListener('click', deleteChat);
    document.getElementById('clear-chat-button').addEventListener('click', clearChat); // New event listener
    document.getElementById('force-save-button').addEventListener('click', () => {
        if (getChatModifiedStatus()) { // Check if the chat has been modified
            saveChat(); // Save the chat
        } else {
            console.log('No changes to save.');
        }
    });

    // Context menu buttons
    document.getElementById('edit-selected-button').addEventListener('click', editSelected);
    document.getElementById('delete-selected-button').addEventListener('click', deleteSelected);
    document.getElementById('swap-sender-button').addEventListener('click', swapSender);
    document.getElementById('replace-with-image-button').addEventListener('click', replaceWithImage);
    document.getElementById('insert-message-after-button').addEventListener('click', insertMessageAfter);

    // Message input (Enter key to send message)
    document.getElementById('chat-select').addEventListener('change', async (e) => {
        const newChatId = e.target.value; // Get the new chat ID
        if (newChatId) {
            await loadChat(newChatId); // Pass the new chat ID to loadChat
        } else {
            console.error('Invalid chat ID selected');
        }
    });

    // Dropdown to load selected chat
    document.getElementById('chat-select').addEventListener('change', async (e) => {
        const newChatId = e.target.value; // Get the new chat ID
        console.log('Selected chat ID:', newChatId); // Debugging line
        if (newChatId) {
            await loadChat(newChatId); // Pass the new chat ID to loadChat
        } else {
            console.error('Invalid chat ID selected');
        }
    });
}


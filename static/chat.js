import { saveChatToDB, loadChatFromDB, deleteChatFromDB, openDB } from './db.js';
import { adjustMessageTails } from './tailProcessor.js'; // Import the tail processor

let _currentChatId = 'default'; // Private variable for current chat ID
let isChatModified = false; // Shared flag to track if the chat has been modified

// Getter for currentChatId
export function getCurrentChatId() {
    return _currentChatId;
}

// Setter for currentChatId
export function setCurrentChatId(newChatId) {
    _currentChatId = newChatId;
}

// Function to mark the chat as modified
export function markChatAsModified() {
    isChatModified = true;
}

// Function to check if the chat has been modified
export function getChatModifiedStatus() {
    return isChatModified;
}

export function sendMessage(sender) {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    if (message) {
        // Create the message container
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message-container', sender === 'person1' ? 'person1' : 'person2');

        // Create the message element
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.textContent = message;
        messageElement.draggable = true;

        // Append the message element to the container
        messageContainer.appendChild(messageElement);

        // Create and append the tail SVG
        const tailSvg = document.createElement('img');
        tailSvg.src = sender === 'person1' ? '/static/tail.svg' : '/static/tail_receive.svg';
        tailSvg.classList.add('message-tail');
        messageContainer.appendChild(tailSvg);

        // Append the container to the chat messages
        document.getElementById('chat-messages').appendChild(messageContainer);

        // Animate the message
        animateMessage(messageElement);

        // Clear the input and scroll to the bottom
        input.value = '';
        document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;

        // Adjust message tails
        adjustMessageTails();

        // Mark the chat as modified
        markChatAsModified();
    }
}

// New sendBotMessage function (only sends messages as person1)
export function sendBotMessage(message) {
    return new Promise((resolve) => {
        if (message) {
            // Create the loading GIF container
            const gifContainer = document.createElement('div');
            gifContainer.classList.add('message-container', 'person1'); // Always person1

            // Create the GIF element
            const gifElement = document.createElement('img');
            gifElement.src = '/static/typing.gif'; // Path to your loading GIF
            gifElement.classList.add('loading-gif');
            gifElement.alt = 'Loading...';

            // Append the GIF element to the container
            gifContainer.appendChild(gifElement);

            // Append the container to the chat messages
            const chatMessages = document.getElementById('chat-messages');
            chatMessages.appendChild(gifContainer);

            // Scroll to the bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Calculate the number of loops based on the message length
            const messageLength = message.length;
            const loops = Math.min(Math.max(Math.floor(messageLength / 30), 1), 30); // Adjust the divisor and max loops as needed

            // Simulate the loading time
            setTimeout(() => {
                // Remove the GIF container
                chatMessages.removeChild(gifContainer);

                // Now send the actual message
                const messageContainer = document.createElement('div');
                messageContainer.classList.add('message-container', 'person1'); // Always person1

                // Create the message element
                const messageElement = document.createElement('div');
                messageElement.classList.add('message');
                messageElement.textContent = message;
                messageElement.draggable = true;

                // Append the message element to the container
                messageContainer.appendChild(messageElement);

                // Create and append the tail SVG
                const tailSvg = document.createElement('img');
                tailSvg.src = '/static/tail.svg'; // Tail for person1
                tailSvg.classList.add('message-tail');
                messageContainer.appendChild(tailSvg);

                // Append the container to the chat messages
                chatMessages.appendChild(messageContainer);

                // Animate the message
                animateMessage(messageElement);

                // Scroll to the bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;

                // Adjust message tails
                adjustMessageTails();

                // Mark the chat as modified
                markChatAsModified();

                // Resolve the promise after the message is fully processed
                resolve();
            }, loops * 2000); // 2 seconds per loop
        }
    });
}

// Function to clear the current chat
export function clearChat() {
    if (confirm('Are you sure you want to clear this chat? This action cannot be undone.')) {
        document.getElementById('chat-messages').innerHTML = ''; // Clear all messages
        markChatAsModified(); // Mark the chat as modified
    }
}

// Function to save the chat to IndexedDB
export async function saveChat() {
    if (!isChatModified) return; // Only save if the chat has been modified

    const chatTitle = document.getElementById('chat-title').textContent;
    const chatMessages = document.getElementById('chat-messages').innerHTML;
    const headerIcon = document.getElementById('header-icon').src; // Get the header image URL

    const chat = {
        id: getCurrentChatId(), // Use the current chat ID as the key
        title: chatTitle,
        messages: chatMessages,
        headerImage: headerIcon // Save the header image URL
    };

    try {
        await saveChatToDB(chat);
        console.log('Chat saved to IndexedDB:', chat); // Log the saved chat
        isChatModified = false; // Reset the modified flag
    } catch (error) {
        console.error('Failed to save chat:', error);
    }
}

export async function loadChat(newChatId) {
    try {
        console.log('Loading chat with ID:', newChatId); // Debugging line

        // Validate newChatId
        if (!newChatId || typeof newChatId !== 'string') {
            throw new Error('Invalid chat ID');
        }

        // Save the current chat if it has been modified
        if (isChatModified) {
            const oldChatId = getCurrentChatId(); // Save the old chat ID
            await saveChat(oldChatId); // Save the old chat with its original ID
        }

        // Update the current chat ID to the new chat ID
        setCurrentChatId(newChatId);

        // Load the new chat
        const chat = await loadChatFromDB(newChatId);
        if (chat) {
            // Add ">" prefix to the chat title
            document.getElementById('chat-title').textContent = chat.title;
            document.getElementById('chat-messages').innerHTML = chat.messages;

            // Load the header image if it exists, otherwise use the default image
            const headerIcon = document.getElementById('header-icon');
            if (chat.headerImage) {
                headerIcon.src = chat.headerImage; // Set the custom header image
            } else {
                headerIcon.src = 'contact.jpg'; // Fallback to the default image
            }

            // Adjust message tails after loading the chat
            adjustMessageTails();

            console.log('Chat loaded from IndexedDB');
        } else {
            console.log('No chat found for the current ID');
        }

        // Reset the modified flag after loading a new chat
        isChatModified = false;
    } catch (error) {
        console.error('Failed to load chat:', error);
    }
}
// Function to delete the current chat
export async function deleteChat() {
    if (confirm('Are you sure you want to delete this chat?')) {
        try {
            await deleteChatFromDB(getCurrentChatId());
            setCurrentChatId('default'); // Reset to the default chat ID
            document.getElementById('chat-title').textContent = 'Friend';
            document.getElementById('chat-messages').innerHTML = '';
            markChatAsModified(); // Mark the chat as modified
            await populateChatSelect(); // Update the dropdown
            console.log('Chat deleted from IndexedDB');
        } catch (error) {
            console.error('Failed to delete chat:', error);
        }
    }
}

export async function newChat() {
    const label = prompt('Enter a label for the new chat:');
    if (label) {
        const chatId = `chat_${Date.now()}`;
        setCurrentChatId(chatId); // Update the current chat ID
        document.getElementById('chat-title').textContent = label;
        document.getElementById('chat-messages').innerHTML = '';
        markChatAsModified(); // Mark the chat as modified
        await populateChatSelect(); // Update the dropdown
    }
}


// Function to animate a message
function animateMessage(messageElement) {
    messageElement.style.opacity = '0';
    messageElement.style.transform = 'translateY(20px)';
    requestAnimationFrame(() => {
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translateY(0)';
    });
}

// Function to populate the chat selector dropdown
export async function populateChatSelect() {
    const chatSelect = document.getElementById('chat-select');
    chatSelect.innerHTML = ''; // Clear the dropdown

    try {
        const db = await openDB(); // Use the imported openDB function
        const transaction = db.transaction('chats', 'readonly');
        const store = transaction.objectStore('chats');
        const request = store.getAll();

        request.onsuccess = () => {
            const chats = request.result;
            chats.forEach(chat => {
                const option = document.createElement('option');
                option.value = chat.id;
                option.textContent = chat.title;
                chatSelect.appendChild(option);
            });
            chatSelect.value = getCurrentChatId(); // Set the current chat as selected
        };

        request.onerror = (event) => {
            console.error('Failed to load chats:', event.target.error);
        };
    } catch (error) {
        console.error('Failed to open database:', error);
    }
}

// Save the chat when the window is closed
window.addEventListener('beforeunload', (event) => {
    if (isChatModified) {
        saveChat(); // Save the chat if it has been modified
    }
});
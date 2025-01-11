// llm.js

import { 
    updateConnectionStatus, 
    connectToServer, 
    disconnectFromServer, 
    setupConnectionButton,
    currentModel, 
    isConnected // Import isConnected from llmSetup.js
} from 'llmSetup.js';

import { sendMessage as sendChatMessage, sendBotMessage } from './chat.js';

let chatHistory = []; // Array to store the chat history
const MAX_HISTORY = 50; // Maximum number of messages to keep in history

// Debug function to print chatHistory to the console
function debugChatHistory() {
    console.log("Current Chat History:");
    console.log(chatHistory);
}

// Function to parse existing messages and populate chatHistory
function populateChatHistory() {
    const chatMessages = document.getElementById('chat-messages').children;
    chatHistory = []; // Reset chat history

    for (let i = 0; i < chatMessages.length; i++) {
        const messageContainer = chatMessages[i];
        const messageElement = messageContainer.querySelector('.message');
        const messageText = messageElement.textContent;

        if (messageContainer.classList.contains('person1')) {
            // person1 is the assistant
            chatHistory.push({ role: 'assistant', content: messageText });
        } else if (messageContainer.classList.contains('person2')) {
            // person2 is the user
            chatHistory.push({ role: 'user', content: messageText });
        }
    }

    // Limit the chat history to the last MAX_HISTORY messages
    if (chatHistory.length > MAX_HISTORY) {
        chatHistory = chatHistory.slice(-MAX_HISTORY);
    }

    // Debug: Print the chat history to the console
    debugChatHistory();
}

// Function to split text into sentences
function splitIntoSentences(text) {
    return text.split(/(?<=[.!?])\s+/);
}

// Function to send bot reply, either as a whole or split into sentences
function sendBotReply(botReply) {
    const shouldSplit = Math.random() < 0.5; // 50% chance to split the reply

    if (shouldSplit) {
        const sentences = splitIntoSentences(botReply);

        // Recursive function to send sentences one by one
        const sendSentence = (index) => {
            if (index < sentences.length) {
                sendBotMessage(sentences[index].trim()).then(() => {
                    // Wait for the message to be fully processed before sending the next one
                    setTimeout(() => {
                        sendSentence(index + 1); // Send the next sentence
                    }, 1000); // 1-second delay between sentences
                });
            }
        };

        // Start sending sentences
        sendSentence(0);
    } else {
        // Send the entire reply as a single message
        sendBotMessage(botReply);
    }
}

export async function sendMessage() {
    const userInput = document.getElementById('message-input');
    const message = userInput.value.trim();
    if (message && isConnected) {
        // Populate chat history with existing messages
        populateChatHistory();

        // Add the user's message to the chat history
        chatHistory.push({ role: 'user', content: message });

        // Limit the chat history to the last MAX_HISTORY messages
        if (chatHistory.length > MAX_HISTORY) {
            chatHistory = chatHistory.slice(-MAX_HISTORY);
        }

        // Debug: Print the chat history to the console after adding the new message
        // debugChatHistory();

        const serverUrl = document.getElementById('server-url').value.trim();

        // Get the chat title and system prompt
        const chatTitle = document.getElementById('chat-title').textContent.trim();
        const systemPrompt = document.getElementById('system-prompt').value.trim();

        // Combine the chat title and system prompt
        const combinedSystemContent = `You write casual texting style replies as a character named ${chatTitle}. ${systemPrompt}`;

        try {
            // Send the entire chat history to the LLM
            const response = await fetch(`${serverUrl}/v1/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: currentModel,
                    messages: [
                        { role: 'system', content: combinedSystemContent }, // System prompt
                        ...chatHistory, // Include the entire chat history
                    ],
                    temperature: 0.7,
                    max_tokens: -1,
                    stream: false,
                }),
            });

            if (!response.ok) {
                throw new Error('Server response was not ok');
            }

            const data = await response.json();
            const botReply = data.choices[0].message.content;

            // Output the bot's reply to the console
            // console.log("Bot's Reply:", botReply);

            // Add the assistant's reply to the chat history
            chatHistory.push({ role: 'assistant', content: botReply });

            // Send the bot's reply, either as a whole or split into sentences
            sendBotReply(botReply);

            // Clear the input field after sending the message
            userInput.value = '';

        } catch (error) {
            console.error('Error:', error);
            // Send an error message to chat.js as if it were coming from person1
            sendBotMessage('Error: Unable to get a response from the server. Please try again.');
            disconnectFromServer();
        } finally {
            // userInput.disabled = false;
            // userInput.focus();
        }
    }
}

// Event listener for the Send button
document.getElementById('send-button-person2').addEventListener('click', sendMessage);

// Initialize
setupConnectionButton();
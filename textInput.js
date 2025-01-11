import { saveChat, markChatAsModified } from './chat.js'; // Import markChatAsModified
import { closeSettings } from './settings.js'; // Import closeSettings

// Function to load a text file from disk
export function loadTextFile() {
    const fileInput = document.getElementById('text-file-input');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const content = e.target.result;
            parseTextFileContent(content);
            closeSettings(); // Close the settings UI after importing the file
        };
        reader.readAsText(file);
    }
}

// Function to handle pasting from clipboard
export function pasteFromClipboard() {
    // Check if clipboard access is supported
    if (!navigator.clipboard) {
        alert('Clipboard access is not supported in this browser.');
        return;
    }

    // Read text from clipboard
    navigator.clipboard.readText().then(text => {
        if (text) {
            parseTextFileContent(text);
            closeSettings(); // Close the settings UI after pasting
        } else {
            alert('No text found in clipboard.');
        }
    }).catch(err => {
        console.error('Failed to read clipboard contents: ', err);
        alert('Failed to read clipboard contents.');
    });
}

// Attach the function to the window object for global access
window.pasteFromClipboard = pasteFromClipboard;

// Function to parse and process text content
function parseTextFileContent(content) {
    const lines = content.split('\n');
    const chatMessages = document.getElementById('chat-messages');

    // Get the existing chat label
    const chatLabel = document.getElementById('chat-title').textContent.trim();

    // Process each line in the file
    lines.forEach(line => {
        line = line.trim();
        if (line === '') return; // Skip empty lines

        // Remove markdown formatting (e.g., **)
        line = line.replace(/\*\*/g, '');

        // Extract the speaker and their dialogue
        const speakerMatch = line.match(/^(.*?):/);
        if (speakerMatch) {
            let speaker = speakerMatch[1].trim();
            const dialogue = line.slice(speakerMatch[0].length).trim();

            // Remove ANY and ALL Unicode characters before the ":"
            speaker = speaker.replace(/[^\x00-\x7F]/g, '').trim(); // Remove non-ASCII characters

            // Split dialogue into sentences and handle emojis
            const sentences = dialogue.split(/(?<=[.!?])\s+/);

            sentences.forEach(sentence => {
                // Handle emojis or special characters at the end
                const emojiMatch = sentence.match(/[\u{1F600}-\u{1F6FF}]/gu);
                if (emojiMatch) {
                    addMessageToChat(speaker, sentence.replace(emojiMatch.join(''), '').trim(), chatLabel);
                    addMessageToChat(speaker, emojiMatch.join(''), chatLabel);
                } else {
                    addMessageToChat(speaker, sentence, chatLabel);
                }
            });
        }
    });

    // Scroll to the bottom of the chat
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Mark the chat as modified
    markChatAsModified();
}

// Helper function to add a message to the chat
function addMessageToChat(sender, message, chatLabel) {
    const chatMessages = document.getElementById('chat-messages');

    // Determine the sender class (person1 or person2)
    const senderClass = sender === chatLabel ? 'person1' : 'person2';

    // Create the message container
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container', senderClass);

    // Create the message element
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = message;
    messageElement.draggable = true;

    // Create and append the tail SVG based on the sender
    const tailSvg = document.createElement('img');
    tailSvg.src = senderClass === 'person1' ? 'tail.svg' : 'tail_receive.svg';
    tailSvg.classList.add('message-tail');

    // Append the message and tail to the container
    messageContainer.appendChild(messageElement);
    messageContainer.appendChild(tailSvg);

    // Append the container to the chat messages
    chatMessages.appendChild(messageContainer);
}
import { markChatAsModified } from './chat.js'; // Import markChatAsModified

export function openMedia() {
    const mediaMenu = document.getElementById('media-menu');
    mediaMenu.style.display = 'block';
}

export function sendMedia() {
    const fileInput = document.getElementById('media-input');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgElement = document.createElement('img');
            imgElement.src = e.target.result;
            imgElement.draggable = true;

            // Create the message container
            const messageContainer = document.createElement('div');
            messageContainer.classList.add('message-container', 'person1');

            // Create the message element
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.appendChild(imgElement);

            // Create and append the tail SVG
            const tailSvg = document.createElement('img');
            tailSvg.src = sender === 'person1' ? 'tail.svg' : 'tail_receive.svg';
            tailSvg.classList.add('message-tail');

            // Append the message and tail to the container
            messageContainer.appendChild(messageElement);
            messageContainer.appendChild(tailSvg);

            // Append the container to the chat messages
            document.getElementById('chat-messages').appendChild(messageContainer);

            // Hide the media menu and scroll to the bottom
            document.getElementById('media-menu').style.display = 'none';
            document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;

            // Mark the chat as modified
            markChatAsModified();
        };
        reader.readAsDataURL(file);
    }
}
import { markChatAsModified } from './chat.js'; // Import markChatAsModified
import { adjustMessageTails } from './tailProcessor.js'; // Import the tail processor

let selectedElement = null;

export function setupContextMenu() {
    const chatMessages = document.getElementById('chat-messages');

    chatMessages.addEventListener('contextmenu', (e) => {
        if (e.target.classList.contains('message') || e.target.tagName === 'IMG') {
            e.preventDefault();
            selectedElement = e.target.closest('.message-container'); // Select the message-container
            const contextMenu = document.getElementById('context-menu');
            contextMenu.style.display = 'block';
            // contextMenu.style.left = `${e.clientX}px`;
            // contextMenu.style.top = `${e.clientY}px`;
        }
    });

    // Add double-click to edit
    chatMessages.addEventListener('dblclick', (e) => {
        if (e.target.classList.contains('message')) {
            selectedElement = e.target.closest('.message-container'); // Select the message-container
            editSelected(); // Call the edit function
        }
    });  




    document.addEventListener('click', (e) => {
        const contextMenu = document.getElementById('context-menu');
        if (!contextMenu.contains(e.target)) {
            contextMenu.style.display = 'none';
        }
    });

    // Add event listener for the new "Insert Image After" button
    document.getElementById('insert-image-after-button').addEventListener('click', insertImageAfter);
}

export function editSelected() {
    if (selectedElement) {
        const messageElement = selectedElement.querySelector('.message');
        if (messageElement) {
            const newText = prompt('Edit your message:', messageElement.textContent);
            if (newText !== null) {
                messageElement.textContent = newText;
                markChatAsModified(); // Mark the chat as modified
            }
        }
        document.getElementById('context-menu').style.display = 'none';
    }
}

export function deleteSelected() {
    if (selectedElement) {
        selectedElement.remove();
        document.getElementById('context-menu').style.display = 'none';
        markChatAsModified(); // Mark the chat as modified
    }
}

export function swapSender() {
    if (selectedElement) {
        // Find the tail SVG element within the selected message container
        const tailSvg = selectedElement.querySelector('.message-tail');

        if (selectedElement.classList.contains('person1')) {
            // Swap from person1 to person2
            selectedElement.classList.remove('person1');
            selectedElement.classList.add('person2');

            // Update the tail SVG for person2
            if (tailSvg) {
                tailSvg.src = 'tail_receive.svg';
            }
        } else if (selectedElement.classList.contains('person2')) {
            // Swap from person2 to person1
            selectedElement.classList.remove('person2');
            selectedElement.classList.add('person1');

            // Update the tail SVG for person1
            if (tailSvg) {
                tailSvg.src = 'tail.svg';
            }
        }

        // Adjust message tails after swapping
        adjustMessageTails();

        markChatAsModified(); // Mark the chat as modified
    }
}

export function replaceWithImage() {
    if (selectedElement) {
        const messageElement = selectedElement.querySelector('.message');
        if (messageElement) {
            // Create a file input element
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*'; // Only allow image files

            // Handle file selection
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const imageUrl = event.target.result; // Get the data URL of the image
                        messageElement.innerHTML = `<img src="${imageUrl}" draggable="true">`; // Replace the message with the image
                        markChatAsModified(); // Mark the chat as modified
                    };
                    reader.readAsDataURL(file); // Read the file as a data URL
                }
            });

            // Trigger the file input dialog
            fileInput.click();
        }
    }
}

export function insertMessageAfter() {
    if (selectedElement) {
        const newMessage = prompt('Enter the new message:');
        if (newMessage) {
            const senderClass = selectedElement.classList.contains('person1') ? 'person1' : 'person2';

            // Create the new message container
            const newMessageContainer = document.createElement('div');
            newMessageContainer.classList.add('message-container', senderClass);

            // Create the new message element
            const newMessageElement = document.createElement('div');
            newMessageElement.classList.add('message');
            newMessageElement.textContent = newMessage;
            newMessageElement.draggable = true;

            // Create and append the tail SVG based on the sender
            const tailSvg = document.createElement('img');
            tailSvg.src = senderClass === 'person1' ? 'tail.svg' : 'tail_receive.svg';
            tailSvg.classList.add('message-tail');

            // Append the message and tail to the container
            newMessageContainer.appendChild(newMessageElement);
            newMessageContainer.appendChild(tailSvg);

            // Insert the new message container after the selected element
            selectedElement.insertAdjacentElement('afterend', newMessageContainer);

            // Mark the chat as modified
            markChatAsModified();
        }
    }
}

export function insertImageAfter() {
    if (selectedElement) {
        const senderClass = selectedElement.classList.contains('person1') ? 'person1' : 'person2';

        // Create a file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*'; // Only allow image files

        // Handle file selection
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imageUrl = event.target.result; // Get the data URL of the image

                    // Create the new message container
                    const newMessageContainer = document.createElement('div');
                    newMessageContainer.classList.add('message-container', senderClass);

                    // Create the new message element
                    const newMessageElement = document.createElement('div');
                    newMessageElement.classList.add('message');
                    newMessageElement.innerHTML = `<img src="${imageUrl}" draggable="true">`;

                    // Create and append the tail SVG based on the sender
                    const tailSvg = document.createElement('img');
                    tailSvg.src = senderClass === 'person1' ? 'tail.svg' : 'tail_receive.svg';
                    tailSvg.classList.add('message-tail');

                    // Append the message and tail to the container
                    newMessageContainer.appendChild(newMessageElement);
                    newMessageContainer.appendChild(tailSvg);

                    // Insert the new message container after the selected element
                    selectedElement.insertAdjacentElement('afterend', newMessageContainer);

                    // Mark the chat as modified
                    markChatAsModified();
                };
                reader.readAsDataURL(file); // Read the file as a data URL
            }
        });

        // Trigger the file input dialog
        fileInput.click();
    }
}
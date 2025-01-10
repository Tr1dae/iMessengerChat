import { markChatAsModified } from './chat.js';

export function setupDragAndDrop() {
    const chatMessages = document.getElementById('chat-messages');

    chatMessages.addEventListener('dragstart', (e) => {
        // Check if the dragged element is a message or part of a message-container
        if (e.target.classList.contains('message') || e.target.classList.contains('message-tail')) {
            // Get the parent message-container
            const messageContainer = e.target.closest('.message-container');
            if (messageContainer) {
                // Store the inner HTML of the message-container for dragging
                e.dataTransfer.setData('text/plain', messageContainer.innerHTML);
                messageContainer.classList.add('dragging');
            }
        }
    });

    chatMessages.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggingElement = document.querySelector('.dragging');
        if (draggingElement) {
            const closestElement = getClosestElement(e.clientY);
            if (closestElement) {
                // Insert the dragging element before the closest element
                closestElement.insertAdjacentElement('beforebegin', draggingElement);
            }
        }
    });

    chatMessages.addEventListener('dragend', (e) => {
        // Check if the dragged element is a message or part of a message-container
        if (e.target.classList.contains('message') || e.target.classList.contains('message-tail')) {
            const messageContainer = e.target.closest('.message-container');
            if (messageContainer) {
                messageContainer.classList.remove('dragging');
                markChatAsModified(); // Mark the chat as modified
            }
        }
    });

    function getClosestElement(y) {
        // Get all message-containers that are not currently being dragged
        const messageContainers = Array.from(document.querySelectorAll('.message-container:not(.dragging)'));
        return messageContainers.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
}
import { markChatAsModified, getCurrentChatId } from "./chat.js";
import { openDB, saveChatToDB } from "./db.js"; // Import saveChatToDB

document.addEventListener('DOMContentLoaded', () => {
    const imageSelectButton = document.getElementById('image-select-button');
    const headerIcon = document.getElementById('header-icon');

    imageSelectButton.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    headerIcon.src = event.target.result;
                    // Save the image URL to the current chat in IndexedDB
                    saveHeaderImageToDB(event.target.result);
                };
                reader.readAsDataURL(file);
            }
        };
        fileInput.click();
        markChatAsModified();
    });
});

// Function to save the header image to the current chat in IndexedDB
async function saveHeaderImageToDB(imageUrl) {
    const chatId = getCurrentChatId();
    if (!chatId) return;

    try {
        const db = await openDB();
        const transaction = db.transaction('chats', 'readwrite');
        const store = transaction.objectStore('chats');
        const request = store.get(chatId);

        request.onsuccess = () => {
            const chat = request.result;
            if (chat) {
                chat.headerImage = imageUrl; // Add the header image URL to the chat object
                const updateRequest = store.put(chat); // Save the updated chat object
                updateRequest.onsuccess = () => {
                    console.log('Header image saved to IndexedDB:', imageUrl);
                };
                updateRequest.onerror = (event) => {
                    console.error('Failed to save header image:', event.target.error);
                };
            }
        };

        request.onerror = (event) => {
            console.error('Failed to load chat for saving header image:', event.target.error);
        };
    } catch (error) {
        console.error('Failed to open database:', error);
    }
}
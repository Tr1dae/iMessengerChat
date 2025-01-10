// Open or create the IndexedDB database
export function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('ChatAppDB', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('chats')) {
                // Create an object store for chats
                db.createObjectStore('chats', { keyPath: 'id' });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(`Error opening database: ${event.target.error}`);
        };
    });
}

// Save chat data to IndexedDB
export function saveChatToDB(chat) {
    return new Promise((resolve, reject) => {
        openDB().then((db) => {
            const transaction = db.transaction('chats', 'readwrite');
            const store = transaction.objectStore('chats');
            const request = store.put(chat);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = (event) => {
                reject(`Error saving chat: ${event.target.error}`);
            };
        }).catch(reject);
    });
}

// Load chat data from IndexedDB
export function loadChatFromDB(id) {
    return new Promise((resolve, reject) => {
        if (!id) {
            reject(new Error('Invalid chat ID'));
            return;
        }

        openDB().then((db) => {
            const transaction = db.transaction('chats', 'readonly');
            const store = transaction.objectStore('chats');
            const request = store.get(id);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = (event) => {
                reject(`Error loading chat: ${event.target.error}`);
            };
        }).catch(reject);
    });
}

// Delete chat data from IndexedDB
export function deleteChatFromDB(id) {
    return new Promise((resolve, reject) => {
        openDB().then((db) => {
            const transaction = db.transaction('chats', 'readwrite');
            const store = transaction.objectStore('chats');
            const request = store.delete(id);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = (event) => {
                reject(`Error deleting chat: ${event.target.error}`);
            };
        }).catch(reject);
    });
}
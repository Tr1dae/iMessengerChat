import { closeSettings } from './settings.js'; // Import closeSettings

let screenshotCount = 0;

async function takeScreenshot() {
    const windowTitle = "iOS Messaging App — Mozilla Firefox"; // Update this to match the printed title
    const outputFile = `screenshot_${screenshotCount}.png`;
    const aspectRatio = "9,17.5";

    try {
        const response = await fetch('https://127.0.0.1:5000/take-screenshot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                window_title: windowTitle,
                output_file: outputFile,
                aspect_ratio: aspectRatio,
            }),
        });

        const data = await response.json();
        if (data.status === 'success') {
            console.log(data.message);
            screenshotCount++;
        } else {
            console.error(data.message);
        }
    } catch (error) {
        console.error('Error taking screenshot:', error);
    }
}

function startScrollingAndCapturing() {
    const chatMessages = document.getElementById('chat-messages');
    const scrollDelay = 1500; // Adjust this value based on your needs

    // Close settings before starting the process
    closeSettings();

    // Enter fullscreen mode
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) { // Firefox
        document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, and Opera
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
        document.documentElement.msRequestFullscreen();
    }

    // Scroll to the top of the chat-messages element
    chatMessages.scrollTop = 0;

    const scrollInterval = setInterval(async () => {
        // Take a screenshot
        await takeScreenshot();

        // Scroll by the height of the chat-messages content area (excluding padding)
        const contentHeight = chatMessages.scrollHeight - chatMessages.clientHeight;
        const scrollStep = chatMessages.clientHeight + 0; // Scroll by the visible height of the chat-messages element

        // Scroll down by the scrollStep
        chatMessages.scrollBy(0, scrollStep);

        // Snap to the most recent message visible
        const messages = chatMessages.getElementsByClassName('message');
        let lastVisibleMessage = null;

        for (let i = messages.length - 1; i >= 0; i--) {
            const message = messages[i];
            const messageRect = message.getBoundingClientRect();
            if (messageRect.top >= 0 && messageRect.bottom <= chatMessages.clientHeight) {
                lastVisibleMessage = message;
                break;
            }
        }

        if (lastVisibleMessage) {
            lastVisibleMessage.scrollIntoView({ behavior: "smooth", block: "end" });
        }

        // chatMessages.scrollBy(0, 1);

        // Check if we've reached the bottom
        if (chatMessages.scrollTop + chatMessages.clientHeight >= chatMessages.scrollHeight) {
            clearInterval(scrollInterval);
            console.log("Reached the end of the chat messages.");

            // Exit fullscreen mode
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari, and Opera
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
            }
        }
    }, scrollDelay);
}

document.getElementById('take-screenshots-button').addEventListener('click', () => {
    startScrollingAndCapturing();
});
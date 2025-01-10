export function adjustMessageTails() {
    const chatMessages = document.getElementById('chat-messages');
    const messageContainers = chatMessages.querySelectorAll('.message-container');

    let previousSender = null;

    // Iterate through all messages in reverse order
    for (let i = messageContainers.length - 1; i >= 0; i--) {
        const messageContainer = messageContainers[i];
        const isPerson1 = messageContainer.classList.contains('person1');
        const isPerson2 = messageContainer.classList.contains('person2');
        const tailSvg = messageContainer.querySelector('.message-tail');
        const containsImage = messageContainer.querySelector('.message img'); // Check if the message contains an image

        // Hide or delete the tail if the message contains an image
        if (tailSvg && containsImage) {
            tailSvg.style.display = 'none'; // Hide the tail
            // Alternatively, you can remove the tail entirely:
            // tailSvg.remove();
        }

        // Adjust the tail visibility based on the previous sender (only for messages without images)
        if (tailSvg && !containsImage) {
            if ((isPerson1 && previousSender === 'person1') || (isPerson2 && previousSender === 'person2')) {
                // Hide the tail if the previous message is from the same sender
                tailSvg.style.display = 'none';
            } else {
                // Show the tail if the previous message is from a different sender
                tailSvg.style.display = 'block';
            }
        }

        // Adjust the margin-bottom using CSS classes
        if (previousSender === null) {
            // This is the first message, so set a default margin
            messageContainer.classList.remove('consecutive-message');
            messageContainer.classList.add('non-consecutive-message');
        } else if ((isPerson1 && previousSender === 'person1') || (isPerson2 && previousSender === 'person2')) {
            // Consecutive message from the same sender
            messageContainer.classList.remove('non-consecutive-message');
            messageContainer.classList.add('consecutive-message');
        } else {
            // Non-consecutive message from a different sender
            messageContainer.classList.remove('consecutive-message');
            messageContainer.classList.add('non-consecutive-message');
        }

        // Update the previous sender
        if (isPerson1) {
            previousSender = 'person1';
        } else if (isPerson2) {
            previousSender = 'person2';
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const chatArea = document.getElementById('chatArea');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const languageSelect = document.getElementById('language');

    // API Endpoint for translations
    const API_URL = '/translate';

    function scrollToBottom() {
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    function appendUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', 'user-message');
        msgDiv.innerHTML = `<div class="bubble">${escapeHTML(text)}</div>`;
        chatArea.appendChild(msgDiv);
        scrollToBottom();
    }

    function appendBotMessage(text, isError = false) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', 'bot-message');
        if (isError) {
            msgDiv.classList.add('error-message');
        }

        const container = document.createElement('div');
        container.classList.add('bot-message-container');

        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubble.textContent = text;
        container.appendChild(bubble);

        // Add copy button only for valid translations
        if (!isError) {
            const copyBtn = document.createElement('button');
            copyBtn.classList.add('copy-btn');
            copyBtn.innerHTML = '<i class="fa fa-copy"></i>';
            copyBtn.title = 'Copy text';
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(text).then(() => {
                    const icon = copyBtn.querySelector('i');
                    icon.classList.remove('fa-copy');
                    icon.classList.add('fa-check');
                    setTimeout(() => {
                        icon.classList.remove('fa-check');
                        icon.classList.add('fa-copy');
                    }, 2000); // Revert after 2 seconds
                });
            };
            container.appendChild(copyBtn);
        }

        msgDiv.appendChild(container);
        chatArea.appendChild(msgDiv);
        scrollToBottom();
    }

    function showLoading() {
        // Only show loading if not already present
        if (!document.getElementById('loading')) {
            const loadingDiv = document.createElement('div');
            loadingDiv.id = 'loading';
            loadingDiv.classList.add('message', 'bot-message');
            loadingDiv.innerHTML = `
                <div class="bot-message-container">
                    <div class="loading-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>
            `;
            chatArea.appendChild(loadingDiv);
            scrollToBottom();
        }
    }

    function removeLoading() {
        const loadingDiv = document.getElementById('loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    async function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;

        // Append user's text to chat and clear input field
        appendUserMessage(text);
        userInput.value = '';
        userInput.focus();

        showLoading();

        const language = languageSelect.value;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    language: language
                })
            });

            const data = await response.json();
            removeLoading();

            if (response.ok) {
                appendBotMessage(data.translation);
            } else {
                appendBotMessage(`Error: ${data.error || 'Something went wrong.'}`, true);
            }
        } catch (error) {
            console.error("Translation Error:", error);
            removeLoading();
            appendBotMessage('Cannot connect to the server. Ensure the backend is running.', true);
        }
    }

    // Send button event
    sendBtn.addEventListener('click', sendMessage);

    // Enter key event
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // prevent form submission or default enter action
            sendMessage();
        }
    });

    // Helper to escape HTML tags to prevent XSS attacks
    function escapeHTML(str) {
        const p = document.createElement('p');
        p.appendChild(document.createTextNode(str));
        return p.innerHTML;
    }
});

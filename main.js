document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const userMessage = userInput.value.trim();
        if (userMessage) {
            appendMessage(userMessage, 'user');
            userInput.value = '';

            fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMessage })
            })
            .then(response => response.json())
            .then(data => {
                appendMessage(data.reply, 'bot');
            })
            .catch(error => {
                console.error('Error fetching bot reply:', error);
                appendMessage('죄송합니다. 오류가 발생했습니다.', 'bot');
            });
        }
    }

    function appendMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender);

        // 프로필 아이콘을 챗봇 메시지일 때만 왼쪽에 추가
        if (sender === 'bot') {
            const iconElement = document.createElement('img');
            iconElement.src = 'icon.png';
            iconElement.alt = 'bot icon';
            iconElement.classList.add('profile-icon');
            messageElement.appendChild(iconElement);
        }

        const p = document.createElement('p');
        let formattedMessage = message;

        // Markdown 링크 [텍스트](URL) 변환
        if (/\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/.test(formattedMessage)) {
            formattedMessage = formattedMessage.replace(
                /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g,
                '<a href="$2" target="_blank">$1</a>'
            );
        } else {
            formattedMessage = formattedMessage.replace(
                /(https?:\/\/[^\s]+)/g,
                '<a href="$1" target="_blank">$1</a>'
            );
        }

        p.innerHTML = formattedMessage;
        messageElement.appendChild(p);
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;

        // 이미지 클릭 시 확대 기능 추가
        const images = messageElement.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('click', () => {
                const modal = document.createElement('div');
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100%';
                modal.style.height = '100%';
                modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                modal.style.display = 'flex';
                modal.style.justifyContent = 'center';
                modal.style.alignItems = 'center';
                modal.style.zIndex = '1001';

                const modalImg = document.createElement('img');
                modalImg.src = img.src;
                modalImg.style.maxWidth = '90%';
                modalImg.style.maxHeight = '90%';

                modal.appendChild(modalImg);
                document.body.appendChild(modal);

                modal.addEventListener('click', () => {
                    document.body.removeChild(modal);
                });
            });
        });
    }


});
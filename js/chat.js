// Делаем функции глобальными
window.toggleChat = function() {
    const chatWindow = document.getElementById('chatWindow');
    if (chatWindow) {
        chatWindow.classList.toggle('active');
    }
}

window.sendMessage = function() {
    const input = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');
    
    if (input && messages && input.value.trim() !== '') {
        // Добавляем сообщение пользователя
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.textContent = input.value;
        messages.appendChild(userMessage);
        
        // Очищаем поле ввода
        input.value = '';
        
        // Прокручиваем к последнему сообщению
        messages.scrollTop = messages.scrollHeight;
        
        // Имитация ответа консультанта
        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot';
            botMessage.textContent = 'Спасибо за ваше сообщение! Наш консультант скоро свяжется с вами.';
            messages.appendChild(botMessage);
            messages.scrollTop = messages.scrollHeight;
        }, 1000);
    }
}

// Инициализация чата после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем обработчик Enter для поля ввода
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}); 
fetch('chat.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('chat-widget').innerHTML = data;
    });

fetch('loading.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('loading-overlay').innerHTML = data;
    });

// Функция для показа/скрытия индикатора загрузки
function showLoading() {
    document.querySelector('.loading-overlay').classList.add('active');
}

function hideLoading() {
    document.querySelector('.loading-overlay').classList.remove('active');
}

// Добавляем обработчики для форм
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        showLoading();
        // Здесь будет код отправки формы
        setTimeout(() => {
            hideLoading();
        }, 1000);
    });
}); 
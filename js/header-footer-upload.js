// Загрузка шапки и подвала
fetch('header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header').innerHTML = data;
        // Инициализируем мобильную навигацию после загрузки шапки
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);
    });

fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    });
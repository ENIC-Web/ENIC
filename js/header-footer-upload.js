// Определяем относительный путь к header/footer
let prefix = '';
if (window.location.pathname.match(/\/user\//)) {
    prefix = '../';
}

fetch(prefix + 'header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header').innerHTML = data;
        // Инициализируем мобильную навигацию после загрузки шапки
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);
    });

fetch(prefix + 'footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    });
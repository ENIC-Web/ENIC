// Функция для загрузки шапки
function loadHeader() {
    fetch('header.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('header').innerHTML = html;
            initHeader();
            // Отладка
            console.log('Header loaded');
            const link = document.getElementById('cabinet-link');
            console.log('cabinet-link:', link);
            fetch('/session_status.php')
              .then(res => res.json())
              .then(data => {
                console.log('Session status:', data);
                if (link) {
                  link.href = data.logged_in ? 'user/index.php' : 'login.php';
                  console.log('Set href:', link.href);
                }
              });
        });
}

// Инициализация шапки
function initHeader() {
    const menuToggle = document.querySelector('.header__menu-toggle');
    const nav = document.querySelector('.header__nav');
    const body = document.body;

    // Обработчик клика по кнопке меню
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
            body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
        if (nav && nav.classList.contains('active') && 
            !nav.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Закрытие меню при изменении размера окна
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Инициализация переключателя языка
    const langButtons = document.querySelectorAll('.language-switch');
    const currentLang = localStorage.getItem('language') || 'kk';

    langButtons.forEach(button => {
        if (button.dataset.lang === currentLang) {
            button.classList.add('active');
        }

        button.addEventListener('click', () => {
            const lang = button.dataset.lang;
            switchLanguage(lang);
        });
    });

    // Инициализация кнопки версии для слабовидящих
    const accessibilityBtn = document.getElementById('accessibilityToggle');
    const mobileAccessibilityBtn = document.getElementById('mobileAccessibilityToggle');
    const isAccessibilityMode = localStorage.getItem('accessibilityMode') === 'true';

    if (isAccessibilityMode) {
        document.body.classList.add('accessibility-mode');
        if (accessibilityBtn) accessibilityBtn.classList.add('active');
        if (mobileAccessibilityBtn) mobileAccessibilityBtn.classList.add('active');
    }

    [accessibilityBtn, mobileAccessibilityBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                document.body.classList.toggle('accessibility-mode');
                [accessibilityBtn, mobileAccessibilityBtn].forEach(b => {
                    if (b) b.classList.toggle('active');
                });
                localStorage.setItem('accessibilityMode', document.body.classList.contains('accessibility-mode'));
            });
        }
    });
}

// Функция переключения языка
function switchLanguage(lang) {
    localStorage.setItem('language', lang);
    
    // Обновляем активную кнопку
    document.querySelectorAll('.language-switch').forEach(button => {
        button.classList.toggle('active', button.dataset.lang === lang);
    });

    // Переводим текст на странице
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Обновляем атрибут lang у html
    document.documentElement.lang = lang;

    // Обновляем мета-теги
    const metaTags = document.getElementsByTagName('meta');
    for (let i = 0; i < metaTags.length; i++) {
        if (metaTags[i].getAttribute('name') === 'language') {
            metaTags[i].setAttribute('content', lang);
        }
    }

    // Закрываем мобильное меню после смены языка
    const menuToggle = document.querySelector('.header__menu-toggle');
    const nav = document.querySelector('.header__nav');
    if (menuToggle && nav) {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Отправляем событие о смене языка
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
}

// Загружаем шапку при загрузке страницы
document.addEventListener('DOMContentLoaded', loadHeader); 
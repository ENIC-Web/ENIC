// Функция для загрузки шапки
async function loadHeader() {
    try {
        const response = await fetch('header.html');
        const html = await response.text();
        
        // Создаем временный элемент для парсинга HTML
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        // Получаем шапку
        const header = temp.querySelector('.header');
        
        // Вставляем шапку в начало body
        document.body.insertBefore(header, document.body.firstChild);
        
        // Инициализируем функционал шапки
        initHeader();
    } catch (error) {
        console.error('Ошибка загрузки шапки:', error);
    }
}

// Функция инициализации функционала шапки
function initHeader() {
    // Переключение языка
    const currentLang = localStorage.getItem('language') || 'ru';
    switchLanguage(currentLang);
    
    document.querySelectorAll('.language-switch').forEach(btn => {
        btn.addEventListener('click', () => {
            switchLanguage(btn.dataset.lang);
        });
    });

    // Мобильное меню
    const menuToggle = document.querySelector('.header__menu-toggle');
    const nav = document.querySelector('.header__nav');
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
    });
    
    // Закрытие мобильного меню при клике на ссылку
    document.querySelectorAll('.header__menu a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });
    
    // Закрытие мобильного меню при клике вне меню
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        }
    });
}

// Словарь переводов
const translations = {
    ru: {
        'home': 'Главная',
        'recognition': 'Признание',
        'accreditation': 'Аккредитация',
        'bologna': 'Болонский процесс',
        'news': 'Новости',
        'contacts': 'Контакты',
        'apply': 'Подать заявку',
        'accessibility': 'Версия для слабовидящих'
    },
    kk: {
        'home': 'Басты бет',
        'recognition': 'Мойындау',
        'accreditation': 'Аккредитация',
        'bologna': 'Болон процесі',
        'news': 'Жаңалықтар',
        'contacts': 'Байланыстар',
        'apply': 'Өтініш беру',
        'accessibility': 'Көру қабілеті төмен адамдарға арналған нұсқа'
    },
    en: {
        'home': 'Home',
        'recognition': 'Recognition',
        'accreditation': 'Accreditation',
        'bologna': 'Bologna Process',
        'news': 'News',
        'contacts': 'Contacts',
        'apply': 'Apply',
        'accessibility': 'Accessibility version'
    }
};

// Функция для переключения языка
function switchLanguage(lang) {
    // Сохраняем выбранный язык
    localStorage.setItem('language', lang);
    
    // Обновляем активную кнопку
    document.querySelectorAll('.language-switch').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });
    
    // Обновляем текст на странице
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Получаем текущий язык из localStorage или используем русский по умолчанию
    const currentLang = localStorage.getItem('language') || 'ru';
    
    // Устанавливаем начальный язык
    switchLanguage(currentLang);
    
    // Добавляем обработчики событий для кнопок переключения языка
    document.querySelectorAll('.language-switch').forEach(btn => {
        btn.addEventListener('click', () => {
            switchLanguage(btn.dataset.lang);
        });
    });

    // Мобильное меню
    const menuToggle = document.querySelector('.header__menu-toggle');
    const nav = document.querySelector('.header__nav');
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Функционал версии для слабовидящих
    const accessibilityBtn = document.getElementById('accessibilityToggle');
    const body = document.body;
    
    // Проверяем сохраненные настройки
    const isAccessibilityMode = localStorage.getItem('accessibilityMode') === 'true';
    if (isAccessibilityMode) {
        body.classList.add('accessibility-mode');
        accessibilityBtn.classList.add('active');
    }
    
    // Обработчик клика по кнопке
    accessibilityBtn.addEventListener('click', function() {
        body.classList.toggle('accessibility-mode');
        accessibilityBtn.classList.toggle('active');
        
        // Сохраняем настройки
        localStorage.setItem('accessibilityMode', body.classList.contains('accessibility-mode'));
    });
});

// Экспортируем функцию для использования в других скриптах
window.switchLanguage = switchLanguage;

// Загружаем шапку при загрузке страницы
document.addEventListener('DOMContentLoaded', loadHeader); 
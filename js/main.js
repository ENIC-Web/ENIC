// Language codes mapping
const languageCodes = {
    'kk': 'kk', // Kazakh
    'ru': 'ru', // Russian
    'en': 'en'  // English
};

// Language switcher
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Get language buttons
    const langButtons = document.querySelectorAll('.language-switcher button');
    console.log('Found language buttons:', langButtons.length);
    
    // Add click event listeners to language buttons
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Language button clicked:', this.getAttribute('data-lang'));
            
            // Remove active class from all buttons
            langButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });

    // Check for saved language preference
    const savedLang = localStorage.getItem('preferred_language');
    if (savedLang) {
        console.log('Found saved language:', savedLang);
        const savedButton = document.querySelector(`.language-switcher button[data-lang="${savedLang}"]`);
        if (savedButton) {
            savedButton.classList.add('active');
            changeLanguage(savedLang);
        }
    }
});

// Function to change language using local translations
function changeLanguage(lang) {
    console.log('Changing language to:', lang);
    
    document.documentElement.lang = lang;
    
    // Все элементы с data-translate
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    localStorage.setItem('preferred_language', lang);
}

// Accessibility mode toggle
document.addEventListener('DOMContentLoaded', function() {
    const accessibilityBtn = document.querySelector('.accessibility-btn');
    if (accessibilityBtn) {
        accessibilityBtn.addEventListener('click', function() {
            document.body.classList.toggle('accessibility-mode');
            localStorage.setItem('accessibility_mode', document.body.classList.contains('accessibility-mode'));
        });

        // Check for saved accessibility preference
        if (localStorage.getItem('accessibility_mode') === 'true') {
            document.body.classList.add('accessibility-mode');
        }
    }
});

// Mobile menu
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.header__menu-toggle');
    const headerNav = document.querySelector('.header__nav');
    const body = document.body;

    if (menuToggle && headerNav) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            headerNav.classList.toggle('active');
            body.classList.toggle('menu-open');
        });

        // Закрытие меню при клике вне его
        document.addEventListener('click', function(e) {
            if (!headerNav.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                headerNav.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });

        // Закрытие меню при изменении размера окна
        window.addEventListener('resize', function() {
            if (window.innerWidth > 992) {
                menuToggle.classList.remove('active');
                headerNav.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });

        // Закрытие меню при клике на ссылку
        const navLinks = headerNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                headerNav.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });
    }

    // Обработка FAQ аккордеона
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('h4');
        const answer = item.querySelector('p');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                
                // Закрываем все FAQ
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('p');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = null;
                    }
                });

                // Открываем текущий FAQ если он был закрыт
                if (!isOpen) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });

    // Анимация появления элементов при скролле
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-fade-in');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Добавляем класс для анимации
    document.querySelectorAll('.service-card, .news-card, .faq-item').forEach(element => {
        element.classList.add('animate-fade-in');
    });

    // Запускаем анимацию при загрузке и скролле
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // Обработка формы обратной связи
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Здесь будет код для отправки формы
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Пример валидации
            let isValid = true;
            for (let key in data) {
                if (!data[key]) {
                    isValid = false;
                    break;
                }
            }

            if (isValid) {
                // Здесь будет код для отправки данных на сервер
                alert('Сообщение отправлено!');
                this.reset();
            } else {
                alert('Пожалуйста, заполните все поля');
            }
        });
    }
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Animation on scroll
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
});

// Функция инициализации переводов и кнопок
function initTranslation() {
    // Get language buttons
    const langButtons = document.querySelectorAll('.language-switcher button');
    langButtons.forEach(button => {
        button.onclick = null;
        button.addEventListener('click', function() {
            langButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });
    // Активируем сохранённый язык
    const savedLang = localStorage.getItem('preferred_language') || 'kk';
    const savedButton = document.querySelector(`.language-switcher button[data-lang="${savedLang}"]`);
    if (savedButton) {
        savedButton.classList.add('active');
        changeLanguage(savedLang);
    }
} 
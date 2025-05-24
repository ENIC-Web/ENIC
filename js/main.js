// Configuration
const config = {
    apiKey: 'AIzaSyDDV62hmoTZAU45LkooplvpYejElR73bck',
    apiUrl: 'https://translation.googleapis.com/language/translate/v2'
};

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

// Function to change language using Google Translate API
async function changeLanguage(lang) {
    console.log('Changing language to:', lang);
    
    document.documentElement.lang = lang;
    
    // Все элементы с data-translate
    const elements = document.querySelectorAll('[data-translate]');
    // Кнопки
    const buttonElements = document.querySelectorAll('button[data-translate], input[type="button"][data-translate], input[type="submit"][data-translate]');
    // Опции в select
    const optionElements = document.querySelectorAll('select option[data-translate]');
    
    // Собираем тексты для перевода
    const texts = [
        ...Array.from(elements).map(el => el.textContent),
        ...Array.from(buttonElements).map(el => el.tagName === 'BUTTON' ? el.textContent : el.value),
        ...Array.from(optionElements).map(el => el.textContent)
    ];
    console.log('Texts to translate:', texts);
    
    try {
        const sourceLang = lang === 'kk' ? 'en' : 'kk';
        const response = await fetch(`${config.apiUrl}?key=${config.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: texts,
                source: sourceLang,
                target: languageCodes[lang],
                format: 'text'
            })
        });
        const data = await response.json();
        if (data.data && data.data.translations) {
            const translations = data.data.translations.map(t => t.translatedText);
            let i = 0;
            // Обычные элементы
            elements.forEach(el => {
                el.textContent = translations[i++] || el.textContent;
            });
            // Кнопки
            buttonElements.forEach(el => {
                if (el.tagName === 'BUTTON') {
                    el.textContent = translations[i++] || el.textContent;
                } else {
                    el.value = translations[i++] || el.value;
                }
            });
            // Опции
            optionElements.forEach(el => {
                el.textContent = translations[i++] || el.textContent;
            });
        } else {
            alert('Ошибка перевода: ' + (data.error?.message || 'Неизвестная ошибка'));
        }
    } catch (error) {
        alert('Произошла ошибка при переводе. Пожалуйста, попробуйте позже.');
    }
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
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
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
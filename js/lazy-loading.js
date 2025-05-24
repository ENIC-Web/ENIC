class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };
        this.observer = new IntersectionObserver(this.handleIntersection.bind(this), this.options);
        this.init();
    }

    init() {
        this.images.forEach(image => {
            this.observer.observe(image);
        });
    }

    handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadImage(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }

    loadImage(image) {
        const src = image.getAttribute('data-src');
        if (!src) return;

        // Создаем временное изображение для проверки загрузки
        const tempImage = new Image();
        
        tempImage.onload = () => {
            image.src = src;
            image.classList.add('loaded');
            image.removeAttribute('data-src');
        };

        tempImage.onerror = () => {
            console.error(`Ошибка загрузки изображения: ${src}`);
            image.classList.add('error');
        };

        tempImage.src = src;
    }
}

// Инициализация ленивой загрузки при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new LazyLoader();
}); 
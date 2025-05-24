// Функция для проверки поддержки WebP
function checkWebpSupport() {
    return new Promise((resolve) => {
        const webp = new Image();
        webp.onload = webp.onerror = function() {
            resolve(webp.height === 2);
        };
        webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
}

// Функция для загрузки изображения
async function loadImage(src) {
    const isWebpSupported = await checkWebpSupport();
    const img = new Image();
    
    // Если браузер поддерживает WebP, используем WebP версию
    if (isWebpSupported) {
        src = src.replace(/\.(jpg|jpeg|png)$/, '.webp');
    }
    
    img.src = src;
    return img;
}

// Функция для оптимизации всех изображений на странице
function optimizeImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    images.forEach(img => {
        const src = img.getAttribute('data-src');
        loadImage(src).then(optimizedImg => {
            img.src = optimizedImg.src;
            img.removeAttribute('data-src');
        });
    });
}

// Запускаем оптимизацию при загрузке страницы
document.addEventListener('DOMContentLoaded', optimizeImages); 
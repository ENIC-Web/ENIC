document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body;

    // Создаем оверлей
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    body.appendChild(overlay);

    // Функция для открытия/закрытия меню
    function toggleMenu() {
        menuToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
        overlay.classList.toggle('active');
        body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
    }

    // Обработчик клика по бургер-меню
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMenu();
        });
    }

    // Закрытие меню при клике на оверлей
    overlay.addEventListener('click', function(e) {
        e.preventDefault();
        toggleMenu();
    });

    // Закрытие меню при клике на пункт меню
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Закрытие меню при изменении размера окна
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mainNav.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Предотвращение скролла при открытом меню
    mainNav.addEventListener('touchmove', function(e) {
        if (mainNav.classList.contains('active')) {
            e.preventDefault();
        }
    }, { passive: false });

    // Добавляем класс active для текущего пункта меню
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPage) {
            link.classList.add('active');
        }
    });
}); 
// Функция для загрузки хлебных крошек
function loadBreadcrumbs(pageTitle) {
    fetch('breadcrumbs.html')
        .then(response => response.text())
        .then(data => {
            const breadcrumbsContainer = document.getElementById('breadcrumbs');
            if (breadcrumbsContainer) {
                breadcrumbsContainer.innerHTML = data;
                // Обновляем текст текущей страницы
                const activeLink = breadcrumbsContainer.querySelector('.breadcrumbs__link.active');
                if (activeLink) {
                    activeLink.textContent = pageTitle;
                }
            }
        })
        .catch(error => console.error('Ошибка загрузки хлебных крошек:', error));
}

// Функция для определения заголовка страницы
function getPageTitle() {
    const titleElement = document.querySelector('h1[data-translate]');
    return titleElement ? titleElement.textContent : document.title;
}

// Инициализация хлебных крошек при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const pageTitle = getPageTitle();
    loadBreadcrumbs(pageTitle);
}); 
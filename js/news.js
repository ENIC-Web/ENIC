
        // Фильтрация новостей
        const filterButtons = document.querySelectorAll('.filter-btn');
        const newsCards = document.querySelectorAll('.news-card');
        const searchInput = document.getElementById('newsSearch');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Убираем активный класс у всех кнопок
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Добавляем активный класс нажатой кнопке
                button.classList.add('active');

                const category = button.dataset.category;
                
                newsCards.forEach(card => {
                    if (category === 'all' || card.dataset.category === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });

        // Поиск по новостям
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();

            newsCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const content = card.querySelector('p').textContent.toLowerCase();

                if (title.includes(searchTerm) || content.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
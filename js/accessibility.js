document.addEventListener('DOMContentLoaded', function() {
    // УДАЛЕНО: автоматическое создание кнопки для слабовидящих
    // ... остальной код можно оставить, если он не влияет на отображение кнопки ...

    // Создаем кнопку для слабовидящих
    const visuallyImpairedButton = document.createElement('button');
    visuallyImpairedButton.className = 'visually-impaired';
    visuallyImpairedButton.innerHTML = `
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
        </svg>
        <span>Версия для слабовидящих</span>
    `;
    document.body.appendChild(visuallyImpairedButton);

    // Функция для переключения режима
    function toggleVisuallyImpairedMode() {
        document.body.classList.toggle('visually-impaired-mode');
        
        // Сохраняем состояние в localStorage
        const isEnabled = document.body.classList.contains('visually-impaired-mode');
        localStorage.setItem('visuallyImpairedMode', isEnabled);
        
        // Обновляем текст кнопки
        const buttonText = visuallyImpairedButton.querySelector('span');
        buttonText.textContent = isEnabled ? 'Обычная версия' : 'Версия для слабовидящих';
    }

    // Добавляем обработчик клика
    visuallyImpairedButton.addEventListener('click', toggleVisuallyImpairedMode);

    // Проверяем сохраненное состояние
    const savedMode = localStorage.getItem('visuallyImpairedMode');
    if (savedMode === 'true') {
        toggleVisuallyImpairedMode();
    }

    // Добавляем поддержку клавиатурной навигации
    visuallyImpairedButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleVisuallyImpairedMode();
        }
    });

    // Добавляем ARIA-атрибуты
    visuallyImpairedButton.setAttribute('role', 'button');
    visuallyImpairedButton.setAttribute('aria-pressed', document.body.classList.contains('visually-impaired-mode'));
    visuallyImpairedButton.setAttribute('aria-label', 'Переключить версию для слабовидящих');

    // Обновляем ARIA-атрибуты при переключении
    const originalToggleVisuallyImpairedMode = toggleVisuallyImpairedMode;
    toggleVisuallyImpairedMode = function() {
        originalToggleVisuallyImpairedMode();
        visuallyImpairedButton.setAttribute('aria-pressed', 
            document.body.classList.contains('visually-impaired-mode'));
    };
}); 
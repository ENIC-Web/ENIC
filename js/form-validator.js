class FormValidator {
    constructor(form) {
        this.form = form;
        this.fields = form.querySelectorAll('input, select, textarea');
        this.errors = {};
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.fields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.validateField(field));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Проверка обязательных полей
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Это поле обязательно для заполнения';
        }

        // Валидация email
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Введите корректный email адрес';
            }
        }

        // Валидация телефона
        if (field.type === 'tel' && value) {
            const phoneRegex = /^\+7\s?[\(]{0,1}7[0-9]{2}[\)]{0,1}\s?\d{3}[-]{0,1}\d{2}[-]{0,1}\d{2}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Введите корректный номер телефона';
            }
        }

        // Валидация файлов
        if (field.type === 'file') {
            const file = field.files[0];
            if (file) {
                // Проверка размера файла (максимум 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    isValid = false;
                    errorMessage = 'Размер файла не должен превышать 5MB';
                }

                // Проверка типа файла
                const allowedTypes = field.accept.split(',').map(type => type.trim());
                if (!allowedTypes.some(type => file.type.match(type.replace('*', '.*')))) {
                    isValid = false;
                    errorMessage = 'Недопустимый тип файла';
                }
            }
        }

        this.setFieldValidation(field, isValid, errorMessage);
        return isValid;
    }

    setFieldValidation(field, isValid, errorMessage) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message') || document.createElement('div');
        
        if (!formGroup.querySelector('.error-message')) {
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }

        if (!isValid) {
            field.classList.add('invalid');
            errorElement.textContent = errorMessage;
            this.errors[field.name] = errorMessage;
        } else {
            field.classList.remove('invalid');
            errorElement.textContent = '';
            delete this.errors[field.name];
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        let isValid = true;
        this.fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (isValid) {
            // Показываем индикатор загрузки
            const loadingOverlay = document.querySelector('.loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.classList.add('active');
            }

            // Здесь будет отправка формы
            const formData = new FormData(this.form);
            
            // Имитация отправки формы
            setTimeout(() => {
                if (loadingOverlay) {
                    loadingOverlay.classList.remove('active');
                }
                alert('Форма успешно отправлена!');
                this.form.reset();
            }, 1000);
        } else {
            // Прокручиваем к первому полю с ошибкой
            const firstError = this.form.querySelector('.invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }
}

// Инициализация валидации для всех форм
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form').forEach(form => {
        new FormValidator(form);
    });
}); 
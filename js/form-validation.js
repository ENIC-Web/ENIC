document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('applicationForm');
    if (!form || form.closest('.application-form')) return;  // Пропускаем форму заявки

    // Регулярные выражения для валидации
    const patterns = {
        name: /^[А-ЯЁа-яё\s-]{2,50}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        phone: /^\+7\s?\(?\d{3}\)?\s?\d{3}[- ]?\d{2}[- ]?\d{2}$/
    };

    // Сообщения об ошибках
    const errorMessages = {
        required: 'Это поле обязательно для заполнения',
        name: 'Введите корректное имя (только буквы, дефис и пробел)',
        email: 'Введите корректный email адрес',
        phone: 'Введите номер телефона в формате +7 (XXX) XXX-XX-XX',
        file: 'Загрузите документ в формате PDF, JPG или PNG',
        agreement: 'Необходимо согласиться с условиями'
    };

    // Функция валидации поля
    function validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const name = field.name;
        let isValid = true;
        let errorMessage = '';

        // Проверка обязательных полей
        if (field.required && !value) {
            isValid = false;
            errorMessage = errorMessages.required;
        }

        // Специфические проверки
        if (isValid && value) {
            switch (name) {
                case 'lastName':
                case 'firstName':
                case 'middleName':
                    if (!patterns.name.test(value)) {
                        isValid = false;
                        errorMessage = errorMessages.name;
                    }
                    break;
                case 'email':
                    if (!patterns.email.test(value)) {
                        isValid = false;
                        errorMessage = errorMessages.email;
                    }
                    break;
                case 'phone':
                    if (!patterns.phone.test(value)) {
                        isValid = false;
                        errorMessage = errorMessages.phone;
                    }
                    break;
                case 'documentFile':
                    const file = field.files[0];
                    if (file) {
                        const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
                        if (!validTypes.includes(file.type)) {
                            isValid = false;
                            errorMessage = errorMessages.file;
                        }
                    }
                    break;
                case 'agreement':
                    if (!field.checked) {
                        isValid = false;
                        errorMessage = errorMessages.agreement;
                    }
                    break;
            }
        }

        // Обновление UI
        const formGroup = field.closest('.form-group');
        if (!isValid) {
            formGroup.classList.add('error');
            const errorElement = formGroup.querySelector('.error-message');
            if (errorElement) {
                errorElement.textContent = errorMessage;
            }
        } else {
            formGroup.classList.remove('error');
        }

        return isValid;
    }

    // Обработчик отправки формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const fields = form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        if (isValid) {
            // Здесь будет отправка данных на сервер
            const formData = new FormData(form);
            
            // Имитация отправки
            console.log('Отправка формы...');
            setTimeout(() => {
                alert('Заявка успешно отправлена!');
                form.reset();
            }, 1000);
        }
    });

    // Валидация при вводе
    form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', function() {
            validateField(this);
        });

        field.addEventListener('blur', function() {
            validateField(this);
        });
    });

    // Маска для телефона
    const phoneInput = form.querySelector('#phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = '+7 (' + value;
                } else if (value.length <= 6) {
                    value = '+7 (' + value.slice(0, 3) + ') ' + value.slice(3);
                } else if (value.length <= 8) {
                    value = '+7 (' + value.slice(0, 3) + ') ' + value.slice(3, 6) + '-' + value.slice(6);
                } else {
                    value = '+7 (' + value.slice(0, 3) + ') ' + value.slice(3, 6) + '-' + value.slice(6, 8) + '-' + value.slice(8, 10);
                }
            }
            e.target.value = value;
        });
    }
}); 
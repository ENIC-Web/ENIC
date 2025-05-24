
        // Обработка формы
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            let isValid = true;
            for (let [key, value] of formData.entries()) {
                if (!value) {
                    isValid = false;
                    break;
                }
            }

            if (isValid) {
                alert('Сообщение успешно отправлено!');
                this.reset();
            } else {
                alert('Пожалуйста, заполните все обязательные поля');
            }
        });
// Обработка выбора файлов
const fileInput = document.getElementById('documents');
const fileName = document.querySelector('.file-name');
const fileLabel = document.querySelector('.file-upload-label span');

fileInput.addEventListener('change', function(e) {
    if (this.files.length > 0) {
        const fileNames = Array.from(this.files).map(file => file.name).join(', ');
        fileName.textContent = fileNames;
        fileLabel.textContent = 'Файлы выбраны';
        fileLabel.style.color = 'var(--color-primary)';
    } else {
        fileName.textContent = '';
        fileLabel.textContent = 'Выберите файлы';
        fileLabel.style.color = '';
    }
});

// Обработка формы
document.getElementById('accreditationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    let isValid = true;
    for (let [key, value] of formData.entries()) {
        if (!value && key !== 'comments') {
            isValid = false;
            break;
        }
    }

    if (isValid) {
        const submitButton = this.querySelector('.accreditation-submit-btn');
        submitButton.innerHTML = '<span class="loading"></span> Отправка...';
        submitButton.disabled = true;

        // Имитация отправки формы
        setTimeout(() => {
            alert('Заявка успешно отправлена!');
            this.reset();
            fileName.textContent = '';
            fileLabel.textContent = 'Выберите файлы';
            fileLabel.style.color = '';
            submitButton.innerHTML = 'Отправить заявку';
            submitButton.disabled = false;
        }, 1500);
    } else {
        alert('Пожалуйста, заполните все обязательные поля');
    }
});
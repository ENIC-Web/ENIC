// Загрузка контента
fetch('breadcrumbs.html')
.then(response => response.text())
.then(data => {
    document.getElementById('breadcrumbs').innerHTML = data;
    // Обновляем текст текущей страницы
    document.querySelector('.breadcrumbs__link.active').textContent = 'Признание документов';
});

// Обработка формы
document.getElementById('recognitionForm').addEventListener('submit', function(e) {
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
    alert('Заявка успешно отправлена!');
    this.reset();
} else {
    alert('Пожалуйста, заполните все обязательные поля');
}
});

// Функционал калькулятора
const calculator = {
baseCosts: {
    bachelor: 15000,
    master: 20000,
    phd: 25000
},
countryMultipliers: {
    russia: 1,
    ukraine: 1.2,
    belarus: 1.2,
    other: 1.5
},
urgencyMultipliers: {
    normal: 1,
    urgent: 1.5,
    express: 2
},
processingTimes: {
    normal: {
        bachelor: '15-30 дней',
        master: '15-30 дней',
        phd: '20-40 дней'
    },
    urgent: {
        bachelor: '7 дней',
        master: '7 дней',
        phd: '10 дней'
    },
    express: {
        bachelor: '3 дня',
        master: '3 дня',
        phd: '5 дней'
    }
},
calculate: function(documentType, country, urgency) {
    if (!documentType || !country || !urgency) {
        return null;
    }

    const baseCost = this.baseCosts[documentType];
    const countryMultiplier = this.countryMultipliers[country];
    const urgencyMultiplier = this.urgencyMultipliers[urgency];
    
    const serviceCost = baseCost * countryMultiplier;
    const totalCost = serviceCost * urgencyMultiplier;
    const processingTime = this.processingTimes[urgency][documentType];

    return {
        serviceCost: Math.round(serviceCost),
        totalCost: Math.round(totalCost),
        processingTime: processingTime
    };
}
};

document.getElementById('calculateBtn').addEventListener('click', function() {
const documentType = document.getElementById('calcDocumentType').value;
const country = document.getElementById('calcCountry').value;
const urgency = document.getElementById('calcUrgency').value;

const result = calculator.calculate(documentType, country, urgency);

if (result) {
    document.getElementById('processingTime').textContent = result.processingTime;
    document.getElementById('serviceCost').textContent = result.serviceCost + ' ₸';
    document.getElementById('totalCost').textContent = result.totalCost + ' ₸';
} else {
    alert('Пожалуйста, заполните все поля калькулятора');
}
});
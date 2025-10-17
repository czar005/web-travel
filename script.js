// Загрузка данных для главной страницы
async function loadData() {
    console.log('📥 Загрузка данных для главной страницы...');
    
    try {
        // В первую очередь пробуем получить из worldtravel_current_data
        const currentData = localStorage.getItem('worldtravel_current_data');
        if (currentData) {
            const data = JSON.parse(currentData);
            console.log('✅ Данные загружены из worldtravel_current_data');
            return data;
        }
        
        // Затем пробуем получить из worldtravel_data
        const savedData = localStorage.getItem('worldtravel_data');
        if (savedData) {
            const data = JSON.parse(savedData);
            console.log('✅ Данные загружены из worldtravel_data');
            return data;
        }
        
        // Если в localStorage нет, пробуем загрузить из файла
        console.log('🔄 Загрузка из data/content.json...');
        const response = await fetch('./data/content.json');
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Данные загружены из content.json');
            return data;
        }
        
        throw new Error('Файл не найден');
    } catch (error) {
        console.error('❌ Ошибка загрузки данных:', error);
        return getDefaultData();
    }
}

function getDefaultData() {
    return {
        countries: [],
        content: {
            heroTitle: "Откройте мир с WorldTravel",
            heroText: "Мы создаем незабываемые путешествия по всему миру",
            contactPhone: "+7 (999) 123-45-67",
            contactEmail: "info@worldtravel.com",
            contactAddress: "Москва, ул. Туристическая, 15",
            contactHours: "Пн-Пт: 9:00-18:00"
        },
        design: {},
        settings: {}
    };
}

// Отображение стран
function displayCountries(countries) {
    const container = document.getElementById('countries-grid');
    if (!container) {
        console.log('ℹ️ Контейнер стран не найден на этой странице');
        return;
    }

    console.log('🎯 Отображение стран:', countries);

    if (!countries || countries.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <div style="font-size: 48px; margin-bottom: 20px;">🌍</div>
                <h3>Страны скоро появятся</h3>
                <p>Администратор добавляет направления</p>
            </div>
        `;
        return;
    }

    container.innerHTML = countries.map(country => `
        <div class="country-card">
            <div class="country-image">
                <img src="${country.image || 'images/travel-placeholder.svg'}" alt="${country.name}" 
                     onerror="this.src='images/travel-placeholder.svg'">
            </div>
            <div class="country-info">
                <h3>${country.name}</h3>
                <p>${country.description}</p>
                <div class="country-price">${country.price}</div>
                <button class="btn btn-primary">Подробнее</button>
            </div>
        </div>
    `).join('');
}

// Отображение контента
function displayContent(content) {
    console.log('📝 Отображение контента:', content);
    
    // Обновляем заголовок
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle && content.heroTitle) {
        heroTitle.textContent = content.heroTitle;
    }
    
    // Обновляем текст
    const heroText = document.querySelector('.hero p');
    if (heroText && content.heroText) {
        heroText.textContent = content.heroText;
    }
    
    // Обновляем контактную информацию
    updateContactInfo(content);
}

// Обновление контактной информации
function updateContactInfo(content) {
    console.log('📞 Обновление контактной информации:', content);
    
    // Телефон
    if (content.contactPhone) {
        // Ищем все элементы где может быть телефон
        const phoneElements = document.querySelectorAll('[href*="tel:"], .contact-phone');
        phoneElements.forEach(el => {
            if (el.href) {
                el.href = 'tel:' + content.contactPhone.replace(/[^0-9+]/g, '');
            }
            if (el.textContent) {
                el.textContent = content.contactPhone;
            }
        });
        
        // Также обновляем текст если есть элементы с классом phone
        const phoneTextElements = document.querySelectorAll('.phone, [data-contact="phone"]');
        phoneTextElements.forEach(el => {
            el.textContent = content.contactPhone;
        });
    }
    
    // Email
    if (content.contactEmail) {
        const emailElements = document.querySelectorAll('[href*="mailto:"], .contact-email');
        emailElements.forEach(el => {
            if (el.href) {
                el.href = 'mailto:' + content.contactEmail;
            }
            if (el.textContent) {
                el.textContent = content.contactEmail;
            }
        });
        
        const emailTextElements = document.querySelectorAll('.email, [data-contact="email"]');
        emailTextElements.forEach(el => {
            el.textContent = content.contactEmail;
        });
    }
    
    // Адрес
    if (content.contactAddress) {
        const addressElements = document.querySelectorAll('.address, [data-contact="address"]');
        addressElements.forEach(el => {
            el.textContent = content.contactAddress;
        });
    }
    
    // Часы работы
    if (content.contactHours) {
        const hoursElements = document.querySelectorAll('.hours, [data-contact="hours"]');
        hoursElements.forEach(el => {
            el.textContent = content.contactHours;
        });
    }
}

// Применение системных настроек
function applySystemSettings(settings) {
    console.log('⚙️ Применение системных настроек:', settings);
    
    // Обновляем название компании
    if (settings.companyName) {
        document.title = settings.companyName + " - Путешествия по миру";
        
        // Также обновляем в хедере если есть
        const companyNameElements = document.querySelectorAll('.company-name, [data-setting="companyName"]');
        companyNameElements.forEach(el => {
            el.textContent = settings.companyName;
        });
    }
    
    // Применяем цвета
    if (settings.primaryColor) {
        document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    }
    if (settings.secondaryColor) {
        document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
    }
}

// Инициализация главной страницы
async function initMainPage() {
    console.log('�� Инициализация главной страницы...');
    
    try {
        const data = await loadData();
        console.log('📊 Полученные данные:', data);
        
        // Отображаем страны
        if (data.countries) {
            displayCountries(data.countries);
        }
        
        // Отображаем контент
        if (data.content) {
            displayContent(data.content);
        }
        
        // Применяем системные настройки
        if (data.settings) {
            applySystemSettings(data.settings);
        }
        
        console.log('✅ Главная страница успешно обновлена');
        
    } catch (error) {
        console.error('❌ Ошибка инициализации главной страницы:', error);
    }
}

// Функция для принудительного обновления (можно вызвать из консоли)
window.refreshMainPage = function() {
    console.log('🔄 Принудительное обновление главной страницы...');
    initMainPage();
};

// Функция для очистки кэша и перезагрузки
window.clearCacheAndRefresh = function() {
    console.log('🧹 Очистка кэша и перезагрузка...');
    localStorage.removeItem('worldtravel_current_data');
    localStorage.removeItem('worldtravel_data');
    setTimeout(() => {
        location.reload();
    }, 1000);
};

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', initMainPage);

// Также обновляем при изменении localStorage
window.addEventListener('storage', function(e) {
    if (e.key === 'worldtravel_current_data' || e.key === 'worldtravel_data') {
        console.log('📡 Обнаружены изменения в данных, обновляю страницу...');
        setTimeout(initMainPage, 100);
    }
});

// Периодическая проверка обновлений (каждые 5 секунд)
setInterval(() => {
    const currentData = localStorage.getItem('worldtravel_current_data');
    const lastData = window.lastKnownData;
    
    if (currentData !== lastData) {
        console.log('🔄 Обнаружены новые данные, обновляю...');
        window.lastKnownData = currentData;
        initMainPage();
    }
}, 5000);

// Сохраняем начальные данные
window.lastKnownData = localStorage.getItem('worldtravel_current_data');

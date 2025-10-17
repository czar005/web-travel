// Улучшенная загрузка данных для главной страницы
async function loadData() {
    console.log('📥 Загрузка данных для главной страницы...');
    
    try {
        // В первую очередь пробуем получить из worldtravel_current_data
        const currentData = localStorage.getItem('worldtravel_current_data');
        if (currentData) {
            const data = JSON.parse(currentData);
            console.log('✅ Данные загружены из worldtravel_current_data:', data);
            return data;
        }
        
        // Затем пробуем получить из worldtravel_data
        const savedData = localStorage.getItem('worldtravel_data');
        if (savedData) {
            const data = JSON.parse(savedData);
            console.log('✅ Данные загружены из worldtravel_data:', data);
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
            contactEmail: "info@worldtravel.com"
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
        container.innerHTML = '<div class="no-data"><p>Страны скоро появятся</p></div>';
        return;
    }

    container.innerHTML = countries.map(country => `
        <div class="country-card">
            <div class="country-image">
                <img src="${country.image || 'images/travel-placeholder.jpg'}" alt="${country.name}">
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
    
    // Обновляем телефон если есть где его показать
    const phoneElements = document.querySelectorAll('[data-contact="phone"]');
    phoneElements.forEach(el => {
        if (content.contactPhone) el.textContent = content.contactPhone;
    });
}

// Инициализация страницы
async function initPage() {
    console.log('🚀 Инициализация главной страницы...');
    
    try {
        const data = await loadData();
        console.log('📊 Полученные данные:', data);
        
        displayCountries(data.countries || []);
        displayContent(data.content || {});
        
        console.log('✅ Страница успешно обновлена');
    } catch (error) {
        console.error('❌ Ошибка инициализации:', error);
    }
}

// Принудительное обновление (можно вызвать из консоли)
window.forceRefresh = function() {
    console.log('🔄 Принудительное обновление данных');
    localStorage.removeItem('worldtravel_current_data');
    localStorage.removeItem('worldtravel_data');
    initPage();
};

// Запускаем при загрузке
document.addEventListener('DOMContentLoaded', initPage);

// Также обновляем при изменении localStorage
window.addEventListener('storage', function(e) {
    if (e.key === 'worldtravel_current_data' || e.key === 'worldtravel_data') {
        console.log('📡 Обнаружены изменения в данных, обновляю страницу...');
        initPage();
    }
});

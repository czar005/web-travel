// Загрузка данных для главной страницы
async function loadData() {
    console.log('📥 Загрузка данных для главной страницы...');
    
    try {
        // Пробуем загрузить из localStorage (данные из админки)
        const savedData = localStorage.getItem('worldtravel_current_data');
        if (savedData) {
            const data = JSON.parse(savedData);
            console.log('✅ Данные загружены из админки:', data);
            return data;
        }
        
        // Если в localStorage нет, загружаем из файла
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
        // Возвращаем данные по умолчанию
        return getDefaultData();
    }
}

// Данные по умолчанию
function getDefaultData() {
    return {
        countries: [
            {
                id: 1,
                name: "Франция",
                description: "Страна искусства, моды и изысканной кухни",
                image: "images/france.jpg",
                price: "от $500"
            },
            {
                id: 2,
                name: "Италия",
                description: "Страна древней истории, искусства и кулинарных традиций",
                image: "images/italy.jpg", 
                price: "от $450"
            }
        ],
        content: {
            heroTitle: "Откройте мир с WorldTravel",
            heroText: "Мы создаем незабываемые путешествия по всему миру. От экзотических пляжей до горных вершин – ваше приключение начинается здесь.",
            contactPhone: "+7 (999) 123-45-67",
            contactEmail: "info@worldtravel.com",
            contactAddress: "Москва, ул. Туристическая, 15",
            contactHours: "Пн-Пт: 9:00-18:00"
        },
        design: {
            blocks: {
                hero: true,
                destinations: true,
                contact: true
            }
        },
        settings: {
            companyName: "WorldTravel",
            primaryColor: "#2c5aa0",
            secondaryColor: "#4a7bc8"
        }
    };
}

// Отображение стран на главной странице
function displayCountries(countries) {
    const container = document.getElementById('countries-grid');
    if (!container) {
        console.error('❌ Контейнер стран не найден на главной странице');
        return;
    }

    console.log('🎯 Отображение стран:', countries.length);

    if (!countries || countries.length === 0) {
        container.innerHTML = `
            <div class="no-countries">
                <h3>Страны скоро появятся</h3>
                <p>Администратор добавляет направления</p>
            </div>
        `;
        return;
    }

    container.innerHTML = countries.map(country => `
        <div class="country-card">
            <div class="country-image">
                <img src="${country.image || 'images/travel-placeholder.jpg'}" alt="${country.name}" onerror="this.src='images/travel-placeholder.jpg'">
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
    
    // Обновляем герой-секцию
    const heroTitle = document.querySelector('.hero h1');
    const heroText = document.querySelector('.hero p');
    
    if (heroTitle && content.heroTitle) {
        heroTitle.textContent = content.heroTitle;
    }
    if (heroText && content.heroText) {
        heroText.textContent = content.heroText;
    }

    // Обновляем контакты если есть блок контактов
    const contactSection = document.querySelector('.contact-info');
    if (contactSection && content.contactPhone) {
        // Здесь можно обновить контактную информацию
        console.log('📞 Контактная информация для обновления:', content);
    }
}

// Применение настроек дизайна
function applyDesignSettings(design) {
    console.log('🎨 Применение настроек дизайна:', design);
    
    if (design.blocks) {
        // Скрываем/показываем блоки согласно настройкам
        const heroSection = document.querySelector('.hero');
        const destinationsSection = document.querySelector('.destinations');
        const contactSection = document.querySelector('.contact');
        
        if (heroSection) heroSection.style.display = design.blocks.hero ? 'block' : 'none';
        if (destinationsSection) destinationsSection.style.display = design.blocks.destinations ? 'block' : 'none';
        if (contactSection) contactSection.style.display = design.blocks.contact ? 'block' : 'none';
    }
}

// Применение системных настроек
function applySystemSettings(settings) {
    console.log('⚙️ Применение системных настроек:', settings);
    
    // Обновляем название компании в title
    if (settings.companyName) {
        document.title = settings.companyName + " - Путешествия по миру";
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
    console.log('🚀 Инициализация главной страницы...');
    
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
        
        // Применяем настройки дизайна
        if (data.design) {
            applyDesignSettings(data.design);
        }
        
        // Применяем системные настройки
        if (data.settings) {
            applySystemSettings(data.settings);
        }
        
        console.log('✅ Главная страница инициализирована');
    } catch (error) {
        console.error('❌ Ошибка инициализации главной страницы:', error);
    }
}

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', initMainPage);

// Функция для принудительного обновления данных (можно вызвать из консоли)
window.refreshData = function() {
    console.log('🔄 Принудительное обновление данных...');
    initMainPage();
};

// Скрипт для восстановления структуры данных
function fixDataStructure() {
    console.log('🔧 Восстановление структуры данных...');
    
    var data = localStorage.getItem('worldtravel_data');
    var fixedData = {};
    
    if (data) {
        try {
            fixedData = JSON.parse(data);
            console.log('✅ Данные найдены в localStorage');
        } catch (e) {
            console.error('❌ Ошибка парсинга данных, создаем новые');
            fixedData = createDefaultData();
        }
    } else {
        console.log('📭 Данные не найдены, создаем новые');
        fixedData = createDefaultData();
    }
    
    // Гарантируем наличие обязательных полей
    if (!fixedData.content) fixedData.content = {};
    if (!fixedData.pageStructure) fixedData.pageStructure = ['hero', 'about', 'services', 'destinations', 'contact'];
    
    // Гарантируем наличие основных секций
    var requiredSections = ['hero', 'about', 'services', 'destinations', 'contact'];
    requiredSections.forEach(function(sectionId) {
        if (!fixedData.content[sectionId]) {
            fixedData.content[sectionId] = createDefaultSection(sectionId);
        }
    });
    
    // Гарантируем наличие футера
    if (!fixedData.footer) {
        fixedData.footer = {
            id: 'footer',
            type: 'footer', 
            name: 'Футер',
            description: 'Ваш надежный партнер в мире путешествий. Мы делаем ваши мечты о путешествиях реальностью.',
            copyright: '&copy; 2024 WorldTravel. Все права защищены.'
        };
    }
    
    fixedData.lastUpdate = new Date().toISOString();
    
    // Сохраняем исправленные данные
    localStorage.setItem('worldtravel_data', JSON.stringify(fixedData));
    console.log('💾 Структура данных восстановлена');
    
    // Обновляем DataManager если он доступен
    if (typeof window.dataManager !== 'undefined' && window.dataManager) {
        window.dataManager.setData(fixedData);
    }
    
    return fixedData;
}

function createDefaultData() {
    return {
        content: {
            hero: createDefaultSection('hero'),
            about: createDefaultSection('about'),
            services: createDefaultSection('services'),
            destinations: createDefaultSection('destinations'),
            contact: createDefaultSection('contact')
        },
        footer: {
            id: 'footer',
            type: 'footer',
            name: 'Футер',
            description: 'Ваш надежный партнер в мире путешествий.',
            copyright: '&copy; 2024 WorldTravel. Все права защищены.'
        },
        contacts: {
            phone: '+7 (999) 123-45-67',
            email: 'info@worldtravel.com',
            address: 'Москва, ул. Туристическая, 15',
            hours: 'Пн-Пт: 9:00-18:00'
        },
        settings: {
            siteTitle: 'WorldTravel - Туристическая компания',
            companyName: 'WorldTravel'
        },
        pageStructure: ['hero', 'about', 'services', 'destinations', 'contact'],
        lastUpdate: new Date().toISOString()
    };
}

function createDefaultSection(sectionId) {
    var sections = {
        'hero': {
            id: 'hero',
            type: 'hero',
            name: 'Главный баннер',
            title: 'Откройте мир с WorldTravel',
            subtitle: 'Мы создаем незабываемые путешествия по всему миру. От экзотических пляжей до горных вершин - ваше приключение начинается здесь.',
            image: 'images/travel-placeholder.svg'
        },
        'about': {
            id: 'about',
            type: 'about', 
            name: 'О компании',
            title: 'О нашей компании',
            description: 'WorldTravel - это команда профессиональных путешественников и экспертов по туризму с более чем 10-летним опытом работы.',
            image: 'images/travel-placeholder.svg'
        },
        'services': {
            id: 'services',
            type: 'services',
            name: 'Услуги', 
            title: 'Наши услуги'
        },
        'destinations': {
            id: 'destinations',
            type: 'destinations',
            name: 'Направления',
            title: 'Популярные направления',
            subtitle: 'Откройте для себя лучшие направления мира с нашими эксклюзивными турами'
        },
        'contact': {
            id: 'contact',
            type: 'contact',
            name: 'Контакты',
            title: 'Свяжитесь с нами'
        }
    };
    
    return sections[sectionId] || {
        id: sectionId,
        type: 'custom',
        name: 'Секция ' + sectionId,
        title: 'Заголовок секции'
    };
}

// Запускаем восстановление при загрузке
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(fixDataStructure, 100);
});

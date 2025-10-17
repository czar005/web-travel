// script.js - Основной скрипт для главной страницы
console.log('WorldTravel script loaded');

// Функция для загрузки данных из редактора страниц
function loadPageEditorData() {
    try {
        // Пробуем загрузить из dataManager
        if (typeof dataManager !== 'undefined') {
            const data = dataManager.getData();
            if (data.pages && data.pages.index && data.pages.index.blocks) {
                console.log('Загружены данные из редактора страниц:', data.pages.index.blocks);
                return data.pages.index.blocks;
            }
        }
        
        // Пробуем загрузить из localStorage
        const savedData = localStorage.getItem('worldtravel_page_editor_data');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            console.log('Загружены данные из localStorage:', parsedData.blocks);
            return parsedData.blocks;
        }
        
        // Пробуем загрузить старые данные
        const oldData = localStorage.getItem('page-index-blocks');
        if (oldData) {
            console.log('Загружены старые данные:', JSON.parse(oldData));
            return JSON.parse(oldData);
        }
        
        console.log('Данные редактора не найдены, используются стандартные блоки');
        return null;
    } catch (error) {
        console.error('Ошибка загрузки данных редактора:', error);
        return null;
    }
}

// Функция применения данных редактора к странице
function applyEditorData() {
    const editorBlocks = loadPageEditorData();
    if (!editorBlocks || !Array.isArray(editorBlocks)) {
        console.log('Нет данных редактора для применения');
        return;
    }

    console.log('Применяем данные редактора:', editorBlocks);

    // Применяем данные к соответствующим секциям
    editorBlocks.forEach(block => {
        switch(block.type) {
            case 'hero':
                applyHeroData(block);
                break;
            case 'about':
                applyAboutData(block);
                break;
            case 'services':
                applyServicesData(block);
                break;
            case 'destinations':
                applyDestinationsData(block);
                break;
            case 'contact':
                applyContactData(block);
                break;
        }
    });
}

// Функции применения данных к конкретным секциям
function applyHeroData(block) {
    const heroTitle = document.querySelector('.hero h1');
    const heroContent = document.querySelector('.hero p');
    
    if (heroTitle && block.title) {
        heroTitle.textContent = block.title;
    }
    if (heroContent && block.content) {
        heroContent.textContent = block.content;
    }
}

function applyAboutData(block) {
    const aboutTitle = document.querySelector('.about .section-title');
    const aboutContent = document.querySelector('.about-text p');
    
    if (aboutTitle && block.title) {
        aboutTitle.textContent = block.title;
    }
    if (aboutContent && block.content) {
        aboutContent.textContent = block.content;
    }
}

function applyServicesData(block) {
    const servicesTitle = document.querySelector('.services .section-title');
    
    if (servicesTitle && block.title) {
        servicesTitle.textContent = block.title;
    }
}

function applyDestinationsData(block) {
    const destinationsTitle = document.querySelector('.destinations .section-title');
    const destinationsSubtitle = document.querySelector('.destinations .section-subtitle');
    
    if (destinationsTitle && block.title) {
        destinationsTitle.textContent = block.title;
    }
    if (destinationsSubtitle && block.content) {
        destinationsSubtitle.textContent = block.content;
    }
}

function applyContactData(block) {
    const contactTitle = document.querySelector('.contact .section-title');
    
    if (contactTitle && block.title) {
        contactTitle.textContent = block.title;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, applying editor data...');
    
    // Применяем данные редактора
    setTimeout(() => {
        applyEditorData();
    }, 100);
    
    // Остальной существующий код...
    if (typeof loadCountriesData === 'function') {
        setTimeout(() => {
            loadCountriesData();
        }, 1000);
    }
    
    // Анимация счетчиков
    const counters = document.querySelectorAll('.animate-counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        if (target) {
            animateCounter(counter.querySelector('h3'), 0, target, 2000);
        }
    });
});

// Остальные существующие функции...
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Существующие функции навигации и т.д.

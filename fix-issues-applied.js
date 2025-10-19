// Исправления для консистентности заголовков, изображений и контактов
function applyAllFixes() {
    console.log('🔧 Применение исправлений...');
    
    // 1. Исправляем заголовки в навигации и футере
    fixNavigationTitles();
    
    // 2. Добавляем редакторы изображений для всех секций
    addImageEditorsToAllSections();
    
    // 3. Исправляем контакты (телефон, email, адрес)
    fixContactInformation();
    
    // 4. Убираем дублирование графика работы в футере
    fixFooterDuplication();
    
    // 5. Объединяем дублирующиеся редакторы в секциях
    mergeDuplicateEditors();
    
    console.log('✅ Все исправления применены');
}

// 1. Исправление заголовков в навигации
function fixNavigationTitles() {
    const navTitles = {
        'home': 'Главная',
        'about': 'О нас', 
        'services': 'Услуги',
        'destinations': 'Направления',
        'contact': 'Контакты'
    };
    
    // Обновляем навигацию
    Object.keys(navTitles).forEach(sectionId => {
        const navLinks = document.querySelectorAll(`.nav-links a[href="#${sectionId}"]`);
        navLinks.forEach(link => {
            link.textContent = navTitles[sectionId];
        });
    });
    
    // Обновляем заголовки секций
    document.querySelectorAll('.section-title').forEach(title => {
        const section = title.closest('section');
        if (section) {
            const sectionId = section.id;
            if (navTitles[sectionId]) {
                title.textContent = navTitles[sectionId];
            }
        }
    });
    
    console.log('✅ Заголовки синхронизированы');
}

// 2. Добавляем редакторы изображений для всех секций
function addImageEditorsToAllSections() {
    const sectionsWithImages = [
        { id: 'hero', label: 'Главное изображение баннера', field: 'heroImage' },
        { id: 'about', label: 'Изображение о компании', field: 'aboutImage' },
        { id: 'services', label: 'Фоновое изображение услуг', field: 'servicesImage' },
        { id: 'destinations', label: 'Изображение направлений', field: 'destinationsImage' },
        { id: 'contact', label: 'Контактное изображение', field: 'contactImage' }
    ];
    
    sectionsWithImages.forEach(section => {
        addImageEditorToSection(section.id, section.label, section.field);
    });
}

function addImageEditorToSection(sectionId, label, fieldId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    // Находим или создаем контейнер для изображения
    let imageContainer = section.querySelector('.image-placeholder');
    if (!imageContainer) {
        imageContainer = document.createElement('div');
        imageContainer.className = 'image-placeholder';
        section.querySelector('.container')?.appendChild(imageContainer);
    }
    
    // Добавляем поле для редактирования изображения
    const imageField = document.createElement('input');
    imageField.type = 'hidden';
    imageField.className = 'image-field';
    imageField.dataset.section = sectionId;
    imageField.dataset.field = fieldId;
    imageField.value = imageContainer.querySelector('img')?.src || '';
    
    imageContainer.appendChild(imageField);
    
    console.log(`✅ Добавлен редактор изображения для секции: ${sectionId}`);
}

// 3. Исправляем контактную информацию
function fixContactInformation() {
    const contacts = {
        phone: '+7 (999) 123-45-67',
        email: 'info@worldtravel.com', 
        address: 'Москва, ул. Туристическая, 15',
        hours: 'Пн-Пт: 9:00-18:00'
    };
    
    // Обновляем контакты в секции контактов
    updateContactSection(contacts);
    
    // Обновляем контакты в футере
    updateFooterContacts(contacts);
}

function updateContactSection(contacts) {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach((item, index) => {
        const strong = item.querySelector('strong');
        const p = item.querySelector('p');
        
        if (strong && p) {
            if (strong.textContent.includes('Телефон')) {
                p.textContent = contacts.phone;
            } else if (strong.textContent.includes('Email')) {
                p.textContent = contacts.email;
            } else if (strong.textContent.includes('Адрес')) {
                p.textContent = contacts.address;
            } else if (strong.textContent.includes('Часы')) {
                p.textContent = contacts.hours;
            }
        }
    });
}

function updateFooterContacts(contacts) {
    const footerSection = document.querySelector('.footer-section:nth-child(3)');
    if (!footerSection) return;
    
    const paragraphs = footerSection.querySelectorAll('p');
    
    if (paragraphs.length >= 4) {
        paragraphs[0].innerHTML = `<i class="fas fa-phone"></i> ${contacts.phone}`;
        paragraphs[1].innerHTML = `<i class="fas fa-envelope"></i> ${contacts.email}`;
        paragraphs[2].innerHTML = `<i class="fas fa-map-marker-alt"></i> ${contacts.address}`;
        paragraphs[3].innerHTML = `<i class="fas fa-clock"></i> ${contacts.hours}`;
    }
}

// 4. Исправляем дублирование в футере
function fixFooterDuplication() {
    const footerSection = document.querySelector('.footer-section:nth-child(3)');
    if (!footerSection) return;
    
    const paragraphs = footerSection.querySelectorAll('p');
    const uniqueContacts = new Set();
    
    // Удаляем дубликаты
    paragraphs.forEach(p => {
        const text = p.textContent.trim();
        if (uniqueContacts.has(text)) {
            p.remove();
        } else {
            uniqueContacts.add(text);
        }
    });
    
    console.log('✅ Дубликаты в футере удалены');
}

// 5. Объединяем дублирующиеся редакторы
function mergeDuplicateEditors() {
    // Удаляем дублирующиеся редакторы статистики
    const statsEditors = document.querySelectorAll('[class*="stats-editor"], [class*="stats-manager"]');
    if (statsEditors.length > 1) {
        for (let i = 1; i < statsEditors.length; i++) {
            statsEditors[i].remove();
        }
    }
    
    // Удаляем дублирующиеся редакторы услуг
    const servicesEditors = document.querySelectorAll('[class*="services-editor"], [class*="services-manager"]');
    if (servicesEditors.length > 1) {
        for (let i = 1; i < servicesEditors.length; i++) {
            servicesEditors[i].remove();
        }
    }
    
    console.log('✅ Дублирующиеся редакторы объединены');
}

// Применяем исправления при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAllFixes);
} else {
    applyAllFixes();
}

// Экспортируем для использования в других модулях
window.applyAllFixes = applyAllFixes;

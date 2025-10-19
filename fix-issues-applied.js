// Исправления для консистентности заголовков, изображений и контактов
function applyAllFixes() {
    console.log('🔧 Применение исправлений...');
    
    // 1. Исправляем заголовки в навигации и футере
    fixNavigationTitles();
    
    // 2. Исправляем контакты (телефон, email, адрес)
    fixContactInformation();
    
    // 3. Убираем дублирование графика работы в футере
    fixFooterDuplication();
    
    console.log('✅ Все исправления применены');
}

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
        const navLinks = document.querySelectorAll(\`.nav-links a[href="#\${sectionId}"]\`);
        navLinks.forEach(link => {
            link.textContent = navTitles[sectionId];
        });
    });
    
    console.log('✅ Заголовки синхронизированы');
}

function fixContactInformation() {
    const contacts = {
        phone: '+7 (999) 123-45-67',
        email: 'info@worldtravel.com', 
        address: 'Москва, ул. Туристическая, 15',
        hours: 'Пн-Пт: 9:00-18:00'
    };
    
    // Обновляем контакты в секции контактов
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
    
    // Обновляем футер
    const footerSection = document.querySelector('.footer-section:nth-child(3)');
    if (footerSection) {
        const paragraphs = footerSection.querySelectorAll('p');
        if (paragraphs.length >= 4) {
            paragraphs[0].innerHTML = \`<i class="fas fa-phone"></i> \${contacts.phone}\`;
            paragraphs[1].innerHTML = \`<i class="fas fa-envelope"></i> \${contacts.email}\`;
            paragraphs[2].innerHTML = \`<i class="fas fa-map-marker-alt"></i> \${contacts.address}\`;
            paragraphs[3].innerHTML = \`<i class="fas fa-clock"></i> \${contacts.hours}\`;
        }
    }
    
    console.log('✅ Контакты исправлены');
}

function fixFooterDuplication() {
    const footerSection = document.querySelector('.footer-section:nth-child(3)');
    if (!footerSection) return;
    
    const paragraphs = footerSection.querySelectorAll('p');
    const uniqueContacts = new Set();
    const contactsToKeep = [];
    
    // Собираем уникальные контакты
    paragraphs.forEach(p => {
        const text = p.textContent.trim();
        if (!uniqueContacts.has(text)) {
            uniqueContacts.add(text);
            contactsToKeep.push(p);
        }
    });
    
    // Очищаем и добавляем обратно только уникальные
    footerSection.innerHTML = '<h4>Контакты</h4>';
    contactsToKeep.forEach(p => {
        footerSection.appendChild(p);
    });
    
    console.log('✅ Дубликаты в футере удалены');
}

// Применяем исправления при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAllFixes);
} else {
    applyAllFixes();
}

// DOM Structure Check - проверяем и исправляем структуру DOM
(function() {
    'use strict';
    
    console.log('🔍 DOM STRUCTURE CHECK STARTED');
    
    function checkAndFixDOM() {
        console.group('🔍 CHECKING DOM STRUCTURE');
        
        // Проверяем контактную секцию
        checkContactSection();
        
        // Проверяем секцию услуг
        checkServicesSection();
        
        // Проверяем секцию статистики
        checkStatsSection();
        
        console.groupEnd();
    }
    
    function checkContactSection() {
        console.log('📞 Checking contact section...');
        
        const contactItems = document.querySelectorAll('.contact-info .contact-item');
        console.log('Contact items found:', contactItems.length);
        
        contactItems.forEach((item, index) => {
            const strong = item.querySelector('strong');
            const p = item.querySelector('p');
            
            console.log('Contact item', index + 1 + ':', {
                strong: strong ? strong.textContent : 'MISSING',
                p: p ? p.textContent : 'MISSING'
            });
        });
        
        // Проверяем footer контакты
        const footerContacts = document.querySelectorAll('.footer-section:nth-child(3) p');
        console.log('Footer contacts found:', footerContacts.length);
        
        footerContacts.forEach((p, index) => {
            console.log('Footer contact', index + 1 + ':', p.textContent);
        });
    }
    
    function checkServicesSection() {
        console.log('🎯 Checking services section...');
        
        const serviceCards = document.querySelectorAll('.service-card');
        console.log('Service cards found:', serviceCards.length);
        
        serviceCards.forEach((card, index) => {
            const title = card.querySelector('h3');
            const desc = card.querySelector('p');
            const icon = card.querySelector('.service-icon i');
            
            console.log('Service card', index + 1 + ':', {
                title: title ? title.textContent : 'MISSING',
                desc: desc ? desc.textContent : 'MISSING',
                icon: icon ? icon.className : 'MISSING'
            });
        });
    }
    
    function checkStatsSection() {
        console.log('📊 Checking stats section...');
        
        const stats = document.querySelectorAll('.stat');
        console.log('Stats found:', stats.length);
        
        stats.forEach((stat, index) => {
            const value = stat.querySelector('h3');
            const label = stat.querySelector('p');
            
            console.log('Stat', index + 1 + ':', {
                value: value ? value.textContent : 'MISSING',
                label: label ? label.textContent : 'MISSING'
            });
        });
    }
    
    // Добавляем CSS классы для правильных селекторов
    function addContactClasses() {
        console.log('🎨 Adding contact classes...');
        
        const footerSection = document.querySelector('.footer-section:nth-child(3)');
        if (footerSection) {
            const contacts = footerSection.querySelectorAll('p');
            contacts.forEach((p, index) => {
                if (index === 0 && !p.classList.contains('footer-phone')) {
                    p.classList.add('footer-phone');
                } else if (index === 1 && !p.classList.contains('footer-email')) {
                    p.classList.add('footer-email');
                } else if (index === 2 && !p.classList.contains('footer-address')) {
                    p.classList.add('footer-address');
                } else if (index === 3 && !p.classList.contains('footer-hours')) {
                    p.classList.add('footer-hours');
                }
            });
            console.log('✅ Footer contact classes added');
        }
    }
    
    // Запускаем проверку
    setTimeout(() => {
        checkAndFixDOM();
        addContactClasses();
        
        // Делаем функции доступными глобально
        window.checkDOMStructure = checkAndFixDOM;
        window.fixContactClasses = addContactClasses;
        
        console.log('🔧 DOM check functions available:');
        console.log('   window.checkDOMStructure() - проверка структуры DOM');
        console.log('   window.fixContactClasses() - исправление классов контактов');
    }, 1000);
    
})();

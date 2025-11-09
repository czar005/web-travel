// Fix Contacts and Cards - исправление контактов и остановка бесконечной загрузки
(function() {
    'use strict';
    
    console.log('🔧 FIXING CONTACTS AND CARDS...');
    
    // Правильные значения контактов
    const CORRECT_CONTACTS = {
        phone: '+7 (999) 123-45-67',
        email: 'info@worldtravel.com', 
        address: 'Москва, ул. Туристическая, 15',
        hours: 'Пн-Пт: 9:00-18:00'
    };
    
    function fixContacts() {
        console.log('📞 Fixing contact information...');
        
        // Исправляем данные в dataManager
        if (window.dataManager) {
            const data = window.dataManager.getData();
            if (data && data.contacts) {
                console.log('📊 Current contacts in dataManager:', data.contacts);
                
                // Проверяем и исправляем некорректные значения
                let needsFix = false;
                Object.keys(CORRECT_CONTACTS).forEach(key => {
                    if (data.contacts[key] !== CORRECT_CONTACTS[key]) {
                        console.log(`🔄 Fixing ${key}: "${data.contacts[key]}" -> "${CORRECT_CONTACTS[key]}"`);
                        data.contacts[key] = CORRECT_CONTACTS[key];
                        needsFix = true;
                    }
                });
                
                if (needsFix) {
                    window.dataManager.setData(data);
                    console.log('✅ Contacts fixed in dataManager');
                }
            }
        }
        
        // Исправляем localStorage
        const localData = localStorage.getItem('worldtravel_data');
        if (localData) {
            try {
                const data = JSON.parse(localData);
                if (data && data.contacts) {
                    let needsFix = false;
                    Object.keys(CORRECT_CONTACTS).forEach(key => {
                        if (data.contacts[key] !== CORRECT_CONTACTS[key]) {
                            data.contacts[key] = CORRECT_CONTACTS[key];
                            needsFix = true;
                        }
                    });
                    
                    if (needsFix) {
                        localStorage.setItem('worldtravel_data', JSON.stringify(data));
                        console.log('✅ Contacts fixed in localStorage');
                    }
                }
            } catch (e) {
                console.log('❌ Error fixing localStorage contacts');
            }
        }
        
        // Немедленно применяем исправления к DOM
        applyCorrectContactsToDOM();
    }
    
    function applyCorrectContactsToDOM() {
        console.log('🎯 Applying correct contacts to DOM...');
        
        // Основная контактная секция
        const contactItems = document.querySelectorAll('.contact-info .contact-item');
        if (contactItems.length >= 4) {
            // Телефон (должен быть первый)
            const phoneItem = contactItems[0];
            const phoneStrong = phoneItem.querySelector('strong');
            const phoneP = phoneItem.querySelector('p');
            if (phoneStrong && phoneP) {
                phoneStrong.textContent = 'Телефон:';
                phoneP.textContent = CORRECT_CONTACTS.phone;
                phoneP.classList.add('contact-phone');
            }
            
            // Email (должен быть второй)  
            const emailItem = contactItems[1];
            const emailStrong = emailItem.querySelector('strong');
            const emailP = emailItem.querySelector('p');
            if (emailStrong && emailP) {
                emailStrong.textContent = 'Email:';
                emailP.textContent = CORRECT_CONTACTS.email;
                emailP.classList.add('contact-email');
            }
            
            // Адрес (должен быть третий)
            const addressItem = contactItems[2];
            const addressStrong = addressItem.querySelector('strong');
            const addressP = addressItem.querySelector('p');
            if (addressStrong && addressP) {
                addressStrong.textContent = 'Адрес:';
                addressP.textContent = CORRECT_CONTACTS.address;
                addressP.classList.add('contact-address');
            }
            
            // Часы работы (должен быть четвертый)
            const hoursItem = contactItems[3];
            const hoursStrong = hoursItem.querySelector('strong');
            const hoursP = hoursItem.querySelector('p');
            if (hoursStrong && hoursP) {
                hoursStrong.textContent = 'Часы работы:';
                hoursP.textContent = CORRECT_CONTACTS.hours;
                hoursP.classList.add('contact-hours');
            }
        }
        
        // Футер контакты
        const footerSection = document.querySelector('.footer-section:nth-child(3)');
        if (footerSection) {
            const footerContacts = footerSection.querySelectorAll('p');
            if (footerContacts.length >= 4) {
                footerContacts[0].textContent = CORRECT_CONTACTS.phone;
                footerContacts[0].classList.add('footer-phone');
                
                footerContacts[1].textContent = CORRECT_CONTACTS.email;
                footerContacts[1].classList.add('footer-email');
                
                footerContacts[2].textContent = CORRECT_CONTACTS.address;
                footerContacts[2].classList.add('footer-address');
                
                footerContacts[3].textContent = CORRECT_CONTACTS.hours;
                footerContacts[3].classList.add('footer-hours');
            }
        }
        
        console.log('✅ DOM contacts fixed');
    }
    
    function fixInfiniteCardsLoading() {
        console.log('🔄 Fixing infinite cards loading...');
        
        // Останавливаем все интервалы синхронизации которые могут создавать дубликаты
        const intervalIds = window.intervalIds || [];
        intervalIds.forEach(id => {
            clearInterval(id);
            console.log('🛑 Stopped interval:', id);
        });
        
        // Очищаем массив интервалов
        window.intervalIds = [];
        
        // Создаем единственный контролируемый интервал синхронизации
        const syncId = setInterval(() => {
            syncCardsOnce();
        }, 2000);
        
        window.intervalIds.push(syncId);
        console.log('✅ Created controlled sync interval');
    }
    
    function syncCardsOnce() {
        // Проверяем есть ли уже примененные данные
        if (window.lastSuccessfulSync) {
            const currentData = getCurrentData();
            if (currentData && JSON.stringify(currentData.content) === window.lastSuccessfulSync) {
                return; // Данные не изменились, пропускаем синхронизацию
            }
        }
        
        console.log('🔄 Single sync cycle...');
        applyCardsFromData();
    }
    
    function getCurrentData() {
        if (window.dataManager?.getData) {
            return window.dataManager.getData();
        }
        
        const localData = localStorage.getItem('worldtravel_data');
        if (localData) {
            try {
                return JSON.parse(localData);
            } catch (e) {
                return null;
            }
        }
        
        return null;
    }
    
    function applyCardsFromData() {
        const data = getCurrentData();
        if (!data?.content) return;
        
        // Применяем статистику
        if (data.content.about?.stats) {
            applyStats(data.content.about.stats);
        }
        
        // Применяем услуги
        if (data.content.services?.services) {
            applyServices(data.content.services.services);
        }
        
        // Сохраняем хэш успешной синхронизации
        window.lastSuccessfulSync = JSON.stringify(data.content);
    }
    
    function applyStats(stats) {
        if (!Array.isArray(stats)) return;
        
        const validStats = stats.filter(stat => stat.value && stat.label);
        const statElements = document.querySelectorAll('.stat');
        
        // Только обновляем существующие элементы, не создаем новые
        validStats.forEach((stat, index) => {
            if (statElements[index]) {
                const valueEl = statElements[index].querySelector('h3');
                const labelEl = statElements[index].querySelector('p');
                
                if (valueEl) valueEl.textContent = stat.value;
                if (labelEl) labelEl.textContent = stat.label;
                
                statElements[index].style.display = 'block';
            }
        });
        
        // Скрываем лишние
        for (let i = validStats.length; i < statElements.length; i++) {
            statElements[i].style.display = 'none';
        }
    }
    
    function applyServices(services) {
        if (!Array.isArray(services)) return;
        
        const validServices = services.filter(service => service.title && service.description);
        const serviceElements = document.querySelectorAll('.service-card');
        
        // Только обновляем существующие элементы
        validServices.forEach((service, index) => {
            if (serviceElements[index]) {
                const titleEl = serviceElements[index].querySelector('h3');
                const descEl = serviceElements[index].querySelector('p');
                const iconEl = serviceElements[index].querySelector('.service-icon i');
                
                if (titleEl) titleEl.textContent = service.title;
                if (descEl) descEl.textContent = service.description;
                if (iconEl && service.icon) {
                    iconEl.className = service.icon;
                }
                
                serviceElements[index].style.display = 'block';
            }
        });
        
        // Скрываем лишние
        for (let i = validServices.length; i < serviceElements.length; i++) {
            serviceElements[i].style.display = 'none';
        }
    }
    
    // Запускаем исправления
    setTimeout(() => {
        fixContacts();
        fixInfiniteCardsLoading();
        
        // Добавляем глобальные функции для ручного исправления
        window.fixAllContacts = fixContacts;
        window.stopInfiniteLoading = fixInfiniteCardsLoading;
        
        console.log('✅ All fixes applied');
        console.log('🔧 Available commands:');
        console.log('   window.fixAllContacts() - исправить контакты');
        console.log('   window.stopInfiniteLoading() - остановить бесконечную загрузку');
    }, 1000);
    
})();

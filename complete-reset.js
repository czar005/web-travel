// Complete Reset - полный сброс данных и остановка всех процессов
(function() {
    'use strict';
    
    console.log('🔄 COMPLETE RESET INITIATED');
    
    function completeReset() {
        console.log('🎯 Starting complete reset...');
        
        // 1. Останавливаем ВСЕ интервалы
        stopAllIntervals();
        
        // 2. Сбрасываем данные контактов к корректным значениям
        resetContactsToDefault();
        
        // 3. Очищаем кэши синхронизации
        clearAllSyncCaches();
        
        // 4. Принудительно применяем корректные данные к DOM
        forceApplyCorrectData();
        
        console.log('✅ Complete reset finished');
    }
    
    function stopAllIntervals() {
        // Останавливаем все известные интервалы
        const maxIntervalId = 10000;
        for (let i = 0; i < maxIntervalId; i++) {
            clearInterval(i);
        }
        
        // Останавливаем интервалы из window.intervalIds если есть
        if (window.intervalIds && Array.isArray(window.intervalIds)) {
            window.intervalIds.forEach(id => {
                clearInterval(id);
            });
            window.intervalIds = [];
        }
        
        console.log('🛑 All intervals stopped');
    }
    
    function resetContactsToDefault() {
        const correctContacts = {
            phone: '+7 (999) 123-45-67',
            email: 'info@worldtravel.com',
            address: 'Москва, ул. Туристическая, 15',
            hours: 'Пн-Пт: 9:00-18:00'
        };
        
        // Сбрасываем в dataManager
        if (window.dataManager) {
            const data = window.dataManager.getData();
            if (data) {
                data.contacts = { ...correctContacts };
                window.dataManager.setData(data);
                console.log('✅ Contacts reset in dataManager');
            }
        }
        
        // Сбрасываем в localStorage
        const localData = localStorage.getItem('worldtravel_data');
        if (localData) {
            try {
                const data = JSON.parse(localData);
                data.contacts = { ...correctContacts };
                localStorage.setItem('worldtravel_data', JSON.stringify(data));
                console.log('✅ Contacts reset in localStorage');
            } catch (e) {
                console.log('❌ Error resetting localStorage contacts');
            }
        }
        
        // Сбрасываем в sessionStorage
        const sessionData = sessionStorage.getItem('worldtravel_data');
        if (sessionData) {
            try {
                const data = JSON.parse(sessionData);
                data.contacts = { ...correctContacts };
                sessionStorage.setItem('worldtravel_data', JSON.stringify(data));
                console.log('✅ Contacts reset in sessionStorage');
            } catch (e) {
                console.log('❌ Error resetting sessionStorage contacts');
            }
        }
    }
    
    function clearAllSyncCaches() {
        // Очищаем все возможные кэши синхронизации
        window.lastSuccessfulSync = null;
        window.lastSyncHash = null;
        window.lastStatsHash = null;
        window.lastServicesHash = null;
        window.lastDataHash = null;
        
        if (window.fixedEditor) {
            window.fixedEditor.currentData = null;
        }
        
        console.log('🧹 All sync caches cleared');
    }
    
    function forceApplyCorrectData() {
        // Принудительно применяем корректные контакты к DOM
        const correctContacts = {
            phone: '+7 (999) 123-45-67',
            email: 'info@worldtravel.com',
            address: 'Москва, ул. Туристическая, 15', 
            hours: 'Пн-Пт: 9:00-18:00'
        };
        
        // Контактная секция
        const contactSelectors = [
            { selector: '.contact-info .contact-item:nth-child(1) p', value: correctContacts.phone },
            { selector: '.contact-info .contact-item:nth-child(2) p', value: correctContacts.email },
            { selector: '.contact-info .contact-item:nth-child(3) p', value: correctContacts.address },
            { selector: '.contact-info .contact-item:nth-child(4) p', value: correctContacts.hours },
            { selector: '.footer-phone', value: correctContacts.phone },
            { selector: '.footer-email', value: correctContacts.email },
            { selector: '.footer-address', value: correctContacts.address },
            { selector: '.footer-hours', value: correctContacts.hours },
            { selector: '.contact-phone', value: correctContacts.phone },
            { selector: '.contact-email', value: correctContacts.email },
            { selector: '.contact-address', value: correctContacts.address },
            { selector: '.contact-hours', value: correctContacts.hours }
        ];
        
        contactSelectors.forEach(item => {
            document.querySelectorAll(item.selector).forEach(el => {
                el.textContent = item.value;
            });
        });
        
        // Исправляем подписи в контактной секции
        const contactLabels = [
            { index: 0, label: 'Телефон:' },
            { index: 1, label: 'Email:' },
            { index: 2, label: 'Адрес:' },
            { index: 3, label: 'Часы работы:' }
        ];
        
        contactLabels.forEach(item => {
            const contactItem = document.querySelector(`.contact-info .contact-item:nth-child(${item.index + 1})`);
            if (contactItem) {
                const strong = contactItem.querySelector('strong');
                if (strong) {
                    strong.textContent = item.label;
                }
            }
        });
        
        console.log('✅ Correct data forced to DOM');
    }
    
    // Делаем функцию доступной глобально
    window.completeReset = completeReset;
    
    // Автоматически запускаем сброс через 2 секунды после загрузки
    setTimeout(completeReset, 2000);
    
    console.log('🔧 Complete reset will run in 2 seconds');
    console.log('💡 You can also run manually: window.completeReset()');
    
})();

// Fix Contacts Structure - исправляем порядок контактов
(function() {
    'use strict';
    
    console.log('🔧 FIXING CONTACTS STRUCTURE...');
    
    // Правильный порядок контактов в данных
    const CORRECT_CONTACT_ORDER = [
        { key: 'phone', label: 'Телефон' },
        { key: 'email', label: 'Email' },
        { key: 'address', label: 'Адрес' },
        { key: 'hours', label: 'График работы' }
    ];
    
    function fixContactsStructure() {
        console.log('📞 Checking contacts structure...');
        
        // Проверяем dataManager
        if (window.dataManager) {
            const data = window.dataManager.getData();
            if (data && data.contacts) {
                console.log('📊 Current contacts:', data.contacts);
                
                // Проверяем правильность структуры
                let needsFix = false;
                const currentKeys = Object.keys(data.contacts);
                
                // Если ключи не соответствуют правильному порядку, исправляем
                CORRECT_CONTACT_ORDER.forEach((correct, index) => {
                    if (currentKeys[index] !== correct.key) {
                        needsFix = true;
                        console.log('⚠️ Wrong contact order:', currentKeys[index], 'should be', correct.key);
                    }
                });
                
                if (needsFix) {
                    console.log('🔄 Fixing contacts structure...');
                    const fixedContacts = {};
                    
                    CORRECT_CONTACT_ORDER.forEach(contact => {
                        fixedContacts[contact.key] = data.contacts[contact.key] || getDefaultContact(contact.key);
                    });
                    
                    data.contacts = fixedContacts;
                    window.dataManager.setData(data);
                    console.log('✅ Contacts structure fixed:', fixedContacts);
                }
            }
        }
        
        // Проверяем localStorage
        const localData = localStorage.getItem('worldtravel_data');
        if (localData) {
            try {
                const data = JSON.parse(localData);
                if (data && data.contacts) {
                    fixLocalStorageContacts(data);
                }
            } catch (e) {
                console.log('❌ Error fixing localStorage contacts');
            }
        }
    }
    
    function fixLocalStorageContacts(data) {
        let needsFix = false;
        const currentKeys = Object.keys(data.contacts);
        
        CORRECT_CONTACT_ORDER.forEach((correct, index) => {
            if (currentKeys[index] !== correct.key) {
                needsFix = true;
            }
        });
        
        if (needsFix) {
            console.log('🔄 Fixing localStorage contacts...');
            const fixedContacts = {};
            
            CORRECT_CONTACT_ORDER.forEach(contact => {
                fixedContacts[contact.key] = data.contacts[contact.key] || getDefaultContact(contact.key);
            });
            
            data.contacts = fixedContacts;
            localStorage.setItem('worldtravel_data', JSON.stringify(data));
            console.log('✅ localStorage contacts fixed');
        }
    }
    
    function getDefaultContact(key) {
        const defaults = {
            phone: '+7 (999) 123-45-67',
            email: 'info@worldtravel.com',
            address: 'Москва, ул. Туристическая, 15',
            hours: 'Пн-Пт: 9:00-18:00'
        };
        return defaults[key] || '';
    }
    
    // Запускаем исправление при загрузке
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixContactsStructure);
    } else {
        fixContactsStructure();
    }
    
})();

// Debug Sync - диагностика проблемы синхронизации
console.log('�� DEBUG SYNC STARTED');

// Проверяем все источники данных
function checkDataSources() {
    console.group('🔍 CHECKING DATA SOURCES');
    
    // 1. Проверяем dataManager
    console.log('📊 dataManager:', window.dataManager ? 'EXISTS' : 'MISSING');
    if (window.dataManager) {
        const dmData = window.dataManager.getData();
        console.log('📊 dataManager data:', dmData);
    }
    
    // 2. Проверяем localStorage
    const localData = localStorage.getItem('worldtravel_data');
    console.log('📁 localStorage:', localData ? 'EXISTS' : 'EMPTY');
    if (localData) {
        try {
            console.log('📁 localStorage parsed:', JSON.parse(localData));
        } catch (e) {
            console.log('❌ localStorage parse error');
        }
    }
    
    // 3. Проверяем sessionStorage
    const sessionData = sessionStorage.getItem('worldtravel_data');
    console.log('💾 sessionStorage:', sessionData ? 'EXISTS' : 'EMPTY');
    
    console.groupEnd();
}

// Проверяем структуру DOM
function checkDOMStructure() {
    console.group('🔍 CHECKING DOM STRUCTURE');
    
    const selectors = [
        '#home h1', '#home p',
        '#about .section-title', '.about-text p', 
        '#services .section-title',
        '#destinations .section-title', '.destinations .section-subtitle',
        '#contact .section-title',
        '.contact-info .contact-item:nth-child(1) p',
        '.contact-info .contact-item:nth-child(2) p', 
        '.contact-info .contact-item:nth-child(3) p',
        '.contact-info .contact-item:nth-child(4) p'
    ];
    
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        console.log(selector + ':', elements.length + ' found');
        if (elements.length > 0) {
            elements.forEach((el, index) => {
                console.log('  ' + selector + '[' + index + ']:', '"' + el.textContent + '"');
            });
        }
    });
    
    console.groupEnd();
}

// Принудительная синхронизация с детальным логированием
function forceDebugSync() {
    console.group('🔄 FORCE DEBUG SYNC');
    
    let data = null;
    
    // Получаем данные из dataManager
    if (window.dataManager && window.dataManager.getData) {
        data = window.dataManager.getData();
        console.log('�� Using dataManager data');
    } else {
        // Пробуем localStorage
        const localData = localStorage.getItem('worldtravel_data');
        if (localData) {
            try {
                data = JSON.parse(localData);
                console.log('📁 Using localStorage data');
            } catch (e) {
                console.log('❌ localStorage parse failed');
            }
        }
    }
    
    if (!data) {
        console.log('❌ No data available for sync');
        console.groupEnd();
        return;
    }
    
    console.log('📦 Data structure:', data);
    
    // Применяем обновления с подробным логированием
    if (data.content) {
        console.group('📄 APPLYING CONTENT');
        
        if (data.content.hero) {
            console.log('🎯 Hero:', data.content.hero);
            updateAndLog('#home h1', data.content.hero.title);
            updateAndLog('#home p', data.content.hero.description);
        }
        
        if (data.content.about) {
            console.log('🏢 About:', data.content.about);
            updateAndLog('#about .section-title', data.content.about.title);
            updateAndLog('.about-text p', data.content.about.description);
        }
        
        if (data.content.services) {
            console.log('⚡ Services:', data.content.services);
            updateAndLog('#services .section-title', data.content.services.title);
        }
        
        if (data.content.destinations) {
            console.log('🌍 Destinations:', data.content.destinations);
            updateAndLog('#destinations .section-title', data.content.destinations.title);
            updateAndLog('.destinations .section-subtitle', data.content.destinations.subtitle);
        }
        
        if (data.content.contact) {
            console.log('📞 Contact:', data.content.contact);
            updateAndLog('#contact .section-title', data.content.contact.title);
        }
        
        console.groupEnd();
    }
    
    if (data.contacts) {
        console.group('📞 APPLYING CONTACTS');
        console.log('Contacts:', data.contacts);
        
        updateAndLog('.contact-info .contact-item:nth-child(1) p', data.contacts.phone);
        updateAndLog('.footer-section:nth-child(3) p:nth-child(1)', data.contacts.phone);
        
        updateAndLog('.contact-info .contact-item:nth-child(2) p', data.contacts.email);
        updateAndLog('.footer-section:nth-child(3) p:nth-child(2)', data.contacts.email);
        
        updateAndLog('.contact-info .contact-item:nth-child(3) p', data.contacts.address);
        updateAndLog('.footer-section:nth-child(3) p:nth-child(3)', data.contacts.address);
        
        updateAndLog('.contact-info .contact-item:nth-child(4) p', data.contacts.hours);
        updateAndLog('.footer-section:nth-child(3) p:nth-child(4)', data.contacts.hours);
        
        console.groupEnd();
    }
    
    console.log('✅ DEBUG SYNC COMPLETED');
    console.groupEnd();
}

function updateAndLog(selector, value) {
    if (!value) {
        console.log('⏩ Skip empty:', selector);
        return;
    }
    
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) {
        console.log('❌ Not found:', selector);
        return;
    }
    
    let updated = false;
    elements.forEach((el, index) => {
        if (el.textContent !== value) {
            const oldValue = el.textContent;
            el.textContent = value;
            console.log('✅ Updated:', selector + '[' + index + ']', '"' + oldValue + '" -> "' + value + '"');
            updated = true;
        } else {
            console.log('⏩ No change:', selector + '[' + index + ']', '"' + value + '"');
        }
    });
    
    return updated;
}

// Запускаем диагностику при загрузке
setTimeout(() => {
    console.log('🚀 STARTING DEBUG DIAGNOSTICS');
    checkDataSources();
    checkDOMStructure();
    forceDebugSync();
    
    // Добавляем глобальные функции для ручного вызова
    window.debugSync = {
        checkDataSources,
        checkDOMStructure, 
        forceDebugSync
    };
    
    console.log('🔍 Debug functions available: window.debugSync.checkDataSources(), window.debugSync.forceDebugSync()');
}, 1000);

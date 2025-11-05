// Content Sync System
(function() {
    'use strict';
    
    console.log('🔄 Content Sync System loading...');
    
    let lastDataHash = '';
    let isInitialized = false;
    
    function initializeContentSync() {
        if (isInitialized) return;
        
        console.log('🚀 Starting Content Sync System...');
        
        // Быстрая синхронизация при загрузке
        syncContent();
        
        // Агрессивная синхронизация в течение первых 30 секунд
        const fastSyncInterval = setInterval(syncContent, 300);
        setTimeout(() => {
            clearInterval(fastSyncInterval);
            // Затем переходим к нормальной синхронизации
            setInterval(syncContent, 1000);
        }, 30000);
        
        // Синхронизация при событиях
        window.addEventListener('storage', handleStorageEvent);
        window.addEventListener('focus', syncContent);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        isInitialized = true;
        console.log('✅ Content Sync System initialized');
    }
    
    function handleStorageEvent(e) {
        if (e.key === 'worldtravel_data' || e.key === 'admin_data') {
            setTimeout(syncContent, 100);
        }
    }
    
    function handleVisibilityChange() {
        if (!document.hidden) {
            syncContent();
        }
    }
    
    function syncContent() {
        try {
            const data = getCurrentData();
            if (!data) return;
            
            const newHash = calculateDataHash(data);
            if (newHash === lastDataHash) return;
            
            console.log('🔄 Applying content updates...');
            
            applyContentUpdates(data);
            applyContactUpdates(data);
            applySettingsUpdates(data);
            
            lastDataHash = newHash;
            console.log('✅ Content sync completed');
            
        } catch (error) {
            console.log('❌ Sync error:', error);
        }
    }
    
    function getCurrentData() {
        // Пробуем разные источники данных
        let data = null;
        
        // 1. dataManager (основной источник)
        if (window.dataManager && window.dataManager.getData) {
            try {
                data = window.dataManager.getData();
                if (data) return data;
            } catch (e) {
                console.log('⚠️ dataManager not available');
            }
        }
        
        // 2. localStorage (резервный источник)
        const localData = localStorage.getItem('worldtravel_data');
        if (localData) {
            try {
                data = JSON.parse(localData);
                return data;
            } catch (e) {
                console.log('⚠️ localStorage data corrupted');
            }
        }
        
        // 3. sessionStorage (последний резерв)
        const sessionData = sessionStorage.getItem('worldtravel_data');
        if (sessionData) {
            try {
                data = JSON.parse(sessionData);
                return data;
            } catch (e) {
                console.log('⚠️ sessionStorage data corrupted');
            }
        }
        
        return null;
    }
    
    function calculateDataHash(data) {
        return JSON.stringify({
            content: data.content,
            contacts: data.contacts,
            settings: data.settings,
            timestamp: data.lastUpdate
        });
    }
    
    function applyContentUpdates(data) {
        if (!data.content) return;
        
        const content = data.content;
        
        // Hero section
        if (content.hero) {
            updateElement('#home h1, .hero h1', content.hero.title);
            updateElement('#home p, .hero p', content.hero.subtitle);
        }
        
        // About section
        if (content.about) {
            updateElement('#about .section-title', content.about.title);
            updateElement('.about-text p', content.about.description);
        }
        
        // Services section
        if (content.services) {
            updateElement('#services .section-title', content.services.title);
        }
        
        // Destinations section
        if (content.destinations) {
            updateElement('#destinations .section-title', content.destinations.title);
            updateElement('.destinations .section-subtitle', content.destinations.subtitle);
        }
        
        // Contact section
        if (content.contact) {
            updateElement('#contact .section-title', content.contact.title);
        }
        
        // Footer section
        if (content.footer) {
            updateElement('.footer-section:first-child p', content.footer.description);
            updateElementHTML('.footer-bottom p', content.footer.copyright);
        }
    }
    
    function applyContactUpdates(data) {
        if (!data.contacts) return;
        
        const contacts = data.contacts;
        
        // Правильный порядок контактов в секции
        if (contacts.phone) {
            updateElement('.contact-info .contact-item:nth-child(1) p', contacts.phone);
            updateElement('.footer-section:nth-child(3) p:nth-child(1)', contacts.phone);
        }
        if (contacts.email) {
            updateElement('.contact-info .contact-item:nth-child(2) p', contacts.email);
            updateElement('.footer-section:nth-child(3) p:nth-child(2)', contacts.email);
        }
        if (contacts.address) {
            updateElement('.contact-info .contact-item:nth-child(3) p', contacts.address);
            updateElement('.footer-section:nth-child(3) p:nth-child(3)', contacts.address);
        }
        if (contacts.hours) {
            updateElement('.contact-info .contact-item:nth-child(4) p', contacts.hours);
            updateElement('.footer-section:nth-child(3) p:nth-child(4)', contacts.hours);
        }
    }
    
    function applySettingsUpdates(data) {
        if (!data.settings) return;
        
        const settings = data.settings;
        
        if (settings.siteTitle) {
            document.title = settings.siteTitle;
        }
    }
    
    function updateElement(selector, value) {
        if (!value) return;
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (el.textContent !== value) {
                el.textContent = value;
            }
        });
    }
    
    function updateElementHTML(selector, value) {
        if (!value) return;
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (el.innerHTML !== value) {
                el.innerHTML = value;
            }
        });
    }
    
    // ИСПРАВЛЕННАЯ СТРОКА 189 - был неверный escape-символ
    const message = "Вы уверены, что хотите удалить страну \"" + country.name + "\"?";
    
    // Глобальные функции для принудительной синхронизации
    window.forceContentSync = syncContent;
    window.reinitializeContentSync = function() {
        isInitialized = false;
        lastDataHash = '';
        initializeContentSync();
    };
    
    // Запуск системы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeContentSync);
    } else {
        initializeContentSync();
    }
    
})();

// Bulletproof Sync - абсолютно надежная синхронизация
(function() {
    'use strict';
    
    console.log('🎯 BULLETPROOF SYNC LOADED');
    
    let syncAttempts = 0;
    const MAX_SYNC_ATTEMPTS = 100;
    
    function bulletproofSync() {
        syncAttempts++;
        if (syncAttempts > MAX_SYNC_ATTEMPTS) {
            console.log('🛑 Max sync attempts reached');
            return;
        }
        
        try {
            console.log('🔄 Bulletproof sync attempt:', syncAttempts);
            
            // 1. Получаем данные ВСЕМИ возможными способами
            const data = getAllData();
            if (!data) {
                console.log('📭 No data available');
                return;
            }
            
            console.log('📦 Sync data:', data);
            
            // 2. Применяем ВСЕ обновления агрессивно
            applyAllUpdatesAggressively(data);
            
            console.log('✅ Bulletproof sync completed');
            
        } catch (error) {
            console.log('❌ Bulletproof sync error:', error);
        }
    }
    
    function getAllData() {
        // Приоритет 1: dataManager
        if (window.dataManager && window.dataManager.getData) {
            try {
                const data = window.dataManager.getData();
                if (data && data.content) {
                    console.log('🎯 Using dataManager data');
                    return data;
                }
            } catch (e) {
                console.log('⚠️ dataManager failed');
            }
        }
        
        // Приоритет 2: localStorage
        const localData = localStorage.getItem('worldtravel_data');
        if (localData) {
            try {
                const data = JSON.parse(localData);
                if (data && data.content) {
                    console.log('📁 Using localStorage data');
                    return data;
                }
            } catch (e) {
                console.log('⚠️ localStorage parse failed');
            }
        }
        
        // Приоритет 3: sessionStorage
        const sessionData = sessionStorage.getItem('worldtravel_data');
        if (sessionData) {
            try {
                const data = JSON.parse(sessionData);
                if (data && data.content) {
                    console.log('💾 Using sessionStorage data');
                    return data;
                }
            } catch (e) {
                console.log('⚠️ sessionStorage parse failed');
            }
        }
        
        // Приоритет 4: глобальная переменная (если есть)
        if (window.worldTravelData) {
            console.log('🌐 Using window.worldTravelData');
            return window.worldTravelData;
        }
        
        return null;
    }
    
    function applyAllUpdatesAggressively(data) {
        // CONTENT - применяем ВСЕ поля агрессивно
        if (data.content) {
            console.group('📄 APPLYING CONTENT AGGRESSIVELY');
            
            // Hero section
            if (data.content.hero) {
                forceUpdate('#home h1', data.content.hero.title);
                forceUpdate('#home p', data.content.hero.description);
                forceUpdate('.hero h1', data.content.hero.title);
                forceUpdate('.hero p', data.content.hero.description);
            }
            
            // About section
            if (data.content.about) {
                forceUpdate('#about .section-title', data.content.about.title);
                forceUpdate('.about-text p', data.content.about.description);
            }
            
            // Services section
            if (data.content.services) {
                forceUpdate('#services .section-title', data.content.services.title);
            }
            
            // Destinations section
            if (data.content.destinations) {
                forceUpdate('#destinations .section-title', data.content.destinations.title);
                forceUpdate('.destinations .section-subtitle', data.content.destinations.subtitle);
            }
            
            // Contact section
            if (data.content.contact) {
                forceUpdate('#contact .section-title', data.content.contact.title);
            }
            
            console.groupEnd();
        }
        
        // CONTACTS - применяем ВСЕ контакты
        if (data.contacts) {
            console.group('📞 APPLYING CONTACTS AGGRESSIVELY');
            
            forceUpdate('.contact-info .contact-item:nth-child(1) p', data.contacts.phone);
            forceUpdate('.footer-section:nth-child(3) p:nth-child(1)', data.contacts.phone);
            forceUpdate('.footer-phone', data.contacts.phone);
            
            forceUpdate('.contact-info .contact-item:nth-child(2) p', data.contacts.email);
            forceUpdate('.footer-section:nth-child(3) p:nth-child(2)', data.contacts.email);
            forceUpdate('.footer-email', data.contacts.email);
            
            forceUpdate('.contact-info .contact-item:nth-child(3) p', data.contacts.address);
            forceUpdate('.footer-section:nth-child(3) p:nth-child(3)', data.contacts.address);
            forceUpdate('.footer-address', data.contacts.address);
            
            forceUpdate('.contact-info .contact-item:nth-child(4) p', data.contacts.hours);
            forceUpdate('.footer-section:nth-child(3) p:nth-child(4)', data.contacts.hours);
            forceUpdate('.footer-hours', data.contacts.hours);
            
            console.groupEnd();
        }
        
        // SETTINGS
        if (data.settings && data.settings.siteTitle) {
            document.title = data.settings.siteTitle;
        }
    }
    
    function forceUpdate(selector, value) {
        if (!value) return;
        
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            const oldValue = el.textContent;
            if (oldValue !== value) {
                el.textContent = value;
                console.log('✅ FORCE UPDATED:', selector + '[' + index + ']', '"' + oldValue + '" -> "' + value + '"');
            }
        });
        
        if (elements.length === 0) {
            console.log('⚠️ Selector not found:', selector);
        }
    }
    
    // АГРЕССИВНАЯ СИНХРОНИЗАЦИЯ
    function startAggressiveSync() {
        console.log('🚀 STARTING AGGRESSIVE SYNC');
        
        // Синхронизация сразу
        bulletproofSync();
        
        // Очень быстрая синхронизация первые 10 секунд
        const fastSync = setInterval(bulletproofSync, 100);
        setTimeout(() => {
            clearInterval(fastSync);
            // Быстрая синхронизация следующие 50 секунд
            const mediumSync = setInterval(bulletproofSync, 500);
            setTimeout(() => {
                clearInterval(mediumSync);
                // Нормальная синхронизация
                setInterval(bulletproofSync, 2000);
            }, 50000);
        }, 10000);
        
        // Синхронизация при ЛЮБОМ событии
        const events = ['storage', 'focus', 'load', 'mousemove', 'click', 'keydown'];
        events.forEach(event => {
            window.addEventListener(event, bulletproofSync);
        });
        
        // Синхронизация при изменении видимости
        document.addEventListener('visibilitychange', bulletproofSync);
        
        console.log('✅ Aggressive sync started');
    }
    
    // ЗАПУСК СРАЗУ
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startAggressiveSync);
    } else {
        startAggressiveSync();
    }
    
    // Глобальные функции
    window.forceBulletproofSync = bulletproofSync;
    window.bulletproofSync = bulletproofSync;
    
    console.log('✅ Bulletproof sync ready');
})();

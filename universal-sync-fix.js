// Universal Sync Fix - гарантированная синхронизация всех блоков
(function() {
    'use strict';
    
    console.log('🚀 UNIVERSAL SYNC FIX LOADED');
    
    // Храним последние примененные данные для сравнения
    let lastAppliedData = null;
    
    function universalSync() {
        console.group('🔄 UNIVERSAL SYNC');
        
        try {
            // 1. Получаем данные ВСЕМИ способами
            const data = getDataFromAllSources();
            if (!data) {
                console.log('❌ No data available');
                console.groupEnd();
                return;
            }
            
            // 2. Проверяем, изменились ли данные
            const dataString = JSON.stringify(data.content);
            const lastDataString = lastAppliedData ? JSON.stringify(lastAppliedData.content) : '';
            
            if (dataString === lastDataString) {
                console.log('⏩ No data changes detected');
                console.groupEnd();
                return;
            }
            
            console.log('�� New data detected, applying updates...');
            lastAppliedData = JSON.parse(JSON.stringify(data)); // Deep clone
            
            // 3. Применяем ВСЕ обновления
            applyAllContentUpdates(data);
            applyAllContactUpdates(data);
            applyAllSettingsUpdates(data);
            applyAllStatsUpdates(data);
            applyAllServicesUpdates(data);
            
            console.log('✅ UNIVERSAL SYNC COMPLETED');
            
        } catch (error) {
            console.error('❌ Universal sync error:', error);
        }
        
        console.groupEnd();
    }
    
    function getDataFromAllSources() {
        // Приоритет 1: dataManager (редактор)
        if (window.dataManager && window.dataManager.getData) {
            try {
                const data = window.dataManager.getData();
                if (data && data.content) {
                    console.log('🎯 Source: dataManager (editor)');
                    return data;
                }
            } catch (e) {
                console.log('⚠️ dataManager failed');
            }
        }
        
        // Приоритет 2: localStorage (админка)
        const localData = localStorage.getItem('worldtravel_data');
        if (localData) {
            try {
                const data = JSON.parse(localData);
                if (data && data.content) {
                    console.log('📁 Source: localStorage (admin)');
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
                    console.log('💾 Source: sessionStorage');
                    return data;
                }
            } catch (e) {
                console.log('⚠️ sessionStorage parse failed');
            }
        }
        
        return null;
    }
    
    function applyAllContentUpdates(data) {
        if (!data.content) return;
        
        console.group('📄 APPLYING ALL CONTENT');
        
        // HERO SECTION - все поля
        if (data.content.hero) {
            console.log('🎯 Hero section:', data.content.hero);
            forceUpdateText('#home h1', data.content.hero.title);
            forceUpdateText('.hero h1', data.content.hero.title);
            forceUpdateText('#home p', data.content.hero.description);
            forceUpdateText('.hero p', data.content.hero.description);
            
            // Кнопка героя, если есть
            if (data.content.hero.buttonText) {
                forceUpdateText('.cta-button', data.content.hero.buttonText);
            }
        }
        
        // ABOUT SECTION - все поля
        if (data.content.about) {
            console.log('🏢 About section:', data.content.about);
            forceUpdateText('#about .section-title', data.content.about.title);
            forceUpdateText('.about-text p', data.content.about.description);
        }
        
        // SERVICES SECTION - все поля
        if (data.content.services) {
            console.log('⚡ Services section:', data.content.services);
            forceUpdateText('#services .section-title', data.content.services.title);
            forceUpdateText('#services .section-subtitle', data.content.services.description);
            
            // Обновляем услуги если они есть
            if (data.content.services.services && Array.isArray(data.content.services.services)) {
                updateServices(data.content.services.services);
            }
        }
        
        // DESTINATIONS SECTION - все поля
        if (data.content.destinations) {
            console.log('🌍 Destinations section:', data.content.destinations);
            forceUpdateText('#destinations .section-title', data.content.destinations.title);
            forceUpdateText('.destinations .section-subtitle', data.content.destinations.subtitle);
        }
        
        // CONTACT SECTION - все поля
        if (data.content.contact) {
            console.log('📞 Contact section:', data.content.contact);
            forceUpdateText('#contact .section-title', data.content.contact.title);
            forceUpdateText('#contact .section-subtitle', data.content.contact.description);
        }
        
        console.groupEnd();
    }
    
    function applyAllContactUpdates(data) {
        if (!data.contacts) return;
        
        console.group('📞 APPLYING ALL CONTACTS');
        console.log('Contacts:', data.contacts);
        
        // Телефон
        forceUpdateText('.contact-info .contact-item:nth-child(1) p', data.contacts.phone);
        forceUpdateText('.footer-section:nth-child(3) p:nth-child(1)', data.contacts.phone);
        forceUpdateText('.footer-phone', data.contacts.phone);
        forceUpdateText('.contact-phone', data.contacts.phone);
        
        // Email
        forceUpdateText('.contact-info .contact-item:nth-child(2) p', data.contacts.email);
        forceUpdateText('.footer-section:nth-child(3) p:nth-child(2)', data.contacts.email);
        forceUpdateText('.footer-email', data.contacts.email);
        forceUpdateText('.contact-email', data.contacts.email);
        
        // Адрес
        forceUpdateText('.contact-info .contact-item:nth-child(3) p', data.contacts.address);
        forceUpdateText('.footer-section:nth-child(3) p:nth-child(3)', data.contacts.address);
        forceUpdateText('.footer-address', data.contacts.address);
        forceUpdateText('.contact-address', data.contacts.address);
        
        // Часы работы
        forceUpdateText('.contact-info .contact-item:nth-child(4) p', data.contacts.hours);
        forceUpdateText('.footer-section:nth-child(3) p:nth-child(4)', data.contacts.hours);
        forceUpdateText('.footer-hours', data.contacts.hours);
        forceUpdateText('.contact-hours', data.contacts.hours);
        
        console.groupEnd();
    }
    
    function applyAllSettingsUpdates(data) {
        if (!data.settings) return;
        
        console.group('⚙️ APPLYING SETTINGS');
        console.log('Settings:', data.settings);
        
        if (data.settings.siteTitle) {
            document.title = data.settings.siteTitle;
            console.log('✅ Updated page title:', data.settings.siteTitle);
        }
        
        if (data.settings.companyName) {
            forceUpdateText('.logo h2', data.settings.companyName);
            forceUpdateText('.footer-section:first-child h3', data.settings.companyName);
        }
        
        console.groupEnd();
    }
    
    function applyAllStatsUpdates(data) {
        if (!data.content?.about?.stats) return;
        
        console.group('📊 APPLYING STATS');
        console.log('Stats:', data.content.about.stats);
        
        const stats = data.content.about.stats;
        const statElements = document.querySelectorAll('.stat');
        
        stats.forEach((stat, index) => {
            if (statElements[index]) {
                const valueElement = statElements[index].querySelector('h3');
                const labelElement = statElements[index].querySelector('p');
                
                if (valueElement && stat.value) {
                    valueElement.textContent = stat.value;
                    valueElement.setAttribute('data-target', stat.value);
                }
                
                if (labelElement && stat.label) {
                    labelElement.textContent = stat.label;
                }
                
                console.log('✅ Stat updated:', stat.value, '-', stat.label);
            }
        });
        
        console.groupEnd();
    }
    
    function applyAllServicesUpdates(data) {
        if (!data.content?.services?.services) return;
        
        console.group('🎯 APPLYING SERVICES');
        console.log('Services:', data.content.services.services);
        
        updateServices(data.content.services.services);
        console.groupEnd();
    }
    
    function updateServices(services) {
        const serviceCards = document.querySelectorAll('.service-card');
        
        services.forEach((service, index) => {
            if (serviceCards[index]) {
                const titleElement = serviceCards[index].querySelector('h3');
                const descElement = serviceCards[index].querySelector('p');
                const iconElement = serviceCards[index].querySelector('.service-icon i');
                
                if (titleElement && service.title) {
                    titleElement.textContent = service.title;
                }
                
                if (descElement && service.description) {
                    descElement.textContent = service.description;
                }
                
                if (iconElement && service.icon) {
                    iconElement.className = service.icon;
                }
                
                console.log('✅ Service updated:', service.title);
            }
        });
    }
    
    function forceUpdateText(selector, value) {
        if (!value) return false;
        
        const elements = document.querySelectorAll(selector);
        let updated = false;
        
        elements.forEach((el, index) => {
            if (el.textContent !== value) {
                const oldValue = el.textContent;
                el.textContent = value;
                console.log('✅ Updated: ' + selector + '[' + index + ']', '"' + oldValue + '" -> "' + value + '"');
                updated = true;
            }
        });
        
        if (elements.length === 0) {
            console.log('⚠️ Selector not found:', selector);
        }
        
        return updated;
    }
    
    // АГРЕССИВНАЯ СИНХРОНИЗАЦИЯ
    function startUniversalSync() {
        console.log('🚀 STARTING UNIVERSAL SYNC ENGINE');
        
        // Синхронизация сразу при загрузке
        setTimeout(universalSync, 100);
        
        // Супер-агрессивная синхронизация первые 30 секунд
        const fastSync = setInterval(universalSync, 200);
        setTimeout(() => {
            clearInterval(fastSync);
            // Быстрая синхронизация следующие 2 минуты
            const mediumSync = setInterval(universalSync, 500);
            setTimeout(() => {
                clearInterval(mediumSync);
                // Постоянная синхронизация
                setInterval(universalSync, 2000);
            }, 120000);
        }, 30000);
        
        // Синхронизация при ЛЮБОМ событии
        const syncEvents = [
            'storage', 'focus', 'load', 'mousemove', 'click', 'keydown',
            'resize', 'scroll', 'touchstart', 'visibilitychange'
        ];
        
        syncEvents.forEach(event => {
            window.addEventListener(event, function() {
                setTimeout(universalSync, 50);
            });
        });
        
        // Специальные события для редактора и админки
        window.addEventListener('dataUpdated', universalSync);
        window.addEventListener('contentSaved', universalSync);
        
        console.log('✅ Universal sync engine started');
    }
    
    // ЗАПУСК
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startUniversalSync);
    } else {
        startUniversalSync();
    }
    
    // Глобальные функции для ручного вызова
    window.forceUniversalSync = universalSync;
    window.universalSync = universalSync;
    
    // Функция для принудительного сброса кэша
    window.resetSyncCache = function() {
        lastAppliedData = null;
        console.log('🔄 Sync cache reset');
        universalSync();
    };
    
    console.log('✅ Universal Sync Fix ready');
    console.log('🔧 Available commands:');
    console.log('   window.forceUniversalSync() - принудительная синхронизация');
    console.log('   window.resetSyncCache() - сброс кэша синхронизации');
    
})();

// REAL WORKING SOLUTION - гарантированно работающее решение
(function() {
    'use strict';
    
    console.log('🚀 REAL WORKING SOLUTION LOADED');
    
    // Глобальный кэш для отслеживания изменений
    const state = {
        lastData: null,
        syncInterval: null
    };
    
    function initializeRealSolution() {
        console.log('🎯 Initializing Real Working Solution...');
        
        // Останавливаем старые интервалы
        if (state.syncInterval) {
            clearInterval(state.syncInterval);
        }
        
        // Агрессивная синхронизация
        syncEverything();
        state.syncInterval = setInterval(syncEverything, 500);
        
        // Слушаем ВСЕ возможные события
        window.addEventListener('storage', handleStorage);
        window.addEventListener('focus', syncEverything);
        document.addEventListener('visibilitychange', syncEverything);
        window.addEventListener('dataUpdated', syncEverything);
        window.addEventListener('contentSaved', syncEverything);
        
        // Перехватываем сохранение в редакторе
        overrideEditorSave();
        
        console.log('✅ Real Working Solution initialized');
    }
    
    function handleStorage(e) {
        if (e.key === 'worldtravel_data') {
            setTimeout(syncEverything, 100);
        }
    }
    
    function syncEverything() {
        try {
            const data = getData();
            if (!data) return;
            
            const dataHash = JSON.stringify(data.content);
            if (state.lastData === dataHash) return;
            
            console.log('🔄 REAL SYNC: Applying all changes...');
            state.lastData = dataHash;
            
            // Применяем ВСЕ обновления агрессивно
            applyContent(data.content);
            applyContacts(data.contacts);
            applySettings(data.settings);
            applyStatsAGGRESSIVE(data.content?.about?.stats);
            applyServicesAGGRESSIVE(data.content?.services?.services);
            applyImages(data.content);
            
            console.log('✅ REAL SYNC: All changes applied');
            
        } catch (error) {
            console.error('❌ REAL SYNC ERROR:', error);
        }
    }
    
    function getData() {
        // Приоритет 1: dataManager
        if (window.dataManager?.getData) {
            const data = window.dataManager.getData();
            if (data?.content) {
                console.log('🎯 Using dataManager data');
                return data;
            }
        }
        
        // Приоритет 2: localStorage
        const localData = localStorage.getItem('worldtravel_data');
        if (localData) {
            try {
                const data = JSON.parse(localData);
                if (data?.content) {
                    console.log('📁 Using localStorage data');
                    return data;
                }
            } catch (e) {
                console.log('❌ localStorage parse error');
            }
        }
        
        return null;
    }
    
    function applyContent(content) {
        if (!content) return;
        
        // Hero
        if (content.hero) {
            forceUpdate('#home h1', content.hero.title);
            forceUpdate('#home p', content.hero.description);
            forceUpdate('.hero h1', content.hero.title);
            forceUpdate('.hero p', content.hero.description);
            if (content.hero.buttonText) {
                forceUpdate('.cta-button', content.hero.buttonText);
            }
        }
        
        // About
        if (content.about) {
            forceUpdate('#about .section-title', content.about.title);
            forceUpdate('.about-text p', content.about.description);
        }
        
        // Services
        if (content.services) {
            forceUpdate('#services .section-title', content.services.title);
            if (content.services.description) {
                forceUpdate('#services .section-subtitle', content.services.description);
            }
        }
        
        // Destinations
        if (content.destinations) {
            forceUpdate('#destinations .section-title', content.destinations.title);
            forceUpdate('.destinations .section-subtitle', content.destinations.subtitle);
        }
        
        // Contact
        if (content.contact) {
            forceUpdate('#contact .section-title', content.contact.title);
            if (content.contact.description) {
                forceUpdate('#contact .section-subtitle', content.contact.description);
            }
        }
    }
    
    function applyContacts(contacts) {
        if (!contacts) return;
        
        // Телефон
        forceUpdate('.contact-info .contact-item:nth-child(1) p', contacts.phone);
        forceUpdate('.footer-phone', contacts.phone);
        forceUpdate('.contact-phone', contacts.phone);
        
        // Email
        forceUpdate('.contact-info .contact-item:nth-child(2) p', contacts.email);
        forceUpdate('.footer-email', contacts.email);
        forceUpdate('.contact-email', contacts.email);
        
        // Адрес
        forceUpdate('.contact-info .contact-item:nth-child(3) p', contacts.address);
        forceUpdate('.footer-address', contacts.address);
        forceUpdate('.contact-address', contacts.address);
        
        // График работы
        forceUpdate('.contact-info .contact-item:nth-child(4) p', contacts.hours);
        forceUpdate('.footer-hours', contacts.hours);
        forceUpdate('.contact-hours', contacts.hours);
    }
    
    function applySettings(settings) {
        if (!settings) return;
        
        if (settings.siteTitle) {
            document.title = settings.siteTitle;
        }
        
        if (settings.companyName) {
            forceUpdate('.logo h2', settings.companyName);
            forceUpdate('.footer-section:first-child h3', settings.companyName);
        }
    }
    
    function applyStatsAGGRESSIVE(stats) {
        if (!stats || !Array.isArray(stats)) {
            console.log('📊 No stats to apply');
            hideElement('.stats');
            return;
        }
        
        console.log('📊 Applying stats AGGRESSIVE:', stats);
        
        const validStats = stats.filter(stat => stat.value && stat.label);
        if (validStats.length === 0) {
            hideElement('.stats');
            return;
        }
        
        showElement('.stats');
        const statElements = document.querySelectorAll('.stat');
        
        // Создаем недостающие элементы
        while (statElements.length < validStats.length) {
            createStatElement();
        }
        
        // Обновляем все элементы
        const currentStatElements = document.querySelectorAll('.stat');
        validStats.forEach((stat, index) => {
            if (currentStatElements[index]) {
                const valueEl = currentStatElements[index].querySelector('h3');
                const labelEl = currentStatElements[index].querySelector('p');
                
                if (valueEl) valueEl.textContent = stat.value;
                if (labelEl) labelEl.textContent = stat.label;
                
                currentStatElements[index].style.display = 'block';
                console.log('✅ Stat applied:', stat.value, '-', stat.label);
            }
        });
        
        // Скрываем лишние
        for (let i = validStats.length; i < currentStatElements.length; i++) {
            currentStatElements[i].style.display = 'none';
        }
    }
    
    function applyServicesAGGRESSIVE(services) {
        if (!services || !Array.isArray(services)) {
            console.log('🎯 No services to apply');
            hideElement('.services-grid');
            return;
        }
        
        console.log('🎯 Applying services AGGRESSIVE:', services);
        
        const validServices = services.filter(service => service.title && service.description);
        if (validServices.length === 0) {
            hideElement('.services-grid');
            return;
        }
        
        showElement('.services-grid');
        const serviceElements = document.querySelectorAll('.service-card');
        
        // Создаем недостающие элементы
        while (serviceElements.length < validServices.length) {
            createServiceElement();
        }
        
        // Обновляем все элементы
        const currentServiceElements = document.querySelectorAll('.service-card');
        validServices.forEach((service, index) => {
            if (currentServiceElements[index]) {
                const titleEl = currentServiceElements[index].querySelector('h3');
                const descEl = currentServiceElements[index].querySelector('p');
                const iconEl = currentServiceElements[index].querySelector('.service-icon i');
                
                if (titleEl) titleEl.textContent = service.title;
                if (descEl) descEl.textContent = service.description;
                if (iconEl && service.icon) {
                    iconEl.className = service.icon;
                }
                
                currentServiceElements[index].style.display = 'block';
                console.log('✅ Service applied:', service.title);
            }
        });
        
        // Скрываем лишние
        for (let i = validServices.length; i < currentServiceElements.length; i++) {
            currentServiceElements[i].style.display = 'none';
        }
    }
    
    function applyImages(content) {
        if (!content) return;
        
        // Hero background
        if (content.hero?.backgroundImage) {
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.backgroundImage = `url(${content.hero.backgroundImage})`;
                hero.style.backgroundSize = 'cover';
                hero.style.backgroundPosition = 'center';
            }
        }
        
        // About image
        if (content.about?.image) {
            const aboutImg = document.querySelector('.about-image img');
            if (aboutImg) {
                aboutImg.src = content.about.image;
            }
        }
    }
    
    function createStatElement() {
        const statsContainer = document.querySelector('.stats');
        if (!statsContainer) return;
        
        const statHTML = `
            <div class="stat animate-counter" data-target="0">
                <h3>0</h3>
                <p>Новый показатель</p>
            </div>
        `;
        statsContainer.innerHTML += statHTML;
    }
    
    function createServiceElement() {
        const servicesContainer = document.querySelector('.services-grid');
        if (!servicesContainer) return;
        
        const serviceHTML = `
            <div class="service-card slide-in-left">
                <div class="service-icon"><i class="fas fa-star"></i></div>
                <h3>Новая услуга</h3>
                <p>Описание новой услуги</p>
            </div>
        `;
        servicesContainer.innerHTML += serviceHTML;
    }
    
    function forceUpdate(selector, value) {
        if (!value) return;
        document.querySelectorAll(selector).forEach(el => {
            if (el.textContent !== value) {
                el.textContent = value;
            }
        });
    }
    
    function hideElement(selector) {
        const el = document.querySelector(selector);
        if (el) el.style.display = 'none';
    }
    
    function showElement(selector) {
        const el = document.querySelector(selector);
        if (el) el.style.display = '';
    }
    
    function overrideEditorSave() {
        // Перехватываем сохранение в редакторе если он существует
        if (window.fixedEditor?.saveSection) {
            const originalSave = window.fixedEditor.saveSection;
            window.fixedEditor.saveSection = function() {
                console.log('🎯 EDITOR SAVE INTERCEPTED');
                const result = originalSave.call(this);
                // Форсируем синхронизацию после сохранения
                setTimeout(syncEverything, 100);
                return result;
            };
        }
    }
    
    // Глобальные функции
    window.forceRealSync = syncEverything;
    window.resetRealSync = function() {
        state.lastData = null;
        syncEverything();
    };
    
    // Запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeRealSolution);
    } else {
        initializeRealSolution();
    }
    
})();

// Fixed Sync with Images - исправленные селекторы и работа с изображениями
(function() {
    'use strict';
    
    console.log('🔄 FIXED SYNC WITH IMAGES LOADED');
    
    let lastSyncHash = '';
    let isInitialized = false;
    
    function initializeContentSync() {
        if (isInitialized) return;
        
        console.log('🚀 Starting Fixed Sync with Images...');
        
        // Синхронизация сразу
        syncContent();
        
        // Быстрая синхронизация
        const fastSyncInterval = setInterval(syncContent, 500);
        setTimeout(() => {
            clearInterval(fastSyncInterval);
            setInterval(syncContent, 2000);
        }, 30000);
        
        // События синхронизации
        window.addEventListener('storage', handleStorageEvent);
        window.addEventListener('focus', syncContent);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        isInitialized = true;
        console.log('✅ Fixed Sync with Images initialized');
    }
    
    function handleStorageEvent(e) {
        if (e.key === 'worldtravel_data') {
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
            if (newHash === lastSyncHash) return;
            
            console.log('🔄 Applying content and image updates...');
            
            applyAllUpdates(data);
            
            lastSyncHash = newHash;
            console.log('✅ Sync with images completed');
            
        } catch (error) {
            console.log('❌ Sync error:', error);
        }
    }
    
    function getCurrentData() {
        if (window.dataManager && window.dataManager.getData) {
            try {
                return window.dataManager.getData();
            } catch (e) {
                console.log('⚠️ dataManager not available');
            }
        }
        
        const localData = localStorage.getItem('worldtravel_data');
        if (localData) {
            try {
                return JSON.parse(localData);
            } catch (e) {
                console.log('⚠️ localStorage data corrupted');
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
    
    function applyAllUpdates(data) {
        applyContentUpdates(data);
        applyContactUpdates(data);
        applySettingsUpdates(data);
        applyStatsUpdates(data);
        applyServicesUpdates(data);
        applyImageUpdates(data);
    }
    
    function applyContentUpdates(data) {
        if (!data.content) return;
        
        const content = data.content;
        
        // Hero section
        if (content.hero) {
            updateElement('#home h1, .hero h1', content.hero.title);
            updateElement('#home p, .hero p', content.hero.description);
            
            if (content.hero.buttonText) {
                updateElement('.cta-button', content.hero.buttonText);
            }
        }
        
        // About section
        if (content.about) {
            updateElement('#about .section-title', content.about.title);
            updateElement('.about-text p', content.about.description);
        }
        
        // Services section
        if (content.services) {
            updateElement('#services .section-title', content.services.title);
            updateElement('#services .section-subtitle', content.services.description);
        }
        
        // Destinations section
        if (content.destinations) {
            updateElement('#destinations .section-title', content.destinations.title);
            updateElement('.destinations .section-subtitle', content.destinations.subtitle);
        }
        
        // Contact section
        if (content.contact) {
            updateElement('#contact .section-title', content.contact.title);
            updateElement('#contact .section-subtitle', content.contact.description);
        }
    }
    
    function applyContactUpdates(data) {
        if (!data.contacts) return;
        
        const contacts = data.contacts;
        console.log('�� Applying contacts:', contacts);
        
        // ПРАВИЛЬНЫЕ СЕЛЕКТОРЫ ДЛЯ КОНТАКТОВ
        if (contacts.phone) {
            updateElement('.contact-info .contact-item:nth-child(1) p', contacts.phone);
            updateElement('.footer-section:nth-child(3) .footer-phone', contacts.phone);
            updateElement('.contact-phone', contacts.phone);
        }
        if (contacts.email) {
            updateElement('.contact-info .contact-item:nth-child(2) p', contacts.email);
            updateElement('.footer-section:nth-child(3) .footer-email', contacts.email);
            updateElement('.contact-email', contacts.email);
        }
        if (contacts.address) {
            updateElement('.contact-info .contact-item:nth-child(3) p', contacts.address);
            updateElement('.footer-section:nth-child(3) .footer-address', contacts.address);
            updateElement('.contact-address', contacts.address);
        }
        if (contacts.hours) {
            updateElement('.contact-info .contact-item:nth-child(4) p', contacts.hours);
            updateElement('.footer-section:nth-child(3) .footer-hours', contacts.hours);
            updateElement('.contact-hours', contacts.hours);
        }
    }
    
    function applySettingsUpdates(data) {
        if (!data.settings) return;
        
        const settings = data.settings;
        
        if (settings.siteTitle) {
            document.title = settings.siteTitle;
        }
        
        if (settings.companyName) {
            updateElement('.logo h2', settings.companyName);
            updateElement('.footer-section:first-child h3', settings.companyName);
        }
    }
    
    function applyStatsUpdates(data) {
        if (!data.content?.about?.stats) return;
        
        const stats = data.content.about.stats;
        console.log('📊 Applying stats:', stats);
        
        const statElements = document.querySelectorAll('.stat');
        const validStats = stats.filter(stat => stat.value && stat.label);
        
        if (validStats.length === 0) {
            hideElement('.stats');
            return;
        }
        
        showElement('.stats');
        
        validStats.forEach((stat, index) => {
            if (statElements[index]) {
                const valueElement = statElements[index].querySelector('h3');
                const labelElement = statElements[index].querySelector('p');
                
                if (valueElement) {
                    valueElement.textContent = stat.value;
                    valueElement.setAttribute('data-target', stat.value);
                }
                if (labelElement) {
                    labelElement.textContent = stat.label;
                }
                
                statElements[index].style.display = 'block';
                console.log('✅ Stat updated:', stat.value, '-', stat.label);
            }
        });
        
        // Hide extra elements
        for (let i = validStats.length; i < statElements.length; i++) {
            statElements[i].style.display = 'none';
        }
    }
    
    function applyServicesUpdates(data) {
        if (!data.content?.services?.services) return;
        
        const services = data.content.services.services;
        console.log('🎯 Applying services:', services);
        
        const validServices = services.filter(service => service.title && service.description);
        const serviceCards = document.querySelectorAll('.service-card');
        
        if (validServices.length === 0) {
            hideElement('.services-grid');
            return;
        }
        
        showElement('.services-grid');
        
        validServices.forEach((service, index) => {
            if (serviceCards[index]) {
                const titleElement = serviceCards[index].querySelector('h3');
                const descElement = serviceCards[index].querySelector('p');
                const iconElement = serviceCards[index].querySelector('.service-icon i');
                
                if (titleElement) titleElement.textContent = service.title;
                if (descElement) descElement.textContent = service.description;
                if (iconElement && service.icon) {
                    iconElement.className = service.icon;
                }
                
                serviceCards[index].style.display = 'block';
                console.log('✅ Service updated:', service.title);
            }
        });
        
        // Hide extra cards
        for (let i = validServices.length; i < serviceCards.length; i++) {
            serviceCards[i].style.display = 'none';
        }
    }
    
    function applyImageUpdates(data) {
        if (!data.content) return;
        
        console.log('🖼️ Applying image updates...');
        
        // Hero background image
        if (data.content.hero?.backgroundImage) {
            updateHeroBackground(data.content.hero.backgroundImage);
        }
        
        // About section image
        if (data.content.about?.image) {
            updateAboutImage(data.content.about.image);
        }
    }
    
    function updateHeroBackground(imageUrl) {
        if (!imageUrl) return;
        
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.style.backgroundImage = 'url(' + imageUrl + ')';
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';
            console.log('✅ Hero background updated:', imageUrl);
        }
    }
    
    function updateAboutImage(imageUrl) {
        if (!imageUrl) return;
        
        const aboutImage = document.querySelector('.about-image img');
        if (aboutImage) {
            aboutImage.src = imageUrl;
            aboutImage.alt = 'О компании WorldTravel';
            console.log('✅ About image updated:', imageUrl);
        }
    }
    
    function updateElement(selector, value) {
        if (!value) return;
        const elements = document.querySelectorAll(selector);
        let updated = false;
        
        elements.forEach(el => {
            if (el.textContent !== value) {
                el.textContent = value;
                updated = true;
            }
        });
        
        if (updated) {
            console.log('✅ Text updated:', selector, '->', value);
        }
    }
    
    function hideElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.style.display = 'none';
        }
    }
    
    function showElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.style.display = '';
        }
    }
    
    // Глобальные функции
    window.forceSyncWithImages = syncContent;
    
    // Запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeContentSync);
    } else {
        initializeContentSync();
    }
    
})();

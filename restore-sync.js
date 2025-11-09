// Restore Sync - восстанавливаем синхронизацию редактора с главной страницей
(function() {
    'use strict';
    
    console.log('🔄 RESTORE SYNC LOADED');
    
    let lastDataHash = '';
    
    function initializeSync() {
        console.log('🚀 Initializing editor sync...');
        
        // Синхронизация сразу
        syncWithEditor();
        
        // Синхронизация каждые 2 секунды
        setInterval(syncWithEditor, 2000);
        
        // Слушаем события от редактора
        window.addEventListener('storage', handleStorageEvent);
        window.addEventListener('dataUpdated', syncWithEditor);
        
        console.log('✅ Editor sync initialized');
    }
    
    function handleStorageEvent(e) {
        if (e.key === 'worldtravel_data') {
            setTimeout(syncWithEditor, 100);
        }
    }
    
    function syncWithEditor() {
        try {
            const data = getCurrentData();
            if (!data) return;
            
            const newHash = JSON.stringify(data.content);
            if (newHash === lastDataHash) return;
            
            console.log('🔄 Syncing with editor data...');
            lastDataHash = newHash;
            
            applyContentUpdates(data);
            applyContactUpdates(data);
            applyCardUpdates(data);
            
            console.log('✅ Editor sync completed');
            
        } catch (error) {
            console.log('❌ Sync error:', error);
        }
    }
    
    function getCurrentData() {
        // Приоритет 1: dataManager (редактор)
        if (window.dataManager?.getData) {
            const data = window.dataManager.getData();
            if (data?.content) {
                return data;
            }
        }
        
        // Приоритет 2: localStorage
        const localData = localStorage.getItem('worldtravel_data');
        if (localData) {
            try {
                const data = JSON.parse(localData);
                if (data?.content) {
                    return data;
                }
            } catch (e) {
                console.log('⚠️ localStorage parse error');
            }
        }
        
        return null;
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
            
            if (content.hero.backgroundImage) {
                updateHeroBackground(content.hero.backgroundImage);
            }
        }
        
        // About section
        if (content.about) {
            updateElement('#about .section-title', content.about.title);
            updateElement('.about-text p', content.about.description);
            
            if (content.about.image) {
                updateAboutImage(content.about.image);
            }
        }
        
        // Services section
        if (content.services) {
            updateElement('#services .section-title', content.services.title);
            if (content.services.description) {
                updateElement('#services .section-subtitle', content.services.description);
            }
        }
        
        // Destinations section
        if (content.destinations) {
            updateElement('#destinations .section-title', content.destinations.title);
            updateElement('.destinations .section-subtitle', content.destinations.subtitle);
        }
        
        // Contact section
        if (content.contact) {
            updateElement('#contact .section-title', content.contact.title);
            if (content.contact.description) {
                updateElement('#contact .section-subtitle', content.contact.description);
            }
        }
    }
    
    function applyContactUpdates(data) {
        if (!data.contacts) return;
        
        const contacts = data.contacts;
        
        // Основная контактная секция
        updateElement('.contact-info .contact-item:nth-child(1) p', contacts.phone);
        updateElement('.contact-info .contact-item:nth-child(2) p', contacts.email);
        updateElement('.contact-info .contact-item:nth-child(3) p', contacts.address);
        updateElement('.contact-info .contact-item:nth-child(4) p', contacts.hours);
        
        // Футер
        updateElement('.footer-phone', contacts.phone);
        updateElement('.footer-email', contacts.email);
        updateElement('.footer-address', contacts.address);
        updateElement('.footer-hours', contacts.hours);
    }
    
    function applyCardUpdates(data) {
        if (!data.content) return;
        
        // Статистика
        if (data.content.about?.stats) {
            applyStats(data.content.about.stats);
        }
        
        // Услуги
        if (data.content.services?.services) {
            applyServices(data.content.services.services);
        }
    }
    
    function applyStats(stats) {
        if (!Array.isArray(stats)) return;
        
        const validStats = stats.filter(stat => stat.value && stat.label);
        const statElements = document.querySelectorAll('.stat');
        
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
    
    function updateHeroBackground(imageUrl) {
        if (!imageUrl) return;
        
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.style.backgroundImage = `url(${imageUrl})`;
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';
        }
    }
    
    function updateAboutImage(imageUrl) {
        if (!imageUrl) return;
        
        const aboutImage = document.querySelector('.about-image img');
        if (aboutImage) {
            aboutImage.src = imageUrl;
        }
    }
    
    function updateElement(selector, value) {
        if (!value) return;
        document.querySelectorAll(selector).forEach(el => {
            if (el.textContent !== value) {
                el.textContent = value;
            }
        });
    }
    
    // Глобальные функции
    window.forceEditorSync = syncWithEditor;
    
    // Запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSync);
    } else {
        initializeSync();
    }
    
})();

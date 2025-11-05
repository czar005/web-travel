// Fixed Content Sync - на основе рабочей версии из all_files.txt
(function() {
    'use strict';
    
    console.log('🔄 FIXED CONTENT SYNC LOADED');
    
    let lastSyncHash = '';
    let isInitialized = false;
    
    function initializeContentSync() {
        if (isInitialized) return;
        
        console.log('🚀 Starting Fixed Content Sync System...');
        
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
        console.log('✅ Fixed Content Sync System initialized');
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
            if (newHash === lastSyncHash) return;
            
            console.log('🔄 Applying content updates...');
            
            applyContentUpdates(data);
            applyContactUpdates(data);
            applySettingsUpdates(data);
            applyStatsUpdates(data);
            applyServicesUpdates(data);
            
            lastSyncHash = newHash;
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
            updateElement('#home p, .hero p', content.hero.description);
            
            // Обновляем изображение героя если есть
            if (content.hero.backgroundImage) {
                updateHeroBackground(content.hero.backgroundImage);
            }
            
            // Обновляем текст кнопки если есть
            if (content.hero.buttonText) {
                updateElement('.cta-button', content.hero.buttonText);
            }
        }
        
        // About section
        if (content.about) {
            updateElement('#about .section-title', content.about.title);
            updateElement('.about-text p', content.about.description);
            
            // Обновляем изображение about если есть
            if (content.about.image) {
                updateAboutImage(content.about.image);
            }
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
        
        // Правильный порядок контактов в секции
        if (contacts.phone) {
            updateElement('.contact-info .contact-item:nth-child(1) p', contacts.phone);
            updateElement('.footer-section:nth-child(3) p:nth-child(1)', contacts.phone);
            updateElement('.contact-phone', contacts.phone);
            updateElement('.footer-phone', contacts.phone);
        }
        if (contacts.email) {
            updateElement('.contact-info .contact-item:nth-child(2) p', contacts.email);
            updateElement('.footer-section:nth-child(3) p:nth-child(2)', contacts.email);
            updateElement('.contact-email', contacts.email);
            updateElement('.footer-email', contacts.email);
        }
        if (contacts.address) {
            updateElement('.contact-info .contact-item:nth-child(3) p', contacts.address);
            updateElement('.footer-section:nth-child(3) p:nth-child(3)', contacts.address);
            updateElement('.contact-address', contacts.address);
            updateElement('.footer-address', contacts.address);
        }
        if (contacts.hours) {
            updateElement('.contact-info .contact-item:nth-child(4) p', contacts.hours);
            updateElement('.footer-section:nth-child(3) p:nth-child(4)', contacts.hours);
            updateElement('.contact-hours', contacts.hours);
            updateElement('.footer-hours', contacts.hours);
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
        
        // Фильтруем только валидные статистики
        const validStats = stats.filter(stat => stat.value && stat.label);
        
        if (validStats.length === 0) {
            hideStatsSection();
            return;
        }
        
        // Показываем блок статистики
        showStatsSection();
        
        if (statElements.length >= validStats.length) {
            validStats.forEach(function(stat, index) {
                if (statElements[index]) {
                    var valueElement = statElements[index].querySelector('h3');
                    var labelElement = statElements[index].querySelector('p');
                    
                    if (valueElement) {
                        valueElement.textContent = stat.value;
                        // Добавляем атрибут для анимации счетчика
                        if (!valueElement.hasAttribute('data-target')) {
                            valueElement.setAttribute('data-target', stat.value);
                        }
                    }
                    if (labelElement) {
                        labelElement.textContent = stat.label;
                    }
                    
                    // Показываем элемент
                    statElements[index].style.display = 'block';
                }
            });
            
            // Скрываем лишние элементы
            for (var i = validStats.length; i < statElements.length; i++) {
                statElements[i].style.display = 'none';
            }
        }
    }
    
    function applyServicesUpdates(data) {
        if (!data.content?.services?.services) return;
        
        const services = data.content.services.services;
        console.log('🎯 Applying services:', services);
        
        // Фильтруем только валидные услуги
        const validServices = services.filter(service => service.title && service.description);
        
        if (validServices.length === 0) {
            hideServicesSection();
            return;
        }
        
        const serviceCards = document.querySelectorAll('.service-card');
        
        // Показываем блок услуг
        showServicesSection();
        
        if (serviceCards.length >= validServices.length) {
            validServices.forEach(function(service, index) {
                if (serviceCards[index]) {
                    var titleElement = serviceCards[index].querySelector('h3');
                    var descElement = serviceCards[index].querySelector('p');
                    var iconElement = serviceCards[index].querySelector('.service-icon i');
                    
                    if (titleElement) titleElement.textContent = service.title;
                    if (descElement) descElement.textContent = service.description;
                    if (iconElement && service.icon) {
                        iconElement.className = service.icon;
                    }
                    
                    // Показываем карточку
                    serviceCards[index].style.display = 'block';
                }
            });
            
            // Скрываем лишние карточки
            for (var i = validServices.length; i < serviceCards.length; i++) {
                serviceCards[i].style.display = 'none';
            }
        }
    }
    
    function hideStatsSection() {
        var statsContainer = document.querySelector('.stats');
        if (statsContainer) {
            statsContainer.style.display = 'none';
        }
    }
    
    function showStatsSection() {
        var statsContainer = document.querySelector('.stats');
        if (statsContainer) {
            statsContainer.style.display = 'flex';
        }
    }
    
    function hideServicesSection() {
        var servicesGrid = document.querySelector('.services-grid');
        if (servicesGrid) {
            servicesGrid.style.display = 'none';
        }
    }
    
    function showServicesSection() {
        var servicesGrid = document.querySelector('.services-grid');
        if (servicesGrid) {
            servicesGrid.style.display = 'grid';
        }
    }
    
    function updateHeroBackground(imageUrl) {
        const heroSection = document.querySelector('.hero');
        if (heroSection && imageUrl) {
            heroSection.style.backgroundImage = 'url(' + imageUrl + ')';
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';
        }
    }
    
    function updateAboutImage(imageUrl) {
        const aboutImage = document.querySelector('.about-image img');
        if (aboutImage && imageUrl) {
            aboutImage.src = imageUrl;
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
    
    // Глобальные функции для принудительной синхронизации
    window.forceContentSync = syncContent;
    window.reinitializeContentSync = function() {
        isInitialized = false;
        lastSyncHash = '';
        initializeContentSync();
    };
    
    // Запуск системы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeContentSync);
    } else {
        initializeContentSync();
    }
    
})();

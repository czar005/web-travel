// Enhanced Card Sync - гарантированная синхронизация карточек
(function() {
    'use strict';
    
    console.log('🔄 ENHANCED CARD SYNC LOADED');
    
    let lastStatsHash = '';
    let lastServicesHash = '';
    
    function initializeCardSync() {
        console.log('🚀 Starting Enhanced Card Sync...');
        
        // Синхронизация сразу
        syncCards();
        
        // Постоянная синхронизация
        setInterval(syncCards, 1000);
        
        // События для синхронизации
        window.addEventListener('storage', handleStorageEvent);
        window.addEventListener('dataUpdated', syncCards);
        
        console.log('✅ Enhanced Card Sync initialized');
    }
    
    function handleStorageEvent(e) {
        if (e.key === 'worldtravel_data') {
            setTimeout(syncCards, 100);
        }
    }
    
    function syncCards() {
        try {
            const data = getCurrentData();
            if (!data || !data.content) return;
            
            syncStats(data.content);
            syncServices(data.content);
            
        } catch (error) {
            console.log('❌ Card sync error:', error);
        }
    }
    
    function getCurrentData() {
        if (window.dataManager && window.dataManager.getData) {
            return window.dataManager.getData();
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
    
    function syncStats(content) {
        if (!content.about?.stats) return;
        
        const stats = content.about.stats;
        const statsHash = JSON.stringify(stats);
        
        if (statsHash === lastStatsHash) return;
        
        console.log('📊 Syncing stats:', stats);
        lastStatsHash = statsHash;
        
        const statElements = document.querySelectorAll('.stat');
        const validStats = stats.filter(stat => stat.value && stat.label);
        
        if (validStats.length === 0) {
            hideElement('.stats');
            return;
        }
        
        showElement('.stats');
        
        // Обновляем существующие карточки
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
                console.log('✅ Stat synced:', stat.value, '-', stat.label);
            }
        });
        
        // Скрываем лишние
        for (let i = validStats.length; i < statElements.length; i++) {
            statElements[i].style.display = 'none';
        }
    }
    
    function syncServices(content) {
        if (!content.services?.services) return;
        
        const services = content.services.services;
        const servicesHash = JSON.stringify(services);
        
        if (servicesHash === lastServicesHash) return;
        
        console.log('🎯 Syncing services:', services);
        lastServicesHash = servicesHash;
        
        const serviceCards = document.querySelectorAll('.service-card');
        const validServices = services.filter(service => service.title && service.description);
        
        if (validServices.length === 0) {
            hideElement('.services-grid');
            return;
        }
        
        showElement('.services-grid');
        
        // Обновляем существующие карточки
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
                console.log('✅ Service synced:', service.title);
            }
        });
        
        // Скрываем лишние
        for (let i = validServices.length; i < serviceCards.length; i++) {
            serviceCards[i].style.display = 'none';
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
    window.forceCardSync = syncCards;
    
    // Запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCardSync);
    } else {
        initializeCardSync();
    }
    
})();

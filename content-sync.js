// Enhanced Content Sync with proper stats and services handling
(function() {
    'use strict';
    
    console.log('🔄 Enhanced Content Sync loaded');
    
    let lastDataHash = '';
    let syncInterval;
    
    function startEnhancedSync() {
        console.log('🚀 Starting enhanced content sync...');
        
        // Immediate sync
        syncAllContent();
        
        // Fast sync for first 30 seconds
        syncInterval = setInterval(syncAllContent, 500);
        setTimeout(() => {
            clearInterval(syncInterval);
            // Continue with normal sync
            syncInterval = setInterval(syncAllContent, 2000);
        }, 30000);
        
        // Sync on storage events
        window.addEventListener('storage', function(e) {
            if (e.key === 'worldtravel_data') {
                setTimeout(syncAllContent, 100);
            }
        });
        
        // Sync when page becomes visible
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                syncAllContent();
            }
        });
        
        console.log('✅ Enhanced content sync started');
    }
    
    function syncAllContent() {
        try {
            const data = getCurrentData();
            if (!data) return;
            
            const dataHash = calculateDataHash(data);
            if (dataHash === lastDataHash) return;
            
            console.log('🔄 Syncing content...');
            
            // Sync in specific order
            syncContacts(data.contacts);
            syncContentSections(data.content);
            syncStats(data.content);
            syncServices(data.content);
            syncFooter(data);
            syncNavigation(data.content);
            syncSettings(data.settings);
            
            lastDataHash = dataHash;
            console.log('✅ Content synced successfully');
            
        } catch (error) {
            console.error('❌ Sync error:', error);
        }
    }
    
    function getCurrentData() {
        // Try multiple data sources
        if (window.dataManager && window.dataManager.getData) {
            return window.dataManager.getData();
        }
        
        const localData = localStorage.getItem('worldtravel_data');
        if (localData) {
            try {
                return JSON.parse(localData);
            } catch (e) {
                console.error('❌ Error parsing local data');
            }
        }
        
        return null;
    }
    
    function calculateDataHash(data) {
        return JSON.stringify({
            contacts: data.contacts,
            content: data.content,
            settings: data.settings,
            timestamp: data.lastUpdate
        });
    }
    
    function syncContacts(contacts) {
        if (!contacts) return;
        
        const contactMap = [
            { selectors: ['.contact-phone', '.footer-phone'], value: contacts.phone },
            { selectors: ['.contact-email', '.footer-email'], value: contacts.email },
            { selectors: ['.contact-address', '.footer-address'], value: contacts.address },
            { selectors: ['.contact-hours', '.footer-hours'], value: contacts.hours }
        ];
        
        contactMap.forEach(item => {
            if (item.value) {
                item.selectors.forEach(selector => {
                    updateElements(selector, item.value);
                });
            }
        });
    }
    
    function syncContentSections(content) {
        if (!content) return;
        
        // Hero section
        if (content.hero) {
            updateElements('#home h1, .hero h1', content.hero.title);
            updateElements('#home p, .hero p', content.hero.description);
        }
        
        // About section
        if (content.about) {
            updateElements('#about .section-title', content.about.title);
            updateElements('.about-text p', content.about.description);
        }
        
        // Services section
        if (content.services) {
            updateElements('#services .section-title', content.services.title);
            updateElements('#services .section-subtitle', content.services.description);
        }
        
        // Destinations section
        if (content.destinations) {
            updateElements('#destinations .section-title', content.destinations.title);
            updateElements('.destinations .section-subtitle', content.destinations.subtitle);
        }
        
        // Contact section
        if (content.contact) {
            updateElements('#contact .section-title', content.contact.title);
            updateElements('#contact .section-subtitle', content.contact.description);
        }
    }
    
    function syncStats(content) {
        if (!content?.about?.stats) return;
        
        const stats = content.about.stats;
        const statElements = document.querySelectorAll('.stat');
        
        console.log('📊 Syncing stats:', stats.length);
        
        stats.forEach((stat, index) => {
            if (statElements[index]) {
                const valueElement = statElements[index].querySelector('h3');
                const labelElement = statElements[index].querySelector('p');
                
                if (valueElement && valueElement.textContent !== stat.value) {
                    valueElement.textContent = stat.value;
                    valueElement.setAttribute('data-target', stat.value);
                }
                
                if (labelElement && labelElement.textContent !== stat.label) {
                    labelElement.textContent = stat.label;
                }
                
                statElements[index].style.display = 'block';
            }
        });
        
        // Hide extra stat elements
        for (let i = stats.length; i < statElements.length; i++) {
            statElements[i].style.display = 'none';
        }
    }
    
    function syncServices(content) {
        if (!content?.services?.services) return;
        
        const services = content.services.services;
        const serviceCards = document.querySelectorAll('.service-card');
        
        console.log('🎯 Syncing services:', services.length);
        
        services.forEach((service, index) => {
            if (serviceCards[index]) {
                const titleElement = serviceCards[index].querySelector('h3');
                const descElement = serviceCards[index].querySelector('p');
                const iconElement = serviceCards[index].querySelector('.service-icon i');
                
                if (titleElement && titleElement.textContent !== service.title) {
                    titleElement.textContent = service.title;
                }
                
                if (descElement && descElement.textContent !== service.description) {
                    descElement.textContent = service.description;
                }
                
                if (iconElement && service.icon && iconElement.className !== service.icon) {
                    iconElement.className = service.icon;
                }
                
                serviceCards[index].style.display = 'block';
            }
        });
        
        // Hide extra service cards
        for (let i = services.length; i < serviceCards.length; i++) {
            serviceCards[i].style.display = 'none';
        }
    }
    
    function syncFooter(data) {
        if (data.footer) {
            updateElements('.footer-description', data.footer.description);
            updateElementsHTML('.footer-copyright', data.footer.copyright);
        }
    }
    
    function syncNavigation(content) {
        if (!content) return;
        
        const navMap = [
            { href: '#about', title: content.about?.title },
            { href: '#services', title: content.services?.title },
            { href: '#destinations', title: content.destinations?.title },
            { href: '#contact', title: content.contact?.title }
        ];
        
        navMap.forEach(item => {
            if (item.title) {
                updateElements(`.nav-links a[href="${item.href}"]`, item.title);
                updateElements(`.footer-section:nth-child(2) a[href="${item.href}"]`, item.title);
            }
        });
    }
    
    function syncSettings(settings) {
        if (settings?.siteTitle) {
            document.title = settings.siteTitle;
        }
    }
    
    function updateElements(selector, value) {
        if (!value) return;
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (el.textContent !== value) {
                el.textContent = value;
            }
        });
    }
    
    function updateElementsHTML(selector, value) {
        if (!value) return;
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (el.innerHTML !== value) {
                el.innerHTML = value;
            }
        });
    }
    
    // Start sync when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startEnhancedSync);
    } else {
        startEnhancedSync();
    }
    
    // Global function to force sync
    window.forceContentSync = syncAllContent;
    
})();

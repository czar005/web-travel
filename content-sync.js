// Enhanced Content Sync with proper error handling
(function() {
    'use strict';
    
    console.log('🔄 Enhanced Content Sync loaded');
    
    let lastDataHash = '';
    let syncInterval;
    let errorCount = 0;
    const maxErrors = 5;
    
    function startEnhancedSync() {
        console.log('🚀 Starting enhanced content sync...');
        
        // Immediate sync
        safeSyncAllContent();
        
        // Fast sync for first 30 seconds
        syncInterval = setInterval(safeSyncAllContent, 500);
        setTimeout(() => {
            clearInterval(syncInterval);
            // Continue with normal sync
            syncInterval = setInterval(safeSyncAllContent, 2000);
        }, 30000);
        
        // Sync on storage events
        window.addEventListener('storage', function(e) {
            if (e.key === 'worldtravel_data') {
                setTimeout(safeSyncAllContent, 100);
            }
        });
        
        // Sync when page becomes visible
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                safeSyncAllContent();
            }
        });
        
        // Sync on data update events
        window.addEventListener('dataUpdated', function(e) {
            setTimeout(safeSyncAllContent, 50);
        });
        
        console.log('✅ Enhanced content sync started');
    }
    
    function safeSyncAllContent() {
        try {
            if (errorCount >= maxErrors) {
                console.warn('⚠️ Too many errors, skipping sync');
                return;
            }
            
            syncAllContent();
            errorCount = 0; // Reset error count on success
            
        } catch (error) {
            errorCount++;
            console.error(`❌ Sync error (${errorCount}/${maxErrors}):`, error);
        }
    }
    
    function syncAllContent() {
        const data = getCurrentData();
        if (!data) {
            console.log('📭 No data available for sync');
            return;
        }
        
        const dataHash = calculateDataHash(data);
        if (dataHash === lastDataHash) {
            return; // No changes
        }
        
        console.log('🔄 Syncing content...', {
            contacts: !!data.contacts,
            content: !!data.content,
            stats: data.content?.about?.stats?.length || 0,
            services: data.content?.services?.services?.length || 0
        });
        
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
    }
    
    function getCurrentData() {
        // Try multiple data sources
        if (window.dataManager && window.dataManager.getData) {
            const data = window.dataManager.getData();
            if (data) return data;
        }
        
        try {
            const localData = localStorage.getItem('worldtravel_data');
            if (localData) {
                return JSON.parse(localData);
            }
        } catch (e) {
            console.error('❌ Error parsing local data');
        }
        
        return null;
    }
    
    function calculateDataHash(data) {
        const importantData = {
            contacts: data.contacts,
            content: data.content,
            settings: data.settings
        };
        return JSON.stringify(importantData);
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
                    safeUpdateElements(selector, item.value);
                });
            }
        });
    }
    
    function syncContentSections(content) {
        if (!content) return;
        
        // Hero section
        if (content.hero) {
            safeUpdateElements('#home h1, .hero h1', content.hero.title);
            safeUpdateElements('#home p, .hero p', content.hero.description);
        }
        
        // About section
        if (content.about) {
            safeUpdateElements('#about .section-title', content.about.title);
            safeUpdateElements('.about-text p', content.about.description);
        }
        
        // Services section
        if (content.services) {
            safeUpdateElements('#services .section-title', content.services.title);
            safeUpdateElements('#services .section-subtitle', content.services.description);
        }
        
        // Destinations section
        if (content.destinations) {
            safeUpdateElements('#destinations .section-title', content.destinations.title);
            safeUpdateElements('.destinations .section-subtitle', content.destinations.subtitle);
        }
        
        // Contact section
        if (content.contact) {
            safeUpdateElements('#contact .section-title', content.contact.title);
            safeUpdateElements('#contact .section-subtitle', content.contact.description);
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
                
                if (valueElement) {
                    valueElement.textContent = stat.value;
                    valueElement.setAttribute('data-target', stat.value);
                }
                
                if (labelElement) {
                    labelElement.textContent = stat.label;
                }
                
                statElements[index].style.display = 'block';
                statElements[index].classList.add('animate-counter');
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
                
                if (titleElement) {
                    titleElement.textContent = service.title;
                }
                
                if (descElement) {
                    descElement.textContent = service.description;
                }
                
                if (iconElement && service.icon) {
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
            safeUpdateElements('.footer-description', data.footer.description);
            safeUpdateElementsHTML('.footer-copyright', data.footer.copyright);
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
                safeUpdateElements(`.nav-links a[href="${item.href}"]`, item.title);
                safeUpdateElements(`.footer-section:nth-child(2) a[href="${item.href}"]`, item.title);
            }
        });
    }
    
    function syncSettings(settings) {
        if (settings?.siteTitle && document.title !== settings.siteTitle) {
            document.title = settings.siteTitle;
        }
    }
    
    function safeUpdateElements(selector, value) {
        if (!value) return;
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el.textContent !== value) {
                    el.textContent = value;
                }
            });
        } catch (error) {
            console.error('❌ Error updating elements:', selector, error);
        }
    }
    
    function safeUpdateElementsHTML(selector, value) {
        if (!value) return;
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el.innerHTML !== value) {
                    el.innerHTML = value;
                }
            });
        } catch (error) {
            console.error('❌ Error updating HTML elements:', selector, error);
        }
    }
    
    // Start sync when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startEnhancedSync);
    } else {
        startEnhancedSync();
    }
    
    // Global function to force sync
    window.forceContentSync = safeSyncAllContent;
    
})();

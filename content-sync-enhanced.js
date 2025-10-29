// Enhanced Content Sync - поддерживает все типы контента
(function() {
    'use strict';
    
    console.log('🔄 Enhanced Content Sync loaded');
    
    let lastDataHash = '';
    let syncInterval;
    
    function enhancedSync() {
        try {
            const data = getCurrentData();
            if (!data) return;
            
            const newHash = calculateDataHash(data);
            if (newHash === lastDataHash) return;
            
            console.log('🔄 Applying enhanced content sync...');
            
            // Apply all content types
            applyContentSections(data.content);
            applyContacts(data.contacts);
            applyFooter(data.footer);
            applyStats(data.content?.about?.stats);
            applyServices(data.content?.services?.services);
            applySettings(data.settings);
            
            lastDataHash = newHash;
            console.log('✅ Enhanced sync completed');
            
        } catch (error) {
            console.error('❌ Enhanced sync error:', error);
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
                console.error('Error parsing local data:', e);
            }
        }
        
        return null;
    }
    
    function calculateDataHash(data) {
        return JSON.stringify({
            content: data.content,
            contacts: data.contacts,
            footer: data.footer,
            settings: data.settings
        });
    }
    
    function applyContentSections(content) {
        if (!content) return;
        
        // Hero section
        if (content.hero) {
            updateElements('#home h1, .hero h1', content.hero.title);
            updateElements('#home p, .hero p', content.hero.subtitle);
            
            // Update hero image if exists
            if (content.hero.image) {
                updateElementAttribute('.hero-image img', 'src', content.hero.image);
            }
        }
        
        // About section
        if (content.about) {
            updateElements('#about .section-title', content.about.title);
            updateElements('.about-text p', content.about.description);
            
            // Update about image if exists
            if (content.about.image) {
                updateElementAttribute('.about-image img', 'src', content.about.image);
            }
        }
        
        // Services section
        if (content.services) {
            updateElements('#services .section-title', content.services.title);
        }
        
        // Destinations section
        if (content.destinations) {
            updateElements('#destinations .section-title', content.destinations.title);
            updateElements('.destinations .section-subtitle', content.destinations.subtitle);
        }
        
        // Contact section
        if (content.contact) {
            updateElements('#contact .section-title', content.contact.title);
        }
    }
    
    function applyContacts(contacts) {
        if (!contacts) return;
        
        const contactMap = [
            { selectors: ['.contact-info .contact-item:nth-child(1) p', '.footer-section:nth-child(3) p:nth-child(1)'], value: contacts.phone },
            { selectors: ['.contact-info .contact-item:nth-child(2) p', '.footer-section:nth-child(3) p:nth-child(2)'], value: contacts.email },
            { selectors: ['.contact-info .contact-item:nth-child(3) p', '.footer-section:nth-child(3) p:nth-child(3)'], value: contacts.address },
            { selectors: ['.contact-info .contact-item:nth-child(4) p', '.footer-section:nth-child(3) p:nth-child(4)'], value: contacts.hours }
        ];
        
        contactMap.forEach(item => {
            if (item.value) {
                item.selectors.forEach(selector => {
                    updateElements(selector, item.value);
                });
            }
        });
    }
    
    function applyFooter(footer) {
        if (!footer) return;
        
        if (footer.description) {
            updateElements('.footer-section:first-child p', footer.description);
        }
        if (footer.copyright) {
            updateElementsHTML('.footer-bottom p', footer.copyright);
        }
    }
    
    function applyStats(stats) {
        if (!stats || !Array.isArray(stats)) return;
        
        const statElements = document.querySelectorAll('.stat');
        const validStats = stats.filter(stat => stat.value && stat.label);
        
        if (validStats.length === 0) {
            // Hide stats section if no valid stats
            const statsContainer = document.querySelector('.stats');
            if (statsContainer) {
                statsContainer.style.display = 'none';
            }
            return;
        }
        
        // Show stats section
        const statsContainer = document.querySelector('.stats');
        if (statsContainer) {
            statsContainer.style.display = 'flex';
        }
        
        // Update existing stat elements
        validStats.forEach((stat, index) => {
            if (statElements[index]) {
                const valueElement = statElements[index].querySelector('h3');
                const labelElement = statElements[index].querySelector('p');
                
                if (valueElement) {
                    valueElement.textContent = stat.value;
                    // Add counter animation attribute
                    if (!valueElement.hasAttribute('data-target')) {
                        valueElement.setAttribute('data-target', stat.value);
                    }
                }
                if (labelElement) {
                    labelElement.textContent = stat.label;
                }
                
                statElements[index].style.display = 'block';
            }
        });
        
        // Hide extra elements
        for (let i = validStats.length; i < statElements.length; i++) {
            statElements[i].style.display = 'none';
        }
    }
    
    function applyServices(services) {
        if (!services || !Array.isArray(services)) return;
        
        const serviceCards = document.querySelectorAll('.service-card');
        const validServices = services.filter(service => service.title && service.description);
        
        if (validServices.length === 0) {
            // Hide services section if no valid services
            const servicesGrid = document.querySelector('.services-grid');
            if (servicesGrid) {
                servicesGrid.style.display = 'none';
            }
            return;
        }
        
        // Show services section
        const servicesGrid = document.querySelector('.services-grid');
        if (servicesGrid) {
            servicesGrid.style.display = 'grid';
        }
        
        // Update existing service cards
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
            }
        });
        
        // Hide extra cards
        for (let i = validServices.length; i < serviceCards.length; i++) {
            serviceCards[i].style.display = 'none';
        }
    }
    
    function applySettings(settings) {
        if (!settings) return;
        
        if (settings.siteTitle) {
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
    
    function updateElementAttribute(selector, attribute, value) {
        if (!value) return;
        const element = document.querySelector(selector);
        if (element && element.getAttribute(attribute) !== value) {
            element.setAttribute(attribute, value);
        }
    }
    
    // Start enhanced sync
    function startEnhancedSync() {
        console.log('🚀 Starting enhanced content sync');
        
        // Initial sync
        enhancedSync();
        
        // Fast sync for first 30 seconds
        syncInterval = setInterval(enhancedSync, 500);
        
        // Event-based sync
        window.addEventListener('storage', enhancedSync);
        window.addEventListener('focus', enhancedSync);
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) enhancedSync();
        });
        
        // Sync when dataManager updates
        if (window.dataManager) {
            const originalSetData = window.dataManager.setData;
            window.dataManager.setData = function(data) {
                const result = originalSetData.call(this, data);
                setTimeout(enhancedSync, 100);
                return result;
            };
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startEnhancedSync);
    } else {
        startEnhancedSync();
    }
    
    // Make sync available globally
    window.enhancedSync = enhancedSync;
    
})();

// Powerful Content Sync with real-time updates
(function() {
    'use strict';
    
    console.log('🔄 Powerful Content Sync loaded');
    
    let lastDataHash = '';
    let syncInterval;
    
    function startPowerfulSync() {
        console.log('🚀 Starting powerful content sync...');
        
        // Immediate sync
        syncAllContent();
        
        // Aggressive sync for first minute
        syncInterval = setInterval(syncAllContent, 300);
        setTimeout(() => {
            clearInterval(syncInterval);
            // Continue with fast sync
            syncInterval = setInterval(syncAllContent, 1000);
        }, 60000);
        
        // Sync on all possible events
        window.addEventListener('storage', handleStorageEvent);
        window.addEventListener('focus', syncAllContent);
        window.addEventListener('load', syncAllContent);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('dataUpdated', handleDataUpdated);
        
        console.log('✅ Powerful content sync started');
    }
    
    function handleStorageEvent(e) {
        if (e.key === 'worldtravel_data') {
            console.log('📦 Storage event detected');
            setTimeout(syncAllContent, 50);
        }
    }
    
    function handleVisibilityChange() {
        if (!document.hidden) {
            console.log('👀 Page became visible');
            syncAllContent();
        }
    }
    
    function handleDataUpdated(e) {
        console.log('🔄 Data update event received');
        setTimeout(syncAllContent, 20);
    }
    
    function syncAllContent() {
        try {
            const data = getCurrentData();
            if (!data) {
                console.log('📭 No data available');
                return;
            }
            
            const dataHash = calculateDataHash(data);
            if (dataHash === lastDataHash) {
                return;
            }
            
            console.log('🔄 Syncing all content...');
            
            // Sync everything
            syncContacts(data.contacts);
            syncContent(data.content);
            syncStats(data.content);
            syncServices(data.content);
            syncFooter(data);
            syncNavigation(data.content);
            syncSettings(data.settings);
            syncImages(data.content);
            
            lastDataHash = dataHash;
            console.log('✅ All content synced successfully');
            
        } catch (error) {
            console.error('❌ Sync error:', error);
        }
    }
    
    function getCurrentData() {
        if (window.dataManager && window.dataManager.getData) {
            return window.dataManager.getData();
        }
        
        try {
            const localData = localStorage.getItem('worldtravel_data');
            return localData ? JSON.parse(localData) : null;
        } catch (e) {
            console.error('❌ Error parsing local data');
            return null;
        }
    }
    
    function calculateDataHash(data) {
        const importantData = {
            contacts: data.contacts,
            content: data.content,
            settings: data.settings,
            timestamp: data.lastUpdate
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
                    updateElementsText(selector, item.value);
                });
            }
        });
    }
    
    function syncContent(content) {
        if (!content) return;
        
        // Hero section
        if (content.hero) {
            updateElementsText('#home h1, .hero h1', content.hero.title);
            updateElementsText('#home p, .hero p', content.hero.description);
        }
        
        // About section
        if (content.about) {
            updateElementsText('#about .section-title', content.about.title);
            updateElementsText('.about-text p', content.about.description);
        }
        
        // Services section
        if (content.services) {
            updateElementsText('#services .section-title', content.services.title);
            updateElementsText('#services .section-subtitle', content.services.description);
        }
        
        // Destinations section
        if (content.destinations) {
            updateElementsText('#destinations .section-title', content.destinations.title);
            updateElementsText('.destinations .section-subtitle', content.destinations.subtitle);
        }
        
        // Contact section
        if (content.contact) {
            updateElementsText('#contact .section-title', content.contact.title);
            updateElementsText('#contact .section-subtitle', content.contact.description);
        }
    }
    
    function syncStats(content) {
        if (!content?.about?.stats) return;
        
        const stats = content.about.stats;
        console.log('📊 Syncing stats:', stats.length);
        
        // Get or create stats container
        let statsContainer = document.querySelector('.stats');
        if (!statsContainer) {
            const aboutText = document.querySelector('.about-text');
            if (aboutText) {
                statsContainer = document.createElement('div');
                statsContainer.className = 'stats';
                aboutText.appendChild(statsContainer);
            }
        }
        
        if (statsContainer) {
            // Clear existing stats
            statsContainer.innerHTML = '';
            
            // Create new stats
            stats.forEach(stat => {
                const statElement = document.createElement('div');
                statElement.className = 'stat animate-counter';
                statElement.setAttribute('data-target', stat.value);
                statElement.innerHTML = \`
                    <h3>\${stat.value}</h3>
                    <p>\${stat.label}</p>
                \`;
                statsContainer.appendChild(statElement);
            });
        }
    }
    
    function syncServices(content) {
        if (!content?.services?.services) return;
        
        const services = content.services.services;
        console.log('🎯 Syncing services:', services.length);
        
        // Get or create services grid
        let servicesGrid = document.querySelector('.services-grid');
        if (!servicesGrid) {
            const servicesSection = document.querySelector('#services .container');
            if (servicesSection) {
                servicesGrid = document.createElement('div');
                servicesGrid.className = 'services-grid';
                servicesSection.appendChild(servicesGrid);
            }
        }
        
        if (servicesGrid) {
            // Clear existing services
            servicesGrid.innerHTML = '';
            
            // Create new services
            services.forEach((service, index) => {
                const animationClass = index % 4 === 0 ? 'slide-in-left' : 
                                    index % 4 === 1 ? 'slide-in-bottom' : 
                                    index % 4 === 2 ? 'slide-in-right' : 'slide-in-top';
                
                const serviceCard = document.createElement('div');
                serviceCard.className = \`service-card \${animationClass}\`;
                serviceCard.innerHTML = \`
                    <div class="service-icon"><i class="\${service.icon || 'fas fa-star'}"></i></div>
                    <h3>\${service.title}</h3>
                    <p>\${service.description}</p>
                \`;
                servicesGrid.appendChild(serviceCard);
            });
        }
    }
    
    function syncFooter(data) {
        if (data.footer) {
            updateElementsText('.footer-description', data.footer.description);
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
                updateElementsText(\`.nav-links a[href="\${item.href}"]\`, item.title);
                updateElementsText(\`.footer-section:nth-child(2) a[href="\${item.href}"]\`, item.title);
            }
        });
    }
    
    function syncSettings(settings) {
        if (settings?.siteTitle && document.title !== settings.siteTitle) {
            document.title = settings.siteTitle;
        }
    }
    
    function syncImages(content) {
        // Sync hero background image
        if (content?.hero?.backgroundImage) {
            const heroImg = document.querySelector('.hero-img');
            if (heroImg) {
                heroImg.src = content.hero.backgroundImage;
            }
        }
        
        // Sync about image
        if (content?.about?.image) {
            const aboutImg = document.querySelector('.about-img');
            if (aboutImg) {
                aboutImg.src = content.about.image;
            }
        }
    }
    
    function updateElementsText(selector, value) {
        if (!value) return;
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el.textContent !== value) {
                    el.textContent = value;
                }
            });
        } catch (error) {
            console.error('❌ Error updating text:', selector, error);
        }
    }
    
    function updateElementsHTML(selector, value) {
        if (!value) return;
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el.innerHTML !== value) {
                    el.innerHTML = value;
                }
            });
        } catch (error) {
            console.error('❌ Error updating HTML:', selector, error);
        }
    }
    
    // Start sync when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startPowerfulSync);
    } else {
        startPowerfulSync();
    }
    
    // Global function to force sync
    window.forceContentSync = syncAllContent;
    window.powerfulSync = syncAllContent;
    
})();

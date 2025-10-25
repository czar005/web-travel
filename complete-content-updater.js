// Complete content updater - updates ALL content from editor
(function() {
    'use strict';
    
    console.log('�� Complete content updater loaded');
    
    function updateAllContent(data) {
        if (!data) return;
        
        // Update hero section
        if (data.content && data.content.hero) {
            updateHeroSection(data.content.hero);
        }
        
        // Update about section
        if (data.content && data.content.about) {
            updateAboutSection(data.content.about);
        }
        
        // Update services section
        if (data.content && data.content.services) {
            updateServicesSection(data.content.services);
        }
        
        // Update destinations section
        if (data.content && data.content.destinations) {
            updateDestinationsSection(data.content.destinations);
        }
        
        // Update contact section
        if (data.content && data.content.contact) {
            updateContactSection(data.content.contact);
        }
        
        // Update footer
        if (data.footer) {
            updateFooter(data.footer);
        }
        
        // Update contacts
        if (data.contacts) {
            updateContacts(data.contacts);
        }
        
        // Update navigation
        updateNavigation(data.content);
        
        console.log('✅ ALL content updated from editor');
    }
    
    function updateHeroSection(hero) {
        if (hero.title) {
            document.querySelectorAll('#home h1, .hero h1').forEach(el => {
                el.textContent = hero.title;
            });
        }
        if (hero.subtitle) {
            document.querySelectorAll('#home p, .hero p').forEach(el => {
                el.textContent = hero.subtitle;
            });
        }
        if (hero.image) {
            document.querySelectorAll('.hero-image img').forEach(el => {
                el.src = hero.image;
            });
        }
    }
    
    function updateAboutSection(about) {
        if (about.title) {
            document.querySelectorAll('#about .section-title, .about .section-title').forEach(el => {
                el.textContent = about.title;
            });
        }
        if (about.description) {
            document.querySelectorAll('.about-text p, #about p').forEach(el => {
                el.textContent = about.description;
            });
        }
        if (about.image) {
            document.querySelectorAll('.about-image img').forEach(el => {
                el.src = about.image;
            });
        }
        // Update stats
        if (about.stats && Array.isArray(about.stats)) {
            updateStats(about.stats);
        }
    }
    
    function updateStats(stats) {
        const statElements = document.querySelectorAll('.stat');
        stats.forEach((stat, index) => {
            if (statElements[index]) {
                const valueEl = statElements[index].querySelector('h3');
                const labelEl = statElements[index].querySelector('p');
                if (valueEl && stat.value) valueEl.textContent = stat.value;
                if (labelEl && stat.label) labelEl.textContent = stat.label;
            }
        });
    }
    
    function updateServicesSection(services) {
        if (services.title) {
            document.querySelectorAll('#services .section-title, .services .section-title').forEach(el => {
                el.textContent = services.title;
            });
        }
        // Update services list
        if (services.services && Array.isArray(services.services)) {
            updateServicesList(services.services);
        }
    }
    
    function updateServicesList(services) {
        const serviceCards = document.querySelectorAll('.service-card');
        services.forEach((service, index) => {
            if (serviceCards[index]) {
                const titleEl = serviceCards[index].querySelector('h3');
                const descEl = serviceCards[index].querySelector('p');
                const iconEl = serviceCards[index].querySelector('.service-icon i');
                
                if (titleEl && service.title) titleEl.textContent = service.title;
                if (descEl && service.description) descEl.textContent = service.description;
                if (iconEl && service.icon) iconEl.className = service.icon;
            }
        });
    }
    
    function updateDestinationsSection(destinations) {
        if (destinations.title) {
            document.querySelectorAll('#destinations .section-title, .destinations .section-title').forEach(el => {
                el.textContent = destinations.title;
            });
        }
        if (destinations.subtitle) {
            document.querySelectorAll('.destinations .section-subtitle').forEach(el => {
                el.textContent = destinations.subtitle;
            });
        }
    }
    
    function updateContactSection(contact) {
        if (contact.title) {
            document.querySelectorAll('#contact .section-title, .contact .section-title').forEach(el => {
                el.textContent = contact.title;
            });
        }
    }
    
    function updateFooter(footer) {
        if (footer.description) {
            document.querySelectorAll('.footer-section:first-child p').forEach(el => {
                el.textContent = footer.description;
            });
        }
        if (footer.copyright) {
            document.querySelectorAll('.footer-bottom p').forEach(el => {
                el.innerHTML = footer.copyright;
            });
        }
    }
    
    function updateContacts(contacts) {
        // Update contact info
        if (contacts.phone) {
            document.querySelectorAll('.contact-info .contact-item:nth-child(1) p, .footer-section:nth-child(3) p:nth-child(1)').forEach(el => {
                el.textContent = contacts.phone;
            });
        }
        if (contacts.email) {
            document.querySelectorAll('.contact-info .contact-item:nth-child(2) p, .footer-section:nth-child(3) p:nth-child(2)').forEach(el => {
                el.textContent = contacts.email;
            });
        }
        if (contacts.address) {
            document.querySelectorAll('.contact-info .contact-item:nth-child(3) p, .footer-section:nth-child(3) p:nth-child(3)').forEach(el => {
                el.textContent = contacts.address;
            });
        }
        if (contacts.hours) {
            document.querySelectorAll('.contact-info .contact-item:nth-child(4) p, .footer-section:nth-child(3) p:nth-child(4)').forEach(el => {
                el.textContent = contacts.hours;
            });
        }
    }
    
    function updateNavigation(content) {
        if (content.about && content.about.title) {
            document.querySelectorAll('.nav-links a[href="#about"]').forEach(el => {
                el.textContent = content.about.title;
            });
        }
        if (content.services && content.services.title) {
            document.querySelectorAll('.nav-links a[href="#services"]').forEach(el => {
                el.textContent = content.services.title;
            });
        }
        if (content.destinations && content.destinations.title) {
            document.querySelectorAll('.nav-links a[href="#destinations"]').forEach(el => {
                el.textContent = content.destinations.title;
            });
        }
        if (content.contact && content.contact.title) {
            document.querySelectorAll('.nav-links a[href="#contact"]').forEach(el => {
                el.textContent = content.contact.title;
            });
        }
    }
    
    // Initialize content updater
    function initializeContentUpdater() {
        // Listen for storage changes
        window.addEventListener('storage', function(e) {
            if (e.key === 'worldtravel_data') {
                try {
                    const newData = JSON.parse(e.newValue);
                    updateAllContent(newData);
                } catch (error) {
                    console.log('Storage update error:', error);
                }
            }
        });
        
        // Check for initial data
        try {
            const storedData = localStorage.getItem('worldtravel_data');
            if (storedData) {
                const data = JSON.parse(storedData);
                updateAllContent(data);
            }
        } catch (error) {
            console.log('Initial data load error:', error);
        }
        
        // Periodic check for updates
        setInterval(() => {
            try {
                const storedData = localStorage.getItem('worldtravel_data');
                if (storedData) {
                    const data = JSON.parse(storedData);
                    if (data && data.lastUpdate) {
                        if (!window.lastContentUpdate || data.lastUpdate > window.lastContentUpdate) {
                            window.lastContentUpdate = data.lastUpdate;
                            updateAllContent(data);
                        }
                    }
                }
            } catch (error) {
                // Silent error
            }
        }, 1000);
        
        console.log('✅ Complete content updater initialized');
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeContentUpdater);
    } else {
        initializeContentUpdater();
    }
    
    // Make function globally available
    window.updateAllContent = updateAllContent;
})();

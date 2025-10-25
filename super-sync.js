// Super sync - guarantees updates between editor and main page
(function() {
    'use strict';
    
    console.log('🚀 Super sync loaded');
    
    let lastSyncTime = 0;
    let syncInterval;
    
    function forceUpdate() {
        try {
            const rawData = localStorage.getItem('worldtravel_data');
            if (!rawData) return;
            
            const data = JSON.parse(rawData);
            const updateTime = data.lastUpdate ? new Date(data.lastUpdate).getTime() : 0;
            
            if (updateTime <= lastSyncTime) return;
            
            lastSyncTime = updateTime;
            
            console.log('🔄 Force updating from editor...');
            
            // Update everything immediately
            updateContacts(data.contacts);
            updateFooter(data.footer);
            updateNavigation(data.content);
            updateContent(data.content);
            updateDestinations();
            
        } catch (error) {
            console.log('Sync error:', error);
        }
    }
    
    function updateContacts(contacts) {
        if (!contacts) return;
        
        // Update contact section
        if (contacts.phone) {
            document.querySelectorAll('.contact-info .contact-item:nth-child(1) p').forEach(el => {
                el.textContent = contacts.phone;
            });
        }
        if (contacts.email) {
            document.querySelectorAll('.contact-info .contact-item:nth-child(2) p').forEach(el => {
                el.textContent = contacts.email;
            });
        }
        if (contacts.address) {
            document.querySelectorAll('.contact-info .contact-item:nth-child(3) p').forEach(el => {
                el.textContent = contacts.address;
            });
        }
        if (contacts.hours) {
            document.querySelectorAll('.contact-info .contact-item:nth-child(4) p').forEach(el => {
                el.textContent = contacts.hours;
            });
        }
        
        // Update footer contacts
        if (contacts.phone) {
            document.querySelectorAll('.footer-section:nth-child(3) p:nth-child(1)').forEach(el => {
                el.textContent = contacts.phone;
            });
        }
        if (contacts.email) {
            document.querySelectorAll('.footer-section:nth-child(3) p:nth-child(2)').forEach(el => {
                el.textContent = contacts.email;
            });
        }
        if (contacts.address) {
            document.querySelectorAll('.footer-section:nth-child(3) p:nth-child(3)').forEach(el => {
                el.textContent = contacts.address;
            });
        }
        if (contacts.hours) {
            document.querySelectorAll('.footer-section:nth-child(3) p:nth-child(4)').forEach(el => {
                el.textContent = contacts.hours;
            });
        }
    }
    
    function updateFooter(footer) {
        if (!footer) return;
        
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
    
    function updateNavigation(content) {
        if (!content) return;
        
        const sections = [
            { selector: 'about', data: content.about },
            { selector: 'services', data: content.services },
            { selector: 'destinations', data: content.destinations },
            { selector: 'contact', data: content.contact }
        ];
        
        sections.forEach(section => {
            if (section.data && section.data.title) {
                // Header nav
                document.querySelectorAll(`.nav-links a[href="#${section.selector}"]`).forEach(el => {
                    el.textContent = section.data.title;
                });
                // Footer nav
                document.querySelectorAll(`.footer-section:nth-child(2) a[href="#${section.selector}"]`).forEach(el => {
                    el.textContent = section.data.title;
                });
            }
        });
    }
    
    function updateContent(content) {
        if (!content) return;
        
        // Hero section
        if (content.hero) {
            if (content.hero.title) {
                document.querySelectorAll('#home h1, .hero h1').forEach(el => {
                    el.textContent = content.hero.title;
                });
            }
            if (content.hero.subtitle) {
                document.querySelectorAll('#home p, .hero p').forEach(el => {
                    el.textContent = content.hero.subtitle;
                });
            }
        }
        
        // About section
        if (content.about) {
            if (content.about.title) {
                document.querySelectorAll('#about .section-title').forEach(el => {
                    el.textContent = content.about.title;
                });
            }
            if (content.about.description) {
                document.querySelectorAll('.about-text p').forEach(el => {
                    el.textContent = content.about.description;
                });
            }
        }
        
        // Services section
        if (content.services) {
            if (content.services.title) {
                document.querySelectorAll('#services .section-title').forEach(el => {
                    el.textContent = content.services.title;
                });
            }
        }
        
        // Contact section
        if (content.contact) {
            if (content.contact.title) {
                document.querySelectorAll('#contact .section-title').forEach(el => {
                    el.textContent = content.contact.title;
                });
            }
        }
    }
    
    function updateDestinations() {
        if (window.loadDestinations && typeof window.loadDestinations === 'function') {
            setTimeout(window.loadDestinations, 100);
        }
    }
    
    // Initialize super sync
    function initSuperSync() {
        // Force initial update
        setTimeout(forceUpdate, 500);
        
        // Set up real-time sync
        syncInterval = setInterval(forceUpdate, 500);
        
        // Listen for storage events (from editor)
        window.addEventListener('storage', function(e) {
            if (e.key === 'worldtravel_data') {
                setTimeout(forceUpdate, 100);
            }
        });
        
        // Override dataManager if exists to trigger updates
        if (window.dataManager && window.dataManager.setData) {
            const originalSetData = window.dataManager.setData;
            window.dataManager.setData = function(data) {
                const result = originalSetData.call(this, data);
                setTimeout(forceUpdate, 100);
                return result;
            };
        }
        
        console.log('✅ Super sync initialized');
    }
    
    // Start when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSuperSync);
    } else {
        initSuperSync();
    }
})();

// Guaranteed sync - always works
(function() {
    'use strict';
    
    console.log('🎯 Guaranteed sync loaded');
    
    let lastDataHash = '';
    
    function syncEverything() {
        try {
            const rawData = localStorage.getItem('worldtravel_data');
            if (!rawData) {
                console.log('📭 No data in localStorage');
                return;
            }
            
            // Check if data actually changed
            const currentHash = rawData.length + '-' + rawData.substring(0, 50);
            if (currentHash === lastDataHash) {
                return; // No changes
            }
            
            lastDataHash = currentHash;
            console.log('🔄 Data changed, updating page...');
            
            const data = JSON.parse(rawData);
            
            // UPDATE CONTACTS
            if (data.contacts) {
                // Contact section
                updateSelector('.contact-info .contact-item:nth-child(1) p', data.contacts.phone);
                updateSelector('.contact-info .contact-item:nth-child(2) p', data.contacts.email);
                updateSelector('.contact-info .contact-item:nth-child(3) p', data.contacts.address);
                updateSelector('.contact-info .contact-item:nth-child(4) p', data.contacts.hours);
                
                // Footer contacts
                updateSelector('.footer-section:nth-child(3) p:nth-child(1)', data.contacts.phone);
                updateSelector('.footer-section:nth-child(3) p:nth-child(2)', data.contacts.email);
                updateSelector('.footer-section:nth-child(3) p:nth-child(3)', data.contacts.address);
                updateSelector('.footer-section:nth-child(3) p:nth-child(4)', data.contacts.hours);
            }
            
            // UPDATE FOOTER
            if (data.footer) {
                updateSelector('.footer-section:first-child p', data.footer.description);
                updateSelector('.footer-bottom p', data.footer.copyright, true);
            }
            
            // UPDATE NAVIGATION
            if (data.content) {
                updateNavigation(data.content);
            }
            
            // UPDATE CONTENT SECTIONS
            if (data.content) {
                // Hero
                updateSelector('#home h1, .hero h1', data.content.hero?.title);
                updateSelector('#home p, .hero p', data.content.hero?.subtitle);
                
                // About
                updateSelector('#about .section-title', data.content.about?.title);
                updateSelector('.about-text p', data.content.about?.description);
                
                // Services
                updateSelector('#services .section-title', data.content.services?.title);
                
                // Destinations
                updateSelector('#destinations .section-title', data.content.destinations?.title);
                updateSelector('.destinations .section-subtitle', data.content.destinations?.subtitle);
                
                // Contact
                updateSelector('#contact .section-title', data.content.contact?.title);
            }
            
            console.log('✅ Page fully synced!');
            
        } catch (error) {
            console.log('❌ Sync error:', error);
        }
    }
    
    function updateSelector(selector, value, isHTML = false) {
        if (!value) return;
        
        document.querySelectorAll(selector).forEach(el => {
            if (isHTML) {
                el.innerHTML = value;
            } else {
                el.textContent = value;
            }
        });
    }
    
    function updateNavigation(content) {
        const sections = [
            { href: '#about', title: content.about?.title },
            { href: '#services', title: content.services?.title },
            { href: '#destinations', title: content.destinations?.title },
            { href: '#contact', title: content.contact?.title }
        ];
        
        sections.forEach(section => {
            if (section.title) {
                // Header
                updateSelector(`.nav-links a[href="${section.href}"]`, section.title);
                // Footer
                updateSelector(`.footer-section:nth-child(2) a[href="${section.href}"]`, section.title);
            }
        });
    }
    
    // SYNC EVERY 500ms
    setInterval(syncEverything, 500);
    
    // Also sync on storage events
    window.addEventListener('storage', syncEverything);
    
    // Initial sync
    setTimeout(syncEverything, 1000);
    
})();

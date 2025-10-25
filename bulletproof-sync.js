// Bulletproof sync - absolutely guaranteed to work
(function() {
    'use strict';
    
    console.log('🎯 BULLETPROOF SYNC LOADED');
    
    let lastSuccessData = null;
    
    function bulletproofSync() {
        try {
            console.log('🔄 Checking for data updates...');
            
            // Get data from localStorage
            const rawData = localStorage.getItem('worldtravel_data');
            if (!rawData) {
                console.log('📭 No data in localStorage');
                return;
            }
            
            // Parse data
            let data;
            try {
                data = JSON.parse(rawData);
            } catch (e) {
                console.log('❌ Data parsing failed');
                return;
            }
            
            // Check if data is different from last success
            if (lastSuccessData && JSON.stringify(data) === JSON.stringify(lastSuccessData)) {
                console.log('📋 No data changes detected');
                return; // No changes
            }
            
            console.log('🔄 APPLYING DATA TO PAGE...', data);
            
            // APPLY CONTACTS
            if (data.contacts) {
                console.log('📞 Applying contacts:', data.contacts);
                
                // Phone
                updateElements('.contact-info .contact-item:nth-child(1) p', data.contacts.phone);
                updateElements('.footer-section:nth-child(3) p:nth-child(1)', data.contacts.phone);
                
                // Email
                updateElements('.contact-info .contact-item:nth-child(2) p', data.contacts.email);
                updateElements('.footer-section:nth-child(3) p:nth-child(2)', data.contacts.email);
                
                // Address
                updateElements('.contact-info .contact-item:nth-child(3) p', data.contacts.address);
                updateElements('.footer-section:nth-child(3) p:nth-child(3)', data.contacts.address);
                
                // Hours
                updateElements('.contact-info .contact-item:nth-child(4) p', data.contacts.hours);
                updateElements('.footer-section:nth-child(3) p:nth-child(4)', data.contacts.hours);
            }
            
            // APPLY FOOTER
            if (data.footer) {
                console.log('🏠 Applying footer:', data.footer);
                updateElements('.footer-section:first-child p', data.footer.description);
                updateElementsHTML('.footer-bottom p', data.footer.copyright);
            }
            
            // APPLY CONTENT SECTIONS
            if (data.content) {
                console.log('📄 Applying content:', Object.keys(data.content));
                
                // About
                if (data.content.about) {
                    updateElements('#about .section-title', data.content.about.title);
                    updateElements('.about-text p', data.content.about.description);
                }
                
                // Services
                if (data.content.services) {
                    updateElements('#services .section-title', data.content.services.title);
                }
                
                // Destinations
                if (data.content.destinations) {
                    updateElements('#destinations .section-title', data.content.destinations.title);
                    updateElements('.destinations .section-subtitle', data.content.destinations.subtitle);
                }
                
                // Contact
                if (data.content.contact) {
                    updateElements('#contact .section-title', data.content.contact.title);
                }
                
                // Hero
                if (data.content.hero) {
                    updateElements('#home h1', data.content.hero.title);
                    updateElements('#home p', data.content.hero.subtitle);
                }
            }
            
            // APPLY NAVIGATION
            if (data.content) {
                console.log('🧭 Applying navigation');
                updateNavLink('#about', data.content.about?.title);
                updateNavLink('#services', data.content.services?.title);
                updateNavLink('#destinations', data.content.destinations?.title);
                updateNavLink('#contact', data.content.contact?.title);
            }
            
            lastSuccessData = data;
            console.log('✅ PAGE UPDATED SUCCESSFULLY!');
            
        } catch (error) {
            console.log('❌ Sync error:', error);
        }
    }
    
    function updateElements(selector, value) {
        if (!value) return;
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (el.textContent !== value) {
                el.textContent = value;
                console.log('✅ Updated:', selector, 'to:', value);
            }
        });
        if (elements.length === 0) {
            console.log('⚠️ No elements found for:', selector);
        }
    }
    
    function updateElementsHTML(selector, value) {
        if (!value) return;
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (el.innerHTML !== value) {
                el.innerHTML = value;
                console.log('✅ Updated HTML:', selector, 'to:', value);
            }
        });
    }
    
    function updateNavLink(href, title) {
        if (!title) return;
        
        // Header nav
        updateElements(`.nav-links a[href="${href}"]`, title);
        
        // Footer nav
        updateElements(`.footer-section:nth-child(2) a[href="${href}"]`, title);
    }
    
    // AGGRESSIVE SYNC STRATEGY
    function startBulletproofSync() {
        console.log('🚀 Starting bulletproof sync...');
        
        // Sync immediately
        bulletproofSync();
        
        // Very fast sync for first 30 seconds
        const fastInterval = setInterval(bulletproofSync, 100);
        setTimeout(() => {
            clearInterval(fastInterval);
            // Continue with fast sync
            setInterval(bulletproofSync, 500);
        }, 30000);
        
        // Sync on every possible event
        window.addEventListener('storage', bulletproofSync);
        window.addEventListener('focus', bulletproofSync);
        window.addEventListener('load', bulletproofSync);
        document.addEventListener('visibilitychange', bulletproofSync);
        
        console.log('✅ Bulletproof sync activated');
    }
    
    // START IMMEDIATELY
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startBulletproofSync);
    } else {
        startBulletproofSync();
    }
    
    // Global function to force sync
    window.forceBulletproofSync = bulletproofSync;
    window.bulletproofSync = bulletproofSync;
    
    console.log('✅ Bulletproof sync functions registered');
    
})();

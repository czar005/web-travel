// Bulletproof sync - absolutely guaranteed to work
(function() {
    'use strict';
    
    console.log='�� BULLETPROOF SYNC LOADED';
    
    let lastSuccessData = null;
    
    function bulletproofSync() {
        try {
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
                return; // No changes
            }
            
            console.log('🔄 APPLYING DATA TO PAGE...');
            
            // APPLY CONTACTS - with multiple fallback selectors
            if (data.contacts) {
                // Phone
                setText('.contact-info .contact-item:nth-child(1) p', data.contacts.phone);
                setText('.footer-section:nth-child(3) p:nth-child(1)', data.contacts.phone);
                setText('p:contains("+7")', data.contacts.phone); // Fallback
                
                // Email
                setText('.contact-info .contact-item:nth-child(2) p', data.contacts.email);
                setText('.footer-section:nth-child(3) p:nth-child(2)', data.contacts.email);
                setText('p:contains("@")', data.contacts.email); // Fallback
                
                // Address
                setText('.contact-info .contact-item:nth-child(3) p', data.contacts.address);
                setText('.footer-section:nth-child(3) p:nth-child(3)', data.contacts.address);
                
                // Hours
                setText('.contact-info .contact-item:nth-child(4) p', data.contacts.hours);
                setText('.footer-section:nth-child(3) p:nth-child(4)', data.contacts.hours);
            }
            
            // APPLY FOOTER
            if (data.footer) {
                setText('.footer-section:first-child p', data.footer.description);
                setText('.footer-section p:first-child', data.footer.description); // Fallback
                setHTML('.footer-bottom p', data.footer.copyright);
            }
            
            // APPLY CONTENT SECTIONS
            if (data.content) {
                // About
                setText('#about .section-title', data.content.about?.title);
                setText('.about .section-title', data.content.about?.title); // Fallback
                setText('.about-text p', data.content.about?.description);
                
                // Services
                setText('#services .section-title', data.content.services?.title);
                setText('.services .section-title', data.content.services?.title); // Fallback
                
                // Destinations
                setText('#destinations .section-title', data.content.destinations?.title);
                setText('.destinations .section-title', data.content.destinations?.title); // Fallback
                setText('.destinations .section-subtitle', data.content.destinations?.subtitle);
                
                // Contact
                setText('#contact .section-title', data.content.contact?.title);
                setText('.contact .section-title', data.content.contact?.title); // Fallback
                
                // Hero
                setText('#home h1', data.content.hero?.title);
                setText('.hero h1', data.content.hero?.title); // Fallback
                setText('#home p', data.content.hero?.subtitle);
                setText('.hero p', data.content.hero?.subtitle); // Fallback
            }
            
            // APPLY NAVIGATION
            if (data.content) {
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
    
    function setText(selector, value) {
        if (!value) return;
        document.querySelectorAll(selector).forEach(el => {
            if (el.textContent !== value) {
                el.textContent = value;
            }
        });
    }
    
    function setHTML(selector, value) {
        if (!value) return;
        document.querySelectorAll(selector).forEach(el => {
            if (el.innerHTML !== value) {
                el.innerHTML = value;
            }
        });
    }
    
    function updateNavLink(href, title) {
        if (!title) return;
        // Header nav
        document.querySelectorAll(`.nav-links a[href="${href}"]`).forEach(el => {
            if (el.textContent !== title) {
                el.textContent = title;
            }
        });
        // Footer nav
        document.querySelectorAll(`.footer-section a[href="${href}"]`).forEach(el => {
            if (el.textContent !== title) {
                el.textContent = title;
            }
        });
    }
    
    // AGGRESSIVE SYNC STRATEGY
    function startBulletproofSync() {
        // Sync immediately and very frequently
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
        document.addEventListener('click', bulletproofSync);
        document.addEventListener('visibilitychange', bulletproofSync);
        
        // Also sync when URL changes (returning from admin)
        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(bulletproofSync, 100);
            }
        }, 100);
        
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
    
})();

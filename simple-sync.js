// Simple and reliable sync
(function() {
    'use strict';
    
    console.log('🎯 Simple sync loaded');
    
    function checkForUpdates() {
        try {
            const raw = localStorage.getItem('worldtravel_data');
            if (!raw) {
                console.log('No data in localStorage');
                return;
            }
            
            const data = JSON.parse(raw);
            console.log('📥 Data found, updating page...');
            
            // Update contacts
            if (data.contacts) {
                if (data.contacts.phone) {
                    document.querySelectorAll('.contact-info .contact-item:nth-child(1) p, .footer-section:nth-child(3) p:nth-child(1)').forEach(el => {
                        el.textContent = data.contacts.phone;
                    });
                }
                if (data.contacts.email) {
                    document.querySelectorAll('.contact-info .contact-item:nth-child(2) p, .footer-section:nth-child(3) p:nth-child(2)').forEach(el => {
                        el.textContent = data.contacts.email;
                    });
                }
                if (data.contacts.address) {
                    document.querySelectorAll('.contact-info .contact-item:nth-child(3) p, .footer-section:nth-child(3) p:nth-child(3)').forEach(el => {
                        el.textContent = data.contacts.address;
                    });
                }
                if (data.contacts.hours) {
                    document.querySelectorAll('.contact-info .contact-item:nth-child(4) p, .footer-section:nth-child(3) p:nth-child(4)').forEach(el => {
                        el.textContent = data.contacts.hours;
                    });
                }
            }
            
            // Update footer
            if (data.footer) {
                if (data.footer.description) {
                    document.querySelectorAll('.footer-section:first-child p').forEach(el => {
                        el.textContent = data.footer.description;
                    });
                }
                if (data.footer.copyright) {
                    document.querySelectorAll('.footer-bottom p').forEach(el => {
                        el.innerHTML = data.footer.copyright;
                    });
                }
            }
            
            // Update navigation
            if (data.content) {
                // About
                if (data.content.about && data.content.about.title) {
                    document.querySelectorAll('.nav-links a[href="#about"], .footer-section:nth-child(2) a[href="#about"]').forEach(el => {
                        el.textContent = data.content.about.title;
                    });
                }
                // Services
                if (data.content.services && data.content.services.title) {
                    document.querySelectorAll('.nav-links a[href="#services"], .footer-section:nth-child(2) a[href="#services"]').forEach(el => {
                        el.textContent = data.content.services.title;
                    });
                }
                // Destinations
                if (data.content.destinations && data.content.destinations.title) {
                    document.querySelectorAll('.nav-links a[href="#destinations"], .footer-section:nth-child(2) a[href="#destinations"]').forEach(el => {
                        el.textContent = data.content.destinations.title;
                    });
                }
                // Contact
                if (data.content.contact && data.content.contact.title) {
                    document.querySelectorAll('.nav-links a[href="#contact"], .footer-section:nth-child(2) a[href="#contact"]').forEach(el => {
                        el.textContent = data.content.contact.title;
                    });
                    document.querySelectorAll('#contact .section-title').forEach(el => {
                        el.textContent = data.content.contact.title;
                    });
                }
            }
            
            console.log('✅ Page updated successfully');
            
        } catch (error) {
            console.log('❌ Update error:', error);
        }
    }
    
    // Check every second
    setInterval(checkForUpdates, 1000);
    
    // Also check on storage events
    window.addEventListener('storage', checkForUpdates);
    
    // Initial check
    setTimeout(checkForUpdates, 2000);
    
})();

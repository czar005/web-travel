// Complete fix for contacts and footer
(function() {
    'use strict';
    
    console.log('🔧 Contacts and footer fix loaded');
    
    function updateAllFromStorage() {
        try {
            const data = localStorage.getItem('worldtravel_data');
            if (data) {
                const parsed = JSON.parse(data);
                
                // Update contacts
                if (parsed.contacts) {
                    updateContacts(parsed.contacts);
                }
                
                // Update footer
                if (parsed.footer) {
                    updateFooter(parsed.footer);
                }
                
                // Update navigation titles in footer
                if (parsed.content) {
                    updateFooterNavigation(parsed.content);
                }
            }
        } catch (error) {
            console.log('Update error:', error);
        }
    }
    
    function updateContacts(contacts) {
        // Update contact info in contact section
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
        
        // Update contact info in footer
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
        
        console.log('✅ Contacts updated');
    }
    
    function updateFooter(footer) {
        // Update footer description
        if (footer.description) {
            document.querySelectorAll('.footer-section:first-child p').forEach(el => {
                el.textContent = footer.description;
            });
        }
        
        // Update copyright
        if (footer.copyright) {
            document.querySelectorAll('.footer-bottom p').forEach(el => {
                el.innerHTML = footer.copyright;
            });
        }
        
        console.log('✅ Footer updated');
    }
    
    function updateFooterNavigation(content) {
        // Update navigation titles in footer
        if (content.about && content.about.title) {
            document.querySelectorAll('.footer-section:nth-child(2) a[href="#about"]').forEach(el => {
                el.textContent = content.about.title;
            });
        }
        if (content.services && content.services.title) {
            document.querySelectorAll('.footer-section:nth-child(2) a[href="#services"]').forEach(el => {
                el.textContent = content.services.title;
            });
        }
        if (content.destinations && content.destinations.title) {
            document.querySelectorAll('.footer-section:nth-child(2) a[href="#destinations"]').forEach(el => {
                el.textContent = content.destinations.title;
            });
        }
        if (content.contact && content.contact.title) {
            document.querySelectorAll('.footer-section:nth-child(2) a[href="#contact"]').forEach(el => {
                el.textContent = content.contact.title;
            });
        }
        
        console.log('✅ Footer navigation updated');
    }
    
    // Listen for changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'worldtravel_data') {
            setTimeout(updateAllFromStorage, 100);
        }
    });
    
    // Initial update
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(updateAllFromStorage, 500);
    });
    
    // Periodic updates
    setInterval(updateAllFromStorage, 1000);
})();

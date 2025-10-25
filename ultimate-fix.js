// Ultimate fix for contacts, footer and navigation
(function() {
    'use strict';
    
    console.log('🔧 Ultimate fix loaded');
    
    let lastUpdateTime = 0;
    
    function updateEverything() {
        try {
            const data = localStorage.getItem('worldtravel_data');
            if (!data) return;
            
            const parsed = JSON.parse(data);
            const currentTime = parsed.lastUpdate ? new Date(parsed.lastUpdate).getTime() : 0;
            
            if (currentTime <= lastUpdateTime) return;
            
            lastUpdateTime = currentTime;
            
            // Update contacts
            if (parsed.contacts) updateContacts(parsed.contacts);
            
            // Update footer
            if (parsed.footer) updateFooter(parsed.footer);
            
            // Update navigation in header and footer
            if (parsed.content) updateAllNavigation(parsed.content);
            
            console.log('✅ Everything updated');
            
        } catch (error) {
            console.log('Update error:', error);
        }
    }
    
    function updateContacts(contacts) {
        const contactSelectors = [
            { selector: '.contact-info .contact-item:nth-child(1) p', value: contacts.phone },
            { selector: '.contact-info .contact-item:nth-child(2) p', value: contacts.email },
            { selector: '.contact-info .contact-item:nth-child(3) p', value: contacts.address },
            { selector: '.contact-info .contact-item:nth-child(4) p', value: contacts.hours },
            { selector: '.footer-section:nth-child(3) p:nth-child(1)', value: contacts.phone },
            { selector: '.footer-section:nth-child(3) p:nth-child(2)', value: contacts.email },
            { selector: '.footer-section:nth-child(3) p:nth-child(3)', value: contacts.address },
            { selector: '.footer-section:nth-child(3) p:nth-child(4)', value: contacts.hours }
        ];
        
        contactSelectors.forEach(item => {
            if (item.value) {
                document.querySelectorAll(item.selector).forEach(el => {
                    el.textContent = item.value;
                });
            }
        });
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
    
    function updateAllNavigation(content) {
        const navItems = [
            { href: '#about', content: content.about },
            { href: '#services', content: content.services },
            { href: '#destinations', content: content.destinations },
            { href: '#contact', content: content.contact }
        ];
        
        navItems.forEach(item => {
            if (item.content && item.content.title) {
                // Update header navigation
                document.querySelectorAll(`.nav-links a[href="${item.href}"]`).forEach(el => {
                    el.textContent = item.content.title;
                });
                // Update footer navigation
                document.querySelectorAll(`.footer-section:nth-child(2) a[href="${item.href}"]`).forEach(el => {
                    el.textContent = item.content.title;
                });
            }
        });
    }
    
    // Listen for storage changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'worldtravel_data') {
            setTimeout(updateEverything, 100);
        }
    });
    
    // Initial update
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(updateEverything, 1000);
        setInterval(updateEverything, 2000);
    });
})();

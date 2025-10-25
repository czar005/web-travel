// Simple working sync - compatible with all browsers
console.log('✅ SIMPLE SYNC LOADED');

setInterval(function() {
    var data = localStorage.getItem('worldtravel_data');
    if (data) {
        try {
            var parsed = JSON.parse(data);
            
            // Update contacts
            if (parsed.contacts) {
                // Phone
                var phoneElements = document.querySelectorAll('.contact-info .contact-item:nth-child(1) p, .footer-section:nth-child(3) p:nth-child(1)');
                for (var i = 0; i < phoneElements.length; i++) {
                    if (parsed.contacts.phone) phoneElements[i].textContent = parsed.contacts.phone;
                }
                
                // Email
                var emailElements = document.querySelectorAll('.contact-info .contact-item:nth-child(2) p, .footer-section:nth-child(3) p:nth-child(2)');
                for (var i = 0; i < emailElements.length; i++) {
                    if (parsed.contacts.email) emailElements[i].textContent = parsed.contacts.email;
                }
                
                // Address
                var addressElements = document.querySelectorAll('.contact-info .contact-item:nth-child(3) p, .footer-section:nth-child(3) p:nth-child(3)');
                for (var i = 0; i < addressElements.length; i++) {
                    if (parsed.contacts.address) addressElements[i].textContent = parsed.contacts.address;
                }
                
                // Hours
                var hoursElements = document.querySelectorAll('.contact-info .contact-item:nth-child(4) p, .footer-section:nth-child(3) p:nth-child(4)');
                for (var i = 0; i < hoursElements.length; i++) {
                    if (parsed.contacts.hours) hoursElements[i].textContent = parsed.contacts.hours;
                }
            }
            
            // Update footer
            if (parsed.footer) {
                var footerDesc = document.querySelectorAll('.footer-section:first-child p');
                for (var i = 0; i < footerDesc.length; i++) {
                    if (parsed.footer.description) footerDesc[i].textContent = parsed.footer.description;
                }
                
                var copyright = document.querySelectorAll('.footer-bottom p');
                for (var i = 0; i < copyright.length; i++) {
                    if (parsed.footer.copyright) copyright[i].innerHTML = parsed.footer.copyright;
                }
            }
            
            // Update navigation
            if (parsed.content) {
                // About
                var aboutNav = document.querySelectorAll('.nav-links a[href="#about"], .footer-section:nth-child(2) a[href="#about"]');
                for (var i = 0; i < aboutNav.length; i++) {
                    if (parsed.content.about && parsed.content.about.title) aboutNav[i].textContent = parsed.content.about.title;
                }
                
                // Services
                var servicesNav = document.querySelectorAll('.nav-links a[href="#services"], .footer-section:nth-child(2) a[href="#services"]');
                for (var i = 0; i < servicesNav.length; i++) {
                    if (parsed.content.services && parsed.content.services.title) servicesNav[i].textContent = parsed.content.services.title;
                }
                
                // Destinations
                var destinationsNav = document.querySelectorAll('.nav-links a[href="#destinations"], .footer-section:nth-child(2) a[href="#destinations"]');
                for (var i = 0; i < destinationsNav.length; i++) {
                    if (parsed.content.destinations && parsed.content.destinations.title) destinationsNav[i].textContent = parsed.content.destinations.title;
                }
                
                // Contact
                var contactNav = document.querySelectorAll('.nav-links a[href="#contact"], .footer-section:nth-child(2) a[href="#contact"]');
                for (var i = 0; i < contactNav.length; i++) {
                    if (parsed.content.contact && parsed.content.contact.title) contactNav[i].textContent = parsed.content.contact.title;
                }
            }
            
            // Update content sections
            if (parsed.content) {
                // About title
                var aboutTitle = document.querySelectorAll('#about .section-title');
                for (var i = 0; i < aboutTitle.length; i++) {
                    if (parsed.content.about && parsed.content.about.title) aboutTitle[i].textContent = parsed.content.about.title;
                }
                
                // Services title
                var servicesTitle = document.querySelectorAll('#services .section-title');
                for (var i = 0; i < servicesTitle.length; i++) {
                    if (parsed.content.services && parsed.content.services.title) servicesTitle[i].textContent = parsed.content.services.title;
                }
                
                // Destinations title
                var destinationsTitle = document.querySelectorAll('#destinations .section-title');
                for (var i = 0; i < destinationsTitle.length; i++) {
                    if (parsed.content.destinations && parsed.content.destinations.title) destinationsTitle[i].textContent = parsed.content.destinations.title;
                }
                
                // Contact title
                var contactTitle = document.querySelectorAll('#contact .section-title');
                for (var i = 0; i < contactTitle.length; i++) {
                    if (parsed.content.contact && parsed.content.contact.title) contactTitle[i].textContent = parsed.content.contact.title;
                }
            }
            
        } catch(e) {
            console.log('Sync error:', e);
        }
    }
}, 1000);

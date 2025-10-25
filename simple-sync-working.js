// Simple working sync - just works
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
                phoneElements.forEach(function(el) {
                    if (parsed.contacts.phone) el.textContent = parsed.contacts.phone;
                });
                
                // Email
                var emailElements = document.querySelectorAll('.contact-info .contact-item:nth-child(2) p, .footer-section:nth-child(3) p:nth-child(2)');
                emailElements.forEach(function(el) {
                    if (parsed.contacts.email) el.textContent = parsed.contacts.email;
                });
                
                // Address
                var addressElements = document.querySelectorAll('.contact-info .contact-item:nth-child(3) p, .footer-section:nth-child(3) p:nth-child(3)');
                addressElements.forEach(function(el) {
                    if (parsed.contacts.address) el.textContent = parsed.contacts.address;
                });
                
                // Hours
                var hoursElements = document.querySelectorAll('.contact-info .contact-item:nth-child(4) p, .footer-section:nth-child(3) p:nth-child(4)');
                hoursElements.forEach(function(el) {
                    if (parsed.contacts.hours) el.textContent = parsed.contacts.hours;
                });
            }
            
            // Update footer
            if (parsed.footer) {
                var footerDesc = document.querySelectorAll('.footer-section:first-child p');
                footerDesc.forEach(function(el) {
                    if (parsed.footer.description) el.textContent = parsed.footer.description;
                });
                
                var copyright = document.querySelectorAll('.footer-bottom p');
                copyright.forEach(function(el) {
                    if (parsed.footer.copyright) el.innerHTML = parsed.footer.copyright;
                });
            }
            
            // Update navigation
            if (parsed.content) {
                // About
                var aboutNav = document.querySelectorAll('.nav-links a[href="#about"], .footer-section:nth-child(2) a[href="#about"]');
                aboutNav.forEach(function(el) {
                    if (parsed.content.about && parsed.content.about.title) el.textContent = parsed.content.about.title;
                });
                
                // Services
                var servicesNav = document.querySelectorAll('.nav-links a[href="#services"], .footer-section:nth-child(2) a[href="#services"]');
                servicesNav.forEach(function(el) {
                    if (parsed.content.services && parsed.content.services.title) el.textContent = parsed.content.services.title;
                });
                
                // Destinations
                var destinationsNav = document.querySelectorAll('.nav-links a[href="#destinations"], .footer-section:nth-child(2) a[href="#destinations"]');
                destinationsNav.forEach(function(el) {
                    if (parsed.content.destinations && parsed.content.destinations.title) el.textContent = parsed.content.destinations.title;
                });
                
                // Contact
                var contactNav = document.querySelectorAll('.nav-links a[href="#contact"], .footer-section:nth-child(2) a[href="#contact"]');
                contactNav.forEach(function(el) {
                    if (parsed.content.contact && parsed.content.contact.title) el.textContent = parsed.content.contact.title;
                });
            }
            
            // Update content sections
            if (parsed.content) {
                // About title
                var aboutTitle = document.querySelectorAll('#about .section-title');
                aboutTitle.forEach(function(el) {
                    if (parsed.content.about && parsed.content.about.title) el.textContent = parsed.content.about.title;
                });
                
                // Services title
                var servicesTitle = document.querySelectorAll('#services .section-title');
                servicesTitle.forEach(function(el) {
                    if (parsed.content.services && parsed.content.services.title) el.textContent = parsed.content.services.title;
                });
                
                // Destinations title
                var destinationsTitle = document.querySelectorAll('#destinations .section-title');
                destinationsTitle.forEach(function(el) {
                    if (parsed.content.destinations && parsed.content.destinations.title) el.textContent = parsed.content.destinations.title;
                });
                
                // Contact title
                var contactTitle = document.querySelectorAll('#contact .section-title');
                contactTitle.forEach(function(el) {
                    if (parsed.content.contact && parsed.content.contact.title) el.textContent = parsed.content.contact.title;
                });
            }
            
        } catch(e) {
            console.log('Sync error:', e);
        }
    }
}, 1000);

// Fix for exact-content-updater.js errors
(function() {
    // Override the problematic function
    const originalUpdateExactNavigation = window.updateExactNavigation;
    
    window.updateExactNavigation = function(content) {
        if (!content) {
            console.warn('No content provided for navigation update');
            return;
        }
        
        // Safe navigation updates
        try {
            if (content.about && content.about.title) {
                const aboutLinks = document.querySelectorAll('.nav-links a[href="#about"]');
                aboutLinks.forEach(link => link.textContent = content.about.title);
            }
            if (content.services && content.services.title) {
                const servicesLinks = document.querySelectorAll('.nav-links a[href="#services"]');
                servicesLinks.forEach(link => link.textContent = content.services.title);
            }
            if (content.destinations && content.destinations.title) {
                const destinationsLinks = document.querySelectorAll('.nav-links a[href="#destinations"]');
                destinationsLinks.forEach(link => link.textContent = content.destinations.title);
            }
            if (content.contact && content.contact.title) {
                const contactLinks = document.querySelectorAll('.nav-links a[href="#contact"]');
                contactLinks.forEach(link => link.textContent = content.contact.title);
            }
        } catch (error) {
            console.warn('Error updating navigation:', error);
        }
    };
})();

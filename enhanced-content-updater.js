// Enhanced Content Updater with navigation and footer support
function EnhancedContentUpdater() {
    this.appliedChanges = new Set();
    this.init();
}

EnhancedContentUpdater.prototype.init = function() {
    console.log('🚀 Enhanced Content Updater initialized');
    this.applyAllChanges();
    
    // Listen for data updates
    window.addEventListener('dataUpdated', () => {
        setTimeout(() => this.applyAllChanges(), 100);
    });
    
    // Periodic check for changes
    setInterval(() => this.applyAllChanges(), 2000);
};

EnhancedContentUpdater.prototype.applyAllChanges = function() {
    const data = this.getData();
    if (!data) return;
    
    const changeHash = JSON.stringify(data);
    if (this.appliedChanges.has(changeHash)) return;
    
    console.log('🔄 Applying content changes...');
    
    this.updateContent(data.content);
    this.updateNavigation(data.content);
    this.updateFooter(data.content);
    this.updateContacts(data.contacts);
    
    this.appliedChanges.add(changeHash);
    console.log('✅ Changes applied');
};

EnhancedContentUpdater.prototype.getData = function() {
    if (window.dataManager) {
        return window.dataManager.getData();
    }
    
    try {
        const localData = localStorage.getItem('worldtravel_data');
        return localData ? JSON.parse(localData) : null;
    } catch (e) {
        console.error('Error loading data:', e);
        return null;
    }
};

EnhancedContentUpdater.prototype.updateContent = function(content) {
    if (!content) return;
    
    // Hero section
    if (content.hero) {
        this.updateText('#home h1', content.hero.title);
        this.updateText('#home p', content.hero.subtitle);
        this.updateImage('.hero-image img', content.hero.image);
    }
    
    // About section
    if (content.about) {
        this.updateText('#about .section-title', content.about.title);
        this.updateText('.about-text p', content.about.description);
        this.updateImage('.about-image img', content.about.image);
        this.updateStats(content.about.stats);
    }
    
    // Services section
    if (content.services) {
        this.updateText('#services .section-title', content.services.title);
        this.updateServices(content.services.services);
    }
    
    // Destinations section
    if (content.destinations) {
        this.updateText('#destinations .section-title', content.destinations.title);
        this.updateText('.destinations .section-subtitle', content.destinations.subtitle);
    }
    
    // Contact section
    if (content.contact) {
        this.updateText('#contact .section-title', content.contact.title);
    }
    
    // Footer
    if (content.footer) {
        this.updateText('.footer-section:first-child p', content.footer.description);
        this.updateHTML('.footer-bottom p', content.footer.copyright);
    }
};

EnhancedContentUpdater.prototype.updateNavigation = function(content) {
    if (!content) return;
    
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const sectionId = href.substring(1);
            if (content[sectionId] && content[sectionId].title) {
                link.textContent = content[sectionId].title;
            }
        }
    });
};

EnhancedContentUpdater.prototype.updateFooter = function(content) {
    if (!content) return;
    
    // Update footer links
    const footerLinks = document.querySelectorAll('.footer-section:nth-child(2) a');
    footerLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const sectionId = href.substring(1);
            if (content[sectionId] && content[sectionId].title) {
                link.textContent = content[sectionId].title;
            }
        }
    });
};

EnhancedContentUpdater.prototype.updateContacts = function(contacts) {
    if (!contacts) return;
    
    // Update contact section
    if (contacts.phone) {
        this.updateText('.contact-info .contact-item:nth-child(1) p', contacts.phone);
        this.updateText('.footer-section:nth-child(3) p:nth-child(1)', contacts.phone);
    }
    if (contacts.email) {
        this.updateText('.contact-info .contact-item:nth-child(2) p', contacts.email);
        this.updateText('.footer-section:nth-child(3) p:nth-child(2)', contacts.email);
    }
    if (contacts.address) {
        this.updateText('.contact-info .contact-item:nth-child(3) p', contacts.address);
        this.updateText('.footer-section:nth-child(3) p:nth-child(3)', contacts.address);
    }
    if (contacts.hours) {
        this.updateText('.contact-info .contact-item:nth-child(4) p', contacts.hours);
        this.updateText('.footer-section:nth-child(3) p:nth-child(4)', contacts.hours);
    }
};

EnhancedContentUpdater.prototype.updateStats = function(stats) {
    if (!stats) return;
    
    const statElements = document.querySelectorAll('.stat');
    stats.forEach((stat, index) => {
        if (statElements[index]) {
            const valueEl = statElements[index].querySelector('h3');
            const labelEl = statElements[index].querySelector('p');
            
            if (valueEl) valueEl.textContent = stat.value;
            if (labelEl) labelEl.textContent = stat.label;
        }
    });
};

EnhancedContentUpdater.prototype.updateServices = function(services) {
    if (!services) return;
    
    const serviceCards = document.querySelectorAll('.service-card');
    services.forEach((service, index) => {
        if (serviceCards[index]) {
            const titleEl = serviceCards[index].querySelector('h3');
            const descEl = serviceCards[index].querySelector('p');
            const iconEl = serviceCards[index].querySelector('.service-icon i');
            
            if (titleEl) titleEl.textContent = service.title;
            if (descEl) descEl.textContent = service.description;
            if (iconEl && service.icon) {
                iconEl.className = service.icon;
            }
        }
    });
};

EnhancedContentUpdater.prototype.updateText = function(selector, text) {
    if (!text) return;
    const element = document.querySelector(selector);
    if (element) element.textContent = text;
};

EnhancedContentUpdater.prototype.updateHTML = function(selector, html) {
    if (!html) return;
    const element = document.querySelector(selector);
    if (element) element.innerHTML = html;
};

EnhancedContentUpdater.prototype.updateImage = function(selector, src) {
    if (!src) return;
    const element = document.querySelector(selector);
    if (element) element.src = src;
};

// Initialize
new EnhancedContentUpdater();

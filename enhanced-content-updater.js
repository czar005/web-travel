// Simple and reliable content updater
function SimpleContentUpdater() {
    this.init();
}

SimpleContentUpdater.prototype.init = function() {
    console.log('🚀 Simple Content Updater started');
    
    // Apply changes immediately
    this.applyChanges();
    
    // Listen for data updates
    window.addEventListener('dataUpdated', () => {
        console.log('📢 Data update received');
        setTimeout(() => this.applyChanges(), 100);
    });
    
    // Periodic check
    setInterval(() => this.applyChanges(), 2000);
};

SimpleContentUpdater.prototype.applyChanges = function() {
    if (!window.dataManager) {
        console.log('⏳ Waiting for DataManager...');
        return;
    }
    
    const data = window.dataManager.getData();
    if (!data) {
        console.log('📭 No data available');
        return;
    }
    
    console.log('�� Applying content changes...');
    
    // Apply content
    if (data.content) {
        this.updateContent(data.content);
    }
    
    // Apply contacts
    if (data.contacts) {
        this.updateContacts(data.contacts);
    }
    
    // Apply settings
    if (data.settings && data.settings.siteTitle) {
        document.title = data.settings.siteTitle;
    }
};

SimpleContentUpdater.prototype.updateContent = function(content) {
    // Hero
    if (content.hero) {
        this.updateElement('#home h1', content.hero.title);
        this.updateElement('#home p', content.hero.subtitle);
    }
    
    // About
    if (content.about) {
        this.updateElement('#about .section-title', content.about.title);
        this.updateElement('.about-text p', content.about.description);
    }
    
    // Services
    if (content.services) {
        this.updateElement('#services .section-title', content.services.title);
    }
    
    // Destinations
    if (content.destinations) {
        this.updateElement('#destinations .section-title', content.destinations.title);
        this.updateElement('.destinations .section-subtitle', content.destinations.subtitle);
    }
    
    // Contact
    if (content.contact) {
        this.updateElement('#contact .section-title', content.contact.title);
    }
    
    // Footer
    if (content.footer) {
        this.updateElement('.footer-section:first-child p', content.footer.description);
        this.updateElement('.footer-bottom p', content.footer.copyright, true);
    }
};

SimpleContentUpdater.prototype.updateContacts = function(contacts) {
    // Update contact section
    if (contacts.phone) {
        this.updateContactField('Телефон', contacts.phone);
    }
    if (contacts.email) {
        this.updateContactField('Email', contacts.email);
    }
    if (contacts.address) {
        this.updateContactField('Адрес', contacts.address);
    }
    if (contacts.hours) {
        this.updateContactField('Часы', contacts.hours);
    }
};

SimpleContentUpdater.prototype.updateElement = function(selector, content, isHTML) {
    const element = document.querySelector(selector);
    if (element) {
        if (isHTML) {
            element.innerHTML = content;
        } else {
            element.textContent = content;
        }
    }
};

SimpleContentUpdater.prototype.updateContactField = function(fieldName, value) {
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        const strong = item.querySelector('strong');
        if (strong && strong.textContent.includes(fieldName)) {
            const p = item.querySelector('p');
            if (p) {
                p.textContent = value;
            }
        }
    });
};

// Initialize
new SimpleContentUpdater();

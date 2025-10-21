// Enhanced content updater with better footer support
function EnhancedContentUpdater() {
    this.init();
}

EnhancedContentUpdater.prototype.init = function() {
    console.log('🚀 Enhanced Content Updater initialized');
    
    // Wait for data and apply updates
    const checkData = () => {
        if (window.dataManager) {
            this.applyAllUpdates();
        } else {
            setTimeout(checkData, 100);
        }
    };
    
    checkData();
    
    // Listen for data updates
    window.addEventListener('dataUpdated', () => {
        setTimeout(() => this.applyAllUpdates(), 50);
    });
};

EnhancedContentUpdater.prototype.applyAllUpdates = function() {
    if (!window.dataManager) return;
    
    const data = window.dataManager.getData();
    if (!data) return;
    
    console.log('🔄 Applying all content updates...');
    
    // Update footer specifically
    this.updateFooter(data);
    
    // Update other content
    this.updateContent(data.content);
    this.updateContacts(data.contacts);
};

EnhancedContentUpdater.prototype.updateFooter = function(data) {
    if (!data.footer) return;
    
    // Update footer description
    if (data.footer.description) {
        const footerDesc = document.querySelector('.footer-section:first-child p');
        if (footerDesc) {
            footerDesc.textContent = data.footer.description;
            console.log('✅ Footer description updated:', data.footer.description);
        }
    }
    
    // Update footer copyright
    if (data.footer.copyright) {
        const footerCopyright = document.querySelector('.footer-bottom p');
        if (footerCopyright) {
            footerCopyright.innerHTML = data.footer.copyright;
        }
    }
};

EnhancedContentUpdater.prototype.updateContent = function(content) {
    if (!content) return;
    
    // Hero section
    if (content.hero) {
        this.updateElement('#home h1', content.hero.title);
        this.updateElement('#home p', content.hero.subtitle);
    }
    
    // About section
    if (content.about) {
        this.updateElement('#about .section-title', content.about.title);
        this.updateElement('.about-text p', content.about.description);
    }
    
    // Services section
    if (content.services) {
        this.updateElement('#services .section-title', content.services.title);
    }
    
    // Add other sections as needed...
};

EnhancedContentUpdater.prototype.updateContacts = function(contacts) {
    if (!contacts) return;
    
    // Update contact information
    if (contacts.phone) {
        this.updateElement('.contact-info .contact-item:nth-child(1) p', contacts.phone);
        this.updateElement('.footer-section:nth-child(3) p:nth-child(1)', contacts.phone);
    }
    if (contacts.email) {
        this.updateElement('.contact-info .contact-item:nth-child(2) p', contacts.email);
        this.updateElement('.footer-section:nth-child(3) p:nth-child(2)', contacts.email);
    }
    // Add other contact fields...
};

EnhancedContentUpdater.prototype.updateElement = function(selector, content) {
    const element = document.querySelector(selector);
    if (element && content) {
        element.textContent = content;
    }
};

// Initialize enhanced content updater
new EnhancedContentUpdater();

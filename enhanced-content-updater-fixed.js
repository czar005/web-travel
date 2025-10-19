// Fixed Enhanced Content Updater
function EnhancedContentUpdaterFixed() {
    this.appliedChanges = new Set();
    this.init();
}

EnhancedContentUpdaterFixed.prototype.init = function() {
    console.log('🚀 Fixed Enhanced Content Updater initialized');
    
    // Apply changes immediately
    this.applyAllChanges();
    
    // Listen for data updates
    window.addEventListener('dataUpdated', () => {
        console.log('📢 Data update event received');
        setTimeout(() => this.applyAllChanges(), 200);
    });
    
    // Also listen for storage changes
    window.addEventListener('storage', (e) => {
        if (e.key === 'worldtravel_data') {
            console.log('💾 Storage change detected');
            this.applyAllChanges();
        }
    });
    
    // Periodic check for changes
    setInterval(() => this.applyAllChanges(), 3000);
};

EnhancedContentUpdaterFixed.prototype.applyAllChanges = function() {
    const data = this.getData();
    if (!data) {
        console.log('📭 No data available');
        return;
    }
    
    const changeHash = JSON.stringify({
        content: data.content,
        contacts: data.contacts,
        timestamp: Date.now()
    });
    
    if (this.appliedChanges.has(changeHash)) {
        return;
    }
    
    console.log('🔄 Applying content changes...', data);
    
    try {
        this.updateContent(data.content);
        this.updateNavigation(data.content);
        this.updateFooter(data.content);
        this.updateContacts(data.contacts);
        this.updateStats(data.content?.about?.stats);
        this.updateServices(data.content?.services?.services);
        
        this.appliedChanges.add(changeHash);
        console.log('✅ All changes applied successfully');
    } catch (error) {
        console.error('❌ Error applying changes:', error);
    }
};

EnhancedContentUpdaterFixed.prototype.getData = function() {
    // Try DataManager first
    if (window.dataManager && window.dataManager.getData) {
        const data = window.dataManager.getData();
        if (data) {
            console.log('📁 Data loaded from DataManager');
            return data;
        }
    }
    
    // Fallback to localStorage
    try {
        const localData = localStorage.getItem('worldtravel_data');
        if (localData) {
            const data = JSON.parse(localData);
            console.log('📁 Data loaded from localStorage');
            return data;
        }
    } catch (e) {
        console.error('Error loading from localStorage:', e);
    }
    
    return null;
};

EnhancedContentUpdaterFixed.prototype.updateContent = function(content) {
    if (!content) return;
    
    console.log('📝 Updating content sections...');
    
    // Hero section
    if (content.hero) {
        this.updateText('#home h1, .hero h1', content.hero.title);
        this.updateText('#home p, .hero p', content.hero.subtitle);
        this.updateImage('.hero-image img', content.hero.image);
    }
    
    // About section
    if (content.about) {
        this.updateText('#about .section-title', content.about.title);
        this.updateText('.about-text p', content.about.description);
        this.updateImage('.about-image img', content.about.image);
    }
    
    // Services section
    if (content.services) {
        this.updateText('#services .section-title', content.services.title);
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

EnhancedContentUpdaterFixed.prototype.updateNavigation = function(content) {
    if (!content) return;
    
    console.log('🧭 Updating navigation...');
    
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const sectionId = href.substring(1);
            if (content[sectionId] && content[sectionId].title) {
                const newTitle = content[sectionId].title;
                if (link.textContent !== newTitle) {
                    link.textContent = newTitle;
                    console.log(`✅ Navigation updated: ${sectionId} -> ${newTitle}`);
                }
            }
        }
    });
};

EnhancedContentUpdaterFixed.prototype.updateFooter = function(content) {
    if (!content) return;
    
    console.log('🦶 Updating footer...');
    
    // Update footer links
    const footerLinks = document.querySelectorAll('.footer-section:nth-child(2) a');
    footerLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const sectionId = href.substring(1);
            if (content[sectionId] && content[sectionId].title) {
                const newTitle = content[sectionId].title;
                if (link.textContent !== newTitle) {
                    link.textContent = newTitle;
                    console.log(`✅ Footer link updated: ${sectionId} -> ${newTitle}`);
                }
            }
        }
    });
};

EnhancedContentUpdaterFixed.prototype.updateContacts = function(contacts) {
    if (!contacts) return;
    
    console.log('📞 Updating contacts...', contacts);
    
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

EnhancedContentUpdaterFixed.prototype.updateStats = function(stats) {
    if (!stats || !Array.isArray(stats)) return;
    
    console.log('📊 Updating stats...', stats);
    
    const statElements = document.querySelectorAll('.stat');
    if (statElements.length === 0) return;
    
    stats.forEach((stat, index) => {
        if (statElements[index]) {
            const valueEl = statElements[index].querySelector('h3');
            const labelEl = statElements[index].querySelector('p');
            
            if (valueEl && stat.value) {
                valueEl.textContent = stat.value;
            }
            if (labelEl && stat.label) {
                labelEl.textContent = stat.label;
            }
        }
    });
};

EnhancedContentUpdaterFixed.prototype.updateServices = function(services) {
    if (!services || !Array.isArray(services)) return;
    
    console.log('🎯 Updating services...', services);
    
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length === 0) return;
    
    services.forEach((service, index) => {
        if (serviceCards[index]) {
            const titleEl = serviceCards[index].querySelector('h3');
            const descEl = serviceCards[index].querySelector('p');
            const iconEl = serviceCards[index].querySelector('.service-icon i');
            
            if (titleEl && service.title) {
                titleEl.textContent = service.title;
            }
            if (descEl && service.description) {
                descEl.textContent = service.description;
            }
            if (iconEl && service.icon) {
                iconEl.className = service.icon;
            }
        }
    });
};

EnhancedContentUpdaterFixed.prototype.updateText = function(selector, text) {
    if (!text) return;
    
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        if (element.textContent !== text) {
            element.textContent = text;
        }
    });
};

EnhancedContentUpdaterFixed.prototype.updateHTML = function(selector, html) {
    if (!html) return;
    
    const element = document.querySelector(selector);
    if (element && element.innerHTML !== html) {
        element.innerHTML = html;
    }
};

EnhancedContentUpdaterFixed.prototype.updateImage = function(selector, src) {
    if (!src) return;
    
    const element = document.querySelector(selector);
    if (element && element.src !== src) {
        element.src = src;
    }
};

// Initialize fixed content updater
new EnhancedContentUpdaterFixed();

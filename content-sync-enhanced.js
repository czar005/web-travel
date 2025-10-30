// Enhanced Content Sync for new data structure
function ContentSyncEnhanced() {
    this.appliedChanges = new Set();
    this.init();
}

ContentSyncEnhanced.prototype.init = function() {
    console.log('🚀 Enhanced Content Sync initialized');
    
    var self = this;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() { self.applyAllChanges(); }, 100);
        });
    } else {
        setTimeout(function() { self.applyAllChanges(); }, 100);
    }

    window.addEventListener('dataUpdated', function(e) {
        console.log('🔄 Data update received:', e.detail);
        setTimeout(function() { self.applyAllChanges(); }, 50);
    });

    setInterval(function() { self.applyAllChanges(); }, 2000);
};

ContentSyncEnhanced.prototype.applyAllChanges = function() {
    if (!window.dataManager) {
        console.log('⏳ Waiting for DataManager...');
        this.applyLocalChanges();
        return;
    }

    var data = window.dataManager.getData();
    if (!data) {
        console.log('📭 No data available');
        this.applyLocalChanges();
        return;
    }

    var changeHash = this.getDataHash(data);
    if (this.appliedChanges.has(changeHash)) {
        return;
    }

    console.log('🔄 Applying enhanced changes from DataManager...');
    
    this.applyHeroSection(data.content);
    this.applyAboutSection(data.content);
    this.applyServicesSection(data.content);
    this.applyDestinationsSection(data.content);
    this.applyContactSection(data.content);
    this.applyFooterSection(data.footer);
    this.applyContactInfo(data.contacts);
    
    this.appliedChanges.add(changeHash);
    console.log('✅ Enhanced changes applied successfully');
};

ContentSyncEnhanced.prototype.applyHeroSection = function(content) {
    if (!content?.hero) return;

    const hero = content.hero;
    
    // Update title
    this.updateElement('#home h1, .hero h1', hero.title);
    
    // Update description
    this.updateElement('#home p, .hero p', hero.description);
    
    // Update button text
    if (hero.buttonText) {
        const button = document.querySelector('.cta-button');
        if (button) button.textContent = hero.buttonText;
    }
    
    // Update background image
    if (hero.backgroundImage) {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.style.backgroundImage = `url('${hero.backgroundImage}')`;
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';
        }
    }
};

ContentSyncEnhanced.prototype.applyAboutSection = function(content) {
    if (!content?.about) return;

    const about = content.about;
    
    // Update title
    this.updateElement('#about .section-title', about.title);
    
    // Update description
    this.updateElement('.about-text p', about.description);
    
    // Update image
    if (about.image) {
        const aboutImage = document.querySelector('.about-img');
        if (aboutImage) aboutImage.src = about.image;
    }
    
    // Update stats
    this.applyStats(about.stats);
};

ContentSyncEnhanced.prototype.applyStats = function(stats) {
    if (!stats || !Array.isArray(stats)) return;

    const statElements = document.querySelectorAll('.stat');
    const statsContainer = document.querySelector('.stats');
    
    if (!statsContainer) return;
    
    // Clear existing stats
    statsContainer.innerHTML = '';
    
    // Add new stats
    stats.forEach(stat => {
        if (stat.value && stat.label) {
            const statElement = document.createElement('div');
            statElement.className = 'stat animate-counter';
            statElement.setAttribute('data-target', stat.value.replace(/\D/g, ''));
            statElement.innerHTML = `
                <h3>${stat.value}</h3>
                <p>${stat.label}</p>
            `;
            statsContainer.appendChild(statElement);
        }
    });
};

ContentSyncEnhanced.prototype.applyServicesSection = function(content) {
    if (!content?.services) return;

    const services = content.services;
    
    // Update title
    this.updateElement('#services .section-title', services.title);
    
    // Update services grid
    this.applyServices(services.services);
};

ContentSyncEnhanced.prototype.applyServices = function(services) {
    if (!services || !Array.isArray(services)) return;

    const servicesGrid = document.querySelector('.services-grid');
    
    if (!servicesGrid) return;
    
    // Clear existing services
    servicesGrid.innerHTML = '';
    
    // Add animation classes for different positions
    const animations = ['slide-in-left', 'slide-in-bottom', 'slide-in-right', 'slide-in-top'];
    
    // Add new services
    services.forEach((service, index) => {
        if (service.title && service.description) {
            const serviceElement = document.createElement('div');
            serviceElement.className = `service-card ${animations[index % animations.length]}`;
            serviceElement.innerHTML = `
                <div class="service-icon"><i class="${service.icon || 'fas fa-star'}"></i></div>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
            `;
            servicesGrid.appendChild(serviceElement);
        }
    });
};

ContentSyncEnhanced.prototype.applyDestinationsSection = function(content) {
    if (!content?.destinations) return;

    const destinations = content.destinations;
    
    // Update title
    this.updateElement('#destinations .section-title', destinations.title);
    
    // Update subtitle
    this.updateElement('.destinations .section-subtitle', destinations.subtitle);
};

ContentSyncEnhanced.prototype.applyContactSection = function(content) {
    if (!content?.contact) return;

    const contact = content.contact;
    
    // Update title
    this.updateElement('#contact .section-title', contact.title);
};

ContentSyncEnhanced.prototype.applyFooterSection = function(footer) {
    if (!footer) return;

    if (footer.description) {
        this.updateElement('.footer-section:first-child p', footer.description);
    }
    if (footer.copyright) {
        this.updateElement('.footer-bottom p', footer.copyright, true);
    }
};

ContentSyncEnhanced.prototype.applyContactInfo = function(contacts) {
    if (!contacts) return;

    // Phone
    if (contacts.phone) {
        this.updateElement('.contact-info .contact-item:nth-child(1) p', contacts.phone);
        this.updateElement('.footer-section:nth-child(3) p:nth-child(1)', contacts.phone);
    }
    
    // Email
    if (contacts.email) {
        this.updateElement('.contact-info .contact-item:nth-child(2) p', contacts.email);
        this.updateElement('.footer-section:nth-child(3) p:nth-child(2)', contacts.email);
    }
    
    // Address
    if (contacts.address) {
        this.updateElement('.contact-info .contact-item:nth-child(3) p', contacts.address);
        this.updateElement('.footer-section:nth-child(3) p:nth-child(3)', contacts.address);
    }
    
    // Hours
    if (contacts.hours) {
        this.updateElement('.contact-info .contact-item:nth-child(4) p', contacts.hours);
        this.updateElement('.footer-section:nth-child(3) p:nth-child(4)', contacts.hours);
    }
};

ContentSyncEnhanced.prototype.applyLocalChanges = function() {
    var localData = localStorage.getItem('worldtravel_data');
    if (localData) {
        try {
            var data = JSON.parse(localData);
            console.log('📁 Applying local enhanced changes...');
            this.applyHeroSection(data.content);
            this.applyAboutSection(data.content);
            this.applyServicesSection(data.content);
            this.applyDestinationsSection(data.content);
            this.applyContactSection(data.content);
            this.applyFooterSection(data.footer);
            this.applyContactInfo(data.contacts);
        } catch (error) {
            console.error('❌ Error applying local changes:', error);
        }
    }
};

ContentSyncEnhanced.prototype.updateElement = function(selector, content, isHTML) {
    var elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
        elements.forEach(function(element) {
            if (isHTML) {
                element.innerHTML = content;
            } else {
                element.textContent = content;
            }
        });
    }
};

ContentSyncEnhanced.prototype.getDataHash = function(data) {
    return JSON.stringify({
        content: data.content,
        contacts: data.contacts,
        settings: data.settings,
        footer: data.footer,
        timestamp: data.lastUpdate
    });
};

// Initialize enhanced content sync
var contentSyncEnhanced = new ContentSyncEnhanced();

// Replace the original content sync if it exists
if (window.contentUpdater) {
    console.log('🔄 Replacing original content sync with enhanced version');
    window.contentUpdater = contentSyncEnhanced;
}

// Unified Content Synchronization
class ContentSync {
    constructor() {
        this.lastDataHash = '';
        this.init();
    }

    init() {
        console.log('🔄 ContentSync initialized');
        
        // Listen for data updates
        window.addEventListener('worldtravelDataUpdated', (e) => {
            console.log('📡 Data update received');
            this.applyChanges(e.detail.data);
        });

        // Check for changes periodically
        setInterval(() => this.checkForUpdates(), 2000);

        // Initial sync
        setTimeout(() => this.checkForUpdates(), 1000);
    }

    checkForUpdates() {
        try {
            const data = window.dataManager?.getData();
            if (!data) return;

            const currentHash = this.getDataHash(data);
            if (currentHash !== this.lastDataHash) {
                console.log('🔄 Changes detected, applying updates...');
                this.applyChanges(data);
                this.lastDataHash = currentHash;
            }
        } catch (error) {
            console.error('❌ Update check error:', error);
        }
    }

    getDataHash(data) {
        return JSON.stringify({
            content: data.content,
            contacts: data.contacts,
            footer: data.footer,
            settings: data.settings,
            timestamp: data.lastUpdate
        });
    }

    applyChanges(data) {
        if (!data) return;

        console.log('🎯 Applying content changes...');

        // Apply content changes
        this.applyContentChanges(data.content);
        
        // Apply contact changes
        this.applyContactChanges(data.contacts);
        
        // Apply footer changes
        this.applyFooterChanges(data.footer);
        
        // Apply settings changes
        this.applySettingsChanges(data.settings);

        console.log('✅ All changes applied');
    }

    applyContentChanges(content) {
        if (!content) return;

        // Hero section
        if (content.hero) {
            this.updateText('#home h1', content.hero.title);
            this.updateText('#home p', content.hero.subtitle);
            this.updateImage('.hero-img', content.hero.image);
        }

        // About section
        if (content.about) {
            this.updateText('#about .section-title', content.about.title);
            this.updateText('.about-text p', content.about.description);
            this.updateImage('.about-img', content.about.image);
            this.updateNavigation('about', content.about.title);
            
            if (content.about.stats) {
                this.updateStats(content.about.stats);
            }
        }

        // Services section
        if (content.services) {
            this.updateText('#services .section-title', content.services.title);
            this.updateNavigation('services', content.services.title);
            
            if (content.services.services) {
                this.updateServices(content.services.services);
            }
        }

        // Destinations section
        if (content.destinations) {
            this.updateText('#destinations .section-title', content.destinations.title);
            this.updateText('.destinations .section-subtitle', content.destinations.subtitle);
            this.updateNavigation('destinations', content.destinations.title);
        }

        // Contact section
        if (content.contact) {
            this.updateText('#contact .section-title', content.contact.title);
            this.updateNavigation('contact', content.contact.title);
        }
    }

    applyContactChanges(contacts) {
        if (!contacts) return;

        this.updateText('.contact-phone', contacts.phone);
        this.updateText('.contact-email', contacts.email);
        this.updateText('.contact-address', contacts.address);
        this.updateText('.contact-hours', contacts.hours);

        // Update footer contacts
        this.updateText('.footer-phone', contacts.phone);
        this.updateText('.footer-email', contacts.email);
        this.updateText('.footer-address', contacts.address);
        this.updateText('.footer-hours', contacts.hours);
    }

    applyFooterChanges(footer) {
        if (!footer) return;

        this.updateText('.footer-description', footer.description);
        this.updateHTML('.footer-copyright', footer.copyright);
    }

    applySettingsChanges(settings) {
        if (!settings) return;

        if (settings.siteTitle) {
            document.title = settings.siteTitle;
        }
    }

    // Helper methods
    updateText(selector, value) {
        if (!value) return;
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (el.textContent !== value) {
                el.textContent = value;
            }
        });
    }

    updateHTML(selector, value) {
        if (!value) return;
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (el.innerHTML !== value) {
                el.innerHTML = value;
            }
        });
    }

    updateImage(selector, src) {
        if (!src) return;
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (el.src !== src) {
                el.src = src;
            }
        });
    }

    updateNavigation(sectionId, title) {
        const navLinks = document.querySelectorAll(`.nav-links a[href="#${sectionId}"]`);
        const footerLinks = document.querySelectorAll(`.footer-section a[href="#${sectionId}"]`);
        
        [...navLinks, ...footerLinks].forEach(link => {
            if (link.textContent !== title) {
                link.textContent = title;
            }
        });
    }

    updateStats(stats) {
        const statElements = document.querySelectorAll('.stat');
        stats.forEach((stat, index) => {
            if (statElements[index]) {
                const valueEl = statElements[index].querySelector('h3');
                const labelEl = statElements[index].querySelector('p');
                
                if (valueEl) valueEl.textContent = stat.value;
                if (labelEl) labelEl.textContent = stat.label;
            }
        });
    }

    updateServices(services) {
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
    }
}

// Initialize content sync when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.contentSync = new ContentSync();
    });
} else {
    window.contentSync = new ContentSync();
}

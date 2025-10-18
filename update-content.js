// Enhanced content updater for main page with auto-application
class ContentUpdater {
    constructor() {
        this.initialized = false;
        this.init();
    }

    init() {
        // Wait for DOM and dataManager to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.applyAllChanges());
        } else {
            this.applyAllChanges();
        }

        // Listen for data updates
        window.addEventListener('dataUpdated', () => {
            console.log('🔄 Data updated, applying changes to page...');
            setTimeout(() => this.applyAllChanges(), 100);
        });

        // Also check for changes periodically
        setInterval(() => this.applyAllChanges(), 3000);
    }

    applyAllChanges() {
        if (!window.dataManager) {
            console.log('⏳ DataManager not ready yet...');
            return;
        }

        const data = window.dataManager.getData();
        if (!data) return;

        this.applyContentChanges(data.content);
        this.applyContactChanges(data.contacts);
        this.applySettingsChanges(data.settings);
        
        if (!this.initialized) {
            console.log('✅ Content updater initialized successfully');
            this.initialized = true;
        }
    }

    applyContentChanges(content) {
        if (!content) return;

        // Hero section
        if (content.hero) {
            this.updateElement('#home h1, .hero h1, section:first-of-type h1', content.hero.title);
            this.updateElement('#home p, .hero p, section:first-of-type p', content.hero.subtitle);
        }

        // About section
        if (content.about) {
            this.updateElement('#about .section-title, .about .section-title', content.about.title);
            this.updateElement('.about-text p, #about p, .about p', content.about.description);
            
            // Update stats
            if (content.about.stats) {
                this.updateStats(content.about.stats);
            }
        }

        // Services section
        if (content.services) {
            this.updateElement('#services .section-title, .services .section-title', content.services.title);
        }

        // Destinations section
        if (content.destinations) {
            this.updateElement('#destinations .section-title, .destinations .section-title', content.destinations.title);
            this.updateElement('.destinations .section-subtitle, .section-subtitle', content.destinations.subtitle);
        }

        // Contact section
        if (content.contact) {
            this.updateElement('#contact .section-title, .contact .section-title', content.contact.title);
        }
    }

    applyContactChanges(contacts) {
        if (!contacts) return;

        this.updateElement('.contact-info .contact-item:nth-child(1) p, .contact-item:first-child p', contacts.phone);
        this.updateElement('.contact-info .contact-item:nth-child(2) p, .contact-item:nth-child(2) p', contacts.email);
        this.updateElement('.contact-info .contact-item:nth-child(3) p, .contact-item:nth-child(3) p', contacts.address);
        this.updateElement('.contact-info .contact-item:nth-child(4) p, .contact-item:nth-child(4) p', contacts.hours);
    }

    applySettingsChanges(settings) {
        if (!settings) return;

        // Update page title
        if (settings.siteTitle) {
            document.title = settings.siteTitle;
        }

        // Update company name in header and footer
        if (settings.companyName) {
            this.updateElement('.logo h2, .header h2', settings.companyName);
            this.updateElement('.footer-section h3, .footer h3', settings.companyName);
        }
    }

    updateElement(selector, newValue) {
        if (!newValue) return;
        
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element && element.textContent !== newValue) {
                    element.textContent = newValue;
                }
            });
        } catch (error) {
            console.error('Error updating element:', selector, error);
        }
    }

    updateStats(stats) {
        if (!stats || !Array.isArray(stats)) return;

        const statContainers = document.querySelectorAll('.stat, .about .stat, .stats .stat');
        
        stats.forEach((stat, index) => {
            if (statContainers[index]) {
                const valueElement = statContainers[index].querySelector('h3, .stat-value');
                const labelElement = statContainers[index].querySelector('p, .stat-label');
                
                if (valueElement && stat.value) {
                    valueElement.textContent = stat.value;
                }
                if (labelElement && stat.label) {
                    labelElement.textContent = stat.label;
                }
            }
        });

        // If no stat containers found, try to create or find them
        if (statContainers.length === 0) {
            this.createStatsIfNeeded(stats);
        }
    }

    createStatsIfNeeded(stats) {
        const aboutSection = document.querySelector('#about, .about');
        if (!aboutSection) return;

        const statsContainer = aboutSection.querySelector('.stats, .about-stats');
        if (statsContainer) {
            let html = '';
            stats.forEach(stat => {
                html += `
                    <div class="stat">
                        <h3>${stat.value || ''}</h3>
                        <p>${stat.label || ''}</p>
                    </div>
                `;
            });
            statsContainer.innerHTML = html;
        }
    }
}

// Initialize content updater
const contentUpdater = new ContentUpdater();

// Also export for manual control
window.updatePageContent = () => contentUpdater.applyAllChanges();

// Force update when coming from admin
if (window.location.search.includes('fromAdmin=true')) {
    setTimeout(() => {
        contentUpdater.applyAllChanges();
        console.log('🔄 Force update from admin');
    }, 1000);
}

// Debug function
window.debugContent = function() {
    console.log('🔍 Content Debug:');
    if (window.dataManager) {
        const data = window.dataManager.getData();
        console.log('- Content:', data?.content);
        console.log('- Contacts:', data?.contacts);
        console.log('- Settings:', data?.settings);
    }
    console.log('- Updater initialized:', contentUpdater.initialized);
};

// Enhanced content updater with reliable change application
class ContentUpdater {
    constructor() {
        this.appliedChanges = new Set();
        this.init();
    }

    init() {
        console.log('🚀 ContentUpdater initialized');
        
        // Apply changes when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.applyAllChanges(), 100);
            });
        } else {
            setTimeout(() => this.applyAllChanges(), 100);
        }

        // Listen for data updates
        window.addEventListener('dataUpdated', (e) => {
            console.log('🔄 Data update received:', e.detail);
            setTimeout(() => this.applyAllChanges(), 50);
        });

        // Periodic check for changes
        setInterval(() => this.applyAllChanges(), 2000);

        // Also apply changes when coming from editor
        if (window.location.search.includes('editor=true')) {
            setTimeout(() => this.applyAllChanges(), 500);
        }
    }

    applyAllChanges() {
        if (!window.dataManager) {
            console.log('⏳ Waiting for DataManager...');
            // Пробуем загрузить данные из localStorage как fallback
            this.applyLocalChanges();
            return;
        }

        const data = window.dataManager.getData();
        if (!data) {
            console.log('📭 No data available');
            this.applyLocalChanges();
            return;
        }

        const changeHash = this.getDataHash(data);
        if (this.appliedChanges.has(changeHash)) {
            return; // Changes already applied
        }

        console.log('🔄 Applying changes from DataManager...');
        
        this.applyContentChanges(data.content);
        this.applyContactChanges(data.contacts);
        this.applySettingsChanges(data.settings);
        
        this.appliedChanges.add(changeHash);
        console.log('✅ Changes applied successfully');
    }

    applyLocalChanges() {
        const localData = localStorage.getItem('worldtravel_editor_data');
        if (localData) {
            try {
                const data = JSON.parse(localData);
                console.log('📁 Applying local changes...');
                this.applyContentChanges(data.content);
                this.applyContactChanges(data.contacts);
                this.applySettingsChanges(data.settings);
            } catch (error) {
                console.error('❌ Error applying local changes:', error);
            }
        }
    }

    getDataHash(data) {
        return JSON.stringify({
            content: data.content,
            contacts: data.contacts,
            settings: data.settings,
            timestamp: data.lastUpdate
        });
    }

    applyContentChanges(content) {
        if (!content) return;

        console.log('📝 Applying content changes:', content);

        // Hero section
        if (content.hero) {
            this.updateElement('#home h1, .hero h1, section:first-of-type h1', content.hero.title);
            this.updateElement('#home p, .hero p, section:first-of-type p', content.hero.subtitle);
        }

        // About section
        if (content.about) {
            this.updateElement('#about .section-title, .about .section-title, section:nth-of-type(2) .section-title', content.about.title);
            this.updateElement('.about-text p, #about p, .about p, section:nth-of-type(2) p', content.about.description);
            
            if (content.about.stats) {
                this.updateStats(content.about.stats);
            }
        }

        // Services section
        if (content.services) {
            this.updateElement('#services .section-title, .services .section-title, section:nth-of-type(3) .section-title', content.services.title);
        }

        // Destinations section
        if (content.destinations) {
            this.updateElement('#destinations .section-title, .destinations .section-title, section:nth-of-type(4) .section-title', content.destinations.title);
            this.updateElement('.destinations .section-subtitle, .section-subtitle, section:nth-of-type(4) .section-subtitle', content.destinations.subtitle);
        }

        // Contact section
        if (content.contact) {
            this.updateElement('#contact .section-title, .contact .section-title, section:nth-of-type(5) .section-title', content.contact.title);
        }
    }

    applyContactChanges(contacts) {
        if (!contacts) return;

        console.log('📞 Applying contact changes:', contacts);

        // Контакты в секции контактов
        this.updateElement('.contact-info .contact-item:nth-child(1) p, .contact-item:first-child p', contacts.phone);
        this.updateElement('.contact-info .contact-item:nth-child(2) p, .contact-item:nth-child(2) p', contacts.email);
        this.updateElement('.contact-info .contact-item:nth-child(3) p, .contact-item:nth-child(3) p', contacts.address);
        this.updateElement('.contact-info .contact-item:nth-child(4) p, .contact-item:nth-child(4) p', contacts.hours);

        // Контакты в футере
        this.updateElement('.footer-section p:nth-child(2)', contacts.phone);
        this.updateElement('.footer-section p:nth-child(3)', contacts.email);
        this.updateElement('.footer-section p:nth-child(4)', contacts.address);
    }

    applySettingsChanges(settings) {
        if (!settings) return;

        console.log('⚙️ Applying settings changes:', settings);

        // Update page title
        if (settings.siteTitle) {
            document.title = settings.siteTitle;
        }

        // Update company name
        if (settings.companyName) {
            this.updateElement('.logo h2, .header h2', settings.companyName);
            this.updateElement('.footer-section h3, .footer h3', settings.companyName);
        }
    }

    updateElement(selector, newValue) {
        if (newValue === undefined || newValue === null) return;
        
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element && element.textContent !== newValue) {
                    console.log(`✏️ Updating ${selector}: "${element.textContent}" -> "${newValue}"`);
                    element.textContent = newValue;
                }
            });
        } catch (error) {
            console.error('❌ Error updating element:', selector, error);
        }
    }

    updateStats(stats) {
        if (!stats || !Array.isArray(stats)) return;

        console.log('📊 Updating stats:', stats);

        const statContainers = document.querySelectorAll('.stat, .about .stat, .stats .stat, .about-stats .stat');
        
        stats.forEach((stat, index) => {
            if (statContainers[index]) {
                const valueElement = statContainers[index].querySelector('h3, .stat-value, h4');
                const labelElement = statContainers[index].querySelector('p, .stat-label');
                
                if (valueElement && stat.value !== undefined) {
                    valueElement.textContent = stat.value;
                }
                if (labelElement && stat.label !== undefined) {
                    labelElement.textContent = stat.label;
                }
            } else if (index < 3) {
                // Create stat if doesn't exist (for first 3 stats)
                this.createStatElement(index, stat);
            }
        });
    }

    createStatElement(index, stat) {
        const aboutSection = document.querySelector('#about, .about');
        if (!aboutSection) return;

        let statsContainer = aboutSection.querySelector('.stats, .about-stats');
        if (!statsContainer) {
            const aboutText = aboutSection.querySelector('.about-text');
            if (aboutText) {
                statsContainer = document.createElement('div');
                statsContainer.className = 'stats';
                aboutText.parentNode.insertBefore(statsContainer, aboutText.nextSibling);
            }
        }

        if (statsContainer) {
            const statElements = statsContainer.querySelectorAll('.stat');
            if (statElements[index]) {
                // Update existing stat
                const valueElement = statElements[index].querySelector('h3, .stat-value');
                const labelElement = statElements[index].querySelector('p, .stat-label');
                if (valueElement) valueElement.textContent = stat.value;
                if (labelElement) labelElement.textContent = stat.label;
            } else {
                // Create new stat
                const statElement = document.createElement('div');
                statElement.className = 'stat';
                statElement.innerHTML = `
                    <h3>${stat.value || ''}</h3>
                    <p>${stat.label || ''}</p>
                `;
                statsContainer.appendChild(statElement);
            }
        }
    }
}

// Initialize content updater
const contentUpdater = new ContentUpdater();

// Export for manual control
window.updatePageContent = () => contentUpdater.applyAllChanges();

// Force update when needed
window.forceContentUpdate = function() {
    contentUpdater.appliedChanges.clear();
    contentUpdater.applyAllChanges();
};

// Debug function
window.debugContent = function() {
    console.log('🔍 Content Debug:');
    console.log('- Applied changes:', contentUpdater.appliedChanges.size);
    if (window.dataManager) {
        const data = window.dataManager.getData();
        console.log('- Current data:', data);
    }
};

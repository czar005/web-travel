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
        const localData = localStorage.getItem('worldtravel_data');
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
            
            if (content.services.services) {
                this.updateServices(content.services.services);
            }
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

        // Footer section
        if (content.footer) {
            this.updateElement('.footer-section p:first-child', content.footer.description);
            this.updateElement('.footer-bottom p', content.footer.copyright, true);
        }
    }

    applyContactChanges(contacts) {
        if (!contacts) return;

        console.log('📞 Applying contact changes:', contacts);

        // Контакты в секции контактов - правильный порядок: Email, Телефон, Адрес, Часы работы
        this.updateElement('.contact-info .contact-item:nth-child(1) p, .contact-item:first-child p', contacts.email);
        this.updateElement('.contact-info .contact-item:nth-child(2) p, .contact-item:nth-child(2) p', contacts.phone);
        this.updateElement('.contact-info .contact-item:nth-child(3) p, .contact-item:nth-child(3) p', contacts.address);
        this.updateElement('.contact-info .contact-item:nth-child(4) p, .contact-item:nth-child(4) p', contacts.hours);

        // Контакты в футере - правильный порядок
        this.updateElement('.footer-section p:nth-child(2)', contacts.email);
        this.updateElement('.footer-section p:nth-child(3)', contacts.phone);
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

    updateElement(selector, newValue, isHtml = false) {
        if (newValue === undefined || newValue === null) return;
        
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    if (isHtml) {
                        if (element.innerHTML !== newValue) {
                            console.log(`✏️ Updating HTML ${selector}: "${element.innerHTML}" -> "${newValue}"`);
                            element.innerHTML = newValue;
                        }
                    } else {
                        if (element.textContent !== newValue) {
                            console.log(`✏️ Updating ${selector}: "${element.textContent}" -> "${newValue}"`);
                            element.textContent = newValue;
                        }
                    }
                }
            });
        } catch (error) {
            console.error('❌ Error updating element:', selector, error);
        }
    }

    updateStats(stats) {
        if (!stats || !Array.isArray(stats)) return;

        console.log('�� Updating stats:', stats);

        const statsContainer = document.querySelector('.stats, .about-stats');
        if (!statsContainer) return;

        // Очищаем существующие статы
        statsContainer.innerHTML = '';

        // Создаем новые статы
        stats.forEach(stat => {
            const statElement = document.createElement('div');
            statElement.className = 'stat animate-counter';
            if (stat.value && !isNaN(parseInt(stat.value))) {
                statElement.setAttribute('data-target', stat.value);
            }
            statElement.innerHTML = `
                <h3>${stat.value || ''}</h3>
                <p>${stat.label || ''}</p>
            `;
            statsContainer.appendChild(statElement);
        });

        // Запускаем анимацию счетчиков
        this.animateCounters();
    }

    updateServices(services) {
        if (!services || !Array.isArray(services)) return;

        console.log('🛠️ Updating services:', services);

        const servicesGrid = document.querySelector('.services-grid');
        if (!servicesGrid) return;

        // Очищаем существующие услуги
        servicesGrid.innerHTML = '';

        // Создаем новые услуги
        services.forEach((service, index) => {
            const serviceCard = document.createElement('div');
            serviceCard.className = 'service-card';
            
            // Добавляем классы анимации
            const animationClasses = ['slide-in-left', 'slide-in-bottom', 'slide-in-right', 'slide-in-top'];
            serviceCard.classList.add(animationClasses[index % animationClasses.length]);
            
            serviceCard.innerHTML = `
                <div class="service-icon">
                    <i class="${service.icon || 'fas fa-star'}"></i>
                </div>
                <h3>${service.title || ''}</h3>
                <p>${service.description || ''}</p>
            `;
            servicesGrid.appendChild(serviceCard);
        });
    }

    animateCounters() {
        const counters = document.querySelectorAll('.animate-counter');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            if (!isNaN(target)) {
                const count = parseInt(counter.querySelector('h3').textContent);
                if (!isNaN(count) && count !== target) {
                    this.animateValue(counter.querySelector('h3'), count, target, 1000);
                }
            }
        });
    }

    animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value.toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
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

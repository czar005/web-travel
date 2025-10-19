// Enhanced Content Updater with proper saving
class EnhancedContentUpdater {
    constructor() {
        this.initialized = false;
        this.init();
    }

    init() {
        console.log('🚀 Enhanced Content Updater initialized');
        
        // Ждем загрузки DataManager
        this.waitForDataManager();
        
        // Слушаем события обновления данных
        window.addEventListener('dataUpdated', (e) => {
            console.log('📢 Data update event received', e.detail);
            this.applyChanges();
        });
        
        // Периодическая проверка изменений
        setInterval(() => this.applyChanges(), 3000);
    }

    waitForDataManager() {
        if (window.dataManager) {
            this.applyChanges();
            this.initialized = true;
        } else {
            setTimeout(() => this.waitForDataManager(), 100);
        }
    }

    applyChanges() {
        if (!window.dataManager) {
            console.log('⏳ Waiting for DataManager...');
            return;
        }

        const data = window.dataManager.getData();
        if (!data) {
            console.log('📭 No data available');
            return;
        }

        console.log('🔄 Applying changes to page...');
        
        // Применяем изменения контента
        this.applyContentChanges(data.content);
        
        // Применяем контакты
        this.applyContactChanges(data.contacts);
        
        // Применяем настройки
        this.applySettingsChanges(data.settings);
        
        console.log('✅ Changes applied successfully');
    }

    applyContentChanges(content) {
        if (!content) return;

        // Hero section
        if (content.hero) {
            this.updateText('#home h1, .hero h1', content.hero.title);
            this.updateText('#home p, .hero p', content.hero.subtitle);
        }

        // About section
        if (content.about) {
            this.updateText('#about .section-title', content.about.title);
            this.updateText('.about-text p', content.about.description);
            
            // Обновляем статистику если есть
            if (content.about.stats) {
                this.updateStats(content.about.stats);
            }
        }

        // Services section
        if (content.services) {
            this.updateText('#services .section-title', content.services.title);
            
            // Обновляем услуги если есть
            if (content.services.services) {
                this.updateServices(content.services.services);
            }
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

        // Footer section
        if (content.footer) {
            this.updateText('.footer-section:first-child p', content.footer.description);
            this.updateHTML('.footer-bottom p', content.footer.copyright);
        }
    }

    applyContactChanges(contacts) {
        if (!contacts) return;

        // Обновляем контакты в секции контактов
        if (contacts.phone) {
            this.updateContactItem('Телефон', contacts.phone);
        }
        if (contacts.email) {
            this.updateContactItem('Email', contacts.email);
        }
        if (contacts.address) {
            this.updateContactItem('Адрес', contacts.address);
        }
        if (contacts.hours) {
            this.updateContactItem('Часы', contacts.hours);
        }

        // Обновляем контакты в футере
        this.updateFooterContacts(contacts);
    }

    applySettingsChanges(settings) {
        if (!settings) return;

        if (settings.siteTitle) {
            document.title = settings.siteTitle;
        }
    }

    updateText(selector, text) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (el.textContent !== text) {
                el.textContent = text;
            }
        });
    }

    updateHTML(selector, html) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (el.innerHTML !== html) {
                el.innerHTML = html;
            }
        });
    }

    updateContactItem(type, value) {
        const contactItems = document.querySelectorAll('.contact-item');
        contactItems.forEach(item => {
            const strong = item.querySelector('strong');
            if (strong && strong.textContent.includes(type)) {
                const p = item.querySelector('p');
                if (p && p.textContent !== value) {
                    p.textContent = value;
                }
            }
        });
    }

    updateFooterContacts(contacts) {
        const footerSection = document.querySelector('.footer-section:nth-child(3)');
        if (!footerSection) return;

        const paragraphs = footerSection.querySelectorAll('p');
        
        if (paragraphs.length >= 4) {
            if (contacts.phone && !paragraphs[0].textContent.includes(contacts.phone)) {
                paragraphs[0].innerHTML = `<i class="fas fa-phone"></i> ${contacts.phone}`;
            }
            if (contacts.email && !paragraphs[1].textContent.includes(contacts.email)) {
                paragraphs[1].innerHTML = `<i class="fas fa-envelope"></i> ${contacts.email}`;
            }
            if (contacts.address && !paragraphs[2].textContent.includes(contacts.address)) {
                paragraphs[2].innerHTML = `<i class="fas fa-map-marker-alt"></i> ${contacts.address}`;
            }
            if (contacts.hours && !paragraphs[3].textContent.includes(contacts.hours)) {
                paragraphs[3].innerHTML = `<i class="fas fa-clock"></i> ${contacts.hours}`;
            }
        }
    }

    updateStats(stats) {
        const statElements = document.querySelectorAll('.stat');
        if (statElements.length >= stats.length) {
            stats.forEach((stat, index) => {
                if (statElements[index]) {
                    const valueElement = statElements[index].querySelector('h3');
                    const labelElement = statElements[index].querySelector('p');
                    
                    if (valueElement && valueElement.textContent !== stat.value) {
                        valueElement.textContent = stat.value;
                    }
                    if (labelElement && labelElement.textContent !== stat.label) {
                        labelElement.textContent = stat.label;
                    }
                }
            });
        }
    }

    updateServices(services) {
        const serviceCards = document.querySelectorAll('.service-card');
        if (serviceCards.length >= services.length) {
            services.forEach((service, index) => {
                if (serviceCards[index]) {
                    const titleElement = serviceCards[index].querySelector('h3');
                    const descElement = serviceCards[index].querySelector('p');
                    const iconElement = serviceCards[index].querySelector('.service-icon i');
                    
                    if (titleElement && titleElement.textContent !== service.title) {
                        titleElement.textContent = service.title;
                    }
                    if (descElement && descElement.textContent !== service.description) {
                        descElement.textContent = service.description;
                    }
                    if (iconElement && service.icon && iconElement.className !== service.icon) {
                        iconElement.className = service.icon;
                    }
                }
            });
        }
    }
}

// Инициализируем при загрузке
new EnhancedContentUpdater();

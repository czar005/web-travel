// Enhanced content updater with support for stats and services
function ContentUpdater() {
    this.appliedChanges = new Set();
    this.init();
}

ContentUpdater.prototype.init = function() {
    console.log('🚀 Enhanced ContentUpdater initialized');
    
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

ContentUpdater.prototype.applyAllChanges = function() {
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

    console.log('🔄 Applying changes from DataManager...');
    
    this.applyContentChanges(data.content);
    this.applyContactChanges(data.contacts);
    this.applySettingsChanges(data.settings);
    this.applyStatsChanges(data.content);
    this.applyServicesChanges(data.content);
    
    this.appliedChanges.add(changeHash);
    console.log('✅ Changes applied successfully');
};

ContentUpdater.prototype.applyLocalChanges = function() {
    var localData = localStorage.getItem('worldtravel_data');
    if (localData) {
        try {
            var data = JSON.parse(localData);
            console.log('📁 Applying local changes...');
            this.applyContentChanges(data.content);
            this.applyContactChanges(data.contacts);
            this.applySettingsChanges(data.settings);
            this.applyStatsChanges(data.content);
            this.applyServicesChanges(data.content);
        } catch (error) {
            console.error('❌ Error applying local changes:', error);
        }
    }
};

ContentUpdater.prototype.applyStatsChanges = function(content) {
    if (!content?.about?.stats) {
        // Если статистики нет, скрываем блок
        this.hideStatsSection();
        return;
    }

    var stats = content.about.stats;
    
    // Фильтруем только валидные статистики
    var validStats = stats.filter(stat => stat.value && stat.label);
    
    if (validStats.length === 0) {
        this.hideStatsSection();
        return;
    }
    
    console.log('📊 Applying stats changes:', validStats.length, 'valid items');
    
    var statElements = document.querySelectorAll('.stat');
    
    // Показываем блок статистики
    this.showStatsSection();
    
    if (statElements.length >= validStats.length) {
        validStats.forEach(function(stat, index) {
            if (statElements[index]) {
                var valueElement = statElements[index].querySelector('h3');
                var labelElement = statElements[index].querySelector('p');
                
                if (valueElement) {
                    valueElement.textContent = stat.value;
                    // Добавляем атрибут для анимации счетчика
                    if (!valueElement.hasAttribute('data-target')) {
                        valueElement.setAttribute('data-target', stat.value);
                    }
                }
                if (labelElement) {
                    labelElement.textContent = stat.label;
                }
                
                // Показываем элемент
                statElements[index].style.display = 'block';
            }
        });
        
        // Скрываем лишние элементы
        for (var i = validStats.length; i < statElements.length; i++) {
            statElements[i].style.display = 'none';
        }
    }
};

ContentUpdater.prototype.hideStatsSection = function() {
    var statsContainer = document.querySelector('.stats');
    if (statsContainer) {
        statsContainer.style.display = 'none';
    }
};

ContentUpdater.prototype.showStatsSection = function() {
    var statsContainer = document.querySelector('.stats');
    if (statsContainer) {
        statsContainer.style.display = 'flex';
    }
};

ContentUpdater.prototype.applyServicesChanges = function(content) {
    if (!content?.services?.services) {
        // Если услуг нет, скрываем блок
        this.hideServicesSection();
        return;
    }

    var services = content.services.services;
    
    // Фильтруем только валидные услуги
    var validServices = services.filter(service => service.title && service.description);
    
    if (validServices.length === 0) {
        this.hideServicesSection();
        return;
    }
    
    console.log('🎯 Applying services changes:', validServices.length, 'valid items');
    
    var serviceCards = document.querySelectorAll('.service-card');
    
    // Показываем блок услуг
    this.showServicesSection();
    
    if (serviceCards.length >= validServices.length) {
        validServices.forEach(function(service, index) {
            if (serviceCards[index]) {
                var titleElement = serviceCards[index].querySelector('h3');
                var descElement = serviceCards[index].querySelector('p');
                var iconElement = serviceCards[index].querySelector('.service-icon i');
                
                if (titleElement) titleElement.textContent = service.title;
                if (descElement) descElement.textContent = service.description;
                if (iconElement && service.icon) {
                    iconElement.className = service.icon;
                }
                
                // Показываем карточку
                serviceCards[index].style.display = 'block';
            }
        });
        
        // Скрываем лишние карточки
        for (var i = validServices.length; i < serviceCards.length; i++) {
            serviceCards[i].style.display = 'none';
        }
    }
};

ContentUpdater.prototype.hideServicesSection = function() {
    var servicesGrid = document.querySelector('.services-grid');
    if (servicesGrid) {
        servicesGrid.style.display = 'none';
    }
};

ContentUpdater.prototype.showServicesSection = function() {
    var servicesGrid = document.querySelector('.services-grid');
    if (servicesGrid) {
        servicesGrid.style.display = 'grid';
    }
};

// Остальные методы остаются без изменений
ContentUpdater.prototype.applyContentChanges = function(content) {
    if (!content) return;

    // Hero section
    if (content.hero) {
        this.updateElement('#home h1, .hero h1', content.hero.title);
        this.updateElement('#home p, .hero p', content.hero.subtitle);
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

    // Destinations section
    if (content.destinations) {
        this.updateElement('#destinations .section-title', content.destinations.title);
        this.updateElement('.destinations .section-subtitle', content.destinations.subtitle);
    }

    // Contact section
    if (content.contact) {
        this.updateElement('#contact .section-title', content.contact.title);
    }

    // Footer section
    if (content.footer) {
        this.updateElement('.footer-section:first-child p', content.footer.description);
        this.updateElement('.footer-bottom p', content.footer.copyright, true);
    }
};

ContentUpdater.prototype.applyContactChanges = function(contacts) {
    if (!contacts) return;

    // Правильный порядок контактов
    if (contacts.phone) {
        this.updateElement('.contact-info .contact-item:nth-child(1) p', contacts.phone);
        this.updateElement('.footer-section:nth-child(3) p:nth-child(1)', contacts.phone);
    }
    if (contacts.email) {
        this.updateElement('.contact-info .contact-item:nth-child(2) p', contacts.email);
        this.updateElement('.footer-section:nth-child(3) p:nth-child(2)', contacts.email);
    }
    if (contacts.address) {
        this.updateElement('.contact-info .contact-item:nth-child(3) p', contacts.address);
        this.updateElement('.footer-section:nth-child(3) p:nth-child(3)', contacts.address);
    }
    if (contacts.hours) {
        this.updateElement('.contact-info .contact-item:nth-child(4) p', contacts.hours);
        this.updateElement('.footer-section:nth-child(3) p:nth-child(4)', contacts.hours);
    }
};

ContentUpdater.prototype.applySettingsChanges = function(settings) {
    if (!settings) return;

    if (settings.siteTitle) {
        document.title = settings.siteTitle;
    }
};

ContentUpdater.prototype.updateElement = function(selector, content, isHTML) {
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

ContentUpdater.prototype.getDataHash = function(data) {
    return JSON.stringify({
        content: data.content,
        contacts: data.contacts,
        settings: data.settings,
        timestamp: data.lastUpdate
    });
};

// Initialize enhanced content updater
var contentUpdater = new ContentUpdater();

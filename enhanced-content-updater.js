// Улучшенный ContentUpdater с обновлением навигации и футера
function EnhancedContentUpdater() {
    this.appliedChanges = new Set();
    this.init();
}

EnhancedContentUpdater.prototype.init = function() {
    console.log('�� Enhanced ContentUpdater initialized');
    
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

EnhancedContentUpdater.prototype.applyAllChanges = function() {
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
    this.applyNavigationChanges(data.content);
    this.applyFooterChanges(data.content);
    
    this.appliedChanges.add(changeHash);
    console.log('✅ Changes applied successfully');
};

EnhancedContentUpdater.prototype.applyNavigationChanges = function(content) {
    if (!content) return;

    console.log('🧭 Updating navigation...');
    
    // Обновляем навигацию на основе заголовков секций
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const sectionId = href.substring(1);
            if (content[sectionId] && content[sectionId].title) {
                link.textContent = content[sectionId].title;
                console.log(`✅ Navigation updated: ${sectionId} -> ${content[sectionId].title}`);
            }
        }
    });

    // Обновляем админ-ссылку если есть
    const adminLink = document.querySelector('.admin-link');
    if (adminLink) {
        adminLink.innerHTML = '<i class="fas fa-cog"></i> Админка';
    }
};

EnhancedContentUpdater.prototype.applyFooterChanges = function(content) {
    if (!content) return;

    console.log('�� Updating footer...');
    
    // Обновляем заголовки в футере
    const footerLinks = document.querySelectorAll('.footer-section:nth-child(2) a');
    footerLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const sectionId = href.substring(1);
            if (content[sectionId] && content[sectionId].title) {
                link.textContent = content[sectionId].title;
                console.log(`✅ Footer updated: ${sectionId} -> ${content[sectionId].title}`);
            }
        }
    });
};

EnhancedContentUpdater.prototype.applyContentChanges = function(content) {
    if (!content) return;

    // Hero section
    if (content.hero) {
        this.updateElement('#home h1, .hero h1', content.hero.title);
        this.updateElement('#home p, .hero p', content.hero.subtitle);
        if (content.hero.image) {
            this.updateImages('.hero-image img', content.hero.image);
        }
    }

    // About section
    if (content.about) {
        this.updateElement('#about .section-title', content.about.title);
        this.updateElement('.about-text p', content.about.description);
        if (content.about.image) {
            this.updateImages('.about-image img', content.about.image);
        }
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

EnhancedContentUpdater.prototype.applyContactChanges = function(contacts) {
    if (!contacts) return;

    console.log('📞 Applying contact changes...');

    // Обновляем контакты в секции контактов
    if (contacts.phone) {
        this.updateElement('.contact-info .contact-item:nth-child(1) p', contacts.phone);
    }
    if (contacts.email) {
        this.updateElement('.contact-info .contact-item:nth-child(2) p', contacts.email);
    }
    if (contacts.address) {
        this.updateElement('.contact-info .contact-item:nth-child(3) p', contacts.address);
    }
    if (contacts.hours) {
        this.updateElement('.contact-info .contact-item:nth-child(4) p', contacts.hours);
    }

    // Обновляем контакты в футере
    if (contacts.phone) {
        this.updateElement('.footer-section:nth-child(3) p:nth-child(1)', contacts.phone);
    }
    if (contacts.email) {
        this.updateElement('.footer-section:nth-child(3) p:nth-child(2)', contacts.email);
    }
    if (contacts.address) {
        this.updateElement('.footer-section:nth-child(3) p:nth-child(3)', contacts.address);
    }
    if (contacts.hours) {
        this.updateElement('.footer-section:nth-child(3) p:nth-child(4)', contacts.hours);
    }
};

EnhancedContentUpdater.prototype.applySettingsChanges = function(settings) {
    if (!settings) return;

    if (settings.siteTitle) {
        document.title = settings.siteTitle;
    }
};

EnhancedContentUpdater.prototype.updateElement = function(selector, content, isHTML) {
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

EnhancedContentUpdater.prototype.updateImages = function(selector, src) {
    var elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
        elements.forEach(function(element) {
            element.src = src;
        });
    }
};

EnhancedContentUpdater.prototype.getDataHash = function(data) {
    return JSON.stringify({
        content: data.content,
        contacts: data.contacts,
        settings: data.settings,
        timestamp: data.lastUpdate
    });
};

// Initialize enhanced content updater
var contentUpdater = new EnhancedContentUpdater();

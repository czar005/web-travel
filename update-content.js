// Enhanced content updater with reliable change application and custom sections support
function ContentUpdater() {
    this.appliedChanges = new Set();
    this.init();
}

ContentUpdater.prototype.init = function() {
    console.log('🚀 ContentUpdater initialized');
    
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

    if (window.location.search.includes('editor=true')) {
        setTimeout(function() { self.applyAllChanges(); }, 500);
    }
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
    this.applyCustomSections(data);
    
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
            this.applyCustomSections(data);
        } catch (error) {
            console.error('❌ Error applying local changes:', error);
        }
    }
};

ContentUpdater.prototype.getDataHash = function(data) {
    return JSON.stringify({
        content: data.content,
        contacts: data.contacts,
        settings: data.settings,
        pageStructure: data.pageStructure,
        timestamp: data.lastUpdate
    });
};

ContentUpdater.prototype.applyContentChanges = function(content) {
    if (!content) return;

    console.log('📝 Applying content changes:', content);

    // Hero section
    if (content.hero) {
        this.updateElement('#home h1, .hero h1, section:first-of-type h1', content.hero.title);
        this.updateElement('#home p, .hero p, section:first-of-type p', content.hero.subtitle);
        if (content.hero.image) {
            this.updateImages('.hero-image img, .image-placeholder img', content.hero.image);
        }
    }

    // About section
    if (content.about) {
        this.updateElement('#about .section-title, .about .section-title, section:nth-of-type(2) .section-title', content.about.title);
        this.updateElement('.about-text p, #about p, .about p, section:nth-of-type(2) p', content.about.description);
        
        if (content.about.image) {
            this.updateImages('.about-image img, .image-placeholder img', content.about.image);
        }
        
        this.updateNavigation('about', content.about.title);
        
        if (content.about.stats) {
            this.updateStats(content.about.stats);
        }
    }

    // Services section
    if (content.services) {
        this.updateElement('#services .section-title, .services .section-title, section:nth-of-type(3) .section-title', content.services.title);
        this.updateNavigation('services', content.services.title);
        
        if (content.services.services) {
            this.updateServices(content.services.services);
        }
    }

    // Destinations section
    if (content.destinations) {
        this.updateElement('#destinations .section-title, .destinations .section-title, section:nth-of-type(4) .section-title', content.destinations.title);
        this.updateElement('.destinations .section-subtitle, .section-subtitle, section:nth-of-type(4) .section-subtitle', content.destinations.subtitle);
        this.updateNavigation('destinations', content.destinations.title);
    }

    // Contact section
    if (content.contact) {
        this.updateElement('#contact .section-title, .contact .section-title, section:nth-of-type(5) .section-title', content.contact.title);
        this.updateNavigation('contact', content.contact.title);
    }

    // Footer section
    if (content.footer) {
        this.updateElement('.footer-section:first-child p:first-child', content.footer.description);
        this.updateElement('.footer-bottom p', content.footer.copyright, true);
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
        console.log('✅ Updated element:', selector);
    } else {
        console.log('❌ Element not found:', selector);
    }
};

ContentUpdater.prototype.updateImages = function(selector, src) {
    var elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
        elements.forEach(function(element) {
            element.src = src;
        });
        console.log('✅ Updated image:', selector);
    }
};

ContentUpdater.prototype.updateNavigation = function(sectionId, title) {
    var navLinks = document.querySelectorAll('.nav-links a[href="#' + sectionId + '"]');
    if (navLinks.length > 0) {
        navLinks.forEach(function(link) {
            link.textContent = title;
        });
    }
};

ContentUpdater.prototype.updateStats = function(stats) {
    var statElements = document.querySelectorAll('.stat');
    if (statElements.length >= stats.length) {
        stats.forEach(function(stat, index) {
            if (statElements[index]) {
                var valueElement = statElements[index].querySelector('h3');
                var labelElement = statElements[index].querySelector('p');
                if (valueElement) valueElement.textContent = stat.value;
                if (labelElement) labelElement.textContent = stat.label;
            }
        });
    }
};

ContentUpdater.prototype.updateServices = function(services) {
    var serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length >= services.length) {
        services.forEach(function(service, index) {
            if (serviceCards[index]) {
                var titleElement = serviceCards[index].querySelector('h3');
                var descElement = serviceCards[index].querySelector('p');
                var iconElement = serviceCards[index].querySelector('.service-icon i');
                
                if (titleElement) titleElement.textContent = service.title;
                if (descElement) descElement.textContent = service.description;
                if (iconElement && service.icon) {
                    iconElement.className = service.icon;
                }
            }
        });
    }
};

ContentUpdater.prototype.applyContactChanges = function(contacts) {
    if (!contacts) return;

    if (contacts.phone) {
        this.updateElement('.contact-info .contact-item:nth-child(1) p, .contact-item:first-child p', contacts.phone);
    }
    if (contacts.email) {
        this.updateElement('.contact-info .contact-item:nth-child(2) p, .contact-item:nth-child(2) p', contacts.email);
    }
    if (contacts.address) {
        this.updateElement('.contact-info .contact-item:nth-child(3) p, .contact-item:nth-child(3) p', contacts.address);
    }
    if (contacts.hours) {
        this.updateElement('.contact-info .contact-item:nth-child(4) p, .contact-item:nth-child(4) p', contacts.hours);
    }
};

ContentUpdater.prototype.applySettingsChanges = function(settings) {
    if (!settings) return;

    if (settings.siteTitle) {
        document.title = settings.siteTitle;
    }
};

ContentUpdater.prototype.applyCustomSections = function(data) {
    if (!data.pageStructure || !data.content) return;

    console.log('🔄 Applying custom sections...');

    var customSectionsContainer = document.getElementById('custom-sections');
    if (!customSectionsContainer) {
        customSectionsContainer = document.createElement('div');
        customSectionsContainer.id = 'custom-sections';
        var footer = document.querySelector('footer');
        if (footer) {
            footer.parentNode.insertBefore(customSectionsContainer, footer);
        }
    }

    customSectionsContainer.innerHTML = '';

    var self = this;
    data.pageStructure.forEach(function(sectionId) {
        if (sectionId.startsWith('section-') && data.content[sectionId]) {
            self.renderCustomSection(customSectionsContainer, data.content[sectionId]);
        }
    });
};

ContentUpdater.prototype.renderCustomSection = function(container, sectionData) {
    var sectionElement = document.createElement('section');
    sectionElement.className = 'custom-section ' + sectionData.type + '-section';
    sectionElement.id = sectionData.id;

    var html = '';
    switch (sectionData.type) {
        case 'text':
            html = '\
                <div class="container">\
                    <h2 class="section-title">' + (sectionData.title || '') + '</h2>\
                    <div class="section-content">\
                        <p>' + (sectionData.content || '') + '</p>\
                    </div>\
                </div>\
            ';
            break;
        case 'image':
            html = '\
                <div class="container">\
                    <div class="section-content" style="display: flex; gap: 30px; align-items: center;">\
                        <div class="text-content" style="flex: 1;">\
                            <h2 class="section-title">' + (sectionData.title || '') + '</h2>\
                            <p>' + (sectionData.content || '') + '</p>\
                        </div>\
                        <div class="image-content" style="flex: 1;">\
                            ' + (sectionData.image ? '<img src="' + sectionData.image + '" alt="' + (sectionData.title || '') + '" style="max-width: 100%; border-radius: 10px;">' : '') + '\
                        </div>\
                    </div>\
                </div>\
            ';
            break;
        case 'features':
            var featuresHtml = (sectionData.features || []).map(function(feature) {
                return '\
                    <div class="feature-item" style="text-align: center; padding: 20px;">\
                        <div class="feature-icon" style="font-size: 2em; margin-bottom: 15px; color: #2c5aa0;">\
                            <i class="' + (feature.icon || 'fas fa-star') + '"></i>\
                        </div>\
                        <h3 style="margin-bottom: 10px;">' + (feature.title || '') + '</h3>\
                        <p style="color: #666;">' + (feature.description || '') + '</p>\
                    </div>\
                ';
            }).join('');
            
            html = '\
                <div class="container">\
                    <h2 class="section-title">' + (sectionData.title || '') + '</h2>\
                    <div class="features-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; margin-top: 40px;">\
                        ' + featuresHtml + '\
                    </div>\
                </div>\
            ';
            break;
        case 'cta':
            html = '\
                <div class="container">\
                    <div class="cta-section" style="text-align: center; padding: 60px 20px; background: linear-gradient(135deg, #2c5aa0, #4a7bc8); color: white; border-radius: 15px;">\
                        <h2 style="margin-bottom: 20px;">' + (sectionData.title || '') + '</h2>\
                        <p style="margin-bottom: 30px; font-size: 1.1em;">' + (sectionData.description || '') + '</p>\
                        ' + (sectionData.buttonText ? '\
                            <a href="' + (sectionData.buttonUrl || '#') + '" class="cta-button" style="background: white; color: #2c5aa0; padding: 15px 30px; border-radius: 25px; text-decoration: none; font-weight: 600; display: inline-block;">\
                                ' + sectionData.buttonText + '\
                            </a>\
                        ' : '') + '\
                    </div>\
                </div>\
            ';
            break;
    }

    sectionElement.innerHTML = html;
    sectionElement.style.padding = '80px 0';
    sectionElement.style.background = sectionData.type === 'cta' ? 'transparent' : '#f8f9fa';
    
    if (sectionData.type === 'cta') {
        sectionElement.style.padding = '40px 0';
    }

    container.appendChild(sectionElement);
};

// Initialize content updater
var contentUpdater = new ContentUpdater();

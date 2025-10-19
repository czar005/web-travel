// Fixed Enhanced Content Updater с исправлением ошибок Blob URL
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
        footer: data.footer,
        timestamp: Date.now()
    });
    
    if (this.appliedChanges.has(changeHash)) {
        return;
    }
    
    console.log('🔄 Applying content changes...', data);
    
    try {
        this.updateContent(data.content);
        this.updateNavigation(data.content);
        this.updateFooter(data.footer);
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
        this.safeUpdateImage('.hero-image img', content.hero.image);
        this.safeUpdateImage('.hero .image-placeholder img', content.hero.image);
    }
    
    // About section
    if (content.about) {
        this.updateText('#about .section-title', content.about.title);
        this.updateText('.about-text p', content.about.description);
        this.safeUpdateImage('.about-image img', content.about.image);
        this.safeUpdateImage('.about .image-placeholder img', content.about.image);
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
};

EnhancedContentUpdaterFixed.prototype.updateNavigation = function(content) {
    if (!content) return;
    
    console.log('�� Updating navigation...');
    
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

EnhancedContentUpdaterFixed.prototype.updateFooter = function(footer) {
    if (!footer) return;
    
    console.log('🦶 Updating footer...', footer);
    
    // Update footer description
    if (footer.description) {
        this.updateText('.footer-section:first-child p', footer.description);
    }
    
    // Update footer copyright
    if (footer.copyright) {
        this.updateHTML('.footer-bottom p', footer.copyright);
    }
};

EnhancedContentUpdaterFixed.prototype.updateContacts = function(contacts) {
    if (!contacts) return;
    
    console.log('📞 Updating contacts...', contacts);
    
    // Update contact section - ПРАВИЛЬНЫЙ ПОРЯДОК
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
    if (!stats || !Array.isArray(stats)) {
        this.hideStatsSection();
        return;
    }
    
    const validStats = stats.filter(stat => stat && stat.value && stat.label);
    
    if (validStats.length === 0) {
        this.hideStatsSection();
        return;
    }
    
    console.log('📊 Updating stats...', validStats);
    
    const statElements = document.querySelectorAll('.stat');
    if (statElements.length === 0) return;
    
    this.showStatsSection();
    
    validStats.forEach((stat, index) => {
        if (statElements[index]) {
            const valueEl = statElements[index].querySelector('h3');
            const labelEl = statElements[index].querySelector('p');
            
            if (valueEl && stat.value) {
                valueEl.textContent = stat.value;
                valueEl.setAttribute('data-target', stat.value);
            }
            if (labelEl && stat.label) {
                labelEl.textContent = stat.label;
            }
            
            statElements[index].style.display = 'block';
        }
    });
    
    for (let i = validStats.length; i < statElements.length; i++) {
        statElements[i].style.display = 'none';
    }
};

EnhancedContentUpdaterFixed.prototype.hideStatsSection = function() {
    const statsContainer = document.querySelector('.stats');
    if (statsContainer) {
        statsContainer.style.display = 'none';
    }
};

EnhancedContentUpdaterFixed.prototype.showStatsSection = function() {
    const statsContainer = document.querySelector('.stats');
    if (statsContainer) {
        statsContainer.style.display = 'flex';
        const statElements = statsContainer.querySelectorAll('.stat');
        statElements.forEach(stat => {
            stat.style.display = 'block';
        });
    }
};

EnhancedContentUpdaterFixed.prototype.updateServices = function(services) {
    if (!services || !Array.isArray(services)) {
        this.hideServicesSection();
        return;
    }
    
    const validServices = services.filter(service => 
        service && service.title && service.description
    );
    
    if (validServices.length === 0) {
        this.hideServicesSection();
        return;
    }
    
    console.log('🎯 Updating services...', validServices);
    
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length === 0) return;
    
    this.showServicesSection();
    
    validServices.forEach((service, index) => {
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
            
            serviceCards[index].style.display = 'block';
        }
    });
    
    for (let i = validServices.length; i < serviceCards.length; i++) {
        serviceCards[i].style.display = 'none';
    }
};

EnhancedContentUpdaterFixed.prototype.hideServicesSection = function() {
    const servicesGrid = document.querySelector('.services-grid');
    if (servicesGrid) {
        servicesGrid.style.display = 'none';
    }
};

EnhancedContentUpdaterFixed.prototype.showServicesSection = function() {
    const servicesGrid = document.querySelector('.services-grid');
    if (servicesGrid) {
        servicesGrid.style.display = 'grid';
        const serviceCards = servicesGrid.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.style.display = 'block';
        });
    }
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

// БЕЗОПАСНОЕ обновление изображений - игнорирует Blob URL ошибки
EnhancedContentUpdaterFixed.prototype.safeUpdateImage = function(selector, src) {
    if (!src) return;
    
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        // Пропускаем Blob URL чтобы избежать ошибок
        if (src.startsWith('blob:')) {
            console.log('⚠️ Skipping blob URL to prevent errors:', src);
            return;
        }
        
        if (element.src !== src) {
            element.src = src;
            
            // Тихий обработчик ошибок для изображений
            element.onerror = () => {
                // Не логируем ошибки чтобы не засорять консоль
                if (!src.startsWith('blob:')) {
                    element.src = 'images/travel-placeholder.svg';
                }
            };
        }
    });
};

// Initialize fixed content updater
new EnhancedContentUpdaterFixed();

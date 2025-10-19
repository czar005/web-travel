// Fixed Enhanced Content Updater с исправлением ошибок Blob URL
function EnhancedContentUpdaterFixed() {
    this.appliedChanges = new Set();
    this.failedImages = new Set(); // Трекер неудачных загрузок изображений
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
        this.updateImage('.hero-image img', content.hero.image);
        this.updateImage('.hero .image-placeholder img', content.hero.image);
    }
    
    // About section
    if (content.about) {
        this.updateText('#about .section-title', content.about.title);
        this.updateText('.about-text p', content.about.description);
        this.updateImage('.about-image img', content.about.image);
        this.updateImage('.about .image-placeholder img', content.about.image);
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
    
    console.log('🧭 Updating navigation...');
    
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
    
    // Update footer links based on content (если нужно)
    const footerLinks = document.querySelectorAll('.footer-section:nth-child(2) a');
    footerLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const sectionId = href.substring(1);
            // Здесь можно обновить текст ссылок если нужно
        }
    });
};

EnhancedContentUpdaterFixed.prototype.updateContacts = function(contacts) {
    if (!contacts) return;
    
    console.log('📞 Updating contacts...', contacts);
    
    // Update contact section - ПРАВИЛЬНЫЙ ПОРЯДОК
    if (contacts.phone) {
        // Телефон - первый элемент
        this.updateText('.contact-info .contact-item:nth-child(1) p', contacts.phone);
        this.updateText('.footer-section:nth-child(3) p:nth-child(1)', contacts.phone);
    }
    if (contacts.email) {
        // Email - второй элемент  
        this.updateText('.contact-info .contact-item:nth-child(2) p', contacts.email);
        this.updateText('.footer-section:nth-child(3) p:nth-child(2)', contacts.email);
    }
    if (contacts.address) {
        // Адрес - третий элемент
        this.updateText('.contact-info .contact-item:nth-child(3) p', contacts.address);
        this.updateText('.footer-section:nth-child(3) p:nth-child(3)', contacts.address);
    }
    if (contacts.hours) {
        // График работы - четвертый элемент
        this.updateText('.contact-info .contact-item:nth-child(4) p', contacts.hours);
        this.updateText('.footer-section:nth-child(3) p:nth-child(4)', contacts.hours);
    }
};

EnhancedContentUpdaterFixed.prototype.updateStats = function(stats) {
    if (!stats || !Array.isArray(stats)) {
        // Если статистики нет или она пустая, скрываем блок статистики
        this.hideStatsSection();
        return;
    }
    
    // Фильтруем пустые значения
    const validStats = stats.filter(stat => stat && stat.value && stat.label);
    
    if (validStats.length === 0) {
        this.hideStatsSection();
        return;
    }
    
    console.log('📊 Updating stats...', validStats);
    
    const statElements = document.querySelectorAll('.stat');
    if (statElements.length === 0) return;
    
    // Показываем блок статистики
    this.showStatsSection();
    
    validStats.forEach((stat, index) => {
        if (statElements[index]) {
            const valueEl = statElements[index].querySelector('h3');
            const labelEl = statElements[index].querySelector('p');
            
            if (valueEl && stat.value) {
                valueEl.textContent = stat.value;
                // Обновляем атрибут для анимации счетчика
                valueEl.setAttribute('data-target', stat.value);
            }
            if (labelEl && stat.label) {
                labelEl.textContent = stat.label;
            }
            
            statElements[index].style.display = 'block';
        }
    });
    
    // Скрываем лишние элементы статистики если их больше чем данных
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
        // Показываем все элементы статистики
        const statElements = statsContainer.querySelectorAll('.stat');
        statElements.forEach(stat => {
            stat.style.display = 'block';
        });
    }
};

EnhancedContentUpdaterFixed.prototype.updateServices = function(services) {
    if (!services || !Array.isArray(services)) {
        // Если услуг нет или они пустые, скрываем блок услуг
        this.hideServicesSection();
        return;
    }
    
    // Фильтруем пустые значения
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
    
    // Показываем блок услуг
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
    
    // Скрываем лишние карточки услуг если их больше чем данных
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
        // Показываем все карточки услуг
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

EnhancedContentUpdaterFixed.prototype.updateImage = function(selector, src) {
    if (!src) return;
    
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        // Проверяем, является ли src Blob URL и не была ли уже неудачная попытка загрузки
        const isBlobUrl = src.startsWith('blob:');
        const imageKey = selector + '|' + src;
        
        if (isBlobUrl && this.failedImages.has(imageKey)) {
            console.log('⚠️ Skipping failed blob URL:', src);
            return;
        }
        
        if (element.src !== src) {
            element.src = src;
            
            // Улучшенный обработчик ошибок загрузки изображения
            element.onerror = () => {
                console.error('❌ Failed to load image:', src);
                
                // Добавляем в список неудачных загрузок
                this.failedImages.add(imageKey);
                
                // Для Blob URL используем заглушку, для обычных URL оставляем как есть
                if (isBlobUrl) {
                    console.log('🔄 Replacing failed blob URL with placeholder');
                    element.src = 'images/travel-placeholder.svg';
                    
                    // Обновляем данные, чтобы убрать неработающий Blob URL
                    this.fixBrokenImageInData(selector, src);
                }
            };
            
            // Сбрасываем ошибку если изображение загрузилось успешно
            element.onload = () => {
                if (this.failedImages.has(imageKey)) {
                    this.failedImages.delete(imageKey);
                    console.log('✅ Image loaded successfully after previous failure:', src);
                }
            };
        }
    });
};

// Новый метод для исправления битых изображений в данных
EnhancedContentUpdaterFixed.prototype.fixBrokenImageInData = function(selector, brokenSrc) {
    try {
        const data = this.getData();
        if (!data || !data.content) return;
        
        let imageFixed = false;
        
        // Ищем и исправляем битые изображения в разных секциях
        Object.keys(data.content).forEach(sectionKey => {
            const section = data.content[sectionKey];
            if (section && section.image === brokenSrc) {
                section.image = 'images/travel-placeholder.svg';
                imageFixed = true;
                console.log('🔧 Fixed broken image in section:', sectionKey);
            }
        });
        
        // Сохраняем исправленные данные
        if (imageFixed) {
            this.saveFixedData(data);
        }
    } catch (error) {
        console.error('Error fixing broken image in data:', error);
    }
};

// Метод для сохранения исправленных данных
EnhancedContentUpdaterFixed.prototype.saveFixedData = function(data) {
    try {
        // Сохраняем в localStorage
        localStorage.setItem('worldtravel_data', JSON.stringify(data));
        
        // Обновляем в DataManager если доступен
        if (window.dataManager && window.dataManager.setData) {
            window.dataManager.setData(data);
        }
        
        console.log('💾 Fixed data saved successfully');
        
        // Обновляем привязки изменений
        this.appliedChanges.clear();
        
    } catch (error) {
        console.error('Error saving fixed data:', error);
    }
};

// Initialize fixed content updater
new EnhancedContentUpdaterFixed();

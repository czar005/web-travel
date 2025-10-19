// Enhanced content updater with reliable change application and custom sections support
class ContentUpdater {
// Исправления для ContentUpdater

class FixedContentUpdater extends ContentUpdater {
    applyCustomSections(data) {
        if (!data.pageStructure || !data.content) return;

        console.log('🔄 Applying custom sections with order:', data.pageStructure);

        // Создаем контейнер для пользовательских секций перед футером
        let customSectionsContainer = document.getElementById('custom-sections');
        if (!customSectionsContainer) {
            customSectionsContainer = document.createElement('div');
            customSectionsContainer.id = 'custom-sections';
            const footer = document.querySelector('footer');
            const contact = document.querySelector('#contact');
            const insertBefore = footer || document.body.lastElementChild;
            
            if (insertBefore) {
                insertBefore.parentNode.insertBefore(customSectionsContainer, insertBefore);
            } else {
                document.body.appendChild(customSectionsContainer);
            }
        }

        // Очищаем контейнер
        customSectionsContainer.innerHTML = '';

        // Добавляем секции согласно структуре страницы
        data.pageStructure.forEach(sectionId => {
            // Пропускаем стандартные секции (они уже есть на странице)
            const standardSections = ['hero', 'about', 'services', 'destinations', 'contact', 'footer'];
            if (standardSections.includes(sectionId)) return;

            if (data.content[sectionId]) {
                this.renderCustomSection(customSectionsContainer, data.content[sectionId]);
            }
        });

        // Если есть пользовательские секции, добавляем стили
        if (customSectionsContainer.children.length > 0) {
            this.ensureCustomStyles();
        }
    }

    applyContentChanges(content) {
        if (!content) return;

        console.log('📝 Applying content changes to page structure');

        // Обновляем стандартные секции
        super.applyContentChanges(content);

        // Применяем пользовательские секции с правильным порядком
        this.applyCustomSections(this.getCurrentData());
    }

    // Улучшаем получение текущих данных
    getCurrentData() {
        // Try multiple sources for data
        if (typeof window.dataManager !== 'undefined' && window.dataManager) {
            const data = window.dataManager.getData();
            if (data && data.pageStructure) {
                console.log('📁 Using DataManager data with page structure:', data.pageStructure);
                return data;
            }
        }

        // Try localStorage
        try {
            const localData = localStorage.getItem('worldtravel_data');
            if (localData) {
                const data = JSON.parse(localData);
                if (data.pageStructure) {
                    console.log('📁 Using localStorage data with page structure:', data.pageStructure);
                    return data;
                }
            }
        } catch (error) {
            console.error('Error parsing localStorage data:', error);
        }

        return this.getDefaultData();
    }

    getDefaultData() {
        return {
            content: {},
            pageStructure: ['hero', 'about', 'services', 'destinations', 'contact'],
            lastUpdate: new Date().toISOString()
        };
    }
}

// Заменяем оригинальный ContentUpdater на исправленный
window.contentUpdater = new FixedContentUpdater();
// Исправления для ContentUpdater

class FixedContentUpdater extends ContentUpdater {
    applyCustomSections(data) {
        if (!data.pageStructure || !data.content) return;

        console.log('🔄 Applying custom sections with order:', data.pageStructure);

        // Создаем контейнер для пользовательских секций перед футером
        let customSectionsContainer = document.getElementById('custom-sections');
        if (!customSectionsContainer) {
            customSectionsContainer = document.createElement('div');
            customSectionsContainer.id = 'custom-sections';
            const footer = document.querySelector('footer');
            const contact = document.querySelector('#contact');
            const insertBefore = footer || document.body.lastElementChild;
            
            if (insertBefore) {
                insertBefore.parentNode.insertBefore(customSectionsContainer, insertBefore);
            } else {
                document.body.appendChild(customSectionsContainer);
            }
        }

        // Очищаем контейнер
        customSectionsContainer.innerHTML = '';

        // Добавляем секции согласно структуре страницы
        data.pageStructure.forEach(sectionId => {
            // Пропускаем стандартные секции (они уже есть на странице)
            const standardSections = ['hero', 'about', 'services', 'destinations', 'contact', 'footer'];
            if (standardSections.includes(sectionId)) return;

            if (data.content[sectionId]) {
                this.renderCustomSection(customSectionsContainer, data.content[sectionId]);
            }
        });

        // Если есть пользовательские секции, добавляем стили
        if (customSectionsContainer.children.length > 0) {
            this.ensureCustomStyles();
        }
    }

    applyContentChanges(content) {
        if (!content) return;

        console.log('📝 Applying content changes to page structure');

        // Обновляем стандартные секции
        super.applyContentChanges(content);

        // Применяем пользовательские секции с правильным порядком
        this.applyCustomSections(this.getCurrentData());
    }

    // Улучшаем получение текущих данных
    getCurrentData() {
        // Try multiple sources for data
        if (typeof window.dataManager !== 'undefined' && window.dataManager) {
            const data = window.dataManager.getData();
            if (data && data.pageStructure) {
                console.log('📁 Using DataManager data with page structure:', data.pageStructure);
                return data;
            }
        }

        // Try localStorage
        try {
            const localData = localStorage.getItem('worldtravel_data');
            if (localData) {
                const data = JSON.parse(localData);
                if (data.pageStructure) {
                    console.log('📁 Using localStorage data with page structure:', data.pageStructure);
                    return data;
                }
            }
        } catch (error) {
            console.error('Error parsing localStorage data:', error);
        }

        return this.getDefaultData();
    }

    getDefaultData() {
        return {
            content: {},
            pageStructure: ['hero', 'about', 'services', 'destinations', 'contact'],
            lastUpdate: new Date().toISOString()
        };
    }
}

// Заменяем оригинальный ContentUpdater на исправленный
window.contentUpdater = new FixedContentUpdater();
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

        // Listen for storage changes (from editor)
        window.addEventListener('storage', (e) => {
            if (e.key === 'worldtravel_data') {
                console.log('📦 Storage change detected, updating content...');
                setTimeout(() => this.applyAllChanges(), 100);
            }
        });

        // Periodic check for changes
        setInterval(() => this.applyAllChanges(), 3000);

        // Also apply changes when coming from editor
        if (window.location.search.includes('editor=true')) {
            setTimeout(() => this.applyAllChanges(), 500);
        }
    }

    applyAllChanges() {
        const data = this.getCurrentData();
        if (!data) {
            console.log('📭 No data available');
            return;
        }

        const changeHash = this.getDataHash(data);
        if (this.appliedChanges.has(changeHash)) {
            return; // Changes already applied
        }

        console.log('🔄 Applying changes to page...', {
            content: Object.keys(data.content || {}).length,
            contacts: data.contacts ? 'yes' : 'no',
            pageStructure: data.pageStructure ? data.pageStructure.length : 0
        });
        
        this.applyContentChanges(data.content);
        this.applyContactChanges(data.contacts);
        this.applySettingsChanges(data.settings);
        this.applyCustomSections(data);
        
        this.appliedChanges.add(changeHash);
        console.log('✅ Changes applied successfully');
    }

    getCurrentData() {
        // Try multiple sources for data
        if (typeof window.dataManager !== 'undefined' && window.dataManager) {
            const data = window.dataManager.getData();
            if (data) {
                console.log('📁 Using DataManager data');
                return data;
            }
        }

        // Try localStorage
        try {
            const localData = localStorage.getItem('worldtravel_data');
            if (localData) {
                const data = JSON.parse(localData);
                console.log('📁 Using localStorage data');
                return data;
            }
        } catch (error) {
            console.error('Error parsing localStorage data:', error);
        }

        return null;
    }

    getDataHash(data) {
        return JSON.stringify({
            content: data.content,
            contacts: data.contacts,
            settings: data.settings,
            pageStructure: data.pageStructure,
            timestamp: data.lastUpdate
        });
    }

    applyContentChanges(content) {
        if (!content) return;

        console.log('📝 Applying content changes:', Object.keys(content));

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
            
            // Обновляем изображение
            if (content.about.image) {
                this.updateImages('.about-image img, .image-placeholder img', content.about.image);
            }
            
            // Обновляем навигацию
            this.updateNavigation('about', content.about.title);
            
            if (content.about.stats) {
                this.updateStats(content.about.stats);
            }
        }

        // Services section
        if (content.services) {
            this.updateElement('#services .section-title, .services .section-title, section:nth-of-type(3) .section-title', content.services.title);
            
            // Обновляем навигацию
            this.updateNavigation('services', content.services.title);
            
            if (content.services.services) {
                this.updateServices(content.services.services);
            }
        }

        // Destinations section
        if (content.destinations) {
            this.updateElement('#destinations .section-title, .destinations .section-title, section:nth-of-type(4) .section-title', content.destinations.title);
            this.updateElement('.destinations .section-subtitle, .section-subtitle, section:nth-of-type(4) .section-subtitle', content.destinations.subtitle);
            
            // Обновляем навигацию
            this.updateNavigation('destinations', content.destinations.title);
        }

        // Contact section
        if (content.contact) {
            this.updateElement('#contact .section-title, .contact .section-title, section:nth-of-type(5) .section-title', content.contact.title);
            
            // Обновляем навигацию
            this.updateNavigation('contact', content.contact.title);
        }

        // Footer section
        if (content.footer) {
            this.updateElement('.footer-section:first-child p:first-child', content.footer.description);
            this.updateElement('.footer-bottom p', content.footer.copyright, true);
        }
    }

    applyCustomSections(data) {
        if (!data.pageStructure || !data.content) return;

        console.log('🔄 Applying custom sections...', data.pageStructure);

        // Создаем контейнер для пользовательских секций перед футером
        let customSectionsContainer = document.getElementById('custom-sections');
        if (!customSectionsContainer) {
            customSectionsContainer = document.createElement('div');
            customSectionsContainer.id = 'custom-sections';
            const footer = document.querySelector('footer');
            const contact = document.querySelector('#contact');
            const insertBefore = footer || document.body.lastElementChild;
            
            if (insertBefore) {
                insertBefore.parentNode.insertBefore(customSectionsContainer, insertBefore);
            } else {
                document.body.appendChild(customSectionsContainer);
            }
        }

        // Очищаем контейнер
        customSectionsContainer.innerHTML = '';

        // Добавляем пользовательские секции согласно структуре
        data.pageStructure.forEach(sectionId => {
            // Пропускаем стандартные секции
            const standardSections = ['hero', 'about', 'services', 'destinations', 'contact', 'footer'];
            if (standardSections.includes(sectionId)) return;

            if (data.content[sectionId]) {
                this.renderCustomSection(customSectionsContainer, data.content[sectionId]);
            }
        });

        // Если есть пользовательские секции, добавляем стили
        if (customSectionsContainer.children.length > 0) {
            this.ensureCustomStyles();
        }
    }

    renderCustomSection(container, sectionData) {
        const sectionElement = document.createElement('section');
        sectionElement.className = `custom-section ${sectionData.type}-section`;
        sectionElement.id = sectionData.id;
        sectionElement.setAttribute('data-section-id', sectionData.id);

        console.log('�� Rendering custom section:', sectionData.id, sectionData.type);

        switch (sectionData.type) {
            case 'text':
                sectionElement.innerHTML = `
                    <div class="container">
                        <h2 class="section-title">${sectionData.title || ''}</h2>
                        <div class="section-content">
                            <p>${sectionData.content || ''}</p>
                        </div>
                    </div>
                `;
                break;
            case 'image':
                sectionElement.innerHTML = `
                    <div class="container">
                        <div class="section-content" style="display: flex; gap: 30px; align-items: center; flex-wrap: wrap;">
                            <div class="text-content" style="flex: 1; min-width: 300px;">
                                <h2 class="section-title">${sectionData.title || ''}</h2>
                                <p>${sectionData.content || ''}</p>
                            </div>
                            <div class="image-content" style="flex: 1; min-width: 300px; text-align: center;">
                                ${sectionData.image ? `<img src="${sectionData.image}" alt="${sectionData.title}" style="max-width: 100%; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">` : ''}
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'features':
                sectionElement.innerHTML = `
                    <div class="container">
                        <h2 class="section-title">${sectionData.title || ''}</h2>
                        <div class="features-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; margin-top: 40px;">
                            ${(sectionData.features || []).map(feature => `
                                <div class="feature-item" style="text-align: center; padding: 30px 20px; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
                                    <div class="feature-icon" style="font-size: 3em; margin-bottom: 20px; color: #2c5aa0;">
                                        <i class="${feature.icon || 'fas fa-star'}"></i>
                                    </div>
                                    <h3 style="margin-bottom: 15px; color: #333;">${feature.title || ''}</h3>
                                    <p style="color: #666; line-height: 1.6;">${feature.description || ''}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
                break;
            case 'cta':
                sectionElement.innerHTML = `
                    <div class="container">
                        <div class="cta-section" style="text-align: center; padding: 60px 40px; background: linear-gradient(135deg, #2c5aa0, #4a7bc8); color: white; border-radius: 15px; margin: 40px 0;">
                            <h2 style="margin-bottom: 20px; font-size: 2.5em;">${sectionData.title || ''}</h2>
                            <p style="margin-bottom: 30px; font-size: 1.2em; opacity: 0.9;">${sectionData.description || ''}</p>
                            ${sectionData.buttonText ? `
                                <a href="${sectionData.buttonUrl || '#'}" class="cta-button" style="background: white; color: #2c5aa0; padding: 15px 40px; border-radius: 30px; text-decoration: none; font-weight: 600; display: inline-block; font-size: 1.1em; transition: all 0.3s ease;">
                                    ${sectionData.buttonText}
                                </a>
                            ` : ''}
                        </div>
                    </div>
                `;
                break;
            case 'contacts':
                sectionElement.innerHTML = `
                    <div class="container">
                        <h2 class="section-title">${sectionData.title || 'Контакты'}</h2>
                        <div class="contact-content" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; margin-top: 40px;">
                            <div class="contact-info" style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                                <h3 style="margin-bottom: 20px; color: #2c5aa0;">Контактная информация</h3>
                                ${sectionData.phone ? `
                                    <div class="contact-item" style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                                        <i class="fas fa-phone" style="color: #2c5aa0;"></i>
                                        <span style="font-weight: 500;">${sectionData.phone}</span>
                                    </div>
                                ` : ''}
                                ${sectionData.email ? `
                                    <div class="contact-item" style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                                        <i class="fas fa-envelope" style="color: #2c5aa0;"></i>
                                        <span style="font-weight: 500;">${sectionData.email}</span>
                                    </div>
                                ` : ''}
                                ${sectionData.address ? `
                                    <div class="contact-item" style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                                        <i class="fas fa-map-marker-alt" style="color: #2c5aa0;"></i>
                                        <span style="font-weight: 500;">${sectionData.address}</span>
                                    </div>
                                ` : ''}
                                ${sectionData.hours ? `
                                    <div class="contact-item" style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                                        <i class="fas fa-clock" style="color: #2c5aa0;"></i>
                                        <span style="font-weight: 500;">${sectionData.hours}</span>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `;
                break;
        }

        // Добавляем стили
        sectionElement.style.padding = '80px 0';
        sectionElement.style.background = sectionData.type === 'cta' ? 'transparent' : '#f8f9fa';
        
        if (sectionData.type === 'cta') {
            sectionElement.style.padding = '40px 0';
        }

        container.appendChild(sectionElement);
    }

    ensureCustomStyles() {
        // Добавляем стили для кастомных секций если их еще нет
        if (!document.getElementById('custom-sections-styles')) {
            const style = document.createElement('style');
            style.id = 'custom-sections-styles';
            style.textContent = `
                .custom-section {
                    transition: all 0.3s ease;
                }
                .custom-section .feature-item:hover {
                    transform: translateY(-5px);
                }
                .custom-section .cta-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(255,255,255,0.3);
                }
                @media (max-width: 768px) {
                    .custom-section .section-content {
                        flex-direction: column;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    applyContactChanges(contacts) {
        if (!contacts) return;

        console.log('📞 Applying contact changes:', contacts);

        // Обновляем контакты в секции contact
        if (contacts.phone) {
            this.updateElement('.contact-info .contact-item:nth-child(1) p, .contact-item:first-child p, .footer-section p:nth-child(2)', contacts.phone);
        }
        if (contacts.email) {
            this.updateElement('.contact-info .contact-item:nth-child(2) p, .contact-item:nth-child(2) p, .footer-section p:nth-child(3)', contacts.email);
        }
        if (contacts.address) {
            this.updateElement('.contact-info .contact-item:nth-child(3) p, .contact-item:nth-child(3) p, .footer-section p:nth-child(4)', contacts.address);
        }
        if (contacts.hours) {
            this.updateElement('.contact-info .contact-item:nth-child(4) p, .contact-item:nth-child(4) p', contacts.hours);
        }
    }

    applySettingsChanges(settings) {
        if (!settings) return;

        console.log('⚙️ Applying settings changes:', settings);

        if (settings.siteTitle) {
            document.title = settings.siteTitle;
        }
        if (settings.companyName) {
            this.updateElement('.logo h2', settings.companyName);
        }
    }

    updateElement(selector, value, isHtml = false) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0 && value) {
            elements.forEach(element => {
                if (isHtml) {
                    element.innerHTML = value;
                } else {
                    element.textContent = value;
                }
            });
            console.log('✅ Updated element:', selector, value);
        }
    }

    updateImages(selector, imageUrl) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0 && imageUrl) {
            elements.forEach(element => {
                element.src = imageUrl;
                element.onerror = () => {
                    console.warn('⚠️ Failed to load image:', imageUrl);
                    element.src = 'images/travel-placeholder.svg';
                };
            });
            console.log('🖼️ Updated image:', selector, imageUrl);
        }
    }

    updateNavigation(sectionId, title) {
        // Обновляем текст в навигации если нужно
        const navLinks = document.querySelectorAll(`a[href="#${sectionId}"]`);
        if (navLinks.length > 0 && title) {
            // Можно добавить логику обновления навигации если нужно
        }
    }

    updateStats(stats) {
        const statsContainer = document.querySelector('.stats');
        if (statsContainer && stats.length > 0) {
            statsContainer.innerHTML = stats.map(stat => `
                <div class="stat animate-counter" data-target="${stat.value}">
                    <h3>${stat.value}</h3>
                    <p>${stat.label}</p>
                </div>
            `).join('');
            console.log('📊 Updated stats:', stats.length, 'items');
        }
    }

    updateServices(services) {
        const servicesGrid = document.querySelector('.services-grid');
        if (servicesGrid && services.length > 0) {
            servicesGrid.innerHTML = services.map((service, index) => {
                const animations = ['slide-in-left', 'slide-in-bottom', 'slide-in-right', 'slide-in-top'];
                const animationClass = animations[index % animations.length] || 'slide-in-bottom';
                
                return `
                    <div class="service-card ${animationClass}">
                        <div class="service-icon"><i class="${service.icon || 'fas fa-star'}"></i></div>
                        <h3>${service.title}</h3>
                        <p>${service.description}</p>
                    </div>
                `;
            }).join('');
            console.log('🎯 Updated services:', services.length, 'items');
        }
    }

    // Метод для принудительного обновления
    forceUpdate() {
        this.appliedChanges.clear();
        this.applyAllChanges();
        console.log('🔄 Forced content update');
    }
}

// Initialize content updater
const contentUpdater = new ContentUpdater();

// Глобальная функция для обновления из редактора
window.updatePageContent = function() {
    if (window.contentUpdater) {
        window.contentUpdater.forceUpdate();
    }
};

// Автоматическое обновление при изменении данных
window.addEventListener('storage', function(e) {
    if (e.key === 'worldtravel_data' && window.contentUpdater) {
        setTimeout(() => window.contentUpdater.forceUpdate(), 100);
    }
});

console.log('✅ ContentUpdater ready with auto-refresh functionality');
// Исправления для ContentUpdater

// Переопределяем методы ContentUpdater для исправления ошибок
ContentUpdater.prototype.applyCustomSections = function(data) {
    if (!data.pageStructure || !data.content) return;

    console.log('🔄 Applying custom sections with order:', data.pageStructure);

    // Создаем контейнер для пользовательских секций перед футером
    let customSectionsContainer = document.getElementById('custom-sections');
    if (!customSectionsContainer) {
        customSectionsContainer = document.createElement('div');
        customSectionsContainer.id = 'custom-sections';
        const footer = document.querySelector('footer');
        const contact = document.querySelector('#contact');
        const insertBefore = footer || document.body.lastElementChild;
        
        if (insertBefore) {
            insertBefore.parentNode.insertBefore(customSectionsContainer, insertBefore);
        } else {
            document.body.appendChild(customSectionsContainer);
        }
    }

    // Очищаем контейнер
    customSectionsContainer.innerHTML = '';

    // Добавляем секции согласно структуре страницы
    data.pageStructure.forEach(sectionId => {
        // Пропускаем стандартные секции (они уже есть на странице)
        const standardSections = ['hero', 'about', 'services', 'destinations', 'contact', 'footer'];
        if (standardSections.includes(sectionId)) return;

        if (data.content[sectionId]) {
            this.renderCustomSection(customSectionsContainer, data.content[sectionId]);
        }
    });

    // Если есть пользовательские секции, добавляем стили
    if (customSectionsContainer.children.length > 0) {
        this.ensureCustomStyles();
    }
};

ContentUpdater.prototype.applyContentChanges = function(content) {
    if (!content) return;

    console.log('📝 Applying content changes to page structure');

    // Обновляем стандартные секции
    // Вызываем оригинальный метод через call
    ContentUpdater.prototype.originalApplyContentChanges.call(this, content);

    // Применяем пользовательские секции с правильным порядком
    this.applyCustomSections(this.getCurrentData());
};

// Сохраняем оригинальный метод
ContentUpdater.prototype.originalApplyContentChanges = ContentUpdater.prototype.applyContentChanges;

// Улучшаем получение текущих данных
ContentUpdater.prototype.getCurrentData = function() {
    // Try multiple sources for data
    if (typeof window.dataManager !== 'undefined' && window.dataManager) {
        const data = window.dataManager.getData();
        if (data && data.pageStructure) {
            console.log('📁 Using DataManager data with page structure:', data.pageStructure);
            return data;
        }
    }

    // Try localStorage
    try {
        const localData = localStorage.getItem('worldtravel_data');
        if (localData) {
            const data = JSON.parse(localData);
            if (data.pageStructure) {
                console.log('�� Using localStorage data with page structure:', data.pageStructure);
                return data;
            }
        }
    } catch (error) {
        console.error('Error parsing localStorage data:', error);
    }

    return this.getDefaultData();
};

ContentUpdater.prototype.getDefaultData = function() {
    return {
        content: {},
        pageStructure: ['hero', 'about', 'services', 'destinations', 'contact'],
        lastUpdate: new Date().toISOString()
    };
};

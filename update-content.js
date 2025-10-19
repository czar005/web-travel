// Enhanced content updater with reliable change application and custom sections support
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
        this.applyCustomSections(data);
        
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
                this.applyCustomSections(data);
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
            pageStructure: data.pageStructure,
            timestamp: data.lastUpdate
        });
    }

    applyContentChanges(content) {
        if (!content) return;

        console.log('📝 Applying content changes:', content);

        // Hero section - ОТДЕЛЬНОЕ изображение
        if (content.hero) {
            this.updateElement('#home h1, .hero h1, section:first-of-type h1', content.hero.title);
            this.updateElement('#home p, .hero p, section:first-of-type p', content.hero.subtitle);
            if (content.hero.image) {
                this.updateImages('.hero-image img, .image-placeholder img', content.hero.image);
            }
        }

        // About section - ОТДЕЛЬНОЕ изображение
        if (content.about) {
            this.updateElement('#about .section-title, .about .section-title, section:nth-of-type(2) .section-title', content.about.title);
            this.updateElement('.about-text p, #about p, .about p, section:nth-of-type(2) p', content.about.description);
            
            // Обновляем изображение (ТОЛЬКО для about)
            if (content.about.image) {
                this.updateImages('.about-image img, .image-placeholder img', content.about.image);
            }
            
            // Обновляем навигацию для секции "О нас"
            this.updateNavigation('about', content.about.title);
            
            if (content.about.stats) {
                this.updateStats(content.about.stats);
            }
        }

        // Services section
        if (content.services) {
            this.updateElement('#services .section-title, .services .section-title, section:nth-of-type(3) .section-title', content.services.title);
            
            // Обновляем навигацию для секции "Услуги"
            this.updateNavigation('services', content.services.title);
            
            if (content.services.services) {
                this.updateServices(content.services.services);
            }
        }

        // Destinations section
        if (content.destinations) {
            this.updateElement('#destinations .section-title, .destinations .section-title, section:nth-of-type(4) .section-title', content.destinations.title);
            this.updateElement('.destinations .section-subtitle, .section-subtitle, section:nth-of-type(4) .section-subtitle', content.destinations.subtitle);
            
            // Обновляем навигацию для секции "Направления"
            this.updateNavigation('destinations', content.destinations.title);
        }

        // Contact section
        if (content.contact) {
            this.updateElement('#contact .section-title, .contact .section-title, section:nth-of-type(5) .section-title', content.contact.title);
            
            // Обновляем навигацию для секции "Контакты"
            this.updateNavigation('contact', content.contact.title);
        }

        // Footer section
        if (content.footer) {
            // Исправленный селектор: первый параграф в первом footer-section
            this.updateElement('.footer-section:first-child p:first-child', content.footer.description);
            this.updateElement('.footer-bottom p', content.footer.copyright, true);
        }
    }

    applyCustomSections(data) {
        if (!data.pageStructure || !data.content) return;

        console.log('🔄 Applying custom sections...');

        // Создаем контейнер для пользовательских секций перед футером
        let customSectionsContainer = document.getElementById('custom-sections');
        if (!customSectionsContainer) {
            customSectionsContainer = document.createElement('div');
            customSectionsContainer.id = 'custom-sections';
            const footer = document.querySelector('footer');
            if (footer) {
                footer.parentNode.insertBefore(customSectionsContainer, footer);
            }
        }

        // Очищаем контейнер
        customSectionsContainer.innerHTML = '';

        // Добавляем пользовательские секции согласно структуре
        data.pageStructure.forEach(sectionId => {
            if (sectionId.startsWith('section-') && data.content[sectionId]) {
                this.renderCustomSection(customSectionsContainer, data.content[sectionId]);
            }
        });
    }

    renderCustomSection(container, sectionData) {
        const sectionElement = document.createElement('section');
        sectionElement.className = `custom-section ${sectionData.type}-section`;
        sectionElement.id = sectionData.id;

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
                        <div class="section-content" style="display: flex; gap: 30px; align-items: center;">
                            <div class="text-content" style="flex: 1;">
                                <h2 class="section-title">${sectionData.title || ''}</h2>
                                <p>${sectionData.content || ''}</p>
                            </div>
                            <div class="image-content" style="flex: 1;">
                                ${sectionData.image ? `<img src="${sectionData.image}" alt="${sectionData.title}" style="max-width: 100%; border-radius: 10px;">` : ''}
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
                                <div class="feature-item" style="text-align: center; padding: 20px;">
                                    <div class="feature-icon" style="font-size: 2em; margin-bottom: 15px; color: #2c5aa0;">
                                        <i class="${feature.icon || 'fas fa-star'}"></i>
                                    </div>
                                    <h3 style="margin-bottom: 10px;">${feature.title || ''}</h3>
                                    <p style="color: #666;">${feature.description || ''}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
                break;
            case 'cta':
                sectionElement.innerHTML = `
                    <div class="container">
                        <div class="cta-section" style="text-align: center; padding: 60px 20px; background: linear-gradient(135deg, #2c5aa0, #4a7bc8); color: white; border-radius: 15px;">
                            <h2 style="margin-bottom: 20px;">${sectionData.title || ''}</h2>
                            <p style="margin-bottom: 30px; font-size: 1.1em;">${sectionData.description || ''}</p>
                            ${sectionData.buttonText ? `
                                <a href="${sectionData.buttonUrl || '#'}" class="cta-button" style="background: white; color: #2c5aa0; padding: 15px 30px; border-radius: 25px; text-decoration: none; font-weight: 600; display: inline-block;">
                                    ${sectionData.buttonText}
                                </a>
                            ` : ''}
                        </div>
                    </div>
                `;
                break;
        }

        // Добавляем стили
        sectionElement.style.padding = '80px 0';
        sectionElement.style.background = '#f8f9fa';
        
        if (sectionData.type === 'cta') {
            sectionElement.style.background = 'transparent';
            sectionElement.style.padding = '40px 0';
        }

        container.appendChild(sectionElement);
    }

    // ... остальные методы без изменений ...
    // [applyContactChanges, updateNavigation, updateImages и т.д.]
}

// Initialize content updater
const contentUpdater = new ContentUpdater();

// Unified Solution for Admin-Editor-Main Page Synchronization
// This guarantees data sync between all components

(function() {
    'use strict';
    
    console.log('🚀 UNIFIED SYNC SOLUTION LOADED');
    
    // Global data manager with enhanced synchronization
    window.UnifiedDataManager = {
        data: null,
        lastHash: '',
        isInitialized: false,
        
        init: function() {
            console.log('🔄 Initializing Unified Data Manager...');
            this.loadData();
            this.startSyncEngine();
            this.isInitialized = true;
            console.log('✅ Unified Data Manager ready');
        },
        
        loadData: function() {
            // Try multiple data sources
            const sources = [
                () => localStorage.getItem('worldtravel_data'),
                () => sessionStorage.getItem('worldtravel_data'),
                () => window.dataManager ? window.dataManager.getData() : null
            ];
            
            for (let source of sources) {
                try {
                    const data = source();
                    if (data) {
                        this.data = typeof data === 'string' ? JSON.parse(data) : data;
                        console.log('📁 Data loaded from source');
                        this.ensureDataStructure();
                        return;
                    }
                } catch (e) {
                    console.log('⚠️ Source load failed:', e);
                }
            }
            
            // Create default data structure
            this.createDefaultData();
        },
        
        ensureDataStructure: function() {
            if (!this.data) this.data = {};
            if (!this.data.content) this.data.content = {};
            if (!this.data.contacts) this.data.contacts = {};
            if (!this.data.settings) this.data.settings = {};
            
            // Ensure all sections exist
            const sections = ['hero', 'about', 'services', 'destinations', 'contact'];
            sections.forEach(section => {
                if (!this.data.content[section]) {
                    this.data.content[section] = {};
                }
            });
            
            // Ensure arrays exist
            if (!this.data.content.about.stats) this.data.content.about.stats = [];
            if (!this.data.content.services.services) this.data.content.services.services = [];
        },
        
        createDefaultData: function() {
            console.log('📝 Creating default data structure');
            this.data = {
                content: {
                    hero: {
                        title: "Откройте мир с WorldTravel",
                        description: "Мы создаем незабываемые путешествия по всему миру. От экзотических пляжей до горных вершин - ваше приключение начинается здесь."
                    },
                    about: {
                        title: "О нас",
                        description: "WorldTravel - это команда профессиональных путешественников и экспертов по туризму с более чем 10-летним опытом работы.",
                        stats: [
                            { value: "5000", label: "Довольных клиентов" },
                            { value: "50", label: "Стран мира" },
                            { value: "10 лет", label: "Опыта работы" }
                        ]
                    },
                    services: {
                        title: "Услуги",
                        services: [
                            { title: "Авиабилеты", description: "Подбор и бронирование лучших авиаперелетов по выгодным ценам", icon: "fas fa-plane" },
                            { title: "Отели", description: "Бронирование отелей любого уровня комфорта по всему миру", icon: "fas fa-hotel" }
                        ]
                    },
                    destinations: {
                        title: "Направления",
                        subtitle: "Откройте для себя лучшие направления мира с нашими эксклюзивными турами"
                    },
                    contact: {
                        title: "Контакты"
                    }
                },
                contacts: {
                    phone: "+7 (999) 123-45-67",
                    email: "info@worldtravel.com",
                    address: "Москва, ул. Туристическая, 15",
                    hours: "Пн-Пт: 9:00-18:00"
                },
                settings: {
                    siteTitle: "WorldTravel - Туристическая компания",
                    companyName: "WorldTravel"
                },
                lastUpdate: new Date().toISOString()
            };
            
            this.saveData();
        },
        
        saveData: function() {
            this.data.lastUpdate = new Date().toISOString();
            
            // Save to all storage locations
            const dataString = JSON.stringify(this.data);
            
            localStorage.setItem('worldtravel_data', dataString);
            sessionStorage.setItem('worldtravel_data', dataString);
            
            // Update dataManager if exists
            if (window.dataManager && window.dataManager.setData) {
                window.dataManager.setData(this.data);
            }
            
            console.log('💾 Data saved to all locations');
            this.triggerDataUpdate();
        },
        
        triggerDataUpdate: function() {
            // Dispatch custom event
            const event = new CustomEvent('unifiedDataUpdate', { 
                detail: { data: this.data, timestamp: new Date() }
            });
            window.dispatchEvent(event);
            
            // Also trigger legacy event for compatibility
            const legacyEvent = new CustomEvent('dataUpdated', {
                detail: this.data
            });
            window.dispatchEvent(legacyEvent);
        },
        
        startSyncEngine: function() {
            // Real-time sync every 500ms
            setInterval(() => this.syncChanges(), 500);
            
            // Sync on storage events (cross-tab)
            window.addEventListener('storage', (e) => {
                if (e.key === 'worldtravel_data') {
                    setTimeout(() => this.syncChanges(), 100);
                }
            });
            
            // Sync on focus (when returning from admin/editor)
            window.addEventListener('focus', () => {
                setTimeout(() => this.syncChanges(), 200);
            });
            
            console.log('🔄 Sync engine started');
        },
        
        syncChanges: function() {
            const currentHash = this.getDataHash();
            if (currentHash === this.lastHash) return;
            
            this.lastHash = currentHash;
            this.applyChangesToDOM();
        },
        
        getDataHash: function() {
            return JSON.stringify(this.data.content) + JSON.stringify(this.data.contacts);
        },
        
        applyChangesToDOM: function() {
            if (!this.data) return;
            
            console.log('🎯 Applying changes to DOM...');
            
            // Apply content sections
            this.applyContentSections();
            
            // Apply contacts
            this.applyContacts();
            
            // Apply settings
            this.applySettings();
            
            // Apply dynamic content (stats, services)
            this.applyDynamicContent();
            
            console.log('✅ DOM updated successfully');
        },
        
        applyContentSections: function() {
            const content = this.data.content;
            if (!content) return;
            
            // Hero section
            this.updateElement('#home h1, .hero h1', content.hero?.title);
            this.updateElement('#home p, .hero p', content.hero?.description);
            
            // About section
            this.updateElement('#about .section-title', content.about?.title);
            this.updateElement('.about-text p', content.about?.description);
            
            // Services section
            this.updateElement('#services .section-title', content.services?.title);
            
            // Destinations section
            this.updateElement('#destinations .section-title', content.destinations?.title);
            this.updateElement('.destinations .section-subtitle', content.destinations?.subtitle);
            
            // Contact section
            this.updateElement('#contact .section-title', content.contact?.title);
        },
        
        applyContacts: function() {
            const contacts = this.data.contacts;
            if (!contacts) return;
            
            // Main contact section
            this.updateElement('.contact-info .contact-item:nth-child(1) p', contacts.phone);
            this.updateElement('.contact-info .contact-item:nth-child(2) p', contacts.email);
            this.updateElement('.contact-info .contact-item:nth-child(3) p', contacts.address);
            this.updateElement('.contact-info .contact-item:nth-child(4) p', contacts.hours);
            
            // Footer contacts
            this.updateElement('.footer-phone', contacts.phone);
            this.updateElement('.footer-email', contacts.email);
            this.updateElement('.footer-address', contacts.address);
            this.updateElement('.footer-hours', contacts.hours);
        },
        
        applySettings: function() {
            const settings = this.data.settings;
            if (!settings) return;
            
            if (settings.siteTitle) {
                document.title = settings.siteTitle;
            }
        },
        
        applyDynamicContent: function() {
            // Apply stats
            if (this.data.content?.about?.stats) {
                this.applyStats(this.data.content.about.stats);
            }
            
            // Apply services
            if (this.data.content?.services?.services) {
                this.applyServices(this.data.content.services.services);
            }
        },
        
        applyStats: function(stats) {
            const statElements = document.querySelectorAll('.stat');
            const validStats = stats.filter(stat => stat.value && stat.label);
            
            validStats.forEach((stat, index) => {
                if (statElements[index]) {
                    const valueEl = statElements[index].querySelector('h3');
                    const labelEl = statElements[index].querySelector('p');
                    
                    if (valueEl) valueEl.textContent = stat.value;
                    if (labelEl) labelEl.textContent = stat.label;
                    
                    statElements[index].style.display = 'block';
                }
            });
            
            // Hide extra elements
            for (let i = validStats.length; i < statElements.length; i++) {
                statElements[i].style.display = 'none';
            }
        },
        
        applyServices: function(services) {
            const serviceElements = document.querySelectorAll('.service-card');
            const validServices = services.filter(service => service.title && service.description);
            
            validServices.forEach((service, index) => {
                if (serviceElements[index]) {
                    const titleEl = serviceElements[index].querySelector('h3');
                    const descEl = serviceElements[index].querySelector('p');
                    const iconEl = serviceElements[index].querySelector('.service-icon i');
                    
                    if (titleEl) titleEl.textContent = service.title;
                    if (descEl) descEl.textContent = service.description;
                    if (iconEl && service.icon) {
                        iconEl.className = service.icon;
                    }
                    
                    serviceElements[index].style.display = 'block';
                }
            });
            
            // Hide extra elements
            for (let i = validServices.length; i < serviceElements.length; i++) {
                serviceElements[i].style.display = 'none';
            }
        },
        
        updateElement: function(selector, value) {
            if (!value) return;
            document.querySelectorAll(selector).forEach(el => {
                if (el.textContent !== value) {
                    el.textContent = value;
                }
            });
        },
        
        // Public API for editors
        updateContent: function(section, field, value) {
            if (!this.data.content[section]) {
                this.data.content[section] = {};
            }
            this.data.content[section][field] = value;
            this.saveData();
        },
        
        updateContacts: function(field, value) {
            this.data.contacts[field] = value;
            this.saveData();
        },
        
        updateSettings: function(field, value) {
            this.data.settings[field] = value;
            this.saveData();
        },
        
        updateStats: function(stats) {
            this.data.content.about.stats = stats;
            this.saveData();
        },
        
        updateServices: function(services) {
            this.data.content.services.services = services;
            this.saveData();
        },
        
        getData: function() {
            return this.data;
        },
        
        forceSync: function() {
            this.applyChangesToDOM();
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.UnifiedDataManager.init();
        });
    } else {
        window.UnifiedDataManager.init();
    }
    
})();

// Enhanced Editor Integration
(function() {
    'use strict';
    
    console.log('🎨 Enhanced Editor Integration loaded');
    
    function enhanceEditor() {
        if (!window.editor) {
            console.log('⏳ Waiting for editor...');
            setTimeout(enhanceEditor, 100);
            return;
        }
        
        console.log('🔧 Enhancing editor with unified sync...');
        
        // Patch editor methods to use unified data manager
        patchEditorMethods();
        
        // Ensure editor uses our data
        syncEditorWithUnifiedData();
        
        console.log('✅ Editor enhanced successfully');
    }
    
    function patchEditorMethods() {
        const originalSaveData = window.editor.saveData;
        
        window.editor.saveData = function() {
            console.log('🔄 Editor save intercepted by unified system');
            
            // Update unified data manager
            if (window.UnifiedDataManager && this.currentData) {
                window.UnifiedDataManager.data = this.currentData;
                window.UnifiedDataManager.saveData();
            }
            
            // Call original method if it exists
            if (originalSaveData) {
                originalSaveData.call(this);
            }
        };
        
        // Patch section saving
        window.editor.saveSection = function() {
            const section = this.currentSection;
            const title = document.getElementById('section-title').value;
            const description = document.getElementById('section-description').value;
            
            if (window.UnifiedDataManager) {
                window.UnifiedDataManager.updateContent(section, 'title', title);
                window.UnifiedDataManager.updateContent(section, 'description', description);
            }
            
            this.showNotification('Изменения сохранены!', 'success');
        };
    }
    
    function syncEditorWithUnifiedData() {
        // Listen for data updates and update editor
        window.addEventListener('unifiedDataUpdate', (e) => {
            if (window.editor && window.editor.currentData) {
                window.editor.currentData = e.detail.data;
                
                // Update editor UI if on same section
                if (window.editor.currentSection) {
                    const section = window.editor.currentData.content[window.editor.currentSection];
                    if (section) {
                        const titleField = document.getElementById('section-title');
                        const descField = document.getElementById('section-description');
                        
                        if (titleField) titleField.value = section.title || '';
                        if (descField) descField.value = section.description || '';
                    }
                }
            }
        });
    }
    
    // Initialize editor enhancement
    enhanceEditor();
    
})();

// Admin Panel Integration
(function() {
    'use strict';
    
    console.log('⚙️ Admin Panel Integration loaded');
    
    function enhanceAdmin() {
        if (!window.admin) {
            console.log('⏳ Waiting for admin panel...');
            setTimeout(enhanceAdmin, 100);
            return;
        }
        
        console.log('🔧 Enhancing admin with unified sync...');
        
        patchAdminMethods();
        setupAdminSync();
        
        console.log('✅ Admin enhanced successfully');
    }
    
    function patchAdminMethods() {
        // Patch contact form handler
        const originalHandleUpdateContacts = window.handleUpdateContacts;
        
        window.handleUpdateContacts = function(e) {
            e.preventDefault();
            
            const form = e.target;
            const formData = new FormData(form);
            
            const contactData = {
                phone: formData.get('phone').trim(),
                email: formData.get('email').trim(),
                address: formData.get('address').trim(),
                hours: formData.get('hours').trim()
            };
            
            // Use unified data manager
            if (window.UnifiedDataManager) {
                Object.keys(contactData).forEach(key => {
                    window.UnifiedDataManager.updateContacts(key, contactData[key]);
                });
                window.showAdminNotification('Контактная информация обновлена!', 'success');
            } else if (originalHandleUpdateContacts) {
                originalHandleUpdateContacts.call(this, e);
            }
        };
        
        // Patch settings form handler
        const originalHandleUpdateSettings = window.handleUpdateSettings;
        
        window.handleUpdateSettings = function(e) {
            e.preventDefault();
            
            const form = e.target;
            const formData = new FormData(form);
            
            const settingsData = {
                siteTitle: formData.get('siteTitle').trim(),
                companyName: formData.get('companyName').trim()
            };
            
            // Use unified data manager
            if (window.UnifiedDataManager) {
                Object.keys(settingsData).forEach(key => {
                    window.UnifiedDataManager.updateSettings(key, settingsData[key]);
                });
                window.showAdminNotification('Настройки сайта обновлены!', 'success');
            } else if (originalHandleUpdateSettings) {
                originalHandleUpdateSettings.call(this, e);
            }
        };
    }
    
    function setupAdminSync() {
        // Update admin forms when data changes
        window.addEventListener('unifiedDataUpdate', (e) => {
            const data = e.detail.data;
            
            // Update contacts form
            const contactForm = document.getElementById('contact-form');
            if (contactForm && data.contacts) {
                contactForm.querySelector('#contact-phone').value = data.contacts.phone || '';
                contactForm.querySelector('#contact-email').value = data.contacts.email || '';
                contactForm.querySelector('#contact-address').value = data.contacts.address || '';
                contactForm.querySelector('#contact-hours').value = data.contacts.hours || '';
            }
            
            // Update settings form
            const settingsForm = document.getElementById('settings-form');
            if (settingsForm && data.settings) {
                settingsForm.querySelector('#site-title').value = data.settings.siteTitle || '';
                settingsForm.querySelector('#company-name').value = data.settings.companyName || '';
            }
        });
    }
    
    // Initialize admin enhancement
    enhanceAdmin();
    
})();

// Guaranteed Sync Fallback
(function() {
    'use strict';
    
    console.log('🛡️ Guaranteed Sync Fallback loaded');
    
    // Last resort sync - checks every second and applies changes
    function startGuaranteedSync() {
        let lastData = '';
        
        setInterval(() => {
            try {
                const currentData = localStorage.getItem('worldtravel_data');
                if (currentData && currentData !== lastData) {
                    lastData = currentData;
                    
                    // Parse and apply data
                    const data = JSON.parse(currentData);
                    applyGuaranteedUpdates(data);
                }
            } catch (error) {
                console.log('⚠️ Guaranteed sync error:', error);
            }
        }, 1000);
        
        console.log('��️ Guaranteed sync active');
    }
    
    function applyGuaranteedUpdates(data) {
        if (!data) return;
        
        // Apply critical updates that must work
        if (data.contacts) {
            applyCriticalContacts(data.contacts);
        }
        
        if (data.content?.hero) {
            applyCriticalHero(data.content.hero);
        }
    }
    
    function applyCriticalContacts(contacts) {
        // Phone - most critical contact
        if (contacts.phone) {
            const phoneSelectors = [
                '.contact-info .contact-item:nth-child(1) p',
                '.footer-section:nth-child(3) p:nth-child(1)',
                '.footer-phone'
            ];
            
            phoneSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    if (el.textContent !== contacts.phone) {
                        el.textContent = contacts.phone;
                    }
                });
            });
        }
        
        // Email - second most critical
        if (contacts.email) {
            const emailSelectors = [
                '.contact-info .contact-item:nth-child(2) p',
                '.footer-section:nth-child(3) p:nth-child(2)',
                '.footer-email'
            ];
            
            emailSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    if (el.textContent !== contacts.email) {
                        el.textContent = contacts.email;
                    }
                });
            });
        }
    }
    
    function applyCriticalHero(hero) {
        if (hero.title) {
            document.querySelectorAll('#home h1, .hero h1').forEach(el => {
                if (el.textContent !== hero.title) {
                    el.textContent = hero.title;
                }
            });
        }
        
        if (hero.description) {
            document.querySelectorAll('#home p, .hero p').forEach(el => {
                if (el.textContent !== hero.description) {
                    el.textContent = hero.description;
                }
            });
        }
    }
    
    // Start guaranteed sync
    startGuaranteedSync();
    
})();

// Initialize everything
console.log('🎯 Unified synchronization system loaded successfully');
console.log('💡 Features:');
console.log('   - Real-time sync between admin, editor, and main page');
console.log('   - Multiple storage redundancy');
console.log('   - Guaranteed fallback synchronization');
console.log('   - No styling or functionality disruption');

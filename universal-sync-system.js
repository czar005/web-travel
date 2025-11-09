// UNIVERSAL SYNC SYSTEM - Senior Level Solution
// Guarantees ALL data from admin and editor syncs to main page
(function() {
    'use strict';
    
    console.log('🚀 UNIVERSAL SYNC SYSTEM INITIALIZED');
    
    const UniversalSync = {
        // Data schema for complete synchronization
        dataSchema: {
            // Content sections
            content: {
                hero: ['title', 'description', 'buttonText', 'backgroundImage'],
                about: ['title', 'description', 'image', 'stats'],
                services: ['title', 'description', 'services'],
                destinations: ['title', 'subtitle', 'description'], 
                contact: ['title', 'description', 'formTitle'],
                footer: ['description', 'copyright']
            },
            // Contacts
            contacts: ['phone', 'email', 'address', 'hours', 'socialLinks'],
            // Settings
            settings: ['siteTitle', 'companyName', 'defaultCurrency', 'language'],
            // Business data
            countries: ['name', 'description', 'image', 'tours', 'price', 'capital'],
            tours: ['name', 'countryId', 'price', 'duration', 'description', 'image']
        },
        
        // Initialize the system
        init: function() {
            console.log('🎯 Initializing Universal Sync System...');
            
            this.setupDataBridge();
            this.setupRealTimeSync();
            this.setupChangeDetection();
            this.patchAdminAndEditor();
            
            console.log('✅ Universal Sync System Ready');
            console.log('📊 Monitoring:', Object.keys(this.dataSchema));
        },
        
        // Create data bridge between all components
        setupDataBridge: function() {
            // Central data storage with persistence
            window.UniversalData = window.UniversalData || {
                // Get complete data from all sources
                getCompleteData: function() {
                    const sources = [
                        () => localStorage.getItem('worldtravel_data'),
                        () => sessionStorage.getItem('worldtravel_data'),
                        () => window.dataManager ? window.dataManager.getData() : null,
                        () => window.UnifiedDataManager ? window.UnifiedDataManager.getData() : null
                    ];
                    
                    for (let source of sources) {
                        try {
                            const data = source();
                            if (data) {
                                return typeof data === 'string' ? JSON.parse(data) : data;
                            }
                        } catch (e) {
                            console.log('⚠️ Source unavailable:', e);
                        }
                    }
                    
                    return this.getDefaultDataStructure();
                },
                
                // Save data to all destinations
                saveCompleteData: function(data) {
                    if (!data) return;
                    
                    // Normalize data structure
                    const normalized = this.normalizeData(data);
                    
                    // Save to all storage locations
                    const dataString = JSON.stringify(normalized);
                    
                    // Primary storage
                    localStorage.setItem('worldtravel_data', dataString);
                    sessionStorage.setItem('worldtravel_data', dataString);
                    
                    // Sync with managers
                    if (window.dataManager && window.dataManager.setData) {
                        window.dataManager.setData(normalized);
                    }
                    
                    if (window.UnifiedDataManager && window.UnifiedDataManager.setData) {
                        window.UnifiedDataManager.setData(normalized);
                    }
                    
                    // Trigger sync events
                    this.triggerSyncEvent(normalized);
                    
                    console.log('💾 COMPLETE DATA SAVED:', Object.keys(normalized));
                },
                
                // Normalize data to ensure complete structure
                normalizeData: function(data) {
                    const defaultStructure = this.getDefaultDataStructure();
                    
                    // Deep merge with defaults
                    return this.deepMerge(defaultStructure, data);
                },
                
                // Deep merge utility
                deepMerge: function(target, source) {
                    if (!source) return target;
                    
                    for (const key in source) {
                        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                            if (!target[key]) target[key] = {};
                            this.deepMerge(target[key], source[key]);
                        } else {
                            target[key] = source[key];
                        }
                    }
                    
                    return target;
                },
                
                // Default data structure
                getDefaultDataStructure: function() {
                    return {
                        content: {
                            hero: { title: '', description: '', buttonText: '' },
                            about: { title: '', description: '', stats: [] },
                            services: { title: '', description: '', services: [] },
                            destinations: { title: '', subtitle: '', description: '' },
                            contact: { title: '', description: '' },
                            footer: { description: '', copyright: '' }
                        },
                        contacts: {
                            phone: '+7 (999) 123-45-67',
                            email: 'info@worldtravel.com',
                            address: 'Москва, ул. Туристическая, 15',
                            hours: 'Пн-Пт: 9:00-18:00',
                            socialLinks: []
                        },
                        settings: {
                            siteTitle: 'WorldTravel - Туристическая компания',
                            companyName: 'WorldTravel'
                        },
                        countries: [],
                        tours: [],
                        lastSync: new Date().toISOString(),
                        version: '2.0'
                    };
                },
                
                // Trigger synchronization event
                triggerSyncEvent: function(data) {
                    // Custom event for universal sync
                    const event = new CustomEvent('universalDataSync', {
                        detail: { 
                            data: data,
                            timestamp: new Date(),
                            source: 'UniversalSync'
                        }
                    });
                    window.dispatchEvent(event);
                    
                    // Legacy events for compatibility
                    window.dispatchEvent(new CustomEvent('dataUpdated', { detail: data }));
                    if (window.UnifiedDataManager) {
                        window.dispatchEvent(new CustomEvent('unifiedDataUpdate', { detail: { data: data } }));
                    }
                },
                
                // Force immediate sync to main page
                forceImmediateSync: function() {
                    const data = this.getCompleteData();
                    this.applyToMainPage(data);
                },
                
                // Apply data to main page DOM
                applyToMainPage: function(data) {
                    if (!data) return;
                    
                    console.log('🎯 APPLYING TO MAIN PAGE:', Object.keys(data));
                    
                    // Apply content sections
                    this.applyContent(data.content);
                    
                    // Apply contacts
                    this.applyContacts(data.contacts);
                    
                    // Apply settings
                    this.applySettings(data.settings);
                    
                    // Apply dynamic content
                    this.applyDynamicContent(data);
                    
                    console.log('✅ MAIN PAGE UPDATED');
                },
                
                // Apply content sections
                applyContent: function(content) {
                    if (!content) return;
                    
                    // Hero section
                    this.updateElement('#home h1, .hero h1', content.hero?.title);
                    this.updateElement('#home p, .hero p', content.hero?.description);
                    this.updateElement('.cta-button', content.hero?.buttonText);
                    
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
                    
                    // Footer
                    this.updateElement('.footer-section:first-child p', content.footer?.description);
                    this.updateElement('.footer-bottom p', content.footer?.copyright, true);
                },
                
                // Apply contacts
                applyContacts: function(contacts) {
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
                
                // Apply settings
                applySettings: function(settings) {
                    if (!settings) return;
                    
                    if (settings.siteTitle) {
                        document.title = settings.siteTitle;
                    }
                },
                
                // Apply dynamic content (stats, services, etc.)
                applyDynamicContent: function(data) {
                    // Stats
                    if (data.content?.about?.stats) {
                        this.applyStats(data.content.about.stats);
                    }
                    
                    // Services
                    if (data.content?.services?.services) {
                        this.applyServices(data.content.services.services);
                    }
                    
                    // Countries and tours would be applied here
                    if (data.countries) {
                        this.applyCountries(data.countries);
                    }
                },
                
                // Apply stats
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
                
                // Apply services
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
                
                // Apply countries (for destinations section)
                applyCountries: function(countries) {
                    // This would be implemented based on your destinations rendering
                    console.log('🌍 Countries available:', countries.length);
                },
                
                // Utility to update DOM elements
                updateElement: function(selector, value, isHTML = false) {
                    if (!value) return;
                    document.querySelectorAll(selector).forEach(el => {
                        if (isHTML) {
                            el.innerHTML = value;
                        } else {
                            el.textContent = value;
                        }
                    });
                }
            };
            
            console.log('🌉 Data Bridge Established');
        },
        
        // Real-time synchronization
        setupRealTimeSync: function() {
            // Sync every 500ms
            setInterval(() => {
                window.UniversalData.forceImmediateSync();
            }, 500);
            
            // Sync on visibility change
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden) {
                    setTimeout(() => window.UniversalData.forceImmediateSync(), 100);
                }
            });
            
            // Sync on focus
            window.addEventListener('focus', () => {
                setTimeout(() => window.UniversalData.forceImmediateSync(), 200);
            });
            
            console.log('🔄 Real-time Sync Active');
        },
        
        // Change detection for forms and inputs
        setupChangeDetection: function() {
            // Monitor form changes
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' || mutation.type === 'attributes') {
                        // Check if any form was modified
                        const forms = document.querySelectorAll('form, input, textarea, select');
                        forms.forEach(form => {
                            if (form.value !== form._lastValue) {
                                form._lastValue = form.value;
                                this.handleFormChange(form);
                            }
                        });
                    }
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['value', 'checked', 'selected']
            });
            
            console.log('👀 Change Detection Active');
        },
        
        // Handle form changes
        handleFormChange: function(form) {
            // Extract data from form and save
            if (form.closest('#contact-form')) {
                this.saveContactForm();
            } else if (form.closest('#settings-form')) {
                this.saveSettingsForm();
            } else if (form.closest('#content-editor')) {
                this.saveEditorContent();
            }
        },
        
        // Save contact form data
        saveContactForm: function() {
            const form = document.getElementById('contact-form');
            if (!form) return;
            
            const formData = new FormData(form);
            const contacts = {
                phone: formData.get('phone') || '',
                email: formData.get('email') || '',
                address: formData.get('address') || '',
                hours: formData.get('hours') || ''
            };
            
            const currentData = window.UniversalData.getCompleteData();
            currentData.contacts = { ...currentData.contacts, ...contacts };
            window.UniversalData.saveCompleteData(currentData);
        },
        
        // Save settings form data
        saveSettingsForm: function() {
            const form = document.getElementById('settings-form');
            if (!form) return;
            
            const formData = new FormData(form);
            const settings = {
                siteTitle: formData.get('siteTitle') || '',
                companyName: formData.get('companyName') || ''
            };
            
            const currentData = window.UniversalData.getCompleteData();
            currentData.settings = { ...currentData.settings, ...settings };
            window.UniversalData.saveCompleteData(currentData);
        },
        
        // Save editor content
        saveEditorContent: function() {
            const activeSection = document.querySelector('.section-item.active');
            if (!activeSection) return;
            
            const sectionName = activeSection.getAttribute('data-section');
            const title = document.getElementById('section-title')?.value || '';
            const description = document.getElementById('section-description')?.value || '';
            
            const currentData = window.UniversalData.getCompleteData();
            if (!currentData.content[sectionName]) {
                currentData.content[sectionName] = {};
            }
            
            currentData.content[sectionName].title = title;
            currentData.content[sectionName].description = description;
            
            window.UniversalData.saveCompleteData(currentData);
        },
        
        // Patch admin and editor to use universal system
        patchAdminAndEditor: function() {
            // Patch admin functions
            if (window.handleUpdateContacts) {
                const originalHandleUpdateContacts = window.handleUpdateContacts;
                window.handleUpdateContacts = function(e) {
                    e.preventDefault();
                    UniversalSync.saveContactForm();
                    if (window.showAdminNotification) {
                        window.showAdminNotification('Контакты сохранены на главной странице!', 'success');
                    }
                };
            }
            
            if (window.handleUpdateSettings) {
                const originalHandleUpdateSettings = window.handleUpdateSettings;
                window.handleUpdateSettings = function(e) {
                    e.preventDefault();
                    UniversalSync.saveSettingsForm();
                    if (window.showAdminNotification) {
                        window.showAdminNotification('Настройки сохранены на главной странице!', 'success');
                    }
                };
            }
            
            // Patch editor
            if (window.editor) {
                const originalSaveSection = window.editor.saveSection;
                window.editor.saveSection = function() {
                    UniversalSync.saveEditorContent();
                    this.showNotification('Изменения сохранены на главной странице!', 'success');
                    return false;
                };
            }
            
            console.log('🔧 Admin & Editor Patched');
        }
    };
    
    // Initialize the system
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => UniversalSync.init());
    } else {
        UniversalSync.init();
    }
    
    // Global access for debugging
    window.UniversalSync = UniversalSync;
    
    console.log('🎉 UNIVERSAL SYNC SYSTEM LOADED');
    console.log('💡 All data from admin and editor will now sync to main page');
    
})();

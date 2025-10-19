// Fixed Super Editor with working stats and services
class SuperEditorFixed {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 Fixed Super Editor initialized');
        this.waitForEditor();
    }

    waitForEditor() {
        if (window.editor) {
            this.patchEditor();
        } else {
            setTimeout(() => this.waitForEditor(), 100);
        }
    }

    patchEditor() {
        console.log('🔧 Patching editor with fixed methods...');
        
        // Store original methods
        const originalShowContentEditor = window.editor.showContentEditor;
        const originalSaveChanges = window.editor.saveChanges;

        // Patch showContentEditor to add enhanced features
        window.editor.showContentEditor = function() {
            originalShowContentEditor.call(this);
            setTimeout(() => {
                this.addEnhancedFeatures();
                this.ensureDataStructure();
            }, 100);
        };

        // Patch saveChanges to include our data
        window.editor.saveChanges = function() {
            this.collectEnhancedData();
            return originalSaveChanges.call(this);
        };

        // Ensure data structure exists
        window.editor.ensureDataStructure = function() {
            if (!this.currentData.content) {
                this.currentData.content = {};
            }
            
            if (this.currentSection.id === 'about' && !this.currentData.content.about) {
                this.currentData.content.about = {};
            }
            
            if (this.currentSection.id === 'services' && !this.currentData.content.services) {
                this.currentData.content.services = {};
            }
            
            if (!this.currentData.contacts) {
                this.currentData.contacts = {};
            }
        };

        // Collect all enhanced data before save
        window.editor.collectEnhancedData = function() {
            this.collectStatsData();
            this.collectServicesData();
            this.collectContactData();
        };

        // Add enhanced features
        window.editor.addEnhancedFeatures = function() {
            console.log('🎨 Adding enhanced features for:', this.currentSection.id);
            this.addImageManager();
            this.addStatsManager();
            this.addServicesManager();
            this.addContactManager();
        };

        // Image Manager - работает
        window.editor.addImageManager = function() {
            const imageFields = this.currentSection.fields?.filter(f => f.type === 'image');
            if (!imageFields || imageFields.length === 0) return;

            imageFields.forEach(field => {
                this.addImageField(field);
            });
        };

        window.editor.addImageField = function(field) {
            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor) return;

            const existingManager = contentEditor.querySelector(`[data-image-field="${field.id}"]`);
            if (existingManager) existingManager.remove();

            const currentImage = this.getCurrentValue(field);
            const imageHTML = `
                <div class="form-group" data-image-field="${field.id}">
                    <label>${field.label}:</label>
                    <div class="image-manager" style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                        <div class="image-preview" style="width: 100%; max-width: 300px; height: 200px; border: 2px dashed #ddd; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; overflow: hidden; background: white;">
                            ${currentImage ? 
                                `<img src="${currentImage}" alt="Preview" style="max-width: 100%; max-height: 100%; object-fit: cover;">` :
                                `<div style="text-align: center; color: #666;">
                                    <i class="fas fa-image" style="font-size: 2em; display: block; margin-bottom: 5px;"></i>
                                    <span>No image</span>
                                </div>`
                            }
                        </div>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <button type="button" class="btn-admin" onclick="window.editor.uploadImage('${field.id}')" style="background: #17a2b8; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">
                                <i class="fas fa-upload"></i> Upload
                            </button>
                            <button type="button" class="btn-admin" onclick="window.editor.setImageUrl('${field.id}')" style="background: #6c757d; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">
                                <i class="fas fa-link"></i> URL
                            </button>
                            ${currentImage ? `
                            <button type="button" class="btn-admin danger" onclick="window.editor.removeImage('${field.id}')" style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">
                                <i class="fas fa-trash"></i> Remove
                            </button>
                            ` : ''}
                        </div>
                        <input type="hidden" data-field="${field.id}" value="${currentImage || ''}">
                    </div>
                </div>
            `;

            // Insert after title field
            const titleField = contentEditor.querySelector('[data-field="title"]');
            if (titleField) {
                titleField.closest('.form-group').insertAdjacentHTML('afterend', imageHTML);
            }
        };

        // Image methods
        window.editor.uploadImage = function(fieldId) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.updateImageField(fieldId, e.target.result);
                        this.showNotification('Image uploaded successfully', 'success');
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        };

        window.editor.setImageUrl = function(fieldId) {
            const url = prompt('Enter image URL:');
            if (url) {
                this.updateImageField(fieldId, url);
                this.showNotification('Image URL set', 'success');
            }
        };

        window.editor.removeImage = function(fieldId) {
            if (confirm('Remove image?')) {
                this.updateImageField(fieldId, '');
                this.showNotification('Image removed', 'success');
            }
        };

        window.editor.updateImageField = function(fieldId, url) {
            const field = document.querySelector(`[data-field="${fieldId}"]`);
            if (field) {
                field.value = url;
                
                const preview = document.querySelector(`[data-image-field="${fieldId}"] .image-preview`);
                if (preview) {
                    if (url) {
                        preview.innerHTML = `<img src="${url}" alt="Preview" style="max-width: 100%; max-height: 100%; object-fit: cover;">`;
                    } else {
                        preview.innerHTML = `
                            <div style="text-align: center; color: #666;">
                                <i class="fas fa-image" style="font-size: 2em; display: block; margin-bottom: 5px;"></i>
                                <span>No image</span>
                            </div>
                        `;
                    }
                }
                
                this.hasUnsavedChanges = true;
            }
        };

        // Stats Manager for About section - ИСПРАВЛЕННЫЙ
        window.editor.addStatsManager = function() {
            if (this.currentSection.id !== 'about') return;

            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor) return;

            // Remove existing manager
            const oldManager = contentEditor.querySelector('.stats-manager');
            if (oldManager) oldManager.remove();

            // Ensure stats array exists
            if (!this.currentData.content.about.stats) {
                this.currentData.content.about.stats = [];
            }

            const stats = this.currentData.content.about.stats;
            
            const statsHTML = `
                <div class="stats-manager" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #e9ecef;">
                    <h4 style="color: #2c5aa0; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-chart-bar"></i>
                        Statistics Blocks
                    </h4>
                    <div class="admin-hint" style="color: #666; margin-bottom: 15px; font-style: italic;">
                        Add, edit or remove statistics blocks. Changes are saved automatically.
                    </div>
                    <div id="stats-list">
                        ${stats.map((stat, index) => `
                            <div class="stat-item" style="display: flex; gap: 10px; margin-bottom: 12px; align-items: center; padding: 12px; background: white; border-radius: 6px; border: 1px solid #e9ecef;">
                                <input type="text" value="${stat.value || ''}" placeholder="Value (e.g., 5000)" 
                                       oninput="window.editor.updateStat(${index}, 'value', this.value)" 
                                       style="flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                                <input type="text" value="${stat.label || ''}" placeholder="Label (e.g., Happy Clients)" 
                                       oninput="window.editor.updateStat(${index}, 'label', this.value)"
                                       style="flex: 2; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                                <button onclick="window.editor.removeStat(${index})" 
                                        style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; white-space: nowrap;">
                                    <i class="fas fa-trash"></i> Remove
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    <button onclick="window.editor.addStat()" 
                            style="background: #28a745; color: white; border: none; padding: 10px 16px; border-radius: 5px; cursor: pointer; font-size: 14px; margin-top: 10px;">
                        <i class="fas fa-plus"></i> Add Statistic Block
                    </button>
                </div>
            `;

            const descriptionField = contentEditor.querySelector('[data-field="description"]');
            if (descriptionField) {
                descriptionField.closest('.form-group').insertAdjacentHTML('afterend', statsHTML);
            } else {
                // Fallback: insert after title
                const titleField = contentEditor.querySelector('[data-field="title"]');
                if (titleField) {
                    titleField.closest('.form-group').insertAdjacentHTML('afterend', statsHTML);
                }
            }
        };

        // Stats methods - ИСПРАВЛЕННЫЕ
        window.editor.addStat = function() {
            console.log('➕ Adding new stat...');
            
            // Ensure data structure
            if (!this.currentData.content.about) {
                this.currentData.content.about = {};
            }
            if (!this.currentData.content.about.stats) {
                this.currentData.content.about.stats = [];
            }
            
            // Add new stat
            this.currentData.content.about.stats.push({
                value: '0',
                label: 'New Statistic'
            });
            
            console.log('📊 Stats after add:', this.currentData.content.about.stats);
            
            this.hasUnsavedChanges = true;
            this.showNotification('Statistic block added', 'success');
            
            // Refresh the editor to show new stat
            this.showContentEditor();
        };

        window.editor.updateStat = function(index, field, value) {
            console.log(`📝 Updating stat ${index}.${field}:`, value);
            
            if (!this.currentData.content.about.stats) {
                this.currentData.content.about.stats = [];
            }
            
            if (!this.currentData.content.about.stats[index]) {
                this.currentData.content.about.stats[index] = {};
            }
            
            this.currentData.content.about.stats[index][field] = value;
            this.hasUnsavedChanges = true;
            
            console.log('📊 Stats after update:', this.currentData.content.about.stats);
        };

        window.editor.removeStat = function(index) {
            console.log('🗑️ Removing stat:', index);
            
            if (this.currentData.content?.about?.stats?.[index]) {
                this.currentData.content.about.stats.splice(index, 1);
                this.hasUnsavedChanges = true;
                this.showNotification('Statistic block removed', 'success');
                
                // Refresh the editor
                this.showContentEditor();
            }
        };

        window.editor.collectStatsData = function() {
            if (this.currentSection.id !== 'about') return;
            
            const statsList = document.getElementById('stats-list');
            if (!statsList) return;

            const statItems = statsList.querySelectorAll('.stat-item');
            const stats = [];

            statItems.forEach(item => {
                const inputs = item.querySelectorAll('input');
                if (inputs.length >= 2) {
                    stats.push({
                        value: inputs[0].value,
                        label: inputs[1].value
                    });
                }
            });

            console.log('💾 Collecting stats data:', stats);
            
            if (!this.currentData.content.about) {
                this.currentData.content.about = {};
            }
            this.currentData.content.about.stats = stats;
        };

        // Services Manager - ИСПРАВЛЕННЫЙ
        window.editor.addServicesManager = function() {
            if (this.currentSection.id !== 'services') return;

            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor) return;

            // Remove existing manager
            const oldManager = contentEditor.querySelector('.services-manager');
            if (oldManager) oldManager.remove();

            // Ensure services array exists
            if (!this.currentData.content.services.services) {
                this.currentData.content.services.services = [];
            }

            const services = this.currentData.content.services.services;
            
            const servicesHTML = `
                <div class="services-manager" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #e9ecef;">
                    <h4 style="color: #2c5aa0; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-concierge-bell"></i>
                        Services Management
                    </h4>
                    <div class="admin-hint" style="color: #666; margin-bottom: 15px; font-style: italic;">
                        Add, edit or remove services. Changes are saved automatically.
                    </div>
                    <div id="services-list">
                        ${services.map((service, index) => `
                            <div class="service-item" style="margin-bottom: 15px; padding: 15px; background: white; border-radius: 6px; border: 1px solid #e9ecef;">
                                <div style="display: flex; gap: 10px; margin-bottom: 10px; align-items: center;">
                                    <input type="text" value="${service.title || ''}" placeholder="Service Title" 
                                           oninput="window.editor.updateService(${index}, 'title', this.value)"
                                           style="flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                                    <input type="text" value="${service.icon || ''}" placeholder="Icon (fas fa-...)" 
                                           oninput="window.editor.updateService(${index}, 'icon', this.value)"
                                           style="flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                                    <button onclick="window.editor.removeService(${index})" 
                                            style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                                <textarea oninput="window.editor.updateService(${index}, 'description', this.value)"
                                          style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; resize: vertical; min-height: 60px; font-size: 14px;"
                                          placeholder="Service description">${service.description || ''}</textarea>
                            </div>
                        `).join('')}
                    </div>
                    <button onclick="window.editor.addService()" 
                            style="background: #28a745; color: white; border: none; padding: 10px 16px; border-radius: 5px; cursor: pointer; font-size: 14px; margin-top: 10px;">
                        <i class="fas fa-plus"></i> Add Service
                    </button>
                </div>
            `;

            const titleField = contentEditor.querySelector('[data-field="title"]');
            if (titleField) {
                titleField.closest('.form-group').insertAdjacentHTML('afterend', servicesHTML);
            }
        };

        // Services methods - ИСПРАВЛЕННЫЕ
        window.editor.addService = function() {
            console.log('➕ Adding new service...');
            
            // Ensure data structure
            if (!this.currentData.content.services) {
                this.currentData.content.services = {};
            }
            if (!this.currentData.content.services.services) {
                this.currentData.content.services.services = [];
            }
            
            // Add new service
            this.currentData.content.services.services.push({
                title: 'New Service',
                description: 'Service description',
                icon: 'fas fa-star'
            });
            
            console.log('🎯 Services after add:', this.currentData.content.services.services);
            
            this.hasUnsavedChanges = true;
            this.showNotification('Service added', 'success');
            
            // Refresh the editor to show new service
            this.showContentEditor();
        };

        window.editor.updateService = function(index, field, value) {
            console.log(`📝 Updating service ${index}.${field}:`, value);
            
            if (!this.currentData.content.services.services) {
                this.currentData.content.services.services = [];
            }
            
            if (!this.currentData.content.services.services[index]) {
                this.currentData.content.services.services[index] = {};
            }
            
            this.currentData.content.services.services[index][field] = value;
            this.hasUnsavedChanges = true;
            
            console.log('🎯 Services after update:', this.currentData.content.services.services);
        };

        window.editor.removeService = function(index) {
            console.log('🗑️ Removing service:', index);
            
            if (this.currentData.content?.services?.services?.[index]) {
                this.currentData.content.services.services.splice(index, 1);
                this.hasUnsavedChanges = true;
                this.showNotification('Service removed', 'success');
                
                // Refresh the editor
                this.showContentEditor();
            }
        };

        window.editor.collectServicesData = function() {
            if (this.currentSection.id !== 'services') return;
            
            const servicesList = document.getElementById('services-list');
            if (!servicesList) return;

            const serviceItems = servicesList.querySelectorAll('.service-item');
            const services = [];

            serviceItems.forEach(item => {
                const inputs = item.querySelectorAll('input');
                const textarea = item.querySelector('textarea');
                
                if (inputs.length >= 2) {
                    services.push({
                        title: inputs[0].value,
                        icon: inputs[1].value,
                        description: textarea ? textarea.value : ''
                    });
                }
            });

            console.log('💾 Collecting services data:', services);
            
            if (!this.currentData.content.services) {
                this.currentData.content.services = {};
            }
            this.currentData.content.services.services = services;
        };

        // Contact Manager
        window.editor.addContactManager = function() {
            if (this.currentSection.id !== 'contact') return;

            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor) return;

            // Remove existing manager
            const oldManager = contentEditor.querySelector('.contact-manager');
            if (oldManager) oldManager.remove();

            const contacts = this.currentData.contacts || {};
            
            const contactHTML = `
                <div class="contact-manager" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #e9ecef;">
                    <h4 style="color: #2c5aa0; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-address-book"></i>
                        Contact Information
                    </h4>
                    <div class="admin-hint" style="color: #666; margin-bottom: 15px; font-style: italic;">
                        Edit contact information. Changes will appear in contact section and footer.
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="form-group">
                            <label>Phone:</label>
                            <input type="text" value="${contacts.phone || ''}" 
                                   oninput="window.editor.updateContact('phone', this.value)"
                                   placeholder="+7 (999) 123-45-67"
                                   style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                        </div>
                        <div class="form-group">
                            <label>Email:</label>
                            <input type="email" value="${contacts.email || ''}" 
                                   oninput="window.editor.updateContact('email', this.value)"
                                   placeholder="info@worldtravel.com"
                                   style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                        </div>
                        <div class="form-group">
                            <label>Address:</label>
                            <input type="text" value="${contacts.address || ''}" 
                                   oninput="window.editor.updateContact('address', this.value)"
                                   placeholder="Москва, ул. Туристическая, 15"
                                   style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                        </div>
                        <div class="form-group">
                            <label>Working Hours:</label>
                            <input type="text" value="${contacts.hours || ''}" 
                                   oninput="window.editor.updateContact('hours', this.value)"
                                   placeholder="Пн-Пт: 9:00-18:00"
                                   style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                        </div>
                    </div>
                </div>
            `;

            const titleField = contentEditor.querySelector('[data-field="title"]');
            if (titleField) {
                titleField.closest('.form-group').insertAdjacentHTML('afterend', contactHTML);
            }
        };

        // Contact methods
        window.editor.updateContact = function(field, value) {
            if (!this.currentData.contacts) {
                this.currentData.contacts = {};
            }
            this.currentData.contacts[field] = value;
            this.hasUnsavedChanges = true;
        };

        window.editor.collectContactData = function() {
            if (this.currentSection.id !== 'contact') return;
            
            const contactManager = document.querySelector('.contact-manager');
            if (!contactManager) return;

            const inputs = contactManager.querySelectorAll('input');
            const contacts = {};

            inputs.forEach(input => {
                const placeholder = input.placeholder.toLowerCase();
                if (placeholder.includes('phone')) contacts.phone = input.value;
                else if (placeholder.includes('email')) contacts.email = input.value;
                else if (placeholder.includes('address')) contacts.address = input.value;
                else if (placeholder.includes('hours')) contacts.hours = input.value;
            });

            console.log('💾 Collecting contact data:', contacts);
            this.currentData.contacts = contacts;
        };

        console.log('✅ Editor successfully patched with fixed methods');
    }
}

// Initialize fixed editor
new SuperEditorFixed();

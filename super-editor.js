// Simple and Effective Super Editor
class SuperEditor {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 Super Editor initialized');
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
        console.log('🔧 Patching editor...');
        
        // Patch showContentEditor to add enhanced features
        const originalShowContentEditor = window.editor.showContentEditor;
        window.editor.showContentEditor = function() {
            originalShowContentEditor.call(this);
            setTimeout(() => this.addEnhancedFeatures(), 50);
        };

        // Add enhanced features method
        window.editor.addEnhancedFeatures = function() {
            this.addImageManager();
            this.addStatsManager();
            this.addServicesManager();
            this.addContactManager();
        };

        // Image Manager
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
            if (existingManager) return;

            const currentImage = this.getCurrentValue(field);
            const imageHTML = `
                <div class="form-group" data-image-field="${field.id}">
                    <label>${field.label}:</label>
                    <div class="image-manager" style="margin: 10px 0;">
                        <div class="image-preview" style="width: 100%; max-width: 300px; height: 200px; border: 2px dashed #ddd; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; overflow: hidden; background: #f8f9fa;">
                            ${currentImage ? 
                                `<img src="${currentImage}" alt="Preview" style="max-width: 100%; max-height: 100%; object-fit: cover;">` :
                                `<div style="text-align: center; color: #666;">
                                    <i class="fas fa-image" style="font-size: 2em; display: block; margin-bottom: 5px;"></i>
                                    <span>No image</span>
                                </div>`
                            }
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button type="button" class="btn-admin" onclick="window.editor.uploadImage('${field.id}')" style="background: #17a2b8;">
                                <i class="fas fa-upload"></i> Upload
                            </button>
                            <button type="button" class="btn-admin" onclick="window.editor.setImageUrl('${field.id}')" style="background: #6c757d;">
                                <i class="fas fa-link"></i> URL
                            </button>
                            ${currentImage ? `
                            <button type="button" class="btn-admin danger" onclick="window.editor.removeImage('${field.id}')" style="background: #dc3545;">
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
            }
        };

        window.editor.removeImage = function(fieldId) {
            if (confirm('Remove image?')) {
                this.updateImageField(fieldId, '');
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

        // Stats Manager for About section
        window.editor.addStatsManager = function() {
            if (this.currentSection.id !== 'about') return;

            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor) return;

            const stats = this.currentData.content?.about?.stats || [];
            
            const statsHTML = `
                <div class="stats-manager" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h4 style="color: #2c5aa0; margin-bottom: 15px;">📊 Statistics Blocks</h4>
                    <div id="stats-list">
                        ${stats.map((stat, index) => `
                            <div class="stat-item" style="display: flex; gap: 10px; margin-bottom: 10px; align-items: center;">
                                <input type="text" value="${stat.value}" placeholder="Value" 
                                       onchange="window.editor.updateStat(${index}, 'value', this.value)" 
                                       style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                <input type="text" value="${stat.label}" placeholder="Label" 
                                       onchange="window.editor.updateStat(${index}, 'label', this.value)"
                                       style="flex: 2; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                <button onclick="window.editor.removeStat(${index})" 
                                        style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    <button onclick="window.editor.addStat()" 
                            style="background: #28a745; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                        <i class="fas fa-plus"></i> Add Statistic
                    </button>
                </div>
            `;

            const descriptionField = contentEditor.querySelector('[data-field="description"]');
            if (descriptionField) {
                descriptionField.closest('.form-group').insertAdjacentHTML('afterend', statsHTML);
            }
        };

        // Stats methods
        window.editor.addStat = function() {
            if (!this.currentData.content.about) this.currentData.content.about = {};
            if (!this.currentData.content.about.stats) this.currentData.content.about.stats = [];
            
            this.currentData.content.about.stats.push({
                value: '0',
                label: 'New Stat'
            });
            
            this.hasUnsavedChanges = true;
            this.showContentEditor();
        };

        window.editor.updateStat = function(index, field, value) {
            if (!this.currentData.content.about) this.currentData.content.about = {};
            if (!this.currentData.content.about.stats) this.currentData.content.about.stats = [];
            
            if (!this.currentData.content.about.stats[index]) {
                this.currentData.content.about.stats[index] = {};
            }
            
            this.currentData.content.about.stats[index][field] = value;
            this.hasUnsavedChanges = true;
        };

        window.editor.removeStat = function(index) {
            if (this.currentData.content?.about?.stats?.[index]) {
                this.currentData.content.about.stats.splice(index, 1);
                this.hasUnsavedChanges = true;
                this.showContentEditor();
            }
        };

        // Services Manager
        window.editor.addServicesManager = function() {
            if (this.currentSection.id !== 'services') return;

            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor) return;

            const services = this.currentData.content?.services?.services || [];
            
            const servicesHTML = `
                <div class="services-manager" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h4 style="color: #2c5aa0; margin-bottom: 15px;">🎯 Services</h4>
                    <div id="services-list">
                        ${services.map((service, index) => `
                            <div class="service-item" style="margin-bottom: 15px; padding: 15px; background: white; border-radius: 6px; border: 1px solid #ddd;">
                                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                                    <input type="text" value="${service.title}" placeholder="Service Title" 
                                           onchange="window.editor.updateService(${index}, 'title', this.value)"
                                           style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                    <input type="text" value="${service.icon}" placeholder="Icon (fas fa-...)" 
                                           onchange="window.editor.updateService(${index}, 'icon', this.value)"
                                           style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                </div>
                                <textarea onchange="window.editor.updateService(${index}, 'description', this.value)"
                                          style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: vertical; min-height: 60px;"
                                          placeholder="Service description">${service.description}</textarea>
                                <button onclick="window.editor.removeService(${index})" 
                                        style="background: #dc3545; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; margin-top: 10px;">
                                    <i class="fas fa-trash"></i> Remove Service
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    <button onclick="window.editor.addService()" 
                            style="background: #28a745; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                        <i class="fas fa-plus"></i> Add Service
                    </button>
                </div>
            `;

            const titleField = contentEditor.querySelector('[data-field="title"]');
            if (titleField) {
                titleField.closest('.form-group').insertAdjacentHTML('afterend', servicesHTML);
            }
        };

        // Services methods
        window.editor.addService = function() {
            if (!this.currentData.content.services) this.currentData.content.services = {};
            if (!this.currentData.content.services.services) this.currentData.content.services.services = [];
            
            this.currentData.content.services.services.push({
                title: 'New Service',
                description: 'Service description',
                icon: 'fas fa-star'
            });
            
            this.hasUnsavedChanges = true;
            this.showContentEditor();
        };

        window.editor.updateService = function(index, field, value) {
            if (!this.currentData.content.services) this.currentData.content.services = {};
            if (!this.currentData.content.services.services) this.currentData.content.services.services = [];
            
            if (!this.currentData.content.services.services[index]) {
                this.currentData.content.services.services[index] = {};
            }
            
            this.currentData.content.services.services[index][field] = value;
            this.hasUnsavedChanges = true;
        };

        window.editor.removeService = function(index) {
            if (this.currentData.content?.services?.services?.[index]) {
                this.currentData.content.services.services.splice(index, 1);
                this.hasUnsavedChanges = true;
                this.showContentEditor();
            }
        };

        // Contact Manager
        window.editor.addContactManager = function() {
            if (this.currentSection.id !== 'contact') return;

            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor) return;

            const contacts = this.currentData.contacts || {};
            
            const contactHTML = `
                <div class="contact-manager" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h4 style="color: #2c5aa0; margin-bottom: 15px;">📞 Contact Information</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div>
                            <label>Phone:</label>
                            <input type="text" value="${contacts.phone || ''}" 
                                   onchange="window.editor.updateContact('phone', this.value)"
                                   placeholder="+7 (999) 123-45-67"
                                   style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        </div>
                        <div>
                            <label>Email:</label>
                            <input type="email" value="${contacts.email || ''}" 
                                   onchange="window.editor.updateContact('email', this.value)"
                                   placeholder="info@worldtravel.com"
                                   style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        </div>
                        <div>
                            <label>Address:</label>
                            <input type="text" value="${contacts.address || ''}" 
                                   onchange="window.editor.updateContact('address', this.value)"
                                   placeholder="Москва, ул. Туристическая, 15"
                                   style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        </div>
                        <div>
                            <label>Working Hours:</label>
                            <input type="text" value="${contacts.hours || ''}" 
                                   onchange="window.editor.updateContact('hours', this.value)"
                                   placeholder="Пн-Пт: 9:00-18:00"
                                   style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
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
            if (!this.currentData.contacts) this.currentData.contacts = {};
            this.currentData.contacts[field] = value;
            this.hasUnsavedChanges = true;
        };

        console.log('✅ Editor patched successfully');
    }
}

// Initialize
new SuperEditor();

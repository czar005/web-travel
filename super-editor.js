// Супер-редактор с полным функционалом
class SuperEditor {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 Super Editor initialized');
        this.patchExistingEditor();
        this.addImageManagement();
        this.addDynamicBlocks();
    }

    patchExistingEditor() {
        if (!window.editor) {
            setTimeout(() => this.patchExistingEditor(), 100);
            return;
        }

        // Переопределяем showContentEditor для добавления расширенного функционала
        const originalShowContentEditor = window.editor.showContentEditor;
        window.editor.showContentEditor = function() {
            originalShowContentEditor.call(this);
            this.addEnhancedFeatures();
        };

        // Добавляем расширенные функции
        window.editor.addEnhancedFeatures = function() {
            this.addImageUploader();
            this.addDynamicBlocksManager();
            this.addContactEditor();
        };

        // Управление изображениями
        window.editor.addImageUploader = function() {
            if (!this.currentSection) return;

            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor) return;

            // Проверяем есть ли поле изображения в секции
            const hasImageField = this.currentSection.fields?.some(field => field.type === 'image');
            if (!hasImageField) return;

            // Добавляем загрузчик изображений если его нет
            if (!contentEditor.querySelector('.image-manager-enhanced')) {
                const imageField = this.currentSection.fields.find(field => field.type === 'image');
                if (imageField) {
                    const imageManagerHTML = this.createImageManagerHTML(imageField);
                    
                    // Вставляем после заголовка
                    const titleField = contentEditor.querySelector('[data-field="title"]');
                    if (titleField) {
                        titleField.closest('.form-group').insertAdjacentHTML('afterend', imageManagerHTML);
                    }
                }
            }
        };

        // Создание HTML для менеджера изображений
        window.editor.createImageManagerHTML = function(field) {
            const currentImage = this.getCurrentValue(field);
            
            return `
                <div class="image-manager-enhanced" style="margin: 20px 0;">
                    <div class="form-group">
                        <label>${field.label}:</label>
                        <div class="image-preview-container" style="margin: 15px 0;">
                            <div class="image-preview-enhanced ${!currentImage ? 'empty' : ''}" 
                                 style="width: 100%; max-width: 400px; height: 250px; border: 2px dashed #ddd; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; overflow: hidden; background: #f8f9fa;">
                                ${currentImage ? 
                                    `<img src="${currentImage}" alt="Preview" style="max-width: 100%; max-height: 100%; object-fit: cover;">` :
                                    `<div style="text-align: center; color: #666;">
                                        <i class="fas fa-image" style="font-size: 3em; margin-bottom: 10px; display: block;"></i>
                                        <span>Изображение не выбрано</span>
                                     </div>`
                                }
                            </div>
                            <div class="image-actions-enhanced" style="display: flex; gap: 10px; flex-wrap: wrap;">
                                <button type="button" class="btn-admin" onclick="window.editor.uploadImage('${field.id}')" 
                                        style="background: #17a2b8; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
                                    <i class="fas fa-upload"></i> Загрузить изображение
                                </button>
                                <button type="button" class="btn-admin" onclick="window.editor.setImageUrl('${field.id}')" 
                                        style="background: #6c757d; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
                                    <i class="fas fa-link"></i> Указать URL
                                </button>
                                ${currentImage ? `
                                <button type="button" class="btn-admin danger" onclick="window.editor.removeImage('${field.id}')" 
                                        style="background: #dc3545; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
                                    <i class="fas fa-trash"></i> Удалить изображение
                                </button>
                                ` : ''}
                            </div>
                            <input type="hidden" data-field="${field.id}" value="${currentImage || ''}">
                        </div>
                    </div>
                </div>
            `;
        };

        // Методы для работы с изображениями
        window.editor.uploadImage = function(fieldId) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                        this.showNotification('Размер файла не должен превышать 5MB', 'error');
                        return;
                    }
                    
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.updateImageField(fieldId, e.target.result);
                        this.showNotification('Изображение загружено', 'success');
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        };

        window.editor.setImageUrl = function(fieldId) {
            const url = prompt('Введите URL изображения:');
            if (url) {
                this.updateImageField(fieldId, url);
                this.showNotification('URL изображения установлен', 'success');
            }
        };

        window.editor.removeImage = function(fieldId) {
            if (confirm('Удалить изображение?')) {
                this.updateImageField(fieldId, '');
                this.showNotification('Изображение удалено', 'success');
            }
        };

        window.editor.updateImageField = function(fieldId, url) {
            const field = document.querySelector(`[data-field="${fieldId}"]`);
            if (field) {
                field.value = url;
                
                const preview = document.querySelector('.image-preview-enhanced');
                if (preview) {
                    if (url) {
                        preview.innerHTML = `<img src="${url}" alt="Preview" style="max-width: 100%; max-height: 100%; object-fit: cover;">`;
                        preview.classList.remove('empty');
                        
                        // Добавляем кнопку удаления если её нет
                        const actions = document.querySelector('.image-actions-enhanced');
                        if (actions && !actions.querySelector('.danger')) {
                            const deleteBtn = document.createElement('button');
                            deleteBtn.className = 'btn-admin danger';
                            deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Удалить изображение';
                            deleteBtn.onclick = () => this.removeImage(fieldId);
                            deleteBtn.style.cssText = 'background: #dc3545; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;';
                            actions.appendChild(deleteBtn);
                        }
                    } else {
                        preview.innerHTML = `
                            <div style="text-align: center; color: #666;">
                                <i class="fas fa-image" style="font-size: 3em; margin-bottom: 10px; display: block;"></i>
                                <span>Изображение не выбрано</span>
                            </div>
                        `;
                        preview.classList.add('empty');
                        
                        // Удаляем кнопку удаления
                        const deleteBtn = document.querySelector('.image-actions-enhanced .danger');
                        if (deleteBtn) deleteBtn.remove();
                    }
                }
                
                this.hasUnsavedChanges = true;
            }
        };

        // Управление динамическими блоками
        window.editor.addDynamicBlocksManager = function() {
            if (this.currentSection?.id === 'about') {
                this.addStatsBlocksManager();
            }
            if (this.currentSection?.id === 'services') {
                this.addServicesBlocksManager();
            }
        };

        // Менеджер блоков статистики
        window.editor.addStatsBlocksManager = function() {
            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor) return;

            // Удаляем старый редактор если есть
            const oldEditor = contentEditor.querySelector('.stats-blocks-manager');
            if (oldEditor) oldEditor.remove();

            const stats = this.currentData.content?.about?.stats || [];
            
            const statsHTML = `
                <div class="stats-blocks-manager" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #e9ecef;">
                    <h4 style="color: #2c5aa0; margin-bottom: 15px;">📊 Управление блоками статистики</h4>
                    <div class="admin-hint" style="color: #666; margin-bottom: 15px; font-style: italic;">
                        Добавляйте, редактируйте или удаляйте блоки статистики. Максимум 6 блоков.
                    </div>
                    <div id="stats-blocks-list">
                        ${stats.map((stat, index) => `
                            <div class="stat-block-row" data-index="${index}" style="display: flex; gap: 10px; margin-bottom: 15px; align-items: center; padding: 15px; background: white; border-radius: 6px; border: 1px solid #e9ecef;">
                                <input type="text" class="form-control" value="${stat.value}" placeholder="Значение (например: 5000)" 
                                       oninput="window.editor.updateStatData(${index}, 'value', this.value)" style="flex: 1;">
                                <input type="text" class="form-control" value="${stat.label}" placeholder="Подпись (например: Довольных клиентов)" 
                                       oninput="window.editor.updateStatData(${index}, 'label', this.value)" style="flex: 2;">
                                <button class="btn-small danger" onclick="window.editor.removeStatBlock(${index})" 
                                        style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    <div class="dynamic-blocks-controls" style="display: flex; gap: 10px; margin-top: 15px;">
                        <button class="btn-admin" onclick="window.editor.addStatBlock()" 
                                style="background: #28a745; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;"
                                ${stats.length >= 6 ? 'disabled' : ''}>
                            <i class="fas fa-plus"></i> Добавить блок статистики
                        </button>
                        <span style="color: #666; font-size: 0.9em; align-self: center;">
                            ${stats.length}/6 блоков
                        </span>
                    </div>
                </div>
            `;

            // Вставляем после описания или изображения
            const targetElement = contentEditor.querySelector('[data-field="description"]') || 
                                 contentEditor.querySelector('.image-manager-enhanced');
            if (targetElement) {
                targetElement.closest('.form-group').insertAdjacentHTML('afterend', statsHTML);
            }
        };

        // Методы для работы с блоками статистики
        window.editor.addStatBlock = function() {
            if (!this.currentData.content.about) this.currentData.content.about = {};
            if (!this.currentData.content.about.stats) this.currentData.content.about.stats = [];
            
            if (this.currentData.content.about.stats.length >= 6) {
                this.showNotification('Максимум 6 блоков статистики', 'error');
                return;
            }
            
            this.currentData.content.about.stats.push({ 
                value: '0', 
                label: 'Новый показатель' 
            });
            
            this.hasUnsavedChanges = true;
            this.addStatsBlocksManager();
            this.showNotification('Блок статистики добавлен', 'success');
        };

        window.editor.updateStatData = function(index, field, value) {
            if (!this.currentData.content.about) this.currentData.content.about = {};
            if (!this.currentData.content.about.stats) this.currentData.content.about.stats = [];
            
            if (!this.currentData.content.about.stats[index]) {
                this.currentData.content.about.stats[index] = {};
            }
            
            this.currentData.content.about.stats[index][field] = value;
            this.hasUnsavedChanges = true;
        };

        window.editor.removeStatBlock = function(index) {
            if (this.currentData.content?.about?.stats?.[index]) {
                this.currentData.content.about.stats.splice(index, 1);
                this.hasUnsavedChanges = true;
                this.addStatsBlocksManager();
                this.showNotification('Блок статистики удален', 'success');
            }
        };

        // Менеджер блоков услуг (аналогично статистике)
        window.editor.addServicesBlocksManager = function() {
            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor) return;

            const oldEditor = contentEditor.querySelector('.services-blocks-manager');
            if (oldEditor) oldEditor.remove();

            const services = this.currentData.content?.services?.services || [];
            
            const servicesHTML = `
                <div class="services-blocks-manager" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #e9ecef;">
                    <h4 style="color: #2c5aa0; margin-bottom: 15px;">🎯 Управление услугами</h4>
                    <div class="admin-hint" style="color: #666; margin-bottom: 15px; font-style: italic;">
                        Добавляйте, редактируйте или удаляйте услуги. Максимум 8 услуг.
                    </div>
                    <div id="services-blocks-list">
                        ${services.map((service, index) => `
                            <div class="service-block-row" data-index="${index}" style="display: flex; gap: 10px; margin-bottom: 15px; padding: 15px; background: white; border-radius: 6px; border: 1px solid #e9ecef;">
                                <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
                                    <input type="text" class="form-control" value="${service.title}" placeholder="Название услуги" 
                                           oninput="window.editor.updateServiceData(${index}, 'title', this.value)">
                                    <textarea class="form-control" placeholder="Описание услуги" 
                                              oninput="window.editor.updateServiceData(${index}, 'description', this.value)" 
                                              style="min-height: 80px; resize: vertical;">${service.description}</textarea>
                                    <input type="text" class="form-control" value="${service.icon}" placeholder="Иконка (fas fa-...)" 
                                           oninput="window.editor.updateServiceData(${index}, 'icon', this.value)">
                                </div>
                                <button class="btn-small danger" onclick="window.editor.removeServiceBlock(${index})" 
                                        style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; align-self: start;">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    <div class="dynamic-blocks-controls" style="display: flex; gap: 10px; margin-top: 15px;">
                        <button class="btn-admin" onclick="window.editor.addServiceBlock()" 
                                style="background: #28a745; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;"
                                ${services.length >= 8 ? 'disabled' : ''}>
                            <i class="fas fa-plus"></i> Добавить услугу
                        </button>
                        <span style="color: #666; font-size: 0.9em; align-self: center;">
                            ${services.length}/8 услуг
                        </span>
                    </div>
                </div>
            `;

            const targetElement = contentEditor.querySelector('[data-field="title"]');
            if (targetElement) {
                targetElement.closest('.form-group').insertAdjacentHTML('afterend', servicesHTML);
            }
        };

        // Методы для работы с услугами
        window.editor.addServiceBlock = function() {
            if (!this.currentData.content.services) this.currentData.content.services = {};
            if (!this.currentData.content.services.services) this.currentData.content.services.services = [];
            
            if (this.currentData.content.services.services.length >= 8) {
                this.showNotification('Максимум 8 услуг', 'error');
                return;
            }
            
            this.currentData.content.services.services.push({ 
                title: 'Новая услуга', 
                description: 'Описание новой услуги',
                icon: 'fas fa-star'
            });
            
            this.hasUnsavedChanges = true;
            this.addServicesBlocksManager();
            this.showNotification('Услуга добавлена', 'success');
        };

        window.editor.updateServiceData = function(index, field, value) {
            if (!this.currentData.content.services) this.currentData.content.services = {};
            if (!this.currentData.content.services.services) this.currentData.content.services.services = [];
            
            if (!this.currentData.content.services.services[index]) {
                this.currentData.content.services.services[index] = {};
            }
            
            this.currentData.content.services.services[index][field] = value;
            this.hasUnsavedChanges = true;
        };

        window.editor.removeServiceBlock = function(index) {
            if (this.currentData.content?.services?.services?.[index]) {
                this.currentData.content.services.services.splice(index, 1);
                this.hasUnsavedChanges = true;
                this.addServicesBlocksManager();
                this.showNotification('Услуга удалена', 'success');
            }
        };

        // Редактор контактов
        window.editor.addContactEditor = function() {
            if (this.currentSection?.id === 'contact') {
                this.injectContactFields();
            }
        };

        window.editor.injectContactFields = function() {
            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor) return;

            const contacts = this.currentData.contacts || {};
            
            const contactFieldsHTML = `
                <div class="contact-fields-editor" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #e9ecef;">
                    <h4 style="color: #2c5aa0; margin-bottom: 15px;">📞 Контактная информация</h4>
                    <div class="admin-hint" style="color: #666; margin-bottom: 15px; font-style: italic;">
                        Редактируйте контактную информацию. Изменения отобразятся в секции контактов и футере.
                    </div>
                    <div class="contact-fields-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="form-group">
                            <label>Телефон:</label>
                            <input type="text" class="form-control" value="${contacts.phone || ''}" 
                                   oninput="window.editor.updateContactField('phone', this.value)" 
                                   placeholder="+7 (999) 123-45-67">
                        </div>
                        <div class="form-group">
                            <label>Email:</label>
                            <input type="email" class="form-control" value="${contacts.email || ''}" 
                                   oninput="window.editor.updateContactField('email', this.value)" 
                                   placeholder="info@worldtravel.com">
                        </div>
                        <div class="form-group">
                            <label>Адрес:</label>
                            <input type="text" class="form-control" value="${contacts.address || ''}" 
                                   oninput="window.editor.updateContactField('address', this.value)" 
                                   placeholder="Москва, ул. Туристическая, 15">
                        </div>
                        <div class="form-group">
                            <label>Часы работы:</label>
                            <input type="text" class="form-control" value="${contacts.hours || ''}" 
                                   oninput="window.editor.updateContactField('hours', this.value)" 
                                   placeholder="Пн-Пт: 9:00-18:00">
                        </div>
                    </div>
                </div>
            `;

            const targetElement = contentEditor.querySelector('[data-field="title"]');
            if (targetElement) {
                targetElement.closest('.form-group').insertAdjacentHTML('afterend', contactFieldsHTML);
            }
        };

        window.editor.updateContactField = function(field, value) {
            if (!this.currentData.contacts) this.currentData.contacts = {};
            this.currentData.contacts[field] = value;
            this.hasUnsavedChanges = true;
        };
    }

    addImageManagement() {
        // CSS стили для менеджера изображений
        const style = document.createElement('style');
        style.textContent = `
            .image-preview-enhanced.empty {
                background: linear-gradient(45deg, #f8f9fa 25%, transparent 25%), 
                            linear-gradient(-45deg, #f8f9fa 25%, transparent 25%), 
                            linear-gradient(45deg, transparent 75%, #f8f9fa 75%), 
                            linear-gradient(-45deg, transparent 75%, #f8f9fa 75%);
                background-size: 20px 20px;
                background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
            }
            
            .stat-block-row:hover, .service-block-row:hover {
                border-color: #2c5aa0 !important;
                background: #f8f9fa !important;
            }
            
            @media (max-width: 768px) {
                .contact-fields-grid {
                    grid-template-columns: 1fr !important;
                }
                
                .stat-block-row, .service-block-row {
                    flex-direction: column !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    addDynamicBlocks() {
        console.log('📦 Dynamic blocks system ready');
    }
}

// Инициализация супер-редактора
new SuperEditor();

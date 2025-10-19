// Улучшенный редактор с исправленным сохранением статистики и услуг
function EnhancedPageEditorFixed() {
    this.init();
}

EnhancedPageEditorFixed.prototype.init = function() {
    console.log('🚀 Улучшенный редактор с исправлениями загружен');
    this.patchExistingEditor();
    this.injectEnhancedUI();
};

EnhancedPageEditorFixed.prototype.patchExistingEditor = function() {
    if (!window.editor) {
        setTimeout(() => this.patchExistingEditor(), 100);
        return;
    }

    // Патчим метод showContentEditor для добавления редактора статистики
    const originalShowContentEditor = window.editor.showContentEditor;
    window.editor.showContentEditor = function() {
        originalShowContentEditor.call(this);
        this.injectStatsEditor();
        this.injectServicesEditor();
        this.injectImageManager();
    };

    // Патчим метод saveChanges для правильного сохранения
    const originalSaveChanges = window.editor.saveChanges;
    window.editor.saveChanges = function() {
        this.saveStatsData();
        this.saveServicesData();
        return originalSaveChanges.call(this);
    };

    // Добавляем методы для работы со статистикой
    window.editor.injectStatsEditor = function() {
        if (this.currentSection?.id !== 'about') return;
        
        const contentEditor = document.getElementById('content-editor');
        if (!contentEditor) return;

        // Удаляем старый редактор статистики если есть
        const oldEditor = contentEditor.querySelector('.stats-editor-enhanced');
        if (oldEditor) oldEditor.remove();

        const stats = this.currentData.content?.about?.stats || [];
        
        // Не показываем редактор статистики если нет данных
        if (stats.length === 0) return;
        
        const statsHTML = `
            <div class="stats-editor-enhanced" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #e9ecef;">
                <h4 style="color: #2c5aa0; margin-bottom: 15px;">📊 Управление статистикой</h4>
                <div class="admin-hint" style="color: #666; margin-bottom: 15px; font-style: italic;">
                    Редактируйте блоки статистики. Изменения сохраняются автоматически при нажатии "Сохранить изменения"
                </div>
                <div id="stats-list-enhanced">
                    ${stats.map((stat, index) => `
                        <div class="stat-row-enhanced" style="display: flex; gap: 10px; margin-bottom: 15px; align-items: center; padding: 15px; background: white; border-radius: 6px; border: 1px solid #e9ecef;">
                            <input type="text" class="form-control" value="${stat.value}" placeholder="Значение" 
                                   oninput="window.editor.updateStatData(${index}, 'value', this.value)">
                            <input type="text" class="form-control" value="${stat.label}" placeholder="Подпись" 
                                   oninput="window.editor.updateStatData(${index}, 'label', this.value)">
                            <button class="btn-small danger" onclick="window.editor.removeStatData(${index})" style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
                <div class="dynamic-items-controls" style="display: flex; gap: 10px; margin-top: 15px;">
                    <button class="btn-admin" onclick="window.editor.addStatData()" style="background: #28a745; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
                        <i class="fas fa-plus"></i> Добавить статистику
                    </button>
                    <button class="btn-admin warning" onclick="window.editor.clearAllStats()" style="background: #ffc107; color: black; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
                        <i class="fas fa-trash-alt"></i> Очистить все
                    </button>
                </div>
            </div>
        `;

        // Вставляем после описания
        const descriptionField = contentEditor.querySelector('[data-field="description"]');
        if (descriptionField) {
            descriptionField.closest('.form-group').insertAdjacentHTML('afterend', statsHTML);
        }
    };

    // Методы для работы со статистикой
    window.editor.addStatData = function() {
        if (!this.currentData.content.about) this.currentData.content.about = {};
        if (!this.currentData.content.about.stats) this.currentData.content.about.stats = [];
        
        this.currentData.content.about.stats.push({ 
            value: '0', 
            label: 'Новый показатель' 
        });
        
        this.hasUnsavedChanges = true;
        this.injectStatsEditor();
        this.showNotification('Статистика добавлена', 'success');
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

    window.editor.removeStatData = function(index) {
        if (this.currentData.content?.about?.stats?.[index]) {
            this.currentData.content.about.stats.splice(index, 1);
            this.hasUnsavedChanges = true;
            this.injectStatsEditor();
            this.showNotification('Статистика удалена', 'success');
        }
    };

    window.editor.clearAllStats = function() {
        if (confirm('Очистить всю статистику? Это действие нельзя отменить.')) {
            if (this.currentData.content?.about?.stats) {
                this.currentData.content.about.stats = [];
                this.hasUnsavedChanges = true;
                this.injectStatsEditor();
                this.showNotification('Вся статистика очищена', 'success');
            }
        }
    };

    window.editor.saveStatsData = function() {
        if (this.currentSection?.id !== 'about') return;
        
        const statsList = document.getElementById('stats-list-enhanced');
        if (!statsList) return;

        const statRows = statsList.querySelectorAll('.stat-row-enhanced');
        const stats = [];

        statRows.forEach(row => {
            const inputs = row.querySelectorAll('input');
            if (inputs.length >= 2) {
                const value = inputs[0].value.trim();
                const label = inputs[1].value.trim();
                if (value && label) { // Сохраняем только непустые значения
                    stats.push({
                        value: value,
                        label: label
                    });
                }
            }
        });

        console.log('💾 Сохранение статистики:', stats);
        
        if (!this.currentData.content.about) {
            this.currentData.content.about = {};
        }
        this.currentData.content.about.stats = stats;
    };

    // Методы для работы с услугами
    window.editor.injectServicesEditor = function() {
        if (this.currentSection?.id !== 'services') return;
        
        const contentEditor = document.getElementById('content-editor');
        if (!contentEditor) return;

        const oldEditor = contentEditor.querySelector('.services-editor-enhanced');
        if (oldEditor) oldEditor.remove();

        const services = this.currentData.content?.services?.services || [];
        
        // Не показываем редактор услуг если нет данных
        if (services.length === 0) return;
        
        const servicesHTML = `
            <div class="services-editor-enhanced" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #e9ecef;">
                <h4 style="color: #2c5aa0; margin-bottom: 15px;">🎯 Управление услугами</h4>
                <div class="admin-hint" style="color: #666; margin-bottom: 15px; font-style: italic;">
                    Редактируйте услуги. Изменения сохраняются автоматически при нажатии "Сохранить изменения"
                </div>
                <div id="services-list-enhanced">
                    ${services.map((service, index) => `
                        <div class="service-row-enhanced" style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 6px; border: 1px solid #e9ecef;">
                            <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                                <input type="text" class="form-control" value="${service.title}" placeholder="Название услуги" 
                                       oninput="window.editor.updateServiceData(${index}, 'title', this.value)">
                                <input type="text" class="form-control" value="${service.icon}" placeholder="Иконка (fas fa-...)" 
                                       oninput="window.editor.updateServiceData(${index}, 'icon', this.value)">
                            </div>
                            <textarea class="form-control" placeholder="Описание услуги" 
                                      oninput="window.editor.updateServiceData(${index}, 'description', this.value)"
                                      style="width: 100%; min-height: 80px; margin-bottom: 10px;">${service.description}</textarea>
                            <button class="btn-small danger" onclick="window.editor.removeServiceData(${index})" style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">
                                <i class="fas fa-trash"></i> Удалить услугу
                            </button>
                        </div>
                    `).join('')}
                </div>
                <div class="dynamic-items-controls" style="display: flex; gap: 10px; margin-top: 15px;">
                    <button class="btn-admin" onclick="window.editor.addServiceData()" style="background: #28a745; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
                        <i class="fas fa-plus"></i> Добавить услугу
                    </button>
                    <button class="btn-admin warning" onclick="window.editor.clearAllServices()" style="background: #ffc107; color: black; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
                        <i class="fas fa-trash-alt"></i> Очистить все
                    </button>
                </div>
            </div>
        `;

        const titleField = contentEditor.querySelector('[data-field="title"]');
        if (titleField) {
            titleField.closest('.form-group').insertAdjacentHTML('afterend', servicesHTML);
        }
    };

    window.editor.addServiceData = function() {
        if (!this.currentData.content.services) this.currentData.content.services = {};
        if (!this.currentData.content.services.services) this.currentData.content.services.services = [];
        
        this.currentData.content.services.services.push({ 
            title: 'Новая услуга', 
            description: 'Описание новой услуги',
            icon: 'fas fa-star'
        });
        
        this.hasUnsavedChanges = true;
        this.injectServicesEditor();
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

    window.editor.removeServiceData = function(index) {
        if (this.currentData.content?.services?.services?.[index]) {
            this.currentData.content.services.services.splice(index, 1);
            this.hasUnsavedChanges = true;
            this.injectServicesEditor();
            this.showNotification('Услуга удалена', 'success');
        }
    };

    window.editor.clearAllServices = function() {
        if (confirm('Очистить все услуги? Это действие нельзя отменить.')) {
            if (this.currentData.content?.services?.services) {
                this.currentData.content.services.services = [];
                this.hasUnsavedChanges = true;
                this.injectServicesEditor();
                this.showNotification('Все услуги очищены', 'success');
            }
        }
    };

    window.editor.saveServicesData = function() {
        if (this.currentSection?.id !== 'services') return;
        
        const servicesList = document.getElementById('services-list-enhanced');
        if (!servicesList) return;

        const serviceRows = servicesList.querySelectorAll('.service-row-enhanced');
        const services = [];

        serviceRows.forEach(row => {
            const titleInput = row.querySelector('input[placeholder="Название услуги"]');
            const iconInput = row.querySelector('input[placeholder="Иконка (fas fa...)"]');
            const descTextarea = row.querySelector('textarea');
            
            if (titleInput && descTextarea) {
                const title = titleInput.value.trim();
                const description = descTextarea.value.trim();
                const icon = iconInput ? iconInput.value.trim() : 'fas fa-star';
                
                if (title && description) { // Сохраняем только непустые услуги
                    services.push({
                        title: title,
                        description: description,
                        icon: icon
                    });
                }
            }
        });

        console.log('💾 Сохранение услуг:', services);
        
        if (!this.currentData.content.services) {
            this.currentData.content.services = {};
        }
        this.currentData.content.services.services = services;
    };

    // Менеджер изображений
    window.editor.injectImageManager = function() {
        const contentEditor = document.getElementById('content-editor');
        if (!contentEditor) return;

        // Находим все поля для изображений
        const imageFields = contentEditor.querySelectorAll('[data-field*="image"], [data-field*="Image"]');
        
        imageFields.forEach(field => {
            const fieldId = field.getAttribute('data-field');
            const currentValue = field.value;
            
            // Создаем контейнер для управления изображением
            const imageContainer = document.createElement('div');
            imageContainer.className = 'image-manager-container';
            imageContainer.style.margin = '10px 0';
            imageContainer.style.padding = '15px';
            imageContainer.style.background = '#f8f9fa';
            imageContainer.style.borderRadius = '8px';
            imageContainer.style.border = '2px solid #e9ecef';
            
            imageContainer.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <strong style="color: #2c5aa0;">Управление изображением</strong>
                    <div>
                        <button type="button" class="btn-admin" onclick="window.editor.uploadImage('${fieldId}')" style="background: #17a2b8; margin-right: 5px;">
                            <i class="fas fa-upload"></i> Загрузить
                        </button>
                        <button type="button" class="btn-admin" onclick="window.editor.setImageUrl('${fieldId}')" style="background: #6c757d; margin-right: 5px;">
                            <i class="fas fa-link"></i> URL
                        </button>
                        ${currentValue ? `
                        <button type="button" class="btn-admin danger" onclick="window.editor.removeImage('${fieldId}')" style="background: #dc3545;">
                            <i class="fas fa-trash"></i> Удалить
                        </button>
                        ` : ''}
                    </div>
                </div>
                <div class="image-preview" style="width: 100%; max-width: 300px; height: 200px; border: 2px dashed #ddd; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; overflow: hidden; background: white;">
                    ${currentValue ? 
                        `<img src="${currentValue}" alt="Preview" style="max-width: 100%; max-height: 100%; object-fit: cover;">` :
                        `<div style="text-align: center; color: #666;">
                            <i class="fas fa-image" style="font-size: 2em; display: block; margin-bottom: 5px;"></i>
                            <span>Изображение не выбрано</span>
                        </div>`
                    }
                </div>
                ${currentValue ? `
                <div style="font-size: 12px; color: #666; background: white; padding: 8px; border-radius: 4px;">
                    <strong>Текущее изображение:</strong><br>
                    <span style="word-break: break-all;">${currentValue}</span>
                </div>
                ` : ''}
            `;
            
            // Вставляем контейнер после поля
            field.parentNode.insertBefore(imageContainer, field.nextSibling);
        });
    };

    // Методы для работы с изображениями
    window.editor.uploadImage = function(fieldId) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // Проверяем размер файла (максимум 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    this.showNotification('Файл слишком большой. Максимальный размер: 5MB', 'error');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.updateImageField(fieldId, e.target.result);
                    this.showNotification('Изображение загружено успешно', 'success');
                };
                reader.onerror = () => {
                    this.showNotification('Ошибка загрузки изображения', 'error');
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    window.editor.setImageUrl = function(fieldId) {
        const url = prompt('Введите URL изображения:');
        if (url) {
            // Простая валидация URL
            if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image')) {
                this.updateImageField(fieldId, url);
                this.showNotification('URL изображения установлен', 'success');
            } else {
                this.showNotification('Введите корректный URL изображения', 'error');
            }
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
            
            // Обновляем превью
            const container = field.nextElementSibling;
            if (container && container.classList.contains('image-manager-container')) {
                const preview = container.querySelector('.image-preview');
                const currentImageInfo = container.querySelector('div:last-child');
                
                if (preview) {
                    if (url) {
                        preview.innerHTML = `<img src="${url}" alt="Preview" style="max-width: 100%; max-height: 100%; object-fit: cover;">`;
                    } else {
                        preview.innerHTML = `
                            <div style="text-align: center; color: #666;">
                                <i class="fas fa-image" style="font-size: 2em; display: block; margin-bottom: 5px;"></i>
                                <span>Изображение не выбрано</span>
                            </div>
                        `;
                    }
                }
                
                // Обновляем информацию о текущем изображении
                if (currentImageInfo) {
                    if (url) {
                        currentImageInfo.innerHTML = `
                            <strong>Текущее изображение:</strong><br>
                            <span style="word-break: break-all;">${url}</span>
                        `;
                        currentImageInfo.style.display = 'block';
                    } else {
                        currentImageInfo.style.display = 'none';
                    }
                }
                
                // Обновляем кнопки управления
                const buttonsContainer = container.querySelector('div:first-child div');
                if (buttonsContainer) {
                    if (url) {
                        if (!buttonsContainer.querySelector('.btn-admin.danger')) {
                            const deleteBtn = document.createElement('button');
                            deleteBtn.className = 'btn-admin danger';
                            deleteBtn.style.background = '#dc3545';
                            deleteBtn.style.marginRight = '5px';
                            deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Удалить';
                            deleteBtn.onclick = () => this.removeImage(fieldId);
                            buttonsContainer.appendChild(deleteBtn);
                        }
                    } else {
                        const deleteBtn = buttonsContainer.querySelector('.btn-admin.danger');
                        if (deleteBtn) {
                            deleteBtn.remove();
                        }
                    }
                }
            }
            
            this.hasUnsavedChanges = true;
        }
    };
};

EnhancedPageEditorFixed.prototype.injectEnhancedUI = function() {
    // Добавляем CSS стили для улучшенного редактора
    const style = document.createElement('style');
    style.textContent = `
        .stats-editor-enhanced,
        .services-editor-enhanced {
            transition: all 0.3s ease;
        }
        
        .stat-row-enhanced:hover,
        .service-row-enhanced:hover {
            border-color: #2c5aa0 !important;
            background: #f8f9fa !important;
        }
        
        .image-manager-container {
            transition: all 0.3s ease;
        }
        
        .image-preview:hover {
            border-color: #2c5aa0 !important;
        }
        
        @media (max-width: 768px) {
            .stat-row-enhanced {
                flex-direction: column !important;
                align-items: stretch !important;
            }
            
            .image-manager-container div:first-child {
                flex-direction: column !important;
                gap: 10px !important;
            }
        }
    `;
    document.head.appendChild(style);
};

// Инициализация
new EnhancedPageEditorFixed();

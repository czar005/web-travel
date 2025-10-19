// Улучшенный редактор с исправленным сохранением статистики, услуг и изображений
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

    console.log('🔧 Patching editor methods...');

    // Патчим метод showContentEditor для добавления улучшенных редакторов
    const originalShowContentEditor = window.editor.showContentEditor;
    window.editor.showContentEditor = function() {
        originalShowContentEditor.call(this);
        setTimeout(() => {
            this.injectEnhancedEditors();
        }, 100);
    };

    // Патчим метод saveChanges для правильного сохранения всех данных
    const originalSaveChanges = window.editor.saveChanges;
    window.editor.saveChanges = function() {
        this.saveEnhancedData();
        return originalSaveChanges.call(this);
    };

    // Добавляем улучшенные методы
    window.editor.injectEnhancedEditors = function() {
        this.injectStatsEditor();
        this.injectServicesEditor();
        this.injectImageEditors();
        this.injectFooterEditor();
        this.injectContactsEditor();
    };

    // Единый редактор статистики для секции "О компании"
    window.editor.injectStatsEditor = function() {
        if (this.currentSection?.id !== 'about') return;
        
        const contentEditor = document.getElementById('content-editor');
        if (!contentEditor) return;

        // Удаляем старые редакторы статистики если есть
        const oldEditors = contentEditor.querySelectorAll('.stats-editor-enhanced, .stats-editor');
        oldEditors.forEach(editor => editor.remove());

        const stats = this.currentData.content?.about?.stats || [];
        
        const statsHTML = `
            <div class="stats-editor-enhanced" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #e9ecef;">
                <h4 style="color: #2c5aa0; margin-bottom: 15px;">📊 Управление статистикой</h4>
                <div class="admin-hint" style="color: #666; margin-bottom: 15px; font-style: italic;">
                    Добавляйте, редактируйте или удаляйте блоки статистики. Пустые блоки автоматически скрываются.
                </div>
                <div id="stats-list-enhanced">
                    ${stats.map((stat, index) => `
                        <div class="stat-row-enhanced" style="display: flex; gap: 10px; margin-bottom: 15px; align-items: center; padding: 15px; background: white; border-radius: 6px; border: 1px solid #e9ecef;">
                            <input type="text" class="form-control" value="${stat.value || ''}" placeholder="Значение (например: 5000)" 
                                   oninput="window.editor.updateStatData(${index}, 'value', this.value)">
                            <input type="text" class="form-control" value="${stat.label || ''}" placeholder="Подпись (например: Довольных клиентов)" 
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
                    ${stats.length > 0 ? `
                    <button class="btn-admin warning" onclick="window.editor.clearAllStats()" style="background: #ffc107; color: black; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
                        <i class="fas fa-trash-alt"></i> Очистить все
                    </button>
                    ` : ''}
                </div>
            </div>
        `;

        // Вставляем после описания
        const descriptionField = contentEditor.querySelector('[data-field="description"]');
        if (descriptionField) {
            descriptionField.closest('.form-group').insertAdjacentHTML('afterend', statsHTML);
        }
    };

    // Единый редактор услуг для секции "Услуги"
    window.editor.injectServicesEditor = function() {
        if (this.currentSection?.id !== 'services') return;
        
        const contentEditor = document.getElementById('content-editor');
        if (!contentEditor) return;

        // Удаляем старые редакторы услуг если есть
        const oldEditors = contentEditor.querySelectorAll('.services-editor-enhanced, .services-editor');
        oldEditors.forEach(editor => editor.remove());

        const services = this.currentData.content?.services?.services || [];
        
        const servicesHTML = `
            <div class="services-editor-enhanced" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #e9ecef;">
                <h4 style="color: #2c5aa0; margin-bottom: 15px;">🎯 Управление услугами</h4>
                <div class="admin-hint" style="color: #666; margin-bottom: 15px; font-style: italic;">
                    Добавляйте, редактируйте или удаляйте услуги. Пустые услуги автоматически скрываются.
                </div>
                <div id="services-list-enhanced">
                    ${services.map((service, index) => `
                        <div class="service-row-enhanced" style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 6px; border: 1px solid #e9ecef;">
                            <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                                <input type="text" class="form-control" value="${service.title || ''}" placeholder="Название услуги" 
                                       oninput="window.editor.updateServiceData(${index}, 'title', this.value)">
                                <input type="text" class="form-control" value="${service.icon || 'fas fa-star'}" placeholder="Иконка (fas fa-...)" 
                                       oninput="window.editor.updateServiceData(${index}, 'icon', this.value)">
                            </div>
                            <textarea class="form-control" placeholder="Описание услуги" 
                                      oninput="window.editor.updateServiceData(${index}, 'description', this.value)"
                                      style="width: 100%; min-height: 80px; margin-bottom: 10px;">${service.description || ''}</textarea>
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
                    ${services.length > 0 ? `
                    <button class="btn-admin warning" onclick="window.editor.clearAllServices()" style="background: #ffc107; color: black; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
                        <i class="fas fa-trash-alt"></i> Очистить все
                    </button>
                    ` : ''}
                </div>
            </div>
        `;

        const titleField = contentEditor.querySelector('[data-field="title"]');
        if (titleField) {
            titleField.closest('.form-group').insertAdjacentHTML('afterend', servicesHTML);
        }
    };

    // Редактор для футера
    window.editor.injectFooterEditor = function() {
        if (this.currentSection?.id !== 'footer') return;
        
        const contentEditor = document.getElementById('content-editor');
        if (!contentEditor) return;

        // Убедимся, что поля футера правильно настроены
        const descriptionField = contentEditor.querySelector('[data-field="description"]');
        const copyrightField = contentEditor.querySelector('[data-field="copyright"]');
        
        if (descriptionField) {
            descriptionField.placeholder = "Описание компании в футере...";
        }
        if (copyrightField) {
            copyrightField.placeholder = "Текст копирайта (например: &copy; 2024 WorldTravel)...";
        }
    };

    // Редактор контактов
    window.editor.injectContactsEditor = function() {
        if (this.currentSection?.id !== 'contact') return;
        
        const contentEditor = document.getElementById('content-editor');
        if (!contentEditor) return;

        // Добавляем информацию о редактировании контактов
        const contactsInfoHTML = `
            <div class="contacts-info" style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;">
                <h4 style="color: #1976d2; margin-bottom: 10px;">�� Управление контактами</h4>
                <p style="color: #1565c0; margin: 0; font-size: 0.9em;">
                    Контактная информация редактируется в основной админ-панели.<br>
                    Перейдите в раздел "Контакты" для изменения телефона, email, адреса и графика работы.
                </p>
            </div>
        `;

        const titleField = contentEditor.querySelector('[data-field="title"]');
        if (titleField) {
            titleField.closest('.form-group').insertAdjacentHTML('afterend', contactsInfoHTML);
        }
    };

    // Редакторы изображений для всех секций
    window.editor.injectImageEditors = function() {
        const contentEditor = document.getElementById('content-editor');
        if (!contentEditor) return;

        // Находим все поля для изображений
        const imageFields = contentEditor.querySelectorAll('input[data-field*="image"], input[data-field*="Image"]');
        
        imageFields.forEach(field => {
            const fieldId = field.getAttribute('data-field');
            const currentValue = field.value;
            
            // Проверяем, не добавлен ли уже менеджер для этого поля
            if (field.parentNode.querySelector('.image-manager-container')) {
                return;
            }

            const label = this.getImageFieldLabel(fieldId);
            
            const imageContainer = document.createElement('div');
            imageContainer.className = 'image-manager-container';
            imageContainer.style.margin = '15px 0';
            imageContainer.style.padding = '15px';
            imageContainer.style.background = '#f8f9fa';
            imageContainer.style.borderRadius = '8px';
            imageContainer.style.border = '2px solid #e9ecef';
            
            imageContainer.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <strong style="color: #2c5aa0;">${label}</strong>
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
                        `<img src="${currentValue}" alt="Preview" style="max-width: 100%; max-height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.parentNode.innerHTML='<div style=\\'text-align: center; color: #666;\\'><i class=\\'fas fa-exclamation-triangle\\' style=\\'font-size: 2em; display: block; margin-bottom: 5px;\\'></i><span>Ошибка загрузки изображения</span></div>';">` :
                        `<div style="text-align: center; color: #666;">
                            <i class="fas fa-image" style="font-size: 2em; display: block; margin-bottom: 5px;"></i>
                            <span>Изображение не выбрано</span>
                        </div>`
                    }
                </div>
                ${currentValue ? `
                <div style="font-size: 12px; color: #666; background: white; padding: 8px; border-radius: 4px;">
                    <strong>Текущее изображение:</strong><br>
                    <span style="word-break: break-all;">${currentValue.length > 100 ? currentValue.substring(0, 100) + '...' : currentValue}</span>
                </div>
                ` : ''}
                <input type="hidden" data-field="${fieldId}" value="${currentValue || ''}">
            `;
            
            // Вставляем контейнер после поля
            field.parentNode.insertBefore(imageContainer, field);
            field.style.display = 'none'; // Скрываем оригинальное поле
        });
    };

    window.editor.getImageFieldLabel = function(fieldId) {
        const labels = {
            'image': 'Основное изображение',
            'heroImage': 'Фоновое изображение героя',
            'aboutImage': 'Изображение о компании',
            'serviceImage': 'Изображение услуги'
        };
        return labels[fieldId] || 'Управление изображением';
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

    // Методы для работы с услугами
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
                
                // Проверяем тип файла
                if (!file.type.startsWith('image/')) {
                    this.showNotification('Выберите файл изображения', 'error');
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
        const currentValue = this.getCurrentImageValue(fieldId);
        const url = prompt('Введите URL изображения:', currentValue || '');
        if (url !== null) {
            if (url === '') {
                this.removeImage(fieldId);
            } else if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image') || url.startsWith('images/')) {
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

    window.editor.getCurrentImageValue = function(fieldId) {
        const field = document.querySelector(`[data-field="${fieldId}"]`);
        return field ? field.value : '';
    };

    window.editor.updateImageField = function(fieldId, url) {
        const field = document.querySelector(`[data-field="${fieldId}"]`);
        if (field) {
            field.value = url;
            
            // Обновляем превью
            const container = field.parentNode.querySelector('.image-manager-container');
            if (container) {
                const preview = container.querySelector('.image-preview');
                const currentImageInfo = container.querySelector('div:nth-last-child(2)'); // Предпоследний div
                
                if (preview) {
                    if (url) {
                        preview.innerHTML = `<img src="${url}" alt="Preview" style="max-width: 100%; max-height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.parentNode.innerHTML='<div style=\\'text-align: center; color: #666;\\'><i class=\\'fas fa-exclamation-triangle\\' style=\\'font-size: 2em; display: block; margin-bottom: 5px;\\'></i><span>Ошибка загрузки изображения</span></div>';">`;
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
                if (currentImageInfo && currentImageInfo.innerHTML.includes('Текущее изображение')) {
                    if (url) {
                        currentImageInfo.innerHTML = `
                            <strong>Текущее изображение:</strong><br>
                            <span style="word-break: break-all;">${url.length > 100 ? url.substring(0, 100) + '...' : url}</span>
                        `;
                        currentImageInfo.style.display = 'block';
                    } else {
                        currentImageInfo.style.display = 'none';
                    }
                }
                
                // Обновляем кнопки управления
                const buttonsContainer = container.querySelector('div:first-child div');
                if (buttonsContainer) {
                    const deleteBtn = buttonsContainer.querySelector('.btn-admin.danger');
                    if (url) {
                        if (!deleteBtn) {
                            const newDeleteBtn = document.createElement('button');
                            newDeleteBtn.className = 'btn-admin danger';
                            newDeleteBtn.style.background = '#dc3545';
                            newDeleteBtn.style.marginRight = '5px';
                            newDeleteBtn.innerHTML = '<i class="fas fa-trash"></i> Удалить';
                            newDeleteBtn.onclick = () => this.removeImage(fieldId);
                            buttonsContainer.appendChild(newDeleteBtn);
                        }
                    } else {
                        if (deleteBtn) {
                            deleteBtn.remove();
                        }
                    }
                }
            }
            
            this.hasUnsavedChanges = true;
        }
    };

    // Улучшенный метод сохранения данных
    window.editor.saveEnhancedData = function() {
        // Сохраняем статистику
        if (this.currentSection?.id === 'about') {
            this.saveStatsData();
        }
        
        // Сохраняем услуги
        if (this.currentSection?.id === 'services') {
            this.saveServicesData();
        }
        
        // Сохраняем футер
        if (this.currentSection?.id === 'footer') {
            this.saveFooterData();
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

    window.editor.saveFooterData = function() {
        if (this.currentSection?.id !== 'footer') return;
        
        const descriptionField = document.querySelector('[data-field="description"]');
        const copyrightField = document.querySelector('[data-field="copyright"]');
        
        if (descriptionField && this.currentData.footer) {
            this.currentData.footer.description = descriptionField.value;
        }
        if (copyrightField && this.currentData.footer) {
            this.currentData.footer.copyright = copyrightField.value;
        }
        
        console.log('💾 Сохранение футера:', this.currentData.footer);
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
        
        .contacts-info {
            transition: all 0.3s ease;
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

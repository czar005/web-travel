// Улучшенный редактор с объединенными редакторами и управлением изображениями
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
            this.injectImageManagers();
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
        this.injectUnifiedStatsEditor();
        this.injectUnifiedServicesEditor();
        this.injectFooterEditor();
        this.injectContactsEditor();
    };

    // ОБЪЕДИНЕННЫЙ редактор статистики для секции "О компании"
    window.editor.injectUnifiedStatsEditor = function() {
        if (this.currentSection?.id !== 'about') return;
        
        const contentEditor = document.getElementById('content-editor');
        if (!contentEditor) return;

        // Удаляем ВСЕ старые редакторы статистики если есть
        const oldEditors = contentEditor.querySelectorAll('[class*="stats"], [class*="stat"]');
        oldEditors.forEach(editor => {
            if (editor.classList.contains('form-group') && !editor.querySelector('label')) {
                // Пропускаем основные поля формы
                return;
            }
            if (editor.closest('.action-buttons')) {
                // Пропускаем кнопки действий
                return;
            }
            // Удаляем все остальные редакторы статистики
            if (editor.textContent.includes('статистик') || editor.textContent.includes('Stats') || 
                editor.classList.contains('stats-editor') || editor.classList.contains('stats-manager') ||
                editor.classList.contains('stats-editor-enhanced')) {
                editor.remove();
            }
        });

        const stats = this.currentData.content?.about?.stats || [];
        
        const statsHTML = `
            <div class="unified-stats-editor" style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border: 2px solid #e9ecef;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h4 style="color: #2c5aa0; margin: 0;">📊 Управление статистикой</h4>
                    <button class="btn-admin" onclick="window.editor.addStatData()" style="background: #28a745; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
                        <i class="fas fa-plus"></i> Добавить
                    </button>
                </div>
                
                <div class="admin-hint" style="color: #666; margin-bottom: 20px; font-style: italic; background: white; padding: 12px; border-radius: 6px; border-left: 4px solid #2c5aa0;">
                    💡 Добавляйте блоки статистики. Пустые блоки автоматически скрываются на сайте.
                </div>
                
                <div id="unified-stats-list">
                    ${stats.length > 0 ? stats.map((stat, index) => `
                        <div class="stat-item-unified" style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 12px; margin-bottom: 15px; align-items: center; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e9ecef; transition: all 0.3s ease;">
                            <div>
                                <label style="display: block; font-size: 12px; color: #666; margin-bottom: 5px;">Значение</label>
                                <input type="text" class="form-control" value="${stat.value || ''}" placeholder="5000" 
                                       oninput="window.editor.updateStatData(${index}, 'value', this.value)" style="width: 100%;">
                            </div>
                            <div>
                                <label style="display: block; font-size: 12px; color: #666; margin-bottom: 5px;">Подпись</label>
                                <input type="text" class="form-control" value="${stat.label || ''}" placeholder="Довольных клиентов" 
                                       oninput="window.editor.updateStatData(${index}, 'label', this.value)" style="width: 100%;">
                            </div>
                            <button class="btn-small danger" onclick="window.editor.removeStatData(${index})" 
                                    style="background: #dc3545; color: white; border: none; padding: 10px 12px; border-radius: 6px; cursor: pointer; align-self: end;">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `).join('') : `
                        <div style="text-align: center; padding: 40px 20px; color: #666; background: white; border-radius: 8px; border: 2px dashed #ddd;">
                            <i class="fas fa-chart-bar" style="font-size: 3em; margin-bottom: 15px; display: block; color: #ccc;"></i>
                            <p>Статистика не добавлена</p>
                            <small>Нажмите "Добавить" чтобы создать первую запись</small>
                        </div>
                    `}
                </div>
                
                ${stats.length > 0 ? `
                <div class="stats-actions" style="display: flex; gap: 10px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                    <button class="btn-admin" onclick="window.editor.addStatData()" style="background: #28a745; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; flex: 1;">
                        <i class="fas fa-plus"></i> Добавить еще
                    </button>
                    <button class="btn-admin warning" onclick="window.editor.clearAllStats()" style="background: #ffc107; color: black; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; flex: 1;">
                        <i class="fas fa-trash-alt"></i> Очистить все
                    </button>
                </div>
                ` : ''}
            </div>
        `;

        // Вставляем после описания
        const descriptionField = contentEditor.querySelector('[data-field="description"]');
        if (descriptionField) {
            descriptionField.closest('.form-group').insertAdjacentHTML('afterend', statsHTML);
        } else {
            // Если поля описания нет, вставляем после заголовка
            const titleField = contentEditor.querySelector('[data-field="title"]');
            if (titleField) {
                titleField.closest('.form-group').insertAdjacentHTML('afterend', statsHTML);
            }
        }
    };

    // ОБЪЕДИНЕННЫЙ редактор услуг для секции "Услуги"
    window.editor.injectUnifiedServicesEditor = function() {
        if (this.currentSection?.id !== 'services') return;
        
        const contentEditor = document.getElementById('content-editor');
        if (!contentEditor) return;

        // Удаляем ВСЕ старые редакторы услуг если есть
        const oldEditors = contentEditor.querySelectorAll('[class*="service"], [class*="services"]');
        oldEditors.forEach(editor => {
            if (editor.classList.contains('form-group') && !editor.querySelector('label')) {
                // Пропускаем основные поля формы
                return;
            }
            if (editor.closest('.action-buttons')) {
                // Пропускаем кнопки действий
                return;
            }
            // Удаляем все остальные редакторы услуг
            if (editor.textContent.includes('услуг') || editor.textContent.includes('Services') || 
                editor.classList.contains('services-editor') || editor.classList.contains('services-manager') ||
                editor.classList.contains('services-editor-enhanced')) {
                editor.remove();
            }
        });

        const services = this.currentData.content?.services?.services || [];
        
        const servicesHTML = `
            <div class="unified-services-editor" style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border: 2px solid #e9ecef;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h4 style="color: #2c5aa0; margin: 0;">🎯 Управление услугами</h4>
                    <button class="btn-admin" onclick="window.editor.addServiceData()" style="background: #28a745; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
                        <i class="fas fa-plus"></i> Добавить
                    </button>
                </div>
                
                <div class="admin-hint" style="color: #666; margin-bottom: 20px; font-style: italic; background: white; padding: 12px; border-radius: 6px; border-left: 4px solid #2c5aa0;">
                    💡 Добавляйте услуги компании. Каждая услуга должна иметь название и описание.
                </div>
                
                <div id="unified-services-list">
                    ${services.length > 0 ? services.map((service, index) => `
                        <div class="service-item-unified" style="margin-bottom: 20px; padding: 20px; background: white; border-radius: 8px; border: 1px solid #e9ecef; transition: all 0.3s ease;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 12px; margin-bottom: 15px; align-items: start;">
                                <div>
                                    <label style="display: block; font-size: 12px; color: #666; margin-bottom: 5px;">Название услуги</label>
                                    <input type="text" class="form-control" value="${service.title || ''}" placeholder="Авиабилеты" 
                                           oninput="window.editor.updateServiceData(${index}, 'title', this.value)" style="width: 100%;">
                                </div>
                                <div>
                                    <label style="display: block; font-size: 12px; color: #666; margin-bottom: 5px;">Иконка</label>
                                    <input type="text" class="form-control" value="${service.icon || 'fas fa-star'}" placeholder="fas fa-plane" 
                                           oninput="window.editor.updateServiceData(${index}, 'icon', this.value)" style="width: 100%;">
                                </div>
                                <button class="btn-small danger" onclick="window.editor.removeServiceData(${index})" 
                                        style="background: #dc3545; color: white; border: none; padding: 10px 12px; border-radius: 6px; cursor: pointer; margin-top: 25px;">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                            <div>
                                <label style="display: block; font-size: 12px; color: #666; margin-bottom: 5px;">Описание услуги</label>
                                <textarea class="form-control" placeholder="Подбор и бронирование лучших авиаперелетов..." 
                                          oninput="window.editor.updateServiceData(${index}, 'description', this.value)"
                                          style="width: 100%; min-height: 80px; resize: vertical;">${service.description || ''}</textarea>
                            </div>
                            ${service.icon ? `
                            <div style="margin-top: 10px; font-size: 12px; color: #666;">
                                <i class="${service.icon}" style="margin-right: 5px;"></i>
                                <span>Предпросмотр иконки</span>
                            </div>
                            ` : ''}
                        </div>
                    `).join('') : `
                        <div style="text-align: center; padding: 40px 20px; color: #666; background: white; border-radius: 8px; border: 2px dashed #ddd;">
                            <i class="fas fa-concierge-bell" style="font-size: 3em; margin-bottom: 15px; display: block; color: #ccc;"></i>
                            <p>Услуги не добавлены</p>
                            <small>Нажмите "Добавить" чтобы создать первую услугу</small>
                        </div>
                    `}
                </div>
                
                ${services.length > 0 ? `
                <div class="services-actions" style="display: flex; gap: 10px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                    <button class="btn-admin" onclick="window.editor.addServiceData()" style="background: #28a745; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; flex: 1;">
                        <i class="fas fa-plus"></i> Добавить еще
                    </button>
                    <button class="btn-admin warning" onclick="window.editor.clearAllServices()" style="background: #ffc107; color: black; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; flex: 1;">
                        <i class="fas fa-trash-alt"></i> Очистить все
                    </button>
                </div>
                ` : ''}
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

    // Редактор контактов с правильным размещением данных
    window.editor.injectContactsEditor = function() {
        if (this.currentSection?.id !== 'contact') return;
        
        const contentEditor = document.getElementById('content-editor');
        if (!contentEditor) return;

        // Добавляем информацию о редактировании контактов с правильной структурой
        const contactsInfoHTML = `
            <div class="contacts-management" style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #2196f3;">
                <h4 style="color: #1976d2; margin-bottom: 15px;">📞 Управление контактами</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div style="background: white; padding: 15px; border-radius: 6px;">
                        <h5 style="color: #333; margin-bottom: 10px;">Структура контактов:</h5>
                        <ul style="color: #666; font-size: 0.9em; margin: 0; padding-left: 20px;">
                            <li><strong>Телефон:</strong> +7 (999) 123-45-67</li>
                            <li><strong>Email:</strong> info@worldtravel.com</li>
                            <li><strong>Адрес:</strong> Москва, ул. Туристическая, 15</li>
                            <li><strong>График работы:</strong> Пн-Пт: 9:00-18:00</li>
                        </ul>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 6px;">
                        <h5 style="color: #333; margin-bottom: 10px;">Как изменить:</h5>
                        <p style="color: #666; font-size: 0.9em; margin: 0;">
                            Перейдите в основную админ-панель → раздел "Контакты" для изменения контактной информации.
                        </p>
                    </div>
                </div>
            </div>
        `;

        const titleField = contentEditor.querySelector('[data-field="title"]');
        if (titleField) {
            titleField.closest('.form-group').insertAdjacentHTML('afterend', contactsInfoHTML);
        }
    };

    // Управление изображениями для всех секций
    window.editor.injectImageManagers = function() {
        const contentEditor = document.getElementById('content-editor');
        if (!contentEditor) return;

        // Находим ВСЕ поля для изображений
        const imageFields = contentEditor.querySelectorAll('input[data-field*="image"], input[data-field*="Image"]');
        
        imageFields.forEach(field => {
            const fieldId = field.getAttribute('data-field');
            const currentValue = field.value;
            
            // Проверяем, не добавлен ли уже менеджер для этого поля
            if (field.parentNode.querySelector('.unified-image-manager')) {
                return;
            }

            const label = this.getImageFieldLabel(fieldId);
            const sectionType = this.getSectionTypeForImage(fieldId);
            
            const imageManagerHTML = `
                <div class="unified-image-manager" style="margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 10px; border: 2px solid #e9ecef;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <div>
                            <strong style="color: #2c5aa0; font-size: 1.1em;">${label}</strong>
                            <div style="font-size: 0.9em; color: #666; margin-top: 5px;">
                                ${sectionType}
                            </div>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button type="button" class="btn-admin" onclick="window.editor.uploadImage('${fieldId}')" 
                                    style="background: #17a2b8; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; font-size: 0.9em;">
                                <i class="fas fa-upload"></i> Загрузить
                            </button>
                            <button type="button" class="btn-admin" onclick="window.editor.setImageUrl('${fieldId}')" 
                                    style="background: #6c757d; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; font-size: 0.9em;">
                                <i class="fas fa-link"></i> URL
                            </button>
                            ${currentValue ? `
                            <button type="button" class="btn-admin danger" onclick="window.editor.removeImage('${fieldId}')" 
                                    style="background: #dc3545; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; font-size: 0.9em;">
                                <i class="fas fa-trash"></i> Удалить
                            </button>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="image-preview-container" style="display: flex; gap: 20px; align-items: flex-start;">
                        <div class="image-preview" style="flex: 0 0 300px; height: 200px; border: 2px dashed #ddd; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; background: white; transition: all 0.3s ease;">
                            ${currentValue ? 
                                `<img src="${currentValue}" alt="Preview" style="max-width: 100%; max-height: 100%; object-fit: cover;" 
                                      onerror="this.style.display='none'; this.parentNode.innerHTML='<div style=\\'text-align: center; color: #666; padding: 20px;\\'><i class=\\'fas fa-exclamation-triangle\\' style=\\'font-size: 2em; margin-bottom: 10px; color: #dc3545;\\'></i><div>Ошибка загрузки</div><small style=\\'font-size: 0.8em;\\'>Проверьте URL изображения</small></div>';">` :
                                `<div style="text-align: center; color: #666; padding: 20px;">
                                    <i class="fas fa-image" style="font-size: 3em; display: block; margin-bottom: 10px; color: #ccc;"></i>
                                    <div>Изображение не выбрано</div>
                                    <small style="font-size: 0.8em;">Загрузите или укажите URL изображения</small>
                                </div>`
                            }
                        </div>
                        
                        <div style="flex: 1;">
                            ${currentValue ? `
                            <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 10px;">
                                <strong style="display: block; margin-bottom: 8px; color: #333;">Текущее изображение:</strong>
                                <div style="font-size: 0.85em; color: #666; background: #f8f9fa; padding: 10px; border-radius: 4px; word-break: break-all;">
                                    ${currentValue.length > 80 ? currentValue.substring(0, 80) + '...' : currentValue}
                                </div>
                            </div>
                            ` : ''}
                            
                            <div style="background: #e7f3ff; padding: 12px; border-radius: 6px; border-left: 4px solid #2196f3;">
                                <strong style="display: block; margin-bottom: 5px; color: #1976d2;">💡 Рекомендации:</strong>
                                <ul style="margin: 0; padding-left: 15px; font-size: 0.85em; color: #1565c0;">
                                    <li>Поддерживаются форматы: JPG, PNG, GIF, WebP</li>
                                    <li>Максимальный размер: 5MB</li>
                                    <li>Рекомендуемое соотношение: 16:9</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <input type="hidden" data-field="${fieldId}" value="${currentValue || ''}">
                </div>
            `;
            
            // Заменяем оригинальное поле на наш менеджер
            const originalContainer = field.closest('.form-group');
            if (originalContainer) {
                originalContainer.style.display = 'none'; // Скрываем оригинальный контейнер
            }
            
            // Вставляем менеджер изображений
            if (originalContainer) {
                originalContainer.insertAdjacentHTML('afterend', imageManagerHTML);
            } else {
                field.insertAdjacentHTML('afterend', imageManagerHTML);
            }
        });
    };

    window.editor.getImageFieldLabel = function(fieldId) {
        const labels = {
            'image': '📷 Основное изображение',
            'heroImage': '🎯 Фоновое изображение героя',
            'aboutImage': '🏢 Изображение о компании',
            'serviceImage': '⚡ Изображение услуги'
        };
        return labels[fieldId] || '🖼️ Управление изображением';
    };

    window.editor.getSectionTypeForImage = function(fieldId) {
        const sections = {
            'image': 'Используется в качестве основного изображения секции',
            'heroImage': 'Фоновая картинка для главного баннера',
            'aboutImage': 'Изображение для секции "О компании"',
            'serviceImage': 'Иконка или изображение для услуг'
        };
        return sections[fieldId] || 'Изображение для текущей секции';
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
        this.injectUnifiedStatsEditor();
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
            this.injectUnifiedStatsEditor();
            this.showNotification('Статистика удалена', 'success');
        }
    };

    window.editor.clearAllStats = function() {
        if (confirm('Очистить всю статистику? Это действие нельзя отменить.')) {
            if (this.currentData.content?.about?.stats) {
                this.currentData.content.about.stats = [];
                this.hasUnsavedChanges = true;
                this.injectUnifiedStatsEditor();
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
        this.injectUnifiedServicesEditor();
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
            this.injectUnifiedServicesEditor();
            this.showNotification('Услуга удалена', 'success');
        }
    };

    window.editor.clearAllServices = function() {
        if (confirm('Очистить все услуги? Это действие нельзя отменить.')) {
            if (this.currentData.content?.services?.services) {
                this.currentData.content.services.services = [];
                this.hasUnsavedChanges = true;
                this.injectUnifiedServicesEditor();
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
            
            // Обновляем менеджер изображений
            const manager = document.querySelector(`.unified-image-manager input[data-field="${fieldId}"]`)?.closest('.unified-image-manager');
            if (manager) {
                const preview = manager.querySelector('.image-preview');
                const currentImageInfo = manager.querySelector('.image-preview-container > div:last-child > div:first-child');
                
                if (preview) {
                    if (url) {
                        preview.innerHTML = `<img src="${url}" alt="Preview" style="max-width: 100%; max-height: 100%; object-fit: cover;" 
                                                  onerror="this.style.display='none'; this.parentNode.innerHTML='<div style=\\'text-align: center; color: #666; padding: 20px;\\'><i class=\\'fas fa-exclamation-triangle\\' style=\\'font-size: 2em; margin-bottom: 10px; color: #dc3545;\\'></i><div>Ошибка загрузки</div><small style=\\'font-size: 0.8em;\\'>Проверьте URL изображения</small></div>';">`;
                    } else {
                        preview.innerHTML = `
                            <div style="text-align: center; color: #666; padding: 20px;">
                                <i class="fas fa-image" style="font-size: 3em; display: block; margin-bottom: 10px; color: #ccc;"></i>
                                <div>Изображение не выбрано</div>
                                <small style="font-size: 0.8em;">Загрузите или укажите URL изображения</small>
                            </div>
                        `;
                    }
                }
                
                // Обновляем информацию о текущем изображении
                if (currentImageInfo) {
                    if (url) {
                        currentImageInfo.innerHTML = `
                            <strong style="display: block; margin-bottom: 8px; color: #333;">Текущее изображение:</strong>
                            <div style="font-size: 0.85em; color: #666; background: #f8f9fa; padding: 10px; border-radius: 4px; word-break: break-all;">
                                ${url.length > 80 ? url.substring(0, 80) + '...' : url}
                            </div>
                        `;
                        currentImageInfo.style.display = 'block';
                    } else {
                        currentImageInfo.style.display = 'none';
                    }
                }
                
                // Обновляем кнопки управления
                const buttonsContainer = manager.querySelector('div:first-child div:last-child');
                if (buttonsContainer) {
                    const deleteBtn = buttonsContainer.querySelector('.btn-admin.danger');
                    if (url) {
                        if (!deleteBtn) {
                            const newDeleteBtn = document.createElement('button');
                            newDeleteBtn.className = 'btn-admin danger';
                            newDeleteBtn.style.background = '#dc3545';
                            newDeleteBtn.style.color = 'white';
                            newDeleteBtn.style.border = 'none';
                            newDeleteBtn.style.padding = '10px 15px';
                            newDeleteBtn.style.borderRadius = '6px';
                            newDeleteBtn.style.cursor = 'pointer';
                            newDeleteBtn.style.fontSize = '0.9em';
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
        
        // Сохраняем изображения (автоматически через поля)
        this.saveImageData();
    };

    window.editor.saveStatsData = function() {
        if (this.currentSection?.id !== 'about') return;
        
        const statsList = document.getElementById('unified-stats-list');
        if (!statsList) return;

        const statItems = statsList.querySelectorAll('.stat-item-unified');
        const stats = [];

        statItems.forEach(item => {
            const inputs = item.querySelectorAll('input');
            if (inputs.length >= 2) {
                const value = inputs[0].value.trim();
                const label = inputs[1].value.trim();
                if (value && label) {
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
        
        const servicesList = document.getElementById('unified-services-list');
        if (!servicesList) return;

        const serviceItems = servicesList.querySelectorAll('.service-item-unified');
        const services = [];

        serviceItems.forEach(item => {
            const titleInput = item.querySelector('input[placeholder="Авиабилеты"]');
            const iconInput = item.querySelector('input[placeholder="fas fa-plane"]');
            const descTextarea = item.querySelector('textarea');
            
            if (titleInput && descTextarea) {
                const title = titleInput.value.trim();
                const description = descTextarea.value.trim();
                const icon = iconInput ? iconInput.value.trim() : 'fas fa-star';
                
                if (title && description) {
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

    window.editor.saveImageData = function() {
        // Изображения автоматически сохраняются через привязанные поля
        console.log('💾 Изображения сохранены через поля формы');
    };
};

EnhancedPageEditorFixed.prototype.injectEnhancedUI = function() {
    // Добавляем CSS стили для улучшенного редактора
    const style = document.createElement('style');
    style.textContent = `
        .unified-stats-editor,
        .unified-services-editor,
        .unified-image-manager {
            transition: all 0.3s ease;
        }
        
        .stat-item-unified:hover,
        .service-item-unified:hover {
            border-color: #2c5aa0 !important;
            background: #f8f9fa !important;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .unified-image-manager:hover {
            border-color: #2c5aa0 !important;
        }
        
        .image-preview:hover {
            border-color: #2c5aa0 !important;
        }
        
        .contacts-management {
            transition: all 0.3s ease;
        }
        
        @media (max-width: 768px) {
            .stat-item-unified {
                grid-template-columns: 1fr !important;
                gap: 10px !important;
            }
            
            .unified-image-manager .image-preview-container {
                flex-direction: column !important;
            }
            
            .unified-image-manager .image-preview {
                flex: none !important;
                width: 100% !important;
                max-width: 300px !important;
            }
        }
    `;
    document.head.appendChild(style);
};

// Инициализация
new EnhancedPageEditorFixed();

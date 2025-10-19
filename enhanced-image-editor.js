// Улучшенный редактор изображений для всех секций
class EnhancedImageEditor {
    constructor() {
        this.init();
    }

    init() {
        console.log('🖼️ Enhanced Image Editor initialized');
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
        console.log('🔧 Patching editor with image managers...');

        // Патчим метод showContentEditor
        const originalShowContentEditor = window.editor.showContentEditor;
        window.editor.showContentEditor = function() {
            originalShowContentEditor.call(this);
            setTimeout(() => {
                this.addImageManagerToCurrentSection();
                this.mergeDuplicateEditors();
            }, 100);
        };

        // Добавляем менеджер изображений для текущей секции
        window.editor.addImageManagerToCurrentSection = function() {
            if (!this.currentSection) return;

            const imageFields = {
                'hero': { label: 'Главное изображение баннера', field: 'image' },
                'about': { label: 'Изображение о компании', field: 'image' },
                'services': { label: 'Фоновое изображение услуг', field: 'image' },
                'destinations': { label: 'Изображение направлений', field: 'image' },
                'contact': { label: 'Контактное изображение', field: 'image' }
            };

            const sectionConfig = imageFields[this.currentSection.id];
            if (sectionConfig) {
                this.createImageManager(sectionConfig.label, sectionConfig.field);
            }
        };

        // Создаем менеджер изображений
        window.editor.createImageManager = function(label, fieldId) {
            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor) return;

            // Удаляем старый менеджер если есть
            const oldManager = contentEditor.querySelector(\`[data-image-field="\${fieldId}"]\`);
            if (oldManager) oldManager.remove();

            const currentValue = this.getCurrentValue(fieldId) || '';

            const imageManagerHTML = \`
                <div class="image-manager" data-image-field="\${fieldId}" style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #e9ecef;">
                    <h4 style="color: #2c5aa0; margin-bottom: 15px;">🖼️ \${label}</h4>
                    <div class="image-preview" style="width: 100%; max-width: 300px; height: 200px; border: 2px dashed #ddd; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 10px 0; overflow: hidden; background: white;">
                        \${currentValue ? 
                            \`<img src="\${currentValue}" alt="Preview" style="max-width: 100%; max-height: 100%; object-fit: cover;" onerror="this.style.display=\\'none\\';">\` :
                            \`<div style="text-align: center; color: #666;">
                                <i class="fas fa-image" style="font-size: 3em; margin-bottom: 10px;"></i>
                                <div>Изображение не выбрано</div>
                            </div>\`
                        }
                    </div>
                    <div class="image-actions" style="display: flex; gap: 10px;">
                        <button class="btn-admin" onclick="editor.uploadImage('\${fieldId}')" style="background: #17a2b8;">
                            <i class="fas fa-upload"></i> Загрузить
                        </button>
                        <button class="btn-admin secondary" onclick="editor.setImageUrl('\${fieldId}')" style="background: #6c757d;">
                            <i class="fas fa-link"></i> URL
                        </button>
                        \${currentValue ? \`
                        <button class="btn-admin danger" onclick="editor.removeImage('\${fieldId}')" style="background: #dc3545;">
                            <i class="fas fa-trash"></i> Удалить
                        </button>
                        \` : ''}
                    </div>
                    <input type="hidden" data-field="\${fieldId}" value="\${currentValue}">
                </div>
            \`;

            // Вставляем после заголовка
            const titleField = contentEditor.querySelector('[data-field="title"]');
            if (titleField) {
                titleField.closest('.form-group').insertAdjacentHTML('afterend', imageManagerHTML);
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
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.updateImageField(fieldId, e.target.result);
                        this.showNotification('Изображение загружено успешно', 'success');
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        };

        window.editor.setImageUrl = function(fieldId) {
            const currentValue = this.getCurrentValue(fieldId);
            const url = prompt('Введите URL изображения:', currentValue || '');
            if (url !== null) {
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
            const field = document.querySelector(\`[data-field="\${fieldId}"]\`);
            if (field) {
                field.value = url;
                this.hasUnsavedChanges = true;
                
                // Обновляем превью
                const manager = document.querySelector(\`[data-image-field="\${fieldId}"]\`);
                if (manager) {
                    const preview = manager.querySelector('.image-preview');
                    if (preview) {
                        if (url) {
                            preview.innerHTML = \`<img src="\${url}" alt="Preview" style="max-width: 100%; max-height: 100%; object-fit: cover;" onerror="this.style.display=\\'none\\';">\`;
                        } else {
                            preview.innerHTML = \`
                                <div style="text-align: center; color: #666;">
                                    <i class="fas fa-image" style="font-size: 3em; margin-bottom: 10px;"></i>
                                    <div>Изображение не выбрано</div>
                                </div>
                            \`;
                        }
                    }
                }
            }
        };

        // Объединяем дублирующиеся редакторы
        window.editor.mergeDuplicateEditors = function() {
            // Удаляем дублирующиеся редакторы статистики
            const statsEditors = document.querySelectorAll('[class*="stats"]');
            if (statsEditors.length > 1) {
                for (let i = 1; i < statsEditors.length; i++) {
                    if (!statsEditors[i].closest('.action-buttons')) {
                        statsEditors[i].remove();
                    }
                }
            }

            // Удаляем дублирующиеся редакторы услуг
            const servicesEditors = document.querySelectorAll('[class*="services"]');
            if (servicesEditors.length > 1) {
                for (let i = 1; i < servicesEditors.length; i++) {
                    if (!servicesEditors[i].closest('.action-buttons')) {
                        servicesEditors[i].remove();
                    }
                }
            }
        };

        console.log('✅ Editor patched successfully');
    }
}

// Инициализация
new EnhancedImageEditor();

console.log('🔧 Applying enhanced editor fixes...');

// Ждем загрузки редактора
function waitForEditor() {
    if (window.editor) {
        console.log('✅ Editor found, applying fixes...');
        applyEditorFixes();
    } else {
        setTimeout(waitForEditor, 100);
    }
}

function applyEditorFixes() {
    // Добавляем обработчики для изображений
    const originalShowContentEditor = window.editor.showContentEditor;
    window.editor.showContentEditor = function() {
        originalShowContentEditor.call(this);
        setTimeout(() => this.enhanceImageFields(), 50);
    };

    // Метод для улучшения полей изображений
    window.editor.enhanceImageFields = function() {
        const contentEditor = document.getElementById('content-editor');
        if (!contentEditor) return;

        const imageFields = contentEditor.querySelectorAll('[data-field*="image"]');
        imageFields.forEach(field => {
            this.createImageManager(field);
        });
    };

    // Создаем менеджер изображений для поля
    window.editor.createImageManager = function(field) {
        const fieldId = field.getAttribute('data-field');
        const currentValue = field.value;

        // Проверяем, не добавлен ли уже менеджер
        if (field.nextElementSibling && field.nextElementSibling.classList.contains('image-manager')) {
            return;
        }

        const managerHTML = `
            <div class="image-manager" style="margin: 10px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; border: 2px solid #e9ecef;">
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
            </div>
        `;

        field.insertAdjacentHTML('afterend', managerHTML);
    };

    // Методы для работы с изображениями
    window.editor.uploadImage = function(fieldId) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // Проверяем размер файла
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
            const manager = field.nextElementSibling;
            if (manager && manager.classList.contains('image-manager')) {
                const preview = manager.querySelector('.image-preview');
                const currentImageInfo = manager.querySelector('div:last-child');
                
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
                const buttonsContainer = manager.querySelector('div:first-child div');
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

    console.log('✅ Editor fixes applied successfully');
}

// Запускаем ожидание редактора
waitForEditor();

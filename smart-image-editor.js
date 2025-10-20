// Smart Image Editor - only for sections with images
class SmartImageEditor {
    constructor() {
        this.sectionsWithImages = ['hero', 'about']; // Только эти секции имеют изображения
        this.init();
    }

    init() {
        if (window.editor) {
            this.patchEditor();
        } else {
            setTimeout(() => this.init(), 100);
        }
    }

    patchEditor() {
        console.log('🎯 Smart Image Editor initialized');

        const originalShow = window.editor.showContentEditor;
        
        window.editor.showContentEditor = function() {
            originalShow.call(this);
            setTimeout(() => {
                this.removeExistingImageEditors();
                this.addSmartImageManager();
            }, 100);
        };

        // Remove existing editors
        window.editor.removeExistingImageEditors = function() {
            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor) return;
            
            const existingEditors = contentEditor.querySelectorAll('[data-image-field]');
            existingEditors.forEach(editor => editor.remove());
            
            const formGroups = contentEditor.querySelectorAll('.form-group');
            formGroups.forEach(group => {
                if (group.querySelector('input[data-field="image"]')) {
                    group.remove();
                }
            });
        };

        // Add image manager only for sections that need it
        window.editor.addSmartImageManager = function() {
            const sectionsConfig = {
                'hero': { 
                    name: 'Главный баннер', 
                    hasImage: true,
                    field: 'image'
                },
                'about': { 
                    name: 'О компании', 
                    hasImage: true,
                    field: 'image' 
                },
                'services': { 
                    name: 'Услуги', 
                    hasImage: false 
                },
                'destinations': { 
                    name: 'Направления', 
                    hasImage: false 
                },
                'contact': { 
                    name: 'Контакты', 
                    hasImage: false 
                }
            };

            const config = sectionsConfig[this.currentSection?.id];
            if (!config) return;

            if (config.hasImage) {
                this.createImageField(config.name, config.field);
            }
        };

        // Create image field
        window.editor.createImageField = function(sectionName, fieldId) {
            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor) return;

            const currentValue = this.getCurrentValue(fieldId) || '';
            
            const html = '<div class="form-group" data-image-field="' + fieldId + '">' +
                '<label>🖼️ Изображение для ' + sectionName + ':</label>' +
                '<div style="display: flex; gap: 10px; align-items: center; margin-top: 10px;">' +
                '<input type="text" data-field="' + fieldId + '" class="form-control" placeholder="URL изображения..." ' +
                'value="' + currentValue + '">' +
                '<button type="button" class="btn-admin" onclick="editor.uploadImage(\'' + fieldId + '\')">' +
                '<i class="fas fa-upload"></i> Загрузить' +
                '</button>' +
                '<button type="button" class="btn-admin secondary" onclick="editor.setImageUrl(\'' + fieldId + '\')">' +
                '<i class="fas fa-link"></i> URL' +
                '</button>' +
                '</div>' +
                '<div style="font-size: 12px; color: #666; margin-top: 5px;">' +
                'Поддерживаются: JPG, PNG, GIF, WebP (макс. 5MB)' +
                '</div>' +
                '</div>';

            const titleField = contentEditor.querySelector('[data-field="title"]');
            if (titleField) {
                titleField.closest('.form-group').insertAdjacentHTML('afterend', html);
                console.log('✅ Added image editor for: ' + sectionName);
            }
        };

        // Image methods
        window.editor.uploadImage = function(fieldId) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    // Validate file size (5MB max)
                    if (file.size > 5 * 1024 * 1024) {
                        alert('Файл слишком большой. Максимальный размер: 5MB');
                        return;
                    }
                    
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        document.querySelector('[data-field="' + fieldId + '"]').value = e.target.result;
                        window.editor.hasUnsavedChanges = true;
                        if (window.editor.showNotification) {
                            window.editor.showNotification('Изображение загружено', 'success');
                        }
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        };

        window.editor.setImageUrl = function(fieldId) {
            const current = document.querySelector('[data-field="' + fieldId + '"]').value;
            const url = prompt('URL изображения:', current || '');
            if (url !== null) {
                document.querySelector('[data-field="' + fieldId + '"]').value = url;
                this.hasUnsavedChanges = true;
                if (this.showNotification) {
                    this.showNotification('URL установлен', 'success');
                }
            }
        };
    }
}

new SmartImageEditor();

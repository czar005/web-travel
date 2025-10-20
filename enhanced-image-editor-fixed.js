// Fixed Image Editor without duplication
class FixedImageEditor {
    constructor() {
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
        console.log('🔧 Patching editor without duplication...');

        // Store original method
        const originalShow = window.editor.showContentEditor;
        
        window.editor.showContentEditor = function() {
            originalShow.call(this);
            setTimeout(() => {
                // Remove ALL existing image editors first
                this.removeExistingImageEditors();
                // Then add only one
                this.addSingleImageManager();
            }, 100);
        };

        // Method to remove all existing image editors
        window.editor.removeExistingImageEditors = function() {
            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor) return;
            
            // Remove all image manager elements
            const existingEditors = contentEditor.querySelectorAll('[data-image-field]');
            existingEditors.forEach(editor => editor.remove());
            
            // Also remove any form-group containing image fields
            const formGroups = contentEditor.querySelectorAll('.form-group');
            formGroups.forEach(group => {
                if (group.querySelector('input[data-field="image"]')) {
                    group.remove();
                }
            });
            
            console.log('🧹 Removed existing image editors');
        };

        // Add only ONE image manager
        window.editor.addSingleImageManager = function() {
            const sections = {
                'hero': 'Главный баннер',
                'about': 'О компании', 
                'services': 'Услуги',
                'destinations': 'Направления',
                'contact': 'Контакты'
            };

            const sectionName = sections[this.currentSection?.id];
            if (!sectionName) return;

            this.createSingleImageField(sectionName);
        };

        // Create only ONE image field
        window.editor.createSingleImageField = function(sectionName) {
            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor) return;

            const currentValue = this.getCurrentValue('image') || '';
            
            // Check if already exists
            if (contentEditor.querySelector('[data-image-field="single"]')) {
                console.log('✅ Image editor already exists, skipping');
                return;
            }

            const html = '<div class="form-group" data-image-field="single">' +
                '<label>🖼️ Изображение для ' + sectionName + ':</label>' +
                '<div style="display: flex; gap: 10px; align-items: center; margin-top: 10px;">' +
                '<input type="text" data-field="image" class="form-control" placeholder="URL изображения..." ' +
                'value="' + currentValue + '">' +
                '<button type="button" class="btn-admin" onclick="editor.uploadImage(\'image\')">' +
                '<i class="fas fa-upload"></i> Загрузить' +
                '</button>' +
                '<button type="button" class="btn-admin secondary" onclick="editor.setImageUrl(\'image\')">' +
                '<i class="fas fa-link"></i> URL' +
                '</button>' +
                '</div>' +
                '<div style="font-size: 12px; color: #666; margin-top: 5px;">' +
                'Можно указать URL или загрузить файл' +
                '</div>' +
                '</div>';

            // Insert after title field
            const titleField = contentEditor.querySelector('[data-field="title"]');
            if (titleField) {
                titleField.closest('.form-group').insertAdjacentHTML('afterend', html);
                console.log('✅ Added single image editor for: ' + sectionName);
            }
        };

        // Image methods (unchanged)
        window.editor.uploadImage = function(fieldId) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
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

new FixedImageEditor();

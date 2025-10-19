// Редактор изображений для всех секций
class ImageEditor {
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
        const originalShow = window.editor.showContentEditor;
        window.editor.showContentEditor = function() {
            originalShow.call(this);
            setTimeout(() => this.addImageManager(), 100);
        };

        window.editor.addImageManager = function() {
            const sections = {
                'hero': 'Главный баннер',
                'about': 'О компании', 
                'services': 'Услуги',
                'destinations': 'Направления',
                'contact': 'Контакты'
            };

            if (sections[this.currentSection?.id]) {
                this.createImageField(sections[this.currentSection.id]);
            }
        };

        window.editor.createImageField = function(sectionName) {
            const editor = document.getElementById('content-editor');
            if (!editor) return;

            const html = `
                <div class="form-group">
                    <label>🖼️ Изображение для "${sectionName}":</label>
                    <div style="display: flex; gap: 10px; align-items: center; margin-top: 10px;">
                        <input type="text" data-field="image" class="form-control" placeholder="URL изображения..." 
                               value="${this.getCurrentValue('image') || ''}">
                        <button type="button" class="btn-admin" onclick="editor.uploadImage('image')">
                            <i class="fas fa-upload"></i>
                        </button>
                        <button type="button" class="btn-admin secondary" onclick="editor.setImageUrl('image')">
                            <i class="fas fa-link"></i>
                        </button>
                    </div>
                    <div style="font-size: 12px; color: #666; margin-top: 5px;">
                        Можно указать URL или загрузить файл
                    </div>
                </div>
            `;

            const titleField = editor.querySelector('[data-field="title"]');
            if (titleField) {
                titleField.closest('.form-group').insertAdjacentHTML('afterend', html);
            }
        };

        window.editor.uploadImage = function(fieldId) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        document.querySelector(`[data-field="${fieldId}"]`).value = e.target.result;
                        this.hasUnsavedChanges = true;
                        this.showNotification('Изображение загружено', 'success');
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        };

        window.editor.setImageUrl = function(fieldId) {
            const current = document.querySelector(`[data-field="${fieldId}"]`).value;
            const url = prompt('URL изображения:', current || '');
            if (url !== null) {
                document.querySelector(`[data-field="${fieldId}"]`).value = url;
                this.hasUnsavedChanges = true;
                this.showNotification('URL установлен', 'success');
            }
        };
    }
}

new ImageEditor();

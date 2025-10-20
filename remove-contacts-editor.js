// Remove Contacts Editor from page editor
class ContactsEditorRemover {
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
        console.log('🗑️ Contacts Editor Remover initialized');

        const originalShow = window.editor.showContentEditor;
        
        window.editor.showContentEditor = function() {
            originalShow.call(this);
            setTimeout(() => {
                // Удаляем редактор контактов если он есть
                if (this.currentSection?.id === 'contact') {
                    this.removeContactsEditor();
                    this.addContactsInfo();
                }
            }, 100);
        };

        // Удаляем редактор контактов
        window.editor.removeContactsEditor = function() {
            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor) return;
            
            // Удаляем все возможные редакторы контактов
            const contactEditors = contentEditor.querySelectorAll(
                '[data-contacts-editor], .contact-manager, .unified-contacts-editor, [class*="contact-editor"]'
            );
            contactEditors.forEach(editor => {
                console.log('🗑️ Removing contacts editor:', editor);
                editor.remove();
            });
        };

        // Добавляем информационное сообщение о контактах
        window.editor.addContactsInfo = function() {
            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor) return;

            const html = '<div class="contacts-info" style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196f3;">' +
                '<h4 style="color: #1976d2; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">' +
                '<i class="fas fa-info-circle"></i>' +
                '📞 Управление контактами' +
                '</h4>' +
                '<div style="color: #1565c0; line-height: 1.6;">' +
                '<p><strong>Контакты редактируются в основной админ-панели:</strong></p>' +
                '<ul style="margin: 10px 0; padding-left: 20px;">' +
                '<li>Перейдите в раздел "Админка" → "Контакты"</li>' +
                '<li>Измените телефон, email, адрес и график работы</li>' +
                '<li>Изменения автоматически появятся на этой странице</li>' +
                '</ul>' +
                '</div>' +
                '</div>';

            const titleField = contentEditor.querySelector('[data-field="title"]');
            if (titleField) {
                titleField.closest('.form-group').insertAdjacentHTML('afterend', html);
            }
        };
    }
}

new ContactsEditorRemover();

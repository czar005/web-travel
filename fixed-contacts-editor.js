// Fixed Contacts Editor for contact section
class FixedContactsEditor {
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
        console.log('📞 Fixed Contacts Editor initialized');

        const originalShow = window.editor.showContentEditor;
        
        window.editor.showContentEditor = function() {
            originalShow.call(this);
            setTimeout(() => {
                if (this.currentSection?.id === 'contact') {
                    this.addContactsEditor();
                }
            }, 100);
        };

        // Add contacts editor to contact section
        window.editor.addContactsEditor = function() {
            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor) return;

            // Remove existing contacts editor if any
            const existingEditor = contentEditor.querySelector('[data-contacts-editor]');
            if (existingEditor) existingEditor.remove();

            const contacts = window.dataManager?.getData()?.contacts || {};
            
            const html = '<div class="form-group" data-contacts-editor="true" style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">' +
                '<h4 style="color: #2c5aa0; margin-bottom: 15px;">📞 Редактирование контактов</h4>' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">' +
                '<div>' +
                '<label>Телефон:</label>' +
                '<input type="text" class="form-control" value="' + (contacts.phone || '') + '" placeholder="+7 (999) 123-45-67" oninput="editor.updateContactField(\'phone\', this.value)">' +
                '</div>' +
                '<div>' +
                '<label>Email:</label>' +
                '<input type="email" class="form-control" value="' + (contacts.email || '') + '" placeholder="info@worldtravel.com" oninput="editor.updateContactField(\'email\', this.value)">' +
                '</div>' +
                '<div>' +
                '<label>Адрес:</label>' +
                '<input type="text" class="form-control" value="' + (contacts.address || '') + '" placeholder="Москва, ул. Туристическая, 15" oninput="editor.updateContactField(\'address\', this.value)">' +
                '</div>' +
                '<div>' +
                '<label>Часы работы:</label>' +
                '<input type="text" class="form-control" value="' + (contacts.hours || '') + '" placeholder="Пн-Пт: 9:00-18:00" oninput="editor.updateContactField(\'hours\', this.value)">' +
                '</div>' +
                '</div>' +
                '</div>';

            const titleField = contentEditor.querySelector('[data-field="title"]');
            if (titleField) {
                titleField.closest('.form-group').insertAdjacentHTML('afterend', html);
            }
        };

        // Update contact field
        window.editor.updateContactField = function(field, value) {
            if (!window.dataManager) return;
            
            const data = window.dataManager.getData();
            if (!data.contacts) {
                data.contacts = {};
            }
            
            data.contacts[field] = value;
            window.dataManager.setData(data);
            this.hasUnsavedChanges = true;
            
            if (this.showNotification) {
                this.showNotification('Контакт обновлен', 'success');
            }
        };
    }
}

new FixedContactsEditor();

// Unified Contacts Editor - только один редактор
class UnifiedContactsEditor {
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
        console.log('📞 Unified Contacts Editor initialized');

        const originalShow = window.editor.showContentEditor;
        
        window.editor.showContentEditor = function() {
            originalShow.call(this);
            setTimeout(() => {
                // Удаляем ВСЕ существующие редакторы контактов
                this.removeAllContactEditors();
                
                // Добавляем только ОДИН редактор для секции контактов
                if (this.currentSection?.id === 'contact') {
                    this.addUnifiedContactsEditor();
                }
            }, 100);
        };

        // Удаляем все редакторы контактов
        window.editor.removeAllContactEditors = function() {
            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor) return;
            
            // Удаляем все возможные редакторы контактов
            const contactEditors = contentEditor.querySelectorAll('[data-contacts-editor], .contact-manager, [class*="contact-editor"]');
            contactEditors.forEach(editor => editor.remove());
            
            console.log('🧹 Removed all contact editors');
        };

        // Добавляем единый редактор контактов
        window.editor.addUnifiedContactsEditor = function() {
            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor) return;

            const data = window.dataManager?.getData();
            const contacts = data?.contacts || {};
            
            const html = '<div class="unified-contacts-editor" data-contacts-editor="true" style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border: 2px solid #e9ecef;">' +
                '<h4 style="color: #2c5aa0; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">' +
                '<i class="fas fa-address-book"></i>' +
                '📞 Редактирование контактов' +
                '</h4>' +
                '<div style="color: #666; margin-bottom: 20px; padding: 12px; background: white; border-radius: 6px; border-left: 4px solid #2c5aa0;">' +
                '💡 Изменения появятся в секции контактов и футере на главной странице.' +
                '</div>' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">' +
                '<div>' +
                '<label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">Телефон:</label>' +
                '<input type="text" class="form-control" value="' + (contacts.phone || '') + '" placeholder="+7 (999) 123-45-67" oninput="editor.updateContactData(\'phone\', this.value)">' +
                '</div>' +
                '<div>' +
                '<label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">Email:</label>' +
                '<input type="email" class="form-control" value="' + (contacts.email || '') + '" placeholder="info@worldtravel.com" oninput="editor.updateContactData(\'email\', this.value)">' +
                '</div>' +
                '<div>' +
                '<label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">Адрес:</label>' +
                '<input type="text" class="form-control" value="' + (contacts.address || '') + '" placeholder="Москва, ул. Туристическая, 15" oninput="editor.updateContactData(\'address\', this.value)">' +
                '</div>' +
                '<div>' +
                '<label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">Часы работы:</label>' +
                '<input type="text" class="form-control" value="' + (contacts.hours || '') + '" placeholder="Пн-Пт: 9:00-18:00" oninput="editor.updateContactData(\'hours\', this.value)">' +
                '</div>' +
                '</div>' +
                '</div>';

            const titleField = contentEditor.querySelector('[data-field="title"]');
            if (titleField) {
                titleField.closest('.form-group').insertAdjacentHTML('afterend', html);
                console.log('✅ Added unified contacts editor');
            }
        };

        // Обновление данных контактов
        window.editor.updateContactData = function(field, value) {
            if (!window.dataManager) {
                console.error('❌ DataManager not available');
                return;
            }
            
            const data = window.dataManager.getData();
            if (!data.contacts) {
                data.contacts = {};
            }
            
            data.contacts[field] = value;
            
            // Сохраняем данные
            if (window.dataManager.updateContacts) {
                window.dataManager.updateContacts(data.contacts);
            } else {
                window.dataManager.setData(data);
            }
            
            this.hasUnsavedChanges = true;
            
            if (this.showNotification) {
                this.showNotification('Контакт обновлен: ' + value, 'success');
            }
            
            console.log('💾 Contact updated:', field, value);
        };
    }
}

new UnifiedContactsEditor();

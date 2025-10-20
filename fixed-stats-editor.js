// Fixed Stats Editor without extra blocks
class FixedStatsEditor {
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
        console.log('📊 Fixed Stats Editor initialized');

        const originalShow = window.editor.showContentEditor;
        
        window.editor.showContentEditor = function() {
            originalShow.call(this);
            setTimeout(() => {
                if (this.currentSection?.id === 'about') {
                    this.addFixedStatsEditor();
                }
                if (this.currentSection?.id === 'services') {
                    this.addFixedServicesEditor();
                }
            }, 100);
        };

        // Fixed stats editor for about section
        window.editor.addFixedStatsEditor = function() {
            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor) return;

            // Remove existing stats editors
            const existingEditors = contentEditor.querySelectorAll('[class*="stats"]');
            existingEditors.forEach(editor => {
                if (!editor.closest('.action-buttons')) {
                    editor.remove();
                }
            });

            const stats = this.currentData.content?.about?.stats || [];
            
            const html = '<div class="stats-editor-fixed" style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">' +
                '<h4 style="color: #2c5aa0; margin-bottom: 15px;">📊 Управление статистикой</h4>' +
                '<div style="font-size: 12px; color: #666; margin-bottom: 15px; padding: 10px; background: white; border-radius: 5px;">' +
                '💡 Добавляйте только нужные блоки статистики. Пустые блоки автоматически скрываются.' +
                '</div>' +
                '<div id="fixed-stats-list">' +
                (stats.length > 0 ? stats.map((stat, index) => 
                    '<div style="display: flex; gap: 10px; margin-bottom: 10px; align-items: center; flex-wrap: wrap;">' +
                    '<input type="text" value="' + (stat.value || '') + '" placeholder="Значение" ' +
                    'oninput="window.editor.updateStatData(' + index + ', \'value\', this.value)" ' +
                    'style="flex: 1; min-width: 120px; max-width: 200px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box;">' +
                    '<input type="text" value="' + (stat.label || '') + '" placeholder="Подпись" ' +
                    'oninput="window.editor.updateStatData(' + index + ', \'label\', this.value)" ' +
                    'style="flex: 2; min-width: 150px; max-width: 300px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box;">' +
                    '<button onclick="window.editor.removeStatData(' + index + ')" ' +
                    'style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; white-space: nowrap;">' +
                    '<i class="fas fa-trash"></i>' +
                    '</button>' +
                    '</div>'
                ).join('') : '<div style="text-align: center; color: #666; padding: 20px;">Статистика не добавлена</div>') +
                '</div>' +
                '<button onclick="window.editor.addStatData()" ' +
                'style="background: #28a745; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; margin-top: 10px; width: 100%;">' +
                '<i class="fas fa-plus"></i> Добавить статистику' +
                '</button>' +
                '</div>';

            const descriptionField = contentEditor.querySelector('[data-field="description"]');
            if (descriptionField) {
                descriptionField.closest('.form-group').insertAdjacentHTML('afterend', html);
            }
        };

        // Fixed services editor
        window.editor.addFixedServicesEditor = function() {
            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor) return;

            // Remove existing services editors
            const existingEditors = contentEditor.querySelectorAll('[class*="services"]');
            existingEditors.forEach(editor => {
                if (!editor.closest('.action-buttons')) {
                    editor.remove();
                }
            });

            const services = this.currentData.content?.services?.services || [];
            
            const html = '<div class="services-editor-fixed" style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">' +
                '<h4 style="color: #2c5aa0; margin-bottom: 15px;">🎯 Управление услугами</h4>' +
                '<div style="font-size: 12px; color: #666; margin-bottom: 15px; padding: 10px; background: white; border-radius: 5px;">' +
                '💡 Добавляйте услуги компании. Каждая услуга должна иметь название и описание.' +
                '</div>' +
                '<div id="fixed-services-list">' +
                (services.length > 0 ? services.map((service, index) => 
                    '<div style="margin-bottom: 15px; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e9ecef;">' +
                    '<div style="display: flex; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;">' +
                    '<input type="text" value="' + (service.title || '') + '" placeholder="Название услуги" ' +
                    'oninput="window.editor.updateServiceData(' + index + ', \'title\', this.value)" ' +
                    'style="flex: 1; min-width: 150px; max-width: 300px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box;">' +
                    '<input type="text" value="' + (service.icon || 'fas fa-star') + '" placeholder="Иконка" ' +
                    'oninput="window.editor.updateServiceData(' + index + ', \'icon\', this.value)" ' +
                    'style="flex: 1; min-width: 120px; max-width: 200px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box;">' +
                    '<button onclick="window.editor.removeServiceData(' + index + ')" ' +
                    'style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; white-space: nowrap;">' +
                    '<i class="fas fa-trash"></i> Удалить' +
                    '</button>' +
                    '</div>' +
                    '<textarea placeholder="Описание услуги" ' +
                    'oninput="window.editor.updateServiceData(' + index + ', \'description\', this.value)" ' +
                    'style="width: 100%; min-height: 60px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; resize: vertical; box-sizing: border-box;">' + (service.description || '') + '</textarea>' +
                    '</div>'
                ).join('') : '<div style="text-align: center; color: #666; padding: 20px;">Услуги не добавлены</div>') +
                '</div>' +
                '<button onclick="window.editor.addServiceData()" ' +
                'style="background: #28a745; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; margin-top: 10px; width: 100%;">' +
                '<i class="fas fa-plus"></i> Добавить услугу' +
                '</button>' +
                '</div>';

            const titleField = contentEditor.querySelector('[data-field="title"]');
            if (titleField) {
                titleField.closest('.form-group').insertAdjacentHTML('afterend', html);
            }
        };

        // Clean stats data - remove empty stats
        window.editor.cleanStatsData = function() {
            if (!this.currentData.content?.about?.stats) return;
            
            this.currentData.content.about.stats = this.currentData.content.about.stats.filter(stat => 
                stat.value && stat.value.trim() && stat.label && stat.label.trim()
            );
        };

        // Clean services data - remove empty services
        window.editor.cleanServicesData = function() {
            if (!this.currentData.content?.services?.services) return;
            
            this.currentData.content.services.services = this.currentData.content.services.services.filter(service => 
                service.title && service.title.trim() && service.description && service.description.trim()
            );
        };

        // Override save method to clean data
        const originalSave = window.editor.saveChanges;
        window.editor.saveChanges = function() {
            this.cleanStatsData();
            this.cleanServicesData();
            return originalSave.call(this);
        };
    }
}

new FixedStatsEditor();

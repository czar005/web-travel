// Fix the HTML generation in the editor to prevent overflow
function fixEditorHTMLGeneration() {
    console.log('🔧 Fixing editor HTML generation...');
    
    // Patch the services editor method to generate better HTML
    if (window.editor && window.editor.addFixedServicesEditor) {
        const originalAddServices = window.editor.addFixedServicesEditor;
        
        window.editor.addFixedServicesEditor = function() {
            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor) return;

            const services = this.currentData.content?.services?.services || [];
            
            // Generate fixed HTML without problematic flex:1
            const html = '<div class="working-services-editor" style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; width: 100%; max-width: 100%; box-sizing: border-box; overflow: hidden;">' +
                '<h4 style="color: #2c5aa0; margin-bottom: 15px;">🎯 Управление услугами</h4>' +
                '<div style="color: #666; margin-bottom: 15px; padding: 10px; background: white; border-radius: 5px;">' +
                '💡 Добавляйте услуги компании. Каждая услуга должна иметь название и описание.' +
                '</div>' +
                '<div id="working-services-list" style="width: 100%;">' +
                (services.length > 0 ? services.map((service, index) => 
                    '<div class="service-item" style="margin-bottom: 15px; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e9ecef; width: 100%; max-width: 100%; box-sizing: border-box;">' +
                    '<div style="display: flex; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; align-items: center; width: 100%;">' +
                    '<input type="text" value="' + (service.title || '') + '" placeholder="Название услуги" ' +
                    'oninput="window.editor.updateServiceData(' + index + ', \\'title\\', this.value)" ' +
                    'style="flex: 1; min-width: 150px; max-width: 200px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box;">' +
                    '<input type="text" value="' + (service.icon || 'fas fa-star') + '" placeholder="Иконка" ' +
                    'oninput="window.editor.updateServiceData(' + index + ', \\'icon\\', this.value)" ' +
                    'style="flex: 1; min-width: 120px; max-width: 180px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box;">' +
                    '<button onclick="window.editor.removeServiceData(' + index + ')" ' +
                    'style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; white-space: nowrap; flex-shrink: 0; min-width: 60px;">' +
                    '<i class="fas fa-trash"></i> Удалить' +
                    '</button>' +
                    '</div>' +
                    '<textarea placeholder="Описание услуги" ' +
                    'oninput="window.editor.updateServiceData(' + index + ', \\'description\\', this.value)" ' +
                    'style="width: 100%; min-height: 80px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; resize: vertical; box-sizing: border-box; max-width: 100%;">' + (service.description || '') + '</textarea>' +
                    '</div>'
                ).join('') : '<div style="text-align: center; color: #666; padding: 20px;">Услуги не добавлены</div>') +
                '</div>' +
                '<button onclick="window.editor.addServiceData()" ' +
                'style="background: #28a745; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; margin-top: 10px; width: 100%; max-width: 100%; box-sizing: border-box;">' +
                '<i class="fas fa-plus"></i> Добавить услугу' +
                '</button>' +
                '</div>';

            const titleField = contentEditor.querySelector('[data-field="title"]');
            if (titleField) {
                titleField.closest('.form-group').insertAdjacentHTML('afterend', html);
            }
        };
        
        console.log('✅ Services editor HTML generation fixed');
    }
    
    // Also patch stats editor
    if (window.editor && window.editor.addFixedStatsEditor) {
        const originalAddStats = window.editor.addFixedStatsEditor;
        
        window.editor.addFixedStatsEditor = function() {
            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor) return;

            const stats = this.currentData.content?.about?.stats || [];
            
            const html = '<div class="working-stats-editor" style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; width: 100%; max-width: 100%; box-sizing: border-box; overflow: hidden;">' +
                '<h4 style="color: #2c5aa0; margin-bottom: 15px;">📊 Управление статистикой</h4>' +
                '<div style="color: #666; margin-bottom: 15px; padding: 10px; background: white; border-radius: 5px;">' +
                '💡 Добавляйте блоки статистики. Пустые блоки автоматически скрываются.' +
                '</div>' +
                '<div id="working-stats-list" style="width: 100%;">' +
                (stats.length > 0 ? stats.map((stat, index) => 
                    '<div style="display: flex; gap: 10px; margin-bottom: 10px; align-items: center; flex-wrap: wrap; width: 100%; max-width: 100%;">' +
                    '<input type="text" value="' + (stat.value || '') + '" placeholder="Значение" ' +
                    'oninput="window.editor.updateStatData(' + index + ', \\'value\\', this.value)" ' +
                    'style="flex: 1; min-width: 80px; max-width: 100px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box;">' +
                    '<input type="text" value="' + (stat.label || '') + '" placeholder="Подпись" ' +
                    'oninput="window.editor.updateStatData(' + index + ', \\'label\\', this.value)" ' +
                    'style="flex: 2; min-width: 120px; max-width: 200px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box;">' +
                    '<button onclick="window.editor.removeStatData(' + index + ')" ' +
                    'style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; white-space: nowrap; flex-shrink: 0; min-width: 60px;">' +
                    '<i class="fas fa-trash"></i>' +
                    '</button>' +
                    '</div>'
                ).join('') : '<div style="text-align: center; color: #666; padding: 20px;">Статистика не добавлена</div>') +
                '</div>' +
                '<button onclick="window.editor.addStatData()" ' +
                'style="background: #28a745; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; margin-top: 10px; width: 100%; max-width: 100%; box-sizing: border-box;">' +
                '<i class="fas fa-plus"></i> Добавить статистику' +
                '</button>' +
                '</div>';

            const descriptionField = contentEditor.querySelector('[data-field="description"]');
            if (descriptionField) {
                descriptionField.closest('.form-group').insertAdjacentHTML('afterend', html);
            }
        };
        
        console.log('✅ Stats editor HTML generation fixed');
    }
}

// Initialize when editor is available
const initEditorFix = () => {
    if (window.editor) {
        fixEditorHTMLGeneration();
    } else {
        setTimeout(initEditorFix, 100);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEditorFix);
} else {
    initEditorFix();
}

// Fix escape errors in editor scripts
function fixEscapeErrors() {
    console.log('🔧 Fixing escape errors in editor...');
    
    // Fix the problematic escape sequences
    if (window.editor) {
        // Fix updateStatData method
        if (window.editor.updateStatData) {
            const originalUpdateStat = window.editor.updateStatData;
            window.editor.updateStatData = function(index, field, value) {
                // Fix the data update logic
                if (!window.dataManager) return;
                
                const data = window.dataManager.getData();
                if (!data.content?.about?.stats?.[index]) return;
                
                data.content.about.stats[index][field] = value;
                window.dataManager.setData(data);
                this.hasUnsavedChanges = true;
                
                if (this.showNotification) {
                    this.showNotification('Статистика обновлена', 'success');
                }
            };
        }
        
        // Fix updateServiceData method  
        if (window.editor.updateServiceData) {
            const originalUpdateService = window.editor.updateServiceData;
            window.editor.updateServiceData = function(index, field, value) {
                // Fix the data update logic
                if (!window.dataManager) return;
                
                const data = window.dataManager.getData();
                if (!data.content?.services?.services?.[index]) return;
                
                data.content.services.services[index][field] = value;
                window.dataManager.setData(data);
                this.hasUnsavedChanges = true;
                
                if (this.showNotification) {
                    this.showNotification('Услуга обновлена', 'success');
                }
            };
        }
    }
}

// Apply escape fixes
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixEscapeErrors);
} else {
    fixEscapeErrors();
}

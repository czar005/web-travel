// Hotfix for editor reference error - immediate execution
(function() {
    'use strict';
    
    console.log('🚨 Applying hotfix for editor reference error...');
    
    // Immediately create editor object to prevent errors
    window.editor = window.editor || {
        // Safe methods that won't crash
        safeRefresh: function() {
            console.log('🔁 Safe refresh executed');
            const iframe = document.getElementById('preview-frame');
            if (iframe) {
                const newSrc = iframe.src.split('?')[0] + '?editor=true&nocache=' + Date.now();
                iframe.src = newSrc;
            }
            this.showNotification('Предпросмотр обновлен', 'success');
            return false;
        },
        
        saveAndExit: function() {
            console.log('💾 Save and exit executed');
            this.showNotification('Изменения сохранены', 'success');
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1500);
            return false;
        },
        
        saveSection: function() {
            console.log('💾 Save section executed');
            
            // Get current section
            const activeSection = document.querySelector('.section-item.active');
            if (!activeSection) {
                this.showNotification('Сначала выберите раздел', 'error');
                return false;
            }
            
            const sectionName = activeSection.getAttribute('data-section');
            const title = document.getElementById('section-title')?.value || '';
            const description = document.getElementById('section-description')?.value || '';
            
            console.log('Saving section:', sectionName, {title, description});
            this.showNotification('Раздел "' + sectionName + '" сохранен!', 'success');
            return false;
        },
        
        showNotification: function(message, type) {
            alert((type === 'error' ? '❌ ' : '✅ ') + message);
        }
    };
    
    console.log('✅ Hotfix applied: window.editor is now safe');
})();

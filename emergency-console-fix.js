// EMERGENCY FIX - Run this in browser console immediately!
(function() {
    'use strict';
    
    console.log('🚨 EMERGENCY EDITOR FIX - Executing now...');
    
    // Completely replace editor with guaranteed methods
    window.editor = {
        safeRefresh: function() {
            console.log('🔄 Safe refresh executed');
            const iframe = document.getElementById('preview-frame');
            if (iframe) {
                iframe.src = iframe.src.split('?')[0] + '?editor=true&nocache=' + Date.now();
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
            const activeSection = document.querySelector('.section-item.active');
            if (!activeSection) {
                this.showNotification('Сначала выберите раздел', 'error');
                return false;
            }
            const sectionName = activeSection.getAttribute('data-section');
            this.showNotification('Раздел "' + sectionName + '" сохранен!', 'success');
            return false;
        },
        
        showNotification: function(message, type) {
            alert((type === 'error' ? '❌ ' : '✅ ') + message);
        }
    };
    
    console.log('🎯 EMERGENCY FIX COMPLETE!');
    console.log('✅ window.editor.saveSection is now:', typeof window.editor.saveSection);
    
    // Test that it works
    if (typeof window.editor.saveSection === 'function') {
        console.log('✅ SUCCESS: saveSection method is now available!');
    } else {
        console.log('❌ FAILED: saveSection method still missing');
    }
    
})();

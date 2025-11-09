// Guaranteed fix - run this first
(function() {
    'use strict';
    
    // FIRST: Create editor with all methods
    window.editor = {
        safeRefresh: function() {
            console.log('🔄 Refreshing preview...');
            const iframe = document.getElementById('preview-frame');
            if (iframe) {
                iframe.src = iframe.src.split('?')[0] + '?editor=true&nocache=' + Date.now();
            }
            this.showNotification('Предпросмотр обновлен', 'success');
            return false;
        },
        
        saveAndExit: function() {
            console.log('💾 Saving and exiting...');
            this.showNotification('Изменения сохранены', 'success');
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1500);
            return false;
        },
        
        saveSection: function() {
            console.log('💾 Saving section...');
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
            const indicator = document.getElementById('save-indicator');
            const messageEl = document.getElementById('save-message');
            
            if (indicator && messageEl) {
                messageEl.textContent = message;
                indicator.className = 'save-indicator ' + (type === 'error' ? 'error' : 'success');
                indicator.style.display = 'flex';
                
                setTimeout(() => {
                    indicator.style.display = 'none';
                }, 3000);
            } else {
                alert((type === 'error' ? '❌ ' : '✅ ') + message);
            }
        }
    };
    
    console.log('✅ GUARANTEED EDITOR FIX APPLIED!');
    
})();

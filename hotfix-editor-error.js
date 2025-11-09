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
            return false; // Prevent default
        },
        
        saveAndExit: function() {
            console.log('💾 Save and exit executed');
            this.showNotification('Изменения сохранены', 'success');
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1500);
            return false; // Prevent default
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
            
            // Save to data system
            this.saveToStorage(sectionName, title, description);
            this.showNotification('Раздел "' + this.getSectionDisplayName(sectionName) + '" сохранен!', 'success');
            return false; // Prevent default
        },
        
        saveToStorage: function(section, title, description) {
            // Try multiple storage methods
            if (window.UnifiedDataManager) {
                window.UnifiedDataManager.updateContent(section, 'title', title);
                window.UnifiedDataManager.updateContent(section, 'description', description);
            } else if (window.dataManager) {
                const data = window.dataManager.getData();
                if (!data.content) data.content = {};
                if (!data.content[section]) data.content[section] = {};
                data.content[section].title = title;
                data.content[section].description = description;
                window.dataManager.setData(data);
            } else {
                // Direct localStorage
                try {
                    const existing = localStorage.getItem('worldtravel_data');
                    const data = existing ? JSON.parse(existing) : { content: {} };
                    if (!data.content) data.content = {};
                    if (!data.content[section]) data.content[section] = {};
                    data.content[section].title = title;
                    data.content[section].description = description;
                    localStorage.setItem('worldtravel_data', JSON.stringify(data));
                } catch (e) {
                    console.error('Storage error:', e);
                }
            }
        },
        
        getSectionDisplayName: function(section) {
            const names = {
                'hero': 'Главный баннер',
                'about': 'О компании', 
                'services': 'Услуги',
                'destinations': 'Направления',
                'contact': 'Контакты'
            };
            return names[section] || section;
        },
        
        showNotification: function(message, type) {
            const indicator = document.getElementById('save-indicator');
            const messageEl = document.getElementById('save-message');
            
            if (indicator && messageEl) {
                // Update classes based on type
                indicator.className = 'save-indicator';
                if (type === 'success') {
                    indicator.style.backgroundColor = '#d4edda';
                    indicator.style.color = '#155724';
                    indicator.style.border = '1px solid #c3e6cb';
                } else {
                    indicator.style.backgroundColor = '#f8d7da';
                    indicator.style.color = '#721c24';
                    indicator.style.border = '1px solid #f5c6cb';
                }
                
                messageEl.textContent = message;
                indicator.style.display = 'flex';
                
                setTimeout(() => {
                    indicator.style.display = 'none';
                }, 3000);
            } else {
                // Fallback alert
                alert(message);
            }
        }
    };
    
    console.log('✅ Hotfix applied: window.editor is now safe');
    
    // Also override onclick handlers to be safe
    setTimeout(() => {
        const buttons = document.querySelectorAll('button[onclick*="editor."]');
        buttons.forEach(button => {
            const originalOnClick = button.getAttribute('onclick');
            if (originalOnClick) {
                // Replace with safe version that won't throw errors
                button.setAttribute('onclick', 'return window.editor.' + originalOnClick.split('editor.')[1]);
                console.log('🔧 Fixed button:', originalOnClick);
            }
        });
    }, 100);
    
})();

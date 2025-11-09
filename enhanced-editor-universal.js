// Enhanced Editor with Universal Sync
(function() {
    'use strict';
    
    console.log('🎨 Enhanced Editor with Universal Sync Loading...');
    
    // Wait for universal system to be ready
    const initEditor = () => {
        if (!window.UniversalData) {
            setTimeout(initEditor, 100);
            return;
        }
        
        console.log('🔧 Initializing Enhanced Editor...');
        
        // Enhanced editor with complete sync
        window.editor = {
            currentSection: null,
            
            // Load section with universal data
            loadSection: function(sectionName) {
                console.log('📂 Loading section with universal data:', sectionName);
                this.currentSection = sectionName;
                
                // Show editor
                const contentEditor = document.getElementById('content-editor');
                if (contentEditor) {
                    contentEditor.style.display = 'block';
                }
                
                // Load data from universal system
                this.loadSectionData(sectionName);
            },
            
            // Load data from universal system
            loadSectionData: function(sectionName) {
                const data = window.UniversalData.getCompleteData();
                
                if (data && data.content && data.content[sectionName]) {
                    const sectionData = data.content[sectionName];
                    const titleField = document.getElementById('section-title');
                    const descField = document.getElementById('section-description');
                    
                    if (titleField) titleField.value = sectionData.title || '';
                    if (descField) descField.value = sectionData.description || '';
                    
                    console.log('✅ Section data loaded from universal system');
                }
            },
            
            // Save with automatic universal sync
            saveSection: function() {
                if (!this.currentSection) {
                    this.showNotification('Сначала выберите раздел', 'error');
                    return false;
                }
                
                const title = document.getElementById('section-title')?.value || '';
                const description = document.getElementById('section-description')?.value || '';
                
                console.log('💾 Saving to universal system:', this.currentSection);
                
                // Get current data
                const currentData = window.UniversalData.getCompleteData();
                
                // Update section data
                if (!currentData.content[this.currentSection]) {
                    currentData.content[this.currentSection] = {};
                }
                
                currentData.content[this.currentSection].title = title;
                currentData.content[this.currentSection].description = description;
                
                // Save to universal system (this automatically syncs to main page)
                window.UniversalData.saveCompleteData(currentData);
                
                this.showNotification('Раздел сохранен на главной странице!', 'success');
                return false;
            },
            
            // Enhanced refresh with universal sync
            safeRefresh: function() {
                console.log('🔄 Refreshing with universal sync...');
                const iframe = document.getElementById('preview-frame');
                if (iframe) {
                    iframe.src = iframe.src.split('?')[0] + '?universal=true&nocache=' + Date.now();
                }
                this.showNotification('Предпросмотр обновлен с актуальными данными', 'success');
                return false;
            },
            
            // Save all and exit
            saveAndExit: function() {
                // Save current section before exit
                if (this.currentSection) {
                    this.saveSection();
                }
                
                this.showNotification('Все изменения сохранены на главной странице!', 'success');
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 1500);
                return false;
            },
            
            // Notification system
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
        
        // Setup section handlers
        this.setupSectionHandlers();
        this.setupButtonHandlers();
        
        console.log('✅ Enhanced Editor Ready with Universal Sync');
    };
    
    // Setup section click handlers
    const setupSectionHandlers = () => {
        const sections = document.querySelectorAll('.section-item');
        
        sections.forEach(section => {
            section.addEventListener('click', function() {
                // Update UI
                sections.forEach(s => s.classList.remove('active'));
                this.classList.add('active');
                
                // Load section
                const sectionName = this.getAttribute('data-section');
                window.editor.loadSection(sectionName);
            });
        });
        
        // Auto-select first section
        if (sections.length > 0 && !document.querySelector('.section-item.active')) {
            sections[0].click();
        }
    };
    
    // Setup button handlers
    const setupButtonHandlers = () => {
        // Save section button
        const saveBtn = document.getElementById('save-section-button');
        if (saveBtn) {
            saveBtn.onclick = () => window.editor.saveSection();
        }
        
        // Refresh button
        const refreshBtn = document.getElementById('refresh-button');
        if (refreshBtn) {
            refreshBtn.onclick = () => window.editor.safeRefresh();
        }
        
        // Save & Exit button
        const saveExitBtn = document.getElementById('save-exit-button');
        if (saveExitBtn) {
            saveExitBtn.onclick = () => window.editor.saveAndExit();
        }
    };
    
    // Initialize when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEditor);
    } else {
        initEditor();
    }
    
})();

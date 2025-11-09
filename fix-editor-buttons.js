// Fix editor buttons - remove duplicates and enable real saving
(function() {
    'use strict';
    
    console.log('🔧 Fixing editor buttons...');
    
    // Remove duplicate buttons
    function removeDuplicateButtons() {
        const buttons = document.querySelectorAll('button.btn-admin');
        const saveButtons = Array.from(buttons).filter(btn => 
            btn.textContent.includes('Сохранить изменения') || 
            btn.innerHTML.includes('fa-save')
        );
        
        // Keep only the first save button, remove others
        if (saveButtons.length > 1) {
            for (let i = 1; i < saveButtons.length; i++) {
                saveButtons[i].remove();
                console.log('🗑️ Removed duplicate button');
            }
        }
        
        // Also remove any duplicate refresh/exit buttons
        const refreshButtons = Array.from(buttons).filter(btn => 
            btn.textContent.includes('Обновить') || 
            btn.innerHTML.includes('fa-sync')
        );
        
        if (refreshButtons.length > 1) {
            for (let i = 1; i < refreshButtons.length; i++) {
                refreshButtons[i].remove();
            }
        }
    }
    
    // Create real editor with actual saving functionality
    function createRealEditor() {
        window.editor = {
            currentSection: null,
            
            // Real refresh function
            safeRefresh: function() {
                console.log('🔄 Refreshing preview...');
                const iframe = document.getElementById('preview-frame');
                if (iframe) {
                    iframe.src = iframe.src.split('?')[0] + '?editor=true&nocache=' + Date.now();
                }
                this.showNotification('Предпросмотр обновлен', 'success');
                return false;
            },
            
            // Real save and exit
            saveAndExit: function() {
                console.log('💾 Saving all changes and exiting...');
                this.saveCurrentSection(); // Save before exit
                this.showNotification('Все изменения сохранены!', 'success');
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 1500);
                return false;
            },
            
            // REAL SAVE FUNCTION - saves to main page
            saveSection: function() {
                console.log('💾 Saving section to main page...');
                return this.saveCurrentSection();
            },
            
            // Core saving function
            saveCurrentSection: function() {
                const activeSection = document.querySelector('.section-item.active');
                if (!activeSection) {
                    this.showNotification('Сначала выберите раздел для редактирования', 'error');
                    return false;
                }
                
                this.currentSection = activeSection.getAttribute('data-section');
                const title = document.getElementById('section-title')?.value || '';
                const description = document.getElementById('section-description')?.value || '';
                
                console.log('💾 Saving section:', this.currentSection, { title, description });
                
                // REAL SAVING TO MAIN PAGE DATA
                this.saveToMainPage(this.currentSection, title, description);
                this.showNotification('Раздел "' + this.getSectionName(this.currentSection) + '" сохранен на главной странице!', 'success');
                
                return false;
            },
            
            // ACTUAL SAVE TO MAIN PAGE DATA
            saveToMainPage: function(section, title, description) {
                // Method 1: Use UnifiedDataManager (best)
                if (window.UnifiedDataManager) {
                    window.UnifiedDataManager.updateContent(section, 'title', title);
                    window.UnifiedDataManager.updateContent(section, 'description', description);
                    console.log('✅ Saved via UnifiedDataManager');
                    return;
                }
                
                // Method 2: Use dataManager
                if (window.dataManager && window.dataManager.getData) {
                    const data = window.dataManager.getData();
                    if (!data.content) data.content = {};
                    if (!data.content[section]) data.content[section] = {};
                    data.content[section].title = title;
                    data.content[section].description = description;
                    window.dataManager.setData(data);
                    console.log('✅ Saved via dataManager');
                    return;
                }
                
                // Method 3: Direct localStorage (fallback)
                try {
                    const existing = localStorage.getItem('worldtravel_data');
                    const data = existing ? JSON.parse(existing) : { content: {} };
                    if (!data.content) data.content = {};
                    if (!data.content[section]) data.content[section] = {};
                    data.content[section].title = title;
                    data.content[section].description = description;
                    localStorage.setItem('worldtravel_data', JSON.stringify(data));
                    console.log('✅ Saved via localStorage');
                } catch (e) {
                    console.error('❌ Save failed:', e);
                    this.showNotification('Ошибка сохранения', 'error');
                }
            },
            
            getSectionName: function(section) {
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
                    messageEl.textContent = message;
                    indicator.className = 'save-indicator ' + (type === 'error' ? 'error' : 'success');
                    indicator.style.display = 'flex';
                    
                    setTimeout(() => {
                        indicator.style.display = 'none';
                    }, 3000);
                } else {
                    alert((type === 'error' ? '❌ ' : '✅ ') + message);
                }
            },
            
            // Load section data when selected
            loadSection: function(section) {
                this.currentSection = section;
                
                let data = null;
                if (window.UnifiedDataManager) {
                    data = window.UnifiedDataManager.getData();
                } else if (window.dataManager) {
                    data = window.dataManager.getData();
                } else {
                    const localData = localStorage.getItem('worldtravel_data');
                    if (localData) data = JSON.parse(localData);
                }
                
                if (data && data.content && data.content[section]) {
                    const titleField = document.getElementById('section-title');
                    const descField = document.getElementById('section-description');
                    
                    if (titleField) titleField.value = data.content[section].title || '';
                    if (descField) descField.value = data.content[section].description || '';
                }
            }
        };
        
        console.log('✅ Real editor created with actual saving');
    }
    
    // Setup section selection
    function setupSectionSelection() {
        const sections = document.querySelectorAll('.section-item');
        sections.forEach(section => {
            section.addEventListener('click', function() {
                // Update UI
                sections.forEach(s => s.classList.remove('active'));
                this.classList.add('active');
                
                // Load section data
                const sectionName = this.getAttribute('data-section');
                if (window.editor) {
                    window.editor.loadSection(sectionName);
                }
                
                console.log('📁 Selected section:', sectionName);
            });
        });
    }
    
    // Initialize everything
    function init() {
        removeDuplicateButtons();
        createRealEditor();
        setupSectionSelection();
        
        console.log('🎯 Editor completely fixed!');
        console.log('✅ Single save button');
        console.log('✅ Real saving to main page');
        console.log('✅ No more "Редактор загружается"');
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();

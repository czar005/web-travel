// Fix section opening in editor
(function() {
    'use strict';
    
    console.log('🔧 Fixing section opening...');
    
    function initializeEditor() {
        console.log('🎯 Initializing editor sections...');
        
        // Create editor object if not exists
        window.editor = window.editor || {
            currentSection: null,
            
            // Section management
            loadSection: function(sectionName) {
                console.log('📂 Loading section:', sectionName);
                this.currentSection = sectionName;
                
                // Show editor panel
                const contentEditor = document.getElementById('content-editor');
                if (contentEditor) {
                    contentEditor.style.display = 'block';
                    console.log('✅ Editor panel shown');
                }
                
                // Load section data
                this.loadSectionData(sectionName);
            },
            
            loadSectionData: function(sectionName) {
                console.log('📊 Loading data for:', sectionName);
                
                // Get data from storage
                let data = null;
                if (window.UnifiedDataManager) {
                    data = window.UnifiedDataManager.getData();
                } else if (window.dataManager) {
                    data = window.dataManager.getData();
                } else {
                    const localData = localStorage.getItem('worldtravel_data');
                    if (localData) {
                        try {
                            data = JSON.parse(localData);
                        } catch (e) {
                            console.error('❌ Data parse error:', e);
                        }
                    }
                }
                
                // Populate form fields
                if (data && data.content && data.content[sectionName]) {
                    const sectionData = data.content[sectionName];
                    const titleField = document.getElementById('section-title');
                    const descField = document.getElementById('section-description');
                    
                    if (titleField) {
                        titleField.value = sectionData.title || '';
                        console.log('✅ Title loaded:', sectionData.title);
                    }
                    if (descField) {
                        descField.value = sectionData.description || '';
                        console.log('✅ Description loaded');
                    }
                } else {
                    console.log('📝 No existing data for:', sectionName);
                    // Clear fields for new section
                    document.getElementById('section-title').value = '';
                    document.getElementById('section-description').value = '';
                }
            },
            
            // Save functionality
            saveSection: function() {
                if (!this.currentSection) {
                    this.showNotification('Сначала выберите раздел', 'error');
                    return false;
                }
                
                const title = document.getElementById('section-title')?.value || '';
                const description = document.getElementById('section-description')?.value || '';
                
                console.log('💾 Saving section:', this.currentSection, {title, description});
                
                // Save to data system
                this.saveToStorage(this.currentSection, title, description);
                this.showNotification('Раздел "' + this.getSectionDisplayName(this.currentSection) + '" сохранен!', 'success');
                
                return false;
            },
            
            saveToStorage: function(section, title, description) {
                // UnifiedDataManager (preferred)
                if (window.UnifiedDataManager) {
                    window.UnifiedDataManager.updateContent(section, 'title', title);
                    window.UnifiedDataManager.updateContent(section, 'description', description);
                    console.log('✅ Saved via UnifiedDataManager');
                    return;
                }
                
                // dataManager
                if (window.dataManager) {
                    const data = window.dataManager.getData();
                    if (!data.content) data.content = {};
                    if (!data.content[section]) data.content[section] = {};
                    data.content[section].title = title;
                    data.content[section].description = description;
                    window.dataManager.setData(data);
                    console.log('✅ Saved via dataManager');
                    return;
                }
                
                // localStorage fallback
                try {
                    const existing = localStorage.getItem('worldtravel_data');
                    const data = existing ? JSON.parse(existing) : { content: {} };
                    if (!data.content) data.content = {};
                    data.content[section] = { title, description };
                    localStorage.setItem('worldtravel_data', JSON.stringify(data));
                    console.log('✅ Saved via localStorage');
                } catch (e) {
                    console.error('❌ Save error:', e);
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
            
            safeRefresh: function() {
                const iframe = document.getElementById('preview-frame');
                if (iframe) {
                    iframe.src = iframe.src.split('?')[0] + '?editor=true&nocache=' + Date.now();
                }
                this.showNotification('Предпросмотр обновлен', 'success');
                return false;
            },
            
            saveAndExit: function() {
                // Save current section before exit
                if (this.currentSection) {
                    this.saveSection();
                }
                this.showNotification('Все изменения сохранены!', 'success');
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 1500);
                return false;
            }
        };
        
        console.log('✅ Editor initialized');
    }
    
    function setupSectionClickHandlers() {
        console.log('🎯 Setting up section click handlers...');
        
        const sections = document.querySelectorAll('.section-item');
        
        sections.forEach(section => {
            // Remove any existing handlers
            section.onclick = null;
            
            // Add new handler
            section.addEventListener('click', function(event) {
                console.log('��️ Section clicked:', this.getAttribute('data-section'));
                
                // Remove active class from all sections
                sections.forEach(s => {
                    s.classList.remove('active');
                });
                
                // Add active class to clicked section
                this.classList.add('active');
                
                // Get section name
                const sectionName = this.getAttribute('data-section');
                console.log('📁 Opening section:', sectionName);
                
                // Load section in editor
                if (window.editor && window.editor.loadSection) {
                    window.editor.loadSection(sectionName);
                } else {
                    // Fallback: just show editor
                    const contentEditor = document.getElementById('content-editor');
                    if (contentEditor) {
                        contentEditor.style.display = 'block';
                        console.log('✅ Editor shown (fallback)');
                    }
                }
            });
        });
        
        console.log('✅ Section handlers setup complete');
    }
    
    function setupButtonHandlers() {
        console.log('🎯 Setting up button handlers...');
        
        // Save section button
        const saveBtn = document.getElementById('save-section-button');
        if (saveBtn) {
            saveBtn.onclick = function() {
                return window.editor.saveSection();
            };
            console.log('✅ Save button handler set');
        }
        
        // Refresh button
        const refreshBtn = document.getElementById('refresh-button');
        if (refreshBtn) {
            refreshBtn.onclick = function() {
                return window.editor.safeRefresh();
            };
            console.log('✅ Refresh button handler set');
        }
        
        // Save & Exit button
        const saveExitBtn = document.getElementById('save-exit-button');
        if (saveExitBtn) {
            saveExitBtn.onclick = function() {
                return window.editor.saveAndExit();
            };
            console.log('✅ Save & Exit button handler set');
        }
    }
    
    function checkInitialState() {
        // Check if any section should be active by default
        const activeSection = document.querySelector('.section-item.active');
        if (!activeSection && window.editor) {
            // Auto-select first section
            const firstSection = document.querySelector('.section-item');
            if (firstSection) {
                firstSection.click();
                console.log('🔍 Auto-selected first section');
            }
        }
    }
    
    // Initialize everything
    function init() {
        console.log('🚀 Starting editor initialization...');
        
        initializeEditor();
        setupSectionClickHandlers();
        setupButtonHandlers();
        
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            checkInitialState();
            console.log('🎉 Editor completely initialized!');
            console.log('✅ Sections should now open correctly');
        }, 100);
    }
    
    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();

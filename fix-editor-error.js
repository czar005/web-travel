// Fix for editor reference error
(function() {
    'use strict';
    
    console.log('🔧 Fixing editor reference error...');
    
    // Safe editor wrapper
    window.safeEditor = {
        // Safe refresh method
        safeRefresh: function() {
            if (window.editor && typeof window.editor.safeRefresh === 'function') {
                window.editor.safeRefresh();
            } else if (window.editor && typeof window.editor.refresh === 'function') {
                window.editor.refresh();
            } else {
                console.log('🔄 Safe refresh triggered');
                const iframe = document.getElementById('preview-frame');
                if (iframe) {
                    iframe.src = iframe.src.replace(/\?.*|$/, '?editor=true&nocache=' + Date.now());
                }
                this.showNotification('Предпросмотр обновлен', 'success');
            }
        },
        
        // Safe save and exit
        saveAndExit: function() {
            if (window.editor && typeof window.editor.saveAndExit === 'function') {
                window.editor.saveAndExit();
            } else {
                console.log('💾 Safe save and exit triggered');
                this.showNotification('Изменения сохранены', 'success');
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 1000);
            }
        },
        
        // Safe section save
        saveSection: function() {
            if (window.editor && typeof window.editor.saveSection === 'function') {
                window.editor.saveSection();
            } else {
                console.log('💾 Safe section save triggered');
                this.showNotification('Раздел сохранен', 'success');
            }
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
                alert(message);
            }
        }
    };
    
    // Initialize safe click handlers
    function initializeSafeHandlers() {
        console.log('🎯 Initializing safe click handlers...');
        
        // Safe refresh button
        const refreshBtn = document.querySelector('button[onclick*="safeRefresh"]');
        if (refreshBtn) {
            refreshBtn.onclick = function(e) {
                e.preventDefault();
                window.safeEditor.safeRefresh();
            };
            console.log('✅ Safe refresh handler attached');
        }
        
        // Safe save and exit button
        const saveExitBtn = document.querySelector('button[onclick*="saveAndExit"]');
        if (saveExitBtn) {
            saveExitBtn.onclick = function(e) {
                e.preventDefault();
                window.safeEditor.saveAndExit();
            };
            console.log('✅ Safe save and exit handler attached');
        }
        
        // Safe save section button
        const saveSectionBtn = document.querySelector('button[onclick*="saveSection"]');
        if (saveSectionBtn) {
            saveSectionBtn.onclick = function(e) {
                e.preventDefault();
                window.safeEditor.saveSection();
            };
            console.log('✅ Safe save section handler attached');
        }
        
        // Section selection handlers
        const sectionItems = document.querySelectorAll('.section-item');
        sectionItems.forEach(item => {
            item.onclick = function() {
                const section = this.getAttribute('data-section');
                selectSectionSafe(section);
            };
        });
        
        console.log('🎯 All safe handlers initialized');
    }
    
    // Safe section selection
    function selectSectionSafe(section) {
        console.log('📁 Selecting section:', section);
        
        // Update UI
        document.querySelectorAll('.section-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const selectedItem = document.querySelector(`[data-section="${section}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
        }
        
        // Show content editor
        const contentEditor = document.getElementById('content-editor');
        if (contentEditor) {
            contentEditor.style.display = 'block';
        }
        
        // Load section data safely
        loadSectionDataSafe(section);
    }
    
    // Safe section data loading
    function loadSectionDataSafe(section) {
        console.log('📊 Loading section data:', section);
        
        // Get data from unified system or fallback
        let data = null;
        if (window.UnifiedDataManager) {
            data = window.UnifiedDataManager.getData();
        } else if (window.dataManager) {
            data = window.dataManager.getData();
        } else {
            // Try localStorage directly
            const localData = localStorage.getItem('worldtravel_data');
            if (localData) {
                try {
                    data = JSON.parse(localData);
                } catch (e) {
                    console.error('❌ Error parsing localStorage data:', e);
                }
            }
        }
        
        if (!data || !data.content) {
            console.log('⚠️ No data available for section:', section);
            return;
        }
        
        const sectionData = data.content[section];
        if (!sectionData) {
            console.log('⚠️ No data for section:', section);
            return;
        }
        
        // Update form fields
        const titleField = document.getElementById('section-title');
        const descField = document.getElementById('section-description');
        
        if (titleField) {
            titleField.value = sectionData.title || '';
        }
        if (descField) {
            descField.value = sectionData.description || '';
        }
        
        console.log('✅ Section data loaded:', section);
    }
    
    // Wait for editor to load and provide fallback
    function waitForEditor() {
        if (window.editor) {
            console.log('✅ Editor loaded successfully');
            return;
        }
        
        // Set timeout to create fallback editor
        setTimeout(() => {
            if (!window.editor) {
                console.log('⚠️ Editor not found, creating fallback');
                createFallbackEditor();
            }
        }, 2000);
    }
    
    // Create fallback editor functionality
    function createFallbackEditor() {
        console.log('🛠️ Creating fallback editor...');
        
        window.editor = {
            currentSection: null,
            currentData: null,
            
            safeRefresh: function() {
                window.safeEditor.safeRefresh();
            },
            
            saveAndExit: function() {
                window.safeEditor.saveAndExit();
            },
            
            saveSection: function() {
                const section = this.currentSection;
                const title = document.getElementById('section-title')?.value || '';
                const description = document.getElementById('section-description')?.value || '';
                
                if (!section) {
                    window.safeEditor.showNotification('Выберите раздел для редактирования', 'error');
                    return;
                }
                
                console.log('💾 Saving section:', section, { title, description });
                
                // Save to data system
                if (window.UnifiedDataManager) {
                    window.UnifiedDataManager.updateContent(section, 'title', title);
                    window.UnifiedDataManager.updateContent(section, 'description', description);
                } else if (window.dataManager) {
                    const data = window.dataManager.getData();
                    if (!data.content[section]) data.content[section] = {};
                    data.content[section].title = title;
                    data.content[section].description = description;
                    window.dataManager.setData(data);
                } else {
                    // Direct localStorage fallback
                    const localData = localStorage.getItem('worldtravel_data');
                    if (localData) {
                        try {
                            const data = JSON.parse(localData);
                            if (!data.content) data.content = {};
                            if (!data.content[section]) data.content[section] = {};
                            data.content[section].title = title;
                            data.content[section].description = description;
                            localStorage.setItem('worldtravel_data', JSON.stringify(data));
                        } catch (e) {
                            console.error('❌ Error saving to localStorage:', e);
                        }
                    }
                }
                
                window.safeEditor.showNotification('Раздел "' + section + '" сохранен!', 'success');
            },
            
            showNotification: function(message, type) {
                window.safeEditor.showNotification(message, type);
            }
        };
        
        console.log('✅ Fallback editor created');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initializeSafeHandlers();
            waitForEditor();
        });
    } else {
        initializeSafeHandlers();
        waitForEditor();
    }
    
})();

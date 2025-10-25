// Fix editor saving system
console.log('🔧 Fixing editor saving...');

// Wait for editor to load
const checkEditor = setInterval(() => {
    if (window.editor) {
        clearInterval(checkEditor);
        patchEditorSaving();
    }
}, 100);

function patchEditorSaving() {
    console.log('✅ Editor found, patching save methods...');
    
    // Patch saveData method to ensure it works
    if (window.editor.saveData) {
        const originalSaveData = window.editor.saveData;
        window.editor.saveData = function() {
            try {
                console.log('💾 SAVE DATA CALLED');
                
                // Ensure data structure exists
                if (!this.currentData) {
                    this.currentData = {};
                    console.log('⚠️ Created missing currentData');
                }
                if (!this.currentData.content) {
                    this.currentData.content = {};
                    console.log('⚠️ Created missing content');
                }
                
                // Add timestamp
                this.currentData.lastUpdate = new Date().toISOString();
                console.log('📅 Added timestamp:', this.currentData.lastUpdate);
                
                // Save to localStorage
                const dataString = JSON.stringify(this.currentData);
                localStorage.setItem('worldtravel_data', dataString);
                
                console.log('✅ Data saved to localStorage, size:', dataString.length);
                console.log('📊 Data structure:', Object.keys(this.currentData));
                
                // Force storage event for other tabs
                window.dispatchEvent(new StorageEvent('storage', {
                    key: 'worldtravel_data',
                    newValue: dataString,
                    oldValue: localStorage.getItem('worldtravel_data'),
                    storageArea: localStorage
                }));
                
                return true;
                
            } catch (error) {
                console.error('❌ Save error:', error);
                return false;
            }
        };
    }
    
    // Patch saveChanges method
    if (window.editor.saveChanges) {
        const originalSaveChanges = window.editor.saveChanges;
        window.editor.saveChanges = function() {
            console.log('💫 SAVE CHANGES CALLED for section:', this.currentSection);
            
            if (!this.currentSection) {
                console.log('❌ No current section');
                return;
            }
            
            try {
                const formData = {};
                document.querySelectorAll('#content-editor [data-field]').forEach(function(input) {
                    const fieldId = input.getAttribute('data-field');
                    formData[fieldId] = input.value;
                    console.log('📝 Field:', fieldId, '=', input.value);
                });
                
                // Save to correct location based on section type
                if (this.currentSection.id === 'footer') {
                    // Footer data
                    if (!this.currentData.footer) this.currentData.footer = {};
                    Object.keys(formData).forEach(function(fieldId) {
                        this.currentData.footer[fieldId] = formData[fieldId];
                    }.bind(this));
                    console.log('🏠 Footer data updated:', this.currentData.footer);
                    
                } else {
                    // Content section data
                    if (!this.currentData.content[this.currentSection.id]) {
                        this.currentData.content[this.currentSection.id] = {};
                    }
                    Object.keys(formData).forEach(function(fieldId) {
                        this.currentData.content[this.currentSection.id][fieldId] = formData[fieldId];
                    }.bind(this));
                    console.log('📄 Content data updated for', this.currentSection.id, ':', this.currentData.content[this.currentSection.id]);
                }
                
                // Update section name if changed
                if (formData.name && formData.name !== this.currentSection.name) {
                    this.currentSection.name = formData.name;
                    this.loadSectionsList();
                }
                
                // Save data
                const saveResult = this.saveData();
                
                if (saveResult) {
                    this.hasUnsavedChanges = false;
                    if (this.showNotification) {
                        this.showNotification('✅ Изменения успешно сохранены!', 'success');
                    }
                    if (this.safeRefresh) {
                        this.safeRefresh();
                    }
                } else {
                    if (this.showNotification) {
                        this.showNotification('❌ Ошибка сохранения', 'error');
                    }
                }
                
            } catch (error) {
                console.error('❌ Save changes error:', error);
                if (this.showNotification) {
                    this.showNotification('❌ Ошибка: ' + error.message, 'error');
                }
            }
        };
    }
    
    console.log('✅ Editor saving patched successfully');
}

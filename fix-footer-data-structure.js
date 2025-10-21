// Fix footer data structure and saving
function fixFooterDataStructure() {
    console.log('🔧 Fixing footer data structure...');
    
    // Override the editor's save method for footer section
    if (window.editor && window.editor.saveChanges) {
        const originalSave = window.editor.saveChanges;
        
        window.editor.saveChanges = function() {
            if (!this.currentSection) return;

            try {
                var formData = {};
                document.querySelectorAll('#content-editor [data-field]').forEach(function(input) {
                    var fieldId = input.getAttribute('data-field');
                    formData[fieldId] = input.value;
                });

                console.log('💾 Saving data for section:', this.currentSection.id);
                console.log('📝 Form data:', formData);

                // SPECIAL HANDLING FOR FOOTER
                if (this.currentSection.id === 'footer') {
                    // Ensure footer data structure is correct
                    if (!this.currentData.footer) {
                        this.currentData.footer = {};
                    }
                    
                    // Save description to footer
                    if (formData.description) {
                        this.currentData.footer.description = formData.description;
                        console.log('✅ Footer description saved:', formData.description);
                    }
                    
                    // Save copyright to footer  
                    if (formData.copyright) {
                        this.currentData.footer.copyright = formData.copyright;
                    }
                    
                    // Also save to content.footer for compatibility
                    if (!this.currentData.content.footer) {
                        this.currentData.content.footer = {};
                    }
                    if (formData.description) {
                        this.currentData.content.footer.description = formData.description;
                    }
                    if (formData.copyright) {
                        this.currentData.content.footer.copyright = formData.copyright;
                    }
                } else {
                    // Normal sections go to content
                    if (!this.currentData.content[this.currentSection.id]) {
                        this.currentData.content[this.currentSection.id] = {};
                    }
                    Object.keys(formData).forEach(function(fieldId) {
                        this.currentData.content[this.currentSection.id][fieldId] = formData[fieldId];
                    }.bind(this));
                }

                // Update section name if changed
                if (formData.name && formData.name !== this.currentSection.name) {
                    this.currentSection.name = formData.name;
                    this.loadSectionsList();
                }

                this.saveData();
                this.hasUnsavedChanges = false;
                this.showNotification('Изменения сохранены успешно!', 'success');
                
                // FORCE UPDATE FOOTER DISPLAY
                if (this.currentSection.id === 'footer' && formData.description) {
                    console.log('🔄 Force updating footer display...');
                    updateFooterDisplay(formData.description);
                }
                
                this.safeRefresh();
                
            } catch (error) {
                console.error('Ошибка сохранения:', error);
                this.showNotification('Ошибка сохранения: ' + error.message, 'error');
            }
        };
        
        console.log('✅ Footer data structure save patched');
    }
    
    // Function to update footer display
    window.updateFooterDisplay = function(description) {
        console.log('🎯 Updating footer display with:', description);
        
        const firstFooterSection = document.querySelector('.footer-section');
        if (!firstFooterSection) {
            console.log('❌ Footer section not found');
            return;
        }
        
        const firstParagraph = firstFooterSection.querySelector('p');
        if (!firstParagraph) {
            console.log('❌ Footer paragraph not found');
            return;
        }
        
        firstParagraph.textContent = description;
        console.log('✅ Footer paragraph updated');
        
        // Also update in preview iframe
        const previewFrame = document.getElementById('preview-frame');
        if (previewFrame && previewFrame.contentWindow) {
            try {
                const iframeDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
                const iframeFooter = iframeDoc.querySelector('.footer-section p');
                if (iframeFooter) {
                    iframeFooter.textContent = description;
                    console.log('✅ Footer updated in preview');
                }
            } catch (e) {
                // Cross-origin safety
            }
        }
    };
    
    // Patch content updater to handle footer
    if (window.contentUpdater && window.contentUpdater.applyContentChanges) {
        const originalApply = window.contentUpdater.applyContentChanges;
        window.contentUpdater.applyContentChanges = function(content) {
            originalApply.call(this, content);
            
            // Update footer from content data
            if (content && content.footer && content.footer.description) {
                updateFooterDisplay(content.footer.description);
            }
        };
        console.log('✅ Content updater patched for footer');
    }
    
    // Initial update on page load
    setTimeout(() => {
        if (window.dataManager) {
            const data = window.dataManager.getData();
            if (data && data.footer && data.footer.description) {
                updateFooterDisplay(data.footer.description);
            }
        }
    }, 1000);
    
    console.log('✅ Footer data structure fix applied');
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixFooterDataStructure);
} else {
    fixFooterDataStructure();
}

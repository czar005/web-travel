// Fix footer description not saving from editor
function fixFooterDescription() {
    console.log('🔧 Fixing footer description save...');
    
    // Patch the editor save method to include footer description
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

                // Save footer description specifically
                if (this.currentSection.id === 'footer') {
                    if (!this.currentData.footer) this.currentData.footer = {};
                    
                    // Save description field
                    if (formData.description) {
                        this.currentData.footer.description = formData.description;
                        console.log('�� Saving footer description:', formData.description);
                    }
                    
                    // Save copyright field
                    if (formData.copyright) {
                        this.currentData.footer.copyright = formData.copyright;
                    }
                } else {
                    // For other sections
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
                this.safeRefresh();
                
                // Force update footer display
                setTimeout(() => {
                    if (this.currentSection.id === 'footer' && formData.description) {
                        updateFooterDisplay(formData.description);
                    }
                }, 500);
                
            } catch (error) {
                console.error('Ошибка сохранения:', error);
                this.showNotification('Ошибка сохранения: ' + error.message, 'error');
            }
        };
        
        console.log('✅ Editor save method patched for footer');
    }
    
    // Function to update footer display immediately
    window.updateFooterDisplay = function(description) {
        const footerDesc = document.querySelector('.footer-section:first-child p');
        if (footerDesc) {
            footerDesc.textContent = description;
            console.log('🔄 Footer display updated:', description);
        }
        
        // Also update in preview iframe
        const previewFrame = document.getElementById('preview-frame');
        if (previewFrame && previewFrame.contentWindow) {
            try {
                const iframeDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
                const iframeFooter = iframeDoc.querySelector('.footer-section:first-child p');
                if (iframeFooter) {
                    iframeFooter.textContent = description;
                }
            } catch (e) {
                // Cross-origin safety
            }
        }
    };
    
    // Patch content updater to handle footer description
    if (window.contentUpdater && window.contentUpdater.applyContentChanges) {
        const originalApply = window.contentUpdater.applyContentChanges;
        
        window.contentUpdater.applyContentChanges = function(content) {
            originalApply.call(this, content);
            
            // Specifically handle footer description
            if (content && content.footer && content.footer.description) {
                updateFooterDisplay(content.footer.description);
            }
        };
        
        console.log('✅ Content updater patched for footer');
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixFooterDescription);
} else {
    fixFooterDescription();
}

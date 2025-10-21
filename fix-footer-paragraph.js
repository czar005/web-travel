// Fix empty footer paragraph
function fixFooterParagraph() {
    console.log('🔧 Fixing empty footer paragraph...');
    
    // Function to update footer paragraph
    function updateFooterParagraph(description) {
        // Try different selectors to find the correct paragraph
        const selectors = [
            '.footer-section:first-child p',
            '.footer-section p:first-child',
            '.footer-content .footer-section p',
            '.footer .footer-section p'
        ];
        
        let footerParagraph = null;
        for (const selector of selectors) {
            footerParagraph = document.querySelector(selector);
            if (footerParagraph && footerParagraph.textContent !== undefined) {
                console.log('✅ Found footer paragraph with selector:', selector);
                break;
            }
        }
        
        if (footerParagraph) {
            footerParagraph.textContent = description || 'Ваш надежный партнер в мире путешествий.';
            console.log('🔄 Footer paragraph updated:', description);
        } else {
            console.log('❌ Could not find footer paragraph element');
            // Try to find by content structure
            const footerSections = document.querySelectorAll('.footer-section');
            if (footerSections.length > 0) {
                const firstSection = footerSections[0];
                const paragraphs = firstSection.querySelectorAll('p');
                if (paragraphs.length > 0) {
                    paragraphs[0].textContent = description || 'Ваш надежный партнер в мире путешествий.';
                    console.log('✅ Fixed footer paragraph via structure');
                }
            }
        }
    }
    
    // Update footer from data
    function updateFooterFromData() {
        let description = 'Ваш надежный партнер в мире путешествий.';
        
        // Try to get from dataManager
        if (window.dataManager) {
            const data = window.dataManager.getData();
            if (data && data.footer && data.footer.description) {
                description = data.footer.description;
            }
        }
        
        // Try localStorage as fallback
        try {
            const localData = localStorage.getItem('worldtravel_data');
            if (localData) {
                const data = JSON.parse(localData);
                if (data.footer && data.footer.description) {
                    description = data.footer.description;
                }
            }
        } catch (e) {
            console.log('⚠️ Could not read from localStorage');
        }
        
        updateFooterParagraph(description);
    }
    
    // Patch content updater
    if (window.contentUpdater && window.contentUpdater.applyContentChanges) {
        const originalApply = window.contentUpdater.applyContentChanges;
        window.contentUpdater.applyContentChanges = function(content) {
            originalApply.call(this, content);
            if (content && content.footer && content.footer.description) {
                updateFooterParagraph(content.footer.description);
            }
        };
    }
    
    // Patch editor save
    if (window.editor && window.editor.saveChanges) {
        const originalSave = window.editor.saveChanges;
        window.editor.saveChanges = function() {
            const result = originalSave.call(this);
            
            // Update footer after save
            setTimeout(() => {
                if (this.currentSection && this.currentSection.id === 'footer') {
                    const descriptionInput = document.querySelector('#content-editor [data-field="description"]');
                    if (descriptionInput && descriptionInput.value) {
                        updateFooterParagraph(descriptionInput.value);
                    }
                }
            }, 300);
            
            return result;
        };
    }
    
    // Apply immediately
    updateFooterFromData();
    
    // Also update on load
    setTimeout(updateFooterFromData, 1000);
    
    console.log('✅ Footer paragraph fix applied');
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixFooterParagraph);
} else {
    fixFooterParagraph();
}

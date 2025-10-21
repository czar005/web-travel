// Fix footer paragraph update logic
function fixFooterUpdateLogic() {
    console.log('🔧 Fixing footer update logic...');
    
    // Function to update the footer paragraph
    function updateFooterParagraph(description) {
        // Find the first footer section and its first paragraph
        const firstFooterSection = document.querySelector('.footer-section');
        if (!firstFooterSection) {
            console.log('❌ No footer section found');
            return;
        }
        
        const firstParagraph = firstFooterSection.querySelector('p');
        if (!firstParagraph) {
            console.log('❌ No paragraph found in footer section');
            return;
        }
        
        // Update the paragraph text
        firstParagraph.textContent = description;
        console.log('✅ Footer paragraph updated:', description);
    }
    
    // Get description from editor data
    function getFooterDescription() {
        // Try to get from current editor data
        if (window.editor && window.editor.currentData) {
            const data = window.editor.currentData;
            if (data.footer && data.footer.description) {
                return data.footer.description;
            }
            if (data.content && data.content.footer && data.content.footer.description) {
                return data.content.footer.description;
            }
        }
        
        // Try to get from saved data
        if (window.dataManager) {
            const data = window.dataManager.getData();
            if (data && data.footer && data.footer.description) {
                return data.footer.description;
            }
        }
        
        // Try localStorage
        try {
            const localData = localStorage.getItem('worldtravel_data');
            if (localData) {
                const data = JSON.parse(localData);
                if (data && data.footer && data.footer.description) {
                    return data.footer.description;
                }
            }
        } catch (e) {
            console.log('⚠️ Could not read from localStorage');
        }
        
        return 'Ваш надежный партнер в мире путешествий.';
    }
    
    // Update footer when editor saves
    if (window.editor && window.editor.saveChanges) {
        const originalSave = window.editor.saveChanges;
        window.editor.saveChanges = function() {
            // Call original save
            const result = originalSave.call(this);
            
            // Update footer paragraph after save
            setTimeout(() => {
                if (this.currentSection && this.currentSection.id === 'footer') {
                    const descriptionInput = document.querySelector('#content-editor [data-field="description"]');
                    if (descriptionInput && descriptionInput.value) {
                        updateFooterParagraph(descriptionInput.value);
                    }
                }
            }, 100);
            
            return result;
        };
        console.log('✅ Editor save method patched');
    }
    
    // Also update when content updater runs
    if (window.contentUpdater && window.contentUpdater.applyContentChanges) {
        const originalApply = window.contentUpdater.applyContentChanges;
        window.contentUpdater.applyContentChanges = function(content) {
            originalApply.call(this, content);
            
            if (content && content.footer && content.footer.description) {
                updateFooterParagraph(content.footer.description);
            }
        };
        console.log('✅ Content updater patched');
    }
    
    // Initial update
    setTimeout(() => {
        const description = getFooterDescription();
        updateFooterParagraph(description);
    }, 500);
    
    console.log('✅ Footer update logic fixed');
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixFooterUpdateLogic);
} else {
    fixFooterUpdateLogic();
}

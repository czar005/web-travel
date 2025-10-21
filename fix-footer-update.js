// Fix footer content update
function fixFooterUpdate() {
    console.log('🔧 Fixing footer content update...');
    
    // Patch the content updater to handle footer properly
    if (window.contentUpdater && window.contentUpdater.applyContentChanges) {
        const originalApplyContent = window.contentUpdater.applyContentChanges;
        
        window.contentUpdater.applyContentChanges = function(content) {
            // Call original method first
            originalApplyContent.call(this, content);
            
            // Specifically handle footer description
            if (content && content.footer && content.footer.description) {
                const footerDesc = document.querySelector('.footer-section:first-child p');
                if (footerDesc && footerDesc.textContent !== content.footer.description) {
                    footerDesc.textContent = content.footer.description;
                    console.log('✅ Footer description updated:', content.footer.description);
                }
            }
        };
        
        console.log('✅ Footer update patched');
    }
    
    // Also patch data manager if exists
    if (window.dataManager && window.dataManager.setData) {
        const originalSetData = window.dataManager.setData;
        
        window.dataManager.setData = function(data) {
            // Call original method
            originalSetData.call(this, data);
            
            // Update footer immediately
            if (data && data.footer && data.footer.description) {
                setTimeout(() => {
                    const footerDesc = document.querySelector('.footer-section:first-child p');
                    if (footerDesc) {
                        footerDesc.textContent = data.footer.description;
                    }
                }, 100);
            }
        };
        
        console.log('✅ Data manager footer update patched');
    }
    
    // Direct update function
    window.updateFooterContent = function(description) {
        const footerDesc = document.querySelector('.footer-section:first-child p');
        if (footerDesc) {
            footerDesc.textContent = description;
            console.log('🔄 Footer updated directly:', description);
        }
    };
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixFooterUpdate);
} else {
    fixFooterUpdate();
}

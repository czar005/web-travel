// Force footer update on page load
function forceFooterUpdate() {
    console.log('🔄 Force updating footer...');
    
    // Wait for data to be available
    const checkData = () => {
        if (window.dataManager) {
            const data = window.dataManager.getData();
            if (data && data.footer && data.footer.description) {
                const footerDesc = document.querySelector('.footer-section:first-child p');
                if (footerDesc && (!footerDesc.textContent || footerDesc.textContent.trim() === '')) {
                    footerDesc.textContent = data.footer.description;
                    console.log('✅ Force updated footer description:', data.footer.description);
                }
            }
        } else {
            setTimeout(checkData, 100);
        }
    };
    
    checkData();
    
    // Also check localStorage directly
    try {
        const localData = localStorage.getItem('worldtravel_data');
        if (localData) {
            const data = JSON.parse(localData);
            if (data.footer && data.footer.description) {
                const footerDesc = document.querySelector('.footer-section:first-child p');
                if (footerDesc) {
                    footerDesc.textContent = data.footer.description;
                    console.log('✅ Footer updated from localStorage:', data.footer.description);
                }
            }
        }
    } catch (e) {
        console.log('⚠️ Could not read footer from localStorage');
    }
}

// Apply force update
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', forceFooterUpdate);
} else {
    forceFooterUpdate();
}

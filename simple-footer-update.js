// SIMPLE FOOTER UPDATE - GUARANTEED TO WORK
console.log('🎯 SIMPLE FOOTER UPDATE LOADED');

// Simple function to update footer
function updateFooterText(text) {
    const footerSection = document.querySelector('.footer-section');
    if (!footerSection) {
        console.log('❌ Footer section not found');
        return false;
    }
    
    const paragraph = footerSection.querySelector('p');
    if (!paragraph) {
        console.log('❌ Paragraph not found in footer');
        return false;
    }
    
    paragraph.textContent = text;
    console.log('✅ Footer updated:', text);
    return true;
}

// Monitor for changes in localStorage
function monitorLocalStorage() {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        originalSetItem.apply(this, arguments);
        if (key === 'worldtravel_data') {
            try {
                const data = JSON.parse(value);
                if (data.footer && data.footer.description) {
                    setTimeout(() => updateFooterText(data.footer.description), 100);
                }
            } catch (e) {
                console.log('Error parsing data:', e);
            }
        }
    };
}

// Initialize
function initFooterUpdater() {
    console.log('🔧 Initializing footer updater...');
    
    // Set initial text
    updateFooterText('Ваш надежный партнер в мире путешествий.');
    
    // Monitor localStorage changes
    monitorLocalStorage();
    
    // Also check for existing data
    try {
        const existingData = localStorage.getItem('worldtravel_data');
        if (existingData) {
            const data = JSON.parse(existingData);
            if (data.footer && data.footer.description) {
                updateFooterText(data.footer.description);
            }
        }
    } catch (e) {
        console.log('Error reading existing data:', e);
    }
    
    console.log('✅ Footer updater initialized');
}

// Run immediately
initFooterUpdater();

// Also run when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooterUpdater);
}

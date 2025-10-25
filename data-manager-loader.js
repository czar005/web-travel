// Simple Data Manager loader to prevent errors
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Loading Data Manager...');
    
    // Wait for data manager to load
    const waitForDataManager = setInterval(() => {
        if (window.dataManager) {
            clearInterval(waitForDataManager);
            console.log('✅ Data Manager loaded');
            
            // If loadDestinations exists, call it
            if (typeof window.loadDestinations === 'function') {
                setTimeout(window.loadDestinations, 100);
            }
        }
    }, 100);
    
    // Timeout after 5 seconds
    setTimeout(() => {
        clearInterval(waitForDataManager);
        if (!window.dataManager) {
            console.warn('⚠️ Data Manager not loaded, creating empty fallback');
            window.dataManager = {
                getCountries: () => [],
                getAllTours: () => [],
                getData: () => ({})
            };
        }
    }, 5000);
});

// Force refresh data to ensure exact match
function forceRefreshData() {
    console.log('🔄 Force refreshing data...');
    
    if (window.dataManager) {
        const data = window.dataManager.getData();
        if (data) {
            // Trigger data update event
            window.dispatchEvent(new CustomEvent('dataUpdated', {
                detail: { data: data, force: true }
            }));
        }
    }
}

// Force refresh on load and periodically
setTimeout(forceRefreshData, 500);
setTimeout(forceRefreshData, 2000);
setTimeout(forceRefreshData, 5000);

// Also refresh when coming back to the page
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        setTimeout(forceRefreshData, 100);
    }
});

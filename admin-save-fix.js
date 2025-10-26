// Simple admin save fix - no recursion
if (window.dataManager && window.dataManager.setData) {
    var originalSetData = window.dataManager.setData;
    window.dataManager.setData = function(data) {
        // Save to localStorage without triggering events
        localStorage.setItem('worldtravel_data', JSON.stringify(data));
        console.log('✅ Admin data saved to localStorage');
        return originalSetData ? originalSetData.call(this, data) : true;
    };
}

// Admin simple save - no events, no recursion
console.log('✅ ADMIN SIMPLE SAVE LOADED');

// Override dataManager setData to prevent recursion
if (window.dataManager && window.dataManager.setData) {
    var originalSetData = window.dataManager.setData;
    window.dataManager.setData = function(data) {
        // Direct save to localStorage without events
        localStorage.setItem('worldtravel_data', JSON.stringify(data));
        console.log('💾 Admin data saved directly to localStorage');
        
        // Call original without events if it exists
        if (originalSetData) {
            try {
                // Temporarily disable event dispatching
                var originalDispatch = window.dispatchEvent;
                window.dispatchEvent = function() { return true; };
                var result = originalSetData.call(this, data);
                window.dispatchEvent = originalDispatch;
                return result;
            } catch(e) {
                return true;
            }
        }
        return true;
    };
}

// Also patch update methods
if (window.dataManager && window.dataManager.updateContacts) {
    var originalUpdateContacts = window.dataManager.updateContacts;
    window.dataManager.updateContacts = function(contacts) {
        var data = window.dataManager.getData();
        if (!data) data = {};
        data.contacts = contacts;
        data.lastUpdate = new Date().toISOString();
        return window.dataManager.setData(data);
    };
}

// Fix admin data saving
console.log('🔧 Fixing admin data saving...');

// Override admin save methods if they exist
function patchAdminSaving() {
    // Patch dataManager if it exists
    if (window.dataManager && window.dataManager.setData) {
        const originalSetData = window.dataManager.setData;
        window.dataManager.setData = function(data) {
            console.log('💾 Admin saving data...');
            
            // Ensure data structure
            if (!data.lastUpdate) {
                data.lastUpdate = new Date().toISOString();
            }
            
            // Save to localStorage
            localStorage.setItem('worldtravel_data', JSON.stringify(data));
            
            // Also save to sessionStorage for redundancy
            sessionStorage.setItem('worldtravel_data', JSON.stringify(data));
            
            console.log('✅ Admin data saved to storage');
            
            // Trigger sync on main page
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'worldtravel_data',
                newValue: JSON.stringify(data),
                oldValue: localStorage.getItem('worldtravel_data'),
                storageArea: localStorage
            }));
            
            return originalSetData ? originalSetData.call(this, data) : true;
        };
    }
    
    // Listen for admin save events
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'admin_save') {
            console.log('📨 Admin save message received');
            localStorage.setItem('worldtravel_data', JSON.stringify(event.data.data));
        }
    });
}

// Wait for admin to load
setTimeout(patchAdminSaving, 1000);

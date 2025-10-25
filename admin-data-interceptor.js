// Admin data interceptor - ensures admin data reaches main page
(function() {
    'use strict';
    
    console.log('🎯 Admin data interceptor loaded');
    
    // Method 1: Override dataManager in admin
    if (window.dataManager) {
        const originalSetData = window.dataManager.setData;
        window.dataManager.setData = function(data) {
            console.log('💾 ADMIN: DataManager.setData called');
            
            // Ensure proper data structure
            if (!data.lastUpdate) {
                data.lastUpdate = new Date().toISOString();
            }
            
            // Convert to string for storage
            const dataString = JSON.stringify(data);
            
            // Save to localStorage (main storage)
            localStorage.setItem('worldtravel_data', dataString);
            console.log('✅ ADMIN: Data saved to localStorage, size:', dataString.length);
            
            // Also save to sessionStorage as backup
            sessionStorage.setItem('worldtravel_data', dataString);
            
            // Trigger storage event for main page
            const storageEvent = new StorageEvent('storage', {
                key: 'worldtravel_data',
                newValue: dataString,
                oldValue: localStorage.getItem('worldtravel_data'),
                url: window.location.href,
                storageArea: localStorage
            });
            window.dispatchEvent(storageEvent);
            console.log('📡 ADMIN: Storage event dispatched');
            
            // Call original method if it exists
            if (originalSetData) {
                return originalSetData.call(this, data);
            }
            
            return true;
        };
        
        // Also override updateContacts, updateSettings etc.
        if (window.dataManager.updateContacts) {
            const originalUpdateContacts = window.dataManager.updateContacts;
            window.dataManager.updateContacts = function(contacts) {
                console.log('📞 ADMIN: updateContacts called', contacts);
                
                // Get current data
                let currentData = window.dataManager.getData();
                if (!currentData) currentData = {};
                
                // Update contacts
                currentData.contacts = contacts;
                currentData.lastUpdate = new Date().toISOString();
                
                // Save through our interceptor
                return window.dataManager.setData(currentData);
            };
        }
    }
    
    // Method 2: Direct save function for admin
    window.saveAdminData = function(data) {
        console.log('💾 ADMIN: Direct save called');
        
        if (!data.lastUpdate) {
            data.lastUpdate = new Date().toISOString();
        }
        
        const dataString = JSON.stringify(data);
        localStorage.setItem('worldtravel_data', dataString);
        
        // Force sync on main page
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'worldtravel_data', 
            newValue: dataString,
            oldValue: localStorage.getItem('worldtravel_data'),
            storageArea: localStorage
        }));
        
        console.log('✅ ADMIN: Direct save completed');
        return true;
    };
    
    // Method 3: Monitor form submissions in admin
    document.addEventListener('submit', function(e) {
        console.log('📝 ADMIN: Form submitted', e.target);
    });
    
    console.log('✅ Admin data interceptor ready');
})();

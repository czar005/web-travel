// Data sync fix - ensures admin changes appear on main page
(function() {
    'use strict';
    
    console.log('🔧 Data sync fix loaded');
    
    // Fix for data synchronization
    function initializeDataSync() {
        // Wait for data manager
        const checkDataManager = setInterval(() => {
            if (window.dataManager) {
                clearInterval(checkDataManager);
                setupDataSync();
            }
        }, 100);
        
        setTimeout(() => clearInterval(checkDataManager), 5000);
    }
    
    function setupDataSync() {
        // Override dataManager methods to trigger updates
        const originalSetData = window.dataManager.setData;
        if (originalSetData) {
            window.dataManager.setData = function(data) {
                const result = originalSetData.call(this, data);
                triggerContentUpdate(data);
                return result;
            };
        }
        
        // Listen for storage changes (for admin updates)
        window.addEventListener('storage', function(e) {
            if (e.key === 'worldtravel_data') {
                try {
                    const newData = JSON.parse(e.newValue);
                    triggerContentUpdate(newData);
                } catch (error) {
                    console.log('Storage update error:', error);
                }
            }
        });
        
        // Also check for data updates periodically
        setInterval(checkForDataUpdates, 2000);
        
        console.log('✅ Data sync setup complete');
    }
    
    function triggerContentUpdate(data) {
        // Update exact content if available
        if (window.exactContentUpdater && window.exactContentUpdater.applyExactChanges) {
            window.exactContentUpdater.applyExactChanges(data);
        }
        
        // Update destinations if available
        if (window.loadDestinations && data && data.countries) {
            setTimeout(window.loadDestinations, 100);
        }
        
        // Update navigation
        if (window.updateExactNavigation && data && data.content) {
            window.updateExactNavigation(data.content);
        }
        
        console.log('🔄 Content updated from admin changes');
    }
    
    function checkForDataUpdates() {
        try {
            const storedData = localStorage.getItem('worldtravel_data');
            if (storedData) {
                const data = JSON.parse(storedData);
                if (data && data.lastUpdate) {
                    // Check if data is newer than what we have
                    if (!window.lastDataUpdate || data.lastUpdate > window.lastDataUpdate) {
                        window.lastDataUpdate = data.lastUpdate;
                        triggerContentUpdate(data);
                    }
                }
            }
        } catch (error) {
            // Silent error
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeDataSync);
    } else {
        initializeDataSync();
    }
})();

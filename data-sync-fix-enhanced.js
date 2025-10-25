// Enhanced data sync fix - uses complete content updater
(function() {
    'use strict';
    
    console.log('🔧 Enhanced data sync fix loaded');
    
    function initializeDataSync() {
        // Wait for complete content updater
        const checkUpdater = setInterval(() => {
            if (window.updateAllContent) {
                clearInterval(checkUpdater);
                setupEnhancedSync();
            }
        }, 100);
        
        setTimeout(() => clearInterval(checkUpdater), 5000);
    }
    
    function setupEnhancedSync() {
        // Override dataManager methods
        if (window.dataManager && window.dataManager.setData) {
            const originalSetData = window.dataManager.setData;
            window.dataManager.setData = function(data) {
                const result = originalSetData.call(this, data);
                window.updateAllContent(data);
                return result;
            };
        }
        
        // Enhanced storage listener
        window.addEventListener('storage', function(e) {
            if (e.key === 'worldtravel_data' && e.newValue) {
                try {
                    const newData = JSON.parse(e.newValue);
                    window.updateAllContent(newData);
                } catch (error) {
                    console.log('Storage sync error:', error);
                }
            }
        });
        
        // Real-time updates every 500ms
        setInterval(checkForRealTimeUpdates, 500);
        
        console.log('✅ Enhanced data sync setup complete');
    }
    
    function checkForRealTimeUpdates() {
        try {
            const storedData = localStorage.getItem('worldtravel_data');
            if (storedData) {
                const data = JSON.parse(storedData);
                if (data && data.lastUpdate) {
                    if (!window.lastEnhancedUpdate || data.lastUpdate > window.lastEnhancedUpdate) {
                        window.lastEnhancedUpdate = data.lastUpdate;
                        window.updateAllContent(data);
                    }
                }
            }
        } catch (error) {
            // Silent error
        }
    }
    
    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeDataSync);
    } else {
        initializeDataSync();
    }
})();

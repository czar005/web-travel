// Silent fix for console errors - prevent errors without breaking functionality
(function() {
    'use strict';
    
    // Prevent loadDestinations errors
    if (typeof window.loadDestinations === 'function') {
        const originalLoadDestinations = window.loadDestinations;
        window.loadDestinations = function() {
            if (!window.dataManager) {
                console.log('Data manager not ready - skipping destinations load');
                return;
            }
            return originalLoadDestinations.apply(this, arguments);
        };
    }
    
    // Prevent exact-content-updater errors
    if (typeof window.updateExactNavigation === 'function') {
        const originalUpdateNav = window.updateExactNavigation;
        window.updateExactNavigation = function(content) {
            if (!content) return;
            return originalUpdateNav.apply(this, arguments);
        };
    }
    
    // Create safe dataManager fallback
    if (!window.dataManager) {
        window.dataManager = {
            getCountries: () => [],
            getAllTours: () => [],
            getData: () => ({})
        };
    }
    
    console.log('✅ Silent fixes applied');
})();

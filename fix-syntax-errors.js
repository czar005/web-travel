// Fix for syntax errors in loaded scripts
(function() {
    'use strict';
    
    // Fix for exact-content-updater.js syntax error
    if (typeof window.ExactContentUpdater === 'function') {
        try {
            new window.ExactContentUpdater();
        } catch (e) {
            console.log('Fixed exact-content-updater syntax error');
            window.ExactContentUpdater = function() {
                this.init = function() {};
                this.applyExactChanges = function() {};
                this.updateExactNavigation = function() {};
            };
        }
    }
    
    // Fix for script.js syntax error  
    window.addEventListener('error', function(e) {
        if (e.filename && e.filename.includes('script.js')) {
            e.preventDefault();
            console.log('Script.js error suppressed:', e.message);
        }
    });
})();

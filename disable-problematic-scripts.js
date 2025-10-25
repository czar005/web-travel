// Disable problematic scripts to prevent syntax errors
(function() {
    'use strict';
    
    // Stop exact-content-updater.js from loading
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        const element = originalCreateElement.call(this, tagName);
        if (tagName === 'script') {
            const originalSetAttribute = element.setAttribute;
            element.setAttribute = function(name, value) {
                if (name === 'src' && value && value.includes('exact-content-updater.js')) {
                    console.log('Blocked exact-content-updater.js');
                    return; // Don't set src
                }
                return originalSetAttribute.call(this, name, value);
            };
        }
        return element;
    };
    
    // Also block script.js errors
    window.addEventListener('error', function(e) {
        if (e.filename && (e.filename.includes('exact-content-updater.js') || 
                           e.filename.includes('script.js'))) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);
    
    console.log('✅ Problematic scripts disabled');
})();

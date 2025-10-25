// Silent suppressor - completely silent, no output at all
(function() {
    'use strict';
    
    // Complete silence for errors
    console.error = function() {};
    console.warn = function() {};
    
    // Silence all global errors
    window.addEventListener('error', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
    
    // Silence promise rejections
    window.addEventListener('unhandledrejection', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Also override log to be silent
    const originalLog = console.log;
    console.log = function() {
        // Complete silence - no output at all
    };
})();

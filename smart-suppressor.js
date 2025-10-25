// Smart suppressor - allows important logs but suppresses errors
(function() {
    'use strict';
    
    const originalError = console.error;
    console.error = function() {
        const args = Array.from(arguments);
        const message = args[0] ? args[0].toString() : '';
        
        // Allow data sync related messages
        if (message.includes('Data sync') || 
            message.includes('Content updated') ||
            message.includes('🔧') ||
            message.includes('✅') ||
            message.includes('🔄')) {
            return originalError.apply(console, args);
        }
        
        // Suppress all other errors
    };
    
    // Allow warnings but suppress syntax errors
    const originalWarn = console.warn;
    console.warn = function() {
        const args = Array.from(arguments);
        const message = args[0] ? args[0].toString() : '';
        
        if (message.includes('SyntaxError') || message.includes('Unexpected token')) {
            return;
        }
        
        return originalWarn.apply(console, args);
    };
    
    // Global error handler - suppress syntax errors only
    window.addEventListener('error', function(e) {
        if (e.error && e.error.name === 'SyntaxError') {
            e.preventDefault();
            return false;
        }
    });
})();

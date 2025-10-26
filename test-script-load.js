// Test script load
console.log('✅ TEST SCRIPT LOADED - scripts are working');

// Test function
window.testScript = function() {
    console.log('✅ testScript() called successfully');
    return 'Scripts are working!';
};

// Check if bulletproof sync loaded
setTimeout(() => {
    if (window.forceBulletproofSync) {
        console.log('✅ bulletproof-sync.js loaded correctly');
    } else {
        console.log('❌ bulletproof-sync.js NOT loaded');
    }
}, 1000);

// Script to reload all scripts
console.log('🔄 Reloading scripts...');

// Remove existing scripts
document.querySelectorAll('script[src]').forEach(script => {
    if (script.src.includes('simple-sync.js') || script.src.includes('data-manager')) {
        script.remove();
    }
});

// Reload scripts
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Reload in order
setTimeout(() => {
    loadScript('data-manager-fixed.js')
        .then(() => {
            console.log('✅ data-manager-fixed.js reloaded');
            return loadScript('simple-sync.js');
        })
        .then(() => {
            console.log('✅ simple-sync.js reloaded');
            console.log('✅ All scripts reloaded successfully');
        })
        .catch(error => {
            console.log('❌ Script reload error:', error);
        });
}, 100);

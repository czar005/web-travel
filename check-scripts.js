// Check all loaded scripts
console.log('�� Checking loaded scripts...');

// List all script elements
const scripts = document.querySelectorAll('script[src]');
console.log('📜 Found ' + scripts.length + ' script tags:');
scripts.forEach((script, i) => {
    console.log(i + 1 + '. ' + script.src);
});

// Check if specific scripts are loaded
const scriptChecks = [
    'data-manager-fixed.js',
    'debug-data-flow.js', 
    'bulletproof-sync.js',
    'test-sync-command.js'
];

scriptChecks.forEach(scriptName => {
    const found = Array.from(scripts).some(s => s.src.includes(scriptName));
    console.log((found ? '✅ ' : '❌ ') + scriptName);
});

// Test function
window.testScriptLoad = function() {
    console.log('✅ testScriptLoad function called!');
    return 'Scripts are loaded!';
};

console.log('✅ check-scripts.js loaded successfully');

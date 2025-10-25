// Debug data flow between admin and main page
console.log='🔍 DEBUG DATA FLOW STARTED';

// Monitor all storage operations
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
    console.log('💾 localStorage.setItem:', key, value ? `length: ${value.length}` : 'null');
    if (key === 'worldtravel_data') {
        console.log('📦 WORLD TRAVEL DATA SAVED:', value ? value.substring(0, 100) + '...' : 'null');
    }
    return originalSetItem.call(this, key, value);
};

const originalGetItem = localStorage.getItem;
localStorage.getItem = function(key) {
    const value = originalGetItem.call(this, key);
    if (key === 'worldtravel_data') {
        console.log('📥 localStorage.getItem:', key, value ? `length: ${value.length}` : 'null');
    }
    return value;
};

// Monitor storage events
window.addEventListener('storage', function(e) {
    console.log('🔄 STORAGE EVENT:', e.key, e.newValue ? `new: ${e.newValue.length}` : 'null', e.oldValue ? `old: ${e.oldValue.length}` : 'null');
});

// Check current data state
setTimeout(() => {
    console.log('=== CURRENT DATA STATE ===');
    const data = localStorage.getItem('worldtravel_data');
    console.log('Data exists:', !!data);
    if (data) {
        try {
            const parsed = JSON.parse(data);
            console.log('Data structure:', Object.keys(parsed));
            console.log('Contacts:', parsed.contacts);
            console.log('Footer:', parsed.footer);
            console.log('Content sections:', parsed.content ? Object.keys(parsed.content) : 'none');
        } catch (e) {
            console.log('Data parsing error:', e);
        }
    }
}, 2000);

// Test function to manually trigger sync
window.debugSync = function() {
    console.log('🔄 MANUAL SYNC TRIGGERED');
    const data = localStorage.getItem('worldtravel_data');
    if (data && window.forceSync) {
        window.forceSync();
    }
};

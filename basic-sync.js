// Basic sync - simple and reliable
console.log('✅ basic-sync.js LOADED');

function basicSync() {
    console.log('🔁 basicSync called');
    
    try {
        const data = localStorage.getItem('worldtravel_data');
        if (!data) {
            console.log('No data found');
            return;
        }
        
        console.log('Data found, length:', data.length);
        
        // Try to parse and apply data
        const parsed = JSON.parse(data);
        console.log('Data parsed successfully');
        
        // Simple test - update page title if available
        if (parsed.settings && parsed.settings.siteTitle) {
            document.title = parsed.settings.siteTitle;
            console.log('Updated page title to:', parsed.settings.siteTitle);
        }
        
    } catch (error) {
        console.log('Sync error:', error);
    }
}

// Start syncing
setInterval(basicSync, 2000);

// Make available globally
window.basicSync = basicSync;

console.log('✅ basic-sync.js READY');

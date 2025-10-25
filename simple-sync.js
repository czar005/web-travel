// Simple sync - fixed version
console.log('🎯 SIMPLE-SYNC.JS LOADED');

function simpleSync() {
    console.log('🔍 Checking for data updates...');
    
    try {
        const data = localStorage.getItem('worldtravel_data');
        console.log('Data in localStorage:', data ? 'EXISTS' : 'MISSING');
        
        if (data) {
            console.log('Data length:', data.length);
            
            try {
                const parsed = JSON.parse(data);
                console.log('Data parsed successfully');
                
                // Simple update test
                if (parsed.settings && parsed.settings.siteTitle) {
                    if (document.title !== parsed.settings.siteTitle) {
                        document.title = parsed.settings.siteTitle;
                        console.log('✅ Updated page title');
                    }
                }
                
            } catch (parseError) {
                console.log('❌ Parse error:', parseError);
            }
        }
    } catch (error) {
        console.log('❌ Sync error:', error);
    }
}

// Start syncing
setInterval(simpleSync, 3000);

// Global functions
window.simpleSync = simpleSync;
window.forceUpdate = simpleSync;

console.log('✅ SIMPLE-SYNC.JS READY');

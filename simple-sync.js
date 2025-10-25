// Simple sync - minimal and reliable
console.log('✅ simple-sync.js LOADED SUCCESSFULLY');

// Simple function to check for data changes
function simpleSync() {
    console.log('Checking for data updates...');
    
    const data = localStorage.getItem('worldtravel_data');
    if (data) {
        console.log('Data found in localStorage:', data.length + ' characters');
        try {
            const parsed = JSON.parse(data);
            console.log('Data parsed successfully');
            
            // Simple test - update page title if available
            if (parsed.settings && parsed.settings.siteTitle) {
                document.title = parsed.settings.siteTitle;
                console.log('Updated page title to:', parsed.settings.siteTitle);
            }
            
            // Update contacts if available
            if (parsed.contacts && parsed.contacts.phone) {
                const elements = document.querySelectorAll('.contact-info .contact-item:nth-child(1) p');
                elements.forEach(el => {
                    if (el.textContent !== parsed.contacts.phone) {
                        el.textContent = parsed.contacts.phone;
                        console.log('Updated phone to:', parsed.contacts.phone);
                    }
                });
            }
            
        } catch (e) {
            console.log('Error parsing data:', e);
        }
    } else {
        console.log('No data found in localStorage');
    }
}

// Start checking
setInterval(simpleSync, 2000);

// Make available globally
window.simpleSync = simpleSync;
window.forceUpdate = simpleSync;

console.log('✅ simple-sync.js READY - use forceUpdate() in console');

// Reliable sync - simple and guaranteed to work
console.log('✅ reliable-sync.js LOADED');

let lastData = '';

function checkForUpdates() {
    try {
        const currentData = localStorage.getItem('worldtravel_data');
        
        // Check if data changed
        if (currentData === lastData) {
            return; // No changes
        }
        
        console.log('🔄 Data changed, updating page...');
        lastData = currentData;
        
        if (!currentData) {
            console.log('📭 No data in storage');
            return;
        }
        
        // Parse data
        const data = JSON.parse(currentData);
        console.log('📊 Applying data:', data);
        
        // APPLY CHANGES TO PAGE
        
        // 1. Update contacts
        if (data.contacts) {
            // Phone
            updateText('.contact-info .contact-item:nth-child(1) p', data.contacts.phone);
            updateText('.footer-section:nth-child(3) p:nth-child(1)', data.contacts.phone);
            
            // Email
            updateText('.contact-info .contact-item:nth-child(2) p', data.contacts.email);
            updateText('.footer-section:nth-child(3) p:nth-child(2)', data.contacts.email);
            
            // Address
            updateText('.contact-info .contact-item:nth-child(3) p', data.contacts.address);
            updateText('.footer-section:nth-child(3) p:nth-child(3)', data.contacts.address);
            
            // Hours
            updateText('.contact-info .contact-item:nth-child(4) p', data.contacts.hours);
            updateText('.footer-section:nth-child(3) p:nth-child(4)', data.contacts.hours);
        }
        
        // 2. Update footer
        if (data.footer) {
            updateText('.footer-section:first-child p', data.footer.description);
            updateHTML('.footer-bottom p', data.footer.copyright);
        }
        
        // 3. Update navigation and content
        if (data.content) {
            // Navigation
            updateText('.nav-links a[href="#about"]', data.content.about?.title);
            updateText('.nav-links a[href="#services"]', data.content.services?.title);
            updateText('.nav-links a[href="#destinations"]', data.content.destinations?.title);
            updateText('.nav-links a[href="#contact"]', data.content.contact?.title);
            
            // Footer navigation
            updateText('.footer-section:nth-child(2) a[href="#about"]', data.content.about?.title);
            updateText('.footer-section:nth-child(2) a[href="#services"]', data.content.services?.title);
            updateText('.footer-section:nth-child(2) a[href="#destinations"]', data.content.destinations?.title);
            updateText('.footer-section:nth-child(2) a[href="#contact"]', data.content.contact?.title);
            
            // Content sections
            updateText('#about .section-title', data.content.about?.title);
            updateText('#services .section-title', data.content.services?.title);
            updateText('#destinations .section-title', data.content.destinations?.title);
            updateText('#contact .section-title', data.content.contact?.title);
            
            // Hero section
            updateText('#home h1', data.content.hero?.title);
            updateText('#home p', data.content.hero?.subtitle);
            
            // About description
            updateText('.about-text p', data.content.about?.description);
            
            // Destinations subtitle
            updateText('.destinations .section-subtitle', data.content.destinations?.subtitle);
        }
        
        console.log('✅ Page updated successfully!');
        
    } catch (error) {
        console.log('❌ Update error:', error);
    }
}

function updateText(selector, value) {
    if (!value) return;
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        if (el.textContent !== value) {
            el.textContent = value;
            console.log('✅ Updated text:', selector, value);
        }
    });
}

function updateHTML(selector, value) {
    if (!value) return;
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        if (el.innerHTML !== value) {
            el.innerHTML = value;
            console.log('✅ Updated HTML:', selector, value);
        }
    });
}

// Start checking for updates every second
setInterval(checkForUpdates, 1000);

// Also check when page becomes visible
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        checkForUpdates();
    }
});

// Check on storage events
window.addEventListener('storage', function(e) {
    if (e.key === 'worldtravel_data') {
        checkForUpdates();
    }
});

// Initial check
setTimeout(checkForUpdates, 2000);

// Make available globally
window.forceUpdate = checkForUpdates;
window.reliableSync = checkForUpdates;

console.log('✅ reliable-sync.js READY - checking for updates every second');

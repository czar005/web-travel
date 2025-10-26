// Safe sync - no recursion, simple polling
console.log('✅ SAFE SYNC LOADED');

var lastData = '';
var isSyncing = false;

function safeSync() {
    if (isSyncing) return;
    isSyncing = true;
    
    try {
        var currentData = localStorage.getItem('worldtravel_data');
        
        if (currentData === lastData) {
            isSyncing = false;
            return;
        }
        
        lastData = currentData;
        
        if (!currentData) {
            isSyncing = false;
            return;
        }
        
        var parsed = JSON.parse(currentData);
        console.log('🔄 Safe sync applying data');
        
        // Apply contacts
        if (parsed.contacts) {
            applyContacts(parsed.contacts);
        }
        
        // Apply footer
        if (parsed.footer) {
            applyFooter(parsed.footer);
        }
        
        // Apply content
        if (parsed.content) {
            applyContent(parsed.content);
        }
        
    } catch(e) {
        console.log('Safe sync error:', e);
    }
    
    isSyncing = false;
}

function applyContacts(contacts) {
    // Phone
    updateText('.contact-info .contact-item:nth-child(1) p', contacts.phone);
    updateText('.footer-section:nth-child(3) p:nth-child(1)', contacts.phone);
    
    // Email
    updateText('.contact-info .contact-item:nth-child(2) p', contacts.email);
    updateText('.footer-section:nth-child(3) p:nth-child(2)', contacts.email);
    
    // Address
    updateText('.contact-info .contact-item:nth-child(3) p', contacts.address);
    updateText('.footer-section:nth-child(3) p:nth-child(3)', contacts.address);
    
    // Hours
    updateText('.contact-info .contact-item:nth-child(4) p', contacts.hours);
    updateText('.footer-section:nth-child(3) p:nth-child(4)', contacts.hours);
}

function applyFooter(footer) {
    updateText('.footer-section:first-child p', footer.description);
    updateHTML('.footer-bottom p', footer.copyright);
}

function applyContent(content) {
    // Navigation
    updateText('.nav-links a[href="#about"]', content.about?.title);
    updateText('.nav-links a[href="#services"]', content.services?.title);
    updateText('.nav-links a[href="#destinations"]', content.destinations?.title);
    updateText('.nav-links a[href="#contact"]', content.contact?.title);
    
    updateText('.footer-section:nth-child(2) a[href="#about"]', content.about?.title);
    updateText('.footer-section:nth-child(2) a[href="#services"]', content.services?.title);
    updateText('.footer-section:nth-child(2) a[href="#destinations"]', content.destinations?.title);
    updateText('.footer-section:nth-child(2) a[href="#contact"]', content.contact?.title);
    
    // Content titles
    updateText('#about .section-title', content.about?.title);
    updateText('#services .section-title', content.services?.title);
    updateText('#destinations .section-title', content.destinations?.title);
    updateText('#contact .section-title', content.contact?.title);
    updateText('#home h1', content.hero?.title);
    updateText('#home p', content.hero?.subtitle);
    updateText('.about-text p', content.about?.description);
    updateText('.destinations .section-subtitle', content.destinations?.subtitle);
}

function updateText(selector, value) {
    if (!value) return;
    var elements = document.querySelectorAll(selector);
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].textContent !== value) {
            elements[i].textContent = value;
        }
    }
}

function updateHTML(selector, value) {
    if (!value) return;
    var elements = document.querySelectorAll(selector);
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].innerHTML !== value) {
            elements[i].innerHTML = value;
        }
    }
}

// Safe polling every 2 seconds
setInterval(safeSync, 2000);

// Initial sync
setTimeout(safeSync, 1000);

console.log('✅ Safe sync ready');

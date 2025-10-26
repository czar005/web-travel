// Minimal sync - absolutely no recursion
console.log('✅ MINIMAL SYNC LOADED');

var lastDataHash = '';

function minimalSync() {
    try {
        var currentData = localStorage.getItem('worldtravel_data');
        if (!currentData) return;
        
        // Simple hash check
        var currentHash = currentData.length + currentData.substring(0, 50);
        if (currentHash === lastDataHash) return;
        
        lastDataHash = currentHash;
        console.log('📥 New data detected');
        
        var parsed = JSON.parse(currentData);
        
        // Apply changes directly without events
        applyDirectChanges(parsed);
        
    } catch(e) {
        console.log('Minimal sync error:', e);
    }
}

function applyDirectChanges(data) {
    // Contacts
    if (data.contacts) {
        setText('.contact-info .contact-item:nth-child(1) p', data.contacts.phone);
        setText('.footer-section:nth-child(3) p:nth-child(1)', data.contacts.phone);
        setText('.contact-info .contact-item:nth-child(2) p', data.contacts.email);
        setText('.footer-section:nth-child(3) p:nth-child(2)', data.contacts.email);
        setText('.contact-info .contact-item:nth-child(3) p', data.contacts.address);
        setText('.footer-section:nth-child(3) p:nth-child(3)', data.contacts.address);
        setText('.contact-info .contact-item:nth-child(4) p', data.contacts.hours);
        setText('.footer-section:nth-child(3) p:nth-child(4)', data.contacts.hours);
    }
    
    // Footer
    if (data.footer) {
        setText('.footer-section:first-child p', data.footer.description);
        setHTML('.footer-bottom p', data.footer.copyright);
    }
    
    // Navigation and content
    if (data.content) {
        // Navigation
        setText('.nav-links a[href="#about"]', data.content.about?.title);
        setText('.nav-links a[href="#services"]', data.content.services?.title);
        setText('.nav-links a[href="#destinations"]', data.content.destinations?.title);
        setText('.nav-links a[href="#contact"]', data.content.contact?.title);
        
        // Footer nav
        setText('.footer-section:nth-child(2) a[href="#about"]', data.content.about?.title);
        setText('.footer-section:nth-child(2) a[href="#services"]', data.content.services?.title);
        setText('.footer-section:nth-child(2) a[href="#destinations"]', data.content.destinations?.title);
        setText('.footer-section:nth-child(2) a[href="#contact"]', data.content.contact?.title);
        
        // Content
        setText('#about .section-title', data.content.about?.title);
        setText('#services .section-title', data.content.services?.title);
        setText('#destinations .section-title', data.content.destinations?.title);
        setText('#contact .section-title', data.content.contact?.title);
        setText('#home h1', data.content.hero?.title);
        setText('#home p', data.content.hero?.subtitle);
        setText('.about-text p', data.content.about?.description);
        setText('.destinations .section-subtitle', data.content.destinations?.subtitle);
    }
    
    console.log('✅ Changes applied');
}

function setText(selector, value) {
    if (!value) return;
    var elements = document.querySelectorAll(selector);
    for (var i = 0; i < elements.length; i++) {
        elements[i].textContent = value;
    }
}

function setHTML(selector, value) {
    if (!value) return;
    var elements = document.querySelectorAll(selector);
    for (var i = 0; i < elements.length; i++) {
        elements[i].innerHTML = value;
    }
}

// Check every 3 seconds - no events, no recursion
setInterval(minimalSync, 3000);
setTimeout(minimalSync, 1000);

console.log('✅ Minimal sync ready - polling every 3 seconds');

// Complete footer fix - makes footer fully editable
(function() {
    'use strict';
    
    console.log('🔧 Footer fix loaded');
    
    function updateFooterFromData() {
        try {
            const data = localStorage.getItem('worldtravel_data');
            if (data) {
                const parsed = JSON.parse(data);
                if (parsed.footer) {
                    applyFooterChanges(parsed.footer);
                }
            }
        } catch (error) {
            console.log('Footer update error:', error);
        }
    }
    
    function applyFooterChanges(footer) {
        // Update footer description
        if (footer.description) {
            const footerSections = document.querySelectorAll('.footer-section');
            if (footerSections.length > 0) {
                const firstSection = footerSections[0];
                const paragraphs = firstSection.querySelectorAll('p');
                if (paragraphs.length > 0) {
                    paragraphs[0].textContent = footer.description;
                    console.log('✅ Footer description updated:', footer.description);
                }
            }
        }
        
        // Update copyright
        if (footer.copyright) {
            const copyrightElements = document.querySelectorAll('.footer-bottom p');
            copyrightElements.forEach(el => {
                el.innerHTML = footer.copyright;
            });
            console.log('✅ Footer copyright updated:', footer.copyright);
        }
    }
    
    // Listen for changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'worldtravel_data') {
            try {
                const data = JSON.parse(e.newValue);
                if (data.footer) {
                    applyFooterChanges(data.footer);
                }
            } catch (error) {
                console.log('Footer storage update error:', error);
            }
        }
    });
    
    // Initial update
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(updateFooterFromData, 100);
    });
    
    // Periodic updates
    setInterval(updateFooterFromData, 2000);
})();

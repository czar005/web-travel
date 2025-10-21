// ULTIMATE FOOTER FIX - CANNOT FAIL
console.log('🚀 ULTIMATE FOOTER FIX LOADED');

// Function that definitely updates footer
function ultimateFooterUpdate() {
    console.log('🔄 Running ultimate footer update...');
    
    // Find ALL footer sections
    const allSections = document.querySelectorAll('.footer-section');
    console.log(`Found ${allSections.length} footer sections`);
    
    // Update the FIRST footer section's FIRST paragraph
    if (allSections.length > 0) {
        const firstSection = allSections[0];
        const paragraphs = firstSection.querySelectorAll('p');
        
        console.log(`Found ${paragraphs.length} paragraphs in first section`);
        
        if (paragraphs.length > 0) {
            const firstParagraph = paragraphs[0];
            
            // Get text from data or use default
            let footerText = 'Ваш надежный партнер в мире путешествий.';
            
            // Try to get from localStorage
            try {
                const saved = localStorage.getItem('worldtravel_data');
                if (saved) {
                    const data = JSON.parse(saved);
                    if (data.footer && data.footer.description) {
                        footerText = data.footer.description;
                        console.log('📁 Using text from data:', footerText);
                    }
                }
            } catch (e) {
                console.log('Using default text');
            }
            
            // UPDATE THE TEXT
            firstParagraph.textContent = footerText;
            console.log('✅ ULTIMATE UPDATE SUCCESS:', footerText);
        } else {
            console.log('❌ No paragraphs found in first section');
        }
    } else {
        console.log('❌ No footer sections found at all');
    }
}

// Run multiple times to be sure
ultimateFooterUpdate();
setTimeout(ultimateFooterUpdate, 100);
setTimeout(ultimateFooterUpdate, 500);
setTimeout(ultimateFooterUpdate, 1000);
setTimeout(ultimateFooterUpdate, 2000);

// Also run when any data changes
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
    originalSetItem.apply(this, arguments);
    if (key === 'worldtravel_data') {
        setTimeout(ultimateFooterUpdate, 100);
    }
};

console.log('🎯 Ultimate footer fix installed - will run repeatedly');

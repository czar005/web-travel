// Force footer fix - will definitely run
console.log('🚀 FORCE FOOTER FIX STARTED');

function forceFooterFix() {
    console.log('🔧 Force fixing footer...');
    
    // Wait a bit for DOM to be fully ready
    setTimeout(() => {
        // Find ALL footer sections and paragraphs
        const footerSections = document.querySelectorAll('.footer-section');
        console.log('📋 Footer sections found:', footerSections.length);
        
        if (footerSections.length === 0) {
            console.log('❌ No footer sections found!');
            return;
        }
        
        // Get the first footer section
        const firstFooterSection = footerSections[0];
        console.log('🎯 First footer section HTML:', firstFooterSection.innerHTML);
        
        // Find ALL paragraphs in first section
        const paragraphs = firstFooterSection.querySelectorAll('p');
        console.log('📝 Paragraphs found in first section:', paragraphs.length);
        
        // Get description from data
        let description = 'Ваш надежный партнер в мире путешествий.';
        
        // Try to get from data
        try {
            // Try window.dataManager
            if (window.dataManager) {
                const data = window.dataManager.getData();
                if (data && data.footer && data.footer.description) {
                    description = data.footer.description;
                    console.log('📁 Got description from dataManager:', description);
                }
            }
            
            // Try localStorage
            const localData = localStorage.getItem('worldtravel_data');
            if (localData) {
                const data = JSON.parse(localData);
                if (data && data.footer && data.footer.description) {
                    description = data.footer.description;
                    console.log('💾 Got description from localStorage:', description);
                }
            }
        } catch (e) {
            console.log('⚠️ Error reading data:', e);
        }
        
        // Update paragraphs
        if (paragraphs.length > 0) {
            // Update the first empty paragraph we find
            let updated = false;
            paragraphs.forEach((p, index) => {
                if (!updated && (p.textContent.trim() === '' || p.textContent.trim() === ' ')) {
                    p.textContent = description;
                    console.log(`✅ Updated paragraph ${index + 1} with:`, description);
                    updated = true;
                }
            });
            
            // If no empty paragraph, update the first one
            if (!updated && paragraphs[0]) {
                paragraphs[0].textContent = description;
                console.log('✅ Updated first paragraph with:', description);
            }
        } else {
            // No paragraphs found - create one
            const newP = document.createElement('p');
            newP.textContent = description;
            firstFooterSection.appendChild(newP);
            console.log('✅ Created new paragraph with:', description);
        }
        
        console.log('🎉 Force footer fix completed!');
    }, 1000);
}

// Run immediately and multiple times to ensure it works
forceFooterFix();

// Also run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', forceFooterFix);
}

// Run again after 3 seconds to catch any dynamic loading
setTimeout(forceFooterFix, 3000);

// Run every 5 seconds for safety
setInterval(forceFooterFix, 5000);

console.log('✅ Force footer fix script loaded');

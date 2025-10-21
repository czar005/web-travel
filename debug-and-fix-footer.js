// Debug and fix footer paragraph
function debugAndFixFooter() {
    console.log('🔍 Debugging footer structure...');
    
    // Debug: log all footer sections and their content
    const footerSections = document.querySelectorAll('.footer-section');
    console.log('📋 Found footer sections:', footerSections.length);
    
    footerSections.forEach((section, index) => {
        console.log(`Section ${index + 1}:`, {
            html: section.innerHTML,
            paragraphs: section.querySelectorAll('p').length,
            h3: section.querySelector('h3')?.textContent
        });
        
        // Find all paragraphs in this section
        const paragraphs = section.querySelectorAll('p');
        paragraphs.forEach((p, pIndex) => {
            console.log(`  Paragraph ${pIndex + 1}:`, {
                text: p.textContent,
                isEmpty: p.textContent.trim() === '',
                selector: getSelector(p)
            });
        });
    });
    
    // Function to get CSS selector for element
    function getSelector(element) {
        if (element.id) return '#' + element.id;
        let selector = element.tagName.toLowerCase();
        if (element.className) {
            selector += '.' + element.className.split(' ')[0];
        }
        return selector;
    }
    
    // Fix: Update the correct paragraph
    function updateFooterDescription(description) {
        console.log('🔄 Updating footer with:', description);
        
        // Strategy 1: First paragraph in first footer-section
        const firstSection = document.querySelector('.footer-section');
        if (firstSection) {
            const paragraphs = firstSection.querySelectorAll('p');
            if (paragraphs.length > 0) {
                // Use the first paragraph that is empty or contains default text
                let targetParagraph = paragraphs[0];
                
                // If first paragraph is empty, use it
                if (targetParagraph.textContent.trim() === '') {
                    targetParagraph.textContent = description;
                    console.log('✅ Updated empty paragraph in first section');
                    return true;
                }
                
                // If there's a second paragraph, try it
                if (paragraphs.length > 1 && paragraphs[1].textContent.trim() === '') {
                    paragraphs[1].textContent = description;
                    console.log('✅ Updated second paragraph in first section');
                    return true;
                }
                
                // Otherwise update the first one
                targetParagraph.textContent = description;
                console.log('✅ Updated first paragraph in first section');
                return true;
            }
        }
        
        // Strategy 2: Create paragraph if it doesn't exist
        if (firstSection && firstSection.querySelectorAll('p').length === 0) {
            const newParagraph = document.createElement('p');
            newParagraph.textContent = description;
            firstSection.appendChild(newParagraph);
            console.log('✅ Created new paragraph in first section');
            return true;
        }
        
        console.log('❌ Could not find suitable paragraph to update');
        return false;
    }
    
    // Get description from data
    function getFooterDescription() {
        // Try dataManager first
        if (window.dataManager) {
            const data = window.dataManager.getData();
            if (data?.footer?.description) {
                return data.footer.description;
            }
        }
        
        // Try localStorage
        try {
            const localData = localStorage.getItem('worldtravel_data');
            if (localData) {
                const data = JSON.parse(localData);
                if (data?.footer?.description) {
                    return data.footer.description;
                }
            }
        } catch (e) {
            console.log('⚠️ Could not read from localStorage');
        }
        
        return 'Ваш надежный партнер в мире путешествий.';
    }
    
    // Apply the fix
    const description = getFooterDescription();
    updateFooterDescription(description);
    
    // Patch editor to update footer on save
    if (window.editor) {
        const originalShowContentEditor = window.editor.showContentEditor;
        window.editor.showContentEditor = function() {
            if (originalShowContentEditor) {
                originalShowContentEditor.call(this);
            }
            
            // When footer section is opened, setup save handler
            if (this.currentSection?.id === 'footer') {
                setTimeout(() => {
                    const saveButton = document.querySelector('#content-editor button[onclick*="saveChanges"]');
                    if (saveButton) {
                        saveButton.onclick = function() {
                            if (window.editor.saveChanges) {
                                window.editor.saveChanges();
                            }
                            // Force update footer after save
                            setTimeout(() => {
                                const descInput = document.querySelector('#content-editor [data-field="description"]');
                                if (descInput) {
                                    updateFooterDescription(descInput.value);
                                }
                            }, 500);
                        };
                    }
                }, 200);
            }
        };
        
        console.log('✅ Editor patched for footer updates');
    }
    
    console.log('🎯 Footer debug and fix completed');
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', debugAndFixFooter);
} else {
    debugAndFixFooter();
}

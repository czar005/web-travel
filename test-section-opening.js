// Simple test - run this in console to check section opening
console.log('🔍 Testing section opening...');

// Test 1: Check if sections exist
const sections = document.querySelectorAll('.section-item');
console.log('📋 Sections found:', sections.length);

// Test 2: Check if editor panel exists
const editorPanel = document.getElementById('content-editor');
console.log('📝 Editor panel exists:', !!editorPanel);

// Test 3: Test click on first section
if (sections.length > 0) {
    console.log('🖱️ Clicking first section...');
    sections[0].click();
    
    // Check if editor opened
    setTimeout(() => {
        const isEditorVisible = editorPanel.style.display !== 'none';
        console.log('✅ Editor panel visible after click:', isEditorVisible);
        
        if (isEditorVisible) {
            console.log('🎉 Section opening WORKS!');
        } else {
            console.log('❌ Section opening FAILED');
        }
    }, 500);
}

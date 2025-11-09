// COMPLETE EDITOR WITH BLOCKS MANAGEMENT - Enhanced version
// This combines both content editing and dynamic blocks management

// First load the original complete editor
const originalScript = document.createElement('script');
originalScript.src = 'complete-content-editor.js';
document.head.appendChild(originalScript);

// Then load dynamic blocks editor
const blocksScript = document.createElement('script'); 
blocksScript.src = 'dynamic-blocks-editor.js';
document.head.appendChild(blocksScript);

console.log('🎨 Loading Complete Editor with Blocks Management...');

// Wait for both to load and initialize integration
const initializeIntegratedEditor = () => {
    if (window.CompleteEditor && window.DynamicBlocksEditor) {
        console.log('🔗 Complete Editor with Blocks Management Ready!');
        console.log('🎯 Features:');
        console.log('   ✅ Edit ANY text, images, icons on page');
        console.log('   ✅ Add/remove/edit statistic blocks');
        console.log('   ✅ Add/remove/edit service cards'); 
        console.log('   ✅ Add/remove/edit country cards');
        console.log('   ✅ Drag and drop reordering');
        console.log('   ✅ Real-time preview updates');
    } else {
        setTimeout(initializeIntegratedEditor, 100);
    }
};

// Start initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeIntegratedEditor);
} else {
    initializeIntegratedEditor();
}

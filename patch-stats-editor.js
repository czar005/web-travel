// Patch the stats editor HTML generation
function patchStatsEditor() {
    console.log('🔄 Patching stats editor HTML generation...');
    
    const checkEditor = () => {
        if (window.editor && window.editor.showContentEditor) {
            // Store original method
            const originalShow = window.editor.showContentEditor;
            
            // Patch method to fix generated HTML
            window.editor.showContentEditor = function() {
                originalShow.call(this);
                
                // Wait for stats to render
                setTimeout(() => {
                    const statsManager = document.querySelector('.stats-manager');
                    if (statsManager) {
                        // Fix the container
                        statsManager.style.maxWidth = '100%';
                        statsManager.style.overflow = 'hidden';
                        
                        // Fix all stat items
                        const statItems = statsManager.querySelectorAll('.stat-item');
                        statItems.forEach(item => {
                            item.style.flexWrap = 'wrap';
                            item.style.gap = '8px';
                            
                            const inputs = item.querySelectorAll('input[type="text"]');
                            if (inputs.length >= 2) {
                                inputs[0].style.flex = '1 1 80px';
                                inputs[0].style.minWidth = '80px';
                                inputs[0].style.maxWidth = '120px';
                                inputs[0].style.boxSizing = 'border-box';
                                
                                inputs[1].style.flex = '2 1 150px';
                                inputs[1].style.minWidth = '150px';
                                inputs[1].style.maxWidth = '250px';
                                inputs[1].style.boxSizing = 'border-box';
                            }
                            
                            const button = item.querySelector('button');
                            if (button) {
                                button.style.flexShrink = '0';
                                button.style.minWidth = '90px';
                            }
                        });
                    }
                }, 200);
            };
            
            console.log('✅ Stats editor HTML generation patched');
        } else {
            setTimeout(checkEditor, 100);
        }
    };
    
    checkEditor();
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', patchStatsEditor);
} else {
    patchStatsEditor();
}

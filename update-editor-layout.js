// Update the editor layout to prevent overflow
function updateEditorLayout() {
    console.log('🔄 Updating editor layout...');
    
    // Wait for editor to be available
    const checkEditor = () => {
        if (window.editor && window.editor.addFixedServicesEditor) {
            // Patch the services editor method
            const originalAddServices = window.editor.addFixedServicesEditor;
            
            window.editor.addFixedServicesEditor = function() {
                originalAddServices.call(this);
                
                // Update the generated HTML to use better styles
                setTimeout(() => {
                    const serviceRows = document.querySelectorAll('.working-services-editor [style*="display: flex"]');
                    serviceRows.forEach(row => {
                        row.style.flexWrap = 'wrap';
                        row.style.gap = '8px';
                        
                        const inputs = row.querySelectorAll('input[type="text"]');
                        if (inputs.length >= 2) {
                            inputs[0].style.flex = '1 1 150px';
                            inputs[0].style.minWidth = '150px';
                            inputs[0].style.maxWidth = 'calc(50% - 20px)';
                            
                            inputs[1].style.flex = '1 1 120px';
                            inputs[1].style.minWidth = '120px';
                            inputs[1].style.maxWidth = 'calc(50% - 20px)';
                        }
                        
                        const button = row.querySelector('button');
                        if (button) {
                            button.style.flexShrink = '0';
                            button.style.minWidth = '60px';
                        }
                    });
                }, 100);
            };
            
            console.log('✅ Editor layout patched');
        } else {
            setTimeout(checkEditor, 100);
        }
    };
    
    checkEditor();
}

// Initialize layout updates
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateEditorLayout);
} else {
    updateEditorLayout();
}

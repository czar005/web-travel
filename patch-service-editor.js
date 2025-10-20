// Patch the service editor to generate better HTML
function patchServiceEditor() {
    console.log('🔄 Patching service editor HTML generation...');
    
    const checkEditor = () => {
        if (window.editor && window.editor.addFixedServicesEditor) {
            // Store original method
            const originalAddServices = window.editor.addFixedServicesEditor;
            
            // Patch method
            window.editor.addFixedServicesEditor = function() {
                originalAddServices.call(this);
                
                // Wait for services to render
                setTimeout(() => {
                    document.querySelectorAll('.service-item').forEach(serviceItem => {
                        // Apply the same fixes to newly created items
                        serviceItem.style.maxWidth = '100%';
                        serviceItem.style.overflow = 'hidden';
                        serviceItem.style.boxSizing = 'border-box';
                        
                        const flexContainer = serviceItem.querySelector('div[style*="display: flex"]');
                        if (flexContainer) {
                            flexContainer.style.display = 'flex';
                            flexContainer.style.flexWrap = 'wrap';
                            flexContainer.style.gap = '8px';
                            flexContainer.style.alignItems = 'center';
                            flexContainer.style.maxWidth = '100%';
                            
                            const inputs = flexContainer.querySelectorAll('input[type="text"]');
                            if (inputs.length >= 2) {
                                inputs[0].style.flex = '1 1 150px';
                                inputs[0].style.minWidth = '120px';
                                inputs[0].style.maxWidth = 'calc(50% - 30px)';
                                inputs[0].style.width = 'auto';
                                inputs[0].style.boxSizing = 'border-box';
                                
                                inputs[1].style.flex = '1 1 120px';
                                inputs[1].style.minWidth = '100px';
                                inputs[1].style.maxWidth = 'calc(30% - 30px)';
                                inputs[1].style.width = 'auto';
                                inputs[1].style.boxSizing = 'border-box';
                            }
                            
                            const button = flexContainer.querySelector('button');
                            if (button) {
                                button.style.flexShrink = '0';
                                button.style.minWidth = '40px';
                                button.style.maxWidth = '60px';
                                button.style.width = 'auto';
                                button.style.boxSizing = 'border-box';
                            }
                        }
                        
                        const textarea = serviceItem.querySelector('textarea');
                        if (textarea) {
                            textarea.style.maxWidth = '100%';
                            textarea.style.width = '100%';
                            textarea.style.boxSizing = 'border-box';
                        }
                    });
                }, 200);
            };
            
            console.log('✅ Service editor HTML generation patched');
        } else {
            setTimeout(checkEditor, 100);
        }
    };
    
    checkEditor();
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', patchServiceEditor);
} else {
    patchServiceEditor();
}

// Fix for flex inputs overflowing in editor
function fixFlexInputsOverflow() {
    console.log('🔧 Fixing flex inputs overflow...');
    
    const style = document.createElement('style');
    style.textContent = `
        /* Fix for flex container overflow */
        .working-services-editor [style*="display: flex"] {
            flex-wrap: wrap !important;
            gap: 8px !important;
        }
        
        /* Fix for flex inputs - remove flex:1 and set proper widths */
        .working-services-editor input[type="text"] {
            flex: none !important;
            min-width: 0 !important;
            max-width: calc(50% - 20px) !important;
            width: 100% !important;
            box-sizing: border-box !important;
        }
        
        /* Specific fix for service title input */
        .working-services-editor input[type="text"]:first-child {
            min-width: 150px !important;
            flex: 1 1 150px !important;
        }
        
        /* Specific fix for icon input */
        .working-services-editor input[type="text"]:nth-child(2) {
            min-width: 120px !important;
            flex: 1 1 120px !important;
        }
        
        /* Fix for delete button */
        .working-services-editor button {
            flex-shrink: 0 !important;
            min-width: 60px !important;
        }
        
        /* Ensure textarea doesn't overflow */
        .working-services-editor textarea {
            max-width: 100% !important;
            width: 100% !important;
            box-sizing: border-box !important;
        }
    `;
    
    document.head.appendChild(style);
    
    // Apply fixes dynamically
    const applyFlexFixes = () => {
        // Find all flex containers in services editor
        document.querySelectorAll('.working-services-editor [style*="display: flex"]').forEach(container => {
            container.style.flexWrap = 'wrap';
            container.style.gap = '8px';
            
            // Fix inputs inside
            const inputs = container.querySelectorAll('input[type="text"]');
            if (inputs.length >= 2) {
                // First input (title)
                inputs[0].style.flex = '1 1 150px';
                inputs[0].style.minWidth = '150px';
                inputs[0].style.maxWidth = 'calc(50% - 20px)';
                
                // Second input (icon)
                inputs[1].style.flex = '1 1 120px';
                inputs[1].style.minWidth = '120px';
                inputs[1].style.maxWidth = 'calc(50% - 20px)';
            }
            
            // Fix button
            const button = container.querySelector('button');
            if (button) {
                button.style.flexShrink = '0';
                button.style.minWidth = '60px';
            }
        });
    };
    
    // Apply immediately
    applyFlexFixes();
    
    // Re-apply when editor shows content
    if (window.editor) {
        const originalShow = window.editor.showContentEditor;
        window.editor.showContentEditor = function() {
            if (originalShow) originalShow.call(this);
            setTimeout(applyFlexFixes, 150);
        };
    }
    
    // Also monitor for dynamic changes
    const observer = new MutationObserver(applyFlexFixes);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('✅ Flex inputs overflow fix applied');
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixFlexInputsOverflow);
} else {
    fixFlexInputsOverflow();
}

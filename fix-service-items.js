// Fix for service items overflow
function fixServiceItemsOverflow() {
    console.log('🔧 Fixing service items overflow...');
    
    const style = document.createElement('style');
    style.textContent = `
        /* Fix for service item container */
        .service-item {
            max-width: 100% !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
        }
        
        /* Fix for flex container - make it wrap */
        .service-item > div[style*="display: flex"] {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
            align-items: center !important;
            max-width: 100% !important;
        }
        
        /* Fix for title input */
        .service-item input[type="text"]:first-child {
            flex: 1 1 150px !important;
            min-width: 120px !important;
            max-width: calc(50% - 30px) !important;
            width: auto !important;
            box-sizing: border-box !important;
        }
        
        /* Fix for icon input */
        .service-item input[type="text"]:nth-child(2) {
            flex: 1 1 120px !important;
            min-width: 100px !important;
            max-width: calc(30% - 30px) !important;
            width: auto !important;
            box-sizing: border-box !important;
        }
        
        /* Fix for delete button */
        .service-item button {
            flex-shrink: 0 !important;
            min-width: 40px !important;
            max-width: 60px !important;
            width: auto !important;
            box-sizing: border-box !important;
        }
        
        /* Fix for textarea */
        .service-item textarea {
            max-width: 100% !important;
            width: 100% !important;
            box-sizing: border-box !important;
        }
        
        /* Mobile responsive */
        @media (max-width: 768px) {
            .service-item > div[style*="display: flex"] {
                flex-direction: column !important;
                align-items: stretch !important;
            }
            
            .service-item input[type="text"] {
                max-width: 100% !important;
                min-width: 100% !important;
            }
            
            .service-item button {
                align-self: flex-start !important;
                min-width: 60px !important;
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // Apply fixes dynamically
    const applyServiceFixes = () => {
        document.querySelectorAll('.service-item').forEach(serviceItem => {
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
                    // Title input
                    inputs[0].style.flex = '1 1 150px';
                    inputs[0].style.minWidth = '120px';
                    inputs[0].style.maxWidth = 'calc(50% - 30px)';
                    inputs[0].style.width = 'auto';
                    inputs[0].style.boxSizing = 'border-box';
                    
                    // Icon input
                    inputs[1].style.flex = '1 1 120px';
                    inputs[1].style.minWidth = '100px';
                    inputs[1].style.maxWidth = 'calc(30% - 30px)';
                    inputs[1].style.width = 'auto';
                    inputs[1].style.boxSizing = 'border-box';
                }
                
                // Fix button
                const button = flexContainer.querySelector('button');
                if (button) {
                    button.style.flexShrink = '0';
                    button.style.minWidth = '40px';
                    button.style.maxWidth = '60px';
                    button.style.width = 'auto';
                    button.style.boxSizing = 'border-box';
                }
            }
            
            // Fix textarea
            const textarea = serviceItem.querySelector('textarea');
            if (textarea) {
                textarea.style.maxWidth = '100%';
                textarea.style.width = '100%';
                textarea.style.boxSizing = 'border-box';
            }
        });
    };
    
    // Apply immediately
    applyServiceFixes();
    
    // Monitor for new service items
    const observer = new MutationObserver((mutations) => {
        let shouldApply = false;
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && (node.classList.contains('service-item') || node.querySelector('.service-item'))) {
                    shouldApply = true;
                }
            });
        });
        if (shouldApply) {
            setTimeout(applyServiceFixes, 50);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('✅ Service items overflow fix applied');
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixServiceItemsOverflow);
} else {
    fixServiceItemsOverflow();
}

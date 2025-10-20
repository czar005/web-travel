// FORCE FIX EDITOR OVERFLOW
function forceFixEditorOverflow() {
    console.log('🚨 APPLYING FORCE FIX FOR EDITOR OVERFLOW');
    
    // Add CSS immediately
    const style = document.createElement('style');
    style.textContent = `
        /* FORCE FIX EDITOR OVERFLOW */
        .working-services-editor,
        .working-stats-editor,
        .stats-manager,
        .service-item,
        .stat-item {
            max-width: 100% !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
        }

        /* FIX SERVICE ITEMS */
        .service-item > div[style*="display: flex"] {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
            align-items: center !important;
            max-width: 100% !important;
            width: 100% !important;
        }

        .service-item input[type="text"] {
            flex: none !important;
            min-width: 0 !important;
            max-width: 200px !important;
            width: 100% !important;
            box-sizing: border-box !important;
        }

        .service-item input[type="text"]:first-child {
            flex: 1 1 150px !important;
            min-width: 150px !important;
            max-width: 200px !important;
        }

        .service-item input[type="text"]:nth-child(2) {
            flex: 1 1 120px !important;
            min-width: 120px !important;
            max-width: 150px !important;
        }

        .service-item button {
            flex-shrink: 0 !important;
            min-width: 60px !important;
            max-width: 80px !important;
            width: auto !important;
        }

        .service-item textarea {
            max-width: 100% !important;
            width: 100% !important;
            box-sizing: border-box !important;
        }

        /* FIX STATS ITEMS */
        .stat-item[style*="display: flex"] {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
            align-items: center !important;
            max-width: 100% !important;
            width: 100% !important;
        }

        .stat-item input[type="text"] {
            flex: none !important;
            min-width: 0 !important;
            max-width: 200px !important;
            width: 100% !important;
            box-sizing: border-box !important;
        }

        .stat-item input[type="text"]:first-child {
            flex: 1 1 80px !important;
            min-width: 80px !important;
            max-width: 100px !important;
        }

        .stat-item input[type="text"]:nth-child(2) {
            flex: 2 1 120px !important;
            min-width: 120px !important;
            max-width: 200px !important;
        }

        .stat-item button {
            flex-shrink: 0 !important;
            min-width: 70px !important;
            max-width: 90px !important;
            width: auto !important;
        }

        /* MOBILE FIX */
        @media (max-width: 768px) {
            .service-item > div[style*="display: flex"],
            .stat-item[style*="display: flex"] {
                flex-direction: column !important;
                align-items: stretch !important;
            }
            
            .service-item input[type="text"],
            .stat-item input[type="text"] {
                max-width: 100% !important;
                min-width: 100% !important;
            }
            
            .service-item button,
            .stat-item button {
                align-self: flex-start !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Apply fixes to existing elements
    function applyForceFixes() {
        // Fix service items
        document.querySelectorAll('.service-item').forEach(item => {
            item.style.maxWidth = '100%';
            item.style.overflow = 'hidden';
            item.style.boxSizing = 'border-box';
            
            const flexDiv = item.querySelector('div[style*="display: flex"]');
            if (flexDiv) {
                flexDiv.style.display = 'flex';
                flexDiv.style.flexWrap = 'wrap';
                flexDiv.style.gap = '8px';
                flexDiv.style.alignItems = 'center';
                flexDiv.style.maxWidth = '100%';
                flexDiv.style.width = '100%';
                
                const inputs = flexDiv.querySelectorAll('input[type="text"]');
                if (inputs[0]) {
                    inputs[0].style.flex = '1 1 150px';
                    inputs[0].style.minWidth = '150px';
                    inputs[0].style.maxWidth = '200px';
                    inputs[0].style.width = '100%';
                    inputs[0].style.boxSizing = 'border-box';
                }
                if (inputs[1]) {
                    inputs[1].style.flex = '1 1 120px';
                    inputs[1].style.minWidth = '120px';
                    inputs[1].style.maxWidth = '150px';
                    inputs[1].style.width = '100%';
                    inputs[1].style.boxSizing = 'border-box';
                }
                
                const button = flexDiv.querySelector('button');
                if (button) {
                    button.style.flexShrink = '0';
                    button.style.minWidth = '60px';
                    button.style.maxWidth = '80px';
                    button.style.width = 'auto';
                }
            }
            
            const textarea = item.querySelector('textarea');
            if (textarea) {
                textarea.style.maxWidth = '100%';
                textarea.style.width = '100%';
                textarea.style.boxSizing = 'border-box';
            }
        });
        
        // Fix stat items
        document.querySelectorAll('.stat-item').forEach(item => {
            item.style.maxWidth = '100%';
            item.style.overflow = 'hidden';
            item.style.boxSizing = 'border-box';
            
            const inputs = item.querySelectorAll('input[type="text"]');
            if (inputs[0]) {
                inputs[0].style.flex = '1 1 80px';
                inputs[0].style.minWidth = '80px';
                inputs[0].style.maxWidth = '100px';
                inputs[0].style.width = '100%';
                inputs[0].style.boxSizing = 'border-box';
            }
            if (inputs[1]) {
                inputs[1].style.flex = '2 1 120px';
                inputs[1].style.minWidth = '120px';
                inputs[1].style.maxWidth = '200px';
                inputs[1].style.width = '100%';
                inputs[1].style.boxSizing = 'border-box';
            }
            
            const button = item.querySelector('button');
            if (button) {
                button.style.flexShrink = '0';
                button.style.minWidth = '70px';
                button.style.maxWidth = '90px';
                button.style.width = 'auto';
            }
        });
    }
    
    // Apply immediately
    applyForceFixes();
    
    // Apply on any DOM changes
    const observer = new MutationObserver(applyForceFixes);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Apply every second for safety
    setInterval(applyForceFixes, 1000);
    
    console.log('✅ FORCE FIX APPLIED');
}

// Apply immediately and aggressively
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', forceFixEditorOverflow);
} else {
    forceFixEditorOverflow();
}

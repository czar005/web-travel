// Fix for stats inputs overflow
function fixStatsInputsOverflow() {
    console.log('🔧 Fixing stats inputs overflow...');
    
    const style = document.createElement('style');
    style.textContent = `
        /* Fix for stats container */
        .stats-manager {
            max-width: 100% !important;
            overflow: hidden !important;
        }
        
        /* Fix for stat items flex layout */
        .stat-item[style*="display: flex"] {
            flex-wrap: wrap !important;
            gap: 8px !important;
        }
        
        /* Fix for stats inputs - remove flex ratios */
        .stat-item input[type="text"] {
            flex: 1 1 auto !important;
            min-width: 0 !important;
            max-width: calc(33% - 20px) !important;
            width: 100% !important;
            box-sizing: border-box !important;
        }
        
        /* First input (value) */
        .stat-item input[type="text"]:first-child {
            flex: 1 1 80px !important;
            min-width: 80px !important;
            max-width: 120px !important;
        }
        
        /* Second input (label) */
        .stat-item input[type="text"]:nth-child(2) {
            flex: 2 1 150px !important;
            min-width: 150px !important;
            max-width: 250px !important;
        }
        
        /* Fix for remove button */
        .stat-item button {
            flex-shrink: 0 !important;
            min-width: 90px !important;
            white-space: nowrap !important;
        }
        
        /* Responsive fixes */
        @media (max-width: 768px) {
            .stat-item[style*="display: flex"] {
                flex-direction: column !important;
                align-items: stretch !important;
            }
            
            .stat-item input[type="text"] {
                max-width: 100% !important;
                min-width: 100% !important;
            }
            
            .stat-item button {
                align-self: flex-start !important;
                min-width: 90px !important;
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // Apply fixes dynamically to existing elements
    const applyStatsFixes = () => {
        document.querySelectorAll('.stat-item[style*="display: flex"]').forEach(item => {
            item.style.flexWrap = 'wrap';
            item.style.gap = '8px';
            
            const inputs = item.querySelectorAll('input[type="text"]');
            if (inputs.length >= 2) {
                // First input (value)
                inputs[0].style.flex = '1 1 80px';
                inputs[0].style.minWidth = '80px';
                inputs[0].style.maxWidth = '120px';
                
                // Second input (label)
                inputs[1].style.flex = '2 1 150px';
                inputs[1].style.minWidth = '150px';
                inputs[1].style.maxWidth = '250px';
            }
            
            // Fix button
            const button = item.querySelector('button');
            if (button) {
                button.style.flexShrink = '0';
                button.style.minWidth = '90px';
            }
        });
    };
    
    // Apply immediately
    applyStatsFixes();
    
    // Monitor for new stat items
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && (node.classList.contains('stat-item') || node.querySelector('.stat-item'))) {
                    setTimeout(applyStatsFixes, 50);
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Also patch the editor's stat creation method
    if (window.editor && window.editor.addStat) {
        const originalAddStat = window.editor.addStat;
        window.editor.addStat = function() {
            originalAddStat.call(this);
            setTimeout(applyStatsFixes, 100);
        };
    }
    
    console.log('✅ Stats inputs overflow fix applied');
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixStatsInputsOverflow);
} else {
    fixStatsInputsOverflow();
}

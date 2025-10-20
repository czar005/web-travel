// FINAL OVERFLOW FIX - SIMPLE AND RELIABLE
function finalOverflowFix() {
    console.log('🎯 Applying final overflow fix...');
    
    // Simple CSS injection
    const style = document.createElement('style');
    style.textContent = `
        #content-editor * {
            box-sizing: border-box !important;
            max-width: 100% !important;
        }
        
        .working-services-editor,
        .working-stats-editor {
            width: 100% !important;
            max-width: 100% !important;
            overflow: hidden !important;
        }
        
        .service-item {
            width: 100% !important;
            max-width: 100% !important;
        }
        
        .service-item > div {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
            width: 100% !important;
        }
        
        .service-item input[type="text"] {
            min-width: 120px !important;
            max-width: 200px !important;
            width: auto !important;
            flex: 1 !important;
        }
        
        .service-item button {
            min-width: 60px !important;
            flex-shrink: 0 !important;
        }
        
        .service-item textarea {
            width: 100% !important;
            max-width: 100% !important;
        }
        
        .stat-item {
            width: 100% !important;
            max-width: 100% !important;
        }
        
        .stat-item input[type="text"] {
            min-width: 80px !important;
            max-width: 150px !important;
            width: auto !important;
            flex: 1 !important;
        }
        
        .stat-item input[type="text"]:nth-child(2) {
            min-width: 120px !important;
            max-width: 200px !important;
        }
        
        .stat-item button {
            min-width: 70px !important;
            flex-shrink: 0 !important;
        }
    `;
    document.head.appendChild(style);
    
    // Simple function to apply fixes
    function applySimpleFixes() {
        // Fix all inputs in content editor
        const inputs = document.querySelectorAll('#content-editor input, #content-editor textarea');
        inputs.forEach(input => {
            input.style.boxSizing = 'border-box';
            input.style.maxWidth = '100%';
        });
        
        // Fix service items
        document.querySelectorAll('.service-item').forEach(item => {
            item.style.width = '100%';
            item.style.maxWidth = '100%';
            
            const flexDiv = item.querySelector('div');
            if (flexDiv) {
                flexDiv.style.display = 'flex';
                flexDiv.style.flexWrap = 'wrap';
                flexDiv.style.gap = '8px';
                flexDiv.style.width = '100%';
            }
        });
        
        // Fix stat items
        document.querySelectorAll('.stat-item').forEach(item => {
            item.style.width = '100%';
            item.style.maxWidth = '100%';
        });
    }
    
    // Apply immediately
    applySimpleFixes();
    
    // Re-apply when editor changes
    if (window.editor && window.editor.showContentEditor) {
        const originalShow = window.editor.showContentEditor;
        window.editor.showContentEditor = function() {
            if (originalShow) originalShow.call(this);
            setTimeout(applySimpleFixes, 100);
        };
    }
    
    // Periodic check
    setInterval(applySimpleFixes, 2000);
    
    console.log('✅ Final overflow fix applied');
}

// Apply final fix
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', finalOverflowFix);
} else {
    finalOverflowFix();
}

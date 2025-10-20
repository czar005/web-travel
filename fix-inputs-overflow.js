// Fix for inputs overflowing in editor
function fixInputsOverflow() {
    console.log('🔧 Fixing inputs overflow in editor...');
    
    const style = document.createElement('style');
    style.textContent = `
        /* Fix for input overflow in editor */
        .working-stats-editor input[type="text"],
        .working-services-editor input[type="text"],
        .working-services-editor textarea,
        .unified-contacts-editor input[type="text"],
        .unified-contacts-editor input[type="email"],
        .form-control[data-field] {
            max-width: 100% !important;
            box-sizing: border-box !important;
            width: 100% !important;
        }
        
        /* Specific fix for service editor inputs */
        .working-services-editor .service-row input[type="text"] {
            min-width: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
        }
        
        /* Fix for flex containers */
        .working-stats-editor .stat-row,
        .working-services-editor .service-row {
            flex-wrap: wrap !important;
            gap: 10px !important;
        }
        
        .working-stats-editor .stat-row > *,
        .working-services-editor .service-row > * {
            flex: 1 1 auto !important;
            min-width: 0 !important;
        }
        
        /* Ensure buttons don't shrink */
        .working-stats-editor .btn-small,
        .working-services-editor .btn-small {
            flex-shrink: 0 !important;
            white-space: nowrap !important;
        }
    `;
    
    document.head.appendChild(style);
    
    // Also apply fixes dynamically to existing elements
    const applyFixesToExisting = () => {
        document.querySelectorAll('.working-stats-editor input, .working-services-editor input, .working-services-editor textarea').forEach(input => {
            input.style.maxWidth = '100%';
            input.style.boxSizing = 'border-box';
            input.style.width = '100%';
        });
    };
    
    // Apply immediately
    applyFixesToExisting();
    
    // Apply on editor show
    const originalShow = window.editor?.showContentEditor;
    if (window.editor && originalShow) {
        window.editor.showContentEditor = function() {
            originalShow.call(this);
            setTimeout(applyFixesToExisting, 100);
        };
    }
    
    console.log('✅ Inputs overflow fix applied');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixInputsOverflow);
} else {
    fixInputsOverflow();
}

// CLEAN OVERFLOW FIX - NO ERRORS
function cleanOverflowFix() {
    console.log('🧹 Applying clean overflow fix...');
    
    // Simple CSS injection
    const style = document.createElement('style');
    style.textContent = `
        #content-editor * {
            box-sizing: border-box;
            max-width: 100%;
        }
        
        .working-services-editor,
        .working-stats-editor,
        .stats-manager {
            width: 100%;
            max-width: 100%;
            overflow: hidden;
        }
        
        .service-item,
        .stat-item {
            width: 100%;
            max-width: 100%;
        }
        
        .service-item > div,
        .stat-item {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            width: 100%;
            align-items: center;
        }
        
        .service-item input[type="text"] {
            min-width: 120px;
            max-width: 200px;
            flex: 1;
        }
        
        .service-item input[type="text"]:nth-child(2) {
            min-width: 100px;
            max-width: 150px;
        }
        
        .service-item button,
        .stat-item button {
            min-width: 60px;
            flex-shrink: 0;
        }
        
        .service-item textarea {
            width: 100%;
            max-width: 100%;
        }
        
        .stat-item input[type="text"]:first-child {
            min-width: 80px;
            max-width: 100px;
        }
        
        .stat-item input[type="text"]:nth-child(2) {
            min-width: 120px;
            max-width: 200px;
            flex: 2;
        }
    `;
    document.head.appendChild(style);
    
    console.log('✅ Clean overflow fix applied');
}

// Apply when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanOverflowFix);
} else {
    cleanOverflowFix();
}

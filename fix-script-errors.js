// Fix for script.js errors - override problematic functions
(function() {
    // Override loadDestinations to handle Data Manager errors
    const originalLoadDestinations = window.loadDestinations;
    
    window.loadDestinations = function() {
        if (!window.dataManager) {
            console.warn('⚠️ Data Manager not available, showing empty destinations');
            document.getElementById('destinations-loading').style.display = 'none';
            document.getElementById('destinations-grid').innerHTML = `
                <div class="empty-destinations" style="text-align: center; padding: 40px; color: #666;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                    <p>Не удалось загрузить направления</p>
                    <small>Попробуйте обновить страницу</small>
                </div>
            `;
            return;
        }
        
        // Call original function if dataManager exists
        if (originalLoadDestinations) {
            originalLoadDestinations();
        }
    };
    
    // Fix for exact-content-updater errors
    const originalUpdateExactNavigation = window.updateExactNavigation;
    window.updateExactNavigation = function(content) {
        if (!content || !content.about) {
            console.warn('⚠️ No content data available for navigation update');
            return;
        }
        if (originalUpdateExactNavigation) {
            originalUpdateExactNavigation(content);
        }
    };
    
    console.log('✅ Script error fixes applied');
})();

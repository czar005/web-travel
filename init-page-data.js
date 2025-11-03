// Initialize page data structure if needed
(function() {
    'use strict';
    
    console.log('🔧 Initializing page data structure...');
    
    const initData = () => {
        if (window.dataManager) {
            const data = window.dataManager.getData();
            if (!data) return;
            
            if (!data.content) {
                data.content = {};
            }
            
            // Ensure all sections have basic structure
            const sections = ['hero', 'about', 'services', 'destinations', 'contact'];
            sections.forEach(section => {
                if (!data.content[section]) {
                    data.content[section] = {};
                }
            });
            
            // Ensure services have services array
            if (data.content.services && !data.content.services.services) {
                data.content.services.services = [];
            }
            
            // Ensure about has stats array
            if (data.content.about && !data.content.about.stats) {
                data.content.about.stats = [];
            }
            
            console.log('✅ Page data structure initialized');
        } else {
            setTimeout(initData, 100);
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initData);
    } else {
        initData();
    }
})();

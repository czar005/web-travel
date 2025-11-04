// Force initialize data structure for page editor
(function() {
    'use strict';
    
    console.log('🔧 Force initializing page data structure...');
    
    const forceInitData = () => {
        if (window.dataManager) {
            const data = window.dataManager.getData();
            if (!data) {
                console.log('❌ No data found, creating new structure');
                window.dataManager.setData({
                    content: {
                        hero: { title: "Откройте мир с WorldTravel", description: "Мы создаем незабываемые путешествия...", buttonText: "Начать путешествие" },
                        about: { title: "О нас", description: "WorldTravel - это команда...", stats: [] },
                        services: { title: "Услуги", description: "Наши основные направления...", services: [] },
                        destinations: { title: "Направления", subtitle: "Откройте для себя..." },
                        contact: { title: "Контакты", description: "Свяжитесь с нами..." }
                    },
                    lastUpdate: new Date().toISOString()
                });
                return;
            }
            
            let needsUpdate = false;
            
            if (!data.content) {
                data.content = {};
                needsUpdate = true;
                console.log('📁 Created content structure');
            }
            
            // Ensure all sections exist
            const sections = ['hero', 'about', 'services', 'destinations', 'contact'];
            sections.forEach(section => {
                if (!data.content[section]) {
                    data.content[section] = {};
                    needsUpdate = true;
                    console.log(`📁 Created ${section} section`);
                }
            });
            
            // Ensure about has stats array
            if (data.content.about && !Array.isArray(data.content.about.stats)) {
                data.content.about.stats = [];
                needsUpdate = true;
                console.log('📁 Created stats array');
            }
            
            // Ensure services has services array
            if (data.content.services && !Array.isArray(data.content.services.services)) {
                data.content.services.services = [];
                needsUpdate = true;
                console.log('📁 Created services array');
            }
            
            if (needsUpdate) {
                data.lastUpdate = new Date().toISOString();
                window.dataManager.setData(data);
                console.log('✅ Data structure force initialized');
            } else {
                console.log('✅ Data structure already initialized');
            }
        } else {
            setTimeout(forceInitData, 100);
        }
    };
    
    // Start initialization when page editor loads
    if (window.location.pathname.includes('page-editor.html')) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', forceInitData);
        } else {
            forceInitData();
        }
    }
})();

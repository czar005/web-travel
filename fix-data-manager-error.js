// Fix for Data Manager loading error
(function() {
    console.log('🔧 Initializing Data Manager fix...');
    
    // Проверяем загрузку Data Manager
    let dataManagerLoaded = false;
    
    const checkDataManager = setInterval(() => {
        if (window.dataManager) {
            dataManagerLoaded = true;
            clearInterval(checkDataManager);
            console.log('✅ Data Manager loaded successfully');
        }
    }, 100);
    
    // Если через 3 секунды Data Manager не загрузился, создаем fallback
    setTimeout(() => {
        if (!dataManagerLoaded) {
            clearInterval(checkDataManager);
            console.log('⚠️ Data Manager not loaded, creating fallback');
            
            window.dataManager = {
                getCountries: function() {
                    return [];
                },
                getAllTours: function() {
                    return [];
                },
                getData: function() {
                    return { countries: [], tours: [] };
                }
            };
        }
    }, 3000);
})();

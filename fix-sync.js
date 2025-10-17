// fix-sync.js
document.addEventListener('DOMContentLoaded', function() {
    // Принудительная синхронизация каждые 2 секунды
    setInterval(async () => {
        if (window.dataManager && typeof renderCountries === 'function') {
            const data = await window.dataManager.loadData();
            if (data && data.countries) {
                window.countriesData = data.countries;
                renderCountries();
            }
        }
    }, 2000);
    
    // Слушатель сообщений от админки
    window.addEventListener('message', function(e) {
        if (e.data && e.data.type === 'DATA_UPDATED') {
            console.log('🔄 Получено обновление от админки');
            location.reload();
        }
    });
});
// Fix for data synchronization between tabs
class DataSync {
    constructor() {
        this.storageKey = 'worldtravel_data';
        this.init();
    }

    init() {
        // Слушаем изменения в localStorage
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                console.log('Data changed in another tab, reloading...');
                this.triggerDataReload();
            }
        });

        // Также слушаем наши собственные события
        window.addEventListener('dataUpdated', () => {
            console.log('Data updated event received');
            this.triggerDataReload();
        });
    }

    triggerDataReload() {
        // Обновляем данные на странице
        if (typeof reloadData === 'function') {
            reloadData();
        }
        
        // Если мы в админке, перезагружаем таблицы
        if (typeof loadCountriesTable === 'function') {
            setTimeout(() => {
                loadCountriesTable();
                loadToursTable();
                loadCountrySelect();
            }, 100);
        }
    }

    // Уведомляем другие вкладки об изменении данных
    notifyDataChange() {
        // Триггерим событие storage для других вкладок
        const event = new StorageEvent('storage', {
            key: this.storageKey,
            newValue: localStorage.getItem(this.storageKey)
        });
        window.dispatchEvent(event);

        // Триггерим кастомное событие
        window.dispatchEvent(new CustomEvent('dataUpdated'));
    }
}

// Глобальный экземпляр синхронизации
window.dataSync = new DataSync();

// Data Manager for WorldTravel - ULTRA RELIABLE VERSION
console.log('🔄 Загрузка data-manager...');

window.dataManager = {
    // Основная функция получения данных
    getData: function() {
        try {
            // Пробуем получить из worldtravel_data
            const saved = localStorage.getItem('worldtravel_data');
            if (saved) {
                return JSON.parse(saved);
            }
            
            // Если нет, создаем новые данные
            return this.getDefaultData();
            
        } catch (error) {
            console.error('❌ Ошибка загрузки данных:', error);
            return this.getDefaultData();
        }
    },

    // Надежное сохранение данных
    saveToLocalStorage: function(data) {
        try {
            localStorage.setItem('worldtravel_data', JSON.stringify(data));
            console.log('💾 Данные сохранены в worldtravel_data');
            return true;
        } catch (error) {
            console.error('❌ Ошибка сохранения:', error);
            return false;
        }
    },

    // Данные по умолчанию
    getDefaultData: function() {
        return {
            countries: [],
            content: {
                heroTitle: "Откройте мир с WorldTravel",
                heroText: "Мы создаем незабываемые путешествия по всему миру",
                contactPhone: "+7 (999) 123-45-67",
                contactEmail: "info@worldtravel.com",
                contactAddress: "Москва, ул. Туристическая, 15",
                contactHours: "Пн-Пт: 9:00-18:00"
            },
            design: {
                blocks: {
                    hero: true,
                    destinations: true,
                    contact: true
                }
            },
            settings: {
                companyName: "WorldTravel",
                primaryColor: "#2c5aa0",
                secondaryColor: "#4a7bc8",
                language: "ru"
            }
        };
    },

    // === ФУНКЦИИ ДЛЯ СТРАН ===
    getCountries: function() {
        const data = this.getData();
        return data.countries || [];
    },

    updateCountries: function(countries) {
        console.log('💾 Сохранение стран:', countries);
        try {
            const data = this.getData();
            data.countries = countries;
            return this.saveToLocalStorage(data);
        } catch (error) {
            console.error('❌ Ошибка сохранения стран:', error);
            return false;
        }
    },

    // === ФУНКЦИИ ДЛЯ КОНТЕНТА ===
    getContent: function() {
        const data = this.getData();
        return data.content || {};
    },

    updateContent: function(content) {
        console.log('💾 Сохранение контента:', content);
        try {
            const data = this.getData();
            data.content = { ...data.content, ...content };
            return this.saveToLocalStorage(data);
        } catch (error) {
            console.error('❌ Ошибка сохранения контента:', error);
            return false;
        }
    },

    // === ФУНКЦИИ ДЛЯ ДИЗАЙНА ===
    getDesign: function() {
        const data = this.getData();
        return data.design || {};
    },

    updateDesign: function(design) {
        console.log('💾 Сохранение дизайна:', design);
        try {
            const data = this.getData();
            data.design = { ...data.design, ...design };
            return this.saveToLocalStorage(data);
        } catch (error) {
            console.error('❌ Ошибка сохранения дизайна:', error);
            return false;
        }
    },

    // === ФУНКЦИИ ДЛЯ НАСТРОЕК ===
    getSettings: function() {
        const data = this.getData();
        return data.settings || {};
    },

    updateSettings: function(settings) {
        console.log('💾 Сохранение настроек:', settings);
        try {
            const data = this.getData();
            data.settings = { ...data.settings, ...settings };
            return this.saveToLocalStorage(data);
        } catch (error) {
            console.error('❌ Ошибка сохранения настроек:', error);
            return false;
        }
    }
};

console.log('✅ data-manager загружен и готов к работе');

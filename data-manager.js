// Data Manager for WorldTravel
window.dataManager = {
    // Основные функции
    saveToLocalStorage: function(data) {
        try {
            localStorage.setItem('worldtravel_data', JSON.stringify(data));
            console.log('💾 Данные сохранены');
            return true;
        } catch (error) {
            console.error('❌ Ошибка сохранения:', error);
            return false;
        }
    },

    loadFromLocalStorage: function() {
        try {
            const saved = localStorage.getItem('worldtravel_data');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('❌ Ошибка загрузки:', error);
            return null;
        }
    },

    getData: function() {
        const localData = this.loadFromLocalStorage();
        if (localData) {
            return localData;
        }
        
        // Данные по умолчанию
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
                    about: true,
                    services: true,
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

    // Функции для стран
    getCountries: function() {
        const data = this.getData();
        return data.countries || [];
    },

    updateCountries: function(countries) {
        try {
            const data = this.getData();
            data.countries = countries;
            return this.saveToLocalStorage(data);
        } catch (error) {
            console.error('❌ Ошибка обновления стран:', error);
            return false;
        }
    },

    // Функции для контента
    getContent: function() {
        const data = this.getData();
        return data.content || {};
    },

    updateContent: function(content) {
        try {
            const data = this.getData();
            data.content = { ...data.content, ...content };
            return this.saveToLocalStorage(data);
        } catch (error) {
            console.error('❌ Ошибка обновления контента:', error);
            return false;
        }
    },

    // Функции для дизайна
    getDesign: function() {
        const data = this.getData();
        return data.design || {};
    },

    updateDesign: function(design) {
        try {
            const data = this.getData();
            data.design = { ...data.design, ...design };
            return this.saveToLocalStorage(data);
        } catch (error) {
            console.error('❌ Ошибка обновления дизайна:', error);
            return false;
        }
    },

    // Функции для настроек
    getSettings: function() {
        const data = this.getData();
        return data.settings || {};
    },

    updateSettings: function(settings) {
        try {
            const data = this.getData();
            data.settings = { ...data.settings, ...settings };
            return this.saveToLocalStorage(data);
        } catch (error) {
            console.error('❌ Ошибка обновления настроек:', error);
            return false;
        }
    }
};

console.log('✅ data-manager загружен');

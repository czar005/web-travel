// Data Manager - управление данными сайта
class DataManager {
    constructor() {
        this.storageKey = 'worldtravel_data';
        this.init();
    }

    init() {
        // Инициализация данных по умолчанию если их нет
        if (!this.getData()) {
            this.setDefaultData();
        }
    }

    getData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading data:', error);
            return null;
        }
    }

    setData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            this.triggerDataUpdate();
            
            // Уведомляем о изменении данных
            if (window.dataSync) {
                window.dataSync.notifyDataChange();
            }
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    setDefaultData() {
        const defaultData = {
            countries: [
                {
                    id: 1,
                    name: 'Франция',
                    image: 'images/travel-placeholder.svg',
                    description: 'Романтический Париж и Лазурный берег',
                    tours: [
                        { id: 1, name: 'Париж романтический', price: 500, duration: '7 дней' },
                        { id: 2, name: 'Лазурный берег', price: 700, duration: '10 дней' }
                    ]
                },
                {
                    id: 2,
                    name: 'Италия', 
                    image: 'images/travel-placeholder.svg',
                    description: 'Вкусная кухня и богатая история',
                    tours: [
                        { id: 3, name: 'Рим и Ватикан', price: 600, duration: '8 дней' },
                        { id: 4, name: 'Венеция и Флоренция', price: 550, duration: '6 дней' }
                    ]
                },
                {
                    id: 3,
                    name: 'Испания',
                    image: 'images/travel-placeholder.svg', 
                    description: 'Солнечные пляжи и яркая культура',
                    tours: [
                        { id: 5, name: 'Барселона и Коста-Брава', price: 450, duration: '7 дней' }
                    ]
                }
            ],
            contacts: {
                phone: '+7 (999) 123-45-67',
                email: 'info@worldtravel.com',
                address: 'Москва, ул. Туристическая, 15',
                hours: 'Пн-Пт: 9:00-18:00'
            },
            settings: {
                siteTitle: 'WorldTravel - Туристическая компания',
                companyName: 'WorldTravel'
            },
            // Совместимость со старым форматом
            content: {
                countries: [],
                contacts: {}
            }
        };
        this.setData(defaultData);
        return defaultData;
    }

    // СОВМЕСТИМОСТЬ СО СТАРЫМИ МЕТОДАМИ
    getContent() {
        const data = this.getData();
        return {
            countries: data?.countries || [],
            contacts: data?.contacts || {}
        };
    }

    updateContent(newContent) {
        const data = this.getData();
        if (!data) return false;
        
        if (newContent.countries) {
            data.countries = newContent.countries;
        }
        if (newContent.contacts) {
            data.contacts = newContent.contacts;
        }
        
        return this.setData(data);
    }

    updateCountries(countries) {
        const data = this.getData();
        if (!data) return false;
        
        data.countries = countries;
        return this.setData(data);
    }

    // НОВЫЕ МЕТОДЫ
    getCountries() {
        const data = this.getData();
        return data?.countries || [];
    }

    addCountry(country) {
        const data = this.getData() || this.setDefaultData();
        const newCountry = {
            id: Date.now(),
            image: 'images/travel-placeholder.svg',
            tours: [],
            ...country
        };
        data.countries.push(newCountry);
        const success = this.setData(data);
        return success ? newCountry : null;
    }

    updateCountry(id, updates) {
        const data = this.getData();
        if (!data) return null;
        
        const countryIndex = data.countries.findIndex(c => c.id === id);
        if (countryIndex !== -1) {
            data.countries[countryIndex] = { ...data.countries[countryIndex], ...updates };
            const success = this.setData(data);
            return success ? data.countries[countryIndex] : null;
        }
        return null;
    }

    deleteCountry(id) {
        const data = this.getData();
        if (!data) return false;
        
        data.countries = data.countries.filter(c => c.id !== id);
        return this.setData(data);
    }

    // Туры
    addTour(countryId, tour) {
        const data = this.getData();
        if (!data) return null;
        
        const country = data.countries.find(c => c.id === countryId);
        if (country) {
            const newTour = {
                id: Date.now(),
                ...tour
            };
            if (!country.tours) country.tours = [];
            country.tours.push(newTour);
            const success = this.setData(data);
            return success ? newTour : null;
        }
        return null;
    }

    deleteTour(countryId, tourId) {
        const data = this.getData();
        if (!data) return false;
        
        const country = data.countries.find(c => c.id === countryId);
        if (country && country.tours) {
            country.tours = country.tours.filter(t => t.id !== tourId);
            return this.setData(data);
        }
        return false;
    }

    // Контакты
    getContacts() {
        const data = this.getData();
        return data?.contacts || {};
    }

    updateContacts(updates) {
        const data = this.getData();
        if (!data) return {};
        
        data.contacts = { ...data.contacts, ...updates };
        const success = this.setData(data);
        return success ? data.contacts : {};
    }

    // Настройки
    getSettings() {
        const data = this.getData();
        return data?.settings || {};
    }

    updateSettings(updates) {
        const data = this.getData();
        if (!data) return {};
        
        data.settings = { ...data.settings, ...updates };
        const success = this.setData(data);
        return success ? data.settings : {};
    }

    // События обновления данных
    onDataUpdate(callback) {
        this.dataUpdateCallbacks = this.dataUpdateCallbacks || [];
        this.dataUpdateCallbacks.push(callback);
    }

    triggerDataUpdate() {
        if (this.dataUpdateCallbacks) {
            this.dataUpdateCallbacks.forEach(callback => {
                try {
                    callback(this.getData());
                } catch (error) {
                    console.error('Error in data update callback:', error);
                }
            });
        }
    }
}

// Глобальный экземпляр менеджера данных
window.dataManager = new DataManager();

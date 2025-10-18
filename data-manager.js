// Improved Data Manager with better synchronization
class DataManager {
    constructor() {
        this.storageKey = 'worldtravel_data';
        this.init();
    }

    init() {
        if (!this.getData()) {
            console.log('Initializing default data...');
            this.setDefaultData();
        }
        
        // Listen for storage changes from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                console.log('Data changed in another tab, reloading...');
                this.triggerDataUpdate();
            }
        });
    }

    getData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) return null;
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading data:', error);
            return null;
        }
    }

    setData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            console.log('Data saved successfully');
            this.triggerDataUpdate();
            
            // Notify other tabs
            window.dispatchEvent(new StorageEvent('storage', {
                key: this.storageKey,
                newValue: JSON.stringify(data)
            }));
            
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
                    name: "Франция",
                    description: "Страна искусства, моды и изысканной кухни. Посетите Эйфелеву башню, Лувр и провансальские поля.",
                    price: "от $800",
                    image: "images/travel-placeholder.svg",
                    tours: [
                        {
                            id: 1,
                            name: "Романтический Париж",
                            price: "$500",
                            duration: "3 дня"
                        },
                        {
                            id: 2,
                            name: "Гастрономический тур по Провансу",
                            price: "$700",
                            duration: "5 дней"
                        }
                    ]
                },
                {
                    id: 2,
                    name: "Италия",
                    description: "Страна древней истории, искусства и кулинарных традиций. Откройте для себя Рим, Венецию и Флоренцию.",
                    price: "от $750",
                    image: "images/travel-placeholder.svg",
                    tours: [
                        {
                            id: 3,
                            name: "Классический Рим",
                            price: "$600",
                            duration: "4 дня"
                        },
                        {
                            id: 4,
                            name: "Венецианские каналы",
                            price: "$550",
                            duration: "3 дня"
                        }
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
            content: {
                hero: {
                    title: 'Откройте мир с WorldTravel',
                    subtitle: 'Мы создаем незабываемые путешествия по всему миру. От экзотических пляжей до горных вершин - ваше приключение начинается здесь.'
                },
                about: {
                    title: 'О нашей компании',
                    description: 'WorldTravel - это команда профессиональных путешественников и экспертов по туризму с более чем 10-летним опытом работы. Мы специализируемся на создании индивидуальных маршрутов и уникальных travel-решений.',
                    stats: [
                        { value: 5000, label: 'Довольных клиентов' },
                        { value: 50, label: 'Стран мира' },
                        { value: '10 лет', label: 'Опыта работы' }
                    ]
                },
                services: {
                    title: 'Наши услуги'
                },
                destinations: {
                    title: 'Популярные направления',
                    subtitle: 'Откройте для себя лучшие направления мира с нашими эксклюзивными турами'
                },
                contact: {
                    title: 'Свяжитесь с нами'
                }
            },
            lastUpdate: new Date().toISOString()
        };
        return this.setData(defaultData);
    }

    // Countries management
    getCountries() {
        const data = this.getData();
        return data?.countries || [];
    }

    addCountry(country) {
        const data = this.getData();
        if (!data) return null;
        
        const newCountry = {
            id: Date.now(),
            image: 'images/travel-placeholder.svg',
            tours: [],
            ...country
        };
        
        if (!data.countries) data.countries = [];
        data.countries.push(newCountry);
        data.lastUpdate = new Date().toISOString();
        return this.setData(data) ? newCountry : null;
    }

    updateCountry(id, updates) {
        const data = this.getData();
        if (!data) return null;
        
        const countryIndex = data.countries.findIndex(c => c.id === id);
        if (countryIndex !== -1) {
            data.countries[countryIndex] = { ...data.countries[countryIndex], ...updates };
            data.lastUpdate = new Date().toISOString();
            return this.setData(data) ? data.countries[countryIndex] : null;
        }
        return null;
    }

    deleteCountry(id) {
        const data = this.getData();
        if (!data) return false;
        
        data.countries = data.countries.filter(c => c.id !== id);
        data.lastUpdate = new Date().toISOString();
        return this.setData(data);
    }

    // Tours management
    addTour(countryId, tour) {
        const data = this.getData();
        if (!data) return null;
        
        const country = data.countries.find(c => c.id === countryId);
        if (country) {
            const newTour = { id: Date.now(), ...tour };
            if (!country.tours) country.tours = [];
            country.tours.push(newTour);
            data.lastUpdate = new Date().toISOString();
            return this.setData(data) ? newTour : null;
        }
        return null;
    }

    deleteTour(countryId, tourId) {
        const data = this.getData();
        if (!data) return false;
        
        const country = data.countries.find(c => c.id === countryId);
        if (country && country.tours) {
            country.tours = country.tours.filter(t => t.id !== tourId);
            data.lastUpdate = new Date().toISOString();
            return this.setData(data);
        }
        return false;
    }

    // Content management
    getContent() {
        const data = this.getData();
        return data?.content || {};
    }

    updateContent(section, updates) {
        const data = this.getData();
        if (!data) return false;
        
        if (!data.content) data.content = {};
        if (!data.content[section]) data.content[section] = {};
        
        data.content[section] = { ...data.content[section], ...updates };
        data.lastUpdate = new Date().toISOString();
        return this.setData(data);
    }

    updateStats(newStats) {
        return this.updateContent('about', { stats: newStats });
    }

    // Contacts management
    getContacts() {
        const data = this.getData();
        return data?.contacts || {};
    }

    updateContacts(updates) {
        const data = this.getData();
        if (!data) return {};
        
        data.contacts = { ...data.contacts, ...updates };
        data.lastUpdate = new Date().toISOString();
        return this.setData(data) ? data.contacts : {};
    }

    // Settings management
    getSettings() {
        const data = this.getData();
        return data?.settings || {};
    }

    updateSettings(updates) {
        const data = this.getData();
        if (!data) return {};
        
        data.settings = { ...data.settings, ...updates };
        data.lastUpdate = new Date().toISOString();
        return this.setData(data) ? data.settings : {};
    }

    // Event system for data updates
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
        
        // Also trigger global event
        window.dispatchEvent(new CustomEvent('dataUpdated'));
    }

    // Compatibility methods
    updateCountries(countries) {
        const data = this.getData();
        if (!data) return false;
        
        data.countries = countries;
        data.lastUpdate = new Date().toISOString();
        return this.setData(data);
    }

    getDesign() {
        return { primaryColor: '#2c5aa0', secondaryColor: '#4a7bc8' };
    }

    updateDesign(design) {
        return true;
    }

    syncWithMainPage() {
        return true;
    }
}

// Global instance
window.dataManager = new DataManager();

// Auto-refresh page when data changes
window.addEventListener('dataUpdated', function() {
    console.log('Data updated, refreshing page content...');
    if (typeof loadCountriesData === 'function') {
        setTimeout(loadCountriesData, 100);
    }
});

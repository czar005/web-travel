// Improved Data Manager with force refresh and better synchronization
class DataManager {
    constructor() {
        this.storageKey = 'worldtravel_data';
        this.version = '2.0';
        this.init();
    }

    init() {
        console.log('🔄 DataManager initialized version', this.version);
        if (!this.getData()) {
            console.log('📝 Initializing default data...');
            this.setDefaultData();
        }
        
        // Listen for storage changes
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                console.log('🔄 Data changed in another tab');
                this.triggerDataUpdate();
            }
        });

        // Listen for custom data updates
        window.addEventListener('dataUpdated', () => {
            console.log('🔄 Data updated event received');
        });
    }

    getData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) {
                console.log('📭 No data found in localStorage');
                return null;
            }
            const parsed = JSON.parse(data);
            console.log('📁 Loaded data:', {
                countries: parsed.countries?.length || 0,
                tours: this.countAllTours(parsed.countries),
                version: parsed.version || '1.0'
            });
            return parsed;
        } catch (error) {
            console.error('❌ Error reading data:', error);
            return null;
        }
    }

    countAllTours(countries) {
        if (!countries) return 0;
        return countries.reduce((total, country) => total + (country.tours?.length || 0), 0);
    }

    setData(data) {
        try {
            data.version = this.version;
            data.lastUpdate = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            console.log('💾 Data saved successfully:', {
                countries: data.countries?.length || 0,
                tours: this.countAllTours(data.countries)
            });
            
            this.triggerDataUpdate();
            
            // Notify other tabs
            window.dispatchEvent(new StorageEvent('storage', {
                key: this.storageKey,
                newValue: JSON.stringify(data)
            }));
            
            return true;
        } catch (error) {
            console.error('❌ Error saving data:', error);
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
                        { value: "5000", label: "Довольных клиентов" },
                        { value: "50", label: "Стран мира" },
                        { value: "10 лет", label: "Опыта работы" }
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

    addCountry(countryData) {
        const data = this.getData();
        if (!data) return null;
        
        const newCountry = {
            id: Date.now(),
            image: 'images/travel-placeholder.svg',
            tours: [],
            ...countryData
        };
        
        if (!data.countries) data.countries = [];
        data.countries.push(newCountry);
        
        return this.setData(data) ? newCountry : null;
    }

    updateCountry(id, updates) {
        const data = this.getData();
        if (!data) return null;
        
        const countryIndex = data.countries.findIndex(c => c.id === id);
        if (countryIndex !== -1) {
            data.countries[countryIndex] = { ...data.countries[countryIndex], ...updates };
            return this.setData(data) ? data.countries[countryIndex] : null;
        }
        return null;
    }

    deleteCountry(id) {
        const data = this.getData();
        if (!data) return false;
        
        data.countries = data.countries.filter(c => c.id !== id);
        return this.setData(data);
    }

    // Tours management
    addTour(countryId, tourData) {
        const data = this.getData();
        if (!data) return null;
        
        const country = data.countries.find(c => c.id === countryId);
        if (country) {
            const newTour = { 
                id: Date.now(),
                ...tourData 
            };
            
            if (!country.tours) country.tours = [];
            country.tours.push(newTour);
            
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
        data.content[section] = { ...data.content[section], ...updates };
        
        return this.setData(data);
    }

    updateStats(stats) {
        return this.updateContent('about', { stats });
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
        return this.setData(data) ? data.settings : {};
    }

    // Force refresh
    forceRefresh() {
        console.log('🔄 Force refreshing data...');
        this.triggerDataUpdate();
        return this.getData();
    }

    // Event system
    onDataUpdate(callback) {
        this.dataUpdateCallbacks = this.dataUpdateCallbacks || [];
        this.dataUpdateCallbacks.push(callback);
    }

    triggerDataUpdate() {
        console.log('🔄 Triggering data update...');
        
        // Trigger callbacks
        if (this.dataUpdateCallbacks) {
            this.dataUpdateCallbacks.forEach(callback => {
                try {
                    callback(this.getData());
                } catch (error) {
                    console.error('Error in data update callback:', error);
                }
            });
        }
        
        // Trigger global event
        window.dispatchEvent(new CustomEvent('dataUpdated', {
            detail: { timestamp: new Date().toISOString() }
        }));
    }

    // Utility methods
    getAllTours() {
        const countries = this.getCountries();
        const allTours = [];
        countries.forEach(country => {
            if (country.tours) {
                country.tours.forEach(tour => {
                    allTours.push({
                        ...tour,
                        countryName: country.name,
                        countryId: country.id
                    });
                });
            }
        });
        return allTours;
    }

    // Debug method
    debugData() {
        const data = this.getData();
        console.log('🔍 DataManager Debug:', {
            countries: data?.countries?.length || 0,
            tours: this.getAllTours().length,
            contacts: data?.contacts ? '✓' : '✗',
            settings: data?.settings ? '✓' : '✗',
            content: data?.content ? '✓' : '✗',
            lastUpdate: data?.lastUpdate || 'never'
        });
        return data;
    }
}

// Global instance with error handling
try {
    window.dataManager = new DataManager();
    console.log('✅ DataManager loaded successfully');
} catch (error) {
    console.error('❌ Failed to initialize DataManager:', error);
    window.dataManager = {
        getData: () => null,
        setData: () => false,
        getCountries: () => [],
        debugData: () => null
    };
}

// Auto-refresh system
window.addEventListener('dataUpdated', function(e) {
    console.log('🔄 Global data update received:', e.detail?.timestamp);
    
    // Refresh admin panels
    if (typeof loadCountriesTable === 'function') {
        setTimeout(loadCountriesTable, 100);
    }
    if (typeof loadToursTable === 'function') {
        setTimeout(loadToursTable, 100);
    }
    if (typeof loadCountriesData === 'function') {
        setTimeout(loadCountriesData, 100);
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Page loaded, initializing DataManager...');
    if (window.dataManager) {
        window.dataManager.debugData();
    }
});

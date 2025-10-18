// Enhanced Data Manager with reliable update triggering
class DataManager {
    constructor() {
        this.storageKey = 'worldtravel_data';
        this.version = '3.0';
        this.updateCallbacks = [];
        this.init();
    }

    init() {
        console.log('🔄 DataManager initialized version', this.version);
        if (!this.getData()) {
            console.log('📝 Initializing default data...');
            this.setDefaultData();
        }
        
        // Listen for storage changes from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                console.log('🔄 Data changed in another tab');
                this.triggerDataUpdate();
            }
        });

        console.log('✅ DataManager ready');
    }

    getData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) {
                console.log('📭 No data found in localStorage');
                return null;
            }
            return JSON.parse(data);
        } catch (error) {
            console.error('❌ Error reading data:', error);
            return null;
        }
    }

    setData(data) {
        try {
            data.version = this.version;
            data.lastUpdate = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            console.log('💾 Data saved successfully');
            
            this.triggerDataUpdate();
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
        
        console.log('📝 Updating content for section:', section, updates);
        return this.setData(data);
    }

    updateStats(stats) {
        console.log('📊 Updating stats:', stats);
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
        console.log('📞 Updating contacts:', updates);
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
        console.log('⚙️ Updating settings:', updates);
        return this.setData(data) ? data.settings : {};
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

    // Update triggering with multiple methods for reliability
    triggerDataUpdate() {
        console.log('🔄 Triggering data update...');
        
        // Method 1: Custom event (most reliable)
        window.dispatchEvent(new CustomEvent('dataUpdated', {
            detail: { 
                timestamp: new Date().toISOString(),
                source: 'dataManager'
            }
        }));
        
        // Method 2: Call registered callbacks
        this.updateCallbacks.forEach(callback => {
            try {
                callback(this.getData());
            } catch (error) {
                console.error('Error in update callback:', error);
            }
        });
        
        // Method 3: Storage event for other tabs
        window.dispatchEvent(new StorageEvent('storage', {
            key: this.storageKey,
            newValue: localStorage.getItem(this.storageKey),
            oldValue: localStorage.getItem(this.storageKey),
            storageArea: localStorage,
            url: window.location.href
        }));
    }

    onUpdate(callback) {
        this.updateCallbacks.push(callback);
    }

    // Force refresh
    forceRefresh() {
        console.log('🔄 Force refreshing all data...');
        this.triggerDataUpdate();
        return this.getData();
    }

    // Debug
    debug() {
        const data = this.getData();
        console.log('🔍 DataManager Debug:', {
            countries: data?.countries?.length || 0,
            tours: this.getAllTours().length,
            content: data?.content ? '✓' : '✗',
            contacts: data?.contacts ? '✓' : '✗',
            settings: data?.settings ? '✓' : '✗',
            lastUpdate: data?.lastUpdate || 'never',
            version: data?.version || 'unknown'
        });
        return data;
    }
}

// Global instance
window.dataManager = new DataManager();

// Auto-debug on load
setTimeout(() => {
    if (window.dataManager) {
        window.dataManager.debug();
    }
}, 1000);

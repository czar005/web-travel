// Enhanced Data Manager with full content support
class EnhancedDataManager {
    constructor() {
        this.storageKey = 'worldtravel_data';
        this.defaultData = this.getDefaultData();
        this.init();
    }

    init() {
        console.log('🚀 Enhanced Data Manager initialized');
        this.ensureDefaultData();
        this.setupStorageListener();
    }

    getDefaultData() {
        return {
            content: {
                hero: {
                    title: 'Откройте мир с WorldTravel',
                    subtitle: 'Мы создаем незабываемые путешествия по всему миру. От экзотических пляжей до горных вершин - ваше приключение начинается здесь.',
                    image: 'images/travel-placeholder.svg'
                },
                about: {
                    title: 'О нас',
                    description: 'WorldTravel - это команда профессиональных путешественников и экспертов по туризму с более чем 10-летним опытом работы. Мы специализируемся на создании индивидуальных маршрутов и уникальных travel-решений.',
                    stats: [
                        { value: '5000', label: 'Довольных клиентов' },
                        { value: '50', label: 'Стран мира' },
                        { value: '10 лет', label: 'Опыта работы' }
                    ],
                    image: 'images/travel-placeholder.svg'
                },
                services: {
                    title: 'Услуги',
                    services: [
                        {
                            title: 'Авиабилеты',
                            description: 'Подбор и бронирование лучших авиаперелетов по выгодным ценам',
                            icon: 'fas fa-plane'
                        },
                        {
                            title: 'Отели',
                            description: 'Бронирование отелей любого уровня комфорта по всему миру',
                            icon: 'fas fa-hotel'
                        },
                        {
                            title: 'Туры',
                            description: 'Индивидуальные и групповые туры с профессиональными гидами',
                            icon: 'fas fa-map-marked-alt'
                        },
                        {
                            title: 'Страхование',
                            description: 'Полное страховое сопровождение вашего путешествия',
                            icon: 'fas fa-shield-alt'
                        }
                    ]
                },
                destinations: {
                    title: 'Направления',
                    subtitle: 'Откройте для себя лучшие направления мира с нашими эксклюзивными турами'
                },
                contact: {
                    title: 'Контакты'
                },
                footer: {
                    description: 'Ваш надежный партнер в мире путешествий.',
                    copyright: '&copy; 2024 WorldTravel. Все права защищены.'
                }
            },
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
            countries: [],
            tours: [],
            lastUpdate: new Date().toISOString()
        };
    }

    ensureDefaultData() {
        const currentData = this.getData();
        if (!currentData) {
            console.log('📝 Creating default data structure');
            this.setData(this.defaultData);
        } else {
            // Merge with default data to ensure all properties exist
            const mergedData = this.deepMerge(this.defaultData, currentData);
            this.setData(mergedData);
        }
    }

    deepMerge(target, source) {
        const result = { ...target };
        
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.deepMerge(result[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        
        return result;
    }

    getData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('❌ Error reading data:', error);
            return null;
        }
    }

    setData(data) {
        try {
            data.lastUpdate = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            
            // Trigger storage event for sync
            window.dispatchEvent(new Event('storage'));
            
            console.log('💾 Data saved successfully');
            return true;
        } catch (error) {
            console.error('❌ Error saving data:', error);
            return false;
        }
    }

    updateContent(section, field, value) {
        const data = this.getData();
        if (!data.content) data.content = {};
        if (!data.content[section]) data.content[section] = {};
        
        data.content[section][field] = value;
        return this.setData(data);
    }

    updateImage(section, imageData) {
        return this.updateContent(section, 'image', imageData);
    }

    updateStats(stats) {
        const data = this.getData();
        if (!data.content.about) data.content.about = {};
        data.content.about.stats = stats;
        return this.setData(data);
    }

    updateServices(services) {
        const data = this.getData();
        if (!data.content.services) data.content.services = {};
        data.content.services.services = services;
        return this.setData(data);
    }

    updateContacts(contacts) {
        const data = this.getData();
        data.contacts = { ...data.contacts, ...contacts };
        return this.setData(data);
    }

    updateSettings(settings) {
        const data = this.getData();
        data.settings = { ...data.settings, ...settings };
        return this.setData(data);
    }

    updateFooter(footer) {
        const data = this.getData();
        data.footer = { ...data.footer, ...footer };
        return this.setData(data);
    }

    // Country and tour management (existing functionality)
    getCountries() {
        const data = this.getData();
        return data?.countries || [];
    }

    getAllTours() {
        const data = this.getData();
        const countries = data?.countries || [];
        const allTours = [];
        
        countries.forEach(country => {
            if (country.tours && Array.isArray(country.tours)) {
                country.tours.forEach(tour => {
                    allTours.push({
                        ...tour,
                        countryId: country.id,
                        countryName: country.name
                    });
                });
            }
        });
        
        return allTours;
    }

    addCountry(countryData) {
        const data = this.getData();
        if (!data.countries) data.countries = [];
        
        const newCountry = {
            id: Date.now(),
            name: countryData.name,
            description: countryData.description,
            tours: []
        };
        
        data.countries.push(newCountry);
        return this.setData(data);
    }

    addTour(countryId, tourData) {
        const data = this.getData();
        const country = data.countries.find(c => c.id === countryId);
        
        if (country) {
            if (!country.tours) country.tours = [];
            
            const newTour = {
                id: Date.now(),
                name: tourData.name,
                price: tourData.price,
                duration: tourData.duration
            };
            
            country.tours.push(newTour);
            return this.setData(data);
        }
        
        return false;
    }

    deleteCountry(countryId) {
        const data = this.getData();
        data.countries = data.countries.filter(c => c.id !== countryId);
        return this.setData(data);
    }

    deleteTour(countryId, tourId) {
        const data = this.getData();
        const country = data.countries.find(c => c.id === countryId);
        
        if (country && country.tours) {
            country.tours = country.tours.filter(t => t.id !== tourId);
            return this.setData(data);
        }
        
        return false;
    }

    getContacts() {
        const data = this.getData();
        return data?.contacts || {};
    }

    getSettings() {
        const data = this.getData();
        return data?.settings || {};
    }

    resetToDefault() {
        return this.setData(this.getDefaultData());
    }

    forceRefresh() {
        window.dispatchEvent(new Event('storage'));
    }

    setupStorageListener() {
        window.addEventListener('storage', () => {
            console.log('📡 Storage updated, triggering sync');
        });
    }

    // Debug method
    debugData() {
        const data = this.getData();
        console.log('📊 Current data structure:', data);
        return data;
    }
}

// Initialize enhanced data manager
if (typeof window !== 'undefined') {
    window.dataManager = new EnhancedDataManager();
    console.log('✅ Enhanced Data Manager ready');
}

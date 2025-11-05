// Enhanced Data Manager with all required methods
class DataManager {
    constructor() {
        this.storageKey = 'worldtravel_data';
        this.init();
    }

    init() {
        console.log('🚀 DataManager initialized');
        this.ensureDefaultData();
        
        // Global error handler for DataManager
        window.addEventListener('error', (e) => {
            if (e.message.includes('DataManager')) {
                console.error('🚨 Global error caught for DataManager:', e.error);
            }
        });
    }

    ensureDefaultData() {
        let data = this.getData();
        if (!data) {
            data = this.getDefaultData();
            this.setData(data);
            console.log('📁 Default data created');
        }
        return data;
    }

    getDefaultData() {
        return {
            countries: [
                {
                    id: 1,
                    name: "Италия",
                    description: "Страна искусства, древней истории и самой вкусной кухни в мире.",
                    image: "images/travel-placeholder.svg",
                    tours: [
                        { id: 1, name: "Римские каникулы", price: "€600", duration: "5 дней" },
                        { id: 2, name: "Венецианская романтика", price: "€550", duration: "4 дня" }
                    ]
                },
                {
                    id: 2, 
                    name: "Франция",
                    description: "Романтическая Франция с её богатой историей и изысканной кухней.",
                    image: "images/travel-placeholder.svg",
                    tours: [
                        { id: 3, name: "Парижские огни", price: "€700", duration: "6 дней" },
                        { id: 4, name: "Лазурный берег", price: "€800", duration: "7 дней" }
                    ]
                }
            ],
            content: {
                hero: {
                    title: "Откройте мир с WorldTravel",
                    description: "Мы создаем незабываемые путешествия по всему миру. От экзотических пляжей до горных вершин - ваше приключение начинается здесь.",
                    buttonText: "Начать путешествие",
                    backgroundImage: ""
                },
                about: {
                    title: "О нас",
                    description: "WorldTravel - это команда профессиональных путешественников и экспертов по туризму с более чем 10-летним опытом работы.",
                    image: "",
                    stats: [
                        { value: "5000+", label: "Довольных клиентов" },
                        { value: "50+", label: "Стран мира" },
                        { value: "10 лет", label: "Опыта работы" }
                    ]
                },
                services: {
                    title: "Услуги",
                    description: "Наши основные направления услуг для вашего комфортного путешествия",
                    services: [
                        {
                            title: "Авиабилеты",
                            description: "Подбор и бронирование лучших авиаперелетов по выгодным ценам",
                            icon: "fas fa-plane"
                        },
                        {
                            title: "Отели", 
                            description: "Бронирование отелей любого уровня комфорта по всему миру",
                            icon: "fas fa-hotel"
                        },
                        {
                            title: "Туры",
                            description: "Индивидуальные и групповые туры с профессиональными гидами", 
                            icon: "fas fa-map-marked-alt"
                        },
                        {
                            title: "Страхование",
                            description: "Полное страховое сопровождение вашего путешествия",
                            icon: "fas fa-shield-alt"
                        }
                    ]
                },
                destinations: {
                    title: "Направления", 
                    subtitle: "Откройте для себя лучшие направления мира с нашими эксклюзивными турами"
                },
                contact: {
                    title: "Контакты",
                    description: "Свяжитесь с нами для планирования вашего идеального путешествия"
                }
            },
            contacts: {
                phone: "+7 (999) 123-45-67",
                email: "info@worldtravel.com",
                address: "Москва, ул. Туристическая, 15",
                hours: "Пн-Пт: 9:00-18:00"
            },
            settings: {
                siteTitle: "WorldTravel - Туристическая компания",
                companyName: "WorldTravel"
            },
            lastUpdate: new Date().toISOString()
        };
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
            
            // Dispatch event for other components
            window.dispatchEvent(new CustomEvent('dataUpdated', { detail: data }));
            
            console.log('💾 Data saved successfully');
            return true;
        } catch (error) {
            console.error('❌ Error saving data:', error);
            return false;
        }
    }

    // Country management
    getCountries() {
        const data = this.getData();
        return data?.countries || [];
    }

    addCountry(countryData) {
        const data = this.getData() || this.getDefaultData();
        const newCountry = {
            id: Date.now(),
            name: countryData.name,
            description: countryData.description,
            image: countryData.image || 'images/travel-placeholder.svg',
            tours: []
        };
        
        data.countries.push(newCountry);
        return this.setData(data);
    }

    updateCountry(countryId, countryData) {
        const data = this.getData();
        if (!data) return false;

        const countryIndex = data.countries.findIndex(c => c.id === countryId);
        if (countryIndex !== -1) {
            data.countries[countryIndex] = { ...data.countries[countryIndex], ...countryData };
            return this.setData(data);
        }
        return false;
    }

    deleteCountry(countryId) {
        const data = this.getData();
        if (!data) return false;

        data.countries = data.countries.filter(c => c.id !== countryId);
        return this.setData(data);
    }

    // Tour management
    getAllTours() {
        const countries = this.getCountries();
        const allTours = [];
        
        countries.forEach(country => {
            if (country.tours) {
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

    addTour(countryId, tourData) {
        const data = this.getData();
        if (!data) return false;

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
    updateContent(section, content) {
        const data = this.getData();
        if (!data) return false;

        if (!data.content) data.content = {};
        data.content[section] = { ...data.content[section], ...content };
        return this.setData(data);
    }

    // Contacts management
    getContacts() {
        const data = this.getData();
        return data?.contacts || {};
    }

    updateContacts(contacts) {
        const data = this.getData();
        if (!data) return false;

        data.contacts = { ...data.contacts, ...contacts };
        return this.setData(data);
    }

    // Settings management
    getSettings() {
        const data = this.getData();
        return data?.settings || {};
    }

    updateSettings(settings) {
        const data = this.getData();
        if (!data) return false;

        data.settings = { ...data.settings, ...settings };
        return this.setData(data);
    }

    // Stats management - FIXED: Added missing method
    updateStats(stats) {
        const data = this.getData();
        if (!data) return false;

        if (!data.content) data.content = {};
        if (!data.content.about) data.content.about = {};
        data.content.about.stats = stats;
        return this.setData(data);
    }

    // Services management - FIXED: Added missing method
    updateServices(services) {
        const data = this.getData();
        if (!data) return false;

        if (!data.content) data.content = {};
        if (!data.content.services) data.content.services = {};
        data.content.services.services = services;
        return this.setData(data);
    }

    // Force refresh
    forceRefresh() {
        const data = this.getData();
        window.dispatchEvent(new CustomEvent('dataUpdated', { detail: data }));
        return data;
    }

    // Reset to default
    resetToDefault() {
        const defaultData = this.getDefaultData();
        return this.setData(defaultData);
    }

    // Debug
    debugData() {
        const data = this.getData();
        console.log('🔍 DataManager Debug:', {
            countries: data?.countries?.length || 0,
            tours: this.getAllTours().length,
            content: data?.content ? Object.keys(data.content) : [],
            lastUpdate: data?.lastUpdate
        });
        return data;
    }
}

// Initialize DataManager
if (typeof window !== 'undefined') {
    window.dataManager = new DataManager();
    console.log('✅ DataManager ready with all methods');
}

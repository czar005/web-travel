// Unified Data Manager - handles all data operations
class DataManager {
    constructor() {
        this.storageKey = 'worldtravel_data';
        this.init();
    }

    init() {
        console.log('🚀 DataManager initialized');
        this.ensureDefaultData();
    }

    ensureDefaultData() {
        let data = this.getData();
        if (!data) {
            data = this.getDefaultData();
            this.setData(data);
            console.log('📝 Default data created');
        }
        return data;
    }

    getDefaultData() {
        return {
            countries: [
                {
                    id: 1,
                    name: "Турция",
                    description: "Страна на стыке Европы и Азии с богатой историей и прекрасными пляжами.",
                    tours: [
                        { id: 1, name: "Анталия - Все включено", price: "45,000 ₽", duration: "7 ночей" },
                        { id: 2, name: "Стамбул - Город контрастов", price: "38,000 ₽", duration: "5 ночей" }
                    ]
                },
                {
                    id: 2,
                    name: "Египет",
                    description: "Древняя страна пирамид и красочных коралловых рифов.",
                    tours: [
                        { id: 1, name: "Хургада - Дайвинг тур", price: "52,000 ₽", duration: "8 ночей" },
                        { id: 2, name: "Шарм-эль-Шейх - Райский отдых", price: "48,000 ₽", duration: "7 ночей" }
                    ]
                },
                {
                    id: 3,
                    name: "Таиланд",
                    description: "Экзотическая страна улыбок, храмов и тропических островов.",
                    tours: [
                        { id: 1, name: "Пхукет - Пляжный рай", price: "65,000 ₽", duration: "10 ночей" },
                        { id: 2, name: "Бангкок - Столица контрастов", price: "58,000 ₽", duration: "8 ночей" }
                    ]
                }
            ],
            contacts: {
                phone: "+7 (999) 123-45-67",
                email: "info@worldtravel.com",
                address: "Москва, ул. Туристическая, 15",
                hours: "Пн-Пт: 9:00-18:00"
            },
            content: {
                hero: {
                    title: "Откройте мир с WorldTravel",
                    subtitle: "Мы создаем незабываемые путешествия по всему миру. От экзотических пляжей до горных вершин - ваше приключение начинается здесь.",
                    image: "images/travel-placeholder.svg"
                },
                about: {
                    title: "О нас",
                    description: "WorldTravel - это команда профессиональных путешественников и экспертов по туризму с более чем 10-летним опытом работы. Мы специализируемся на создании индивидуальных маршрутов и уникальных travel-решений.",
                    image: "images/travel-placeholder.svg",
                    stats: [
                        { value: "5000", label: "Довольных клиентов" },
                        { value: "50", label: "Стран мира" },
                        { value: "10 лет", label: "Опыта работы" }
                    ]
                },
                services: {
                    title: "Услуги",
                    services: [
                        { title: "Авиабилеты", description: "Подбор и бронирование лучших авиаперелетов по выгодным ценам", icon: "fas fa-plane" },
                        { title: "Отели", description: "Бронирование отелей любого уровня комфорта по всему миру", icon: "fas fa-hotel" },
                        { title: "Туры", description: "Индивидуальные и групповые туры с профессиональными гидами", icon: "fas fa-map-marked-alt" },
                        { title: "Страхование", description: "Полное страховое сопровождение вашего путешествия", icon: "fas fa-shield-alt" }
                    ]
                },
                destinations: {
                    title: "Направления",
                    subtitle: "Откройте для себя лучшие направления мира с нашими эксклюзивными турами"
                },
                contact: {
                    title: "Контакты"
                }
            },
            footer: {
                description: "Ваш надежный партнер в мире путешествий.",
                copyright: "&copy; 2024 WorldTravel. Все права защищены."
            },
            settings: {
                siteTitle: "WorldTravel - Туристическая компания",
                companyName: "WorldTravel"
            },
            pageStructure: ["hero", "about", "services", "destinations", "contact"],
            lastUpdate: new Date().toISOString()
        };
    }

    // Core data methods
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
            
            // Dispatch custom event for synchronization
            const event = new CustomEvent('worldtravelDataUpdated', { 
                detail: { data: data, timestamp: data.lastUpdate }
            });
            window.dispatchEvent(event);
            
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
        const data = this.getData();
        if (!data) return false;

        const newCountry = {
            id: Date.now(),
            name: countryData.name,
            description: countryData.description,
            tours: []
        };

        data.countries.push(newCountry);
        return this.setData(data);
    }

    updateCountry(countryId, countryData) {
        const data = this.getData();
        if (!data) return false;

        const countryIndex = data.countries.findIndex(c => c.id === countryId);
        if (countryIndex === -1) return false;

        data.countries[countryIndex] = { ...data.countries[countryIndex], ...countryData };
        return this.setData(data);
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
        if (!country) return false;

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

    deleteTour(countryId, tourId) {
        const data = this.getData();
        if (!data) return false;

        const country = data.countries.find(c => c.id === countryId);
        if (!country || !country.tours) return false;

        country.tours = country.tours.filter(t => t.id !== tourId);
        return this.setData(data);
    }

    // Content management
    getContent() {
        const data = this.getData();
        return data?.content || {};
    }

    updateContent(contentData) {
        const data = this.getData();
        if (!data) return false;

        data.content = { ...data.content, ...contentData };
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

    // Footer management
    getFooter() {
        const data = this.getData();
        return data?.footer || {};
    }

    updateFooter(footer) {
        const data = this.getData();
        if (!data) return false;

        data.footer = { ...data.footer, ...footer };
        return this.setData(data);
    }

    // Utility methods
    forceRefresh() {
        const data = this.getData();
        if (data) {
            const event = new CustomEvent('worldtravelDataUpdated', { 
                detail: { data: data, force: true }
            });
            window.dispatchEvent(event);
        }
        return data;
    }

    debugData() {
        const data = this.getData();
        console.log('🔍 DataManager Debug:', {
            countries: data?.countries?.length || 0,
            tours: this.getAllTours().length,
            contacts: data?.contacts,
            lastUpdate: data?.lastUpdate
        });
        return data;
    }
}

// Initialize global data manager
window.dataManager = new DataManager();
console.log('✅ DataManager ready');

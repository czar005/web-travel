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
        } else if (!data.countries) {
            data.countries = this.getDefaultData().countries;
            this.setData(data);
            console.log('📝 Countries array added to existing data');
        }
        return data;
    }

    getDefaultData() {
        return {
            countries: [
                {
                    id: 1,
                    name: "Турция",
                    description: "Страна на стыке Европы и Азии с богатой историей и прекрасными пляжами Средиземноморья.",
                    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                    flag: "🇹🇷",
                    popular: true,
                    season: "Круглый год",
                    tours: [
                        { id: 1, name: "Анталия - Все включено", price: "45,000 ₽", duration: "7 ночей", rating: 4.8 },
                        { id: 2, name: "Стамбул - Город контрастов", price: "38,000 ₽", duration: "5 ночей", rating: 4.6 }
                    ]
                },
                {
                    id: 2,
                    name: "Египет",
                    description: "Древняя страна пирамид, фараонов и красочных коралловых рифов Красного моря.",
                    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                    flag: "🇪🇬",
                    popular: true,
                    season: "Октябрь - Апрель",
                    tours: [
                        { id: 1, name: "Хургада - Дайвинг тур", price: "52,000 ₽", duration: "8 ночей", rating: 4.9 },
                        { id: 2, name: "Шарм-эль-Шейх - Райский отдых", price: "48,000 ₽", duration: "7 ночей", rating: 4.7 }
                    ]
                },
                {
                    id: 3,
                    name: "Таиланд",
                    description: "Экзотическая страна улыбок, древних храмов и тропических островов.",
                    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                    flag: "🇹🇭",
                    popular: true,
                    season: "Ноябрь - Февраль",
                    tours: [
                        { id: 1, name: "Пхукет - Пляжный рай", price: "65,000 ₽", duration: "10 ночей", rating: 4.8 },
                        { id: 2, name: "Бангкок - Столица контрастов", price: "58,000 ₽", duration: "8 ночей", rating: 4.5 }
                    ]
                },
                {
                    id: 4,
                    name: "Италия",
                    description: "Колыбель искусства, моды и самой вкусной кухни в сердце Средиземноморья.",
                    image: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                    flag: "🇮🇹",
                    popular: false,
                    season: "Апрель - Октябрь",
                    tours: [
                        { id: 1, name: "Рим - Вечный город", price: "78,000 ₽", duration: "6 ночей", rating: 4.9 },
                        { id: 2, name: "Венеция - Город на воде", price: "82,000 ₽", duration: "5 ночей", rating: 4.7 }
                    ]
                },
                {
                    id: 5,
                    name: "Испания",
                    description: "Страна фламенко, корриды и солнечных пляжей Коста-Брава.",
                    image: "https://images.unsplash.com/photo-1543785734-4b6e564642f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                    flag: "🇪🇸",
                    popular: false,
                    season: "Май - Сентябрь",
                    tours: [
                        { id: 1, name: "Барселона - Столица Каталонии", price: "68,000 ₽", duration: "7 ночей", rating: 4.8 },
                        { id: 2, name: "Мадрид - Королевский город", price: "72,000 ₽", duration: "6 ночей", rating: 4.6 }
                    ]
                },
                {
                    id: 6,
                    name: "ОАЭ",
                    description: "Современные мегаполисы, роскошные отели и золотые пустыни Аравии.",
                    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
                    flag: "🇦🇪",
                    popular: true,
                    season: "Октябрь - Апрель",
                    tours: [
                        { id: 1, name: "Дубай - Город будущего", price: "89,000 ₽", duration: "7 ночей", rating: 4.9 },
                        { id: 2, name: "Абу-Даби - Столица эмиратов", price: "85,000 ₽", duration: "6 ночей", rating: 4.7 }
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
            if (!data) return null;
            
            const parsed = JSON.parse(data);
            if (!parsed.countries) {
                parsed.countries = [];
            }
            return parsed;
        } catch (error) {
            console.error('❌ Error reading data:', error);
            return null;
        }
    }

    setData(data) {
        try {
            if (!data.countries) {
                data.countries = [];
            }
            
            data.lastUpdate = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            
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
        if (!data) {
            console.error('❌ No data available');
            return false;
        }

        if (!Array.isArray(data.countries)) {
            data.countries = [];
        }

        const newCountry = {
            id: Date.now(),
            name: countryData.name,
            description: countryData.description,
            image: countryData.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
            flag: countryData.flag || "🇺🇳",
            popular: countryData.popular || false,
            season: countryData.season || "Круглый год",
            tours: []
        };

        data.countries.push(newCountry);
        return this.setData(data);
    }

    updateCountry(countryId, countryData) {
        const data = this.getData();
        if (!data) return false;

        if (!Array.isArray(data.countries)) {
            data.countries = [];
            return false;
        }

        const countryIndex = data.countries.findIndex(c => c.id === countryId);
        if (countryIndex === -1) return false;

        data.countries[countryIndex] = { ...data.countries[countryIndex], ...countryData };
        return this.setData(data);
    }

    deleteCountry(countryId) {
        const data = this.getData();
        if (!data) return false;

        if (!Array.isArray(data.countries)) {
            data.countries = [];
            return false;
        }

        data.countries = data.countries.filter(c => c.id !== countryId);
        return this.setData(data);
    }

    // Tour management
    getAllTours() {
        const countries = this.getCountries();
        const allTours = [];
        
        countries.forEach(country => {
            if (country.tours && Array.isArray(country.tours)) {
                country.tours.forEach(tour => {
                    allTours.push({
                        ...tour,
                        countryId: country.id,
                        countryName: country.name,
                        countryImage: country.image,
                        countryFlag: country.flag
                    });
                });
            }
        });
        
        return allTours;
    }

    addTour(countryId, tourData) {
        const data = this.getData();
        if (!data) return false;

        if (!Array.isArray(data.countries)) {
            data.countries = [];
            return false;
        }

        const country = data.countries.find(c => c.id === countryId);
        if (!country) return false;

        if (!Array.isArray(country.tours)) {
            country.tours = [];
        }

        const newTour = {
            id: Date.now(),
            name: tourData.name,
            price: tourData.price,
            duration: tourData.duration,
            rating: tourData.rating || 4.5
        };

        country.tours.push(newTour);
        return this.setData(data);
    }

    deleteTour(countryId, tourId) {
        const data = this.getData();
        if (!data) return false;

        if (!Array.isArray(data.countries)) {
            data.countries = [];
            return false;
        }

        const country = data.countries.find(c => c.id === countryId);
        if (!country || !Array.isArray(country.tours)) return false;

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

        if (!data.content) {
            data.content = {};
        }

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
            dataExists: !!data,
            countries: data?.countries ? `Array(${data.countries.length})` : 'undefined',
            tours: this.getAllTours().length,
            contacts: data?.contacts,
            lastUpdate: data?.lastUpdate
        });
        return data;
    }

    resetToDefault() {
        const defaultData = this.getDefaultData();
        return this.setData(defaultData);
    }

    repairData() {
        const data = this.getData();
        if (!data) {
            return this.setData(this.getDefaultData());
        }
        
        const defaultData = this.getDefaultData();
        const repairedData = { ...defaultData, ...data };
        
        if (!Array.isArray(repairedData.countries)) {
            repairedData.countries = defaultData.countries;
        }
        
        return this.setData(repairedData);
    }
}

window.dataManager = new DataManager();
console.log('✅ DataManager ready');

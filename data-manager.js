// Unified Data Manager - handles all data operations
class DataManager {
    constructor() {
        this.storageKey = 'worldtravel_data';
        this.initialized = false;
        this.defaultImage = 'images/travel-placeholder.svg';
        this.init();
    }

    init() {
        console.log('🚀 DataManager initializing...');
        
        try {
            if (this.initialized) {
                console.log('⚠️ DataManager already initialized');
                return;
            }

            this.ensureDefaultData();
            this.initialized = true;
            console.log('✅ DataManager initialized successfully');
        } catch (error) {
            console.error('❌ DataManager initialization failed:', error);
            this.emergencyRecovery();
        }
    }

    emergencyRecovery() {
        console.log('🔄 Attempting emergency recovery...');
        try {
            localStorage.removeItem(this.storageKey);
            const defaultData = this.getDefaultData();
            localStorage.setItem(this.storageKey, JSON.stringify(defaultData));
            console.log('✅ Emergency recovery completed');
            this.initialized = true;
        } catch (error) {
            console.error('❌ Emergency recovery failed:', error);
        }
    }

    ensureDefaultData() {
        try {
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
        } catch (error) {
            console.error('❌ Error ensuring default data:', error);
            throw error;
        }
    }

    getDefaultData() {
        return {
            countries: [
                {
                    id: 1,
                    name: "Турция",
                    description: "Страна на стыке Европы и Азии с богатой историей и прекрасными пляжами Средиземноморья.",
                    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
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
                    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
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
                    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
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
                    image: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
                    flag: "🇮🇹",
                    popular: false,
                    season: "Апрель - Октябрь",
                    tours: [
                        { id: 1, name: "Рим - Вечный город", price: "78,000 ₽", duration: "6 ночей", rating: 4.9 },
                        { id: 2, name: "Венеция - Город на воде", price: "82,000 ₽", duration: "5 ночей", rating: 4.7 }
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
                    description: "WorldTravel - это команда профессиональных путешественников и экспертов по туризму с более чем 10-летним опытом работы. Мы специализируемны на создании индивидуальных маршрутов и уникальных travel-решений.",
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

    getData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) {
                console.log('📭 No data found in localStorage');
                return null;
            }
            
            const parsed = JSON.parse(data);
            
            if (typeof parsed !== 'object' || parsed === null) {
                console.error('❌ Invalid data structure in localStorage');
                return null;
            }
            
            // Ensure all country images are valid
            if (parsed.countries && Array.isArray(parsed.countries)) {
                parsed.countries = parsed.countries.map(country => ({
                    ...country,
                    image: country.image && country.image !== 'undefined' ? country.image : this.defaultImage
                }));
            } else {
                parsed.countries = [];
            }
            
            return parsed;
        } catch (error) {
            console.error('❌ Error reading data from localStorage:', error);
            return null;
        }
    }

    setData(data) {
        try {
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid data provided to setData');
            }

            // Validate and clean country images before saving
            if (Array.isArray(data.countries)) {
                data.countries = data.countries.map(country => ({
                    ...country,
                    image: country.image && country.image !== 'undefined' ? country.image : this.defaultImage
                }));
            } else {
                data.countries = [];
            }

            data.lastUpdate = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            
            const event = new CustomEvent('worldtravelDataUpdated', { 
                detail: { 
                    data: data, 
                    timestamp: data.lastUpdate,
                    source: 'DataManager'
                }
            });
            
            setTimeout(() => {
                try {
                    window.dispatchEvent(event);
                } catch (eventError) {
                    console.error('❌ Error dispatching event:', eventError);
                }
            }, 0);
            
            console.log('💾 Data saved successfully');
            return true;
        } catch (error) {
            console.error('❌ Error saving data to localStorage:', error);
            return false;
        }
    }

    getCountries() {
        try {
            const data = this.getData();
            const countries = data?.countries || [];
            
            // Final validation before returning
            return countries.map(country => ({
                ...country,
                image: country.image && country.image !== 'undefined' ? country.image : this.defaultImage
            }));
        } catch (error) {
            console.error('❌ Error getting countries:', error);
            return [];
        }
    }

    addCountry(countryData) {
        try {
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
                name: countryData.name || 'Новая страна',
                description: countryData.description || '',
                image: (countryData.image && countryData.image !== 'undefined') ? countryData.image : this.defaultImage,
                flag: countryData.flag || "🇺🇳",
                popular: countryData.popular || false,
                season: countryData.season || "Круглый год",
                tours: []
            };

            data.countries.push(newCountry);
            return this.setData(data);
        } catch (error) {
            console.error('❌ Error adding country:', error);
            return false;
        }
    }

    getAllTours() {
        try {
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
        } catch (error) {
            console.error('❌ Error getting all tours:', error);
            return [];
        }
    }

    addTour(countryId, tourData) {
        try {
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
                name: tourData.name || 'Новый тур',
                price: tourData.price || '0 ₽',
                duration: tourData.duration || '0 ночей',
                rating: tourData.rating || 4.5
            };

            country.tours.push(newTour);
            return this.setData(data);
        } catch (error) {
            console.error('❌ Error adding tour:', error);
            return false;
        }
    }

    getContent() {
        try {
            const data = this.getData();
            return data?.content || {};
        } catch (error) {
            console.error('❌ Error getting content:', error);
            return {};
        }
    }

    updateContent(contentData) {
        try {
            const data = this.getData();
            if (!data) return false;

            if (!data.content) {
                data.content = {};
            }

            data.content = { ...data.content, ...contentData };
            return this.setData(data);
        } catch (error) {
            console.error('❌ Error updating content:', error);
            return false;
        }
    }

    getContacts() {
        try {
            const data = this.getData();
            return data?.contacts || {};
        } catch (error) {
            console.error('❌ Error getting contacts:', error);
            return {};
        }
    }

    updateContacts(contacts) {
        try {
            const data = this.getData();
            if (!data) return false;

            data.contacts = { ...data.contacts, ...contacts };
            return this.setData(data);
        } catch (error) {
            console.error('❌ Error updating contacts:', error);
            return false;
        }
    }

    getSettings() {
        try {
            const data = this.getData();
            return data?.settings || {};
        } catch (error) {
            console.error('❌ Error getting settings:', error);
            return {};
        }
    }

    updateSettings(settings) {
        try {
            const data = this.getData();
            if (!data) return false;

            data.settings = { ...data.settings, ...settings };
            return this.setData(data);
        } catch (error) {
            console.error('❌ Error updating settings:', error);
            return false;
        }
    }

    forceRefresh() {
        try {
            const data = this.getData();
            if (data) {
                const event = new CustomEvent('worldtravelDataUpdated', { 
                    detail: { data: data, force: true, source: 'forceRefresh' }
                });
                setTimeout(() => window.dispatchEvent(event), 0);
            }
            return data;
        } catch (error) {
            console.error('❌ Error in forceRefresh:', error);
            return null;
        }
    }

    debugData() {
        try {
            const data = this.getData();
            console.log('🔍 DataManager Debug:', {
                dataExists: !!data,
                countries: data?.countries ? `Array(${data.countries.length})` : 'undefined',
                tours: this.getAllTours().length,
                contacts: data?.contacts,
                lastUpdate: data?.lastUpdate,
                initialized: this.initialized
            });
            return data;
        } catch (error) {
            console.error('❌ Error in debugData:', error);
            return null;
        }
    }

    resetToDefault() {
        try {
            const defaultData = this.getDefaultData();
            return this.setData(defaultData);
        } catch (error) {
            console.error('❌ Error resetting to default:', error);
            return false;
        }
    }

    repairData() {
        try {
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
        } catch (error) {
            console.error('❌ Error repairing data:', error);
            return false;
        }
    }

    // New method to fix image URLs
    fixAllImages() {
        try {
            const data = this.getData();
            if (!data || !Array.isArray(data.countries)) return false;

            let fixed = false;
            data.countries = data.countries.map(country => {
                if (!country.image || country.image === 'undefined' || country.image.includes('undefined')) {
                    fixed = true;
                    return {
                        ...country,
                        image: this.defaultImage
                    };
                }
                return country;
            });

            if (fixed) {
                console.log('🖼️ Fixed broken image URLs');
                return this.setData(data);
            }
            
            return true;
        } catch (error) {
            console.error('❌ Error fixing images:', error);
            return false;
        }
    }
}

function initializeDataManager() {
    try {
        if (window.dataManager && window.dataManager.initialized) {
            console.log('ℹ️ DataManager already exists and initialized');
            return window.dataManager;
        }
        
        window.dataManager = new DataManager();
        
        // Fix any broken images on startup
        setTimeout(() => {
            if (window.dataManager.fixAllImages) {
                window.dataManager.fixAllImages();
            }
        }, 1000);
        
        window.addEventListener('error', function(e) {
            if (e.message && e.message.includes('dataManager')) {
                console.error('🚨 Global error caught for DataManager:', e);
            }
        });
        
        return window.dataManager;
    } catch (error) {
        console.error('❌ Critical error initializing DataManager:', error);
        
        window.dataManager = {
            initialized: false,
            getData: () => ({ countries: [], contacts: {}, content: {}, settings: {} }),
            setData: () => false,
            getCountries: () => [],
            debugData: () => console.log('⚠️ DataManager in fallback mode')
        };
        
        return window.dataManager;
    }
}

initializeDataManager();
console.log('✅ DataManager setup completed');

// Enhanced data structure for page editor
DataManager.prototype.getEnhancedDefaultData = function() {
    return {
        countries: [],
        tours: [],
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
        footer: {
            description: "Ваш надежный партнер в мире путешествий.",
            copyright: "&copy; 2024 WorldTravel. Все права защищены."
        },
        content: {
            hero: {
                title: "Откройте мир с WorldTravel",
                description: "Мы создаем незабываемые путешествия по всему миру. От экзотических пляжей до горных вершин - ваше приключение начинается здесь.",
                buttonText: "Начать путешествие",
                backgroundImage: ""
            },
            about: {
                title: "О нас",
                description: "WorldTravel - это команда профессиональных путешественников и экспертов по туризму с более чем 10-летним опытом работы. Мы специализируемся на создании индивидуальных маршрутов и уникальных travel-решений.",
                image: "",
                stats: [
                    { value: "5000", label: "Довольных клиентов" },
                    { value: "50", label: "Стран мира" },
                    { value: "10 лет", label: "Опыта работы" }
                ]
            },
            services: {
                title: "Услуги",
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
                title: "Контакты"
            }
        },
        lastUpdate: new Date().toISOString()
    };
};

// Ensure enhanced data structure
DataManager.prototype.ensureEnhancedData = function() {
    const data = this.getData();
    const defaultData = this.getEnhancedDefaultData();
    
    let needsUpdate = false;
    
    // Ensure content structure exists
    if (!data.content) {
        data.content = defaultData.content;
        needsUpdate = true;
    } else {
        // Ensure each content section exists with proper structure
        Object.keys(defaultData.content).forEach(section => {
            if (!data.content[section]) {
                data.content[section] = defaultData.content[section];
                needsUpdate = true;
            } else {
                // Ensure section has all required fields
                Object.keys(defaultData.content[section]).forEach(field => {
                    if (data.content[section][field] === undefined) {
                        data.content[section][field] = defaultData.content[section][field];
                        needsUpdate = true;
                    }
                });
            }
        });
    }
    
    // Ensure footer exists
    if (!data.footer) {
        data.footer = defaultData.footer;
        needsUpdate = true;
    }
    
    if (needsUpdate) {
        this.setData(data);
        console.log('✅ Enhanced data structure ensured');
    }
    
    return data;
};

// Override ensureDefaultData to use enhanced structure
DataManager.prototype.ensureDefaultData = function() {
    return this.ensureEnhancedData();
};

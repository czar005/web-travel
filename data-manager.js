// Enhanced Data Manager with better sync
(function() {
    'use strict';
    
    console.log('🔄 Data Manager loading...');
    
    const STORAGE_KEY = 'worldtravel_data';
    
    function DataManager() {
        this.data = this.loadData();
        this.init();
    }
    
    DataManager.prototype.init = function() {
        console.log('🚀 Data Manager initialized with:', {
            countries: this.data.countries.length,
            tours: this.getAllTours().length,
            hasContent: !!this.data.content
        });
        
        // Ensure default structure
        this.ensureDefaultData();
    };
    
    DataManager.prototype.loadData = function() {
        try {
            // Try localStorage first
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                console.log('📁 Data loaded from localStorage');
                return this.migrateData(data);
            }
            
            // Try sessionStorage as fallback
            const sessionStored = sessionStorage.getItem(STORAGE_KEY);
            if (sessionStored) {
                const data = JSON.parse(sessionStored);
                console.log('💾 Data loaded from sessionStorage');
                return this.migrateData(data);
            }
            
            console.log('📝 No stored data found, creating default');
            return this.getDefaultData();
            
        } catch (error) {
            console.error('❌ Error loading data:', error);
            return this.getDefaultData();
        }
    };
    
    DataManager.prototype.migrateData = function(data) {
        // Ensure all required structures exist
        if (!data.countries) data.countries = [];
        if (!data.tours) data.tours = [];
        if (!data.contacts) data.contacts = {};
        if (!data.settings) data.settings = {};
        if (!data.content) data.content = this.getDefaultData().content;
        
        // Ensure content structure
        const defaultContent = this.getDefaultData().content;
        if (!data.content.hero) data.content.hero = defaultContent.hero;
        if (!data.content.about) data.content.about = defaultContent.about;
        if (!data.content.services) data.content.services = defaultContent.services;
        if (!data.content.destinations) data.content.destinations = defaultContent.destinations;
        if (!data.content.contact) data.content.contact = defaultContent.contact;
        
        return data;
    };
    
    DataManager.prototype.getDefaultData = function() {
        return {
            countries: [],
            tours: [],
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
                    description: 'Мы создаем незабываемые путешествия по всему миру. От экзотических пляжей до горных вершин - ваше приключение начинается здесь.',
                    buttonText: 'Начать путешествие'
                },
                about: {
                    title: 'О нас',
                    description: 'WorldTravel - это команда профессиональных путешественников и экспертов по туризму с более чем 10-летним опытом работы. Мы специализируемся на создании индивидуальных маршрутов и уникальных travel-решений.',
                    stats: [
                        { value: '5000+', label: 'Довольных клиентов' },
                        { value: '50+', label: 'Стран мира' },
                        { value: '10 лет', label: 'Опыта работы' }
                    ]
                },
                services: {
                    title: 'Услуги',
                    description: 'Наши основные направления услуг для вашего комфортного путешествия',
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
                        }
                    ]
                },
                destinations: {
                    title: 'Направления', 
                    subtitle: 'Откройте для себя лучшие направления мира с нашими эксклюзивными турами'
                },
                contact: {
                    title: 'Контакты',
                    description: 'Свяжитесь с нами для планирования вашего идеального путешествия'
                }
            },
            lastUpdate: new Date().toISOString()
        };
    };
    
    DataManager.prototype.ensureDefaultData = function() {
        const defaultData = this.getDefaultData();
        let needsSave = false;
        
        // Ensure contacts
        if (!this.data.contacts || Object.keys(this.data.contacts).length === 0) {
            this.data.contacts = defaultData.contacts;
            needsSave = true;
        }
        
        // Ensure settings
        if (!this.data.settings || Object.keys(this.data.settings).length === 0) {
            this.data.settings = defaultData.settings;
            needsSave = true;
        }
        
        // Ensure content structure
        if (!this.data.content) {
            this.data.content = defaultData.content;
            needsSave = true;
        } else {
            // Ensure each content section exists
            Object.keys(defaultData.content).forEach(section => {
                if (!this.data.content[section]) {
                    this.data.content[section] = defaultData.content[section];
                    needsSave = true;
                }
            });
        }
        
        if (needsSave) {
            this.saveData();
            console.log('✅ Default data ensured');
        }
    };
    
    DataManager.prototype.saveData = function() {
        try {
            this.data.lastUpdate = new Date().toISOString();
            
            // Save to both storage systems for redundancy
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
            
            console.log('💾 Data saved successfully');
            
            // Trigger sync event
            this.triggerDataUpdate();
            
            return true;
        } catch (error) {
            console.error('❌ Error saving data:', error);
            return false;
        }
    };
    
    DataManager.prototype.triggerDataUpdate = function() {
        // Dispatch custom event for sync systems
        const event = new CustomEvent('dataUpdated', {
            detail: { data: this.data }
        });
        window.dispatchEvent(event);
        
        // Also trigger storage event for cross-tab sync
        window.dispatchEvent(new StorageEvent('storage', {
            key: STORAGE_KEY,
            newValue: JSON.stringify(this.data)
        }));
    };
    
    DataManager.prototype.getData = function() {
        return this.data;
    };
    
    DataManager.prototype.setData = function(newData) {
        this.data = { ...this.data, ...newData };
        return this.saveData();
    };
    
    // Countries management
    DataManager.prototype.getCountries = function() {
        return this.data.countries || [];
    };
    
    DataManager.prototype.addCountry = function(countryData) {
        const newCountry = {
            id: Date.now(),
            name: countryData.name,
            description: countryData.description,
            image: countryData.image,
            tours: []
        };
        
        this.data.countries.push(newCountry);
        const success = this.saveData();
        
        if (success) {
            console.log('✅ Country added:', newCountry.name);
        }
        
        return success;
    };
    
    DataManager.prototype.updateCountry = function(countryId, updates) {
        const country = this.data.countries.find(c => c.id === countryId);
        if (country) {
            Object.assign(country, updates);
            return this.saveData();
        }
        return false;
    };
    
    DataManager.prototype.deleteCountry = function(countryId) {
        const index = this.data.countries.findIndex(c => c.id === countryId);
        if (index !== -1) {
            this.data.countries.splice(index, 1);
            return this.saveData();
        }
        return false;
    };
    
    // Tours management
    DataManager.prototype.getAllTours = function() {
        const allTours = [];
        this.data.countries.forEach(country => {
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
    };
    
    DataManager.prototype.addTour = function(countryId, tourData) {
        const country = this.data.countries.find(c => c.id === countryId);
        if (country) {
            if (!country.tours) country.tours = [];
            
            const newTour = {
                id: Date.now(),
                name: tourData.name,
                price: tourData.price,
                duration: tourData.duration
            };
            
            country.tours.push(newTour);
            const success = this.saveData();
            
            if (success) {
                console.log('✅ Tour added:', newTour.name);
            }
            
            return success;
        }
        return false;
    };
    
    DataManager.prototype.deleteTour = function(countryId, tourId) {
        const country = this.data.countries.find(c => c.id === countryId);
        if (country && country.tours) {
            const index = country.tours.findIndex(t => t.id === tourId);
            if (index !== -1) {
                country.tours.splice(index, 1);
                return this.saveData();
            }
        }
        return false;
    };
    
    // Contacts management
    DataManager.prototype.getContacts = function() {
        return this.data.contacts || {};
    };
    
    DataManager.prototype.updateContacts = function(updates) {
        this.data.contacts = { ...this.data.contacts, ...updates };
        return this.saveData();
    };
    
    // Settings management
    DataManager.prototype.getSettings = function() {
        return this.data.settings || {};
    };
    
    DataManager.prototype.updateSettings = function(updates) {
        this.data.settings = { ...this.data.settings, ...updates };
        return this.saveData();
    };
    
    // Content management
    DataManager.prototype.getContent = function() {
        return this.data.content || {};
    };
    
    DataManager.prototype.updateContent = function(section, updates) {
        if (!this.data.content) this.data.content = {};
        if (!this.data.content[section]) this.data.content[section] = {};
        
        this.data.content[section] = { ...this.data.content[section], ...updates };
        return this.saveData();
    };
    
    // Initialize global instance
    if (!window.dataManager) {
        window.dataManager = new DataManager();
        console.log('✅ Data Manager ready');
    }
    
})();

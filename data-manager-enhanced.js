// Enhanced Data Manager with Event System
(function() {
    'use strict';
    
    console.log('🔄 ENHANCED DATA MANAGER LOADING...');
    
    const STORAGE_KEY = 'worldtravel_data';
    
    function DataManager() {
        this.data = this.loadData();
        this.init();
    }
    
    DataManager.prototype.init = function() {
        console.log('🚀 Enhanced Data Manager initialized');
        this.ensureDefaultData();
        this.setupStorageListener();
    };
    
    DataManager.prototype.setupStorageListener = function() {
        // Слушаем изменения в localStorage от других вкладок
        window.addEventListener('storage', (e) => {
            if (e.key === STORAGE_KEY && e.newValue) {
                console.log('📡 Storage event detected, reloading data');
                this.data = JSON.parse(e.newValue);
                this.triggerDataUpdate();
            }
        });
    };
    
    DataManager.prototype.loadData = function() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                console.log('📁 Data loaded from localStorage');
                return this.migrateData(data);
            }
            
            console.log('📝 No stored data, creating default');
            return this.getDefaultData();
            
        } catch (error) {
            console.error('❌ Error loading data:', error);
            return this.getDefaultData();
        }
    };
    
    DataManager.prototype.migrateData = function(data) {
        const defaultData = this.getDefaultData();
        
        // Ensure all structures exist
        if (!data.countries) data.countries = [];
        if (!data.tours) data.tours = [];
        if (!data.contacts) data.contacts = defaultData.contacts;
        if (!data.settings) data.settings = defaultData.settings;
        if (!data.content) data.content = defaultData.content;
        
        // Ensure content sections
        Object.keys(defaultData.content).forEach(section => {
            if (!data.content[section]) {
                data.content[section] = defaultData.content[section];
            } else {
                // Merge section data to preserve new fields
                data.content[section] = { ...defaultData.content[section], ...data.content[section] };
            }
        });
        
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
        
        Object.keys(defaultData).forEach(key => {
            if (!this.data[key] || (typeof this.data[key] === 'object' && Object.keys(this.data[key]).length === 0)) {
                this.data[key] = defaultData[key];
                needsSave = true;
            }
        });
        
        if (needsSave) {
            this.saveData();
        }
    };
    
    DataManager.prototype.saveData = function() {
        try {
            this.data.lastUpdate = new Date().toISOString();
            
            // Save to both storage systems
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
            
            console.log('💾 Data saved:', {
                countries: this.data.countries.length,
                tours: this.getAllTours().length,
                content: Object.keys(this.data.content || {})
            });
            
            // Trigger update events
            this.triggerDataUpdate();
            this.triggerContentSaved();
            
            return true;
        } catch (error) {
            console.error('❌ Error saving data:', error);
            return false;
        }
    };
    
    DataManager.prototype.triggerDataUpdate = function() {
        // Custom event for sync systems
        window.dispatchEvent(new CustomEvent('dataUpdated', {
            detail: { data: this.data, timestamp: new Date() }
        }));
        
        // Storage event for cross-tab sync
        window.dispatchEvent(new StorageEvent('storage', {
            key: STORAGE_KEY,
            newValue: JSON.stringify(this.data),
            oldValue: localStorage.getItem(STORAGE_KEY),
            url: window.location.href,
            storageArea: localStorage
        }));
    };
    
    DataManager.prototype.triggerContentSaved = function() {
        window.dispatchEvent(new CustomEvent('contentSaved', {
            detail: { 
                content: this.data.content,
                timestamp: new Date(),
                source: 'dataManager'
            }
        }));
    };
    
    // Existing methods remain the same but with enhanced logging
    DataManager.prototype.getData = function() {
        return this.data;
    };
    
    DataManager.prototype.setData = function(newData) {
        this.data = { ...this.data, ...newData };
        return this.saveData();
    };
    
    DataManager.prototype.getCountries = function() { return this.data.countries || []; };
    DataManager.prototype.getAllTours = function() {
        const allTours = [];
        this.data.countries.forEach(country => {
            if (country.tours) {
                country.tours.forEach(tour => {
                    allTours.push({ ...tour, countryId: country.id, countryName: country.name });
                });
            }
        });
        return allTours;
    };
    
    DataManager.prototype.addCountry = function(countryData) {
        const newCountry = { id: Date.now(), ...countryData, tours: [] };
        this.data.countries.push(newCountry);
        return this.saveData();
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
    
    DataManager.prototype.addTour = function(countryId, tourData) {
        const country = this.data.countries.find(c => c.id === countryId);
        if (country) {
            if (!country.tours) country.tours = [];
            country.tours.push({ id: Date.now(), ...tourData });
            return this.saveData();
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
    
    DataManager.prototype.getContacts = function() { return this.data.contacts || {}; };
    DataManager.prototype.updateContacts = function(updates) {
        this.data.contacts = { ...this.data.contacts, ...updates };
        return this.saveData();
    };
    
    DataManager.prototype.getSettings = function() { return this.data.settings || {}; };
    DataManager.prototype.updateSettings = function(updates) {
        this.data.settings = { ...this.data.settings, ...updates };
        return this.saveData();
    };
    
    DataManager.prototype.getContent = function() { return this.data.content || {}; };
    DataManager.prototype.updateContent = function(section, updates) {
        if (!this.data.content) this.data.content = {};
        if (!this.data.content[section]) this.data.content[section] = {};
        this.data.content[section] = { ...this.data.content[section], ...updates };
        return this.saveData();
    };
    
    // Replace global instance
    if (window.dataManager) {
        console.log('🔄 Replacing existing dataManager with enhanced version');
    }
    window.dataManager = new DataManager();
    
    console.log('✅ Enhanced Data Manager ready');
})();

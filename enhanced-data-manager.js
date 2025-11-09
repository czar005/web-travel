// Enhanced Data Manager with Unified Sync Support
(function() {
    'use strict';
    
    console.log('🔄 Enhanced Data Manager loading...');
    
    const EnhancedDataManager = {
        data: null,
        
        init: function() {
            this.loadData();
            this.integrateWithUnifiedSystem();
            console.log('✅ Enhanced Data Manager ready');
        },
        
        loadData: function() {
            // Try to load from unified system first
            if (window.UnifiedDataManager && window.UnifiedDataManager.getData) {
                this.data = window.UnifiedDataManager.getData();
                console.log('📁 Data loaded from Unified System');
                return;
            }
            
            // Fallback to original loading
            const localData = localStorage.getItem('worldtravel_data');
            if (localData) {
                try {
                    this.data = JSON.parse(localData);
                    console.log('📁 Data loaded from localStorage');
                } catch (e) {
                    console.error('❌ Error loading data:', e);
                    this.createDefaultData();
                }
            } else {
                this.createDefaultData();
            }
        },
        
        createDefaultData: function() {
            console.log('📝 Creating default data structure');
            this.data = {
                content: {
                    hero: { title: "", description: "" },
                    about: { title: "", description: "", stats: [] },
                    services: { title: "", services: [] },
                    destinations: { title: "", subtitle: "" },
                    contact: { title: "" }
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
                countries: [],
                tours: [],
                lastUpdate: new Date().toISOString()
            };
            this.saveData();
        },
        
        integrateWithUnifiedSystem: function() {
            // If unified system exists, sync with it
            if (window.UnifiedDataManager) {
                console.log('🔗 Integrating with Unified Data System');
                
                // Override getData to use unified system
                this.getData = function() {
                    return window.UnifiedDataManager.getData();
                };
                
                // Override setData to use unified system
                this.setData = function(data) {
                    window.UnifiedDataManager.data = data;
                    window.UnifiedDataManager.saveData();
                };
            }
        },
        
        // Original methods for compatibility
        getData: function() {
            return this.data;
        },
        
        setData: function(data) {
            this.data = data;
            this.saveData();
        },
        
        saveData: function() {
            this.data.lastUpdate = new Date().toISOString();
            localStorage.setItem('worldtravel_data', JSON.stringify(this.data));
            
            // Notify unified system
            if (window.UnifiedDataManager) {
                window.UnifiedDataManager.data = this.data;
                window.UnifiedDataManager.triggerDataUpdate();
            }
            
            console.log('💾 Data saved');
        },
        
        // Country management
        getCountries: function() {
            return this.data.countries || [];
        },
        
        addCountry: function(countryData) {
            if (!this.data.countries) this.data.countries = [];
            
            const newCountry = {
                id: Date.now(),
                ...countryData,
                tours: []
            };
            
            this.data.countries.push(newCountry);
            this.saveData();
            return newCountry;
        },
        
        // Tour management  
        getAllTours: function() {
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
        },
        
        addTour: function(countryId, tourData) {
            const country = this.data.countries.find(c => c.id === countryId);
            if (country) {
                if (!country.tours) country.tours = [];
                
                const newTour = {
                    id: Date.now(),
                    ...tourData
                };
                
                country.tours.push(newTour);
                this.saveData();
                return newTour;
            }
            return null;
        },
        
        // Contact management
        getContacts: function() {
            return this.data.contacts || {};
        },
        
        updateContacts: function(contactData) {
            this.data.contacts = { ...this.data.contacts, ...contactData };
            this.saveData();
        },
        
        // Settings management
        getSettings: function() {
            return this.data.settings || {};
        },
        
        updateSettings: function(settingsData) {
            this.data.settings = { ...this.data.settings, ...settingsData };
            this.saveData();
        },
        
        // Ensure default data exists
        ensureDefaultData: function() {
            if (!this.data) {
                this.createDefaultData();
            }
            return this.data;
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            EnhancedDataManager.init();
            window.dataManager = EnhancedDataManager;
        });
    } else {
        EnhancedDataManager.init();
        window.dataManager = EnhancedDataManager;
    }
    
})();

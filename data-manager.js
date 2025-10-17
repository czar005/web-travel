// Data Manager - управление данными сайта
class DataManager {
    constructor() {
        this.storageKey = 'worldtravel_data';
        this.init();
    }

    init() {
        if (!this.getData()) {
            console.log('Initializing default data...');
            this.setDefaultData();
        }
    }

    getData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) return null;
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading data:', error);
            return null;
        }
    }

    setData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            console.log('Data saved successfully');
            this.triggerDataUpdate();
            
            if (window.dataSync) {
                window.dataSync.notifyDataChange();
            }
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    setDefaultData() {
        const defaultData = {
            countries: [],
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
            pages: {
                home: {
                    id: 'home',
                    name: 'Главная страница',
                    url: 'index.html',
                    blocks: [
                        {
                            id: 'hero',
                            type: 'hero',
                            title: 'Откройте мир с WorldTravel',
                            subtitle: 'Мы создаем незабываемые путешествия по всему миру. От экзотических пляжей до горных вершин - ваше приключение начинается здесь.',
                            buttonText: 'Начать путешествие'
                        },
                        {
                            id: 'about',
                            type: 'about',
                            title: 'О нашей компании',
                            content: 'WorldTravel - это команда профессиональных путешественников и экспертов по туризму с более чем 10-летним опытом работы. Мы специализируемся на создании индивидуальных маршрутов и уникальных travel-решений.',
                            stats: [
                                { value: 5000, label: 'Довольных клиентов' },
                                { value: 50, label: 'Стран мира' },
                                { value: '10 лет', label: 'Опыта работы' }
                            ]
                        }
                    ]
                }
            }
        };
        return this.setData(defaultData);
    }

    // Страницы
    getPages() {
        const data = this.getData();
        return data?.pages || {};
    }

    getPage(pageId) {
        const pages = this.getPages();
        return pages[pageId];
    }

    updatePageBlocks(pageId, blocks) {
        const data = this.getData();
        if (!data) {
            console.error('No data found');
            return false;
        }
        
        if (!data.pages) data.pages = {};
        if (!data.pages[pageId]) data.pages[pageId] = { id: pageId, blocks: [] };
        
        console.log('Updating blocks for page', pageId, blocks);
        data.pages[pageId].blocks = blocks;
        return this.setData(data);
    }

    // Страны
    getCountries() {
        const data = this.getData();
        return data?.countries || [];
    }

    addCountry(country) {
        const data = this.getData();
        if (!data) return null;
        
        const newCountry = {
            id: Date.now(),
            image: 'images/travel-placeholder.svg',
            tours: [],
            ...country
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

    // Туры
    addTour(countryId, tour) {
        const data = this.getData();
        if (!data) return null;
        
        const country = data.countries.find(c => c.id === countryId);
        if (country) {
            const newTour = { id: Date.now(), ...tour };
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

    // Контакты
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

    // Настройки
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

    // Совместимость
    getContent() {
        return { countries: this.getCountries(), contacts: this.getContacts() };
    }

    updateContent(newContent) {
        const data = this.getData();
        if (!data) return false;
        
        if (newContent.countries) data.countries = newContent.countries;
        if (newContent.contacts) data.contacts = newContent.contacts;
        return this.setData(data);
    }

    updateCountries(countries) {
        const data = this.getData();
        if (!data) return false;
        
        data.countries = countries;
        return this.setData(data);
    }

    getDesign() {
        return { primaryColor: '#2c5aa0', secondaryColor: '#4a7bc8' };
    }

    updateDesign(design) {
        return true;
    }

    syncWithMainPage() {
        return true;
    }

    // События
    onDataUpdate(callback) {
        this.dataUpdateCallbacks = this.dataUpdateCallbacks || [];
        this.dataUpdateCallbacks.push(callback);
    }

    triggerDataUpdate() {
        if (this.dataUpdateCallbacks) {
            this.dataUpdateCallbacks.forEach(callback => {
                try {
                    callback(this.getData());
                } catch (error) {
                    console.error('Error in data update callback:', error);
                }
            });
        }
    }
}

// Глобальный экземпляр
window.dataManager = new DataManager();

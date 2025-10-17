// data-manager.js - Управление данными сайта
class DataManager {
    constructor() {
        this.storageKey = 'worldtravel_data';
        this.data = this.loadData();
    }

    loadData() {
        try {
            const data = localStorage.getItem(this.storageKey) || sessionStorage.getItem(this.storageKey);
            if (data) {
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('❌ Ошибка загрузки данных:', error);
        }
        
        // Возвращаем данные по умолчанию
        return {
            countries: [],
            content: {
                heroTitle: 'Откройте мир с WorldTravel',
                heroText: 'Мы создаем незабываемые путешествия по всему миру. От экзотических пляжей до горных вершин - ваше приключение начинается здесь.',
                contactPhone: '+7 (999) 123-45-67',
                contactEmail: 'info@worldtravel.com',
                contactAddress: 'Москва, ул. Туристическая, 15',
                contactHours: 'Пн-Пт: 9:00-18:00'
            },
            design: {
                logo: '',
                headerBackground: '',
                blocks: {
                    hero: true,
                    about: true,
                    services: true,
                    destinations: true,
                    contact: true
                }
            },
            settings: {
                companyName: 'WorldTravel',
                primaryColor: '#2c5aa0',
                secondaryColor: '#4a7bc8',
                language: 'ru'
            },
            lastUpdate: new Date().toISOString()
        };
    }
    loadData() {
    try {
        const data = localStorage.getItem(this.storageKey) || sessionStorage.getItem(this.storageKey);
        if (data) {
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('❌ Ошибка загрузки данных:', error);
    }
    
    // Возвращаем данные по умолчанию
    return {
        countries: [],
        content: {
            heroTitle: 'Откройте мир с WorldTravel',
            heroText: 'Мы создаем незабываемые путешествия по всему миру. От экзотических пляжей до горных вершин - ваше приключение начинается здесь.',
            contactPhone: '+7 (999) 123-45-67',
            contactEmail: 'info@worldtravel.com',
            contactAddress: 'Москва, ул. Туристическая, 15',
            contactHours: 'Пн-Пт: 9:00-18:00'
        },
        design: {
            logo: '',
            headerBackground: '',
            blocks: {
                hero: true,
                about: true,
                services: true,
                destinations: true,
                contact: true
            }
        },
        settings: {
            companyName: 'WorldTravel',
            primaryColor: '#2c5aa0',
            secondaryColor: '#4a7bc8',
            language: 'ru'
        },
        editorData: {
            sections: {}
        },
        lastUpdate: new Date().toISOString()
    };
}
    saveData() {
        try {
            this.data.lastUpdate = new Date().toISOString();
            const dataString = JSON.stringify(this.data);
            localStorage.setItem(this.storageKey, dataString);
            sessionStorage.setItem(this.storageKey, dataString);
            console.log('💾 Данные сохранены:', this.data);
            return true;
        } catch (error) {
            console.error('❌ Ошибка сохранения данных:', error);
            return false;
        }
    }

    getCountries() {
        return this.data.countries || [];
    }

    getContent() {
        return this.data.content || {};
    }

    getDesign() {
        return this.data.design || {};
    }

    getSettings() {
        return this.data.settings || {};
    }

    updateCountries(countries) {
        this.data.countries = countries;
        return this.saveData();
    }

    updateContent(content) {
        this.data.content = { ...this.data.content, ...content };
        return this.saveData();
    }

    updateDesign(design) {
        this.data.design = { ...this.data.design, ...design };
        return this.saveData();
    }

    updateSettings(settings) {
        this.data.settings = { ...this.data.settings, ...settings };
        return this.saveData();
    }
}

// Создаем глобальный экземпляр
window.dataManager = new DataManager();
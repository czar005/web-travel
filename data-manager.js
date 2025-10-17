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
// data-manager.js - ДОБАВИТЬ в конец файла:
// Функция для синхронизации данных с главной страницей
window.dataManager.syncWithMainPage = function() {
    const data = this.getData();
    
    // Сохраняем данные в localStorage для главной страницы
    localStorage.setItem('worldtravel_current_data', JSON.stringify(data));
    
    // Также обновляем data/content.json через GitHub API (если нужно)
    this.updateContentJson(data);
    
    console.log('✅ Данные синхронизированы с главной страницей');
};

// Обновление content.json (для статических данных)
window.dataManager.updateContentJson = function(data) {
    // Этот метод может быть реализован позже для работы с GitHub API
    console.log('📝 content.json должен быть обновлен:', data);
};
// Работа с LocalStorage
window.dataManager = {
    // Сохранить данные в LocalStorage
    saveToLocalStorage: function(data) {
        localStorage.setItem('travelData', JSON.stringify(data));
        console.log('Данные сохранены в LocalStorage');
    },

    // Загрузить данные из LocalStorage
    loadFromLocalStorage: function() {
        const saved = localStorage.getItem('travelData');
        return saved ? JSON.parse(saved) : null;
    },

    // Получить данные (сначала из LocalStorage, потом из файла)
    getData: function() {
        const localData = this.loadFromLocalStorage();
        if (localData) {
            return localData;
        }
        // Если в LocalStorage нет данных, используем стандартные
        return this.loadData();
    }
};
// Создаем глобальный экземпляр
window.dataManager = new DataManager();
// Базовые функции для работы с данными
window.dataManager.getCountries = function() {
    const data = this.getData();
    return data.countries || [];
};

window.dataManager.updateCountries = function(countries) {
    try {
        const data = this.getData();
        data.countries = countries;
        return this.saveToLocalStorage(data);
    } catch (error) {
        console.error('Error updating countries:', error);
        return false;
    }
};

window.dataManager.getContent = function() {
    const data = this.getData();
    return data.content || {};
};

window.dataManager.updateContent = function(content) {
    try {
        const data = this.getData();
        data.content = { ...data.content, ...content };
        return this.saveToLocalStorage(data);
    } catch (error) {
        console.error('Error updating content:', error);
        return false;
    }
};

window.dataManager.getDesign = function() {
    const data = this.getData();
    return data.design || {};
};

window.dataManager.updateDesign = function(design) {
    try {
        const data = this.getData();
        data.design = { ...data.design, ...design };
        return this.saveToLocalStorage(data);
    } catch (error) {
        console.error('Error updating design:', error);
        return false;
    }
};

window.dataManager.getSettings = function() {
    const data = this.getData();
    return data.settings || {};
};

window.dataManager.updateSettings = function(settings) {
    try {
        const data = this.getData();
        data.settings = { ...data.settings, ...settings };
        return this.saveToLocalStorage(data);
    } catch (error) {
        console.error('Error updating settings:', error);
        return false;
    }
};
// Базовые функции для работы с данными
window.dataManager.getCountries = function() {
    const data = this.getData();
    return data.countries || [];
};

window.dataManager.updateCountries = function(countries) {
    try {
        const data = this.getData();
        data.countries = countries;
        return this.saveToLocalStorage(data);
    } catch (error) {
        console.error('Error updating countries:', error);
        return false;
    }
};

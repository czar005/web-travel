// Fixed Data Manager with proper saving for all content
class FixedDataManager {
    constructor() {
        this.data = this.loadData();
        this.init();
    }

    init() {
        console.log('🚀 Fixed Data Manager initialized');
        // Initialize default data structure if empty
        if (!this.data.content) {
            this.setDefaultData();
        }
    }

    loadData() {
        try {
            const saved = localStorage.getItem('worldtravel_data');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Error loading data:', e);
        }
        
        return this.getDefaultData();
    }

    getDefaultData() {
        return {
            content: {
                hero: {
                    title: 'Откройте мир с WorldTravel',
                    subtitle: 'Мы создаем незабываемые путешествия по всему миру. От экзотических пляжей до горных вершин - ваше приключение начинается здесь.',
                    image: 'images/travel-placeholder.svg'
                },
                about: {
                    title: 'О нас',
                    description: 'WorldTravel - это команда профессиональных путешественников и экспертов по туризму с более чем 10-летним опытом работы. Мы специализируемся на создании индивидуальных маршрутов и уникальных travel-решений.',
                    stats: [
                        { value: '5000', label: 'Довольных клиентов' },
                        { value: '50', label: 'Стран мира' },
                        { value: '10 лет', label: 'Опыта работы' }
                    ]
                },
                services: {
                    title: 'Услуги',
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
                        },
                        {
                            title: 'Туры',
                            description: 'Индивидуальные и групповые туры с профессиональными гидами',
                            icon: 'fas fa-map-marked-alt'
                        },
                        {
                            title: 'Страхование',
                            description: 'Полное страховое сопровождение вашего путешествия',
                            icon: 'fas fa-shield-alt'
                        }
                    ]
                },
                destinations: {
                    title: 'Направления',
                    subtitle: 'Откройте для себя лучшие направления мира с нашими эксклюзивными турами'
                },
                contact: {
                    title: 'Контакты'
                }
            },
            contacts: {
                phone: '+7 (999) 123-45-67',
                email: 'info@worldtravel.com',
                address: 'Москва, ул. Туристическая, 15',
                hours: 'Пн-Пт: 9:00-18:00'
            },
            settings: {
                siteTitle: 'WorldTravel - Туристическая компания'
            },
            footer: {
                description: 'Ваш надежный партнер в мире путешествий. Мы делаем ваши мечты о путешествиях реальностью.',
                copyright: '&copy; 2024 WorldTravel. Все права защищены.'
            },
            lastUpdate: new Date().toISOString()
        };
    }

    setDefaultData() {
        this.data = this.getDefaultData();
        this.saveData();
    }

    getData() {
        return this.data;
    }

    setData(newData) {
        this.data = { ...this.data, ...newData };
        this.saveData();
    }

    saveData() {
        try {
            this.data.lastUpdate = new Date().toISOString();
            localStorage.setItem('worldtravel_data', JSON.stringify(this.data));
            
            // Trigger update event
            window.dispatchEvent(new CustomEvent('dataUpdated', {
                detail: { data: this.data }
            }));
            
            console.log('💾 Data saved successfully');
            return true;
        } catch (e) {
            console.error('Error saving data:', e);
            return false;
        }
    }

    // Update specific content section
    updateContent(sectionId, content) {
        if (!this.data.content[sectionId]) {
            this.data.content[sectionId] = {};
        }
        this.data.content[sectionId] = { ...this.data.content[sectionId], ...content };
        return this.saveData();
    }

    // Update contacts
    updateContacts(contacts) {
        this.data.contacts = { ...this.data.contacts, ...contacts };
        return this.saveData();
    }

    // Update settings
    updateSettings(settings) {
        this.data.settings = { ...this.data.settings, ...settings };
        return this.saveData();
    }

    // Update footer
    updateFooter(footer) {
        this.data.footer = { ...this.data.footer, ...footer };
        return this.saveData();
    }

    // Get countries and tours (for admin panel)
    getCountries() {
        return this.data.countries || [];
    }

    getAllTours() {
        if (!this.data.countries) return [];
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
    }

    // Debug method
    debugData() {
        console.log('📊 Current data:', this.data);
    }
}

// Initialize
window.dataManager = new FixedDataManager();

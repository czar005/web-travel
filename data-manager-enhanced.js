// Enhanced data structure initialization for page editor
(function() {
    'use strict';
    
    console.log('🔧 Initializing enhanced data structure...');
    
    // Wait for DataManager to be available
    const initEnhancedData = () => {
        if (window.DataManager && window.dataManager) {
            // Enhance the DataManager prototype
            const originalGetDefaultData = DataManager.prototype.getDefaultData;
            
            DataManager.prototype.getDefaultData = function() {
                const defaultData = originalGetDefaultData ? originalGetDefaultData.call(this) : {};
                
                // Ensure enhanced content structure
                if (!defaultData.content) {
                    defaultData.content = {};
                }
                
                // Ensure all sections exist with proper structure
                const sections = {
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
                };
                
                // Add missing sections
                Object.keys(sections).forEach(section => {
                    if (!defaultData.content[section]) {
                        defaultData.content[section] = sections[section];
                    } else {
                        // Ensure all fields exist in existing sections
                        Object.keys(sections[section]).forEach(field => {
                            if (defaultData.content[section][field] === undefined) {
                                defaultData.content[section][field] = sections[section][field];
                            }
                        });
                    }
                });
                
                return defaultData;
            };
            
            console.log('✅ Enhanced data structure initialized');
        } else {
            setTimeout(initEnhancedData, 100);
        }
    };
    
    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEnhancedData);
    } else {
        initEnhancedData();
    }
})();

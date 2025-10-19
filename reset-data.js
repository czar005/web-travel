// Reset data to ensure clean state
function resetData() {
    console.log('🔄 Resetting data...');
    
    const defaultData = {
        content: {
            hero: {
                id: 'hero',
                type: 'hero', 
                name: 'Главный баннер',
                title: 'Откройте мир с WorldTravel',
                subtitle: 'Мы создаем незабываемые путешествия по всему миру. От экзотических пляжей до горных вершин - ваше приключение начинается здесь.',
                image: 'images/travel-placeholder.svg'
            },
            about: {
                id: 'about',
                type: 'about',
                name: 'О компании', 
                title: 'О нашей компании',
                description: 'WorldTravel - это команда профессиональных путешественников и экспертов по туризму с более чем 10-летним опытом работы.',
                image: 'images/travel-placeholder.svg',
                stats: [
                    { value: '5000', label: 'Довольных клиентов' },
                    { value: '50', label: 'Стран мира' },
                    { value: '10 лет', label: 'Опыта работы' }
                ]
            },
            services: {
                id: 'services', 
                type: 'services',
                name: 'Услуги',
                title: 'Наши услуги',
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
                id: 'destinations',
                type: 'destinations', 
                name: 'Направления',
                title: 'Популярные направления',
                subtitle: 'Откройте для себя лучшие направления мира с нашими эксклюзивными турами'
            },
            contact: {
                id: 'contact',
                type: 'contact',
                name: 'Контакты', 
                title: 'Свяжитесь с нами'
            }
        },
        footer: {
            id: 'footer',
            type: 'footer',
            name: 'Футер',
            description: 'Ваш надежный партнер в мире путешествий. Мы делаем ваши мечты о путешествиях реальностью.',
            copyright: '&copy; 2024 WorldTravel. Все права защищены.'
        },
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
        pageStructure: ['hero', 'about', 'services', 'destinations', 'contact'],
        lastUpdate: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('worldtravel_data', JSON.stringify(defaultData));
    
    // Update DataManager if available
    if (window.dataManager && window.dataManager.setData) {
        window.dataManager.setData(defaultData);
    }
    
    console.log('✅ Data reset completed');
    alert('Data has been reset to default values. Page will reload.');
    
    // Reload page
    setTimeout(() => location.reload(), 1000);
}

// Add reset button to admin panels
document.addEventListener('DOMContentLoaded', function() {
    const adminHeader = document.querySelector('.admin-header, .panel-header');
    if (adminHeader) {
        const resetBtn = document.createElement('button');
        resetBtn.className = 'btn-admin danger';
        resetBtn.innerHTML = '<i class="fas fa-redo"></i> Reset Data';
        resetBtn.onclick = resetData;
        resetBtn.style.marginLeft = '10px';
        adminHeader.appendChild(resetBtn);
    }
});

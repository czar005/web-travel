// Автоматические исправления для сайта
document.addEventListener('DOMContentLoaded', function() {
    console.log('�� Применение автоматических исправлений...');
    
    // 1. Гарантируем правильные заголовки в навигации
    const navTitles = {
        'home': 'Главная',
        'about': 'О нас', 
        'services': 'Услуги',
        'destinations': 'Направления',
        'contact': 'Контакты'
    };
    
    Object.keys(navTitles).forEach(sectionId => {
        const links = document.querySelectorAll(`a[href="#${sectionId}"]`);
        links.forEach(link => {
            if (link.textContent !== navTitles[sectionId]) {
                link.textContent = navTitles[sectionId];
            }
        });
    });
    
    // 2. Гарантируем правильные контакты
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        const strong = item.querySelector('strong');
        const p = item.querySelector('p');
        
        if (strong && p) {
            if (strong.textContent.includes('Телефон') && !p.textContent.includes('+7 (999)')) {
                p.textContent = '+7 (999) 123-45-67';
            }
            if (strong.textContent.includes('Email') && !p.textContent.includes('info@worldtravel.com')) {
                p.textContent = 'info@worldtravel.com';
            }
            if (strong.textContent.includes('Адрес') && !p.textContent.includes('Москва')) {
                p.textContent = 'Москва, ул. Туристическая, 15';
            }
            if (strong.textContent.includes('Часы') && !p.textContent.includes('Пн-Пт')) {
                p.textContent = 'Пн-Пт: 9:00-18:00';
            }
        }
    });
    
    console.log('✅ Автоматические исправления применены');
});

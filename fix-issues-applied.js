// Automatic fixes for the website
document.addEventListener('DOMContentLoaded', function() {
    console.log('Applying automatic fixes...');
    
    // Fix navigation titles
    const navTitles = {
        'home': 'Главная',
        'about': 'О нас', 
        'services': 'Услуги',
        'destinations': 'Направления',
        'contact': 'Контакты'
    };
    
    for (const sectionId in navTitles) {
        const links = document.querySelectorAll('a[href="#' + sectionId + '"]');
        links.forEach(function(link) {
            if (link.textContent !== navTitles[sectionId]) {
                link.textContent = navTitles[sectionId];
            }
        });
    }
    
    // Fix contact information
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(function(item) {
        const strong = item.querySelector('strong');
        const p = item.querySelector('p');
        
        if (strong && p) {
            if (strong.textContent.includes('Телефон')) {
                p.textContent = '+7 (999) 123-45-67';
            }
            if (strong.textContent.includes('Email')) {
                p.textContent = 'info@worldtravel.com';
            }
            if (strong.textContent.includes('Адрес')) {
                p.textContent = 'Москва, ул. Туристическая, 15';
            }
            if (strong.textContent.includes('Часы')) {
                p.textContent = 'Пн-Пт: 9:00-18:00';
            }
        }
    });
    
    console.log('Automatic fixes applied');
});

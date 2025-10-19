// Исправление контактов и футера
document.addEventListener('DOMContentLoaded', function() {
    // Исправляем порядок контактов в секции контактов
    const contactSection = document.querySelector('.contact-info');
    if (contactSection) {
        const contactItems = contactSection.querySelectorAll('.contact-item');
        if (contactItems.length >= 4) {
            // Правильный порядок: телефон, email, адрес, часы работы
            contactItems[0].innerHTML = '<strong><i class="fas fa-phone"></i> Телефон:</strong><p>+7 (999) 123-45-67</p>';
            contactItems[1].innerHTML = '<strong><i class="fas fa-envelope"></i> Email:</strong><p>info@worldtravel.com</p>';
            contactItems[2].innerHTML = '<strong><i class="fas fa-map-marker-alt"></i> Адрес:</strong><p>Москва, ул. Туристическая, 15</p>';
            contactItems[3].innerHTML = '<strong><i class="fas fa-clock"></i> Часы работы:</strong><p>Пн-Пт: 9:00-18:00</p>';
        }
    }

    // Исправляем футер
    const footerSections = document.querySelectorAll('.footer-section');
    if (footerSections.length >= 3) {
        // Первая секция - о компании (остается как есть)
        
        // Вторая секция - быстрые ссылки (как в навигаторе)
        footerSections[1].innerHTML = `
            <h4>Быстрые ссылки</h4>
            <ul>
                <li><a href="#home">Главная</a></li>
                <li><a href="#about">О нас</a></li>
                <li><a href="#services">Услуги</a></li>
                <li><a href="#destinations">Направления</a></li>
                <li><a href="#contact">Контакты</a></li>
            </ul>
        `;
        
        // Третья секция - контакты (правильный порядок)
        footerSections[2].innerHTML = `
            <h4>Контакты</h4>
            <p><i class="fas fa-phone"></i> +7 (999) 123-45-67</p>
            <p><i class="fas fa-envelope"></i> info@worldtravel.com</p>
            <p><i class="fas fa-map-marker-alt"></i> Москва, ул. Туристическая, 15</p>
            <p><i class="fas fa-clock"></i> Пн-Пт: 9:00-18:00</p>
        `;
    }
});

// Обновляем ContentUpdater для правильного отображения контактов
if (typeof ContentUpdater !== 'undefined') {
    ContentUpdater.prototype.applyContactChanges = function(contacts) {
        if (!contacts) return;

        // Обновляем секцию контактов
        if (contacts.phone) {
            this.updateElement('.contact-info .contact-item:nth-child(1) p', contacts.phone);
            this.updateElement('.footer-section:nth-child(3) p:nth-child(1)', contacts.phone);
        }
        if (contacts.email) {
            this.updateElement('.contact-info .contact-item:nth-child(2) p', contacts.email);
            this.updateElement('.footer-section:nth-child(3) p:nth-child(2)', contacts.email);
        }
        if (contacts.address) {
            this.updateElement('.contact-info .contact-item:nth-child(3) p', contacts.address);
            this.updateElement('.footer-section:nth-child(3) p:nth-child(3)', contacts.address);
        }
        if (contacts.hours) {
            this.updateElement('.contact-info .contact-item:nth-child(4) p', contacts.hours);
            this.updateElement('.footer-section:nth-child(3) p:nth-child(4)', contacts.hours);
        }
    };
}

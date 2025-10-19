// Исправление контактов и футера
function fixContactsAndFooter() {
    console.log('🔧 Fixing contacts and footer structure...');
    
    // Исправляем порядок контактов в HTML
    const contactHTML = `
        <div class="contact-info">
            <h3>Наши контакты</h3>
            <div class="contact-item">
                <i class="fas fa-phone"></i>
                <div>
                    <strong>Телефон:</strong>
                    <p class="contact-phone">+7 (999) 123-45-67</p>
                </div>
            </div>
            <div class="contact-item">
                <i class="fas fa-envelope"></i>
                <div>
                    <strong>Email:</strong>
                    <p class="contact-email">info@worldtravel.com</p>
                </div>
            </div>
            <div class="contact-item">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                    <strong>Адрес:</strong>
                    <p class="contact-address">Москва, ул. Туристическая, 15</p>
                </div>
            </div>
            <div class="contact-item">
                <i class="fas fa-clock"></i>
                <div>
                    <strong>Часы работы:</strong>
                    <p class="contact-hours">Пн-Пт: 9:00-18:00</p>
                </div>
            </div>
        </div>
    `;
    
    // Обновляем структуру контактов если нужно
    const contactInfo = document.querySelector('.contact-info');
    if (contactInfo) {
        // Проверяем порядок элементов
        const contactItems = contactInfo.querySelectorAll('.contact-item');
        if (contactItems.length >= 4) {
            const phoneItem = contactItems[0];
            const emailItem = contactItems[1]; 
            const addressItem = contactItems[2];
            const hoursItem = contactItems[3];
            
            // Проверяем правильность порядка по иконкам
            const phoneIcon = phoneItem.querySelector('.fa-phone');
            const emailIcon = emailItem.querySelector('.fa-envelope');
            const addressIcon = addressItem.querySelector('.fa-map-marker-alt');
            const hoursIcon = hoursItem.querySelector('.fa-clock');
            
            if (!phoneIcon || !emailIcon || !addressIcon || !hoursIcon) {
                console.log('🔄 Fixing contact items order...');
                contactInfo.innerHTML = contactHTML;
            }
        }
    }
    
    // Исправляем футер
    const footerSections = document.querySelectorAll('.footer-section');
    if (footerSections.length >= 3) {
        const contactFooter = footerSections[2];
        const contactParagraphs = contactFooter.querySelectorAll('p');
        
        if (contactParagraphs.length >= 4) {
            // Убедимся что порядок правильный
            const phoneText = contactParagraphs[0].textContent;
            const emailText = contactParagraphs[1].textContent;
            const addressText = contactParagraphs[2].textContent;
            const hoursText = contactParagraphs[3].textContent;
            
            // Если порядок нарушен, исправляем
            if (phoneText.includes('@') || emailText.includes('+7') || addressText.includes('@')) {
                console.log('🔄 Fixing footer contacts order...');
                contactFooter.innerHTML = `
                    <h4>Контакты</h4>
                    <p class="footer-phone">+7 (999) 123-45-67</p>
                    <p class="footer-email">info@worldtravel.com</p>
                    <p class="footer-address">Москва, ул. Туристическая, 15</p>
                    <p class="footer-hours">Пн-Пт: 9:00-18:00</p>
                `;
            }
        }
    }
    
    // Применяем обновления данных
    setTimeout(() => {
        if (window.contentUpdater) {
            window.contentUpdater.applyAllChanges();
        }
        if (window.enhancedContentUpdater) {
            window.enhancedContentUpdater.applyAllChanges();
        }
    }, 1000);
}

// Запускаем при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixContactsAndFooter);
} else {
    fixContactsAndFooter();
}

// Также запускаем при любых обновлениях данных
window.addEventListener('dataUpdated', fixContactsAndFooter);

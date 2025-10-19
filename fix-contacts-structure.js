// Исправление структуры контактов
function fixContactsStructure() {
    console.log('🔧 Fixing contacts structure...');
    
    // Правильная структура контактов
    const correctContactStructure = {
        phone: {
            icon: 'fa-phone',
            label: 'Телефон:',
            selector: '.contact-phone, .contact-info .contact-item:nth-child(1) p'
        },
        email: {
            icon: 'fa-envelope', 
            label: 'Email:',
            selector: '.contact-email, .contact-info .contact-item:nth-child(2) p'
        },
        address: {
            icon: 'fa-map-marker-alt',
            label: 'Адрес:',
            selector: '.contact-address, .contact-info .contact-item:nth-child(3) p'
        },
        hours: {
            icon: 'fa-clock',
            label: 'Часы работы:',
            selector: '.contact-hours, .contact-info .contact-item:nth-child(4) p'
        }
    };

    // Исправляем основную секцию контактов
    const contactInfo = document.querySelector('.contact-info');
    if (contactInfo) {
        const contactItems = contactInfo.querySelectorAll('.contact-item');
        
        // Проверяем правильность порядка
        let needsFix = false;
        contactItems.forEach((item, index) => {
            const icon = item.querySelector('i');
            const expectedIcon = Object.values(correctContactStructure)[index]?.icon;
            
            if (icon && !icon.classList.contains(expectedIcon)) {
                needsFix = true;
                console.log(`❌ Wrong icon at position ${index + 1}: expected ${expectedIcon}, got ${Array.from(icon.classList).find(cls => cls.startsWith('fa-'))}`);
            }
        });

        if (needsFix || contactItems.length !== 4) {
            console.log('🔄 Rebuilding contact info structure...');
            
            // Сохраняем текущие значения
            const currentValues = {};
            contactItems.forEach((item, index) => {
                const text = item.querySelector('p')?.textContent || '';
                currentValues[`item${index + 1}`] = text;
            });

            // Перестраиваем структуру
            contactInfo.innerHTML = `
                <h3>Наши контакты</h3>
                ${Object.values(correctContactStructure).map((field, index) => `
                    <div class="contact-item">
                        <i class="fas ${field.icon}"></i>
                        <div>
                            <strong>${field.label}</strong>
                            <p class="${Object.keys(correctContactStructure)[index]}">${currentValues[`item${index + 1}`] || getDefaultContactValue(Object.keys(correctContactStructure)[index])}</p>
                        </div>
                    </div>
                `).join('')}
            `;
        }
    }

    // Исправляем контакты в футере
    const footerContacts = document.querySelector('.footer-section:nth-child(3)');
    if (footerContacts) {
        const footerParagraphs = footerContacts.querySelectorAll('p');
        let footerNeedsFix = false;

        // Проверяем порядок в футере
        if (footerParagraphs.length >= 4) {
            const phoneText = footerParagraphs[0]?.textContent || '';
            const emailText = footerParagraphs[1]?.textContent || '';
            const addressText = footerParagraphs[2]?.textContent || '';
            const hoursText = footerParagraphs[3]?.textContent || '';

            // Если данные в неправильном порядке, исправляем
            if (phoneText.includes('@') || emailText.includes('+7') || addressText.includes('@') || 
                hoursText.includes('@') || hoursText.includes('+7')) {
                footerNeedsFix = true;
            }
        }

        if (footerNeedsFix || footerParagraphs.length !== 4) {
            console.log('🔄 Rebuilding footer contacts structure...');
            
            // Сохраняем текущие значения
            const currentValues = {};
            footerParagraphs.forEach((p, index) => {
                currentValues[`p${index + 1}`] = p.textContent;
            });

            // Перестраиваем футер
            footerContacts.innerHTML = `
                <h4>Контакты</h4>
                <p class="footer-phone">${currentValues.p1 || currentValues.p2 || currentValues.p3 || currentValues.p4 || '+7 (999) 123-45-67'}</p>
                <p class="footer-email">${currentValues.p2 || currentValues.p1 || currentValues.p3 || currentValues.p4 || 'info@worldtravel.com'}</p>
                <p class="footer-address">${currentValues.p3 || currentValues.p1 || currentValues.p2 || currentValues.p4 || 'Москва, ул. Туристическая, 15'}</p>
                <p class="footer-hours">${currentValues.p4 || currentValues.p1 || currentValues.p2 || currentValues.p3 || 'Пн-Пт: 9:00-18:00'}</p>
            `;
        }
    }

    function getDefaultContactValue(type) {
        const defaults = {
            phone: '+7 (999) 123-45-67',
            email: 'info@worldtravel.com',
            address: 'Москва, ул. Туристическая, 15',
            hours: 'Пн-Пт: 9:00-18:00'
        };
        return defaults[type] || '';
    }
}

// Запускаем исправление при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixContactsStructure);
} else {
    fixContactsStructure();
}

// Также запускаем при обновлениях данных
window.addEventListener('dataUpdated', fixContactsStructure);

// Экспортируем функцию для использования в других модулях
window.fixContactsStructure = fixContactsStructure;

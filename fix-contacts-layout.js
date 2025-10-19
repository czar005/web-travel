// Исправление верстки контактов
document.addEventListener('DOMContentLoaded', function() {
    // Исправляем структуру секции контактов
    const contactSection = document.querySelector('.contact-content');
    if (contactSection) {
        contactSection.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            align-items: start;
        `;
        
        // Исправляем контейнер контактной информации
        const contactInfo = contactSection.querySelector('.contact-info');
        if (contactInfo) {
            contactInfo.style.cssText = `
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            `;
        }
        
        // Исправляем форму
        const contactForm = contactSection.querySelector('.contact-form');
        if (contactForm) {
            contactForm.style.cssText = `
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                display: flex;
                flex-direction: column;
                gap: 15px;
            `;
        }
    }
});

// Адаптивность для мобильных устройств
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .contact-content {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
        }
        
        .contact-info, .contact-form {
            padding: 20px !important;
        }
    }
    
    .contact-item {
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid #eee;
    }
    
    .contact-item:last-child {
        border-bottom: none;
        margin-bottom: 0;
    }
    
    .contact-item strong {
        display: block;
        margin-bottom: 5px;
        color: #2c5aa0;
    }
    
    .contact-item p {
        margin: 0;
        color: #333;
    }
`;
document.head.appendChild(style);

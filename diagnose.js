console.log('🔍 Диагностика отображения секций...');

// Проверяем видимость секций
function checkSections() {
    const contact = document.getElementById('contact');
    const footer = document.querySelector('footer.footer');
    
    console.log('Секция контактов:', contact ? 'НАЙДЕНА' : 'НЕ НАЙДЕНА');
    console.log('Футер:', footer ? 'НАЙДЕН' : 'НЕ НАЙДЕН');
    
    if (contact) {
        const style = window.getComputedStyle(contact);
        console.log('Контакты - display:', style.display);
        console.log('Контакты - visibility:', style.visibility);
        console.log('Контакты - opacity:', style.opacity);
        
        // Принудительно показываем если скрыто
        if (style.display === 'none' || style.visibility === 'hidden') {
            contact.style.display = 'block';
            contact.style.visibility = 'visible';
            console.log('✅ Контакты принудительно показаны');
        }
    }
    
    if (footer) {
        const style = window.getComputedStyle(footer);
        console.log('Футер - display:', style.display);
        console.log('Футер - visibility:', style.visibility);
        
        if (style.display === 'none' || style.visibility === 'hidden') {
            footer.style.display = 'block';
            footer.style.visibility = 'visible';
            console.log('✅ Футер принудительно показан');
        }
    }
}

// Запускаем диагностику
setTimeout(checkSections, 1000);
setTimeout(checkSections, 3000);

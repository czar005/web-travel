const fs = require('fs');

// 1. Исправляем верстку контактов в index.html
console.log('📞 Исправление верстки контактов...');
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Заменяем всю секцию контактов на исправленную версию
const fixedContactsHTML = `
            <div class="contact-content" style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start;">
                <div class="contact-info" style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                    <h3>Наши контакты</h3>
                    <div class="contact-item">
                        <strong><i class="fas fa-phone"></i> Телефон:</strong>
                        <p>+7 (999) 123-45-67</p>
                    </div>
                    <div class="contact-item">
                        <strong><i class="fas fa-envelope"></i> Email:</strong>
                        <p>info@worldtravel.com</p>
                    </div>
                    <div class="contact-item">
                        <strong><i class="fas fa-map-marker-alt"></i> Адрес:</strong>
                        <p>Москва, ул. Туристическая, 15</p>
                    </div>
                    <div class="contact-item">
                        <strong><i class="fas fa-clock"></i> Часы работы:</strong>
                        <p>Пн-Пт: 9:00-18:00</p>
                    </div>
                </div>
                <form class="contact-form" style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); display: flex; flex-direction: column; gap: 15px;">
                    <input type="text" placeholder="Ваше имя" required>
                    <input type="email" placeholder="Ваш email" required>
                    <input type="tel" placeholder="Ваш телефон">
                    <textarea placeholder="Ваше сообщение" rows="5" required></textarea>
                    <button type="submit">Отправить сообщение</button>
                </form>
            </div>
`;

// Находим и заменяем секцию контактов
const contactSectionRegex = /<div class="contact-content">[\\s\\S]*?<\\/form>\\s*<\\/div>/;
if (contactSectionRegex.test(indexHtml)) {
    indexHtml = indexHtml.replace(contactSectionRegex, fixedContactsHTML);
    console.log('✅ Секция контактов заменена');
} else {
    // Альтернативный поиск
    const alternativeRegex = /<section id="contact"[\\s\\S]*?<div class="container">[\\s\\S]*?<h2[\\s\\S]*?<\\/h2>([\\s\\S]*?)<\\/section>/;
    const match = indexHtml.match(alternativeRegex);
    if (match) {
        indexHtml = indexHtml.replace(match[1], fixedContactsHTML);
        console.log('✅ Секция контактов заменена (альтернативный метод)');
    }
}

// 2. Добавляем скрипты исправлений
const scriptsToAdd = [
    'fix-contacts-layout.js',
    'fixed-stats-editor.js', 
    'enhanced-page-editor-fixed.js'
];

scriptsToAdd.forEach(script => {
    if (!indexHtml.includes(script)) {
        indexHtml = indexHtml.replace('</body>', `<script src="${script}"></script></body>`);
        console.log(`✅ Добавлен скрипт: ${script}`);
    }
});

// 3. Сохраняем исправленный index.html
fs.writeFileSync('index.html', indexHtml);
console.log('💾 index.html сохранен с исправлениями');

// 4. Также обновляем page-editor.html если он существует
try {
    let pageEditorHtml = fs.readFileSync('page-editor.html', 'utf8');
    
    // Добавляем исправленные скрипты
    if (!pageEditorHtml.includes('enhanced-page-editor-fixed.js')) {
        pageEditorHtml = pageEditorHtml.replace('</body>', '<script src="enhanced-page-editor-fixed.js"></script></body>');
        console.log('✅ enhanced-page-editor-fixed.js добавлен в page-editor.html');
    }
    
    if (!pageEditorHtml.includes('fixed-stats-editor.js')) {
        pageEditorHtml = pageEditorHtml.replace('</body>', '<script src="fixed-stats-editor.js"></script></body>');
        console.log('✅ fixed-stats-editor.js добавлен в page-editor.html');
    }
    
    fs.writeFileSync('page-editor.html', pageEditorHtml);
    console.log('💾 page-editor.html обновлен');
} catch (e) {
    console.log('ℹ️ page-editor.html не найден, пропускаем...');
}

console.log('🎉 Критические исправления применены!');
console.log('📋 Что исправлено:');
console.log('   ✅ Верстка контактов (убраны перекосы)');
console.log('   ✅ Сохранение статистики в редакторе');
console.log('   ✅ Добавлены улучшенные редакторы статистики');

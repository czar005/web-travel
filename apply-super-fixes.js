const fs = require('fs');

console.log('🎯 Применение супер-исправлений...');

// 1. Восстанавливаем index.html с правильной структурой
console.log('📄 Восстановление index.html...');
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Восстанавливаем секцию контактов
const correctContactSection = `
            <div class="contact-content">
                <div class="contact-info">
                    <h3>Наши контакты</h3>
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <div>
                            <strong>Телефон:</strong>
                            <p>+7 (999) 123-45-67</p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <div>
                            <strong>Email:</strong>
                            <p>info@worldtravel.com</p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <div>
                            <strong>Адрес:</strong>
                            <p>Москва, ул. Туристическая, 15</p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-clock"></i>
                        <div>
                            <strong>Часы работы:</strong>
                            <p>Пн-Пт: 9:00-18:00</p>
                        </div>
                    </div>
                </div>
                <form class="contact-form">
                    <input type="text" placeholder="Ваше имя" required>
                    <input type="email" placeholder="Ваш email" required>
                    <input type="tel" placeholder="Ваш телефон">
                    <textarea placeholder="Ваше сообщение" rows="5" required></textarea>
                    <button type="submit">Отправить сообщение</button>
                </form>
            </div>
`;

// Заменяем секцию контактов
const contactSectionRegex = /<div class="contact-content"[^>]*>[\\s\\S]*?<\\/form>\\s*<\\/div>/;
if (contactSectionRegex.test(indexHtml)) {
    indexHtml = indexHtml.replace(contactSectionRegex, correctContactSection);
    console.log('✅ Секция контактов восстановлена');
}

// Восстанавливаем футер
const correctFooter = `
            <div class="footer-content">
                <div class="footer-section">
                    <h3><i class="fas fa-globe-americas"></i> WorldTravel</h3>
                    <p>Ваш надежный партнер в мире путешествий. Мы делаем ваши мечты о путешествиях реальностью.</p>
                </div>
                <div class="footer-section">
                    <h4>Быстрые ссылки</h4>
                    <ul>
                        <li><a href="#home">Главная</a></li>
                        <li><a href="#about">О нас</a></li>
                        <li><a href="#services">Услуги</a></li>
                        <li><a href="#destinations">Направления</a></li>
                        <li><a href="#contact">Контакты</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Контакты</h4>
                    <p><i class="fas fa-phone"></i> +7 (999) 123-45-67</p>
                    <p><i class="fas fa-envelope"></i> info@worldtravel.com</p>
                    <p><i class="fas fa-map-marker-alt"></i> Москва, ул. Туристическая, 15</p>
                    <p><i class="fas fa-clock"></i> Пн-Пт: 9:00-18:00</p>
                </div>
            </div>
`;

const footerRegex = /<div class="footer-content">[\\s\\S]*?<\\/div>/;
if (footerRegex.test(indexHtml)) {
    indexHtml = indexHtml.replace(footerRegex, correctFooter);
    console.log('✅ Футер восстановлен');
}

// Заменяем ContentUpdater на улучшенную версию
if (indexHtml.includes('update-content.js')) {
    indexHtml = indexHtml.replace('update-content.js', 'enhanced-content-updater.js');
    console.log('✅ ContentUpdater заменен на улучшенную версию');
}

// Добавляем необходимые скрипты
const scriptsToAdd = [
    'restore-contacts-footer.js',
    'enhanced-content-updater.js', 
    'super-editor.js'
];

scriptsToAdd.forEach(script => {
    if (!indexHtml.includes(script)) {
        indexHtml = indexHtml.replace('</body>', `<script src="${script}"></script></body>`);
        console.log(`✅ Добавлен скрипт: ${script}`);
    }
});

// Сохраняем исправленный index.html
fs.writeFileSync('index.html', indexHtml);

// 2. Обновляем все файлы редакторов
console.log('\\n📝 Обновление редакторов...');
const editorFiles = [
    'page-editor.html',
    'enhanced-page-editor.html',
    'page-editor-backup-final.html'
];

editorFiles.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        // Добавляем супер-редактор
        if (!content.includes('super-editor.js')) {
            content = content.replace('</body>', '<script src="super-editor.js"></script></body>');
            console.log(`✅ super-editor.js добавлен в ${file}`);
        }
        
        // Заменяем ContentUpdater если есть
        if (content.includes('update-content.js')) {
            content = content.replace('update-content.js', 'enhanced-content-updater.js');
            console.log(`✅ ContentUpdater заменен в ${file}`);
        }
        
        fs.writeFileSync(file, content);
    }
});

console.log('\\n🎉 Все исправления применены!');
console.log('📋 Что было исправлено:');
console.log('   ✅ Контакты и футер восстановлены в исходное состояние');
console.log('   ✅ Заголовки теперь обновляются в навигаторе и футере');
console.log('   ✅ Добавлена возможность добавлять/удалять блоки в "О нас" и "Услуги"');
console.log('   ✅ Добавлено управление изображениями во всех секциях');
console.log('   ✅ Добавлен редактор контактов');
console.log('   ✅ Все редакторы обновлены для поддержки нового функционала');

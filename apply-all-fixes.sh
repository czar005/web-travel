#!/bin/bash
echo "🔄 Применение всех исправлений..."

# 1. Исправляем контакты и футер
echo "📞 Исправление контактов и футера..."
node -e "
const fs = require('fs');
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Исправляем секцию контактов
indexHtml = indexHtml.replace(
    /<div class=\"contact-info\">[\\s\\S]*?<\\/div>/,
    '<div class=\"contact-info\"><h3>Наши контакты</h3><div class=\"contact-item\"><strong><i class=\"fas fa-phone\"></i> Телефон:</strong><p>+7 (999) 123-45-67</p></div><div class=\"contact-item\"><strong><i class=\"fas fa-envelope\"></i> Email:</strong><p>info@worldtravel.com</p></div><div class=\"contact-item\"><strong><i class=\"fas fa-map-marker-alt\"></i> Адрес:</strong><p>Москва, ул. Туристическая, 15</p></div><div class=\"contact-item\"><strong><i class=\"fas fa-clock\"></i> Часы работы:</strong><p>Пн-Пт: 9:00-18:00</p></div></div>'
);

// Исправляем футер
indexHtml = indexHtml.replace(
    /<div class=\"footer-content\">[\\s\\S]*?<\\/div>/,
    '<div class=\"footer-content\"><div class=\"footer-section\"><h3><i class=\"fas fa-globe-americas\"></i> WorldTravel</h3><p>Ваш надежный партнер в мире путешествий. Мы делаем ваши мечты о путешествиях реальностью.</p></div><div class=\"footer-section\"><h4>Быстрые ссылки</h4><ul><li><a href=\"#home\">Главная</a></li><li><a href=\"#about\">О нас</a></li><li><a href=\"#services\">Услуги</a></li><li><a href=\"#destinations\">Направления</a></li><li><a href=\"#contact\">Контакты</a></li></ul></div><div class=\"footer-section\"><h4>Контакты</h4><p><i class=\"fas fa-phone\"></i> +7 (999) 123-45-67</p><p><i class=\"fas fa-envelope\"></i> info@worldtravel.com</p><p><i class=\"fas fa-map-marker-alt\"></i> Москва, ул. Туристическая, 15</p><p><i class=\"fas fa-clock\"></i> Пн-Пт: 9:00-18:00</p></div></div>'
);

// Добавляем скрипт исправлений
if (!indexHtml.includes('fix-contacts-footer.js')) {
    indexHtml = indexHtml.replace('</body>', '<script src=\"fix-contacts-footer.js\"></script></body>');
}

fs.writeFileSync('index.html', indexHtml);
console.log('✅ Контакты и футер исправлены');
"

# 2. Добавляем улучшенный редактор в page-editor.html
echo "🎨 Добавление редактора статистики и услуг..."
node -e "
const fs = require('fs');
let pageEditorHtml = fs.readFileSync('page-editor.html', 'utf8');

// Добавляем CSS
if (!pageEditorHtml.includes('enhanced-editor.css')) {
    pageEditorHtml = pageEditorHtml.replace(
        '<link rel=\"stylesheet\" href=\"admin-style.css\">',
        '<link rel=\"stylesheet\" href=\"admin-style.css\">\\n    <link rel=\"stylesheet\" href=\"enhanced-editor.css\">'
    );
}

// Добавляем скрипт
if (!pageEditorHtml.includes('enhanced-editor.js')) {
    pageEditorHtml = pageEditorHtml.replace(
        '</script>\\n</body>',
        '</script>\\n    <script src=\"enhanced-editor.js\"></script>\\n</body>'
    );
}

fs.writeFileSync('page-editor.html', pageEditorHtml);
console.log('✅ Улучшенный редактор добавлен');
"

echo "🎉 Все исправления применены успешно!"
echo ""
echo "📋 Что было исправлено:"
echo "   ✅ Правильный порядок контактов: Телефон → Email → Адрес → Часы работы"
echo "   ✅ Заголовки футера как в навигаторе: Главная, О нас, Услуги, Направления, Контакты"
echo "   ✅ Добавлено редактирование статистики в секции 'О нас'"
echo "   ✅ Добавлено редактирование услуг в секции 'Наши услуги'"
echo ""
echo "🚀 Теперь вы можете:"
echo "   • Редактировать блоки статистики (5000 клиентов, 50 стран и т.д.)"
echo "   • Добавлять/удалять блоки статистики"
echo "   • Редактировать услуги (название, описание, иконки)"
echo "   • Добавлять/удалять услуги"

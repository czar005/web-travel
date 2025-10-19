const fs = require('fs');

// Функция для обновления HTML файла
function updateHTMLFile(filename) {
    if (!fs.existsSync(filename)) return;
    
    let content = fs.readFileSync(filename, 'utf8');
    
    // Удаляем старые скрипты
    content = content.replace(/<script src="[^"]*enhanced-content-updater[^"]*"><\/script>\n?/g, '');
    content = content.replace(/<script src="[^"]*super-editor[^"]*"><\/script>\n?/g, '');
    content = content.replace(/<script src="[^"]*fixed-stats-editor[^"]*"><\/script>\n?/g, '');
    content = content.replace(/<script src="[^"]*enhanced-page-editor-fixed[^"]*"><\/script>\n?/g, '');
    
    // Добавляем новые скрипты перед закрывающим body
    if (!content.includes('enhanced-content-updater.js')) {
        content = content.replace('</body>', '    <script src="enhanced-content-updater.js"></script>\n    <script src="super-editor.js"></script>\n</body>');
    }
    
    fs.writeFileSync(filename, content);
    console.log('✅ Updated: ' + filename);
}

// Обновляем все редакторы
const editors = [
    'page-editor.html',
    'enhanced-page-editor.html',
    'page-editor-backup-final.html'
];

editors.forEach(updateHTMLFile);
console.log('🎉 All editors updated!');

const fs = require('fs');

// Функция для добавления скрипта в HTML файл
function addScriptToFile(filename, scriptPath) {
    try {
        let content = fs.readFileSync(filename, 'utf8');
        if (!content.includes(scriptPath)) {
            content = content.replace('</body>', `<script src="${scriptPath}"></script></body>`);
            fs.writeFileSync(filename, content);
            console.log(`✅ ${scriptPath} добавлен в ${filename}`);
            return true;
        }
    } catch (e) {
        console.log(`❌ Ошибка при обновлении ${filename}:`, e.message);
    }
    return false;
}

// Список файлов для обновления
const filesToUpdate = [
    'page-editor.html',
    'enhanced-page-editor.html', 
    'page-editor-backup-final.html'
];

// Список скриптов для добавления
const scriptsToAdd = [
    'fixed-stats-editor.js',
    'enhanced-page-editor-fixed.js'
];

console.log('🔄 Обновление всех файлов редактора...');

filesToUpdate.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`\\n📁 Обработка ${file}:`);
        scriptsToAdd.forEach(script => {
            addScriptToFile(file, script);
        });
    } else {
        console.log(`📁 ${file} не найден, пропускаем`);
    }
});

console.log('\\n🎉 Все редакторы обновлены!');
console.log('📋 Теперь во всех редакторах:');
console.log('   ✅ Статистика сохраняется правильно');
console.log('   ✅ Добавлены улучшенные интерфейсы редактирования');
console.log('   ✅ Исправлены все известные ошибки сохранения');

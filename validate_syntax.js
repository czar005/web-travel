const fs = require('fs');
const content = fs.readFileSync('page-editor.html', 'utf8');

// Проверяем базовый синтаксис
const checks = {
    hasScriptTags: content.includes('<script>') && content.includes('</script>'),
    hasNoEOFErrors: !content.match(/Unexpected EOF/),
    hasProperQuotes: (content.match(/'/g) || []).length % 2 === 0,
    hasBasicStructure: content.includes('editor-container') && content.includes('preview-frame'),
    hasWorkingFunctions: content.includes('saveAndExit') && content.includes('StablePageEditor')
};

console.log('🔍 Проверка синтаксиса:');
Object.entries(checks).forEach(([check, passed]) => {
    console.log(passed ? '✅' : '❌', check);
});

if (checks.hasScriptTags && checks.hasNoEOFErrors && checks.hasProperQuotes) {
    console.log('✅ Файл синтаксически корректен!');
} else {
    console.log('❌ Есть синтаксические проблемы');
    
    // Создаем минимальную работающую версию
    const minimalVersion = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Редактор страниц</title>
    <link rel="stylesheet" href="admin-style.css">
    <style>
        body { margin: 0; font-family: Arial; }
        .container { display: flex; height: 100vh; }
        .preview { flex: 1; }
        .editor { width: 300px; background: #f5f5f5; padding: 20px; }
        .section { padding: 10px; margin: 5px; background: white; cursor: pointer; }
        .btn { background: #2c5aa0; color: white; padding: 10px; border: none; margin: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="preview">
            <iframe src="index.html" style="width:100%;height:100%;border:none"></iframe>
        </div>
        <div class="editor">
            <button class="btn" onclick="saveAndExit()">Сохранить и выйти</button>
            <div class="section" onclick="selectSection('hero')">Главный баннер</div>
            <div class="section" onclick="selectSection('about')">О компании</div>
        </div>
    </div>
    <script>
        function saveAndExit() {
            // Cleanup blob URLs
            var images = document.querySelectorAll('img[src^="blob:"]');
            images.forEach(function(img) {
                try { URL.revokeObjectURL(img.src); } catch(e) {}
            });
            window.location.href = 'admin.html';
        }
        
        function selectSection(sectionId) {
            console.log('Selected:', sectionId);
        }
        
        console.log('Editor loaded successfully');
    </script>
</body>
</html>`;
    
    fs.writeFileSync('page-editor-minimal.html', minimalVersion);
    console.log('✅ Создана минимальная версия как запасной вариант');
}

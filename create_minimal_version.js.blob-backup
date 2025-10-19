const fs = require('fs');
let content = fs.readFileSync('page-editor.html', 'utf8');

// Убираем ВСЕ параметры по умолчанию и сложные шаблонные строки
content = content.replace(/= null/g, '');
content = content.replace(/= 'text'/g, '');
content = content.replace(/= 'end'/g, '');

// Заменяем все шаблонные строки на обычные конкатенации
content = content.replace(/\$\{([^}]+)\}/g, '" + $1 + "');

// Убираем все сложные обработчики событий
content = content.replace(/window\.addEventListener\(['"](beforeunload|error)['"][^)]+\);/g, '');

// Простая версия handleImageUpload
const simpleImageUpload = `handleImageUpload(file) {
    const input = document.getElementById('image-file-input');
    const fieldId = input.getAttribute('data-field') || 'image';
    
    if (!file.type.startsWith('image/')) {
        alert('Выберите изображение');
        return;
    }
    
    // Освобождаем старый URL
    if (this.temporaryUrls.has(fieldId)) {
        URL.revokeObjectURL(this.temporaryUrls.get(fieldId));
    }
    
    // Создаем новый
    const url = URL.createObjectURL(file);
    this.temporaryUrls.set(fieldId, url);
    
    // Обновляем поле
    const field = document.querySelector('[data-field="' + fieldId + '"]');
    if (field) {
        field.value = url;
        const preview = field.parentNode.querySelector('.image-preview');
        if (preview) {
            preview.innerHTML = '<img src=\"' + url + '\" alt=\"Preview\">';
        }
    }
}`;

content = content.replace(/handleImageUpload\(file\) \{[\s\S]*?^\s+\}/m, simpleImageUpload);

fs.writeFileSync('page-editor-minimal.html', content);
console.log('✅ Минимальная версия создана');

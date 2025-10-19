const fs = require('fs');
let content = fs.readFileSync('page-editor.html', 'utf8');

// 1. Находим и исправляем проблемную функцию с параметрами по умолчанию
content = content.replace(
  /updateImageField\(url, fieldId = null\) \{/g,
  'updateImageField(url, fieldId) {'
);

// 2. Исправляем все вызовы этой функции
content = content.replace(/this\.updateImageField\([^)]+\)/g, (match) => {
  return match.replace(/= null/g, '');
});

// 3. Упрощаем конструктор - убираем все сложные конструкции
content = content.replace(
  /constructor\(\) \{[\s\S]*?this\.init\(\);[\s\S]*?\}/,
  `constructor() {
        this.currentSection = null;
        this.currentData = {};
        this.hasUnsavedChanges = false;
        this.selectedSectionType = 'text';
        this.selectedPosition = 'end';
        this.sections = [];
        this.temporaryUrls = new Map();
        this.sortable = null;
        this.init();
    }`
);

// 4. Полностью переписываем handleImageUpload без сложных конструкций
content = content.replace(
  /handleImageUpload\(file\) \{[\s\S]*?^\s+\}/gm,
  `handleImageUpload(file) {
        const fileInput = document.getElementById('image-file-input');
        const fieldId = fileInput.getAttribute('data-field');
        
        if (!file || !file.type.startsWith('image/')) {
            this.showNotification('Пожалуйста, выберите файл изображения', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            this.showNotification('Размер файла не должен превышать 5MB', 'error');
            return;
        }

        // Освобождаем предыдущий URL
        if (this.temporaryUrls.has(fieldId)) {
            const oldUrl = this.temporaryUrls.get(fieldId);
            try {
                URL.revokeObjectURL(oldUrl);
            } catch (e) {
                console.warn('Не удалось освободить URL');
            }
            this.temporaryUrls.delete(fieldId);
        }

        // Создаем новый URL
        const imageUrl = URL.createObjectURL(file);
        this.temporaryUrls.set(fieldId, imageUrl);
        
        // Находим поле и обновляем его
        const field = document.querySelector('[data-field="' + fieldId + '"]');
        if (field) {
            field.value = imageUrl;
            const preview = field.closest('.image-upload-container').querySelector('.image-preview');
            if (preview) {
                preview.innerHTML = '<img src="' + imageUrl + '" alt="Preview" onerror="this.src=\\'images/travel-placeholder.svg\\'">';
                preview.classList.remove('empty');
            }
        }
        
        this.showNotification('Изображение загружено', 'success');
        this.hasUnsavedChanges = true;
    }`
);

// 5. Упрощаем updateImageField
content = content.replace(
  /updateImageField\(url, fieldId\) \{[\s\S]*?^\s+\}/gm,
  `updateImageField(url, fieldId) {
        const field = fieldId ? 
            document.querySelector('[data-field="' + fieldId + '"]') :
            document.querySelector('[data-field="image"]');
        
        if (field) {
            field.value = url;
            const preview = field.closest('.image-upload-container').querySelector('.image-preview');
            if (preview) {
                preview.innerHTML = '<img src="' + url + '" alt="Preview" onerror="this.src=\\'images/travel-placeholder.svg\\'">';
                preview.classList.remove('empty');
            }
            this.hasUnsavedChanges = true;
        }
    }`
);

// 6. Убираем все сложные обработчики из init, оставляем только базовые
content = content.replace(
  /init\(\) \{[\s\S]*?this\.initSortable\(\);[\s\S]*?\}/s,
  `init() {
        console.log('🚀 Инициализация редактора...');
        this.loadCurrentData();
        this.setupFrameListener();
        this.setupTabHandlers();
        this.setupImageUpload();
        this.setupSectionModal();
        this.loadSectionsList();
        this.initSortable();
        
        // Базовый обработчик очистки
        window.addEventListener('beforeunload', () => {
            this.cleanupTemporaryUrls();
        });
        
        // Авто-выбор первой секции
        setTimeout(() => {
            if (this.sections.length > 0) {
                this.selectSection(this.sections[0].id);
            }
        }, 1000);
    }`
);

// 7. Упрощаем cleanupTemporaryUrls
content = content.replace(
  /cleanupTemporaryUrls\(\) \{[\s\S]*?^\s+\}/gm,
  `cleanupTemporaryUrls() {
        this.temporaryUrls.forEach((url, fieldId) => {
            try {
                URL.revokeObjectURL(url);
            } catch (e) {
                // Игнорируем ошибки освобождения
            }
        });
        this.temporaryUrls.clear();
    }`
);

// 8. Исправляем кнопки загрузки - убираем сложные шаблонные строки
content = content.replace(
  /onclick="event\.preventDefault\(\); const input = document\.getElementById\('image-file-input'\); input\.setAttribute\('data-field', '[^']+'\); input\.click\(\);"/g,
  'onclick="var input=document.getElementById(\\'image-file-input\\');input.setAttribute(\\'data-field\\',\\'image\\');input.click();"'
);

fs.writeFileSync('page-editor-fixed.html', content);
console.log('✅ Экстренные исправления применены');

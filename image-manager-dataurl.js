// Image Manager with Data URL support - решает проблему Blob URL
function ImageManagerDataURL() {
    this.maxFileSize = 2 * 1024 * 1024; // 2MB для Data URL
    this.supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    this.init();
}

ImageManagerDataURL.prototype.init = function() {
    console.log('🖼️ Image Manager with Data URL initialized');
    this.integrateWithEditor();
};

ImageManagerDataURL.prototype.integrateWithEditor = function() {
    const checkEditor = () => {
        if (window.editor) {
            this.patchEditorMethods();
            console.log('✅ Image Manager integrated with editor');
        } else {
            setTimeout(checkEditor, 100);
        }
    };
    checkEditor();
};

ImageManagerDataURL.prototype.patchEditorMethods = function() {
    const self = this;
    
    // Заменяем метод загрузки изображений на версию с Data URL
    if (window.editor.uploadImage) {
        window.editor.uploadImage = function(fieldId) {
            self.uploadImageAsDataURL(fieldId);
        };
    }
    
    // Улучшаем метод установки URL
    if (window.editor.setImageUrl) {
        const originalSetImageUrl = window.editor.setImageUrl;
        window.editor.setImageUrl = function(fieldId) {
            self.setImageUrlEnhanced(fieldId, originalSetImageUrl);
        };
    }
    
    // Добавляем метод конвертации существующих Blob URL в Data URL
    this.convertExistingBlobUrls();
};

// Конвертируем существующие Blob URL в Data URL
ImageManagerDataURL.prototype.convertExistingBlobUrls = function() {
    if (!window.editor || !window.editor.currentData) return;
    
    let converted = false;
    const data = window.editor.currentData;
    
    // Функция для рекурсивного поиска и конвертации Blob URL
    const convertBlobUrlsInObject = (obj) => {
        if (!obj || typeof obj !== 'object') return;
        
        Object.keys(obj).forEach(key => {
            const value = obj[key];
            if (typeof value === 'string' && value.startsWith('blob:')) {
                console.log('🔄 Converting blob URL to placeholder:', value);
                obj[key] = 'images/travel-placeholder.svg';
                converted = true;
            } else if (typeof value === 'object') {
                convertBlobUrlsInObject(value);
            }
        });
    };
    
    convertBlobUrlsInObject(data);
    
    if (converted) {
        console.log('✅ Converted blob URLs in data');
        // Сохраняем обновленные данные
        if (window.editor.saveData) {
            window.editor.saveData();
        }
    }
};

ImageManagerDataURL.prototype.uploadImageAsDataURL = function(fieldId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = this.supportedFormats.join(',');
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Валидация файла
        if (!this.validateFile(file)) {
            return;
        }
        
        // Читаем файл как Data URL
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            
            // Обновляем поле в редакторе
            if (window.editor && window.editor.updateImageField) {
                window.editor.updateImageField(fieldId, dataUrl);
            }
            
            this.showNotification('Изображение загружено как Data URL', 'success');
        };
        
        reader.onerror = () => {
            this.showNotification('Ошибка чтения файла', 'error');
        };
        
        reader.readAsDataURL(file);
    };
    
    input.click();
};

ImageManagerDataURL.prototype.validateFile = function(file) {
    if (!this.supportedFormats.includes(file.type)) {
        this.showNotification('Неподдерживаемый формат изображения. Используйте JPG, PNG, GIF или WebP.', 'error');
        return false;
    }
    
    if (file.size > this.maxFileSize) {
        this.showNotification(`Файл слишком большой. Максимальный размер: ${this.formatFileSize(this.maxFileSize)}.`, 'error');
        return false;
    }
    
    return true;
};

ImageManagerDataURL.prototype.setImageUrlEnhanced = function(fieldId, originalMethod) {
    const currentValue = this.getCurrentImageValue(fieldId);
    
    // Если текущее значение - Blob URL, показываем предупреждение
    if (currentValue && currentValue.startsWith('blob:')) {
        if (!confirm('Текущее изображение использует временный Blob URL. Рекомендуется загрузить изображение заново для постоянного хранения. Продолжить?')) {
            return;
        }
    }
    
    // Используем оригинальный метод, но с валидацией
    const url = prompt('Введите URL изображения:', currentValue || '');
    
    if (url === null) return;
    
    if (url === '') {
        if (window.editor && window.editor.removeImage) {
            window.editor.removeImage(fieldId);
        }
        return;
    }
    
    // Валидация URL
    if (this.validateImageUrl(url)) {
        if (window.editor && window.editor.updateImageField) {
            window.editor.updateImageField(fieldId, url);
        }
        this.showNotification('URL изображения установлен', 'success');
    } else {
        this.showNotification('Введите корректный URL изображения', 'error');
    }
};

ImageManagerDataURL.prototype.validateImageUrl = function(url) {
    try {
        // Для data URL всегда валидны
        if (url.startsWith('data:image')) return true;
        
        // Для обычных URL проверяем валидность
        if (url.startsWith('http://') || url.startsWith('https://')) {
            new URL(url);
            return true;
        }
        
        // Разрешаем относительные пути
        if (url.startsWith('/') || url.startsWith('images/') || url.startsWith('./')) {
            return true;
        }
        
        return false;
    } catch {
        return false;
    }
};

ImageManagerDataURL.prototype.getCurrentImageValue = function(fieldId) {
    const field = document.querySelector(`[data-field="${fieldId}"]`);
    return field ? field.value : '';
};

ImageManagerDataURL.prototype.formatFileSize = function(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

ImageManagerDataURL.prototype.showNotification = function(message, type) {
    if (window.editor && window.editor.showNotification) {
        window.editor.showNotification(message, type);
    } else {
        console.log(`${type === 'error' ? '❌' : '✅'} ${message}`);
    }
};

// Автоматическая очистка Blob URL при загрузке
ImageManagerDataURL.prototype.cleanupBlobUrls = function() {
    // Ревокаем все Blob URL на странице
    document.querySelectorAll('img[src^="blob:"]').forEach(img => {
        try {
            URL.revokeObjectURL(img.src);
            img.src = 'images/travel-placeholder.svg';
        } catch (e) {
            // Игнорируем ошибки ревока
        }
    });
};

// Инициализация при загрузке страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ImageManagerDataURL();
    });
} else {
    new ImageManagerDataURL();
}

// Экспортируем для использования
window.ImageManagerDataURL = ImageManagerDataURL;

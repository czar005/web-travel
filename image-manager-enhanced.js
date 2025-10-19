// Enhanced Image Manager - улучшенное управление изображениями
function ImageManagerEnhanced() {
    this.maxFileSize = 5 * 1024 * 1024; // 5MB
    this.supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    this.init();
}

ImageManagerEnhanced.prototype.init = function() {
    console.log('🖼️ Enhanced Image Manager initialized');
    
    // Интеграция с существующим редактором
    this.integrateWithEditor();
};

ImageManagerEnhanced.prototype.integrateWithEditor = function() {
    // Ждем инициализации редактора
    const checkEditor = () => {
        if (window.editor) {
            this.patchEditorMethods();
        } else {
            setTimeout(checkEditor, 100);
        }
    };
    checkEditor();
};

ImageManagerEnhanced.prototype.patchEditorMethods = function() {
    const self = this;
    
    // Патчим метод загрузки изображений редактора
    const originalUploadImage = window.editor.uploadImage;
    if (originalUploadImage) {
        window.editor.uploadImage = function(fieldId) {
            self.uploadImageWithValidation(fieldId);
        };
    }
    
    // Патчим метод установки URL изображения
    const originalSetImageUrl = window.editor.setImageUrl;
    if (originalSetImageUrl) {
        window.editor.setImageUrl = function(fieldId) {
            self.setImageUrlWithValidation(fieldId);
        };
    }
    
    console.log('✅ Enhanced Image Manager integrated with editor');
};

ImageManagerEnhanced.prototype.uploadImageWithValidation = function(fieldId) {
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
        
        // Создаем оптимизированный Blob URL
        this.createOptimizedImageBlob(file, fieldId);
    };
    
    input.click();
};

ImageManagerEnhanced.prototype.validateFile = function(file) {
    // Проверка типа файла
    if (!this.supportedFormats.includes(file.type)) {
        this.showNotification('Неподдерживаемый формат изображения. Используйте JPG, PNG, GIF или WebP.', 'error');
        return false;
    }
    
    // Проверка размера файла
    if (file.size > this.maxFileSize) {
        this.showNotification(`Файл слишком большой. Максимальный размер: ${this.formatFileSize(this.maxFileSize)}.`, 'error');
        return false;
    }
    
    return true;
};

ImageManagerEnhanced.prototype.createOptimizedImageBlob = function(file, fieldId) {
    const reader = new FileReader();
    const self = this;
    
    reader.onload = function(e) {
        // Создаем изображение для предварительной обработки
        const img = new Image();
        img.onload = function() {
            // Создаем canvas для возможной оптимизации
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Устанавливаем разумные ограничения по размеру
            const maxWidth = 1920;
            const maxHeight = 1080;
            let { width, height } = img;
            
            // Масштабируем если изображение слишком большое
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width *= ratio;
                height *= ratio;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Рисуем изображение с новыми размерами
            ctx.drawImage(img, 0, 0, width, height);
            
            // Создаем оптимизированный Blob
            canvas.toBlob((blob) => {
                const blobUrl = URL.createObjectURL(blob);
                
                // Обновляем поле в редакторе
                if (window.editor && window.editor.updateImageField) {
                    window.editor.updateImageField(fieldId, blobUrl);
                }
                
                self.showNotification('Изображение оптимизировано и загружено', 'success');
                
            }, 'image/jpeg', 0.8); // 80% качество для JPEG
        };
        
        img.onerror = function() {
            // Если оптимизация не удалась, используем оригинальный Blob URL
            const blobUrl = URL.createObjectURL(file);
            if (window.editor && window.editor.updateImageField) {
                window.editor.updateImageField(fieldId, blobUrl);
            }
            self.showNotification('Изображение загружено', 'success');
        };
        
        img.src = e.target.result;
    };
    
    reader.onerror = function() {
        self.showNotification('Ошибка чтения файла', 'error');
    };
    
    reader.readAsDataURL(file);
};

ImageManagerEnhanced.prototype.setImageUrlWithValidation = function(fieldId) {
    const currentValue = this.getCurrentImageValue(fieldId);
    const url = prompt('Введите URL изображения:', currentValue || '');
    
    if (url === null) return;
    
    if (url === '') {
        // Удаляем изображение
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
        this.showNotification('Введите корректный URL изображения (HTTP/HTTPS/data URL)', 'error');
    }
};

ImageManagerEnhanced.prototype.validateImageUrl = function(url) {
    try {
        // Проверяем валидность URL
        new URL(url);
        
        // Разрешаем HTTP, HTTPS и data URL
        return url.startsWith('http://') || 
               url.startsWith('https://') || 
               url.startsWith('data:image') ||
               url.startsWith('/') || // Относительные пути
               url.startsWith('images/'); // Относительные пути к изображениям
    } catch {
        return false;
    }
};

ImageManagerEnhanced.prototype.getCurrentImageValue = function(fieldId) {
    const field = document.querySelector(`[data-field="${fieldId}"]`);
    return field ? field.value : '';
};

ImageManagerEnhanced.prototype.formatFileSize = function(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

ImageManagerEnhanced.prototype.showNotification = function(message, type) {
    if (window.editor && window.editor.showNotification) {
        window.editor.showNotification(message, type);
    } else {
        // Фолбэк уведомление
        console.log(`${type === 'error' ? '❌' : '✅'} ${message}`);
    }
};

// Инициализация улучшенного менеджера изображений
new ImageManagerEnhanced();

// Экспортируем для использования в других модулях
window.ImageManagerEnhanced = ImageManagerEnhanced;

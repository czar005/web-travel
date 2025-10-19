// Blob Error Suppressor - подавляет ошибки Blob URL в консоли
function BlobErrorSuppressor() {
    this.suppressedErrors = new Set();
    this.init();
}

BlobErrorSuppressor.prototype.init = function() {
    console.log('🔇 Blob Error Suppressor initialized');
    
    // Перехватываем console.error
    this.patchConsoleError();
    
    // Перехватываем глобальные ошибки
    this.patchGlobalErrorHandler();
    
    // Очищаем существующие Blob URL
    this.cleanupExistingBlobUrls();
};

BlobErrorSuppressor.prototype.patchConsoleError = function() {
    const originalConsoleError = console.error;
    const self = this;
    
    console.error = function(...args) {
        // Проверяем, является ли ошибка связанной с Blob URL
        const message = args[0];
        if (typeof message === 'string') {
            // Подавляем ошибки WebKitBlobResource
            if (message.includes('WebKitBlobResource') || 
                message.includes('Failed to load resource') ||
                (message.includes('blob:') && message.includes('Failed to load'))) {
                
                const blobUrl = args[1];
                if (blobUrl && typeof blobUrl === 'string' && blobUrl.startsWith('blob:')) {
                    if (!self.suppressedErrors.has(blobUrl)) {
                        self.suppressedErrors.add(blobUrl);
                        console.warn('⚠️ Suppressed blob URL error:', blobUrl);
                    }
                    return; // Не выводим ошибку в консоль
                }
            }
            
            // Подавляем ошибки загрузки изображений с Blob URL
            if (message.includes('Failed to load image') && 
                args[1] && typeof args[1] === 'string' && args[1].startsWith('blob:')) {
                
                const blobUrl = args[1];
                if (!self.suppressedErrors.has(blobUrl)) {
                    self.suppressedErrors.add(blobUrl);
                    console.warn('⚠️ Suppressed image load error for blob URL');
                }
                return;
            }
        }
        
        // Для всех остальных ошибок используем оригинальный console.error
        originalConsoleError.apply(console, args);
    };
};

BlobErrorSuppressor.prototype.patchGlobalErrorHandler = function() {
    const self = this;
    
    window.addEventListener('error', function(e) {
        if (e.target && e.target.tagName === 'IMG') {
            const img = e.target;
            if (img.src && img.src.startsWith('blob:')) {
                // Подавляем ошибку
                e.preventDefault();
                e.stopPropagation();
                
                if (!self.suppressedErrors.has(img.src)) {
                    self.suppressedErrors.add(img.src);
                    console.warn('⚠️ Suppressed image error for blob URL:', img.src);
                }
                
                // Заменяем на placeholder
                img.src = 'images/travel-placeholder.svg';
                return false;
            }
        }
    }, true);
};

BlobErrorSuppressor.prototype.cleanupExistingBlobUrls = function() {
    // Находим все изображения с Blob URL и заменяем их
    document.querySelectorAll('img[src^="blob:"]').forEach(img => {
        try {
            URL.revokeObjectURL(img.src);
        } catch (e) {
            // Игнорируем ошибки ревока
        }
        img.src = 'images/travel-placeholder.svg';
    });
    
    // Очищаем Blob URL из localStorage
    this.cleanupBlobUrlsFromStorage();
};

BlobErrorSuppressor.prototype.cleanupBlobUrlsFromStorage = function() {
    try {
        const data = localStorage.getItem('worldtravel_data');
        if (data) {
            const parsed = JSON.parse(data);
            let needsUpdate = false;
            
            // Рекурсивно ищем и заменяем Blob URL
            const replaceBlobUrls = (obj) => {
                if (!obj || typeof obj !== 'object') return;
                
                Object.keys(obj).forEach(key => {
                    const value = obj[key];
                    if (typeof value === 'string' && value.startsWith('blob:')) {
                        obj[key] = 'images/travel-placeholder.svg';
                        needsUpdate = true;
                    } else if (typeof value === 'object') {
                        replaceBlobUrls(value);
                    }
                });
            };
            
            replaceBlobUrls(parsed);
            
            if (needsUpdate) {
                localStorage.setItem('worldtravel_data', JSON.stringify(parsed));
                console.log('✅ Cleaned blob URLs from localStorage');
            }
        }
    } catch (e) {
        console.warn('⚠️ Could not cleanup blob URLs from storage:', e);
    }
};

// Инициализация подавителя ошибок
new BlobErrorSuppressor();

// Экспортируем для использования
window.BlobErrorSuppressor = BlobErrorSuppressor;

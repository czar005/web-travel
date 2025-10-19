// Blob URL Fixer - исправляет проблемы с Blob URL без нарушения функционала
function BlobUrlFixer() {
    this.fixedBlobs = new Set();
    this.init();
}

BlobUrlFixer.prototype.init = function() {
    console.log('🔧 Blob URL Fixer initialized');
    
    // Перехватываем создание Blob URL
    this.patchURLCreateObjectURL();
    
    // Мониторим ошибки загрузки изображений
    this.monitorImageErrors();
    
    // Периодическая очистка неиспользуемых Blob URL
    setInterval(() => this.cleanupUnusedBlobs(), 60000); // Каждую минуту
};

// Патчим URL.createObjectURL для отслеживания созданных Blob URL
BlobUrlFixer.prototype.patchURLCreateObjectURL = function() {
    const originalCreateObjectURL = URL.createObjectURL;
    const self = this;
    
    URL.createObjectURL = function(blob) {
        const blobUrl = originalCreateObjectURL.call(this, blob);
        console.log('📸 Blob URL created:', blobUrl);
        self.fixedBlobs.add(blobUrl);
        
        // Автоматически ревокаем через 5 минут для предотвращения утечек памяти
        setTimeout(() => {
            if (self.fixedBlobs.has(blobUrl)) {
                try {
                    URL.revokeObjectURL(blobUrl);
                    self.fixedBlobs.delete(blobUrl);
                    console.log('🧹 Blob URL automatically revoked:', blobUrl);
                } catch (e) {
                    console.warn('⚠️ Could not auto-revoke blob URL:', e);
                }
            }
        }, 300000); // 5 минут
        
        return blobUrl;
    };
};

// Мониторим ошибки загрузки изображений
BlobUrlFixer.prototype.monitorImageErrors = function() {
    document.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG') {
            const img = e.target;
            const src = img.src;
            
            if (src.startsWith('blob:')) {
                console.warn('⚠️ Blob URL image failed to load:', src);
                
                // Заменяем на placeholder только если это Blob URL
                this.replaceBrokenBlobImage(img, src);
            }
        }
    }, true);
};

// Заменяем битое Blob изображение
BlobUrlFixer.prototype.replaceBrokenBlobImage = function(imgElement, blobUrl) {
    try {
        // Ревокаем битый Blob URL
        if (this.fixedBlobs.has(blobUrl)) {
            URL.revokeObjectURL(blobUrl);
            this.fixedBlobs.delete(blobUrl);
        }
        
        // Устанавливаем placeholder
        imgElement.src = 'images/travel-placeholder.svg';
        imgElement.alt = 'Изображение не загружено';
        imgElement.style.opacity = '0.7';
        
        console.log('🔄 Replaced broken blob image with placeholder');
        
    } catch (error) {
        console.error('Error replacing broken blob image:', error);
    }
};

// Очистка неиспользуемых Blob URL
BlobUrlFixer.prototype.cleanupUnusedBlobs = function() {
    const blobsToRemove = [];
    
    this.fixedBlobs.forEach(blobUrl => {
        // Проверяем, используется ли еще этот Blob URL на странице
        const isUsed = Array.from(document.images).some(img => img.src === blobUrl);
        
        if (!isUsed) {
            blobsToRemove.push(blobUrl);
        }
    });
    
    // Ревокаем неиспользуемые Blob URL
    blobsToRemove.forEach(blobUrl => {
        try {
            URL.revokeObjectURL(blobUrl);
            this.fixedBlobs.delete(blobUrl);
            console.log('🧹 Cleaned up unused blob URL:', blobUrl);
        } catch (e) {
            console.warn('⚠️ Could not cleanup blob URL:', e);
        }
    });
    
    if (blobsToRemove.length > 0) {
        console.log(`🧹 Cleaned up ${blobsToRemove.length} unused blob URLs`);
    }
};

// Глобальный обработчик ошибок для изображений
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG' && e.target.src.startsWith('blob:')) {
        // Подавляем вывод ошибок в консоль для Blob URL
        e.preventDefault();
        e.stopPropagation();
    }
}, true);

// Инициализация фиксера
new BlobUrlFixer();

// Экспортируем для использования в других модулях
window.BlobUrlFixer = BlobUrlFixer;

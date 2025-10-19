// Enhanced Media Manager - управление изображениями и видео
function EnhancedMediaManager() {
    this.init();
}

EnhancedMediaManager.prototype.init = function() {
    console.log('🎬 Enhanced Media Manager initialized');
    this.integrateWithEditor();
};

EnhancedMediaManager.prototype.integrateWithEditor = function() {
    if (!window.editor) {
        setTimeout(() => this.integrateWithEditor(), 100);
        return;
    }
    
    this.patchImageManagersForVideo();
    this.addMediaSupportToSections();
};

EnhancedMediaManager.prototype.patchImageManagersForVideo = function() {
    const originalInjectImageManagers = window.editor.injectImageManagers;
    const self = this;
    
    window.editor.injectImageManagers = function() {
        if (originalInjectImageManagers) {
            originalInjectImageManagers.call(this);
        }
        
        // Добавляем поддержку видео в существующие менеджеры изображений
        self.addVideoSupportToExistingManagers.call(this);
    };
};

EnhancedMediaManager.prototype.addVideoSupportToExistingManagers = function() {
    const contentEditor = document.getElementById('content-editor');
    if (!contentEditor) return;
    
    const mediaManagers = contentEditor.querySelectorAll('.unified-image-manager');
    
    mediaManagers.forEach(manager => {
        const fieldInput = manager.querySelector('input[data-field]');
        if (!fieldInput) return;
        
        const fieldId = fieldInput.getAttribute('data-field');
        const currentValue = fieldInput.value;
        
        // Определяем тип медиа по текущему значению
        const isVideo = currentValue.includes('.mp4') || currentValue.includes('.webm') || 
                       currentValue.includes('.ogg') || currentValue.includes('data:video');
        
        // Добавляем кнопки для видео если это поддерживающая секция
        if (this.isVideoSupportedSection(fieldId)) {
            this.addVideoButtonsToManager(manager, fieldId, isVideo);
        }
    });
};

EnhancedMediaManager.prototype.isVideoSupportedSection = function(fieldId) {
    // Секции где поддерживается видео
    const videoSections = ['hero', 'about', 'image', 'heroImage', 'aboutImage'];
    return videoSections.some(section => fieldId.includes(section));
};

EnhancedMediaManager.prototype.addVideoButtonsToManager = function(manager, fieldId, isVideo) {
    const buttonsContainer = manager.querySelector('div:first-child div:last-child');
    if (!buttonsContainer) return;
    
    // Проверяем, не добавлены ли уже кнопки видео
    if (buttonsContainer.querySelector('.btn-video')) return;
    
    // Добавляем кнопки для видео
    const videoButtonsHTML = `
        <button type="button" class="btn-admin btn-video" onclick="window.editor.uploadVideo('${fieldId}')" 
                style="background: #e83e8c; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; font-size: 0.9em; margin-right: 5px;">
            <i class="fas fa-video"></i> Видео
        </button>
        <button type="button" class="btn-admin btn-video-url" onclick="window.editor.setVideoUrl('${fieldId}')" 
                style="background: #6f42c1; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; font-size: 0.9em; margin-right: 5px;">
            <i class="fas fa-link"></i> URL Видео
        </button>
    `;
    
    buttonsContainer.insertAdjacentHTML('afterbegin', videoButtonsHTML);
    
    // Обновляем заголовок и рекомендации
    const title = manager.querySelector('strong');
    if (title) {
        title.textContent = '🎬 Управление медиа (изображения/видео)';
    }
    
    const recommendations = manager.querySelector('.admin-hint');
    if (recommendations) {
        recommendations.innerHTML = `
            <strong style="display: block; margin-bottom: 5px; color: #1976d2;">💡 Рекомендации:</strong>
            <ul style="margin: 0; padding-left: 15px; font-size: 0.85em; color: #1565c0;">
                <li><strong>Изображения:</strong> JPG, PNG, GIF, WebP (до 5MB)</li>
                <li><strong>Видео:</strong> MP4, WebM, OGG (до 50MB)</li>
                <li>Рекомендуемое соотношение: 16:9</li>
            </ul>
        `;
    }
    
    console.log('✅ Video buttons added to media manager for field:', fieldId);
};

EnhancedMediaManager.prototype.addMediaSupportToSections = function() {
    // Добавляем поддержку видео в секции которые должны её иметь
    const videoSections = ['hero', 'about'];
    
    videoSections.forEach(sectionId => {
        this.ensureVideoSupportInSection(sectionId);
    });
};

EnhancedMediaManager.prototype.ensureVideoSupportInSection = function(sectionId) {
    // Эта функция гарантирует что в указанной секции есть поддержка видео
    const checkSection = () => {
        if (window.editor.currentSection && window.editor.currentSection.id === sectionId) {
            const contentEditor = document.getElementById('content-editor');
            if (contentEditor) {
                const mediaManager = contentEditor.querySelector('.unified-image-manager');
                if (mediaManager) {
                    const fieldInput = mediaManager.querySelector('input[data-field]');
                    if (fieldInput) {
                        const fieldId = fieldInput.getAttribute('data-field');
                        this.addVideoButtonsToManager(mediaManager, fieldId, false);
                    }
                }
            }
        }
    };
    
    // Проверяем при смене секции
    const originalSelectSection = window.editor.selectSection;
    window.editor.selectSection = function(sectionId) {
        const result = originalSelectSection.call(this, sectionId);
        setTimeout(() => {
            if (['hero', 'about'].includes(sectionId)) {
                checkSection();
            }
        }, 300);
        return result;
    };
};

// Инициализация
new EnhancedMediaManager();

// Экспортируем для использования
window.EnhancedMediaManager = EnhancedMediaManager;

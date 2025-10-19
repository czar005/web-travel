// Исправление футера, контактов и дублирующихся редакторов
function FixFooterAndContacts() {
    this.init();
}

FixFooterAndContacts.prototype.init = function() {
    console.log('🔧 Fix Footer and Contacts initialized');
    
    // Исправляем футер и контакты сразу
    this.fixFooterLinks();
    this.fixContactsStructure();
    this.fixDuplicateSchedule();
    
    // Интегрируем с редактором
    this.integrateWithEditor();
};

// Исправление быстрых ссылок в футере
FixFooterAndContacts.prototype.fixFooterLinks = function() {
    const footerLinksSection = document.querySelector('.footer-section:nth-child(2)');
    if (!footerLinksSection) return;
    
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const correctTitles = [];
    
    // Собираем правильные названия из навигации
    navLinks.forEach(link => {
        if (!link.href.includes('admin-login')) {
            correctTitles.push({
                href: link.getAttribute('href'),
                text: link.textContent.trim()
            });
        }
    });
    
    // Обновляем ссылки в футере
    const footerLinks = footerLinksSection.querySelectorAll('a');
    footerLinks.forEach((link, index) => {
        if (correctTitles[index]) {
            const correctTitle = correctTitles[index];
            if (link.textContent !== correctTitle.text) {
                console.log(`🔄 Fixing footer link: ${link.textContent} -> ${correctTitle.text}`);
                link.textContent = correctTitle.text;
            }
            // Убедимся что ссылка правильная
            if (link.getAttribute('href') !== correctTitle.href) {
                link.setAttribute('href', correctTitle.href);
            }
        }
    });
    
    console.log('✅ Footer links fixed');
};

// Исправление структуры контактов
FixFooterAndContacts.prototype.fixContactsStructure = function() {
    const contactInfo = document.querySelector('.contact-info');
    if (!contactInfo) return;
    
    const contactItems = contactInfo.querySelectorAll('.contact-item');
    const expectedStructure = [
        { type: 'phone', icon: 'fa-phone', label: 'Телефон:' },
        { type: 'email', icon: 'fa-envelope', label: 'Email:' },
        { type: 'address', icon: 'fa-map-marker-alt', label: 'Адрес:' },
        { type: 'hours', icon: 'fa-clock', label: 'Часы работы:' }
    ];
    
    let needsFix = false;
    
    // Проверяем текущую структуру
    contactItems.forEach((item, index) => {
        const expected = expectedStructure[index];
        const icon = item.querySelector('i');
        const label = item.querySelector('strong');
        const value = item.querySelector('p');
        
        if (!icon || !label || !value) {
            needsFix = true;
            return;
        }
        
        // Проверяем иконку
        if (!icon.classList.contains(expected.icon)) {
            needsFix = true;
        }
        
        // Проверяем label
        if (label.textContent !== expected.label) {
            needsFix = true;
        }
    });
    
    if (needsFix || contactItems.length !== 4) {
        console.log('🔄 Rebuilding contacts structure...');
        this.rebuildContactsStructure(contactInfo);
    }
};

FixFooterAndContacts.prototype.rebuildContactsStructure = function(contactInfo) {
    // Получаем текущие данные
    const currentData = this.getCurrentContactData();
    
    const newStructure = `
        <h3>Наши контакты</h3>
        <div class="contact-item">
            <i class="fas fa-phone"></i>
            <div>
                <strong>Телефон:</strong>
                <p class="contact-phone">${currentData.phone}</p>
            </div>
        </div>
        <div class="contact-item">
            <i class="fas fa-envelope"></i>
            <div>
                <strong>Email:</strong>
                <p class="contact-email">${currentData.email}</p>
            </div>
        </div>
        <div class="contact-item">
            <i class="fas fa-map-marker-alt"></i>
            <div>
                <strong>Адрес:</strong>
                <p class="contact-address">${currentData.address}</p>
            </div>
        </div>
        <div class="contact-item">
            <i class="fas fa-clock"></i>
            <div>
                <strong>Часы работы:</strong>
                <p class="contact-hours">${currentData.hours}</p>
            </div>
        </div>
    `;
    
    contactInfo.innerHTML = newStructure;
    console.log('✅ Contacts structure rebuilt');
};

FixFooterAndContacts.prototype.getCurrentContactData = function() {
    // Пробуем получить данные из разных мест
    const contactInfo = document.querySelector('.contact-info');
    const items = contactInfo?.querySelectorAll('.contact-item') || [];
    
    const data = {
        phone: '+7 (999) 123-45-67',
        email: 'info@worldtravel.com',
        address: 'Москва, ул. Туристическая, 15',
        hours: 'Пн-Пт: 9:00-18:00'
    };
    
    items.forEach((item, index) => {
        const value = item.querySelector('p')?.textContent || '';
        switch(index) {
            case 0: data.phone = value || data.phone; break;
            case 1: data.email = value || data.email; break;
            case 2: data.address = value || data.address; break;
            case 3: data.hours = value || data.hours; break;
        }
    });
    
    return data;
};

// Исправление дублирования графика в футере
FixFooterAndContacts.prototype.fixDuplicateSchedule = function() {
    const footerContacts = document.querySelector('.footer-section:nth-child(3)');
    if (!footerContacts) return;
    
    const paragraphs = footerContacts.querySelectorAll('p');
    const uniqueTexts = new Set();
    const duplicates = [];
    
    // Находим дубликаты
    paragraphs.forEach(p => {
        const text = p.textContent.trim();
        if (uniqueTexts.has(text)) {
            duplicates.push(p);
        } else {
            uniqueTexts.add(text);
        }
    });
    
    // Удаляем дубликаты
    duplicates.forEach(dup => {
        dup.remove();
        console.log('🗑️ Removed duplicate schedule:', dup.textContent);
    });
    
    // Убедимся что осталось 4 элемента (телефон, email, адрес, график)
    const remainingParagraphs = footerContacts.querySelectorAll('p');
    if (remainingParagraphs.length > 4) {
        for (let i = 4; i < remainingParagraphs.length; i++) {
            remainingParagraphs[i].remove();
        }
    }
    
    console.log('✅ Duplicate schedule fixed');
};

// Интеграция с редактором для исправления дублирующихся блоков
FixFooterAndContacts.prototype.integrateWithEditor = function() {
    if (!window.editor) {
        setTimeout(() => this.integrateWithEditor(), 100);
        return;
    }
    
    this.patchEditorForSingleBlocks();
    this.addVideoSupport();
};

// Исправление дублирующихся блоков в редакторе
FixFooterAndContacts.prototype.patchEditorForSingleBlocks = function() {
    const originalShowContentEditor = window.editor.showContentEditor;
    const self = this;
    
    window.editor.showContentEditor = function() {
        originalShowContentEditor.call(this);
        
        // Удаляем дублирующиеся блоки после отрисовки редактора
        setTimeout(() => {
            self.removeDuplicateEditors.call(this);
        }, 200);
    };
};

FixFooterAndContacts.prototype.removeDuplicateEditors = function() {
    const contentEditor = document.getElementById('content-editor');
    if (!contentEditor) return;
    
    // Удаляем дублирующиеся редакторы статистики
    const statsEditors = contentEditor.querySelectorAll('[class*="stats"][class*="editor"]');
    if (statsEditors.length > 1) {
        for (let i = 1; i < statsEditors.length; i++) {
            statsEditors[i].remove();
            console.log('🗑️ Removed duplicate stats editor');
        }
    }
    
    // Удаляем дублирующиеся редакторы услуг
    const servicesEditors = contentEditor.querySelectorAll('[class*="services"][class*="editor"]');
    if (servicesEditors.length > 1) {
        for (let i = 1; i < servicesEditors.length; i++) {
            servicesEditors[i].remove();
            console.log('🗑️ Removed duplicate services editor');
        }
    }
    
    // Убедимся что есть только один unified редактор
    const unifiedEditors = contentEditor.querySelectorAll('[class*="unified"]');
    const editorTypes = new Set();
    
    unifiedEditors.forEach(editor => {
        const editorType = Array.from(editor.classList).find(cls => 
            cls.includes('stats') || cls.includes('services')
        );
        if (editorType && editorTypes.has(editorType)) {
            editor.remove();
            console.log(`🗑️ Removed duplicate unified ${editorType} editor`);
        } else if (editorType) {
            editorTypes.add(editorType);
        }
    });
};

// Добавление поддержки видео
FixFooterAndContacts.prototype.addVideoSupport = function() {
    if (!window.editor) return;
    
    // Добавляем методы для работы с видео
    window.editor.uploadVideo = function(fieldId) {
        this.uploadMedia(fieldId, 'video');
    };
    
    window.editor.setVideoUrl = function(fieldId) {
        this.setMediaUrl(fieldId, 'video');
    };
    
    window.editor.uploadMedia = function(fieldId, mediaType) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = mediaType === 'video' ? 'video/*' : 'image/*';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            // Проверяем размер файла
            const maxSize = mediaType === 'video' ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
            if (file.size > maxSize) {
                this.showNotification(`Файл слишком большой. Максимальный размер: ${this.formatFileSize(maxSize)}`, 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                this.updateMediaField(fieldId, e.target.result, mediaType);
                this.showNotification(`${mediaType === 'video' ? 'Видео' : 'Изображение'} загружено`, 'success');
            };
            reader.onerror = () => {
                this.showNotification(`Ошибка загрузки ${mediaType === 'video' ? 'видео' : 'изображения'}`, 'error');
            };
            reader.readAsDataURL(file);
        };
        
        input.click();
    };
    
    window.editor.setMediaUrl = function(fieldId, mediaType) {
        const currentValue = this.getCurrentMediaValue(fieldId);
        const url = prompt(`Введите URL ${mediaType === 'video' ? 'видео' : 'изображения'}:`, currentValue || '');
        
        if (url === null) return;
        
        if (url === '') {
            this.removeMedia(fieldId);
            return;
        }
        
        if (this.validateMediaUrl(url, mediaType)) {
            this.updateMediaField(fieldId, url, mediaType);
            this.showNotification(`URL ${mediaType === 'video' ? 'видео' : 'изображения'} установлен`, 'success');
        } else {
            this.showNotification(`Введите корректный URL ${mediaType === 'video' ? 'видео' : 'изображения'}`, 'error');
        }
    };
    
    window.editor.updateMediaField = function(fieldId, url, mediaType) {
        const field = document.querySelector(`[data-field="${fieldId}"]`);
        if (field) {
            field.value = url;
            
            // Обновляем превью
            const manager = field.closest('.unified-image-manager') || field.parentNode.querySelector('.unified-image-manager');
            if (manager) {
                const preview = manager.querySelector('.image-preview');
                if (preview) {
                    if (mediaType === 'video') {
                        preview.innerHTML = `
                            <video controls style="max-width: 100%; max-height: 100%;">
                                <source src="${url}" type="video/mp4">
                                Ваш браузер не поддерживает видео.
                            </video>
                        `;
                    } else {
                        preview.innerHTML = `<img src="${url}" alt="Preview" style="max-width: 100%; max-height: 100%; object-fit: cover;">`;
                    }
                }
            }
            
            this.hasUnsavedChanges = true;
        }
    };
    
    window.editor.validateMediaUrl = function(url, mediaType) {
        if (url.startsWith('data:')) return true;
        if (url.startsWith('http://') || url.startsWith('https://')) return true;
        if (url.startsWith('/') || url.startsWith('images/') || url.startsWith('videos/')) return true;
        
        // Для видео проверяем расширения
        if (mediaType === 'video') {
            const videoExtensions = ['.mp4', '.webm', '.ogg'];
            return videoExtensions.some(ext => url.toLowerCase().includes(ext));
        }
        
        return false;
    };
    
    window.editor.formatFileSize = function(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    console.log('✅ Video support added to editor');
};

// Запускаем исправления
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new FixFooterAndContacts();
    });
} else {
    new FixFooterAndContacts();
}

// Экспортируем для использования
window.FixFooterAndContacts = FixFooterAndContacts;

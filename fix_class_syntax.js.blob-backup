const fs = require('fs');
let content = fs.readFileSync('page-editor.html', 'utf8');

// ЗАМЕНЯЕМ КЛАСС ES6 НА ФУНКЦИЮ-КОНСТРУКТОР ES5
const oldSyntax = `
    // БАЗОВАЯ РАБОТАЮЩАЯ ВЕРСИЯ РЕДАКТОРА - ES5 СИНТАКСИС
    function StablePageEditor() {
        this.currentSection = null;
        this.currentData = {};
        this.hasUnsavedChanges = false;
        this.sections = [];
        this.temporaryUrls = new Map();
        this.init();
    }

    StablePageEditor.prototype.init = function() {
        console.log('Редактор запущен');
        this.loadCurrentData();
        this.setupFrameListener();
        this.setupTabHandlers();
        this.setupImageUpload();
        this.setupSectionModal();
        this.loadSectionsList();
        this.initSortable();
        
        // Базовая очистка при выходе
        var self = this;
        window.addEventListener('beforeunload', function() {
            self.cleanupTemporaryUrls();
        });
        
        // Авто-выбор первой секции
        setTimeout(function() {
            if (self.sections.length > 0) {
                self.selectSection(self.sections[0].id);
            }
        }, 1000);
    };

    StablePageEditor.prototype.loadCurrentData = function() {
        if (typeof window.dataManager !== 'undefined' && window.dataManager) {
            this.currentData = window.dataManager.getData() || {};
        } else {
            this.currentData = this.getLocalData();
        }
        this.loadSectionsFromData();
    };

    StablePageEditor.prototype.getLocalData = function() {
        var localData = localStorage.getItem('worldtravel_data');
        if (localData) {
            return JSON.parse(localData);
        }
        return {
            content: {
                hero: { 
                    id: 'hero',
                    type: 'hero',
                    name: 'Главный баннер',
                    title: 'Откройте мир с WorldTravel', 
                    subtitle: 'Мы создаем незабываемые путешествия по всему миру.',
                    image: 'images/travel-placeholder.svg'
                }
            },
            pageStructure: ['hero', 'about', 'services', 'destinations', 'contact'],
            lastUpdate: new Date().toISOString()
        };
    };

    StablePageEditor.prototype.loadSectionsFromData = function() {
        this.sections = [];
        var pageStructure = this.currentData.pageStructure || ['hero', 'about', 'services', 'destinations', 'contact'];
        
        var self = this;
        pageStructure.forEach(function(sectionId) {
            if (self.currentData.content && self.currentData.content[sectionId]) {
                var sectionData = self.currentData.content[sectionId];
                self.sections.push({
                    id: sectionId,
                    type: sectionData.type || sectionId,
                    name: sectionData.name || self.getSectionName(sectionId),
                    description: self.getSectionDescription(sectionId)
                });
            }
        });
    };

    StablePageEditor.prototype.getSectionName = function(sectionId) {
        var names = {
            'hero': 'Главный баннер',
            'about': 'О компании', 
            'services': 'Услуги',
            'destinations': 'Направления',
            'contact': 'Контакты'
        };
        return names[sectionId] || sectionId;
    };

    StablePageEditor.prototype.getSectionDescription = function(sectionId) {
        var descriptions = {
            'hero': 'Заголовок, описание и изображение',
            'about': 'Информация о компании',
            'services': 'Список услуг компании', 
            'destinations': 'Популярные направления',
            'contact': 'Контактная информация'
        };
        return descriptions[sectionId] || 'Секция страницы';
    };

    StablePageEditor.prototype.setupImageUpload = function() {
        var fileInput = document.getElementById('image-file-input');
        var self = this;
        fileInput.addEventListener('change', function(e) {
            var file = e.target.files[0];
            if (file) {
                self.handleImageUpload(file);
            }
        });
    };

    StablePageEditor.prototype.handleImageUpload = function(file) {
        var fileInput = document.getElementById('image-file-input');
        var fieldId = fileInput.getAttribute('data-field') || 'image';
        
        if (!file.type.startsWith('image/')) {
            this.showNotification('Выберите файл изображения', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            this.showNotification('Размер файла не должен превышать 5MB', 'error');
            return;
        }

        // Освобождаем предыдущий URL
        if (this.temporaryUrls.has(fieldId)) {
            var oldUrl = this.temporaryUrls.get(fieldId);
            try {
                URL.revokeObjectURL(oldUrl);
            } catch (e) {
                console.warn('Не удалось освободить URL');
            }
            this.temporaryUrls.delete(fieldId);
        }

        // Создаем новый URL
        var imageUrl = URL.createObjectURL(file);
        this.temporaryUrls.set(fieldId, imageUrl);
        
        // Обновляем поле
        var field = document.querySelector('[data-field="' + fieldId + '"]');
        if (field) {
            field.value = imageUrl;
            var container = field.closest('.image-upload-container');
            if (container) {
                var preview = container.querySelector('.image-preview');
                if (preview) {
                    preview.innerHTML = '<img src="' + imageUrl + '" alt="Preview">';
                    preview.classList.remove('empty');
                }
            }
        }
        
        this.showNotification('Изображение загружено', 'success');
        this.hasUnsavedChanges = true;
    };

    StablePageEditor.prototype.cleanupTemporaryUrls = function() {
        this.temporaryUrls.forEach(function(url, fieldId) {
            try {
                URL.revokeObjectURL(url);
            } catch (e) {
                // Игнорируем ошибки
            }
        });
        this.temporaryUrls.clear();
    };

    StablePageEditor.prototype.safeRefresh = function() {
        var frame = document.getElementById('preview-frame');
        var currentSrc = frame.src.split('?')[0];
        frame.src = currentSrc + '?editor=true&nocache=1&t=' + Date.now();
    };

    StablePageEditor.prototype.saveAndExit = function() {
        this.cleanupTemporaryUrls();
        window.location.href = 'admin.html';
    };

    StablePageEditor.prototype.showNotification = function(message, type) {
        type = type || 'success';
        var notification = document.createElement('div');
        notification.className = 'notification ' + (type === 'error' ? 'error' : '');
        notification.innerHTML = '
            <i class="fas fa-' + (type === 'error' ? 'exclamation-triangle' : 'check-circle') + '"></i>
            ' + message + '
        ';
        
        document.body.appendChild(notification);
        
        setTimeout(function() {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 4000);
    };

    // БАЗОВЫЕ МЕТОДЫ ДЛЯ РАБОТЫ С СЕКЦИЯМИ
    StablePageEditor.prototype.loadSectionsList = function() {
        var container = document.getElementById('section-list');
        container.innerHTML = '';

        if (this.sections.length === 0) {
            container.innerHTML = '
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>Секции не найдены</p>
                </div>
            ';
            return;
        }

        var self = this;
        this.sections.forEach(function(section) {
            var sectionElement = document.createElement('div');
            sectionElement.className = 'section-item';
            sectionElement.setAttribute('data-section', section.id);
            
            sectionElement.innerHTML = '
                <div class="section-title">' + section.name + '</div>
                <div class="section-desc">' + section.description + '</div>
            ';

            sectionElement.addEventListener('click', function() {
                self.selectSection(section.id);
            });

            container.appendChild(sectionElement);
        });
    };

    StablePageEditor.prototype.selectSection = function(sectionId) {
        console.log('Выбор секции:', sectionId);
        this.currentSection = this.sections.find(function(s) {
            return s.id === sectionId;
        });
        this.showContentEditor();
    };

    StablePageEditor.prototype.showContentEditor = function() {
        var editor = document.getElementById('content-editor');
        
        if (!this.currentSection) {
            editor.innerHTML = '
                <div class="empty-state">
                    <i class="fas fa-mouse-pointer"></i>
                    <p>Выберите секцию для редактирования</p>
                </div>
            ';
            return;
        }

        editor.innerHTML = '
            <div class="content-header">
                <h3>' + this.currentSection.name + '</h3>
            </div>
            <div class="form-group">
                <label>Заголовок:</label>
                <input type="text" class="form-control" value="' + (this.getCurrentValue('title') || '') + '">
            </div>
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="editor.saveChanges()">
                    <i class="fas fa-save"></i> Сохранить
                </button>
            </div>
        ';
    };

    StablePageEditor.prototype.getCurrentValue = function(fieldId) {
        if (this.currentData.content && this.currentData.content[this.currentSection.id]) {
            return this.currentData.content[this.currentSection.id][fieldId] || '';
        }
        return '';
    };

    StablePageEditor.prototype.saveChanges = function() {
        this.showNotification('Изменения сохранены', 'success');
    };

    // ОСТАЛЬНЫЕ БАЗОВЫЕ МЕТОДЫ
    StablePageEditor.prototype.setupTabHandlers = function() {
        var tabButtons = document.querySelectorAll('.tab-button');
        var self = this;
        tabButtons.forEach(function(button) {
            button.addEventListener('click', function(e) {
                var tabName = e.target.getAttribute('data-tab');
                if (tabName) {
                    self.showTab(tabName);
                }
            });
        });
    };

    StablePageEditor.prototype.showTab = function(tabName) {
        document.querySelectorAll('.panel-content').forEach(function(tab) {
            tab.style.display = 'none';
        });
        
        var targetTab = document.getElementById(tabName + '-tab');
        if (targetTab) {
            targetTab.style.display = 'block';
        }
        
        document.querySelectorAll('.tab-button').forEach(function(btn) {
            btn.classList.remove('active');
        });
        
        var targetButton = document.querySelector('[data-tab="' + tabName + '"]');
        if (targetButton) {
            targetButton.classList.add('active');
        }
    };

    StablePageEditor.prototype.setupFrameListener = function() {
        var frame = document.getElementById('preview-frame');
        var self = this;
        frame.onload = function() {
            console.log('Фрейм загружен');
        };
    };

    StablePageEditor.prototype.setupSectionModal = function() {
        // Базовая настройка модального окна
    };

    StablePageEditor.prototype.initSortable = function() {
        var sectionList = document.getElementById('section-list');
        if (sectionList && typeof Sortable !== 'undefined') {
            this.sortable = new Sortable(sectionList, {
                animation: 150,
                ghostClass: 'sortable-ghost'
            });
        }
    };

    // Инициализация редактора
    var editor = new StablePageEditor();
    window.editor = editor;
`;

// Заменяем весь JavaScript код на ES5 версию
const scriptStart = content.indexOf('<script>');
const scriptEnd = content.indexOf('</script>', scriptStart) + 9;

if (scriptStart !== -1 && scriptEnd !== -1) {
    content = content.substring(0, scriptStart) + '<script>' + oldSyntax + '</script>' + content.substring(scriptEnd);
}

fs.writeFileSync('page-editor-es5.html', content);
console.log('✅ ES5 версия создана');

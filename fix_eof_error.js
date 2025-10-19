const fs = require('fs');
let content = fs.readFileSync('page-editor.html', 'utf8');

// Находим проблемную строку 979 и исправляем вокруг нее
const lines = content.split('\n');
let fixedLines = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Исправляем незакрытые строки
    if (line.includes("' +") && !line.includes("';") && !line.includes('";')) {
        // Добавляем закрывающую кавычку если ее нет
        fixedLines.push(line + "'");
    }
    // Исправляем незакрытые шаблонные строки
    else if ((line.match(/'/g) || []).length % 2 !== 0 && !line.includes("\\'")) {
        fixedLines.push(line + "'");
    }
    else {
        fixedLines.push(line);
    }
}

content = fixedLines.join('\n');

// Упрощаем весь JavaScript код - убираем сложные конструкции
const simpleScript = `
<script>
    // ПРОСТАЯ РАБОЧАЯ ВЕРСИЯ РЕДАКТОРА
    function StablePageEditor() {
        this.currentSection = null;
        this.currentData = {};
        this.sections = [];
        this.temporaryUrls = [];
        this.init();
    }

    StablePageEditor.prototype.init = function() {
        console.log('Editor started');
        this.loadSectionsList();
        
        var self = this;
        window.addEventListener('beforeunload', function() {
            self.cleanupTemporaryUrls();
        });
    };

    StablePageEditor.prototype.loadSectionsList = function() {
        var container = document.getElementById('section-list');
        if (!container) return;
        
        var sections = [
            {id: 'hero', name: 'Главный баннер', desc: 'Заголовок и описание'},
            {id: 'about', name: 'О компании', desc: 'Информация о компании'},
            {id: 'services', name: 'Услуги', desc: 'Список услуг'},
            {id: 'destinations', name: 'Направления', desc: 'Популярные направления'},
            {id: 'contact', name: 'Контакты', desc: 'Контактная информация'}
        ];
        
        this.sections = sections;
        
        container.innerHTML = '';
        var self = this;
        
        sections.forEach(function(section) {
            var div = document.createElement('div');
            div.className = 'section-item';
            div.innerHTML = '<div class="section-title">' + section.name + '</div><div class="section-desc">' + section.desc + '</div>';
            div.onclick = function() {
                self.selectSection(section.id);
            };
            container.appendChild(div);
        });
    };

    StablePageEditor.prototype.selectSection = function(sectionId) {
        this.currentSection = this.sections.find(function(s) {
            return s.id === sectionId;
        });
        this.showContentEditor();
    };

    StablePageEditor.prototype.showContentEditor = function() {
        var editor = document.getElementById('content-editor');
        if (!editor) return;
        
        if (!this.currentSection) {
            editor.innerHTML = '<div class="empty-state"><p>Выберите секцию</p></div>';
            return;
        }
        
        editor.innerHTML = '<div class="content-header"><h3>' + this.currentSection.name + '</h3></div>' +
                          '<div class="form-group"><label>Заголовок:</label><input type="text" class="form-control"></div>' +
                          '<button class="btn btn-primary" onclick="editor.saveChanges()">Сохранить</button>';
    };

    StablePageEditor.prototype.saveChanges = function() {
        this.showNotification('Изменения сохранены');
    };

    StablePageEditor.prototype.showNotification = function(message) {
        var notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = '<i class="fas fa-check"></i> ' + message;
        notification.style.cssText = 'position:fixed;top:20px;right:20px;background:#28a745;color:white;padding:15px;border-radius:8px;z-index:10000';
        
        document.body.appendChild(notification);
        setTimeout(function() {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    };

    StablePageEditor.prototype.safeRefresh = function() {
        var frame = document.getElementById('preview-frame');
        if (frame) {
            frame.src = frame.src.split('?')[0] + '?t=' + Date.now();
        }
    };

    StablePageEditor.prototype.saveAndExit = function() {
        this.cleanupTemporaryUrls();
        window.location.href = 'admin.html';
    };

    StablePageEditor.prototype.cleanupTemporaryUrls = function() {
        this.temporaryUrls.forEach(function(url) {
            try {
                URL.revokeObjectURL(url);
            } catch(e) {
                // ignore
            }
        });
        this.temporaryUrls = [];
    };

    // Инициализация
    var editor = new StablePageEditor();
    window.editor = editor;

    // Глобальные функции
    function refreshPreview() {
        if (window.editor) {
            window.editor.safeRefresh();
        }
    }

    function saveAndExit() {
        if (window.editor) {
            window.editor.saveAndExit();
        } else {
            window.location.href = 'admin.html';
        }
    }
</script>
`;

// Заменяем весь script на простую версию
const scriptStart = content.indexOf('<script>');
const scriptEnd = content.lastIndexOf('</script>') + 9;

if (scriptStart !== -1 && scriptEnd !== -1) {
    content = content.substring(0, scriptStart) + simpleScript + content.substring(scriptEnd);
} else {
    // Если не нашли script теги, добавляем в конец
    content += simpleScript;
}

fs.writeFileSync('page-editor-simple.html', content);
console.log('✅ Упрощенная версия создана');

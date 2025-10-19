// Улучшенный редактор с исправленным сохранением статистики
function EnhancedPageEditorFixed() {
    this.init();
}

EnhancedPageEditorFixed.prototype.init = function() {
    console.log('🚀 Улучшенный редактор с исправлениями загружен');
    this.patchExistingEditor();
    this.injectEnhancedUI();
};

EnhancedPageEditorFixed.prototype.patchExistingEditor = function() {
    if (!window.editor) {
        setTimeout(() => this.patchExistingEditor(), 100);
        return;
    }

    // Патчим метод showContentEditor для добавления редактора статистики
    const originalShowContentEditor = window.editor.showContentEditor;
    window.editor.showContentEditor = function() {
        originalShowContentEditor.call(this);
        this.injectStatsEditor();
        this.injectServicesEditor();
    };

    // Патчим метод saveChanges для правильного сохранения
    const originalSaveChanges = window.editor.saveChanges;
    window.editor.saveChanges = function() {
        this.saveStatsData();
        this.saveServicesData();
        return originalSaveChanges.call(this);
    };

    // Добавляем методы для работы со статистикой
    window.editor.injectStatsEditor = function() {
        if (this.currentSection?.id !== 'about') return;
        
        const contentEditor = document.getElementById('content-editor');
        if (!contentEditor) return;

        // Удаляем старый редактор статистики если есть
        const oldEditor = contentEditor.querySelector('.stats-editor-enhanced');
        if (oldEditor) oldEditor.remove();

        const stats = this.currentData.content?.about?.stats || [];
        
        const statsHTML = `
            <div class="stats-editor-enhanced" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #e9ecef;">
                <h4 style="color: #2c5aa0; margin-bottom: 15px;">📊 Управление статистикой</h4>
                <div class="admin-hint" style="color: #666; margin-bottom: 15px; font-style: italic;">
                    Редактируйте блоки статистики. Изменения сохраняются автоматически при нажатии "Сохранить изменения"
                </div>
                <div id="stats-list-enhanced">
                    ${stats.map((stat, index) => `
                        <div class="stat-row-enhanced" style="display: flex; gap: 10px; margin-bottom: 15px; align-items: center; padding: 15px; background: white; border-radius: 6px; border: 1px solid #e9ecef;">
                            <input type="text" class="form-control" value="${stat.value}" placeholder="Значение" 
                                   oninput="window.editor.updateStatData(${index}, 'value', this.value)">
                            <input type="text" class="form-control" value="${stat.label}" placeholder="Подпись" 
                                   oninput="window.editor.updateStatData(${index}, 'label', this.value)">
                            <button class="btn-small danger" onclick="window.editor.removeStatData(${index})" style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
                <div class="dynamic-items-controls" style="display: flex; gap: 10px; margin-top: 15px;">
                    <button class="btn-admin" onclick="window.editor.addStatData()" style="background: #28a745; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
                        <i class="fas fa-plus"></i> Добавить статистику
                    </button>
                </div>
            </div>
        `;

        // Вставляем после описания
        const descriptionField = contentEditor.querySelector('[data-field="description"]');
        if (descriptionField) {
            descriptionField.closest('.form-group').insertAdjacentHTML('afterend', statsHTML);
        }
    };

    // Методы для работы со статистикой
    window.editor.addStatData = function() {
        if (!this.currentData.content.about) this.currentData.content.about = {};
        if (!this.currentData.content.about.stats) this.currentData.content.about.stats = [];
        
        this.currentData.content.about.stats.push({ 
            value: '0', 
            label: 'Новый показатель' 
        });
        
        this.hasUnsavedChanges = true;
        this.injectStatsEditor();
        this.showNotification('Статистика добавлена', 'success');
    };

    window.editor.updateStatData = function(index, field, value) {
        if (!this.currentData.content.about) this.currentData.content.about = {};
        if (!this.currentData.content.about.stats) this.currentData.content.about.stats = [];
        
        if (!this.currentData.content.about.stats[index]) {
            this.currentData.content.about.stats[index] = {};
        }
        
        this.currentData.content.about.stats[index][field] = value;
        this.hasUnsavedChanges = true;
    };

    window.editor.removeStatData = function(index) {
        if (this.currentData.content?.about?.stats?.[index]) {
            this.currentData.content.about.stats.splice(index, 1);
            this.hasUnsavedChanges = true;
            this.injectStatsEditor();
            this.showNotification('Статистика удалена', 'success');
        }
    };

    window.editor.saveStatsData = function() {
        if (this.currentSection?.id !== 'about') return;
        
        const statsList = document.getElementById('stats-list-enhanced');
        if (!statsList) return;

        const statRows = statsList.querySelectorAll('.stat-row-enhanced');
        const stats = [];

        statRows.forEach(row => {
            const inputs = row.querySelectorAll('input');
            if (inputs.length >= 2) {
                stats.push({
                    value: inputs[0].value,
                    label: inputs[1].value
                });
            }
        });

        console.log('💾 Сохранение статистики:', stats);
        
        if (!this.currentData.content.about) {
            this.currentData.content.about = {};
        }
        this.currentData.content.about.stats = stats;
    };

    // Аналогичные методы для услуг
    window.editor.injectServicesEditor = function() {
        if (this.currentSection?.id !== 'services') return;
        
        // Реализация редактора услуг аналогична статистике
        console.log('🎯 Внедрение редактора услуг...');
    };

    window.editor.saveServicesData = function() {
        if (this.currentSection?.id !== 'services') return;
        // Реализация сохранения услуг
    };
};

EnhancedPageEditorFixed.prototype.injectEnhancedUI = function() {
    // Добавляем CSS стили для улучшенного редактора
    const style = document.createElement('style');
    style.textContent = `
        .stats-editor-enhanced {
            transition: all 0.3s ease;
        }
        
        .stat-row-enhanced:hover {
            border-color: #2c5aa0 !important;
            background: #f8f9fa !important;
        }
        
        @media (max-width: 768px) {
            .stat-row-enhanced {
                flex-direction: column !important;
                align-items: stretch !important;
            }
        }
    `;
    document.head.appendChild(style);
};

// Инициализация
new EnhancedPageEditorFixed();

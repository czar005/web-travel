// Улучшенный редактор с редактированием статистики и услуг
class EnhancedEditor {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 Улучшенный редактор загружен');
        this.injectStatsEditor();
        this.injectServicesEditor();
    }

    injectStatsEditor() {
        // Добавляем редактор статистики в редактор страниц
        const originalShowContentEditor = window.editor?.showContentEditor;
        if (window.editor && originalShowContentEditor) {
            window.editor.showContentEditor = function() {
                originalShowContentEditor.call(this);
                this.enhanceStatsEditing();
            }.bind(window.editor);
        }
    }

    injectServicesEditor() {
        // Добавляем редактор услуг в редактор страниц
        const originalShowContentEditor = window.editor?.showContentEditor;
        if (window.editor && originalShowContentEditor) {
            window.editor.showContentEditor = function() {
                originalShowContentEditor.call(this);
                this.enhanceServicesEditing();
            }.bind(window.editor);
        }
    }
}

// Расширяем функциональность существующего редактора
if (window.editor) {
    // Метод для улучшения редактирования статистики
    window.editor.enhanceStatsEditing = function() {
        if (this.currentSection?.id === 'about') {
            const contentEditor = document.getElementById('content-editor');
            const statsSection = contentEditor.querySelector('.stats-editor');
            
            if (!statsSection) {
                this.injectStatsEditorUI(contentEditor);
            }
        }
    };

    // Метод для улучшения редактирования услуг
    window.editor.enhanceServicesEditing = function() {
        if (this.currentSection?.id === 'services') {
            const contentEditor = document.getElementById('content-editor');
            const servicesSection = contentEditor.querySelector('.services-editor');
            
            if (!servicesSection) {
                this.injectServicesEditorUI(contentEditor);
            }
        }
    };

    // Внедряем UI редактора статистики
    window.editor.injectStatsEditorUI = function(container) {
        const stats = this.currentData.content?.about?.stats || [];
        
        const statsHTML = `
            <div class="stats-editor">
                <h4>Управление статистикой</h4>
                <div class="admin-hint">Добавляйте, редактируйте или удаляйте блоки статистики</div>
                <div id="stats-list">
                    ${stats.map((stat, index) => `
                        <div class="stat-row" data-index="${index}">
                            <input type="text" class="form-control" value="${stat.value}" placeholder="Значение" onchange="editor.updateStat(${index}, 'value', this.value)">
                            <input type="text" class="form-control" value="${stat.label}" placeholder="Подпись" onchange="editor.updateStat(${index}, 'label', this.value)">
                            <button class="btn-small danger" onclick="editor.removeStat(${index})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
                <div class="dynamic-items-controls">
                    <button class="btn-admin" onclick="editor.addStat()">
                        <i class="fas fa-plus"></i> Добавить статистику
                    </button>
                </div>
            </div>
        `;

        // Находим место для вставки после описания
        const descriptionField = container.querySelector('[data-field="description"]');
        if (descriptionField) {
            descriptionField.closest('.form-group').insertAdjacentHTML('afterend', statsHTML);
        }
    };

    // Внедряем UI редактора услуг
    window.editor.injectServicesEditorUI = function(container) {
        const services = this.currentData.content?.services?.services || [];
        
        const servicesHTML = `
            <div class="services-editor">
                <h4>Управление услугами</h4>
                <div class="admin-hint">Добавляйте, редактируйте или удаляйте услуги</div>
                <div id="services-list">
                    ${services.map((service, index) => `
                        <div class="service-row" data-index="${index}">
                            <input type="text" class="form-control" value="${service.title}" placeholder="Название услуги" onchange="editor.updateService(${index}, 'title', this.value)">
                            <textarea class="form-control" placeholder="Описание услуги" onchange="editor.updateService(${index}, 'description', this.value)">${service.description}</textarea>
                            <input type="text" class="form-control" value="${service.icon}" placeholder="Иконка (fas fa-...)" onchange="editor.updateService(${index}, 'icon', this.value)">
                            <button class="btn-small danger" onclick="editor.removeService(${index})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
                <div class="dynamic-items-controls">
                    <button class="btn-admin" onclick="editor.addService()">
                        <i class="fas fa-plus"></i> Добавить услугу
                    </button>
                </div>
            </div>
        `;

        // Находим место для вставки после заголовка
        const titleField = container.querySelector('[data-field="title"]');
        if (titleField) {
            titleField.closest('.form-group').insertAdjacentHTML('afterend', servicesHTML);
        }
    };

    // Методы для работы со статистикой
    window.editor.addStat = function() {
        if (!this.currentData.content.about) this.currentData.content.about = {};
        if (!this.currentData.content.about.stats) this.currentData.content.about.stats = [];
        
        this.currentData.content.about.stats.push({ 
            value: 'Новое значение', 
            label: 'Новая подпись' 
        });
        
        this.saveData();
        this.showContentEditor();
        this.showNotification('Статистика добавлена', 'success');
    };

    window.editor.updateStat = function(index, field, value) {
        if (this.currentData.content?.about?.stats?.[index]) {
            this.currentData.content.about.stats[index][field] = value;
            this.saveData();
            this.hasUnsavedChanges = true;
        }
    };

    window.editor.removeStat = function(index) {
        if (this.currentData.content?.about?.stats?.[index]) {
            this.currentData.content.about.stats.splice(index, 1);
            this.saveData();
            this.showContentEditor();
            this.showNotification('Статистика удалена', 'success');
        }
    };

    // Методы для работы с услугами
    window.editor.addService = function() {
        if (!this.currentData.content.services) this.currentData.content.services = {};
        if (!this.currentData.content.services.services) this.currentData.content.services.services = [];
        
        this.currentData.content.services.services.push({ 
            title: 'Новая услуга', 
            description: 'Описание новой услуги',
            icon: 'fas fa-star'
        });
        
        this.saveData();
        this.showContentEditor();
        this.showNotification('Услуга добавлена', 'success');
    };

    window.editor.updateService = function(index, field, value) {
        if (this.currentData.content?.services?.services?.[index]) {
            this.currentData.content.services.services[index][field] = value;
            this.saveData();
            this.hasUnsavedChanges = true;
        }
    };

    window.editor.removeService = function(index) {
        if (this.currentData.content?.services?.services?.[index]) {
            this.currentData.content.services.services.splice(index, 1);
            this.saveData();
            this.showContentEditor();
            this.showNotification('Услуга удалена', 'success');
        }
    };
}

// Инициализация улучшенного редактора
new EnhancedEditor();

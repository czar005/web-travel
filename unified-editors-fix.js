// Unified Editors Fix - гарантирует один редактор для статистики и услуг
function UnifiedEditorsFix() {
    this.init();
}

UnifiedEditorsFix.prototype.init = function() {
    console.log('🔧 Unified Editors Fix initialized');
    this.integrateWithEditor();
};

UnifiedEditorsFix.prototype.integrateWithEditor = function() {
    if (!window.editor) {
        setTimeout(() => this.integrateWithEditor(), 100);
        return;
    }
    
    this.patchEditorForSingleEditors();
    this.ensureSingleEditors();
};

UnifiedEditorsFix.prototype.patchEditorForSingleEditors = function() {
    const self = this;
    
    // Патчим метод показа редактора контента
    const originalShowContentEditor = window.editor.showContentEditor;
    window.editor.showContentEditor = function() {
        const result = originalShowContentEditor.call(this);
        
        // После отрисовки редактора удаляем дубликаты
        setTimeout(() => {
            self.removeDuplicateEditors.call(this);
            self.ensureProperEditorStructure.call(this);
        }, 300);
        
        return result;
    };
};

UnifiedEditorsFix.prototype.removeDuplicateEditors = function() {
    const contentEditor = document.getElementById('content-editor');
    if (!contentEditor) return;
    
    let removedCount = 0;
    
    // Удаляем все дублирующиеся редакторы статистики
    const allStatsEditors = contentEditor.querySelectorAll('[class*="stats"]');
    const statsEditors = Array.from(allStatsEditors).filter(editor => 
        editor.textContent.includes('статистик') || 
        editor.textContent.includes('Stats') ||
        editor.classList.contains('stats-editor') ||
        editor.classList.contains('stats-manager') ||
        editor.classList.contains('unified-stats-editor')
    );
    
    if (statsEditors.length > 1) {
        // Оставляем только первый unified редактор, либо создаем новый
        const unifiedEditor = statsEditors.find(editor => 
            editor.classList.contains('unified-stats-editor')
        );
        
        statsEditors.forEach(editor => {
            if (editor !== unifiedEditor) {
                editor.remove();
                removedCount++;
            }
        });
        
        // Если нет unified редактора, создаем его
        if (!unifiedEditor && this.currentSection?.id === 'about') {
            this.injectUnifiedStatsEditor();
            removedCount++;
        }
    }
    
    // Удаляем все дублирующиеся редакторы услуг
    const allServicesEditors = contentEditor.querySelectorAll('[class*="services"]');
    const servicesEditors = Array.from(allServicesEditors).filter(editor => 
        editor.textContent.includes('услуг') || 
        editor.textContent.includes('Services') ||
        editor.classList.contains('services-editor') ||
        editor.classList.contains('services-manager') ||
        editor.classList.contains('unified-services-editor')
    );
    
    if (servicesEditors.length > 1) {
        // Оставляем только первый unified редактор, либо создаем новый
        const unifiedEditor = servicesEditors.find(editor => 
            editor.classList.contains('unified-services-editor')
        );
        
        servicesEditors.forEach(editor => {
            if (editor !== unifiedEditor) {
                editor.remove();
                removedCount++;
            }
        });
        
        // Если нет unified редактора, создаем его
        if (!unifiedEditor && this.currentSection?.id === 'services') {
            this.injectUnifiedServicesEditor();
            removedCount++;
        }
    }
    
    if (removedCount > 0) {
        console.log(`🗑️ Removed ${removedCount} duplicate editors`);
    }
};

UnifiedEditorsFix.prototype.ensureProperEditorStructure = function() {
    const contentEditor = document.getElementById('content-editor');
    if (!contentEditor) return;
    
    // Для секции "О компании" - один редактор статистики
    if (this.currentSection?.id === 'about') {
        const hasStatsEditor = contentEditor.querySelector('.unified-stats-editor');
        if (!hasStatsEditor) {
            console.log('🔄 Creating missing unified stats editor');
            this.injectUnifiedStatsEditor();
        }
        
        // Удаляем любые другие редакторы статистики
        const otherStatsEditors = contentEditor.querySelectorAll('[class*="stats"]:not(.unified-stats-editor)');
        otherStatsEditors.forEach(editor => {
            if (editor.textContent.includes('статистик') || editor.textContent.includes('Stats')) {
                editor.remove();
                console.log('🗑️ Removed non-unified stats editor');
            }
        });
    }
    
    // Для секции "Услуги" - один редактор услуг
    if (this.currentSection?.id === 'services') {
        const hasServicesEditor = contentEditor.querySelector('.unified-services-editor');
        if (!hasServicesEditor) {
            console.log('🔄 Creating missing unified services editor');
            this.injectUnifiedServicesEditor();
        }
        
        // Удаляем любые другие редакторы услуг
        const otherServicesEditors = contentEditor.querySelectorAll('[class*="services"]:not(.unified-services-editor)');
        otherServicesEditors.forEach(editor => {
            if (editor.textContent.includes('услуг') || editor.textContent.includes('Services')) {
                editor.remove();
                console.log('🗑️ Removed non-unified services editor');
            }
        });
    }
};

// Добавляем методы инъекции если их нет
UnifiedEditorsFix.prototype.addMissingMethods = function() {
    if (!window.editor.injectUnifiedStatsEditor) {
        window.editor.injectUnifiedStatsEditor = function() {
            // Базовая реализация unified редактора статистики
            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor || this.currentSection?.id !== 'about') return;
            
            const stats = this.currentData.content?.about?.stats || [];
            
            const statsHTML = `
                <div class="unified-stats-editor" style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border: 2px solid #e9ecef;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h4 style="color: #2c5aa0; margin: 0;">📊 Управление статистикой</h4>
                        <button class="btn-admin" onclick="window.editor.addStatData()" style="background: #28a745; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
                            <i class="fas fa-plus"></i> Добавить
                        </button>
                    </div>
                    
                    <div id="unified-stats-list">
                        ${stats.length > 0 ? stats.map((stat, index) => `
                            <div class="stat-item-unified" style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 12px; margin-bottom: 15px; align-items: center; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e9ecef;">
                                <input type="text" class="form-control" value="${stat.value || ''}" placeholder="5000" 
                                       oninput="window.editor.updateStatData(${index}, 'value', this.value)" style="width: 100%;">
                                <input type="text" class="form-control" value="${stat.label || ''}" placeholder="Довольных клиентов" 
                                       oninput="window.editor.updateStatData(${index}, 'label', this.value)" style="width: 100%;">
                                <button class="btn-small danger" onclick="window.editor.removeStatData(${index})" 
                                        style="background: #dc3545; color: white; border: none; padding: 10px 12px; border-radius: 6px; cursor: pointer;">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `).join('') : `
                            <div style="text-align: center; padding: 40px 20px; color: #666; background: white; border-radius: 8px; border: 2px dashed #ddd;">
                                <i class="fas fa-chart-bar" style="font-size: 3em; margin-bottom: 15px; display: block; color: #ccc;"></i>
                                <p>Статистика не добавлена</p>
                            </div>
                        `}
                    </div>
                </div>
            `;
            
            const descriptionField = contentEditor.querySelector('[data-field="description"]');
            if (descriptionField) {
                descriptionField.closest('.form-group').insertAdjacentHTML('afterend', statsHTML);
            }
        };
    }
    
    if (!window.editor.injectUnifiedServicesEditor) {
        window.editor.injectUnifiedServicesEditor = function() {
            // Базовая реализация unified редактора услуг
            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor || this.currentSection?.id !== 'services') return;
            
            const services = this.currentData.content?.services?.services || [];
            
            const servicesHTML = `
                <div class="unified-services-editor" style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border: 2px solid #e9ecef;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h4 style="color: #2c5aa0; margin: 0;">🎯 Управление услугами</h4>
                        <button class="btn-admin" onclick="window.editor.addServiceData()" style="background: #28a745; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
                            <i class="fas fa-plus"></i> Добавить
                        </button>
                    </div>
                    
                    <div id="unified-services-list">
                        ${services.length > 0 ? services.map((service, index) => `
                            <div class="service-item-unified" style="margin-bottom: 20px; padding: 20px; background: white; border-radius: 8px; border: 1px solid #e9ecef;">
                                <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 12px; margin-bottom: 15px; align-items: start;">
                                    <input type="text" class="form-control" value="${service.title || ''}" placeholder="Авиабилеты" 
                                           oninput="window.editor.updateServiceData(${index}, 'title', this.value)" style="width: 100%;">
                                    <input type="text" class="form-control" value="${service.icon || 'fas fa-star'}" placeholder="fas fa-plane" 
                                           oninput="window.editor.updateServiceData(${index}, 'icon', this.value)" style="width: 100%;">
                                    <button class="btn-small danger" onclick="window.editor.removeServiceData(${index})" 
                                            style="background: #dc3545; color: white; border: none; padding: 10px 12px; border-radius: 6px; cursor: pointer;">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                                <textarea class="form-control" placeholder="Описание услуги..." 
                                          oninput="window.editor.updateServiceData(${index}, 'description', this.value)"
                                          style="width: 100%; min-height: 80px; resize: vertical;">${service.description || ''}</textarea>
                            </div>
                        `).join('') : `
                            <div style="text-align: center; padding: 40px 20px; color: #666; background: white; border-radius: 8px; border: 2px dashed #ddd;">
                                <i class="fas fa-concierge-bell" style="font-size: 3em; margin-bottom: 15px; display: block; color: #ccc;"></i>
                                <p>Услуги не добавлены</p>
                            </div>
                        `}
                    </div>
                </div>
            `;
            
            const titleField = contentEditor.querySelector('[data-field="title"]');
            if (titleField) {
                titleField.closest('.form-group').insertAdjacentHTML('afterend', servicesHTML);
            }
        };
    }
};

// Инициализация
new UnifiedEditorsFix();

// Экспортируем для использования
window.UnifiedEditorsFix = UnifiedEditorsFix;

// Исправленный редактор статистики с правильным сохранением
class FixedStatsEditor {
    constructor() {
        this.init();
    }

    init() {
        console.log('🔧 Исправленный редактор статистики загружен');
        this.overrideEditorMethods();
        this.injectGlobalSaveHandler();
    }

    overrideEditorMethods() {
        // Переопределяем методы редактора для правильного сохранения статистики
        if (window.editor) {
            this.enhanceSaveMethods();
        } else {
            // Ждем инициализации редактора
            setTimeout(() => this.overrideEditorMethods(), 100);
        }
    }

    enhanceSaveMethods() {
        const originalSaveChanges = window.editor.saveChanges;
        
        window.editor.saveChanges = function() {
            console.log('💾 Перехвачен вызов сохранения...');
            
            // Сначала собираем данные статистики
            this.collectStatsData();
            
            // Затем вызываем оригинальный метод
            return originalSaveChanges.call(this);
        }.bind(window.editor);

        // Добавляем метод сбора данных статистики
        window.editor.collectStatsData = function() {
            const statsList = document.getElementById('stats-list');
            if (!statsList) return;

            const statRows = statsList.querySelectorAll('.stat-row');
            const stats = [];

            statRows.forEach(row => {
                const valueInput = row.querySelector('input[placeholder="Значение"]');
                const labelInput = row.querySelector('input[placeholder="Подпись"]');
                
                if (valueInput && labelInput) {
                    stats.push({
                        value: valueInput.value,
                        label: labelInput.value
                    });
                }
            });

            console.log('📊 Собрана статистика:', stats);
            
            // Сохраняем в данные
            if (!this.currentData.content.about) {
                this.currentData.content.about = {};
            }
            this.currentData.content.about.stats = stats;
        };

        // Улучшаем методы работы со статистикой
        window.editor.addStat = function() {
            if (!this.currentData.content.about) this.currentData.content.about = {};
            if (!this.currentData.content.about.stats) this.currentData.content.about.stats = [];
            
            this.currentData.content.about.stats.push({ 
                value: 'Новое значение', 
                label: 'Новая подпись' 
            });
            
            this.saveData(); // Сохраняем сразу
            this.showContentEditor();
            this.showNotification('Статистика добавлена', 'success');
        };

        window.editor.updateStat = function(index, field, value) {
            if (!this.currentData.content.about) this.currentData.content.about = {};
            if (!this.currentData.content.about.stats) this.currentData.content.about.stats = [];
            
            if (!this.currentData.content.about.stats[index]) {
                this.currentData.content.about.stats[index] = {};
            }
            
            this.currentData.content.about.stats[index][field] = value;
            this.hasUnsavedChanges = true;
            console.log('📝 Обновлена статистика:', index, field, value);
        };

        window.editor.removeStat = function(index) {
            if (this.currentData.content?.about?.stats?.[index]) {
                this.currentData.content.about.stats.splice(index, 1);
                this.saveData(); // Сохраняем сразу
                this.showContentEditor();
                this.showNotification('Статистика удалена', 'success');
            }
        };
    }

    injectGlobalSaveHandler() {
        // Глобальный обработчик для кнопки сохранения
        document.addEventListener('click', (e) => {
            if (e.target.id === 'save-changes-btn' || 
                e.target.closest('#save-changes-btn')) {
                this.forceStatsSave();
            }
        });
    }

    forceStatsSave() {
        if (window.editor && window.editor.currentSection?.id === 'about') {
            console.log('🔍 Принудительное сохранение статистики...');
            window.editor.collectStatsData();
        }
    }
}

// Автоматическая инициализация
new FixedStatsEditor();

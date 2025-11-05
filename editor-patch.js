// EDITOR PATCH - гарантированное сохранение данных из редактора
console.log('🔧 EDITOR PATCH LOADED');

function patchEditor() {
    console.log('🎯 Patching editor for guaranteed save...');
    
    // Ждем пока редактор загрузится
    const waitForEditor = setInterval(() => {
        if (window.fixedEditor) {
            clearInterval(waitForEditor);
            applyEditorPatch();
        }
    }, 100);
    
    // Таймаут на случай если редактор не загрузится
    setTimeout(() => {
        clearInterval(waitForEditor);
    }, 5000);
}

function applyEditorPatch() {
    console.log('🔧 Applying editor patch...');
    
    // Патчим метод saveSection для ГАРАНТИРОВАННОГО сохранения
    const originalSaveSection = window.fixedEditor.saveSection;
    
    window.fixedEditor.saveSection = function() {
        console.log('💾 GUARANTEED SAVE: Starting...');
        
        if (!this.currentSection || !window.dataManager) {
            console.error('❌ Cannot save: no section or dataManager');
            return;
        }
        
        try {
            // 1. Получаем текущие данные
            const currentData = window.dataManager.getData();
            if (!currentData) {
                console.error('❌ No current data');
                return;
            }
            
            // 2. Обновляем базовые поля
            const title = document.getElementById('section-title')?.value || '';
            const description = document.getElementById('section-description')?.value || '';
            
            // 3. Обеспечиваем структуру данных
            if (!currentData.content) currentData.content = {};
            if (!currentData.content[this.currentSection]) {
                currentData.content[this.currentSection] = {};
            }
            
            // 4. Сохраняем базовые поля
            currentData.content[this.currentSection].title = title;
            currentData.content[this.currentSection].description = description;
            
            // 5. КРИТИЧЕСКИ ВАЖНО: сохраняем stats и services из currentData редактора
            if (this.currentData?.content?.[this.currentSection]) {
                console.log('🔄 Merging editor data:', this.currentData.content[this.currentSection]);
                
                // Сохраняем stats если есть
                if (this.currentData.content[this.currentSection].stats) {
                    currentData.content[this.currentSection].stats = 
                        this.currentData.content[this.currentSection].stats;
                    console.log('📊 Saving stats:', currentData.content[this.currentSection].stats);
                }
                
                // Сохраняем services если есть
                if (this.currentData.content[this.currentSection].services) {
                    currentData.content[this.currentSection].services = 
                        this.currentData.content[this.currentSection].services;
                    console.log('🎯 Saving services:', currentData.content[this.currentSection].services);
                }
                
                // Сохраняем images если есть
                if (this.currentData.content[this.currentSection].image) {
                    currentData.content[this.currentSection].image = 
                        this.currentData.content[this.currentSection].image;
                }
                
                if (this.currentData.content[this.currentSection].backgroundImage) {
                    currentData.content[this.currentSection].backgroundImage = 
                        this.currentData.content[this.currentSection].backgroundImage;
                }
            }
            
            // 6. Обновляем timestamp
            currentData.lastUpdate = new Date().toISOString();
            
            console.log('💾 FINAL DATA TO SAVE:', {
                section: this.currentSection,
                content: currentData.content[this.currentSection]
            });
            
            // 7. Сохраняем через dataManager
            const saveResult = window.dataManager.setData(currentData);
            
            if (saveResult) {
                console.log('✅ GUARANTEED SAVE: Success!');
                this.showSaveIndicator('Изменения сохранены успешно!');
                
                // Форсируем синхронизацию
                if (window.forceRealSync) {
                    setTimeout(window.forceRealSync, 100);
                }
                
                // Обновляем превью
                this.safeRefresh();
            } else {
                console.error('❌ GUARANTEED SAVE: Failed!');
                alert('Ошибка сохранения данных');
            }
            
            return saveResult;
            
        } catch (error) {
            console.error('❌ GUARANTEED SAVE: Error:', error);
            alert('Ошибка сохранения: ' + error.message);
            return false;
        }
    };
    
    console.log('✅ Editor patch applied successfully');
}

// Запускаем патч
patchEditor();

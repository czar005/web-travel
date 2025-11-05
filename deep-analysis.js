// Deep Analysis - диагностика реальной проблемы
console.log('🔍 DEEP ANALYSIS STARTED');

function analyzeDataFlow() {
    console.group('🔍 ANALYZING DATA FLOW');
    
    // 1. Проверяем dataManager
    console.log('📊 DataManager check:');
    console.log('- window.dataManager:', window.dataManager ? 'EXISTS' : 'MISSING');
    if (window.dataManager) {
        const data = window.dataManager.getData();
        console.log('- Current data structure:', data);
        console.log('- Content sections:', data?.content ? Object.keys(data.content) : 'NO CONTENT');
        
        // Проверяем конкретно секции со статистикой и услугами
        if (data?.content?.about) {
            console.log('- About stats:', data.content.about.stats);
        }
        if (data?.content?.services) {
            console.log('- Services:', data.content.services.services);
        }
    }
    
    // 2. Проверяем localStorage
    console.log('📁 LocalStorage check:');
    const localData = localStorage.getItem('worldtravel_data');
    if (localData) {
        try {
            const parsed = JSON.parse(localData);
            console.log('- LocalStorage data:', parsed);
            console.log('- LocalStorage content sections:', parsed?.content ? Object.keys(parsed.content) : 'NO CONTENT');
        } catch (e) {
            console.log('- LocalStorage parse error');
        }
    } else {
        console.log('- LocalStorage empty');
    }
    
    // 3. Проверяем редактор
    console.log('🎯 Editor check:');
    console.log('- window.editor:', window.editor ? 'EXISTS' : 'MISSING');
    console.log('- window.fixedEditor:', window.fixedEditor ? 'EXISTS' : 'MISSING');
    
    if (window.fixedEditor) {
        console.log('- fixedEditor currentData:', window.fixedEditor.currentData);
        console.log('- fixedEditor currentSection:', window.fixedEditor.currentSection);
    }
    
    console.groupEnd();
}

// Проверяем события сохранения
function monitorSaveEvents() {
    console.log('🎯 MONITORING SAVE EVENTS');
    
    // Перехватываем вызовы dataManager.setData
    const originalSetData = window.dataManager?.setData;
    if (originalSetData) {
        window.dataManager.setData = function(newData) {
            console.log('💾 dataManager.setData CALLED:');
            console.log('- New data:', newData);
            console.log('- Content to save:', newData.content);
            console.log('- About stats to save:', newData.content?.about?.stats);
            console.log('- Services to save:', newData.content?.services?.services);
            
            const result = originalSetData.call(this, newData);
            console.log('- Save result:', result);
            return result;
        };
    }
    
    // Мониторим localStorage изменения
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        if (key === 'worldtravel_data') {
            console.log('💾 localStorage.setItem CALLED for worldtravel_data');
            try {
                const parsed = JSON.parse(value);
                console.log('- Saved stats:', parsed.content?.about?.stats);
                console.log('- Saved services:', parsed.content?.services?.services);
            } catch (e) {
                console.log('- Parse error in monitored setItem');
            }
        }
        return originalSetItem.call(this, key, value);
    };
}

// Проверяем структуру DOM для карточек
function analyzeCardStructure() {
    console.group('🔍 ANALYZING CARD DOM STRUCTURE');
    
    // Статистика
    const statsContainer = document.querySelector('.stats');
    console.log('📊 Stats container:', statsContainer ? 'EXISTS' : 'MISSING');
    if (statsContainer) {
        const statElements = document.querySelectorAll('.stat');
        console.log('- Stat elements found:', statElements.length);
        statElements.forEach((stat, index) => {
            const value = stat.querySelector('h3');
            const label = stat.querySelector('p');
            console.log(`- Stat ${index + 1}:`, {
                value: value?.textContent,
                label: label?.textContent,
                display: stat.style.display
            });
        });
    }
    
    // Услуги
    const servicesContainer = document.querySelector('.services-grid');
    console.log('🎯 Services container:', servicesContainer ? 'EXISTS' : 'MISSING');
    if (servicesContainer) {
        const serviceCards = document.querySelectorAll('.service-card');
        console.log('- Service cards found:', serviceCards.length);
        serviceCards.forEach((card, index) => {
            const title = card.querySelector('h3');
            const desc = card.querySelector('p');
            const icon = card.querySelector('.service-icon i');
            console.log(`- Service ${index + 1}:`, {
                title: title?.textContent,
                desc: desc?.textContent,
                icon: icon?.className,
                display: card.style.display
            });
        });
    }
    
    console.groupEnd();
}

// Запускаем анализ
setTimeout(() => {
    analyzeDataFlow();
    monitorSaveEvents(); 
    analyzeCardStructure();
    
    // Делаем функции доступными
    window.deepAnalyze = analyzeDataFlow;
    window.analyzeCards = analyzeCardStructure;
    
    console.log('🔧 Analysis functions available:');
    console.log('   window.deepAnalyze() - анализ потока данных');
    console.log('   window.analyzeCards() - анализ структуры карточек');
}, 2000);

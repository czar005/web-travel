// Исправления для ContentUpdater

class FixedContentUpdater extends ContentUpdater {
    applyCustomSections(data) {
        if (!data.pageStructure || !data.content) return;

        console.log('🔄 Applying custom sections with order:', data.pageStructure);

        // Создаем контейнер для пользовательских секций перед футером
        let customSectionsContainer = document.getElementById('custom-sections');
        if (!customSectionsContainer) {
            customSectionsContainer = document.createElement('div');
            customSectionsContainer.id = 'custom-sections';
            const footer = document.querySelector('footer');
            const contact = document.querySelector('#contact');
            const insertBefore = footer || document.body.lastElementChild;
            
            if (insertBefore) {
                insertBefore.parentNode.insertBefore(customSectionsContainer, insertBefore);
            } else {
                document.body.appendChild(customSectionsContainer);
            }
        }

        // Очищаем контейнер
        customSectionsContainer.innerHTML = '';

        // Добавляем секции согласно структуре страницы
        data.pageStructure.forEach(sectionId => {
            // Пропускаем стандартные секции (они уже есть на странице)
            const standardSections = ['hero', 'about', 'services', 'destinations', 'contact', 'footer'];
            if (standardSections.includes(sectionId)) return;

            if (data.content[sectionId]) {
                this.renderCustomSection(customSectionsContainer, data.content[sectionId]);
            }
        });

        // Если есть пользовательские секции, добавляем стили
        if (customSectionsContainer.children.length > 0) {
            this.ensureCustomStyles();
        }
    }

    applyContentChanges(content) {
        if (!content) return;

        console.log('📝 Applying content changes to page structure');

        // Обновляем стандартные секции
        super.applyContentChanges(content);

        // Применяем пользовательские секции с правильным порядком
        this.applyCustomSections(this.getCurrentData());
    }

    // Улучшаем получение текущих данных
    getCurrentData() {
        // Try multiple sources for data
        if (typeof window.dataManager !== 'undefined' && window.dataManager) {
            const data = window.dataManager.getData();
            if (data && data.pageStructure) {
                console.log('📁 Using DataManager data with page structure:', data.pageStructure);
                return data;
            }
        }

        // Try localStorage
        try {
            const localData = localStorage.getItem('worldtravel_data');
            if (localData) {
                const data = JSON.parse(localData);
                if (data.pageStructure) {
                    console.log('📁 Using localStorage data with page structure:', data.pageStructure);
                    return data;
                }
            }
        } catch (error) {
            console.error('Error parsing localStorage data:', error);
        }

        return this.getDefaultData();
    }

    getDefaultData() {
        return {
            content: {},
            pageStructure: ['hero', 'about', 'services', 'destinations', 'contact'],
            lastUpdate: new Date().toISOString()
        };
    }
}

// Заменяем оригинальный ContentUpdater на исправленный
window.contentUpdater = new FixedContentUpdater();

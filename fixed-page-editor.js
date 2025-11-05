// Fixed Page Editor - исправлены дублирование переменных и сохранение карточек
class FixedPageEditor {
    constructor() {
        this.currentSection = null;
        this.currentData = null;
        this.init();
    }

    init() {
        console.log('🚀 Fixed Page Editor initialized');
        this.setupSectionHandlers();
        this.loadData();
    }

    setupSectionHandlers() {
        const sectionItems = document.querySelectorAll('.section-item');
        sectionItems.forEach(item => {
            item.addEventListener('click', () => {
                const sectionId = item.getAttribute('data-section');
                this.selectSection(sectionId);
            });
        });
    }

    loadData() {
        if (window.dataManager) {
            this.currentData = window.dataManager.getData();
            console.log('📁 Initial data loaded:', this.currentData);
            
            if (!this.currentData) {
                this.currentData = this.getDefaultData();
                console.log('📁 Using default data');
            }
            
            if (!this.currentData.content) {
                this.currentData.content = {};
                console.log('📁 Created content structure');
            }
        } else {
            this.currentData = this.getDefaultData();
            console.log('📁 DataManager not available, using default data');
        }
    }

    getDefaultData() {
        return {
            content: {
                hero: {
                    title: "Откройте мир с WorldTravel",
                    description: "Мы создаем незабываемые путешествия по всему миру. От экзотических пляжей до горных вершин - ваше приключение начинается здесь.",
                    buttonText: "Начать путешествие",
                    backgroundImage: ""
                },
                about: {
                    title: "О нас",
                    description: "WorldTravel - это команда профессиональных путешественников и экспертов по туризму с более чем 10-летним опытом работы. Мы специализируемся на создании индивидуальных маршрутов и уникальных travel-решений.",
                    image: "",
                    stats: [
                        { value: "5000+", label: "Довольных клиентов" },
                        { value: "50+", label: "Стран мира" },
                        { value: "10 лет", label: "Опыта работы" }
                    ]
                },
                services: {
                    title: "Услуги",
                    description: "Наши основные направления услуг для вашего комфортного путешествия",
                    services: [
                        {
                            title: "Авиабилеты",
                            description: "Подбор и бронирование лучших авиаперелетов по выгодным ценам",
                            icon: "fas fa-plane"
                        },
                        {
                            title: "Отели", 
                            description: "Бронирование отелей любого уровня комфорта по всему миру",
                            icon: "fas fa-hotel"
                        }
                    ]
                },
                destinations: {
                    title: "Направления", 
                    subtitle: "Откройте для себя лучшие направления мира с нашими эксклюзивными турами"
                },
                contact: {
                    title: "Контакты",
                    description: "Свяжитесь с нами для планирования вашего идеального путешествия"
                }
            },
            lastUpdate: new Date().toISOString()
        };
    }

    selectSection(sectionId) {
        console.log('🎯 Selecting section:', sectionId);
        
        document.querySelectorAll('.section-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

        this.currentSection = sectionId;
        this.loadSectionData(sectionId);
        
        document.getElementById('content-editor').style.display = 'block';
        this.injectEnhancedEditor();
    }

    loadSectionData(sectionId) {
        console.log('📝 Loading section data for:', sectionId);
        
        if (!this.currentData.content[sectionId]) {
            const defaultData = this.getDefaultData();
            this.currentData.content[sectionId] = defaultData.content[sectionId] || {};
            console.log('📁 Created section data:', this.currentData.content[sectionId]);
        }

        const sectionData = this.currentData.content[sectionId];
        if (sectionData) {
            document.getElementById('section-title').value = sectionData.title || '';
            document.getElementById('section-description').value = sectionData.description || '';
            console.log('✅ Loaded basic data:', { 
                title: sectionData.title, 
                description: sectionData.description 
            });
        }
    }

    injectEnhancedEditor() {
        const contentEditor = document.getElementById('enhanced-editor-content');
        if (!contentEditor) {
            console.error('❌ Enhanced editor container not found');
            return;
        }

        contentEditor.innerHTML = '';
        console.log('🔄 Injecting enhanced editor for section:', this.currentSection);

        switch (this.currentSection) {
            case 'hero':
                this.injectHeroEditor(contentEditor);
                break;
            case 'about':
                this.injectAboutEditor(contentEditor);
                break;
            case 'services':
                this.injectServicesEditor(contentEditor);
                break;
            case 'destinations':
                this.injectDestinationsEditor(contentEditor);
                break;
            case 'contact':
                this.injectContactEditor(contentEditor);
                break;
            default:
                console.warn('⚠️ Unknown section:', this.currentSection);
        }
    }

    // Hero Section Editor
    injectHeroEditor(container) {
        const data = this.currentData.content.hero || {};
        console.log('🎯 Injecting hero editor with data:', data);
        
        const html = 
            '<div class="enhanced-editor-section">' +
            '<div class="enhanced-editor-header">' +
            '<div class="enhanced-editor-title">🎯 Дополнительные настройки</div>' +
            '</div>' +
            
            '<div class="image-manager-section">' +
            '<div class="enhanced-form-group">' +
            '<label>Фоновое изображение:</label>' +
            '<div class="image-preview-container">' +
            (data.backgroundImage ? 
                '<img src="' + data.backgroundImage + '" alt="Preview" class="image-preview" onerror="this.style.display=\'none\'">' :
                '<div style="text-align: center; color: #6c757d; padding: 20px;">' +
                '<i class="fas fa-image" style="font-size: 3em; margin-bottom: 10px;"></i>' +
                '<div>Изображение не установлено</div>' +
                '</div>'
            ) +
            '<div class="image-actions">' +
            '<button type="button" class="btn-admin" onclick="fixedEditor.uploadImage(\'backgroundImage\')">' +
            '<i class="fas fa-upload"></i> Загрузить' +
            '</button>' +
            '<button type="button" class="btn-admin secondary" onclick="fixedEditor.setImageUrl(\'backgroundImage\')">' +
            '<i class="fas fa-link"></i> URL' +
            '</button>' +
            (data.backgroundImage ? 
            '<button type="button" class="btn-admin danger" onclick="fixedEditor.removeImage(\'backgroundImage\')">' +
            '<i class="fas fa-trash"></i> Удалить' +
            '</button>' : '') +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="enhanced-form-group">' +
            '<label>Текст кнопки:</label>' +
            '<input type="text" class="enhanced-form-control" id="hero-button-text" ' +
            'value="' + (data.buttonText || 'Начать путешествие') + '" ' +
            'oninput="fixedEditor.updateHeroField(\'buttonText\', this.value)">' +
            '</div>' +
            '</div>';

        container.innerHTML = html;
    }

    // About Section Editor with Stats
    injectAboutEditor(container) {
        const data = this.currentData.content.about || {};
        const stats = data.stats || [];
        console.log('🏢 Injecting about editor with stats:', stats);

        const html = 
            '<div class="enhanced-editor-section">' +
            '<div class="enhanced-editor-header">' +
            '<div class="enhanced-editor-title">📊 Управление статистикой</div>' +
            '<button type="button" class="add-block-btn" onclick="fixedEditor.addStatBlock()">' +
            '<i class="fas fa-plus"></i> Добавить блок' +
            '</button>' +
            '</div>' +

            '<div class="image-manager-section">' +
            '<div class="enhanced-form-group">' +
            '<label>Изображение компании:</label>' +
            '<div class="image-preview-container">' +
            (data.image ? 
                '<img src="' + data.image + '" alt="Preview" class="image-preview" onerror="this.style.display=\'none\'">' :
                '<div style="text-align: center; color: #6c757d; padding: 20px;">' +
                '<i class="fas fa-building" style="font-size: 3em; margin-bottom: 10px;"></i>' +
                '<div>Изображение не установлено</div>' +
                '</div>'
            ) +
            '<div class="image-actions">' +
            '<button type="button" class="btn-admin" onclick="fixedEditor.uploadImage(\'image\')">' +
            '<i class="fas fa-upload"></i> Загрузить' +
            '</button>' +
            '<button type="button" class="btn-admin secondary" onclick="fixedEditor.setImageUrl(\'image\')">' +
            '<i class="fas fa-link"></i> URL' +
            '</button>' +
            (data.image ? 
            '<button type="button" class="btn-admin danger" onclick="fixedEditor.removeImage(\'image\')">' +
            '<i class="fas fa-trash"></i> Удалить' +
            '</button>' : '') +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="stats-grid-editor" id="stats-editor-container">' +
            (stats.map((stat, index) => 
                '<div class="stat-editor-item">' +
                '<div class="enhanced-form-group">' +
                '<label>Значение:</label>' +
                '<input type="text" class="enhanced-form-control stat-value" ' +
                'value="' + stat.value + '" ' +
                'oninput="fixedEditor.updateStatBlock(' + index + ', \'value\', this.value)"' +
                'placeholder="5000+">' +
                '</div>' +
                '<div class="enhanced-form-group">' +
                '<label>Подпись:</label>' +
                '<input type="text" class="enhanced-form-control stat-label" ' +
                'value="' + stat.label + '" ' +
                'oninput="fixedEditor.updateStatBlock(' + index + ', \'label\', this.value)"' +
                'placeholder="Довольных клиентов">' +
                '</div>' +
                '<div style="text-align: right;">' +
                '<button type="button" class="remove-block-btn" onclick="fixedEditor.removeStatBlock(' + index + ')">' +
                '<i class="fas fa-trash"></i> Удалить' +
                '</button>' +
                '</div>' +
                '</div>'
            ).join('')) +
            (stats.length === 0 ? 
                '<div style="text-align: center; padding: 40px 20px; color: #666; grid-column: 1 / -1;">' +
                '<i class="fas fa-chart-bar" style="font-size: 3em; margin-bottom: 15px; display: block; color: #ccc;"></i>' +
                '<p>Статистика не добавлена</p>' +
                '<small>Добавьте первый блок статистики</small>' +
                '</div>' : '') +
            '</div>' +
            '</div>';

        container.innerHTML = html;
        console.log('✅ About editor injected with', stats.length, 'stats blocks');
    }

    // Services Section Editor
    injectServicesEditor(container) {
        const data = this.currentData.content.services || {};
        const services = data.services || [];
        console.log('⚡ Injecting services editor with services:', services);

        const html = 
            '<div class="enhanced-editor-section">' +
            '<div class="enhanced-editor-header">' +
            '<div class="enhanced-editor-title">⚡ Управление услугами</div>' +
            '<button type="button" class="add-block-btn" onclick="fixedEditor.addServiceBlock()">' +
            '<i class="fas fa-plus"></i> Добавить услугу' +
            '</button>' +
            '</div>' +

            '<div id="services-editor-container">' +
            (services.map((service, index) => 
                '<div class="block-item">' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 15px; align-items: start; margin-bottom: 10px;">' +
                '<div class="enhanced-form-group">' +
                '<label>Название услуги:</label>' +
                '<input type="text" class="enhanced-form-control service-title" ' +
                'value="' + service.title + '" ' +
                'oninput="fixedEditor.updateServiceBlock(' + index + ', \'title\', this.value)"' +
                'placeholder="Авиабилеты">' +
                '</div>' +
                '<div class="enhanced-form-group">' +
                '<label>Иконка:</label>' +
                '<input type="text" class="enhanced-form-control service-icon" ' +
                'value="' + service.icon + '" ' +
                'oninput="fixedEditor.updateServiceBlock(' + index + ', \'icon\', this.value)"' +
                'placeholder="fas fa-plane">' +
                '</div>' +
                '<div>' +
                '<button type="button" class="remove-block-btn" onclick="fixedEditor.removeServiceBlock(' + index + ')">' +
                '<i class="fas fa-trash"></i> Удалить' +
                '</button>' +
                '</div>' +
                '</div>' +
                '<div class="enhanced-form-group">' +
                '<label>Описание услуги:</label>' +
                '<textarea class="enhanced-form-control service-description" rows="2"' +
                'oninput="fixedEditor.updateServiceBlock(' + index + ', \'description\', this.value)"' +
                'placeholder="Описание услуги...">' + service.description + '</textarea>' +
                '</div>' +
                (service.icon ? 
                '<div style="background: #e9ecef; padding: 8px 12px; border-radius: 4px; margin-top: 8px; font-size: 0.9em;">' +
                '<i class="' + service.icon + '" style="margin-right: 6px;"></i>' +
                '<span>Предпросмотр иконки</span>' +
                '</div>' : '') +
                '</div>'
            ).join('')) +
            (services.length === 0 ? 
                '<div style="text-align: center; padding: 40px 20px; color: #666;">' +
                '<i class="fas fa-concierge-bell" style="font-size: 3em; margin-bottom: 15px; display: block; color: #ccc;"></i>' +
                '<p>Услуги не добавлены</p>' +
                '<small>Добавьте первую услугу</small>' +
                '</div>' : '') +
            '</div>' +
            '</div>';

        container.innerHTML = html;
        console.log('✅ Services editor injected with', services.length, 'services');
    }

    // Other section editors
    injectDestinationsEditor(container) {
        container.innerHTML = 
            '<div class="enhanced-editor-section">' +
            '<div class="enhanced-editor-header">' +
            '<div class="enhanced-editor-title">🌍 Дополнительные настройки</div>' +
            '</div>' +
            '<p style="color: #666; margin: 0;">Для этой секции доступны только основные настройки</p>' +
            '</div>';
    }

    injectContactEditor(container) {
        container.innerHTML = 
            '<div class="enhanced-editor-section">' +
            '<div class="enhanced-editor-header">' +
            '<div class="enhanced-editor-title">📞 Дополнительные настройки</div>' +
            '</div>' +
            '<p style="color: #666; margin: 0;">Для этой секции доступны только основные настройки</p>' +
            '</div>';
    }

    // Data Management Methods
    updateHeroField(field, value) {
        console.log('🎯 Updating hero field:', field, value);
        if (!this.currentData.content.hero) {
            this.currentData.content.hero = {};
        }
        this.currentData.content.hero[field] = value;
    }

    // Stats Management
    addStatBlock() {
        console.log('➕ Adding stat block');
        
        if (!this.currentData.content.about) {
            this.currentData.content.about = {};
            console.log('📁 Created about section');
        }
        if (!this.currentData.content.about.stats) {
            this.currentData.content.about.stats = [];
            console.log('📁 Created stats array');
        }

        const newStat = {
            value: '1000+',
            label: 'Новый показатель'
        };
        
        this.currentData.content.about.stats.push(newStat);
        console.log('✅ Added stat block:', newStat);
        console.log('📊 Current stats:', this.currentData.content.about.stats);

        this.showNotification('Блок статистики добавлен', 'success');
        this.injectAboutEditor(document.getElementById('enhanced-editor-content'));
    }

    updateStatBlock(index, field, value) {
        console.log('📊 Updating stat block:', index, field, value);
        
        if (this.currentData.content.about?.stats?.[index]) {
            this.currentData.content.about.stats[index][field] = value;
            console.log('✅ Stat block updated:', this.currentData.content.about.stats[index]);
        } else {
            console.error('❌ Stat block not found at index:', index);
        }
    }

    removeStatBlock(index) {
        console.log('🗑️ Removing stat block:', index);
        
        if (this.currentData.content.about?.stats?.[index]) {
            const removed = this.currentData.content.about.stats.splice(index, 1);
            console.log('✅ Stat block removed:', removed);
            console.log('�� Remaining stats:', this.currentData.content.about.stats);
            
            this.showNotification('Блок статистики удален', 'success');
            this.injectAboutEditor(document.getElementById('enhanced-editor-content'));
        } else {
            console.error('❌ Stat block not found at index:', index);
        }
    }

    // Services Management
    addServiceBlock() {
        console.log('➕ Adding service block');
        
        if (!this.currentData.content.services) {
            this.currentData.content.services = {};
            console.log('📁 Created services section');
        }
        if (!this.currentData.content.services.services) {
            this.currentData.content.services.services = [];
            console.log('📁 Created services array');
        }

        const newService = {
            title: 'Новая услуга',
            description: 'Описание новой услуги',
            icon: 'fas fa-star'
        };
        
        this.currentData.content.services.services.push(newService);
        console.log('✅ Added service block:', newService);
        console.log('⚡ Current services:', this.currentData.content.services.services);

        this.showNotification('Услуга добавлена', 'success');
        this.injectServicesEditor(document.getElementById('enhanced-editor-content'));
    }

    updateServiceBlock(index, field, value) {
        console.log('⚡ Updating service block:', index, field, value);
        
        if (this.currentData.content.services?.services?.[index]) {
            this.currentData.content.services.services[index][field] = value;
            console.log('✅ Service block updated:', this.currentData.content.services.services[index]);
        } else {
            console.error('❌ Service block not found at index:', index);
        }
    }

    removeServiceBlock(index) {
        console.log('🗑️ Removing service block:', index);
        
        if (this.currentData.content.services?.services?.[index]) {
            const removed = this.currentData.content.services.services.splice(index, 1);
            console.log('✅ Service block removed:', removed);
            console.log('⚡ Remaining services:', this.currentData.content.services.services);
            
            this.showNotification('Услуга удалена', 'success');
            this.injectServicesEditor(document.getElementById('enhanced-editor-content'));
        } else {
            console.error('❌ Service block not found at index:', index);
        }
    }

    // Image Management
    uploadImage(field) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.setImage(field, e.target.result);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    setImageUrl(field) {
        const url = prompt('Введите URL изображения:');
        if (url) {
            this.setImage(field, url);
        }
    }

    removeImage(field) {
        if (confirm('Удалить изображение?')) {
            this.setImage(field, '');
        }
    }

    setImage(field, url) {
        console.log('🖼️ Setting image for', field, url);
        
        if (!this.currentData.content[this.currentSection]) {
            this.currentData.content[this.currentSection] = {};
        }
        this.currentData.content[this.currentSection][field] = url;
        
        this.showNotification('Изображение обновлено', 'success');
        this.injectEnhancedEditor();
    }

    // Save Methods - ИСПРАВЛЕННАЯ ЛОГИКА СОХРАНЕНИЯ
    saveSection() {
        console.log('💾 Saving section:', this.currentSection);
        
        if (!this.currentSection || !window.dataManager) {
            console.error('❌ Cannot save: no section selected or DataManager not available');
            return;
        }

        // Update basic fields
        const title = document.getElementById('section-title').value;
        const description = document.getElementById('section-description').value;

        if (!this.currentData.content[this.currentSection]) {
            this.currentData.content[this.currentSection] = {};
        }

        this.currentData.content[this.currentSection].title = title;
        this.currentData.content[this.currentSection].description = description;

        console.log('📝 Basic fields updated:', { title, description });

        // Get current data from dataManager
        const currentData = window.dataManager.getData();
        if (!currentData) {
            console.error('❌ No data from dataManager');
            return;
        }

        // Ensure content structure exists
        if (!currentData.content) {
            currentData.content = {};
        }

        // Merge ALL changes including stats and services
        if (!currentData.content[this.currentSection]) {
            currentData.content[this.currentSection] = {};
        }

        // Важно: сохраняем ВСЕ данные текущей секции, включая stats и services
        currentData.content[this.currentSection] = {
            ...currentData.content[this.currentSection],
            ...this.currentData.content[this.currentSection]
        };

        console.log('🔄 Full section data to save:', this.currentSection, currentData.content[this.currentSection]);

        currentData.lastUpdate = new Date().toISOString();

        // Save using dataManager - это ключевой момент!
        if (window.dataManager.setData(currentData)) {
            console.log('✅ Data saved successfully via dataManager');
            this.showSaveIndicator('Изменения сохранены успешно!');
            this.safeRefresh();
        } else {
            console.error('❌ Failed to save data via dataManager');
            alert('Ошибка сохранения');
        }
    }

    safeRefresh() {
        const frame = document.getElementById('preview-frame');
        if (frame) {
            frame.src = frame.src.split('?')[0] + '?editor=true&nocache=' + Date.now();
            console.log('🔄 Preview refreshed');
        }
    }

    saveAndExit() {
        window.location.href = 'admin.html';
    }

    showSaveIndicator(message) {
        const indicator = document.getElementById('save-indicator');
        const messageEl = document.getElementById('save-message');
        
        if (indicator && messageEl) {
            messageEl.textContent = message;
            indicator.classList.add('show');
            
            setTimeout(() => {
                indicator.classList.remove('show');
            }, 3000);
        }
    }

    showNotification(message, type = 'success') {
        console.log('💬 ' + type + ': ' + message);
        alert((type === 'success' ? '✅' : '❌') + ' ' + message);
    }
}

// ЕДИНСТВЕННАЯ функция инициализации - исправляем дублирование
const initializeFixedEditor = () => {
    if (window.dataManager) {
        console.log('🎬 Initializing fixed page editor...');
        // Удаляем старый редактор если есть
        if (window.fixedEditor) {
            console.log('🔄 Replacing existing fixedEditor');
        }
        window.fixedEditor = new FixedPageEditor();
        console.log('✅ Fixed page editor initialized successfully');
    } else {
        console.log('⏳ Waiting for DataManager...');
        setTimeout(initializeFixedEditor, 100);
    }
};

// Запускаем инициализацию только один раз
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFixedEditor);
} else {
    initializeFixedEditor();
}

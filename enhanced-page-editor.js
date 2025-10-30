// Enhanced Page Editor with full section management
class EnhancedPageEditor {
    constructor() {
        this.currentSection = null;
        this.originalEditor = null;
        this.init();
    }

    init() {
        console.log('🚀 Enhanced Page Editor initialized');
        this.waitForOriginalEditor();
        this.injectEnhancedStyles();
    }

    waitForOriginalEditor() {
        if (window.editor) {
            this.originalEditor = window.editor;
            this.patchEditorMethods();
        } else {
            setTimeout(() => this.waitForOriginalEditor(), 100);
        }
    }

    injectEnhancedStyles() {
        const styles = `
            .enhanced-editor-section {
                background: #f8f9fa;
                border-radius: 10px;
                padding: 20px;
                margin: 20px 0;
                border: 2px solid #e9ecef;
            }
            
            .enhanced-editor-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 2px solid #dee2e6;
            }
            
            .enhanced-editor-title {
                color: #2c5aa0;
                font-size: 1.2em;
                font-weight: 600;
            }
            
            .stats-grid-editor {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 15px;
                margin: 15px 0;
            }
            
            .stat-editor-item {
                background: white;
                padding: 15px;
                border-radius: 8px;
                border: 1px solid #dee2e6;
                transition: all 0.3s ease;
            }
            
            .stat-editor-item:hover {
                border-color: #2c5aa0;
                box-shadow: 0 2px 8px rgba(44, 90, 160, 0.1);
            }
            
            .image-manager-section {
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin: 15px 0;
                border: 2px dashed #dee2e6;
            }
            
            .image-preview-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 15px;
                margin: 15px 0;
            }
            
            .image-preview {
                max-width: 300px;
                max-height: 200px;
                border-radius: 8px;
                border: 2px solid #e9ecef;
            }
            
            .image-actions {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                justify-content: center;
            }
            
            .block-item {
                background: white;
                padding: 15px;
                margin: 10px 0;
                border-radius: 8px;
                border-left: 4px solid #2c5aa0;
                transition: all 0.3s ease;
            }
            
            .block-item:hover {
                transform: translateX(5px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            
            .add-block-btn {
                background: #28a745;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                transition: background 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .add-block-btn:hover {
                background: #218838;
            }
            
            .remove-block-btn {
                background: #dc3545;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: background 0.3s ease;
            }
            
            .remove-block-btn:hover {
                background: #c82333;
            }
            
            .enhanced-form-group {
                margin-bottom: 15px;
            }
            
            .enhanced-form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: 600;
                color: #495057;
            }
            
            .enhanced-form-control {
                width: 100%;
                padding: 10px 12px;
                border: 1px solid #ced4da;
                border-radius: 6px;
                font-size: 14px;
                transition: border-color 0.3s ease;
            }
            
            .enhanced-form-control:focus {
                outline: none;
                border-color: #2c5aa0;
                box-shadow: 0 0 0 3px rgba(44, 90, 160, 0.1);
            }
        `;
        
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    patchEditorMethods() {
        console.log('🔧 Patching editor methods...');

        // Store original method
        const originalShowContentEditor = this.originalEditor.showContentEditor;
        
        // Enhanced method
        this.originalEditor.showContentEditor = () => {
            originalShowContentEditor.call(this.originalEditor);
            setTimeout(() => {
                this.injectEnhancedEditors();
            }, 100);
        };

        // Add enhanced save method
        this.originalEditor.saveEnhancedSection = () => {
            this.saveEnhancedData();
            return this.originalEditor.saveSection();
        };

        console.log('✅ Editor methods patched successfully');
    }

    injectEnhancedEditors() {
        const contentEditor = document.getElementById('content-editor');
        if (!contentEditor) return;

        // Remove any existing enhanced editors
        const existingEnhancedEditors = contentEditor.querySelectorAll('.enhanced-editor-section');
        existingEnhancedEditors.forEach(editor => editor.remove());

        // Inject appropriate enhanced editor based on section
        switch (this.originalEditor.currentSection) {
            case 'hero':
                this.injectHeroEditor();
                break;
            case 'about':
                this.injectAboutEditor();
                break;
            case 'services':
                this.injectServicesEditor();
                break;
            case 'destinations':
                this.injectDestinationsEditor();
                break;
            case 'contact':
                this.injectContactEditor();
                break;
        }
    }

    injectHeroEditor() {
        const contentEditor = document.getElementById('content-editor');
        if (!contentEditor) return;

        const data = this.originalEditor.currentData?.content?.hero || {};
        
        const heroEditorHTML = `
            <div class="enhanced-editor-section">
                <div class="enhanced-editor-header">
                    <div class="enhanced-editor-title">🎯 Управление главным баннером</div>
                </div>
                
                <div class="image-manager-section">
                    <div class="enhanced-form-group">
                        <label>Фоновое изображение:</label>
                        <div class="image-preview-container">
                            ${data.backgroundImage ? 
                                `<img src="${data.backgroundImage}" alt="Preview" class="image-preview" onerror="this.style.display='none'">` :
                                `<div style="text-align: center; color: #6c757d; padding: 20px;">
                                    <i class="fas fa-image" style="font-size: 3em; margin-bottom: 10px;"></i>
                                    <div>Изображение не установлено</div>
                                </div>`
                            }
                            <div class="image-actions">
                                <button type="button" class="btn-admin" onclick="enhancedEditor.uploadImage('hero-background')">
                                    <i class="fas fa-upload"></i> Загрузить изображение
                                </button>
                                <button type="button" class="btn-admin secondary" onclick="enhancedEditor.setImageUrl('hero-background')">
                                    <i class="fas fa-link"></i> Указать URL
                                </button>
                                ${data.backgroundImage ? `
                                <button type="button" class="btn-admin danger" onclick="enhancedEditor.removeImage('hero-background')">
                                    <i class="fas fa-trash"></i> Удалить
                                </button>
                                ` : ''}
                            </div>
                        </div>
                        <input type="hidden" id="hero-background-input" value="${data.backgroundImage || ''}">
                    </div>
                </div>

                <div class="enhanced-form-group">
                    <label>Заголовок баннера:</label>
                    <input type="text" class="enhanced-form-control" id="hero-title-input" 
                           value="${data.title || 'Откройте мир с WorldTravel'}" 
                           oninput="enhancedEditor.updateHeroData('title', this.value)">
                </div>

                <div class="enhanced-form-group">
                    <label>Описание баннера:</label>
                    <textarea class="enhanced-form-control" id="hero-description-input" rows="4"
                              oninput="enhancedEditor.updateHeroData('description', this.value)">${data.description || 'Мы создаем незабываемые путешествия по всему миру. От экзотических пляжей до горных вершин - ваше приключение начинается здесь.'}</textarea>
                </div>

                <div class="enhanced-form-group">
                    <label>Текст кнопки:</label>
                    <input type="text" class="enhanced-form-control" id="hero-button-text" 
                           value="${data.buttonText || 'Начать путешествие'}" 
                           oninput="enhancedEditor.updateHeroData('buttonText', this.value)">
                </div>
            </div>
        `;

        contentEditor.insertAdjacentHTML('beforeend', heroEditorHTML);
    }

    injectAboutEditor() {
        const contentEditor = document.getElementById('content-editor');
        if (!contentEditor) return;

        const data = this.originalEditor.currentData?.content?.about || {};
        const stats = data.stats || [
            { value: '5000', label: 'Довольных клиентов' },
            { value: '50', label: 'Стран мира' },
            { value: '10 лет', label: 'Опыта работы' }
        ];

        const aboutEditorHTML = `
            <div class="enhanced-editor-section">
                <div class="enhanced-editor-header">
                    <div class="enhanced-editor-title">🏢 Управление секцией "О компании"</div>
                </div>

                <div class="image-manager-section">
                    <div class="enhanced-form-group">
                        <label>Изображение компании:</label>
                        <div class="image-preview-container">
                            ${data.image ? 
                                `<img src="${data.image}" alt="Preview" class="image-preview" onerror="this.style.display='none'">` :
                                `<div style="text-align: center; color: #6c757d; padding: 20px;">
                                    <i class="fas fa-building" style="font-size: 3em; margin-bottom: 10px;"></i>
                                    <div>Изображение не установлено</div>
                                </div>`
                            }
                            <div class="image-actions">
                                <button type="button" class="btn-admin" onclick="enhancedEditor.uploadImage('about-image')">
                                    <i class="fas fa-upload"></i> Загрузить изображение
                                </button>
                                <button type="button" class="btn-admin secondary" onclick="enhancedEditor.setImageUrl('about-image')">
                                    <i class="fas fa-link"></i> Указать URL
                                </button>
                                ${data.image ? `
                                <button type="button" class="btn-admin danger" onclick="enhancedEditor.removeImage('about-image')">
                                    <i class="fas fa-trash"></i> Удалить
                                </button>
                                ` : ''}
                            </div>
                        </div>
                        <input type="hidden" id="about-image-input" value="${data.image || ''}">
                    </div>
                </div>

                <div class="enhanced-form-group">
                    <label>Заголовок секции:</label>
                    <input type="text" class="enhanced-form-control" id="about-title-input" 
                           value="${data.title || 'О нас'}" 
                           oninput="enhancedEditor.updateAboutData('title', this.value)">
                </div>

                <div class="enhanced-form-group">
                    <label>Описание компании:</label>
                    <textarea class="enhanced-form-control" id="about-description-input" rows="4"
                              oninput="enhancedEditor.updateAboutData('description', this.value)">${data.description || 'WorldTravel - это команда профессиональных путешественников и экспертов по туризму с более чем 10-летним опытом работы. Мы специализируемся на создании индивидуальных маршрутов и уникальных travel-решений.'}</textarea>
                </div>

                <div class="enhanced-editor-header" style="margin-top: 30px;">
                    <div class="enhanced-editor-title">📊 Управление статистикой</div>
                    <button type="button" class="add-block-btn" onclick="enhancedEditor.addStatBlock()">
                        <i class="fas fa-plus"></i> Добавить блок
                    </button>
                </div>

                <div class="stats-grid-editor" id="stats-editor-container">
                    ${stats.map((stat, index) => `
                        <div class="stat-editor-item" data-index="${index}">
                            <div class="enhanced-form-group">
                                <label>Значение:</label>
                                <input type="text" class="enhanced-form-control stat-value" 
                                       value="${stat.value}" 
                                       oninput="enhancedEditor.updateStatBlock(${index}, 'value', this.value)"
                                       placeholder="5000">
                            </div>
                            <div class="enhanced-form-group">
                                <label>Подпись:</label>
                                <input type="text" class="enhanced-form-control stat-label" 
                                       value="${stat.label}" 
                                       oninput="enhancedEditor.updateStatBlock(${index}, 'label', this.value)"
                                       placeholder="Довольных клиентов">
                            </div>
                            <div style="text-align: right;">
                                <button type="button" class="remove-block-btn" onclick="enhancedEditor.removeStatBlock(${index})">
                                    <i class="fas fa-trash"></i> Удалить
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        contentEditor.insertAdjacentHTML('beforeend', aboutEditorHTML);
    }

    injectServicesEditor() {
        const contentEditor = document.getElementById('content-editor');
        if (!contentEditor) return;

        const data = this.originalEditor.currentData?.content?.services || {};
        const services = data.services || [
            { 
                title: 'Авиабилеты', 
                description: 'Подбор и бронирование лучших авиаперелетов по выгодным ценам',
                icon: 'fas fa-plane'
            },
            { 
                title: 'Отели', 
                description: 'Бронирование отелей любого уровня комфорта по всему миру',
                icon: 'fas fa-hotel'
            },
            { 
                title: 'Туры', 
                description: 'Индивидуальные и групповые туры с профессиональными гидами',
                icon: 'fas fa-map-marked-alt'
            },
            { 
                title: 'Страхование', 
                description: 'Полное страховое сопровождение вашего путешествия',
                icon: 'fas fa-shield-alt'
            }
        ];

        const servicesEditorHTML = `
            <div class="enhanced-editor-section">
                <div class="enhanced-editor-header">
                    <div class="enhanced-editor-title">⚡ Управление услугами</div>
                    <button type="button" class="add-block-btn" onclick="enhancedEditor.addServiceBlock()">
                        <i class="fas fa-plus"></i> Добавить услугу
                    </button>
                </div>

                <div class="enhanced-form-group">
                    <label>Заголовок секции:</label>
                    <input type="text" class="enhanced-form-control" id="services-title-input" 
                           value="${data.title || 'Услуги'}" 
                           oninput="enhancedEditor.updateServicesData('title', this.value)">
                </div>

                <div id="services-editor-container">
                    ${services.map((service, index) => `
                        <div class="block-item" data-index="${index}">
                            <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 15px; align-items: start;">
                                <div class="enhanced-form-group">
                                    <label>Название услуги:</label>
                                    <input type="text" class="enhanced-form-control service-title" 
                                           value="${service.title}" 
                                           oninput="enhancedEditor.updateServiceBlock(${index}, 'title', this.value)"
                                           placeholder="Авиабилеты">
                                </div>
                                <div class="enhanced-form-group">
                                    <label>Иконка (FontAwesome):</label>
                                    <input type="text" class="enhanced-form-control service-icon" 
                                           value="${service.icon}" 
                                           oninput="enhancedEditor.updateServiceBlock(${index}, 'icon', this.value)"
                                           placeholder="fas fa-plane">
                                    <small style="color: #6c757d;">Используйте классы FontAwesome, например: fas fa-plane</small>
                                </div>
                                <div>
                                    <button type="button" class="remove-block-btn" onclick="enhancedEditor.removeServiceBlock(${index})">
                                        <i class="fas fa-trash"></i> Удалить
                                    </button>
                                </div>
                            </div>
                            <div class="enhanced-form-group">
                                <label>Описание услуги:</label>
                                <textarea class="enhanced-form-control service-description" rows="3"
                                          oninput="enhancedEditor.updateServiceBlock(${index}, 'description', this.value)"
                                          placeholder="Описание услуги...">${service.description}</textarea>
                            </div>
                            ${service.icon ? `
                            <div style="background: #e9ecef; padding: 10px; border-radius: 4px; margin-top: 10px;">
                                <i class="${service.icon}" style="margin-right: 8px;"></i>
                                <span>Предпросмотр иконки</span>
                            </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        contentEditor.insertAdjacentHTML('beforeend', servicesEditorHTML);
    }

    injectDestinationsEditor() {
        const contentEditor = document.getElementById('content-editor');
        if (!contentEditor) return;

        const data = this.originalEditor.currentData?.content?.destinations || {};

        const destinationsEditorHTML = `
            <div class="enhanced-editor-section">
                <div class="enhanced-editor-header">
                    <div class="enhanced-editor-title">🌍 Управление направлениями</div>
                </div>

                <div class="enhanced-form-group">
                    <label>Заголовок секции:</label>
                    <input type="text" class="enhanced-form-control" id="destinations-title-input" 
                           value="${data.title || 'Направления'}" 
                           oninput="enhancedEditor.updateDestinationsData('title', this.value)">
                </div>

                <div class="enhanced-form-group">
                    <label>Подзаголовок:</label>
                    <textarea class="enhanced-form-control" id="destinations-subtitle-input" rows="3"
                              oninput="enhancedEditor.updateDestinationsData('subtitle', this.value)">${data.subtitle || 'Откройте для себя лучшие направления мира с нашими эксклюзивными турами'}</textarea>
                </div>

                <div class="admin-hint">
                    💡 Управление странами и турами осуществляется через основную админ-панель
                </div>
            </div>
        `;

        contentEditor.insertAdjacentHTML('beforeend', destinationsEditorHTML);
    }

    injectContactEditor() {
        const contentEditor = document.getElementById('content-editor');
        if (!contentEditor) return;

        const data = this.originalEditor.currentData?.content?.contact || {};

        const contactEditorHTML = `
            <div class="enhanced-editor-section">
                <div class="enhanced-editor-header">
                    <div class="enhanced-editor-title">📞 Управление контактами</div>
                </div>

                <div class="enhanced-form-group">
                    <label>Заголовок секции:</label>
                    <input type="text" class="enhanced-form-control" id="contact-title-input" 
                           value="${data.title || 'Контакты'}" 
                           oninput="enhancedEditor.updateContactData('title', this.value)">
                </div>

                <div class="admin-hint">
                    💡 Контактная информация (телефон, email, адрес) управляется через основную админ-панель в разделе "Контакты"
                </div>
            </div>
        `;

        contentEditor.insertAdjacentHTML('beforeend', contactEditorHTML);
    }

    // Image Management Methods
    uploadImage(fieldId) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.setImage(fieldId, e.target.result);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    setImageUrl(fieldId) {
        const url = prompt('Введите URL изображения:');
        if (url) {
            this.setImage(fieldId, url);
        }
    }

    removeImage(fieldId) {
        if (confirm('Удалить изображение?')) {
            this.setImage(fieldId, '');
        }
    }

    setImage(fieldId, url) {
        const input = document.getElementById(`${fieldId}-input`);
        if (input) {
            input.value = url;
            this.updateSectionImage(fieldId, url);
        }
    }

    updateSectionImage(fieldId, url) {
        const section = this.originalEditor.currentSection;
        if (!this.originalEditor.currentData.content[section]) {
            this.originalEditor.currentData.content[section] = {};
        }

        const imageFieldMap = {
            'hero-background': 'backgroundImage',
            'about-image': 'image'
        };

        const fieldName = imageFieldMap[fieldId];
        if (fieldName) {
            this.originalEditor.currentData.content[section][fieldName] = url;
            this.originalEditor.hasUnsavedChanges = true;
            this.showNotification('Изображение обновлено', 'success');
        }
    }

    // Data Management Methods
    updateHeroData(field, value) {
        if (!this.originalEditor.currentData.content.hero) {
            this.originalEditor.currentData.content.hero = {};
        }
        this.originalEditor.currentData.content.hero[field] = value;
        this.originalEditor.hasUnsavedChanges = true;
    }

    updateAboutData(field, value) {
        if (!this.originalEditor.currentData.content.about) {
            this.originalEditor.currentData.content.about = {};
        }
        this.originalEditor.currentData.content.about[field] = value;
        this.originalEditor.hasUnsavedChanges = true;
    }

    updateServicesData(field, value) {
        if (!this.originalEditor.currentData.content.services) {
            this.originalEditor.currentData.content.services = {};
        }
        this.originalEditor.currentData.content.services[field] = value;
        this.originalEditor.hasUnsavedChanges = true;
    }

    updateDestinationsData(field, value) {
        if (!this.originalEditor.currentData.content.destinations) {
            this.originalEditor.currentData.content.destinations = {};
        }
        this.originalEditor.currentData.content.destinations[field] = value;
        this.originalEditor.hasUnsavedChanges = true;
    }

    updateContactData(field, value) {
        if (!this.originalEditor.currentData.content.contact) {
            this.originalEditor.currentData.content.contact = {};
        }
        this.originalEditor.currentData.content.contact[field] = value;
        this.originalEditor.hasUnsavedChanges = true;
    }

    // Stat Blocks Management
    addStatBlock() {
        if (!this.originalEditor.currentData.content.about) {
            this.originalEditor.currentData.content.about = {};
        }
        if (!this.originalEditor.currentData.content.about.stats) {
            this.originalEditor.currentData.content.about.stats = [];
        }

        this.originalEditor.currentData.content.about.stats.push({
            value: 'Новое значение',
            label: 'Новая подпись'
        });

        this.originalEditor.hasUnsavedChanges = true;
        this.injectAboutEditor();
        this.showNotification('Блок статистики добавлен', 'success');
    }

    updateStatBlock(index, field, value) {
        if (this.originalEditor.currentData.content.about?.stats?.[index]) {
            this.originalEditor.currentData.content.about.stats[index][field] = value;
            this.originalEditor.hasUnsavedChanges = true;
        }
    }

    removeStatBlock(index) {
        if (this.originalEditor.currentData.content.about?.stats?.[index]) {
            this.originalEditor.currentData.content.about.stats.splice(index, 1);
            this.originalEditor.hasUnsavedChanges = true;
            this.injectAboutEditor();
            this.showNotification('Блок статистики удален', 'success');
        }
    }

    // Service Blocks Management
    addServiceBlock() {
        if (!this.originalEditor.currentData.content.services) {
            this.originalEditor.currentData.content.services = {};
        }
        if (!this.originalEditor.currentData.content.services.services) {
            this.originalEditor.currentData.content.services.services = [];
        }

        this.originalEditor.currentData.content.services.services.push({
            title: 'Новая услуга',
            description: 'Описание новой услуги',
            icon: 'fas fa-star'
        });

        this.originalEditor.hasUnsavedChanges = true;
        this.injectServicesEditor();
        this.showNotification('Услуга добавлена', 'success');
    }

    updateServiceBlock(index, field, value) {
        if (this.originalEditor.currentData.content.services?.services?.[index]) {
            this.originalEditor.currentData.content.services.services[index][field] = value;
            this.originalEditor.hasUnsavedChanges = true;
        }
    }

    removeServiceBlock(index) {
        if (this.originalEditor.currentData.content.services?.services?.[index]) {
            this.originalEditor.currentData.content.services.services.splice(index, 1);
            this.originalEditor.hasUnsavedChanges = true;
            this.injectServicesEditor();
            this.showNotification('Услуга удалена', 'success');
        }
    }

    saveEnhancedData() {
        // All data is already saved through individual update methods
        console.log('💾 Enhanced data saved');
    }

    showNotification(message, type = 'success') {
        if (this.originalEditor.showNotification) {
            this.originalEditor.showNotification(message, type);
        } else {
            console.log(`${type === 'success' ? '✅' : '❌'} ${message}`);
        }
    }
}

// Initialize enhanced editor
const enhancedEditor = new EnhancedPageEditor();
window.enhancedEditor = enhancedEditor;

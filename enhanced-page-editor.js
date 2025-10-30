// Enhanced Page Editor with full section management - COMPLETELY FIXED VERSION
class EnhancedPageEditor {
    constructor() {
        this.currentSection = null;
        this.originalEditor = null;
        this.currentData = null;
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
            this.loadCurrentData();
            this.patchEditorMethods();
            console.log('✅ Enhanced editor connected to original editor');
        } else {
            setTimeout(() => this.waitForOriginalEditor(), 100);
        }
    }

    loadCurrentData() {
        if (window.dataManager) {
            this.currentData = window.dataManager.getData();
            console.log('📁 Loaded data from DataManager:', this.currentData);
        }
        
        if (!this.currentData) {
            this.currentData = this.getDefaultData();
            console.log('📁 Using default data structure');
        }
        
        // Ensure content structure exists
        if (!this.currentData.content) {
            this.currentData.content = {};
            console.log('📁 Created content structure');
        }

        console.log('✅ Current data loaded successfully');
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
                        { value: "5000", label: "Довольных клиентов" },
                        { value: "50", label: "Стран мира" },
                        { value: "10 лет", label: "Опыта работы" }
                    ]
                },
                services: {
                    title: "Услуги",
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
                        },
                        {
                            title: "Туры",
                            description: "Индивидуальные и групповые туры с профессиональными гидами", 
                            icon: "fas fa-map-marked-alt"
                        },
                        {
                            title: "Страхование",
                            description: "Полное страховое сопровождение вашего путешествия",
                            icon: "fas fa-shield-alt"
                        }
                    ]
                },
                destinations: {
                    title: "Направления", 
                    subtitle: "Откройте для себя лучшие направления мира с нашими эксклюзивными турами"
                },
                contact: {
                    title: "Контакты"
                }
            },
            lastUpdate: new Date().toISOString()
        };
    }

    injectEnhancedStyles() {
        // Remove existing styles to avoid duplicates
        const existingStyle = document.getElementById('enhanced-editor-styles');
        if (existingStyle) {
            existingStyle.remove();
        }

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

            .enhanced-save-section {
                background: #d4edda;
                border: 2px solid #c3e6cb;
                border-radius: 10px;
                padding: 20px;
                margin: 20px 0;
                text-align: center;
            }

            .enhanced-save-btn {
                background: #28a745;
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                font-weight: 600;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 10px;
            }

            .enhanced-save-btn:hover {
                background: #218838;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
            }

            .enhanced-save-btn:active {
                transform: translateY(0);
            }
        `;
        
        const styleElement = document.createElement('style');
        styleElement.id = 'enhanced-editor-styles';
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
        console.log('✅ Enhanced styles injected');
    }

    patchEditorMethods() {
        console.log('🔧 Patching editor methods...');

        // Store original method
        const originalShowContentEditor = this.originalEditor.showContentEditor;
        
        // Enhanced method
        this.originalEditor.showContentEditor = () => {
            console.log('🔄 Enhanced editor: showContentEditor called');
            originalShowContentEditor.call(this.originalEditor);
            setTimeout(() => {
                this.injectEnhancedEditors();
            }, 100);
        };

        console.log('✅ Editor methods patched successfully');
    }

    injectEnhancedEditors() {
        const contentEditor = document.getElementById('content-editor');
        if (!contentEditor) {
            console.error('❌ Content editor not found');
            return;
        }

        // Remove any existing enhanced editors
        const existingEnhancedEditors = contentEditor.querySelectorAll('.enhanced-editor-section');
        existingEnhancedEditors.forEach(editor => {
            console.log('🗑️ Removing existing enhanced editor');
            editor.remove();
        });

        // Get current section from the main editor
        this.currentSection = this.originalEditor.currentSection;
        console.log('📝 Current section:', this.currentSection);
        
        // Load current data for the section
        this.loadSectionData();

        // Inject appropriate enhanced editor based on section
        switch (this.currentSection) {
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
            default:
                console.warn('⚠️ Unknown section:', this.currentSection);
                return;
        }

        // Add save button section
        this.injectSaveSection();

        console.log('✅ Enhanced editor injected for section:', this.currentSection);
    }

    loadSectionData() {
        if (!this.currentData.content[this.currentSection]) {
            console.log('📁 Creating section data for:', this.currentSection);
            const defaultData = this.getDefaultData();
            this.currentData.content[this.currentSection] = defaultData.content[this.currentSection] || {};
        }
    }

    injectSaveSection() {
        const contentEditor = document.getElementById('content-editor');
        if (!contentEditor) return;

        const saveSectionHTML = `
            <div class="enhanced-save-section">
                <h3 style="color: #155724; margin-bottom: 15px;">💾 Сохранение изменений</h3>
                <p style="color: #0c5460; margin-bottom: 20px;">Нажмите кнопку ниже чтобы сохранить все изменения в этой секции</p>
                <button class="enhanced-save-btn" onclick="window.enhancedEditor.saveEnhancedSection()">
                    <i class="fas fa-save"></i> Сохранить секцию
                </button>
                <p style="color: #856404; margin-top: 15px; font-size: 0.9em;">
                    <i class="fas fa-info-circle"></i> Изменения появятся в предпросмотре после сохранения
                </p>
            </div>
        `;

        contentEditor.insertAdjacentHTML('beforeend', saveSectionHTML);
    }

    injectHeroEditor() {
        const contentEditor = document.getElementById('content-editor');
        if (!contentEditor) return;

        const sectionData = this.currentData.content.hero || {};
        console.log('🎯 Injecting hero editor with data:', sectionData);
        
        const heroEditorHTML = `
            <div class="enhanced-editor-section">
                <div class="enhanced-editor-header">
                    <div class="enhanced-editor-title">🎯 Управление главным баннером</div>
                </div>
                
                <div class="image-manager-section">
                    <div class="enhanced-form-group">
                        <label>Фоновое изображение:</label>
                        <div class="image-preview-container">
                            ${sectionData.backgroundImage ? 
                                `<img src="${sectionData.backgroundImage}" alt="Preview" class="image-preview" onerror="this.style.display='none'">` :
                                `<div style="text-align: center; color: #6c757d; padding: 20px;">
                                    <i class="fas fa-image" style="font-size: 3em; margin-bottom: 10px;"></i>
                                    <div>Изображение не установлено</div>
                                </div>`
                            }
                            <div class="image-actions">
                                <button type="button" class="btn-admin" onclick="window.enhancedEditor.uploadImage('hero', 'backgroundImage')">
                                    <i class="fas fa-upload"></i> Загрузить изображение
                                </button>
                                <button type="button" class="btn-admin secondary" onclick="window.enhancedEditor.setImageUrl('hero', 'backgroundImage')">
                                    <i class="fas fa-link"></i> Указать URL
                                </button>
                                ${sectionData.backgroundImage ? `
                                <button type="button" class="btn-admin danger" onclick="window.enhancedEditor.removeImage('hero', 'backgroundImage')">
                                    <i class="fas fa-trash"></i> Удалить
                                </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="enhanced-form-group">
                    <label>Заголовок баннера:</label>
                    <input type="text" class="enhanced-form-control" id="hero-title-input" 
                           value="${sectionData.title || 'Откройте мир с WorldTravel'}" 
                           oninput="window.enhancedEditor.updateSectionData('hero', 'title', this.value)">
                </div>

                <div class="enhanced-form-group">
                    <label>Описание баннера:</label>
                    <textarea class="enhanced-form-control" id="hero-description-input" rows="4"
                              oninput="window.enhancedEditor.updateSectionData('hero', 'description', this.value)">${sectionData.description || 'Мы создаем незабываемые путешествия по всему миру. От экзотических пляжей до горных вершин - ваше приключение начинается здесь.'}</textarea>
                </div>

                <div class="enhanced-form-group">
                    <label>Текст кнопки:</label>
                    <input type="text" class="enhanced-form-control" id="hero-button-text" 
                           value="${sectionData.buttonText || 'Начать путешествие'}" 
                           oninput="window.enhancedEditor.updateSectionData('hero', 'buttonText', this.value)">
                </div>
            </div>
        `;

        contentEditor.insertAdjacentHTML('beforeend', heroEditorHTML);
    }

    injectAboutEditor() {
        const contentEditor = document.getElementById('content-editor');
        if (!contentEditor) return;

        const sectionData = this.currentData.content.about || {};
        const stats = sectionData.stats || [
            { value: '5000', label: 'Довольных клиентов' },
            { value: '50', label: 'Стран мира' },
            { value: '10 лет', label: 'Опыта работы' }
        ];

        console.log('🏢 Injecting about editor with stats:', stats);

        const aboutEditorHTML = `
            <div class="enhanced-editor-section">
                <div class="enhanced-editor-header">
                    <div class="enhanced-editor-title">🏢 Управление секцией "О компании"</div>
                </div>

                <div class="image-manager-section">
                    <div class="enhanced-form-group">
                        <label>Изображение компании:</label>
                        <div class="image-preview-container">
                            ${sectionData.image ? 
                                `<img src="${sectionData.image}" alt="Preview" class="image-preview" onerror="this.style.display='none'">` :
                                `<div style="text-align: center; color: #6c757d; padding: 20px;">
                                    <i class="fas fa-building" style="font-size: 3em; margin-bottom: 10px;"></i>
                                    <div>Изображение не установлено</div>
                                </div>`
                            }
                            <div class="image-actions">
                                <button type="button" class="btn-admin" onclick="window.enhancedEditor.uploadImage('about', 'image')">
                                    <i class="fas fa-upload"></i> Загрузить изображение
                                </button>
                                <button type="button" class="btn-admin secondary" onclick="window.enhancedEditor.setImageUrl('about', 'image')">
                                    <i class="fas fa-link"></i> Указать URL
                                </button>
                                ${sectionData.image ? `
                                <button type="button" class="btn-admin danger" onclick="window.enhancedEditor.removeImage('about', 'image')">
                                    <i class="fas fa-trash"></i> Удалить
                                </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="enhanced-form-group">
                    <label>Заголовок секции:</label>
                    <input type="text" class="enhanced-form-control" id="about-title-input" 
                           value="${sectionData.title || 'О нас'}" 
                           oninput="window.enhancedEditor.updateSectionData('about', 'title', this.value)">
                </div>

                <div class="enhanced-form-group">
                    <label>Описание компании:</label>
                    <textarea class="enhanced-form-control" id="about-description-input" rows="4"
                              oninput="window.enhancedEditor.updateSectionData('about', 'description', this.value)">${sectionData.description || 'WorldTravel - это команда профессиональных путешественников и экспертов по туризму с более чем 10-летним опытом работы. Мы специализируемся на создании индивидуальных маршрутов и уникальных travel-решений.'}</textarea>
                </div>

                <div class="enhanced-editor-header" style="margin-top: 30px;">
                    <div class="enhanced-editor-title">📊 Управление статистикой</div>
                    <button type="button" class="add-block-btn" onclick="window.enhancedEditor.addStatBlock()">
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
                                       oninput="window.enhancedEditor.updateStatBlock(${index}, 'value', this.value)"
                                       placeholder="5000">
                            </div>
                            <div class="enhanced-form-group">
                                <label>Подпись:</label>
                                <input type="text" class="enhanced-form-control stat-label" 
                                       value="${stat.label}" 
                                       oninput="window.enhancedEditor.updateStatBlock(${index}, 'label', this.value)"
                                       placeholder="Довольных клиентов">
                            </div>
                            <div style="text-align: right;">
                                <button type="button" class="remove-block-btn" onclick="window.enhancedEditor.removeStatBlock(${index})">
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

        const sectionData = this.currentData.content.services || {};
        const services = sectionData.services || [
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

        console.log('⚡ Injecting services editor with services:', services);

        const servicesEditorHTML = `
            <div class="enhanced-editor-section">
                <div class="enhanced-editor-header">
                    <div class="enhanced-editor-title">⚡ Управление услугами</div>
                    <button type="button" class="add-block-btn" onclick="window.enhancedEditor.addServiceBlock()">
                        <i class="fas fa-plus"></i> Добавить услугу
                    </button>
                </div>

                <div class="enhanced-form-group">
                    <label>Заголовок секции:</label>
                    <input type="text" class="enhanced-form-control" id="services-title-input" 
                           value="${sectionData.title || 'Услуги'}" 
                           oninput="window.enhancedEditor.updateSectionData('services', 'title', this.value)">
                </div>

                <div id="services-editor-container">
                    ${services.map((service, index) => `
                        <div class="block-item" data-index="${index}">
                            <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 15px; align-items: start;">
                                <div class="enhanced-form-group">
                                    <label>Название услуги:</label>
                                    <input type="text" class="enhanced-form-control service-title" 
                                           value="${service.title}" 
                                           oninput="window.enhancedEditor.updateServiceBlock(${index}, 'title', this.value)"
                                           placeholder="Авиабилеты">
                                </div>
                                <div class="enhanced-form-group">
                                    <label>Иконка (FontAwesome):</label>
                                    <input type="text" class="enhanced-form-control service-icon" 
                                           value="${service.icon}" 
                                           oninput="window.enhancedEditor.updateServiceBlock(${index}, 'icon', this.value)"
                                           placeholder="fas fa-plane">
                                    <small style="color: #6c757d;">Используйте классы FontAwesome, например: fas fa-plane</small>
                                </div>
                                <div>
                                    <button type="button" class="remove-block-btn" onclick="window.enhancedEditor.removeServiceBlock(${index})">
                                        <i class="fas fa-trash"></i> Удалить
                                    </button>
                                </div>
                            </div>
                            <div class="enhanced-form-group">
                                <label>Описание услуги:</label>
                                <textarea class="enhanced-form-control service-description" rows="3"
                                          oninput="window.enhancedEditor.updateServiceBlock(${index}, 'description', this.value)"
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

        const sectionData = this.currentData.content.destinations || {};

        const destinationsEditorHTML = `
            <div class="enhanced-editor-section">
                <div class="enhanced-editor-header">
                    <div class="enhanced-editor-title">🌍 Управление направлениями</div>
                </div>

                <div class="enhanced-form-group">
                    <label>Заголовок секции:</label>
                    <input type="text" class="enhanced-form-control" id="destinations-title-input" 
                           value="${sectionData.title || 'Направления'}" 
                           oninput="window.enhancedEditor.updateSectionData('destinations', 'title', this.value)">
                </div>

                <div class="enhanced-form-group">
                    <label>Подзаголовок:</label>
                    <textarea class="enhanced-form-control" id="destinations-subtitle-input" rows="3"
                              oninput="window.enhancedEditor.updateSectionData('destinations', 'subtitle', this.value)">${sectionData.subtitle || 'Откройте для себя лучшие направления мира с нашими эксклюзивными турами'}</textarea>
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

        const sectionData = this.currentData.content.contact || {};

        const contactEditorHTML = `
            <div class="enhanced-editor-section">
                <div class="enhanced-editor-header">
                    <div class="enhanced-editor-title">📞 Управление контактами</div>
                </div>

                <div class="enhanced-form-group">
                    <label>Заголовок секции:</label>
                    <input type="text" class="enhanced-form-control" id="contact-title-input" 
                           value="${sectionData.title || 'Контакты'}" 
                           oninput="window.enhancedEditor.updateSectionData('contact', 'title', this.value)">
                </div>

                <div class="admin-hint">
                    💡 Контактная информация (телефон, email, адрес) управляется через основную админ-панель в разделе "Контакты"
                </div>
            </div>
        `;

        contentEditor.insertAdjacentHTML('beforeend', contactEditorHTML);
    }

    // Image Management Methods
    uploadImage(section, field) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.setImage(section, field, e.target.result);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    setImageUrl(section, field) {
        const url = prompt('Введите URL изображения:');
        if (url) {
            this.setImage(section, field, url);
        }
    }

    removeImage(section, field) {
        if (confirm('Удалить изображение?')) {
            this.setImage(section, field, '');
        }
    }

    setImage(section, field, url) {
        console.log('🖼️ Setting image for', section, field, url);
        
        if (!this.currentData.content[section]) {
            this.currentData.content[section] = {};
        }
        
        this.currentData.content[section][field] = url;
        this.showNotification('Изображение обновлено', 'success');
        this.refreshPreview();
    }

    // Data Management Methods
    updateSectionData(section, field, value) {
        console.log('📝 Updating section data:', section, field, value);
        
        if (!this.currentData.content[section]) {
            this.currentData.content[section] = {};
        }
        this.currentData.content[section][field] = value;
        this.refreshPreview();
    }

    // Stat Blocks Management
    addStatBlock() {
        console.log('➕ Adding stat block');
        
        if (!this.currentData.content.about) {
            this.currentData.content.about = {};
        }
        if (!this.currentData.content.about.stats) {
            this.currentData.content.about.stats = [];
        }

        this.currentData.content.about.stats.push({
            value: 'Новое значение',
            label: 'Новая подпись'
        });

        this.injectAboutEditor();
        this.showNotification('Блок статистики добавлен', 'success');
    }

    updateStatBlock(index, field, value) {
        console.log('📊 Updating stat block:', index, field, value);
        
        if (this.currentData.content.about?.stats?.[index]) {
            this.currentData.content.about.stats[index][field] = value;
            this.refreshPreview();
        } else {
            console.error('❌ Stat block not found at index:', index);
        }
    }

    removeStatBlock(index) {
        console.log('🗑️ Removing stat block:', index);
        
        if (this.currentData.content.about?.stats?.[index]) {
            this.currentData.content.about.stats.splice(index, 1);
            this.injectAboutEditor();
            this.showNotification('Блок статистики удален', 'success');
        } else {
            console.error('❌ Stat block not found at index:', index);
        }
    }

    // Service Blocks Management
    addServiceBlock() {
        console.log('➕ Adding service block');
        
        if (!this.currentData.content.services) {
            this.currentData.content.services = {};
        }
        if (!this.currentData.content.services.services) {
            this.currentData.content.services.services = [];
        }

        this.currentData.content.services.services.push({
            title: 'Новая услуга',
            description: 'Описание новой услуги',
            icon: 'fas fa-star'
        });

        this.injectServicesEditor();
        this.showNotification('Услуга добавлена', 'success');
    }

    updateServiceBlock(index, field, value) {
        console.log('⚡ Updating service block:', index, field, value);
        
        if (this.currentData.content.services?.services?.[index]) {
            this.currentData.content.services.services[index][field] = value;
            this.refreshPreview();
        } else {
            console.error('❌ Service block not found at index:', index);
        }
    }

    removeServiceBlock(index) {
        console.log('🗑️ Removing service block:', index);
        
        if (this.currentData.content.services?.services?.[index]) {
            this.currentData.content.services.services.splice(index, 1);
            this.injectServicesEditor();
            this.showNotification('Услуга удалена', 'success');
        } else {
            console.error('❌ Service block not found at index:', index);
        }
    }

    // Save and Preview Methods
    saveEnhancedSection() {
        console.log('💾 Saving enhanced section:', this.currentSection);
        
        if (!window.dataManager) {
            this.showNotification('Ошибка: DataManager не доступен', 'error');
            return;
        }

        // Get the main data
        const mainData = window.dataManager.getData();
        if (!mainData) {
            this.showNotification('Ошибка: Не удалось получить данные', 'error');
            return;
        }

        if (!mainData.content) {
            mainData.content = {};
        }

        // Update the main data with our enhanced data for current section
        if (this.currentSection && this.currentData.content[this.currentSection]) {
            mainData.content[this.currentSection] = {
                ...mainData.content[this.currentSection],
                ...this.currentData.content[this.currentSection]
            };
        }

        // Save to data manager
        if (window.dataManager.setData(mainData)) {
            this.showNotification('Секция успешно сохранена!', 'success');
            this.refreshPreview();
            
            // Also update the basic editor fields
            this.updateBasicEditorFields();
        } else {
            this.showNotification('Ошибка сохранения', 'error');
        }
    }

    updateBasicEditorFields() {
        if (this.currentSection && this.currentData.content[this.currentSection]) {
            const sectionData = this.currentData.content[this.currentSection];
            
            const titleField = document.getElementById('section-title');
            const descriptionField = document.getElementById('section-description');
            
            if (titleField && sectionData.title) {
                titleField.value = sectionData.title;
            }
            if (descriptionField && sectionData.description) {
                descriptionField.value = sectionData.description;
            }
        }
    }

    refreshPreview() {
        console.log('🔄 Refreshing preview');
        // Trigger a preview refresh
        if (this.originalEditor && this.originalEditor.safeRefresh) {
            this.originalEditor.safeRefresh();
        }
    }

    showNotification(message, type = 'success') {
        console.log('💬 Notification:', message, type);
        
        // Use the original editor's notification system if available
        if (this.originalEditor && this.originalEditor.showNotification) {
            this.originalEditor.showNotification(message, type);
        } else {
            // Fallback notification
            const indicator = document.getElementById('save-indicator');
            const messageEl = document.getElementById('save-message');
            
            if (indicator && messageEl) {
                messageEl.textContent = message;
                indicator.className = 'save-indicator';
                if (type === 'success') {
                    indicator.style.background = '#d4edda';
                    indicator.style.color = '#155724';
                } else {
                    indicator.style.background = '#f8d7da';
                    indicator.style.color = '#721c24';
                }
                indicator.classList.add('show');
                
                setTimeout(() => {
                    indicator.classList.remove('show');
                }, 3000);
            } else {
                // Final fallback
                alert(`${type === 'success' ? '✅' : '❌'} ${message}`);
            }
        }
    }
}

// Initialize enhanced editor
console.log('🎬 Starting enhanced page editor...');
const enhancedEditor = new EnhancedPageEditor();
window.enhancedEditor = enhancedEditor;

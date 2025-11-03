// Universal Page Editor - Единый редактор для всех секций
class UniversalEditor {
    constructor() {
        this.currentSection = null;
        this.currentData = null;
        this.isInitialized = false;
        this.init();
    }

    init() {
        console.log('🚀 Universal Editor initialized');
        this.waitForDataManager();
    }

    waitForDataManager() {
        if (window.dataManager) {
            this.loadData();
            this.setupGlobalListeners();
            this.isInitialized = true;
            console.log('✅ Universal Editor ready');
        } else {
            setTimeout(() => this.waitForDataManager(), 100);
        }
    }

    loadData() {
        this.currentData = window.dataManager.getData();
        if (!this.currentData) {
            this.currentData = this.getDefaultData();
        }
        
        // Ensure content structure exists
        if (!this.currentData.content) {
            this.currentData.content = {};
        }

        console.log('📁 Data loaded:', this.currentData);
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
                    title: "Контакты",
                    description: "Свяжитесь с нами для планирования вашего идеального путешествия"
                }
            },
            contacts: {
                phone: "+7 (999) 123-45-67",
                email: "info@worldtravel.com",
                address: "Москва, ул. Туристическая, 15",
                hours: "Пн-Пт: 9:00-18:00"
            },
            settings: {
                siteTitle: "WorldTravel - Туристическая компания",
                companyName: "WorldTravel"
            },
            footer: {
                description: "Ваш надежный партнер в мире путешествий.",
                copyright: "&copy; 2024 WorldTravel. Все права защищены."
            },
            lastUpdate: new Date().toISOString()
        };
    }

    setupGlobalListeners() {
        // Listen for section selection events
        document.addEventListener('sectionSelected', (e) => {
            this.selectSection(e.detail.sectionId);
        });

        // Listen for data updates
        window.addEventListener('storage', (e) => {
            if (e.key === 'worldtravel_data') {
                this.loadData();
            }
        });

        console.log('�� Global listeners setup');
    }

    selectSection(sectionId) {
        console.log('🎯 Selecting section:', sectionId);
        this.currentSection = sectionId;
        
        // Update UI
        this.updateSectionUI();
        
        // Load section data
        this.loadSectionData();
        
        // Show editor
        this.showEditor();
        
        // Dispatch event for other components
        this.dispatchEvent('sectionChanged', { section: sectionId });
    }

    updateSectionUI() {
        // Update active state in navigation
        document.querySelectorAll('.section-item, .nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === this.currentSection || 
                item.getAttribute('data-tab') === this.currentSection) {
                item.classList.add('active');
            }
        });
    }

    loadSectionData() {
        if (!this.currentData.content[this.currentSection]) {
            const defaultData = this.getDefaultData();
            this.currentData.content[this.currentSection] = defaultData.content[this.currentSection] || {};
        }
    }

    showEditor() {
        const editorContainer = document.getElementById('universal-editor-content');
        if (!editorContainer) {
            console.error('❌ Editor container not found');
            return;
        }

        // Clear previous content
        editorContainer.innerHTML = '';
        
        // Inject appropriate editor based on section
        switch (this.currentSection) {
            case 'hero':
                this.injectHeroEditor(editorContainer);
                break;
            case 'about':
                this.injectAboutEditor(editorContainer);
                break;
            case 'services':
                this.injectServicesEditor(editorContainer);
                break;
            case 'destinations':
                this.injectDestinationsEditor(editorContainer);
                break;
            case 'contact':
                this.injectContactEditor(editorContainer);
                break;
            case 'settings':
                this.injectSettingsEditor(editorContainer);
                break;
            case 'content':
                this.injectContentEditor(editorContainer);
                break;
            default:
                this.injectGenericEditor(editorContainer);
        }

        console.log('✅ Editor shown for section:', this.currentSection);
    }

    // Hero Section Editor
    injectHeroEditor(container) {
        const data = this.currentData.content.hero || {};
        
        const html = `
            <div class="universal-editor-section">
                <div class="editor-header">
                    <h3>🎯 Главный баннер</h3>
                    <p>Управление основной секцией сайта</p>
                </div>

                <div class="image-manager">
                    <div class="form-group">
                        <label>Фоновое изображение:</label>
                        <div class="image-preview">
                            ${data.backgroundImage ? 
                                `<img src="${data.backgroundImage}" alt="Preview" onerror="this.style.display='none'">` :
                                `<div class="no-image">
                                    <i class="fas fa-image"></i>
                                    <span>Изображение не установлено</span>
                                </div>`
                            }
                        </div>
                        <div class="image-actions">
                            <button type="button" class="btn btn-primary" onclick="universalEditor.uploadImage('hero', 'backgroundImage')">
                                <i class="fas fa-upload"></i> Загрузить
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="universalEditor.setImageUrl('hero', 'backgroundImage')">
                                <i class="fas fa-link"></i> URL
                            </button>
                            ${data.backgroundImage ? `
                            <button type="button" class="btn btn-danger" onclick="universalEditor.removeImage('hero', 'backgroundImage')">
                                <i class="fas fa-trash"></i> Удалить
                            </button>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label>Заголовок:</label>
                    <input type="text" class="form-control" value="${data.title || ''}" 
                           oninput="universalEditor.updateSectionField('hero', 'title', this.value)">
                </div>

                <div class="form-group">
                    <label>Описание:</label>
                    <textarea class="form-control" rows="4" 
                              oninput="universalEditor.updateSectionField('hero', 'description', this.value)">${data.description || ''}</textarea>
                </div>

                <div class="form-group">
                    <label>Текст кнопки:</label>
                    <input type="text" class="form-control" value="${data.buttonText || ''}" 
                           oninput="universalEditor.updateSectionField('hero', 'buttonText', this.value)">
                </div>

                <div class="editor-actions">
                    <button class="btn btn-success" onclick="universalEditor.saveSection()">
                        <i class="fas fa-save"></i> Сохранить изменения
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    // About Section Editor with Stats Management
    injectAboutEditor(container) {
        const data = this.currentData.content.about || {};
        const stats = data.stats || [];

        const html = `
            <div class="universal-editor-section">
                <div class="editor-header">
                    <h3>🏢 О компании</h3>
                    <p>Управление информацией о компании и статистикой</p>
                </div>

                <div class="image-manager">
                    <div class="form-group">
                        <label>Изображение компании:</label>
                        <div class="image-preview">
                            ${data.image ? 
                                `<img src="${data.image}" alt="Preview" onerror="this.style.display='none'">` :
                                `<div class="no-image">
                                    <i class="fas fa-building"></i>
                                    <span>Изображение не установлено</span>
                                </div>`
                            }
                        </div>
                        <div class="image-actions">
                            <button type="button" class="btn btn-primary" onclick="universalEditor.uploadImage('about', 'image')">
                                <i class="fas fa-upload"></i> Загрузить
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="universalEditor.setImageUrl('about', 'image')">
                                <i class="fas fa-link"></i> URL
                            </button>
                            ${data.image ? `
                            <button type="button" class="btn btn-danger" onclick="universalEditor.removeImage('about', 'image')">
                                <i class="fas fa-trash"></i> Удалить
                            </button>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label>Заголовок секции:</label>
                    <input type="text" class="form-control" value="${data.title || ''}" 
                           oninput="universalEditor.updateSectionField('about', 'title', this.value)">
                </div>

                <div class="form-group">
                    <label>Описание компании:</label>
                    <textarea class="form-control" rows="4" 
                              oninput="universalEditor.updateSectionField('about', 'description', this.value)">${data.description || ''}</textarea>
                </div>

                <div class="stats-management">
                    <div class="section-header">
                        <h4>📊 Блоки статистики</h4>
                        <button class="btn btn-primary" onclick="universalEditor.addStatBlock()">
                            <i class="fas fa-plus"></i> Добавить блок
                        </button>
                    </div>

                    <div class="stats-list" id="stats-list">
                        ${stats.map((stat, index) => `
                            <div class="stat-item">
                                <div class="stat-inputs">
                                    <input type="text" class="form-control" value="${stat.value}" 
                                           placeholder="Значение" oninput="universalEditor.updateStatBlock(${index}, 'value', this.value)">
                                    <input type="text" class="form-control" value="${stat.label}" 
                                           placeholder="Подпись" oninput="universalEditor.updateStatBlock(${index}, 'label', this.value)">
                                </div>
                                <button class="btn btn-danger btn-sm" onclick="universalEditor.removeStatBlock(${index})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `).join('')}
                        ${stats.length === 0 ? `
                            <div class="empty-state">
                                <i class="fas fa-chart-bar"></i>
                                <p>Статистика не добавлена</p>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <div class="editor-actions">
                    <button class="btn btn-success" onclick="universalEditor.saveSection()">
                        <i class="fas fa-save"></i> Сохранить изменения
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    // Services Section Editor
    injectServicesEditor(container) {
        const data = this.currentData.content.services || {};
        const services = data.services || [];

        const html = `
            <div class="universal-editor-section">
                <div class="editor-header">
                    <h3>⚡ Услуги</h3>
                    <p>Управление списком услуг компании</p>
                </div>

                <div class="form-group">
                    <label>Заголовок секции:</label>
                    <input type="text" class="form-control" value="${data.title || ''}" 
                           oninput="universalEditor.updateSectionField('services', 'title', this.value)">
                </div>

                <div class="form-group">
                    <label>Описание секции:</label>
                    <textarea class="form-control" rows="3" 
                              oninput="universalEditor.updateSectionField('services', 'description', this.value)">${data.description || ''}</textarea>
                </div>

                <div class="services-management">
                    <div class="section-header">
                        <h4>🎯 Список услуг</h4>
                        <button class="btn btn-primary" onclick="universalEditor.addServiceBlock()">
                            <i class="fas fa-plus"></i> Добавить услугу
                        </button>
                    </div>

                    <div class="services-list" id="services-list">
                        ${services.map((service, index) => `
                            <div class="service-item">
                                <div class="service-header">
                                    <input type="text" class="form-control" value="${service.title}" 
                                           placeholder="Название услуги" oninput="universalEditor.updateServiceBlock(${index}, 'title', this.value)">
                                    <input type="text" class="form-control" value="${service.icon}" 
                                           placeholder="fas fa-icon" oninput="universalEditor.updateServiceBlock(${index}, 'icon', this.value)">
                                    <button class="btn btn-danger btn-sm" onclick="universalEditor.removeServiceBlock(${index})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                                <textarea class="form-control" rows="2" 
                                          oninput="universalEditor.updateServiceBlock(${index}, 'description', this.value)">${service.description}</textarea>
                                ${service.icon ? `
                                <div class="icon-preview">
                                    <i class="${service.icon}"></i>
                                    <span>Предпросмотр иконки</span>
                                </div>
                                ` : ''}
                            </div>
                        `).join('')}
                        ${services.length === 0 ? `
                            <div class="empty-state">
                                <i class="fas fa-concierge-bell"></i>
                                <p>Услуги не добавлены</p>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <div class="editor-actions">
                    <button class="btn btn-success" onclick="universalEditor.saveSection()">
                        <i class="fas fa-save"></i> Сохранить изменения
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    // Other section editors (simplified for brevity)
    injectDestinationsEditor(container) {
        const data = this.currentData.content.destinations || {};
        
        const html = `
            <div class="universal-editor-section">
                <div class="editor-header">
                    <h3>🌍 Направления</h3>
                    <p>Управление секцией направлений</p>
                </div>

                <div class="form-group">
                    <label>Заголовок секции:</label>
                    <input type="text" class="form-control" value="${data.title || ''}" 
                           oninput="universalEditor.updateSectionField('destinations', 'title', this.value)">
                </div>

                <div class="form-group">
                    <label>Подзаголовок:</label>
                    <textarea class="form-control" rows="3" 
                              oninput="universalEditor.updateSectionField('destinations', 'subtitle', this.value)">${data.subtitle || ''}</textarea>
                </div>

                <div class="editor-actions">
                    <button class="btn btn-success" onclick="universalEditor.saveSection()">
                        <i class="fas fa-save"></i> Сохранить изменения
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    injectContactEditor(container) {
        const data = this.currentData.content.contact || {};
        const contacts = this.currentData.contacts || {};
        
        const html = `
            <div class="universal-editor-section">
                <div class="editor-header">
                    <h3>📞 Контакты</h3>
                    <p>Управление контактной информацией</p>
                </div>

                <div class="form-group">
                    <label>Заголовок секции:</label>
                    <input type="text" class="form-control" value="${data.title || ''}" 
                           oninput="universalEditor.updateSectionField('contact', 'title', this.value)">
                </div>

                <div class="form-group">
                    <label>Описание секции:</label>
                    <textarea class="form-control" rows="3" 
                              oninput="universalEditor.updateSectionField('contact', 'description', this.value)">${data.description || ''}</textarea>
                </div>

                <div class="contacts-management">
                    <h4>Контактная информация</h4>
                    <div class="form-group">
                        <label>Телефон:</label>
                        <input type="text" class="form-control" value="${contacts.phone || ''}" 
                               oninput="universalEditor.updateContactsField('phone', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Email:</label>
                        <input type="email" class="form-control" value="${contacts.email || ''}" 
                               oninput="universalEditor.updateContactsField('email', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Адрес:</label>
                        <input type="text" class="form-control" value="${contacts.address || ''}" 
                               oninput="universalEditor.updateContactsField('address', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Часы работы:</label>
                        <input type="text" class="form-control" value="${contacts.hours || ''}" 
                               oninput="universalEditor.updateContactsField('hours', this.value)">
                    </div>
                </div>

                <div class="editor-actions">
                    <button class="btn btn-success" onclick="universalEditor.saveSection()">
                        <i class="fas fa-save"></i> Сохранить изменения
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    // Data Management Methods
    updateSectionField(section, field, value) {
        if (!this.currentData.content[section]) {
            this.currentData.content[section] = {};
        }
        this.currentData.content[section][field] = value;
        console.log(`📝 Updated ${section}.${field}:`, value);
    }

    updateContactsField(field, value) {
        if (!this.currentData.contacts) {
            this.currentData.contacts = {};
        }
        this.currentData.contacts[field] = value;
        console.log(`📞 Updated contacts.${field}:`, value);
    }

    // Stats Management
    addStatBlock() {
        if (!this.currentData.content.about) {
            this.currentData.content.about = {};
        }
        if (!this.currentData.content.about.stats) {
            this.currentData.content.about.stats = [];
        }

        this.currentData.content.about.stats.push({
            value: '1000',
            label: 'Новый показатель'
        });

        this.showNotification('Блок статистики добавлен', 'success');
        this.injectAboutEditor(document.getElementById('universal-editor-content'));
    }

    updateStatBlock(index, field, value) {
        if (this.currentData.content.about?.stats?.[index]) {
            this.currentData.content.about.stats[index][field] = value;
        }
    }

    removeStatBlock(index) {
        if (this.currentData.content.about?.stats?.[index]) {
            this.currentData.content.about.stats.splice(index, 1);
            this.showNotification('Блок статистики удален', 'success');
            this.injectAboutEditor(document.getElementById('universal-editor-content'));
        }
    }

    // Services Management
    addServiceBlock() {
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

        this.showNotification('Услуга добавлена', 'success');
        this.injectServicesEditor(document.getElementById('universal-editor-content'));
    }

    updateServiceBlock(index, field, value) {
        if (this.currentData.content.services?.services?.[index]) {
            this.currentData.content.services.services[index][field] = value;
        }
    }

    removeServiceBlock(index) {
        if (this.currentData.content.services?.services?.[index]) {
            this.currentData.content.services.services.splice(index, 1);
            this.showNotification('Услуга удалена', 'success');
            this.injectServicesEditor(document.getElementById('universal-editor-content'));
        }
    }

    // Image Management
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
        if (!this.currentData.content[section]) {
            this.currentData.content[section] = {};
        }
        this.currentData.content[section][field] = url;
        this.showNotification('Изображение обновлено', 'success');
        this.showEditor(); // Refresh editor to show new image
    }

    // Save Methods
    saveSection() {
        if (!window.dataManager) {
            this.showNotification('Ошибка: DataManager не доступен', 'error');
            return;
        }

        // Update main data with our changes
        const mainData = window.dataManager.getData() || {};
        
        // Merge our changes into main data
        Object.keys(this.currentData).forEach(key => {
            if (!mainData[key]) mainData[key] = {};
            if (typeof this.currentData[key] === 'object') {
                Object.assign(mainData[key], this.currentData[key]);
            } else {
                mainData[key] = this.currentData[key];
            }
        });

        mainData.lastUpdate = new Date().toISOString();

        if (window.dataManager.setData(mainData)) {
            this.showNotification('Изменения успешно сохранены!', 'success');
            // Refresh preview if available
            if (window.editor && window.editor.safeRefresh) {
                window.editor.safeRefresh();
            }
        } else {
            this.showNotification('Ошибка сохранения', 'error');
        }
    }

    // Utility Methods
    showNotification(message, type = 'success') {
        console.log(`💬 ${type}: ${message}`);
        
        // Try to use existing notification system
        if (window.editor && window.editor.showNotification) {
            window.editor.showNotification(message, type);
        } else {
            // Fallback notification
            alert(`${type === 'success' ? '✅' : '❌'} ${message}`);
        }
    }

    dispatchEvent(name, detail) {
        const event = new CustomEvent(name, { detail });
        document.dispatchEvent(event);
    }

    // Settings and Content editors (simplified)
    injectSettingsEditor(container) {
        const settings = this.currentData.settings || {};
        
        const html = `
            <div class="universal-editor-section">
                <div class="editor-header">
                    <h3>⚙️ Настройки сайта</h3>
                    <p>Основные настройки сайта</p>
                </div>

                <div class="form-group">
                    <label>Название сайта:</label>
                    <input type="text" class="form-control" value="${settings.siteTitle || ''}" 
                           oninput="universalEditor.updateSettingsField('siteTitle', this.value)">
                </div>

                <div class="form-group">
                    <label>Название компании:</label>
                    <input type="text" class="form-control" value="${settings.companyName || ''}" 
                           oninput="universalEditor.updateSettingsField('companyName', this.value)">
                </div>

                <div class="editor-actions">
                    <button class="btn btn-success" onclick="universalEditor.saveSection()">
                        <i class="fas fa-save"></i> Сохранить настройки
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    updateSettingsField(field, value) {
        if (!this.currentData.settings) {
            this.currentData.settings = {};
        }
        this.currentData.settings[field] = value;
    }

    injectContentEditor(container) {
        // Content management for all sections
        const html = `
            <div class="universal-editor-section">
                <div class="editor-header">
                    <h3>📝 Управление контентом</h3>
                    <p>Редактирование всех секций сайта</p>
                </div>

                <div class="content-sections">
                    <div class="section-grid">
                        <div class="section-card" onclick="universalEditor.selectSection('hero')">
                            <i class="fas fa-home"></i>
                            <h4>Главный баннер</h4>
                            <p>Заголовок, описание и изображение</p>
                        </div>
                        <div class="section-card" onclick="universalEditor.selectSection('about')">
                            <i class="fas fa-building"></i>
                            <h4>О компании</h4>
                            <p>Информация и статистика</p>
                        </div>
                        <div class="section-card" onclick="universalEditor.selectSection('services')">
                            <i class="fas fa-concierge-bell"></i>
                            <h4>Услуги</h4>
                            <p>Список услуг компании</p>
                        </div>
                        <div class="section-card" onclick="universalEditor.selectSection('destinations')">
                            <i class="fas fa-map-marked-alt"></i>
                            <h4>Направления</h4>
                            <p>Раздел направлений</p>
                        </div>
                        <div class="section-card" onclick="universalEditor.selectSection('contact')">
                            <i class="fas fa-phone"></i>
                            <h4>Контакты</h4>
                            <p>Контактная информация</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    injectGenericEditor(container) {
        container.innerHTML = `
            <div class="universal-editor-section">
                <div class="editor-header">
                    <h3>�� Редактор контента</h3>
                    <p>Выберите секцию для редактирования</p>
                </div>
                <div class="empty-state">
                    <i class="fas fa-edit"></i>
                    <p>Секция не выбрана</p>
                </div>
            </div>
        `;
    }
}

// Initialize universal editor
console.log('🎬 Starting Universal Editor...');
const universalEditor = new UniversalEditor();
window.universalEditor = universalEditor;

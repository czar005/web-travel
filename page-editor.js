// Page Editor JavaScript
class PageEditor {
    constructor() {
        this.currentPage = 'home';
        this.currentBlocks = [];
        this.editingBlock = null;
        this.init();
    }

    init() {
        this.loadPageData();
        this.setupEventListeners();
        this.renderPageStructure();
        this.updatePageTitle();
    }

    loadPageData() {
        if (!window.dataManager) {
            console.error('Data manager not available');
            this.showError('Менеджер данных не доступен');
            return;
        }

        console.log('Loading page data for:', this.currentPage);
        const page = window.dataManager.getPage(this.currentPage);
        console.log('Loaded page:', page);

        if (page && page.blocks) {
            this.currentBlocks = JSON.parse(JSON.stringify(page.blocks)); // Deep copy
            console.log('Loaded blocks:', this.currentBlocks);
        } else {
            this.currentBlocks = [];
            console.log('No blocks found, using empty array');
        }
    }

    setupEventListeners() {
        // Выбор страницы
        const pageSelect = document.getElementById('page-select');
        if (pageSelect) {
            pageSelect.addEventListener('change', (e) => {
                this.currentPage = e.target.value;
                this.loadPageData();
                this.renderPageStructure();
                this.updatePageTitle();
                this.updatePreview();
            });
        }

        // Drag and drop для блоков
        this.setupDragAndDrop();
    }

    setupDragAndDrop() {
        const blocksList = document.querySelector('.blocks-list');
        const pageStructure = document.getElementById('page-structure');

        // Делаем блоки перетаскиваемыми
        document.querySelectorAll('.block-item').forEach(item => {
            item.setAttribute('draggable', 'true');
            
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.getAttribute('data-type'));
                e.dataTransfer.effectAllowed = 'copy';
            });
        });

        // Настройка зоны сброса
        if (pageStructure) {
            pageStructure.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
                pageStructure.classList.add('drag-over');
            });

            pageStructure.addEventListener('dragleave', () => {
                pageStructure.classList.remove('drag-over');
            });

            pageStructure.addEventListener('drop', (e) => {
                e.preventDefault();
                pageStructure.classList.remove('drag-over');
                
                const blockType = e.dataTransfer.getData('text/plain');
                this.addBlock(blockType);
            });
        }
    }

    addBlock(blockType) {
        const newBlock = {
            id: 'block_' + Date.now(),
            type: blockType,
            ...this.getDefaultBlockData(blockType)
        };

        console.log('Adding new block:', newBlock);
        this.currentBlocks.push(newBlock);
        this.renderPageStructure();
        this.updatePreview();
        
        // Автоматически открываем редактор для нового блока
        setTimeout(() => {
            this.editBlock(newBlock.id);
        }, 100);
    }

    getDefaultBlockData(blockType) {
        const defaults = {
            hero: {
                title: 'Новый заголовок',
                subtitle: 'Описание секции',
                buttonText: 'Узнать больше'
            },
            about: {
                title: 'О нас',
                content: 'Описание компании',
                stats: [
                    { value: 1000, label: 'Клиентов' },
                    { value: 10, label: 'Лет опыта' },
                    { value: 50, label: 'Проектов' }
                ]
            },
            services: {
                title: 'Наши услуги',
                services: [
                    { icon: 'cog', title: 'Услуга 1', description: 'Описание услуги' },
                    { icon: 'cog', title: 'Услуга 2', description: 'Описание услуги' }
                ]
            },
            destinations: {
                title: 'Направления',
                subtitle: 'Лучшие направления для путешествий'
            },
            contact: {
                title: 'Контакты',
                subtitle: 'Свяжитесь с нами'
            }
        };

        return JSON.parse(JSON.stringify(defaults[blockType] || {}));
    }

    removeBlock(blockId) {
        if (confirm('Вы уверены, что хотите удалить этот блок?')) {
            this.currentBlocks = this.currentBlocks.filter(block => block.id !== blockId);
            this.renderPageStructure();
            this.updatePreview();
            this.showNotification('Блок удален', 'success');
        }
    }

    editBlock(blockId) {
        const block = this.currentBlocks.find(b => b.id === blockId);
        if (!block) {
            console.error('Block not found:', blockId);
            return;
        }

        console.log('Editing block:', block);
        this.editingBlock = block;
        this.openBlockEditor(block);
    }

    openBlockEditor(block) {
        const editor = document.getElementById('block-editor');
        const overlay = document.getElementById('editor-overlay');
        const title = document.getElementById('block-editor-title');
        const content = document.getElementById('block-editor-content');

        if (!editor || !overlay || !title || !content) {
            console.error('Editor elements not found');
            return;
        }

        title.textContent = `Редактирование: ${this.getBlockTypeName(block.type)}`;
        content.innerHTML = this.getBlockEditorForm(block);

        editor.classList.add('active');
        overlay.classList.add('active');

        // Заполняем форму текущими данными блока
        this.populateBlockForm(block);
    }

    closeBlockEditor() {
        const editor = document.getElementById('block-editor');
        const overlay = document.getElementById('editor-overlay');
        
        if (editor) editor.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        this.editingBlock = null;
    }

    getBlockTypeName(type) {
        const names = {
            hero: 'Герой-секция',
            about: 'О компании',
            services: 'Услуги',
            destinations: 'Направления',
            contact: 'Контакты'
        };
        return names[type] || 'Блок';
    }

    getBlockEditorForm(block) {
        const forms = {
            hero: this.getHeroEditorForm(),
            about: this.getAboutEditorForm(),
            services: this.getServicesEditorForm(),
            destinations: this.getDestinationsEditorForm(),
            contact: this.getContactEditorForm()
        };

        return forms[block.type] || '<p>Редактор для этого типа блока не реализован</p>';
    }

    getHeroEditorForm() {
        return `
            <div class="form-group">
                <label>Заголовок</label>
                <input type="text" id="hero-title" class="form-control" placeholder="Введите заголовок">
            </div>
            <div class="form-group">
                <label>Подзаголовок</label>
                <textarea id="hero-subtitle" class="form-control" rows="3" placeholder="Введите описание"></textarea>
            </div>
            <div class="form-group">
                <label>Текст кнопки</label>
                <input type="text" id="hero-buttonText" class="form-control" placeholder="Текст на кнопке">
            </div>
        `;
    }

    getAboutEditorForm() {
        return `
            <div class="form-group">
                <label>Заголовок</label>
                <input type="text" id="about-title" class="form-control" placeholder="Заголовок секции">
            </div>
            <div class="form-group">
                <label>Текст</label>
                <textarea id="about-content" class="form-control" rows="5" placeholder="Описание компании"></textarea>
            </div>
            <div class="form-group">
                <label>Статистика</label>
                <div id="about-stats">
                    <!-- Статистика будет добавляться динамически -->
                </div>
                <button type="button" class="btn-small" onclick="pageEditor.addStat()" style="margin-top: 10px;">
                    <i class="fas fa-plus"></i> Добавить статистику
                </button>
            </div>
        `;
    }

    getServicesEditorForm() {
        return `
            <div class="form-group">
                <label>Заголовок</label>
                <input type="text" id="services-title" class="form-control" placeholder="Заголовок секции услуг">
            </div>
            <div class="form-group">
                <label>Услуги</label>
                <div id="services-list">
                    <!-- Услуги будут добавляться динамически -->
                </div>
                <button type="button" class="btn-small" onclick="pageEditor.addService()" style="margin-top: 10px;">
                    <i class="fas fa-plus"></i> Добавить услугу
                </button>
            </div>
        `;
    }

    getDestinationsEditorForm() {
        return `
            <div class="form-group">
                <label>Заголовок</label>
                <input type="text" id="destinations-title" class="form-control" placeholder="Заголовок секции направлений">
            </div>
            <div class="form-group">
                <label>Подзаголовок</label>
                <textarea id="destinations-subtitle" class="form-control" rows="3" placeholder="Описание направлений"></textarea>
            </div>
        `;
    }

    getContactEditorForm() {
        return `
            <div class="form-group">
                <label>Заголовок</label>
                <input type="text" id="contact-title" class="form-control" placeholder="Заголовок секции контактов">
            </div>
            <div class="form-group">
                <label>Подзаголовок</label>
                <textarea id="contact-subtitle" class="form-control" rows="3" placeholder="Описание контактов"></textarea>
            </div>
        `;
    }

    populateBlockForm(block) {
        if (!block) return;

        console.log('Populating form for block:', block);

        switch(block.type) {
            case 'hero':
                document.getElementById('hero-title').value = block.title || '';
                document.getElementById('hero-subtitle').value = block.subtitle || '';
                document.getElementById('hero-buttonText').value = block.buttonText || '';
                break;
                
            case 'about':
                document.getElementById('about-title').value = block.title || '';
                document.getElementById('about-content').value = block.content || '';
                this.renderStats(block.stats || []);
                break;
                
            case 'services':
                document.getElementById('services-title').value = block.title || '';
                this.renderServices(block.services || []);
                break;
                
            case 'destinations':
                document.getElementById('destinations-title').value = block.title || '';
                document.getElementById('destinations-subtitle').value = block.subtitle || '';
                break;
                
            case 'contact':
                document.getElementById('contact-title').value = block.title || '';
                document.getElementById('contact-subtitle').value = block.subtitle || '';
                break;
        }
    }

    renderStats(stats) {
        const container = document.getElementById('about-stats');
        if (!container) return;

        container.innerHTML = stats.map((stat, index) => `
            <div class="stat-item" style="display: flex; gap: 10px; margin-bottom: 10px; align-items: center;">
                <input type="text" value="${stat.value}" placeholder="Значение" class="form-control stat-value" data-index="${index}">
                <input type="text" value="${stat.label}" placeholder="Подпись" class="form-control stat-label" data-index="${index}">
                <button type="button" class="btn-small danger" onclick="pageEditor.removeStat(${index})" title="Удалить">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    renderServices(services) {
        const container = document.getElementById('services-list');
        if (!container) return;

        container.innerHTML = services.map((service, index) => `
            <div class="service-item" style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 5px;">
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <input type="text" value="${service.icon}" placeholder="Иконка (fa-...)" class="form-control service-icon" data-index="${index}">
                    <input type="text" value="${service.title}" placeholder="Название услуги" class="form-control service-title" data-index="${index}">
                </div>
                <textarea class="form-control service-description" placeholder="Описание услуги" data-index="${index}" rows="2">${service.description || ''}</textarea>
                <button type="button" class="btn-small danger" onclick="pageEditor.removeService(${index})" style="margin-top: 10px;">
                    <i class="fas fa-trash"></i> Удалить
                </button>
            </div>
        `).join('');
    }

    addStat() {
        if (!this.editingBlock) return;
        
        if (!this.editingBlock.stats) {
            this.editingBlock.stats = [];
        }
        
        this.editingBlock.stats.push({ value: '', label: '' });
        this.renderStats(this.editingBlock.stats);
    }

    removeStat(index) {
        if (!this.editingBlock || !this.editingBlock.stats) return;
        
        this.editingBlock.stats.splice(index, 1);
        this.renderStats(this.editingBlock.stats);
    }

    addService() {
        if (!this.editingBlock) return;
        
        if (!this.editingBlock.services) {
            this.editingBlock.services = [];
        }
        
        this.editingBlock.services.push({ icon: 'cog', title: '', description: '' });
        this.renderServices(this.editingBlock.services);
    }

    removeService(index) {
        if (!this.editingBlock || !this.editingBlock.services) return;
        
        this.editingBlock.services.splice(index, 1);
        this.renderServices(this.editingBlock.services);
    }

    saveBlockChanges() {
        if (!this.editingBlock) {
            this.showError('Нет активного блока для сохранения');
            return;
        }

        console.log('Saving block changes:', this.editingBlock);

        try {
            const blockType = this.editingBlock.type;
            
            // Сохраняем изменения в зависимости от типа блока
            switch(blockType) {
                case 'hero':
                    this.editingBlock.title = document.getElementById('hero-title').value;
                    this.editingBlock.subtitle = document.getElementById('hero-subtitle').value;
                    this.editingBlock.buttonText = document.getElementById('hero-buttonText').value;
                    break;
                    
                case 'about':
                    this.editingBlock.title = document.getElementById('about-title').value;
                    this.editingBlock.content = document.getElementById('about-content').value;
                    // Статистика уже обновлена через методы addStat/removeStat
                    break;
                    
                case 'services':
                    this.editingBlock.title = document.getElementById('services-title').value;
                    // Обновляем услуги из формы
                    this.updateServicesFromForm();
                    break;
                    
                case 'destinations':
                    this.editingBlock.title = document.getElementById('destinations-title').value;
                    this.editingBlock.subtitle = document.getElementById('destinations-subtitle').value;
                    break;
                    
                case 'contact':
                    this.editingBlock.title = document.getElementById('contact-title').value;
                    this.editingBlock.subtitle = document.getElementById('contact-subtitle').value;
                    break;
            }

            this.renderPageStructure();
            this.updatePreview();
            this.closeBlockEditor();
            this.showNotification('Изменения сохранены', 'success');
            
        } catch (error) {
            console.error('Error saving block changes:', error);
            this.showError('Ошибка при сохранении изменений');
        }
    }

    updateServicesFromForm() {
        if (!this.editingBlock.services) return;
        
        const serviceElements = document.querySelectorAll('.service-item');
        serviceElements.forEach((element, index) => {
            if (this.editingBlock.services[index]) {
                this.editingBlock.services[index].icon = element.querySelector('.service-icon').value;
                this.editingBlock.services[index].title = element.querySelector('.service-title').value;
                this.editingBlock.services[index].description = element.querySelector('.service-description').value;
            }
        });
    }

    renderPageStructure() {
        const container = document.getElementById('page-structure');
        if (!container) return;
        
        if (this.currentBlocks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-layer-group"></i>
                    <p>На странице пока нет блоков</p>
                    <small>Перетащите блоки из панели слева</small>
                </div>
            `;
            return;
        }

        container.innerHTML = this.currentBlocks.map(block => `
            <div class="page-block" data-block-id="${block.id}">
                <div class="block-actions">
                    <button class="block-btn edit" onclick="pageEditor.editBlock('${block.id}')" title="Редактировать">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="block-btn delete" onclick="pageEditor.removeBlock('${block.id}')" title="Удалить">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="block-header">
                    <div class="block-type-icon">
                        <i class="fas fa-${this.getBlockIcon(block.type)}"></i>
                    </div>
                    <div>
                        <strong>${this.getBlockTypeName(block.type)}</strong>
                        <div style="font-size: 0.8rem; color: #666;">${block.title || 'Без названия'}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getBlockIcon(type) {
        const icons = {
            hero: 'star',
            about: 'info-circle',
            services: 'concierge-bell',
            destinations: 'globe-americas',
            contact: 'envelope'
        };
        return icons[type] || 'cube';
    }

    updatePreview() {
        const preview = document.getElementById('page-preview');
        if (preview) {
            // Обновляем iframe для показа изменений
            preview.src = preview.src.split('?')[0] + '?preview=true&t=' + Date.now();
        }
    }

    updatePageTitle() {
        const titleElement = document.getElementById('current-page-title');
        if (titleElement) {
            titleElement.textContent = `Редактор: ${this.getPageName(this.currentPage)}`;
        }
    }

    getPageName(pageId) {
        const names = {
            home: 'Главная страница'
        };
        return names[pageId] || 'Страница';
    }

    saveChanges() {
        if (!window.dataManager) {
            this.showError('Менеджер данных не доступен');
            return;
        }

        console.log('Saving all changes for page:', this.currentPage, this.currentBlocks);

        const success = window.dataManager.updatePageBlocks(this.currentPage, this.currentBlocks);
        if (success) {
            this.showNotification('Все изменения сохранены!', 'success');
            
            // Ждем немного перед переходом
            setTimeout(() => {
                window.location.href = this.getPageUrl(this.currentPage);
            }, 1500);
            
        } else {
            this.showError('Ошибка при сохранении изменений');
        }
    }

    getPageUrl(pageId) {
        const urls = {
            home: 'index.html'
        };
        return urls[pageId] || 'index.html';
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : type === 'warning' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            ${message}
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#007bff'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }
}

// Глобальные функции
function previewChanges() {
    const preview = document.getElementById('page-preview');
    if (preview) {
        preview.contentWindow.location.reload();
    }
}

function saveChanges() {
    if (window.pageEditor) {
        window.pageEditor.saveChanges();
    }
}

function exitEditor() {
    if (confirm('Выйти без сохранения?')) {
        window.location.href = 'admin.html';
    }
}

function closeBlockEditor() {
    if (window.pageEditor) {
        window.pageEditor.closeBlockEditor();
    }
}

function saveBlockChanges() {
    if (window.pageEditor) {
        window.pageEditor.saveBlockChanges();
    }
}

// Инициализация редактора
document.addEventListener('DOMContentLoaded', function() {
    window.pageEditor = new PageEditor();
});

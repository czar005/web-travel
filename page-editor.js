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
    }

    loadPageData() {
        if (!window.dataManager) {
            console.error('Data manager not available');
            return;
        }

        const page = window.dataManager.getPage(this.currentPage);
        if (page && page.blocks) {
            this.currentBlocks = [...page.blocks];
        } else {
            this.currentBlocks = [];
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

    addBlock(blockType) {
        const newBlock = {
            id: 'block_' + Date.now(),
            type: blockType,
            ...this.getDefaultBlockData(blockType)
        };

        this.currentBlocks.push(newBlock);
        this.renderPageStructure();
        this.updatePreview();
        
        // Показываем редактор для нового блока
        this.editBlock(newBlock.id);
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

        return defaults[blockType] || {};
    }

    removeBlock(blockId) {
        if (confirm('Вы уверены, что хотите удалить этот блок?')) {
            this.currentBlocks = this.currentBlocks.filter(block => block.id !== blockId);
            this.renderPageStructure();
            this.updatePreview();
        }
    }

    editBlock(blockId) {
        const block = this.currentBlocks.find(b => b.id === blockId);
        if (!block) return;

        this.editingBlock = block;
        this.openBlockEditor(block);
    }

    openBlockEditor(block) {
        const editor = document.getElementById('block-editor');
        const overlay = document.getElementById('editor-overlay');
        const title = document.getElementById('block-editor-title');
        const content = document.getElementById('block-editor-content');

        title.textContent = `Редактирование: ${this.getBlockTypeName(block.type)}`;
        content.innerHTML = this.getBlockEditorForm(block);

        editor.classList.add('active');
        overlay.classList.add('active');
    }

    closeBlockEditor() {
        const editor = document.getElementById('block-editor');
        const overlay = document.getElementById('editor-overlay');
        
        editor.classList.remove('active');
        overlay.classList.remove('active');
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
            hero: this.getHeroEditorForm(block),
            about: this.getAboutEditorForm(block),
            services: this.getServicesEditorForm(block),
            destinations: this.getDestinationsEditorForm(block),
            contact: this.getContactEditorForm(block)
        };

        return forms[block.type] || '<p>Редактор для этого типа блока не реализован</p>';
    }

    getHeroEditorForm(block) {
        return `
            <div class="form-group">
                <label>Заголовок</label>
                <input type="text" value="${block.title || ''}" id="hero-title" class="form-control">
            </div>
            <div class="form-group">
                <label>Подзаголовок</label>
                <textarea id="hero-subtitle" class="form-control" rows="3">${block.subtitle || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Текст кнопки</label>
                <input type="text" value="${block.buttonText || ''}" id="hero-buttonText" class="form-control">
            </div>
        `;
    }

    getAboutEditorForm(block) {
        return `
            <div class="form-group">
                <label>Заголовок</label>
                <input type="text" value="${block.title || ''}" id="about-title" class="form-control">
            </div>
            <div class="form-group">
                <label>Текст</label>
                <textarea id="about-content" class="form-control" rows="5">${block.content || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Статистика</label>
                <div id="about-stats">
                    ${(block.stats || []).map((stat, index) => `
                        <div class="stat-item" style="display: flex; gap: 10px; margin-bottom: 10px;">
                            <input type="text" value="${stat.value}" placeholder="Значение" class="form-control" data-index="${index}" data-field="value">
                            <input type="text" value="${stat.label}" placeholder="Подпись" class="form-control" data-index="${index}" data-field="label">
                            <button type="button" class="btn-small danger" onclick="pageEditor.removeStat(${index})">×</button>
                        </div>
                    `).join('')}
                </div>
                <button type="button" class="btn-small" onclick="pageEditor.addStat()">+ Добавить статистику</button>
            </div>
        `;
    }

    getServicesEditorForm(block) {
        return `
            <div class="form-group">
                <label>Заголовок</label>
                <input type="text" value="${block.title || ''}" id="services-title" class="form-control">
            </div>
            <div class="form-group">
                <label>Услуги</label>
                <div id="services-list">
                    ${(block.services || []).map((service, index) => `
                        <div class="service-item" style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 5px;">
                            <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                                <input type="text" value="${service.icon}" placeholder="Иконка (fa-...)" class="form-control" data-index="${index}" data-field="icon">
                                <input type="text" value="${service.title}" placeholder="Название услуги" class="form-control" data-index="${index}" data-field="title">
                            </div>
                            <textarea class="form-control" placeholder="Описание услуги" data-index="${index}" data-field="description" rows="2">${service.description || ''}</textarea>
                            <button type="button" class="btn-small danger" onclick="pageEditor.removeService(${index})" style="margin-top: 10px;">Удалить</button>
                        </div>
                    `).join('')}
                </div>
                <button type="button" class="btn-small" onclick="pageEditor.addService()">+ Добавить услугу</button>
            </div>
        `;
    }

    getDestinationsEditorForm(block) {
        return `
            <div class="form-group">
                <label>Заголовок</label>
                <input type="text" value="${block.title || ''}" id="destinations-title" class="form-control">
            </div>
            <div class="form-group">
                <label>Подзаголовок</label>
                <textarea id="destinations-subtitle" class="form-control" rows="3">${block.subtitle || ''}</textarea>
            </div>
        `;
    }

    getContactEditorForm(block) {
        return `
            <div class="form-group">
                <label>Заголовок</label>
                <input type="text" value="${block.title || ''}" id="contact-title" class="form-control">
            </div>
            <div class="form-group">
                <label>Подзаголовок</label>
                <textarea id="contact-subtitle" class="form-control" rows="3">${block.subtitle || ''}</textarea>
            </div>
        `;
    }

    addStat() {
        const stats = this.editingBlock.stats || [];
        stats.push({ value: '', label: '' });
        this.editingBlock.stats = stats;
        this.openBlockEditor(this.editingBlock);
    }

    removeStat(index) {
        this.editingBlock.stats.splice(index, 1);
        this.openBlockEditor(this.editingBlock);
    }

    addService() {
        const services = this.editingBlock.services || [];
        services.push({ icon: 'cog', title: '', description: '' });
        this.editingBlock.services = services;
        this.openBlockEditor(this.editingBlock);
    }

    removeService(index) {
        this.editingBlock.services.splice(index, 1);
        this.openBlockEditor(this.editingBlock);
    }

    saveBlockChanges() {
        if (!this.editingBlock) return;

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
                // Услуги уже обновлены через методы addService/removeService
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
    }

    renderPageStructure() {
        const container = document.getElementById('page-structure');
        
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
                    <button class="block-btn edit" onclick="pageEditor.editBlock('${block.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="block-btn delete" onclick="pageEditor.removeBlock('${block.id}')">
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
        // Обновляем iframe для показа изменений
        preview.src = preview.src.split('?')[0] + '?preview=true&t=' + Date.now();
    }

    saveChanges() {
        if (!window.dataManager) {
            alert('Ошибка: менеджер данных не доступен');
            return;
        }

        const success = window.dataManager.updatePageBlocks(this.currentPage, this.currentBlocks);
        if (success) {
            alert('Изменения сохранены! Страница будет обновлена.');
            // Переходим на страницу с изменениями
            window.location.href = this.getPageUrl(this.currentPage);
        } else {
            alert('Ошибка при сохранении изменений');
        }
    }

    getPageUrl(pageId) {
        const urls = {
            home: 'index.html'
        };
        return urls[pageId] || 'index.html';
    }
}

// Глобальные функции
function previewChanges() {
    const preview = document.getElementById('page-preview');
    preview.contentWindow.location.reload();
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

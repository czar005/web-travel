// Simple Page Editor
class PageEditor {
    constructor() {
        this.currentPage = 'home';
        this.blocks = [];
        this.editingBlock = null;
        this.init();
    }

    init() {
        console.log('Initializing page editor...');
        this.loadPageData();
        this.setupEventListeners();
        this.renderBlocks();
    }

    loadPageData() {
        if (!window.dataManager) {
            this.showError('Data manager not available');
            return;
        }

        const page = window.dataManager.getPage(this.currentPage);
        console.log('Loaded page:', page);
        
        if (page && page.blocks) {
            this.blocks = JSON.parse(JSON.stringify(page.blocks));
            console.log('Loaded blocks:', this.blocks);
        } else {
            this.blocks = [];
            console.log('No blocks found');
        }
    }

    setupEventListeners() {
        // Drag and drop
        this.setupDragAndDrop();
        
        // Page selection
        const pageSelect = document.getElementById('page-select');
        if (pageSelect) {
            pageSelect.addEventListener('change', (e) => {
                this.currentPage = e.target.value;
                this.loadPageData();
                this.renderBlocks();
            });
        }
    }

    setupDragAndDrop() {
        const blocksList = document.querySelector('.blocks-list');
        const pageStructure = document.getElementById('page-structure');

        document.querySelectorAll('.block-item').forEach(item => {
            item.setAttribute('draggable', 'true');
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.getAttribute('data-type'));
            });
        });

        if (pageStructure) {
            pageStructure.addEventListener('dragover', (e) => {
                e.preventDefault();
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

    addBlock(type) {
        const block = {
            id: 'block_' + Date.now(),
            type: type,
            ...this.getDefaultBlockData(type)
        };
        
        this.blocks.push(block);
        this.renderBlocks();
        this.showNotification('Блок добавлен', 'success');
        
        // Auto-edit new block
        setTimeout(() => this.editBlock(block.id), 100);
    }

    getDefaultBlockData(type) {
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
                    { value: '1000', label: 'Клиентов' },
                    { value: '10', label: 'Лет опыта' },
                    { value: '50', label: 'Проектов' }
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
        return JSON.parse(JSON.stringify(defaults[type] || {}));
    }

    removeBlock(blockId) {
        if (confirm('Удалить этот блок?')) {
            this.blocks = this.blocks.filter(b => b.id !== blockId);
            this.renderBlocks();
            this.showNotification('Блок удален', 'success');
        }
    }

    editBlock(blockId) {
        const block = this.blocks.find(b => b.id === blockId);
        if (!block) return;
        
        this.editingBlock = block;
        this.openEditor(block);
    }

    openEditor(block) {
        const editor = document.getElementById('block-editor');
        const overlay = document.getElementById('editor-overlay');
        const title = document.getElementById('block-editor-title');
        const content = document.getElementById('block-editor-content');

        if (!editor || !overlay) return;

        title.textContent = `Редактирование: ${this.getBlockName(block.type)}`;
        content.innerHTML = this.getEditorForm(block);
        this.fillForm(block);

        editor.classList.add('active');
        overlay.classList.add('active');
    }

    getBlockName(type) {
        const names = {
            hero: 'Герой-секция',
            about: 'О компании',
            services: 'Услуги',
            destinations: 'Направления',
            contact: 'Контакты'
        };
        return names[type] || 'Блок';
    }

    getEditorForm(block) {
        const forms = {
            hero: `
                <div class="form-group">
                    <label>Заголовок</label>
                    <input type="text" id="edit-title" class="form-control">
                </div>
                <div class="form-group">
                    <label>Описание</label>
                    <textarea id="edit-subtitle" class="form-control" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label>Текст кнопки</label>
                    <input type="text" id="edit-buttonText" class="form-control">
                </div>
            `,
            about: `
                <div class="form-group">
                    <label>Заголовок</label>
                    <input type="text" id="edit-title" class="form-control">
                </div>
                <div class="form-group">
                    <label>Текст</label>
                    <textarea id="edit-content" class="form-control" rows="5"></textarea>
                </div>
                <div class="form-group">
                    <label>Статистика</label>
                    <div id="stats-container"></div>
                    <button type="button" class="btn-small" onclick="pageEditor.addStat()">
                        + Добавить статистику
                    </button>
                </div>
            `,
            services: `
                <div class="form-group">
                    <label>Заголовок</label>
                    <input type="text" id="edit-title" class="form-control">
                </div>
                <div class="form-group">
                    <label>Услуги</label>
                    <div id="services-container"></div>
                    <button type="button" class="btn-small" onclick="pageEditor.addService()">
                        + Добавить услугу
                    </button>
                </div>
            `,
            destinations: `
                <div class="form-group">
                    <label>Заголовок</label>
                    <input type="text" id="edit-title" class="form-control">
                </div>
                <div class="form-group">
                    <label>Описание</label>
                    <textarea id="edit-subtitle" class="form-control" rows="3"></textarea>
                </div>
            `,
            contact: `
                <div class="form-group">
                    <label>Заголовок</label>
                    <input type="text" id="edit-title" class="form-control">
                </div>
                <div class="form-group">
                    <label>Описание</label>
                    <textarea id="edit-subtitle" class="form-control" rows="3"></textarea>
                </div>
            `
        };
        return forms[block.type] || '<p>Редактор не доступен</p>';
    }

    fillForm(block) {
        switch(block.type) {
            case 'hero':
                document.getElementById('edit-title').value = block.title || '';
                document.getElementById('edit-subtitle').value = block.subtitle || '';
                document.getElementById('edit-buttonText').value = block.buttonText || '';
                break;
            case 'about':
                document.getElementById('edit-title').value = block.title || '';
                document.getElementById('edit-content').value = block.content || '';
                this.renderStats(block.stats || []);
                break;
            case 'services':
                document.getElementById('edit-title').value = block.title || '';
                this.renderServices(block.services || []);
                break;
            case 'destinations':
            case 'contact':
                document.getElementById('edit-title').value = block.title || '';
                document.getElementById('edit-subtitle').value = block.subtitle || '';
                break;
        }
    }

    renderStats(stats) {
        const container = document.getElementById('stats-container');
        if (!container) return;
        
        container.innerHTML = stats.map((stat, index) => `
            <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                <input type="text" value="${stat.value}" class="form-control stat-value" data-index="${index}" placeholder="Значение">
                <input type="text" value="${stat.label}" class="form-control stat-label" data-index="${index}" placeholder="Подпись">
                <button type="button" class="btn-small danger" onclick="pageEditor.removeStat(${index})">×</button>
            </div>
        `).join('');
    }

    renderServices(services) {
        const container = document.getElementById('services-container');
        if (!container) return;
        
        container.innerHTML = services.map((service, index) => `
            <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px;">
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <input type="text" value="${service.icon}" class="form-control" data-index="${index}" data-field="icon" placeholder="Иконка">
                    <input type="text" value="${service.title}" class="form-control" data-index="${index}" data-field="title" placeholder="Название">
                </div>
                <textarea class="form-control" data-index="${index}" data-field="description" placeholder="Описание" rows="2">${service.description || ''}</textarea>
                <button type="button" class="btn-small danger" onclick="pageEditor.removeService(${index})" style="margin-top: 5px;">Удалить</button>
            </div>
        `).join('');
    }

    addStat() {
        if (!this.editingBlock.stats) this.editingBlock.stats = [];
        this.editingBlock.stats.push({ value: '', label: '' });
        this.renderStats(this.editingBlock.stats);
    }

    removeStat(index) {
        this.editingBlock.stats.splice(index, 1);
        this.renderStats(this.editingBlock.stats);
    }

    addService() {
        if (!this.editingBlock.services) this.editingBlock.services = [];
        this.editingBlock.services.push({ icon: 'cog', title: '', description: '' });
        this.renderServices(this.editingBlock.services);
    }

    removeService(index) {
        this.editingBlock.services.splice(index, 1);
        this.renderServices(this.editingBlock.services);
    }

    saveBlock() {
        if (!this.editingBlock) return;

        const type = this.editingBlock.type;
        
        switch(type) {
            case 'hero':
                this.editingBlock.title = document.getElementById('edit-title').value;
                this.editingBlock.subtitle = document.getElementById('edit-subtitle').value;
                this.editingBlock.buttonText = document.getElementById('edit-buttonText').value;
                break;
            case 'about':
                this.editingBlock.title = document.getElementById('edit-title').value;
                this.editingBlock.content = document.getElementById('edit-content').value;
                // Stats are already updated
                break;
            case 'services':
                this.editingBlock.title = document.getElementById('edit-title').value;
                // Services are already updated
                break;
            case 'destinations':
            case 'contact':
                this.editingBlock.title = document.getElementById('edit-title').value;
                this.editingBlock.subtitle = document.getElementById('edit-subtitle').value;
                break;
        }

        this.renderBlocks();
        this.closeEditor();
        this.showNotification('Блок сохранен', 'success');
    }

    renderBlocks() {
        const container = document.getElementById('page-structure');
        if (!container) return;

        if (this.blocks.length === 0) {
            container.innerHTML = '<div class="empty-state">Нет блоков</div>';
            return;
        }

        container.innerHTML = this.blocks.map(block => `
            <div class="page-block">
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
                        <strong>${this.getBlockName(block.type)}</strong>
                        <div style="color: #666; font-size: 0.9em;">${block.title || 'Без названия'}</div>
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

    closeEditor() {
        const editor = document.getElementById('block-editor');
        const overlay = document.getElementById('editor-overlay');
        if (editor) editor.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        this.editingBlock = null;
    }

    saveAll() {
        if (!window.dataManager) {
            this.showError('Data manager not available');
            return;
        }

        console.log('Saving blocks:', this.blocks);
        const success = window.dataManager.updatePageBlocks(this.currentPage, this.blocks);
        
        if (success) {
            this.showNotification('Все изменения сохранены!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            this.showError('Ошибка сохранения');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed; top: 20px; right: 20px; 
                background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
                color: white; padding: 15px 20px; border-radius: 5px;
                z-index: 10000; animation: slideInRight 0.3s ease;
            ">
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}"></i>
                ${message}
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }
}

// Global functions
function saveBlockChanges() {
    if (window.pageEditor) window.pageEditor.saveBlock();
}

function closeBlockEditor() {
    if (window.pageEditor) window.pageEditor.closeEditor();
}

function saveChanges() {
    if (window.pageEditor) window.pageEditor.saveAll();
}

function exitEditor() {
    if (confirm('Выйти без сохранения?')) {
        window.location.href = 'admin.html';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    window.pageEditor = new PageEditor();
});

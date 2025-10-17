class PageEditor {
    constructor() {
        this.currentBlock = null;
        this.blocks = [];
        this.init();
    }

    init() {
        this.loadBlocks();
        this.setupEventListeners();
        this.renderBlocks();
    }

    loadBlocks() {
        // Загружаем блоки из localStorage или используем демо-данные
        const saved = localStorage.getItem('page-blocks');
        this.blocks = saved ? JSON.parse(saved) : this.getDefaultBlocks();
    }

    getDefaultBlocks() {
        return [
            {
                id: 1,
                type: 'hero',
                title: 'Добро пожаловать в наш туристический сервис',
                content: 'Лучшие путешествия начинаются здесь',
                image: ''
            },
            {
                id: 2,
                type: 'text',
                title: 'О нас',
                content: 'Мы предлагаем уникальные туристические experience по всему миру.'
            },
            {
                id: 3,
                type: 'features',
                title: 'Наши преимущества',
                features: [
                    { title: 'Качество', content: 'Гарантия лучшего сервиса' },
                    { title: 'Цены', content: 'Доступные туры для всех' },
                    { title: 'Поддержка', content: '24/7 поддержка клиентов' }
                ]
            }
        ];
    }

    setupEventListeners() {
        // Кнопка добавления блока
        document.getElementById('addBlockBtn').addEventListener('click', () => {
            this.showAddBlockModal();
        });

        // Закрытие редактора
        document.getElementById('closeEditor').addEventListener('click', () => {
            this.hideEditor();
        });

        // Модальное окно добавления блока
        document.getElementById('blockType').addEventListener('change', (e) => {
            this.updateBlockPreview(e.target.value);
        });

        document.getElementById('confirmAddBlock').addEventListener('click', () => {
            this.addNewBlock();
        });

        document.getElementById('cancelAddBlock').addEventListener('click', () => {
            this.hideAddBlockModal();
        });

        document.querySelector('.close-modal').addEventListener('click', () => {
            this.hideAddBlockModal();
        });
    }

    renderBlocks() {
        const container = document.getElementById('pagePreview');
        container.innerHTML = '';

        this.blocks.forEach(block => {
            const blockElement = this.createBlockElement(block);
            container.appendChild(blockElement);
        });
    }

    createBlockElement(block) {
        const div = document.createElement('div');
        div.className = `content-block block-${block.type}`;
        div.dataset.blockId = block.id;

        switch (block.type) {
            case 'text':
                div.innerHTML = `
                    <h3>${block.title}</h3>
                    <p>${block.content}</p>
                `;
                break;
            case 'image':
                div.innerHTML = `
                    ${block.image ? `<img src="${block.image}" style="max-width: 100%; height: auto; margin-bottom: 15px;">` : ''}
                    <h3>${block.title}</h3>
                    <p>${block.content}</p>
                `;
                break;
            case 'hero':
                div.innerHTML = `
                    <h1>${block.title}</h1>
                    <p style="font-size: 1.2em; margin-top: 10px;">${block.content}</p>
                `;
                break;
            case 'features':
                div.innerHTML = `
                    <h3>${block.title}</h3>
                    <div class="features-grid">
                        ${block.features.map(feature => `
                            <div class="feature-item">
                                <h4>${feature.title}</h4>
                                <p>${feature.content}</p>
                            </div>
                        `).join('')}
                    </div>
                `;
                break;
            case 'cta':
                div.innerHTML = `
                    <h3>${block.title}</h3>
                    <p>${block.content}</p>
                    <button style="margin-top: 15px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Узнать больше
                    </button>
                `;
                break;
        }

        div.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectBlock(block);
        });

        return div;
    }

    selectBlock(block) {
        this.currentBlock = block;
        
        // Подсветка выбранного блока
        document.querySelectorAll('.content-block').forEach(b => {
            b.classList.remove('selected');
        });
        document.querySelector(`[data-block-id="${block.id}"]`).classList.add('selected');

        this.showEditor(block);
    }

    showEditor(block) {
        const editorPanel = document.getElementById('editorPanel');
        const editorContent = document.getElementById('editorContent');
        
        document.getElementById('editorTitle').textContent = `Редактирование: ${this.getBlockTypeName(block.type)}`;

        editorContent.innerHTML = this.getEditorForm(block);
        editorPanel.classList.add('active');

        // Назначаем обработчики для формы
        this.setupFormHandlers(block);
    }

    getBlockTypeName(type) {
        const names = {
            'text': 'Текстовый блок',
            'image': 'Блок с изображением',
            'hero': 'Герой-блок',
            'features': 'Блок особенностей',
            'cta': 'Призыв к действию'
        };
        return names[type] || 'Блок';
    }

    getEditorForm(block) {
        switch (block.type) {
            case 'text':
            case 'image':
            case 'hero':
            case 'cta':
                return `
                    <div class="form-group">
                        <label>Заголовок:</label>
                        <input type="text" id="editTitle" value="${block.title || ''}">
                    </div>
                    <div class="form-group">
                        <label>Описание:</label>
                        <textarea id="editContent">${block.content || ''}</textarea>
                    </div>
                    ${block.type === 'image' ? `
                    <div class="form-group">
                        <label>URL изображения:</label>
                        <input type="text" id="editImage" value="${block.image || ''}">
                    </div>
                    ` : ''}
                    <div class="form-actions">
                        <button id="saveChanges" class="btn-primary">Сохранить</button>
                        <button id="deleteBlock" class="btn-secondary">Удалить блок</button>
                    </div>
                `;
            case 'features':
                return `
                    <div class="form-group">
                        <label>Заголовок блока:</label>
                        <input type="text" id="editTitle" value="${block.title || ''}">
                    </div>
                    ${block.features.map((feature, index) => `
                        <div class="form-group">
                            <label>Особенность ${index + 1}:</label>
                            <input type="text" value="${feature.title}" placeholder="Заголовок" onchange="pageEditor.updateFeature(${block.id}, ${index}, 'title', this.value)">
                            <textarea placeholder="Описание" onchange="pageEditor.updateFeature(${block.id}, ${index}, 'content', this.value)">${feature.content}</textarea>
                        </div>
                    `).join('')}
                    <div class="form-actions">
                        <button onclick="pageEditor.addFeature(${block.id})" class="btn-primary">+ Добавить особенность</button>
                        <button id="saveChanges" class="btn-primary">Сохранить</button>
                        <button id="deleteBlock" class="btn-secondary">Удалить блок</button>
                    </div>
                `;
        }
    }

    setupFormHandlers(block) {
        document.getElementById('saveChanges')?.addEventListener('click', () => {
            this.saveBlockChanges(block);
        });

        document.getElementById('deleteBlock')?.addEventListener('click', () => {
            this.deleteBlock(block);
        });
    }

    saveBlockChanges(block) {
        const title = document.getElementById('editTitle')?.value;
        const content = document.getElementById('editContent')?.value;
        const image = document.getElementById('editImage')?.value;

        if (title !== undefined) block.title = title;
        if (content !== undefined) block.content = content;
        if (image !== undefined) block.image = image;

        this.saveToStorage();
        this.renderBlocks();
        this.hideEditor();
    }

    updateFeature(blockId, featureIndex, field, value) {
        const block = this.blocks.find(b => b.id === blockId);
        if (block && block.features) {
            block.features[featureIndex][field] = value;
            this.saveToStorage();
        }
    }

    addFeature(blockId) {
        const block = this.blocks.find(b => b.id === blockId);
        if (block && block.features) {
            block.features.push({ title: 'Новая особенность', content: 'Описание' });
            this.saveToStorage();
            this.showEditor(block);
        }
    }

    deleteBlock(block) {
        if (confirm('Удалить этот блок?')) {
            this.blocks = this.blocks.filter(b => b.id !== block.id);
            this.saveToStorage();
            this.renderBlocks();
            this.hideEditor();
        }
    }

    showAddBlockModal() {
        document.getElementById('addBlockModal').classList.add('active');
        this.updateBlockPreview('text');
    }

    hideAddBlockModal() {
        document.getElementById('addBlockModal').classList.remove('active');
    }

    updateBlockPreview(type) {
        const preview = document.getElementById('blockPreviewContent');
        const demoData = {
            text: { title: 'Новый текстовый блок', content: 'Описание блока' },
            image: { title: 'Блок с изображением', content: 'Описание изображения' },
            hero: { title: 'Главный заголовок', content: 'Подзаголовок или описание' },
            features: { title: 'Наши особенности' },
            cta: { title: 'Призыв к действию', content: 'Описание призыва' }
        };

        const data = demoData[type];
        preview.innerHTML = this.createBlockElement({
            id: 'preview',
            type: type,
            ...data,
            features: type === 'features' ? [
                { title: 'Особенность 1', content: 'Описание' },
                { title: 'Особенность 2', content: 'Описание' }
            ] : []
        }).innerHTML;
    }

    addNewBlock() {
        const type = document.getElementById('blockType').value;
        const position = document.getElementById('blockPosition').value;

        const newBlock = {
            id: Date.now(),
            type: type,
            title: 'Новый блок',
            content: 'Описание блока',
            image: '',
            features: type === 'features' ? [
                { title: 'Особенность 1', content: 'Описание' }
            ] : []
        };

        if (position === 'start') {
            this.blocks.unshift(newBlock);
        } else if (position === 'end') {
            this.blocks.push(newBlock);
        } else {
            // Для before/after нужно выбрать блок
            this.blocks.push(newBlock);
        }

        this.saveToStorage();
        this.renderBlocks();
        this.hideAddBlockModal();
    }

    hideEditor() {
        document.getElementById('editorPanel').classList.remove('active');
        document.querySelectorAll('.content-block').forEach(b => {
            b.classList.remove('selected');
        });
        this.currentBlock = null;
    }

    saveToStorage() {
        localStorage.setItem('page-blocks', JSON.stringify(this.blocks));
    }
}

// Инициализация редактора
const pageEditor = new PageEditor();

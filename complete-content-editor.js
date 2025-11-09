// COMPLETE CONTENT EDITOR - Edit EVERYTHING on the page
(function() {
    'use strict';
    
    console.log('🎨 COMPLETE CONTENT EDITOR - Loading full page editing...');
    
    const CompleteEditor = {
        // Complete data schema for EVERY element
        editableElements: {
            // Hero Section
            '#home h1': { type: 'text', field: 'hero.title', label: 'Главный заголовок' },
            '#home p': { type: 'textarea', field: 'hero.description', label: 'Описание под заголовком' },
            '.cta-button': { type: 'text', field: 'hero.buttonText', label: 'Текст кнопки' },
            '.hero-img': { type: 'image', field: 'hero.image', label: 'Изображение в герое' },
            
            // About Section
            '#about .section-title': { type: 'text', field: 'about.title', label: 'Заголовок "О нас"' },
            '.about-text p': { type: 'textarea', field: 'about.description', label: 'Описание компании' },
            '.about-img': { type: 'image', field: 'about.image', label: 'Изображение о компании' },
            
            // Stats Blocks
            '.stat:nth-child(1) h3': { type: 'text', field: 'about.stats[0].value', label: 'Статистика 1 - значение' },
            '.stat:nth-child(1) p': { type: 'text', field: 'about.stats[0].label', label: 'Статистика 1 - подпись' },
            '.stat:nth-child(2) h3': { type: 'text', field: 'about.stats[1].value', label: 'Статистика 2 - значение' },
            '.stat:nth-child(2) p': { type: 'text', field: 'about.stats[1].label', label: 'Статистика 2 - подпись' },
            '.stat:nth-child(3) h3': { type: 'text', field: 'about.stats[2].value', label: 'Статистика 3 - значение' },
            '.stat:nth-child(3) p': { type: 'text', field: 'about.stats[2].label', label: 'Статистика 3 - подпись' },
            
            // Services Section
            '#services .section-title': { type: 'text', field: 'services.title', label: 'Заголовок "Услуги"' },
            
            // Service Cards
            '.service-card:nth-child(1) .service-icon i': { type: 'icon', field: 'services.services[0].icon', label: 'Услуга 1 - иконка' },
            '.service-card:nth-child(1) h3': { type: 'text', field: 'services.services[0].title', label: 'Услуга 1 - название' },
            '.service-card:nth-child(1) p': { type: 'textarea', field: 'services.services[0].description', label: 'Услуга 1 - описание' },
            
            '.service-card:nth-child(2) .service-icon i': { type: 'icon', field: 'services.services[1].icon', label: 'Услуга 2 - иконка' },
            '.service-card:nth-child(2) h3': { type: 'text', field: 'services.services[1].title', label: 'Услуга 2 - название' },
            '.service-card:nth-child(2) p': { type: 'textarea', field: 'services.services[1].description', label: 'Услуга 2 - описание' },
            
            '.service-card:nth-child(3) .service-icon i': { type: 'icon', field: 'services.services[2].icon', label: 'Услуга 3 - иконка' },
            '.service-card:nth-child(3) h3': { type: 'text', field: 'services.services[2].title', label: 'Услуга 3 - название' },
            '.service-card:nth-child(3) p': { type: 'textarea', field: 'services.services[2].description', label: 'Услуга 3 - описание' },
            
            // Destinations Section
            '#destinations .section-title': { type: 'text', field: 'destinations.title', label: 'Заголовок "Направления"' },
            '.destinations .section-subtitle': { type: 'textarea', field: 'destinations.subtitle', label: 'Подзаголовок направлений' },
            
            // Contact Section
            '#contact .section-title': { type: 'text', field: 'contact.title', label: 'Заголовок "Контакты"' },
            
            // Contact Info
            '.contact-info .contact-item:nth-child(1) p': { type: 'text', field: 'contacts.phone', label: 'Телефон' },
            '.contact-info .contact-item:nth-child(2) p': { type: 'text', field: 'contacts.email', label: 'Email' },
            '.contact-info .contact-item:nth-child(3) p': { type: 'text', field: 'contacts.address', label: 'Адрес' },
            '.contact-info .contact-item:nth-child(4) p': { type: 'text', field: 'contacts.hours', label: 'Часы работы' },
            
            // Footer
            '.footer-section:first-child p': { type: 'textarea', field: 'footer.description', label: 'Описание в футере' },
            '.footer-bottom p': { type: 'text', field: 'footer.copyright', label: 'Копирайт' },
            
            // Footer Contacts
            '.footer-phone': { type: 'text', field: 'contacts.phone', label: 'Телефон в футере' },
            '.footer-email': { type: 'text', field: 'contacts.email', label: 'Email в футере' },
            '.footer-address': { type: 'text', field: 'contacts.address', label: 'Адрес в футере' },
            '.footer-hours': { type: 'text', field: 'contacts.hours', label: 'Часы работы в футере' }
        },
        
        init: function() {
            console.log('🎯 Initializing Complete Content Editor...');
            
            this.createEditorUI();
            this.setupEditMode();
            this.loadAllContent();
            this.setupAutoSave();
            
            console.log('✅ Complete Editor Ready - You can edit EVERYTHING!');
        },
        
        // Create comprehensive editor interface
        createEditorUI: function() {
            const editorHTML = `
                <div id="complete-editor" style="
                    position: fixed;
                    top: 0;
                    right: -400px;
                    width: 400px;
                    height: 100vh;
                    background: white;
                    box-shadow: -5px 0 15px rgba(0,0,0,0.1);
                    z-index: 10000;
                    transition: right 0.3s ease;
                    overflow-y: auto;
                    padding: 20px;
                    border-left: 3px solid #2c5aa0;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #e9ecef;">
                        <h3 style="color: #2c5aa0; margin: 0;">🎨 Редактор всей страницы</h3>
                        <button onclick="CompleteEditor.hideEditor()" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #666;">×</button>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <input type="text" id="editor-search" placeholder="🔍 Поиск элементов..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                    </div>
                    
                    <div id="editor-sections" style="display: flex; flex-direction: column; gap: 10px;">
                        <!-- Sections will be generated here -->
                    </div>
                    
                    <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #e9ecef;">
                        <button onclick="CompleteEditor.saveAll()" style="background: #28a745; color: white; border: none; padding: 12px 20px; border-radius: 5px; cursor: pointer; width: 100%; font-size: 16px;">
                            💾 Сохранить все изменения
                        </button>
                    </div>
                </div>
                
                <div id="edit-mode-toggle" style="
                    position: fixed;
                    top: 50%;
                    right: 0;
                    background: #2c5aa0;
                    color: white;
                    padding: 10px 15px;
                    border-radius: 5px 0 0 5px;
                    cursor: pointer;
                    z-index: 9999;
                    transform: translateY(-50%);
                    box-shadow: -2px 0 10px rgba(0,0,0,0.2);
                ">
                    🎨 Редактировать
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', editorHTML);
            this.generateEditorSections();
        },
        
        // Generate editor sections based on page structure
        generateEditorSections: function() {
            const sectionsContainer = document.getElementById('editor-sections');
            const sections = {
                'hero': 'Главный баннер',
                'about': 'О компании',
                'services': 'Услуги', 
                'destinations': 'Направления',
                'contact': 'Контакты',
                'footer': 'Футер'
            };
            
            for (const [sectionKey, sectionName] of Object.entries(sections)) {
                const sectionHTML = `
                    <div class="editor-section" data-section="${sectionKey}">
                        <div style="background: #f8f9fa; padding: 10px 15px; border-radius: 5px; cursor: pointer; border-left: 3px solid #2c5aa0;">
                            <strong>${sectionName}</strong>
                            <span style="float: right;">▶</span>
                        </div>
                        <div class="section-fields" style="display: none; padding: 15px; background: #fafafa; border-radius: 0 0 5px 5px;">
                            <!-- Fields will be populated here -->
                        </div>
                    </div>
                `;
                sectionsContainer.insertAdjacentHTML('beforeend', sectionHTML);
            }
            
            // Setup section toggles
            document.querySelectorAll('.editor-section').forEach(section => {
                const header = section.querySelector('div:first-child');
                const fields = section.querySelector('.section-fields');
                
                header.addEventListener('click', () => {
                    const isVisible = fields.style.display !== 'none';
                    fields.style.display = isVisible ? 'none' : 'block';
                    header.querySelector('span').textContent = isVisible ? '▶' : '▼';
                    
                    if (!isVisible) {
                        this.populateSectionFields(section.getAttribute('data-section'), fields);
                    }
                });
            });
        },
        
        // Populate fields for a section
        populateSectionFields: function(sectionKey, container) {
            // Clear existing fields
            container.innerHTML = '';
            
            // Get all fields for this section
            const sectionFields = Object.entries(this.editableElements)
                .filter(([selector, config]) => config.field.startsWith(sectionKey))
                .sort((a, b) => a[1].label.localeCompare(b[1].label));
            
            if (sectionFields.length === 0) {
                container.innerHTML = '<p style="color: #666; text-align: center;">Нет элементов для редактирования</p>';
                return;
            }
            
            sectionFields.forEach(([selector, config]) => {
                const currentValue = this.getElementValue(selector);
                const fieldId = `edit-${selector.replace(/[^a-zA-Z0-9]/g, '-')}`;
                
                let fieldHTML = '';
                
                switch(config.type) {
                    case 'text':
                        fieldHTML = `
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #333;">${config.label}</label>
                                <input type="text" 
                                       id="${fieldId}" 
                                       value="${currentValue || ''}" 
                                       data-selector="${selector}"
                                       data-field="${config.field}"
                                       style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                            </div>
                        `;
                        break;
                        
                    case 'textarea':
                        fieldHTML = `
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #333;">${config.label}</label>
                                <textarea 
                                    id="${fieldId}" 
                                    data-selector="${selector}"
                                    data-field="${config.field}"
                                    style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; min-height: 80px; resize: vertical;"
                                >${currentValue || ''}</textarea>
                            </div>
                        `;
                        break;
                        
                    case 'icon':
                        fieldHTML = `
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #333;">${config.label}</label>
                                <input type="text" 
                                       id="${fieldId}" 
                                       value="${currentValue || ''}" 
                                       data-selector="${selector}"
                                       data-field="${config.field}"
                                       placeholder="fas fa-icon-name"
                                       style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                                <small style="color: #666; font-size: 12px;">Используйте классы FontAwesome, например: fas fa-plane</small>
                            </div>
                        `;
                        break;
                        
                    case 'image':
                        fieldHTML = `
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #333;">${config.label}</label>
                                <input type="text" 
                                       id="${fieldId}" 
                                       value="${currentValue || ''}" 
                                       data-selector="${selector}"
                                       data-field="${config.field}"
                                       placeholder="https://example.com/image.jpg"
                                       style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                                <button type="button" onclick="CompleteEditor.uploadImage('${fieldId}')" style="background: #17a2b8; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-top: 5px; font-size: 12px;">
                                    📁 Загрузить изображение
                                </button>
                            </div>
                        `;
                        break;
                }
                
                container.insertAdjacentHTML('beforeend', fieldHTML);
            });
            
            // Setup auto-save for fields
            container.querySelectorAll('input, textarea').forEach(field => {
                field.addEventListener('input', this.debounce(() => {
                    this.saveField(field);
                }, 1000));
            });
        },
        
        // Get current value of an element
        getElementValue: function(selector) {
            const element = document.querySelector(selector);
            if (!element) return '';
            
            if (selector.includes(' i')) {
                // For icons, get the class
                return element.className || '';
            } else if (element.tagName === 'IMG') {
                // For images, get the src
                return element.src || '';
            } else {
                // For text content
                return element.textContent || element.value || '';
            }
        },
        
        // Setup edit mode with visual indicators
        setupEditMode: function() {
            const toggle = document.getElementById('edit-mode-toggle');
            const editor = document.getElementById('complete-editor');
            
            toggle.addEventListener('click', () => {
                const isVisible = editor.style.right === '0px';
                
                if (isVisible) {
                    this.hideEditor();
                } else {
                    this.showEditor();
                }
            });
            
            // Add edit indicators to all editable elements
            this.addEditIndicators();
        },
        
        // Show editor panel
        showEditor: function() {
            document.getElementById('complete-editor').style.right = '0px';
            document.getElementById('edit-mode-toggle').textContent = '✕ Закрыть';
            this.highlightEditableElements();
        },
        
        // Hide editor panel
        hideEditor: function() {
            document.getElementById('complete-editor').style.right = '-400px';
            document.getElementById('edit-mode-toggle').textContent = '🎨 Редактировать';
            this.removeEditHighlights();
        },
        
        // Add visual indicators to editable elements
        addEditIndicators: function() {
            Object.keys(this.editableElements).forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    element.style.transition = 'all 0.3s ease';
                    element.setAttribute('data-editable', 'true');
                    
                    element.addEventListener('mouseenter', () => {
                        if (document.getElementById('complete-editor').style.right === '0px') {
                            element.style.outline = '2px dashed #2c5aa0';
                            element.style.outlineOffset = '2px';
                            element.style.cursor = 'pointer';
                        }
                    });
                    
                    element.addEventListener('mouseleave', () => {
                        element.style.outline = 'none';
                    });
                    
                    element.addEventListener('click', (e) => {
                        if (document.getElementById('complete-editor').style.right === '0px') {
                            e.preventDefault();
                            e.stopPropagation();
                            this.focusField(selector);
                        }
                    });
                });
            });
        },
        
        // Highlight all editable elements
        highlightEditableElements: function() {
            document.querySelectorAll('[data-editable="true"]').forEach(element => {
                element.style.outline = '2px dashed #ffc107';
                element.style.outlineOffset = '2px';
                element.style.cursor = 'pointer';
            });
        },
        
        // Remove highlights
        removeEditHighlights: function() {
            document.querySelectorAll('[data-editable="true"]').forEach(element => {
                element.style.outline = 'none';
                element.style.cursor = 'default';
            });
        },
        
        // Focus on specific field in editor
        focusField: function(selector) {
            const fieldId = `edit-${selector.replace(/[^a-zA-Z0-9]/g, '-')}`;
            const field = document.getElementById(fieldId);
            
            if (field) {
                // Open relevant section
                const config = this.editableElements[selector];
                const sectionKey = config.field.split('.')[0];
                const section = document.querySelector(`[data-section="${sectionKey}"]`);
                
                if (section) {
                    const header = section.querySelector('div:first-child');
                    const fields = section.querySelector('.section-fields');
                    
                    if (fields.style.display === 'none') {
                        fields.style.display = 'block';
                        header.querySelector('span').textContent = '▼';
                        this.populateSectionFields(sectionKey, fields);
                    }
                    
                    // Scroll to field and focus
                    field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    field.focus();
                    
                    // Highlight the field
                    field.style.borderColor = '#2c5aa0';
                    field.style.boxShadow = '0 0 0 2px rgba(44, 90, 160, 0.2)';
                    setTimeout(() => {
                        field.style.borderColor = '#ddd';
                        field.style.boxShadow = 'none';
                    }, 2000);
                }
            }
        },
        
        // Save individual field
        saveField: function(field) {
            const selector = field.getAttribute('data-selector');
            const fieldPath = field.getAttribute('data-field');
            const value = field.value;
            
            console.log('💾 Saving field:', fieldPath, value);
            
            // Update DOM immediately
            this.updateElement(selector, value);
            
            // Save to data system
            this.saveToDataSystem(fieldPath, value);
        },
        
        // Update element in DOM
        updateElement: function(selector, value) {
            const elements = document.querySelectorAll(selector);
            
            elements.forEach(element => {
                if (selector.includes(' i')) {
                    // Update icon class
                    element.className = value;
                } else if (element.tagName === 'IMG') {
                    // Update image src
                    element.src = value;
                } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    // Update form field value
                    element.value = value;
                } else {
                    // Update text content
                    element.textContent = value;
                }
            });
        },
        
        // Save to data system
        saveToDataSystem: function(fieldPath, value) {
            // Parse field path (e.g., 'hero.title' or 'services.services[0].icon')
            const path = fieldPath.split('.');
            let current = window.UniversalData.getCompleteData();
            
            // Navigate to the correct nested property
            for (let i = 0; i < path.length - 1; i++) {
                const key = path[i];
                
                // Handle array indices like services[0]
                const arrayMatch = key.match(/(\w+)\[(\d+)\]/);
                if (arrayMatch) {
                    const arrayName = arrayMatch[1];
                    const index = parseInt(arrayMatch[2]);
                    
                    if (!current[arrayName]) current[arrayName] = [];
                    if (!current[arrayName][index]) current[arrayName][index] = {};
                    current = current[arrayName][index];
                } else {
                    if (!current[key]) current[key] = {};
                    current = current[key];
                }
            }
            
            // Set the value
            const lastKey = path[path.length - 1];
            current[lastKey] = value;
            
            // Save complete data
            window.UniversalData.saveCompleteData(window.UniversalData.getCompleteData());
        },
        
        // Load all content from data system
        loadAllContent: function() {
            const data = window.UniversalData.getCompleteData();
            
            Object.entries(this.editableElements).forEach(([selector, config]) => {
                const value = this.getValueFromData(data, config.field);
                if (value) {
                    this.updateElement(selector, value);
                }
            });
            
            console.log('📊 All content loaded from data system');
        },
        
        // Get value from data object using path
        getValueFromData: function(data, path) {
            const keys = path.split('.');
            let current = data;
            
            for (const key of keys) {
                const arrayMatch = key.match(/(\w+)\[(\d+)\]/);
                if (arrayMatch) {
                    const arrayName = arrayMatch[1];
                    const index = parseInt(arrayMatch[2]);
                    current = current[arrayName] && current[arrayName][index];
                } else {
                    current = current[key];
                }
                
                if (current === undefined) return null;
            }
            
            return current;
        },
        
        // Save all changes
        saveAll: function() {
            console.log('💾 Saving ALL changes...');
            
            // Trigger save for all fields
            document.querySelectorAll('#complete-editor input, #complete-editor textarea').forEach(field => {
                this.saveField(field);
            });
            
            alert('✅ Все изменения сохранены на главной странице!');
        },
        
        // Image upload handler
        uploadImage: function(fieldId) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        document.getElementById(fieldId).value = e.target.result;
                        this.saveField(document.getElementById(fieldId));
                    };
                    reader.readAsDataURL(file);
                }
            };
            
            input.click();
        },
        
        // Setup auto-save
        setupAutoSave: function() {
            // Auto-save every 30 seconds
            setInterval(() => {
                if (document.getElementById('complete-editor').style.right === '0px') {
                    this.saveAll();
                }
            }, 30000);
        },
        
        // Debounce utility
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    };
    
    // Initialize when universal system is ready
    const initCompleteEditor = () => {
        if (window.UniversalData) {
            CompleteEditor.init();
        } else {
            setTimeout(initCompleteEditor, 100);
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCompleteEditor);
    } else {
        initCompleteEditor();
    }
    
    // Global access
    window.CompleteEditor = CompleteEditor;
    
    console.log('🎉 COMPLETE CONTENT EDITOR LOADED');
    console.log('💡 You can now edit EVERYTHING on the page!');
    
})();

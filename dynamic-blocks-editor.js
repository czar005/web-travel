// DYNAMIC BLOCKS EDITOR - Manage cards, stats, services with full CRUD
(function() {
    'use strict';
    
    console.log('🔄 DYNAMIC BLOCKS EDITOR - Loading card management...');
    
    const DynamicBlocksEditor = {
        // Templates for dynamic blocks
        templates: {
            stat: `
                <div class="stat" style="text-align: center; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h3 style="font-size: 2.5em; color: #2c5aa0; margin-bottom: 10px;">0</h3>
                    <p style="color: #666; margin: 0;">Новая статистика</p>
                </div>
            `,
            service: `
                <div class="service-card" style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); text-align: center; transition: transform 0.3s ease;">
                    <div class="service-icon" style="font-size: 3em; color: #2c5aa0; margin-bottom: 20px;">
                        <i class="fas fa-star"></i>
                    </div>
                    <h3 style="color: #333; margin-bottom: 15px;">Новая услуга</h3>
                    <p style="color: #666; line-height: 1.6;">Описание новой услуги</p>
                </div>
            `,
            country: `
                <div class="country-card" style="background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                    <div style="height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5em;">
                        <i class="fas fa-globe-americas"></i>
                    </div>
                    <div style="padding: 20px;">
                        <h4 style="margin: 0 0 10px 0; color: #333;">Новая страна</h4>
                        <p style="color: #666; margin: 0 0 15px 0; line-height: 1.5;">Описание страны</p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: #2c5aa0; font-weight: bold;">от $500</span>
                            <span style="background: #e3f2fd; color: #2c5aa0; padding: 5px 10px; border-radius: 15px; font-size: 0.8em;">0 туров</span>
                        </div>
                    </div>
                </div>
            `
        },
        
        init: function() {
            console.log('🎯 Initializing Dynamic Blocks Editor...');
            
            this.integrateWithCompleteEditor();
            this.addDynamicBlocksUI();
            this.setupCardManagement();
            
            console.log('✅ Dynamic Blocks Editor Ready');
        },
        
        // Integrate with complete editor
        integrateWithCompleteEditor: function() {
            if (!window.CompleteEditor) {
                setTimeout(() => this.integrateWithCompleteEditor(), 100);
                return;
            }
            
            // Extend editable elements with dynamic blocks
            Object.assign(window.CompleteEditor.editableElements, {
                // Stats management
                '.stats': { type: 'dynamic-stats', field: 'about.stats', label: 'Блок статистики' },
                
                // Services management  
                '.services-grid': { type: 'dynamic-services', field: 'services.services', label: 'Карточки услуг' },
                
                // Countries management
                '.destinations-grid': { type: 'dynamic-countries', field: 'countries', label: 'Страны и направления' }
            });
            
            // Override field population for dynamic blocks
            const originalPopulate = window.CompleteEditor.populateSectionFields;
            window.CompleteEditor.populateSectionFields = function(sectionKey, container) {
                originalPopulate.call(this, sectionKey, container);
                DynamicBlocksEditor.addDynamicBlocksToSection(sectionKey, container);
            };
            
            console.log('🔗 Integrated with Complete Editor');
        },
        
        // Add dynamic blocks UI to editor
        addDynamicBlocksUI: function() {
            const editor = document.getElementById('complete-editor');
            if (!editor) return;
            
            const dynamicHTML = `
                <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e9ecef;">
                    <h4 style="color: #2c5aa0; margin-bottom: 15px;">🔄 Управление блоками</h4>
                    
                    <!-- Stats Management -->
                    <div class="dynamic-block" data-type="stats" style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                        <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
                            <strong>📊 Статистика</strong>
                            <button onclick="DynamicBlocksEditor.addBlock('stat')" style="background: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                                + Добавить
                            </button>
                        </div>
                        <div id="stats-management" style="display: flex; flex-direction: column; gap: 10px;">
                            <!-- Stats will be populated here -->
                        </div>
                    </div>
                    
                    <!-- Services Management -->
                    <div class="dynamic-block" data-type="services" style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                        <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
                            <strong>🎯 Услуги</strong>
                            <button onclick="DynamicBlocksEditor.addBlock('service')" style="background: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                                + Добавить
                            </button>
                        </div>
                        <div id="services-management" style="display: flex; flex-direction: column; gap: 10px;">
                            <!-- Services will be populated here -->
                        </div>
                    </div>
                    
                    <!-- Countries Management -->
                    <div class="dynamic-block" data-type="countries" style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                        <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
                            <strong>🌍 Страны</strong>
                            <button onclick="DynamicBlocksEditor.addBlock('country')" style="background: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                                + Добавить
                            </button>
                        </div>
                        <div id="countries-management" style="display: flex; flex-direction: column; gap: 10px;">
                            <!-- Countries will be populated here -->
                        </div>
                    </div>
                </div>
            `;
            
            editor.querySelector('#editor-sections').insertAdjacentHTML('afterend', dynamicHTML);
        },
        
        // Add dynamic blocks to specific sections
        addDynamicBlocksToSection: function(sectionKey, container) {
            // Add stats management to about section
            if (sectionKey === 'about') {
                const statsHTML = `
                    <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #2c5aa0;">
                        <h5 style="margin: 0 0 10px 0; color: #2c5aa0;">📊 Управление статистикой</h5>
                        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                            <button onclick="DynamicBlocksEditor.addBlock('stat')" style="background: #28a745; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-size: 14px;">
                                + Добавить статистику
                            </button>
                            <button onclick="DynamicBlocksEditor.manageBlocks('stats')" style="background: #17a2b8; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-size: 14px;">
                                🛠️ Управление
                            </button>
                        </div>
                        <small style="color: #666;">Добавляйте, редактируйте и удаляйте блоки статистики</small>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', statsHTML);
            }
            
            // Add services management to services section
            if (sectionKey === 'services') {
                const servicesHTML = `
                    <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #2c5aa0;">
                        <h5 style="margin: 0 0 10px 0; color: #2c5aa0;">🎯 Управление услугами</h5>
                        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                            <button onclick="DynamicBlocksEditor.addBlock('service')" style="background: #28a745; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-size: 14px;">
                                + Добавить услугу
                            </button>
                            <button onclick="DynamicBlocksEditor.manageBlocks('services')" style="background: #17a2b8; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-size: 14px;">
                                🛠️ Управление
                            </button>
                        </div>
                        <small style="color: #666;">Добавляйте, редактируйте и удаляйте карточки услуг</small>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', servicesHTML);
            }
        },
        
        // Setup card management
        setupCardManagement: function() {
            this.loadExistingBlocks();
            this.setupDragAndDrop();
        },
        
        // Load existing blocks from data
        loadExistingBlocks: function() {
            const data = window.UniversalData.getCompleteData();
            
            // Load stats
            if (data.content?.about?.stats) {
                this.populateBlocksManagement('stats', data.content.about.stats);
            }
            
            // Load services
            if (data.content?.services?.services) {
                this.populateBlocksManagement('services', data.content.services.services);
            }
            
            // Load countries
            if (data.countries) {
                this.populateBlocksManagement('countries', data.countries);
            }
        },
        
        // Populate blocks management UI
        populateBlocksManagement: function(type, items) {
            const container = document.getElementById(`${type}-management`);
            if (!container) return;
            
            container.innerHTML = '';
            
            if (!items || items.length === 0) {
                container.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">Блоки не добавлены</p>';
                return;
            }
            
            items.forEach((item, index) => {
                const blockHTML = this.createBlockManagementHTML(type, item, index);
                container.insertAdjacentHTML('beforeend', blockHTML);
            });
        },
        
        // Create block management HTML
        createBlockManagementHTML: function(type, item, index) {
            let title = '', content = '';
            
            switch(type) {
                case 'stats':
                    title = `Статистика ${index + 1}: ${item.value || '0'} ${item.label || ''}`;
                    content = `
                        <input type="text" 
                               value="${item.value || ''}" 
                               placeholder="Значение"
                               oninput="DynamicBlocksEditor.updateBlock('stats', ${index}, 'value', this.value)"
                               style="width: 80px; padding: 5px; border: 1px solid #ddd; border-radius: 3px; margin-right: 5px;">
                        <input type="text"
                               value="${item.label || ''}"
                               placeholder="Подпись" 
                               oninput="DynamicBlocksEditor.updateBlock('stats', ${index}, 'label', this.value)"
                               style="flex: 1; padding: 5px; border: 1px solid #ddd; border-radius: 3px;">
                    `;
                    break;
                    
                case 'services':
                    title = `Услуга ${index + 1}: ${item.title || 'Новая услуга'}`;
                    content = `
                        <div style="display: grid; grid-template-columns: 1fr 2fr auto; gap: 5px; margin-bottom: 5px;">
                            <input type="text"
                                   value="${item.icon || 'fas fa-star'}"
                                   placeholder="Иконка"
                                   oninput="DynamicBlocksEditor.updateBlock('services', ${index}, 'icon', this.value)"
                                   style="padding: 5px; border: 1px solid #ddd; border-radius: 3px;">
                            <input type="text"
                                   value="${item.title || ''}"
                                   placeholder="Название"
                                   oninput="DynamicBlocksEditor.updateBlock('services', ${index}, 'title', this.value)" 
                                   style="padding: 5px; border: 1px solid #ddd; border-radius: 3px;">
                        </div>
                        <textarea
                            oninput="DynamicBlocksEditor.updateBlock('services', ${index}, 'description', this.value)"
                            placeholder="Описание услуги"
                            style="width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 3px; min-height: 60px; resize: vertical;"
                        >${item.description || ''}</textarea>
                    `;
                    break;
                    
                case 'countries':
                    title = `Страна ${index + 1}: ${item.name || 'Новая страна'}`;
                    content = `
                        <input type="text"
                               value="${item.name || ''}"
                               placeholder="Название страны"
                               oninput="DynamicBlocksEditor.updateBlock('countries', ${index}, 'name', this.value)"
                               style="width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 3px; margin-bottom: 5px;">
                        <textarea
                            oninput="DynamicBlocksEditor.updateBlock('countries', ${index}, 'description', this.value)"
                            placeholder="Описание страны"
                            style="width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 3px; min-height: 60px; resize: vertical; margin-bottom: 5px;"
                        >${item.description || ''}</textarea>
                        <input type="text"
                               value="${item.price || ''}"
                               placeholder="Цена от"
                               oninput="DynamicBlocksEditor.updateBlock('countries', ${index}, 'price', this.value)"
                               style="width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 3px;">
                    `;
                    break;
            }
            
            return `
                <div class="block-item" data-type="${type}" data-index="${index}" style="background: white; padding: 10px; border-radius: 5px; border: 1px solid #e9ecef;">
                    <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 8px;">
                        <strong style="flex: 1; font-size: 14px;">${title}</strong>
                        <div>
                            <button onclick="DynamicBlocksEditor.moveBlock('${type}', ${index}, -1)" style="background: #6c757d; color: white; border: none; padding: 3px 6px; border-radius: 3px; cursor: pointer; font-size: 10px; margin-right: 3px;" title="Вверх">↑</button>
                            <button onclick="DynamicBlocksEditor.moveBlock('${type}', ${index}, 1)" style="background: #6c757d; color: white; border: none; padding: 3px 6px; border-radius: 3px; cursor: pointer; font-size: 10px; margin-right: 3px;" title="Вниз">↓</button>
                            <button onclick="DynamicBlocksEditor.removeBlock('${type}', ${index})" style="background: #dc3545; color: white; border: none; padding: 3px 6px; border-radius: 3px; cursor: pointer; font-size: 10px;" title="Удалить">×</button>
                        </div>
                    </div>
                    <div>
                        ${content}
                    </div>
                </div>
            `;
        },
        
        // Add new block
        addBlock: function(type) {
            const data = window.UniversalData.getCompleteData();
            const newBlock = this.getDefaultBlock(type);
            
            switch(type) {
                case 'stats':
                    if (!data.content.about.stats) data.content.about.stats = [];
                    data.content.about.stats.push(newBlock);
                    break;
                    
                case 'services':
                    if (!data.content.services.services) data.content.services.services = [];
                    data.content.services.services.push(newBlock);
                    break;
                    
                case 'countries':
                    if (!data.countries) data.countries = [];
                    data.countries.push(newBlock);
                    break;
            }
            
            window.UniversalData.saveCompleteData(data);
            this.loadExistingBlocks();
            this.updateDOM();
            
            console.log(`✅ Added new ${type} block`);
        },
        
        // Get default block structure
        getDefaultBlock: function(type) {
            switch(type) {
                case 'stats':
                    return { value: '0', label: 'Новая статистика' };
                case 'services':
                    return { 
                        icon: 'fas fa-star', 
                        title: 'Новая услуга', 
                        description: 'Описание новой услуги' 
                    };
                case 'countries':
                    return {
                        name: 'Новая страна',
                        description: 'Описание страны',
                        price: 'от $500',
                        tours: []
                    };
                default:
                    return {};
            }
        },
        
        // Update block data
        updateBlock: function(type, index, field, value) {
            const data = window.UniversalData.getCompleteData();
            
            let array;
            switch(type) {
                case 'stats': array = data.content.about.stats; break;
                case 'services': array = data.content.services.services; break;
                case 'countries': array = data.countries; break;
            }
            
            if (array && array[index]) {
                array[index][field] = value;
                window.UniversalData.saveCompleteData(data);
                this.updateDOM();
            }
        },
        
        // Remove block
        removeBlock: function(type, index) {
            if (!confirm('Удалить этот блок?')) return;
            
            const data = window.UniversalData.getCompleteData();
            
            let array;
            switch(type) {
                case 'stats': array = data.content.about.stats; break;
                case 'services': array = data.content.services.services; break;
                case 'countries': array = data.countries; break;
            }
            
            if (array && array[index]) {
                array.splice(index, 1);
                window.UniversalData.saveCompleteData(data);
                this.loadExistingBlocks();
                this.updateDOM();
                
                console.log(`🗑️ Removed ${type} block at index ${index}`);
            }
        },
        
        // Move block up/down
        moveBlock: function(type, index, direction) {
            const data = window.UniversalData.getCompleteData();
            
            let array;
            switch(type) {
                case 'stats': array = data.content.about.stats; break;
                case 'services': array = data.content.services.services; break;
                case 'countries': array = data.countries; break;
            }
            
            if (array && array[index] && array[index + direction]) {
                // Swap elements
                [array[index], array[index + direction]] = [array[index + direction], array[index]];
                window.UniversalData.saveCompleteData(data);
                this.loadExistingBlocks();
                this.updateDOM();
                
                console.log(`🔀 Moved ${type} block from ${index} to ${index + direction}`);
            }
        },
        
        // Manage blocks (open management panel)
        manageBlocks: function(type) {
            // Scroll to management section
            const managementSection = document.querySelector(`[data-type="${type}"]`);
            if (managementSection) {
                managementSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Highlight the section
                managementSection.style.border = '2px solid #2c5aa0';
                setTimeout(() => {
                    managementSection.style.border = 'none';
                }, 2000);
            }
        },
        
        // Update DOM with current data
        updateDOM: function() {
            const data = window.UniversalData.getCompleteData();
            
            // Update stats
            this.updateStatsDOM(data.content?.about?.stats);
            
            // Update services
            this.updateServicesDOM(data.content?.services?.services);
            
            // Update countries
            this.updateCountriesDOM(data.countries);
        },
        
        // Update stats in DOM
        updateStatsDOM: function(stats) {
            const container = document.querySelector('.stats');
            if (!container) return;
            
            if (!stats || stats.length === 0) {
                container.innerHTML = '';
                return;
            }
            
            let statsHTML = '';
            stats.forEach(stat => {
                statsHTML += `
                    <div class="stat" style="text-align: center; padding: 20px;">
                        <h3 style="font-size: 2.5em; color: #2c5aa0; margin-bottom: 10px;">${stat.value || '0'}</h3>
                        <p style="color: #666; margin: 0;">${stat.label || ''}</p>
                    </div>
                `;
            });
            
            container.innerHTML = statsHTML;
        },
        
        // Update services in DOM
        updateServicesDOM: function(services) {
            const container = document.querySelector('.services-grid');
            if (!container) return;
            
            if (!services || services.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Услуги не добавлены</p>';
                return;
            }
            
            let servicesHTML = '';
            services.forEach(service => {
                servicesHTML += `
                    <div class="service-card" style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); text-align: center; transition: transform 0.3s ease;">
                        <div class="service-icon" style="font-size: 3em; color: #2c5aa0; margin-bottom: 20px;">
                            <i class="${service.icon || 'fas fa-star'}"></i>
                        </div>
                        <h3 style="color: #333; margin-bottom: 15px;">${service.title || 'Услуга'}</h3>
                        <p style="color: #666; line-height: 1.6;">${service.description || 'Описание услуги'}</p>
                    </div>
                `;
            });
            
            container.innerHTML = servicesHTML;
        },
        
        // Update countries in DOM
        updateCountriesDOM: function(countries) {
            const container = document.querySelector('.destinations-grid');
            if (!container) return;
            
            if (!countries || countries.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Страны не добавлены</p>';
                return;
            }
            
            let countriesHTML = '';
            countries.forEach(country => {
                countriesHTML += `
                    <div class="country-card" style="background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                        <div style="height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5em;">
                            <i class="fas fa-globe-americas"></i>
                        </div>
                        <div style="padding: 20px;">
                            <h4 style="margin: 0 0 10px 0; color: #333;">${country.name || 'Страна'}</h4>
                            <p style="color: #666; margin: 0 0 15px 0; line-height: 1.5;">${country.description || 'Описание страны'}</p>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="color: #2c5aa0; font-weight: bold;">${country.price || 'от $0'}</span>
                                <span style="background: #e3f2fd; color: #2c5aa0; padding: 5px 10px; border-radius: 15px; font-size: 0.8em;">${country.tours ? country.tours.length : 0} туров</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            container.innerHTML = countriesHTML;
        },
        
        // Setup drag and drop for blocks
        setupDragAndDrop: function() {
            // This would implement drag and drop functionality
            console.log('🔧 Drag and drop setup (ready for implementation)');
        }
    };
    
    // Initialize when universal system is ready
    const initDynamicEditor = () => {
        if (window.UniversalData) {
            DynamicBlocksEditor.init();
        } else {
            setTimeout(initDynamicEditor, 100);
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDynamicEditor);
    } else {
        initDynamicEditor();
    }
    
    // Global access
    window.DynamicBlocksEditor = DynamicBlocksEditor;
    
    console.log('🎉 DYNAMIC BLOCKS EDITOR LOADED');
    console.log('💡 You can now add, edit, and remove cards and blocks!');
    
})();

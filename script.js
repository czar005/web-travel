// script.js - ОБНОВЛЕННАЯ ВЕРСИЯ С РАБОЧИМ РЕДАКТОРОМ
console.log('🚀 WorldTravel - Главная страница загружена');

let countriesData = [];
let isEditMode = false;
let editorData = {};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM загружен');
    initializePage();
    
    // Проверяем параметр редактирования
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('edit') === 'true') {
        enableEditMode();
    }
});
// Загрузка данных из LocalStorage или использование стандартных
function loadTravelData() {
    const savedData = localStorage.getItem('travelData');
    if (savedData) {
        return JSON.parse(savedData);
    }
    // Если данных нет, используйте стандартные из data/content.json
    return defaultData;
}

// Используйте эти данные для отображения контента
const travelData = loadTravelData();
function initializePage() {
    loadData();
    startAutoSync();
}

// Загрузка данных (сначала из localStorage, потом из файла)
async function loadData() {
    try {
        // Пробуем загрузить из localStorage (данные из админки)
        const savedData = localStorage.getItem('worldtravel_current_data');
        if (savedData) {
            const data = JSON.parse(savedData);
            console.log('✅ Данные загружены из админки');
            return data;
        }
        
        // Если в localStorage нет, загружаем из файла
        const response = await fetch('./data/content.json');
        if (!response.ok) throw new Error('Файл не найден');
        
        const fileData = await response.json();
        console.log('✅ Данные загружены из content.json');
        return fileData;
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        return getDefaultData();
    }
}

// Данные по умолчанию
function getDefaultData() {
    return {
        countries: [
            {
                id: 1,
                name: "Франция",
                description: "Страна искусства и культуры",
                image: "images/france.jpg",
                price: "от $500"
            },
            {
                id: 2,
                name: "Италия", 
                description: "Страна древней истории и кухни",
                image: "images/italy.jpg",
                price: "от $450"
            }
        ],
        content: {
            heroTitle: "Откройте мир с WorldTravel",
            heroText: "Мы создаем незабываемые путешествия по всему миру",
            contactPhone: "+7 (999) 123-45-67",
            contactEmail: "info@worldtravel.com",
            contactAddress: "Москва, ул. Туристическая, 15",
            contactHours: "Пн-Пт: 9:00-18:00"
        }
    };
}

// Применение данных редактора
// Применение данных редактора
// Применение данных редактора
function applyEditorData(editorData) {
    if (!editorData.sections) return;
    
    console.log('🔄 Применение данных редактора...');
    
    Object.keys(editorData.sections).forEach(sectionId => {
        const sectionData = editorData.sections[sectionId];
        
        // Восстанавливаем отдельные элементы если есть
        if (sectionData.elements && !isEditMode) {
            Object.keys(sectionData.elements).forEach(elementPath => {
                try {
                    const element = findElementByPath(document.body, elementPath);
                    if (element && sectionData.elements[elementPath]) {
                        const elementData = sectionData.elements[elementPath];
                        element.innerHTML = elementData.html || elementData.text || '';
                        console.log('✅ Восстановлен элемент:', elementPath);
                    }
                } catch (e) {
                    console.log('❌ Не удалось восстановить элемент:', elementPath, e);
                }
            });
        }
        
        // Восстанавливаем изображение если есть
        if (sectionData.image && sectionData.type === 'image') {
            updateBlockWithImage(sectionId, sectionData.image, isEditMode);
        }
    });
    
    // Восстанавливаем кастомные блоки
    restoreCustomBlocks(editorData);
}

function findElementByPath(context, path) {
    try {
        const selectors = path.split(' > ').reverse();
        let element = context;
        
        for (const selector of selectors) {
            if (element) {
                // Обрабатываем :nth-child
                if (selector.includes(':nth-child')) {
                    const baseSelector = selector.split(':nth-child')[0];
                    const match = selector.match(/:nth-child\((\d+)\)/);
                    const index = match ? parseInt(match[1]) - 1 : 0;
                    
                    const elements = element.querySelectorAll(baseSelector);
                    element = elements[index] || null;
                } else {
                    element = element.querySelector(selector);
                }
            } else {
                return null;
            }
        }
        
        return element;
    } catch (e) {
        console.error('Ошибка поиска элемента по пути:', path, e);
        return null;
    }
}

// В функции applyEditorData добавьте отдельную обработку статистики
function applyEditorData(editorData) {
    if (!editorData.sections) return;
    
    console.log('🔄 Применение данных редактора...');
    
    Object.keys(editorData.sections).forEach(sectionId => {
        const sectionData = editorData.sections[sectionId];
        
        // Восстанавливаем отдельные элементы если есть
        if (sectionData.elements && !isEditMode) {
            Object.keys(sectionData.elements).forEach(elementPath => {
                try {
                    let element = findElementByPath(document.body, elementPath);
                    
                    // Если не нашли, пробуем найти через более простой способ
                    if (!element) {
                        const simplePath = elementPath.split(' > ').pop();
                        element = document.querySelector(simplePath);
                    }
                    
                    if (element && sectionData.elements[elementPath]) {
                        const elementData = sectionData.elements[elementPath];
                        element.innerHTML = elementData.html || elementData.text || '';
                        console.log('✅ Восстановлен элемент:', elementPath);
                    }
                } catch (e) {
                    console.log('❌ Не удалось восстановить элемент:', elementPath, e);
                }
            });
        }
    });
    
    // Восстанавливаем кастомные блоки
    restoreCustomBlocks(editorData);
}
// Восстановление кастомных блоков
// Восстановление кастомных блоков
// Восстановление кастомных блоков
function restoreCustomBlocks(editorData) {
    if (!editorData.sections) return;
    
    const footer = document.querySelector('footer');
    if (!footer) return;
    
    Object.keys(editorData.sections).forEach(sectionId => {
        const sectionData = editorData.sections[sectionId];
        
        // Если это кастомный блок и его еще нет на странице
        if (sectionData.customBlock && !document.getElementById(sectionId) && sectionData.html) {
            console.log('➕ Восстановление кастомного блока:', sectionId);
            
            // Очищаем HTML от кнопок редактирования если НЕ в режиме редактирования
            let cleanHtml = sectionData.html;
            if (!isEditMode) {
                cleanHtml = cleanHtml.replace(/<div class="block-controls"[^>]*>[\s\S]*?<\/div>/gi, '');
                cleanHtml = cleanHtml.replace(/<button[^>]*onclick[^>]*>[\s\S]*?<\/button>/gi, '');
                cleanHtml = cleanHtml.replace(/contenteditable="true"/gi, '');
                cleanHtml = cleanHtml.replace(/class="editable-element"/gi, '');
                cleanHtml = cleanHtml.replace(/style="[^"]*border[^"]*"/gi, '');
                cleanHtml = cleanHtml.replace(/style="[^"]*position[^"]*"/gi, '');
                cleanHtml = cleanHtml.replace(/class="editable-block"/gi, '');
            }
            
            // Восстанавливаем HTML блока
            footer.insertAdjacentHTML('beforebegin', cleanHtml);
            
            // Восстанавливаем изображение если есть
            if (sectionData.image && sectionData.type === 'image') {
                setTimeout(() => {
                    updateBlockWithImage(sectionId, sectionData.image, isEditMode);
                }, 100);
            }
        }
    });
}
// Сохранение данных редактора
function saveEditorData() {
    console.log('💾 Сохранение данных редактора...');
    
    const data = window.dataManager.data;
    data.editorData = editorData;
    
    try {
        // Сохраняем через dataManager
        window.dataManager.saveData();
        
        // Дублируем в localStorage для надежности
        localStorage.setItem('worldtravel_data', JSON.stringify(data));
        sessionStorage.setItem('worldtravel_data', JSON.stringify(data));
        
        console.log('✅ Данные редактора сохранены. Блоков:', Object.keys(editorData.sections || {}).length);
        return true;
    } catch (e) {
        console.error('❌ Ошибка сохранения данных редактора:', e);
        showNotification('❌ Ошибка сохранения данных', 'error');
        return false;
    }
}
function updateBlockWithImage(blockId, imageUrl, showControls = false) {
    const block = document.getElementById(blockId);
    if (!block) return;
    
    const imageContainer = block.querySelector('.image-upload-container .image-placeholder');
    if (imageContainer) {
        if (showControls) {
            // В режиме редактирования - показываем кнопки управления
            imageContainer.innerHTML = `
                <img src="${imageUrl}" alt="Загруженное изображение" 
                     style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
                <div style="position: absolute; top: 10px; right: 10px; display: flex; gap: 5px;">
                    <button onclick="changeImage('${blockId}')" 
                            style="background: #3498db; color: white; border: none; border-radius: 5px; padding: 5px 10px; cursor: pointer; font-size: 12px;">
                        <i class="fas fa-sync"></i> Заменить
                    </button>
                    <button onclick="removeImage('${blockId}')" 
                            style="background: #e74c3c; color: white; border: none; border-radius: 5px; padding: 5px 10px; cursor: pointer; font-size: 12px;">
                        <i class="fas fa-trash"></i> Удалить
                    </button>
                </div>
            `;
            imageContainer.style.position = 'relative';
        } else {
            // В обычном режиме - только изображение
            imageContainer.innerHTML = `
                <img src="${imageUrl}" alt="Загруженное изображение" 
                     style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
            `;
        }
    }
}
function addEditControlsToBlock(block) {
    if (!block.classList.contains('editable-block')) {
        block.classList.add('editable-block');
        
        const controls = document.createElement('div');
        controls.className = 'block-controls';
        controls.innerHTML = `
            <button class="block-control" onclick="editBlockSettings(this.parentElement.parentElement)" title="Настройки блока">
                <i class="fas fa-cog"></i>
            </button>
            <button class="block-control" onclick="moveBlockUp(this.parentElement.parentElement)" title="Переместить вверх">
                <i class="fas fa-arrow-up"></i>
            </button>
            <button class="block-control" onclick="moveBlockDown(this.parentElement.parentElement)" title="Переместить вниз">
                <i class="fas fa-arrow-down"></i>
            </button>
            <button class="block-control delete" onclick="deleteBlock(this.parentElement.parentElement)" title="Удалить блок">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        block.appendChild(controls);
    }
}
// Добавьте в функцию enableEditMode() после addEditorInterface():
function enableEditMode() {
    console.log('✏️ Включен режим редактирования');
    isEditMode = true;
    addEditorInterface();
    makeSectionsEditable();
    addEditControlsToExistingBlocks();
    addEditorStyles();
}
function openImageUpload(blockId) {
    const fileInput = document.getElementById(`image-upload-${blockId}`);
    if (fileInput) fileInput.click();
}

function handleImageUpload(input, blockId) {
    const file = input.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
        showNotification('❌ Файл слишком большой! Максимальный размер: 5MB', 'error');
        return;
    }
    
    if (!file.type.startsWith('image/')) {
        showNotification('❌ Пожалуйста, выберите файл изображения', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        updateBlockWithImage(blockId, e.target.result, true);
        
        // Сохраняем в данные
        if (editorData.sections && editorData.sections[blockId]) {
            editorData.sections[blockId].image = e.target.result;
            saveEditorData();
        }
        
        showNotification('✅ Изображение загружено!');
    };
    
    reader.readAsDataURL(file);
}

function updateBlockWithImage(blockId, imageUrl, showControls = false) {
    const block = document.getElementById(blockId);
    if (!block) return;
    
    const imageContainer = block.querySelector('.image-upload-container .image-placeholder');
    if (imageContainer) {
        if (showControls) {
            // В режиме редактирования - показываем кнопки управления
            imageContainer.innerHTML = `
                <img src="${imageUrl}" alt="Загруженное изображение" 
                     style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
                <div style="position: absolute; top: 10px; right: 10px; display: flex; gap: 5px;">
                    <button onclick="changeImage('${blockId}')" 
                            style="background: #3498db; color: white; border: none; border-radius: 5px; padding: 5px 10px; cursor: pointer; font-size: 12px;">
                        <i class="fas fa-sync"></i>
                    </button>
                    <button onclick="removeImage('${blockId}')" 
                            style="background: #e74c3c; color: white; border: none; border-radius: 5px; padding: 5px 10px; cursor: pointer; font-size: 12px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            imageContainer.style.position = 'relative';
        } else {
            // В обычном режиме - только изображение
            imageContainer.innerHTML = `
                <img src="${imageUrl}" alt="Загруженное изображение" 
                     style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
            `;
        }
    }
}
function addEditorStyles() {
    const styles = `
        <style>
            .editable-block {
                position: relative;
                border: 2px dashed #3498db !important;
                margin: 5px 0;
                transition: all 0.3s ease;
            }
            
            .editable-block:hover {
                border-color: #e74c3c !important;
                background: rgba(255, 243, 205, 0.1);
            }
            
            .block-controls {
                position: absolute;
                top: 10px;
                right: 10px;
                display: flex;
                gap: 5px;
                z-index: 100;
                background: rgba(44, 62, 80, 0.9);
                padding: 5px;
                border-radius: 6px;
                backdrop-filter: blur(10px);
            }
            
            .block-control {
                background: #3498db;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 8px 12px;
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                gap: 5px;
                transition: all 0.3s ease;
            }
            
            .block-control:hover {
                background: #2980b9;
                transform: scale(1.05);
            }
            
            .block-control.delete {
                background: #e74c3c;
            }
            
            .block-control.delete:hover {
                background: #c0392b;
            }
            
            .editable-element {
                transition: all 0.3s ease;
            }
            
            .editable-element:focus {
                background: #fff3cd !important;
                padding: 5px !important;
                border-radius: 4px !important;
                outline: 2px solid #3498db !important;
            }
        </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
}

function addEditControlsToExistingBlocks() {
    // Добавляем контролы ко всем кастомным блокам
    document.querySelectorAll('.custom-block').forEach(block => {
        addEditControlsToBlock(block);
    });
    
    // Добавляем контролы к стандартным секциям
    const sections = ['home', 'about', 'services', 'destinations', 'contact'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            addEditControlsToBlock(section);
        }
    });
}
// Заглушки для функций управления блоками
function editBlockSettings(block) {
    showNotification('⚙️ Настройки блока: ' + block.id);
}

function moveBlockUp(block) {
    if (block.previousElementSibling) {
        block.parentNode.insertBefore(block, block.previousElementSibling);
        showNotification('⬆️ Блок перемещен вверх');
    }
}

function moveBlockDown(block) {
    if (block.nextElementSibling) {
        block.parentNode.insertBefore(block.nextElementSibling, block);
        showNotification('⬇️ Блок перемещен вниз');
    }
}

function deleteBlock(block) {
    if (confirm('Удалить этот блок?')) {
        const blockId = block.id;
        
        // Удаляем из DOM
        block.remove();
        
        // Удаляем из данных редактора
        if (editorData.sections && editorData.sections[blockId]) {
            delete editorData.sections[blockId];
            saveEditorData();
        }
        
        showNotification('🗑️ Блок удален');
    }
}

function changeImage(blockId) {
    const fileInput = document.getElementById(`image-upload-${blockId}`);
    if (fileInput) fileInput.click();
}

function removeImage(blockId) {
    const block = document.getElementById(blockId);
    if (block) {
        const imageContainer = block.querySelector('.image-upload-container .image-placeholder');
        if (imageContainer) {
            imageContainer.innerHTML = `
                <i class="fas fa-cloud-upload-alt" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>Нажмите для загрузки изображения</p>
                <small>Рекомендуемый размер: 600x400px</small>
            `;
            imageContainer.style.position = 'static';
        }
    }
    
    // Удаляем из данных
    if (editorData.sections && editorData.sections[blockId]) {
        delete editorData.sections[blockId].image;
        saveEditorData();
    }
    
    showNotification('🗑️ Изображение удалено');
}
// Применение изменений контента
function applyContentChanges(content) {
    // Заголовок и текст героя
    if (content.heroTitle) {
        const heroTitle = document.querySelector('.hero-content h1');
        if (heroTitle) heroTitle.textContent = content.heroTitle;
    }
    
    if (content.heroText) {
        const heroText = document.querySelector('.hero-content p');
        if (heroText) heroText.textContent = content.heroText;
    }
    
    // Контактная информация
    updateContactInfo(content);
}

function updateContactInfo(content) {
    // Телефон
    if (content.contactPhone) {
        document.querySelectorAll('.contact-item, .footer-section').forEach(element => {
            const html = element.innerHTML;
            if (html.includes('+7 (999) 123-45-67') || html.includes('+7 (999)')) {
                element.innerHTML = html.replace(/\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}/g, content.contactPhone);
            }
        });
    }
    
    // Email
    if (content.contactEmail) {
        document.querySelectorAll('.contact-item, .footer-section').forEach(element => {
            const html = element.innerHTML;
            if (html.includes('info@worldtravel.com')) {
                element.innerHTML = html.replace(/info@worldtravel\.com/g, content.contactEmail);
            }
        });
    }
    
    // Адрес
    if (content.contactAddress) {
        document.querySelectorAll('.contact-item, .footer-section').forEach(element => {
            const html = element.innerHTML;
            if (html.includes('Москва, ул. Туристическая, 15')) {
                element.innerHTML = html.replace(/Москва, ул\. Туристическая, 15/g, content.contactAddress);
            }
        });
    }
}

// Применение настроек дизайна
function applyDesignSettings(design) {
    // Логотип
    if (design.logo) {
        applyLogo(design.logo);
    }
    
    // Фон шапки
    if (design.headerBackground) {
        applyHeaderBackground(design.headerBackground);
    }
    
    // Настройки блоков
    if (design.blocks) {
        applyBlockSettings(design.blocks);
    }
}

function applyLogo(logoData) {
    const logoElement = document.querySelector('.logo h2');
    if (logoElement) {
        const oldImg = logoElement.querySelector('img');
        if (oldImg) oldImg.remove();
        
        const logoImg = document.createElement('img');
        logoImg.src = logoData;
        logoImg.alt = 'WorldTravel Logo';
        logoImg.style.height = '40px';
        logoImg.style.marginRight = '10px';
        logoImg.className = 'site-logo';
        
        logoElement.insertBefore(logoImg, logoElement.firstChild);
    }
}

function applyHeaderBackground(backgroundData) {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.style.backgroundImage = `url(${backgroundData})`;
        heroSection.style.backgroundSize = 'cover';
        heroSection.style.backgroundPosition = 'center';
    }
}

function applyBlockSettings(blocks) {
    const sections = {
        'home': document.getElementById('home'),
        'about': document.getElementById('about'),
        'services': document.getElementById('services'),
        'destinations': document.getElementById('destinations'),
        'contact': document.getElementById('contact')
    };
    
    Object.keys(sections).forEach(sectionId => {
        const section = sections[sectionId];
        if (section) {
            const isVisible = blocks[sectionId] !== false;
            section.style.display = isVisible ? 'block' : 'none';
        }
    });
}

// Отображение стран
function renderCountries() {
    const grid = document.querySelector('.destinations-grid');
    if (!grid) return;
    
    if (countriesData.length === 0) {
        grid.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #666; grid-column: 1 / -1;">
                <i class="fas fa-globe-americas" style="font-size: 4rem; margin-bottom: 1rem;"></i>
                <h3>Стран пока нет</h3>
                <p>Добавьте страны через админ-панель</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = countriesData.map(country => `
        <div class="destination-card">
            <div class="destination-image">
                <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; height: 200px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.3rem;">
                    ${country.name}
                </div>
            </div>
            <div class="destination-info">
                <h3>${country.name}</h3>
                <p>${country.description || 'Описание страны'}</p>
                <span class="price">${country.price || 'Цена не указана'}</span>
            </div>
        </div>
    `).join('');
}

// Автоматическая синхронизация
function startAutoSync() {
    setInterval(() => {
        const currentData = window.dataManager.data;
        const newData = window.dataManager.loadData();
        
        const countriesChanged = JSON.stringify(currentData.countries) !== JSON.stringify(newData.countries);
        const contentChanged = JSON.stringify(currentData.content) !== JSON.stringify(newData.content);
        const editorChanged = JSON.stringify(currentData.editorData) !== JSON.stringify(newData.editorData);
        
        if (countriesChanged || contentChanged || editorChanged) {
            window.dataManager.data = newData;
            loadData();
        }
    }, 3000);
}

// Уведомления
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#dc3545' : '#28a745'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: bold;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    notification.innerHTML = `${type === 'error' ? '❌' : '✅'} ${message}`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// ========== ПРОСТОЙ РЕДАКТОР ==========
function addEditControlsToAllBlocks() {
    console.log('🎛️ Добавление контролов ко всем блокам');
    
    // Добавляем контролы ко всем кастомным блокам
    document.querySelectorAll('.custom-block').forEach(block => {
        addEditControlsToBlock(block);
    });
    
    // Добавляем контролы к стандартным секциям
    const sections = ['home', 'about', 'services', 'destinations', 'contact'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            addEditControlsToBlock(section);
        }
    });
    
    // Добавляем контролы ко всем секциям с ID
    document.querySelectorAll('section[id]').forEach(section => {
        if (!section.classList.contains('editable-block')) {
            addEditControlsToBlock(section);
        }
    });
}

function addEditControlsToBlock(block) {
    if (!block.classList.contains('editable-block')) {
        block.classList.add('editable-block');
        
        const controls = document.createElement('div');
        controls.className = 'block-controls';
        controls.innerHTML = `
            <button class="block-control" onclick="editBlockSettings(this.parentElement.parentElement)" title="Настройки блока">
                <i class="fas fa-cog"></i>
            </button>
            <button class="block-control" onclick="moveBlockUp(this.parentElement.parentElement)" title="Переместить вверх">
                <i class="fas fa-arrow-up"></i>
            </button>
            <button class="block-control" onclick="moveBlockDown(this.parentElement.parentElement)" title="Переместить вниз">
                <i class="fas fa-arrow-down"></i>
            </button>
            <button class="block-control delete" onclick="deleteBlock(this.parentElement.parentElement)" title="Удалить блок">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        block.appendChild(controls);
    }
}
function enableEditMode() {
    console.log('✏️ Включен режим редактирования');
    isEditMode = true;
    addEditorInterface();
    addEditControlsToAllBlocks();
    makeEverythingEditable();
    addEditorStyles();
}

function saveAllChanges() {
    console.log('💾 Принудительное сохранение всех изменений...');
    
    // Сохраняем все редактируемые элементы
    document.querySelectorAll('.editable-element').forEach(element => {
        if (element.textContent && element.textContent.trim() !== '') {
            saveElementContent(element);
        }
    });
    
    // Сохраняем HTML всех блоков
    document.querySelectorAll('.editable-block, section[id]').forEach(block => {
        const blockId = block.id;
        if (blockId) {
            if (!editorData.sections) editorData.sections = {};
            if (!editorData.sections[blockId]) {
                editorData.sections[blockId] = {
                    customBlock: block.classList.contains('custom-block'),
                    type: 'standard',
                    timestamp: Date.now()
                };
            }
            
            // Сохраняем полный HTML блока
            editorData.sections[blockId].html = block.outerHTML;
        }
    });
    
    // Сохраняем статистику отдельно (она может быть без ID)
    document.querySelectorAll('.stat').forEach(stat => {
        const statBlock = stat.closest('section');
        if (statBlock && statBlock.id) {
            saveElementContent(stat);
        }
    });
}

function makeEverythingEditable() {
    console.log('📝 Делаем все элементы редактируемыми');
    
    // Делаем редактируемыми ВСЕ текстовые элементы включая цифры в статистике
    const editableSelectors = [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'span', 'div', 'li', 'td',
        '.section-title', '.hero-content p', '.about-text p',
        '.service-card h3', '.service-card p',
        '.destination-info h3', '.destination-info p',
        '.contact-info h3', '.contact-info p',
        '.footer-section h3', '.footer-section h4', '.footer-section p',
        '.stat h3', '.stat p',  // Добавляем статистику
        '.price', '.country-link',
        '.cta-button', '.contact-form button',
        'strong', 'em', 'b', 'i'
    ];
    
    editableSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            if (!element.closest('.block-controls')) { // Исключаем кнопки управления
                element.setAttribute('contenteditable', 'true');
                element.classList.add('editable-element');
                
                element.addEventListener('focus', function() {
                    this.style.background = '#fff3cd';
                    this.style.padding = '5px';
                    this.style.borderRadius = '4px';
                    this.style.outline = 'none';
                });
                
                element.addEventListener('blur', function() {
                    this.style.background = '';
                    this.style.padding = '';
                    saveElementContent(this);
                });
                
                // Добавляем обработчик для Enter (предотвращаем создание новых параграфов)
                element.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.blur();
                    }
                });
            }
        });
    });
    
    console.log('✅ Все элементы сделаны редактируемыми');
}
function saveElementContent(element) {
    console.log('💾 Сохранение элемента:', element.tagName, element.textContent);
    
    const block = element.closest('section, .custom-block, .editable-block, div, .stat');
    if (!block) {
        console.log('❌ Блок не найден для элемента:', element);
        return;
    }
    
    const blockId = block.id || getParentSectionId(block);
    if (!blockId) {
        console.log('❌ ID блока не найден');
        return;
    }
    
    if (!editorData.sections) editorData.sections = {};
    if (!editorData.sections[blockId]) {
        editorData.sections[blockId] = {
            customBlock: block.classList.contains('custom-block'),
            type: 'standard',
            timestamp: Date.now(),
            elements: {}
        };
    }
    
    // Сохраняем весь HTML блока
    editorData.sections[blockId].html = block.outerHTML;
    
    // Сохраняем конкретный элемент
    if (!editorData.sections[blockId].elements) {
        editorData.sections[blockId].elements = {};
    }
    
    const elementPath = getElementPath(element);
    editorData.sections[blockId].elements[elementPath] = {
        html: element.innerHTML,
        text: element.textContent,
        tag: element.tagName
    };
    
    saveEditorData();
    console.log('✅ Элемент сохранен:', elementPath);
}

function getParentSectionId(element) {
    let current = element;
    while (current && current !== document.body) {
        if (current.id && (current.tagName === 'SECTION' || current.classList.contains('custom-block'))) {
            return current.id;
        }
        current = current.parentElement;
    }
    return null;
}

function getElementPath(element) {
    let path = '';
    let currentElement = element;
    
    while (currentElement && currentElement !== document.body) {
        let selector = currentElement.tagName.toLowerCase();
        
        if (currentElement.id) {
            selector += '#' + currentElement.id;
        } else if (currentElement.className) {
            selector += '.' + currentElement.className.split(' ')[0];
        }
        
        path = selector + (path ? ' > ' + path : '');
        currentElement = currentElement.parentElement;
    }
    
    return path;
}
function addNewBlock(type) {
    console.log('➕ Добавление блока типа:', type);
    
    const newBlockId = 'custom-block-' + Date.now();
    let blockHTML = '';
    
    switch(type) {
        case 'text':
            blockHTML = `
                <section id="${newBlockId}" class="custom-block editable-block" style="padding: 80px 0; background: #f8f9fa;">
                    <div class="container">
                        <h2 class="editable-element" contenteditable="true" style="text-align: center; margin-bottom: 20px; color: #2c5aa0;">Новый текстовый блок</h2>
                        <p class="editable-element" contenteditable="true" style="text-align: center; color: #666; line-height: 1.6; font-size: 1.1em; max-width: 800px; margin: 0 auto;">
                            Это новый текстовый блок. Вы можете редактировать этот текст. Расскажите о ваших услугах, преимуществах или любой другой информации.
                        </p>
                    </div>
                </section>
            `;
            break;
            
        case 'image':
            blockHTML = `
                <section id="${newBlockId}" class="custom-block editable-block" style="padding: 80px 0;">
                    <div class="container">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center;">
                            <div class="image-upload-container">
                                <div class="image-placeholder" onclick="openImageUpload('${newBlockId}')" 
                                     style="background: #f8f9fa; height: 300px; border: 2px dashed #ddd; border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #666; cursor: pointer;">
                                    <i class="fas fa-cloud-upload-alt" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                                    <p>Нажмите для загрузки изображения</p>
                                    <small>Рекомендуемый размер: 600x400px</small>
                                </div>
                                <input type="file" id="image-upload-${newBlockId}" accept="image/*" style="display: none;" 
                                       onchange="handleImageUpload(this, '${newBlockId}')">
                            </div>
                            <div>
                                <h2 class="editable-element" contenteditable="true" style="color: #2c5aa0; margin-bottom: 15px;">Заголовок изображения</h2>
                                <p class="editable-element" contenteditable="true" style="color: #666; line-height: 1.6;">Текст рядом с изображением. Вы можете редактировать этот контент.</p>
                            </div>
                        </div>
                    </div>
                </section>
            `;
            break;
            
        case 'cta':
            blockHTML = `
                <section id="${newBlockId}" class="custom-block editable-block" style="padding: 100px 0; background: linear-gradient(135deg, #2c5aa0, #4a7bc8); color: white; text-align: center;">
                    <div class="container">
                        <h2 class="editable-element" contenteditable="true" style="margin-bottom: 20px; font-size: 2.5rem;">Призыв к действию</h2>
                        <p class="editable-element" contenteditable="true" style="margin-bottom: 30px; opacity: 0.9; font-size: 1.2em; max-width: 600px; margin-left: auto; margin-right: auto;">
                            Это призыв к действию. Редактируйте текст и привлекайте клиентов!
                        </p>
                        <button class="editable-element" contenteditable="true" style="background: white; color: #2c5aa0; border: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 1.1em;">
                            Действовать сейчас
                        </button>
                    </div>
                </section>
            `;
            break;
            
        case 'features':
            blockHTML = `
                <section id="${newBlockId}" class="custom-block editable-block" style="padding: 80px 0;">
                    <div class="container">
                        <h2 class="editable-element" contenteditable="true" style="text-align: center; margin-bottom: 40px; color: #2c5aa0;">Наши преимущества</h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px;">
                            <div style="text-align: center; padding: 20px;">
                                <div style="background: #667eea; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 1.5em;">
                                    ⭐
                                </div>
                                <h3 class="editable-element" contenteditable="true" style="color: #333; margin-bottom: 10px;">Преимущество 1</h3>
                                <p class="editable-element" contenteditable="true" style="color: #666;">Описание преимущества</p>
                            </div>
                            <div style="text-align: center; padding: 20px;">
                                <div style="background: #764ba2; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 1.5em;">
                                    💎
                                </div>
                                <h3 class="editable-element" contenteditable="true" style="color: #333; margin-bottom: 10px;">Преимущество 2</h3>
                                <p class="editable-element" contenteditable="true" style="color: #666;">Описание преимущества</p>
                            </div>
                            <div style="text-align: center; padding: 20px;">
                                <div style="background: #f39c12; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 1.5em;">
                                    🚀
                                </div>
                                <h3 class="editable-element" contenteditable="true" style="color: #333; margin-bottom: 10px;">Преимущество 3</h3>
                                <p class="editable-element" contenteditable="true" style="color: #666;">Описание преимущества</p>
                            </div>
                        </div>
                    </div>
                </section>
            `;
            break;
    }
    
    // Вставляем блок перед футером
    const footer = document.querySelector('footer');
    if (footer) {
        footer.insertAdjacentHTML('beforebegin', blockHTML);
        console.log('✅ Блок добавлен в DOM');
        
        // Добавляем контролы к новому блоку
        setTimeout(() => {
            const newBlock = document.getElementById(newBlockId);
            if (newBlock) {
                addEditControlsToBlock(newBlock);
                
                // Сохраняем блок в данные
                saveNewBlockData(newBlockId, type, blockHTML);
                
                // Делаем содержимое редактируемым
                makeBlockEditable(newBlock);
            }
        }, 100);
        
        closeAddBlockModal();
        showNotification('✅ Новый блок добавлен!');
    } else {
        console.error('❌ Футер не найден');
        showNotification('❌ Ошибка добавления блока', 'error');
    }
}
function saveNewBlockData(blockId, type, html) {
    if (!editorData.sections) editorData.sections = {};
    
    editorData.sections[blockId] = {
        type: type,
        title: 'Новый блок',
        content: 'Содержимое блока',
        styles: {},
        customBlock: true,
        html: html,
        timestamp: Date.now(),
        elements: {}
    };
    
    // Немедленно сохраняем
    saveEditorData();
    console.log('💾 Данные нового блока сохранены:', blockId);
}

function makeBlockEditable(block) {
    // Делаем все дочерние элементы редактируемыми
    block.querySelectorAll('.editable-element').forEach(element => {
        element.setAttribute('contenteditable', 'true');
        
        element.addEventListener('focus', function() {
            this.style.background = '#fff3cd';
            this.style.padding = '5px';
            this.style.borderRadius = '4px';
            this.style.outline = 'none';
        });
        
        element.addEventListener('blur', function() {
            this.style.background = '';
            this.style.padding = '';
            saveElementContent(this);
        });
    });
}
function addEditorInterface() {
    const editorHTML = `
        <div id="editor-panel" style="position: fixed; top: 0; left: 0; right: 0; background: #2c3e50; color: white; padding: 15px; z-index: 10000; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">
            <div style="display: flex; align-items: center; gap: 15px;">
                <h3 style="margin: 0; color: white;">
                    <i class="fas fa-edit"></i> Редактор страницы
                </h3>
                <span style="background: #e74c3c; padding: 5px 10px; border-radius: 4px; font-size: 12px;">
                    РЕЖИМ РЕДАКТИРОВАНИЯ
                </span>
            </div>
            <div style="display: flex; gap: 10px;">
                <button onclick="openAddBlockModal()" style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-plus"></i> Добавить блок
                </button>
                <button onclick="savePageChanges()" style="background: #27ae60; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-save"></i> Сохранить
                </button>
                // В блоке с кнопками добавьте:
<button onclick="saveAllChanges()" style="background: #f39c12; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
    <i class="fas fa-save"></i> Сохранить сейчас
</button>
                <button onclick="exitEditor()" style="background: #95a5a6; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-times"></i> Выйти
                </button>
            </div>
        </div>
        
        <!-- Модальное окно добавления блока -->
        <div id="addBlockModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10001;">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 30px; border-radius: 10px; width: 90%; max-width: 500px;">
                <h3 style="color: #2c3e50; margin-bottom: 20px;">Добавить новый блок</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
                    <button onclick="addNewBlock('text')" style="background: #3498db; color: white; border: none; padding: 15px; border-radius: 5px; cursor: pointer;">
                        <i class="fas fa-text-width"></i> Текстовый блок
                    </button>
                    <button onclick="addNewBlock('image')" style="background: #9b59b6; color: white; border: none; padding: 15px; border-radius: 5px; cursor: pointer;">
                        <i class="fas fa-image"></i> Блок с изображением
                    </button>
                    <button onclick="addNewBlock('cta')" style="background: #e74c3c; color: white; border: none; padding: 15px; border-radius: 5px; cursor: pointer;">
                        <i class="fas fa-bullhorn"></i> Призыв к действию
                    </button>
                    <button onclick="addNewBlock('features')" style="background: #f39c12; color: white; border: none; padding: 15px; border-radius: 5px; cursor: pointer;">
                        <i class="fas fa-star"></i> Блок преимуществ
                    </button>
                </div>
                <button onclick="closeAddBlockModal()" style="background: #95a5a6; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; width: 100%;">
                    Закрыть
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', editorHTML);
    document.body.style.paddingTop = '70px';
}
function openAddBlockModal() {
    document.getElementById('addBlockModal').style.display = 'block';
}

function closeAddBlockModal() {
    document.getElementById('addBlockModal').style.display = 'none';
}
function makeSectionsEditable() {
    // Делаем все заголовки редактируемыми
    document.querySelectorAll('h1, h2, h3, .section-title').forEach(element => {
        element.setAttribute('contenteditable', 'true');
        element.style.outline = 'none';
        element.addEventListener('focus', function() {
            this.style.background = '#fff3cd';
            this.style.padding = '5px';
            this.style.borderRadius = '4px';
        });
        element.addEventListener('blur', function() {
            this.style.background = '';
            this.style.padding = '';
            saveSectionContent(this);
        });
    });
    
    // Делаем все параграфы редактируемыми
    document.querySelectorAll('p, .content').forEach(element => {
        element.setAttribute('contenteditable', 'true');
        element.style.outline = 'none';
        element.addEventListener('focus', function() {
            this.style.background = '#fff3cd';
            this.style.padding = '5px';
            this.style.borderRadius = '4px';
        });
        element.addEventListener('blur', function() {
            this.style.background = '';
            this.style.padding = '';
            saveSectionContent(this);
        });
    });
}

function saveSectionContent(element) {
    const section = element.closest('section');
    if (!section) return;
    
    const sectionId = section.id;
    if (!editorData.sections) editorData.sections = {};
    if (!editorData.sections[sectionId]) editorData.sections[sectionId] = {};
    
    // Сохраняем заголовок
    const titleElement = section.querySelector('h1, h2, .section-title');
    if (titleElement) {
        editorData.sections[sectionId].title = titleElement.textContent;
    }
    
    // Сохраняем контент
    const contentElement = section.querySelector('p, .content');
    if (contentElement) {
        editorData.sections[sectionId].content = contentElement.textContent;
    }
    
    saveEditorData();
    showNotification('✅ Изменения сохранены');
}

function savePageChanges() {
    console.log('💾 Полное сохранение страницы...');
    
    // Сохраняем ВСЕ изменения
    saveAllChanges();
    
    // Дополнительно сохраняем через dataManager
    saveEditorData();
    
    showNotification('✅ Все изменения сохранены! Страница обновится через 3 секунды.');
    
    setTimeout(() => {
        // Перезагружаем БЕЗ параметра edit, чтобы увидеть изменения на главной
        window.location.href = window.location.pathname;
    }, 3000);
}

function exitEditor() {
    if (confirm('Выйти из режима редактирования? Несохраненные изменения будут потеряны.')) {
        window.location.href = window.location.pathname;
    }
}

// Функции для работы с изображениями
function updateBlockWithImage(blockId, imageUrl) {
    const block = document.getElementById(blockId);
    if (!block) return;
    
    const imageContainer = block.querySelector('.image-upload-container .image-placeholder');
    if (imageContainer) {
        imageContainer.innerHTML = `
            <img src="${imageUrl}" alt="Загруженное изображение" 
                 style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
        `;
    }
}

// Глобальные функции
window.debugData = function() {
    console.log('=== ДАННЫЕ ===', window.dataManager.data);
};
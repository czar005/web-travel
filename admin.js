// admin.js - УПРОЩЕННАЯ РАБОЧАЯ ВЕРСИЯ
console.log('🚀 Админка загружена');
function saveTravelData(data) {
    localStorage.setItem('travelData', JSON.stringify(data));
    alert('Изменения сохранены! Обновите основную страницу.');
}

// Вызывайте эту функцию при сохранении в админке
class SimpleAdmin {
    constructor() {
        this.countries = [];
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.renderCountries();
        console.log('✅ Админка инициализирована');
    }

    async loadData() {
        try {
            const data = sessionStorage.getItem('worldtravel_data') || localStorage.getItem('worldtravel_data');
            if (data) {
                const parsed = JSON.parse(data);
                this.countries = parsed.countries || [];
                console.log('📁 Загружено стран:', this.countries.length);
            }
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            this.countries = [];
        }
    }

    setupEventListeners() {
        // Кнопка добавления страны
        const addBtn = document.getElementById('add-country-btn') || 
                      document.querySelector('button[onclick*="addCountry"]') ||
                      document.querySelector('.btn-success');
        
        if (addBtn) {
            console.log('✅ Найдена кнопка добавления');
            addBtn.onclick = () => this.openCountryModal();
            addBtn.style.border = '2px solid #28a745';
        } else {
            console.error('❌ Кнопка не найдена, создаем свою');
            this.createAddButton();
        }

        // Форма
        const form = document.getElementById('countryForm');
        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                this.saveCountry();
            };
        }
    }

    createAddButton() {
        const btn = document.createElement('button');
        btn.innerHTML = '<i class="fas fa-plus"></i> Добавить страну';
        btn.style.cssText = `
            background: #28a745;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px;
        `;
        btn.onclick = () => this.openCountryModal();
        
        // Добавляем в начало контента
        const content = document.querySelector('.content-area') || document.body;
        content.prepend(btn);
    }

    openCountryModal() {
        console.log('🎯 Открываем модальное окно');
        this.showModal();
    }

    showModal() {
        // Пробуем найти существующее модальное окно
        let modal = document.getElementById('addCountryModal') || 
                   document.getElementById('country-modal') ||
                   document.querySelector('.modal');
        
        if (modal) {
            modal.style.display = 'block';
            modal.style.opacity = '1';
        } else {
            // Создаем модальное окно
            this.createModal();
        }
    }

    createModal() {
        const modal = document.createElement('div');
        modal.id = 'simpleAdminModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 10px; width: 90%; max-width: 500px;">
                <h3 style="margin-top: 0; color: #2c5aa0;">Добавить страну</h3>
                <form id="simpleAdminForm">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Название страны:</label>
                        <input type="text" id="adminCountryName" style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 16px;" placeholder="Введите название страны" required>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Описание:</label>
                        <textarea id="adminCountryDesc" style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; height: 100px; font-size: 16px;" placeholder="Описание страны" required></textarea>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Цена:</label>
                        <input type="text" id="adminCountryPrice" style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 16px;" placeholder="от $500" value="от $">
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button type="button" onclick="window.simpleAdmin.closeModal()" style="padding: 12px 24px; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">Отмена</button>
                        <button type="submit" style="padding: 12px 24px; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">Добавить страну</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Обработчик формы
        document.getElementById('simpleAdminForm').onsubmit = (e) => {
            e.preventDefault();
            this.saveCountry();
        };
    }

    closeModal() {
        const modal = document.getElementById('simpleAdminModal');
        if (modal) modal.remove();
    }

    saveCountry() {
        const name = document.getElementById('adminCountryName')?.value || 
                    document.getElementById('country-name')?.value;
        const description = document.getElementById('adminCountryDesc')?.value || 
                           document.getElementById('country-description')?.value;
        const price = document.getElementById('adminCountryPrice')?.value || 
                     document.getElementById('country-price')?.value;

        if (!name) {
            alert('❌ Введите название страны');
            return;
        }

        const newCountry = {
            id: name.toLowerCase().replace(/ /g, '-'),
            name: name,
            description: description,
            price: price,
            shortDescription: (description || '').substring(0, 100) + '...',
            images: [],
            tours: []
        };

        this.countries.push(newCountry);
        this.saveToStorage();
        this.renderCountries();
        this.closeModal();

        console.log('✅ Страна добавлена:', newCountry);
        alert('✅ Страна "' + name + '" добавлена! Главная страница обновится через 2 секунды.');
    }

    saveToStorage() {
        const data = {
            countries: this.countries,
            tours: [],
            content: {},
            lastUpdate: new Date().toISOString()
        };

        sessionStorage.setItem('worldtravel_data', JSON.stringify(data));
        localStorage.setItem('worldtravel_data', JSON.stringify(data));

        console.log('💾 Данные сохранены:', this.countries.length, 'стран');
    }

    renderCountries() {
        const container = document.getElementById('countries-list') || 
                         document.querySelector('.content-area') || 
                         document.body;

        let html = '<h3>Управление странами</h3>';
        
        if (this.countries.length === 0) {
            html += '<p>Стран пока нет</p>';
        } else {
            html += this.countries.map(country => `
                <div style="background: white; padding: 20px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #2c5aa0;">
                    <h4 style="margin: 0 0 10px 0;">${country.name}</h4>
                    <p style="margin: 0 0 10px 0; color: #666;">${country.description}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong style="color: #2c5aa0;">${country.price}</strong>
                        <button onclick="window.simpleAdmin.deleteCountry('${country.id}')" style="background: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Удалить</button>
                    </div>
                </div>
            `).join('');
        }

        container.innerHTML = html;
    }

    deleteCountry(countryId) {
        if (confirm('Удалить страну?')) {
            this.countries = this.countries.filter(c => c.id !== countryId);
            this.saveToStorage();
            this.renderCountries();
            console.log('🗑️ Страна удалена:', countryId);
        }
    }
}
// admin.js - ДОБАВИТЬ в конец:

// Инициализация админки
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

function initializeAdmin() {
    loadCountriesForAdmin();
    setupEventListeners();
}

function setupEventListeners() {
    // Кнопка сохранения
    const saveBtn = document.querySelector('.btn-save');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveAdminChanges);
    }
    
    // Кнопка добавления страны
    const addCountryBtn = document.querySelector('.btn-add-country');
    if (addCountryBtn) {
        addCountryBtn.addEventListener('click', showAddCountryForm);
    }
}

// Загрузить страны для админки
async function loadCountriesForAdmin() {
    const data = await loadData();
    displayCountriesInAdmin(data.countries);
}

// Показать страны в админке
function displayCountriesInAdmin(countries) {
    const container = document.getElementById('countries-list');
    if (!container) return;
    
    container.innerHTML = countries.map(country => `
        <div class="country-item" data-id="${country.id}">
            <h4>${country.name}</h4>
            <p>${country.description}</p>
            <button onclick="editCountry(${country.id})">Редактировать</button>
            <button onclick="deleteCountry(${country.id})">Удалить</button>
        </div>
    `).join('');
}

// Сохранить изменения из админки
async function saveAdminChanges() {
    const currentData = await loadData();
    
    // Здесь будет логика сохранения изменений из форм
    // Пока просто сохраняем текущие данные в LocalStorage
    
    if (window.dataManager) {
        window.dataManager.saveToLocalStorage(currentData);
        alert('Данные сохранены! Обновите основную страницу.');
    } else {
        alert('Ошибка: Менеджер данных не загружен');
    }
}

// Добавить новую страну
function showAddCountryForm() {
    const name = prompt('Введите название страны:');
    const description = prompt('Введите описание:');
    
    if (name && description) {
        addNewCountry(name, description);
    }
}

async function addNewCountry(name, description) {
    const data = await loadData();
    const newId = Math.max(...data.countries.map(c => c.id), 0) + 1;
    
    data.countries.push({
        id: newId,
        name: name,
        description: description,
        image: "images/travel-placeholder.jpg"
    });
    
    if (window.dataManager) {
        window.dataManager.saveToLocalStorage(data);
        loadCountriesForAdmin(); // Обновляем список
        alert('Страна добавлена!');
    }
}

// Удалить страну
function deleteCountry(id) {
    if (confirm('Удалить эту страну?')) {
        // Логика удаления будет в следующем шаге
        alert('Функция удаления будет добавлена');
    }
}

function editCountry(id) {
    alert('Функция редактирования будет добавлена');
}
// Инициализация
let simpleAdmin;
document.addEventListener('DOMContentLoaded', () => {
    simpleAdmin = new SimpleAdmin();
    window.simpleAdmin = simpleAdmin;
});
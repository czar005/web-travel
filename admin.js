// Admin JavaScript - управление данными через админ-панель
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

function initializeAdmin() {
    loadAdminData();
    setupAdminEventListeners();
    loadCountrySelect();
}

function setupAdminEventListeners() {
    // Обработчики для форм
    const addCountryForm = document.getElementById('add-country-form');
    const addTourForm = document.getElementById('add-tour-form');
    const contactForm = document.getElementById('contact-form');
    const settingsForm = document.getElementById('settings-form');
    
    if (addCountryForm) {
        addCountryForm.addEventListener('submit', handleAddCountry);
    }
    
    if (addTourForm) {
        addTourForm.addEventListener('submit', handleAddTour);
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleUpdateContacts);
    }
    
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleUpdateSettings);
    }
    
    // Загрузка данных при смене вкладок
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switch(tabName) {
                case 'countries':
                    loadCountriesTable();
                    break;
                case 'tours':
                    loadToursTable();
                    break;
                case 'contacts':
                    loadContactsForm();
                    break;
                case 'settings':
                    loadSettingsForm();
                    break;
            }
        });
    });
}

function loadAdminData() {
    if (!window.dataManager) {
        console.error('Data manager not available');
        showAdminNotification('Ошибка загрузки данных менеджера', 'error');
        return;
    }
    
    const data = window.dataManager.getData();
    console.log('Admin loaded data:', data);
    
    if (data) {
        loadCountriesTable();
        loadContactsForm();
        loadSettingsForm();
    } else {
        showAdminNotification('Данные не найдены, создаем стандартные', 'warning');
        window.dataManager.setDefaultData();
        loadAdminData(); // Перезагружаем
    }
}

function loadCountriesTable() {
    if (!window.dataManager) return;
    
    const countries = window.dataManager.getCountries();
    const tbody = document.querySelector('#countries-table tbody');
    
    console.log('Loading countries table:', countries);
    
    if (tbody) {
        if (countries.length > 0) {
            tbody.innerHTML = countries.map(country => `
                <tr>
                    <td>${country.name}</td>
                    <td>${country.description}</td>
                    <td>${country.tours ? country.tours.length : 0}</td>
                    <td>
                        <button class="btn-small" onclick="editCountry(${country.id})">Редактировать</button>
                        <button class="btn-small danger" onclick="deleteCountry(${country.id})">Удалить</button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999;">Страны не добавлены</td></tr>';
        }
    }
}

function loadToursTable() {
    if (!window.dataManager) return;
    
    const countries = window.dataManager.getCountries();
    const tbody = document.querySelector('#tours-table tbody');
    
    if (tbody) {
        let toursHTML = '';
        let hasTours = false;
        
        countries.forEach(country => {
            if (country.tours && country.tours.length > 0) {
                hasTours = true;
                country.tours.forEach(tour => {
                    toursHTML += `
                        <tr>
                            <td>${tour.name}</td>
                            <td>${country.name}</td>
                            <td>$${tour.price}</td>
                            <td>${tour.duration}</td>
                            <td>
                                <button class="btn-small danger" onclick="deleteTour(${country.id}, ${tour.id})">Удалить</button>
                            </td>
                        </tr>
                    `;
                });
            }
        });
        
        tbody.innerHTML = hasTours ? toursHTML : '<tr><td colspan="5" style="text-align: center; color: #999;">Туры не найдены</td></tr>';
    }
}

function loadContactsForm() {
    if (!window.dataManager) return;
    
    const contacts = window.dataManager.getContacts();
    const form = document.getElementById('contact-form');
    
    console.log('Loading contacts form:', contacts);
    
    if (form) {
        form.querySelector('#contact-phone').value = contacts.phone || '';
        form.querySelector('#contact-email').value = contacts.email || '';
        form.querySelector('#contact-address').value = contacts.address || '';
        form.querySelector('#contact-hours').value = contacts.hours || '';
    }
}

function loadSettingsForm() {
    if (!window.dataManager) return;
    
    const settings = window.dataManager.getSettings();
    const form = document.getElementById('settings-form');
    
    console.log('Loading settings form:', settings);
    
    if (form) {
        form.querySelector('#site-title').value = settings.siteTitle || '';
        form.querySelector('#company-name').value = settings.companyName || '';
    }
}

function loadCountrySelect() {
    if (!window.dataManager) return;
    
    const countries = window.dataManager.getCountries();
    const select = document.getElementById('tour-country');
    
    if (select) {
        if (countries.length > 0) {
            select.innerHTML = countries.map(country => 
                `<option value="${country.id}">${country.name}</option>`
            ).join('');
        } else {
            select.innerHTML = '<option value="">Сначала добавьте страны</option>';
        }
    }
}

// Обработчики форм
function handleAddCountry(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    const countryData = {
        name: formData.get('name').trim(),
        description: formData.get('description').trim()
    };
    
    if (!countryData.name) {
        showAdminNotification('Введите название страны', 'error');
        return;
    }
    
    if (window.dataManager) {
        window.dataManager.addCountry(countryData);
        form.reset();
        loadCountriesTable();
        loadCountrySelect();
        showAdminNotification('Страна успешно добавлена!', 'success');
    }
}

function handleAddTour(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    const tourData = {
        name: formData.get('name').trim(),
        price: parseInt(formData.get('price')),
        duration: formData.get('duration').trim()
    };
    
    const countryId = parseInt(formData.get('country'));
    
    if (!tourData.name || !tourData.price || !tourData.duration) {
        showAdminNotification('Заполните все поля тура', 'error');
        return;
    }
    
    if (window.dataManager) {
        const result = window.dataManager.addTour(countryId, tourData);
        if (result) {
            form.reset();
            loadToursTable();
            showAdminNotification('Тур успешно добавлен!', 'success');
        } else {
            showAdminNotification('Ошибка при добавлении тура', 'error');
        }
    }
}

function handleUpdateContacts(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    const contactData = {
        phone: formData.get('phone').trim(),
        email: formData.get('email').trim(),
        address: formData.get('address').trim(),
        hours: formData.get('hours').trim()
    };
    
    if (window.dataManager) {
        window.dataManager.updateContacts(contactData);
        showAdminNotification('Контактная информация обновлена!', 'success');
    }
}

function handleUpdateSettings(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    const settingsData = {
        siteTitle: formData.get('siteTitle').trim(),
        companyName: formData.get('companyName').trim()
    };
    
    if (window.dataManager) {
        window.dataManager.updateSettings(settingsData);
        showAdminNotification('Настройки сайта обновлены!', 'success');
    }
}

// Функции управления
function editCountry(countryId) {
    if (!window.dataManager) return;
    
    const countries = window.dataManager.getCountries();
    const country = countries.find(c => c.id === countryId);
    
    if (country) {
        const newName = prompt('Введите новое название страны:', country.name);
        if (newName === null) return;
        
        const newDesc = prompt('Введите новое описание:', country.description);
        if (newDesc === null) return;
        
        if (newName.trim() && newDesc.trim()) {
            window.dataManager.updateCountry(countryId, {
                name: newName.trim(),
                description: newDesc.trim()
            });
            loadCountriesTable();
            loadCountrySelect();
            showAdminNotification('Страна обновлена!', 'success');
        } else {
            showAdminNotification('Название и описание не могут быть пустыми', 'error');
        }
    }
}

function deleteCountry(countryId) {
    if (confirm('Вы уверены, что хотите удалить эту страну? Все туры в этой стране также будут удалены.')) {
        if (window.dataManager) {
            window.dataManager.deleteCountry(countryId);
            loadCountriesTable();
            loadToursTable();
            loadCountrySelect();
            showAdminNotification('Страна удалена!', 'success');
        }
    }
}

function deleteTour(countryId, tourId) {
    if (confirm('Вы уверены, что хотите удалить этот тур?')) {
        if (window.dataManager) {
            window.dataManager.deleteTour(countryId, tourId);
            loadToursTable();
            showAdminNotification('Тур удален!', 'success');
        }
    }
}

function showAdminNotification(message, type = 'info') {
    // Создаем уведомление
    const notification = document.createElement('div');
    const bgColor = type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : type === 'success' ? '#28a745' : '#007bff';
    
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        ">
            <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : type === 'warning' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Инициализация при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAdmin);
} else {
    initializeAdmin();
}

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
                    loadCountrySelect(); // Перезагружаем список стран
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
        loadToursTable();
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
                    <td><strong>${country.name}</strong></td>
                    <td>${country.description || 'Описание отсутствует'}</td>
                    <td><span class="tour-count-badge">${country.tours ? country.tours.length : 0}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-small" onclick="editCountry(${country.id})" title="Редактировать">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-small danger" onclick="deleteCountry(${country.id})" title="Удалить">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999; padding: 40px;">Страны не добавлены</td></tr>';
        }
    }
}

function loadToursTable() {
    if (!window.dataManager) return;
    
    const countries = window.dataManager.getCountries();
    const tbody = document.querySelector('#tours-table tbody');
    
    console.log('Loading tours table from countries:', countries);
    
    if (tbody) {
        let toursHTML = '';
        let hasTours = false;
        
        countries.forEach(country => {
            if (country.tours && country.tours.length > 0) {
                hasTours = true;
                country.tours.forEach(tour => {
                    toursHTML += `
                        <tr>
                            <td>
                                <div class="tour-info">
                                    <strong>${tour.name}</strong>
                                    <small>ID: ${tour.id}</small>
                                </div>
                            </td>
                            <td>
                                <span class="country-badge">${country.name}</span>
                            </td>
                            <td>
                                <span class="price-tag">$${tour.price}</span>
                            </td>
                            <td>
                                <span class="duration-badge">${tour.duration}</span>
                            </td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-small warning" onclick="editTour(${country.id}, ${tour.id})" title="Редактировать">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-small danger" onclick="deleteTour(${country.id}, ${tour.id})" title="Удалить">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                });
            }
        });
        
        if (hasTours) {
            tbody.innerHTML = toursHTML;
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; color: #999; padding: 40px;">
                        <i class="fas fa-map-marked-alt" style="font-size: 3rem; margin-bottom: 15px; display: block; color: #ccc;"></i>
                        <p>Туры не найдены</p>
                        <small>Добавьте первый тур используя форму выше</small>
                    </td>
                </tr>
            `;
        }
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
    
    console.log('Loading country select with:', countries);
    
    if (select) {
        if (countries.length > 0) {
            select.innerHTML = '<option value="">-- Выберите страну --</option>' + 
                countries.map(country => 
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
        const result = window.dataManager.addCountry(countryData);
        if (result) {
            form.reset();
            loadCountriesTable();
            loadCountrySelect();
            showAdminNotification(`Страна "${countryData.name}" успешно добавлена!`, 'success');
        } else {
            showAdminNotification('Ошибка при добавлении страны', 'error');
        }
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
    
    // Валидация
    if (!tourData.name) {
        showAdminNotification('Введите название тура', 'error');
        return;
    }
    
    if (!tourData.price || tourData.price <= 0) {
        showAdminNotification('Введите корректную цену', 'error');
        return;
    }
    
    if (!tourData.duration) {
        showAdminNotification('Введите длительность тура', 'error');
        return;
    }
    
    if (!countryId) {
        showAdminNotification('Выберите страну', 'error');
        return;
    }
    
    if (window.dataManager) {
        const result = window.dataManager.addTour(countryId, tourData);
        if (result) {
            form.reset();
            loadToursTable();
            showAdminNotification(`Тур "${tourData.name}" успешно добавлен!`, 'success');
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

// Функции управления странами
function editCountry(countryId) {
    if (!window.dataManager) return;
    
    const countries = window.dataManager.getCountries();
    const country = countries.find(c => c.id === countryId);
    
    if (country) {
        const newName = prompt('Введите новое название страны:', country.name);
        if (newName === null) return;
        
        const newDesc = prompt('Введите новое описание:', country.description || '');
        if (newDesc === null) return;
        
        if (newName.trim()) {
            window.dataManager.updateCountry(countryId, {
                name: newName.trim(),
                description: newDesc.trim()
            });
            loadCountriesTable();
            loadCountrySelect();
            loadToursTable(); // Обновляем туры т.к. название страны могло измениться
            showAdminNotification('Страна обновлена!', 'success');
        } else {
            showAdminNotification('Название страны не может быть пустым', 'error');
        }
    }
}

function deleteCountry(countryId) {
    if (!window.dataManager) return;
    
    const countries = window.dataManager.getCountries();
    const country = countries.find(c => c.id === countryId);
    
    if (!country) return;
    
    const tourCount = country.tours ? country.tours.length : 0;
    const message = tourCount > 0 
        ? `Вы уверены, что хотите удалить страну "${country.name}"? Все ${tourCount} туров в этой стране также будут удалены.`
        : `Вы уверены, что хотите удалить страну "${country.name}"?`;
    
    if (confirm(message)) {
        if (window.dataManager.deleteCountry(countryId)) {
            loadCountriesTable();
            loadToursTable();
            loadCountrySelect();
            showAdminNotification('Страна удалена!', 'success');
        } else {
            showAdminNotification('Ошибка при удалении страны', 'error');
        }
    }
}

// Функции управления турами
function editTour(countryId, tourId) {
    if (!window.dataManager) return;
    
    const countries = window.dataManager.getCountries();
    const country = countries.find(c => c.id === countryId);
    const tour = country?.tours?.find(t => t.id === tourId);
    
    if (tour) {
        const newName = prompt('Введите новое название тура:', tour.name);
        if (newName === null) return;
        
        const newPrice = prompt('Введите новую цену ($):', tour.price);
        if (newPrice === null) return;
        
        const newDuration = prompt('Введите новую длительность:', tour.duration);
        if (newDuration === null) return;
        
        if (newName.trim() && newPrice && newDuration.trim()) {
            const price = parseInt(newPrice);
            if (price > 0) {
                // Создаем обновленный тур
                const updatedTour = {
                    name: newName.trim(),
                    price: price,
                    duration: newDuration.trim()
                };
                
                // Удаляем старый тур и добавляем обновленный
                if (window.dataManager.deleteTour(countryId, tourId)) {
                    window.dataManager.addTour(countryId, updatedTour);
                    loadToursTable();
                    showAdminNotification('Тур обновлен!', 'success');
                }
            } else {
                showAdminNotification('Цена должна быть положительным числом', 'error');
            }
        } else {
            showAdminNotification('Все поля должны быть заполнены', 'error');
        }
    }
}

function deleteTour(countryId, tourId) {
    if (!window.dataManager) return;
    
    const countries = window.dataManager.getCountries();
    const country = countries.find(c => c.id === countryId);
    const tour = country?.tours?.find(t => t.id === tourId);
    
    if (tour && confirm(`Вы уверены, что хотите удалить тур "${tour.name}"?`)) {
        if (window.dataManager.deleteTour(countryId, tourId)) {
            loadToursTable();
            showAdminNotification('Тур удален!', 'success');
        } else {
            showAdminNotification('Ошибка при удалении тура', 'error');
        }
    }
}

function showAdminNotification(message, type = 'info') {
    // Создаем уведомление
    const notification = document.createElement('div');
    const bgColor = type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : type === 'success' ? '#28a745' : '#007bff';
    const textColor = type === 'warning' ? '#000' : '#fff';
    
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: ${textColor};
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
        ">
            <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : type === 'warning' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 4000);
}

// Инициализация при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAdmin);
} else {
    initializeAdmin();
}

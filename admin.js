// Improved Admin JavaScript
console.log('🔄 Admin JS loading...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Admin DOM loaded');
    initializeAdmin();
});

function initializeAdmin() {
    console.log('🚀 Initializing admin...');
    
    // Wait for dataManager to be ready
    const initInterval = setInterval(() => {
        if (window.dataManager) {
            clearInterval(initInterval);
            loadAdminData();
            setupAdminEventListeners();
            loadCountrySelect();
            console.log('✅ Admin initialized successfully');
        }
    }, 100);

    // Fallback timeout
    setTimeout(() => {
        clearInterval(initInterval);
        if (!window.dataManager) {
            console.error('❌ DataManager not available, using fallback');
            showAdminNotification('Ошибка загрузки данных. Обновите страницу.', 'error');
            // Try to initialize data manager manually
            if (typeof DataManager !== 'undefined') {
                window.dataManager = new DataManager();
                loadAdminData();
            }
        }
    }, 5000);
}

function setupAdminEventListeners() {
    console.log('🔧 Setting up admin event listeners...');
    
    // Form handlers
    const addCountryForm = document.getElementById('add-country-form');
    const addTourForm = document.getElementById('add-tour-form');
    const contactForm = document.getElementById('contact-form');
    const settingsForm = document.getElementById('settings-form');
    
    if (addCountryForm) {
        addCountryForm.addEventListener('submit', handleAddCountry);
        console.log('✅ Country form handler added');
    }
    
    if (addTourForm) {
        addTourForm.addEventListener('submit', handleAddTour);
        console.log('✅ Tour form handler added');
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleUpdateContacts);
        console.log('✅ Contact form handler added');
    }
    
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleUpdateSettings);
        console.log('✅ Settings form handler added');
    }
    
    // Tab handlers
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            console.log('📑 Switching to tab:', tabName);
            
            // Update active tab UI
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide tab content
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            document.getElementById(tabName + '-tab').classList.add('active');
            
            switch(tabName) {
                case 'countries':
                    loadCountriesTable();
                    break;
                case 'tours':
                    loadToursTable();
                    loadCountrySelect();
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

    // Force refresh button
    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'btn-admin secondary';
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Обновить данные';
    refreshBtn.style.marginLeft = '10px';
    refreshBtn.onclick = forceRefreshData;
    
    const headerActions = document.querySelector('.admin-nav');
    if (headerActions) {
        headerActions.appendChild(refreshBtn);
    }

    // Reset data button for emergencies
    const resetBtn = document.createElement('button');
    resetBtn.className = 'btn-admin danger';
    resetBtn.innerHTML = '<i class="fas fa-redo"></i> Сбросить данные';
    resetBtn.style.marginLeft = '10px';
    resetBtn.onclick = resetData;
    resetBtn.title = 'Восстановить стандартные данные';
    
    if (headerActions) {
        headerActions.appendChild(resetBtn);
    }
}

function resetData() {
    if (confirm('Вы уверены, что хотите сбросить все данные к стандартным? Это удалит все добавленные страны и туры.')) {
        if (window.dataManager && window.dataManager.resetToDefault) {
            window.dataManager.resetToDefault();
            loadAdminData();
            showAdminNotification('Данные сброшены к стандартным', 'success');
        }
    }
}

function forceRefreshData() {
    console.log('🔄 Force refreshing data...');
    if (window.dataManager) {
        window.dataManager.forceRefresh();
        loadAdminData();
        showAdminNotification('Данные обновлены', 'success');
    } else {
        showAdminNotification('Ошибка обновления данных', 'error');
    }
}

function loadAdminData() {
    console.log('📥 Loading admin data...');
    
    if (!window.dataManager) {
        console.error('❌ DataManager not available');
        showAdminNotification('Ошибка загрузки данных менеджера', 'error');
        return;
    }
    
    const data = window.dataManager.getData();
    console.log('📊 Admin loaded data:', {
        countries: data?.countries?.length || 0,
        tours: data ? window.dataManager.getAllTours().length : 0
    });
    
    if (data) {
        loadCountriesTable();
        loadToursTable();
        loadContactsForm();
        loadSettingsForm();
        console.log('✅ Admin data loaded successfully');
    } else {
        showAdminNotification('Данные не найдены, создаем стандартные', 'warning');
        // Try to ensure default data exists
        window.dataManager.ensureDefaultData();
        setTimeout(loadAdminData, 500);
    }
}

function loadCountriesTable() {
    console.log('🌍 Loading countries table...');
    
    if (!window.dataManager) return;
    
    const countries = window.dataManager.getCountries();
    const tbody = document.querySelector('#countries-table tbody');
    
    console.log('📋 Countries to display:', countries.length);
    
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
            console.log('✅ Countries table loaded');
        } else {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999; padding: 40px;">Страны не добавлены</td></tr>';
            console.log('📭 No countries to display');
        }
    } else {
        console.error('❌ Countries table body not found');
    }
}

function loadToursTable() {
    console.log('🗺️ Loading tours table...');
    
    if (!window.dataManager) return;
    
    const allTours = window.dataManager.getAllTours();
    const tbody = document.querySelector('#tours-table tbody');
    
    console.log('📋 Tours to display:', allTours.length);
    
    if (tbody) {
        if (allTours.length > 0) {
            tbody.innerHTML = allTours.map(tour => `
                <tr>
                    <td>
                        <div class="tour-info">
                            <strong>${tour.name}</strong>
                            <small>ID: ${tour.id}</small>
                        </div>
                    </td>
                    <td>
                        <span class="country-badge">${tour.countryName}</span>
                    </td>
                    <td>
                        <span class="price-tag">${tour.price}</span>
                    </td>
                    <td>
                        <span class="duration-badge">${tour.duration}</span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-small warning" onclick="editTour(${tour.countryId}, ${tour.id})" title="Редактировать">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-small danger" onclick="deleteTour(${tour.countryId}, ${tour.id})" title="Удалить">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
            console.log('✅ Tours table loaded');
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
            console.log('📭 No tours to display');
        }
    } else {
        console.error('❌ Tours table body not found');
    }
}

function loadContactsForm() {
    console.log('📞 Loading contacts form...');
    
    if (!window.dataManager) return;
    
    const contacts = window.dataManager.getContacts();
    const form = document.getElementById('contact-form');
    
    console.log('📋 Contacts data:', contacts);
    
    if (form) {
        form.querySelector('#contact-phone').value = contacts.phone || '';
        form.querySelector('#contact-email').value = contacts.email || '';
        form.querySelector('#contact-address').value = contacts.address || '';
        form.querySelector('#contact-hours').value = contacts.hours || '';
        console.log('✅ Contacts form loaded');
    }
}

function loadSettingsForm() {
    console.log('⚙️ Loading settings form...');
    
    if (!window.dataManager) return;
    
    const settings = window.dataManager.getSettings();
    const form = document.getElementById('settings-form');
    
    console.log('📋 Settings data:', settings);
    
    if (form) {
        form.querySelector('#site-title').value = settings.siteTitle || '';
        form.querySelector('#company-name').value = settings.companyName || '';
        console.log('✅ Settings form loaded');
    }
}

function loadCountrySelect() {
    console.log('🌍 Loading country select...');
    
    if (!window.dataManager) return;
    
    const countries = window.dataManager.getCountries();
    const select = document.getElementById('tour-country');
    
    console.log('📋 Countries for select:', countries.length);
    
    if (select) {
        if (countries.length > 0) {
            select.innerHTML = '<option value="">-- Выберите страну --</option>' + 
                countries.map(country => 
                    `<option value="${country.id}">${country.name}</option>`
                ).join('');
            console.log('✅ Country select loaded');
        } else {
            select.innerHTML = '<option value="">Сначала добавьте страны</option>';
            console.log('📭 No countries for select');
        }
    }
}

// Form handlers with improved validation
function handleAddCountry(e) {
    e.preventDefault();
    console.log('➕ Adding new country...');
    
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
    
    if (!window.dataManager) {
        showAdminNotification('Ошибка: DataManager не доступен', 'error');
        return;
    }
    
    try {
        const result = window.dataManager.addCountry(countryData);
        if (result) {
            form.reset();
            loadCountriesTable();
            loadCountrySelect();
            showAdminNotification(`Страна "${countryData.name}" успешно добавлена!`, 'success');
            console.log('✅ Country added:', countryData.name);
        } else {
            showAdminNotification('Ошибка при добавлении страны', 'error');
            console.error('❌ Failed to add country');
        }
    } catch (error) {
        console.error('❌ Error adding country:', error);
        showAdminNotification('Ошибка при добавлении страны: ' + error.message, 'error');
    }
}

function handleAddTour(e) {
    e.preventDefault();
    console.log('➕ Adding new tour...');
    
    const form = e.target;
    const formData = new FormData(form);
    
    const tourData = {
        name: formData.get('name').trim(),
        price: formData.get('price').trim(),
        duration: formData.get('duration').trim()
    };
    
    const countryId = parseInt(formData.get('country'));
    
    // Validation
    if (!tourData.name) {
        showAdminNotification('Введите название тура', 'error');
        return;
    }
    
    if (!tourData.price) {
        showAdminNotification('Введите цену тура', 'error');
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
    
    if (!window.dataManager) {
        showAdminNotification('Ошибка: DataManager не доступен', 'error');
        return;
    }
    
    try {
        const result = window.dataManager.addTour(countryId, tourData);
        if (result) {
            form.reset();
            loadToursTable();
            showAdminNotification(`Тур "${tourData.name}" успешно добавлен!`, 'success');
            console.log('✅ Tour added:', tourData.name);
        } else {
            showAdminNotification('Ошибка при добавлении тура', 'error');
            console.error('❌ Failed to add tour');
        }
    } catch (error) {
        console.error('❌ Error adding tour:', error);
        showAdminNotification('Ошибка при добавлении тура: ' + error.message, 'error');
    }
}

function handleUpdateContacts(e) {
    e.preventDefault();
    console.log('📞 Updating contacts...');
    
    const form = e.target;
    const formData = new FormData(form);
    
    const contactData = {
        phone: formData.get('phone').trim(),
        email: formData.get('email').trim(),
        address: formData.get('address').trim(),
        hours: formData.get('hours').trim()
    };
    
    if (!window.dataManager) {
        showAdminNotification('Ошибка: DataManager не доступен', 'error');
        return;
    }
    
    try {
        window.dataManager.updateContacts(contactData);
        showAdminNotification('Контактная информация обновлена!', 'success');
        console.log('✅ Contacts updated');
    } catch (error) {
        console.error('❌ Error updating contacts:', error);
        showAdminNotification('Ошибка обновления контактов: ' + error.message, 'error');
    }
}

function handleUpdateSettings(e) {
    e.preventDefault();
    console.log('⚙️ Updating settings...');
    
    const form = e.target;
    const formData = new FormData(form);
    
    const settingsData = {
        siteTitle: formData.get('siteTitle').trim(),
        companyName: formData.get('companyName').trim()
    };
    
    if (!window.dataManager) {
        showAdminNotification('Ошибка: DataManager не доступен', 'error');
        return;
    }
    
    try {
        window.dataManager.updateSettings(settingsData);
        showAdminNotification('Настройки сайта обновлены!', 'success');
        console.log('✅ Settings updated');
    } catch (error) {
        console.error('❌ Error updating settings:', error);
        showAdminNotification('Ошибка обновления настроек: ' + error.message, 'error');
    }
}

// Country management functions
function editCountry(countryId) {
    console.log('✏️ Editing country:', countryId);
    
    if (!window.dataManager) return;
    
    const countries = window.dataManager.getCountries();
    const country = countries.find(c => c.id === countryId);
    
    if (country) {
        const newName = prompt('Введите новое название страны:', country.name);
        if (newName === null) return;
        
        const newDesc = prompt('Введите новое описание:', country.description || '');
        if (newDesc === null) return;
        
        if (newName.trim()) {
            try {
                window.dataManager.updateCountry(countryId, {
                    name: newName.trim(),
                    description: newDesc.trim()
                });
                loadCountriesTable();
                loadCountrySelect();
                loadToursTable();
                showAdminNotification('Страна обновлена!', 'success');
                console.log('✅ Country updated');
            } catch (error) {
                console.error('❌ Error updating country:', error);
                showAdminNotification('Ошибка обновления страны', 'error');
            }
        } else {
            showAdminNotification('Название страны не может быть пустым', 'error');
        }
    }
}

function deleteCountry(countryId) {
    console.log('🗑️ Deleting country:', countryId);
    
    if (!window.dataManager) return;
    
    const countries = window.dataManager.getCountries();
    const country = countries.find(c => c.id === countryId);
    
    if (!country) return;
    
    const tourCount = country.tours ? country.tours.length : 0;
    const message = tourCount > 0 
        ? `Вы уверены, что хотите удалить страну "${country.name}"? Все ${tourCount} туров в этой стране также будут удалены.`
        : `Вы уверены, что хотите удалить страну "${country.name}"?`;
    
    if (confirm(message)) {
        try {
            if (window.dataManager.deleteCountry(countryId)) {
                loadCountriesTable();
                loadToursTable();
                loadCountrySelect();
                showAdminNotification('Страна удалена!', 'success');
                console.log('✅ Country deleted');
            } else {
                showAdminNotification('Ошибка при удалении страны', 'error');
            }
        } catch (error) {
            console.error('❌ Error deleting country:', error);
            showAdminNotification('Ошибка удаления страны', 'error');
        }
    }
}

// Tour management functions
function editTour(countryId, tourId) {
    console.log('✏️ Editing tour:', tourId, 'in country:', countryId);
    
    if (!window.dataManager) return;
    
    const allTours = window.dataManager.getAllTours();
    const tour = allTours.find(t => t.id === tourId && t.countryId === countryId);
    
    if (tour) {
        const newName = prompt('Введите новое название тура:', tour.name);
        if (newName === null) return;
        
        const newPrice = prompt('Введите новую цену:', tour.price);
        if (newPrice === null) return;
        
        const newDuration = prompt('Введите новую длительность:', tour.duration);
        if (newDuration === null) return;
        
        if (newName.trim() && newPrice && newDuration.trim()) {
            try {
                // Delete old tour and create new one
                if (window.dataManager.deleteTour(countryId, tourId)) {
                    window.dataManager.addTour(countryId, {
                        name: newName.trim(),
                        price: newPrice.trim(),
                        duration: newDuration.trim()
                    });
                    loadToursTable();
                    showAdminNotification('Тур обновлен!', 'success');
                    console.log('✅ Tour updated');
                }
            } catch (error) {
                console.error('❌ Error updating tour:', error);
                showAdminNotification('Ошибка обновления тура', 'error');
            }
        } else {
            showAdminNotification('Все поля должны быть заполнены', 'error');
        }
    }
}

function deleteTour(countryId, tourId) {
    console.log('🗑️ Deleting tour:', tourId, 'from country:', countryId);
    
    if (!window.dataManager) return;
    
    const allTours = window.dataManager.getAllTours();
    const tour = allTours.find(t => t.id === tourId && t.countryId === countryId);
    
    if (tour && confirm(`Вы уверены, что хотите удалить тур "${tour.name}"?`)) {
        try {
            if (window.dataManager.deleteTour(countryId, tourId)) {
                loadToursTable();
                showAdminNotification('Тур удален!', 'success');
                console.log('✅ Tour deleted');
            } else {
                showAdminNotification('Ошибка при удалении тура', 'error');
            }
        } catch (error) {
            console.error('❌ Error deleting tour:', error);
            showAdminNotification('Ошибка удаления тура', 'error');
        }
    }
}

// Notification system
function showAdminNotification(message, type = 'info') {
    console.log(`📢 ${type.toUpperCase()}: ${message}`);
    
    // Remove existing notifications
    document.querySelectorAll('.admin-notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    const bgColor = type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : type === 'success' ? '#28a745' : '#007bff';
    const textColor = type === 'warning' ? '#000' : '#fff';
    
    notification.className = 'admin-notification';
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
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; margin-left: 10px;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add CSS for notifications if not exists
if (!document.querySelector('#admin-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'admin-notification-styles';
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Debug function
window.debugAdmin = function() {
    console.log('🔍 Admin Debug Info:');
    console.log('- DataManager available:', !!window.dataManager);
    if (window.dataManager) {
        window.dataManager.debugData();
    }
    console.log('- Countries table:', document.querySelector('#countries-table tbody')?.children.length || 0, 'rows');
    console.log('- Tours table:', document.querySelector('#tours-table tbody')?.children.length || 0, 'rows');
};

console.log('✅ Admin JS loaded successfully');

// Основные функции для работы с сайтом
let currentCountries = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initializeSite();
    updateCartCount();
    
    // Слушаем обновления данных
    if (window.dataManager) {
        window.dataManager.onDataUpdate(handleDataUpdate);
    }
});

function initializeSite() {
    loadCountriesData();
    updateContactInfo();
    updateSiteSettings();
    setupEventListeners();
}

function setupEventListeners() {
    // Обработчик формы контактов
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
            this.reset();
        });
    }
}

function handleDataUpdate(data) {
    // Обновляем данные на странице при изменениях
    if (data) {
        if (data.countries) {
            currentCountries = data.countries;
            displayCountries(currentCountries);
        }
        updateContactInfo();
        updateSiteSettings();
    }
}

// Загрузка данных о странах
function loadCountriesData() {
    try {
        if (window.dataManager) {
            const data = window.dataManager.getData();
            currentCountries = data?.countries || [];
            console.log('Loaded countries:', currentCountries);
            displayCountries(currentCountries);
        } else {
            throw new Error('Data manager not available');
        }
    } catch (error) {
        console.error('Error loading countries data:', error);
        showFallbackCountries();
    }
}

// Отображение стран
function displayCountries(countriesArray) {
    const grid = document.getElementById('destinations-grid');
    const loadingMsg = document.getElementById('destinations-loading');
    const errorMsg = document.getElementById('destinations-error');
    
    if (!grid) {
        console.error('Destinations grid not found');
        return;
    }
    
    console.log('Displaying countries:', countriesArray);
    
    if (countriesArray && countriesArray.length > 0) {
        grid.innerHTML = countriesArray.map(country => `
            <div class="country-card" data-country-id="${country.id}">
                <img src="${country.image || 'images/travel-placeholder.svg'}" 
                     alt="${country.name}" 
                     onerror="this.src='images/travel-placeholder.svg'">
                <h3>${country.name}</h3>
                <p>${country.description || 'Увлекательные туры'}</p>
                ${country.tours && country.tours.length > 0 ? `
                    <div class="country-tours">
                        <h4>Доступные туры:</h4>
                        ${country.tours.map(tour => `
                            <div class="tour-item">
                                <span class="tour-name">${tour.name}</span>
                                <span class="tour-price">$${tour.price}</span>
                                <span class="tour-duration">${tour.duration}</span>
                                <button class="btn-small" onclick="addToCart(${tour.id}, '${country.name.replace(/'/g, "\\'")}', '${tour.name.replace(/'/g, "\\'")}', ${tour.price})">
                                    В корзину
                                </button>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p class="no-tours">Туры пока не добавлены</p>'}
            </div>
        `).join('');
        
        if (loadingMsg) loadingMsg.style.display = 'none';
        if (errorMsg) errorMsg.style.display = 'none';
    } else {
        showFallbackCountries();
    }
}

function showFallbackCountries() {
    const grid = document.getElementById('destinations-grid');
    const loadingMsg = document.getElementById('destinations-loading');
    
    if (grid) {
        grid.innerHTML = `
            <div class="no-countries-message">
                <i class="fas fa-globe-americas"></i>
                <h3>Направления пока не добавлены</h3>
                <p>Используйте панель администратора для добавления стран и туров</p>
                <button class="cta-button" onclick="openAdminPanel()">Добавить направления</button>
            </div>
        `;
        if (loadingMsg) loadingMsg.style.display = 'none';
    }
}

// Обновление контактной информации
function updateContactInfo() {
    if (!window.dataManager) {
        console.error('Data manager not available for contacts');
        return;
    }
    
    const contacts = window.dataManager.getContacts();
    console.log('Updating contacts with:', contacts);
    
    // Обновляем контакты в секции contact
    document.querySelectorAll('.contact-item').forEach(item => {
        const strong = item.querySelector('strong');
        if (strong) {
            const text = strong.textContent;
            if (text.includes('Телефон')) {
                const p = item.querySelector('p');
                if (p) p.textContent = contacts.phone || '+7 (999) 123-45-67';
            } else if (text.includes('Email')) {
                const p = item.querySelector('p');
                if (p) p.textContent = contacts.email || 'info@worldtravel.com';
            } else if (text.includes('Адрес')) {
                const p = item.querySelector('p');
                if (p) p.textContent = contacts.address || 'Москва, ул. Туристическая, 15';
            } else if (text.includes('Часы работы')) {
                const p = item.querySelector('p');
                if (p) p.textContent = contacts.hours || 'Пн-Пт: 9:00-18:00';
            }
        }
    });
    
    // Обновляем контакты в футере
    const footerSection = document.querySelector('.footer-section:last-child');
    if (footerSection) {
        const paragraphs = footerSection.querySelectorAll('p');
        if (paragraphs[0]) {
            paragraphs[0].innerHTML = `<i class="fas fa-phone"></i> ${contacts.phone || '+7 (999) 123-45-67'}`;
        }
        if (paragraphs[1]) {
            paragraphs[1].innerHTML = `<i class="fas fa-envelope"></i> ${contacts.email || 'info@worldtravel.com'}`;
        }
    }
}

// Обновление настроек сайта
function updateSiteSettings() {
    if (!window.dataManager) return;
    
    const settings = window.dataManager.getSettings();
    console.log('Updating settings with:', settings);
    
    // Обновляем заголовок страницы
    if (settings.siteTitle) {
        document.title = settings.siteTitle;
    }
    
    // Обновляем название компании в хедере
    const logo = document.querySelector('.logo h2');
    if (logo && settings.companyName) {
        const icon = logo.querySelector('i');
        if (icon) {
            logo.innerHTML = `${icon.outerHTML} ${settings.companyName}`;
        } else {
            logo.innerHTML = `<i class="fas fa-globe-americas"></i> ${settings.companyName}`;
        }
    }
    
    // Обновляем название компании в футере
    const footerLogo = document.querySelector('.footer-section h3');
    if (footerLogo && settings.companyName) {
        const icon = footerLogo.querySelector('i');
        if (icon) {
            footerLogo.innerHTML = `${icon.outerHTML} ${settings.companyName}`;
        } else {
            footerLogo.innerHTML = `<i class="fas fa-globe-americas"></i> ${settings.companyName}`;
        }
    }
}

// Функции корзины
function addToCart(tourId, countryName, tourName, price) {
    const existingItem = cart.find(item => item.tourId === tourId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            tourId: tourId,
            countryName: countryName,
            tourName: tourName,
            price: price,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Тур добавлен в корзину!');
}

function removeFromCart(tourId) {
    cart = cart.filter(item => item.tourId !== tourId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Функции админ-панели
function openAdminPanel() {
    window.location.href = 'admin-login.html';
}

function scrollToDestinations() {
    const destinations = document.getElementById('destinations');
    if (destinations) {
        destinations.scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
}

// Принудительная перезагрузка данных (для отладки)
function reloadData() {
    if (window.dataManager) {
        const data = window.dataManager.getData();
        console.log('Current data:', data);
        handleDataUpdate(data);
    }
}

// Экспортируем функции для глобального использования
window.reloadData = reloadData;
window.openAdminPanel = openAdminPanel;
window.scrollToDestinations = scrollToDestinations;

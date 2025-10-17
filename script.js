// Основные функции для работы с сайтом
let currentCountries = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let filteredCountries = [];

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
    initializeFilters();
}

function setupEventListeners() {
    // Обработчик формы контактов
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
            this.reset();
        });
    }
}

function initializeFilters() {
    const searchInput = document.querySelector('.search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            filterCountries(e.target.value);
        });
    }
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            applyFilter(filter);
        });
    });
}

function filterCountries(searchTerm) {
    if (!searchTerm) {
        displayCountries(currentCountries);
        return;
    }
    
    const filtered = currentCountries.filter(country => 
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (country.tours && country.tours.some(tour => 
            tour.name.toLowerCase().includes(searchTerm.toLowerCase())
        ))
    );
    
    displayCountries(filtered);
}

function applyFilter(filter) {
    let filtered = [...currentCountries];
    
    switch(filter) {
        case 'popular':
            filtered = filtered.sort((a, b) => (b.tours?.length || 0) - (a.tours?.length || 0));
            break;
        case 'cheap':
            filtered = filtered.filter(country => 
                country.tours && country.tours.some(tour => tour.price < 600)
            ).sort((a, b) => {
                const aMinPrice = Math.min(...a.tours.map(t => t.price));
                const bMinPrice = Math.min(...b.tours.map(t => t.price));
                return aMinPrice - bMinPrice;
            });
            break;
        case 'exotic':
            const exoticCountries = ['Тайланд', 'Бали', 'Мальдивы', 'Доминикана', 'Куба'];
            filtered = filtered.filter(country => 
                exoticCountries.some(name => country.name.toLowerCase().includes(name.toLowerCase()))
            );
            break;
        default:
            filtered = currentCountries;
    }
    
    displayCountries(filtered);
}

function handleDataUpdate(data) {
    console.log('Data update received:', data);
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
        grid.innerHTML = countriesArray.map((country, index) => `
            <div class="country-card" data-country-id="${country.id}" style="animation-delay: ${index * 0.1}s">
                <div class="country-image">
                    <img src="${country.image || 'images/travel-placeholder.svg'}" 
                         alt="${country.name}" 
                         onerror="this.src='images/travel-placeholder.svg'">
                    <div class="country-overlay">
                        <div>
                            <h3 class="country-name">${country.name}</h3>
                            <div class="tour-count">${country.tours ? country.tours.length : 0} туров</div>
                        </div>
                    </div>
                </div>
                <div class="country-content">
                    <p class="country-description">${country.description || 'Увлекательные туры и незабываемые впечатления'}</p>
                    
                    ${country.tours && country.tours.length > 0 ? `
                        <div class="country-tours">
                            <h4><i class="fas fa-route"></i> Популярные туры</h4>
                            ${country.tours.slice(0, 3).map(tour => `
                                <div class="tour-item">
                                    <span class="tour-name">${tour.name}</span>
                                    <span class="tour-price">$${tour.price}</span>
                                    <span class="tour-duration">${tour.duration}</span>
                                    <button class="btn-small" onclick="addToCart(${tour.id}, '${country.name.replace(/'/g, "\\'")}', '${tour.name.replace(/'/g, "\\'")}', ${tour.price})">
                                        <i class="fas fa-cart-plus"></i> В корзину
                                    </button>
                                </div>
                            `).join('')}
                            ${country.tours.length > 3 ? `
                                <div class="more-tours">
                                    <small>+ еще ${country.tours.length - 3} туров</small>
                                </div>
                            ` : ''}
                        </div>
                    ` : `
                        <div class="no-tours-message">
                            <p style="color: #999; font-style: italic; text-align: center;">
                                <i class="fas fa-info-circle"></i> Туры скоро появятся
                            </p>
                        </div>
                    `}
                    
                    <button class="explore-btn" onclick="exploreCountry(${country.id})">
                        <i class="fas fa-search"></i> Исследовать
                    </button>
                </div>
            </div>
        `).join('');
        
        if (loadingMsg) loadingMsg.style.display = 'none';
        if (errorMsg) errorMsg.style.display = 'none';
    } else {
        showFallbackCountries();
    }
}

function exploreCountry(countryId) {
    const country = currentCountries.find(c => c.id === countryId);
    if (country) {
        showNotification(`Исследуем ${country.name}! 🗺️`, 'info');
        // Здесь можно добавить переход на детальную страницу страны
    }
}

function showFallbackCountries() {
    const grid = document.getElementById('destinations-grid');
    const loadingMsg = document.getElementById('destinations-loading');
    
    if (grid) {
        grid.innerHTML = `
            <div class="no-countries-message float-animation">
                <i class="fas fa-globe-americas"></i>
                <h3>Мир ждет открытий!</h3>
                <p>Направления скоро появятся. А пока можете ознакомиться с нашими услугами.</p>
                <button class="cta-button pulse-animation" onclick="openAdminPanel()">
                    <i class="fas fa-plus"></i> Добавить направления
                </button>
            </div>
        `;
        if (loadingMsg) loadingMsg.style.display = 'none';
    }
}

// Обновление контактной информации
function updateContactInfo() {
    if (!window.dataManager) return;
    
    const contacts = window.dataManager.getContacts();
    
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
}

// Обновление настроек сайта
function updateSiteSettings() {
    if (!window.dataManager) return;
    
    const settings = window.dataManager.getSettings();
    
    if (settings.siteTitle) {
        document.title = settings.siteTitle;
    }
    
    const logo = document.querySelector('.logo h2');
    if (logo && settings.companyName) {
        logo.innerHTML = `<i class="fas fa-globe-americas"></i> ${settings.companyName}`;
    }
    
    const footerLogo = document.querySelector('.footer-section h3');
    if (footerLogo && settings.companyName) {
        footerLogo.innerHTML = `<i class="fas fa-globe-americas"></i> ${settings.companyName}`;
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
    showNotification(`Тур "${tourName}" добавлен в корзину! 🎉`, 'success');
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = total;
        cartCount.style.display = total > 0 ? 'flex' : 'none';
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        ${message}
    `;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#007bff'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Функции навигации
function openAdminPanel() {
    window.location.href = 'admin-login.html';
}

function scrollToDestinations() {
    const destinations = document.getElementById('destinations');
    if (destinations) {
        destinations.scrollIntoView({ behavior: 'smooth' });
    }
}

// Глобальные функции
window.reloadData = function() {
    if (window.dataManager) {
        const data = window.dataManager.getData();
        handleDataUpdate(data);
    }
};

window.openAdminPanel = openAdminPanel;
window.scrollToDestinations = scrollToDestinations;

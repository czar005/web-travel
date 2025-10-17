// Основные функции для работы с турами
let countries = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Загрузка данных при старте
document.addEventListener('DOMContentLoaded', function() {
    loadCountriesData();
    updateCartCount();
});

// Загрузка данных о странах
async function loadCountriesData() {
    try {
        const response = await fetch('data/content.json');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        countries = data.countries || [];
        window.countries = countries; // Делаем глобально доступным
        
        // Обновляем отображение если есть контейнер
        const countriesGrid = document.getElementById('countries-grid');
        if (countriesGrid && countries.length > 0) {
            displayCountries(countries);
        }
    } catch (error) {
        console.error('Error loading countries data:', error);
        // Используем fallback данные
        countries = [
            { 
                id: 1, 
                name: 'Франция', 
                image: 'images/travel-placeholder.svg', 
                description: 'Романтический Париж и Лазурный берег',
                tours: []
            },
            { 
                id: 2, 
                name: 'Италия', 
                image: 'images/travel-placeholder.svg', 
                description: 'Вкусная кухня и богатая история',
                tours: []
            },
            { 
                id: 3, 
                name: 'Испания', 
                image: 'images/travel-placeholder.svg', 
                description: 'Солнечные пляжи и яркая культура',
                tours: []
            },
            { 
                id: 4, 
                name: 'Греция', 
                image: 'images/travel-placeholder.svg', 
                description: 'Античные руины и островной отдых',
                tours: []
            }
        ];
        window.countries = countries;
    }
}

// Отображение стран
function displayCountries(countriesArray) {
    const grid = document.getElementById('countries-grid');
    const loadingMsg = document.getElementById('loading-message');
    const errorMsg = document.getElementById('error-message');
    
    if (!grid) return;
    
    if (countriesArray && countriesArray.length > 0) {
        grid.innerHTML = countriesArray.map(country => `
            <div class="country-card">
                <img src="${country.image || 'images/travel-placeholder.svg'}" 
                     alt="${country.name}" 
                     onerror="this.src='images/travel-placeholder.svg'">
                <h3>${country.name}</h3>
                <p>${country.description || 'Увлекательные туры'}</p>
            </div>
        `).join('');
        
        if (loadingMsg) loadingMsg.style.display = 'none';
        if (errorMsg) errorMsg.style.display = 'none';
    }
}

// Обновление счетчика корзины
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
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
    alert('Тур добавлен в корзину!');
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

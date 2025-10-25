// Enhanced main page script with content updates
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
    
    // Apply content updates after a short delay to ensure dataManager is ready
    setTimeout(() => {
        if (window.updatePageContent) {
            window.updatePageContent();
        }
    }, 500);
});

function initializePage() {
    loadCountriesData();
    setupAnimations();
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', filterDestinations);
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
}

function loadCountriesData() {
    const grid = document.getElementById('destinations-grid');
    const loading = document.getElementById('destinations-loading');
    const error = document.getElementById('destinations-error');

    if (!grid) return;

    // Show loading
    if (loading) loading.style.display = 'block';
    if (error) error.style.display = 'none';
    grid.innerHTML = '';

    setTimeout(() => {
        try {
            if (window.dataManager) {
                const data = window.dataManager.getData();
                const countries = data?.countries || [];
                
                console.log('Loading countries data:', countries.length, 'countries');
                
                if (countries.length > 0) {
                    displayCountries(countries);
                    if (loading) loading.style.display = 'none';
                } else {
                    showNoCountriesMessage();
                }
            } else {
//                throw new Error('Data manager not available');
//            }
//        } catch (err) {
//            console.error('Error loading countries:', err);
//            if (loading) loading.style.display = 'none';
//            if (error) error.style.display = 'block';
//        }
    }, 1000);
}

function displayCountries(countries) {
    const grid = document.getElementById('destinations-grid');
    if (!grid) return;

    grid.innerHTML = countries.map(country => {
        const tours = country.tours || [];
        
        return `
            <div class="country-card" data-country="${country.name.toLowerCase()}">
                <div class="country-image">
                    <img src="${country.image || 'images/travel-placeholder.svg'}" alt="${country.name}" onerror="this.src='images/travel-placeholder.svg'">
                    <div class="country-overlay">
                        <h3 class="country-name">${country.name}</h3>
                    </div>
                </div>
                <div class="country-content">
                    <p class="country-description">${country.description || 'Описание страны'}</p>
                    ${country.price ? `<div class="country-price">${country.price}</div>` : ''}
                    
                    ${tours.length > 0 ? `
                        <div class="country-tours">
                            <h4><i class="fas fa-map-marked-alt"></i> Доступные туры</h4>
                            ${tours.map(tour => `
                                <div class="tour-item">
                                    <div class="tour-name">${tour.name}</div>
                                    <div class="tour-price">${tour.price}</div>
                                    <div class="tour-duration">${tour.duration}</div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    <button class="explore-btn" onclick="exploreCountry('${country.name}')">
                        <i class="fas fa-search"></i> Исследовать
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function showNoCountriesMessage() {
    const grid = document.getElementById('destinations-grid');
    if (!grid) return;

    grid.innerHTML = `
        <div class="no-countries-message" style="grid-column: 1 / -1;">
            <i class="fas fa-globe-americas"></i>
            <h3>Страны не найдены</h3>
            <p>Добавьте страны через админ-панель</p>
            <a href="admin.html" class="btn-admin" style="margin-top: 15px;">
                <i class="fas fa-cog"></i> Перейти в админку
            </a>
        </div>
    `;
}

function filterDestinations(e) {
    const searchTerm = e.target.value.toLowerCase();
    const countryCards = document.querySelectorAll('.country-card');
    
    countryCards.forEach(card => {
        const countryName = card.getAttribute('data-country');
        const textContent = card.textContent.toLowerCase();
        
        if (countryName.includes(searchTerm) || textContent.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function exploreCountry(countryName) {
    alert(`Исследуем ${countryName}! Эта функция в разработке.`);
}

function setupAnimations() {
    // Counter animation
    const counters = document.querySelectorAll('.animate-counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        if (target) {
            animateCounter(counter.querySelector('h3'), 0, target, 2000);
        }
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observe all animate-able elements
    document.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-top, .slide-in-bottom').forEach(el => {
        observer.observe(el);
    });
}

function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Global functions
function scrollToDestinations() {
    const destinations = document.getElementById('destinations');
    if (destinations) {
        destinations.scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
}

// Refresh data when coming from admin
if (window.location.search.includes('fromAdmin=true')) {
    setTimeout(() => {
        loadCountriesData();
        if (window.updatePageContent) {
            window.updatePageContent();
        }
    }, 500);
}

// Auto-refresh content when data changes
window.addEventListener('dataUpdated', function() {
    console.log('Main page: data updated, refreshing...');
    setTimeout(() => {
        loadCountriesData();
        if (window.updatePageContent) {
            window.updatePageContent();
        }
    }, 100);
});

// Main script for WorldTravel website
console.log('🎯 WorldTravel script loaded');

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing WorldTravel website...');
    
    initializeNavigation();
    initializeAnimations();
    initializeDestinations();
    initializeContactForm();
    
    if (window.contentSync) {
        console.log('✅ ContentSync ready');
    }
});

// Navigation functions
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });

    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }
    });
}

// Animation functions
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                if (entry.target.classList.contains('animate-counter')) {
                    initializeCounters();
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-fade-in, .animate-fade-in-delay, .slide-in-left, .slide-in-right, .slide-in-top, .slide-in-bottom, .animate-counter').forEach(el => {
        observer.observe(el);
    });

    initializeFloatingElements();
}

function initializeFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.5}s`;
    });
}

function initializeCounters() {
    const counters = document.querySelectorAll('.animate-counter[data-target]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.querySelector('h3').textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.querySelector('h3').textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Destinations functions
function initializeDestinations() {
    loadDestinations();
    setupSearch();
    setupFilters();
}

function loadDestinations() {
    const grid = document.getElementById('destinations-grid');
    const loading = document.getElementById('destinations-loading');
    const error = document.getElementById('destinations-error');
    
    if (!grid) return;
    
    try {
        const countries = window.dataManager?.getCountries() || [];
        
        if (countries.length === 0) {
            showError('Нет данных о направлениях');
            return;
        }
        
        if (loading) loading.style.display = 'none';
        if (error) error.style.display = 'none';
        grid.style.display = 'grid';
        
        grid.innerHTML = countries.map(country => createCountryCard(country)).join('');
        
        // Re-initialize animations for new cards
        initializeCardAnimations();
        
    } catch (error) {
        console.error('❌ Error loading destinations:', error);
        showError('Ошибка загрузки направлений');
    }
}

function createCountryCard(country) {
    const popularBadge = country.popular ? '<div class="popular-badge"><i class="fas fa-star"></i> Популярное</div>' : '';
    const toursCount = country.tours ? country.tours.length : 0;
    
    return `
        <div class="country-card" data-country="${country.name.toLowerCase()}" data-popular="${country.popular}">
            <div class="country-card-image">
                <img src="${country.image}" alt="${country.name}" loading="lazy">
                <div class="country-card-overlay">
                    ${popularBadge}
                    <div class="country-flag">${country.flag}</div>
                </div>
                <div class="country-card-gradient"></div>
            </div>
            
            <div class="country-card-content">
                <div class="country-card-header">
                    <h3 class="country-name">${country.name}</h3>
                    <div class="tours-count">${toursCount} ${getTourWord(toursCount)}</div>
                </div>
                
                <p class="country-description">${country.description}</p>
                
                <div class="country-meta">
                    <div class="season-info">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${country.season}</span>
                    </div>
                </div>
                
                <div class="tours-preview">
                    ${country.tours ? country.tours.slice(0, 2).map(tour => `
                        <div class="tour-preview-item">
                            <div class="tour-preview-info">
                                <h4>${tour.name}</h4>
                                <div class="tour-preview-meta">
                                    <span class="tour-price">${tour.price}</span>
                                    <span class="tour-duration">${tour.duration}</span>
                                </div>
                            </div>
                            ${tour.rating ? `<div class="tour-rating">
                                <i class="fas fa-star"></i>
                                <span>${tour.rating}</span>
                            </div>` : ''}
                        </div>
                    `).join('') : '<p class="no-tours">Туры не добавлены</p>'}
                </div>
                
                <div class="country-card-actions">
                    <button class="btn-view-tours" onclick="viewCountryTours(${country.id})">
                        <i class="fas fa-eye"></i>
                        Смотреть туры
                    </button>
                    <button class="btn-favorite" onclick="toggleFavorite(${country.id})">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function getTourWord(count) {
    if (count === 1) return 'тур';
    if (count >= 2 && count <= 4) return 'тура';
    return 'туров';
}

function initializeCardAnimations() {
    const cards = document.querySelectorAll('.country-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        observer.observe(card);
    });
}

function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const countryCards = document.querySelectorAll('.country-card');
        
        countryCards.forEach(card => {
            const countryName = card.querySelector('.country-name').textContent.toLowerCase();
            const countryDescription = card.querySelector('.country-description').textContent.toLowerCase();
            const tours = card.querySelectorAll('.tour-preview-item h4');
            
            let hasMatch = countryName.includes(searchTerm) || countryDescription.includes(searchTerm);
            
            if (!hasMatch && tours.length > 0) {
                hasMatch = Array.from(tours).some(tour => 
                    tour.textContent.toLowerCase().includes(searchTerm)
                );
            }
            
            card.style.display = hasMatch ? 'block' : 'none';
        });
    });
}

function setupFilters() {
    const filterContainer = document.querySelector('.filters-container');
    if (!filterContainer) {
        createFilters();
    }
}

function createFilters() {
    const searchBox = document.querySelector('.search-box');
    if (!searchBox) return;
    
    const filtersHTML = `
        <div class="filters-container">
            <div class="filter-group">
                <button class="filter-btn active" data-filter="all">
                    <i class="fas fa-globe-americas"></i>
                    Все страны
                </button>
                <button class="filter-btn" data-filter="popular">
                    <i class="fas fa-star"></i>
                    Популярные
                </button>
            </div>
            <div class="sort-group">
                <select class="sort-select">
                    <option value="name">По названию</option>
                    <option value="tours">По количеству туров</option>
                    <option value="popular">По популярности</option>
                </select>
            </div>
        </div>
    `;
    
    searchBox.insertAdjacentHTML('afterend', filtersHTML);
    
    // Add filter event listeners
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterCountries(filter);
        });
    });
    
    document.querySelector('.sort-select')?.addEventListener('change', function(e) {
        sortCountries(e.target.value);
    });
}

function filterCountries(filter) {
    const cards = document.querySelectorAll('.country-card');
    
    cards.forEach(card => {
        switch(filter) {
            case 'all':
                card.style.display = 'block';
                break;
            case 'popular':
                const isPopular = card.getAttribute('data-popular') === 'true';
                card.style.display = isPopular ? 'block' : 'none';
                break;
        }
    });
}

function sortCountries(criteria) {
    const grid = document.getElementById('destinations-grid');
    const cards = Array.from(document.querySelectorAll('.country-card'));
    
    cards.sort((a, b) => {
        switch(criteria) {
            case 'name':
                return a.querySelector('.country-name').textContent.localeCompare(b.querySelector('.country-name').textContent);
            case 'tours':
                const aTours = parseInt(a.querySelector('.tours-count').textContent);
                const bTours = parseInt(b.querySelector('.tours-count').textContent);
                return bTours - aTours;
            case 'popular':
                const aPopular = a.getAttribute('data-popular') === 'true';
                const bPopular = b.getAttribute('data-popular') === 'true';
                return bPopular - aPopular;
            default:
                return 0;
        }
    });
    
    cards.forEach(card => grid.appendChild(card));
    initializeCardAnimations();
}

function viewCountryTours(countryId) {
    // Здесь можно реализовать модальное окно с деталями страны
    console.log('View tours for country:', countryId);
    alert('Функция просмотра туров будет реализована в следующем обновлении!');
}

function toggleFavorite(countryId) {
    // Здесь можно реализовать добавление в избранное
    console.log('Toggle favorite for country:', countryId);
}

function showError(message) {
    const loading = document.getElementById('destinations-loading');
    const error = document.getElementById('destinations-error');
    
    if (loading) loading.style.display = 'none';
    if (error) {
        error.style.display = 'block';
        error.querySelector('i').nextSibling.textContent = ' ' + message;
    }
}

// Contact form functions
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message');
            
            if (!name || !email || !message) {
                alert('Пожалуйста, заполните обязательные поля');
                return;
            }
            
            console.log('📧 Contact form submitted:', { name, email, phone, message });
            alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
            this.reset();
        });
    }
}

// Utility functions
function scrollToDestinations() {
    const destinations = document.getElementById('destinations');
    if (destinations) {
        destinations.scrollIntoView({ behavior: 'smooth' });
    }
}

// Global functions for external access
window.loadDestinations = loadDestinations;
window.scrollToDestinations = scrollToDestinations;

console.log('✅ WorldTravel script initialized');

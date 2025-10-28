// Main script for WorldTravel website - Safe Image Loading
console.log('🎯 WorldTravel script loading...');

// Safe image loader with fallback
function safeImageLoader(imgElement, src, fallbackSrc = 'images/travel-placeholder.svg') {
    if (!imgElement || !src) return;
    
    // Validate source
    if (src === 'undefined' || src.includes('undefined')) {
        console.warn('⚠️ Invalid image source detected, using fallback:', src);
        imgElement.src = fallbackSrc;
        return;
    }
    
    const img = new Image();
    img.onload = function() {
        imgElement.src = src;
    };
    img.onerror = function() {
        console.warn('⚠️ Image load failed, using fallback:', src);
        imgElement.src = fallbackSrc;
    };
    img.src = src;
}

function initializeWorldTravel() {
    try {
        console.log('🚀 Initializing WorldTravel website...');
        
        const checkDataManager = setInterval(() => {
            if (window.dataManager && window.dataManager.initialized) {
                clearInterval(checkDataManager);
                safeInitialize();
            }
        }, 100);

        setTimeout(() => {
            clearInterval(checkDataManager);
            if (!window.dataManager) {
                console.warn('⚠️ DataManager not available, initializing without it');
                safeInitialize();
            }
        }, 3000);

    } catch (error) {
        console.error('❌ Error in main initialization:', error);
    }
}

function safeInitialize() {
    try {
        initializeNavigation();
        initializeAnimations();
        initializeDestinations();
        initializeContactForm();
        
        console.log('✅ WorldTravel initialized successfully');
    } catch (error) {
        console.error('❌ Error in safeInitialize:', error);
    }
}

// Navigation functions
function initializeNavigation() {
    try {
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
                    
                    if (navLinks && navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        hamburger.classList.remove('active');
                    }
                }
            });
        });

        window.addEventListener('scroll', function() {
            const header = document.querySelector('.header');
            if (header) {
                if (window.scrollY > 100) {
                    header.style.background = 'rgba(255, 255, 255, 0.95)';
                    header.style.backdropFilter = 'blur(10px)';
                } else {
                    header.style.background = 'rgba(255, 255, 255, 0.95)';
                    header.style.backdropFilter = 'blur(10px)';
                }
            }
        });
    } catch (error) {
        console.error('❌ Error initializing navigation:', error);
    }
}

// Animation functions
function initializeAnimations() {
    try {
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
    } catch (error) {
        console.error('❌ Error initializing animations:', error);
    }
}

function initializeFloatingElements() {
    try {
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.5}s`;
        });
    } catch (error) {
        console.error('❌ Error initializing floating elements:', error);
    }
}

function initializeCounters() {
    try {
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
    } catch (error) {
        console.error('❌ Error initializing counters:', error);
    }
}

// Destinations functions
function initializeDestinations() {
    try {
        loadDestinations();
        setupSearch();
    } catch (error) {
        console.error('❌ Error initializing destinations:', error);
    }
}

function loadDestinations() {
    try {
        const grid = document.getElementById('destinations-grid');
        const loading = document.getElementById('destinations-loading');
        const error = document.getElementById('destinations-error');
        
        if (!grid) return;
        
        let countries = [];
        if (window.dataManager && window.dataManager.getCountries) {
            countries = window.dataManager.getCountries();
        }
        
        if (countries.length === 0) {
            showError('Нет данных о направлениях');
            return;
        }
        
        if (loading) loading.style.display = 'none';
        if (error) error.style.display = 'none';
        grid.style.display = 'grid';
        
        grid.innerHTML = countries.map(country => createCountryCard(country)).join('');
        
        initializeCardAnimations();
        
    } catch (error) {
        console.error('❌ Error loading destinations:', error);
        showError('Ошибка загрузки направлений');
    }
}

function createCountryCard(country) {
    const popularBadge = country.popular ? '<div class="popular-badge"><i class="fas fa-star"></i> Популярное</div>' : '';
    const toursCount = country.tours ? country.tours.length : 0;
    
    // Safe image handling
    const countryImage = country.image && country.image !== 'undefined' ? country.image : 'images/travel-placeholder.svg';
    
    return `
        <div class="country-card" data-country="${country.name.toLowerCase()}" data-popular="${country.popular}">
            <div class="country-card-image">
                <img src="images/travel-placeholder.svg" 
                     data-src="${countryImage}"
                     alt="${country.name}" 
                     loading="lazy"
                     class="country-image">
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
    try {
        const cards = document.querySelectorAll('.country-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                    
                    // Load images when card becomes visible
                    const img = entry.target.querySelector('.country-image');
                    if (img && img.dataset.src) {
                        safeImageLoader(img, img.dataset.src);
                    }
                    
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
    } catch (error) {
        console.error('❌ Error initializing card animations:', error);
    }
}

function setupSearch() {
    try {
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
    } catch (error) {
        console.error('❌ Error setting up search:', error);
    }
}

function viewCountryTours(countryId) {
    console.log('View tours for country:', countryId);
}

function toggleFavorite(countryId) {
    console.log('Toggle favorite for country:', countryId);
}

function showError(message) {
    try {
        const loading = document.getElementById('destinations-loading');
        const error = document.getElementById('destinations-error');
        
        if (loading) loading.style.display = 'none';
        if (error) {
            error.style.display = 'block';
            error.querySelector('i').nextSibling.textContent = ' ' + message;
        }
    } catch (error) {
        console.error('❌ Error showing error message:', error);
    }
}

// Contact form functions
function initializeContactForm() {
    try {
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
    } catch (error) {
        console.error('❌ Error initializing contact form:', error);
    }
}

// Utility functions
function scrollToDestinations() {
    try {
        const destinations = document.getElementById('destinations');
        if (destinations) {
            destinations.scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        console.error('❌ Error scrolling to destinations:', error);
    }
}

// Global functions
window.loadDestinations = loadDestinations;
window.scrollToDestinations = scrollToDestinations;
window.safeImageLoader = safeImageLoader;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWorldTravel);
} else {
    initializeWorldTravel();
}

console.log('✅ WorldTravel script loaded successfully');

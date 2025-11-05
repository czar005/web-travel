// Enhanced main script with country images and fixed stats
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Main script initialized');
    
    // Initialize components
    initNavigation();
    initAnimations();
    loadDestinations();
    initContactForm();
    
    // Load dynamic content
    loadDynamicContent();
    
    // Start content sync
    startContentSync();
});

function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
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
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });
}

function initAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animate counters
                if (entry.target.classList.contains('animate-counter')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.service-card, .stat, .destination-card').forEach(el => {
        observer.observe(el);
    });
}

function animateCounter(counterElement) {
    const target = parseInt(counterElement.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(function() {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        counterElement.querySelector('h3').textContent = Math.floor(current).toLocaleString();
    }, 16);
}

function loadDestinations() {
    const grid = document.getElementById('destinations-grid');
    const loading = document.getElementById('destinations-loading');
    const error = document.getElementById('destinations-error');
    
    if (!grid) return;
    
    console.log('🌍 Loading destinations...');
    
    // Show loading
    if (loading) loading.style.display = 'block';
    if (error) error.style.display = 'none';
    
    // Load from data manager
    setTimeout(() => {
        try {
            if (window.dataManager) {
                const countries = window.dataManager.getCountries();
                console.log('📋 Countries loaded:', countries.length);
                
                if (countries.length > 0) {
                    renderDestinations(grid, countries);
                    if (loading) loading.style.display = 'none';
                } else {
                    showNoDestinations(grid, loading);
                }
            } else {
                throw new Error('DataManager not available');
            }
        } catch (err) {
            console.error('❌ Error loading destinations:', err);
            showError(loading, error);
        }
    }, 1000);
}

function renderDestinations(grid, countries) {
    grid.innerHTML = countries.map(country => `
        <div class="destination-card slide-in-bottom">
            <div class="destination-image">
                <img src="${country.image || 'images/travel-placeholder.svg'}" 
                     alt="${country.name}" 
                     onerror="this.src='images/travel-placeholder.svg'">
                <div class="destination-overlay">
                    <h3>${country.name}</h3>
                </div>
            </div>
            <div class="destination-content">
                <p>${country.description || 'Описание страны'}</p>
                ${country.tours && country.tours.length > 0 ? `
                    <div class="tours-list">
                        <h4>Доступные туры:</h4>
                        ${country.tours.slice(0, 3).map(tour => `
                            <div class="tour-item">
                                <span class="tour-name">${tour.name}</span>
                                <span class="tour-price">${tour.price}</span>
                                <span class="tour-duration">${tour.duration}</span>
                            </div>
                        `).join('')}
                        ${country.tours.length > 3 ? 
                            `<div class="more-tours">+ еще ${country.tours.length - 3} туров</div>` : ''}
                    </div>
                ` : '<p class="no-tours">Туры скоро появятся</p>'}
            </div>
        </div>
    `).join('');
    
    console.log('✅ Destinations rendered:', countries.length);
}

function showNoDestinations(grid, loading) {
    grid.innerHTML = `
        <div class="no-destinations" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
            <i class="fas fa-globe-americas" style="font-size: 4rem; color: #ccc; margin-bottom: 20px;"></i>
            <h3 style="color: #666; margin-bottom: 10px;">Направления пока не добавлены</h3>
            <p style="color: #999;">Скоро здесь появятся увлекательные путешествия</p>
        </div>
    `;
    if (loading) loading.style.display = 'none';
}

function showError(loading, error) {
    if (loading) loading.style.display = 'none';
    if (error) error.style.display = 'block';
}

function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#dc3545';
                } else {
                    input.style.borderColor = '#ddd';
                }
            });
            
            if (isValid) {
                // Show success message
                alert('Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.');
                form.reset();
            } else {
                alert('Пожалуйста, заполните все обязательные поля.');
            }
        });
    }
}

function scrollToDestinations() {
    const destinations = document.getElementById('destinations');
    if (destinations) {
        destinations.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function loadDynamicContent() {
    // This will be populated by content-sync.js
    console.log('📄 Loading dynamic content...');
}

function startContentSync() {
    // Start checking for content updates
    setInterval(updateDynamicContent, 2000);
}

function updateDynamicContent() {
    // Update stats
    updateStats();
    
    // Update services
    updateServices();
    
    // Update other dynamic content
    updateContentSections();
}

function updateStats() {
    if (!window.dataManager) return;
    
    const data = window.dataManager.getData();
    if (!data?.content?.about?.stats) return;
    
    const stats = data.content.about.stats;
    const statElements = document.querySelectorAll('.stat');
    
    console.log('📊 Updating stats:', stats.length);
    
    stats.forEach((stat, index) => {
        if (statElements[index]) {
            const valueElement = statElements[index].querySelector('h3');
            const labelElement = statElements[index].querySelector('p');
            
            if (valueElement) {
                valueElement.textContent = stat.value;
                valueElement.setAttribute('data-target', stat.value);
            }
            if (labelElement) {
                labelElement.textContent = stat.label;
            }
            
            // Show element
            statElements[index].style.display = 'block';
        }
    });
    
    // Hide extra elements
    for (let i = stats.length; i < statElements.length; i++) {
        statElements[i].style.display = 'none';
    }
}

function updateServices() {
    if (!window.dataManager) return;
    
    const data = window.dataManager.getData();
    if (!data?.content?.services?.services) return;
    
    const services = data.content.services.services;
    const serviceCards = document.querySelectorAll('.service-card');
    
    console.log('🎯 Updating services:', services.length);
    
    services.forEach((service, index) => {
        if (serviceCards[index]) {
            const titleElement = serviceCards[index].querySelector('h3');
            const descElement = serviceCards[index].querySelector('p');
            const iconElement = serviceCards[index].querySelector('.service-icon i');
            
            if (titleElement) titleElement.textContent = service.title;
            if (descElement) descElement.textContent = service.description;
            if (iconElement && service.icon) {
                iconElement.className = service.icon;
            }
            
            // Show card
            serviceCards[index].style.display = 'block';
        }
    });
    
    // Hide extra cards
    for (let i = services.length; i < serviceCards.length; i++) {
        serviceCards[i].style.display = 'none';
    }
}

function updateContentSections() {
    // Additional content updates can be added here
}

// Search functionality
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.destination-card');
            
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Initialize search
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
} else {
    initSearch();
}

console.log('✅ Main script loaded successfully');

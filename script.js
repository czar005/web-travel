// Main script for WorldTravel website
console.log('🎯 WorldTravel script loaded');

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing WorldTravel website...');
    
    initializeNavigation();
    initializeAnimations();
    initializeDestinations();
    initializeContactForm();
    
    // Start content synchronization
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

    // Header background on scroll
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
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Initialize counters if needed
                if (entry.target.classList.contains('animate-counter')) {
                    initializeCounters();
                }
            }
        });
    }, observerOptions);

    // Observe all animate elements
    document.querySelectorAll('.animate-fade-in, .animate-fade-in-delay, .slide-in-left, .slide-in-right, .slide-in-top, .slide-in-bottom, .animate-counter').forEach(el => {
        observer.observe(el);
    });

    // Initialize floating elements
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
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
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
        
        // Hide loading, show grid
        if (loading) loading.style.display = 'none';
        if (error) error.style.display = 'none';
        grid.style.display = 'grid';
        
        // Render countries
        grid.innerHTML = countries.map(country => `
            <div class="country-card">
                <div class="country-header">
                    <h3>${country.name}</h3>
                    <span class="tour-count">${country.tours ? country.tours.length : 0} туров</span>
                </div>
                <p class="country-description">${country.description || 'Описание отсутствует'}</p>
                <div class="tours-list">
                    ${country.tours ? country.tours.map(tour => `
                        <div class="tour-item">
                            <div class="tour-info">
                                <h4>${tour.name}</h4>
                                <div class="tour-details">
                                    <span class="tour-price">${tour.price}</span>
                                    <span class="tour-duration">${tour.duration}</span>
                                </div>
                            </div>
                        </div>
                    `).join('') : '<p>Туры не добавлены</p>'}
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('❌ Error loading destinations:', error);
        showError('Ошибка загрузки направлений');
    }
}

function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const countryCards = document.querySelectorAll('.country-card');
        
        countryCards.forEach(card => {
            const countryName = card.querySelector('h3').textContent.toLowerCase();
            const countryDescription = card.querySelector('.country-description').textContent.toLowerCase();
            const tours = card.querySelectorAll('.tour-item h4');
            
            let hasMatch = countryName.includes(searchTerm) || countryDescription.includes(searchTerm);
            
            // Check tours if no country match
            if (!hasMatch && tours.length > 0) {
                hasMatch = Array.from(tours).some(tour => 
                    tour.textContent.toLowerCase().includes(searchTerm)
                );
            }
            
            card.style.display = hasMatch ? 'block' : 'none';
        });
    });
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
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Пожалуйста, заполните обязательные поля');
                return;
            }
            
            // Simulate form submission
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

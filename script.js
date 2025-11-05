// Complete Main Script with all fixes
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Main script initialized');
    
    initNavigation();
    initAnimations();
    loadDestinations();
    initContactForm();
    removeFavoriteButtons();
    
    // Force initial content load
    setTimeout(() => {
        loadDynamicContent();
        startContentSync();
    }, 500);
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
}

function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                if (entry.target.classList.contains('animate-counter')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.service-card, .stat, .destination-card').forEach(el => {
        observer.observe(el);
    });
}

function animateCounter(counterElement) {
    let targetText = counterElement.getAttribute('data-target');
    let target = 0;
    
    if (targetText.includes('+')) {
        target = parseInt(targetText.replace('+', ''));
    } else if (targetText.includes('лет')) {
        target = parseInt(targetText.replace(' лет', ''));
    } else {
        target = parseInt(targetText);
    }
    
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(function() {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        let displayText = Math.floor(current).toLocaleString();
        if (targetText.includes('+')) displayText += '+';
        if (targetText.includes('лет')) displayText += ' лет';
        
        const valueElement = counterElement.querySelector('h3');
        if (valueElement) {
            valueElement.textContent = displayText;
        }
    }, 16);
}

function loadDestinations() {
    const grid = document.getElementById('destinations-grid');
    const loading = document.getElementById('destinations-loading');
    const error = document.getElementById('destinations-error');
    
    if (!grid) return;
    
    console.log('🌍 Loading destinations...');
    
    if (loading) loading.style.display = 'block';
    if (error) error.style.display = 'none';
    
    setTimeout(() => {
        try {
            if (window.dataManager) {
                const countries = window.dataManager.getCountries();
                console.log('�� Countries loaded:', countries.length);
                
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
                <img src="${country.image}" 
                     alt="${country.name}" 
                     onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop'">
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
    
    // Remove any favorite buttons that might appear
    removeFavoriteButtons();
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
    console.log('📄 Loading dynamic content...');
    updateDynamicContent();
}

function startContentSync() {
    // Fast sync for first 30 seconds
    const fastSync = setInterval(updateDynamicContent, 500);
    setTimeout(() => {
        clearInterval(fastSync);
        // Then normal sync
        setInterval(updateDynamicContent, 2000);
    }, 30000);
    
    // Also sync on data updates
    window.addEventListener('dataUpdated', updateDynamicContent);
}

function updateDynamicContent() {
    updateStats();
    updateServices();
    updateContentSections();
    updateImages();
}

function updateStats() {
    if (!window.dataManager) return;
    
    const data = window.dataManager.getData();
    if (!data?.content?.about?.stats) return;
    
    const stats = data.content.about.stats;
    let statElements = document.querySelectorAll('.stat');
    
    console.log('📊 Updating stats:', stats.length);
    
    // Ensure we have enough stat elements
    const statsContainer = document.querySelector('.stats');
    if (statsContainer) {
        // Clear and recreate stats to ensure they match
        statsContainer.innerHTML = '';
        
        stats.forEach(stat => {
            const statElement = document.createElement('div');
            statElement.className = 'stat animate-counter';
            statElement.setAttribute('data-target', stat.value);
            statElement.innerHTML = `
                <h3>${stat.value}</h3>
                <p>${stat.label}</p>
            `;
            statsContainer.appendChild(statElement);
        });
        
        // Re-query elements
        statElements = document.querySelectorAll('.stat');
    }
    
    // Update existing elements
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
            
            statElements[index].style.display = 'block';
        }
    });
}

function updateServices() {
    if (!window.dataManager) return;
    
    const data = window.dataManager.getData();
    if (!data?.content?.services?.services) return;
    
    const services = data.content.services.services;
    let serviceCards = document.querySelectorAll('.service-card');
    
    console.log('🎯 Updating services:', services.length);
    
    // Ensure we have enough service cards
    const servicesGrid = document.querySelector('.services-grid');
    if (servicesGrid) {
        // Clear and recreate services to ensure they match
        servicesGrid.innerHTML = '';
        
        services.forEach((service, index) => {
            const animationClass = index % 4 === 0 ? 'slide-in-left' : 
                                index % 4 === 1 ? 'slide-in-bottom' : 
                                index % 4 === 2 ? 'slide-in-right' : 'slide-in-top';
            
            const serviceCard = document.createElement('div');
            serviceCard.className = `service-card ${animationClass}`;
            serviceCard.innerHTML = `
                <div class="service-icon"><i class="${service.icon || 'fas fa-star'}"></i></div>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
            `;
            servicesGrid.appendChild(serviceCard);
        });
        
        // Re-query elements
        serviceCards = document.querySelectorAll('.service-card');
    }
    
    // Update existing cards
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
            
            serviceCards[index].style.display = 'block';
        }
    });
}

function updateContentSections() {
    if (!window.dataManager) return;
    
    const data = window.dataManager.getData();
    if (!data?.content) return;
    
    // Update section titles
    if (data.content.hero) {
        updateElementText('#home h1', data.content.hero.title);
        updateElementText('#home p', data.content.hero.description);
    }
    if (data.content.about) {
        updateElementText('#about .section-title', data.content.about.title);
        updateElementText('.about-text p', data.content.about.description);
    }
    if (data.content.services) {
        updateElementText('#services .section-title', data.content.services.title);
    }
    if (data.content.destinations) {
        updateElementText('#destinations .section-title', data.content.destinations.title);
    }
    if (data.content.contact) {
        updateElementText('#contact .section-title', data.content.contact.title);
    }
}

function updateImages() {
    if (!window.dataManager) return;
    
    const data = window.dataManager.getData();
    
    // Update hero image if exists in data
    if (data?.content?.hero?.backgroundImage) {
        const heroImg = document.querySelector('.hero-img');
        if (heroImg && data.content.hero.backgroundImage) {
            heroImg.src = data.content.hero.backgroundImage;
        }
    }
    
    // Update about image if exists
    if (data?.content?.about?.image) {
        const aboutImg = document.querySelector('.about-img');
        if (aboutImg && data.content.about.image) {
            aboutImg.src = data.content.about.image;
        }
    }
}

function updateElementText(selector, text) {
    if (!text) return;
    const element = document.querySelector(selector);
    if (element && element.textContent !== text) {
        element.textContent = text;
    }
}

function removeFavoriteButtons() {
    // Remove any existing favorite buttons
    document.querySelectorAll('.favorite-btn, .btn-favorite, [class*="favorite"], .fa-heart, .far.fa-heart, .fas.fa-heart').forEach(btn => {
        if (btn.closest('.destination-card') || btn.closest('.tour-item')) {
            btn.remove();
        }
    });
    
    // Remove from destination cards
    document.querySelectorAll('.destination-card').forEach(card => {
        const hearts = card.querySelectorAll('.fa-heart, .far.fa-heart, .fas.fa-heart');
        hearts.forEach(heart => heart.remove());
    });
    
    // Remove from tour items
    document.querySelectorAll('.tour-item').forEach(item => {
        const hearts = item.querySelectorAll('.fa-heart, .far.fa-heart, .fas.fa-heart');
        hearts.forEach(heart => heart.remove());
    });
    
    // Observer for dynamically added content
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) {
                    node.querySelectorAll?.('.favorite-btn, .btn-favorite, [class*="favorite"], .fa-heart, .far.fa-heart, .fas.fa-heart').forEach(btn => {
                        if (btn.closest('.destination-card') || btn.closest('.tour-item')) {
                            btn.remove();
                        }
                    });
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
} else {
    initSearch();
}

console.log('✅ Main script loaded successfully');

// Direct fix for script.js loadDestinations function
(function() {
    // Wait for DOM and then override loadDestinations
    document.addEventListener('DOMContentLoaded', function() {
        // Safe loadDestinations function
        window.loadDestinations = function() {
            const loadingElement = document.getElementById('destinations-loading');
            const gridElement = document.getElementById('destinations-grid');
            const errorElement = document.getElementById('destinations-error');
            
            if (!window.dataManager) {
                console.warn('Data Manager not available, showing empty state');
                if (loadingElement) loadingElement.style.display = 'none';
                if (errorElement) errorElement.style.display = 'block';
                if (gridElement) {
                    gridElement.innerHTML = `
                        <div style="text-align: center; padding: 40px; color: #666;">
                            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                            <p>Данные временно недоступны</p>
                            <small>Попробуйте обновить страницу позже</small>
                        </div>
                    `;
                }
                return;
            }
            
            try {
                // Original logic from script.js
                const countries = window.dataManager.getCountries();
                const allTours = window.dataManager.getAllTours();
                
                if (loadingElement) loadingElement.style.display = 'none';
                
                if (!countries || countries.length === 0) {
                    if (gridElement) {
                        gridElement.innerHTML = `
                            <div style="text-align: center; padding: 40px; color: #666;">
                                <i class="fas fa-globe-americas" style="font-size: 3rem; margin-bottom: 15px;"></i>
                                <p>Направления пока не добавлены</p>
                                <small>Загляните сюда позже</small>
                            </div>
                        `;
                    }
                    return;
                }
                
                // Render countries and tours
                if (gridElement) {
                    gridElement.innerHTML = countries.map(country => {
                        const countryTours = allTours.filter(tour => tour.countryName === country.name);
                        return `
                            <div class="country-card">
                                <h3>${country.name}</h3>
                                <p>${country.description || 'Описание отсутствует'}</p>
                                ${countryTours.map(tour => `
                                    <div class="tour-item">
                                        <strong>${tour.name}</strong> - ${tour.price} (${tour.duration})
                                    </div>
                                `).join('')}
                            </div>
                        `;
                    }).join('');
                }
                
            } catch (error) {
                console.error('Error loading destinations:', error);
                if (loadingElement) loadingElement.style.display = 'none';
                if (errorElement) errorElement.style.display = 'block';
            }
        };
        
        // Call loadDestinations after a short delay
        setTimeout(window.loadDestinations, 100);
    });
})();

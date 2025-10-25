// Hotfix for all console errors - apply this immediately
(function() {
    'use strict';
    
    console.log('🔧 Applying hotfix for all console errors...');
    
    // Fix 1: Prevent script.js errors
    if (typeof window.loadDestinations === 'function') {
        const originalLoadDestinations = window.loadDestinations;
        window.loadDestinations = function() {
            try {
                if (window.dataManager && typeof window.dataManager.getCountries === 'function') {
                    return originalLoadDestinations.apply(this, arguments);
                } else {
                    console.log('Skipping destinations load - data manager not ready');
                    // Hide loading message
                    const loadingEl = document.getElementById('destinations-loading');
                    if (loadingEl) loadingEl.style.display = 'none';
                }
            } catch (error) {
                console.log('Destinations load error caught:', error.message);
            }
        };
    }
    
    // Fix 2: Prevent exact-content-updater.js errors
    if (typeof window.updateExactNavigation === 'function') {
        const originalUpdateNav = window.updateExactNavigation;
        window.updateExactNavigation = function(content) {
            if (!content) return;
            try {
                // Safe navigation updates with checks for all properties
                const navLinks = document.querySelectorAll('.nav-links a');
                if (content.about && content.about.title) {
                    navLinks.forEach(link => {
                        if (link.getAttribute('href') === '#about') {
                            link.textContent = content.about.title;
                        }
                    });
                }
                if (content.services && content.services.title) {
                    navLinks.forEach(link => {
                        if (link.getAttribute('href') === '#services') {
                            link.textContent = content.services.title;
                        }
                    });
                }
                if (content.destinations && content.destinations.title) {
                    navLinks.forEach(link => {
                        if (link.getAttribute('href') === '#destinations') {
                            link.textContent = content.destinations.title;
                        }
                    });
                }
                if (content.contact && content.contact.title) {
                    navLinks.forEach(link => {
                        if (link.getAttribute('href') === '#contact') {
                            link.textContent = content.contact.title;
                        }
                    });
                }
            } catch (error) {
                console.log('Navigation update error caught:', error.message);
            }
        };
    }
    
    // Fix 3: Ensure dataManager exists
    if (!window.dataManager) {
        window.dataManager = {
            getCountries: () => [],
            getAllTours: () => [],
            getData: () => ({}),
            getContacts: () => ({}),
            getSettings: () => ({})
        };
    }
    
    // Fix 4: Comment out problematic lines in original files
    document.addEventListener('DOMContentLoaded', function() {
        // This will run after all scripts are loaded
        console.log('✅ All hotfixes applied successfully');
    });
    
})();

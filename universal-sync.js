// Universal sync - works with admin, editor, and all data sources
(function() {
    'use strict';
    
    console.log('🌐 Universal sync loaded');
    
    let lastSyncHash = '';
    let isSyncing = false;
    
    function syncFromAllSources() {
        if (isSyncing) return;
        isSyncing = true;
        
        try {
            // Try multiple data sources in order
            let finalData = null;
            
            // 1. Try localStorage (main source)
            const localData = localStorage.getItem('worldtravel_data');
            if (localData) {
                try {
                    finalData = JSON.parse(localData);
                    console.log('📁 Data from localStorage');
                } catch (e) {
                    console.log('❌ localStorage data corrupted');
                }
            }
            
            // 2. Try dataManager if available
            if (!finalData && window.dataManager && window.dataManager.getData) {
                try {
                    finalData = window.dataManager.getData();
                    console.log('📊 Data from dataManager');
                } catch (e) {
                    console.log('❌ dataManager error');
                }
            }
            
            // 3. Try sessionStorage as fallback
            if (!finalData) {
                const sessionData = sessionStorage.getItem('worldtravel_data');
                if (sessionData) {
                    try {
                        finalData = JSON.parse(sessionData);
                        console.log('💾 Data from sessionStorage');
                    } catch (e) {
                        console.log('❌ sessionStorage data corrupted');
                    }
                }
            }
            
            if (!finalData) {
                console.log('�� No data found from any source');
                isSyncing = false;
                return;
            }
            
            // Check if data actually changed
            const dataString = JSON.stringify(finalData);
            const currentHash = dataString.length + '-' + dataString.substring(100, 150);
            
            if (currentHash === lastSyncHash) {
                isSyncing = false;
                return; // No changes
            }
            
            lastSyncHash = currentHash;
            console.log('🔄 Applying changes to page...');
            
            // APPLY ALL CHANGES
            applyDataToPage(finalData);
            
            console.log('✅ Page updated successfully!');
            
        } catch (error) {
            console.log('❌ Sync error:', error);
        }
        
        isSyncing = false;
    }
    
    function applyDataToPage(data) {
        // 1. APPLY CONTACTS
        if (data.contacts) {
            applyContacts(data.contacts);
        }
        
        // 2. APPLY FOOTER
        if (data.footer) {
            applyFooter(data.footer);
        }
        
        // 3. APPLY CONTENT SECTIONS
        if (data.content) {
            applyContent(data.content);
        }
        
        // 4. APPLY NAVIGATION
        if (data.content) {
            applyNavigation(data.content);
        }
        
        // 5. APPLY SETTINGS
        if (data.settings) {
            applySettings(data.settings);
        }
    }
    
    function applyContacts(contacts) {
        const contactMap = [
            { selectors: ['.contact-info .contact-item:nth-child(1) p', '.footer-section:nth-child(3) p:nth-child(1)'], value: contacts.phone },
            { selectors: ['.contact-info .contact-item:nth-child(2) p', '.footer-section:nth-child(3) p:nth-child(2)'], value: contacts.email },
            { selectors: ['.contact-info .contact-item:nth-child(3) p', '.footer-section:nth-child(3) p:nth-child(3)'], value: contacts.address },
            { selectors: ['.contact-info .contact-item:nth-child(4) p', '.footer-section:nth-child(3) p:nth-child(4)'], value: contacts.hours }
        ];
        
        contactMap.forEach(item => {
            if (item.value) {
                item.selectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(el => {
                        el.textContent = item.value;
                    });
                });
            }
        });
    }
    
    function applyFooter(footer) {
        if (footer.description) {
            document.querySelectorAll('.footer-section:first-child p').forEach(el => {
                el.textContent = footer.description;
            });
        }
        if (footer.copyright) {
            document.querySelectorAll('.footer-bottom p').forEach(el => {
                el.innerHTML = footer.copyright;
            });
        }
    }
    
    function applyContent(content) {
        // Hero section
        if (content.hero) {
            updateText('#home h1, .hero h1', content.hero.title);
            updateText('#home p, .hero p', content.hero.subtitle);
        }
        
        // About section
        if (content.about) {
            updateText('#about .section-title', content.about.title);
            updateText('.about-text p', content.about.description);
        }
        
        // Services section
        if (content.services) {
            updateText('#services .section-title', content.services.title);
        }
        
        // Destinations section
        if (content.destinations) {
            updateText('#destinations .section-title', content.destinations.title);
            updateText('.destinations .section-subtitle', content.destinations.subtitle);
        }
        
        // Contact section
        if (content.contact) {
            updateText('#contact .section-title', content.contact.title);
        }
    }
    
    function applyNavigation(content) {
        const navMap = [
            { href: '#about', title: content.about?.title },
            { href: '#services', title: content.services?.title },
            { href: '#destinations', title: content.destinations?.title },
            { href: '#contact', title: content.contact?.title }
        ];
        
        navMap.forEach(item => {
            if (item.title) {
                // Update both header and footer navigation
                updateText(`.nav-links a[href="${item.href}"]`, item.title);
                updateText(`.footer-section:nth-child(2) a[href="${item.href}"]`, item.title);
            }
        });
    }
    
    function applySettings(settings) {
        if (settings.siteTitle) {
            document.title = settings.siteTitle;
        }
    }
    
    function updateText(selector, value) {
        if (!value) return;
        document.querySelectorAll(selector).forEach(el => {
            el.textContent = value;
        });
    }
    
    // SYNC STRATEGY
    function startSync() {
        // Fast sync for first 10 seconds
        let fastSync = setInterval(syncFromAllSources, 300);
        setTimeout(() => {
            clearInterval(fastSync);
            // Then normal sync
            setInterval(syncFromAllSources, 1000);
        }, 10000);
        
        // Also sync on any storage event
        window.addEventListener('storage', function(e) {
            if (e.key === 'worldtravel_data' || e.key === 'admin_data') {
                setTimeout(syncFromAllSources, 100);
            }
        });
        
        // Sync on page focus (when returning from admin)
        window.addEventListener('focus', syncFromAllSources);
        
        // Sync on visibility change
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                syncFromAllSources();
            }
        });
        
        console.log('✅ Universal sync started');
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startSync);
    } else {
        startSync();
    }
    
    // Make sync function available globally
    window.forceSync = syncFromAllSources;
    
})();

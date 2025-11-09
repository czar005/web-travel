// Enhanced Admin with Universal Sync
(function() {
    'use strict';
    
    console.log('⚙️ Enhanced Admin with Universal Sync Loading...');
    
    const enhanceAdmin = () => {
        if (!window.UniversalData) {
            setTimeout(enhanceAdmin, 100);
            return;
        }
        
        console.log('🔧 Enhancing Admin with Universal Sync...');
        
        // Patch admin form handlers for universal sync
        this.patchAdminHandlers();
        this.setupAutoSave();
        this.loadUniversalData();
        
        console.log('✅ Admin Enhanced with Universal Sync');
    };
    
    // Patch admin form handlers
    const patchAdminHandlers = () => {
        // Contacts form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                saveContactsUniversal();
            });
            
            // Auto-save on input change
            contactForm.querySelectorAll('input, textarea').forEach(input => {
                input.addEventListener('input', debounce(saveContactsUniversal, 1000));
            });
        }
        
        // Settings form
        const settingsForm = document.getElementById('settings-form');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                saveSettingsUniversal();
            });
            
            // Auto-save on input change
            settingsForm.querySelectorAll('input, textarea').forEach(input => {
                input.addEventListener('input', debounce(saveSettingsUniversal, 1000));
            });
        }
        
        // Country and tour forms would be patched similarly
    };
    
    // Save contacts to universal system
    const saveContactsUniversal = () => {
        const form = document.getElementById('contact-form');
        if (!form) return;
        
        const formData = new FormData(form);
        const contacts = {
            phone: formData.get('phone') || '',
            email: formData.get('email') || '',
            address: formData.get('address') || '',
            hours: formData.get('hours') || ''
        };
        
        const currentData = window.UniversalData.getCompleteData();
        currentData.contacts = { ...currentData.contacts, ...contacts };
        window.UniversalData.saveCompleteData(currentData);
        
        if (window.showAdminNotification) {
            window.showAdminNotification('Контакты сохранены на главной странице!', 'success');
        }
        
        console.log('💾 Contacts saved to universal system');
    };
    
    // Save settings to universal system
    const saveSettingsUniversal = () => {
        const form = document.getElementById('settings-form');
        if (!form) return;
        
        const formData = new FormData(form);
        const settings = {
            siteTitle: formData.get('siteTitle') || '',
            companyName: formData.get('companyName') || ''
        };
        
        const currentData = window.UniversalData.getCompleteData();
        currentData.settings = { ...currentData.settings, ...settings };
        window.UniversalData.saveCompleteData(currentData);
        
        if (window.showAdminNotification) {
            window.showAdminNotification('Настройки сохранены на главной странице!', 'success');
        }
        
        console.log('💾 Settings saved to universal system');
    };
    
    // Load universal data into admin forms
    const loadUniversalData = () => {
        const data = window.UniversalData.getCompleteData();
        
        // Load contacts
        if (data.contacts) {
            const contactForm = document.getElementById('contact-form');
            if (contactForm) {
                contactForm.querySelector('#contact-phone').value = data.contacts.phone || '';
                contactForm.querySelector('#contact-email').value = data.contacts.email || '';
                contactForm.querySelector('#contact-address').value = data.contacts.address || '';
                contactForm.querySelector('#contact-hours').value = data.contacts.hours || '';
            }
        }
        
        // Load settings
        if (data.settings) {
            const settingsForm = document.getElementById('settings-form');
            if (settingsForm) {
                settingsForm.querySelector('#site-title').value = data.settings.siteTitle || '';
                settingsForm.querySelector('#company-name').value = data.settings.companyName || '';
            }
        }
        
        console.log('📊 Universal data loaded into admin forms');
    };
    
    // Debounce utility for auto-save
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };
    
    // Setup auto-save for all admin forms
    const setupAutoSave = () => {
        console.log('🤖 Auto-save enabled for admin forms');
    };
    
    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enhanceAdmin);
    } else {
        enhanceAdmin();
    }
    
})();

// Complete Content Updater - updates ALL content including navigation
class CompleteContentUpdater {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 Complete Content Updater started');
        
        this.applyChanges();
        
        window.addEventListener('dataUpdated', () => {
            setTimeout(() => this.applyChanges(), 100);
        });
        
        setInterval(() => this.applyChanges(), 2000);
    }

    applyChanges() {
        if (!window.dataManager) {
            console.log('⏳ Waiting for DataManager...');
            return;
        }
        
        const data = window.dataManager.getData();
        if (!data) {
            console.log('📭 No data available');
            return;
        }
        
        console.log('🔄 Applying ALL content changes...');
        
        // Apply all content sections
        if (data.content) {
            this.updateAllContent(data.content);
        }
        
        // Apply contacts
        if (data.contacts) {
            this.updateContacts(data.contacts);
        }
        
        // Apply settings
        if (data.settings) {
            this.updateSettings(data.settings);
        }
        
        // Apply footer
        if (data.footer) {
            this.updateFooter(data.footer);
        }
        
        // Update navigation to match section titles
        this.updateNavigation(data.content);
    }

    updateAllContent(content) {
        // Hero section
        if (content.hero) {
            this.updateElement('#home h1', content.hero.title);
            this.updateElement('#home p', content.hero.subtitle);
            this.updateImage('.hero-image img', content.hero.image);
        }
        
        // About section
        if (content.about) {
            this.updateElement('#about .section-title', content.about.title);
            this.updateElement('.about-text p', content.about.description);
            this.updateImage('.about-image img', content.about.image);
            
            // Update stats
            if (content.about.stats) {
                this.updateStats(content.about.stats);
            }
        }
        
        // Services section
        if (content.services) {
            this.updateElement('#services .section-title', content.services.title);
            
            // Update services
            if (content.services.services) {
                this.updateServices(content.services.services);
            }
        }
        
        // Destinations section
        if (content.destinations) {
            this.updateElement('#destinations .section-title', content.destinations.title);
            this.updateElement('.destinations .section-subtitle', content.destinations.subtitle);
        }
        
        // Contact section
        if (content.contact) {
            this.updateElement('#contact .section-title', content.contact.title);
        }
    }

    updateNavigation(content) {
        const navTitles = {
            'home': 'Главная',
            'about': content.about?.title || 'О нас',
            'services': content.services?.title || 'Услуги',
            'destinations': content.destinations?.title || 'Направления',
            'contact': content.contact?.title || 'Контакты'
        };
        
        // Update navigation links
        Object.keys(navTitles).forEach(sectionId => {
            const links = document.querySelectorAll('a[href="#' + sectionId + '"]');
            links.forEach(link => {
                if (link.textContent !== navTitles[sectionId]) {
                    link.textContent = navTitles[sectionId];
                }
            });
        });
        
        // Update footer links to match navigation
        const footerLinks = document.querySelectorAll('.footer-section:nth-child(2) a');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        if (footerLinks.length === navLinks.length) {
            navLinks.forEach((navLink, index) => {
                if (footerLinks[index] && footerLinks[index].textContent !== navLink.textContent) {
                    footerLinks[index].textContent = navLink.textContent;
                }
            });
        }
    }

    updateContacts(contacts) {
        // Update contact section
        const contactItems = document.querySelectorAll('.contact-item');
        contactItems.forEach(item => {
            const strong = item.querySelector('strong');
            const p = item.querySelector('p');
            
            if (strong && p) {
                if (strong.textContent.includes('Телефон') && contacts.phone) {
                    p.textContent = contacts.phone;
                }
                if (strong.textContent.includes('Email') && contacts.email) {
                    p.textContent = contacts.email;
                }
                if (strong.textContent.includes('Адрес') && contacts.address) {
                    p.textContent = contacts.address;
                }
                if (strong.textContent.includes('Часы') && contacts.hours) {
                    p.textContent = contacts.hours;
                }
            }
        });
        
        // Update footer contacts
        this.updateFooterContacts(contacts);
    }

    updateFooterContacts(contacts) {
        const footerSection = document.querySelector('.footer-section:nth-child(3)');
        if (!footerSection) return;

        const paragraphs = footerSection.querySelectorAll('p');
        
        if (paragraphs.length >= 4) {
            if (contacts.phone) paragraphs[0].innerHTML = '<i class="fas fa-phone"></i> ' + contacts.phone;
            if (contacts.email) paragraphs[1].innerHTML = '<i class="fas fa-envelope"></i> ' + contacts.email;
            if (contacts.address) paragraphs[2].innerHTML = '<i class="fas fa-map-marker-alt"></i> ' + contacts.address;
            if (contacts.hours) paragraphs[3].innerHTML = '<i class="fas fa-clock"></i> ' + contacts.hours;
        }
    }

    updateSettings(settings) {
        if (settings.siteTitle) {
            document.title = settings.siteTitle;
        }
    }

    updateFooter(footer) {
        if (footer.description) {
            this.updateElement('.footer-section:first-child p', footer.description);
        }
        if (footer.copyright) {
            this.updateElement('.footer-bottom p', footer.copyright, true);
        }
    }

    updateStats(stats) {
        const statElements = document.querySelectorAll('.stat');
        if (statElements.length >= stats.length) {
            stats.forEach((stat, index) => {
                if (statElements[index]) {
                    const valueElement = statElements[index].querySelector('h3');
                    const labelElement = statElements[index].querySelector('p');
                    
                    if (valueElement) valueElement.textContent = stat.value;
                    if (labelElement) labelElement.textContent = stat.label;
                }
            });
        }
    }

    updateServices(services) {
        const serviceCards = document.querySelectorAll('.service-card');
        if (serviceCards.length >= services.length) {
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
                }
            });
        }
    }

    updateElement(selector, content, isHTML = false) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (isHTML) {
                if (element.innerHTML !== content) {
                    element.innerHTML = content;
                }
            } else {
                if (element.textContent !== content) {
                    element.textContent = content;
                }
            }
        });
    }

    updateImage(selector, src) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element.src !== src) {
                element.src = src;
            }
        });
    }
}

new CompleteContentUpdater();

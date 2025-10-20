// Exact Content Updater - точно отображает данные из редактора
class ExactContentUpdater {
    constructor() {
        this.lastDataHash = '';
        this.init();
    }

    init() {
        console.log('🎯 Exact Content Updater started');
        
        this.applyExactChanges();
        
        // Слушаем обновления данных
        window.addEventListener('dataUpdated', () => {
            setTimeout(() => this.applyExactChanges(), 100);
        });
        
        // Частая проверка изменений
        setInterval(() => this.applyExactChanges(), 1000);
    }

    applyExactChanges() {
        if (!window.dataManager) {
            return;
        }
        
        const data = window.dataManager.getData();
        if (!data) {
            return;
        }

        // Проверяем хеш данных чтобы избежать лишних обновлений
        const currentHash = JSON.stringify(data);
        if (currentHash === this.lastDataHash) {
            return;
        }
        
        this.lastDataHash = currentHash;
        
        console.log('🎯 Applying EXACT content changes...');
        
        // Применяем контент ТОЧНО как в данных
        if (data.content) {
            this.updateExactContent(data.content);
        }
        
        // Применяем контакты
        if (data.contacts) {
            this.updateExactContacts(data.contacts);
        }
        
        // Обновляем навигацию
        this.updateExactNavigation(data.content);
    }

    updateExactContent(content) {
        // Hero section - ТОЧНО как в данных
        if (content.hero) {
            this.exactUpdate('#home h1', content.hero.title);
            this.exactUpdate('#home p', content.hero.subtitle);
            if (content.hero.image) {
                this.exactImage('.hero-image img', content.hero.image);
            }
        }
        
        // About section - ТОЧНО как в данных
        if (content.about) {
            this.exactUpdate('#about .section-title', content.about.title);
            this.exactUpdate('.about-text p', content.about.description);
            if (content.about.image) {
                this.exactImage('.about-image img', content.about.image);
            }
            
            // Статистика - ТОЧНО как в данных
            if (content.about.stats) {
                this.updateExactStats(content.about.stats);
            }
        }
        
        // Services section - ТОЧНО как в данных
        if (content.services) {
            this.exactUpdate('#services .section-title', content.services.title);
            
            // Услуги - ТОЧНО как в данных
            if (content.services.services) {
                this.updateExactServices(content.services.services);
            }
        }
        
        // Destinations section - ТОЧНО как в данных
        if (content.destinations) {
            this.exactUpdate('#destinations .section-title', content.destinations.title);
            this.exactUpdate('.destinations .section-subtitle', content.destinations.subtitle);
        }
        
        // Contact section - ТОЧНО как в данных
        if (content.contact) {
            this.exactUpdate('#contact .section-title', content.contact.title);
        }
        
        // Footer - ТОЧНО как в данных
        if (content.footer) {
            this.exactUpdate('.footer-section:first-child p', content.footer.description);
            this.exactHTML('.footer-bottom p', content.footer.copyright);
        }
    }

    updateExactStats(stats) {
        const statElements = document.querySelectorAll('.stat');
        
        // Сначала скрываем все блоки статистики
        statElements.forEach(stat => {
            stat.style.display = 'none';
        });
        
        // Показываем и заполняем только те блоки, которые есть в данных
        stats.forEach((stat, index) => {
            if (statElements[index]) {
                statElements[index].style.display = 'block';
                const valueElement = statElements[index].querySelector('h3');
                const labelElement = statElements[index].querySelector('p');
                
                if (valueElement) valueElement.textContent = stat.value;
                if (labelElement) labelElement.textContent = stat.label;
                
                // Обновляем data-target для анимации счетчика
                if (statElements[index].classList.contains('animate-counter')) {
                    statElements[index].setAttribute('data-target', stat.value);
                }
            }
        });
    }

    updateExactServices(services) {
        const serviceCards = document.querySelectorAll('.service-card');
        
        // Сначала скрываем все карточки услуг
        serviceCards.forEach(card => {
            card.style.display = 'none';
        });
        
        // Показываем и заполняем только те услуги, которые есть в данных
        services.forEach((service, index) => {
            if (serviceCards[index]) {
                serviceCards[index].style.display = 'block';
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

    updateExactContacts(contacts) {
        // Обновляем секцию контактов ТОЧНО
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
        
        // Обновляем футер ТОЧНО
        this.updateExactFooterContacts(contacts);
    }

    updateExactFooterContacts(contacts) {
        const footerSection = document.querySelector('.footer-section:nth-child(3)');
        if (!footerSection) return;

        const paragraphs = footerSection.querySelectorAll('p');
        
        if (paragraphs.length >= 4) {
            if (contacts.phone) {
                paragraphs[0].innerHTML = '<i class="fas fa-phone"></i> ' + contacts.phone;
            }
            if (contacts.email) {
                paragraphs[1].innerHTML = '<i class="fas fa-envelope"></i> ' + contacts.email;
            }
            if (contacts.address) {
                paragraphs[2].innerHTML = '<i class="fas fa-map-marker-alt"></i> ' + contacts.address;
            }
            if (contacts.hours) {
                paragraphs[3].innerHTML = '<i class="fas fa-clock"></i> ' + contacts.hours;
            }
        }
    }

    updateExactNavigation(content) {
        const navTitles = {
            'home': 'Главная',
            'about': content.about?.title || 'О нас',
            'services': content.services?.title || 'Услуги',
            'destinations': content.destinations?.title || 'Направления',
            'contact': content.contact?.title || 'Контакты'
        };
        
        // Обновляем навигацию ТОЧНО
        Object.keys(navTitles).forEach(sectionId => {
            const links = document.querySelectorAll('a[href="#' + sectionId + '"]');
            links.forEach(link => {
                link.textContent = navTitles[sectionId];
            });
        });
    }

    exactUpdate(selector, content) {
        const element = document.querySelector(selector);
        if (element && element.textContent !== content) {
            element.textContent = content;
        }
    }

    exactHTML(selector, html) {
        const element = document.querySelector(selector);
        if (element && element.innerHTML !== html) {
            element.innerHTML = html;
        }
    }

    exactImage(selector, src) {
        const element = document.querySelector(selector);
        if (element && element.src !== src) {
            element.src = src;
        }
    }
}

new ExactContentUpdater();

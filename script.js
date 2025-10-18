// script.js - Основной скрипт для главной страницы
console.log('WorldTravel script loaded');

// Функция для загрузки изменений из редактора
function loadEditorChanges() {
    try {
        const savedChanges = localStorage.getItem('worldtravel_page_changes');
        
        if (savedChanges) {
            const changes = JSON.parse(savedChanges);
            console.log('Загружены изменения из редактора от:', changes.timestamp);
            
            // Применяем изменения к соответствующим разделам
            if (changes.hero) {
                applyChange('#home h1, .hero h1', changes.hero.title);
                applyChange('#home p, .hero p', changes.hero.content);
            }
            if (changes.about) {
                applyChange('#about .section-title, .about .section-title', changes.about.title);
                applyChange('.about-text p', changes.about.content);
            }
            if (changes.services) {
                applyChange('#services .section-title, .services .section-title', changes.services.title);
            }
            if (changes.destinations) {
                applyChange('#destinations .section-title, .destinations .section-title', changes.destinations.title);
                applyChange('.destinations .section-subtitle', changes.destinations.content);
            }
            if (changes.contact) {
                applyChange('#contact .section-title, .contact .section-title', changes.contact.title);
            }
            
            console.log('Все изменения из редактора применены');
        }
    } catch (error) {
        console.error('Ошибка загрузки изменений из редактора:', error);
    }
}

function applyChange(selector, newValue) {
    if (!newValue) return;
    
    try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element && element.textContent !== newValue) {
                element.textContent = newValue;
            }
        });
    } catch (error) {
        console.error('Ошибка применения изменения для', selector, error);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // Загружаем изменения из редактора ПЕРВЫМ делом
    loadEditorChanges();
    
    // Остальной существующий код...
    if (typeof loadCountriesData === 'function') {
        setTimeout(() => {
            loadCountriesData();
        }, 1000);
    }
    
    // Анимация счетчиков
    const counters = document.querySelectorAll('.animate-counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        if (target) {
            animateCounter(counter.querySelector('h3'), 0, target, 2000);
        }
    });

    // Проверяем параметр editor для отключения функционала
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('editor')) {
        document.body.classList.add('editor-mode');
        disableEditorFunctionality();
    }
});

function disableEditorFunctionality() {
    // Отключаем навигацию по якорям
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.onclick = (e) => e.preventDefault();
    });
    
    // Отключаем формы
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.onsubmit = (e) => e.preventDefault();
    });
    
    console.log('Функционал отключен для режима редактора');
}

// Остальные существующие функции...
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Существующие функции навигации и т.д.

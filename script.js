// script.js - Основной скрипт для главной страницы
console.log('WorldTravel script loaded');

// Функция для загрузки изменений из редактора
function loadEditorChanges() {
    try {
        const savedHTML = localStorage.getItem('worldtravel_edited_page');
        const timestamp = localStorage.getItem('worldtravel_edit_timestamp');
        
        if (savedHTML && timestamp) {
            console.log('Загружены изменения из редактора от:', timestamp);
            
            // Создаем временный div для парсинга HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = savedHTML;
            
            // Обновляем основные разделы
            updateSectionFromEditor(tempDiv, '#home h1', '#home h1');
            updateSectionFromEditor(tempDiv, '#home p', '#home p');
            updateSectionFromEditor(tempDiv, '#about .section-title', '#about .section-title');
            updateSectionFromEditor(tempDiv, '.about-text p', '.about-text p');
            updateSectionFromEditor(tempDiv, '#services .section-title', '#services .section-title');
            updateSectionFromEditor(tempDiv, '#destinations .section-title', '#destinations .section-title');
            updateSectionFromEditor(tempDiv, '.destinations .section-subtitle', '.destinations .section-subtitle');
            updateSectionFromEditor(tempDiv, '#contact .section-title', '#contact .section-title');
            
            console.log('Изменения из редактора применены');
        }
    } catch (error) {
        console.error('Ошибка загрузки изменений из редактора:', error);
    }
}

function updateSectionFromEditor(sourceDoc, sourceSelector, targetSelector) {
    try {
        const sourceElement = sourceDoc.querySelector(sourceSelector);
        const targetElement = document.querySelector(targetSelector);
        
        if (sourceElement && targetElement && sourceElement.textContent !== targetElement.textContent) {
            targetElement.textContent = sourceElement.textContent;
        }
    } catch (error) {
        console.error('Ошибка обновления секции:', error);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // Загружаем изменения из редактора
    setTimeout(() => {
        loadEditorChanges();
    }, 100);
    
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

// Дополнительный скрипт для улучшения работы редактора страниц
document.addEventListener('DOMContentLoaded', function() {
    // Автоматическое применение сохраненных изменений при загрузке
    setTimeout(() => {
        applySavedChanges();
    }, 3000);
});

function applySavedChanges() {
    try {
        const savedChanges = localStorage.getItem('worldtravel_page_changes');
        if (savedChanges) {
            const changes = JSON.parse(savedChanges);
            console.log('Применяем сохраненные изменения:', changes);
            
            // Применяем изменения к текущей странице
            if (changes.hero && changes.hero.title) {
                const heroTitle = document.querySelector('#home h1, .hero h1, section:first-of-type h1');
                if (heroTitle) heroTitle.textContent = changes.hero.title;
            }
            
            if (changes.hero && changes.hero.content) {
                const heroContent = document.querySelector('#home p, .hero p, section:first-of-type p');
                if (heroContent) heroContent.textContent = changes.hero.content;
            }
            
            // Добавьте здесь применение других изменений по необходимости
        }
    } catch (error) {
        console.error('Ошибка применения сохраненных изменений:', error);
    }
}

// Улучшенная функция для проверки видимости элементов
function isElementInViewport(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

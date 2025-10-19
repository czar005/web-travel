// Дополнительные исправления для стабильности редактора

// Добавляем обработчик для освобождения URL при разгрузке страницы
window.addEventListener('beforeunload', () => {
    if (window.editor && typeof window.editor.cleanupTemporaryUrls === 'function') {
        window.editor.cleanupTemporaryUrls();
    }
});

// Добавляем обработчик ошибок для blob URL
window.addEventListener('error', (event) => {
    if (event.target && event.target.src && event.target.src.startsWith('blob:')) {
        console.warn('Ошибка загрузки blob URL:', event.target.src);
        event.preventDefault();
    }
});

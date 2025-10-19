// Скрипт для отключения blob операций в основном сайте
if (window.location.search.includes('editor=true') || window.location.search.includes('noblob=1')) {
    console.log('🔒 Blob operations disabled in editor mode');
    
    // Блокируем createObjectURL
    if (typeof URL !== 'undefined' && URL.createObjectURL) {
        const originalCreate = URL.createObjectURL;
        URL.createObjectURL = function(blob) {
            console.warn('createObjectURL blocked in editor mode');
            return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zNWVtIj5JbWFnZTwvdGV4dD48L3N2Zz4=';
        };
    }
    
    // Перехватываем ошибки blob
    window.addEventListener('error', function(e) {
        if (e.target && e.target.src && e.target.src.startsWith('blob:')) {
            console.warn('Blob resource error intercepted');
            e.preventDefault();
            return false;
        }
    }, true);
}

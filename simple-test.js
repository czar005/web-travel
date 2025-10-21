// SIMPLE TEST - ДОЛЖЕН СРАБОТАТЬ
console.log('🎯 SIMPLE TEST SCRIPT LOADED');

// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM READY - searching for footer...');
    
    // Ищем ВСЕ footer-section
    const sections = document.querySelectorAll('.footer-section');
    console.log('Found sections:', sections.length);
    
    // Берем ПЕРВЫЙ section
    if (sections.length > 0) {
        const firstSection = sections[0];
        console.log('First section:', firstSection);
        
        // Ищем ВСЕ параграфы в нем
        const paragraphs = firstSection.querySelectorAll('p');
        console.log('Paragraphs in first section:', paragraphs.length);
        
        // Берем ПЕРВЫЙ параграф
        if (paragraphs.length > 0) {
            const firstParagraph = paragraphs[0];
            console.log('First paragraph before:', firstParagraph.textContent);
            
            // МЕНЯЕМ ТЕКСТ НАПРЯМУЮ
            firstParagraph.textContent = '✅ РАБОТАЕТ: Текст из редактора';
            console.log('First paragraph after:', firstParagraph.textContent);
        }
    }
});

// Также запускаем сразу (на случай если DOM уже загружен)
console.log('🔄 Running immediately...');
const sections = document.querySelectorAll('.footer-section');
if (sections.length > 0) {
    const firstSection = sections[0];
    const paragraphs = firstSection.querySelectorAll('p');
    if (paragraphs.length > 0) {
        paragraphs[0].textContent = '✅ РАБОТАЕТ: Текст из редактора';
    }
}

// Debug data saving
console.log('🔧 Debug data saving loaded');

// Override saveData method to add debugging
if (window.editor && window.editor.saveData) {
    const originalSaveData = window.editor.saveData;
    window.editor.saveData = function() {
        console.log('💾 Saving data to localStorage...');
        console.log('Current data:', this.currentData);
        
        const result = originalSaveData.call(this);
        
        // Verify data was saved
        const saved = localStorage.getItem('worldtravel_data');
        console.log('✅ Data saved to localStorage:', !!saved);
        if (saved) {
            console.log('Saved data length:', saved.length);
            console.log('Saved data preview:', saved.substring(0, 200));
        }
        
        return result;
    };
}

// Also debug storage events
window.addEventListener('storage', function(e) {
    console.log('📦 Storage event:', e.key, e.newValue ? e.newValue.length : 'null');
});

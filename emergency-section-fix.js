// EMERGENCY FIX FOR SECTION OPENING - Run in browser console

console.log('🚨 EMERGENCY SECTION FIX...');

// 1. Create basic editor
window.editor = {
    loadSection: function(sectionName) {
        console.log('Opening section:', sectionName);
        
        // Show editor
        const editor = document.getElementById('content-editor');
        if (editor) {
            editor.style.display = 'block';
            console.log('✅ Editor shown');
        }
        
        // Load data
        this.loadSectionData(sectionName);
    },
    
    loadSectionData: function(sectionName) {
        // Try to load existing data
        try {
            const data = localStorage.getItem('worldtravel_data');
            if (data) {
                const parsed = JSON.parse(data);
                if (parsed.content && parsed.content[sectionName]) {
                    document.getElementById('section-title').value = parsed.content[sectionName].title || '';
                    document.getElementById('section-description').value = parsed.content[sectionName].description || '';
                    console.log('✅ Data loaded');
                }
            }
        } catch (e) {
            console.log('📝 No existing data');
        }
    },
    
    saveSection: function() {
        const active = document.querySelector('.section-item.active');
        if (!active) {
            alert('❌ Выберите раздел сначала');
            return false;
        }
        
        const section = active.getAttribute('data-section');
        const title = document.getElementById('section-title').value;
        const description = document.getElementById('section-description').value;
        
        // Save to localStorage
        try {
            const existing = localStorage.getItem('worldtravel_data');
            const data = existing ? JSON.parse(existing) : { content: {} };
            data.content[section] = { title, description };
            localStorage.setItem('worldtravel_data', JSON.stringify(data));
            console.log('💾 Saved:', section);
            alert('✅ Раздел "' + section + '" сохранен!');
        } catch (e) {
            alert('❌ Ошибка сохранения');
        }
        
        return false;
    }
};

// 2. Setup section clicks
document.querySelectorAll('.section-item').forEach(section => {
    section.onclick = function() {
        // Remove active class from all
        document.querySelectorAll('.section-item').forEach(s => s.classList.remove('active'));
        // Add to clicked
        this.classList.add('active');
        
        // Open editor
        const sectionName = this.getAttribute('data-section');
        window.editor.loadSection(sectionName);
    };
});

// 3. Setup buttons
document.getElementById('save-section-button').onclick = function() { return window.editor.saveSection(); };

console.log('✅ EMERGENCY FIX APPLIED!');
console.log('🖱️ Now click on any section - it should open!');

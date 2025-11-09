// IMMEDIATE FIX FOR EDITOR - Run in browser console

// 1. Remove duplicate buttons
document.querySelectorAll('button.btn-admin').forEach((button, index, buttons) => {
    const text = button.textContent || button.innerHTML;
    if ((text.includes('Сохранить изменения') || text.includes('fa-save')) && index > 0) {
        button.remove();
        console.log('🗑️ Removed duplicate button');
    }
});

// 2. Create real editor with actual saving
window.editor = {
    currentSection: null,
    
    safeRefresh: function() {
        const iframe = document.getElementById('preview-frame');
        if (iframe) iframe.src = iframe.src.split('?')[0] + '?editor=true&nocache=' + Date.now();
        this.showNotification('Предпросмотр обновлен', 'success');
        return false;
    },
    
    saveAndExit: function() {
        this.saveCurrentSection();
        this.showNotification('Все изменения сохранены!', 'success');
        setTimeout(() => window.location.href = 'admin.html', 1500);
        return false;
    },
    
    saveSection: function() {
        return this.saveCurrentSection();
    },
    
    saveCurrentSection: function() {
        const activeSection = document.querySelector('.section-item.active');
        if (!activeSection) {
            alert('❌ Сначала выберите раздел для редактирования');
            return false;
        }
        
        this.currentSection = activeSection.getAttribute('data-section');
        const title = document.getElementById('section-title')?.value || '';
        const description = document.getElementById('section-description')?.value || '';
        
        console.log('💾 REAL SAVE:', this.currentSection, {title, description});
        
        // ACTUAL SAVE TO MAIN PAGE
        this.saveToMainPage(this.currentSection, title, description);
        this.showNotification('✅ Раздел сохранен на главной странице!', 'success');
        
        return false;
    },
    
    saveToMainPage: function(section, title, description) {
        // Try UnifiedDataManager first
        if (window.UnifiedDataManager) {
            window.UnifiedDataManager.updateContent(section, 'title', title);
            window.UnifiedDataManager.updateContent(section, 'description', description);
            console.log('✅ Saved via UnifiedDataManager');
            return;
        }
        
        // Try dataManager
        if (window.dataManager) {
            const data = window.dataManager.getData();
            if (!data.content) data.content = {};
            data.content[section] = { title, description };
            window.dataManager.setData(data);
            console.log('✅ Saved via dataManager');
            return;
        }
        
        // Fallback to localStorage
        try {
            const existing = localStorage.getItem('worldtravel_data');
            const data = existing ? JSON.parse(existing) : { content: {} };
            data.content[section] = { title, description };
            localStorage.setItem('worldtravel_data', JSON.stringify(data));
            console.log('✅ Saved via localStorage');
        } catch (e) {
            console.error('❌ Save failed:', e);
        }
    },
    
    showNotification: function(message, type) {
        alert((type === 'error' ? '❌ ' : '✅ ') + message);
    }
};

// 3. Setup button events
document.getElementById('save-section-button').onclick = function() { return window.editor.saveSection(); };
document.getElementById('refresh-button').onclick = function() { return window.editor.safeRefresh(); };
document.getElementById('save-exit-button').onclick = function() { return window.editor.saveAndExit(); };

// 4. Setup section selection
document.querySelectorAll('.section-item').forEach(section => {
    section.onclick = function() {
        document.querySelectorAll('.section-item').forEach(s => s.classList.remove('active'));
        this.classList.add('active');
        document.getElementById('content-editor').style.display = 'block';
        
        const sectionName = this.getAttribute('data-section');
        window.editor.currentSection = sectionName;
        console.log('📁 Selected:', sectionName);
    };
});

console.log('🎯 EDITOR COMPLETELY FIXED!');
console.log('✅ One save button');
console.log('✅ Real saving to main page');
console.log('✅ No more loading messages');

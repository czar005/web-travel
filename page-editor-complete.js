// Полная реализация StablePageEditor с поддержкой создания секций
// Этот файл содержит все методы класса для экономии места в HTML

// Методы класса StablePageEditor (продолжение)

setupFrameListener() {
    const frame = document.getElementById('preview-frame');
    frame.onload = () => {
        console.log('✅ Фрейм предпросмотра загружен');
        if (this.currentSection) {
            setTimeout(() => {
                this.selectSection(this.currentSection.id);
            }, 500);
        }
    };
}

selectSection(sectionId) {
    console.log('🎯 Выбор секции:', sectionId);
    
    document.querySelectorAll('.section-item').forEach(item => {
        item.classList.remove('active');
    });

    const selectedItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (selectedItem) {
        selectedItem.classList.add('active');
    }

    this.currentSection = this.sections.find(s => s.id === sectionId);
    this.showContentEditor();
    this.showTab('content');
}

showTab(tabName) {
    console.log('📑 Переключение на вкладку:', tabName);
    
    document.querySelectorAll('.panel-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    const targetTab = document.getElementById(tabName + '-tab');
    if (targetTab) {
        targetTab.style.display = 'block';
    }
    
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const targetButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    }
}

showContentEditor() {
    if (!this.currentSection) {
        const editor = document.getElementById('content-editor');
        editor.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-mouse-pointer"></i>
                <p>Выберите секцию для редактирования</p>
                <small>Перейдите на вкладку "Секции" и выберите нужный блок</small>
            </div>
        `;
        return;
    }

    const editor = document.getElementById('content-editor');
    
    let editorHTML = `
        <div class="content-header">
            <h3>${this.currentSection.name}</h3>
            <p style="color: #666; margin-top: 5px; font-size: 0.9em;">Редактирование содержимого секции</p>
        </div>
    `;

    this.currentSection.fields.forEach(field => {
        if (field.type === 'stats') {
            editorHTML += this.getStatsEditor();
        } else if (field.type === 'services') {
            editorHTML += this.getServicesEditor();
        } else if (field.type === 'features') {
            editorHTML += this.getFeaturesEditor();
        } else if (field.type === 'image') {
            editorHTML += this.getImageEditor(field);
        } else {
            const currentValue = this.getCurrentValue(field);
            editorHTML += `
                <div class="form-group">
                    <label>${field.label}:</label>
                    ${field.type === 'textarea' ? 
                        `<textarea class="form-control" data-field="${field.id}" placeholder="Введите ${field.label.toLowerCase()}...">${currentValue}</textarea>` :
                        `<input type="text" class="form-control" data-field="${field.id}" value="${currentValue}" placeholder="Введите ${field.label.toLowerCase()}...">`
                    }
                </div>
            `;
        }
    });

    editorHTML += `
        <div class="action-buttons">
            <button class="btn btn-primary" id="save-changes-btn">
                <i class="fas fa-save"></i> Применить изменения
            </button>
            <button class="btn btn-secondary" id="back-to-sections-btn">
                <i class="fas fa-arrow-left"></i> Назад к списку
            </button>
        </div>
        
        <div class="debug-info">
            <strong>Отладка:</strong> Секция: ${this.currentSection.id} | Тип: ${this.currentSection.type} | Поля: ${this.currentSection.fields.length}
        </div>
    `;

    editor.innerHTML = editorHTML;
    
    document.getElementById('save-changes-btn').addEventListener('click', () => {
        this.saveChanges();
    });
    
    document.getElementById('back-to-sections-btn').addEventListener('click', () => {
        this.showTab('sections');
    });
    
    this.hasUnsavedChanges = false;
}

getCurrentValue(field) {
    // Для контактов
    if (this.currentSection.id === 'contact' && field.id !== 'title') {
        if (this.currentData.contacts && this.currentData.contacts[field.id]) {
            return this.escapeHtml(this.currentData.contacts[field.id]);
        }
    }
    
    // Для футера
    if (this.currentSection.id === 'footer') {
        if (this.currentData.footer && this.currentData.footer[field.id]) {
            return this.escapeHtml(this.currentData.footer[field.id]);
        }
    }
    
    // Для пользовательских секций
    if (this.currentData.content && this.currentData.content[this.currentSection.id]) {
        const sectionData = this.currentData.content[this.currentSection.id];
        if (sectionData[field.id]) {
            return this.escapeHtml(sectionData[field.id]);
        }
    }
    
    return '';
}

// Остальные методы (getImageEditor, handleImageUpload, saveChanges и т.д.)
// должны быть реализованы аналогично предыдущей версии

saveLocalData(data) {
    localStorage.setItem('worldtravel_data', JSON.stringify(data));
    console.log('💾 Данные сохранены в localStorage');
    
    // Обновляем DataManager если он доступен
    if (typeof window.dataManager !== 'undefined' && window.dataManager) {
        window.dataManager.setData(data);
    }
}

safeRefresh() {
    if (this.hasUnsavedChanges) {
        if (!confirm('У вас есть несохраненные изменения. Обновить предпросмотр?')) {
            return;
        }
    }
    
    const frame = document.getElementById('preview-frame');
    frame.src = frame.src.split('&t=')[0] + '&t=' + Date.now();
    this.showNotification('Предпросмотр обновлен');
}

saveAndExit() {
    if (this.hasUnsavedChanges) {
        if (confirm('У вас есть несохраненные изменения. Сохранить перед выходом?')) {
            this.saveChanges();
        }
    }
    
    this.showNotification('Возврат в админ-панель...');
    setTimeout(() => {
        window.location.href = 'admin.html';
    }, 1000);
}

showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type === 'error' ? 'error' : ''}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'check-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 4000);
}

showSaveIndicator(message) {
    const indicator = document.getElementById('save-indicator');
    const messageEl = document.getElementById('save-message');
    
    if (indicator && messageEl) {
        messageEl.textContent = message;
        indicator.classList.add('show');
        
        setTimeout(() => {
            indicator.classList.remove('show');
        }, 3000);
    }
}

escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Исправления для редактора страниц

// 1. Исправляем обновление структуры страницы
class FixedPageEditor extends StablePageEditor {
    updatePageStructure() {
        if (!this.currentData.pageStructure) {
            this.currentData.pageStructure = [];
        }
        
        // Полностью перестраиваем структуру на основе текущего порядка секций
        this.currentData.pageStructure = this.sections
            .filter(section => section.id !== 'footer')
            .map(section => section.id);
        
        // Добавляем футер в конец
        if (this.sections.find(s => s.id === 'footer')) {
            this.currentData.pageStructure.push('footer');
        }
        
        console.log('�� Обновлена структура страницы:', this.currentData.pageStructure);
        
        // Сохраняем изменения
        this.saveData();
    }

    // 2. Исправляем сохранение данных для пользовательских секций
    saveChanges() {
        if (!this.currentSection) return;

        try {
            const formData = {};
            document.querySelectorAll('#content-editor [data-field]').forEach(input => {
                const fieldId = input.getAttribute('data-field');
                formData[fieldId] = input.value;
            });

            // Обрабатываем специальные поля
            this.processSpecialFields(formData);

            // Обновляем основные поля
            Object.keys(formData).forEach(fieldId => {
                if (this.currentSection.id === 'contact' && fieldId !== 'title') {
                    if (!this.currentData.contacts) this.currentData.contacts = {};
                    this.currentData.contacts[fieldId] = formData[fieldId];
                } else if (this.currentSection.id === 'footer') {
                    if (!this.currentData.footer) this.currentData.footer = {};
                    this.currentData.footer[fieldId] = formData[fieldId];
                } else {
                    // Для пользовательских секций
                    if (!this.currentData.content[this.currentSection.id]) {
                        this.currentData.content[this.currentSection.id] = {};
                    }
                    this.currentData.content[this.currentSection.id][fieldId] = formData[fieldId];
                }
            });

            // Сохраняем изменения
            this.saveData();
            this.hasUnsavedChanges = false;
            this.showSaveIndicator('Изменения сохранены успешно');
            this.showNotification('Изменения применены!', 'success');
            
            // Обновляем предпросмотр
            this.safeRefresh();
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            this.showNotification('Ошибка сохранения: ' + error.message, 'error');
        }
    }

    // 3. Добавляем возможность удаления изображения
    getImageEditor(field) {
        const currentImage = this.getCurrentValue(field);
        return `
            <div class="form-group image-upload-container">
                <label>${field.label}:</label>
                <div class="image-preview ${!currentImage ? 'empty' : ''}" id="image-preview-${field.id}">
                    ${currentImage ? 
                        `<img src="${currentImage}" alt="Preview">` :
                        `<i class="fas fa-image"></i><span>Изображение не выбрано</span>`
                    }
                </div>
                <div class="image-actions">
                    <button class="btn btn-primary" onclick="document.getElementById('image-file-input').setAttribute('data-field', '${field.id}'); document.getElementById('image-file-input').click()">
                        <i class="fas fa-upload"></i> Загрузить
                    </button>
                    <button class="btn btn-secondary" onclick="editor.promptImageUrl('${field.id}')">
                        <i class="fas fa-link"></i> Указать URL
                    </button>
                    ${currentImage ? `
                    <button class="btn btn-danger" onclick="editor.removeImage('${field.id}')">
                        <i class="fas fa-trash"></i> Удалить
                    </button>
                    ` : ''}
                </div>
                <input type="hidden" data-field="${field.id}" value="${currentImage}" id="image-field-${field.id}">
            </div>
        `;
    }

    removeImage(fieldId) {
        const field = document.querySelector(`[data-field="${fieldId}"]`);
        if (field) {
            field.value = '';
            const preview = document.getElementById(`image-preview-${fieldId}`);
            preview.innerHTML = '<i class="fas fa-image"></i><span>Изображение не выбрано</span>';
            preview.classList.add('empty');
            this.hasUnsavedChanges = true;
            this.showNotification('Изображение удалено');
        }
    }

    // 4. Исправляем обработку загрузки изображений
    handleImageUpload(file) {
        const fieldId = document.getElementById('image-file-input').getAttribute('data-field');
        // В реальном приложении здесь была бы загрузка на сервер
        // Для демо используем Object URL
        const imageUrl = URL.createObjectURL(file);
        this.updateImageField(imageUrl, fieldId);
        this.showNotification('Изображение загружено (демо)');
    }

    updateImageField(url, fieldId) {
        const field = document.querySelector(`[data-field="${fieldId}"]`);
        if (field) {
            field.value = url;
            const preview = document.getElementById(`image-preview-${fieldId}`);
            preview.innerHTML = `<img src="${url}" alt="Preview">`;
            preview.classList.remove('empty');
            
            // Добавляем кнопку удаления если её нет
            const actions = preview.closest('.image-upload-container').querySelector('.image-actions');
            if (!actions.querySelector('.btn-danger')) {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'btn btn-danger';
                deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Удалить';
                deleteBtn.onclick = () => this.removeImage(fieldId);
                actions.appendChild(deleteBtn);
            }
            
            this.hasUnsavedChanges = true;
        }
    }

    // 5. Улучшаем рендеринг пользовательских секций
    renderCustomSection(container, sectionData) {
        const sectionElement = document.createElement('section');
        sectionElement.className = `custom-section ${sectionData.type}-section`;
        sectionElement.id = sectionData.id;
        sectionElement.setAttribute('data-section-id', sectionData.id);

        console.log('🎨 Rendering custom section:', sectionData.id, sectionData.type, sectionData);

        switch (sectionData.type) {
            case 'text':
                sectionElement.innerHTML = `
                    <div class="container">
                        <h2 class="section-title">${sectionData.title || ''}</h2>
                        <div class="section-content">
                            <p>${sectionData.content || ''}</p>
                        </div>
                    </div>
                `;
                break;
            case 'image':
                sectionElement.innerHTML = `
                    <div class="container">
                        <div class="section-content" style="display: flex; gap: 30px; align-items: center; flex-wrap: wrap;">
                            <div class="text-content" style="flex: 1; min-width: 300px;">
                                <h2 class="section-title">${sectionData.title || ''}</h2>
                                <p>${sectionData.content || ''}</p>
                            </div>
                            <div class="image-content" style="flex: 1; min-width: 300px; text-align: center;">
                                ${sectionData.image ? `<img src="${sectionData.image}" alt="${sectionData.title}" style="max-width: 100%; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">` : ''}
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'features':
                sectionElement.innerHTML = `
                    <div class="container">
                        <h2 class="section-title">${sectionData.title || ''}</h2>
                        <div class="features-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; margin-top: 40px;">
                            ${(sectionData.features || []).map(feature => `
                                <div class="feature-item" style="text-align: center; padding: 30px 20px; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
                                    <div class="feature-icon" style="font-size: 3em; margin-bottom: 20px; color: #2c5aa0;">
                                        <i class="${feature.icon || 'fas fa-star'}"></i>
                                    </div>
                                    <h3 style="margin-bottom: 15px; color: #333;">${feature.title || ''}</h3>
                                    <p style="color: #666; line-height: 1.6;">${feature.description || ''}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
                break;
            case 'cta':
                sectionElement.innerHTML = `
                    <div class="container">
                        <div class="cta-section" style="text-align: center; padding: 60px 40px; background: linear-gradient(135deg, #2c5aa0, #4a7bc8); color: white; border-radius: 15px; margin: 40px 0;">
                            <h2 style="margin-bottom: 20px; font-size: 2.5em;">${sectionData.title || ''}</h2>
                            <p style="margin-bottom: 30px; font-size: 1.2em; opacity: 0.9;">${sectionData.description || ''}</p>
                            ${sectionData.buttonText ? `
                                <a href="${sectionData.buttonUrl || '#'}" class="cta-button" style="background: white; color: #2c5aa0; padding: 15px 40px; border-radius: 30px; text-decoration: none; font-weight: 600; display: inline-block; font-size: 1.1em; transition: all 0.3s ease;">
                                    ${sectionData.buttonText}
                                </a>
                            ` : ''}
                        </div>
                    </div>
                `;
                break;
            case 'contacts':
                sectionElement.innerHTML = `
                    <div class="container">
                        <h2 class="section-title">${sectionData.title || 'Контакты'}</h2>
                        <div class="contact-content" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; margin-top: 40px;">
                            <div class="contact-info" style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                                <h3 style="margin-bottom: 20px; color: #2c5aa0;">Контактная информация</h3>
                                ${sectionData.phone ? `
                                    <div class="contact-item" style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                                        <i class="fas fa-phone" style="color: #2c5aa0;"></i>
                                        <span style="font-weight: 500;">${sectionData.phone}</span>
                                    </div>
                                ` : ''}
                                ${sectionData.email ? `
                                    <div class="contact-item" style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                                        <i class="fas fa-envelope" style="color: #2c5aa0;"></i>
                                        <span style="font-weight: 500;">${sectionData.email}</span>
                                    </div>
                                ` : ''}
                                ${sectionData.address ? `
                                    <div class="contact-item" style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                                        <i class="fas fa-map-marker-alt" style="color: #2c5aa0;"></i>
                                        <span style="font-weight: 500;">${sectionData.address}</span>
                                    </div>
                                ` : ''}
                                ${sectionData.hours ? `
                                    <div class="contact-item" style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                                        <i class="fas fa-clock" style="color: #2c5aa0;"></i>
                                        <span style="font-weight: 500;">${sectionData.hours}</span>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `;
                break;
        }

        // Добавляем стили
        sectionElement.style.padding = '80px 0';
        sectionElement.style.background = sectionData.type === 'cta' ? 'transparent' : '#f8f9fa';
        
        if (sectionData.type === 'cta') {
            sectionElement.style.padding = '40px 0';
        }

        container.appendChild(sectionElement);
    }
}

// Заменяем оригинальный редактор на исправленный
window.editor = new FixedPageEditor();

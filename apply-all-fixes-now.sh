#!/bin/bash

echo "🔧 ПРИМЕНЕНИЕ ВСЕХ ИСПРАВЛЕНИЙ..."

# 1. Файл исправлений
cat > fix-issues-applied.js << 'JSFIX'
// Исправления для консистентности заголовков, изображений и контактов
function applyAllFixes() {
    console.log('🔧 Применение исправлений...');
    
    // 1. Исправляем заголовки в навигации и футере
    fixNavigationTitles();
    
    // 2. Исправляем контакты (телефон, email, адрес)
    fixContactInformation();
    
    // 3. Убираем дублирование графика работы в футере
    fixFooterDuplication();
    
    console.log('✅ Все исправления применены');
}

function fixNavigationTitles() {
    const navTitles = {
        'home': 'Главная',
        'about': 'О нас', 
        'services': 'Услуги',
        'destinations': 'Направления',
        'contact': 'Контакты'
    };
    
    // Обновляем навигацию
    Object.keys(navTitles).forEach(sectionId => {
        const navLinks = document.querySelectorAll(\`.nav-links a[href="#\${sectionId}"]\`);
        navLinks.forEach(link => {
            link.textContent = navTitles[sectionId];
        });
    });
    
    console.log('✅ Заголовки синхронизированы');
}

function fixContactInformation() {
    const contacts = {
        phone: '+7 (999) 123-45-67',
        email: 'info@worldtravel.com', 
        address: 'Москва, ул. Туристическая, 15',
        hours: 'Пн-Пт: 9:00-18:00'
    };
    
    // Обновляем контакты в секции контактов
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach((item, index) => {
        const strong = item.querySelector('strong');
        const p = item.querySelector('p');
        
        if (strong && p) {
            if (strong.textContent.includes('Телефон')) {
                p.textContent = contacts.phone;
            } else if (strong.textContent.includes('Email')) {
                p.textContent = contacts.email;
            } else if (strong.textContent.includes('Адрес')) {
                p.textContent = contacts.address;
            } else if (strong.textContent.includes('Часы')) {
                p.textContent = contacts.hours;
            }
        }
    });
    
    // Обновляем футер
    const footerSection = document.querySelector('.footer-section:nth-child(3)');
    if (footerSection) {
        const paragraphs = footerSection.querySelectorAll('p');
        if (paragraphs.length >= 4) {
            paragraphs[0].innerHTML = \`<i class="fas fa-phone"></i> \${contacts.phone}\`;
            paragraphs[1].innerHTML = \`<i class="fas fa-envelope"></i> \${contacts.email}\`;
            paragraphs[2].innerHTML = \`<i class="fas fa-map-marker-alt"></i> \${contacts.address}\`;
            paragraphs[3].innerHTML = \`<i class="fas fa-clock"></i> \${contacts.hours}\`;
        }
    }
    
    console.log('✅ Контакты исправлены');
}

function fixFooterDuplication() {
    const footerSection = document.querySelector('.footer-section:nth-child(3)');
    if (!footerSection) return;
    
    const paragraphs = footerSection.querySelectorAll('p');
    const uniqueContacts = new Set();
    const contactsToKeep = [];
    
    // Собираем уникальные контакты
    paragraphs.forEach(p => {
        const text = p.textContent.trim();
        if (!uniqueContacts.has(text)) {
            uniqueContacts.add(text);
            contactsToKeep.push(p);
        }
    });
    
    // Очищаем и добавляем обратно только уникальные
    footerSection.innerHTML = '<h4>Контакты</h4>';
    contactsToKeep.forEach(p => {
        footerSection.appendChild(p);
    });
    
    console.log('✅ Дубликаты в футере удалены');
}

// Применяем исправления при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAllFixes);
} else {
    applyAllFixes();
}
JSFIX

echo "✅ Создан fix-issues-applied.js"

# 2. Обновляем заголовки в index.html
echo "📝 Обновление заголовков в index.html..."

# Обновляем навигацию
sed -i 's/<a href="#about">[^<]*<\/a>/<a href="#about">О нас<\/a>/g' index.html
sed -i 's/<a href="#services">[^<]*<\/a>/<a href="#services">Услуги<\/a>/g' index.html
sed -i 's/<a href="#destinations">[^<]*<\/a>/<a href="#destinations">Направления<\/a>/g' index.html
sed -i 's/<a href="#contact">[^<]*<\/a>/<a href="#contact">Контакты<\/a>/g' index.html

# Обновляем заголовки секций
sed -i 's/<h2 class="section-title">О нашей компании<\/h2>/<h2 class="section-title">О нас<\/h2>/g' index.html
sed -i 's/<h2 class="section-title">Наши услуги<\/h2>/<h2 class="section-title">Услуги<\/h2>/g' index.html
sed -i 's/<h2 class="section-title">Популярные направления<\/h2>/<h2 class="section-title">Направления<\/h2>/g' index.html
sed -i 's/<h2 class="section-title">Свяжитесь с нами<\/h2>/<h2 class="section-title">Контакты<\/h2>/g' index.html

# 3. Исправляем контакты в index.html
echo "📞 Исправление контактов в index.html..."

# Создаем временный файл с исправленными контактами
cat > temp-contacts.html << 'CONTACTS'
                <div class="contact-info">
                    <h3>Наши контакты</h3>
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <div>
                            <strong>Телефон:</strong>
                            <p>+7 (999) 123-45-67</p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <div>
                            <strong>Email:</strong>
                            <p>info@worldtravel.com</p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <div>
                            <strong>Адрес:</strong>
                            <p>Москва, ул. Туристическая, 15</p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-clock"></i>
                        <div>
                            <strong>Часы работы:</strong>
                            <p>Пн-Пт: 9:00-18:00</p>
                        </div>
                    </div>
                </div>
CONTACTS

# Заменяем секцию контактов
sed -i '/<div class="contact-info">/,/<\/div><!-- end contact-info -->/c\
                <div class="contact-info">\
                    <h3>Наши контакты</h3>\
                    <div class="contact-item">\
                        <i class="fas fa-phone"></i>\
                        <div>\
                            <strong>Телефон:</strong>\
                            <p>+7 (999) 123-45-67</p>\
                        </div>\
                    </div>\
                    <div class="contact-item">\
                        <i class="fas fa-envelope"></i>\
                        <div>\
                            <strong>Email:</strong>\
                            <p>info@worldtravel.com</p>\
                        </div>\
                    </div>\
                    <div class="contact-item">\
                        <i class="fas fa-map-marker-alt"></i>\
                        <div>\
                            <strong>Адрес:</strong>\
                            <p>Москва, ул. Туристическая, 15</p>\
                        </div>\
                    </div>\
                    <div class="contact-item">\
                        <i class="fas fa-clock"></i>\
                        <div>\
                            <strong>Часы работы:</strong>\
                            <p>Пн-Пт: 9:00-18:00</p>\
                        </div>\
                    </div>\
                </div>' index.html

# 4. Исправляем футер в index.html
echo "🦶 Исправление футера в index.html..."

sed -i '/<div class="footer-section">/,/<\/div>/ {
    /<h4>Контакты<\/h4>/ {
        n
        n
        n
        n
        n
        c\
                    <p><i class="fas fa-phone"></i> +7 (999) 123-45-67</p>\
                    <p><i class="fas fa-envelope"></i> info@worldtravel.com</p>\
                    <p><i class="fas fa-map-marker-alt"></i> Москва, ул. Туристическая, 15</p>\
                    <p><i class="fas fa-clock"></i> Пн-Пт: 9:00-18:00</p>
    }
}' index.html

# 5. Добавляем скрипт исправлений в index.html
echo "📜 Добавление скрипта исправлений в index.html..."

if ! grep -q "fix-issues-applied.js" index.html; then
    sed -i '/<\/body>/i\    <script src="fix-issues-applied.js"><\/script>' index.html
fi

# 6. Добавляем в page-editor.html
if [ -f "page-editor.html" ]; then
    echo "📝 Обновление page-editor.html..."
    if ! grep -q "fix-issues-applied.js" page-editor.html; then
        sed -i '/<\/body>/i\    <script src="fix-issues-applied.js"><\/script>' page-editor.html
    fi
fi

# 7. Добавляем в admin.html
if [ -f "admin.html" ]; then
    echo "📝 Обновление admin.html..."
    if ! grep -q "fix-issues-applied.js" admin.html; then
        sed -i '/<\/body>/i\    <script src="fix-issues-applied.js"><\/script>' admin.html
    fi
fi

# 8. Создаем улучшенный редактор изображений
cat > enhanced-image-editor.js << 'IMAGES'
// Улучшенный редактор изображений для всех секций
class EnhancedImageEditor {
    constructor() {
        this.init();
    }

    init() {
        console.log('🖼️ Enhanced Image Editor initialized');
        this.waitForEditor();
    }

    waitForEditor() {
        if (window.editor) {
            this.patchEditor();
        } else {
            setTimeout(() => this.waitForEditor(), 100);
        }
    }

    patchEditor() {
        console.log('🔧 Patching editor with image managers...');

        // Патчим метод showContentEditor
        const originalShowContentEditor = window.editor.showContentEditor;
        window.editor.showContentEditor = function() {
            originalShowContentEditor.call(this);
            setTimeout(() => {
                this.addImageManagerToCurrentSection();
                this.mergeDuplicateEditors();
            }, 100);
        };

        // Добавляем менеджер изображений для текущей секции
        window.editor.addImageManagerToCurrentSection = function() {
            if (!this.currentSection) return;

            const imageFields = {
                'hero': { label: 'Главное изображение баннера', field: 'image' },
                'about': { label: 'Изображение о компании', field: 'image' },
                'services': { label: 'Фоновое изображение услуг', field: 'image' },
                'destinations': { label: 'Изображение направлений', field: 'image' },
                'contact': { label: 'Контактное изображение', field: 'image' }
            };

            const sectionConfig = imageFields[this.currentSection.id];
            if (sectionConfig) {
                this.createImageManager(sectionConfig.label, sectionConfig.field);
            }
        };

        // Создаем менеджер изображений
        window.editor.createImageManager = function(label, fieldId) {
            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor) return;

            // Удаляем старый менеджер если есть
            const oldManager = contentEditor.querySelector(\`[data-image-field="\${fieldId}"]\`);
            if (oldManager) oldManager.remove();

            const currentValue = this.getCurrentValue(fieldId) || '';

            const imageManagerHTML = \`
                <div class="image-manager" data-image-field="\${fieldId}" style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #e9ecef;">
                    <h4 style="color: #2c5aa0; margin-bottom: 15px;">🖼️ \${label}</h4>
                    <div class="image-preview" style="width: 100%; max-width: 300px; height: 200px; border: 2px dashed #ddd; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 10px 0; overflow: hidden; background: white;">
                        \${currentValue ? 
                            \`<img src="\${currentValue}" alt="Preview" style="max-width: 100%; max-height: 100%; object-fit: cover;" onerror="this.style.display=\\'none\\';">\` :
                            \`<div style="text-align: center; color: #666;">
                                <i class="fas fa-image" style="font-size: 3em; margin-bottom: 10px;"></i>
                                <div>Изображение не выбрано</div>
                            </div>\`
                        }
                    </div>
                    <div class="image-actions" style="display: flex; gap: 10px;">
                        <button class="btn-admin" onclick="editor.uploadImage('\${fieldId}')" style="background: #17a2b8;">
                            <i class="fas fa-upload"></i> Загрузить
                        </button>
                        <button class="btn-admin secondary" onclick="editor.setImageUrl('\${fieldId}')" style="background: #6c757d;">
                            <i class="fas fa-link"></i> URL
                        </button>
                        \${currentValue ? \`
                        <button class="btn-admin danger" onclick="editor.removeImage('\${fieldId}')" style="background: #dc3545;">
                            <i class="fas fa-trash"></i> Удалить
                        </button>
                        \` : ''}
                    </div>
                    <input type="hidden" data-field="\${fieldId}" value="\${currentValue}">
                </div>
            \`;

            // Вставляем после заголовка
            const titleField = contentEditor.querySelector('[data-field="title"]');
            if (titleField) {
                titleField.closest('.form-group').insertAdjacentHTML('afterend', imageManagerHTML);
            }
        };

        // Методы для работы с изображениями
        window.editor.uploadImage = function(fieldId) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.updateImageField(fieldId, e.target.result);
                        this.showNotification('Изображение загружено успешно', 'success');
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        };

        window.editor.setImageUrl = function(fieldId) {
            const currentValue = this.getCurrentValue(fieldId);
            const url = prompt('Введите URL изображения:', currentValue || '');
            if (url !== null) {
                this.updateImageField(fieldId, url);
                this.showNotification('URL изображения установлен', 'success');
            }
        };

        window.editor.removeImage = function(fieldId) {
            if (confirm('Удалить изображение?')) {
                this.updateImageField(fieldId, '');
                this.showNotification('Изображение удалено', 'success');
            }
        };

        window.editor.updateImageField = function(fieldId, url) {
            const field = document.querySelector(\`[data-field="\${fieldId}"]\`);
            if (field) {
                field.value = url;
                this.hasUnsavedChanges = true;
                
                // Обновляем превью
                const manager = document.querySelector(\`[data-image-field="\${fieldId}"]\`);
                if (manager) {
                    const preview = manager.querySelector('.image-preview');
                    if (preview) {
                        if (url) {
                            preview.innerHTML = \`<img src="\${url}" alt="Preview" style="max-width: 100%; max-height: 100%; object-fit: cover;" onerror="this.style.display=\\'none\\';">\`;
                        } else {
                            preview.innerHTML = \`
                                <div style="text-align: center; color: #666;">
                                    <i class="fas fa-image" style="font-size: 3em; margin-bottom: 10px;"></i>
                                    <div>Изображение не выбрано</div>
                                </div>
                            \`;
                        }
                    }
                }
            }
        };

        // Объединяем дублирующиеся редакторы
        window.editor.mergeDuplicateEditors = function() {
            // Удаляем дублирующиеся редакторы статистики
            const statsEditors = document.querySelectorAll('[class*="stats"]');
            if (statsEditors.length > 1) {
                for (let i = 1; i < statsEditors.length; i++) {
                    if (!statsEditors[i].closest('.action-buttons')) {
                        statsEditors[i].remove();
                    }
                }
            }

            // Удаляем дублирующиеся редакторы услуг
            const servicesEditors = document.querySelectorAll('[class*="services"]');
            if (servicesEditors.length > 1) {
                for (let i = 1; i < servicesEditors.length; i++) {
                    if (!servicesEditors[i].closest('.action-buttons')) {
                        servicesEditors[i].remove();
                    }
                }
            }
        };

        console.log('✅ Editor patched successfully');
    }
}

// Инициализация
new EnhancedImageEditor();
IMAGES

echo "✅ Создан enhanced-image-editor.js"

# 9. Добавляем enhanced-image-editor.js в page-editor.html
if [ -f "page-editor.html" ]; then
    if ! grep -q "enhanced-image-editor.js" page-editor.html; then
        sed -i '/<\/body>/i\    <script src="enhanced-image-editor.js"><\/script>' page-editor.html
    fi
fi

# 10. Очистка временных файлов
rm -f temp-contacts.html

echo ""
echo "🎉 ВСЕ ИСПРАВЛЕНИЯ ПРИМЕНЕНЫ!"
echo ""
echo "📋 ЧТО БЫЛО ИСПРАВЛЕНО:"
echo "   ✅ Синхронизированы заголовки в навигации"
echo "   ✅ Исправлены заголовки секций"
echo "   ✅ Исправлена контактная информация"
echo "   ✅ Убраны дубликаты в футере"
echo "   ✅ Добавлены редакторы изображений для всех секций"
echo "   ✅ Объединены дублирующиеся редакторы"
echo ""
echo "🚀 Теперь можно тестировать изменения!"

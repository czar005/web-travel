// Editor Layout Fixer - предотвращает выпирание элементов за границы
function EditorLayoutFixer() {
    this.init();
}

EditorLayoutFixer.prototype.init = function() {
    console.log('🎨 Editor Layout Fixer initialized');
    
    // Применяем фиксы при загрузке редактора
    this.applyLayoutFixes();
    
    // Мониторим изменения в DOM редактора
    this.observeEditorChanges();
};

EditorLayoutFixer.prototype.applyLayoutFixes = function() {
    const style = document.createElement('style');
    style.textContent = `
        /* Emergency fixes for editor overflow */
        #content-editor * {
            max-width: 100% !important;
            box-sizing: border-box !important;
        }
        
        #content-editor .form-control,
        #content-editor input,
        #content-editor textarea,
        #content-editor select {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
        }
        
        #content-editor .working-stats-editor,
        #content-editor .working-services-editor,
        #content-editor .unified-contacts-editor {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
        }
        
        /* Force responsive behavior */
        @media (max-width: 768px) {
            #content-editor .form-group {
                padding: 0 5px !important;
            }
            
            #content-editor .working-stats-editor > div,
            #content-editor .working-services-editor > div {
                flex-direction: column !important;
                align-items: stretch !important;
            }
            
            #content-editor .working-stats-editor input,
            #content-editor .working-services-editor input {
                min-width: auto !important;
                max-width: 100% !important;
            }
        }
    `;
    
    document.head.appendChild(style);
    console.log('✅ Emergency layout fixes applied');
};

EditorLayoutFixer.prototype.observeEditorChanges = function() {
    // Ждем инициализации редактора
    const checkEditor = () => {
        if (window.editor) {
            this.patchEditorMethods();
        } else {
            setTimeout(checkEditor, 100);
        }
    };
    checkEditor();
};

EditorLayoutFixer.prototype.patchEditorMethods = function() {
    const self = this;
    
    // Патчим метод показа редактора контента
    const originalShowContentEditor = window.editor.showContentEditor;
    
    window.editor.showContentEditor = function() {
        originalShowContentEditor.call(this);
        
        // Применяем фиксы после отрисовки редактора
        setTimeout(() => {
            self.fixCurrentEditorLayout();
        }, 150);
    };
    
    console.log('✅ Editor methods patched for layout fixes');
};

EditorLayoutFixer.prototype.fixCurrentEditorLayout = function() {
    const contentEditor = document.getElementById('content-editor');
    if (!contentEditor) return;
    
    // Применяем фиксы ко всем элементам внутри редактора
    this.fixAllInputs(contentEditor);
    this.fixContainers(contentEditor);
    this.fixButtons(contentEditor);
    
    console.log('✅ Current editor layout fixed');
};

EditorLayoutFixer.prototype.fixAllInputs = function(container) {
    const inputs = container.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.style.maxWidth = '100%';
        input.style.boxSizing = 'border-box';
        input.style.width = '100%';
    });
};

EditorLayoutFixer.prototype.fixContainers = function(container) {
    const containers = container.querySelectorAll('.form-group, .working-stats-editor, .working-services-editor, .unified-contacts-editor');
    containers.forEach(container => {
        container.style.maxWidth = '100%';
        container.style.boxSizing = 'border-box';
        container.style.overflow = 'hidden';
    });
};

EditorLayoutFixer.prototype.fixButtons = function(container) {
    const buttons = container.querySelectorAll('.btn, .btn-admin, .btn-small');
    buttons.forEach(button => {
        button.style.maxWidth = '100%';
        button.style.boxSizing = 'border-box';
        button.style.whiteSpace = 'nowrap';
        button.style.overflow = 'hidden';
        button.style.textOverflow = 'ellipsis';
    });
};

// Инициализация фиксера
new EditorLayoutFixer();

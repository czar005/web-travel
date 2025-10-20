// Fix for duplicate stats and services editors
class DuplicateFixer {
    constructor() {
        this.init();
    }

    init() {
        if (window.editor) {
            this.patchEditor();
        } else {
            setTimeout(() => this.init(), 100);
        }
    }

    patchEditor() {
        console.log('🔧 Patching editor to remove duplicates...');

        const originalShow = window.editor.showContentEditor;
        
        window.editor.showContentEditor = function() {
            originalShow.call(this);
            setTimeout(() => {
                this.removeDuplicateEditors();
            }, 150);
        };

        // Remove duplicate editors
        window.editor.removeDuplicateEditors = function() {
            const contentEditor = document.getElementById('content-editor');
            if (!contentEditor) return;

            this.removeDuplicateStatsEditors(contentEditor);
            this.removeDuplicateServicesEditors(contentEditor);
        };

        // Remove duplicate stats editors - keep only one
        window.editor.removeDuplicateStatsEditors = function(contentEditor) {
            const statsEditors = contentEditor.querySelectorAll('[class*="stats"]');
            if (statsEditors.length > 1) {
                console.log('🧹 Removing duplicate stats editors:', statsEditors.length);
                // Keep first, remove others
                for (let i = 1; i < statsEditors.length; i++) {
                    if (!statsEditors[i].closest('.action-buttons')) {
                        statsEditors[i].remove();
                    }
                }
            }
        };

        // Remove duplicate services editors - keep only one
        window.editor.removeDuplicateServicesEditors = function(contentEditor) {
            const servicesEditors = contentEditor.querySelectorAll('[class*="services"]');
            if (servicesEditors.length > 1) {
                console.log('🧹 Removing duplicate services editors:', servicesEditors.length);
                // Keep first, remove others
                for (let i = 1; i < servicesEditors.length; i++) {
                    if (!servicesEditors[i].closest('.action-buttons')) {
                        servicesEditors[i].remove();
                    }
                }
            }
        };
    }
}

new DuplicateFixer();

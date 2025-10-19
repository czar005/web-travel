const fs = require('fs');

console.log('📝 Updating all editors with fixed scripts...');

const editorFiles = [
    'page-editor.html',
    'enhanced-page-editor.html',
    'page-editor-backup-final.html'
];

editorFiles.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        // Remove old scripts
        content = content.replace(/<script src="[^"]*super-editor[^"]*"><\/script>\n?/g, '');
        content = content.replace(/<script src="[^"]*enhanced-content-updater[^"]*"><\/script>\n?/g, '');
        
        // Add fixed scripts
        if (!content.includes('super-editor-fixed.js')) {
            content = content.replace('</body>', 
                '    <script src="enhanced-content-updater-fixed.js"></script>\n    <script src="super-editor-fixed.js"></script>\n</body>'
            );
        }
        
        fs.writeFileSync(file, content);
        console.log('✅ Updated: ' + file);
    }
});

console.log('🎉 All editors updated with fixed scripts!');

const fs = require('fs');

console.log('📄 Updating index.html with fixed scripts...');

let indexHtml = fs.readFileSync('index.html', 'utf8');

// Remove old scripts
indexHtml = indexHtml.replace(/<script src="[^"]*super-editor[^"]*"><\/script>\n?/g, '');
indexHtml = indexHtml.replace(/<script src="[^"]*enhanced-content-updater[^"]*"><\/script>\n?/g, '');
indexHtml = indexHtml.replace(/<script src="[^"]*force-update[^"]*"><\/script>\n?/g, '');

// Add fixed scripts before closing body tag
if (!indexHtml.includes('super-editor-fixed.js')) {
    indexHtml = indexHtml.replace('</body>', 
        '    <script src="enhanced-content-updater-fixed.js"></script>\n    <script src="super-editor-fixed.js"></script>\n</body>'
    );
}

fs.writeFileSync('index.html', indexHtml);
console.log('✅ index.html updated successfully');

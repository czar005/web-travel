const fs = require('fs');
const content = fs.readFileSync('data-manager.js', 'utf8');

const methods = [
    'getDesign',
    'updateDesign', 
    'getContent',
    'updateContent',
    'syncWithMainPage'
];

console.log('Checking methods in data-manager.js:');
methods.forEach(method => {
    if (content.includes(`${method}(`)) {
        console.log(`✅ ${method} - FOUND`);
    } else {
        console.log(`❌ ${method} - MISSING`);
    }
});

// Script to check all resources and fix 404 errors
console.log('🔍 Checking for missing resources...');

function checkResource(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ url, status: 'OK' });
        img.onerror = () => resolve({ url, status: '404' });
        img.src = url;
    });
}

async function checkAllResources() {
    const resources = [
        'data-manager.js',
        'content-sync.js', 
        'script.js',
        'admin.js',
        'style.css',
        'admin-style.css',
        'images/travel-placeholder.svg'
    ];

    console.log('📋 Checking resources:');
    
    for (const resource of resources) {
        const result = await checkResource(resource);
        console.log(`${result.status === 'OK' ? '✅' : '❌'} ${resource}: ${result.status}`);
    }
}

// Check if we're in a browser environment
if (typeof window !== 'undefined') {
    checkAllResources();
}

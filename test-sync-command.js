// Test sync command
console.log('🧪 TEST SYNC COMMAND LOADED');

// Test function to manually update data
window.testUpdateData = function() {
    console.log('🧪 Testing data update...');
    
    const testData = {
        contacts: {
            phone: '+7 (999) TEST-99-99',
            email: 'test@example.com', 
            address: 'Test Address, Moscow',
            hours: 'Test Hours: 9:00-18:00'
        },
        footer: {
            description: 'TEST Footer Description',
            copyright: '&copy; 2024 TEST Company'
        },
        content: {
            about: { title: 'TEST About Title' },
            services: { title: 'TEST Services Title' },
            destinations: { title: 'TEST Destinations Title' },
            contact: { title: 'TEST Contact Title' },
            hero: { title: 'TEST Hero Title', subtitle: 'TEST Hero Subtitle' }
        },
        lastUpdate: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('worldtravel_data', JSON.stringify(testData));
    console.log('✅ Test data saved to localStorage');
    
    // Trigger sync
    if (window.forceBulletproofSync) {
        window.forceBulletproofSync();
        console.log('✅ Sync triggered');
    } else {
        console.log('❌ forceBulletproofSync not available');
    }
};

console.log('✅ Test command ready. Run testUpdateData() in console.');

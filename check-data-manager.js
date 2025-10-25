// Check data manager
console.log('🔍 Checking data manager...');

setTimeout(() => {
    console.log('DataManager exists:', !!window.dataManager);
    if (window.dataManager) {
        console.log('DataManager methods:', Object.keys(window.dataManager));
        const data = window.dataManager.getData();
        console.log('Current data:', data);
    }
    
    // Check localStorage directly
    const stored = localStorage.getItem('worldtravel_data');
    console.log('LocalStorage data:', stored ? JSON.parse(stored) : 'null');
}, 1000);

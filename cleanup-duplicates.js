// Cleanup duplicate data in localStorage
function cleanupDuplicateData() {
    console.log('🧹 Cleaning up duplicate data...');
    
    try {
        const data = localStorage.getItem('worldtravel_data');
        if (data) {
            const parsed = JSON.parse(data);
            let cleaned = false;
            
            // Clean duplicate stats
            if (parsed.content?.about?.stats) {
                const uniqueStats = [];
                const seen = new Set();
                
                parsed.content.about.stats.forEach(stat => {
                    const key = stat.value + '|' + stat.label;
                    if (!seen.has(key)) {
                        seen.add(key);
                        uniqueStats.push(stat);
                    }
                });
                
                if (uniqueStats.length !== parsed.content.about.stats.length) {
                    parsed.content.about.stats = uniqueStats;
                    cleaned = true;
                    console.log('✅ Removed duplicate stats');
                }
            }
            
            // Clean duplicate services
            if (parsed.content?.services?.services) {
                const uniqueServices = [];
                const seen = new Set();
                
                parsed.content.services.services.forEach(service => {
                    const key = service.title + '|' + service.description;
                    if (!seen.has(key)) {
                        seen.add(key);
                        uniqueServices.push(service);
                    }
                });
                
                if (uniqueServices.length !== parsed.content.services.services.length) {
                    parsed.content.services.services = uniqueServices;
                    cleaned = true;
                    console.log('✅ Removed duplicate services');
                }
            }
            
            if (cleaned) {
                localStorage.setItem('worldtravel_data', JSON.stringify(parsed));
                console.log('✅ Data cleaned and saved');
            } else {
                console.log('✅ No duplicates found');
            }
        }
    } catch (error) {
        console.error('Error cleaning data:', error);
    }
}

// Run cleanup
cleanupDuplicateData();

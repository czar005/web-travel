// Cleanup existing data from extra blocks
function cleanupExistingData() {
    console.log('🧹 Cleaning up existing data...');
    
    try {
        const data = localStorage.getItem('worldtravel_data');
        if (data) {
            const parsed = JSON.parse(data);
            let cleaned = false;
            
            // Clean stats - keep only non-empty ones
            if (parsed.content?.about?.stats) {
                const originalLength = parsed.content.about.stats.length;
                parsed.content.about.stats = parsed.content.about.stats.filter(stat => 
                    stat.value && stat.value.trim() && stat.label && stat.label.trim()
                );
                
                if (parsed.content.about.stats.length !== originalLength) {
                    cleaned = true;
                    console.log('✅ Removed empty stats:', originalLength - parsed.content.about.stats.length);
                }
            }
            
            // Clean services - keep only non-empty ones
            if (parsed.content?.services?.services) {
                const originalLength = parsed.content.services.services.length;
                parsed.content.services.services = parsed.content.services.services.filter(service => 
                    service.title && service.title.trim() && service.description && service.description.trim()
                );
                
                if (parsed.content.services.services.length !== originalLength) {
                    cleaned = true;
                    console.log('✅ Removed empty services:', originalLength - parsed.content.services.services.length);
                }
            }
            
            if (cleaned) {
                localStorage.setItem('worldtravel_data', JSON.stringify(parsed));
                console.log('✅ Data cleaned successfully');
            } else {
                console.log('✅ No cleanup needed');
            }
        }
    } catch (error) {
        console.error('Error cleaning data:', error);
    }
}

// Run cleanup
cleanupExistingData();

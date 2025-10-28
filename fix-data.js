// Script to fix data issues
console.log('🔧 Running data fix...');

if (window.dataManager) {
    console.log('🔄 Repairing data structure...');
    const success = window.dataManager.repairData();
    
    if (success) {
        console.log('✅ Data repaired successfully');
        alert('Данные успешно восстановлены! Теперь можно добавлять страны.');
    } else {
        console.error('❌ Failed to repair data');
        alert('Ошибка восстановления данных. Попробуйте обновить страницу.');
    }
    
    // Debug current state
    window.dataManager.debugData();
} else {
    console.error('❌ DataManager not available');
    alert('DataManager не доступен. Обновите страницу.');
}

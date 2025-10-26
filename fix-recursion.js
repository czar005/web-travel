// Fix for infinite recursion in dataManager
if (window.dataManager && window.dataManager.triggerDataUpdate) {
    var originalTriggerDataUpdate = window.dataManager.triggerDataUpdate;
    var isUpdating = false;
    
    window.dataManager.triggerDataUpdate = function() {
        if (isUpdating) return;
        isUpdating = true;
        
        try {
            originalTriggerDataUpdate.call(this);
        } finally {
            isUpdating = false;
        }
    };
    
    console.log('✅ Recursion fix applied to dataManager');
}

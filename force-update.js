// Force update all content
function forceUpdate() {
    console.log('🔧 Force updating content...');
    
    // Trigger data update event
    const event = new CustomEvent('dataUpdated', { 
        detail: { force: true, timestamp: Date.now() } 
    });
    window.dispatchEvent(event);
    
    // Reload content updater
    if (window.contentUpdater) {
        window.contentUpdater.appliedChanges.clear();
        window.contentUpdater.applyAllChanges();
    }
    
    console.log('✅ Force update completed');
}

// Add force update button to admin panels
document.addEventListener('DOMContentLoaded', function() {
    // Add button to admin header if it exists
    const adminHeader = document.querySelector('.admin-header, .panel-header');
    if (adminHeader) {
        const forceBtn = document.createElement('button');
        forceBtn.className = 'btn-admin warning';
        forceBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Force Update';
        forceBtn.onclick = forceUpdate;
        forceBtn.style.marginLeft = '10px';
        adminHeader.appendChild(forceBtn);
    }
});

// Auto force update on page load
setTimeout(forceUpdate, 1000);

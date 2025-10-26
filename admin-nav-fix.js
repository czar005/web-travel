// Admin navigation fix
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Admin nav fix loaded');
    
    // Fix tab navigation
    var tabButtons = document.querySelectorAll('.tab-button');
    var tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabButtons.length > 0 && tabPanes.length > 0) {
        tabButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                var tabName = this.getAttribute('data-tab');
                
                // Remove active class from all buttons and panes
                tabButtons.forEach(function(btn) {
                    btn.classList.remove('active');
                });
                tabPanes.forEach(function(pane) {
                    pane.classList.remove('active');
                });
                
                // Add active class to current button and pane
                this.classList.add('active');
                var targetPane = document.getElementById(tabName + '-tab');
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
        
        console.log('✅ Admin navigation fixed');
    }
});

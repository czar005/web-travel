// Simple content updater for main page
function updatePageContent() {
    if (!window.dataManager) return;
    
    const content = window.dataManager.getContent();
    if (!content) return;
    
    // Update hero section
    if (content.hero) {
        const heroTitle = document.querySelector('#home h1, .hero h1');
        const heroSubtitle = document.querySelector('#home p, .hero p');
        
        if (heroTitle && content.hero.title) heroTitle.textContent = content.hero.title;
        if (heroSubtitle && content.hero.subtitle) heroSubtitle.textContent = content.hero.subtitle;
    }
    
    // Update about section
    if (content.about) {
        const aboutTitle = document.querySelector('#about .section-title');
        const aboutDesc = document.querySelector('.about-text p');
        
        if (aboutTitle && content.about.title) aboutTitle.textContent = content.about.title;
        if (aboutDesc && content.about.description) aboutDesc.textContent = content.about.description;
        
        // Update stats
        if (content.about.stats) {
            const statElements = document.querySelectorAll('.stat, .about .stat');
            content.about.stats.forEach((stat, index) => {
                if (statElements[index]) {
                    const valueEl = statElements[index].querySelector('h3');
                    const labelEl = statElements[index].querySelector('p');
                    
                    if (valueEl) valueEl.textContent = stat.value;
                    if (labelEl) labelEl.textContent = stat.label;
                }
            });
        }
    }
}

// Update content when page loads and when data changes
document.addEventListener('DOMContentLoaded', updatePageContent);
window.addEventListener('dataUpdated', updatePageContent);

// Fixed Debug Script - No getEventListeners dependency
console.log('🔧 Starting fixed 404 debug...');

// 1. Check all resource loading
function checkAllResources() {
    console.log('📋 Checking all resources...');
    
    const resources = [
        'data-manager.js',
        'content-sync.js',
        'script.js',
        'admin.js', 
        'style.css',
        'admin-style.css',
        'admin-login.html',
        'page-editor.html',
        'images/travel-placeholder.svg'
    ];

    resources.forEach(resource => {
        fetch(resource, { method: 'HEAD' })
            .then(response => {
                console.log(`${response.ok ? '✅' : '❌'} ${resource}: ${response.status}`);
            })
            .catch(error => {
                console.log(`❌ ${resource}: ${error.message}`);
            });
    });
}

// 2. Monitor dynamic script creation - FIXED
let scriptMonitorActive = true;

function monitorScriptCreation() {
    if (!scriptMonitorActive) return;
    
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        const element = originalCreateElement.call(this, tagName);
        
        if (tagName.toLowerCase() === 'script') {
            const originalSetAttribute = element.setAttribute;
            element.setAttribute = function(name, value) {
                if (name === 'src') {
                    if (!value || value === 'undefined') {
                        console.error('🚨 CRITICAL: Script with invalid src:', value);
                        console.trace();
                        // Prevent loading of invalid scripts
                        return;
                    }
                    console.log('🔍 Script created with src:', value);
                }
                return originalSetAttribute.call(this, name, value);
            };
            
            element.addEventListener('error', function(e) {
                console.error('🚨 Script load error:', this.src);
            });
        }
        
        return element;
    };
}

// 3. Monitor fetch requests
function monitorFetch() {
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0];
        
        if (typeof url === 'string') {
            // Check for undefined URLs
            if (url === 'undefined' || url.includes('undefined')) {
                console.error('🚨 Fetch with undefined URL:', url);
                console.trace();
                return Promise.reject(new Error('Invalid URL: ' + url));
            }
            
            if (!url.startsWith('http') && !url.startsWith('//') && !url.startsWith('data:')) {
                console.log('🔍 Fetch request:', url);
            }
        }
        
        return originalFetch.apply(this, args).catch(error => {
            if (typeof url === 'string') {
                console.error('🚨 Fetch failed:', url, error);
            }
            throw error;
        });
    };
}

// 4. Monitor image errors - IMPROVED
function monitorImages() {
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            const src = e.target.src;
            // Check for problematic image URLs
            if (src === 'undefined' || src.includes('undefined')) {
                console.error('🚨 Image with undefined src:', src);
                console.trace();
                
                // Try to fix the image source
                if (e.target.hasAttribute('data-country')) {
                    e.target.src = 'images/travel-placeholder.svg';
                } else {
                    e.target.src = 'images/travel-placeholder.svg';
                }
            } else {
                console.error('🚨 Image load error:', src);
            }
        }
    }, true);
    
    // Also monitor future image elements
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    if (node.tagName === 'IMG') {
                        node.addEventListener('error', handleImageError);
                    }
                    // Check for images in added nodes
                    node.querySelectorAll && node.querySelectorAll('img').forEach(img => {
                        img.addEventListener('error', handleImageError);
                    });
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function handleImageError(e) {
    const img = e.target;
    const src = img.src;
    
    if (src === 'undefined' || src.includes('undefined')) {
        console.error('🚨 Dynamic image with undefined src:', src);
        
        // Fix the image source based on context
        if (img.closest('.country-card')) {
            img.src = 'images/travel-placeholder.svg';
        } else {
            img.src = 'images/travel-placeholder.svg';
        }
    }
}

// 5. Monitor all network requests - IMPROVED
function monitorXHR() {
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(...args) {
        this.addEventListener('error', () => {
            if (this._url && (this._url === 'undefined' || this._url.includes('undefined'))) {
                console.error('🚨 XHR with undefined URL:', this._url);
                console.trace();
            }
        });
        return originalSend.apply(this, args);
    };

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._url = url;
        if (typeof url === 'string' && (url === 'undefined' || url.includes('undefined'))) {
            console.error('🚨 XHR open with undefined URL:', url);
            console.trace();
            return;
        }
        return originalOpen.call(this, method, url, ...args);
    };
}

// 6. Check for data-manager image issues
function checkDataManagerImages() {
    if (window.dataManager && window.dataManager.getCountries) {
        const countries = window.dataManager.getCountries();
        countries.forEach(country => {
            if (!country.image || country.image === 'undefined' || country.image.includes('undefined')) {
                console.error('🚨 Country with broken image:', country.name, country.image);
            }
        });
    }
}

// 7. Safe event listener check (without getEventListeners)
function safeEventCheck() {
    console.log('🔍 Checking for obvious event issues...');
    
    // Check for elements with onclick but no handler
    document.querySelectorAll('[onclick]').forEach(el => {
        const onclick = el.getAttribute('onclick');
        if (onclick && onclick.includes('undefined')) {
            console.error('🚨 Element with undefined onclick:', el, onclick);
        }
    });
    
    // Check for script tags with invalid src
    document.querySelectorAll('script[src]').forEach(script => {
        const src = script.getAttribute('src');
        if (src === 'undefined' || src.includes('undefined')) {
            console.error('🚨 Script tag with invalid src:', src);
        }
    });
}

// Initialize all monitoring
function initializeMonitoring() {
    try {
        monitorScriptCreation();
        monitorFetch();
        monitorImages();
        monitorXHR();
        
        console.log('✅ Debug monitoring initialized');
    } catch (error) {
        console.error('❌ Error initializing debug monitoring:', error);
    }
}

// Run comprehensive check
function runComprehensiveCheck() {
    console.log('🔍 Running comprehensive check...');
    
    checkAllResources();
    safeEventCheck();
    checkDataManagerImages();
    
    // Check for any elements with undefined attributes
    document.querySelectorAll('*').forEach(el => {
        for (let attr of el.attributes) {
            if (attr.value === 'undefined') {
                console.warn('⚠️ Element with undefined attribute:', el, attr.name);
            }
        }
    });
}

console.log('✅ Fixed debug tools installed. Monitoring for 404 errors...');

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeMonitoring();
        setTimeout(runComprehensiveCheck, 1000);
        setTimeout(runComprehensiveCheck, 5000); // Second check after images load
    });
} else {
    initializeMonitoring();
    setTimeout(runComprehensiveCheck, 1000);
    setTimeout(runComprehensiveCheck, 5000);
}

// Export functions for manual testing
window.debug404 = {
    checkResources: checkAllResources,
    runCheck: runComprehensiveCheck,
    fixImages: checkDataManagerImages
};

// Comprehensive 404 Debug Script
console.log('🔧 Starting comprehensive 404 debug...');

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

// 2. Monitor dynamic script creation
const originalCreateElement = document.createElement;
document.createElement = function(tagName) {
    const element = originalCreateElement.call(this, tagName);
    
    if (tagName.toLowerCase() === 'script') {
        const originalSetAttribute = element.setAttribute;
        element.setAttribute = function(name, value) {
            if (name === 'src' && !value) {
                console.error('🚨 CRITICAL: Script with empty src attribute created!');
                console.trace();
            }
            return originalSetAttribute.call(this, name, value);
        };
        
        element.addEventListener('error', function(e) {
            console.error('🚨 Script load error:', this.src);
        });
    }
    
    return element;
};

// 3. Monitor fetch requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
    const url = args[0];
    
    if (typeof url === 'string' && !url.startsWith('http') && !url.startsWith('//')) {
        console.log('🔍 Fetch request:', url);
    }
    
    return originalFetch.apply(this, args).catch(error => {
        if (typeof url === 'string') {
            console.error('🚨 Fetch failed:', url, error);
        }
        throw error;
    });
};

// 4. Monitor image errors
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        console.error('🚨 Image load error:', e.target.src);
    }
}, true);

// 5. Check for undefined event listeners
function checkEventListeners() {
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
        const listeners = getEventListeners(el);
        if (listeners) {
            Object.keys(listeners).forEach(eventType => {
                listeners[eventType].forEach(listener => {
                    if (!listener.listener) {
                        console.error('🚨 Undefined event listener on:', el, 'event:', eventType);
                    }
                });
            });
        }
    });
}

// 6. Monitor all network requests
(function() {
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(...args) {
        this.addEventListener('error', () => {
            if (this._url && !this._url.startsWith('http')) {
                console.error('🚨 XHR failed:', this._url);
            }
        });
        return originalSend.apply(this, args);
    };

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._url = url;
        if (typeof url === 'string' && !url.startsWith('http') && !url.startsWith('//')) {
            console.log('🔍 XHR request:', url);
        }
        return originalOpen.call(this, method, url, ...args);
    };
})();

console.log('✅ Debug tools installed. Monitoring for 404 errors...');

// Run initial checks when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(checkAllResources, 1000);
        setTimeout(checkEventListeners, 2000);
    });
} else {
    setTimeout(checkAllResources, 1000);
    setTimeout(checkEventListeners, 2000);
}

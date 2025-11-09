// Sync Monitor - Debug and verify synchronization
(function() {
    'use strict';
    
    console.log('📊 Sync Monitor loaded');
    
    window.SyncMonitor = {
        logs: [],
        lastSync: null,
        
        init: function() {
            this.startMonitoring();
            this.createMonitorUI();
            console.log('📊 Sync Monitor active');
        },
        
        startMonitoring: function() {
            // Monitor data changes
            window.addEventListener('unifiedDataUpdate', (e) => {
                this.log('🔄 Unified data update', e.detail);
            });
            
            window.addEventListener('dataUpdated', (e) => {
                this.log('📊 Legacy data update', e.detail);
            });
            
            // Monitor storage changes
            window.addEventListener('storage', (e) => {
                if (e.key === 'worldtravel_data') {
                    this.log('💾 Storage event detected');
                }
            });
            
            // Monitor focus events
            window.addEventListener('focus', () => {
                this.log('👀 Page focused - checking for updates');
            });
        },
        
        log: function(message, data = null) {
            const entry = {
                timestamp: new Date().toLocaleTimeString(),
                message: message,
                data: data
            };
            
            this.logs.unshift(entry);
            this.lastSync = new Date();
            
            // Keep only last 50 logs
            if (this.logs.length > 50) {
                this.logs.pop();
            }
            
            this.updateMonitorUI();
            console.log(`[${entry.timestamp}] ${message}`, data || '');
        },
        
        createMonitorUI: function() {
            // Only create in development mode
            if (!location.href.includes('localhost') && !location.href.includes('127.0.0.1')) {
                return;
            }
            
            const monitor = document.createElement('div');
            monitor.id = 'sync-monitor';
            monitor.style.cssText = `
                position: fixed;
                bottom: 10px;
                right: 10px;
                width: 300px;
                max-height: 200px;
                background: rgba(0,0,0,0.9);
                color: #00ff00;
                font-family: monospace;
                font-size: 12px;
                padding: 10px;
                border-radius: 5px;
                z-index: 10000;
                overflow-y: auto;
                border: 1px solid #00ff00;
                display: none;
            `;
            
            document.body.appendChild(monitor);
            
            // Add toggle button
            const toggleBtn = document.createElement('button');
            toggleBtn.textContent = '📊';
            toggleBtn.style.cssText = `
                position: fixed;
                bottom: 10px;
                right: 10px;
                z-index: 10001;
                background: #000;
                color: #0f0;
                border: 1px solid #0f0;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                cursor: pointer;
            `;
            
            toggleBtn.addEventListener('click', () => {
                monitor.style.display = monitor.style.display === 'none' ? 'block' : 'none';
            });
            
            document.body.appendChild(toggleBtn);
        },
        
        updateMonitorUI: function() {
            const monitor = document.getElementById('sync-monitor');
            if (!monitor) return;
            
            const logsToShow = this.logs.slice(0, 8);
            monitor.innerHTML = logsToShow.map(log => 
                `<div style="margin-bottom: 5px; border-bottom: 1px solid #333; padding-bottom: 5px;">
                    <span style="color: #888;">[${log.timestamp}]</span> ${log.message}
                </div>`
            ).join('');
        },
        
        getStatus: function() {
            return {
                lastSync: this.lastSync,
                logCount: this.logs.length,
                unifiedSystem: !!window.UnifiedDataManager,
                dataManager: !!window.dataManager,
                localStorage: !!localStorage.getItem('worldtravel_data')
            };
        },
        
        forceCheck: function() {
            this.log('🔍 Manual sync check initiated');
            
            // Check all data sources
            const sources = {
                localStorage: localStorage.getItem('worldtravel_data'),
                unifiedData: window.UnifiedDataManager ? window.UnifiedDataManager.getData() : null,
                dataManager: window.dataManager ? window.dataManager.getData() : null
            };
            
            this.log('📋 Data sources check', sources);
            
            // Trigger sync
            if (window.UnifiedDataManager) {
                window.UnifiedDataManager.forceSync();
            }
        }
    };
    
    // Initialize monitor
    window.SyncMonitor.init();
    
    // Global access
    window.debugSync = {
        monitor: window.SyncMonitor,
        forceSync: () => {
            if (window.UnifiedDataManager) {
                window.UnifiedDataManager.forceSync();
            }
        },
        getStatus: () => window.SyncMonitor.getStatus()
    };
    
})();


// Main application logic
class App {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.userRole = 'user'; // 'user' or 'moderator'
        this.init();
    }

    init() {
        this.loadUserState();
        this.bindGlobalEvents();
        this.initializeApp();
    }

    loadUserState() {
        // Load user state from localStorage
        const savedUser = localStorage.getItem('currentUser');
        const savedRole = localStorage.getItem('userRole');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.isAuthenticated = true;
            this.userRole = savedRole || 'user';
            this.updateUserInterface();
        }
    }

    bindGlobalEvents() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }

            // Escape to close modals
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Handle external links
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.href && !e.target.href.startsWith(window.location.origin)) {
                e.preventDefault();
                window.open(e.target.href, '_blank');
            }
        });
    }

    initializeApp() {
        console.log('SafeHome App initialized');
        
        // Check if user should see onboarding
        if (!localStorage.getItem('onboardingCompleted') && this.isAuthenticated) {
            window.router.navigateTo('onboarding');
        }

        // Initialize mock data for dashboard
        this.initializeMockData();
        
        // Update UI based on authentication state
        this.updateNavigation();
    }

    updateUserInterface() {
        this.updateNavigation();
        this.updateDashboardUserInfo();
    }

    updateNavigation() {
        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');
        const navActions = document.querySelector('.nav-actions');
        
        if (this.isAuthenticated) {
            // User is logged in
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            
            // Add user menu if not exists
            if (!document.getElementById('user-menu')) {
                const userMenu = document.createElement('div');
                userMenu.id = 'user-menu';
                userMenu.className = 'user-menu';
                userMenu.innerHTML = `
                    <button class="user-menu-toggle">
                        <div class="user-avatar-small">${this.getUserInitials()}</div>
                        <span>${this.currentUser.name}</span>
                    </button>
                    <div class="user-dropdown">
                        <a href="#dashboard" data-page="dashboard">Личный кабинет</a>
                        <a href="#settings" data-page="settings">Настройки</a>
                        <a href="#logout" id="global-logout-btn">Выйти</a>
                    </div>
                `;
                navActions.appendChild(userMenu);
                
                // Bind logout event
                document.getElementById('global-logout-btn').addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            }
        } else {
            // User is not logged in
            if (loginBtn) loginBtn.style.display = 'block';
            if (registerBtn) registerBtn.style.display = 'block';
            
            // Remove user menu if exists
            const userMenu = document.getElementById('user-menu');
            if (userMenu) {
                userMenu.remove();
            }
        }
    }

    updateDashboardUserInfo() {
        if (this.isAuthenticated && this.currentUser) {
            // Update all user info elements in dashboard
            const userNames = document.querySelectorAll('#user-name, #user-name-devices, #user-name-alerts, #user-name-reports, #user-name-settings, #user-name-scan');
            const userAvatars = document.querySelectorAll('#user-avatar, #user-avatar-devices, #user-avatar-alerts, #user-avatar-reports, #user-avatar-settings, #user-avatar-scan');
            
            userNames.forEach(el => {
                if (el) el.textContent = this.currentUser.name;
            });
            
            userAvatars.forEach(el => {
                if (el) el.textContent = this.getUserInitials();
            });
        }
    }

    getUserInitials() {
        if (!this.currentUser || !this.currentUser.name) return 'П';
        return this.currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    initializeMockData() {
        // This would normally come from an API
        const mockData = {
            devices: [
                { id: 1, name: 'iPhone 13', type: 'phone', status: 'trusted', lastSeen: '2 min ago' },
                { id: 2, name: 'MacBook Pro', type: 'laptop', status: 'trusted', lastSeen: '5 min ago' },
                { id: 3, name: 'Unknown Device', type: 'unknown', status: 'suspicious', lastSeen: '10 min ago' },
                { id: 4, name: 'Smart TV', type: 'tv', status: 'trusted', lastSeen: '1 hour ago' }
            ],
            alerts: [
                { id: 1, type: 'warning', title: 'New Bluetooth Device', description: 'Unknown device detected', time: '10 minutes ago' },
                { id: 2, type: 'critical', title: 'Suspicious Activity', description: 'Unusual data transmission', time: '2 hours ago' }
            ]
        };

        localStorage.setItem('mockData', JSON.stringify(mockData));
    }

    openSearch() {
        // Create search modal
        const searchModal = document.createElement('div');
        searchModal.className = 'search-modal';
        searchModal.innerHTML = `
            <div class="search-backdrop"></div>
            <div class="search-container">
                <div class="search-header">
                    <input type="text" placeholder="Поиск устройств, оповещений..." class="search-input" autofocus>
                    <button class="search-close">✕</button>
                </div>
                <div class="search-results">
                    <div class="search-placeholder">
                        Введите запрос для поиска...
                    </div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .search-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                display: flex;
                align-items: flex-start;
                justify-content: center;
                padding-top: 100px;
            }
            .search-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                backdrop-filter: blur(4px);
            }
            .search-container {
                background: var(--bg-primary);
                border-radius: var(--radius-2xl);
                box-shadow: var(--shadow-xl);
                width: 90%;
                max-width: 600px;
                z-index: 10001;
                border: 1px solid var(--border-color);
            }
            .search-header {
                padding: var(--space-4);
                border-bottom: 1px solid var(--border-color);
                display: flex;
                align-items: center;
                gap: var(--space-3);
            }
            .search-input {
                flex: 1;
                border: none;
                background: transparent;
                color: var(--text-primary);
                font-size: var(--font-size-lg);
                outline: none;
            }
            .search-close {
                background: none;
                border: none;
                font-size: var(--font-size-xl);
                cursor: pointer;
                color: var(--text-secondary);
                padding: var(--space-1);
            }
            .search-results {
                padding: var(--space-4);
                min-height: 200px;
            }
            .user-menu {
                position: relative;
                display: flex;
                align-items: center;
            }
            .user-menu-toggle {
                display: flex;
                align-items: center;
                gap: var(--space-2);
                background: none;
                border: none;
                color: var(--text-primary);
                cursor: pointer;
                padding: var(--space-2);
                border-radius: var(--radius-lg);
            }
            .user-menu-toggle:hover {
                background: var(--bg-tertiary);
            }
            .user-avatar-small {
                width: 32px;
                height: 32px;
                background: var(--primary);
                border-radius: var(--radius-md);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                font-size: var(--font-size-sm);
            }
            .user-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-lg);
                padding: var(--space-2);
                min-width: 150px;
                display: none;
                z-index: 100;
            }
            .user-menu:hover .user-dropdown {
                display: block;
            }
            .user-dropdown a {
                display: block;
                padding: var(--space-2) var(--space-3);
                color: var(--text-primary);
                text-decoration: none;
                border-radius: var(--radius-md);
                font-size: var(--font-size-sm);
            }
            .user-dropdown a:hover {
                background: var(--bg-secondary);
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(searchModal);

        // Bind events
        const closeBtn = searchModal.querySelector('.search-close');
        const backdrop = searchModal.querySelector('.search-backdrop');
        const searchInput = searchModal.querySelector('.search-input');

        const closeSearch = () => {
            searchModal.remove();
            style.remove();
        };

        closeBtn.addEventListener('click', closeSearch);
        backdrop.addEventListener('click', closeSearch);

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSearch();
            }
        });
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.search-modal, .chart-tooltip');
        modals.forEach(modal => modal.remove());
    }

    // User management methods
    login(userData, role = 'user') {
        this.currentUser = userData;
        this.isAuthenticated = true;
        this.userRole = role;
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('userRole', role);
        
        this.updateUserInterface();
        
        // Redirect based on role
        if (role === 'moderator') {
            window.router.navigateTo('moderator');
        } else {
            window.router.navigateTo('dashboard');
        }
    }

    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.userRole = 'user';
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userRole');
        this.updateUserInterface();
        window.router.navigateTo('home');
    }

    // Data fetching methods (mock)
    async fetchDevices() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockData = JSON.parse(localStorage.getItem('mockData') || '{}');
                resolve(mockData.devices || []);
            }, 500);
        });
    }

    async fetchAlerts() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockData = JSON.parse(localStorage.getItem('mockData') || '{}');
                resolve(mockData.alerts || []);
            }, 300);
        });
    }

    // Check if user is authenticated
    checkAuth() {
        return this.isAuthenticated;
    }

    // Moderator methods
    backupSystem() {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.showNotification('Резервное копирование системы завершено успешно', 'success');
                resolve({ success: true, timestamp: new Date().toISOString() });
            }, 2000);
        });
    }

    clearCache() {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.showNotification('Кэш системы успешно очищен', 'success');
                resolve({ success: true, cleared: 'all' });
            }, 1000);
        });
    }

    checkUpdates() {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.showNotification('Проверка обновлений завершена. Все компоненты актуальны.', 'info');
                resolve({ updates: false, version: '1.2.3' });
            }, 1500);
        });
    }

    restartServices() {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.showNotification('Системные сервисы успешно перезапущены', 'success');
                resolve({ success: true, restarted: ['api', 'database', 'monitoring'] });
            }, 2500);
        });
    }

    refreshData() {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.showNotification('Данные успешно обновлены', 'success');
                resolve({ success: true, refreshed: new Date().toISOString() });
            }, 1000);
        });
    }

    // Notification system
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-text">${message}</span>
            </div>
        `;

        // Add styles
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-lg);
                    padding: var(--space-4);
                    box-shadow: var(--shadow-xl);
                    z-index: 1000;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    max-width: 300px;
                }
                .notification.success {
                    border-left: 4px solid var(--success);
                }
                .notification.error {
                    border-left: 4px solid var(--error);
                }
                .notification.warning {
                    border-left: 4px solid var(--warning);
                }
                .notification.info {
                    border-left: 4px solid var(--primary);
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                }
                .notification-icon {
                    font-size: var(--font-size-lg);
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});



// Theme management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.bindEvents();
    }

    applyTheme(theme) {
        document.body.className = `${theme}-theme`;
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.updateThemeToggle();
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    updateThemeToggle() {
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            const icon = toggle.querySelector('.theme-icon');
            if (icon) {
                icon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
            }
        }
    }

    bindEvents() {
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});


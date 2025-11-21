
// Components and interactivity
class ComponentsManager {
    constructor() {
        this.currentOnboardingSlide = 1;
        this.totalOnboardingSlides = 3;
        this.init();
    }

    init() {
        this.bindAuthForms();
        this.bindOnboarding();
        this.bindDashboard();
        this.bindNavigation();
        this.bindMobileMenu();
        this.bindBlogFilters();
        this.bindForgotPassword();
        this.bindNewScan();
        this.bindEnhancedInteractions();
        this.bindSocialAuth();
        this.bindSubscriptionButtons();
        this.bindLogoutButtons();
        this.bindModeratorControls();
        this.bindContactForm();
    }

    // Auth forms handling
    bindAuthForms() {
        const registerForm = document.getElementById('register-form');
        const loginForm = document.getElementById('login-form');

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        // Bind auth form links
        const authLinks = document.querySelectorAll('.auth-link');
        authLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('data-page');
                if (window.router) {
                    window.router.navigateTo(pageId);
                }
            });
        });

        // Phone input formatting
        const phoneInput = document.getElementById('reg-phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                this.formatPhoneNumber(e.target);
            });
        }
    }

    formatPhoneNumber(input) {
        // Simple phone formatting
        let value = input.value.replace(/\D/g, '');
        if (value.length > 0) {
            value = '+7 (' + value;
            if (value.length > 7) value = value.slice(0, 7) + ') ' + value.slice(7);
            if (value.length > 12) value = value.slice(0, 12) + '-' + value.slice(12);
            if (value.length > 15) value = value.slice(0, 15) + '-' + value.slice(15);
        }
        input.value = value;
    }

    handleRegister() {
        const form = document.getElementById('register-form');
        const formData = new FormData(form);
        
        // Simple validation
        const password = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm').value;
        
        if (password !== confirm) {
            this.showNotification('Пароли не совпадают', 'error');
            return;
        }
        
        if (password.length < 8) {
            this.showNotification('Пароль должен быть не менее 8 символов', 'error');
            return;
        }

        // Simulate API call
        this.showNotification('Аккаунт успешно создан!', 'success');
        setTimeout(() => {
            window.app.login({
                name: document.getElementById('reg-name').value,
                email: document.getElementById('reg-email').value
            });
        }, 1500);
    }

    handleLogin() {
        const form = document.getElementById('login-form');
        const isModerator = document.getElementById('moderator-check').checked;
        
        // Simulate login process
        this.showNotification('Вход выполнен успешно!', 'success');
        setTimeout(() => {
            if (isModerator) {
                window.app.login({
                    name: 'Администратор Системы',
                    email: 'admin@safehome.ru'
                }, 'moderator');
            } else {
                window.app.login({
                    name: 'Иван Иванов',
                    email: 'ivan@example.com'
                });
            }
        }, 1000);
    }

    bindSocialAuth() {
        const socialButtons = document.querySelectorAll('.btn-social');
        socialButtons.forEach(button => {
            button.addEventListener('click', () => {
                const provider = button.getAttribute('data-provider');
                this.handleSocialAuth(provider);
            });
        });
    }

    handleSocialAuth(provider) {
        // Mock social auth - randomly assign moderator role for demo
        const isModerator = Math.random() > 0.7;
        const role = isModerator ? 'moderator' : 'user';
        
        this.showNotification(`Вход через ${provider} выполнен!`, 'success');
        setTimeout(() => {
            window.app.login({
                name: 'Пользователь ' + provider,
                email: `user@${provider}.com`
            }, role);
        }, 1000);
    }

    // Subscription buttons handling
    bindSubscriptionButtons() {
        const subscribeButtons = document.querySelectorAll('.subscribe-btn, #subscribe-btn');
        
        subscribeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (!window.app.checkAuth()) {
                    e.preventDefault();
                    this.showNotification('Для оформления подписки необходимо войти в систему', 'warning');
                    setTimeout(() => {
                        window.router.navigateTo('login');
                    }, 1500);
                    return;
                }
                
                // User is authenticated, proceed with subscription
                this.showNotification('Подписка успешно оформлена!', 'success');
            });
        });
    }

    // Logout buttons handling
    bindLogoutButtons() {
        const logoutButtons = document.querySelectorAll('#logout-btn, #logout-btn-devices, #logout-btn-alerts, #logout-btn-reports, #logout-btn-settings, #logout-btn-scan, #logout-btn-moderator, #global-logout-btn');
        
        logoutButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                window.app.logout();
                this.showNotification('Вы успешно вышли из системы', 'info');
            });
        });
    }

    // Moderator controls handling
    bindModeratorControls() {
        const backupBtn = document.getElementById('backup-btn');
        const clearCacheBtn = document.getElementById('clear-cache-btn');
        const checkUpdatesBtn = document.getElementById('check-updates-btn');
        const restartServicesBtn = document.getElementById('restart-services-btn');
        const refreshDataBtn = document.getElementById('refresh-data');

        if (backupBtn) {
            backupBtn.addEventListener('click', () => {
                window.app.backupSystem();
            });
        }

        if (clearCacheBtn) {
            clearCacheBtn.addEventListener('click', () => {
                window.app.clearCache();
            });
        }

        if (checkUpdatesBtn) {
            checkUpdatesBtn.addEventListener('click', () => {
                window.app.checkUpdates();
            });
        }

        if (restartServicesBtn) {
            restartServicesBtn.addEventListener('click', () => {
                window.app.restartServices();
            });
        }

        if (refreshDataBtn) {
            refreshDataBtn.addEventListener('click', () => {
                window.app.refreshData();
            });
        }
    }

    // Contact form handling
    bindContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Simple validation
                const name = document.getElementById('contact-name').value;
                const email = document.getElementById('contact-email').value;
                const subject = document.getElementById('contact-subject').value;
                const message = document.getElementById('contact-message').value;
                
                if (!name || !email || !subject || !message) {
                    this.showNotification('Пожалуйста, заполните все поля', 'error');
                    return;
                }
                
                // Simulate form submission
                this.showNotification('Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
                contactForm.reset();
            });
        }
    }

    // Onboarding functionality
    bindOnboarding() {
        const nextBtn = document.getElementById('next-slide');
        const skipBtn = document.getElementById('skip-onboarding');
        const startBtn = document.getElementById('get-started');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextOnboardingSlide();
            });
        }

        if (skipBtn) {
            skipBtn.addEventListener('click', () => {
                localStorage.setItem('onboardingCompleted', 'true');
                window.router.navigateTo('dashboard');
            });
        }

        if (startBtn) {
            startBtn.addEventListener('click', () => {
                localStorage.setItem('onboardingCompleted', 'true');
                window.router.navigateTo('dashboard');
            });
        }
    }

    nextOnboardingSlide() {
        if (this.currentOnboardingSlide < this.totalOnboardingSlides) {
            // Hide current slide
            const currentSlide = document.querySelector(`[data-slide="${this.currentOnboardingSlide}"]`);
            currentSlide.classList.remove('active');
            
            this.currentOnboardingSlide++;
            
            // Show next slide
            const nextSlide = document.querySelector(`[data-slide="${this.currentOnboardingSlide}"]`);
            nextSlide.classList.add('active');
            
            // Update progress
            this.updateOnboardingProgress();
            
            // Update buttons
            if (this.currentOnboardingSlide === this.totalOnboardingSlides) {
                document.getElementById('next-slide').style.display = 'none';
                document.getElementById('get-started').style.display = 'block';
            }
        }
    }

    updateOnboardingProgress() {
        const progress = (this.currentOnboardingSlide / this.totalOnboardingSlides) * 100;
        const progressFill = document.getElementById('onboarding-progress');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
    }

    // Dashboard functionality
    bindDashboard() {
        // Simulate chart interactions
        this.bindChartInteractions();
        this.bindAlertInteractions();
    }

    bindMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (mobileMenuToggle && navMenu) {
            mobileMenuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileMenuToggle.classList.toggle('active');
            });
            
            // Close menu when clicking on links
            navMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                });
            });
        }
    }

    // Enhanced interactions
    bindEnhancedInteractions() {
        // Make cards clickable
        const cards = document.querySelectorAll('.stat-card, .pricing-card, .blog-card, .review-card, .feature-card');
        cards.forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function() {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });

        // Footer navigation
        const footerLinks = document.querySelectorAll('.footer-links a');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('data-page');
                if (pageId && window.router) {
                    window.router.navigateTo(pageId);
                }
            });
        });
    }

    bindBlogFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const blogCards = document.querySelectorAll('.blog-card');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                const filter = btn.textContent.toLowerCase();
                
                // Filter blog cards
                blogCards.forEach(card => {
                    if (filter === 'все' || card.querySelector('.category').textContent.toLowerCase() === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    bindForgotPassword() {
        const forgotLink = document.querySelector('.forgot-link');
        if (forgotLink) {
            forgotLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showNotification('Восстановление пароля временно недоступно', 'info');
            });
        }
    }

    bindNewScan() {
        const newScanBtn = document.querySelector('.btn-primary');
        if (newScanBtn && newScanBtn.textContent.includes('Новое сканирование')) {
            newScanBtn.addEventListener('click', () => {
                window.router.navigateTo('new-scan');
                this.startScanAnimation();
            });
        }
    }

    startScanAnimation() {
        const progressCircle = document.querySelector('.progress-circle');
        const progressText = document.querySelector('.progress-text');
        
        if (progressCircle && progressText) {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 10;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    setTimeout(() => {
                        window.router.navigateTo('dashboard');
                    }, 1000);
                }
                
                progressCircle.style.background = `conic-gradient(var(--primary) ${progress}%, var(--bg-tertiary) ${progress}%)`;
                progressText.textContent = `${Math.round(progress)}%`;
            }, 500);
        }
    }

    bindChartInteractions() {
        const bars = document.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            bar.addEventListener('click', () => {
                this.showChartTooltip(bar, `Пик активности: ${bar.getAttribute('data-value')}%`);
            });
        });
    }

    bindAlertInteractions() {
        const alertItems = document.querySelectorAll('.alert-item');
        alertItems.forEach(alert => {
            alert.addEventListener('click', () => {
                alert.classList.toggle('expanded');
            });
        });
    }

    showChartTooltip(element, text) {
        // Remove existing tooltip
        const existingTooltip = document.querySelector('.chart-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }

        // Create new tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'chart-tooltip';
        tooltip.textContent = text;
        
        const rect = element.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.left = rect.left + rect.width / 2 + 'px';
        tooltip.style.top = rect.top - 40 + 'px';
        tooltip.style.transform = 'translateX(-50%)';
        
        document.body.appendChild(tooltip);
        
        // Remove tooltip after delay
        setTimeout(() => {
            tooltip.remove();
        }, 2000);
    }

    // Navigation enhancements
    bindNavigation() {
        // Add active states to dashboard nav
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (item.getAttribute('data-page')) {
                    e.preventDefault();
                    navItems.forEach(nav => nav.classList.remove('active'));
                    item.classList.add('active');
                }
            });
        });
    }

    // Notification system
    showNotification(message, type = 'info') {
        window.app.showNotification(message, type);
    }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.componentsManager = new ComponentsManager();
});


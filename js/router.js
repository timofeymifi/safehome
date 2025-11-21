
// Router for SPA navigation
class Router {
    constructor() {
        this.currentPage = 'home';
        this.pages = document.querySelectorAll('.page');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.bindEvents();
        
        // Check if there's a hash in URL
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            this.navigateTo(hash);
        } else {
            this.navigateTo('home');
        }
    }

    navigateTo(pageId, params = {}) {
        // Add page transition
        this.pages.forEach(page => {
            if (page.classList.contains('active')) {
                page.style.opacity = '0';
                page.style.transform = 'translateY(20px)';
            }
        });

        setTimeout(() => {
            // Hide all pages
            this.pages.forEach(page => {
                page.classList.remove('active');
                // Reset styles
                page.style.opacity = '';
                page.style.transform = '';
            });

            // Remove active class from all nav links
            this.navLinks.forEach(link => {
                link.classList.remove('active');
            });

            // Show target page
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
                
                // Reset styles for animation
                setTimeout(() => {
                    targetPage.style.opacity = '1';
                    targetPage.style.transform = 'translateY(0)';
                }, 50);
            }

            // Update active nav link
            const activeLink = document.querySelector(`[data-page="${pageId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }

            // Update dashboard sidebar navigation
            const dashboardNavItems = document.querySelectorAll('.sidebar-nav .nav-item');
            dashboardNavItems.forEach(item => {
                item.classList.remove('active');
                const href = item.getAttribute('href');
                if (href && href.substring(1) === pageId) {
                    item.classList.add('active');
                }
            });

            this.currentPage = pageId;
            
            // Handle special pages
            this.handleSpecialPages(pageId, params);
            
            // Scroll to top
            window.scrollTo(0, 0);
            
            // Update browser history
            history.pushState({ page: pageId, params }, '', `#${pageId}`);
        }, 150);
    }

    handleSpecialPages(pageId, params) {
        switch (pageId) {
            case 'plan':
                this.handlePlanPage(params.plan);
                break;
            case 'article':
                this.handleArticlePage(params.article);
                break;
        }
    }

    handlePlanPage(planSlug) {
        const plans = {
            'basic': {
                title: 'Базовый тариф',
                name: 'Базовый',
                price: '990',
                badge: 'Экономный',
                features: [
                    'Мониторинг до 10 устройств',
                    'Базовые оповещения',
                    'История за 7 дней'
                ]
            },
            'professional': {
                title: 'Профессиональный тариф',
                name: 'Профессиональный',
                price: '1990',
                badge: 'Популярный',
                features: [
                    'Мониторинг до 50 устройств',
                    'Расширенные оповещения',
                    'История за 30 дней',
                    'Расширенная аналитика',
                    'Приоритетная поддержка'
                ]
            },
            'premium': {
                title: 'Премиум тариф',
                name: 'Премиум',
                price: '4990',
                badge: 'Премиум',
                features: [
                    'Неограниченное количество устройств',
                    'Мгновенные оповещения',
                    'История за 90 дней',
                    'Расширенная аналитика + AI',
                    'Персональный менеджер'
                ]
            }
        };

        const plan = plans[planSlug] || plans['professional'];
        
        document.getElementById('plan-title').textContent = plan.title;
        document.getElementById('plan-name').textContent = plan.name;
        document.getElementById('plan-price').textContent = plan.price;
        document.getElementById('plan-badge').textContent = plan.badge;
        
        const featuresContainer = document.getElementById('plan-features');
        featuresContainer.innerHTML = plan.features.map(feature => `
            <div class="feature">
                <span class="feature-icon">✓</span>
                <span>${feature}</span>
            </div>
        `).join('');
    }

    handleArticlePage(articleSlug) {
        // In a real app, this would fetch article data from an API
        console.log('Loading article:', articleSlug);
    }

    bindEvents() {
        // Nav link clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('data-page');
                this.navigateTo(pageId);
            });
        });

        // Logo click
        const logo = document.querySelector('.nav-logo');
        if (logo) {
            logo.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo('home');
            });
        }

        // Browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.navigateTo(e.state.page, e.state.params || {});
            }
        });

        // Register/Login buttons
        const registerBtn = document.getElementById('register-btn');
        const loginBtn = document.getElementById('login-btn');
        
        if (registerBtn) {
            registerBtn.addEventListener('click', () => {
                this.navigateTo('register');
            });
        }

        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                this.navigateTo('login');
            });
        }

        // Hero section buttons
        const heroButtons = document.querySelectorAll('.hero-actions button');
        heroButtons.forEach(button => {
            button.addEventListener('click', () => {
                const pageId = button.getAttribute('data-page');
                if (pageId) {
                    this.navigateTo(pageId);
                }
            });
        });

        // Dashboard navigation
        const dashboardNavItems = document.querySelectorAll('.sidebar-nav .nav-item');
        dashboardNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = item.getAttribute('data-page');
                if (pageId) {
                    this.navigateTo(pageId);
                }
            });
        });

        // Footer navigation
        const footerLinks = document.querySelectorAll('.footer-links a, .footer-legal a');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('data-page');
                if (pageId) {
                    const plan = link.getAttribute('data-plan');
                    if (plan) {
                        this.navigateTo(pageId, { plan });
                    } else {
                        this.navigateTo(pageId);
                    }
                }
            });
        });

        // Blog article links
        const articleLinks = document.querySelectorAll('.read-more');
        articleLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const articleSlug = link.getAttribute('data-article');
                this.navigateTo('article', { article: articleSlug });
            });
        });

        // Pricing cards
        const pricingCards = document.querySelectorAll('.pricing-card');
        pricingCards.forEach(card => {
            card.addEventListener('click', () => {
                const plan = card.getAttribute('data-plan');
                if (plan) {
                    this.navigateTo('plan', { plan });
                }
            });
        });

        // Blog cards
        const blogCards = document.querySelectorAll('.blog-card');
        blogCards.forEach(card => {
            card.addEventListener('click', () => {
                const articleSlug = card.getAttribute('data-article');
                if (articleSlug) {
                    this.navigateTo('article', { article: articleSlug });
                }
            });
        });

        // Subscribe button
        const subscribeBtn = document.getElementById('subscribe-btn');
        if (subscribeBtn) {
            subscribeBtn.addEventListener('click', () => {
                if (window.app.checkAuth()) {
                    window.componentsManager.showNotification('Подписка успешно оформлена!', 'success');
                } else {
                    window.componentsManager.showNotification('Для оформления подписки необходимо войти в систему', 'warning');
                    setTimeout(() => {
                        this.navigateTo('login');
                    }, 1500);
                }
            });
        }

        // User menu in navigation (dynamic)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.user-menu-toggle')) {
                const dropdown = e.target.closest('.user-menu').querySelector('.user-dropdown');
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            }
        });

        // Close user dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                const dropdowns = document.querySelectorAll('.user-dropdown');
                dropdowns.forEach(dropdown => {
                    dropdown.style.display = 'none';
                });
            }
        });
    }
}

// Initialize router when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
});


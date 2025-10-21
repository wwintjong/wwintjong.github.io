// Navigation and Page Management
class PersonalWebsite {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupProjectFilters();
        this.setupBlogFilters();
        this.setupContactForm();
        this.setupScrollEffects();
    }

    // Navigation Management
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav__link');
        const heroButtons = document.querySelectorAll('[data-page]');
        
        // Handle navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });

        // Handle hero and other buttons with data-page
        heroButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const page = button.getAttribute('data-page');
                if (page) {
                    this.navigateToPage(page);
                }
            });
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            const page = e.state?.page || 'home';
            this.showPage(page);
        });
    }

    navigateToPage(page) {
        // Don't do anything if we're already on this page
        if (this.currentPage === page) {
            this.closeMobileMenu();
            return;
        }

        // Update URL without page reload
        const url = page === 'home' ? '#home' : `#${page}`;
        history.pushState({ page }, '', url);
        
        this.showPage(page);
        this.closeMobileMenu();

        // FIX: Reset scroll position to top
        window.scrollTo(0, 0);
    }

    showPage(page) {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(p => p.classList.remove('page--active'));
        
        // Show target page
        const targetPage = document.getElementById(page);
        if (targetPage) {
            targetPage.classList.add('page--active');
        }
        
        // Update navigation active state
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active-link');
            }
        });
        
        this.currentPage = page;
    }

    // Mobile Menu
    setupMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        navToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('show-menu');
    }

    closeMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        navToggle.classList.remove('active');
        navMenu.classList.remove('show-menu');
    }

    // Project Filters
    setupProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card[data-category]');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('filter-btn--active'));
                button.classList.add('filter-btn--active');
                
                // Filter projects
                this.filterProjects(filter, projectCards);
            });
        });
    }

    filterProjects(filter, projectCards) {
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter || category.includes(filter.replace('-', ' '))) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease-in-out';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Blog Filters and Search
    setupBlogFilters() {
        const searchInput = document.querySelector('.blog-search');
        const categoryButtons = document.querySelectorAll('.category-btn');
        const blogPosts = document.querySelectorAll('.blog-post');
        
        // Search functionality
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                this.filterBlogPosts(searchTerm, null, blogPosts);
            });
        }
        
        // Category filter functionality
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');
                
                // Update active button
                categoryButtons.forEach(btn => btn.classList.remove('category-btn--active'));
                button.classList.add('category-btn--active');
                
                // Reset search
                if (searchInput) {
                    searchInput.value = '';
                }
                
                // Filter posts
                this.filterBlogPosts(null, category, blogPosts);
            });
        });
    }

    filterBlogPosts(searchTerm, category, blogPosts) {
        blogPosts.forEach(post => {
            const title = post.querySelector('.blog-post__title').textContent.toLowerCase();
            const excerpt = post.querySelector('.blog-post__excerpt').textContent.toLowerCase();
            const postCategory = post.getAttribute('data-category');
            
            let showPost = true;
            
            // Apply search filter
            if (searchTerm && searchTerm.trim() !== '') {
                showPost = title.includes(searchTerm) || excerpt.includes(searchTerm);
            }
            
            // Apply category filter
            if (category && category !== 'all') {
                showPost = showPost && postCategory === category;
            }
            
            if (showPost) {
                post.style.display = 'block';
                post.style.animation = 'fadeIn 0.3s ease-in-out';
            } else {
                post.style.display = 'none';
            }
        });
    }

    // Contact Form
    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(contactForm);
            });
        }
    }

    handleContactForm(form) {
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Simulate form submission
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            submitButton.textContent = 'Message Sent!';
            submitButton.style.background = 'var(--color-success)';
            
            // Reset form
            form.reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.style.background = '';
            }, 3000);
            
            // Show success message
            this.showNotification('Thanks for your message! I\'ll get back to you soon.', 'success');
        }, 1500);
    }

    // Scroll Effects
    setupScrollEffects() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href.startsWith('#') && href.length > 1) {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });

        // Header background on scroll
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const header = document.getElementById('header');
            
            if (scrollTop > lastScrollTop) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    }

    // Utility Functions
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background: var(--color-${type === 'success' ? 'success' : 'primary'});
            color: var(--color-btn-primary-text);
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Initialize animations
    initAnimations() {
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes slideInUp {
                from { opacity: 0; transform: translateY(50px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .header {
                transition: transform 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const website = new PersonalWebsite();
    website.initAnimations();
    
    // Handle initial page load based on URL hash
    const hash = window.location.hash.substring(1);
    if (hash && ['home', 'projects', 'about', 'blog', 'contact'].includes(hash)) {
        website.showPage(hash);
    } else {
        website.showPage('home');
    }
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add loading states to external links
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = 'Opening...';
            
            setTimeout(() => {
                this.textContent = originalText;
            }, 1000);
        });
    });

    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('href').substring(1);
            
            // Show the page
            showPage(pageId);
            
            // FIX: Reset scroll position and header
            setTimeout(() => {
                window.scrollTo(0, 0);
                const header = document.querySelector('.header');
                if (header) {
                    header.style.transform = 'translateY(0)';
                    header.classList.remove('hidden');
                }
            }, 50);
        });
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        // Press 'Escape' to close mobile menu
        if (e.key === 'Escape') {
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            
            if (navMenu.classList.contains('show-menu')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('show-menu');
            }
        }
    });
    
    // Add focus management for accessibility
    document.querySelectorAll('button, a, input, textarea').forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--color-primary)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
});
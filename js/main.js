/**
 * Professional Portfolio JavaScript
 * Handles the service worker, theme switching, mobile navigation and small UI touches
 */

(function() {
    'use strict';

    // ==========================================
    // PWA: SERVICE WORKER
    // ==========================================

    // sw.js sits at the site root, one level above this script, so resolving
    // against our own URL works from any page depth.
    if ('serviceWorker' in navigator && document.currentScript) {
        const swUrl = new URL('../sw.js', document.currentScript.src);
        window.addEventListener('load', function() {
            navigator.serviceWorker.register(swUrl, { scope: new URL('./', swUrl).pathname })
                .catch(function() { /* offline support is optional */ });
        });
    }

    const html = document.documentElement;
    const reduceMotionQuery = window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;

    function prefersReducedMotion() {
        return !!(reduceMotionQuery && reduceMotionQuery.matches);
    }

    function scrollBehavior() {
        return prefersReducedMotion() ? 'auto' : 'smooth';
    }

    // ==========================================
    // THEME MANAGEMENT
    // ==========================================

    const themeToggle = document.getElementById('themeToggle');

    // The inline <head> bootstrap script has already set data-theme before first
    // paint; only fall back to the same logic if it's missing.
    if (!html.getAttribute('data-theme')) {
        let savedTheme = null;
        try { savedTheme = localStorage.getItem('theme'); } catch (e) { /* storage blocked */ }
        if (savedTheme !== 'light' && savedTheme !== 'dark') {
            savedTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        }
        html.setAttribute('data-theme', savedTheme);
    }

    // Update theme toggle icon based on current theme
    function updateThemeIcon() {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        if (!icon) return;
        if (html.getAttribute('data-theme') === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // Keep the browser/PWA title bar in sync with the page background
    function updateThemeColor() {
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.setAttribute('content', html.getAttribute('data-theme') === 'dark' ? '#18181b' : '#ffffff');
        }
    }

    updateThemeIcon();
    updateThemeColor();

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';

            html.setAttribute('data-theme', newTheme);
            try { localStorage.setItem('theme', newTheme); } catch (e) { /* storage blocked */ }
            updateThemeIcon();
            updateThemeColor();
        });
    }

    // ==========================================
    // MOBILE NAVIGATION
    // ==========================================

    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navBackdrop = document.getElementById('navBackdrop');

    function closeMobileNav() {
        if (mobileToggle) {
            mobileToggle.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
        if (navMenu) navMenu.classList.remove('active');
        if (navBackdrop) navBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            if (navBackdrop) navBackdrop.classList.toggle('active');

            // Update ARIA attribute for accessibility
            const isExpanded = navMenu.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);

            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });

        // Close mobile menu when clicking the backdrop
        if (navBackdrop) {
            navBackdrop.addEventListener('click', closeMobileNav);
        }

        // Close mobile menu when clicking on a nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    closeMobileNav();
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnToggle = mobileToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
                closeMobileNav();
            }
        });

        // Close the mobile menu when the viewport grows past the breakpoint
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                closeMobileNav();
            }
        });
    }

    // ==========================================
    // NAVBAR SCROLL EFFECT
    // ==========================================

    const navbar = document.getElementById('navbar');

    // ==========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Only prevent default if it's not just "#"
            if (href === '#') return;

            let target = null;
            try { target = document.querySelector(href); } catch (err) { /* not a valid selector */ }

            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - (navbar ? navbar.offsetHeight : 0);
                window.scrollTo({
                    top: offsetTop,
                    behavior: scrollBehavior()
                });
            }
        });
    });

    // ==========================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ==========================================

    // Rise and fade cards in as they enter the viewport, staggering the ones
    // that arrive together (skipped with reduced motion; styles in style.css)
    if (!prefersReducedMotion() && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            let order = 0;
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transitionDelay = Math.min(order++, 5) * 60 + 'ms';
                    entry.target.classList.add('revealed');
                    // Later hover transitions shouldn't inherit the stagger
                    entry.target.addEventListener('transitionend', function() {
                        this.style.transitionDelay = '';
                    }, { once: true });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.02,
            rootMargin: '0px 0px -10% 0px'
        });

        document.querySelectorAll('.project-card').forEach(el => {
            el.classList.add('reveal');
            observer.observe(el);
        });
    }

    // ==========================================
    // BACK TO TOP BUTTON
    // ==========================================

    function createBackToTopButton() {
        const button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
        button.className = 'back-to-top';
        button.setAttribute('aria-label', 'Back to top');

        button.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: scrollBehavior()
            });
        });

        document.body.appendChild(button);

        // Show/hide button based on scroll position (styles in style.css)
        let visible = false;
        function update() {
            const show = window.pageYOffset > 300;
            if (show === visible) return;
            visible = show;
            button.classList.toggle('visible', show);
        }
        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    createBackToTopButton();

})();

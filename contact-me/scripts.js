// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle
const createMobileMenu = () => {
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelector('.nav-links');
    
    // Create mobile menu button
    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-btn';
    menuButton.innerHTML = '<i class="fas fa-bars"></i>';
    menuButton.setAttribute('aria-label', 'Toggle menu');
    
    // Add button to nav
    nav.insertBefore(menuButton, navLinks);
    
    // Toggle menu on click
    menuButton.addEventListener('click', () => {
        navLinks.classList.toggle('show');
        menuButton.innerHTML = navLinks.classList.contains('show') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
};

// Initialize mobile menu if needed
if (window.innerWidth <= 768) {
    createMobileMenu();
}

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in-hidden');
    observer.observe(section);
});

// Form validation for demo purposes
const validateDemoForm = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;
    
    if (!email.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }
    
    alert('Thank you for your interest! We\'ll be in touch soon.');
    form.reset();
};

// Add form validation if demo form exists
const demoForm = document.querySelector('#demo-form');
if (demoForm) {
    demoForm.addEventListener('submit', validateDemoForm);
}

// Analytics tracking
const trackEvent = (eventName, properties = {}) => {
    if (typeof gtag === 'function') {
        gtag('event', eventName, properties);
    }
};

// Track button clicks
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        const action = button.textContent.trim();
        trackEvent('button_click', {
            action: action,
            location: button.closest('section')?.id || 'unknown'
        });
    });
});

// Track scroll depth
let maxScroll = 0;
window.addEventListener('scroll', () => {
    const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
            trackEvent('scroll_depth', {
                depth: maxScroll
            });
        }
    }
}); 
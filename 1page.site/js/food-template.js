document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components for the food/restaurant template
    initMobileNav();
    initSmoothScroll();
    initMenuTabs();
    initGalleryLightbox();
    initReservationForms();
    initChefProfiles();
    initTestimonialCarousel();
    initFAQToggle();
    initFadeAnimations();
});

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (!hamburger || !navLinks) return;
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on navigation links
    const menuLinks = navLinks.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Smooth Scrolling for anchor links
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Get offset for fixed header
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Menu Tabs/Filters
function initMenuTabs() {
    const menuSection = document.querySelector('#menu');
    if (!menuSection) return;
    const menuTabs = menuSection.querySelector('.menu-tabs');
    if (!menuTabs) return;
    const tabButtons = menuTabs.querySelectorAll('.tab-btn');
    const menuItems = menuSection.querySelectorAll('.menu-item');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.getAttribute('data-category');
            menuItems.forEach(item => {
                if (category === 'all') {
                    item.style.display = 'block';
                } else {
                    const itemCategory = item.getAttribute('data-category');
                    if (itemCategory === category) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        });
    });
}

// Gallery Lightbox (reuse from beauty-template.js)
function initGalleryLightbox() {
    // ... (copy implementation from beauty-template.js)
}

// Reservation/Booking Modal
function initReservationForms() {
    const reserveButtons = document.querySelectorAll('.reserve-btn, .book-table-btn');
    reserveButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            openReservationModal();
        });
    });
    function openReservationModal() {
        const existingModal = document.querySelector('.reservation-modal');
        if (existingModal) existingModal.remove();
        const modal = document.createElement('div');
        modal.className = 'reservation-modal';
        modal.innerHTML = `
            <div class="reservation-modal-content">
                <span class="close-modal">&times;</span>
                <h3>Reserve a Table</h3>
                <form id="reservation-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="res-name">Name</label>
                            <input type="text" id="res-name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="res-phone">Phone</label>
                            <input type="tel" id="res-phone" name="phone" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="res-date">Date</label>
                            <input type="date" id="res-date" name="date" required>
                        </div>
                        <div class="form-group">
                            <label for="res-time">Time</label>
                            <input type="time" id="res-time" name="time" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="res-guests">Guests</label>
                        <input type="number" id="res-guests" name="guests" min="1" max="20" required>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Reserve</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        setTimeout(() => { modal.classList.add('active'); }, 10);
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => { modal.remove(); }, 300);
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                setTimeout(() => { modal.remove(); }, 300);
            }
        });
        modal.querySelector('#reservation-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const values = Object.fromEntries(formData.entries());
            modal.querySelector('.reservation-modal-content').innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <h3>Reservation Confirmed!</h3>
                    <p>Thank you, ${values.name}. Your table for ${values.guests} is reserved on ${values.date} at ${values.time}.</p>
                    <button class="btn-primary close-success">Close</button>
                </div>
            `;
            modal.querySelector('.close-success').addEventListener('click', () => {
                modal.classList.remove('active');
                setTimeout(() => { modal.remove(); }, 300);
            });
        });
    }
}

// Chef Profile Handlers
function initChefProfiles() {
    const chefCards = document.querySelectorAll('.chef-card');
    chefCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('expanded');
        });
    });
}

// Testimonial Carousel (reuse from services-template.js)
function initTestimonialCarousel() {
    // ... (copy implementation from services-template.js)
}

// FAQ Toggle (reuse from services-template.js)
function initFAQToggle() {
    // ... (copy implementation from services-template.js)
}

// Fade In Animations
function initFadeAnimations() {
    const fadeSections = document.querySelectorAll('section');
    
    // Create observer for fade-in effect
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Add the initial class and observe each section
    fadeSections.forEach(section => {
        section.classList.add('fade-hidden');
        observer.observe(section);
    });
    
    // Add necessary CSS if not already present
    if (!document.getElementById('fade-animations-css')) {
        const style = document.createElement('style');
        style.id = 'fade-animations-css';
        style.textContent = `
            .fade-hidden {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            .fade-in {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
} 
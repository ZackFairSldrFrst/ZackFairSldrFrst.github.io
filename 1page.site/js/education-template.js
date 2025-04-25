document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components for the education/coaching template
    initMobileNav();
    initSmoothScroll();
    initCourseTabs();
    initGalleryLightbox();
    initInquiryForms();
    initInstructorProfiles();
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

// Course/Program Tabs
function initCourseTabs() {
    const courseSection = document.querySelector('#courses, #programs');
    if (!courseSection) return;
    const courseTabs = courseSection.querySelector('.course-tabs');
    if (!courseTabs) return;
    const tabButtons = courseTabs.querySelectorAll('.tab-btn');
    const courseItems = courseSection.querySelectorAll('.course-item, .program-item');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.getAttribute('data-category');
            courseItems.forEach(item => {
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

// Inquiry/Booking Modal
function initInquiryForms() {
    const inquiryButtons = document.querySelectorAll('.inquire-btn, .book-session-btn');
    inquiryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            openInquiryModal();
        });
    });
    function openInquiryModal() {
        const existingModal = document.querySelector('.inquiry-modal');
        if (existingModal) existingModal.remove();
        const modal = document.createElement('div');
        modal.className = 'inquiry-modal';
        modal.innerHTML = `
            <div class="inquiry-modal-content">
                <span class="close-modal">&times;</span>
                <h3>Request Information / Book a Session</h3>
                <form id="inquiry-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="inq-name">Name</label>
                            <input type="text" id="inq-name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="inq-email">Email</label>
                            <input type="email" id="inq-email" name="email" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="inq-message">Message / Details</label>
                        <textarea id="inq-message" name="message" rows="4" required></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Send Inquiry</button>
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
        modal.querySelector('#inquiry-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const values = Object.fromEntries(formData.entries());
            modal.querySelector('.inquiry-modal-content').innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <h3>Thank you for your inquiry!</h3>
                    <p>We will get back to you at ${values.email} soon.</p>
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

// Instructor Profile Handlers
function initInstructorProfiles() {
    const instructorCards = document.querySelectorAll('.instructor-card');
    instructorCards.forEach(card => {
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

// Fade In Animations (reuse from beauty-template.js)
function initFadeAnimations() {
    // ... (copy implementation from beauty-template.js)
} 
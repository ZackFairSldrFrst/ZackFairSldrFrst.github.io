document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components for the events template
    initMobileNav();
    initSmoothScroll();
    initEventTabs();
    initGalleryLightbox();
    initRSVPForms();
    initSpeakerProfiles();
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

// Event Tabs/Filters
function initEventTabs() {
    const eventSection = document.querySelector('#events');
    if (!eventSection) return;
    const eventTabs = eventSection.querySelector('.event-tabs');
    if (!eventTabs) return;
    const tabButtons = eventTabs.querySelectorAll('.tab-btn');
    const eventItems = eventSection.querySelectorAll('.event-item');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.getAttribute('data-category');
            eventItems.forEach(item => {
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

// RSVP/Booking Modal
function initRSVPForms() {
    const rsvpButtons = document.querySelectorAll('.rsvp-btn, .book-ticket-btn');
    rsvpButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            openRSVPModal();
        });
    });
    function openRSVPModal() {
        const existingModal = document.querySelector('.rsvp-modal');
        if (existingModal) existingModal.remove();
        const modal = document.createElement('div');
        modal.className = 'rsvp-modal';
        modal.innerHTML = `
            <div class="rsvp-modal-content">
                <span class="close-modal">&times;</span>
                <h3>RSVP / Book Ticket</h3>
                <form id="rsvp-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="rsvp-name">Name</label>
                            <input type="text" id="rsvp-name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="rsvp-email">Email</label>
                            <input type="email" id="rsvp-email" name="email" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="rsvp-message">Message / Notes</label>
                        <textarea id="rsvp-message" name="message" rows="3"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Submit RSVP</button>
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
        modal.querySelector('#rsvp-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const values = Object.fromEntries(formData.entries());
            modal.querySelector('.rsvp-modal-content').innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <h3>Thank you for your RSVP!</h3>
                    <p>We look forward to seeing you, ${values.name}.</p>
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

// Speaker/Performer Profile Handlers
function initSpeakerProfiles() {
    const speakerCards = document.querySelectorAll('.speaker-card, .performer-card');
    speakerCards.forEach(card => {
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
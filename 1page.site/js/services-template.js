document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components for the services template
    initMobileNav();
    initSmoothScroll();
    initServiceAccordion();
    initTestimonialCarousel();
    initRequestQuoteForm();
    initServiceFilters();
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

// Service Accordion for detailed service information
function initServiceAccordion() {
    const accordionItems = document.querySelectorAll('.service-accordion-item');
    
    if (!accordionItems.length) return;
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        
        if (!header || !content) return;
        
        header.addEventListener('click', () => {
            // Check if this item is already open
            const isOpen = item.classList.contains('active');
            
            // Optional: Close all other items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherContent = otherItem.querySelector('.accordion-content');
                    if (otherContent) {
                        otherContent.style.maxHeight = '0px';
                    }
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            
            if (!isOpen) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0px';
            }
        });
    });
    
    // Add necessary CSS if not already present
    if (!document.getElementById('accordion-css')) {
        const style = document.createElement('style');
        style.id = 'accordion-css';
        style.textContent = `
            .service-accordion-item {
                margin-bottom: 10px;
                border: 1px solid #e0e0e0;
                border-radius: 5px;
                overflow: hidden;
            }
            
            .accordion-header {
                padding: 15px 20px;
                background-color: #f5f5f5;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: background-color 0.3s;
            }
            
            .accordion-header:hover {
                background-color: #ebebeb;
            }
            
            .service-accordion-item.active .accordion-header {
                background-color: #e6e6e6;
            }
            
            .accordion-content {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease-out;
                padding: 0 20px;
            }
            
            .service-accordion-item.active .accordion-content {
                padding: 20px;
            }
        `;
        document.head.appendChild(style);
    }
}

// Testimonial Carousel
function initTestimonialCarousel() {
    const carousel = document.querySelector('.testimonial-carousel');
    
    if (!carousel) return;
    
    const carouselTrack = carousel.querySelector('.carousel-track');
    const testimonials = carousel.querySelectorAll('.testimonial-item');
    const prevButton = carousel.querySelector('.carousel-prev');
    const nextButton = carousel.querySelector('.carousel-next');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    
    if (!carouselTrack || !testimonials.length) return;
    
    let currentIndex = 0;
    let startX, moveX;
    let isMoving = false;
    
    // Create dots if dotsContainer exists
    if (dotsContainer) {
        testimonials.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
            
            dotsContainer.appendChild(dot);
        });
    }
    
    // Setup buttons
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
        });
    }
    
    // Touch events for mobile swiping
    carouselTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isMoving = true;
    }, { passive: true });
    
    carouselTrack.addEventListener('touchmove', (e) => {
        if (!isMoving) return;
        moveX = e.touches[0].clientX;
    }, { passive: true });
    
    carouselTrack.addEventListener('touchend', () => {
        if (!isMoving) return;
        
        isMoving = false;
        const diffX = startX - moveX;
        
        if (diffX > 50) { // Swiped left
            goToSlide(currentIndex + 1);
        } else if (diffX < -50) { // Swiped right
            goToSlide(currentIndex - 1);
        }
    });
    
    // Auto advance testimonials
    let autoAdvance = setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 7000);
    
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoAdvance);
    });
    
    carousel.addEventListener('mouseleave', () => {
        autoAdvance = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 7000);
    });
    
    // Function to move to a specific slide
    function goToSlide(index) {
        // Handle wrapping
        if (index < 0) {
            index = testimonials.length - 1;
        } else if (index >= testimonials.length) {
            index = 0;
        }
        
        currentIndex = index;
        
        // Update carousel transform
        carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update dots
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }
    }
    
    // Add necessary CSS if not already present
    if (!document.getElementById('testimonial-carousel-css')) {
        const style = document.createElement('style');
        style.id = 'testimonial-carousel-css';
        style.textContent = `
            .testimonial-carousel {
                position: relative;
                overflow: hidden;
                width: 100%;
            }
            
            .carousel-track {
                display: flex;
                transition: transform 0.5s ease;
                width: 100%;
            }
            
            .testimonial-item {
                flex: 0 0 100%;
                min-width: 100%;
                padding: 20px;
                box-sizing: border-box;
            }
            
            .carousel-prev, .carousel-next {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                z-index: 2;
                background: rgba(255, 255, 255, 0.7);
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            
            .carousel-prev:hover, .carousel-next:hover {
                background: rgba(255, 255, 255, 0.9);
            }
            
            .carousel-prev {
                left: 10px;
            }
            
            .carousel-next {
                right: 10px;
            }
            
            .carousel-dots {
                display: flex;
                justify-content: center;
                margin-top: 20px;
            }
            
            .carousel-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: #ccc;
                margin: 0 5px;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            
            .carousel-dot.active {
                background-color: #333;
            }
        `;
        document.head.appendChild(style);
    }
}

// Request Quote Form
function initRequestQuoteForm() {
    const quoteForm = document.querySelector('#request-quote-form');
    const quoteButtons = document.querySelectorAll('.request-quote-btn');
    
    // Initialize form submission
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form
            const formData = new FormData(quoteForm);
            const formValues = Object.fromEntries(formData.entries());
            
            // Simple validation
            let isValid = true;
            const requiredFields = quoteForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Email validation
            const emailField = quoteForm.querySelector('input[type="email"]');
            if (emailField && emailField.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.add('error');
                }
            }
            
            if (isValid) {
                // In a real implementation, this would send data to a server
                console.log('Quote request data:', formValues);
                
                // Show success message
                quoteForm.innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i>
                        <h3>Thank You for Your Request</h3>
                        <p>We've received your quote request and will get back to you within 24 hours.</p>
                        <p>A confirmation email has been sent to ${formValues.email}.</p>
                    </div>
                `;
            }
        });
    }
    
    // Setup quote buttons to open the form in a modal
    quoteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get service info if available
            let serviceInfo = {};
            const serviceItem = button.closest('.service-item, .service-card');
            
            if (serviceItem) {
                const serviceName = serviceItem.querySelector('.service-name, .service-title');
                if (serviceName) {
                    serviceInfo.service = serviceName.textContent;
                }
            }
            
            // Open modal with form
            openQuoteModal(serviceInfo);
        });
    });
    
    function openQuoteModal(serviceInfo = {}) {
        // Create and show the modal
        const existingModal = document.querySelector('.quote-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.className = 'quote-modal';
        
        // Pre-select the service if it was provided
        const serviceSelect = serviceInfo.service ? 
            `<option value="${serviceInfo.service}" selected>${serviceInfo.service}</option>` : '';
        
        modal.innerHTML = `
            <div class="quote-modal-content">
                <span class="close-modal">&times;</span>
                <h3>Request a Free Quote</h3>
                <p>Fill out the form below, and we'll get back to you with a quote within 24 hours.</p>
                
                <form id="modal-quote-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="name">Your Name</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email Address</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="phone">Phone Number</label>
                            <input type="tel" id="phone" name="phone">
                        </div>
                        <div class="form-group">
                            <label for="service">Service Interested In</label>
                            <select id="service" name="service" required>
                                <option value="">Select a Service</option>
                                ${serviceSelect}
                                <option value="Residential">Residential Service</option>
                                <option value="Commercial">Commercial Service</option>
                                <option value="Emergency">Emergency Service</option>
                                <option value="Maintenance">Maintenance Plan</option>
                                <option value="Other">Other (Please Specify)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="details">Project Details</label>
                        <textarea id="details" name="details" rows="4" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="timeline">Preferred Timeline</label>
                        <select id="timeline" name="timeline">
                            <option value="Urgent">Urgent (As soon as possible)</option>
                            <option value="1-week">Within 1 week</option>
                            <option value="2-weeks">Within 2 weeks</option>
                            <option value="Month">Within a month</option>
                            <option value="Flexible">Flexible</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>How did you hear about us?</label>
                        <div class="checkbox-group">
                            <label>
                                <input type="checkbox" name="source" value="Google"> Google
                            </label>
                            <label>
                                <input type="checkbox" name="source" value="Social Media"> Social Media
                            </label>
                            <label>
                                <input type="checkbox" name="source" value="Referral"> Referral
                            </label>
                            <label>
                                <input type="checkbox" name="source" value="Other"> Other
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Request Quote</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Close button
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
        
        // Close when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        });
        
        // Form submission
        const form = modal.querySelector('#modal-quote-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simple validation
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (isValid) {
                // Get form data
                const formData = new FormData(form);
                const formValues = Object.fromEntries(formData.entries());
                
                // In a real system, this would be sent to a server
                console.log('Quote request:', formValues);
                
                // Show success message
                modal.querySelector('.quote-modal-content').innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i>
                        <h3>Thank You!</h3>
                        <p>We've received your quote request and will get back to you within 24 hours.</p>
                        <p>A confirmation email has been sent to ${formValues.email}.</p>
                        <button class="btn-primary close-success">Close</button>
                    </div>
                `;
                
                // Close button for success message
                modal.querySelector('.close-success').addEventListener('click', () => {
                    modal.classList.remove('active');
                    setTimeout(() => {
                        modal.remove();
                    }, 300);
                });
            }
        });
    }
    
    // Add necessary CSS if not already present
    if (!document.getElementById('quote-modal-css')) {
        const style = document.createElement('style');
        style.id = 'quote-modal-css';
        style.textContent = `
            .quote-modal {
                display: none;
                position: fixed;
                z-index: 1000;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.7);
                padding: 20px;
                box-sizing: border-box;
                overflow-y: auto;
                align-items: center;
                justify-content: center;
            }
            
            .quote-modal.active {
                display: flex;
            }
            
            .quote-modal-content {
                background-color: white;
                padding: 30px;
                border-radius: 10px;
                max-width: 600px;
                width: 100%;
                position: relative;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            
            .close-modal {
                position: absolute;
                top: 15px;
                right: 15px;
                font-size: 24px;
                cursor: pointer;
            }
            
            .form-row {
                display: flex;
                gap: 15px;
            }
            
            .form-group {
                margin-bottom: 15px;
                flex: 1;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
            }
            
            .form-group input,
            .form-group select,
            .form-group textarea {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
            }
            
            .form-group input.error,
            .form-group select.error,
            .form-group textarea.error {
                border-color: #e74c3c;
            }
            
            .checkbox-group {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }
            
            .checkbox-group label {
                margin-right: 15px;
                display: flex;
                align-items: center;
                cursor: pointer;
            }
            
            .checkbox-group input {
                margin-right: 5px;
            }
            
            .form-actions {
                margin-top: 20px;
            }
            
            .success-message {
                text-align: center;
                padding: 20px 0;
            }
            
            .success-message i {
                font-size: 48px;
                color: #4CB963;
                margin-bottom: 20px;
            }
            
            @media (max-width: 600px) {
                .form-row {
                    flex-direction: column;
                    gap: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Service Category Filters
function initServiceFilters() {
    const filterContainer = document.querySelector('.service-filters');
    if (!filterContainer) return;
    
    const filterButtons = filterContainer.querySelectorAll('.filter-btn');
    const serviceItems = document.querySelectorAll('.service-item');
    
    if (!filterButtons.length || !serviceItems.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get category to filter
            const category = button.getAttribute('data-category');
            
            // Filter services
            serviceItems.forEach(item => {
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

// FAQ Toggle Functionality
function initFAQToggle() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (!faqItems.length) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (!question || !answer) return;
        
        question.addEventListener('click', () => {
            // Toggle current item
            const isOpen = item.classList.contains('active');
            
            // Optional: Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = '0';
                    }
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            
            if (!isOpen) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });
    
    // Add necessary CSS if not already present
    if (!document.getElementById('faq-css')) {
        const style = document.createElement('style');
        style.id = 'faq-css';
        style.textContent = `
            .faq-item {
                border-bottom: 1px solid #e0e0e0;
                margin-bottom: 10px;
            }
            
            .faq-question {
                padding: 15px 0;
                cursor: pointer;
                font-weight: 600;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .faq-question::after {
                content: '+';
                font-size: 20px;
                transition: transform 0.3s;
            }
            
            .faq-item.active .faq-question::after {
                content: '−';
            }
            
            .faq-answer {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease-out;
                padding: 0 0 0 10px;
            }
            
            .faq-item.active .faq-answer {
                padding-bottom: 15px;
            }
        `;
        document.head.appendChild(style);
    }
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
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components for the style/salon template
    initMobileNav();
    initSmoothScroll();
    initServiceTabs();
    initGalleryLightbox();
    initBookingForms();
    initStylistProfiles();
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

// Service Category Tabs/Filters
function initServiceTabs() {
    // This function is a placeholder for a potential service category filter
    // The original HTML doesn't have tabs for services, but this would be useful
    
    const serviceSection = document.querySelector('#services');
    if (!serviceSection) return;
    
    // Check if tabs have been added
    const serviceTabs = serviceSection.querySelector('.service-tabs');
    if (!serviceTabs) return;
    
    const tabButtons = serviceTabs.querySelectorAll('.tab-btn');
    const serviceItems = serviceSection.querySelectorAll('.service-card');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
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

// Gallery Lightbox
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!galleryItems.length) return;
    
    // Create lightbox container if it doesn't exist
    let lightbox = document.querySelector('.gallery-lightbox');
    
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'gallery-lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="close-lightbox">&times;</span>
                <img src="" alt="Gallery image" class="lightbox-image">
                <div class="lightbox-caption"></div>
                <button class="lightbox-prev"><i class="fas fa-chevron-left"></i></button>
                <button class="lightbox-next"><i class="fas fa-chevron-right"></i></button>
            </div>
        `;
        document.body.appendChild(lightbox);
    }
    
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeButton = lightbox.querySelector('.close-lightbox');
    const prevButton = lightbox.querySelector('.lightbox-prev');
    const nextButton = lightbox.querySelector('.lightbox-next');
    let currentIndex = 0;
    
    // Open lightbox when clicking on gallery items
    galleryItems.forEach((item, index) => {
        const image = item.querySelector('img');
        const overlay = item.querySelector('.gallery-overlay');
        
        if (overlay) {
            overlay.addEventListener('click', () => {
                currentIndex = index;
                openLightbox(image.src, image.alt);
            });
        } else {
            item.addEventListener('click', () => {
                currentIndex = index;
                openLightbox(image.src, image.alt);
            });
        }
    });
    
    // Close lightbox
    closeButton.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });
    
    // Previous image
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        const prevImage = galleryItems[currentIndex].querySelector('img');
        lightboxImage.src = prevImage.src;
        lightboxImage.alt = prevImage.alt;
        updateCaption(prevImage.alt);
    });
    
    // Next image
    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        const nextImage = galleryItems[currentIndex].querySelector('img');
        lightboxImage.src = nextImage.src;
        lightboxImage.alt = nextImage.alt;
        updateCaption(nextImage.alt);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
        } else if (e.key === 'ArrowLeft') {
            prevButton.click();
        } else if (e.key === 'ArrowRight') {
            nextButton.click();
        }
    });
    
    // Helper functions
    function openLightbox(src, alt) {
        lightboxImage.src = src;
        lightboxImage.alt = alt;
        updateCaption(alt);
        lightbox.classList.add('active');
    }
    
    function updateCaption(text) {
        if (text && text !== 'Gallery image') {
            lightboxCaption.textContent = text;
            lightboxCaption.style.display = 'block';
        } else {
            lightboxCaption.style.display = 'none';
        }
    }
    
    // Add necessary CSS if not already present
    if (!document.getElementById('lightbox-css')) {
        const style = document.createElement('style');
        style.id = 'lightbox-css';
        style.textContent = `
            .gallery-lightbox {
                display: none;
                position: fixed;
                z-index: 1000;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.9);
                padding: 20px;
                box-sizing: border-box;
                align-items: center;
                justify-content: center;
            }
            
            .gallery-lightbox.active {
                display: flex;
            }
            
            .lightbox-content {
                position: relative;
                max-width: 90%;
                max-height: 90%;
            }
            
            .lightbox-image {
                max-width: 100%;
                max-height: 80vh;
                display: block;
                margin: 0 auto;
            }
            
            .close-lightbox {
                position: absolute;
                top: -30px;
                right: 0;
                color: white;
                font-size: 28px;
                cursor: pointer;
            }
            
            .lightbox-caption {
                color: white;
                text-align: center;
                padding: 10px 0;
            }
            
            .lightbox-prev, .lightbox-next {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 10px;
            }
            
            .lightbox-prev {
                left: -50px;
            }
            
            .lightbox-next {
                right: -50px;
            }
        `;
        document.head.appendChild(style);
    }
}

// Booking Form Handlers
function initBookingForms() {
    const bookingButtons = document.querySelectorAll('.book-now-btn, .cta-button, .booking-platform');
    
    bookingButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Check if the button already has a specific href
            // Only prevent default if it doesn't redirect to an external booking platform
            if (!button.getAttribute('href') || button.getAttribute('href') === '#') {
                e.preventDefault();
                
                // Get service details if available
                let serviceInfo = {};
                const serviceCard = button.closest('.service-card');
                
                if (serviceCard) {
                    const serviceTitle = serviceCard.querySelector('.service-title');
                    const servicePrice = serviceCard.querySelector('.service-price');
                    const serviceDuration = serviceCard.querySelector('.service-duration');
                    
                    serviceInfo = {
                        title: serviceTitle ? serviceTitle.textContent : 'Not specified',
                        price: servicePrice ? servicePrice.textContent : 'Not specified',
                        duration: serviceDuration ? serviceDuration.textContent : 'Not specified'
                    };
                }
                
                // For demonstration, open a modal for the booking form
                openBookingModal(serviceInfo);
            }
        });
    });
    
    function openBookingModal(serviceInfo) {
        // Create and show booking modal
        const existingModal = document.querySelector('.booking-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.className = 'booking-modal';
        
        const serviceDetails = serviceInfo.title ? 
            `<div class="selected-service">
                <h4>Selected Service</h4>
                <p><strong>${serviceInfo.title}</strong> - ${serviceInfo.price}</p>
                <p><small>${serviceInfo.duration}</small></p>
            </div>` : '';
        
        modal.innerHTML = `
            <div class="booking-modal-content">
                <span class="close-modal">&times;</span>
                <h3>Book Your Appointment</h3>
                ${serviceDetails}
                <form id="booking-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="booking-name">Your Name</label>
                            <input type="text" id="booking-name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="booking-phone">Phone Number</label>
                            <input type="tel" id="booking-phone" name="phone" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="booking-email">Email Address</label>
                        <input type="email" id="booking-email" name="email" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="booking-date">Preferred Date</label>
                            <input type="date" id="booking-date" name="date" required>
                        </div>
                        <div class="form-group">
                            <label for="booking-time">Preferred Time</label>
                            <select id="booking-time" name="time" required>
                                <option value="">Select a time</option>
                                <option value="9:00">9:00 AM</option>
                                <option value="10:00">10:00 AM</option>
                                <option value="11:00">11:00 AM</option>
                                <option value="12:00">12:00 PM</option>
                                <option value="13:00">1:00 PM</option>
                                <option value="14:00">2:00 PM</option>
                                <option value="15:00">3:00 PM</option>
                                <option value="16:00">4:00 PM</option>
                                <option value="17:00">5:00 PM</option>
                                <option value="18:00">6:00 PM</option>
                                <option value="19:00">7:00 PM</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="booking-notes">Special Requests</label>
                        <textarea id="booking-notes" name="notes" rows="3"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Book Appointment</button>
                    </div>
                </form>
                <p class="booking-note">You'll receive a confirmation email once your appointment is booked. Please arrive 10 minutes before your scheduled time.</p>
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
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        });
        
        // Handle form submission
        const form = modal.querySelector('#booking-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const bookingData = Object.fromEntries(formData.entries());
            
            // In a real system, this would be sent to a server
            console.log('Booking request:', bookingData);
            
            // Show success message
            modal.querySelector('.booking-modal-content').innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <h3>Thank You!</h3>
                    <p>Your appointment request has been received. We'll confirm your booking shortly.</p>
                    <p>A confirmation email will be sent to ${bookingData.email}.</p>
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
        });
    }
    
    // Add necessary CSS if not already present
    if (!document.getElementById('booking-modal-css')) {
        const style = document.createElement('style');
        style.id = 'booking-modal-css';
        style.textContent = `
            .booking-modal {
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
            
            .booking-modal.active {
                display: flex;
            }
            
            .booking-modal-content {
                background-color: white;
                padding: 30px;
                border-radius: 10px;
                max-width: 500px;
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
            
            .form-actions {
                margin-top: 20px;
            }
            
            .selected-service {
                background-color: #f9f4f5;
                padding: 15px;
                border-radius: 5px;
                margin-bottom: 20px;
            }
            
            .booking-note {
                font-size: 0.9rem;
                color: #666;
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

// Stylist Profile Handlers
function initStylistProfiles() {
    const stylistCards = document.querySelectorAll('.stylist-card');
    
    stylistCards.forEach(card => {
        // Add click event for stylist bio expansion (optional feature)
        card.addEventListener('click', () => {
            // Toggle expanded class for more details
            card.classList.toggle('expanded');
            
            // Optional: Get more detailed bio via AJAX (this is just a placeholder)
            // In a real implementation, this would load more stylist details
            const stylistName = card.querySelector('.stylist-name').textContent;
            console.log(`User viewed ${stylistName}'s profile`);
        });
        
        // Handle social media links
        const socialLinks = card.querySelectorAll('.social-icons a');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Prevent the card click from also firing when clicking a social icon
                e.stopPropagation();
            });
        });
    });
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
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

// Onboarding wizard logic for Realtor Bio Builder

document.addEventListener('DOMContentLoaded', function() {
    const steps = [
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3'),
        document.getElementById('step-4'),
        document.getElementById('step-5')
    ];
    let currentStep = 0;

    const nextBtn = document.getElementById('nextBtn');
    const backBtn = document.getElementById('backBtn');
    const form = document.getElementById('onboardingForm');
    const preview = document.getElementById('bioPreview');

    function showStep(idx) {
        steps.forEach((step, i) => {
            step.style.display = (i === idx) ? '' : 'none';
        });
        backBtn.style.display = idx === 0 ? 'none' : '';
        nextBtn.style.display = idx === steps.length - 1 ? 'none' : '';
    }

    function collectData() {
        return {
            name: document.getElementById('agentName').value,
            years: document.getElementById('years').value,
            specialties: document.getElementById('specialties').value,
            serviceArea: document.getElementById('serviceArea').value,
            funFact: document.getElementById('funFact').value,
            why: document.getElementById('whyRealEstate').value
        };
    }

    function updatePreview() {
        if (!preview) return;
        const data = collectData();
        preview.innerHTML = `
            <h3>${data.name || 'Your Name'}</h3>
            <p><strong>Years in business:</strong> ${data.years || '—'}</p>
            <p><strong>Specialties:</strong> ${data.specialties || '—'}</p>
            <p><strong>Service Area:</strong> ${data.serviceArea || '—'}</p>
            <p><strong>Fun Fact:</strong> ${data.funFact || '—'}</p>
            <p><strong>Why I love real estate:</strong> ${data.why || '—'}</p>
        `;
    }

    nextBtn.addEventListener('click', function() {
        if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
            if (currentStep === steps.length - 1) updatePreview();
        }
    });
    backBtn.addEventListener('click', function() {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });
    form.addEventListener('input', function() {
        if (currentStep === steps.length - 1) updatePreview();
    });
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Your agent page would be generated here! (Demo only)');
    });
    showStep(currentStep);
});

// Review Collector Page Functions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initStarRating();
    initFormSubmission();
    initDashboardControls();
    initFaqAccordion();
    initTestimonialCarousel();
    initShareModal();
    initMobileNav();
});

// Star Rating System
function initStarRating() {
    const ratingContainer = document.querySelector('.star-rating');
    const stars = document.querySelectorAll('.star-rating .star');
    const ratingValue = document.getElementById('rating-value');
    
    if (!ratingContainer) return;
    
    // Store the selected rating
    let selectedRating = 0;
    
    // Handle hovering over stars
    stars.forEach((star, index) => {
        // Hover effect
        star.addEventListener('mouseenter', () => {
            // Highlight all stars up to the hovered star
            for (let i = 0; i <= index; i++) {
                stars[i].classList.add('hover');
            }
        });
        
        // Remove hover effect when mouse leaves
        star.addEventListener('mouseleave', () => {
            stars.forEach(s => s.classList.remove('hover'));
        });
        
        // Handle click on star
        star.addEventListener('click', () => {
            selectedRating = index + 1;
            
            // Update the hidden input value
            if (ratingValue) {
                ratingValue.value = selectedRating;
            }
            
            // Update visual state of stars
            stars.forEach((s, i) => {
                if (i < selectedRating) {
                    s.classList.add('selected');
                } else {
                    s.classList.remove('selected');
                }
            });
        });
    });
    
    // Remove hover effect when mouse leaves the rating container
    ratingContainer.addEventListener('mouseleave', () => {
        stars.forEach(star => star.classList.remove('hover'));
    });
}

// Form Submission
function initFormSubmission() {
    const reviewForm = document.getElementById('review-form');
    
    if (!reviewForm) return;
    
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(reviewForm);
        const reviewData = Object.fromEntries(formData.entries());
        
        // Basic validation
        if (!validateReviewForm(reviewData)) {
            return;
        }
        
        // In a real application, you would send this data to a server
        console.log('Review submitted:', reviewData);
        
        // Show success message
        const formContainer = reviewForm.closest('.form-container');
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h3>Thank You!</h3>
            <p>Your review has been submitted successfully. We appreciate your feedback!</p>
        `;
        
        formContainer.innerHTML = '';
        formContainer.appendChild(successMessage);
        
        // Scroll to the success message
        successMessage.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Form validation function
    function validateReviewForm(data) {
        let isValid = true;
        let errorMessage = '';
        
        // Check if name is provided
        if (!data.name || data.name.trim() === '') {
            errorMessage = 'Please enter your name';
            isValid = false;
        }
        
        // Check if rating is provided
        if (!data.rating || data.rating === '0') {
            errorMessage = 'Please select a rating';
            isValid = false;
        }
        
        // Check if review text is provided
        if (!data.review || data.review.trim() === '') {
            errorMessage = 'Please write your review';
            isValid = false;
        }
        
        // Display error message if validation fails
        if (!isValid) {
            const errorElement = document.getElementById('form-error') || document.createElement('div');
            errorElement.id = 'form-error';
            errorElement.className = 'error-message';
            errorElement.textContent = errorMessage;
            
            // Add error message to form if it doesn't exist
            if (!document.getElementById('form-error')) {
                reviewForm.prepend(errorElement);
            }
            
            // Scroll to error message
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        return isValid;
    }
}

// Dashboard Controls
function initDashboardControls() {
    const filterSelect = document.getElementById('filter-rating');
    const sortSelect = document.getElementById('sort-by');
    const featuredToggle = document.getElementById('show-featured');
    const reviewItems = document.querySelectorAll('.review-item');
    
    if (!filterSelect || !sortSelect || !reviewItems.length) return;
    
    // Apply filters and sorting
    function updateReviewDisplay() {
        const filterValue = parseInt(filterSelect.value) || 0;
        const sortValue = sortSelect.value;
        const showFeaturedOnly = featuredToggle && featuredToggle.checked;
        
        // Clone the reviews array for sorting
        const reviewsArray = Array.from(reviewItems);
        
        // Filter reviews
        reviewsArray.forEach(review => {
            const reviewRating = parseInt(review.dataset.rating) || 0;
            const isFeatured = review.dataset.featured === 'true';
            
            let isVisible = true;
            
            // Apply rating filter
            if (filterValue > 0 && reviewRating !== filterValue) {
                isVisible = false;
            }
            
            // Apply featured filter
            if (showFeaturedOnly && !isFeatured) {
                isVisible = false;
            }
            
            // Show/hide based on filters
            review.style.display = isVisible ? 'block' : 'none';
        });
        
        // Sort visible reviews
        const reviewsContainer = reviewItems[0].parentElement;
        const visibleReviews = reviewsArray.filter(review => review.style.display !== 'none');
        
        visibleReviews.sort((a, b) => {
            const aRating = parseInt(a.dataset.rating) || 0;
            const bRating = parseInt(b.dataset.rating) || 0;
            const aDate = new Date(a.dataset.date || 0);
            const bDate = new Date(b.dataset.date || 0);
            
            if (sortValue === 'highest') {
                return bRating - aRating;
            } else if (sortValue === 'lowest') {
                return aRating - bRating;
            } else if (sortValue === 'newest') {
                return bDate - aDate;
            } else if (sortValue === 'oldest') {
                return aDate - bDate;
            }
            return 0;
        });
        
        // Re-append sorted reviews
        visibleReviews.forEach(review => {
            reviewsContainer.appendChild(review);
        });
    }
    
    // Add event listeners
    filterSelect.addEventListener('change', updateReviewDisplay);
    sortSelect.addEventListener('change', updateReviewDisplay);
    if (featuredToggle) {
        featuredToggle.addEventListener('change', updateReviewDisplay);
    }
    
    // Initial update
    updateReviewDisplay();
}

// FAQ Accordion
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (!faqItems.length) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                // Toggle active class on the clicked item
                item.classList.toggle('active');
                
                // Optionally, close other items when one is opened
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
            });
        }
    });
}

// Testimonial Carousel
function initTestimonialCarousel() {
    const carousel = document.querySelector('.testimonial-carousel');
    if (!carousel) return;
    
    const testimonialsContainer = carousel.querySelector('.testimonials');
    const testimonials = carousel.querySelectorAll('.testimonial');
    const prevBtn = carousel.querySelector('.prev-btn');
    const nextBtn = carousel.querySelector('.next-btn');
    const dots = carousel.querySelectorAll('.dot');
    
    if (!testimonialsContainer || !testimonials.length) return;
    
    let currentIndex = 0;
    const totalItems = testimonials.length;
    
    // Initialize carousel
    updateCarousel();
    
    // Previous button click
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateCarousel();
        });
    }
    
    // Next button click
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        });
    }
    
    // Dot navigation
    if (dots.length) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });
    }
    
    // Touch/swipe support
    let startX, moveX;
    let isDragging = false;
    
    testimonialsContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    }, { passive: true });
    
    testimonialsContainer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        moveX = e.touches[0].clientX;
    }, { passive: true });
    
    testimonialsContainer.addEventListener('touchend', () => {
        if (!isDragging || !startX || !moveX) return;
        
        const diff = startX - moveX;
        const threshold = 50; // Minimum distance to register as swipe
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swipe left, show next slide
                currentIndex = (currentIndex + 1) % totalItems;
            } else {
                // Swipe right, show previous slide
                currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            }
            updateCarousel();
        }
        
        // Reset values
        startX = null;
        moveX = null;
        isDragging = false;
    });
    
    // Auto advance slides every 5 seconds
    let autoplayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    }, 5000);
    
    // Pause auto advance on hover/touch
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        }, 5000);
    });
    
    // Update carousel state
    function updateCarousel() {
        // Calculate slide position
        const slideWidth = testimonials[0].offsetWidth;
        testimonialsContainer.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        
        // Update dots
        if (dots.length) {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
    }
}

// Share Modal
function initShareModal() {
    const shareButtons = document.querySelectorAll('.share-review');
    const modal = document.getElementById('share-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (!modal) return;
    
    // Open modal when share button is clicked
    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get review data from button data attributes
            const reviewId = button.getAttribute('data-review-id');
            const reviewText = button.getAttribute('data-review-text');
            const reviewAuthor = button.getAttribute('data-author');
            const reviewRating = button.getAttribute('data-rating');
            
            // Set modal content based on review data
            const reviewContentElement = modal.querySelector('.review-content');
            if (reviewContentElement) {
                reviewContentElement.innerHTML = `
                    <div class="review-rating">${"★".repeat(parseInt(reviewRating))}${"☆".repeat(5 - parseInt(reviewRating))}</div>
                    <p class="review-text">${reviewText}</p>
                    <p class="review-author">- ${reviewAuthor}</p>
                `;
            }
            
            // Set share links with the review data
            const shareLinks = modal.querySelectorAll('.social-share a');
            shareLinks.forEach(link => {
                const platform = link.getAttribute('data-platform');
                const baseUrl = link.getAttribute('href');
                const shareText = `Check out this ${reviewRating}-star review from ${reviewAuthor}: "${reviewText}"`;
                
                if (platform === 'twitter') {
                    link.href = `${baseUrl}?text=${encodeURIComponent(shareText)}`;
                } else if (platform === 'facebook') {
                    link.href = `${baseUrl}?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`;
                } else if (platform === 'linkedin') {
                    link.href = `${baseUrl}?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(shareText)}`;
                }
            });
            
            // Show modal
            modal.style.display = 'flex';
        });
    });
    
    // Close modal when close button is clicked
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Generate review image feature
    const generateImageBtn = document.getElementById('generate-image');
    if (generateImageBtn) {
        generateImageBtn.addEventListener('click', () => {
            const reviewContent = modal.querySelector('.review-content');
            if (!reviewContent) return;
            
            // In a real application, you would use a library like html2canvas
            // to convert the review content to an image
            alert('Feature coming soon: This would generate a sharable image of the review.');
            
            // Example implementation with html2canvas (would require the library)
            /*
            html2canvas(reviewContent).then(canvas => {
                const imageUrl = canvas.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                downloadLink.href = imageUrl;
                downloadLink.download = 'review.png';
                downloadLink.click();
            });
            */
        });
    }
}

// Mobile Navigation
function initMobileNav() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileMenuBtn || !navLinks) return;
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
} 
} 
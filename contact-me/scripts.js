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
    initStarRating();
    initFormSubmission();
    initDashboardControls();
    initFaqAccordion();
    initTestimonialCarousel();
    initShareModal();
    initMobileNav();
});

// Star Rating Functionality
function initStarRating() {
    const stars = document.querySelectorAll('.stars i');
    const ratingText = document.querySelector('.rating-text');
    let currentRating = 0;
    
    const ratingTexts = {
        1: 'Poor',
        2: 'Fair',
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent'
    };

    // Add hover effect
    stars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.dataset.rating);
            highlightStars(rating);
            ratingText.textContent = ratingTexts[rating];
        });

        star.addEventListener('mouseout', function() {
            if (currentRating === 0) {
                resetStars();
                ratingText.textContent = '';
            } else {
                highlightStars(currentRating);
                ratingText.textContent = ratingTexts[currentRating];
            }
        });

        star.addEventListener('click', function() {
            currentRating = parseInt(this.dataset.rating);
            highlightStars(currentRating);
            ratingText.textContent = ratingTexts[currentRating];
            // Add hidden input with rating value
            let ratingInput = document.getElementById('ratingValue');
            if (!ratingInput) {
                ratingInput = document.createElement('input');
                ratingInput.type = 'hidden';
                ratingInput.id = 'ratingValue';
                ratingInput.name = 'rating';
                document.getElementById('reviewSubmitForm').appendChild(ratingInput);
            }
            ratingInput.value = currentRating;
        });
    });

    function highlightStars(rating) {
        stars.forEach(star => {
            const starRating = parseInt(star.dataset.rating);
            star.classList.remove('star-active', 'fa-solid', 'fa-regular');
            
            if (starRating <= rating) {
                star.classList.add('star-active', 'fa-solid');
            } else {
                star.classList.add('fa-regular');
            }
        });
    }

    function resetStars() {
        stars.forEach(star => {
            star.classList.remove('star-active', 'fa-regular');
            star.classList.add('fa-solid');
        });
    }
}

// Form Submission
function initFormSubmission() {
    const form = document.getElementById('reviewSubmitForm');
    const reviewForm = document.getElementById('reviewForm');
    const successMessage = document.getElementById('successMessage');
    const submitAnotherBtn = document.getElementById('submitAnotherBtn');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const rating = document.getElementById('ratingValue')?.value || 0;
            const reviewText = document.getElementById('reviewText').value;
            const reviewName = document.getElementById('reviewName').value;
            const permissionWebsite = document.getElementById('permissionWebsite').checked;
            const permissionSocial = document.getElementById('permissionSocial').checked;
            const permissionMarketing = document.getElementById('permissionMarketing').checked;
            
            // Validate data
            if (rating === 0) {
                alert('Please select a rating before submitting.');
                return;
            }
            
            // Here you would typically send the data to your server
            console.log('Review submitted:', {
                rating,
                reviewText,
                reviewName,
                permissions: {
                    website: permissionWebsite,
                    social: permissionSocial,
                    marketing: permissionMarketing
                },
                date: new Date()
            });
            
            // Show success message
            reviewForm.style.display = 'none';
            successMessage.style.display = 'block';
        });
    }
    
    if (submitAnotherBtn) {
        submitAnotherBtn.addEventListener('click', function() {
            // Reset form
            if (form) form.reset();
            
            // Reset star rating
            const stars = document.querySelectorAll('.stars i');
            stars.forEach(star => {
                star.classList.remove('star-active', 'fa-regular');
                star.classList.add('fa-solid');
            });
            document.querySelector('.rating-text').textContent = '';
            
            // Hide success, show form
            successMessage.style.display = 'none';
            reviewForm.style.display = 'block';
        });
    }
}

// Dashboard Controls (Filtering and Sorting)
function initDashboardControls() {
    const sortSelect = document.getElementById('sortReviews');
    const filterRating = document.getElementById('filterRating');
    const filterFeatured = document.getElementById('filterFeatured');
    const reviewList = document.querySelector('.review-list');
    const reviewItems = document.querySelectorAll('.review-item');
    
    // Apply filtering and sorting
    function applyFilters() {
        const ratingFilter = filterRating.value;
        const featuredFilter = filterFeatured.value;
        const sortOrder = sortSelect.value;
        
        // Clone reviews for sorting
        const reviews = Array.from(reviewItems);
        
        // Filter by rating
        let filteredReviews = reviews.filter(review => {
            const reviewRating = review.dataset.rating;
            const isFeatured = review.classList.contains('featured');
            
            let ratingMatch = ratingFilter === 'all' || reviewRating === ratingFilter;
            let featuredMatch = featuredFilter === 'all' || 
                                (featuredFilter === 'featured' && isFeatured);
            
            return ratingMatch && featuredMatch;
        });
        
        // Sort reviews
        filteredReviews.sort((a, b) => {
            const aRating = parseInt(a.dataset.rating);
            const bRating = parseInt(b.dataset.rating);
            
            // Get dates (you would need to parse these from your actual date format)
            const aDateStr = a.querySelector('.review-date').textContent;
            const bDateStr = b.querySelector('.review-date').textContent;
            const aDate = new Date(aDateStr);
            const bDate = new Date(bDateStr);
            
            switch(sortOrder) {
                case 'newest':
                    return bDate - aDate;
                case 'oldest':
                    return aDate - bDate;
                case 'highest':
                    return bRating - aRating;
                case 'lowest':
                    return aRating - bRating;
                default:
                    return 0;
            }
        });
        
        // Remove all reviews
        while (reviewList.firstChild) {
            reviewList.removeChild(reviewList.firstChild);
        }
        
        // Add filtered and sorted reviews
        filteredReviews.forEach(review => {
            reviewList.appendChild(review);
        });
    }
    
    // Add event listeners
    if (sortSelect) sortSelect.addEventListener('change', applyFilters);
    if (filterRating) filterRating.addEventListener('change', applyFilters);
    if (filterFeatured) filterFeatured.addEventListener('change', applyFilters);
    
    // Feature/unfeature buttons
    const featureButtons = document.querySelectorAll('.feature-btn');
    featureButtons.forEach(button => {
        button.addEventListener('click', function() {
            const reviewItem = this.closest('.review-item');
            
            if (this.classList.contains('active')) {
                // Unfeature
                reviewItem.classList.remove('featured');
                this.classList.remove('active');
                this.innerHTML = '<i class="fa-solid fa-star"></i> Feature';
                
                // Remove featured badge
                const badge = reviewItem.querySelector('.featured-badge');
                if (badge) badge.remove();
            } else {
                // Feature
                reviewItem.classList.add('featured');
                this.classList.add('active');
                this.innerHTML = '<i class="fa-solid fa-star"></i> Featured';
                
                // Add featured badge if it doesn't exist
                const nameElement = reviewItem.querySelector('.review-name');
                if (!reviewItem.querySelector('.featured-badge')) {
                    const badge = document.createElement('span');
                    badge.className = 'featured-badge';
                    badge.innerHTML = '<i class="fa-solid fa-award"></i> Featured';
                    nameElement.appendChild(badge);
                }
            }
            
            // Re-apply filters to update the view
            applyFilters();
        });
    });
    
    // Respond buttons
    const respondButtons = document.querySelectorAll('.respond-btn');
    respondButtons.forEach(button => {
        button.addEventListener('click', function() {
            const reviewItem = this.closest('.review-item');
            
            // Check if response already exists
            let responseDiv = reviewItem.querySelector('.agent-response');
            
            if (responseDiv) {
                // Toggle existing response
                responseDiv.style.display = responseDiv.style.display === 'none' ? 'block' : 'none';
            } else {
                // Create new response form
                responseDiv = document.createElement('div');
                responseDiv.className = 'agent-response';
                responseDiv.innerHTML = `
                    <h5 class="response-header">Your Response:</h5>
                    <textarea class="response-input" placeholder="Write your response here..."></textarea>
                    <div class="response-actions">
                        <button class="btn primary-btn save-response-btn">Save Response</button>
                        <button class="btn secondary-btn cancel-response-btn">Cancel</button>
                    </div>
                `;
                reviewItem.appendChild(responseDiv);
                
                // Add event listeners for save/cancel
                const saveBtn = responseDiv.querySelector('.save-response-btn');
                const cancelBtn = responseDiv.querySelector('.cancel-response-btn');
                
                saveBtn.addEventListener('click', function() {
                    const responseText = responseDiv.querySelector('.response-input').value;
                    if (responseText.trim() === '') {
                        alert('Please enter a response.');
                        return;
                    }
                    
                    // Replace form with saved response
                    responseDiv.innerHTML = `
                        <h5 class="response-header">Response from Zack:</h5>
                        <p class="response-text">${responseText}</p>
                    `;
                });
                
                cancelBtn.addEventListener('click', function() {
                    reviewItem.removeChild(responseDiv);
                });
            }
        });
    });
    
    // Share buttons
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get review data
            const reviewItem = this.closest('.review-item');
            const reviewText = reviewItem.querySelector('.review-text').textContent;
            const reviewName = reviewItem.querySelector('.review-name').textContent.split(' ')[0]; // Get first name
            
            // Store data for use in share modal
            window.currentReviewToShare = {
                text: reviewText,
                name: reviewName,
                rating: reviewItem.dataset.rating
            };
            
            // Show share modal
            const shareModal = document.getElementById('shareModal');
            if (shareModal) shareModal.style.display = 'block';
        });
    });
}

// FAQ Accordion
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const title = item.querySelector('h3');
        const content = item.querySelector('.faq-content');
        
        title.addEventListener('click', function() {
            // Check if this item is already active
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                faq.querySelector('.faq-content').style.maxHeight = null;
            });
            
            // If it wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
}

// Testimonial Carousel
function initTestimonialCarousel() {
    const carousel = document.querySelector('.testimonial-carousel');
    if (!carousel) return;
    
    const testimonials = carousel.querySelectorAll('.testimonial-item');
    const dots = carousel.querySelectorAll('.dot');
    let currentIndex = 0;
    let startX, moveX;
    let autoplayInterval;
    
    // Initialize carousel
    updateCarousel();
    startAutoplay();
    
    // Add event listeners for dots
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            currentIndex = parseInt(this.dataset.index);
            updateCarousel();
            resetAutoplay();
        });
    });
    
    // Add touch events for mobile
    carousel.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        clearInterval(autoplayInterval);
    }, { passive: true });
    
    carousel.addEventListener('touchmove', function(e) {
        if (!startX) return;
        moveX = e.touches[0].clientX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', function() {
        if (!startX || !moveX) return;
        
        const diff = startX - moveX;
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                // Swipe left, go to next
                currentIndex = (currentIndex + 1) % testimonials.length;
            } else {
                // Swipe right, go to previous
                currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            }
            updateCarousel();
        }
        
        // Reset values
        startX = null;
        moveX = null;
        
        resetAutoplay();
    }, { passive: true });
    
    function updateCarousel() {
        // Update testimonials
        testimonials.forEach((testimonial, index) => {
            testimonial.style.display = index === currentIndex ? 'block' : 'none';
        });
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            updateCarousel();
        }, 5000); // Change slide every 5 seconds
    }
    
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }
}

// Share Modal
function initShareModal() {
    const modal = document.getElementById('shareModal');
    if (!modal) return;
    
    const closeBtn = modal.querySelector('.close-modal');
    const shareButtons = modal.querySelectorAll('.share-buttons .share-btn');
    const templateOptions = modal.querySelectorAll('.template-option');
    const generateBtn = modal.querySelector('.generate-graphic');
    
    // Close button
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Template options
    templateOptions.forEach(template => {
        template.addEventListener('click', function() {
            templateOptions.forEach(t => t.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Share buttons
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.classList[1]; // Get platform class (facebook, twitter, etc.)
            const review = window.currentReviewToShare;
            
            if (!review) return;
            
            let shareUrl;
            const text = encodeURIComponent(`"${review.text}" - ${review.name}`);
            const url = encodeURIComponent(window.location.href);
            
            switch(platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                    break;
                case 'instagram':
                    alert('To share on Instagram, please download the graphic and upload it manually.');
                    return;
            }
            
            // Open share window
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
    
    // Generate graphic button
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            const review = window.currentReviewToShare;
            if (!review) return;
            
            const selectedTemplate = document.querySelector('.template-option.selected');
            if (!selectedTemplate) return;
            
            // In a real implementation, this would create a graphic with the review text
            // Here, we'll just simulate the generation
            alert('Graphic generated! (In a real implementation, this would create and download an image)');
        });
    }
}

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });
} 
} 
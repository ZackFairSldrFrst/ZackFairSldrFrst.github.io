document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components for the review collector page
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
    const ratingInput = document.getElementById('rating');

    if (!ratingContainer) return;

    // Handle hover effects
    stars.forEach((star, index) => {
        // Mouse enter (hover) effect
        star.addEventListener('mouseenter', () => {
            // Highlight current star and all previous stars
            for (let i = 0; i <= index; i++) {
                stars[i].classList.add('hover');
            }
            ratingValue.textContent = index + 1;
        });

        // Mouse leave effect
        star.addEventListener('mouseleave', () => {
            // Remove hover class from all stars
            stars.forEach(s => s.classList.remove('hover'));
            
            // Show the actual selected rating or nothing
            const selectedRating = parseInt(ratingInput.value) || 0;
            ratingValue.textContent = selectedRating || '';
        });

        // Click to select rating
        star.addEventListener('click', () => {
            const newRating = index + 1;
            ratingInput.value = newRating;
            
            // Update visual state
            stars.forEach((s, i) => {
                s.classList.toggle('selected', i < newRating);
            });
            
            ratingValue.textContent = newRating;
        });
    });

    // Reset rating when clicking outside
    ratingContainer.addEventListener('mouseleave', () => {
        const selectedRating = parseInt(ratingInput.value) || 0;
        
        // Update visual state based on selected rating
        stars.forEach((star, i) => {
            star.classList.toggle('selected', i < selectedRating);
        });
        
        // Show the selected rating or nothing if none selected
        ratingValue.textContent = selectedRating || '';
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
        const reviewData = {
            name: formData.get('name'),
            rating: formData.get('rating'),
            review: formData.get('review'),
            publicReview: formData.get('public-review') === 'on',
            useTestimonial: formData.get('use-testimonial') === 'on',
            industry: formData.get('industry'),
            email: formData.get('email'),
            timestamp: new Date().toISOString()
        };
        
        // Validate form
        if (!validateReviewForm(reviewForm)) {
            return;
        }
        
        // In a real implementation, this would be sent to a server
        console.log('Review submitted:', reviewData);
        
        // Show success message
        const formContainer = reviewForm.closest('.review-form-container');
        formContainer.innerHTML = `
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                <h2>Thank You for Your Review!</h2>
                <p>Your feedback has been submitted successfully and will help others make informed decisions.</p>
                <button class="btn btn-primary" id="submit-another">Submit Another Review</button>
            </div>
        `;
        
        // Add event listener for "Submit Another Review" button
        const submitAnotherBtn = document.getElementById('submit-another');
        if (submitAnotherBtn) {
            submitAnotherBtn.addEventListener('click', function() {
                window.location.reload();
            });
        }
    });
    
    function validateReviewForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                markInvalid(field, 'This field is required');
                isValid = false;
            } else {
                removeInvalid(field);
                
                // Email validation
                if (field.type === 'email' && !validateEmail(field.value)) {
                    markInvalid(field, 'Please enter a valid email address');
                    isValid = false;
                }
            }
        });
        
        // Validate rating
        const ratingInput = form.querySelector('#rating');
        if (!ratingInput.value) {
            const ratingContainer = form.querySelector('.star-rating-container');
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Please select a rating';
            
            // Remove any existing error messages first
            const existingError = ratingContainer.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            ratingContainer.appendChild(errorMessage);
            isValid = false;
        }
        
        return isValid;
    }
    
    function markInvalid(input, message) {
        const formGroup = input.closest('.form-group');
        
        // Remove any existing error messages
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error class
        input.classList.add('invalid');
        
        // Add error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        formGroup.appendChild(errorMessage);
    }
    
    function removeInvalid(input) {
        const formGroup = input.closest('.form-group');
        input.classList.remove('invalid');
        
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }
    
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
}

// Dashboard Controls
function initDashboardControls() {
    const dashboard = document.querySelector('.dashboard');
    if (!dashboard) return;
    
    const filterControls = dashboard.querySelector('.filter-controls');
    const reviewItems = dashboard.querySelectorAll('.review-item');
    
    if (!filterControls) return;
    
    // Filter by rating
    const ratingFilter = filterControls.querySelector('#filter-rating');
    if (ratingFilter) {
        ratingFilter.addEventListener('change', updateFilters);
    }
    
    // Filter by featured
    const featuredFilter = filterControls.querySelector('#filter-featured');
    if (featuredFilter) {
        featuredFilter.addEventListener('change', updateFilters);
    }
    
    // Sort by options
    const sortBy = filterControls.querySelector('#sort-by');
    if (sortBy) {
        sortBy.addEventListener('change', updateFilters);
    }
    
    function updateFilters() {
        const selectedRating = ratingFilter ? parseInt(ratingFilter.value) : 0;
        const showFeatured = featuredFilter ? featuredFilter.checked : false;
        const sortOption = sortBy ? sortBy.value : 'recent';
        
        // First filter the reviews
        let filteredReviews = Array.from(reviewItems);
        
        // Filter by rating
        if (selectedRating > 0) {
            filteredReviews = filteredReviews.filter(review => {
                const reviewRating = parseInt(review.getAttribute('data-rating') || 0);
                return reviewRating >= selectedRating;
            });
        }
        
        // Filter by featured
        if (showFeatured) {
            filteredReviews = filteredReviews.filter(review => {
                return review.classList.contains('featured');
            });
        }
        
        // Sort reviews
        filteredReviews.sort((a, b) => {
            if (sortOption === 'highest') {
                const ratingA = parseInt(a.getAttribute('data-rating') || 0);
                const ratingB = parseInt(b.getAttribute('data-rating') || 0);
                return ratingB - ratingA;
            } else if (sortOption === 'lowest') {
                const ratingA = parseInt(a.getAttribute('data-rating') || 0);
                const ratingB = parseInt(b.getAttribute('data-rating') || 0);
                return ratingA - ratingB;
            } else {
                // Default: sort by date (recent)
                const dateA = new Date(a.getAttribute('data-date') || 0);
                const dateB = new Date(b.getAttribute('data-date') || 0);
                return dateB - dateA;
            }
        });
        
        // Hide all reviews first
        reviewItems.forEach(item => {
            item.style.display = 'none';
        });
        
        // Show filtered and sorted reviews
        filteredReviews.forEach(item => {
            item.style.display = 'block';
        });
        
        // Update count
        const countElement = dashboard.querySelector('.review-count');
        if (countElement) {
            countElement.textContent = `Showing ${filteredReviews.length} of ${reviewItems.length} reviews`;
        }
    }
    
    // Initial filter application
    updateFilters();
}

// FAQ Accordion
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        const content = item.querySelector('.faq-content');
        
        header.addEventListener('click', () => {
            // Toggle current item
            const isOpen = item.classList.contains('active');
            
            // Optional: Close other open FAQs
            // faqItems.forEach(otherItem => {
            //     if (otherItem !== item) {
            //         otherItem.classList.remove('active');
            //     }
            // });
            
            // Toggle current item
            item.classList.toggle('active', !isOpen);
        });
    });
}

// Testimonial Carousel
function initTestimonialCarousel() {
    const carousel = document.querySelector('.testimonial-carousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.testimonial');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    // Initialize carousel
    updateCarousel();
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateCarousel();
        });
    }
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });
    
    // Touch/swipe support
    let startX, moveX;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!startX) return;
        moveX = e.touches[0].clientX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', () => {
        if (!startX || !moveX) return;
        
        const diff = startX - moveX;
        const threshold = 50; // Minimum distance for swipe
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swipe left, next slide
                currentIndex = (currentIndex + 1) % totalSlides;
            } else {
                // Swipe right, previous slide
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            }
            updateCarousel();
        }
        
        // Reset values
        startX = null;
        moveX = null;
    }, { passive: true });
    
    // Auto-advance slides
    let intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }, 5000);
    
    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
        clearInterval(intervalId);
    });
    
    carousel.addEventListener('mouseleave', () => {
        intervalId = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        }, 5000);
    });
    
    function updateCarousel() {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Show current slide
        slides[currentIndex].classList.add('active');
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
}

// Share Modal
function initShareModal() {
    const shareButtons = document.querySelectorAll('.share-review');
    const modal = document.getElementById('share-modal');
    const closeBtn = modal ? modal.querySelector('.close-modal') : null;
    const sharePlatforms = modal ? modal.querySelectorAll('.share-platform') : [];
    const reviewPreview = modal ? modal.querySelector('.review-preview') : null;
    
    if (!modal) return;
    
    // Open modal when share button is clicked
    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get review data from the clicked item
            const reviewItem = button.closest('.review-item');
            const reviewData = {
                author: reviewItem.querySelector('.review-author').textContent,
                rating: parseInt(reviewItem.getAttribute('data-rating') || 5),
                text: reviewItem.querySelector('.review-text').textContent,
                date: reviewItem.getAttribute('data-date')
            };
            
            // Update preview
            if (reviewPreview) {
                // Generate stars
                const starsHtml = Array(5).fill('')
                    .map((_, i) => `<i class="fas fa-star${i < reviewData.rating ? ' active' : ''}"></i>`)
                    .join('');
                
                reviewPreview.innerHTML = `
                    <div class="preview-header">
                        <h4>${reviewData.author}</h4>
                        <div class="preview-stars">${starsHtml}</div>
                    </div>
                    <p class="preview-text">${reviewData.text}</p>
                    <p class="preview-date">${new Date(reviewData.date).toLocaleDateString()}</p>
                `;
                
                // Store review data for sharing
                sharePlatforms.forEach(platform => {
                    platform.setAttribute('data-review', JSON.stringify(reviewData));
                });
            }
            
            // Show modal
            modal.classList.add('active');
            document.body.classList.add('modal-open');
        });
    });
    
    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
        });
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    });
    
    // Share on platforms
    sharePlatforms.forEach(platform => {
        platform.addEventListener('click', (e) => {
            e.preventDefault();
            
            const type = platform.getAttribute('data-platform');
            const reviewData = JSON.parse(platform.getAttribute('data-review') || '{}');
            
            // Generate share URL based on platform
            let shareUrl = '';
            
            switch (type) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${reviewData.author} gave a ${reviewData.rating}-star review: "${reviewData.text.substring(0, 100)}..."`)}&url=${encodeURIComponent(window.location.href)}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent('Customer Review')}&summary=${encodeURIComponent(reviewData.text)}`;
                    break;
                case 'email':
                    shareUrl = `mailto:?subject=${encodeURIComponent('Customer Review')}&body=${encodeURIComponent(`${reviewData.author} gave a ${reviewData.rating}-star review:\n\n"${reviewData.text}"\n\nView more at: ${window.location.href}`)}`;
                    break;
                case 'generate':
                    // For generating a graphic, we would normally call a function
                    // to create an image from the review data
                    generateReviewGraphic(reviewData);
                    return; // Don't open a new window
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
    
    function generateReviewGraphic(reviewData) {
        // This would typically use canvas or a server-side API to generate an image
        alert('This would generate a shareable graphic of the review in a real implementation.');
        
        // Example implementation could use html2canvas:
        // html2canvas(reviewPreview).then(canvas => {
        //     const dataUrl = canvas.toDataURL('image/png');
        //     const link = document.createElement('a');
        //     link.download = 'review.png';
        //     link.href = dataUrl;
        //     link.click();
        // });
    }
}

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.site-nav');
    
    if (!hamburger || !nav) return;
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });
    
    // Close menu when clicking a navigation link
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        });
    });
} 
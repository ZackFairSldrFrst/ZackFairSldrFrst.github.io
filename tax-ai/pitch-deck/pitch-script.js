// TaxAI Pitch Deck JavaScript

let currentSlide = 1;
const totalSlides = 8; // Updated to match actual slides

// Google Analytics tracking for pitch deck
function trackPitchEvent(eventName, slideNumber, details = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: 'pitch_deck',
            event_label: `slide_${slideNumber}`,
            custom_parameters: details
        });
    }
}

// Initialize pitch deck
document.addEventListener('DOMContentLoaded', function() {
    initializePitchDeck();
    generateSlideDots();
    trackPitchEvent('pitch_deck_loaded', currentSlide);
    
    // Track time spent on each slide
    startSlideTimer();
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyNavigation);
    
    // Prevent right-click context menu for professional presentation
    document.addEventListener('contextmenu', (e) => e.preventDefault());
});

function initializePitchDeck() {
    updateSlideCounter();
    setActiveSlide(currentSlide);
    
    // Auto-advance demo (optional - can be disabled)
    // startAutoAdvance();
}

function generateSlideDots() {
    const dotsContainer = document.getElementById('slideDots');
    dotsContainer.innerHTML = '';
    
    for (let i = 1; i <= totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (i === currentSlide) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
}

function nextSlide() {
    if (currentSlide < totalSlides) {
        const prevSlide = currentSlide;
        currentSlide++;
        setActiveSlide(currentSlide);
        updateSlideCounter();
        updateSlideDots();
        
        // Track slide progression
        trackPitchEvent('slide_next', currentSlide, { 
            from_slide: prevSlide,
            to_slide: currentSlide
        });
        
        startSlideTimer();
    }
}

function previousSlide() {
    if (currentSlide > 1) {
        const prevSlide = currentSlide;
        currentSlide--;
        setActiveSlide(currentSlide);
        updateSlideCounter();
        updateSlideDots();
        
        // Track slide regression
        trackPitchEvent('slide_previous', currentSlide, { 
            from_slide: prevSlide,
            to_slide: currentSlide
        });
        
        startSlideTimer();
    }
}

function goToSlide(slideNumber) {
    if (slideNumber >= 1 && slideNumber <= totalSlides && slideNumber !== currentSlide) {
        const prevSlide = currentSlide;
        currentSlide = slideNumber;
        setActiveSlide(currentSlide);
        updateSlideCounter();
        updateSlideDots();
        
        // Track direct navigation
        trackPitchEvent('slide_jump', currentSlide, { 
            from_slide: prevSlide,
            to_slide: currentSlide
        });
        
        startSlideTimer();
    }
}

function setActiveSlide(slideNumber) {
    // Remove active class from all slides
    document.querySelectorAll('.slide').forEach(slide => {
        slide.classList.remove('active', 'prev');
    });
    
    // Add active class to current slide
    const activeSlide = document.querySelector(`[data-slide="${slideNumber}"]`);
    if (activeSlide) {
        activeSlide.classList.add('active');
    }
    
    // Add prev class to previous slides for animation
    document.querySelectorAll('.slide').forEach(slide => {
        const slideNum = parseInt(slide.getAttribute('data-slide'));
        if (slideNum < slideNumber) {
            slide.classList.add('prev');
        }
    });
}

function updateSlideCounter() {
    const counter = document.getElementById('slideCounter');
    if (counter) {
        counter.textContent = `${currentSlide} / ${totalSlides}`;
    }
}

function updateSlideDots() {
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index + 1 === currentSlide);
    });
}

function handleKeyNavigation(event) {
    switch(event.key) {
        case 'ArrowRight':
        case ' ': // Spacebar
            event.preventDefault();
            nextSlide();
            break;
        case 'ArrowLeft':
            event.preventDefault();
            previousSlide();
            break;
        case 'Home':
            event.preventDefault();
            goToSlide(1);
            break;
        case 'End':
            event.preventDefault();
            goToSlide(totalSlides);
            break;
        case 'Escape':
            event.preventDefault();
            exitFullscreen();
            break;
        case 'f':
        case 'F11':
            event.preventDefault();
            toggleFullscreen();
            break;
    }
}

function toggleFullscreen() {
    const fullscreenBtn = document.querySelector('.fullscreen-btn i');
    
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            fullscreenBtn.className = 'fas fa-compress';
            trackPitchEvent('fullscreen_enter', currentSlide);
        });
    } else {
        document.exitFullscreen().then(() => {
            fullscreenBtn.className = 'fas fa-expand';
            trackPitchEvent('fullscreen_exit', currentSlide);
        });
    }
}

function exitFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
}

// Timer for tracking time spent on each slide
let slideStartTime = Date.now();

function startSlideTimer() {
    slideStartTime = Date.now();
}

function getSlideTime() {
    return Date.now() - slideStartTime;
}

// Track when user leaves a slide
window.addEventListener('beforeunload', () => {
    const timeSpent = getSlideTime();
    trackPitchEvent('slide_time_spent', currentSlide, { 
        time_ms: timeSpent,
        time_seconds: Math.round(timeSpent / 1000)
    });
});

// Auto-advance functionality (optional)
let autoAdvanceTimer;
const AUTO_ADVANCE_DELAY = 30000; // 30 seconds per slide

function startAutoAdvance() {
    stopAutoAdvance();
    autoAdvanceTimer = setTimeout(() => {
        if (currentSlide < totalSlides) {
            nextSlide();
            startAutoAdvance();
        }
    }, AUTO_ADVANCE_DELAY);
}

function stopAutoAdvance() {
    if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
        autoAdvanceTimer = null;
    }
}

// Pause auto-advance on user interaction
document.addEventListener('click', stopAutoAdvance);
document.addEventListener('keydown', stopAutoAdvance);

// Presentation mode utilities
function enterPresentationMode() {
    document.body.classList.add('presentation-mode');
    toggleFullscreen();
    startAutoAdvance();
    trackPitchEvent('presentation_mode_start', currentSlide);
}

function exitPresentationMode() {
    document.body.classList.remove('presentation-mode');
    stopAutoAdvance();
    exitFullscreen();
    trackPitchEvent('presentation_mode_end', currentSlide);
}

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            nextSlide();
        } else {
            // Swipe right - previous slide
            previousSlide();
        }
    }
}

// Progress indicator
function updateProgress() {
    const progress = (currentSlide / totalSlides) * 100;
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

// Slide-specific animations and interactions
function initializeSlideAnimations() {
    // Animate elements when slide becomes active
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    // Observe all animatable elements
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Performance tracking
function trackPresentationMetrics() {
    const metrics = {
        total_slides_viewed: currentSlide,
        completion_rate: (currentSlide / totalSlides) * 100,
        session_duration: Date.now() - sessionStartTime,
        device_type: window.innerWidth > 768 ? 'desktop' : 'mobile'
    };
    
    trackPitchEvent('presentation_metrics', currentSlide, metrics);
}

const sessionStartTime = Date.now();

// Track completion milestones
function checkCompletionMilestones() {
    const completionRate = (currentSlide / totalSlides) * 100;
    
    if (completionRate >= 25 && !window.milestone25) {
        window.milestone25 = true;
        trackPitchEvent('completion_milestone', currentSlide, { milestone: '25_percent' });
    }
    if (completionRate >= 50 && !window.milestone50) {
        window.milestone50 = true;
        trackPitchEvent('completion_milestone', currentSlide, { milestone: '50_percent' });
    }
    if (completionRate >= 75 && !window.milestone75) {
        window.milestone75 = true;
        trackPitchEvent('completion_milestone', currentSlide, { milestone: '75_percent' });
    }
    if (completionRate >= 100 && !window.milestone100) {
        window.milestone100 = true;
        trackPitchEvent('completion_milestone', currentSlide, { milestone: '100_percent' });
    }
}

// Call milestone check whenever slide changes
function checkMilestonesOnSlideChange() {
    checkCompletionMilestones();
    updateProgress();
}

// Add to existing slide navigation functions
const originalNextSlide = nextSlide;
const originalPreviousSlide = previousSlide;
const originalGoToSlide = goToSlide;

nextSlide = function() {
    originalNextSlide();
    checkMilestonesOnSlideChange();
};

previousSlide = function() {
    originalPreviousSlide();
    checkMilestonesOnSlideChange();
};

goToSlide = function(slideNumber) {
    originalGoToSlide(slideNumber);
    checkMilestonesOnSlideChange();
};

// Export functions for external use
window.PitchDeck = {
    nextSlide,
    previousSlide,
    goToSlide,
    toggleFullscreen,
    enterPresentationMode,
    exitPresentationMode,
    getCurrentSlide: () => currentSlide,
    getTotalSlides: () => totalSlides
}; 
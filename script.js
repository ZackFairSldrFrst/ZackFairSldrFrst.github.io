// JavaScript for smooth scrolling and fade-in animations
document.addEventListener("DOMContentLoaded", function() {
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(anchorLink => {
        anchorLink.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop;
                window.scrollTo({
                    top: offsetTop,
                    behavior: "smooth"
                });
            }
        });
    });

    // Fade-in animation on scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(fadeElement => {
        fadeElement.classList.add('active');
    });

    window.addEventListener('scroll', function() {
        fadeElements.forEach(fadeElement => {
            if (isElementInViewport(fadeElement)) {
                fadeElement.classList.add('active');
            }
        });
    });

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
});

// Function to add animation class when section comes into view
function addAnimationClass(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate__rubberBand'); // Add animation class
            observer.unobserve(entry.target); // Stop observing once animation is applied
        }
    });
}

// Create an intersection observer instance
const observer = new IntersectionObserver(addAnimationClass, {
    root: null, // Use the viewport as the root
    threshold: 0.5 // Trigger animation when 50% of section is visible
});

// Select all sections with the animation class
const sections = document.querySelectorAll('.animate__rubberBand');

// Observe each section
sections.forEach(section => {
    observer.observe(section);
});

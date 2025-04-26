// Mockup validation and interaction
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing device mockups...');

    // Handle iframe loading and fallbacks
    const handleIframes = () => {
        const iframes = document.querySelectorAll('.desktop-screen iframe, .device-screen iframe');
        
        iframes.forEach(iframe => {
            // Add loading indicator
            const parent = iframe.parentElement;
            const loader = document.createElement('div');
            loader.className = 'iframe-loader';
            loader.innerHTML = '<div class="spinner"></div><p>Loading preview...</p>';
            parent.appendChild(loader);
            
            // Force desktop view with appropriate scaling
            if (iframe.getAttribute('src') === 'food.html' && parent.classList.contains('desktop-screen')) {
                // Force desktop view with appropriate scaling
                iframe.style.width = '100%';  
                iframe.style.height = '100%';
                iframe.style.overflow = 'hidden';
                
                // Add load event listener to modify content scale
                iframe.addEventListener('load', function() {
                    try {
                        // Try to access iframe content if same origin
                        const iframeDoc = this.contentDocument || this.contentWindow.document;
                        const htmlElement = iframeDoc.documentElement;
                        
                        // Add meta viewport tag to force desktop view
                        const meta = iframeDoc.createElement('meta');
                        meta.name = 'viewport';
                        meta.content = 'width=1200, initial-scale=1';
                        iframeDoc.head.appendChild(meta);
                        
                        // Set body to desktop width
                        iframeDoc.body.style.width = '1200px';
                        iframeDoc.body.style.margin = '0 auto';
                        
                        // Make iframe fully interactive
                        this.style.pointerEvents = 'auto';
                    } catch(e) {
                        console.log('Cannot access iframe content: ', e);
                    }
                    
                    // Make overlay transparent to allow interaction
                    const overlay = this.parentElement.querySelector('.overlay');
                    if (overlay) {
                        overlay.style.pointerEvents = 'none';
                    }
                });
            }
            
            // Handle iframe load event
            iframe.addEventListener('load', function() {
                // Remove loader when iframe is loaded
                const loader = this.parentElement.querySelector('.iframe-loader');
                if (loader) {
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        loader.remove();
                    }, 500);
                }
            });
            
            // Handle iframe errors
            iframe.addEventListener('error', function() {
                createFallbackContent(this);
            });
            
            // Set a timeout for iframes that don't load
            setTimeout(() => {
                if (parent.contains(loader)) {
                    createFallbackContent(iframe);
                }
            }, 5000); // 5 second timeout
        });
    };
    
    // Create fallback content for iframes that fail to load
    const createFallbackContent = (iframe) => {
        const parent = iframe.parentElement;
        const src = iframe.getAttribute('src');
        const title = iframe.getAttribute('title') || 'Template Preview';
        
        // Create fallback div
        const fallback = document.createElement('div');
        fallback.className = 'iframe-fallback';
        fallback.style.backgroundColor = getRandomColor();
        fallback.innerHTML = `
            <h3>${title}</h3>
            <p>Preview not available</p>
            <a href="${src}" target="_blank" class="fallback-btn">Visit Page</a>
        `;
        
        // Hide the iframe and loader
        iframe.style.display = 'none';
        const loader = parent.querySelector('.iframe-loader');
        if (loader) loader.remove();
        
        // Add the fallback
        parent.appendChild(fallback);
        
        console.log(`Created fallback for: ${src}`);
    };
    
    // Generate random colors for fallbacks
    function getRandomColor() {
        const colors = [
            '#4361ee', '#3f37c9', '#4cc9f0', '#3a0ca3', 
            '#7209b7', '#f72585', '#4895ef', '#560bad'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Enhance carousel functionality for mobile
    const setupMockupCarousel = () => {
        const carousel = document.querySelector('.hero-mockup-carousel');
        if (!carousel) return;
        
        const slides = carousel.querySelectorAll('.mockup-slide');
        const dots = carousel.querySelectorAll('.dot');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        
        let currentSlide = 0;
        
        // Function to show a specific slide
        function showSlide(n) {
            // Handle index bounds
            if (n >= slides.length) currentSlide = 0;
            else if (n < 0) currentSlide = slides.length - 1;
            else currentSlide = n;
            
            // Hide all slides
            slides.forEach(slide => {
                slide.classList.remove('active');
                // Ensure mobile display is correct
                slide.style.opacity = '0';
                slide.style.visibility = 'hidden';
                if (window.innerWidth <= 768) {
                    slide.style.transform = 'translateX(100%)';
                }
            });
            
            // Remove active class from all dots
            dots.forEach(dot => {
                dot.classList.remove('active');
            });
            
            // Show the active slide
            const activeSlide = slides[currentSlide];
            activeSlide.classList.add('active');
            activeSlide.style.opacity = '1';
            activeSlide.style.visibility = 'visible';
            if (window.innerWidth <= 768) {
                activeSlide.style.transform = 'translateX(0)';
            }
            
            // Update the active dot
            dots[currentSlide].classList.add('active');
        }
        
        // Initialize carousel
        showSlide(0);
        
        // Event handlers for controls
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                showSlide(currentSlide - 1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                showSlide(currentSlide + 1);
            });
        }
        
        // Click handler for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
            });
        });
        
        // Auto-rotate slides
        setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            showSlide(currentSlide);
        });
    };
    
    // Add interaction effects to mockups
    const setupMockupInteraction = () => {
        // Desktop mockup interaction
        const desktopMockups = document.querySelectorAll('.desktop-mockup');
        desktopMockups.forEach(mockup => {
            const screen = mockup.querySelector('.desktop-screen');
            const overlay = screen.querySelector('.overlay');
            const iframe = screen.querySelector('iframe');
            
            if (screen && overlay && iframe) {
                // Toggle overlay on hover for more natural interaction
                screen.addEventListener('mouseenter', () => {
                    overlay.style.pointerEvents = 'none'; // Allow clicking through
                });
                
                screen.addEventListener('mouseleave', () => {
                    overlay.style.pointerEvents = 'none'; // Keep interaction available
                });
            }
        });
        
        // Mobile mockup interaction
        const mobileMockups = document.querySelectorAll('.device-mockup');
        mobileMockups.forEach(mockup => {
            const screen = mockup.querySelector('.device-screen');
            const overlay = screen.querySelector('.overlay');
            const iframe = screen.querySelector('iframe');
            
            if (screen && overlay && iframe) {
                // Toggle overlay on hover for more natural interaction
                screen.addEventListener('mouseenter', () => {
                    overlay.style.pointerEvents = 'none'; // Allow clicking through
                });
                
                screen.addEventListener('mouseleave', () => {
                    overlay.style.pointerEvents = 'none'; // Keep interaction available
                });
            }
        });
    };
    
    // Initialize iframe handling
    handleIframes();
    
    // Set up mockup carousel
    setupMockupCarousel();
    
    // Set up mockup interactions after a short delay to ensure DOM is ready
    setTimeout(setupMockupInteraction, 1000);
}); 
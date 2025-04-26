// Mockup validation
document.addEventListener('DOMContentLoaded', () => {
    console.log('Validating mockups...');

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
    
    // Initialize iframe handling
    handleIframes();
}); 
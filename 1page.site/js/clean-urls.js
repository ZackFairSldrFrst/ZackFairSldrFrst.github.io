// Function to remove .html from URLs
document.addEventListener('DOMContentLoaded', function() {
    // 1. Fix all internal links to remove .html extension
    document.querySelectorAll('a').forEach(function(link) {
        let href = link.getAttribute('href');
        
        // Only process internal links with .html extension
        if (href && href.indexOf('.html') > -1 && !href.startsWith('http') && !href.startsWith('//')) {
            // Remove the .html extension
            link.setAttribute('href', href.replace('.html', ''));
        }
    });
    
    // 2. Redirect if the current URL has .html
    if (window.location.pathname.endsWith('.html')) {
        let newPath = window.location.pathname.replace('.html', '');
        // Use history API to change URL without reload if possible
        if (history && history.replaceState) {
            history.replaceState(null, document.title, newPath);
        } else {
            // Fallback to redirect
            window.location.href = newPath;
        }
    }
}); 
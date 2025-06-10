document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    const testLinks = document.querySelectorAll('.test-link');

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        testLinks.forEach(link => {
            const testName = link.querySelector('h3').textContent.toLowerCase();
            const testDescription = link.querySelector('p').textContent.toLowerCase();
            const testItem = link.closest('.test-item');
            
            if (testName.includes(searchTerm) || testDescription.includes(searchTerm)) {
                testItem.style.display = 'block';
            } else {
                testItem.style.display = 'none';
            }
        });
    });

    // Add hover effect to category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add smooth scrolling for anchor links
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

    // Add loading animation to test links
    testLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (!this.classList.contains('back-button')) {
                e.preventDefault();
                const href = this.getAttribute('href');
                
                // Add loading state
                this.style.opacity = '0.7';
                this.style.pointerEvents = 'none';
                
                // Simulate loading delay (remove this in production)
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
    });
}); 
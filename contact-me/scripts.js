document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    // Scroll Animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.section');
        elements.forEach(element => {
            const position = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (position < windowHeight) {
                element.classList.add('fade-in');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial call to handle already visible elements
});

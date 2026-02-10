/**
 * Homepage Autoscroll
 */
const scrollContainer = document.querySelector('.scroll-container');
if (scrollContainer) {
    let scrollInterval;
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    const startAutoscroll = () => {
        scrollInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            scrollContainer.scrollTo({
                top: currentSlide * window.innerHeight,
                behavior: 'smooth'
            });
        }, 5000); // Change slide every 5 seconds
    };

    const stopAutoscroll = () => {
        clearInterval(scrollInterval);
    };

    startAutoscroll();

    // Pause on user interaction
    scrollContainer.addEventListener('touchstart', stopAutoscroll);
    scrollContainer.addEventListener('wheel', stopAutoscroll);
}

/**
 * Header Scroll Effect
 */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

/**
 * Active Link Highlighting
 */
const navLinks = document.querySelectorAll('.nav-menu a');
const currentPath = window.location.pathname.split('/').pop() || 'index.html';

navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
    }
});

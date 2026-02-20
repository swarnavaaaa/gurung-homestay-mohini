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

/**
 * Image Carousel Autoscroll
 */
const carousels = document.querySelectorAll('.carousel-container');

carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const dots = carousel.querySelectorAll('.dot');
    let slideIndex = 0;
    const totalSlides = dots.length;

    const updateCarousel = (index) => {
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
    };

    const nextSlide = () => {
        slideIndex = (slideIndex + 1) % totalSlides;
        updateCarousel(slideIndex);
    };

    let carouselInterval = setInterval(nextSlide, 2000); // 2 seconds interval

    // Manual control via dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(carouselInterval);
            slideIndex = index;
            updateCarousel(slideIndex);
            carouselInterval = setInterval(nextSlide, 2000);
        });
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', () => clearInterval(carouselInterval));
    carousel.addEventListener('mouseleave', () => carouselInterval = setInterval(nextSlide, 2000));
});


// Room Image Carousel - Reusable Function
function initRoomCarousel(carouselId, imageElementId, images) {
    const container = document.getElementById(carouselId);
    if (!container) return; // Exit if element doesn't exist

    const imageElement = document.getElementById(imageElementId);
    if (!imageElement) return;

    // Scope dots to this specific carousel container
    const dots = container.querySelectorAll('.carousel-dot');

    let currentIndex = 0;
    let interval;

    // Set initial image
    if (images.length > 0) {
        imageElement.src = images[0];
    }

    const updateSlide = (index) => {
        imageElement.src = images[index];

        if (dots.length > 0) {
            dots.forEach(d => d.classList.remove('active'));
            if (dots[index]) dots[index].classList.add('active');
        }
    };

    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % images.length;
        updateSlide(currentIndex);
    };

    // Auto Scroll
    interval = setInterval(nextSlide, 3000);

    // Manual Navigation
    if (dots.length > 0) {
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                clearInterval(interval);
                currentIndex = idx;
                updateSlide(currentIndex);
                interval = setInterval(nextSlide, 3000); // Restart timer
            });
        });
    }
}

// Initialize Scenic Outlook Rooms Carousel
initRoomCarousel('roomCarousel', 'carouselImage', [
    'assets/out%201.jpeg',
    'assets/out%202.jpeg',
    'assets/out%203.jpeg',
    'assets/out%204.jpeg',
    'assets/out%205.jpeg'
]);

// Initialize Inward Facing Rooms Carousel
initRoomCarousel('inwardCarousel', 'inwardImage', [
    'assets/Indoor%201.jpeg',
    'assets/Indoor%202.jpeg'
]);

// Initialize Nature Walks Carousel
initRoomCarousel('natureCarousel', 'natureImage', [
    'assets/nature%20walk%201.jpeg',
    'assets/nature%20walk%202.jpeg'
]);

// Initialize Tea Garden Carousel
initRoomCarousel('teaCarousel', 'teaImage', [
    'assets/tea%20garden%201.jpeg',
    'assets/tea%20garden%202.jpeg'
]);

// Initialize Sunrise Carousel
initRoomCarousel('sunriseCarousel', 'sunriseImage', [
    'assets/sunrise%201.jpeg',
    'assets/sunrise%202.jpeg'
]);

// Initialize Bonfire Carousel
initRoomCarousel('bonfireCarousel', 'bonfireImage', [
    'assets/experiences_1.jpg',
    'assets/experiences_2.jpg'
]);

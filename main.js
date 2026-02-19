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


// Room Image Carousel
const roomCarousel = document.getElementById('roomCarousel');
const carouselImage = document.getElementById('carouselImage');
const roomDots = document.querySelectorAll('.carousel-dot');

const roomImages = [
    'assets/out%201.jpeg',
    'assets/out%202.jpeg',
    'assets/out%203.jpeg',
    'assets/out%204.jpeg',
    'assets/out%205.jpeg'
];

let roomIndex = 0;
let roomInterval;

// Initialize
if (roomCarousel && carouselImage) {
    // Set initial image (already in HTML, but good for consistency)
    carouselImage.src = roomImages[0];

    function updateRoomCarousel(index) {
        // Update Image Source
        carouselImage.src = roomImages[index];

        // Update Dots
        if (roomDots && roomDots.length > 0) {
            roomDots.forEach(dot => dot.classList.remove('active'));
            if (roomDots[index]) {
                roomDots[index].classList.add('active');
            }
        }
    }

    function nextRoomSlide() {
        roomIndex = (roomIndex + 1) % roomImages.length;
        updateRoomCarousel(roomIndex);
    }

    // Auto Scroll every 3 seconds
    roomInterval = setInterval(nextRoomSlide, 3000);

    // Manual Click
    if (roomDots) {
        roomDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(roomInterval);
                roomIndex = index;
                updateRoomCarousel(roomIndex);
                roomInterval = setInterval(nextRoomSlide, 3000); // Restart timer
            });
        });
    }
}

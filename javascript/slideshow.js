/**
 * Slideshow background script
 * Creates a slideshow effect for the background images
 */

// Array of artwork URLs for slideshow
const slideshowImages = [
    'media/columttoreart.png',
    'media/contest_entry.png',
    'media/nemia_poster.png',
    'media/valeria.png',
    'media/valeria_icon.png',
    'media/gang_lineart.png'
];

// Current slide index
let currentSlide = 0;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize slideshow
    initSlideshow();
});

/**
 * Initialize the slideshow background
 */
function initSlideshow() {
    const slideshowContainer = document.getElementById('slideshow-container');
    
    if (!slideshowContainer) {
        console.error('Slideshow container not found');
        return;
    }
    
    // Create image elements for each slide
    slideshowImages.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Background artwork';
        img.className = 'slideshow-image';
        
        // Set first image as active
        if (index === 0) {
            img.classList.add('active');
        }
        
        slideshowContainer.appendChild(img);
    });
    
    // Start slideshow rotation
    setInterval(nextSlide, 7000);
}

/**
 * Transition to the next slide
 */
function nextSlide() {
    const slides = document.querySelectorAll('.slideshow-image');
    
    if (slides.length === 0) {
        return;
    }
    
    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');
    
    // Calculate next slide index
    currentSlide = (currentSlide + 1) % slides.length;
    
    // Add active class to next slide
    slides[currentSlide].classList.add('active');
}

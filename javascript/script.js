/**
 * Main JavaScript file for Art Portfolio Website
 * Handles page transitions, animations, and general functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize page
    initPage();

    // Setup navigation links with paint drop effect
    setupNavigation();
    
        // Make work images clickable to open lightbox
    setupWorkImageClicks();
    
});


/**
 * Initialize page elements and animations
 */
function initPage() {
    // Add fade-in animation to main content
    const main = document.querySelector('main');
    if (main) {
        setTimeout(() => {
            main.style.opacity = '1';
        }, 100);
    }

    // Initialize filter buttons on Works page
    initWorkFilters();
}

/**
 * Set up navigation links with paint drop effect
 */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        // Highlight active page link
        if (window.location.pathname === link.getAttribute('href')) {
            link.parentElement.classList.add('active');
        }
        
        // Add click event for all navigation links
        link.addEventListener('click', function(e) {
            // Don't handle if it's the active page
            if (this.parentElement.classList.contains('active')) {
                return;
            }
            
            // Get coordinates for the paint drop animation
            const rect = this.getBoundingClientRect();
            const x = (rect.left + rect.right) / 2;
            const y = (rect.top + rect.bottom) / 2;
            
              // Get the type of navigation (used for paint effect style)
            const navType = this.getAttribute('data-nav');
            
            // Trigger paint drop animation
            createPaintDrop(x, y, navType);
            
            // Prevent default link behavior
            e.preventDefault();
            
            // Store the href for navigation after animation
            const href = this.getAttribute('href');
            
            // Save audio state before navigation (if audio module exists)
if (typeof saveAudioState === 'function') {
    saveAudioState();
}

// First do paint drop animation

            // Navigate after animation completes
            setTimeout(() => {
                // Then trigger page transition animation
                animatePageExit(href);
            }, 500);
        });
    });
}

/**
 * Initialize work filter functionality on the Works page
 */
function initWorkFilters() {
    const filterButtons = document.querySelectorAll('.filter-btns .btn');
    const workItems = document.querySelectorAll('.work-item');
    
    if (filterButtons.length === 0 || workItems.length === 0) {
        return; // Not on the works page
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Get filter category
            const filter = this.getAttribute('data-filter');
            
            // Filter work items
            workItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * Create a smooth scroll effect for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

 /**
 * Setup work image clicks for lightbox
 */
function setupWorkImageClicks() {
    const workImages = document.querySelectorAll('.work-image');
    
    workImages.forEach(image => {
        image.addEventListener('click', function() {
            // Get the background image URL
            const style = window.getComputedStyle(this);
            const bgImage = style.backgroundImage;
            
            // Extract the URL from the background-image
            if (bgImage && bgImage !== 'none') {
                const imageUrl = bgImage.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
                
                // Open the lightbox with this image
                if (typeof openLightbox === 'function') {
                    openLightbox(imageUrl);
                }
            }
        });
        
        // Add a cursor image class for hover state
        image.addEventListener('mouseenter', function() {
            if (document.querySelector('.cursor-ring')) {
                document.querySelector('.cursor-ring').classList.add('cursor-image');
            }
        });
        
        image.addEventListener('mouseleave', function() {
            if (document.querySelector('.cursor-ring')) {
                document.querySelector('.cursor-ring').classList.remove('cursor-image');
            }
        });
    });
}
/**

/**
 * Handle mobile navigation toggle
 */
const navbarToggler = document.querySelector('.navbar-toggler')

if (navbarToggler) {
    navbarToggler.addEventListener('click', function() {
        // Create a paint drop effect when mobile menu is toggled
        const rect = this.getBoundingClientRect();
        const x = (rect.left + rect.right) / 2;
        const y = (rect.top + rect.bottom) / 2;
        createPaintDrop(x, y, 'menu');
    });
}

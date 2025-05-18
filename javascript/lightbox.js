/**
 * Lightbox functionality for artwork
 * Opens a full-screen view of artwork when clicked
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize lightbox
  initLightbox();
});

/**
 * Initialize lightbox functionality for artwork images
 */
function initLightbox() {
  // Create lightbox container if it doesn't exist
  if (!document.getElementById('lightbox-container')) {
    createLightboxElements();
  }
  
  // Add click handlers to all work images
  const workImages = document.querySelectorAll('.work-image');
  workImages.forEach(image => {
    image.addEventListener('click', function() {
      // Get the background image URL
      const imageUrl = getBackgroundImageUrl(this);
      if (imageUrl) {
        openLightbox(imageUrl);
      }
    });
  });
}

/**
 * Create the DOM elements needed for the lightbox
 */
function createLightboxElements() {
  // Create main container
  const lightboxContainer = document.createElement('div');
  lightboxContainer.id = 'lightbox-container';
  lightboxContainer.className = 'lightbox-container';
  
  // Create image element
  const lightboxImage = document.createElement('img');
  lightboxImage.id = 'lightbox-image';
  lightboxImage.className = 'lightbox-image';
  
  // Create close button
  const closeButton = document.createElement('button');
  closeButton.className = 'lightbox-close';
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', closeLightbox);
  
  // Add elements to the DOM
  lightboxContainer.appendChild(lightboxImage);
  lightboxContainer.appendChild(closeButton);
  document.body.appendChild(lightboxContainer);
  
  // Close lightbox when clicking outside the image
  lightboxContainer.addEventListener('click', function(e) {
    if (e.target === lightboxContainer) {
      closeLightbox();
    }
  });
  
  // Handle keydown events (ESC to close)
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });
}

/**
 * Open the lightbox with the specified image
 * @param {string} imageUrl - URL of the image to display
 */
function openLightbox(imageUrl) {
  const lightbox = document.getElementById('lightbox-container');
  const image = document.getElementById('lightbox-image');
  
  // Set the image source
  image.src = imageUrl;
  
  // Show the lightbox with a fade-in animation
  lightbox.style.display = 'flex';
  setTimeout(() => {
    lightbox.style.opacity = '1';
  }, 10);
  
  // Disable page scrolling
  document.body.style.overflow = 'hidden';
}

/**
 * Close the lightbox
 */
function closeLightbox() {
  const lightbox = document.getElementById('lightbox-container');
  
  // Fade out the lightbox
  lightbox.style.opacity = '0';
  
  // Wait for the animation to finish before hiding
  setTimeout(() => {
    lightbox.style.display = 'none';
  }, 300);
  
  // Re-enable page scrolling
  document.body.style.overflow = '';
}

/**
 * Extract the URL from a background-image style
 * @param {Element} element - Element with background-image
 * @return {string} The URL of the background image
 */
function getBackgroundImageUrl(element) {
  // Get the computed background-image
  const style = window.getComputedStyle(element);
  const bgImage = style.backgroundImage;
  
  // Extract the URL from the background-image
  if (bgImage && bgImage !== 'none') {
    // Remove url() and quotes from the string
    return bgImage.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
  }
  
  return null;
}
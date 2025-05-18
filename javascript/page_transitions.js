/**
 * Page transition animations
 * Creates smooth transitions between pages
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the page transition system
  initPageTransitions();
});

/**
 * Initialize the page transition system
 */
function initPageTransitions() {
  // Create transition overlay if it doesn't exist
  if (!document.getElementById('page-transition-overlay')) {
    createTransitionElements();
  }
  
  // Add entrance animation to the page
  animatePageEntrance();
}

/**
 * Create the DOM elements needed for transitions
 */
function createTransitionElements() {
  // Create overlay for page transitions
  const overlay = document.createElement('div');
  overlay.id = 'page-transition-overlay';
  overlay.className = 'page-transition-overlay';
  
  // Add elements to the DOM
  document.body.appendChild(overlay);
}

/**
 * Animate the entrance of the current page
 */
function animatePageEntrance() {
  // Get the overlay
  const overlay = document.getElementById('page-transition-overlay');
  if (!overlay) return;
  
  // Add the active class to trigger the animation
  overlay.classList.add('active');
  
  // Remove the active class after the animation
  setTimeout(() => {
    overlay.classList.remove('active');
  }, 1000);
  
  // Animate the main content in
  const main = document.querySelector('main');
  if (main) {
    main.style.opacity = '0';
    main.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      main.style.opacity = '1';
      main.style.transform = 'translateY(0)';
    }, 300);
  }
}

/**
 * Trigger an exit animation, then navigate to the specified URL
 * @param {string} url - The URL to navigate to
 */
function animatePageExit(url) {
  // Get the overlay
  const overlay = document.getElementById('page-transition-overlay');
  if (!overlay) {
    window.location.href = url;
    return;
  }
  
  // Animate the main content out
  const main = document.querySelector('main');
  if (main) {
    main.style.opacity = '0';
    main.style.transform = 'translateY(-20px)';
  }
  
  // Add the active class to trigger the animation
  overlay.classList.add('reverse', 'active');
  
  // Navigate after the animation
  setTimeout(() => {
    window.location.href = url;
  }, 500);
}
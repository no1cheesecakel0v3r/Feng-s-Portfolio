/**
 * Custom paintbrush cursor for Art Portfolio Website
 * Creates a custom cursor that follows the mouse with paintbrush effects
 */

let cursorDot;
let cursorRing;
let cursorBristles = [];
const numBristles = 6; // Number of bristles to create
let mouseX = 0;
let mouseY = 0;
let prevMouseX = 0;
let prevMouseY = 0;
let cursorHidden = false;
let cursorTimeout;
const bristleColors = ['#333', '#555', '#777', '#999', '#bbb'];

document.addEventListener('DOMContentLoaded', function() {
    // Initialize custom cursor
    initCustomCursor();
    
    // Setup event listeners
    setupCursorEvents();
    
    // Start animation loop
    animateCursor();
});

/**
 * Initialize the custom cursor elements
 */
function initCustomCursor() {
    // Create cursor elements if they don't exist
    if (!document.querySelector('.cursor-dot')) {
        createCursorElements();
    }
    
    // Store references to cursor elements
    cursorDot = document.querySelector('.cursor-dot');
    cursorRing = document.querySelector('.cursor-ring');
    cursorBristles = document.querySelectorAll('.cursor-bristle');
    
    // Initial position off-screen
    updateCursorPosition(-100, -100);
    
    // Hide system cursor on specific elements
    applyCursorStyles();
}

/**
 * Create cursor DOM elements
 */
function createCursorElements() {
    // Create container for all cursor elements
    const cursorContainer = document.createElement('div');
    cursorContainer.className = 'cursor-container';
    
    // Create dot (center of cursor)
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    
    // Create ring (outer part of cursor)
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    
    // Add elements to container
    cursorContainer.appendChild(ring);
    
    // Create bristle elements
    for (let i = 0; i < numBristles; i++) {
        const bristle = document.createElement('div');
        bristle.className = 'cursor-bristle';
        bristle.style.width = '2px';
        bristle.style.height = '15px';
        bristle.style.backgroundColor = bristleColors[i % bristleColors.length];
        
        // Position the bristles in a circular pattern
        const angle = (i / numBristles) * Math.PI * 2;
        const x = Math.cos(angle) * 8;
        const y = Math.sin(angle) * 8;
        bristle.style.transform = `translate(${x}px, ${y}px) rotate(${angle}rad)`;
        
        ring.appendChild(bristle);
    }
    
    // Add dot on top of everything
    cursorContainer.appendChild(dot);
    
    // Add the cursor to the DOM
    document.body.appendChild(cursorContainer);
}

/**
 * Setup mouse event listeners for cursor
 */
function setupCursorEvents() {
    // Track mouse position
    document.addEventListener('mousemove', handleMouseMove);
    
    // Track when mouse leaves/enters the window
    document.addEventListener('mouseenter', showCursor);
    document.addEventListener('mouseleave', hideCursor);
    
    // Track mouse clicks
    document.addEventListener('mousedown', activateCursor);
    document.addEventListener('mouseup', deactivateCursor);
    
    // Hide cursor after inactivity
    document.addEventListener('mousemove', resetCursorTimeout);
    
    // Setup element-specific cursor styles
    setupElementInteractions();
    
    // Handle touch devices - hide custom cursor
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.querySelectorAll('.cursor-dot, .cursor-ring').forEach(el => {
            el.style.display = 'none';
        });
    }
}

/**
 * Reset cursor timeout for hiding after inactivity
 */
function resetCursorTimeout() {
    // Clear existing timeout
    if (cursorTimeout) {
        clearTimeout(cursorTimeout);
    }
    
    // Show cursor if it was hidden
    if (cursorHidden) {
        showCursor();
    }
    
    // Set new timeout
    cursorTimeout = setTimeout(hideCursorTemporarily, 5000);
}

/**
 * Hide cursor temporarily due to inactivity
 */
function hideCursorTemporarily() {
    document.body.classList.add('cursor-inactive');
    cursorHidden = true;
    
    if (cursorRing) {
        cursorRing.classList.add('cursor-hidden');
    }
}

/**
 * Show cursor after it was temporarily hidden
 */
function showCursor() {
    document.body.classList.remove('cursor-inactive');
    cursorHidden = false;
    
    if (cursorRing) {
        cursorRing.classList.remove('cursor-hidden');
    }
}

/**
 * Hide cursor when mouse leaves window
 */
function hideCursor() {
    if (cursorDot && cursorRing) {
        cursorDot.style.opacity = '0';
        cursorRing.style.opacity = '0';
    }
}

/**
 * Handle mouse movement to update cursor position
 */
function handleMouseMove(e) {
    // Store previous position for trail effect
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    
    // Update current position
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Show cursor if it was hidden
    if (cursorDot && cursorRing) {
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
    }
}

/**
 * Update cursor visual position
 */
function updateCursorPosition(x, y) {
    if (cursorDot && cursorRing) {
        // Update dot position (centered)
        cursorDot.style.transform = `translate(${x}px, ${y}px)`;
        
        // Update ring position (centered)
        const ringX = x - (parseInt(getComputedStyle(cursorRing).width) / 2);
        const ringY = y - (parseInt(getComputedStyle(cursorRing).height) / 2);
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
        
        // Update bristle positions with some lag and randomness
        cursorBristles.forEach((bristle, index) => {
            const delay = index * 0.02;
            const randomX = (Math.random() - 0.5) * 2;
            const randomY = (Math.random() - 0.5) * 2;
            
            // Calculate movement direction
            const dirX = mouseX - prevMouseX;
            const dirY = mouseY - prevMouseY;
            
            // Apply a slight bend in the direction of movement
            const bendFactor = Math.min(Math.sqrt(dirX * dirX + dirY * dirY) * 0.1, 3);
            const bendX = dirX * bendFactor;
            const bendY = dirY * bendFactor;
            
            // Get the original rotation and position
            const angle = (index / numBristles) * Math.PI * 2;
            const baseX = Math.cos(angle) * 8;
            const baseY = Math.sin(angle) * 8;
            
            // Apply the transformation with bend
            bristle.style.transform = `translate(${baseX + randomX + bendX}px, ${baseY + randomY + bendY}px) rotate(${angle}rad)`;
        });
    }
}

/**
 * Activate cursor (on mouse down)
 */
function activateCursor() {
    if (cursorDot && cursorRing) {
        cursorDot.classList.add('cursor-active');
        cursorRing.classList.add('cursor-active');
    }
}

/**
 * Deactivate cursor (on mouse up)
 */
function deactivateCursor() {
    if (cursorDot && cursorRing) {
        cursorDot.classList.remove('cursor-active');
        cursorRing.classList.remove('cursor-active');
    }
}

/**
 * Setup element-specific cursor interactions
 */
function setupElementInteractions() {
    // Buttons and .btn elements
    setupElementType('button, .btn', 'cursor-button');
    
    // Links
    setupElementType('a, .nav-link', 'cursor-link');
    
    // Images and work items
    setupElementType('.work-image, img', 'cursor-image');
    
    // Paint related elements
    setupElementType('.paint-drop, #paint-canvas', 'cursor-paint');
    
    // Form inputs - hide custom cursor
    document.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('focus', () => {
            cursorRing.classList.add('cursor-hidden');
        });
        
        el.addEventListener('blur', () => {
            cursorRing.classList.remove('cursor-hidden');
        });
    });
}

/**
 * Helper to setup element type interactions
 */
function setupElementType(selector, className) {
    document.querySelectorAll(selector).forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorRing.classList.add(className);
        });
        
        el.addEventListener('mouseleave', () => {
            cursorRing.classList.remove(className);
        });
    });
}

/**
 * Animate the cursor with smooth movement
 */
function animateCursor() {
    // Smoothly move the cursor to the mouse position
    updateCursorPosition(mouseX, mouseY);
    
    // Continue animation
    requestAnimationFrame(animateCursor);
}

/**
 * Apply cursor styles to hide default cursor
 */
function applyCursorStyles() {
    // Check if the cursor stylesheet is already loaded
    if (!document.querySelector('link[href*="cursor.css"]')) {
        // Create a link to the cursor stylesheet
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = '/static/css/cursor.css';
        
        // Add to document head
        document.head.appendChild(linkElement);
    }
}
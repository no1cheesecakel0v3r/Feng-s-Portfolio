/**
 * Paint drop animation effect for navigation
 * Creates a splash effect when navigating between pages
 */

// Canvas context for paint animations
let paintCtx;
// Paint drops array
let paintDrops = [];
// Animation frame ID
let animationId;
// Paint colors (grayscale palette)
const paintColors = [
    '#370808',
    '#8B3C46',
    '#D97E8A',
    '#E7C0BC',
    '#bbbbbb'
];

// Paint drop types with different visual styles
const paintDropTypes = {
    'home': { splatterCount: 10, spread: 1.2, growSpeed: 1.2 },
    'works': { splatterCount: 12, spread: 1.5, growSpeed: 1.0 },
    'experience': { splatterCount: 8, spread: 1.0, growSpeed: 1.3 },
    'about': { splatterCount: 15, spread: 0.8, growSpeed: 1.4 },
    'menu': { splatterCount: 5, spread: 1.0, growSpeed: 1.1 },
    'default': { splatterCount: 10, spread: 1.0, growSpeed: 1.0 }
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize paint canvas
    initPaintCanvas();
});

/**
 * Initialize the paint canvas for animation effects
 */
function initPaintCanvas() {
    const canvas = document.getElementById('paint-canvas');
    
    if (!canvas) {
        console.error('Paint canvas not found');
        return;
    }
    
    // Set canvas to full window size
    resizeCanvas(canvas);
    
    // Get 2D context
    paintCtx = canvas.getContext('2d');
    
    // Listen for window resize
    window.addEventListener('resize', () => resizeCanvas(canvas));
}

/**
 * Resize canvas to match window size
 */
function resizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

/**
 * Create a paint drop effect at the specified coordinates
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {string} type - Type of navigation (used to determine effect style)
 */
function createPaintDrop(x, y, type) {
    // Cancel existing animation if any
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    // Clear the canvas
    paintCtx.clearRect(0, 0, paintCtx.canvas.width, paintCtx.canvas.height);
    
    // Reset paint drops array
    paintDrops = [];
    
      // Get paint drop style based on type
  const dropStyle = paintDropTypes[type] || paintDropTypes['default'];
  const splatterCount = dropStyle.splatterCount;
  const spreadFactor = dropStyle.spread;
  const growSpeedMultiplier = dropStyle.growSpeed;
  
  // Create main paint drop with custom variations based on type
    const mainDrop = {
        x: x,
        y: y,
        radius: 1,
        maxRadius: 200 + (Math.random() * 50 - 25), // Add randomness to max radius
        color: paintColors[Math.floor(Math.random() * paintColors.length)],
        alpha: 0.9,
        growSpeed: 12 * growSpeedMultiplier,
    shape: Math.random() > 0.5 ? 'circle' : 'splat', // Randomly choose shape
    wobble: Math.random() * 3 // Random wobble factor for organic look
    };
    
    // Add main drop to array
    paintDrops.push(mainDrop);
    
// Create smaller splatter drops with variations
for (let i = 0; i < splatterCount; i++) {
    // Calculate angle with some clustering for more natural splatter pattern
        const angleCluster = Math.floor(Math.random() * 4); // 0-3
        const baseAngle = angleCluster * (Math.PI / 2); // Base angles at 0, 90, 180, 270 degrees
        const angleVariation = (Math.random() * 0.8 - 0.4) * Math.PI; // Variation of ±72 degrees
        const angle = baseAngle + angleVariation;
    
        // Distance with some natural clustering
        const distanceMin = 20;
        const distanceMax = 100 * spreadFactor;
        const distance = distanceMin + Math.pow(Math.random(), 1.5) * (distanceMax - distanceMin);
        const dropX = x + Math.cos(angle) * distance;
        const dropY = y + Math.sin(angle) * distance;
        
        // Random values for more organic look
        const sizeVariation = Math.random() * 0.7 + 0.5; // 0.5 to 1.2 variation in size
        const alphaVariation = Math.random() * 0.4 + 0.6; // 0.6 to 1.0 variation in opacity

        const drop = {
            x: dropX,
            y: dropY,
            radius: 1,
            maxRadius: (20 + Math.random() * 50) * sizeVariation,
            color: paintColors[Math.floor(Math.random() * paintColors.length)],
            alpha: (0.7 + Math.random() * 0.3) * alphaVariation,
    growSpeed: (5 + Math.random() * 8) * growSpeedMultiplier,
    shape: Math.random() > 0.3 ? 'circle' : 'splat', // 70% circles, 30% splats
    wobble: Math.random() * 5, // Random wobble factor
    rotation: Math.random() * Math.PI * 2 // Random rotation for non-circular shapes
        };
        
        paintDrops.push(drop);
        
        
        // Sometimes add smaller satellite drops
        if (Math.random() > 0.7) {
            const satelliteDistance = distance * 0.3;
            const satelliteAngle = angle + (Math.random() * 0.5 - 0.25) * Math.PI;
            const satelliteX = x + Math.cos(satelliteAngle) * (distance + satelliteDistance);
            const satelliteY = y + Math.sin(satelliteAngle) * (distance + satelliteDistance);
            
            const satelliteDrop = {
                x: satelliteX,
                y: satelliteY,
                radius: 1,
                maxRadius: drop.maxRadius * 0.4,
                color: drop.color,
                alpha: drop.alpha * 0.8,
                growSpeed: drop.growSpeed * 1.2,
                shape: 'circle', // Satellites are always circles
                wobble: drop.wobble * 0.5
            };
            
            paintDrops.push(satelliteDrop);
        }
    }
    
    // Start animation
    animatePaintDrops();
}

/**
 * Animate paint drops expanding and fading
 */
function animatePaintDrops() {
    // Clear canvas
    paintCtx.clearRect(0, 0, paintCtx.canvas.width, paintCtx.canvas.height);
    
    // Flag to check if animation should continue
    let continueAnimation = false;
    
    // Draw and update each paint drop
    paintDrops.forEach(drop => {
        // Only continue if the drop is still visible
        if (drop.radius < drop.maxRadius || drop.alpha > 0.05) {
            continueAnimation = true;
            
            // Save context for transformations
            paintCtx.save();
            
            // Draw the drop based on its shape
            paintCtx.globalAlpha = drop.alpha;
            paintCtx.fillStyle = drop.color;
                     
            if (drop.shape === 'circle' || !drop.shape) {
                // Simple circle drop
                drawCircleDrop(drop);
            } else if (drop.shape === 'splat') {
                // More complex splatter shape
                drawSplatDrop(drop);
            }
            
            // Restore context
            paintCtx.restore();
            // Update drop properties
            if (drop.radius < drop.maxRadius) {
                drop.radius += drop.growSpeed;
            } else {
                drop.alpha *= 0.95; // Fade out
            }
        }
    });
    
    // Continue animation if needed
    if (continueAnimation) {
        animationId = requestAnimationFrame(animatePaintDrops);
    } else {
        // Clear the canvas when animation is complete
        paintCtx.clearRect(0, 0, paintCtx.canvas.width, paintCtx.canvas.height);
    }
}


/**
 * Draw a circular paint drop
 * @param {Object} drop - The paint drop to draw
 */
function drawCircleDrop(drop) {
    // Add some wobble to make it more organic
    const wobbleX = Math.sin(Date.now() * 0.01) * drop.wobble;
    const wobbleY = Math.cos(Date.now() * 0.01) * drop.wobble;
    
    paintCtx.beginPath();
    paintCtx.arc(drop.x + wobbleX, drop.y + wobbleY, drop.radius, 0, Math.PI * 2);
    paintCtx.fill();
}
/**
 * Draw a splatter-shaped paint drop
 * @param {Object} drop - The paint drop to draw
 */
function drawSplatDrop(drop) {
    const points = 8; // Number of points in the splat
    const centerX = drop.x;
    const centerY = drop.y;
    const maxRadius = drop.radius;
    const minRadius = maxRadius * 0.6;
    const rotation = drop.rotation || 0;
    
    paintCtx.beginPath();
    
    // Create a wobbly blob shape
    for (let i = 0; i <= points; i++) {
        // Calculate angle with rotation
        const angle = (i / points) * Math.PI * 2 + rotation;
        
        // Calculate radius with some randomness for each point
        // We use the point index to keep the shape consistent during animation
        const pointVariation = Math.sin(i * 1000) * 0.3 + 0.7; // 0.4 to 1.0
        const radius = minRadius + (maxRadius - minRadius) * pointVariation;
        
        // Add some time-based wobble
        const wobbleAmount = drop.wobble * (minRadius / 50);
        const timeWobble = Math.sin(Date.now() * 0.003 + i) * wobbleAmount;
        const finalRadius = radius + timeWobble;
        
        // Calculate coordinates
        const x = centerX + Math.cos(angle) * finalRadius;
        const y = centerY + Math.sin(angle) * finalRadius;
        
        // First point moves to, others draw lines to
        if (i === 0) {
            paintCtx.moveTo(x, y);
        } else {
            // Use quadratic curves for smoother shape
            const prevAngle = ((i - 1) / points) * Math.PI * 2 + rotation;
            const midAngle = (prevAngle + angle) / 2;
            const ctrlX = centerX + Math.cos(midAngle) * finalRadius * 1.2;
            const ctrlY = centerY + Math.sin(midAngle) * finalRadius * 1.2;
            
            paintCtx.quadraticCurveTo(ctrlX, ctrlY, x, y);
        }
    }
    
    paintCtx.closePath();
    paintCtx.fill();
}

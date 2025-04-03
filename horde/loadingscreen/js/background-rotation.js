// Use the image array from background.js instead of defining our own
let currentIndex = 0;
// Don't define slideDuration here - we'll get it from background.js
let backgroundsInitialized = false;

// Setup background container structure
function setupBackgrounds() {
    // Only initialize once
    if (backgroundsInitialized) return;
    backgroundsInitialized = true;
    
    // Wait for background.js to load the images array
    if (typeof possibleBackgrounds === 'undefined') {
        console.log('Waiting for background.js to load...');
        setTimeout(setupBackgrounds, 100);
        return;
    }
    
    // Create container for slides
    const backgroundContainer = document.createElement('div');
    backgroundContainer.className = 'background-container';
    document.body.appendChild(backgroundContainer);
    
    // Hide the original .background div (used by legacy version)
    const originalBackground = document.querySelector('.background');
    if (originalBackground) {
        originalBackground.style.display = 'none';
    }
    
    // Create both background slides
    const slide1 = document.createElement('div');
    slide1.className = 'background-slide slide1';
    backgroundContainer.appendChild(slide1);
    
    const slide2 = document.createElement('div');
    slide2.className = 'background-slide slide2';
    backgroundContainer.appendChild(slide2);
    
    // Initialize first slide with image from background.js
    slide1.style.backgroundImage = `url('${possibleBackgrounds[0]}')`;
    slide1.classList.add('active', 'zoom-in');
    
    // Start rotation
    startBackgroundRotation();
}

function startBackgroundRotation() {
    // Find the interval used in background.js
    let rotationInterval = 15000; // Default fallback
    
    // Check if we can find the setInterval call in background.js
    const backgroundJsContent = document.head.querySelector('script[src*="background.js"]');
    if (backgroundJsContent) {
        // The script is loaded, try to extract the interval
        try {
            // We'll use the same interval as background.js uses (15000ms as defined in initBackground)
            rotationInterval = 15000; // This will be the same as in background.js
        } catch (e) {
            console.warn('Failed to extract interval from background.js, using default', e);
        }
    }
    
    // Use the same interval as background.js
    setInterval(rotateBackground, rotationInterval);
}

function rotateBackground() {
    // Get both slides
    const slide1 = document.querySelector('.slide1');
    const slide2 = document.querySelector('.slide2');
    
    // Determine which slide is active and which is next
    const activeSlide = slide1.classList.contains('active') ? slide1 : slide2;
    const nextSlide = activeSlide === slide1 ? slide2 : slide1;
    
    // Calculate next image index using the background.js array
    const nextIndex = (currentIndex + 1) % possibleBackgrounds.length;
    
    // Set up the next slide fully before showing it
    
    // Reset the next slide's animation
    nextSlide.classList.remove('zoom-in');
    
    // Set next slide's image from background.js array
    nextSlide.style.backgroundImage = `url('${possibleBackgrounds[nextIndex]}')`;
    
    // Force a reflow to ensure the animation restarts from the beginning
    void nextSlide.offsetWidth;
    
    // Add back the zoom-in class to start a fresh animation
    nextSlide.classList.add('zoom-in');
    
    // Allow a moment for the animation to be applied before making the slide visible
    setTimeout(() => {
        // Show next slide
        nextSlide.classList.add('active');
        
        // Start fade-out on current slide but DO NOT remove its zoom-in class yet
        // This ensures the zoom animation continues during fade-out
        activeSlide.classList.add('fade-out');
        
        // After the fade transition completes, hide the old slide
        setTimeout(() => {
            // Only remove the active and fade-out classes
            // Keep the zoom-in class to ensure animation continues until slide is hidden
            activeSlide.classList.remove('active', 'fade-out');
            
            // Only after it's fully invisible, reset the animation
            setTimeout(() => {
                activeSlide.classList.remove('zoom-in');
            }, 100);
        }, 3000); // Match the transition duration in CSS
    }, 50);
    
    // Update the current index
    currentIndex = nextIndex;
}

// Preload images for smoother transitions
function preloadImages() {
    // Wait for background.js to load the images array
    if (typeof possibleBackgrounds === 'undefined') {
        setTimeout(preloadImages, 100);
        return;
    }
    
    possibleBackgrounds.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize backgrounds when document is ready
document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    setupBackgrounds();
});

// Fallback for cases where DOMContentLoaded might have already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        preloadImages();
        setupBackgrounds();
    }, 1);
} 
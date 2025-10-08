"use strict";

/**
 * Sandbox Loading Screen - Frontend Logic
 * 
 * This file contains Sandbox-specific visual/frontend code.
 * The core GMod backend logic is in /js/loadingscreen-core.js
 */

// Background configuration
var backgroundImages = [
    'images/hallway.jpg',
    'images/paradise.jpg',
    'images/pov.jpg',
    'images/warehouse.jpg'
];

var backgroundInterval = 15000; // 15 seconds
var currentBackgroundIndex = 0;
var backgroundRotationInterval = null;
var backgroundElement = null;

/**
 * Initialize background rotation
 */
function initBackgroundRotation() {
    backgroundElement = document.getElementById('background');
    if (!backgroundElement) return;
    
    // Set initial background
    setBackground(0, true);
    
    // Start rotation
    backgroundRotationInterval = setInterval(function() {
        currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundImages.length;
        setBackground(currentBackgroundIndex, false);
    }, backgroundInterval);
}

/**
 * Set background image
 */
function setBackground(index, immediate) {
    if (!backgroundElement) return;
    
    var imageUrl = backgroundImages[index];
    
    if (immediate) {
        backgroundElement.style.transition = 'none';
        backgroundElement.style.backgroundImage = 'url(' + imageUrl + ')';
        
        setTimeout(function() {
            backgroundElement.style.transition = 'background-image 2s ease-in-out';
        }, 50);
    } else {
        backgroundElement.style.backgroundImage = 'url(' + imageUrl + ')';
    }
}

/**
 * Custom initialization
 */
window.onLoadingScreenInit = function() {
    console.log("Sandbox: Loading screen initialized");
    
    // Initialize background rotation
    initBackgroundRotation();
};

// Cleanup on unload
window.addEventListener('beforeunload', function() {
    if (backgroundRotationInterval) {
        clearInterval(backgroundRotationInterval);
    }
});

var possibleBackgrounds = [
    "/zbox/loadingscreen/images/pov.jpg",
    "/zbox/loadingscreen/images/paradise.jpg",
    "/zbox/loadingscreen/images/warehouse.jpg",
    "/zbox/loadingscreen/images/hallway.jpg"
];
var currentBackground = 0;

function changeBackground() {
    var div = document.querySelector('.background');
    if (!div) return;

    // Legacy browser compatible way to set background
    div.style.backgroundImage = "url('" + possibleBackgrounds[currentBackground] + "')";

    currentBackground = currentBackground + 1;
    if (currentBackground >= possibleBackgrounds.length) {
        currentBackground = 0;
    }
}

// Function to initialize background immediately
function initBackground() {
    // Set first background immediately
    changeBackground();
    // Start the interval for subsequent changes
    setInterval(changeBackground, 15000);
}

// Handle both immediate and DOMContentLoaded scenarios for maximum compatibility
if (document.body) {
    initBackground();
} else {
    // For older browsers, use both methods to ensure it runs
    document.addEventListener("DOMContentLoaded", initBackground);
    // Fallback for very old browsers
    window.setTimeout(initBackground, 100);
} 
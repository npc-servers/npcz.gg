// Initialize as empty array, will be populated from SharedConfig
var possibleBackgrounds = [];
var currentBackground = 0;

function changeBackground() {
    var div = document.querySelector('.background');
    if (!div || possibleBackgrounds.length === 0) return;

    div.style.backgroundImage = "url('" + possibleBackgrounds[currentBackground] + "')";

    currentBackground = currentBackground + 1;
    if (currentBackground >= possibleBackgrounds.length) {
        currentBackground = 0;
    }
}

// Function to initialize background immediately
function initBackground() {
    // Get backgrounds from SharedConfig if available
    if (typeof SharedConfig !== 'undefined' && 
        SharedConfig.assets && 
        SharedConfig.assets.backgrounds) {
        possibleBackgrounds = SharedConfig.assets.backgrounds;
    }
    
    // Set first background immediately
    changeBackground();
    // Start the interval for subsequent changes
    setInterval(changeBackground, 15000);
}

if (document.body) {
    initBackground();
} else {
    document.addEventListener("DOMContentLoaded", initBackground);
    window.setTimeout(initBackground, 100);
} 
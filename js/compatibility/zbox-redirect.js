// Browser detection and routing logic for Zbox loadingscreen
function detectBrowserAndRouteZbox() {
    // Get browser information
    const ua = navigator.userAgent;
    const chromeMatch = ua.match(/Chrome\/(\d+)/);
    
    // Check if it's Chrome and version is below 18
    if (chromeMatch && parseInt(chromeMatch[1]) < 18) {
        window.location.href = '/zbox/loadingscreen/legacy-index.html';
    }
    
    // For all other browsers and modern Chrome, stay on current page
    // No redirect needed as they're already on index.html
}

// Execute when DOM is loaded
document.addEventListener('DOMContentLoaded', detectBrowserAndRouteZbox); 
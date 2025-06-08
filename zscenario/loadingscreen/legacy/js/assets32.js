// Legacy-specific version of the assets.js script for IE8+ compatibility
// This applies icon paths directly to elements instead of using CSS variables

// Function to directly set icon backgrounds for specific elements
function updateLegacyAssets() {
    // Make sure SharedConfig is available
    if (typeof SharedConfig === 'undefined' || !SharedConfig.assets || !SharedConfig.assets.icons) {
        return; // No config available, use default paths
    }
    
    // Get icon elements by class name
    var changesHeader = document.getElementsByClassName('changes-header')[0];
    var serversHeader = document.getElementsByClassName('servers-header')[0];
    
    // Apply styles directly if elements exist
    if (changesHeader && SharedConfig.assets.icons.serverUpdates) {
        // Use a helper element to apply the style
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.changes-header:before { background-image: url("' + 
                         SharedConfig.assets.icons.serverUpdates + '") !important; }';
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    
    if (serversHeader && SharedConfig.assets.icons.otherServers) {
        // Use a helper element to apply the style
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.servers-header:before { background-image: url("' + 
                         SharedConfig.assets.icons.otherServers + '") !important; }';
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    
    // Update error icons if needed
    if (SharedConfig.assets.icons.errorIcon) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.server-error .server-box-title:before { background-image: url("' + 
                         SharedConfig.assets.icons.errorIcon + '") !important; }';
        document.getElementsByTagName('head')[0].appendChild(style);
    }
}

// Initialize assets on window load
if (window.attachEvent) {
    // For IE8 and below
    window.attachEvent('onload', function() {
        setTimeout(updateLegacyAssets, 100); // Delay to ensure DOM is ready
    });
} else {
    // For modern browsers
    var existingOnload = window.onload;
    window.onload = function() {
        if (typeof existingOnload === 'function') {
            existingOnload();
        }
        setTimeout(updateLegacyAssets, 100); // Delay to ensure DOM is ready
    };
} 
// Function to update CSS variables with asset paths from SharedConfig
function updateAssetVariables() {
    // Make sure SharedConfig is available
    if (typeof SharedConfig === 'undefined' || !SharedConfig.assets) {
        console.warn('SharedConfig.assets not available. Falling back to default asset paths.');
        return;
    }
    
    // Get the root element to set CSS variables
    const root = document.documentElement;
    
    // Set icon variables
    if (SharedConfig.assets.icons) {
        // Server updates icon
        if (SharedConfig.assets.icons.serverUpdates) {
            root.style.setProperty('--server-updates-icon', `url('${SharedConfig.assets.icons.serverUpdates}')`);
        }
        
        // Other servers icon
        if (SharedConfig.assets.icons.otherServers) {
            root.style.setProperty('--other-servers-icon', `url('${SharedConfig.assets.icons.otherServers}')`);
        }
        
        // Error icon
        if (SharedConfig.assets.icons.errorIcon) {
            root.style.setProperty('--error-icon', `url('${SharedConfig.assets.icons.errorIcon}')`);
        }
        
        // Additional icons can be added here as needed
    }
    
    // If we have background images in SharedConfig, we can also update the background.js file
    if (SharedConfig.assets.backgrounds && Array.isArray(SharedConfig.assets.backgrounds)) {
        // Only override if the global possibleBackgrounds variable exists
        if (typeof window.possibleBackgrounds !== 'undefined') {
            window.possibleBackgrounds = SharedConfig.assets.backgrounds;
        }
    }
}

// Initialize on document load
document.addEventListener('DOMContentLoaded', function() {
    updateAssetVariables();
});

// Also support legacy browsers
if (typeof window !== 'undefined') {
    // If document already loaded, run immediately
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(updateAssetVariables, 1);
    } else {
        // Otherwise wait for window.onload
        var existingOnload = window.onload;
        window.onload = function() {
            if (typeof existingOnload === 'function') {
                existingOnload();
            }
            updateAssetVariables();
        };
    }
} 
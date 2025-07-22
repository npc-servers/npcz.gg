// Shared configuration for both legacy and modern loading screens
const SharedConfig = {
    // UI Configuration
    ui: {
        enableMap: true,
        enableSteamID: false
    },
    
        // Assets Configuration
    assets: {
        // Background images (if needed to centralize)
        backgrounds: [
            "/mapsweepers/loadingscreen/images/pov.jpg",
            "/mapsweepers/loadingscreen/images/paradise.jpg",
            "/mapsweepers/loadingscreen/images/warehouse.jpg",
            "/mapsweepers/loadingscreen/images/hallway.jpg"
        ]
    }


};

// For legacy JavaScript support
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SharedConfig;
} else if (typeof window !== 'undefined') {
    window.SharedConfig = SharedConfig;
} 

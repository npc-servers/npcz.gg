// Initialize tips functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const tipContainer = document.querySelector('.tip-container');
    const tipContent = document.querySelector('.tip-content');
    
    if (!tipContainer || !tipContent || !SharedConfig.ui.enableTips) {
        return;
    }
    
    // Create a shuffled array of tip indices
    let tipIndices = Array.from({ length: SharedConfig.ui.tipMessages.length }, (_, i) => i);
    let currentTipIndex = 0;
    
    // Fisher-Yates shuffle algorithm
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    // Initial shuffle
    shuffleArray(tipIndices);
    
    // Function to update the tip message - no animations, just immediate change
    function updateTip() {
        if (SharedConfig.ui.tipMessages.length === 0) {
            tipContent.textContent = "No tips available";
            return;
        }
        
        // Get the tip using the shuffled index
        tipContent.textContent = SharedConfig.ui.tipMessages[tipIndices[currentTipIndex]];
        
        // Increment index and reshuffle if we've shown all tips
        currentTipIndex++;
        if (currentTipIndex >= tipIndices.length) {
            currentTipIndex = 0;
            shuffleArray(tipIndices); // Reshuffle for next round
        }
    }
    
    // Set first tip immediately
    if (SharedConfig.ui.tipMessages.length > 0) {
        updateTip();
    }
    
    // Start rotation if multiple tips exist
    if (SharedConfig.ui.tipMessages.length > 1) {
        setInterval(updateTip, SharedConfig.ui.tipRotationTime);
    }
}); 
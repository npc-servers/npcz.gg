// Initialize tips functionality when DOM is loaded
if (window.addEventListener) {
    window.addEventListener('load', initTips);
} else if (window.attachEvent) {
    window.attachEvent('onload', initTips);
}

function initTips() {
    var tipContainer = document.getElementsByClassName('tip-container')[0];
    var tipContent = document.getElementsByClassName('tip-content')[0];
    
    if (!tipContainer || !tipContent || !SharedConfig.ui.enableTips) {
        return;
    }
    
    // Create a shuffled array of tip indices
    var tipIndices = [];
    for (var i = 0; i < SharedConfig.ui.tipMessages.length; i++) {
        tipIndices.push(i);
    }
    var currentTipIndex = 0;
    
    // Fisher-Yates shuffle algorithm
    function shuffleArray(array) {
        var j, temp;
        for (var i = array.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
    
    // Initial shuffle
    shuffleArray(tipIndices);
    
    // Function to update the tip message - no animations, just immediate change
    function updateTip() {
        if (SharedConfig.ui.tipMessages.length === 0) {
            tipContent.innerHTML = "No tips available";
            return;
        }
        
        // Get the tip using the shuffled index
        tipContent.innerHTML = SharedConfig.ui.tipMessages[tipIndices[currentTipIndex]];
        
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
} 
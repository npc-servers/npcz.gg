// Landing page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Background image rotation
    const backgroundImages = [
        'assets/images/bg1.jpg',
        'assets/images/bg2.jpg',
        'assets/images/bg3.jpg',
        'assets/images/bg4.jpg'
    ];
    
    let currentBgIndex = 0;
    let isTransitioning = false;
    const landingContainer = document.querySelector('.landing-container');
    
    // Set initial background
    if (landingContainer) {
        // Create a preloader for images to prevent flickering
        const preloadImages = () => {
            backgroundImages.forEach(src => {
                const img = new Image();
                img.src = src;
            });
        };
        
        preloadImages();
        
        // Set initial background
        landingContainer.style.backgroundImage = `url('${backgroundImages[currentBgIndex]}')`;
        
        // Function to change background
        const changeBackground = () => {
            // Prevent multiple transitions at once
            if (isTransitioning) return;
            isTransitioning = true;
            
            // Get next background index
            const nextIndex = (currentBgIndex + 1) % backgroundImages.length;
            
            // Remove any existing transition backgrounds first
            document.querySelectorAll('.landing-background').forEach(bg => {
                bg.remove();
            });
            
            // Create a new div for the next background
            const nextBg = document.createElement('div');
            nextBg.className = 'landing-background';
            nextBg.style.backgroundImage = `url('${backgroundImages[nextIndex]}')`;
            nextBg.style.opacity = '0';
            
            // Add the new background behind the content
            landingContainer.appendChild(nextBg);
            
            // Force a reflow before changing opacity for proper transition
            void nextBg.offsetWidth;
            
            // Fade in the new background
            nextBg.style.opacity = '1';
            
            // After transition completes
            const transitionEndHandler = () => {
                // Update the main container background
                landingContainer.style.backgroundImage = `url('${backgroundImages[nextIndex]}')`;
                
                // Update current index
                currentBgIndex = nextIndex;
                
                // Clean up
                nextBg.remove();
                isTransitioning = false;
                
                // Remove event listener
                nextBg.removeEventListener('transitionend', transitionEndHandler);
            };
            
            // Listen for the transition to complete
            nextBg.addEventListener('transitionend', transitionEndHandler);
        };
        
        // Change background every 8 seconds
        setInterval(changeBackground, 8000);
    }
    
    // Fade in animation for content
    const textContainer = document.querySelector('.text-container');
    if (textContainer) {
        setTimeout(() => {
            textContainer.style.opacity = '1';
        }, 300);
    }

    // Add event listeners to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        // Mouse down event for immediate feedback
        button.addEventListener('mousedown', (e) => {
            // Prevent default action
            e.preventDefault();
            
            // Add button click animation
            button.classList.add('btn-clicked');
        });
        
        // Mouse up event to remove the animation
        button.addEventListener('mouseup', () => {
            setTimeout(() => {
                button.classList.remove('btn-clicked');
            }, 150); // Shorter duration for better responsiveness
        });
        
        // Mouse leave event to handle if user moves cursor away while pressing
        button.addEventListener('mouseleave', () => {
            if (button.classList.contains('btn-clicked')) {
                button.classList.remove('btn-clicked');
            }
        });
        
        // Touch events for mobile
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            button.classList.add('btn-clicked');
        }, { passive: false });
        
        button.addEventListener('touchend', () => {
            setTimeout(() => {
                button.classList.remove('btn-clicked');
            }, 150);
        });
        
        // Click event for navigation/action
        button.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(`Button clicked: ${button.textContent.trim()}`);
            // Here you would typically add navigation logic
        });
    });
    
    // Special handling for the Play Now button
    const playButton = document.querySelector('.btn-primary');
    if (playButton) {
        let clickCount = 0;
        let popupTimeout;
        
        // Click event for Play Now button
        playButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            clickCount++;
            console.log(`Play button clicked: ${clickCount} times`);
            
            // Show popup after 3 clicks
            if (clickCount >= 3) {
                // Remove any existing popup
                const existingPopup = document.querySelector('.popup-message');
                if (existingPopup) {
                    existingPopup.remove();
                }
                
                // Create popup element
                const popup = document.createElement('div');
                popup.className = 'popup-message';
                popup.textContent = 'Please wait...';
                
                // Add to document body instead of button for better positioning
                document.body.appendChild(popup);
                
                // Position popup above the button
                const buttonRect = playButton.getBoundingClientRect();
                popup.style.position = 'fixed';
                popup.style.top = `${buttonRect.top - popup.offsetHeight - 10}px`;
                popup.style.left = `${buttonRect.left + (buttonRect.width / 2) - (popup.offsetWidth / 2)}px`;
                
                // Add active class to show popup with animation
                setTimeout(() => {
                    popup.classList.add('active');
                }, 10);
                
                // Set timeout to remove popup
                clearTimeout(popupTimeout);
                popupTimeout = setTimeout(() => {
                    popup.classList.remove('active');
                    
                    // Remove popup after animation completes
                    setTimeout(() => {
                        popup.remove();
                    }, 300);
                }, 2000);
                
                // Reset click count after showing popup
                if (clickCount >= 5) {
                    clickCount = 0;
                }
            }
        });
    }
}); 
"use strict";

/**
 * ZBox Loading Screen - Frontend Logic
 * 
 * This file contains ZBox-specific visual/frontend code.
 * The core GMod backend logic is in /js/loadingscreen-core.js
 */

/**
 * Custom GMod callback handlers - Update the ZBox UI
 */

// Custom handler for when game details are received
window.onGameDetailsReceived = function(servername, serverurl, mapname, maxplayers, steamid, gamemode) {
    if (!isTest) {
        loadAll();
    }

    document.getElementById("title").innerHTML = servername;
    fadeIn(document.getElementById("title"));

    if (SharedConfig.ui.enableMap) {
        document.getElementById("map").appendChild(document.createTextNode(mapname));
        fadeIn(document.getElementById("map"));
    } else {
        document.getElementById("map").style.display = "none";
    }

    if (SharedConfig.ui.enableSteamID) {
        document.getElementById("steamid").innerHTML = steamid;
    }
    fadeIn(document.getElementById("steamid"));
};

// Custom handler for progress updates
window.onProgressUpdate = function(percentageValue, filesNeeded, filesTotal) {
    setLoad(percentageValue);
};

// Custom handler for status changes
window.onStatusChanged = function(status) {
    var history = document.getElementById("history");
    var newItem = document.createElement("div");
    newItem.className = "history-item";
    newItem.appendChild(document.createTextNode(status));
    history.insertBefore(newItem, history.firstChild);

    var items = document.getElementsByClassName("history-item");
    for (var i = 0; i < items.length; i++) {
        if (i > 10) {
            items[i].parentNode.removeChild(items[i]);
        } else {
            items[i].style.opacity = (1 - i * 0.1).toString();
        }
    }
};

// Custom handler for file downloads
window.onFileDownloading = function(fileName) {
    fileName = fileName.replace("'", "").replace("?", "");
    var history = document.getElementById("history");
    var newItem = document.createElement("div");
    newItem.className = "history-item";
    newItem.appendChild(document.createTextNode(fileName));
    history.insertBefore(newItem, history.firstChild);

    var items = document.getElementsByClassName("history-item");
    for (var i = 0; i < items.length; i++) {
        if (i > 10) {
            items[i].parentNode.removeChild(items[i]);
        } else {
            items[i].style.opacity = (1 - i * 0.1).toString();
        }
    }
};

/**
 * ZBox-specific UI Functions
 */
function loadAll() {
    // Only fade in if not already visible
    var navElement = document.querySelector("nav");
    var mainElement = document.querySelector("main");
    
    if (navElement && navElement.style.opacity != 1) {
        fadeIn(navElement);
    }
    
    if (mainElement && mainElement.style.opacity != 1) {
        fadeIn(mainElement);
    }
}

function setLoad(percentage) {
    document.querySelector(".overhaul").style.left = percentage + "%";
}

var permanent = false;
function announce(message, ispermanent) {
    if (SharedConfig.ui.enableAnnouncements && !permanent) {
        var announcement = document.getElementById("announcement");
        announcement.style.display = "none";
        announcement.innerHTML = message;
        fadeIn(announcement);
    }
    if (ispermanent) {
        permanent = true;
    }
}

function fadeIn(element) {
    if (!element) return;
    
    // Set display first to ensure the element is in the DOM
    element.style.display = "block";
    // Then set opacity for the fade effect
    element.style.opacity = 1;
    
    // Ensure the powered-by element is properly visible when nav is shown
    if (element.tagName === 'NAV') {
        const poweredBy = element.querySelector('.powered-by');
        if (poweredBy) {
            poweredBy.style.display = "flex";
            poweredBy.style.opacity = 1;
        }
    }
}

// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Custom initialization
 */
window.onLoadingScreenInit = function() {
    console.log("ZBox: Loading screen initialized");
    
    // Make nav visible immediately
    var navElement = document.querySelector("nav");
    fadeIn(navElement);
    fadeIn(document.querySelector("main"));

    // print announcement messages every few seconds
    if (
        SharedConfig.ui.announceMessages &&
        SharedConfig.ui.enableAnnouncements &&
        SharedConfig.ui.announcementLength
    ) {
        if (SharedConfig.ui.announceMessages.length > 0) {
            // Create a shuffled copy of the announcements array
            let shuffledAnnouncements = [...SharedConfig.ui.announceMessages];
            shuffleArray(shuffledAnnouncements);
            let i = 0;
            
            // Show first message immediately
            announce(shuffledAnnouncements[i]);
            
            setInterval(function() {
                i++;
                // Reshuffle when we've shown all announcements
                if (i >= shuffledAnnouncements.length) {
                    i = 0;
                    shuffleArray(shuffledAnnouncements);
                }
                announce(shuffledAnnouncements[i]);
            }, SharedConfig.ui.announcementLength);
        }
    }
};

// Add a window resize event listener to update responsive content
window.addEventListener('resize', function() {
    // Check if tabs have been initialized
    if (document.querySelector('.changes-discord-message') || 
        document.querySelector('.more-servers-message')) {
        
        // Store current screen size category
        const currentIsSmallScreen = window.innerWidth <= 1366;
        
        // Timeout to avoid too many updates during resize
        clearTimeout(window.resizeTimeout);
        window.resizeTimeout = setTimeout(function() {
            const newIsSmallScreen = window.innerWidth <= 1366;
            
            // If screen size category has changed, update the UI
            if (currentIsSmallScreen !== newIsSmallScreen) {
                // Update the changes and servers tabs if they exist
                if (typeof updateChangesTab === 'function') {
                    updateChangesTab();
                }
                
                if (typeof updateServersTab === 'function') {
                    updateServersTab();
                }
            }
        }, 250);
    }
});

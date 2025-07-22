"use strict";

var isGmod = false;
var isTest = false;
var totalFiles = 50;
var totalCalled = false;
var percentage = 0;

/**
 * Gmod Called functions
 */
function GameDetails(
    servername,
    serverurl,
    mapname,
    maxplayers,
    steamid,
    gamemode
) {
    isGmod = true;
    if (!isTest) {
        // GMod has connected, we can now show the loading screen properly
    }
}

function SetFilesTotal(total) {
    totalCalled = true;
    totalFiles = total;
    updateStatus("Loading files...", 0);
}

function SetFilesNeeded(needed) {
    if (totalCalled) {
        var calculatedPercentage = 100 - Math.round((needed / totalFiles) * 100);
        percentage = Math.round(Math.max(0, Math.min(100, calculatedPercentage)));
        updateStatus("Loading files...", percentage);
    }
}

var fileCount = 0;
var downloadingFileCalled = false;
function DownloadingFile(filename) {
    // Clean up the filename
    filename = filename.replace("'", "").replace("?", "");
    downloadingFileCalled = true;
    
    // Add to file history
    var history = document.getElementById("fileHistory");
    if (history) {
        var newItem = document.createElement("div");
        newItem.className = "file-item";
        newItem.textContent = filename;
        
        history.insertBefore(newItem, history.firstChild);

        // Update opacity for existing items and remove old ones
        var items = history.querySelectorAll(".file-item");
        for (var i = 0; i < items.length; i++) {
            if (i >= 20) {
                // Remove items beyond the 20th
                items[i].remove();
            } else {
                // Set opacity - newest item has full opacity, older items fade
                items[i].style.opacity = (1 - i * 0.05).toString();
            }
        }
    }
}

var allow_increment = true;
function SetStatusChanged(status) {
    // Add status to history
    var history = document.getElementById("fileHistory");
    if (history) {
        var newItem = document.createElement("div");
        newItem.className = "file-item";
        
        // Check for important status messages that get green boxes (try both exact and contains)
        var isImportantStatus = false;
        if (status === "Workshop Complete" || status.indexOf("Workshop Complete") !== -1) {
            isImportantStatus = true;
        } else if (status === "Client info sent!" || status.indexOf("Client info sent") !== -1) {
            isImportantStatus = true;
        } else if (status === "Starting Lua..." || status.indexOf("Starting Lua") !== -1) {
            isImportantStatus = true;
        }
        
        if (isImportantStatus) {
            var statusBox = document.createElement("span");
            statusBox.className = "status-important";
            statusBox.textContent = status;
            newItem.appendChild(statusBox);
        } else {
            newItem.textContent = status;
            newItem.style.color = "#00ff00"; // Green for regular status messages
        }
        
        history.insertBefore(newItem, history.firstChild);

        // Update opacity and remove old items
        var items = history.querySelectorAll(".file-item");
        for (var i = 0; i < items.length; i++) {
            if (i >= 20) {
                items[i].remove();
            } else {
                items[i].style.opacity = (1 - i * 0.05).toString();
            }
        }
    }

    // Update loading percentage based on status (matching sandbox behavior exactly)
    if (status === "Workshop Complete" || status.indexOf("Workshop Complete") !== -1) {
        allow_increment = false;
        percentage = Math.round(80);
        updateStatus("Workshop Complete", percentage);
    } else if (status === "Client info sent!" || status.indexOf("Client info sent") !== -1) {
        allow_increment = false;
        percentage = Math.round(95);
        updateStatus("Client info sent!", percentage);
    } else if (status === "Starting Lua..." || status.indexOf("Starting Lua") !== -1) {
        allow_increment = false;
        percentage = Math.round(100);
        updateStatus("Ready to play!", percentage);
    } else {
        if (allow_increment) {
            percentage = Math.round(percentage + 1);
        }
        updateStatus(status, percentage);
    }
}

/**
 * Helper Functions
 */
function updateStatus(statusText, percent) {
    var statusElement = document.querySelector(".status-text");
    var percentElement = document.querySelector(".loading-percentage");
    
    if (statusElement) {
        statusElement.textContent = statusText;
    }
    
    if (percentElement) {
        percentElement.textContent = Math.round(percent) + "%";
    }
}

function updateSvgHeight() {
    var fileBox = document.querySelector(".file-box");
    var leftSvg = document.getElementById("leftLineSvg");
    var rightSvg = document.getElementById("rightLineSvg");
    var leftVerticalLine = document.getElementById("verticalLine");
    var rightVerticalLine = document.getElementById("rightVerticalLine");
    
    if (fileBox && leftSvg && leftVerticalLine) {
        var boxHeight = fileBox.offsetHeight;
        var svgHeight = boxHeight;
        
        // Update left SVG height
        leftSvg.style.height = svgHeight + "px";
        leftSvg.setAttribute("viewBox", "0 0 12 " + svgHeight);
        
        // Update the left vertical line path to extend to the new height
        var newPath = "M0 11H1V" + (svgHeight - 5) + "H0V11Z";
        leftVerticalLine.setAttribute("d", newPath);
        
        // Update right SVG height (same process)
        if (rightSvg && rightVerticalLine) {
            rightSvg.style.height = svgHeight + "px";
            rightSvg.setAttribute("viewBox", "0 0 12 " + svgHeight);
            rightVerticalLine.setAttribute("d", newPath);
        }
    }
}

/**
 * Test Mode - Simulate file loading for preview (matching sandbox)
 */
function startTestMode() {
    isTest = true;

    GameDetails(
        "Servername",
        "Serverurl", 
        "Mapname",
        "Maxplayers",
        "SteamID",
        "Gamemode"
    );

    var totalTestFiles = 100;
    SetFilesTotal(totalTestFiles);

    var needed = totalTestFiles;
    setInterval(function() {
        if (needed > 0) {
            needed = needed - 1;
            SetFilesNeeded(needed);
            DownloadingFile("Filename " + needed);
        }
    }, 500);

    SetStatusChanged("Testing..");
}

/**
 * Initialize the loading screen
 */
document.addEventListener("DOMContentLoaded", function() {
    updateStatus("Initializing...", 0);
    
    // Update SVG height to match container
    setTimeout(updateSvgHeight, 100); // Small delay to ensure elements are rendered
    
    // Update SVG on window resize
    window.addEventListener('resize', updateSvgHeight);
    
    // if it isn't loaded by gmod load manually
    setTimeout(function() {
        if (!isGmod) {
            startTestMode();
        }
    }, 1000);
}); 
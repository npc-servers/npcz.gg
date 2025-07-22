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
        percentage = Math.max(0, Math.min(100, calculatedPercentage));
        updateStatus("Loading files...", percentage);
    }
}

function DownloadingFile(filename) {
    // Clean up the filename
    filename = filename.replace("'", "").replace("?", "");
    
    // Add to file history
    var history = document.getElementById("fileHistory");
    if (history) {
        var newItem = document.createElement("div");
        newItem.className = "file-item";
        
        // Check if filename has addon count in parentheses
        var countMatch = filename.match(/^(.+)\s*\((\d+)\)$/);
        if (countMatch && totalFiles > 0) {
            var baseFilename = countMatch[1].trim();
            var currentCount = parseInt(countMatch[2]);
            
            // Create filename span
            var filenameSpan = document.createElement("span");
            filenameSpan.textContent = baseFilename;
            newItem.appendChild(filenameSpan);
            
            // Create addon count box
            var countBox = document.createElement("span");
            countBox.className = "addon-count";
            countBox.textContent = currentCount + "/" + totalFiles;
            newItem.appendChild(countBox);
        } else {
            newItem.textContent = filename;
        }
        
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

function SetStatusChanged(status) {
    // Only the key GMod status messages get green boxes (matching original behavior)
    var importantStatuses = [
        "Workshop Complete",
        "Client info sent!",
        "Starting Lua..."
    ];
    
    // Add status to history
    var history = document.getElementById("fileHistory");
    if (history) {
        var newItem = document.createElement("div");
        newItem.className = "file-item";
        
        // Check if this is an important status (exact match)
        var isImportant = importantStatuses.indexOf(status) !== -1;
        
        if (isImportant) {
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

    // Update loading percentage based on status
    if (status === "Workshop Complete") {
        percentage = 85;
        updateStatus("Workshop Complete", percentage);
    } else if (status === "Client info sent!") {
        percentage = 95;
        updateStatus("Client info sent!", percentage);
    } else if (status === "Starting Lua...") {
        percentage = 100;
        updateStatus("Ready to play!", percentage);
    } else {
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
        percentElement.textContent = percent + "%";
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
 * Test Mode - Simulate file loading for preview
 */
function startTestMode() {
    isTest = true;
    
    var testFiles = [
        "materials/maps/gm_flatgrass.vmt",
        "models/props/cs_office/radio.mdl",
        "sound/ambient/creatures/pigeon_idle1.wav",
        "scripts/game_sounds_manifest.txt",
        "materials/models/player/shared/ice_player.vmt",
        "models/weapons/v_crowbar.mdl",
        "sound/weapons/crowbar/crowbar_impact1.wav",
        "lua/autorun/client/example.lua",
        "materials/gui/gradient_up.vmt",
        "models/props_c17/oildrum001.mdl"
    ];
    
    var totalTestFiles = 50;
    SetFilesTotal(totalTestFiles);
    
    var needed = totalTestFiles;
    var fileIndex = 0;
    
    var loadingInterval = setInterval(function() {
        if (needed > 0) {
            needed = needed - 1;
            SetFilesNeeded(needed);
            
            // Show a random test file
            var filename = testFiles[fileIndex % testFiles.length];
            DownloadingFile(filename + " (" + (totalTestFiles - needed) + ")");
            fileIndex++;
            
            // Add occasional status updates
            if (needed === 40) {
                SetStatusChanged("Downloading Workshop content...");
            } else if (needed === 20) {
                SetStatusChanged("Extracting files...");
            } else if (needed === 5) {
                SetStatusChanged("Workshop Complete");
            } else if (needed === 2) {
                SetStatusChanged("Client info sent!");
            } else if (needed === 0) {
                SetStatusChanged("Starting Lua...");
                clearInterval(loadingInterval);
            }
        }
    }, 300);
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
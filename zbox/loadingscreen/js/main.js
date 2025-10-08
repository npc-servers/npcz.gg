"use strict";

/**
 * ZBox Loading Screen - Frontend Logic
 * 
 * This file contains ZBox-specific visual/frontend code.
 * The core GMod backend logic is in /js/loadingscreen-core.js
 */

// Server configuration (uses centralized server list from core)
var serverConfig = {
    servers: networkServers, // Defined in core
    backgroundImages: [
        'images/snake.jpg',
        'images/explosion.jpg',
    ],
    backgroundInterval: 15000 // 15 seconds
};

// State
var progressBar = null;
var percentageElement = null;
var statusTextElement = null;
var backgroundElement = null;
var serverListElement = null;
var totalPlayersElement = null;
var currentBackgroundIndex = 0;
var backgroundRotationInterval = null;
var serverUpdateInterval = null;

/**
 * Custom GMod callback handlers - Update the ZBox UI
 */

// Custom handler for when game details are received
window.onGameDetailsReceived = function(servername, serverurl, mapname, maxplayers, steamid, gamemode) {
    console.log("ZBox: Game details received", servername, serverurl);
    
    // Refresh server list to exclude current server (IP/Port are parsed in core)
    if (currentServerIp && currentServerPort) {
        fetchAllServerStatus();
    }
};

// Custom handler for progress updates
window.onProgressUpdate = function(percentageValue, filesNeeded, filesTotal) {
    if (progressBar && percentageElement) {
        progressBar.style.width = percentageValue + '%';
        percentageElement.textContent = percentageValue + '%';
    }
};

// Custom handler for status changes
window.onStatusChanged = function(status) {
    updateStatusDisplay();
};

// Custom handler for file downloads
window.onFileDownloading = function(fileName) {
    updateStatusDisplay();
};

/**
 * Update the status display with current loading state
 */
function updateStatusDisplay() {
    if (!statusTextElement) return;
    
    var status = getCurrentStatus();
    statusTextElement.textContent = status;
}

/**
 * Initialize background rotation
 */
function initBackgroundRotation() {
    if (!backgroundElement) return;
    
    // Set initial background
    setBackground(0, true);
    
    // Start rotation
    backgroundRotationInterval = setInterval(function() {
        currentBackgroundIndex = (currentBackgroundIndex + 1) % serverConfig.backgroundImages.length;
        setBackground(currentBackgroundIndex, false);
    }, serverConfig.backgroundInterval);
}

/**
 * Set background image
 */
function setBackground(index, immediate) {
    if (!backgroundElement) return;
    
    var imageUrl = serverConfig.backgroundImages[index];
    
    if (immediate) {
        backgroundElement.style.transition = 'none';
        backgroundElement.style.backgroundImage = 'url(' + imageUrl + ')';
        
        setTimeout(function() {
            backgroundElement.style.transition = 'background-image 2s ease-in-out';
        }, 50);
    } else {
        backgroundElement.style.backgroundImage = 'url(' + imageUrl + ')';
  }
}

// fetchServerStatus is now in core - use the shared version

/**
 * Fetch status for all servers and update UI
 */
function fetchAllServerStatus() {
    if (!serverListElement || !totalPlayersElement) return;
    
    // Use core utility to fetch all server statuses
    fetchAllServersStatus(serverConfig.servers).then(function(serverStatuses) {
        // Calculate total player count from ALL servers (including current one)
        var totalPlayers = getTotalPlayerCount(serverStatuses);
        
        // Update total player count
        totalPlayersElement.textContent = totalPlayers;
        
        // Filter out the current server for display only
        var displayedServers = filterCurrentServer(serverStatuses);
        
        // Sort servers by player count (online first, then by players)
        displayedServers = sortServersByPlayers(displayedServers);
        
        // Limit to maximum 4 servers AFTER sorting and filtering
        var serversToShow = displayedServers.slice(0, 4);
        
        updateServerList(serversToShow);
    }).catch(function(error) {
        console.error("Error fetching server statuses:", error);
    });
}

/**
 * Update the server list display
 */
function updateServerList(serverStatuses) {
    if (!serverListElement) return;
    
    serverListElement.innerHTML = '';
    
    serverStatuses.forEach(function(serverStatus) {
        var serverElement = createServerElement(serverStatus);
        serverListElement.appendChild(serverElement);
    });
}

/**
 * Create a server element
 */
function createServerElement(serverStatus) {
    var server = serverStatus.server;
    var isOnline = serverStatus.online;
    var playerCount = serverStatus.players;
    var maxPlayers = serverStatus.maxPlayers;
    var playerPercentage = maxPlayers > 0 ? (playerCount / maxPlayers) * 100 : 0;
    
    var serverDiv = document.createElement('div');
    serverDiv.className = 'server-item' + (isOnline ? '' : ' offline');
    
    var serverHeader = document.createElement('div');
    serverHeader.className = 'server-header';
    
    var logo = document.createElement('img');
    logo.src = server.logo;
    logo.alt = server.title + ' Logo';
    logo.className = 'server-logo';
    
    var name = document.createElement('div');
    name.className = 'server-name';
    name.textContent = server.title;
    
    serverHeader.appendChild(logo);
    serverHeader.appendChild(name);
    serverDiv.appendChild(serverHeader);
    
    if (isOnline) {
        var players = document.createElement('div');
        players.className = 'server-players';
        
        var countClass = '';
        if (playerPercentage >= 90) {
            countClass = 'full';
        } else if (playerPercentage >= 70) {
            countClass = 'nearly-full';
        }
        
        players.innerHTML = '<span class="player-count-number ' + countClass + '">' + playerCount + '/' + maxPlayers + '</span> players online';
        serverDiv.appendChild(players);
        
        if (serverStatus.gamemode || serverStatus.map) {
            var gamemode = document.createElement('div');
            gamemode.className = 'server-gamemode';
            
            if (serverStatus.gamemode) {
                gamemode.innerHTML = 'Now Playing: <span>' + serverStatus.gamemode + '</span> <span style="color: rgba(255, 255, 255, 0.4);">on</span> ' + serverStatus.map;
            } else {
                gamemode.innerHTML = 'Map: <span>' + serverStatus.map + '</span>';
            }
            
            serverDiv.appendChild(gamemode);
        }
    } else {
        var offline = document.createElement('div');
        offline.className = 'server-offline';
        offline.textContent = 'Server is offline';
        serverDiv.appendChild(offline);
    }
    
    return serverDiv;
}

/**
 * Custom initialization
 */
window.onLoadingScreenInit = function() {
    console.log("ZBox: Loading screen initialized");
    
    // Get DOM elements
    progressBar = document.getElementById('progressBar');
    percentageElement = document.getElementById('percentage');
    statusTextElement = document.getElementById('statusText');
    backgroundElement = document.getElementById('background');
    serverListElement = document.getElementById('serverList');
    totalPlayersElement = document.getElementById('totalPlayers');
    
    // Initialize background rotation
    initBackgroundRotation();
    
    // Initialize server list
    fetchAllServerStatus();
    
    // Update server list every 30 seconds
    serverUpdateInterval = setInterval(fetchAllServerStatus, 30000);
    
    // Update status display periodically
    setInterval(updateStatusDisplay, 100);
};

// Cleanup on unload
window.addEventListener('beforeunload', function() {
    if (backgroundRotationInterval) {
        clearInterval(backgroundRotationInterval);
    }
    if (serverUpdateInterval) {
        clearInterval(serverUpdateInterval);
    }
});

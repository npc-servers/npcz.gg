"use strict";

/**
 * Sandbox Loading Screen - Frontend Logic
 * 
 * This file contains Sandbox-specific visual/frontend code.
 * The core GMod backend logic is in /js/loadingscreen-core.js
 */

// Background configuration
var backgroundImages = [
    'images/hallway.jpg',
    'images/paradise.jpg',
    'images/pov.jpg',
    'images/warehouse.jpg'
];

var backgroundInterval = 15000; // 15 seconds
var currentBackgroundIndex = 0;
var backgroundRotationInterval = null;
var backgroundElement = null;

/**
 * Initialize background rotation
 */
function initBackgroundRotation() {
    backgroundElement = document.getElementById('background');
    if (!backgroundElement) return;
    
    // Set initial background
    setBackground(0, true);
    
    // Start rotation
    backgroundRotationInterval = setInterval(function() {
        currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundImages.length;
        setBackground(currentBackgroundIndex, false);
    }, backgroundInterval);
}

/**
 * Set background image
 */
function setBackground(index, immediate) {
    if (!backgroundElement) return;
    
    var imageUrl = backgroundImages[index];
    
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

/**
 * Custom initialization
 */
window.onLoadingScreenInit = function() {
    console.log("Sandbox: Loading screen initialized");
    
    // Initialize background rotation
    initBackgroundRotation();
    
    // Initialize server list (now using core utilities)
    if (currentServerIp && currentServerPort) {
        fetchAllServerStatus();
    } else {
        // Fetch immediately if we don't have server info yet
        fetchAllServerStatus();
    }
    
    // Update server list every 30 seconds
    setInterval(function() {
        fetchAllServerStatus();
    }, 30000);
};

/**
 * Fetch status for all servers and update UI
 */
function fetchAllServerStatus() {
    var serverListElement = document.getElementById('serverList');
    var totalPlayersElement = document.getElementById('totalPlayers');
    
    if (!serverListElement || !totalPlayersElement) return;
    
    // Use core utility to fetch all server statuses
    fetchAllServersStatus(networkServers).then(function(serverStatuses) {
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
    var serverListElement = document.getElementById('serverList');
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

// Cleanup on unload
window.addEventListener('beforeunload', function() {
    if (backgroundRotationInterval) {
        clearInterval(backgroundRotationInterval);
    }
});

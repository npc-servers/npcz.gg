"use strict";

/**
 * NPCZ.GG Loading Screen Core
 * Centralized GMod loading screen backend logic
 * Used by: Sandbox, Horde, ZBox
 * 
 * This file contains all the GMod callback functions and core loading logic.
 * Each server can have its own custom frontend/visuals.
 */

var isGmod = false;
var totalFiles = 1;
var filesNeeded = 1;
var totalCalled = false;
var percentage = 0;
var allow_increment = true;
var currentDownloadingFile = "";
var currentStatus = "Initializing...";
var currentServerName = null;

/**
 * Centralized Server List
 * All servers in the NPCZ/ZGRAD network
 */
var networkServers = [
    {
        id: 'zgrad1',
        title: 'ZGRAD US1',
        ip: '193.243.190.18',
        port: 27066,
        logo: 'https://zgrad.gg/images/logos/zgrad-logopiece-z.png'
    },
    {
        id: 'zgrad2',
        title: 'ZGRAD US2',
        ip: '193.243.190.18',
        port: 27051,
        logo: 'https://zgrad.gg/images/logos/zgrad-logopiece-z.png'
    },
    {
        id: 'zgrad3',
        title: 'ZGRAD US3',
        ip: '193.243.190.18',
        port: 27053,
        logo: 'https://zgrad.gg/images/logos/zgrad-logopiece-z.png'
    },
    {
        id: 'zgrad4',
        title: 'ZGRAD US4',
        ip: '193.243.190.18',
        port: 27052,
        logo: 'https://zgrad.gg/images/logos/zgrad-logopiece-z.png'
    },
    {
        id: 'npcz',
        title: 'NPC Zombies Vs. Players',
        ip: '193.243.190.18',
        port: 27015,
        logo: '../../assets/npcz_logo.png'
    },
    {
        id: 'horde',
        title: 'HORDE',
        ip: '193.243.190.18',
        port: 27065,
        logo: '../../assets/horde_logo.png'
    },
    {
        id: 'zbox',
        title: 'ZBOX',
        ip: '193.243.190.18',
        port: 27017,
        logo: '../../assets/zbox_logo.png'
    },
    {
        id: 'zscenario',
        title: 'ZSCENARIO',
        ip: '193.243.190.18',
        port: 27018,
        logo: '../../assets/npcz_logo.png'
    },
    {
        id: 'mapsweepers',
        title: 'MAPSWEEPERS',
        ip: '193.243.190.18',
        port: 27019,
        logo: '../../assets/mapsweepers_logo.png'
    }
];

/**
 * GMod Called Functions - Core loading functionality only
 * These functions are bound to the window object for GMod to call
 */

// Bind GameDetails to window for GMod compatibility
window.GameDetails = function(servername, serverurl, mapname, maxplayers, steamid, gamemode) {
    console.log("[LoadingScreen Core] Joining server:", servername);
    
    isGmod = true;
    
    // Reset state for real GMod loading
    totalFiles = 1;
    filesNeeded = 1;
    totalCalled = false;
    percentage = 0;
    currentDownloadingFile = "";
    currentStatus = "Initializing...";
    
    // Store the server name for filtering
    if (servername) {
        currentServerName = servername;
        
        // Refresh server list to apply the filter now that we know the current server
        fetchAllServerStatus();
    }
};

// Bind SetFilesTotal to window for GMod compatibility
window.SetFilesTotal = function(total) {
    console.log("[LoadingScreen Core] SetFilesTotal called with total:", total);
    
    var previousTotal = totalFiles;
    totalCalled = true;
    totalFiles = Math.max(1, total); // Ensure at least 1 to avoid division by zero
    
    // Only reset filesNeeded if this is the first time or if we need to increase it
    // This preserves progress made during workshop loading
    if (previousTotal === 1 || filesNeeded > total) {
        filesNeeded = total;
        console.log("[LoadingScreen Core] Total files set to:", total);
    } else {
        console.log("[LoadingScreen Core] Preserving existing progress - filesNeeded:", filesNeeded, "totalFiles:", totalFiles);
    }
    
    currentDownloadingFile = "";
    
    updatePercentage();
};

// Bind SetFilesNeeded to window for GMod compatibility
window.SetFilesNeeded = function(needed) {
    console.log("[LoadingScreen Core] SetFilesNeeded called - needed:", needed, "total:", totalFiles);
    filesNeeded = Math.max(0, needed);
    updatePercentage();
};

// Bind DownloadingFile to window for GMod compatibility
window.DownloadingFile = function(fileName) {
    console.log("[LoadingScreen Core] DownloadingFile:", fileName);
    
    // Only decrement filesNeeded if we're in the actual file downloading phase
    // (after SetFilesTotal has been called with a meaningful value)
    // Don't decrement during workshop loading phase
    if (totalCalled && totalFiles > 1) {
        filesNeeded = Math.max(0, filesNeeded - 1);
        console.log("[LoadingScreen Core] Decremented filesNeeded to:", filesNeeded);
    } else {
        console.log("[LoadingScreen Core] Ignoring DownloadingFile (workshop phase) - totalCalled:", totalCalled, "totalFiles:", totalFiles);
    }
    
    // Clean up the filename and store it
    if (fileName) {
        currentDownloadingFile = fileName;
        
        // Update status to show we're actively downloading
        if (!currentStatus || currentStatus === "Initializing..." || currentStatus === "Initializing downloads...") {
            currentStatus = "Downloading files...";
        }
    }
    
    // Update percentage after decrementing
    updatePercentage();
};

// Bind SetStatusChanged to window for GMod compatibility
window.SetStatusChanged = function(status) {
    console.log("[LoadingScreen Core] SetStatusChanged:", status);
    currentStatus = status;
    
    // Clear downloading file when status changes to indicate we're not downloading files anymore
    if (status && (
        status.includes("Workshop Complete") || 
        status.includes("Client info sent") || 
        status.includes("Starting Lua") ||
        status.includes("Lua") ||
        status.includes("Complete")
    )) {
        console.log("[LoadingScreen Core] Status indicates completion phase - clearing downloading file");
        currentDownloadingFile = "";
    }
    
    // Parse workshop loading progress from status messages like "1/15 (1.8 GB) - Loading 'addon name'"
    if (status && totalCalled) {
        var progressMatch = status.match(/^(\d+)\/(\d+)\s*\(/);
        if (progressMatch) {
            var current = parseInt(progressMatch[1]);
            var total = parseInt(progressMatch[2]);
            
            if (total > 0) {
                // Update filesNeeded based on workshop progress
                filesNeeded = Math.max(0, totalFiles - current);
                console.log("[LoadingScreen Core] Parsed workshop progress:", current + "/" + total, "- filesNeeded now:", filesNeeded);
                updatePercentage();
            }
        }
    }
    
    // Set percentage to 100% when sending client info (final step)
    if (status && status.includes("Sending client info")) {
        filesNeeded = 0;
        updatePercentage();
    }
};

/**
 * Calculate and update the loading percentage (simple linear calculation)
 */
function updatePercentage() {
    if (!totalCalled || totalFiles <= 0) {
        return;
    }
    
    // Simple calculation: how many files have been downloaded / total files
    var filesDownloaded = Math.max(0, totalFiles - filesNeeded);
    var progress = (filesDownloaded / totalFiles);
    
    // Convert to percentage (0-100) and round
    var newPercentage = Math.round(Math.max(0, Math.min(100, progress * 100)));
    
    // Only log if percentage changed
    if (newPercentage !== percentage) {
        console.log("[LoadingScreen Core] Progress updated:", newPercentage + "% (" + filesDownloaded + "/" + totalFiles + " files downloaded)");
    }
    
    percentage = newPercentage;
}

// Keep the old function names for backward compatibility and internal use
function GameDetails(servername, serverurl, mapname, maxplayers, steamid, gamemode) {
    window.GameDetails(servername, serverurl, mapname, maxplayers, steamid, gamemode);
}

function SetFilesTotal(total) {
    window.SetFilesTotal(total);
}

function SetFilesNeeded(needed) {
    window.SetFilesNeeded(needed);
}

function DownloadingFile(filename) {
    window.DownloadingFile(filename);
}

function SetStatusChanged(status) {
    window.SetStatusChanged(status);
}

/**
 * Get the current loading status based on percentage and state
 */
function getCurrentStatus() {
    if (!isGmod) {
        return "Waiting for game...";
    }
    
    // Check for gluapack in current status or downloading file
    if ((currentStatus && currentStatus.toLowerCase().includes("gluapack")) ||
        (currentDownloadingFile && currentDownloadingFile.toLowerCase().includes("gluapack"))) {
        return "Downloading super-fast bundled lua";
    }
    
    // If we have a specific status from GMod, use that (but only if we're not actively downloading)
    if (currentStatus && currentStatus !== "" && (!currentDownloadingFile || currentDownloadingFile === "")) {
        // Check for important status messages that should be displayed
        if (currentStatus.includes("Starting Lua") || 
            currentStatus.includes("Client info sent") || 
            currentStatus.includes("Workshop Complete") ||
            currentStatus.includes("Lua") ||
            currentStatus.includes("Complete")) {
            return currentStatus;
        }
    }
    
    // If we're actively downloading a file, show that with priority
    if (currentDownloadingFile && currentDownloadingFile !== "") {
        // Clean up filename for display
        var displayName = currentDownloadingFile;
        
        // Remove common path prefixes to show just the filename
        if (displayName.includes("/")) {
            displayName = displayName.split("/").pop();
        }
        if (displayName.includes("\\")) {
            displayName = displayName.split("\\").pop();
        }
        
        // Truncate very long filenames but keep extension
        if (displayName.length > 35) {
            var nameWithoutExt = displayName.substring(0, displayName.lastIndexOf('.'));
            var ext = displayName.substring(displayName.lastIndexOf('.'));
            if (nameWithoutExt.length > 30) {
                displayName = nameWithoutExt.substring(0, 27) + "..." + ext;
            }
        }
        
        return "Downloading: " + displayName;
    }
    
    // Show current status if we have one and no file is downloading
    if (currentStatus && currentStatus !== "" && currentStatus !== "Initializing..." && currentStatus !== "Initializing downloads...") {
        return currentStatus;
    }
    
    // Fallback to simple status based on percentage
    if (percentage >= 100) {
        return "Starting Lua...";
    } else if (percentage > 0) {
        return "Downloading files...";
    } else {
        return "Initializing...";
    }
}

/**
 * Server List Utilities - Shared functions for server list functionality
 */

/**
 * Fetch server status from API
 * @param {Object} server - Server object with ip and port
 * @returns {Promise<Object>} Server status object
 */
function fetchServerStatus(server) {
    return fetch("https://gameserveranalytics.com/api/v2/query?game=source&ip=" + server.ip + "&port=" + server.port + "&type=info")
        .then(function(response) { return response.json(); })
        .then(function(serverInfo) {
            var status = {
                online: false,
                players: 0,
                maxPlayers: 0,
                map: 'Unknown',
                gamemode: '',
                server: server
            };

            if (serverInfo && (serverInfo.status && serverInfo.status.toLowerCase() === 'online' || serverInfo.players !== undefined)) {
                status.online = true;
                status.players = serverInfo.players || serverInfo.num_players || serverInfo.playercount || 0;
                status.maxPlayers = serverInfo.maxplayers || serverInfo.max_players || serverInfo.maxclients || 32;
                status.map = serverInfo.map || 'Unknown';
                
                // Extract gamemode from server name if available
                var serverTitle = serverInfo.name || serverInfo.hostname || '';
                var gamemodeMatch = serverTitle.match(/Now Playing:\s*([^|]+)/i);
                if (gamemodeMatch) {
                    status.gamemode = gamemodeMatch[1].trim();
                }
            }

            return status;
        })
        .catch(function(error) {
            console.error("Error fetching data for " + server.id + ":", error);
            return { 
                online: false, 
                players: 0, 
                maxPlayers: 32, 
                map: 'Unknown',
                gamemode: '',
                server: server 
            };
        });
}

/**
 * Fetch status for all servers
 * @param {Array} servers - Array of server objects
 * @returns {Promise<Array>} Array of server status objects
 */
function fetchAllServersStatus(servers) {
    var serverPromises = servers.map(function(server) {
        return fetchServerStatus(server);
    });
    
    return Promise.all(serverPromises);
}

/**
 * Filter out the current server from a list of server statuses
 * @param {Array} serverStatuses - Array of server status objects
 * @returns {Array} Filtered array without the current server
 */
function filterCurrentServer(serverStatuses) {
    if (!currentServerName) {
        return serverStatuses;
    }
    
    return serverStatuses.filter(function(serverStatus) {
        var server = serverStatus.server;
        // Use case-insensitive token-based matching since GMod sends various formats:
        // - "ZGRAD.GG US1 | Now Playing: TDM"
        // - "NPCZ | Horde - discord.gg/npc"
        // - "Map Sweepers Official Server | ZMOD.GG"
        // - "ZBox | random words"
        
        // Tokenize both names by splitting on special characters
        var gmodName = currentServerName.toLowerCase();
        var configTitle = server.title.toLowerCase();
        
        // Extract meaningful tokens (alphanumeric sequences)
        var gmodTokens = gmodName.match(/[a-z0-9]+/g) || [];
        var configTokens = configTitle.match(/[a-z0-9]+/g) || [];
        
        // Check if all config tokens are present in GMod tokens
        var isSameServer = configTokens.every(function(token) {
            return gmodTokens.indexOf(token) !== -1;
        });
        
        if (isSameServer) {
            console.log("[LoadingScreen Core] Filtering out current server:", server.title);
        }
        
        return !isSameServer;
    });
}

/**
 * Calculate total player count from server statuses
 * @param {Array} serverStatuses - Array of server status objects
 * @returns {number} Total player count
 */
function getTotalPlayerCount(serverStatuses) {
    return serverStatuses.reduce(function(total, serverStatus) {
        return total + (serverStatus.online ? serverStatus.players : 0);
    }, 0);
}

/**
 * Sort servers by player count (online first, then by player count)
 * @param {Array} serverStatuses - Array of server status objects
 * @returns {Array} Sorted array
 */
function sortServersByPlayers(serverStatuses) {
    return serverStatuses.sort(function(a, b) {
        if (a.online && !b.online) return -1;
        if (!a.online && b.online) return 1;
        return b.players - a.players;
    });
}

/**
 * Server List UI - Functions for displaying server list on loading screens
 */

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

/**
 * Initialize server list updates
 */
function initializeServerList() {
    // Check if server list elements exist
    var serverListElement = document.getElementById('serverList');
    var totalPlayersElement = document.getElementById('totalPlayers');
    
    if (!serverListElement || !totalPlayersElement) {
        // Server list not present in this loading screen
        return;
    }
    
    // Fetch immediately
    fetchAllServerStatus();
    
    // Update server list every 30 seconds
    setInterval(function() {
        fetchAllServerStatus();
    }, 30000);
}

/**
 * UI Integration - Updates the visual loading screen elements
 */
var lastPercentage = 0;
var lastStatus = "";

// DOM elements
var progressBar = null;
var percentageElement = null;
var statusTextElement = null;

/**
 * Initialize UI elements and start update loop
 */
function initializeUI() {
    progressBar = document.getElementById('progressBar');
    percentageElement = document.getElementById('percentage');
    statusTextElement = document.getElementById('statusText');
    
    if (!progressBar || !percentageElement || !statusTextElement) {
        setTimeout(initializeUI, 500);
        return;
    }
    
    // Start the UI update loop
    updateUI();
}

/**
 * Update the UI elements based on current loading state
 */
function updateUI() {
    if (progressBar && percentageElement && statusTextElement) {
        // Update percentage display and progress bar
        if (lastPercentage !== percentage) {
            lastPercentage = percentage;
            percentageElement.textContent = percentage + '%';
            progressBar.style.width = percentage + '%';
        }
        
        // Update status text
        var currentStatusText = getCurrentStatus();
        if (lastStatus !== currentStatusText) {
            lastStatus = currentStatusText;
            statusTextElement.textContent = currentStatusText;
        }
    }
    
    // Continue updating
    requestAnimationFrame(updateUI);
}

/**
 * Initialize the loading system
 */
document.addEventListener("DOMContentLoaded", function() {
    console.log("[LoadingScreen Core] ====================================");
    console.log("[LoadingScreen Core] Loading Screen Core Initialized");
    console.log("[LoadingScreen Core] Waiting for GMod callbacks...");
    console.log("[LoadingScreen Core] ====================================");
    
    // Initialize UI elements
    setTimeout(initializeUI, 100);
    
    // Initialize server list if present
    setTimeout(initializeServerList, 200);
    
    // Call custom initialization if defined by the frontend
    if (typeof window.onLoadingScreenInit === 'function') {
        window.onLoadingScreenInit();
    }
});


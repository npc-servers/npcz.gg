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
var isTest = false;
var totalFiles = 50;
var totalCalled = false;
var percentage = 0;
var allow_increment = true;
var currentDownloadingFile = "";
var currentStatus = "Initializing...";
var currentServerIp = null;
var currentServerPort = null;

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
    isGmod = true;
    
    // Parse server URL to get IP and port
    if (serverurl) {
        var parts = serverurl.split(':');
        if (parts.length >= 2) {
            currentServerIp = parts[0];
            currentServerPort = parseInt(parts[1], 10);
        }
    }
};

// Bind SetFilesTotal to window for GMod compatibility
window.SetFilesTotal = function(total) {
    totalCalled = true;
    totalFiles = total;
    
    // Reset percentage when total files is set
    percentage = 0;
    currentDownloadingFile = "";
    currentStatus = "Initializing downloads...";
};

// Bind SetFilesNeeded to window for GMod compatibility
window.SetFilesNeeded = function(needed) {
    if (totalCalled && totalFiles > 0) {
        var calculatedPercentage = Math.round(((totalFiles - needed) / totalFiles) * 100);
        percentage = Math.max(0, Math.min(100, calculatedPercentage));
    }
};

// Bind DownloadingFile to window for GMod compatibility
window.DownloadingFile = function(fileName) {
    // Clean up the filename and store it
    if (fileName) {
        currentDownloadingFile = fileName;
        
        // Update status to show we're actively downloading
        if (!currentStatus || currentStatus === "Initializing..." || currentStatus === "Initializing downloads...") {
            currentStatus = "Downloading files...";
        }
    }
};

// Bind SetStatusChanged to window for GMod compatibility
window.SetStatusChanged = function(status) {
    currentStatus = status;
    
    // Clear downloading file when status changes to indicate we're not downloading files anymore
    if (status && (
        status.includes("Workshop Complete") || 
        status.includes("Client info sent") || 
        status.includes("Starting Lua") ||
        status.includes("Lua") ||
        status.includes("Complete")
    )) {
        currentDownloadingFile = "";
        
        // Set appropriate percentage based on status
        if (status.includes("Workshop Complete")) {
            percentage = Math.max(percentage, 85);
        } else if (status.includes("Client info sent")) {
            percentage = Math.max(percentage, 95);
        } else if (status.includes("Starting Lua") || status.includes("Lua")) {
            percentage = Math.max(percentage, 100);
        }
    }
};

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
 * Test Mode - Simulate file loading for testing
 */
function startTestMode() {
    isTest = true;

    GameDetails("Test Server", "test.server.com", "gm_construct", "32", "76561198000000000", "sandbox");

    var totalTestFiles = 100;
    SetFilesTotal(totalTestFiles);

    var needed = totalTestFiles;
    var testFiles = [
        "materials/models/weapons/ak47/ak47_texture.vtf",
        "sound/weapons/ak47/ak47_fire.wav", 
        "models/weapons/w_ak47.mdl",
        "materials/effects/muzzleflash.vmt",
        "lua/autorun/client/hud_system.lua",
        "materials/gui/health_icon.png",
        "sound/ambient/combat_music.mp3",
        "models/player/terrorist.mdl",
        "materials/models/player/terrorist_body.vtf",
        "lua/weapons/weapon_ak47.lua",
        "materials/models/props/barrel01.vmt",
        "sound/weapons/pistol/pistol_fire.wav",
        "models/props_c17/chair01.mdl",
        "lua/autorun/server/init.lua",
        "materials/sprites/glow01.vmt",
        "sound/ambient/atmosphere/forest_ambience.wav",
        "models/player/combine_soldier.mdl",
        "materials/models/player/combine_soldier_body.vtf",
        "lua/entities/weapon_base/shared.lua",
        "materials/effects/water_splash.vmt"
    ];
    
    var testInterval = setInterval(function() {
        if (needed > 0) {
            needed = needed - 1;
            SetFilesNeeded(needed);
            
            // Use realistic filenames with proper timing
            var fileIndex = (totalTestFiles - needed) % testFiles.length;
            DownloadingFile(testFiles[fileIndex]);
            
            // Add status changes at specific points
            if (needed === 20) {
                SetStatusChanged("Workshop Complete");
                // Clear file when status changes
                setTimeout(function() {
                    currentDownloadingFile = "";
                }, 200);
            } else if (needed === 5) {
                SetStatusChanged("Client info sent!");
                // Clear file when status changes
                setTimeout(function() {
                    currentDownloadingFile = "";
                }, 200);
            } else if (needed === 0) {
                SetStatusChanged("Starting Lua...");
                // Clear file when status changes
                setTimeout(function() {
                    currentDownloadingFile = "";
                }, 200);
                clearInterval(testInterval);
            }
        }
    }, 200);

    SetStatusChanged("Loading workshop content...");
}

/**
 * Get the current loading status based on percentage and state
 */
function getCurrentStatus() {
    if (!isGmod && !isTest) {
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
        
        // Handle different file types with appropriate icons/descriptions
        var fileExtension = displayName.split('.').pop().toLowerCase();
        var fileTypeDescription = "";
        
        switch (fileExtension) {
            case 'mdl':
                fileTypeDescription = "Model";
                break;
            case 'vmt':
            case 'vtf':
                fileTypeDescription = "Texture";
                break;
            case 'wav':
            case 'mp3':
            case 'ogg':
                fileTypeDescription = "Sound";
                break;
            case 'lua':
                fileTypeDescription = "Script";
                break;
            case 'bsp':
                fileTypeDescription = "Map";
                break;
            case 'phy':
                fileTypeDescription = "Physics";
                break;
            case 'ani':
                fileTypeDescription = "Animation";
                break;
            default:
                fileTypeDescription = "File";
        }
        
        // Truncate very long filenames but keep extension
        if (displayName.length > 35) {
            var nameWithoutExt = displayName.substring(0, displayName.lastIndexOf('.'));
            var ext = displayName.substring(displayName.lastIndexOf('.'));
            if (nameWithoutExt.length > 30) {
                displayName = nameWithoutExt.substring(0, 27) + "..." + ext;
            }
        }
        
        return "Downloading " + fileTypeDescription + ": " + displayName;
    }
    
    // Show current status if we have one and no file is downloading
    if (currentStatus && currentStatus !== "" && currentStatus !== "Initializing..." && currentStatus !== "Initializing downloads...") {
        return currentStatus;
    }
    
    // Fallback to percentage-based status
    if (percentage >= 100) {
        return "Starting Lua...";
    } else if (percentage >= 95) {
        return "Client info sent!";
    } else if (percentage >= 85) {
        return "Workshop Complete";
    } else if (percentage > 0) {
        return "Downloading workshop content...";
    } else {
        return "Initializing...";
    }
}

/**
 * Get file type description from filename
 */
function getFileTypeDescription(filename) {
    if (!filename) return "File";
    
    var extension = filename.split('.').pop().toLowerCase();
    
    var fileTypes = {
        'mdl': 'Model',
        'vmt': 'Texture',
        'vtf': 'Texture',
        'wav': 'Sound',
        'mp3': 'Sound',
        'ogg': 'Sound',
        'lua': 'Script',
        'bsp': 'Map',
        'phy': 'Physics',
        'ani': 'Animation'
    };
    
    return fileTypes[extension] || 'File';
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
    if (!currentServerIp || !currentServerPort) {
        return serverStatuses;
    }
    
    return serverStatuses.filter(function(serverStatus) {
        var server = serverStatus.server;
        return !(server.ip === currentServerIp && server.port === currentServerPort);
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
        console.error("Core: Missing UI elements! Retrying in 500ms...");
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
    // Initialize UI elements
    setTimeout(initializeUI, 100);
    
    // Initialize server list if present
    setTimeout(initializeServerList, 200);
    
    // Call custom initialization if defined by the frontend
    if (typeof window.onLoadingScreenInit === 'function') {
        window.onLoadingScreenInit();
    }
    
    // Auto-start test mode if not loaded by GMod after 1 second
    setTimeout(function() {
        if (!isGmod) {
            startTestMode();
        }
    }, 1000);
});


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
var totalFiles = 1;
var filesNeeded = 1;
var totalCalled = false;
var percentage = 0;
var allow_increment = true;
var currentDownloadingFile = "";
var currentStatus = "Initializing...";
var currentServerName = null;
var currentPhase = "workshop"; // Current loading phase: "workshop" or "lua"
var workshopPercentageRange = { min: 0, max: 85 }; // Workshop downloads map to 0-85%
var luaPercentageRange = { min: 85, max: 100 }; // Lua downloads map to 85-100%

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
    console.log("[LoadingScreen Core] GameDetails called - GMod detected!");
    console.log("[LoadingScreen Core] Server:", servername);
    console.log("[LoadingScreen Core] URL:", serverurl);
    console.log("[LoadingScreen Core] Map:", mapname);
    console.log("[LoadingScreen Core] Gamemode:", gamemode);
    
    isGmod = true;
    isTest = false; // Disable test mode if GMod loads
    
    // Store the server name for filtering
    if (servername) {
        currentServerName = servername;
    }
};

// Bind SetFilesTotal to window for GMod compatibility
window.SetFilesTotal = function(total) {
    console.log("[LoadingScreen Core] SetFilesTotal called with total:", total, "- current percentage:", percentage, "- current phase:", currentPhase);
    
    totalCalled = true;
    totalFiles = Math.max(1, total); // Ensure at least 1 to avoid division by zero
    
    // If this is called when we already have significant progress, we're switching to lua phase
    if (percentage >= workshopPercentageRange.max - 5 && currentPhase === "workshop") {
        currentPhase = "lua";
        console.log("[LoadingScreen Core] Switching to LUA phase - percentage range:", luaPercentageRange.min + "% to", luaPercentageRange.max + "%");
    }
    
    currentDownloadingFile = "";
    
    console.log("[LoadingScreen Core] Total files set to:", totalFiles, "- Phase:", currentPhase);
};

// Bind SetFilesNeeded to window for GMod compatibility
window.SetFilesNeeded = function(needed) {
    console.log("[LoadingScreen Core] SetFilesNeeded called - needed:", needed, "total:", totalFiles, "phase:", currentPhase);
    
    filesNeeded = Math.max(0, needed);
    updatePercentage();
};

// Bind DownloadingFile to window for GMod compatibility
window.DownloadingFile = function(fileName) {
    console.log("[LoadingScreen Core] DownloadingFile:", fileName);
    
    // Decrement filesNeeded (like the reference code does)
    filesNeeded = Math.max(0, filesNeeded - 1);
    
    // Clean up the filename and store it
    if (fileName) {
        currentDownloadingFile = fileName;
        
        // Check if we're downloading lua/gluapack files - switch to lua phase
        if (fileName.toLowerCase().includes("gluapack") || fileName.toLowerCase().includes(".lua")) {
            if (currentPhase === "workshop") {
                currentPhase = "lua";
                console.log("[LoadingScreen Core] Detected lua/gluapack download - switching to LUA phase");
            }
        }
        
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
    
    // Try to parse progress from status message (e.g., "14/45 (2.7 GB) - Loading 'X'")
    if (status) {
        var progressMatch = status.match(/^(\d+)\/(\d+)/);
        if (progressMatch) {
            var current = parseInt(progressMatch[1], 10);
            var total = parseInt(progressMatch[2], 10);
            
            if (total > 0) {
                var oldPercentage = percentage;
                var calculatedPercentage = Math.round((current / total) * 100);
                percentage = Math.max(0, Math.min(100, calculatedPercentage));
                console.log("[LoadingScreen Core] Progress parsed from status:", percentage + "%", "(" + current + "/" + total + ")", "- changed from", oldPercentage + "%");
            }
        } else {
            console.log("[LoadingScreen Core] Status message did not match progress pattern:", status);
        }
    }
    
    // Clear downloading file when status changes to indicate we're not downloading files anymore
    if (status && (
        status.includes("Workshop Complete") || 
        status.includes("Client info sent") || 
        status.includes("Starting Lua") ||
        status.includes("Lua") ||
        status.includes("Complete")
    )) {
        currentDownloadingFile = "";
        console.log("[LoadingScreen Core] Status indicates completion phase - clearing downloading file");
        
        // Handle phase transitions based on status
        if (status.includes("Workshop Complete")) {
            // Workshop is done, switch to lua phase
            if (currentPhase === "workshop") {
                currentPhase = "lua";
                console.log("[LoadingScreen Core] Workshop complete - switching to LUA phase");
                // Ensure we're at least at the start of lua range
                percentage = Math.max(percentage, luaPercentageRange.min);
            }
        } else if (status.includes("Starting Lua") || status.includes("Lua")) {
            // Final phase
            percentage = Math.max(percentage, 100);
            console.log("[LoadingScreen Core] Starting Lua - ensuring percentage is 100%");
        }
    }
};

/**
 * Calculate and update the loading percentage based on current phase
 */
function updatePercentage() {
    if (!totalCalled || totalFiles <= 0) {
        console.warn("[LoadingScreen Core] Cannot calculate percentage - totalCalled:", totalCalled, "totalFiles:", totalFiles);
        return;
    }
    
    // Calculate how many files have been downloaded in this phase
    var filesRemaining = Math.max(0, filesNeeded);
    var filesDownloaded = Math.max(0, totalFiles - filesRemaining);
    
    // Calculate raw percentage (0-100) for this phase
    var rawPercentage = (filesDownloaded / totalFiles) * 100;
    
    // Map to the appropriate range based on current phase
    var range = currentPhase === "lua" ? luaPercentageRange : workshopPercentageRange;
    var mappedPercentage = range.min + (rawPercentage / 100) * (range.max - range.min);
    
    // Round and clamp to range
    percentage = Math.round(Math.max(range.min, Math.min(range.max, mappedPercentage)));
    
    console.log("[LoadingScreen Core] Progress updated:", percentage + "%", 
        "(" + filesDownloaded + "/" + totalFiles + " files)", 
        "- raw:", rawPercentage.toFixed(1) + "%", 
        "- phase:", currentPhase, 
        "- range:", range.min + "-" + range.max + "%");
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
 * Test Mode - Simulate file loading for testing
 */
function startTestMode() {
    isTest = true;
    
    // Reset state for test mode
    percentage = 0;
    currentPhase = "workshop";

    GameDetails("Test Server", "test.server.com", "gm_construct", "32", "76561198000000000", "sandbox");

    var totalTestFiles = 100;
    SetFilesTotal(totalTestFiles);
    SetFilesNeeded(totalTestFiles); // Set initial filesNeeded

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
    
    var currentFileIndex = 0;
    
    var testInterval = setInterval(function() {
        if (filesNeeded > 0 && currentFileIndex < totalTestFiles) {
            // Use realistic filenames with proper timing
            var fileIndex = currentFileIndex % testFiles.length;
            DownloadingFile(testFiles[fileIndex]); // This will decrement filesNeeded
            currentFileIndex++;
            
            // Add status changes at specific points
            if (filesNeeded === 20) {
                SetStatusChanged("Workshop Complete");
                // Clear file when status changes
                setTimeout(function() {
                    currentDownloadingFile = "";
                }, 200);
            }
        } else if (filesNeeded === 0 && currentPhase === "workshop") {
            // Workshop phase complete, start lua phase
            clearInterval(testInterval);
            
            setTimeout(function() {
                console.log("[LoadingScreen Core] TEST MODE: Starting lua download phase");
                SetFilesTotal(30); // Simulate lua files
                SetFilesNeeded(30); // Set initial lua filesNeeded
                
                var luaFileIndex = 0;
                var luaInterval = setInterval(function() {
                    if (filesNeeded > 0 && luaFileIndex < 30) {
                        DownloadingFile("lua/gluapack_" + luaFileIndex + ".dat");
                        luaFileIndex++;
                        
                        if (filesNeeded === 5) {
                            SetStatusChanged("Client info sent!");
                        }
                    } else if (filesNeeded === 0) {
                        SetStatusChanged("Starting Lua...");
                        clearInterval(luaInterval);
                    }
                }, 100);
            }, 500);
        }
    }, 50);

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
        // Use case-insensitive partial matching since GMod sends various formats:
        // - "ZGRAD US1 | Now Playing: TDM"
        // - "NPCZ | Horde - discord.gg/npc"
        // - "Map Sweepers Official Server | ZMOD.GG"
        // - "ZBox | random words"
        // Remove spaces for comparison to handle "MAPSWEEPERS" vs "Map Sweepers"
        var gmodName = currentServerName.toLowerCase().replace(/\s+/g, '');
        var configTitle = server.title.toLowerCase().replace(/\s+/g, '');
        var isSameServer = gmodName.includes(configTitle) || configTitle.includes(gmodName);
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
        console.error("[LoadingScreen Core] Missing UI elements! Retrying in 500ms...");
        console.error("[LoadingScreen Core] progressBar:", progressBar, "percentageElement:", percentageElement, "statusTextElement:", statusTextElement);
        setTimeout(initializeUI, 500);
        return;
    }
    
    console.log("[LoadingScreen Core] UI elements found - starting update loop");
    console.log("[LoadingScreen Core] Current state - isGmod:", isGmod, "isTest:", isTest, "percentage:", percentage);
    
    // Start the UI update loop
    updateUI();
}

/**
 * Update the UI elements based on current loading state
 */
var updateCount = 0;
function updateUI() {
    if (progressBar && percentageElement && statusTextElement) {
        // Log current state every 60 frames (roughly once per second)
        updateCount++;
        if (updateCount % 60 === 0) {
            console.log("[LoadingScreen Core] UI: Current state check - lastPercentage:", lastPercentage, "percentage:", percentage, "match:", lastPercentage === percentage);
        }
        
        // Update percentage display and progress bar
        if (lastPercentage !== percentage) {
            console.log("[LoadingScreen Core] UI: Updating percentage from", lastPercentage + "% to", percentage + "%");
            lastPercentage = percentage;
            percentageElement.textContent = percentage + '%';
            progressBar.style.width = percentage + '%';
        }
        
        // Update status text
        var currentStatusText = getCurrentStatus();
        if (lastStatus !== currentStatusText) {
            console.log("[LoadingScreen Core] UI: Updating status from '" + lastStatus + "' to '" + currentStatusText + "'");
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
    
    // Auto-start test mode if not loaded by GMod after 1 second
    setTimeout(function() {
        if (!isGmod && !isTest) {
            console.log("[LoadingScreen Core] No GMod detected after 1 second - starting TEST MODE");
            startTestMode();
        } else if (isGmod) {
            console.log("[LoadingScreen Core] GMod detected - running in PRODUCTION MODE");
        }
    }, 1000);
});


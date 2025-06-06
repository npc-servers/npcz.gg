// Server status update functionality
var serverUtils = {
    fetchServerStatus: function(ip, port, callback) {
        // For legacy browsers, we'll use a simpler status method
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://gameserveranalytics.com/api/v2/query?game=source&ip=' + ip + '&port=' + port + '&type=info', true);
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                var status = {
                    online: false,
                    players: 0,
                    maxPlayers: 0
                };
                
                if (xhr.status === 200) {
                    try {
                        var response = JSON.parse(xhr.responseText);
                        
                        if (response && (response.status === 'online' || response.players !== undefined)) {
                            status.online = true;
                            status.players = response.players || response.num_players || response.playercount || 0;
                            status.maxPlayers = response.maxplayers || response.max_players || response.maxclients || "?";
                        }
                    } catch (e) {
                        console.error("Error parsing server status:", e);
                    }
                }
                
                callback(status);
            }
        };
        
        xhr.onerror = function() {
            callback({ online: false, players: 0, maxPlayers: 0 });
        };
        
        try {
            xhr.send();
        } catch (e) {
            callback({ online: false, players: 0, maxPlayers: 0 });
        }
    },
    
    updateServerStatus: function(server, callback) {
        var self = this;
        
        // Handle servers with multiple instances
        if (server.instances && server.instances.length > 0) {
            var pendingRequests = server.instances.length;
            var combinedStatus = {
                online: false,
                players: 0,
                maxPlayers: 0
            };
            
            // For each instance in the server
            for (var i = 0; i < server.instances.length; i++) {
                (function(instance) {
                    self.fetchServerStatus(instance.ip, instance.port, function(status) {
                        if (status.online) {
                            combinedStatus.online = true;
                            combinedStatus.players += parseInt(status.players) || 0;
                            
                            // For max players, only add numeric values
                            var maxPlayers = parseInt(status.maxPlayers);
                            if (!isNaN(maxPlayers)) {
                                combinedStatus.maxPlayers += maxPlayers;
                            }
                        }
                        
                        pendingRequests--;
                        if (pendingRequests === 0) {
                            // All requests completed, return combined status
                            callback(combinedStatus);
                        }
                    });
                })(server.instances[i]);
            }
        } 
        // For backwards compatibility with old format
        else if (server.ip && server.port) {
            this.fetchServerStatus(server.ip, server.port, callback);
        } else {
            callback({ online: false, players: 0, maxPlayers: 0 });
        }
    }
};

// Function to update the Servers tab content
function updateServersTab() {
    // Update header
    var serversHeader = document.getElementsByClassName('servers-header')[0];
    if (serversHeader) {
        serversHeader.innerHTML = SharedConfig.servers.headerTitle;
    }
    
    // Clear and populate the servers grid
    var serversGrid = document.getElementsByClassName('servers-grid')[0];
    if (serversGrid) {
        serversGrid.innerHTML = ''; // Clear existing content
        
        // Create and add server boxes
        for (var i = 0; i < SharedConfig.servers.list.length; i++) {
            var server = SharedConfig.servers.list[i];
            
            // Create server box element
            var serverBox = document.createElement('div');
            serverBox.className = 'server-box';
            serverBox.id = 'server-' + server.id;
            
            // Create and populate title element
            var titleElement = document.createElement('h4');
            titleElement.className = 'server-box-title';
            titleElement.innerHTML = server.title;
            
            // Create and populate players element
            var playersElement = document.createElement('div');
            playersElement.className = 'server-box-players';
            playersElement.innerHTML = 'Players: Loading...';
            
            // Create and populate content element
            var contentElement = document.createElement('div');
            contentElement.className = 'server-box-content';
            contentElement.innerHTML = server.content;
            
            // Append all elements to the server box
            serverBox.appendChild(titleElement);
            serverBox.appendChild(playersElement);
            serverBox.appendChild(contentElement);
            
            // Add the server box to the grid
            serversGrid.appendChild(serverBox);
            
            // Fetch server status (using closure to keep server and elements in scope)
            (function(server, serverBox, playersElement) {
                serverUtils.updateServerStatus(server, function(status) {
                    if (status.online) {
                        playersElement.innerHTML = 'Players: ' + status.players + '/' + status.maxPlayers;
                        serverBox.className = serverBox.className.replace(' server-offline', '');
                    } else {
                        playersElement.innerHTML = 'Server Offline';
                        if (serverBox.className.indexOf('server-offline') === -1) {
                            serverBox.className += ' server-offline';
                        }
                    }
                });
            })(server, serverBox, playersElement);
        }
    }
    
    // Add the message about viewing more servers
    // First, remove any existing message to prevent duplication
    var existingMsg = document.getElementsByClassName('more-servers-message')[0];
    if (existingMsg) {
        existingMsg.parentNode.removeChild(existingMsg);
    }
    
    var moreServersMsg = document.createElement('div');
    moreServersMsg.className = 'more-servers-message';
    
    // Create link element with styling
    var linkText = document.createElement('span');
    linkText.innerHTML = 'You can view the rest of our servers on our website: ';
    
    var link = document.createElement('a');
    link.href = SharedConfig.links.website;
    link.innerHTML = 'zmod.gg/servers';
    link.className = 'server-link';
    link.target = '_blank'; // Open in new tab
    
    // Append elements to message container
    moreServersMsg.appendChild(linkText);
    moreServersMsg.appendChild(link);
    
    var serversContainer = document.getElementsByClassName('servers-container')[0];
    if (serversContainer) {
        serversContainer.appendChild(moreServersMsg);
    }
}

// Initialize the Servers tab
if (window.addEventListener) {
    window.addEventListener('load', initServersTab);
} else if (window.attachEvent) {
    window.attachEvent('onload', initServersTab);
}

function initServersTab() {
    if (window.serversTabInitialized) {
        return;
    }
    window.serversTabInitialized = true;
    
    // Initial update
    updateServersTab();
    
    // Optional: Add animation to make the tab slide in
    setTimeout(function() {
        var serversTab = document.getElementsByClassName('servers-tab')[0];
        if (serversTab) {
            serversTab.style.opacity = '1';
            serversTab.style.filter = 'alpha(opacity=100)';
        }
    }, 500);
    
    // Refresh server status every 60 seconds
    setInterval(updateServersTab, 60000);
} 
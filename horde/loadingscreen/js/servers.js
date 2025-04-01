// Server status update functionality
const serverUtils = {
    async fetchServerStatus(ip, port) {
        try {
            const response = await fetch(`https://gameserveranalytics.com/api/v2/query?game=source&ip=${ip}&port=${port}&type=info`);
            const serverInfo = await response.json();
            
            const status = {
                online: false,
                players: 0,
                maxPlayers: 0
            };

            if (serverInfo && (serverInfo.status?.toLowerCase() === 'online' || serverInfo.players !== undefined)) {
                status.online = true;
                status.players = serverInfo.players || serverInfo.num_players || serverInfo.playercount || 0;
                status.maxPlayers = serverInfo.maxplayers || serverInfo.max_players || serverInfo.maxclients || "?";
            }

            return status;
        } catch (error) {
            console.error(`Error fetching data for ${ip}:${port}:`, error);
            return { online: false, players: 0, maxPlayers: 0 };
        }
    },
    
    async updateServerStatus(server) {
        try {
            // Handle servers with multiple instances
            if (server.instances && server.instances.length > 0) {
                const statusPromises = server.instances.map(instance => 
                    this.fetchServerStatus(instance.ip, instance.port)
                );
                
                const statusResults = await Promise.all(statusPromises);
                
                // Calculate combined values
                const combinedStatus = {
                    online: statusResults.some(status => status.online),
                    players: 0,
                    maxPlayers: 0
                };
                
                // Sum up all player counts
                statusResults.forEach(status => {
                    if (status.online) {
                        combinedStatus.players += parseInt(status.players) || 0;
                        // For max players, only add numeric values
                        const maxPlayers = parseInt(status.maxPlayers);
                        if (!isNaN(maxPlayers)) {
                            combinedStatus.maxPlayers += maxPlayers;
                        }
                    }
                });
                
                return combinedStatus;
            } 
            // For backwards compatibility with old format
            else if (server.ip && server.port) {
                return await this.fetchServerStatus(server.ip, server.port);
            }
            
            return { online: false, players: 0, maxPlayers: 0 };
        } catch (error) {
            console.error(`Error updating status for ${server.id}:`, error);
            return { online: false, players: 0, maxPlayers: 0 };
        }
    }
};

// Function to update the Servers tab content
async function updateServersTab() {
    // Update header
    document.querySelector('.servers-header').textContent = SharedConfig.servers.headerTitle;
    
    // Clear and populate the servers grid
    const serversGrid = document.querySelector('.servers-grid');
    serversGrid.innerHTML = ''; // Clear existing content
    
    // Create and add server boxes
    for (const server of SharedConfig.servers.list) {
        // Create server box element
        const serverBox = document.createElement('div');
        serverBox.className = 'server-box';
        serverBox.id = `server-${server.id}`;
        
        // Create and populate title element
        const titleElement = document.createElement('h4');
        titleElement.className = 'server-box-title';
        titleElement.textContent = server.title;
        
        // Create and populate players element
        const playersElement = document.createElement('div');
        playersElement.className = 'server-box-players';
        playersElement.textContent = 'Players: Loading...';
        
        // Create and populate content element
        const contentElement = document.createElement('div');
        contentElement.className = 'server-box-content';
        contentElement.textContent = server.content;
        
        // Append all elements to the server box
        serverBox.appendChild(titleElement);
        serverBox.appendChild(playersElement);
        serverBox.appendChild(contentElement);
        
        // Add the server box to the grid
        serversGrid.appendChild(serverBox);
        
        // Fetch server status
        try {
            const status = await serverUtils.updateServerStatus(server);
            
            if (status.online) {
                playersElement.textContent = `Players: ${status.players}/${status.maxPlayers}`;
                serverBox.classList.remove('server-offline');
            } else {
                playersElement.textContent = 'Server Offline';
                serverBox.classList.add('server-offline');
            }
        } catch (error) {
            console.error(`Error updating status for ${server.id}:`, error);
            playersElement.textContent = 'Status Unavailable';
            serverBox.classList.add('server-error');
        }
    }
    
    // Add the message about viewing more servers
    // First, remove any existing message box to prevent duplication
    const existingMsg = document.querySelector('.more-servers-message');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    const moreServersMsg = document.createElement('div');
    moreServersMsg.className = 'more-servers-message';
    
    // Create link element with styling
    const linkText = document.createElement('span');
    
    // Check viewport width to determine the message text and layout
    const isSmallScreen = window.innerWidth <= 1366;
    linkText.textContent = isSmallScreen ? 'More: ' : 'You can view the rest of our servers on our website: ';
    
    const link = document.createElement('a');
    link.href = SharedConfig.links.website;
    link.textContent = 'zmod.gg/servers';
    link.className = 'server-link';
    link.target = '_blank'; // Open in new tab
    
    // Append elements to message container
    moreServersMsg.appendChild(linkText);
    
    // On small screens, we use column layout with each element on its own line
    if (isSmallScreen) {
        moreServersMsg.classList.add('column-layout');
    }
    
    moreServersMsg.appendChild(link);
    
    document.querySelector('.servers-container').appendChild(moreServersMsg);
}

// Initialize the Servers tab
document.addEventListener('DOMContentLoaded', () => {
    // Initial update
    updateServersTab();
    
    // Optional: Add animation to make the tab slide in
    setTimeout(() => {
        document.querySelector('.servers-tab').style.opacity = '1';
    }, 500);
    
    // Refresh server status every 60 seconds
    setInterval(updateServersTab, 60000);
}); 
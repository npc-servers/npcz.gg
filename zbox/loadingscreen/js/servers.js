// Configuration for the Other Servers tab
const serversConfig = {
    headerTitle: "Other Servers",
    servers: [
        {
            id: "npc-zombies",
            title: "NPC Zombies Vs. Players",
            ip: "193.243.190.18",
            port: "27015",
            content: "Fast-paced action with instant respawn and all weapons unlocked."
        },
        {
            id: "horde-wave",
            title: "Horde Wave Survival",
            ip: "193.243.190.18",
            port: "27065",
            content: "Team up with other players to survive waves of enemies."
        },
        {
            id: "zgrad",
            title: "ZGRAD US1",
            ip: "193.243.190.18",
            port: "27066",
            content: "Build and design your own maps with unlimited resources."
        }
    ],
    
    async updateServerStatus(server) {
        try {
            const response = await fetch(`https://gameserveranalytics.com/api/v2/query?game=source&ip=${server.ip}&port=${server.port}&type=info`);
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
            console.error(`Error fetching data for ${server.id}:`, error);
            return { online: false, players: 0, maxPlayers: 0 };
        }
    }
};

// Function to update the Servers tab content
async function updateServersTab() {
    // Update header
    document.querySelector('.servers-header').textContent = serversConfig.headerTitle;
    
    // Update the server boxes
    const boxes = document.querySelectorAll('.server-box');
    
    for (let index = 0; index < serversConfig.servers.length; index++) {
        if (index < boxes.length) {
            const server = serversConfig.servers[index];
            const box = boxes[index];
            
            // Update title and content
            box.querySelector('.server-box-title').textContent = server.title;
            box.querySelector('.server-box-content').textContent = server.content;
            
            // Update player count with loading indicator
            box.querySelector('.server-box-players').textContent = 'Players: Loading...';
            
            // Fetch server status
            try {
                const status = await serversConfig.updateServerStatus(server);
                
                if (status.online) {
                    box.querySelector('.server-box-players').textContent = `Players: ${status.players}/${status.maxPlayers}`;
                    box.classList.remove('server-offline');
                } else {
                    box.querySelector('.server-box-players').textContent = 'Server Offline';
                    box.classList.add('server-offline');
                }
            } catch (error) {
                console.error(`Error updating status for ${server.id}:`, error);
                box.querySelector('.server-box-players').textContent = 'Status Unavailable';
                box.classList.add('server-error');
            }
        }
    }
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
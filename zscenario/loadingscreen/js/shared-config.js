// Shared configuration for loading screens
const SharedConfig = {
    // UI Configuration
    ui: {
        enableMap: true,
        enableSteamID: false,
        enableAnnouncements: true,
        announceMessages: [
            "Don't forget to join the discord! discord.gg/npc",
            "Is a player breaking the rules? Report them in the discord!",
            "You can buy a rank on our website! store.npcz.gg",
            "We have other servers! Check the right side panel for more info!",
            "When you buy a rank on one server, you get it on all of them!"
        ],
        announcementLength: 7000,
        
        // Tips Configuration
        enableTips: true,
        tipRotationTime: 5000,
        tipMessages: [
            "You can message a player by typing !p [name] [message] in chat.",
            "Message online staff by typing @ [message] in chat.",
            "Get exclusive benefits on all of our servers by buying a rank! store.npcz.gg",
            
        ]
    },
    
    // Assets Configuration
    assets: {
        // Define all icons and logos here for easy management
        icons: {
            // Server section icons
            serverUpdates: '/assets/add_icon.png',
            otherServers: '/assets/npcz_logo.png',
            
            // Logo images
            serverIcon: '/assets/server_icon.png',
            
            // UI elements
            errorIcon: '/sandbox/loadingscreen/images/icons/error.png'
        },
        
        // Background images (if needed to centralize)
        backgrounds: [
            "/sandbox/loadingscreen/images/pov.jpg",
            "/sandbox/loadingscreen/images/paradise.jpg",
            "/sandbox/loadingscreen/images/warehouse.jpg",
            "/sandbox/loadingscreen/images/hallway.jpg"
        ]
    },

    // Servers Configuration
    servers: {
        headerTitle: "Other Servers",
        combinePlayerCounts: true, // New flag to enable combining player counts for servers with the same ID
        list: [
            {
                id: "zgrad",
                title: "ZGRAD",
                content: "Like TTT, but with extra steps. View and join the servers @ zgrad.gg/servers.",
                instances: [
                    {
                        ip: "193.243.190.18",
                        port: "27066"
                    },
                    {
                        ip: "193.243.190.18",
                        port: "27051"
                    },
                    {
                        ip: "193.243.190.18",
                        port: "27052"
                    },
                    {
                        ip: "193.243.190.18",
                        port: "27053"
                    },
                ]
            },
            {
                id: "sbox",
                title: "NPC Zombies Vs. Players",
                content: "A zombie survival sandbox server.",
                instances: [
                    {
                        ip: "193.243.190.18",
                        port: "27015"
                    }
                ]
            },
            {
                id: "horde",
                title: "NPCZ | Horde",
                content: "Team up with other players to survive waves of zombies.",
                instances: [
                    {
                        ip: "193.243.190.18",
                        port: "27065"
                    }
                ]
            }

        ]
    },

    // Links Configuration
    links: {
        discord: "https://discord.gg/npc",
        website: "https://zmod.gg/servers"
    }
};

if (typeof window !== 'undefined') {
    window.SharedConfig = SharedConfig;
} 

// Shared configuration for both legacy and modern loading screens
const SharedConfig = {
    // UI Configuration
    ui: {
        enableMap: true,
        enableSteamID: false,
        enableAnnouncements: true,
        announceMessages: [
            "Don't forget to join the discord! discord.gg/npc",
            "Is a player breaking the rules? Report them in the discord!",
            "Hopefully you enjoy this new loading screen!",
            "You can buy a rank on our website! store.npcz.gg",
            "We have other servers! Check the right side panel for more info!"
        ],
        announcementLength: 7000,
        
        // Tips Configuration
        enableTips: true,
        tipRotationTime: 5000,
        tipMessages: [
            "You can switch modes by typing !PVE or !PVP in chat.",
            "Press E on a player with Outfitter to view their playermodel.",
            "You can use /p to talk in Squad chat.",
            "You can make a squad by typing !squad in chat.",
            "You can message a player by typing !p [name] [message] in chat.",
            "Message online staff by typing @ [message] in chat.",
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
            zmodLogo: '/assets/zmod_logo.png',
            npczLogo: '/assets/npcz_logo.png',
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

    // Server Updates Configuration
    changes: {
        headerTitle: "Server Updates",
        mainUpdate: {
            title: "New Glide Vehicles",
            date: "March 20, 2025",
            content: "Added JB 700, Infernus, Insurgent Pickup."
        },
        updates: [
            {
                title: "PVP Balancing",
                date: "March 21, 2025",
                content: "Disabled crouching spamming mid-air."
            },
            {
                title: "New Map",
                date: "March 16, 2025",
                content: "Added gm_windswept. Fear the wind."
            }
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
                id: "horde",
                title: "NPCZ | Horde",
                content: "Team up with other players to survive waves of zombies.",
                instances: [
                    {
                        ip: "193.243.190.18",
                        port: "27065"
                    }
                ]
            },
            {
                id: "zbox",
                title: "ZBox",
                content: "A vanilla sandbox server.",
                instances: [
                    {
                        ip: "193.243.190.18",
                        port: "27064"
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

// For legacy JavaScript support
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SharedConfig;
} else if (typeof window !== 'undefined') {
    window.SharedConfig = SharedConfig;
} 
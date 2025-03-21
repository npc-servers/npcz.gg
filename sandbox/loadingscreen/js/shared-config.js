// Shared configuration for both legacy and modern loading screens
const SharedConfig = {
    // UI Configuration
    ui: {
        enableMap: true,
        enableSteamID: false,
        enableAnnouncements: true,
        announceMessages: [
            "Enjoy your stay!",
            "Don't forget to join the discord! discord.gg/npc",
            "Is a player breaking the rules? Report them in the discord!",
            "Look how fast you load in!",
            "A custom version of M9K for extra fun!",
            "Got any suggestions? Let us know in the discord!",
            "This is in fact a loading screen!",
            "Simplisticy is quality on its own",
            "Do people even read these?",
            "I sure hope so!"
        ],
        announcementLength: 7000,
        
        // Tips Configuration
        enableTips: true,
        tipRotationTime: 5000,
        tipMessages: [
            "Press F1 to access the server menu",
            "Join our Discord server for community events",
            "Report bugs in our Discord",
            "Type !help in chat for commands",
            "Press TAB to see the scoreboard",
            "Check the server rules",
            "Customize your character in settings",
            "New content added monthly",
            "Join events for special rewards",
            "Be respectful to other players"
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
            title: "Excessive Teamkilling",
            date: "March 16, 2025",
            content: "We've implmeneted a system that will punish players for excessive teamkilling."
        },
        updates: [
            {
                title: "New Weapons",
                date: "June 10, 2023",
                content: "Added 5 new weapons to the arsenal including the Plasma Rifle and Quantum Blaster."
            },
            {
                title: "Map Updates",
                date: "June 5, 2023",
                content: "Redesigned the central plaza and added new secret areas to explore."
            }
        ]
    },

    // Servers Configuration
    servers: {
        headerTitle: "Other Servers",
        list: [
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
        ]
    },

    // Links Configuration
    links: {
        discord: "https://discord.gg/npc",
        website: "https://zgrad.gg/servers"
    }
};

// For legacy JavaScript support
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SharedConfig;
} else if (typeof window !== 'undefined') {
    window.SharedConfig = SharedConfig;
} 
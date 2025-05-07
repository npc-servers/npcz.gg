// Rules configuration file
// This central configuration file contains all rule definitions
// to be used by both the modern and legacy rules scripts

const rulesConfig = {
    'common-sense': {
        title: 'Common Sense',
        rules: [
            {id: 'no-harassment', title: 'Harassment', description: 'Do not harass/intentionally annoy other players.'},
            {id: 'no-mic-spam', title: 'Mic Spam', description: 'Mic Spamming/earraping is not allowed.'},
            {id: 'english-only', title: 'English Only in All-Chat', description: 'We are an english speaking server, so keep all-chat in english. You can use other languages in PMs/Near/Squads.'},
            {id: 'no-cheating', title: 'Cheating/Exploiting', description: 'Modifying your game to provide an unfair advantage (cheating/exploiting) is against the rules.'},
            {id: 'no-lag', title: 'Server Disruption', description: 'Intentionally lagging/crashing the server is not allowed.'},
            {id: 'no-dox', title: 'Doxxing/DDoS', description: 'Threatening or attempting to dox/DDoS other players will result in a permanent ban.'},
            {id: 'no-advertising', title: 'Advertising', description: 'Advertising/recruiting in the server (Discord invites, clan recruiting, or server promotion) is not allowed.'},
            {id: 'no-nsfw', title: 'NSFW Content', description: 'NSFW Content is not allowed.'},
            {id: 'no-offensive', title: 'Offensive Behavior', description: 'Do not engage in/use offensive behavior or language.'},
            {id: 'no-retaliation', title: 'Rule Breaking Retaliation', description: 'Do not break rules because someone else is breaking them; you will also be punished.'}
        ]
    },
    'prop-abuse': {
        title: 'Prop Abuse',
        rules: [
            {id: 'no-prop-push', title: 'Prop Push/Kill', description: 'Do not prop push or prop kill under any circumstances, Gravgun propkill in PVP is except from this.'},
            {id: 'no-prop-entry', title: 'Unauthorized Base Entry', description: 'Using props/vehicles to enter peoples bases is not allowed.'},
            {id: 'no-prop-spam', title: 'Prop Spam', description: 'Do not prop spam, doing this may result in a ban without warning!'},
            {id: 'no-blocking', title: 'Map Blocking', description: 'Blocking off large parts of the map, including roads and spawnpoints, is not allowed.'},
            {id: 'no-skybox', title: 'Skybox Building', description: 'Do not build in the skybox.'},
            {id: 'no-unauthorized-props', title: 'Unauthorized Props', description: 'Do not spawn props/entities in or on a player\'s build/base without permission. This includes spawnpoints.'},
            {id: 'no-prop-access', title: 'Unauthorized Access Methods', description: 'Do not use props or balloons to gain access to a player\'s build/base. Propflying for map traversal is allowed.'}
        ]
    },
    'pve-pvp': {
        title: 'PVE/PVP',
        rules: [
            {id: 'pve-advantage', title: 'PVE Advantage', description: 'You may not use PVE mode to gain, or provide another player(s) any form of advantage in PVP.'},
            {id: 'playermodel-restrictions', title: 'Playermodel Restrictions', description: 'In PVP, equipping a smaller than average playermodel while in pvp mode is not allowed, same goes for playermodels that look normal but have smaller than usual hitboxes. If you are in PVE mode you are exempt from this rule.'},
            {id: 'map-boundaries', title: 'Map Boundaries', description: 'Attacking players from outside the map or inside a space that isn\'t accessible is not allowed.'},
            {id: 'pve-killing', title: 'PVE Killing', description: 'While in PVE mode you are not allowed to kill other players in any way.'},
            {id: 'pve-blocking', title: 'PVE Blocking', description: 'Do not use PVE mode to body block entries or areas.'},
            {id: 'pve-base-respect', title: 'PVE Base Respect', description: 'While in PVE mode, you must leave a PVP player\'s base if they ask you to.'}
        ]
    },
    'basing': {
        title: 'Basing',
        rules: [
            {id: 'keypad-access', title: 'Keypad Access', description: 'In PVP, doors must have an easily accessible and visible keypad or button within close proximity for entering.'},
            {id: 'keypad-restrictions', title: 'Keypad Restrictions', description: 'In PVP, you are not allowed to use keypads to disorient a raider (eg. multiple keypads for 1 door).'},
            {id: 'prop-blocking', title: 'Prop Blocking', description: 'Using props to block off areas without keypads is not allowed. If you are in PVE mode you are exempt from this rule.'},
            {id: 'pve-base-shooting', title: 'PVE Base Shooting', description: 'If you have a base in PVE you cannot let PVP players shoot out of it.'},
            {id: 'base-accessibility', title: 'Base Accessibility', description: 'Bases must be completely enterable without crouching/obstruction.'},
            {id: 'door-limits', title: 'Door Limits', description: 'Bases can have a maximum of 4 doors per entrance.'}
        ]
    },
    'wiremod': {
        title: 'Wiremod/E2/Starfall/Contraptions',
        rules: [
            {id: 'malicious-intent', title: 'Malicious Intent', description: 'If you wouldn\'t fight it, don\'t use it! Anything built for malicious intent is not allowed.'},
            {id: 'zombie-contraptions', title: 'Zombie Contraptions', description: 'Contraptions designed to automatically kill zombies in a large radius are not allowed. You are exempt from this rule if you are base building.'},
            {id: 'contraption-health', title: 'Contraption Health', description: 'If the intentions of the contraption is to fight with it you MUST have contraption health core present on the contraption. (see the construction tools section)'},
            {id: 'contraption-power', title: 'Contraption Power', description: 'Contraptions should be equal in power to their Simfphys and LFS counterparts.'},
            {id: 'drone-restrictions', title: 'Drone Restrictions', description: 'Drone contraptions are not allowed. You can use our counterparts in the entities tab or the !shop.'},
            {id: 'player-targeting', title: 'Player Targeting', description: 'Player targeting is not allowed. Using radars, Tracking Turrets, commands, or anything related is not allowed. This also includes player blinders and teleportation jails.'},
            {id: 'optimization', title: 'Optimization', description: 'Builds and contraptions must be optimized: paste without constraints, Prop2Mesh it, or rebuild it to be simpler. If your build degrades server or client performance, it will be deleted.'}
        ]
    }
};

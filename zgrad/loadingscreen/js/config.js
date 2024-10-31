// config.js
var Config = {};

/**
 * Enable map text in the top left corner of the screen?
 */
Config.enableMap = true;

/**
 * The prefix text before the map name
 */
Config.mapPrefix = "You're playing on ";

/**
 * The suffix text for player count
 */
Config.playerCountSuffix = " slots";

/**
 * Enable custom text in the top right corner of the screen?
 */
Config.enableCustomText = true;

/**
 * The custom texts to display in the top right corner
 * only works if enableCustomText = true
 */
Config.customTexts = [
    "Fully translated, no lag.",
    "Best Gmod Server!",
    "Join our community!",
    "Welcome to ZGRAD!"
];

/**
 * Enable rotating titles?
 */
Config.enableRotatingTitles = true;

/**
 * What messages do you want to show in the title?
 * only works if enableRotatingTitles = true
 */
Config.titleMessages = [
    {
        heading: "VISIT US",
        subheading: "ZGRAD.US/DISCORD"
    },
    {
        heading: "JOIN NOW",
        subheading: "BEST GMOD SERVER"
    },
    {
        heading: "WELCOME",
        subheading: "TO THE COMMUNITY"
    }
];

/**
 * How many milliseconds between title rotations?
 * only works if enableRotatingTitles = true
 */
Config.rotationLength = 5000;

/**
 * What messages do you want to show up?
 * only works if enableAnnouncements = true
 */
Config.announceMessages = [
    "Enjoy your stay!",
    "Don't forget to join the discord! discord.gg/npc",
    "Is a player breaking the rules? Report them in the discord!",
    "Look how fast you load in!",
    "A custom version of M9K for extra fun!",
    "Got any suggestions? Let us know in the discord!",
    "This is in fact a loading screen!",
    "Simplisticy is quality on its own",
    "Do people even read these?",
    "I sure hope so!",
];

/**
 * Enable announcements?
 */
Config.enableAnnouncements = true;

/**
 * How many milliseconds for each announcement?
 * only works if enableAnnouncements = true
 */
Config.announcementLength = 3000;
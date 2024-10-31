// config.js
var Config = {};

/**
 * Enable map text in the top left corner of the screen?
 */
Config.enableMap = true;

/**
 * Enable custom text in the top right corner of the screen?
 */
Config.enableCustomText = true;

/**
 * The custom text to display in the top right corner
 * only works if enableCustomText = true
 */
Config.customText = "Fully translated, no lag.";

/**
 * Enable announcements?
 */
Config.enableAnnouncements = true;

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
Config.titleRotationLength = 5000;

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
 * How many miliseconds for each announcement?
 * only works if enableAnnouncements = true
 */
Config.announcementLength = 3000;
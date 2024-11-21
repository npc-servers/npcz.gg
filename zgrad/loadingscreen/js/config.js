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
    "Fully translated from Russian to English.",
    "A real AMERICAN server.",
    "Actively maintained and developed.",
    "Welcome to ZGRAD!",
    "Operated by NPCZ.GG",
    "Visit our store: store.npcz.gg/zgrad"
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
        heading: "THE BEST HOMIGRAD EXPERIENCE?",
        subheading: "THAT'S US."
    },
    {
        heading: "FOLLOW OUR SOCIALS",
        subheading: "ZGRAD.US/SOCIALS"
    },
    {
        heading: "USE CODE \"LAUNCH\"",
        subheading: "FOR 25% OFF RANKS - !DONATE"
    },
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
    "Get help or report players in the #support channel on our Discord.",
    "Be sure to join our Discord: zgrad.us/discord",
    "Press F2 to open our settings menu!",
    "We bind all necessary game functions by default!",
    "Found a bug or have a suggestion? Post about it on our Discord!"
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
// Add to config.js
Config.tipMessages = [
    "Press F2 to access the settings menu.",
    "Press G to ragdoll or get up.",
    "While unconcious, type !endit to kill yourself."
];

Config.sidePanelMessages = [
    {
        header: "HOMICIDE OVERVIEW",
        content: "A TTT like gamemode. Traitors have to kill everyone, and innocents have to find and apprehend or kill the traitors to win. Wild West is a modifier that gives all players revolvers. "
    },
    {
        header: "LATEST UPDATE",
        content: "New weapons and maps have been added! Check our Discord for the full changelog."
    },
    {
        header: "EVENTS",
        content: "Join us every Saturday at 8PM EST for special community events!"
    }
];

Config.sidePanelRotationLength = 15000; // 15 seconds
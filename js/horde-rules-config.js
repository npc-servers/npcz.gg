// Rules configuration file
// This central configuration file contains all rule definitions
// to be used by both the modern and legacy rules scripts

const rulesConfig = {
    'behavior': {
        title: 'Use Common Sense',
        rules: [
            {id: 'no-slurs', title: 'Slurs', description: 'No use of homophobic and racial slurs are permitted. Homophobic & Racial slurs are strictly prohibited, no matter the context. Saying/promoting these terms will get you banned.'},
            {id: 'no-harassment', title: 'Harassment', description: 'Do not harass or intentionally annoy other players.'},
            {id: 'no-mic-spam', title: 'Mic Spam', description: 'Mic Spamming/earraping is not allowed.'},
            {id: 'english-only', title: 'English Only in All-Chat', description: 'We are an english speaking server, so keep all-chat in english. You can use other languages in PMs/Near/Squads.'},
            {id: 'no-cheating', title: 'Cheating/Exploiting', description: 'Modifying your game to provide an unfair advantage (cheating/exploiting) is against the rules.'},
            {id: 'no-lag', title: 'Server Disruption', description: 'Intentionally lagging/crashing the server is not allowed.'},
            {id: 'no-dox', title: 'Doxxing/DDoS', description: 'Threatening or attempting to dox/DDoS other players will result in a permanent ban.'},
            {id: 'no-advertising', title: 'Advertising', description: 'Advertising/recruiting in the server (Discord invites, clan recruiting, or server promotion) is not allowed.'},
            {id: 'no-nsfw', title: 'NSFW Content', description: 'NSFW Content is not allowed.'},
            {id: 'no-offensive', title: 'Offensive Behavior', description: 'Do not engage in/use offensive behavior or language.'},
            {id: 'no-retaliation', title: 'Rule Breaking Retaliation', description: 'Do not break rules because someone else is breaking them; you will also be punished.'},
            {id: 'no-politics', title: 'Politics/Sensitive Topics', description: 'Topics about politics, shootings, ongoing wars, illegal content, etc, are highly discouraged, and will result in a punishment by staff.'},
            {id: 'respect-players', title: 'Respect All Players', description: 'Treat everyone with respect. Excessive Harassment, hate speech, and personal attacks will not be tolerated.'},
            {id: 'follow-admins', title: 'Follow Admin Instructions', description: 'Always listen to the admins and moderators. Their word is final.'}
        ]
    }
};

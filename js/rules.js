// Rules data structure
const rulesData = {
    'common-sense': {
        title: 'Common Sense',
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
    },
    'prop-abuse': {
        title: 'Prop Abuse',
        rules: [
            {id: 'no-griefing', title: 'Griefing', description: 'Avoid behavior that disrupts the game experience for others, including excessive mic spam, punching & searching players without valid reason, or other forms of disruptive gameplay.'},
            {id: 'no-prop-push', title: 'Prop Push/Kill', description: 'Do not prop push or prop kill under any circumstances.'},
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
            {id: 'no-rdm', title: 'RDM', description: 'Killing other players without a valid reason is prohibited. Roleplay interactions must be meaningful.'},
            {id: 'no-teamkilling', title: 'Teamkilling', description: 'Do not kill your teammates.'},
            {id: 'no-revenge', title: 'Revenge RDM', description: 'If you are RDM\'d, do not attempt to RDM the player back. Report it to an admin.'},
            {id: 'no-metagaming', title: 'Metagaming', description: 'Do not use knowledge gained from out-of-character sources (Private Voice-chats/Direct Messages) to influence your in-game decisions.'},
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
            {id: 'stay-inbounds', title: 'Stay Inbounds', description: 'Do not abuse mechanics to get out of bounds on maps.'},
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
            {id: 'no-exploiting', title: 'Exploiting/Cheating', description: 'Do not exploit bugs or glitches in the game. Report any issues to the server admins instead.'},
            {id: 'malicious-intent', title: 'Malicious Intent', description: 'If you wouldn\'t fight it, don\'t use it! Anything built for malicious intent is not allowed.'},
            {id: 'zombie-contraptions', title: 'Zombie Contraptions', description: 'Contraptions designed to automatically kill zombies in a large radius are not allowed. You are exempt from this rule if you are base building.'},
            {id: 'contraption-health', title: 'Contraption Health', description: 'If the intentions of the contraption is to fight with it you MUST have contraption health core present on the contraption. (see the construction tools section)'},
            {id: 'contraption-power', title: 'Contraption Power', description: 'Contraptions should be equal in power to their Glide counterparts.'},
            {id: 'drone-restrictions', title: 'Drone Restrictions', description: 'Drone contraptions are not allowed. You can use our counterparts in the entities tab or the !shop.'},
            {id: 'player-targeting', title: 'Player Targeting', description: 'Player targeting is not allowed. Using radars, Tracking Turrets, commands, or anything related is not allowed. This also includes player blinders and teleportation jails.'},
            {id: 'optimization', title: 'Optimization', description: 'Builds and contraptions must be optimized: paste without constraints, Prop2Mesh it, or rebuild it to be simpler. If your build degrades server or client performance, it will be deleted.'}
        ]
    }
};

// Helper functions for UI interactions
function createRuleCard(rule) {
    const card = document.createElement('div');
    card.id = rule.id;
    card.className = 'rule-card';
    
    const header = document.createElement('div');
    header.className = 'rule-header';
    
    const title = document.createElement('h2');
    title.className = 'rule-title';
    title.textContent = rule.title;
    
    const actions = document.createElement('div');
    actions.className = 'rule-actions';
    
    const linkBtn = document.createElement('button');
    linkBtn.className = 'copy-link';
    linkBtn.title = 'Copy link to rule';
    linkBtn.innerHTML = '<i class="fas fa-link"></i>';
    linkBtn.addEventListener('click', () => copyLink(rule.id));
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-text';
    copyBtn.title = 'Copy rule text';
    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    copyBtn.addEventListener('click', (e) => copyText(e.currentTarget));
    
    actions.appendChild(linkBtn);
    actions.appendChild(copyBtn);
    
    header.appendChild(title);
    header.appendChild(actions);
    
    const description = document.createElement('div');
    description.className = 'rule-description';
    description.textContent = rule.description;
    
    card.appendChild(header);
    card.appendChild(description);
    
    return card;
}

function createRuleCategory(categoryKey, categoryData) {
    const category = document.createElement('div');
    category.className = 'rule-category';
    
    const header = document.createElement('div');
    header.className = 'category-header';
    
    const title = document.createElement('h2');
    title.textContent = categoryData.title;
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-chevron-down';
    
    header.appendChild(title);
    header.appendChild(icon);
    
    const content = document.createElement('div');
    content.className = 'category-content';
    
    // Create and append rule cards
    categoryData.rules.forEach(rule => {
        content.appendChild(createRuleCard(rule));
    });
    
    category.appendChild(header);
    category.appendChild(content);
    
    return category;
}

function buildRulesUI() {
    const container = document.createElement('div');
    container.className = 'container';
    
    const title = document.createElement('h1');
    title.className = 'title';
    title.textContent = 'Server Rules';
    container.appendChild(title);
    
    const quickLinks = document.createElement('div');
    quickLinks.className = 'quick-links';
    
    const links = [
        { href: 'https://discord.gg/npc', text: 'discord.gg/npc' },
        { href: 'https://npcz.gg', text: 'npcz.gg' },
        { href: 'https://store.npcz.gg', text: 'store.npcz.gg' }
    ];
    
    links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.href;
        a.target = '_blank';
        a.textContent = link.text;
        quickLinks.appendChild(a);
    });
    
    container.appendChild(quickLinks);
    
    // Create rule categories
    Object.keys(rulesData).forEach(categoryKey => {
        container.appendChild(createRuleCategory(categoryKey, rulesData[categoryKey]));
    });
    
    // Add disclaimer
    const disclaimer = document.createElement('div');
    disclaimer.className = 'disclaimer';
    
    const disclaimerText = document.createElement('p');
    disclaimerText.textContent = 'Failure to adhere to these rules may result in warnings, temporary bans, or permanent bans at the discretion of the admins. If you have doubts about saying or doing something, chances are that it\'s not allowed.';
    
    const ownership = document.createElement('p');
    ownership.className = 'ownership';
    ownership.textContent = 'Powered by ZMOD.GG';
    
    disclaimer.appendChild(disclaimerText);
    disclaimer.appendChild(ownership);
    
    container.appendChild(disclaimer);
    
    return container;
}

// Function to handle category toggling
function toggleCategory(header, skipScroll = false) {
    const content = header.nextElementSibling;
    const isActive = header.classList.contains('active');
    
    // Toggle current category
    header.classList.toggle('active');
    content.classList.toggle('active');
    
    // Scroll into view if opening and not skipping scroll
    if (!isActive && !skipScroll) {
        setTimeout(() => {
            header.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}

// Copy link to rule
function copyLink(ruleId) {
    const url = window.location.href.split('#')[0] + '#' + ruleId;
    navigator.clipboard.writeText(url).then(() => {
        const button = document.querySelector(`#${ruleId} .copy-link`);
        addClickAnimation(button);
        showNotification('Link copied to clipboard!');
    });
}

// Copy rule text
function copyText(button) {
    const ruleCard = button.closest('.rule-card');
    const description = ruleCard.querySelector('.rule-description').textContent;
    navigator.clipboard.writeText(description).then(() => {
        addClickAnimation(button);
        showNotification('Rule text copied to clipboard!');
    });
}

// Helper function to copy text to clipboard
function copyToClipboard(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    
    textarea.select();
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Failed to copy text:', err);
    }
    
    document.body.removeChild(textarea);
}

// Show toast message
function showToast(message) {
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(function() {
        document.body.removeChild(toast);
    }, 3000);
}

// Handle hash links
function handleHash() {
    const hash = window.location.hash;
    if (hash) {
        const ruleId = hash.substring(1);
        const ruleElement = document.getElementById(ruleId);
        if (ruleElement) {
            const category = ruleElement.closest('.rule-category');
            if (category) {
                const header = category.querySelector('.category-header');
                // Only toggle if the category is not already active
                if (!header.classList.contains('active')) {
                    toggleCategory(header, false); // Allow scrolling for hash navigation
                }
                // Remove highlight from any previously highlighted rules
                document.querySelectorAll('.rule-card').forEach(card => {
                    card.classList.remove('highlight');
                });
                // Add highlight to the target rule
                ruleElement.classList.add('highlight');
                // Smooth scroll with delay to ensure animation completes
                setTimeout(() => {
                    ruleElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        }
    }
}

// Collapse all rules except the target
function collapseAllExcept(targetId) {
    document.querySelectorAll('.rule-card').forEach(card => {
        if (card.id !== targetId) {
            card.classList.remove('expanded');
        }
    });
}

// Notification related functions
function createNotification() {
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    document.body.appendChild(notification);
    return notification;
}

function showNotification(message) {
    const notification = document.querySelector('.copy-notification') || createNotification();
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

function addClickAnimation(button) {
    button.classList.add('clicked');
    setTimeout(() => {
        button.classList.remove('clicked');
    }, 300);
}

// Initialize rules functionality
function initRules() {
    // Create the overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    
    // Create the rules container
    const rulesContainer = document.createElement('div');
    rulesContainer.className = 'rules-container';
    document.body.appendChild(rulesContainer);
    
    // Build and append the UI
    rulesContainer.appendChild(buildRulesUI());
    
    // Set animation order for rule cards
    document.querySelectorAll('.rule-card').forEach((card, index) => {
        card.style.setProperty('--animation-order', index);
    });

    // Add manual click handler for category headers
    document.querySelectorAll('.category-header').forEach(header => {
        header.addEventListener('click', () => {
            toggleCategory(header, false); // Allow scrolling for manual clicks
        });
    });

    // Handle rule card clicks
    document.querySelectorAll('.rule-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't toggle if clicking on action buttons
            if (!e.target.closest('.rule-actions')) {
                card.classList.toggle('expanded');
                collapseAllExcept(card.id);
            }
        });
    });

    // Open first category by default without scrolling
    const firstHeader = document.querySelector('.category-header');
    if (firstHeader) {
        firstHeader.classList.add('active');
        firstHeader.nextElementSibling.classList.add('active');
    }
    
    // Handle hash links
    handleHash();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHash);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initRules); 
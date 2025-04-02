// Use the shared rules configuration
const rulesData = rulesConfig;

// Helper functions for UI interactions
function createRuleCard(rule, index) {
    const card = document.createElement('div');
    card.id = rule.id;
    card.className = 'rule-card';
    
    // Create wrapper for content with number and description
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'rule-content-wrapper';
    
    // Add rule number
    const ruleNumber = document.createElement('div');
    ruleNumber.className = 'rule-number';
    ruleNumber.textContent = index + 1;
    
    // Create text container
    const textContainer = document.createElement('div');
    textContainer.className = 'text-container';
    
    // Create and add description with the text only
    const description = document.createElement('span');
    description.className = 'rule-description';
    description.textContent = rule.description;
    
    // Create actions for copy functionality
    const actions = document.createElement('span');
    actions.className = 'rule-actions';
    
    const linkBtn = document.createElement('button');
    linkBtn.title = 'Copy link to rule';
    linkBtn.innerHTML = '<i class="fas fa-link"></i>';
    linkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        copyLink(rule.id);
    });
    
    const copyBtn = document.createElement('button');
    copyBtn.title = 'Copy rule text';
    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        copyText(copyBtn);
    });
    
    actions.appendChild(linkBtn);
    actions.appendChild(copyBtn);
    
    // Append elements in proper order
    textContainer.appendChild(description);
    textContainer.appendChild(actions);
    
    contentWrapper.appendChild(ruleNumber);
    contentWrapper.appendChild(textContainer);
    
    card.appendChild(contentWrapper);
    
    return card;
}

function createRuleCategory(categoryKey, categoryData, index) {
    const category = document.createElement('div');
    category.className = 'rule-category';
    
    const header = document.createElement('div');
    header.className = 'category-header';
    
    // Add category number
    const categoryNumber = document.createElement('div');
    categoryNumber.className = 'category-number';
    
    // Add span inside for better positioning in all browsers
    const numberSpan = document.createElement('span');
    numberSpan.textContent = index + 1;
    categoryNumber.appendChild(numberSpan);
    
    const title = document.createElement('h2');
    title.textContent = categoryData.title;
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-chevron-down';
    
    header.appendChild(categoryNumber);
    header.appendChild(title);
    header.appendChild(icon);
    
    const content = document.createElement('div');
    content.className = 'category-content';
    
    // Create and append rule cards
    categoryData.rules.forEach((rule, index) => {
        content.appendChild(createRuleCard(rule, index));
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
    Object.keys(rulesData).forEach((categoryKey, index) => {
        container.appendChild(createRuleCategory(categoryKey, rulesData[categoryKey], index));
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
        const button = document.querySelector(`#${ruleId} .rule-actions button:first-child`);
        addClickAnimation(button);
        showNotification('Link copied to clipboard!');
    });
}

// Copy rule text
function copyText(button) {
    const ruleCard = button.closest('.rule-card');
    const description = ruleCard.querySelector('.rule-description').textContent.trim();
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
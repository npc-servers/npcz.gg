var rulesData = {};
for (var category in rulesConfig) {
    rulesData[category] = rulesConfig[category].rules;
}

// Toggle category dropdown
function toggleCategory(header, skipScroll) {
    var content = header.nextSibling;
    while(content && content.nodeType != 1) {
        content = content.nextSibling;
    }
    
    var isActive = header.className.indexOf('active') !== -1;
    
    // Toggle current category
    if (isActive) {
        header.className = header.className.replace(' active', '');
        content.className = content.className.replace(' active', '');
    } else {
        header.className += ' active';
        content.className += ' active';
        
        // Scroll into view if opening and not skipping scroll
        if (!skipScroll) {
            setTimeout(function() {
                header.scrollIntoView();
            }, 100);
        }
    }
}

// Copy link to rule
function copyLink(ruleId) {
    var url = window.location.href.split('#')[0] + '#' + ruleId;
    copyToClipboard(url);
    showToast('Link copied to clipboard!');
}

// Copy rule text
function copyText(button) {
    var ruleCard = button;
    while(ruleCard && !ruleCard.className.match(/\brule-card\b/)) {
        ruleCard = ruleCard.parentNode;
    }
    var description = ruleCard.getElementsByClassName('rule-description')[0].textContent;
    copyToClipboard(description);
    showToast('Rule text copied to clipboard!');
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

// Create rule card element
function createRuleCard(rule) {
    var card = document.createElement('div');
    card.id = rule.id;
    card.className = 'rule-card';
    
    var header = document.createElement('div');
    header.className = 'rule-header';
    
    var title = document.createElement('h2');
    title.className = 'rule-title';
    title.textContent = rule.title;
    
    var actions = document.createElement('div');
    actions.className = 'rule-actions';
    
    var linkBtn = document.createElement('button');
    linkBtn.title = 'Copy link to rule';
    linkBtn.onclick = function() { copyLink(rule.id); };
    linkBtn.innerHTML = '<i class="icon-link"></i>';
    
    var copyBtn = document.createElement('button');
    copyBtn.title = 'Copy rule text';
    copyBtn.onclick = function() { copyText(this); };
    copyBtn.innerHTML = '<i class="icon-copy"></i>';
    
    actions.appendChild(linkBtn);
    actions.appendChild(copyBtn);
    
    header.appendChild(title);
    header.appendChild(actions);
    
    var description = document.createElement('div');
    description.className = 'rule-description';
    description.textContent = rule.description;
    
    card.appendChild(header);
    card.appendChild(description);
    
    return card;
}

// Initialize
window.onload = function() {
    // Populate rule categories
    var categories = document.getElementsByClassName('category-content');
    var categoryData = {
        0: rulesData['common-sense'],
        1: rulesData['prop-abuse'],
        2: rulesData['pve-pvp'],
        3: rulesData['basing'],
        4: rulesData['wiremod']
    };
    
    for (var i = 0; i < categories.length; i++) {
        var rules = categoryData[i];
        if (rules) {
            for (var j = 0; j < rules.length; j++) {
                categories[i].appendChild(createRuleCard(rules[j]));
            }
        }
    }
    
    // Open first category by default without scrolling
    var firstHeader = document.getElementsByClassName('category-header')[0];
    if (firstHeader) {
        // Directly apply active classes without scrolling
        firstHeader.className += ' active';
        var firstContent = firstHeader.nextSibling;
        while(firstContent && firstContent.nodeType != 1) {
            firstContent = firstContent.nextSibling;
        }
        if (firstContent) {
            firstContent.className += ' active';
        }
    }
    
    // Add click handlers for category headers
    var categoryHeaders = document.getElementsByClassName('category-header');
    for (var i = 0; i < categoryHeaders.length; i++) {
        (function(header) {
            header.onclick = function() {
                toggleCategory(header, false); // Allow scrolling for manual clicks
            };
        })(categoryHeaders[i]);
    }
    
    // Handle hash links
    handleHash();
};

// Handle hash links
function handleHash() {
    var hash = window.location.hash;
    if (hash) {
        var ruleId = hash.substring(1);
        var ruleElement = document.getElementById(ruleId);
        if (ruleElement) {
            var category = ruleElement;
            while(category && !category.className.match(/\brule-category\b/)) {
                category = category.parentNode;
            }
            if (category) {
                var header = category.getElementsByClassName('category-header')[0];
                // Only toggle if the category is not already active
                if (header.className.indexOf('active') === -1) {
                    toggleCategory(header, false); // Allow scrolling for hash navigation
                }
                // Smooth scroll with delay to ensure animation completes
                setTimeout(function() {
                    ruleElement.scrollIntoView();
                }, 300);
            }
        }
    }
}

// Handle hash changes
window.onhashchange = handleHash; 
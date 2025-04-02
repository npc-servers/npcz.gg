var rulesData = {};
for (var category in rulesConfig) {
    rulesData[category] = rulesConfig[category].rules;
}

// Check if device is mobile
function isMobile() {
    return window.innerWidth <= 768;
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
        // On mobile, close all other categories first for better UX
        if (isMobile()) {
            var allHeaders = document.getElementsByClassName('category-header');
            for (var i = 0; i < allHeaders.length; i++) {
                if (allHeaders[i] !== header && allHeaders[i].className.indexOf('active') !== -1) {
                    toggleCategory(allHeaders[i], true);
                }
            }
        }
        
        header.className += ' active';
        content.className += ' active';
        
        // Scroll into view if opening and not skipping scroll
        if (!skipScroll) {
            setTimeout(function() {
                header.scrollIntoView({behavior: 'smooth'});
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
function createRuleCard(rule, index) {
    var card = document.createElement('div');
    card.id = rule.id;
    card.className = 'rule-card';
    
    var header = document.createElement('div');
    header.className = 'rule-header';
    
    var numberContainer = document.createElement('div');
    numberContainer.className = 'rule-number';
    numberContainer.textContent = index + 1;
    
    var title = document.createElement('h2');
    title.className = 'rule-title';
    title.textContent = rule.title;
    
    var actions = document.createElement('div');
    actions.className = 'rule-actions';
    actions.style.position = 'absolute';
    actions.style.right = '0';
    actions.style.top = '0';
    
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
    
    header.appendChild(numberContainer);
    header.appendChild(title);
    header.appendChild(actions);
    
    // Clear float
    var clearDiv = document.createElement('div');
    clearDiv.style.clear = 'both';
    header.appendChild(clearDiv);
    
    var description = document.createElement('div');
    description.className = 'rule-description';
    description.textContent = rule.description;
    
    card.appendChild(header);
    card.appendChild(description);
    
    return card;
}

// Create category element
function createCategoryElement(categoryKey, categoryData) {
    var category = document.createElement('div');
    category.className = 'rule-category';
    
    // Create header
    var header = document.createElement('div');
    header.className = 'category-header';
    
    var title = document.createElement('h2');
    title.textContent = categoryData.title;
    
    var icon = document.createElement('i');
    icon.className = 'icon-chevron-down';
    
    header.appendChild(title);
    header.appendChild(icon);
    
    // Create content container
    var content = document.createElement('div');
    content.className = 'category-content';
    
    // Add rules to content
    var rules = categoryData.rules;
    if (rules) {
        for (var i = 0; i < rules.length; i++) {
            content.appendChild(createRuleCard(rules[i], i));
        }
    }
    
    // Add click handler
    header.onclick = function() {
        toggleCategory(header, false);
    };
    
    // Assemble category
    category.appendChild(header);
    category.appendChild(content);
    
    return category;
}

// Initialize
window.onload = function() {
    // Get the container for rule categories
    var container = document.getElementById('rule-categories-container');
    
    // Clear any placeholder content
    container.innerHTML = '';
    
    // Get categories from rulesConfig
    var categoryKeys = Object.keys(rulesConfig);
    var firstHeader = null;
    
    // Create and append category elements
    for (var i = 0; i < categoryKeys.length; i++) {
        var categoryKey = categoryKeys[i];
        var categoryElement = createCategoryElement(categoryKey, rulesConfig[categoryKey]);
        container.appendChild(categoryElement);
        
        // Store first header for default opening
        if (i === 0) {
            firstHeader = categoryElement.getElementsByClassName('category-header')[0];
        }
    }
    
    // Open first category by default without scrolling
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
            // Find the parent rule-category
            while(category && !category.className.match(/\brule-category\b/)) {
                category = category.parentNode;
            }
            if (category) {
                var header = category.getElementsByClassName('category-header')[0];
                // Only toggle if the category is not already active
                if (header && header.className.indexOf('active') === -1) {
                    toggleCategory(header, true); // Use true to skip scrolling, as we'll scroll to the rule
                }
                // Smooth scroll with delay to ensure animation completes
                setTimeout(function() {
                    ruleElement.scrollIntoView({behavior: 'smooth'});
                }, 300);
            }
        }
    }
}

// Handle hash changes
window.onhashchange = handleHash; 
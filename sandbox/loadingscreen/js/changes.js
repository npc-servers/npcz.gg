// Function to update the Changes tab content
function updateChangesTab() {
    // Update header
    document.querySelector('.changes-header').textContent = SharedConfig.changes.headerTitle;
    
    // Get container element
    const changesContainer = document.querySelector('.changes-container');
    changesContainer.innerHTML = ''; // Clear existing content
    
    // Create and populate main update section
    const mainSection = document.createElement('div');
    mainSection.className = 'changes-main';
    
    const mainTitle = document.createElement('h3');
    mainTitle.className = 'changes-title';
    mainTitle.textContent = SharedConfig.changes.mainUpdate.title;
    
    const mainDate = document.createElement('div');
    mainDate.className = 'changes-date';
    mainDate.textContent = SharedConfig.changes.mainUpdate.date;
    
    const mainContent = document.createElement('div');
    mainContent.className = 'changes-content';
    mainContent.textContent = SharedConfig.changes.mainUpdate.content;
    
    // Append main update elements
    mainSection.appendChild(mainTitle);
    mainSection.appendChild(mainDate);
    mainSection.appendChild(mainContent);
    changesContainer.appendChild(mainSection);
    
    // Create grid for smaller updates
    const changesGrid = document.createElement('div');
    changesGrid.className = 'changes-grid';
    
    // Create and populate update boxes
    SharedConfig.changes.updates.forEach(update => {
        const box = document.createElement('div');
        box.className = 'changes-box';
        
        const boxTitle = document.createElement('h4');
        boxTitle.className = 'changes-box-title';
        boxTitle.textContent = update.title;
        
        const boxDate = document.createElement('div');
        boxDate.className = 'changes-box-date';
        boxDate.textContent = update.date;
        
        const boxContent = document.createElement('div');
        boxContent.className = 'changes-box-content';
        boxContent.textContent = update.content;
        
        // Append box elements
        box.appendChild(boxTitle);
        box.appendChild(boxDate);
        box.appendChild(boxContent);
        changesGrid.appendChild(box);
    });
    
    // Add the grid to the container
    changesContainer.appendChild(changesGrid);
    
    // Add the message about viewing changelog on Discord
    // First, remove any existing message to prevent duplication
    const existingMsg = document.querySelector('.changes-discord-message');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    const discordMsg = document.createElement('div');
    discordMsg.className = 'changes-discord-message';
    
    // Create link element with styling
    const linkText = document.createElement('span');
    
    // Check viewport width to determine the message text and layout
    const isSmallScreen = window.innerWidth <= 1366;
    linkText.textContent = isSmallScreen ? 'Changelog: ' : 'You can view the changelog on our discord: ';
    
    const link = document.createElement('a');
    link.href = SharedConfig.links.discord;
    link.textContent = 'discord.gg/npc';
    link.className = 'discord-link';
    link.target = '_blank'; // Open in new tab
    
    // Append elements to message container
    discordMsg.appendChild(linkText);
    
    // On small screens, we use column layout with each element on its own line
    if (isSmallScreen) {
        discordMsg.classList.add('column-layout');
    }
    
    discordMsg.appendChild(link);
    
    changesContainer.appendChild(discordMsg);
}

// Initialize the Changes tab
document.addEventListener('DOMContentLoaded', () => {
    updateChangesTab();
    
    // Optional: Add animation to make the tab slide in
    setTimeout(() => {
        document.querySelector('.changes-tab').style.opacity = '1';
    }, 500);
}); 
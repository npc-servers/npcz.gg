document.addEventListener('DOMContentLoaded', function() {
    // Create and insert ZMOD badge
    createZmodBadge();
});

/**
 * Creates and inserts the ZMOD badge
 */
function createZmodBadge() {
    // Create badge element
    const badge = document.createElement('a');
    badge.href = 'https://zmod.gg';
    badge.className = 'zmod-badge';
    badge.target = '_blank';
    badge.rel = 'noopener noreferrer';
    
    // Create logo container
    const logoContainer = document.createElement('div');
    logoContainer.className = 'zmod-badge-logo';
    
    // Create logo image
    const logoImg = document.createElement('img');
    logoImg.src = '/assets/zmod_logo.svg';
    logoImg.alt = 'ZMOD Logo';
    logoImg.className = 'zmod-logo-img';
    
    // Create text element
    const textSpan = document.createElement('span');
    textSpan.textContent = 'Powered by ZMOD';
    
    // Assemble the badge
    logoContainer.appendChild(logoImg);
    badge.appendChild(logoContainer);
    badge.appendChild(textSpan);
    
    // Append badge to the body
    document.body.appendChild(badge);
} 
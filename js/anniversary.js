// Anniversary page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize anniversary effects
    initHeaderReveal();
    initSparkles();
    initFloatingParticles();
    initStatCounters();
    initServerStatus();
    
    // Header reveal animation
    function initHeaderReveal() {
        const header = document.querySelector('.anniversary-header');
        const overlay = document.querySelector('.reveal-overlay');
        
        if (!header || !overlay) return;
        
        // Start the reveal sequence immediately
        // Show the header after the sweep animation
        setTimeout(() => {
            header.classList.add('revealed');
            header.classList.remove('hidden');
            
            // Trigger sparkles after header is revealed
            createSparklesBurst();
        }, 750); // Wait for sweep animation to reach center (1.5s animation / 2)
    }
    
    // Create sparkles effect
    function initSparkles() {
        const sparklesContainer = document.querySelector('.sparkles-container');
        if (!sparklesContainer) return;
        
        // Continuous sparkles around the header
        setInterval(() => {
            createSparkle();
        }, 300);
    }
    
    function createSparkle() {
        const sparklesContainer = document.querySelector('.sparkles-container');
        if (!sparklesContainer) return;
        
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        // Random position around the header area
        const containerRect = sparklesContainer.getBoundingClientRect();
        const x = Math.random() * containerRect.width;
        const y = Math.random() * containerRect.height;
        
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.animationDelay = Math.random() * 1000 + 'ms';
        sparkle.style.animationDuration = (2 + Math.random() * 2) + 's';
        
        sparklesContainer.appendChild(sparkle);
        
        // Remove sparkle after animation
        setTimeout(() => {
            sparkle.remove();
        }, 4000);
    }
    
    function createSparklesBurst() {
        // Create a burst of sparkles when header is revealed
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                createSparkle();
            }, i * 50);
        }
    }
    
    // Floating particles background effect
    function initFloatingParticles() {
        const particlesContainer = document.querySelector('.particles-container');
        if (!particlesContainer) return;
        
        // Create particles periodically
        setInterval(() => {
            createParticle();
        }, 500);
        
        // Initial particles
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                createParticle();
            }, i * 200);
        }
    }
    
    function createParticle() {
        const particlesContainer = document.querySelector('.particles-container');
        if (!particlesContainer) return;
        
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random horizontal position
        const x = Math.random() * window.innerWidth;
        particle.style.left = x + 'px';
        particle.style.bottom = '-10px';
        
        // Random size variation
        const size = 2 + Math.random() * 3;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random animation duration
        const duration = 6 + Math.random() * 4;
        particle.style.animationDuration = duration + 's';
        
        // Random delay
        particle.style.animationDelay = Math.random() * 2 + 's';
        
        particlesContainer.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, (duration + 2) * 1000);
    }
    
    // Animated counter for statistics
    function initStatCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        const totalNumber = document.querySelector('.total-number');
        
        // Start individual stat counters when their reveal animation begins
        setTimeout(() => {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.dataset.target);
                animateCounter(stat, target);
            });
        }, 2000); // Same as animation-delay for stats
        
        // Start total counter when its reveal animation begins
        if (totalNumber) {
            setTimeout(() => {
                const target = parseInt(totalNumber.dataset.target);
                animateCounter(totalNumber, target);
            }, 2200); // Same as animation-delay for total stat
        }
    }
    
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        const duration = 2000; // 2 seconds
        const stepTime = duration / 100;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, stepTime);
    }
    
    // Button interactions
    const buttons = document.querySelectorAll('.anniversary-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            // Create sparkle effect on hover
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    createButtonSparkle(button);
                }, i * 100);
            }
        });
        
        button.addEventListener('click', (e) => {
            // Add click animation
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
            
            // Handle navigation
            if (button.href && !button.href.startsWith('#')) {
                // Let normal navigation occur
                return;
            }
            
            e.preventDefault();
            // Handle any special anniversary button actions here
        });
    });
    
    function createButtonSparkle(button) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'absolute';
        sparkle.style.width = '4px';
        sparkle.style.height = '4px';
        sparkle.style.background = 'var(--anniversary-red)';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '1000';
        
        const rect = button.getBoundingClientRect();
        const x = rect.left + Math.random() * rect.width;
        const y = rect.top + Math.random() * rect.height;
        
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        
        document.body.appendChild(sparkle);
        
        // Animate sparkle
        sparkle.animate([
            { 
                opacity: 0, 
                transform: 'translate(0, 0) scale(0)' 
            },
            { 
                opacity: 1, 
                transform: 'translate(0, -20px) scale(1)' 
            },
            { 
                opacity: 0, 
                transform: 'translate(0, -40px) scale(0)' 
            }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => {
            sparkle.remove();
        };
    }
    
    // Add scroll effects
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.anniversary-header');
        
        if (header && header.classList.contains('revealed')) {
            // Subtle parallax effect for the header
            header.style.transform = `translateY(${scrolled * 0.1}px) scale(${1 + scrolled * 0.00005})`;
        }
    });
    
    // Server status functionality
    function initServerStatus() {
        const serverCards = document.querySelectorAll('.server-card');
        
        // Fetch initial status for all servers
        updateAllServerStatus();
        
        // Update every 30 seconds
        setInterval(updateAllServerStatus, 30000);
    }
    
    async function updateAllServerStatus() {
        const serverCards = document.querySelectorAll('.server-card');
        const totalPlayersElement = document.getElementById('total-players');
        let totalPlayers = 0;
        let completedRequests = 0;
        
        const updateTotal = () => {
            completedRequests++;
            if (completedRequests === serverCards.length) {
                totalPlayersElement.textContent = totalPlayers.toLocaleString();
            }
        };
        
        serverCards.forEach(async (card) => {
            const ip = card.dataset.ip;
            const port = card.dataset.port;
            const statusIndicator = card.querySelector('.status-indicator');
            const playerCount = card.querySelector('.player-count');
            
            try {
                const response = await fetch(`https://gameserveranalytics.com/api/v2/query?game=source&ip=${ip}&port=${port}&type=info`);
                const serverInfo = await response.json();
                
                const status = {
                    online: false,
                    players: 0,
                    maxPlayers: 0
                };

                if (serverInfo && (serverInfo.status?.toLowerCase() === 'online' || serverInfo.players !== undefined)) {
                    status.online = true;
                    status.players = serverInfo.players || serverInfo.num_players || serverInfo.playercount || 0;
                    status.maxPlayers = serverInfo.maxplayers || serverInfo.max_players || serverInfo.maxclients || "?";
                    
                    // Add to total if server is online
                    totalPlayers += parseInt(status.players) || 0;
                }
                
                // Update UI
                statusIndicator.className = 'status-indicator ' + (status.online ? 'online' : 'offline');
                playerCount.textContent = status.online ? `${status.players}/${status.maxPlayers}` : 'Offline';
                
            } catch (error) {
                console.error(`Error fetching status for ${ip}:${port}:`, error);
                statusIndicator.className = 'status-indicator offline';
                playerCount.textContent = 'Error';
            }
            
            updateTotal();
        });
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        // Clear any running intervals
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => particle.remove());
        
        const sparkles = document.querySelectorAll('.sparkle');
        sparkles.forEach(sparkle => sparkle.remove());
    });
}); 
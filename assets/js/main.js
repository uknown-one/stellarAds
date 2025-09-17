
/**
 * STELLARADS - Futuristic Classified Ads Platform
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

/**
 * Initialize the application
 */
function initApp() {
    // Initialize components
    initNavigation();
    initCards();
    initAffiliate();
    initAnimations();
    
    // Log initialization
    console.log('STELLARADS platform initialized');
}

/**
 * Initialize navigation functionality
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent default only if it's a placeholder link
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
            }
            
            // Remove active class from all links
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
}

/**
 * Initialize card functionality
 */
function initCards() {
    const cards = document.querySelectorAll('.card');
    const buyButtons = document.querySelectorAll('.btn-primary');
    
    // Add click event to cards
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if the button was clicked
            if (e.target.classList.contains('btn')) {
                return;
            }
            
            // Get card title for demonstration
            const cardTitle = this.querySelector('.card-title').textContent;
            console.log(`Card clicked: ${cardTitle}`);
            
            // Here you would typically navigate to the listing detail page
            // For demo purposes, we'll just add a subtle highlight effect
            this.style.boxShadow = '0 0 20px var(--color-accent-glow)';
            setTimeout(() => {
                this.style.boxShadow = '';
            }, 500);
        });
    });
    
    // Add click event to buy buttons
    buyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click
            
            // Get the product info
            const card = this.closest('.card');
            const title = card.querySelector('.card-title').textContent;
            const price = card.querySelector('.card-price').textContent;
            
            // Show purchase modal (simulated for demo)
            showPurchaseModal(title, price);
        });
    });
}

/**
 * Show purchase modal (simulated)
 */
function showPurchaseModal(title, price) {
    console.log(`Purchase initiated for: ${title} at ${price}`);
    
    // Create a simple modal for demonstration
    const modal = document.createElement('div');
    modal.className = 'purchase-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Purchase Confirmation</h3>
            <p>You are about to purchase:</p>
            <p class="item-title">${title}</p>
            <p class="item-price">${price}</p>
            <div class="modal-actions">
                <button class="btn btn-secondary modal-cancel">Cancel</button>
                <button class="btn btn-primary modal-confirm">Confirm Purchase</button>
            </div>
        </div>
    `;
    
    // Add modal styles
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.3s ease';
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.backgroundColor = 'var(--color-card-bg)';
    modalContent.style.borderRadius = 'var(--radius-lg)';
    modalContent.style.padding = '2rem';
    modalContent.style.maxWidth = '500px';
    modalContent.style.width = '90%';
    modalContent.style.border = '1px solid var(--color-accent)';
    modalContent.style.boxShadow = '0 0 30px var(--color-accent-glow)';
    modalContent.style.transform = 'translateY(20px)';
    modalContent.style.transition = 'transform 0.3s ease';
    
    // Add to DOM
    document.body.appendChild(modal);
    
    // Trigger animation
    setTimeout(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'translateY(0)';
    }, 10);
    
    // Add event listeners
    const cancelBtn = modal.querySelector('.modal-cancel');
    const confirmBtn = modal.querySelector('.modal-confirm');
    
    cancelBtn.addEventListener('click', () => {
        closeModal(modal);
    });
    
    confirmBtn.addEventListener('click', () => {
        // Simulate successful purchase
        modalContent.innerHTML = `
            <h3>Purchase Successful!</h3>
            <p>Thank you for purchasing:</p>
            <p class="item-title">${title}</p>
            <p class="item-price">${price}</p>
            <div class="modal-actions">
                <button class="btn btn-primary modal-close">Close</button>
            </div>
        `;
        
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            closeModal(modal);
        });
    });
}

/**
 * Close modal with animation
 */
function closeModal(modal) {
    const modalContent = modal.querySelector('.modal-content');
    modal.style.opacity = '0';
    modalContent.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        document.body.removeChild(modal);
    }, 300);
}

/**
 * Initialize affiliate functionality
 */
function initAffiliate() {
    const shareButton = document.querySelector('.affiliate-banner .btn');
    const affiliateLink = document.querySelector('.affiliate-link');
    
    if (shareButton && affiliateLink) {
        shareButton.addEventListener('click', function() {
            // Get the link text
            const linkText = affiliateLink.textContent.split(': ')[1];
            
            // Check if the Web Share API is available
            if (navigator.share) {
                navigator.share({
                    title: 'Join STELLARADS',
                    text: 'Check out this futuristic classified ads platform!',
                    url: linkText
                })
                .then(() => console.log('Share successful'))
                .catch(error => console.log('Error sharing:', error));
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(linkText)
                    .then(() => {
                        // Show copied notification
                        const originalText = shareButton.textContent;
                        shareButton.textContent = 'COPIED!';
                        setTimeout(() => {
                            shareButton.textContent = originalText;
                        }, 2000);
                    })
                    .catch(err => console.error('Failed to copy: ', err));
            }
        });
    }
}

/**
 * Initialize animations
 */
function initAnimations() {
    // Add intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
    
    // Add hover effects for cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

/**
 * Toggle between free and premium account features
 * This would be expanded in a real application
 */
function toggleAccountType(isPremium) {
    if (isPremium) {
        console.log('Premium account features activated');
        // Here you would update UI elements to show premium features
    } else {
        console.log('Free account features active');
        // Here you would update UI elements to show free features
    }
}

/**
 * User authentication simulation
 * In a real app, this would connect to a backend service
 */
function simulateAuth(username, password) {
    return new Promise((resolve, reject) => {
        // Simulate API call
        setTimeout(() => {
            if (username && password) {
                resolve({
                    username: username,
                    accountType: 'premium',
                    credits: 500
                });
            } else {
                reject(new Error('Invalid credentials'));
            }
        }, 1000);
    });
}

/**
 * Create a new listing
 * In a real app, this would send data to a backend service
 */
function createListing(listingData) {
    return new Promise((resolve, reject) => {
        // Validate required fields
        if (!listingData.title || !listingData.price) {
            reject(new Error('Missing required fields'));
            return;
        }
        
        // Simulate API call
        setTimeout(() => {
            resolve({
                id: 'listing_' + Math.floor(Math.random() * 10000),
                ...listingData,
                createdAt: new Date().toISOString()
            });
        }, 1000);
    });
}

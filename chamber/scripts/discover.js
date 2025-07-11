// Discover page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadDiscoverItems();
    handleVisitorInfo();
});

// Load discover items from JSON
async function loadDiscoverItems() {
    try {
        const response = await fetch('data/discover.json');
        const items = await response.json();
        displayDiscoverItems(items);
    } catch (error) {
        console.error('Error loading discover items:', error);
    }
}

// Display discover items in grid
function displayDiscoverItems(items) {
    const grid = document.getElementById('discover-grid');
    
    items.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'discover-card';
        card.style.gridArea = `item${index + 1}`;
        
        card.innerHTML = `
            <figure class="card-image">
                <img src="images/${getPlaceholderImage(item.id)}" alt="${item.name}" loading="lazy">
            </figure>
            <div class="card-content">
                <h2>${item.name}</h2>
                <address>${item.address}</address>
                <p>${item.description}</p>
                <button class="learn-more-btn" onclick="learnMore('${item.name}')">Learn More</button>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Handle visitor information with localStorage
function handleVisitorInfo() {
    const visitorInfo = document.getElementById('visitor-info');
    const currentDate = Date.now();
    const lastVisit = localStorage.getItem('lastVisit');
    
    let message = '';
    
    if (!lastVisit) {
        // First visit
        message = '<p class="welcome-message">🎉 Welcome! Let us know if you have any questions.</p>';
    } else {
        const lastVisitDate = parseInt(lastVisit);
        const timeDifference = currentDate - lastVisitDate;
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        
        if (daysDifference < 1) {
            // Less than a day
            message = '<p class="return-message">👋 Back so soon! Awesome!</p>';
        } else if (daysDifference === 1) {
            // Exactly 1 day
            message = '<p class="return-message">📅 You last visited 1 day ago.</p>';
        } else {
            // More than 1 day
            message = `<p class="return-message">📅 You last visited ${daysDifference} days ago.</p>`;
        }
    }
    
    visitorInfo.innerHTML = `
        <h3>Visitor Information</h3>
        ${message}
    `;
    
    // Store current visit date
    localStorage.setItem('lastVisit', currentDate.toString());
}

// Learn more button functionality
function learnMore(itemName) {
    alert(`Learn more about ${itemName} - This would typically link to a detailed page or external resource.`);
}

// Get placeholder image for discover items
function getPlaceholderImage(itemId) {
    // Using existing images as placeholders until proper WebP images are created
    const placeholders = {
        1: 'tech.jpg',        // University
        2: 'garden.jpg',      // Mosque
        3: 'coffee.jpg',      // Museum
        4: 'market.jpg',      // Port
        5: 'auto.jpg',        // Market
        6: 'fitness.jpg',     // Mosque
        7: 'dental.jpg',      // Salt mines
        8: 'hero.webp'        // Monument
    };
    return placeholders[itemId] || 'logo.png';
}

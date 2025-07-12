// Main JavaScript module for the homepage
import { setupNavigation } from './navigation.js';
import { DataManager } from './dataManager.js';
import { LocalStorageManager } from './storageManager.js';
import { ModalManager } from './modalManager.js';

// Initialize components
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Setup navigation
        setupNavigation();
        
        // Initialize data manager
        const dataManager = new DataManager();
        await dataManager.init();
        
        // Initialize storage manager
        const storageManager = new LocalStorageManager();
        
        // Initialize modal manager
        const modalManager = new ModalManager();
        
        // Initialize wheel functionality
        initializeWheel(dataManager, storageManager, modalManager);
        
        // Display recent spins
        displayRecentSpins(storageManager);
        
    } catch (error) {
        console.error('Error initializing application:', error);
        showErrorMessage('Failed to initialize application. Please refresh the page.');
    }
});

function initializeWheel(dataManager, storageManager, modalManager) {
    const spinBtn = document.getElementById('spin-btn');
    const wheel = document.getElementById('wheel');
    
    if (!spinBtn || !wheel) {
        console.error('Wheel elements not found');
        return;
    }
    
    let isSpinning = false;
    
    spinBtn.addEventListener('click', async () => {
        if (isSpinning) return;
        
        try {
            isSpinning = true;
            spinBtn.disabled = true;
            spinBtn.textContent = 'Spinning...';
            
            // Get random resource
            const resources = dataManager.getAllResources();
            if (resources.length === 0) {
                throw new Error('No resources available');
            }
            
            const randomResource = resources[Math.floor(Math.random() * resources.length)];
            
            // Calculate rotation
            const spins = 3 + Math.random() * 2; // 3-5 full rotations
            const finalRotation = (spins * 360) + (Math.random() * 360);
            
            // Apply rotation
            wheel.style.transform = `rotate(${finalRotation}deg)`;
            
            // Wait for animation to complete
            setTimeout(() => {
                // Store the spin result
                storageManager.addRecentSpin(randomResource);
                
                // Show modal with result
                modalManager.showTopicModal(randomResource);
                
                // Update recent spins display
                displayRecentSpins(storageManager);
                
                // Reset button
                isSpinning = false;
                spinBtn.disabled = false;
                spinBtn.textContent = 'Spin the Wheel!';
                
            }, 3000); // Match CSS transition duration
            
        } catch (error) {
            console.error('Error during wheel spin:', error);
            showErrorMessage('Error spinning the wheel. Please try again.');
            
            isSpinning = false;
            spinBtn.disabled = false;
            spinBtn.textContent = 'Spin the Wheel!';
        }
    });
}

function displayRecentSpins(storageManager) {
    const recentSpinsList = document.getElementById('recent-spins-list');
    if (!recentSpinsList) return;
    
    const recentSpins = storageManager.getRecentSpins();
    
    if (recentSpins.length === 0) {
        recentSpinsList.innerHTML = '<p class="no-spins">Spin the wheel to start discovering topics!</p>';
        return;
    }
    
    recentSpinsList.innerHTML = recentSpins.map(spin => `
        <div class="recent-spin-item">
            <div class="resource-category" style="background-color: ${spin.color}">${spin.category}</div>
            <h3>${spin.title}</h3>
            <p class="resource-difficulty difficulty-${spin.difficulty.toLowerCase()}">${spin.difficulty}</p>
            <small>Spun ${formatSpinDate(spin.spunAt)}</small>
        </div>
    `).join('');
}

function formatSpinDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
        return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
        return 'Just now';
    }
}

function showErrorMessage(message) {
    // Create and show error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--accent-color);
        color: white;
        padding: 1rem;
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow);
        z-index: 3000;
        max-width: 300px;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

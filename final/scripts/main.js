// Main JavaScript module for the homepage
import { setupNavigation } from './navigation.js';
import { DataManager } from './dataManager.js';
import { LocalStorageManager } from './storageManager.js';
import { ModalManager } from './modalManager.js';
import DVStatisticsAPI from './statisticsAPI.js';

// Function to update last modified date
function updateLastModified() {
    const lastModifiedElement = document.getElementById('lastModified');
    if (lastModifiedElement) {
        const lastModified = new Date(document.lastModified);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        lastModifiedElement.textContent = lastModified.toLocaleDateString('en-US', options);
    }
}

// Initialize components
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Setup navigation
        setupNavigation();
        
        // Update last modified date
        updateLastModified();
        
        // Initialize data manager
        const dataManager = new DataManager();
        await dataManager.init();
        
        // Initialize storage manager
        const storageManager = new LocalStorageManager();
        
        // Initialize modal manager
        const modalManager = new ModalManager();
        
        // Initialize statistics API
        const statisticsAPI = new DVStatisticsAPI();
        statisticsAPI.start();
        
    } catch (error) {
        console.error('Error initializing application:', error);
        showErrorMessage('Failed to initialize application. Please refresh the page.');
    }
});

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

// Resources page JavaScript module
import { setupNavigation } from './navigation.js';
import { DataManager } from './dataManager.js';
import { ModalManager } from './modalManager.js';

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
        // Show loading indicator
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'block';
        
        // Setup navigation
        setupNavigation();
        
        // Update last modified date
        updateLastModified();
        
        // Initialize managers
        const dataManager = new DataManager();
        const modalManager = new ModalManager();
        
        await dataManager.init();
        
        // Initialize resources page functionality
        const resourcesPage = new ResourcesPage(dataManager, modalManager);
        await resourcesPage.init();
        
        // Hide loading indicator
        if (loading) loading.style.display = 'none';
        
    } catch (error) {
        console.error('Error initializing resources page:', error);
        
        // Hide loading and show error message
        const loading = document.getElementById('loading');
        const resourcesGrid = document.getElementById('resources-grid');
        
        if (loading) loading.style.display = 'none';
        if (resourcesGrid) {
            resourcesGrid.innerHTML = `
                <div class="error-message" style="text-align: center; padding: 2rem; color: #e74c3c;">
                    <h3>Unable to load resources</h3>
                    <p>Please try refreshing the page or contact support if the problem persists.</p>
                    <p><strong>Emergency:</strong> Call 911 or <a href="tel:18007997233">1-800-799-7233</a></p>
                </div>
            `;
        }
    }
});

class ResourcesPage {
    constructor(dataManager, modalManager) {
        this.dataManager = dataManager;
        this.modalManager = modalManager;
        this.currentFilters = {
            category: 'all',
            difficulty: 'all',
            search: ''
        };
        this.isLoading = false;
    }
    
    async init() {
        try {
            this.setupFilterControls();
            this.setupSearchFunctionality();
            await this.displayResources();
            this.updateResourceCount();
            
        } catch (error) {
            console.error('Error initializing resources page:', error);
            throw error;
        }
    }
    
    setupFilterControls() {
        const categoryFilter = document.getElementById('category-filter');
        const difficultyFilter = document.getElementById('difficulty-filter');
        const clearFiltersBtn = document.getElementById('clear-filters');
        
        // Populate filter options
        if (categoryFilter) {
            const categories = this.dataManager.getUniqueCategories();
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
            
            categoryFilter.addEventListener('change', () => {
                this.currentFilters.category = categoryFilter.value;
                this.applyFilters();
            });
        }
        
        if (difficultyFilter) {
            const difficulties = this.dataManager.getUniqueDifficulties();
            difficulties.forEach(difficulty => {
                const option = document.createElement('option');
                option.value = difficulty;
                option.textContent = difficulty;
                difficultyFilter.appendChild(option);
            });
            
            difficultyFilter.addEventListener('change', () => {
                this.currentFilters.difficulty = difficultyFilter.value;
                this.applyFilters();
            });
        }
        
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
    }
    
    setupSearchFunctionality() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        
        if (searchInput) {
            // Search on input (debounced)
            let searchTimeout;
            searchInput.addEventListener('input', () => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.currentFilters.search = searchInput.value;
                    this.applyFilters();
                }, 300);
            });
            
            // Search on Enter key
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.currentFilters.search = searchInput.value;
                    this.applyFilters();
                }
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                if (searchInput) {
                    this.currentFilters.search = searchInput.value;
                    this.applyFilters();
                }
            });
        }
    }
    
    async applyFilters() {
        try {
            this.showLoading();
            
            // Small delay to show loading state
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const filteredResources = this.dataManager.filterResources(this.currentFilters);
            this.displayFilteredResources(filteredResources);
            this.updateResourceCount(filteredResources.length);
            
        } catch (error) {
            console.error('Error applying filters:', error);
            showErrorMessage('Error filtering resources.');
        } finally {
            this.hideLoading();
        }
    }
    
    clearAllFilters() {
        // Reset filters
        this.currentFilters = {
            category: 'all',
            difficulty: 'all',
            search: ''
        };
        
        // Reset form controls
        const categoryFilter = document.getElementById('category-filter');
        const difficultyFilter = document.getElementById('difficulty-filter');
        const searchInput = document.getElementById('search-input');
        
        if (categoryFilter) categoryFilter.value = 'all';
        if (difficultyFilter) difficultyFilter.value = 'all';
        if (searchInput) searchInput.value = '';
        
        // Apply filters
        this.applyFilters();
    }
    
    async displayResources() {
        const resources = this.dataManager.getAllResources();
        this.displayFilteredResources(resources);
    }
    
    displayFilteredResources(resources) {
        const resourcesGrid = document.getElementById('resources-grid');
        const noResults = document.getElementById('no-results');
        
        if (!resourcesGrid) {
            console.error('Resources grid element not found');
            return;
        }
        
        if (resources.length === 0) {
            resourcesGrid.innerHTML = '';
            if (noResults) noResults.style.display = 'block';
            return;
        }
        
        if (noResults) noResults.style.display = 'none';
        
        resourcesGrid.innerHTML = resources.map(resource => 
            this.createResourceCard(resource)
        ).join('');
        
        // Add click event listeners to resource cards
        this.setupResourceCardListeners();
    }
    
    createResourceCard(resource) {
        console.log('Creating card for resource:', resource.title, 'Website:', resource.website);
        const categoryColors = {
            'Emergency Support': '#e74c3c',
            'Educational Resources': '#3498db',
            'Government Resources': '#2c3e50',
            'Legal Resources': '#8e44ad',
            'Support Services': '#27ae60',
            'Youth Resources': '#f39c12',
            'Specialized Support': '#e67e22',
            'Workplace Resources': '#34495e',
            'Advocacy': '#9b59b6',
            'Statistics & Research': '#16a085'
        };
        
        const bgColor = categoryColors[resource.category] || '#95a5a6';
        
        return `
            <div class="card resource-card" data-resource-id="${resource.id}">
                <div class="resource-category" style="background-color: ${bgColor}">
                    ${resource.category}
                </div>
                <h3 class="resource-title">${resource.title}</h3>
                <p class="resource-description">${resource.description}</p>
                <div class="resource-details">
                    ${resource.phone ? `<p class="resource-phone"><strong>Phone:</strong> <a href="tel:${resource.phone.replace(/[^\d]/g, '')}">${resource.phone}</a></p>` : ''}
                    ${resource.website ? `<p class="resource-website"><strong>Website:</strong> <a href="${resource.website}" target="_blank" rel="noopener noreferrer">Visit Website</a></p>` : ''}
                    ${resource.availability ? `<p class="resource-availability"><strong>Available:</strong> ${resource.availability}</p>` : ''}
                    ${resource.languages ? `<p class="resource-languages"><strong>Languages:</strong> ${resource.languages}</p>` : ''}
                </div>
                <div class="resource-type ${resource.type}">
                    ${this.formatType(resource.type)}
                </div>
            </div>
        `;
    }
    
    formatType(type) {
        const typeLabels = {
            'hotline': 'Crisis Hotline',
            'organization': 'Organization',
            'government': 'Government Resource',
            'legal': 'Legal Resource',
            'text': 'Text Support',
            'youth': 'Youth Resource',
            'specialized': 'Specialized Support',
            'workplace': 'Workplace Resource',
            'advocacy': 'Advocacy',
            'research': 'Research & Statistics'
        };
        
        return typeLabels[type] || type;
    }
    
    setupResourceCardListeners() {
        const resourceCards = document.querySelectorAll('.resource-card');
        
        resourceCards.forEach(card => {
            card.addEventListener('click', () => {
                const resourceId = parseInt(card.dataset.resourceId);
                const resource = this.dataManager.getResourceById(resourceId);
                
                if (resource) {
                    this.modalManager.showResourceModal(resource);
                }
            });
            
            // Add keyboard navigation
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
            
            // Make cards focusable
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `View details for ${card.querySelector('.resource-title').textContent}`);
        });
    }
    
    updateResourceCount(count = null) {
        const resourcesCount = document.getElementById('resources-count');
        if (!resourcesCount) return;
        
        const total = count !== null ? count : this.dataManager.getAllResources().length;
        const totalResources = this.dataManager.getAllResources().length;
        
        if (count !== null && count !== totalResources) {
            resourcesCount.textContent = `Showing ${total} of ${totalResources} resources`;
        } else {
            resourcesCount.textContent = `${total} resource${total !== 1 ? 's' : ''} available`;
        }
    }
    
    showLoading() {
        this.isLoading = true;
        const loading = document.getElementById('loading');
        const resourcesGrid = document.getElementById('resources-grid');
        
        if (loading) loading.style.display = 'block';
        if (resourcesGrid) resourcesGrid.style.opacity = '0.5';
    }
    
    hideLoading() {
        this.isLoading = false;
        const loading = document.getElementById('loading');
        const resourcesGrid = document.getElementById('resources-grid');
        
        if (loading) loading.style.display = 'none';
        if (resourcesGrid) resourcesGrid.style.opacity = '1';
    }
}

// Utility function for error messages
function showErrorMessage(message) {
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
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

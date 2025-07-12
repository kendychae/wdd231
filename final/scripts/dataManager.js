// Data Manager module - handles API/JSON data fetching
export class DataManager {
    constructor() {
        this.resources = [];
        this.isLoaded = false;
    }
    
    async init() {
        try {
            await this.loadResources();
            this.isLoaded = true;
        } catch (error) {
            console.error('Failed to initialize DataManager:', error);
            throw error;
        }
    }
    
    async loadResources() {
        try {
            const response = await fetch('data/resources.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!Array.isArray(data)) {
                throw new Error('Invalid data format: expected array');
            }
            
            this.resources = data;
            console.log(`Loaded ${this.resources.length} resources successfully`);
            
        } catch (error) {
            console.error('Error loading resources:', error);
            
            // Fallback to sample data if loading fails
            this.resources = this.getSampleResources();
            console.warn('Using fallback sample data');
        }
    }
    
    getAllResources() {
        return [...this.resources];
    }
    
    getResourceById(id) {
        return this.resources.find(resource => resource.id === id);
    }
    
    getResourcesByCategory(category) {
        if (category === 'all') return this.getAllResources();
        return this.resources.filter(resource => 
            resource.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    getResourcesByDifficulty(type) {
        if (type === 'all') return this.getAllResources();
        return this.resources.filter(resource => 
            resource.type && resource.type.toLowerCase() === type.toLowerCase()
        );
    }
    
    searchResources(query) {
        if (!query || query.trim() === '') return this.getAllResources();
        
        const searchTerm = query.toLowerCase().trim();
        
        return this.resources.filter(resource => {
            return (
                resource.title.toLowerCase().includes(searchTerm) ||
                resource.description.toLowerCase().includes(searchTerm) ||
                resource.category.toLowerCase().includes(searchTerm) ||
                (resource.type && resource.type.toLowerCase().includes(searchTerm)) ||
                (resource.phone && resource.phone.toLowerCase().includes(searchTerm))
            );
        });
    }
    
    filterResources(filters) {
        let filteredResources = this.getAllResources();
        
        // Apply category filter
        if (filters.category && filters.category !== 'all') {
            filteredResources = filteredResources.filter(resource => 
                resource.category.toLowerCase() === filters.category.toLowerCase()
            );
        }
        
        // Apply difficulty filter (now type filter)
        if (filters.difficulty && filters.difficulty !== 'all') {
            filteredResources = filteredResources.filter(resource => 
                resource.type && resource.type.toLowerCase() === filters.difficulty.toLowerCase()
            );
        }
        
        // Apply search filter
        if (filters.search && filters.search.trim() !== '') {
            const searchTerm = filters.search.toLowerCase().trim();
            filteredResources = filteredResources.filter(resource => {
                return (
                    resource.title.toLowerCase().includes(searchTerm) ||
                    resource.description.toLowerCase().includes(searchTerm) ||
                    resource.category.toLowerCase().includes(searchTerm) ||
                    (resource.type && resource.type.toLowerCase().includes(searchTerm)) ||
                    (resource.phone && resource.phone.toLowerCase().includes(searchTerm))
                );
            });
        }
        
        return filteredResources;
    }
    
    getUniqueCategories() {
        const categories = [...new Set(this.resources.map(resource => resource.category))];
        return categories.sort();
    }
    
    getUniqueDifficulties() {
        const types = [...new Set(this.resources.map(resource => resource.type).filter(Boolean))];
        return types.sort();
    }
    
    getRandomResource() {
        if (this.resources.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * this.resources.length);
        return this.resources[randomIndex];
    }
    
    // Fallback sample data in case JSON loading fails
    getSampleResources() {
        return [
            {
                id: 1,
                title: "HTML5 Semantic Elements",
                category: "HTML",
                description: "Learn about modern HTML5 semantic elements for better document structure and accessibility.",
                difficulty: "Beginner",
                url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element",
                color: "#e34c26",
                icon: "html5"
            },
            {
                id: 2,
                title: "CSS Grid Layout",
                category: "CSS",
                description: "Master CSS Grid for creating complex, responsive layouts with ease.",
                difficulty: "Intermediate",
                url: "https://css-tricks.com/snippets/css/complete-guide-grid/",
                color: "#1572b6",
                icon: "css3"
            },
            {
                id: 3,
                title: "JavaScript ES6+ Features",
                category: "JavaScript",
                description: "Explore modern JavaScript features including arrow functions, destructuring, and modules.",
                difficulty: "Intermediate",
                url: "https://javascript.info/",
                color: "#f7df1e",
                icon: "javascript"
            },
            {
                id: 4,
                title: "Web Accessibility (a11y)",
                category: "General",
                description: "Build inclusive websites that work for users with disabilities.",
                difficulty: "Intermediate",
                url: "https://www.w3.org/WAI/WCAG21/quickref/",
                color: "#4ecdc4",
                icon: "accessibility"
            },
            {
                id: 5,
                title: "Local Storage & Session Storage",
                category: "JavaScript",
                description: "Store data client-side for better user experience and offline functionality.",
                difficulty: "Beginner",
                url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage",
                color: "#f39c12",
                icon: "storage"
            }
        ];
    }
}

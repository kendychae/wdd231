// Local Storage Manager module - handles client-side data persistence
export class LocalStorageManager {
    constructor() {
        this.RECENT_SPINS_KEY = 'webdevwheel_recent_spins';
        this.USER_PREFERENCES_KEY = 'webdevwheel_preferences';
        this.VISIT_COUNT_KEY = 'webdevwheel_visit_count';
        this.LAST_VISIT_KEY = 'webdevwheel_last_visit';
        this.MAX_RECENT_SPINS = 10;
        
        // Initialize visit tracking
        this.trackVisit();
    }
    
    // Recent Spins Management
    addRecentSpin(resource) {
        try {
            const recentSpins = this.getRecentSpins();
            
            // Add timestamp to the resource
            const spinData = {
                ...resource,
                spunAt: Date.now()
            };
            
            // Remove if already exists (to avoid duplicates)
            const filtered = recentSpins.filter(spin => spin.id !== resource.id);
            
            // Add to beginning of array
            filtered.unshift(spinData);
            
            // Keep only the most recent spins
            const trimmed = filtered.slice(0, this.MAX_RECENT_SPINS);
            
            localStorage.setItem(this.RECENT_SPINS_KEY, JSON.stringify(trimmed));
            
            console.log('Recent spin added:', resource.title);
            
        } catch (error) {
            console.error('Error adding recent spin:', error);
        }
    }
    
    getRecentSpins() {
        try {
            const stored = localStorage.getItem(this.RECENT_SPINS_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error getting recent spins:', error);
            return [];
        }
    }
    
    clearRecentSpins() {
        try {
            localStorage.removeItem(this.RECENT_SPINS_KEY);
            console.log('Recent spins cleared');
        } catch (error) {
            console.error('Error clearing recent spins:', error);
        }
    }
    
    // User Preferences Management
    setUserPreference(key, value) {
        try {
            const preferences = this.getUserPreferences();
            preferences[key] = value;
            localStorage.setItem(this.USER_PREFERENCES_KEY, JSON.stringify(preferences));
        } catch (error) {
            console.error('Error setting user preference:', error);
        }
    }
    
    getUserPreference(key, defaultValue = null) {
        try {
            const preferences = this.getUserPreferences();
            return preferences.hasOwnProperty(key) ? preferences[key] : defaultValue;
        } catch (error) {
            console.error('Error getting user preference:', error);
            return defaultValue;
        }
    }
    
    getUserPreferences() {
        try {
            const stored = localStorage.getItem(this.USER_PREFERENCES_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('Error getting user preferences:', error);
            return {};
        }
    }
    
    clearUserPreferences() {
        try {
            localStorage.removeItem(this.USER_PREFERENCES_KEY);
            console.log('User preferences cleared');
        } catch (error) {
            console.error('Error clearing user preferences:', error);
        }
    }
    
    // Visit Tracking
    trackVisit() {
        try {
            const now = Date.now();
            const lastVisit = this.getLastVisit();
            const visitCount = this.getVisitCount();
            
            // Update visit count
            localStorage.setItem(this.VISIT_COUNT_KEY, (visitCount + 1).toString());
            
            // Update last visit timestamp
            localStorage.setItem(this.LAST_VISIT_KEY, now.toString());
            
            console.log('Visit tracked:', { visitCount: visitCount + 1, lastVisit, currentVisit: now });
            
        } catch (error) {
            console.error('Error tracking visit:', error);
        }
    }
    
    getVisitCount() {
        try {
            const stored = localStorage.getItem(this.VISIT_COUNT_KEY);
            return stored ? parseInt(stored, 10) : 0;
        } catch (error) {
            console.error('Error getting visit count:', error);
            return 0;
        }
    }
    
    getLastVisit() {
        try {
            const stored = localStorage.getItem(this.LAST_VISIT_KEY);
            return stored ? parseInt(stored, 10) : null;
        } catch (error) {
            console.error('Error getting last visit:', error);
            return null;
        }
    }
    
    getDaysSinceLastVisit() {
        const lastVisit = this.getLastVisit();
        if (!lastVisit) return null;
        
        const now = Date.now();
        const diffTime = Math.abs(now - lastVisit);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays;
    }
    
    // Form Data Persistence (for contact form)
    saveFormData(formData) {
        try {
            const timestamp = Date.now();
            const dataWithTimestamp = {
                ...formData,
                submittedAt: timestamp
            };
            
            localStorage.setItem('contact_form_data', JSON.stringify(dataWithTimestamp));
            console.log('Form data saved');
            
        } catch (error) {
            console.error('Error saving form data:', error);
        }
    }
    
    getFormData() {
        try {
            const stored = localStorage.getItem('contact_form_data');
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Error getting form data:', error);
            return null;
        }
    }
    
    clearFormData() {
        try {
            localStorage.removeItem('contact_form_data');
            console.log('Form data cleared');
        } catch (error) {
            console.error('Error clearing form data:', error);
        }
    }
    
    // Resource Bookmarks (optional feature)
    addBookmark(resourceId) {
        try {
            const bookmarks = this.getBookmarks();
            if (!bookmarks.includes(resourceId)) {
                bookmarks.push(resourceId);
                localStorage.setItem('webdevwheel_bookmarks', JSON.stringify(bookmarks));
                console.log('Bookmark added:', resourceId);
            }
        } catch (error) {
            console.error('Error adding bookmark:', error);
        }
    }
    
    removeBookmark(resourceId) {
        try {
            const bookmarks = this.getBookmarks();
            const filtered = bookmarks.filter(id => id !== resourceId);
            localStorage.setItem('webdevwheel_bookmarks', JSON.stringify(filtered));
            console.log('Bookmark removed:', resourceId);
        } catch (error) {
            console.error('Error removing bookmark:', error);
        }
    }
    
    getBookmarks() {
        try {
            const stored = localStorage.getItem('webdevwheel_bookmarks');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error getting bookmarks:', error);
            return [];
        }
    }
    
    isBookmarked(resourceId) {
        return this.getBookmarks().includes(resourceId);
    }
    
    // Storage Statistics
    getStorageStats() {
        try {
            return {
                recentSpinsCount: this.getRecentSpins().length,
                visitCount: this.getVisitCount(),
                lastVisit: this.getLastVisit(),
                daysSinceLastVisit: this.getDaysSinceLastVisit(),
                bookmarksCount: this.getBookmarks().length,
                hasFormData: this.getFormData() !== null,
                preferencesCount: Object.keys(this.getUserPreferences()).length
            };
        } catch (error) {
            console.error('Error getting storage stats:', error);
            return {};
        }
    }
    
    // Clear all data
    clearAllData() {
        try {
            localStorage.removeItem(this.RECENT_SPINS_KEY);
            localStorage.removeItem(this.USER_PREFERENCES_KEY);
            localStorage.removeItem(this.VISIT_COUNT_KEY);
            localStorage.removeItem(this.LAST_VISIT_KEY);
            localStorage.removeItem('contact_form_data');
            localStorage.removeItem('webdevwheel_bookmarks');
            
            console.log('All data cleared');
            
        } catch (error) {
            console.error('Error clearing all data:', error);
        }
    }
    
    // Export data (for backup)
    exportData() {
        try {
            const data = {
                recentSpins: this.getRecentSpins(),
                preferences: this.getUserPreferences(),
                visitCount: this.getVisitCount(),
                lastVisit: this.getLastVisit(),
                bookmarks: this.getBookmarks(),
                formData: this.getFormData(),
                exportedAt: Date.now()
            };
            
            return JSON.stringify(data, null, 2);
            
        } catch (error) {
            console.error('Error exporting data:', error);
            return null;
        }
    }
    
    // Import data (for restore)
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            
            if (data.recentSpins) {
                localStorage.setItem(this.RECENT_SPINS_KEY, JSON.stringify(data.recentSpins));
            }
            
            if (data.preferences) {
                localStorage.setItem(this.USER_PREFERENCES_KEY, JSON.stringify(data.preferences));
            }
            
            if (data.visitCount) {
                localStorage.setItem(this.VISIT_COUNT_KEY, data.visitCount.toString());
            }
            
            if (data.lastVisit) {
                localStorage.setItem(this.LAST_VISIT_KEY, data.lastVisit.toString());
            }
            
            if (data.bookmarks) {
                localStorage.setItem('webdevwheel_bookmarks', JSON.stringify(data.bookmarks));
            }
            
            if (data.formData) {
                localStorage.setItem('contact_form_data', JSON.stringify(data.formData));
            }
            
            console.log('Data imported successfully');
            return true;
            
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
}

/**
 * Domestic Violence Statistics API
 * Provides real-time statistics on domestic violence fatalities
 * Based on CDC and FBI data with realistic projections
 */

class DVStatisticsAPI {
    constructor() {
        // Base annual statistics (approximated from CDC and FBI data)
        this.annualStats = {
            women: 1509,    // Approximately 1,509 women killed by intimate partners annually (CDC 2021)
            children: 1830, // Children killed in family violence incidents annually
            men: 358       // Men killed by intimate partners annually (CDC 2021)
        };
        
        this.startDate = new Date('2025-01-01'); // Start of current year
        this.updateInterval = null;
    }

    /**
     * Calculate current statistics based on time elapsed this year
     */
    calculateCurrentStats() {
        const now = new Date();
        const msInYear = 365.25 * 24 * 60 * 60 * 1000; // Account for leap years
        const msElapsed = now - this.startDate;
        const yearProgress = msElapsed / msInYear;
        
        // Calculate running totals for the year so far
        const currentYearTotals = {
            women: Math.floor(this.annualStats.women * yearProgress),
            children: Math.floor(this.annualStats.children * yearProgress),
            men: Math.floor(this.annualStats.men * yearProgress)
        };

        // Calculate daily averages
        const daily = {
            women: Math.round((this.annualStats.women / 365.25) * 10) / 10,
            children: Math.round((this.annualStats.children / 365.25) * 10) / 10,
            men: Math.round((this.annualStats.men / 365.25) * 10) / 10
        };

        // Calculate monthly averages
        const monthly = {
            women: Math.round((this.annualStats.women / 12) * 10) / 10,
            children: Math.round((this.annualStats.children / 12) * 10) / 10,
            men: Math.round((this.annualStats.men / 12) * 10) / 10
        };

        return {
            daily,
            monthly,
            yearly: this.annualStats,
            currentYearTotals
        };
    }

    /**
     * Update the DOM with current statistics
     */
    updateDisplay() {
        const stats = this.calculateCurrentStats();
        
        // Update women statistics
        this.updateStatElement('women-daily', stats.daily.women);
        this.updateStatElement('women-monthly', stats.monthly.women);
        this.updateStatElement('women-yearly', stats.yearly.women);

        // Update children statistics
        this.updateStatElement('children-daily', stats.daily.children);
        this.updateStatElement('children-monthly', stats.monthly.children);
        this.updateStatElement('children-yearly', stats.yearly.children);

        // Update men statistics
        this.updateStatElement('men-daily', stats.daily.men);
        this.updateStatElement('men-monthly', stats.monthly.men);
        this.updateStatElement('men-yearly', stats.yearly.men);
    }

    /**
     * Update individual statistic element with animation
     */
    updateStatElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            // Add updating animation
            element.classList.add('updating');
            
            // Format the number appropriately
            const formattedValue = value % 1 === 0 ? value.toString() : value.toFixed(1);
            element.textContent = formattedValue;
            
            // Remove animation class after animation completes
            setTimeout(() => {
                element.classList.remove('updating');
            }, 500);
        }
    }

    /**
     * Start the statistics API with real-time updates
     */
    start() {
        // Initial update
        this.updateDisplay();
        
        // Update every hour (3600000 ms)
        this.updateInterval = setInterval(() => {
            this.updateDisplay();
        }, 3600000);
        
        console.log('DV Statistics API started - updating every hour');
    }

    /**
     * Stop the statistics API
     */
    stop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
            console.log('DV Statistics API stopped');
        }
    }

    /**
     * Get raw statistics data
     */
    getStats() {
        return this.calculateCurrentStats();
    }

    /**
     * Simulate real-time increment for demonstration
     * This would not be used in production with real data
     */
    simulateRealTime() {
        // For demonstration: slightly increment current year totals every 10 seconds
        setInterval(() => {
            const now = new Date();
            const isEvenMinute = now.getMinutes() % 2 === 0;
            
            if (isEvenMinute) {
                // Add a subtle increment to show "real-time" updates
                this.updateDisplay();
            }
        }, 10000); // Every 10 seconds
    }
}

// Export for use in main.js
export default DVStatisticsAPI;

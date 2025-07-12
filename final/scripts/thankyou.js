// Thank you page JavaScript module
import { setupNavigation } from './navigation.js';
import { LocalStorageManager } from './storageManager.js';

// Initialize components
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Setup navigation
        setupNavigation();
        
        // Initialize storage manager
        const storageManager = new LocalStorageManager();
        
        // Initialize thank you page functionality
        const thankYouPage = new ThankYouPage(storageManager);
        thankYouPage.init();
        
    } catch (error) {
        console.error('Error initializing thank you page:', error);
    }
});

class ThankYouPage {
    constructor(storageManager) {
        this.storageManager = storageManager;
    }
    
    init() {
        try {
            this.displayFormData();
            this.setupPageFunctionality();
            this.clearDraftData();
        } catch (error) {
            console.error('Error initializing thank you page:', error);
        }
    }
    
    displayFormData() {
        const formDataContainer = document.getElementById('form-data');
        if (!formDataContainer) return;
        
        // Get data from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        
        // Get data from localStorage as backup
        const storedData = this.storageManager.getFormData();
        
        // Combine URL params and stored data
        const formData = this.combineFormData(urlParams, storedData);
        
        if (Object.keys(formData).length === 0) {
            formDataContainer.innerHTML = `
                <div style="text-align: center; color: var(--gray-medium);">
                    <p>No form data available to display.</p>
                </div>
            `;
            return;
        }
        
        // Create summary display
        formDataContainer.innerHTML = this.createFormDataSummary(formData);
    }
    
    combineFormData(urlParams, storedData) {
        const combinedData = {};
        
        // Add URL parameters
        for (let [key, value] of urlParams.entries()) {
            combinedData[key] = value;
        }
        
        // Add additional data from localStorage if available
        if (storedData) {
            // Add message since it's not in URL (too long)
            if (storedData.message) {
                combinedData.message = storedData.message;
            }
            
            // Add submission timestamp
            if (storedData.submittedAt) {
                combinedData.submittedAt = storedData.submittedAt;
            }
        }
        
        return combinedData;
    }
    
    createFormDataSummary(formData) {
        const fieldLabels = {
            name: 'Name',
            email: 'Email',
            subject: 'Subject',
            priority: 'Priority Level',
            experience: 'Experience Level',
            message: 'Message',
            newsletter: 'Newsletter Subscription',
            submittedAt: 'Submitted At'
        };
        
        const fieldValues = {
            subject: {
                'general': 'General Question',
                'resource-suggestion': 'Resource Suggestion',
                'bug-report': 'Bug Report',
                'feedback': 'Feedback',
                'partnership': 'Partnership Inquiry'
            },
            priority: {
                'low': 'Low',
                'medium': 'Medium',
                'high': 'High'
            },
            experience: {
                'beginner': 'Beginner (0-1 years)',
                'intermediate': 'Intermediate (1-3 years)',
                'advanced': 'Advanced (3+ years)',
                'professional': 'Professional Developer'
            },
            newsletter: {
                'yes': 'Subscribed',
                'on': 'Subscribed'
            }
        };
        
        let summaryHTML = '<h3>Your Submission Summary</h3><div class="form-summary">';
        
        // Display fields in a specific order
        const fieldOrder = ['name', 'email', 'subject', 'priority', 'experience', 'message', 'newsletter', 'submittedAt'];
        
        fieldOrder.forEach(field => {
            if (formData[field]) {
                const label = fieldLabels[field] || this.capitalize(field);
                let value = formData[field];
                
                // Transform values if needed
                if (fieldValues[field] && fieldValues[field][value]) {
                    value = fieldValues[field][value];
                } else if (field === 'submittedAt') {
                    value = this.formatTimestamp(value);
                } else if (field === 'message') {
                    value = this.truncateMessage(value);
                }
                
                summaryHTML += `
                    <div class="form-field">
                        <strong>${label}:</strong> ${this.escapeHtml(value)}
                    </div>
                `;
            }
        });
        
        summaryHTML += '</div>';
        
        // Add confirmation message
        summaryHTML += `
            <div style="margin-top: 1.5rem; padding: 1rem; background-color: var(--light-color); border-radius: var(--border-radius);">
                <p><strong>📧 What happens next?</strong></p>
                <ul style="text-align: left; margin: 0.5rem 0 0 2rem;">
                    <li>Your message has been received and saved</li>
                    <li>We'll review your ${this.getSubjectDescription(formData.subject)} within 24 hours</li>
                    <li>You'll receive a response at <strong>${formData.email}</strong></li>
                    ${formData.newsletter ? '<li>You\'ll start receiving our newsletter with web development tips</li>' : ''}
                </ul>
            </div>
        `;
        
        return summaryHTML;
    }
    
    getSubjectDescription(subject) {
        const descriptions = {
            'general': 'general question',
            'resource-suggestion': 'resource suggestion',
            'bug-report': 'bug report',
            'feedback': 'feedback',
            'partnership': 'partnership inquiry'
        };
        
        return descriptions[subject] || 'message';
    }
    
    truncateMessage(message) {
        if (message.length <= 150) return message;
        return message.substring(0, 150) + '...';
    }
    
    formatTimestamp(timestamp) {
        try {
            const date = new Date(timestamp);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (error) {
            return timestamp;
        }
    }
    
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    setupPageFunctionality() {
        // Add smooth scrolling to anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Add animation to the success icon
        const successIcon = document.querySelector('.success-icon');
        if (successIcon) {
            successIcon.style.animation = 'bounceIn 0.8s ease-out';
        }
        
        // Store analytics data
        this.trackPageView();
        
        // Setup auto-redirect timer (optional)
        this.setupAutoRedirect();
    }
    
    trackPageView() {
        try {
            // Store that user reached thank you page
            this.storageManager.setUserPreference('lastFormSubmission', Date.now());
            
            // Increment form submission counter
            const submissionCount = this.storageManager.getUserPreference('formSubmissionCount', 0);
            this.storageManager.setUserPreference('formSubmissionCount', submissionCount + 1);
            
        } catch (error) {
            console.error('Error tracking page view:', error);
        }
    }
    
    setupAutoRedirect() {
        // Optional: Auto-redirect after 30 seconds
        const autoRedirectTime = 30000; // 30 seconds
        
        let timeLeft = autoRedirectTime / 1000;
        
        // Create countdown display
        const countdownDiv = document.createElement('div');
        countdownDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--primary-color);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: var(--border-radius);
            font-size: 0.9rem;
            display: none;
        `;
        
        document.body.appendChild(countdownDiv);
        
        // Start countdown after 10 seconds
        setTimeout(() => {
            countdownDiv.style.display = 'block';
            
            const countdownInterval = setInterval(() => {
                timeLeft--;
                countdownDiv.textContent = `Redirecting to home in ${timeLeft}s (click to cancel)`;
                
                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                    window.location.href = 'index.html';
                }
            }, 1000);
            
            // Cancel redirect if user clicks countdown
            countdownDiv.addEventListener('click', () => {
                clearInterval(countdownInterval);
                countdownDiv.style.display = 'none';
            });
            
        }, 10000);
    }
    
    clearDraftData() {
        // Clear any draft form data since form was successfully submitted
        try {
            this.storageManager.setUserPreference('draftFormData', null);
        } catch (error) {
            console.error('Error clearing draft data:', error);
        }
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes bounceIn {
        0% {
            transform: scale(0.3);
            opacity: 0;
        }
        50% {
            transform: scale(1.05);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    .form-summary {
        background: var(--white);
        border: 1px solid var(--gray-light);
        border-radius: var(--border-radius);
        padding: 1.5rem;
        margin: 1rem 0;
    }
    
    .form-field {
        margin-bottom: 0.75rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--light-color);
    }
    
    .form-field:last-child {
        border-bottom: none;
        margin-bottom: 0;
    }
    
    .form-field strong {
        color: var(--primary-color);
        display: inline-block;
        min-width: 120px;
    }
`;
document.head.appendChild(style);

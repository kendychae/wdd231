// Contact page JavaScript module
import { setupNavigation } from './navigation.js';
import { LocalStorageManager } from './storageManager.js';

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
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Setup navigation
        setupNavigation();
        
        // Update last modified date
        updateLastModified();
        
        // Initialize storage manager
        const storageManager = new LocalStorageManager();
        
        // Initialize contact form functionality
        const contactForm = new ContactForm(storageManager);
        contactForm.init();
        
    } catch (error) {
        console.error('Error initializing contact page:', error);
        showErrorMessage('Failed to initialize contact form.');
    }
});

class ContactForm {
    constructor(storageManager) {
        this.storageManager = storageManager;
        this.form = document.getElementById('contact-form');
        this.isSubmitting = false;
        this.validators = {};
        this.setupValidators();
    }
    
    init() {
        if (!this.form) {
            console.error('Contact form not found');
            return;
        }
        
        this.setupFormValidation();
        this.setupCharacterCount();
        this.setupFormSubmission();
        this.restoreFormData();
    }
    
    setupValidators() {
        this.validators = {
            name: {
                required: true,
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-Z\s\-']+$/,
                message: 'Name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            subject: {
                required: true,
                message: 'Please select a subject'
            },
            message: {
                required: true,
                minLength: 10,
                maxLength: 1000,
                message: 'Message must be between 10 and 1000 characters'
            },
            terms: {
                required: true,
                message: 'You must agree to the terms and conditions'
            }
        };
    }
    
    setupFormValidation() {
        // Real-time validation for all form fields
        Object.keys(this.validators).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('blur', () => this.validateField(fieldName));
                field.addEventListener('input', () => this.clearFieldError(fieldName));
            }
        });
        
        // Special handling for radio buttons
        const priorityRadios = document.querySelectorAll('input[name="priority"]');
        priorityRadios.forEach(radio => {
            radio.addEventListener('change', () => this.clearFieldError('priority'));
        });
    }
    
    setupCharacterCount() {
        const messageField = document.getElementById('message');
        const charCount = document.querySelector('.char-count');
        
        if (messageField && charCount) {
            messageField.addEventListener('input', () => {
                const currentLength = messageField.value.length;
                const maxLength = 1000;
                
                charCount.textContent = `${currentLength}/${maxLength} characters`;
                
                if (currentLength > maxLength * 0.9) {
                    charCount.style.color = 'var(--accent-color)';
                } else {
                    charCount.style.color = 'var(--gray-medium)';
                }
            });
        }
    }
    
    setupFormSubmission() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.isSubmitting) return;
            
            try {
                await this.handleFormSubmission();
            } catch (error) {
                console.error('Form submission error:', error);
                showErrorMessage('An error occurred while submitting the form. Please try again.');
            }
        });
    }
    
    async handleFormSubmission() {
        // Validate entire form
        const isValid = this.validateForm();
        
        if (!isValid) {
            showErrorMessage('Please correct the errors below and try again.');
            return;
        }
        
        this.isSubmitting = true;
        const submitBtn = document.getElementById('submit-btn');
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }
        
        try {
            // Collect form data
            const formData = this.collectFormData();
            
            // Save form data to localStorage
            this.storageManager.saveFormData(formData);
            
            // Simulate form submission delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Build query string for thank you page
            const queryString = this.buildQueryString(formData);
            
            // Redirect to thank you page
            window.location.href = `thankyou.html${queryString}`;
            
        } catch (error) {
            console.error('Error processing form submission:', error);
            showErrorMessage('Failed to submit form. Please try again.');
            
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        }
        
        this.isSubmitting = false;
    }
    
    validateForm() {
        let isValid = true;
        
        // Validate all fields
        Object.keys(this.validators).forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(fieldName) {
        const field = document.getElementById(fieldName);
        const validator = this.validators[fieldName];
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (!field || !validator) return true;
        
        let isValid = true;
        let errorMessage = '';
        
        const value = this.getFieldValue(field);
        
        // Required validation
        if (validator.required && (!value || value.trim() === '')) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} is required`;
        }
        
        // Length validation
        if (isValid && value) {
            if (validator.minLength && value.length < validator.minLength) {
                isValid = false;
                errorMessage = `${this.getFieldLabel(fieldName)} must be at least ${validator.minLength} characters`;
            }
            
            if (validator.maxLength && value.length > validator.maxLength) {
                isValid = false;
                errorMessage = `${this.getFieldLabel(fieldName)} must not exceed ${validator.maxLength} characters`;
            }
        }
        
        // Pattern validation
        if (isValid && value && validator.pattern && !validator.pattern.test(value)) {
            isValid = false;
            errorMessage = validator.message;
        }
        
        // Update UI
        this.updateFieldValidation(field, isValid, errorMessage, errorElement);
        
        return isValid;
    }
    
    getFieldValue(field) {
        if (field.type === 'checkbox') {
            return field.checked;
        } else if (field.type === 'radio') {
            const checkedRadio = document.querySelector(`input[name="${field.name}"]:checked`);
            return checkedRadio ? checkedRadio.value : '';
        } else {
            return field.value;
        }
    }
    
    getFieldLabel(fieldName) {
        const label = document.querySelector(`label[for="${fieldName}"]`);
        if (label) {
            return label.textContent.replace(' *', '');
        }
        return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    }
    
    updateFieldValidation(field, isValid, errorMessage, errorElement) {
        const formGroup = field.closest('.form-group');
        
        if (isValid) {
            formGroup?.classList.remove('error');
            if (errorElement) {
                errorElement.textContent = '';
            }
        } else {
            formGroup?.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errorMessage;
            }
        }
    }
    
    clearFieldError(fieldName) {
        const field = document.getElementById(fieldName);
        const formGroup = field?.closest('.form-group');
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        formGroup?.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }
    
    collectFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        // Convert FormData to regular object
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Add timestamp
        data.submittedAt = new Date().toISOString();
        
        return data;
    }
    
    buildQueryString(formData) {
        const params = new URLSearchParams();
        
        // Add selected fields to query string
        const fieldsToInclude = ['name', 'email', 'subject', 'priority', 'experience', 'newsletter'];
        
        fieldsToInclude.forEach(field => {
            if (formData[field]) {
                params.append(field, formData[field]);
            }
        });
        
        return params.toString() ? `?${params.toString()}` : '';
    }
    
    restoreFormData() {
        // Restore form data from localStorage if available (for draft functionality)
        const savedData = this.storageManager.getUserPreference('draftFormData');
        
        if (savedData) {
            try {
                Object.keys(savedData).forEach(key => {
                    const field = document.getElementById(key);
                    if (field && savedData[key]) {
                        if (field.type === 'checkbox') {
                            field.checked = savedData[key] === 'true';
                        } else if (field.type === 'radio') {
                            const radioOption = document.querySelector(`input[name="${key}"][value="${savedData[key]}"]`);
                            if (radioOption) radioOption.checked = true;
                        } else {
                            field.value = savedData[key];
                        }
                    }
                });
            } catch (error) {
                console.error('Error restoring form data:', error);
            }
        }
        
        // Save draft data as user types
        this.setupDraftSaving();
    }
    
    setupDraftSaving() {
        let saveTimeout;
        
        const saveFormDraft = () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                try {
                    const formData = this.collectFormData();
                    delete formData.submittedAt; // Remove timestamp for draft
                    this.storageManager.setUserPreference('draftFormData', formData);
                } catch (error) {
                    console.error('Error saving form draft:', error);
                }
            }, 1000);
        };
        
        // Add listeners to form inputs
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', saveFormDraft);
            input.addEventListener('change', saveFormDraft);
        });
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

// Success message function
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-notification';
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--success-color);
        color: white;
        padding: 1rem;
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow);
        z-index: 3000;
        max-width: 300px;
    `;
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 5000);
}

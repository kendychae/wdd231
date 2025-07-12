// Modal Manager module - handles modal dialogs and interactions
export class ModalManager {
    constructor() {
        this.currentModal = null;
        this.setupModalEventListeners();
    }
    
    setupModalEventListeners() {
        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.closeModal();
            }
        });
    }
    
    showTopicModal(resource) {
        try {
            const modal = document.getElementById('topic-modal');
            const modalBody = document.getElementById('modal-body');
            const closeBtn = document.getElementById('close-modal');
            
            if (!modal || !modalBody) {
                console.error('Modal elements not found');
                return;
            }
            
            // Create modal content
            modalBody.innerHTML = this.createTopicModalContent(resource);
            
            // Setup close button
            if (closeBtn) {
                closeBtn.onclick = () => this.closeModal();
            }
            
            // Show modal
            modal.style.display = 'block';
            this.currentModal = modal;
            
            // Focus management for accessibility
            this.trapFocus(modal);
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
        } catch (error) {
            console.error('Error showing topic modal:', error);
        }
    }
    
    showResourceModal(resource) {
        try {
            const modal = document.getElementById('resource-modal');
            const modalBody = document.getElementById('resource-modal-body');
            const closeBtn = document.getElementById('close-resource-modal');
            
            if (!modal || !modalBody) {
                console.error('Resource modal elements not found');
                return;
            }
            
            // Create modal content
            modalBody.innerHTML = this.createResourceModalContent(resource);
            
            // Setup close button
            if (closeBtn) {
                closeBtn.onclick = () => this.closeModal();
            }
            
            // Show modal
            modal.style.display = 'block';
            this.currentModal = modal;
            
            // Focus management for accessibility
            this.trapFocus(modal);
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
        } catch (error) {
            console.error('Error showing resource modal:', error);
        }
    }
    
    createTopicModalContent(resource) {
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
            <div class="modal-topic-category" style="background-color: ${bgColor}">
                ${resource.category}
            </div>
            <h2 class="modal-topic-title">${resource.title}</h2>
            <p class="modal-topic-description">${resource.description}</p>
            
            <div class="resource-contact-info">
                ${resource.phone ? `
                    <div class="contact-item">
                        <strong>📞 Phone:</strong> 
                        <a href="tel:${resource.phone.replace(/[^\d]/g, '')}">${resource.phone}</a>
                    </div>
                ` : ''}
                
                ${resource.availability ? `
                    <div class="contact-item">
                        <strong>🕒 Availability:</strong> ${resource.availability}
                    </div>
                ` : ''}
                
                ${resource.languages ? `
                    <div class="contact-item">
                        <strong>🌐 Languages:</strong> ${resource.languages}
                    </div>
                ` : ''}
            </div>
            
            <div class="modal-topic-type ${resource.type}">
                ${this.formatResourceType(resource.type)}
            </div>
            
            <div style="margin-top: 1.5rem;">
                <a href="${resource.website}" target="_blank" rel="noopener noreferrer" class="modal-topic-url">
                    Visit Website
                </a>
            </div>
            
            <div style="margin-top: 1rem; font-size: 0.9rem; color: var(--gray-medium);">
                💙 Remember: You are not alone. Help is available.
            </div>
        `;
    }
    
    formatResourceType(type) {
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
    
    createResourceModalContent(resource) {
        return `
            <div class="modal-topic-category" style="background-color: ${resource.color}">
                ${resource.category}
            </div>
            <h2 class="modal-topic-title">${resource.title}</h2>
            <p class="modal-topic-description">${resource.description}</p>
            <div class="modal-topic-difficulty difficulty-${resource.difficulty.toLowerCase()}">
                Difficulty: ${resource.difficulty}
            </div>
            <div style="margin-top: 1.5rem;">
                <a href="${resource.url}" target="_blank" rel="noopener noreferrer" class="modal-topic-url">
                    Visit Resource
                </a>
            </div>
            <div style="margin-top: 1rem;">
                <button onclick="this.closest('.modal').style.display='none'" 
                        style="background: var(--gray-medium); color: white; border: none; 
                               padding: 0.5rem 1rem; border-radius: var(--border-radius); 
                               cursor: pointer;">
                    Close
                </button>
            </div>
        `;
    }
    
    closeModal() {
        if (this.currentModal) {
            this.currentModal.style.display = 'none';
            this.currentModal = null;
            
            // Restore body scroll
            document.body.style.overflow = '';
            
            // Return focus to the element that opened the modal (if available)
            this.returnFocus();
        }
    }
    
    trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];
        
        if (firstFocusableElement) {
            firstFocusableElement.focus();
        }
        
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
    
    returnFocus() {
        // In a more complex application, you might store the previously focused element
        // For now, we'll focus on the spin button if it exists
        const spinBtn = document.getElementById('spin-btn');
        if (spinBtn) {
            spinBtn.focus();
        }
    }
    
    // Confirmation modal
    showConfirmationModal(message, onConfirm, onCancel = null) {
        try {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 400px; text-align: center;">
                    <h3 style="margin-top: 0;">Confirm Action</h3>
                    <p>${message}</p>
                    <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
                        <button id="confirm-btn" class="cta-button">Confirm</button>
                        <button id="cancel-btn" class="cta-button secondary">Cancel</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            const confirmBtn = modal.querySelector('#confirm-btn');
            const cancelBtn = modal.querySelector('#cancel-btn');
            
            const cleanup = () => {
                document.body.removeChild(modal);
                document.body.style.overflow = '';
            };
            
            confirmBtn.onclick = () => {
                if (onConfirm) onConfirm();
                cleanup();
            };
            
            cancelBtn.onclick = () => {
                if (onCancel) onCancel();
                cleanup();
            };
            
            modal.onclick = (e) => {
                if (e.target === modal) {
                    if (onCancel) onCancel();
                    cleanup();
                }
            };
            
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            confirmBtn.focus();
            
        } catch (error) {
            console.error('Error showing confirmation modal:', error);
        }
    }
    
    // Alert modal (for simple notifications)
    showAlertModal(title, message, type = 'info') {
        try {
            const modal = document.createElement('div');
            modal.className = 'modal';
            
            let iconColor = 'var(--secondary-color)';
            let icon = 'ℹ️';
            
            switch (type) {
                case 'success':
                    iconColor = 'var(--success-color)';
                    icon = '✅';
                    break;
                case 'warning':
                    iconColor = 'var(--warning-color)';
                    icon = '⚠️';
                    break;
                case 'error':
                    iconColor = 'var(--accent-color)';
                    icon = '❌';
                    break;
            }
            
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 400px; text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">${icon}</div>
                    <h3 style="margin-top: 0; color: ${iconColor};">${title}</h3>
                    <p>${message}</p>
                    <button id="ok-btn" class="cta-button" style="margin-top: 1rem;">OK</button>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            const okBtn = modal.querySelector('#ok-btn');
            
            const cleanup = () => {
                document.body.removeChild(modal);
                document.body.style.overflow = '';
            };
            
            okBtn.onclick = cleanup;
            
            modal.onclick = (e) => {
                if (e.target === modal) {
                    cleanup();
                }
            };
            
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            okBtn.focus();
            
        } catch (error) {
            console.error('Error showing alert modal:', error);
        }
    }
}

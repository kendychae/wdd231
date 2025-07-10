// Set timestamp when page loads
document.addEventListener('DOMContentLoaded', function() {
    const timestampField = document.getElementById('timestamp');
    const now = new Date();
    timestampField.value = now.toLocaleString();
});

// Modal functionality
const modals = document.querySelectorAll('.modal');
const learnMoreBtns = document.querySelectorAll('.learn-more-btn');
const closeBtns = document.querySelectorAll('.close');

// Open modal when learn more button is clicked
learnMoreBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const modalId = this.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        modal.style.display = 'block';
    });
});

// Close modal when close button is clicked
closeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }
});

// Form validation enhancement
const form = document.querySelector('form');
const organizationalTitleInput = document.getElementById('organizationalTitle');

// Add pattern validation feedback for organizational title
organizationalTitleInput.addEventListener('input', function() {
    const pattern = /^[A-Za-z\s\-]{7,}$/;
    const value = this.value;
    
    if (value && !pattern.test(value)) {
        this.setCustomValidity('Please enter at least 7 characters using only letters, spaces, and hyphens.');
    } else {
        this.setCustomValidity('');
    }
});

// Form submission
form.addEventListener('submit', function(event) {
    // Update timestamp just before submission
    const timestampField = document.getElementById('timestamp');
    const now = new Date();
    timestampField.value = now.toLocaleString();
});

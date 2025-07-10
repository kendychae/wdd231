// Get URL parameters and display form information
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get form data from URL parameters
    const firstName = urlParams.get('firstName') || '';
    const lastName = urlParams.get('lastName') || '';
    const email = urlParams.get('email') || '';
    const phone = urlParams.get('phone') || '';
    const businessName = urlParams.get('businessName') || '';
    const membershipLevel = urlParams.get('membershipLevel') || '';
    const timestamp = urlParams.get('timestamp') || '';
    
    // Display the information in the thank you page
    document.getElementById('applicant-name').textContent = 
        firstName && lastName ? `${firstName} ${lastName}` : 'Not provided';
    
    document.getElementById('applicant-email').textContent = 
        email || 'Not provided';
    
    document.getElementById('applicant-phone').textContent = 
        phone || 'Not provided';
    
    document.getElementById('business-name').textContent = 
        businessName || 'Not provided';
    
    // Format membership level display
    let membershipDisplay = 'Not provided';
    if (membershipLevel) {
        switch(membershipLevel) {
            case 'NP':
                membershipDisplay = 'NP Membership (Non-Profit)';
                break;
            case 'Bronze':
                membershipDisplay = 'Bronze Membership';
                break;
            case 'Silver':
                membershipDisplay = 'Silver Membership';
                break;
            case 'Gold':
                membershipDisplay = 'Gold Membership';
                break;
            default:
                membershipDisplay = membershipLevel;
        }
    }
    document.getElementById('membership-level').textContent = membershipDisplay;
    
    document.getElementById('application-timestamp').textContent = 
        timestamp || 'Not provided';
});

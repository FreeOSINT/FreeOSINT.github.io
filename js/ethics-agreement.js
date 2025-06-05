/**
 * Ethics Agreement functionality for FreeOSINT.org
 * Ensures users agree to use OSINT tools ethically and responsibly
 */

document.addEventListener('DOMContentLoaded', function() {
    const ethicsModal = document.getElementById('ethics-modal');
    const agreeButton = document.getElementById('agree-button');
    const disagreeButton = document.getElementById('disagree-button');
    
    // Check if user has already agreed to the ethics statement
    const hasAgreed = localStorage.getItem('ethics_agreement_accepted');
    
    // Show the modal if the user hasn't agreed yet
    if (!hasAgreed) {
        showEthicsModal();
    }
    
    // Handle agree button click
    agreeButton.addEventListener('click', function() {
        // Save agreement to localStorage
        localStorage.setItem('ethics_agreement_accepted', 'true');
        localStorage.setItem('ethics_agreement_date', new Date().toISOString());
        
        // Hide the modal
        hideEthicsModal();
    });
    
    // Handle disagree button click
    disagreeButton.addEventListener('click', function() {
        // Show a message explaining why agreement is necessary
        const modalContent = ethicsModal.querySelector('.prose');
        modalContent.innerHTML = `
            <div class="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg mb-6 border-l-4 border-red-500 dark:border-red-400">
                <h3 class="font-bold text-red-700 dark:text-red-300 mb-2">Agreement Required</h3>
                <p class="text-gray-700 dark:text-gray-300">
                    We're sorry, but you must agree to our ethics statement to use FreeOSINT.org.
                </p>
                <p class="text-gray-700 dark:text-gray-300 mt-4">
                    This agreement is necessary to ensure that our educational resources are used responsibly and legally.
                </p>
            </div>
            
            <p class="text-gray-700 dark:text-gray-300 mb-4">
                If you have concerns about the ethics agreement, please contact us for clarification.
            </p>
            
            <p class="text-gray-700 dark:text-gray-300">
                You can review the ethics statement again by refreshing this page.
            </p>
        `;
        
        // Change the buttons
        disagreeButton.textContent = "Close";
        disagreeButton.addEventListener('click', function() {
            // Redirect to a neutral site if they still disagree
            window.location.href = "https://www.google.com";
        }, { once: true });
        
        // Hide the agree button
        agreeButton.style.display = "none";
    });
    
    // Function to show the ethics modal
    function showEthicsModal() {
        ethicsModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    // Function to hide the ethics modal
    function hideEthicsModal() {
        ethicsModal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    }
});
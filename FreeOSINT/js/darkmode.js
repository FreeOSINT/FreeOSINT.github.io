// Enhanced dark mode functionality
document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const mobileDarkModeToggle = document.getElementById('mobile-dark-mode-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved user preference
    const savedTheme = localStorage.getItem('theme');
    
    // Set initial theme based on saved preference or system preference
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
    
    // Toggle dark mode when desktop button is clicked
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            if (htmlElement.classList.contains('dark')) {
                disableDarkMode();
            } else {
                enableDarkMode();
            }
        });
    }
    
    // Toggle dark mode when mobile button is clicked
    if (mobileDarkModeToggle) {
        mobileDarkModeToggle.addEventListener('click', () => {
            if (htmlElement.classList.contains('dark')) {
                disableDarkMode();
            } else {
                enableDarkMode();
            }
        });
    }
    
    // Functions to enable/disable dark mode
    function enableDarkMode() {
        htmlElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        updateToggleIcons(true);
    }
    
    function disableDarkMode() {
        htmlElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        updateToggleIcons(false);
    }
    
    // Update all toggle icons based on current mode
    function updateToggleIcons(isDark) {
        // Update desktop toggle
        if (darkModeToggle) {
            const sunIcon = darkModeToggle.querySelector('.sun-icon');
            const moonIcon = darkModeToggle.querySelector('.moon-icon');
            
            if (sunIcon && moonIcon) {
                if (isDark) {
                    sunIcon.classList.remove('hidden');
                    moonIcon.classList.add('hidden');
                } else {
                    sunIcon.classList.add('hidden');
                    moonIcon.classList.remove('hidden');
                }
            }
        }
        
        // Update mobile toggle
        if (mobileDarkModeToggle) {
            const mobileSunIcon = mobileDarkModeToggle.querySelector('.sun-icon');
            const mobileMoonIcon = mobileDarkModeToggle.querySelector('.moon-icon');
            
            if (mobileSunIcon && mobileMoonIcon) {
                if (isDark) {
                    mobileSunIcon.classList.remove('hidden');
                    mobileMoonIcon.classList.add('hidden');
                } else {
                    mobileSunIcon.classList.add('hidden');
                    mobileMoonIcon.classList.remove('hidden');
                }
            }
        }
    }
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        }
    });
});
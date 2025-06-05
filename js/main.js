/**
 * Main JavaScript file for FreeOSINT.org
 */

// Store user progress in localStorage
const userProgress = {
    // Get module progress from localStorage or initialize empty object
    getModuleProgress: function(moduleId) {
        const progress = JSON.parse(localStorage.getItem('freeosint_progress') || '{}');
        return progress[moduleId] || { completed: false, currentSection: 0, completedSections: [] };
    },
    
    // Save module progress to localStorage
    saveModuleProgress: function(moduleId, progressData) {
        const progress = JSON.parse(localStorage.getItem('freeosint_progress') || '{}');
        progress[moduleId] = progressData;
        localStorage.setItem('freeosint_progress', JSON.stringify(progress));
    },
    
    // Mark a section as completed
    completeSection: function(moduleId, sectionIndex) {
        const progress = this.getModuleProgress(moduleId);
        if (!progress.completedSections.includes(sectionIndex)) {
            progress.completedSections.push(sectionIndex);
        }
        progress.currentSection = sectionIndex + 1;
        this.saveModuleProgress(moduleId, progress);
        return progress;
    },
    
    // Calculate completion percentage
    calculateCompletion: function(moduleId, totalSections) {
        const progress = this.getModuleProgress(moduleId);
        if (totalSections === 0) return 0;
        return Math.round((progress.completedSections.length / totalSections) * 100);
    },
    
    // Reset progress for a module
    resetModuleProgress: function(moduleId) {
        const progress = this.getModuleProgress(moduleId);
        progress.completed = false;
        progress.currentSection = 0;
        progress.completedSections = [];
        this.saveModuleProgress(moduleId, progress);
    }
};

// Utility functions
const utils = {
    // Format duration from minutes to readable format
    formatDuration: function(minutes) {
        if (minutes < 60) {
            return `${minutes} min`;
        } else {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
        }
    },
    
    // Create difficulty badge with enhanced visibility in dark mode
    createDifficultyBadge: function(difficulty) {
        const badgeClass = `badge-${difficulty.toLowerCase()}`;
        return `<span class="inline-block px-2 py-1 text-xs font-semibold rounded shadow-sm ${badgeClass}">${difficulty}</span>`;
    },
    
    // Sanitize HTML to prevent XSS
    sanitizeHTML: function(html) {
        const temp = document.createElement('div');
        temp.textContent = html;
        return temp.innerHTML;
    },
    
    // Shuffle array (for quiz options)
    shuffleArray: function(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
};

// Initialize mobile menu and other UI elements
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Initialize scroll animations
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animateElements.length > 0) {
        // Initial check for elements in viewport
        checkAnimations();
        
        // Check on scroll
        window.addEventListener('scroll', checkAnimations);
        
        function checkAnimations() {
            animateElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('animated');
                }
            });
        }
    }
    
    // Check for saved theme preference or respect OS preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
        document.documentElement.classList.add('dark');
        updateDarkModeIcons(true);
    } else {
        updateDarkModeIcons(false);
    }
    
    // Helper function to update dark mode icons if darkmode.js isn't loaded
    function updateDarkModeIcons(isDark) {
        const darkModeToggles = [
            document.getElementById('dark-mode-toggle'),
            document.getElementById('mobile-dark-mode-toggle')
        ];
        
        darkModeToggles.forEach(toggle => {
            if (toggle) {
                const sunIcon = toggle.querySelector('.sun-icon');
                const moonIcon = toggle.querySelector('.moon-icon');
                
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
        });
    }
});
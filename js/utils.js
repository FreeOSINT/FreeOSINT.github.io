/**
 * Utility functions for FreeOSINT.org
 * Contains user progress tracking and UI helper functions
 */

// User progress tracking
const userProgress = {
    getModuleProgress: function(moduleId) {
        const progress = localStorage.getItem(`osint_module_${moduleId}`);
        return progress ? JSON.parse(progress) : { completed: [], currentSection: 0 };
    },
    
    saveModuleProgress: function(moduleId, sectionIndex, completed = false) {
        const progress = this.getModuleProgress(moduleId);
        progress.currentSection = sectionIndex;
        
        if (completed && !progress.completed.includes(sectionIndex)) {
            progress.completed.push(sectionIndex);
        }
        
        localStorage.setItem(`osint_module_${moduleId}`, JSON.stringify(progress));
    },
    
    calculateCompletion: function(moduleId, totalSections) {
        if (totalSections === 0) return 0;
        
        const progress = this.getModuleProgress(moduleId);
        return Math.round((progress.completed.length / totalSections) * 100);
    }
};

// Utility functions
const utils = {
    formatDuration: function(minutes) {
        if (minutes < 60) {
            return `${minutes} minutes`;
        } else {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hour${hours > 1 ? 's' : ''}`;
        }
    },
    
    createDifficultyBadge: function(difficulty) {
        const level = difficulty.toLowerCase();
        let badgeClass = '';
        
        switch (level) {
            case 'beginner':
                badgeClass = 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300';
                break;
            case 'intermediate':
                badgeClass = 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300';
                break;
            case 'advanced':
                badgeClass = 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300';
                break;
            default:
                badgeClass = 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
        }
        
        return `<span class="inline-block ${badgeClass} text-xs px-2 py-0.5 rounded-full uppercase font-semibold tracking-wide">${difficulty}</span>`;
    }
};
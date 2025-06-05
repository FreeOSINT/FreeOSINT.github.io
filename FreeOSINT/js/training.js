/**
 * Training module functionality for FreeOSINT.org
 * Handles module listing, loading, and navigation
 */

// DOM Elements
const modulesList = document.getElementById('modules-list');
const moduleContent = document.getElementById('module-content');
const modulesContainer = document.getElementById('modules-container');
const moduleSearch = document.getElementById('module-search');
const backButton = document.getElementById('back-to-modules');
const moduleTitle = document.getElementById('module-title');
const moduleDifficulty = document.getElementById('module-difficulty');
const moduleDuration = document.getElementById('module-duration');
const moduleDescription = document.getElementById('module-description');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const sectionContainer = document.getElementById('section-container');
const prevSectionButton = document.getElementById('prev-section');
const nextSectionButton = document.getElementById('next-section');
const categoryFilters = document.querySelectorAll('.category-filter');

// State variables
let currentModule = null;
let currentSectionIndex = 0;
let userAnswers = {};
let currentCategory = 'all';
let allModules = [];

// ============================
// MAIN INITIALIZATION FUNCTION
// ============================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Training module initialized');
    
    // Check if we have the required elements
    if (!modulesList || !moduleContent) {
        console.error('Required DOM elements not found');
        return;
    }
    
    // Initialize the module list
    loadModules();
    
    // Set up event listeners for navigation
    setupEventListeners();
    
    // Listen for theme changes
    document.addEventListener('themeChanged', (e) => {
        console.log('Theme changed:', e.detail.isDark ? 'dark' : 'light');
        
        // If we have syntax highlighting or other theme-dependent elements, 
        // we can update them here
        const codeBlocks = document.querySelectorAll('pre code');
        if (codeBlocks.length > 0 && window.hljs) {
            codeBlocks.forEach(block => {
                window.hljs.highlightElement(block);
            });
        }
        
        // Update any charts or visualizations if needed
        if (window.charts) {
            for (const chartId in window.charts) {
                const chart = window.charts[chartId];
                if (chart && typeof chart.update === 'function') {
                    // Update chart theme
                    const newTheme = e.detail.isDark ? 'dark' : 'light';
                    chart.setOption({
                        backgroundColor: newTheme === 'dark' ? '#1e293b' : '#ffffff',
                        textStyle: {
                            color: newTheme === 'dark' ? '#e5e7eb' : '#374151'
                        }
                    });
                    chart.update();
                }
            }
        }
    });
});

// ============================
// MODULE LISTING FUNCTIONS
// ============================

// Load all available modules
async function loadModules() {
    try {
        console.log('Loading modules list');
        
        // Determine the correct path based on the current page location
        let basePath = '';
        if (window.location.pathname.includes('/pages/')) {
            basePath = '../';
        }
        
        // Try multiple paths to load the modules index
        const possiblePaths = [
            `${basePath}modules/index.json`,
            'modules/index.json',
            '/modules/index.json',
            '/FreeOSINT/modules/index.json'
        ];
        
        let modules = null;
        
        // Try each path until we find one that works
        for (const path of possiblePaths) {
            try {
                console.log(`Trying to fetch modules from: ${path}`);
                const timestamp = new Date().getTime();
                const response = await fetch(`${path}?_=${timestamp}`);
                
                if (response.ok) {
                    modules = await response.json();
                    console.log(`Successfully loaded ${modules.length} modules from: ${path}`);
                    break;
                }
            } catch (pathError) {
                console.log(`Failed to load from path: ${path}`, pathError.message);
            }
        }
        
        // If we couldn't load the modules, use a minimal set
        if (!modules || !modules.length) {
            console.warn('Using minimal module data');
            modules = [
                {
                    "id": "intro-to-osint",
                    "title": "Introduction to OSINT",
                    "description": "Learn the fundamentals of Open Source Intelligence, including key concepts, tools, and methodologies.",
                    "difficulty": "Beginner",
                    "duration": 45,
                    "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
                    "featured": true,
                    "tags": ["basics", "introduction", "fundamentals"]
                },
                {
                    "id": "digital-footprint",
                    "title": "Digital Footprint Analysis",
                    "description": "Learn how to analyze and interpret digital footprints to gather intelligence about individuals and organizations.",
                    "difficulty": "Intermediate",
                    "duration": 90,
                    "image": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
                    "featured": true,
                    "tags": ["digital footprint", "online presence", "data analysis"]
                },
                {
                    "id": "social-media-investigation",
                    "title": "Social Media Investigation",
                    "description": "Discover techniques for gathering intelligence from various social media platforms while respecting privacy and terms of service.",
                    "difficulty": "Intermediate",
                    "duration": 60,
                    "image": "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
                    "featured": true,
                    "tags": ["social media", "investigation", "techniques"]
                },
                {
                    "id": "osint-ethics",
                    "title": "Ethics in OSINT Investigations",
                    "description": "Explore the ethical dimensions of Open Source Intelligence gathering and learn how to conduct responsible investigations.",
                    "difficulty": "Intermediate",
                    "duration": 60,
                    "image": "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
                    "featured": true,
                    "tags": ["ethics", "privacy", "responsibility", "legal"]
                }
            ];
        }
        
        console.log(`Loaded ${modules.length} modules`);
        
        // Store all modules for later use
        allModules = modules;
        
        // Display the modules
        displayModules(modules);
        
        // Check if a specific module is requested in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const moduleId = urlParams.get('module');
        
        if (moduleId) {
            console.log(`Module requested in URL: ${moduleId}`);
            
            // Find the requested module
            const module = modules.find(m => m.id === moduleId);
            
            if (module) {
                loadModule(module);
            } else {
                console.error(`Module not found: ${moduleId}`);
                // Show error message instead of redirecting
                if (modulesContainer) {
                    modulesContainer.innerHTML = `
                        <div class="col-span-3 text-center py-8">
                            <p class="text-red-600 dark:text-red-400 text-lg font-semibold mb-4">Module Not Found</p>
                            <p class="text-gray-700 dark:text-gray-300 mb-6">The requested module "${moduleId}" could not be found.</p>
                            <button onclick="window.location.href = 'training.html'" class="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                                Back to Modules
                            </button>
                        </div>
                    `;
                }
            }
        }
        
        // Set up search functionality
        if (moduleSearch) {
            moduleSearch.addEventListener('input', () => {
                const searchTerm = moduleSearch.value.toLowerCase();
                
                // Filter modules by search term and category
                let filteredModules = modules.filter(module => 
                    module.title.toLowerCase().includes(searchTerm) || 
                    module.description.toLowerCase().includes(searchTerm) ||
                    (module.tags && module.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
                );
                
                // Apply category filter if not 'all'
                if (currentCategory !== 'all') {
                    filteredModules = filteredModules.filter(module => 
                        module.difficulty && module.difficulty.toLowerCase() === currentCategory
                    );
                }
                
                displayModules(filteredModules);
            });
        }
        
        // Set up category filters
        if (categoryFilters) {
            categoryFilters.forEach(filter => {
                filter.addEventListener('click', () => {
                    // Remove active class from all filters
                    categoryFilters.forEach(f => {
                        f.classList.remove('bg-blue-600', 'text-white');
                        f.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-gray-200');
                    });
                    
                    // Add active class to clicked filter
                    filter.classList.add('bg-blue-600', 'text-white');
                    filter.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-gray-200');
                    
                    // Update current category
                    currentCategory = filter.dataset.category;
                    
                    // Filter modules
                    let filteredModules = modules;
                    
                    if (currentCategory !== 'all') {
                        filteredModules = modules.filter(module => 
                            module.difficulty && module.difficulty.toLowerCase() === currentCategory
                        );
                    }
                    
                    // Apply search filter if search term exists
                    const searchTerm = moduleSearch ? moduleSearch.value.toLowerCase() : '';
                    if (searchTerm) {
                        filteredModules = filteredModules.filter(module => 
                            module.title.toLowerCase().includes(searchTerm) || 
                            module.description.toLowerCase().includes(searchTerm) ||
                            (module.tags && module.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
                        );
                    }
                    
                    displayModules(filteredModules);
                });
            });
        }
        
    } catch (error) {
        console.error('Error loading modules:', error);
        
        if (modulesContainer) {
            modulesContainer.innerHTML = `
                <div class="col-span-3 text-center py-8">
                    <p class="text-red-600 dark:text-red-400 text-lg font-semibold mb-4">Failed to load modules</p>
                    <p class="text-gray-700 dark:text-gray-300 mb-6">There was a problem loading the training modules. Please try again later.</p>
                    <button onclick="window.location.reload()" class="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                        Try Again
                    </button>
                </div>
            `;
        }
    }
}

// Display modules in the grid
function displayModules(modules) {
    if (!modulesContainer) return;
    
    // Clear the container
    modulesContainer.innerHTML = '';
    
    if (!modules || modules.length === 0) {
        modulesContainer.innerHTML = `
            <div class="col-span-3 text-center py-12">
                <svg class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-gray-700 dark:text-gray-300 text-xl mb-4">No modules found matching your criteria.</p>
                <button onclick="window.location.href = 'training.html'" class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1">
                    Show All Modules
                </button>
            </div>
        `;
        return;
    }
    
    console.log(`Displaying ${modules.length} modules`);
    
    // Create a card for each module
    modules.forEach((module, index) => {
        if (!module || !module.id) {
            console.error('Invalid module data:', module);
            return;
        }
        
        const card = document.createElement('div');
        card.className = 'module-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Create the image container
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';
        
        // Create the image
        const image = document.createElement('img');
        image.src = module.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80';
        image.alt = module.title;
        imageContainer.appendChild(image);
        
        // Create the content container
        const contentContainer = document.createElement('div');
        contentContainer.className = 'content';
        
        // Create the title
        const title = document.createElement('h3');
        title.className = 'title';
        title.textContent = module.title;
        
        // Create the description
        const description = document.createElement('p');
        description.className = 'description';
        description.textContent = module.description;
        
        // Create the meta container
        const metaContainer = document.createElement('div');
        metaContainer.className = 'meta';
        
        // Create the difficulty badge
        const difficultyBadge = document.createElement('span');
        let badgeClass = '';
        let badgeIcon = '';
        
        switch ((module.difficulty || 'Beginner').toLowerCase()) {
            case 'beginner':
                badgeClass = 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300';
                badgeIcon = '<svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>';
                break;
            case 'intermediate':
                badgeClass = 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300';
                badgeIcon = '<svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>';
                break;
            case 'advanced':
                badgeClass = 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300';
                badgeIcon = '<svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path></svg>';
                break;
            default:
                badgeClass = 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
                badgeIcon = '<svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
        }
        
        difficultyBadge.className = `badge flex items-center ${badgeClass}`;
        difficultyBadge.innerHTML = `${badgeIcon}${module.difficulty || 'Beginner'}`;
        
        // Create the duration
        const duration = document.createElement('div');
        duration.className = 'duration';
        duration.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ${formatDuration(module.duration || 30)}
        `;
        
        // Add elements to the meta container
        metaContainer.appendChild(difficultyBadge);
        metaContainer.appendChild(duration);
        
        // Add all elements to the content container
        contentContainer.appendChild(title);
        contentContainer.appendChild(description);
        contentContainer.appendChild(metaContainer);
        
        // Add the image and content to the card
        card.appendChild(imageContainer);
        card.appendChild(contentContainer);
        
        // Add click event to load the module
        card.addEventListener('click', () => {
            loadModule(module);
        });
        
        // Add the card to the container
        modulesContainer.appendChild(card);
    });
}

// Format duration in minutes to a readable string
function formatDuration(minutes) {
    // Use utils.formatDuration if available, otherwise use local implementation
    if (window.utils && typeof window.utils.formatDuration === 'function') {
        return window.utils.formatDuration(minutes);
    }
    
    if (minutes < 60) {
        return `${minutes} minutes`;
    } else {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
    }
}

// ============================
// MODULE CONTENT FUNCTIONS
// ============================

// Load a specific module
async function loadModule(module) {
    try {
        console.log(`Loading module: ${module.id}`);
        
        // Show module content view, hide module list
        if (modulesList) modulesList.classList.add('hidden');
        if (moduleContent) moduleContent.classList.remove('hidden');
        
        // Hide the hero section if it exists
        const heroSection = document.querySelector('.bg-gradient-to-br');
        if (heroSection) heroSection.classList.add('hidden');
        
        // Update module header information
        if (moduleTitle) moduleTitle.textContent = module.title || 'Untitled Module';
        
        if (moduleDifficulty) {
            const difficultyText = module.difficulty || 'Beginner';
            let badgeClass = '';
            let badgeIcon = '';
            
            switch (difficultyText.toLowerCase()) {
                case 'beginner':
                    badgeClass = 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300';
                    badgeIcon = '<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>';
                    break;
                case 'intermediate':
                    badgeClass = 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300';
                    badgeIcon = '<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>';
                    break;
                case 'advanced':
                    badgeClass = 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300';
                    badgeIcon = '<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path></svg>';
                    break;
                default:
                    badgeClass = 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
                    badgeIcon = '<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
            }
            
            moduleDifficulty.className = `badge flex items-center ${badgeClass}`;
            moduleDifficulty.innerHTML = `${badgeIcon}${difficultyText}`;
        }
        
        if (moduleDuration) {
            moduleDuration.className = 'badge flex items-center bg-white/20';
            moduleDuration.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ${formatDuration(module.duration || 30)}
            `;
        }
        
        if (moduleDescription) {
            moduleDescription.textContent = module.description || 'No description available.';
        }
        
        // Try to load the module data from the JSON file
        let moduleData = null;
        
        // Determine the correct path based on the current page location
        let basePath = '';
        if (window.location.pathname.includes('/pages/')) {
            basePath = '../';
        }
        
        // Try multiple paths to load the module
        const possiblePaths = [
            `${basePath}modules/${module.id}.json`,
            `modules/${module.id}.json`,
            `/modules/${module.id}.json`,
            `/FreeOSINT/modules/${module.id}.json`
        ];
        
        // Try each path until we find one that works
        for (const path of possiblePaths) {
            try {
                console.log(`Trying to fetch module from: ${path}`);
                const timestamp = new Date().getTime();
                const response = await fetch(`${path}?_=${timestamp}`);
                
                if (response.ok) {
                    moduleData = await response.json();
                    console.log(`Successfully loaded module from: ${path}`);
                    break;
                }
            } catch (pathError) {
                console.log(`Failed to load from path: ${path}`, pathError.message);
            }
        }
        
        // If we couldn't load the module data, create a default one
        if (!moduleData) {
            console.warn(`Could not load module data for ${module.id}, creating default`);
            moduleData = {
                id: module.id,
                title: module.title,
                description: module.description,
                difficulty: module.difficulty,
                duration: module.duration,
                sections: [
                    {
                        title: "Module Content",
                        content: "<p>This module is currently under development. Please check back later for the full content.</p>"
                    }
                ]
            };
        }
        
        // Store the current module
        currentModule = moduleData;
        
        // Reset the current section index
        currentSectionIndex = 0;
        
        // Check if the module has sections
        if (!currentModule.sections || currentModule.sections.length === 0) {
            console.warn(`Module ${module.id} has no sections, creating default section`);
            currentModule.sections = [{
                title: "Module Content",
                content: "<p>This module is currently under development. Please check back later for the full content.</p>"
            }];
        }
        
        // Update the progress information
        updateProgress();
        
        // Load the first section
        loadSection(0);
        
        // Update URL without reloading the page if not already set
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('module') !== module.id) {
            const url = new URL(window.location.href);
            url.searchParams.set('module', module.id);
            window.history.pushState({}, '', url);
        }
        
    } catch (error) {
        console.error('Error loading module:', error);
        
        // Create a fallback module with a simple section
        currentModule = {
            id: module.id,
            title: module.title || 'Untitled Module',
            sections: [{
                title: "Module Content",
                content: `
                    <div class="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 dark:border-yellow-600 p-6 mb-6">
                        <h3 class="text-xl font-bold text-yellow-700 dark:text-yellow-400 mb-2">Module Data Not Available</h3>
                        <p class="text-yellow-700 dark:text-yellow-400">We couldn't load the detailed content for this module.</p>
                        <p class="text-yellow-700 dark:text-yellow-400 mt-2">Error: ${error.message}</p>
                    </div>
                    <p>This module is currently under development. Please check back later for the full content.</p>
                    <div class="mt-4">
                        <button onclick="window.location.reload()" class="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                            Try Again
                        </button>
                    </div>
                `
            }]
        };
        
        // Update the progress information
        updateProgress();
        
        // Load the fallback section
        loadSection(0);
    }
}

// Load a specific section of the current module
function loadSection(index) {
    try {
        if (!currentModule || !currentModule.sections) {
            console.error('Cannot load section: currentModule or sections not defined');
            
            if (sectionContainer) {
                sectionContainer.innerHTML = `
                    <div class="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600 p-6 mb-6">
                        <h3 class="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Error Loading Content</h3>
                        <p class="text-red-700 dark:text-red-400">We couldn't load the module content. Please try again later.</p>
                        <div class="mt-4">
                            <button onclick="window.location.reload()" class="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                                Try Again
                            </button>
                            <button onclick="window.location.href = 'training.html'" class="ml-2 px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
                                Back to Modules
                            </button>
                        </div>
                    </div>
                `;
            }
            
            return;
        }
        
        console.log(`Loading section ${index + 1} of ${currentModule.sections.length}`);
        
        // Update current section index
        currentSectionIndex = index;
        
        // Update navigation buttons
        if (prevSectionButton) {
            prevSectionButton.disabled = currentSectionIndex === 0;
            prevSectionButton.classList.toggle('opacity-50', currentSectionIndex === 0);
        }
        
        if (nextSectionButton) {
            const isLastSection = currentSectionIndex >= currentModule.sections.length - 1;
            nextSectionButton.disabled = isLastSection;
            nextSectionButton.classList.toggle('opacity-50', isLastSection);
            
            // Change text for last section
            nextSectionButton.textContent = isLastSection ? 'Complete' : 'Next';
        }
        
        // Get the current section
        const section = currentModule.sections[currentSectionIndex];
        
        if (!section) {
            console.error(`Section ${index} not found in module ${currentModule.id}`);
            
            if (sectionContainer) {
                sectionContainer.innerHTML = `
                    <div class="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600 p-6 mb-6">
                        <h3 class="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Section Not Found</h3>
                        <p class="text-red-700 dark:text-red-400">The requested section could not be found.</p>
                        <div class="mt-4">
                            <button onclick="window.location.href = 'training.html'" class="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                                Back to Modules
                            </button>
                        </div>
                    </div>
                `;
            }
            
            return;
        }
        
        // Update progress
        updateProgress();
        
        // Render the section content
        renderSection(section);
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Add animation class
        if (sectionContainer) {
            sectionContainer.classList.add('animate-fade-in');
            setTimeout(() => {
                sectionContainer.classList.remove('animate-fade-in');
            }, 500);
        }
    } catch (error) {
        console.error('Error loading section:', error);
        
        if (sectionContainer) {
            sectionContainer.innerHTML = `
                <div class="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600 p-6 mb-6">
                    <h3 class="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Error Loading Section</h3>
                    <p class="text-red-700 dark:text-red-400">An unexpected error occurred while loading this section: ${error.message}</p>
                    <div class="mt-4">
                        <button onclick="loadSection(${index})" class="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                            Try Again
                        </button>
                    </div>
                </div>
            `;
        }
    }
}

// Render a section
function renderSection(section) {
    if (!sectionContainer) return;
    
    // Clear the section container
    sectionContainer.innerHTML = '';
    
    // Create the section element
    const sectionElement = document.createElement('div');
    sectionElement.className = 'module-fade-in';
    
    // Add the section title
    const titleElement = document.createElement('h3');
    titleElement.className = 'text-2xl font-bold text-blue-700 dark:text-blue-500 mb-4';
    titleElement.textContent = section.title;
    sectionElement.appendChild(titleElement);
    
    // Handle different section types
    if (section.type === 'quiz') {
        renderQuiz(sectionElement, section);
    } else if (section.type === 'matching') {
        renderMatching(sectionElement, section);
    } else if (section.type === 'fill-blanks') {
        renderFillBlanks(sectionElement, section);
    } else if (section.content) {
        // Regular content section
        const contentElement = document.createElement('div');
        contentElement.className = 'prose dark:prose-invert max-w-none mb-8';
        
        // Process special content elements
        let processedContent = section.content;
        
        // Process warnings
        processedContent = processedContent.replace(
            /\[warning\]([\s\S]*?)\[\/warning\]/g, 
            '<div class="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600 p-4 my-4"><strong class="text-red-700 dark:text-red-400">Warning:</strong> $1</div>'
        );
        
        // Process tips
        processedContent = processedContent.replace(
            /\[tip\]([\s\S]*?)\[\/tip\]/g, 
            '<div class="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-600 p-4 my-4"><strong class="text-blue-700 dark:text-blue-400">Tip:</strong> $1</div>'
        );
        
        // Process notes
        processedContent = processedContent.replace(
            /\[note\]([\s\S]*?)\[\/note\]/g, 
            '<div class="bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-500 dark:border-gray-600 p-4 my-4"><strong class="text-gray-700 dark:text-gray-400">Note:</strong> $1</div>'
        );
        
        // Process important
        processedContent = processedContent.replace(
            /\[important\]([\s\S]*?)\[\/important\]/g, 
            '<div class="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 dark:border-yellow-600 p-4 my-4"><strong class="text-yellow-700 dark:text-yellow-400">Important:</strong> $1</div>'
        );
        
        // Process examples
        processedContent = processedContent.replace(
            /\[example\]([\s\S]*?)\[\/example\]/g, 
            '<div class="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 dark:border-green-600 p-4 my-4"><strong class="text-green-700 dark:text-green-400">Example:</strong> $1</div>'
        );
        
        // Set the processed content
        contentElement.innerHTML = processedContent;
        sectionElement.appendChild(contentElement);
    }
    
    // Add resources if available
    if (section.resources && section.resources.length > 0) {
        renderResources(sectionElement, section.resources);
    }
    
    // Add the section to the container
    sectionContainer.appendChild(sectionElement);
}

// Update progress information
function updateProgress() {
    if (!currentModule || !currentModule.sections) return;
    
    const totalSections = currentModule.sections.length;
    
    // Update progress text
    if (progressText) {
        progressText.textContent = `Section ${currentSectionIndex + 1} of ${totalSections}`;
    }
    
    // Update progress bar
    if (progressBar) {
        const percentage = ((currentSectionIndex + 1) / totalSections) * 100;
        progressBar.style.width = `${percentage}%`;
    }
}

// Render resources section
function renderResources(container, resources) {
    const resourcesContainer = document.createElement('div');
    resourcesContainer.className = 'mt-8 pt-6 border-t border-gray-200 dark:border-gray-700';
    
    const resourcesTitle = document.createElement('h4');
    resourcesTitle.className = 'text-lg font-bold text-gray-800 dark:text-gray-200 mb-4';
    resourcesTitle.textContent = 'Additional Resources';
    resourcesContainer.appendChild(resourcesTitle);
    
    const resourcesList = document.createElement('ul');
    resourcesList.className = 'space-y-3';
    
    resources.forEach(resource => {
        const resourceItem = document.createElement('li');
        
        const resourceLink = document.createElement('a');
        resourceLink.href = resource.url;
        resourceLink.target = '_blank';
        resourceLink.rel = 'noopener noreferrer';
        resourceLink.className = 'flex items-start text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors';
        
        const icon = document.createElement('svg');
        icon.className = 'w-5 h-5 mr-2 mt-0.5 flex-shrink-0';
        icon.setAttribute('fill', 'none');
        icon.setAttribute('stroke', 'currentColor');
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>';
        
        resourceLink.appendChild(icon);
        
        const resourceText = document.createElement('span');
        resourceText.textContent = resource.title;
        resourceLink.appendChild(resourceText);
        
        resourceItem.appendChild(resourceLink);
        
        if (resource.description) {
            const description = document.createElement('p');
            description.className = 'text-sm text-gray-600 dark:text-gray-400 mt-1 ml-7';
            description.textContent = resource.description;
            resourceItem.appendChild(description);
        }
        
        resourcesList.appendChild(resourceItem);
    });
    
    resourcesContainer.appendChild(resourcesList);
    container.appendChild(resourcesContainer);
}

// Render a quiz section
function renderQuiz(container, section) {
    const quizContainer = document.createElement('div');
    quizContainer.className = 'quiz-element bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-8';
    
    // Create header
    const quizHeader = document.createElement('div');
    quizHeader.className = 'quiz-header bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-b border-gray-200 dark:border-gray-700';
    quizHeader.innerHTML = `<span class="flex items-center"><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>Quiz: ${section.title}</span>`;
    quizContainer.appendChild(quizHeader);
    
    // Create body
    const quizBody = document.createElement('div');
    quizBody.className = 'quiz-body p-6';
    
    // Add the question
    const questionElement = document.createElement('div');
    questionElement.className = 'mb-6';
    
    const questionText = document.createElement('p');
    questionText.className = 'text-lg font-medium text-gray-800 dark:text-gray-200 mb-3';
    questionText.textContent = section.question;
    questionElement.appendChild(questionText);
    
    if (section.instruction) {
        const instruction = document.createElement('p');
        instruction.className = 'text-gray-600 dark:text-gray-400 text-sm mb-4';
        instruction.textContent = section.instruction;
        questionElement.appendChild(instruction);
    }
    
    quizBody.appendChild(questionElement);
    
    // Add the options
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'space-y-3 mb-6';
    
    // Shuffle options if specified
    const options = section.shuffle ? shuffleArray(section.options) : section.options;
    
    options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'quiz-option border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600';
        optionElement.dataset.value = option;
        
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `quiz-${section.title.replace(/\s+/g, '-').toLowerCase()}`;
        input.id = `option-${section.title.replace(/\s+/g, '-').toLowerCase()}-${index}`;
        input.value = option;
        input.className = 'w-4 h-4 text-blue-600 dark:text-blue-500 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400';
        
        // Check if this option was previously selected
        if (userAnswers[section.title] === option) {
            input.checked = true;
            optionElement.classList.add('selected', 'border-blue-500', 'dark:border-blue-400', 'bg-blue-50', 'dark:bg-blue-900/30');
        }
        
        // Add event listener to save the answer and update UI
        input.addEventListener('change', () => {
            if (input.checked) {
                userAnswers[section.title] = option;
                
                // Update UI to show selected option
                document.querySelectorAll(`.quiz-option[data-value]`).forEach(el => {
                    el.classList.remove('selected', 'border-blue-500', 'dark:border-blue-400', 'bg-blue-50', 'dark:bg-blue-900/30');
                    el.classList.add('border-gray-200', 'dark:border-gray-700', 'bg-gray-50', 'dark:bg-gray-700');
                });
                
                optionElement.classList.add('selected', 'border-blue-500', 'dark:border-blue-400', 'bg-blue-50', 'dark:bg-blue-900/30');
                optionElement.classList.remove('border-gray-200', 'dark:border-gray-700', 'bg-gray-50', 'dark:bg-gray-700');
            }
        });
        
        const label = document.createElement('label');
        label.htmlFor = `option-${section.title.replace(/\s+/g, '-').toLowerCase()}-${index}`;
        label.className = 'ml-2 flex-grow cursor-pointer';
        label.textContent = option;
        
        optionElement.appendChild(input);
        optionElement.appendChild(label);
        
        // Make the entire option clickable
        optionElement.addEventListener('click', (e) => {
            if (e.target !== input) {
                input.checked = true;
                input.dispatchEvent(new Event('change'));
            }
        });
        
        optionsContainer.appendChild(optionElement);
    });
    
    quizBody.appendChild(optionsContainer);
    
    // Add hints if available
    if (section.hints && section.hints.length > 0) {
        const hintContainer = document.createElement('div');
        hintContainer.className = 'hint-container';
        
        const hintButton = document.createElement('button');
        hintButton.className = 'hint-button';
        hintButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Show Hint
        `;
        
        const hintContent = document.createElement('div');
        hintContent.className = 'hint-content hidden';
        
        let currentHintIndex = 0;
        
        hintButton.addEventListener('click', () => {
            if (hintContent.classList.contains('hidden')) {
                hintContent.classList.remove('hidden');
                hintContent.textContent = section.hints[currentHintIndex];
                hintButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ${currentHintIndex < section.hints.length - 1 ? 'Next Hint' : 'Hide Hint'}
                `;
            } else {
                if (currentHintIndex < section.hints.length - 1) {
                    currentHintIndex++;
                    hintContent.textContent = section.hints[currentHintIndex];
                    hintButton.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ${currentHintIndex < section.hints.length - 1 ? 'Next Hint' : 'Hide Hint'}
                    `;
                } else {
                    hintContent.classList.add('hidden');
                    currentHintIndex = 0;
                    hintButton.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Show Hint
                    `;
                }
            }
        });
        
        hintContainer.appendChild(hintButton);
        hintContainer.appendChild(hintContent);
        quizBody.appendChild(hintContainer);
    }
    
    quizContainer.appendChild(quizBody);
    
    // Create footer
    const quizFooter = document.createElement('div');
    quizFooter.className = 'quiz-footer bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700';
    
    // Add the submit button
    const submitButton = document.createElement('button');
    submitButton.className = 'btn btn-primary';
    submitButton.innerHTML = `
        <svg class="btn-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Check Answer
    `;
    
    // Add the result container
    const resultContainer = document.createElement('div');
    resultContainer.className = 'feedback-message hidden';
    
    // Add event listener to the submit button
    submitButton.addEventListener('click', () => {
        const selectedOption = document.querySelector(`input[name="quiz-${section.title.replace(/\s+/g, '-').toLowerCase()}"]:checked`);
        
        if (!selectedOption) {
            resultContainer.className = 'feedback-message feedback-warning';
            resultContainer.innerHTML = `
                <div class="flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    <span>Please select an answer before checking.</span>
                </div>
            `;
            resultContainer.classList.remove('hidden');
            return;
        }
        
        const userAnswer = selectedOption.value;
        const isCorrect = userAnswer === section.correctAnswer;
        
        // Update UI to show correct/incorrect options
        document.querySelectorAll(`.quiz-option[data-value]`).forEach(el => {
            const optionValue = el.dataset.value;
            
            if (optionValue === section.correctAnswer) {
                el.classList.remove('selected', 'border-blue-500', 'dark:border-blue-400', 'bg-blue-50', 'dark:bg-blue-900/30');
                el.classList.add('correct', 'border-green-500', 'dark:border-green-400', 'bg-green-50', 'dark:bg-green-900/30');
            } else if (optionValue === userAnswer && !isCorrect) {
                el.classList.remove('selected', 'border-blue-500', 'dark:border-blue-400', 'bg-blue-50', 'dark:bg-blue-900/30');
                el.classList.add('incorrect', 'border-red-500', 'dark:border-red-400', 'bg-red-50', 'dark:bg-red-900/30');
            }
        });
        
        if (isCorrect) {
            resultContainer.className = 'feedback-message feedback-success';
            resultContainer.innerHTML = `
                <div class="flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>${section.successMessage || 'Correct!'}</span>
                </div>
                ${section.explanation ? `<p class="mt-2">${section.explanation}</p>` : ''}
            `;
            
            // Award points if specified
            if (section.points) {
                const pointsElement = document.createElement('div');
                pointsElement.className = 'mt-2 text-sm font-medium';
                pointsElement.innerHTML = `<span class="animate-pulse">+${section.points} points</span>`;
                resultContainer.appendChild(pointsElement);
            }
        } else {
            resultContainer.className = 'feedback-message feedback-error';
            resultContainer.innerHTML = `
                <div class="flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>${section.incorrectMessage || 'Incorrect. Try again!'}</span>
                </div>
                ${section.explanation ? `<p class="mt-2">${section.explanation}</p>` : ''}
            `;
        }
        
        resultContainer.classList.remove('hidden');
        
        // Disable the submit button after answering
        submitButton.disabled = true;
        submitButton.classList.add('opacity-50', 'cursor-not-allowed');
    });
    
    quizFooter.appendChild(submitButton);
    quizContainer.appendChild(quizFooter);
    quizContainer.appendChild(resultContainer);
    
    container.appendChild(quizContainer);
}

// Render a matching exercise
function renderMatching(container, section) {
    const matchingContainer = document.createElement('div');
    matchingContainer.className = 'matching-element bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-8';
    
    // Create header
    const matchingHeader = document.createElement('div');
    matchingHeader.className = 'matching-header bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-b border-gray-200 dark:border-gray-700';
    matchingHeader.innerHTML = `<span class="flex items-center"><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>Matching Exercise: ${section.title}</span>`;
    matchingContainer.appendChild(matchingHeader);
    
    // Create body
    const matchingBody = document.createElement('div');
    matchingBody.className = 'matching-body p-6';
    
    // Add the instruction
    const instruction = document.createElement('p');
    instruction.className = 'text-lg font-medium text-gray-800 dark:text-gray-200 mb-4';
    instruction.textContent = section.instruction || 'Match the items on the left with their corresponding items on the right by dragging and dropping.';
    matchingBody.appendChild(instruction);
    
    // Create the matching exercise
    const matchingExercise = document.createElement('div');
    matchingExercise.className = 'grid grid-cols-1 md:grid-cols-2 gap-6 mb-6';
    
    // Create the terms column
    const termsColumn = document.createElement('div');
    termsColumn.className = 'space-y-3';
    termsColumn.innerHTML = '<h3 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Terms</h3>';
    
    // Create the definitions column
    const definitionsColumn = document.createElement('div');
    definitionsColumn.className = 'space-y-3';
    definitionsColumn.innerHTML = '<h3 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Definitions</h3>';
    
    // Shuffle the pairs if specified
    const pairs = section.shuffle ? shuffleArray([...section.pairs]) : [...section.pairs];
    
    // Create a shuffled array of definitions
    const shuffledDefinitions = shuffleArray([...pairs.map(pair => pair.definition)]);
    
    // Store the correct matches for checking later
    const correctMatches = {};
    pairs.forEach(pair => {
        correctMatches[pair.term] = pair.definition;
    });
    
    // Store the user's matches
    const userMatches = {};
    
    // Add the terms and definitions
    pairs.forEach((pair, index) => {
        const termElement = document.createElement('div');
        termElement.className = 'matching-item bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors';
        termElement.textContent = pair.term;
        termElement.dataset.term = pair.term;
        termElement.draggable = true;
        
        // Add drag events
        termElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', pair.term);
            termElement.classList.add('dragging', 'opacity-50');
        });
        
        termElement.addEventListener('dragend', () => {
            termElement.classList.remove('dragging', 'opacity-50');
        });
        
        termsColumn.appendChild(termElement);
        
        // Create a dropzone for each definition
        const dropzone = document.createElement('div');
        dropzone.className = 'matching-dropzone border border-dashed border-gray-300 dark:border-gray-600 p-3 rounded-lg text-gray-500 dark:text-gray-400 min-h-[60px] flex items-center justify-center';
        dropzone.textContent = 'Drop term here';
        dropzone.dataset.definition = shuffledDefinitions[index];
        
        // Add drop events
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('active', 'border-blue-500', 'dark:border-blue-400', 'bg-blue-50', 'dark:bg-blue-900/30');
        });
        
        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('active', 'border-blue-500', 'dark:border-blue-400', 'bg-blue-50', 'dark:bg-blue-900/30');
        });
        
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            const term = e.dataTransfer.getData('text/plain');
            
            // Update the dropzone
            dropzone.textContent = term;
            dropzone.classList.remove('active', 'border-dashed', 'border-gray-300', 'dark:border-gray-600', 'text-gray-500', 'dark:text-gray-400');
            dropzone.classList.add('border-solid', 'border-blue-500', 'dark:border-blue-400', 'bg-blue-50', 'dark:bg-blue-900/30', 'text-gray-800', 'dark:text-gray-200');
            
            // Store the match
            userMatches[term] = dropzone.dataset.definition;
        });
        
        // Create the definition element
        const definitionElement = document.createElement('div');
        definitionElement.className = 'bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg text-gray-800 dark:text-gray-200 border border-blue-200 dark:border-blue-800';
        definitionElement.textContent = shuffledDefinitions[index];
        
        // Add the definition and dropzone to the column
        const definitionContainer = document.createElement('div');
        definitionContainer.className = 'space-y-2';
        definitionContainer.appendChild(definitionElement);
        definitionContainer.appendChild(dropzone);
        
        definitionsColumn.appendChild(definitionContainer);
    });
    
    matchingExercise.appendChild(termsColumn);
    matchingExercise.appendChild(definitionsColumn);
    
    matchingBody.appendChild(matchingExercise);
    
    // Add hints if available
    if (section.hints && section.hints.length > 0) {
        const hintContainer = document.createElement('div');
        hintContainer.className = 'hint-container';
        
        const hintButton = document.createElement('button');
        hintButton.className = 'hint-button';
        hintButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Show Hint
        `;
        
        const hintContent = document.createElement('div');
        hintContent.className = 'hint-content hidden';
        
        let currentHintIndex = 0;
        
        hintButton.addEventListener('click', () => {
            if (hintContent.classList.contains('hidden')) {
                hintContent.classList.remove('hidden');
                hintContent.textContent = section.hints[currentHintIndex];
                hintButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ${currentHintIndex < section.hints.length - 1 ? 'Next Hint' : 'Hide Hint'}
                `;
            } else {
                if (currentHintIndex < section.hints.length - 1) {
                    currentHintIndex++;
                    hintContent.textContent = section.hints[currentHintIndex];
                    hintButton.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ${currentHintIndex < section.hints.length - 1 ? 'Next Hint' : 'Hide Hint'}
                    `;
                } else {
                    hintContent.classList.add('hidden');
                    currentHintIndex = 0;
                    hintButton.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Show Hint
                    `;
                }
            }
        });
        
        hintContainer.appendChild(hintButton);
        hintContainer.appendChild(hintContent);
        matchingBody.appendChild(hintContainer);
    }
    
    matchingContainer.appendChild(matchingBody);
    
    // Create footer
    const matchingFooter = document.createElement('div');
    matchingFooter.className = 'matching-footer bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700';
    
    // Add the reset button
    const resetButton = document.createElement('button');
    resetButton.className = 'btn btn-secondary mr-2';
    resetButton.innerHTML = `
        <svg class="btn-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Reset
    `;
    
    resetButton.addEventListener('click', () => {
        // Reset the dropzones
        const dropzones = matchingExercise.querySelectorAll('.matching-dropzone');
        dropzones.forEach(dropzone => {
            dropzone.textContent = 'Drop term here';
            dropzone.className = 'matching-dropzone border border-dashed border-gray-300 dark:border-gray-600 p-3 rounded-lg text-gray-500 dark:text-gray-400 min-h-[60px] flex items-center justify-center';
        });
        
        // Clear the user matches
        Object.keys(userMatches).forEach(key => delete userMatches[key]);
        
        // Hide the result container
        resultContainer.classList.add('hidden');
        
        // Enable the submit button
        submitButton.disabled = false;
        submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
    });
    
    // Add the submit button
    const submitButton = document.createElement('button');
    submitButton.className = 'btn btn-primary';
    submitButton.innerHTML = `
        <svg class="btn-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Check Matches
    `;
    
    // Add the result container
    const resultContainer = document.createElement('div');
    resultContainer.className = 'feedback-message hidden';
    
    // Add event listener to the submit button
    submitButton.addEventListener('click', () => {
        // Check if all terms have been matched
        const terms = Object.keys(correctMatches);
        const matchedTerms = Object.keys(userMatches);
        
        if (matchedTerms.length < terms.length) {
            resultContainer.className = 'feedback-message feedback-warning';
            resultContainer.innerHTML = `
                <div class="flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    <span>Please match all terms before checking.</span>
                </div>
            `;
            resultContainer.classList.remove('hidden');
            return;
        }
        
        // Check the matches
        let allCorrect = true;
        let correctCount = 0;
        
        terms.forEach(term => {
            if (userMatches[term] !== correctMatches[term]) {
                allCorrect = false;
            } else {
                correctCount++;
            }
        });
        
        // Update the dropzones to show correct/incorrect matches
        const dropzones = matchingExercise.querySelectorAll('.matching-dropzone');
        dropzones.forEach(dropzone => {
            const definition = dropzone.dataset.definition;
            const term = dropzone.textContent;
            
            if (term !== 'Drop term here') {
                if (correctMatches[term] === definition) {
                    dropzone.classList.remove('border-blue-500', 'dark:border-blue-400', 'bg-blue-50', 'dark:bg-blue-900/30');
                    dropzone.classList.add('border-green-500', 'dark:border-green-400', 'bg-green-50', 'dark:bg-green-900/30');
                } else {
                    dropzone.classList.remove('border-blue-500', 'dark:border-blue-400', 'bg-blue-50', 'dark:bg-blue-900/30');
                    dropzone.classList.add('border-red-500', 'dark:border-red-400', 'bg-red-50', 'dark:bg-red-900/30');
                }
            }
        });
        
        if (allCorrect) {
            resultContainer.className = 'feedback-message feedback-success';
            resultContainer.innerHTML = `
                <div class="flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>${section.successMessage || 'Great job! All matches are correct.'}</span>
                </div>
            `;
            
            // Award points if specified
            if (section.points) {
                const pointsElement = document.createElement('div');
                pointsElement.className = 'mt-2 text-sm font-medium';
                pointsElement.innerHTML = `<span class="animate-pulse">+${section.points} points</span>`;
                resultContainer.appendChild(pointsElement);
            }
        } else {
            resultContainer.className = 'feedback-message feedback-warning';
            resultContainer.innerHTML = `
                <div class="flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    <span>${section.incorrectMessage || 'Some matches are incorrect.'}</span>
                </div>
                <p class="mt-2">You got ${correctCount} out of ${terms.length} correct.</p>
            `;
            
            // Show a hint if available
            if (section.hints && section.hints.length > 0) {
                const hintElement = document.createElement('p');
                hintElement.className = 'mt-2 text-sm';
                hintElement.innerHTML = `<strong>Hint:</strong> ${section.hints[0]}`;
                resultContainer.appendChild(hintElement);
            }
        }
        
        resultContainer.classList.remove('hidden');
        
        // Disable the submit button after checking
        submitButton.disabled = true;
        submitButton.classList.add('opacity-50', 'cursor-not-allowed');
    });
    
    matchingFooter.appendChild(resetButton);
    matchingFooter.appendChild(submitButton);
    matchingContainer.appendChild(matchingFooter);
    matchingContainer.appendChild(resultContainer);
    
    container.appendChild(matchingContainer);
}

// Render a fill-in-the-blanks exercise
function renderFillBlanks(container, section) {
    const fillBlanksContainer = document.createElement('div');
    fillBlanksContainer.className = 'fill-blanks-element bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-8';
    
    // Create header
    const fillBlanksHeader = document.createElement('div');
    fillBlanksHeader.className = 'fill-blanks-header bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-b border-gray-200 dark:border-gray-700';
    fillBlanksHeader.innerHTML = `<span class="flex items-center"><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>Fill in the Blanks: ${section.title}</span>`;
    fillBlanksContainer.appendChild(fillBlanksHeader);
    
    // Create body
    const fillBlanksBody = document.createElement('div');
    fillBlanksBody.className = 'fill-blanks-body p-6';
    
    // Add the instruction
    const instruction = document.createElement('p');
    instruction.className = 'text-lg font-medium text-gray-800 dark:text-gray-200 mb-4';
    instruction.textContent = section.instruction || 'Fill in the blanks with the correct words.';
    fillBlanksBody.appendChild(instruction);
    
    // Create the text with blanks
    const textContainer = document.createElement('div');
    textContainer.className = 'mb-6 text-gray-700 dark:text-gray-300 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg';
    
    // Split the text by [blank] tags
    const textParts = section.text.split(/\[blank\]/g);
    
    // Create the text with input fields
    textParts.forEach((part, index) => {
        // Add the text part
        textContainer.appendChild(document.createTextNode(part));
        
        // Add an input field after each part except the last one
        if (index < textParts.length - 1) {
            const blankContainer = document.createElement('span');
            blankContainer.className = 'fill-blank inline-block';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'text-center w-full';
            input.dataset.index = index;
            input.placeholder = '...';
            
            // Check if this blank was previously filled
            if (userAnswers[`${section.title}-blank-${index}`]) {
                input.value = userAnswers[`${section.title}-blank-${index}`];
            }
            
            // Add event listener to save the answer
            input.addEventListener('input', () => {
                userAnswers[`${section.title}-blank-${index}`] = input.value;
            });
            
            // Add keydown event to navigate between inputs with arrow keys
            input.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'Tab') {
                    const nextInput = textContainer.querySelector(`input[data-index="${index + 1}"]`);
                    if (nextInput) {
                        nextInput.focus();
                        e.preventDefault();
                    }
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    const prevInput = textContainer.querySelector(`input[data-index="${index - 1}"]`);
                    if (prevInput) {
                        prevInput.focus();
                        e.preventDefault();
                    }
                }
            });
            
            blankContainer.appendChild(input);
            textContainer.appendChild(blankContainer);
        }
    });
    
    fillBlanksBody.appendChild(textContainer);
    
    // Add hints if available
    if (section.hints && section.hints.length > 0) {
        const hintContainer = document.createElement('div');
        hintContainer.className = 'hint-container';
        
        const hintButton = document.createElement('button');
        hintButton.className = 'hint-button';
        hintButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Show Hint
        `;
        
        const hintContent = document.createElement('div');
        hintContent.className = 'hint-content hidden';
        
        let currentHintIndex = 0;
        
        hintButton.addEventListener('click', () => {
            if (hintContent.classList.contains('hidden')) {
                hintContent.classList.remove('hidden');
                hintContent.textContent = section.hints[currentHintIndex];
                hintButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ${currentHintIndex < section.hints.length - 1 ? 'Next Hint' : 'Hide Hint'}
                `;
            } else {
                if (currentHintIndex < section.hints.length - 1) {
                    currentHintIndex++;
                    hintContent.textContent = section.hints[currentHintIndex];
                    hintButton.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ${currentHintIndex < section.hints.length - 1 ? 'Next Hint' : 'Hide Hint'}
                    `;
                } else {
                    hintContent.classList.add('hidden');
                    currentHintIndex = 0;
                    hintButton.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Show Hint
                    `;
                }
            }
        });
        
        hintContainer.appendChild(hintButton);
        hintContainer.appendChild(hintContent);
        fillBlanksBody.appendChild(hintContainer);
    }
    
    fillBlanksContainer.appendChild(fillBlanksBody);
    
    // Create footer
    const fillBlanksFooter = document.createElement('div');
    fillBlanksFooter.className = 'fill-blanks-footer bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700';
    
    // Add the submit button
    const submitButton = document.createElement('button');
    submitButton.className = 'btn btn-primary';
    submitButton.innerHTML = `
        <svg class="btn-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Check Answers
    `;
    
    // Add the result container
    const resultContainer = document.createElement('div');
    resultContainer.className = 'feedback-message hidden';
    
    // Add event listener to the submit button
    submitButton.addEventListener('click', () => {
        const inputs = textContainer.querySelectorAll('input');
        let allCorrect = true;
        let correctCount = 0;
        
        inputs.forEach((input, index) => {
            const userAnswer = input.value.trim().toLowerCase();
            const correctAnswers = section.acceptableAnswers[index].map(answer => answer.toLowerCase());
            
            const isCorrect = correctAnswers.includes(userAnswer);
            
            if (isCorrect) {
                input.parentElement.classList.add('correct', 'border-green-500', 'dark:border-green-400', 'bg-green-50', 'dark:bg-green-900/30');
                input.parentElement.classList.remove('incorrect', 'border-red-500', 'dark:border-red-400', 'bg-red-50', 'dark:bg-red-900/30');
                correctCount++;
            } else {
                input.parentElement.classList.add('incorrect', 'border-red-500', 'dark:border-red-400', 'bg-red-50', 'dark:bg-red-900/30');
                input.parentElement.classList.remove('correct', 'border-green-500', 'dark:border-green-400', 'bg-green-50', 'dark:bg-green-900/30');
                allCorrect = false;
            }
        });
        
        if (allCorrect) {
            resultContainer.className = 'feedback-message feedback-success';
            resultContainer.innerHTML = `
                <div class="flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>${section.successMessage || 'All answers are correct!'}</span>
                </div>
            `;
            
            // Award points if specified
            if (section.points) {
                const pointsElement = document.createElement('div');
                pointsElement.className = 'mt-2 text-sm font-medium';
                pointsElement.innerHTML = `<span class="animate-pulse">+${section.points} points</span>`;
                resultContainer.appendChild(pointsElement);
            }
        } else {
            resultContainer.className = 'feedback-message feedback-warning';
            resultContainer.innerHTML = `
                <div class="flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    <span>${section.incorrectMessage || 'Some answers need correction.'}</span>
                </div>
                <p class="mt-2">You got ${correctCount} out of ${inputs.length} correct.</p>
            `;
            
            // Show a hint if available
            if (section.hints && section.hints.length > 0) {
                const hintElement = document.createElement('p');
                hintElement.className = 'mt-2 text-sm';
                hintElement.innerHTML = `<strong>Hint:</strong> ${section.hints[0]}`;
                resultContainer.appendChild(hintElement);
            }
        }
        
        resultContainer.classList.remove('hidden');
    });
    
    fillBlanksFooter.appendChild(submitButton);
    fillBlanksContainer.appendChild(fillBlanksFooter);
    fillBlanksContainer.appendChild(resultContainer);
    
    container.appendChild(fillBlanksContainer);
}

// Set up event listeners
function setupEventListeners() {
    // Back button
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Show module list, hide module content
            if (modulesList) modulesList.classList.remove('hidden');
            if (moduleContent) moduleContent.classList.add('hidden');
            
            // Show the hero section if it exists
            const heroSection = document.querySelector('.bg-gradient-to-br');
            if (heroSection) heroSection.classList.remove('hidden');
            
            // Update URL without reloading the page
            const url = new URL(window.location.href);
            url.searchParams.delete('module');
            window.history.pushState({}, '', url);
        });
    }
    
    // Previous section button
    if (prevSectionButton) {
        prevSectionButton.addEventListener('click', () => {
            if (currentSectionIndex > 0) {
                loadSection(currentSectionIndex - 1);
                // Scroll to top of section content
                document.querySelector('.section-content').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Next section button
    if (nextSectionButton) {
        nextSectionButton.addEventListener('click', () => {
            if (currentModule && currentModule.sections && currentSectionIndex < currentModule.sections.length - 1) {
                loadSection(currentSectionIndex + 1);
                // Scroll to top of section content
                document.querySelector('.section-content').scrollIntoView({ behavior: 'smooth' });
            } else {
                // This is the last section, mark the module as complete
                if (currentModule && currentModule.id) {
                    // Show completion message
                    if (sectionContainer) {
                        sectionContainer.innerHTML = `
                            <div class="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 dark:border-green-600 p-6 mb-6">
                                <h3 class="text-xl font-bold text-green-700 dark:text-green-400 mb-2">Module Completed!</h3>
                                <p class="text-green-700 dark:text-green-400">Congratulations on completing this module.</p>
                            </div>
                            <div class="flex justify-between mt-8">
                                <button onclick="window.location.href = 'training.html'" class="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                                    Back to Modules
                                </button>
                                <button onclick="window.location.reload()" class="bg-green-600 dark:bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors">
                                    Restart Module
                                </button>
                            </div>
                        `;
                    }
                }
            }
        });
    }
    
    // Handle browser back button
    window.addEventListener('popstate', (event) => {
        const urlParams = new URLSearchParams(window.location.search);
        const moduleId = urlParams.get('module');
        
        if (moduleId) {
            // Find the module
            const module = allModules.find(m => m.id === moduleId);
            
            if (module) {
                loadModule(module);
            }
        } else {
            // Show module list, hide module content
            if (modulesList) modulesList.classList.remove('hidden');
            if (moduleContent) moduleContent.classList.add('hidden');
            
            // Show the hero section if it exists
            const heroSection = document.querySelector('.bg-gradient-to-br');
            if (heroSection) heroSection.classList.remove('hidden');
        }
    });
}

// Shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
    // Use utils.shuffleArray if available, otherwise use local implementation
    if (window.utils && typeof window.utils.shuffleArray === 'function') {
        return window.utils.shuffleArray([...array]);
    }
    
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
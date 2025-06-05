/**
 * Static Module Loader for FreeOSINT.org
 * This file provides functionality to load modules directly from the modules-data.js file
 * which works both locally and when hosted on GitHub Pages
 */

// Create a module loader that works without a server
(function() {
    // Store the original fetch function
    const originalFetch = window.fetch;
    
    // Override fetch to handle module JSON files
    window.fetch = function(url, options) {
        // Extract the path from the URL
        let path = url;
        
        // Remove query parameters if present
        if (path.includes('?')) {
            path = path.split('?')[0];
        }
        
        // Handle module JSON files
        if (path.includes('modules/') && path.endsWith('.json')) {
            console.log(`Static loader handling: ${path}`);
            
            // For module index
            if (path.includes('index.json')) {
                return createSuccessResponse(MODULES_DATA.index);
            }
            
            // For individual modules
            const moduleId = path.split('/').pop().replace('.json', '');
            const moduleData = MODULES_DATA.modules[moduleId];
            
            if (moduleData) {
                return createSuccessResponse(moduleData);
            } else {
                console.warn(`Module not found in static data: ${moduleId}`);
                return createErrorResponse(404, 'Module not found');
            }
        }
        
        // For all other requests, use the original fetch
        return originalFetch(url, options);
    };
    
    // Function to create a successful response
    function createSuccessResponse(data) {
        return new Promise((resolve) => {
            resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve(data)
            });
        });
    }
    
    // Function to create an error response
    function createErrorResponse(status, message) {
        return new Promise((resolve) => {
            resolve({
                ok: false,
                status: status,
                statusText: message
            });
        });
    }
})();

console.log('Static module loader initialized');
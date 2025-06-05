/**
 * Direct Module Loader for FreeOSINT.org
 * This file provides functionality to load modules directly from the modules directory
 * when the site is hosted on GitHub Pages or other static hosting
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
            console.log(`Direct loader handling: ${path}`);
            
            // Determine the correct path based on the current page location
            let basePath = '';
            
            // Check if we're in the pages directory or root
            if (window.location.pathname.includes('/pages/')) {
                basePath = '../';
            } else {
                basePath = '';
            }
            
            // For module index
            if (path.includes('index.json')) {
                return fetchWithXHR(`${basePath}modules/index.json`);
            }
            
            // For individual modules
            const moduleId = path.split('/').pop().replace('.json', '');
            return fetchWithXHR(`${basePath}modules/${moduleId}.json`);
        }
        
        // For all other requests, use the original fetch
        return originalFetch(url, options);
    };
    
    // Function to fetch JSON using XMLHttpRequest (works with file:// protocol)
    function fetchWithXHR(url) {
        return new Promise((resolve, reject) => {
            console.log(`Fetching with XHR: ${url}`);
            
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'json';
            
            xhr.onload = function() {
                if (xhr.status === 200 || (xhr.status === 0 && xhr.response)) {
                    console.log(`XHR success for: ${url}`);
                    resolve({
                        ok: true,
                        json: () => Promise.resolve(xhr.response)
                    });
                } else {
                    console.warn(`XHR failed for: ${url} with status: ${xhr.status}`);
                    resolve({
                        ok: false,
                        status: xhr.status,
                        statusText: xhr.statusText
                    });
                }
            };
            
            xhr.onerror = function() {
                console.error(`XHR error for: ${url}`);
                // Try with a different path if error occurs
                if (url.startsWith('../')) {
                    console.log('Trying alternative path...');
                    const altUrl = url.replace('../', '');
                    fetchWithXHR(altUrl).then(resolve).catch(reject);
                } else {
                    resolve({
                        ok: false,
                        status: 0,
                        statusText: 'Network Error'
                    });
                }
            };
            
            xhr.send();
        });
    }
    
    // Preload the module index to ensure it's available
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Preloading module index...');
        
        // Determine the correct path based on the current page location
        let basePath = '';
        if (window.location.pathname.includes('/pages/')) {
            basePath = '../';
        }
        
        // Preload the index
        fetchWithXHR(`${basePath}modules/index.json`);
    });
})();

console.log('Direct module loader initialized');
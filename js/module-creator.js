/**
 * Module Creator for FreeOSINT.org
 * 
 * This file contains the functionality for the module creator tool,
 * allowing users to create new training modules with interactive elements.
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const moduleId = document.getElementById('module-id');
    const moduleTitle = document.getElementById('module-title');
    const moduleDifficulty = document.getElementById('module-difficulty');
    const moduleDuration = document.getElementById('module-duration');
    const moduleDescription = document.getElementById('module-description');
    const moduleImage = document.getElementById('module-image');
    const moduleFeatured = document.getElementById('module-featured');
    
    const sectionsContainer = document.getElementById('sections-container');
    const addContentButton = document.getElementById('add-content-section');
    const addQuizButton = document.getElementById('add-quiz');
    const addFillBlanksButton = document.getElementById('add-fill-blanks');
    const addMatchingButton = document.getElementById('add-matching');
    const addOrderingButton = document.getElementById('add-ordering');
    const addTrueFalseButton = document.getElementById('add-true-false');
    const addScenarioButton = document.getElementById('add-scenario');
    const addShortAnswerButton = document.getElementById('add-short-answer');
    
    const previewButton = document.getElementById('preview-module');
    const generateJsonButton = document.getElementById('generate-json');
    
    const previewModal = document.getElementById('preview-modal');
    const closePreviewButton = document.getElementById('close-preview');
    const previewContent = document.getElementById('preview-content');
    
    const jsonModal = document.getElementById('json-modal');
    const closeJsonButton = document.getElementById('close-json');
    const jsonOutput = document.getElementById('json-output');
    const filenameDisplay = document.getElementById('filename-display');
    const copyJsonButton = document.getElementById('copy-json');
    
    // Section counter for unique IDs
    let sectionCounter = 0;
    
    // Initialize sections array
    let sections = [];
    
    // Event listeners for adding sections
    addContentButton.addEventListener('click', () => addSection('content'));
    addQuizButton.addEventListener('click', () => addSection('quiz'));
    addFillBlanksButton.addEventListener('click', () => addSection('fill-blanks'));
    addMatchingButton.addEventListener('click', () => addSection('matching'));
    addOrderingButton.addEventListener('click', () => addSection('ordering'));
    addTrueFalseButton.addEventListener('click', () => addSection('true-false'));
    addScenarioButton.addEventListener('click', () => addSection('scenario'));
    addShortAnswerButton.addEventListener('click', () => addSection('short-answer'));
    
    // Preview and generate JSON
    previewButton.addEventListener('click', previewModule);
    generateJsonButton.addEventListener('click', generateJson);
    
    // Modal close buttons
    closePreviewButton.addEventListener('click', () => previewModal.classList.add('hidden'));
    closeJsonButton.addEventListener('click', () => jsonModal.classList.add('hidden'));
    
    // Copy JSON to clipboard
    copyJsonButton.addEventListener('click', copyJsonToClipboard);
    
    // Add event delegation for content template insertion
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'insert-content-template') {
            insertContentTemplate(e.target);
        }
    });
    
    // Add a new section to the module
    function addSection(type) {
        // Clear the "no sections" message if it exists
        if (sectionsContainer.querySelector('p.text-gray-500')) {
            sectionsContainer.innerHTML = '';
        }
        
        const sectionId = `section-${sectionCounter++}`;
        const sectionElement = document.createElement('div');
        sectionElement.id = sectionId;
        sectionElement.className = 'p-6 bg-white border border-gray-200 rounded-lg shadow-sm';
        
        // Create section header with type indicator and remove button
        const header = document.createElement('div');
        header.className = 'flex justify-between items-center mb-4';
        
        const typeLabel = document.createElement('h4');
        typeLabel.className = 'font-bold text-lg';
        
        const removeButton = document.createElement('button');
        removeButton.className = 'text-red-500 hover:text-red-700';
        removeButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
        `;
        removeButton.addEventListener('click', () => {
            sectionsContainer.removeChild(sectionElement);
            
            // Show "no sections" message if no sections remain
            if (sectionsContainer.children.length === 0) {
                sectionsContainer.innerHTML = `
                    <div class="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                        <p class="text-gray-500 text-center">No sections added yet. Use the buttons above to add content and interactive sections.</p>
                    </div>
                `;
            }
        });
        
        header.appendChild(typeLabel);
        header.appendChild(removeButton);
        sectionElement.appendChild(header);
        
        // Create section content based on type
        const content = document.createElement('div');
        
        switch (type) {
            case 'content':
                typeLabel.textContent = 'Content Section';
                content.innerHTML = `
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Section Title</label>
                        <input type="text" class="section-title w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., Introduction">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-medium mb-2">Content (HTML supported)</label>
                        <textarea class="section-content w-full p-3 border border-gray-300 rounded-lg" rows="6" placeholder="<p>Your content here...</p>"></textarea>
                        <div class="mt-2 text-sm text-gray-600">
                            <p class="mb-1">You can use these special tags to enhance your content:</p>
                            <ul class="list-disc pl-5 space-y-1">
                                <li><code>[warning]Warning text here[/warning]</code> - Displays a warning box</li>
                                <li><code>[tip]Helpful tip here[/tip]</code> - Displays a tip box</li>
                                <li><code>[note]Important note here[/note]</code> - Displays a note box</li>
                                <li><code>[important]Critical information here[/important]</code> - Displays an important box</li>
                                <li><code>[example]Example content here[/example]</code> - Displays an example box</li>
                                <li><code>[quote]Quotation here[/quote]</code> - Displays a quote box</li>
                                <li><code>[code language="javascript"]Your code here[/code]</code> - Displays formatted code</li>
                            </ul>
                            <button type="button" class="mt-2 text-blue-600 hover:text-blue-800" id="insert-content-template">Insert Template</button>
                        </div>
                    </div>
                `;
                break;
                
            case 'quiz':
                typeLabel.textContent = 'Multiple Choice Question';
                content.innerHTML = `
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Section Title</label>
                        <input type="text" class="section-title w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., Knowledge Check">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Question</label>
                        <input type="text" class="quiz-question w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., Which of the following is correct?">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Options (one per line)</label>
                        <textarea class="quiz-options w-full p-3 border border-gray-300 rounded-lg" rows="4" placeholder="Option 1&#10;Option 2&#10;Option 3&#10;Option 4"></textarea>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Correct Answer</label>
                        <input type="text" class="quiz-correct w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., Option 2">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Explanation (optional)</label>
                        <textarea class="quiz-explanation w-full p-3 border border-gray-300 rounded-lg" rows="3" placeholder="Explanation of why this answer is correct..."></textarea>
                    </div>
                    <div class="mb-4">
                        <label class="flex items-center text-gray-700 font-medium">
                            <input type="checkbox" class="quiz-shuffle mr-2 h-5 w-5 text-blue-600" checked>
                            Shuffle Options
                        </label>
                    </div>
                `;
                break;
                
            case 'fill-blanks':
                typeLabel.textContent = 'Fill in the Blanks';
                content.innerHTML = `
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Section Title</label>
                        <input type="text" class="section-title w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., Complete the Sentence">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Instruction</label>
                        <input type="text" class="blanks-instruction w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., Fill in the blanks to complete the text:">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Text with [blank] placeholders</label>
                        <textarea class="blanks-text w-full p-3 border border-gray-300 rounded-lg" rows="4" placeholder="This is a [blank] with some [blank] to fill in."></textarea>
                        <p class="text-sm text-gray-500 mt-1">Use [blank] to indicate where blanks should appear</p>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Answers (one per blank, in order)</label>
                        <textarea class="blanks-answers w-full p-3 border border-gray-300 rounded-lg" rows="4" placeholder="answer1&#10;answer2"></textarea>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Alternative Acceptable Answers (optional, comma-separated per blank)</label>
                        <textarea class="blanks-alternatives w-full p-3 border border-gray-300 rounded-lg" rows="4" placeholder="alt1, alt2&#10;alt3, alt4"></textarea>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Success Message (optional)</label>
                        <input type="text" class="blanks-success w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., Well done! You've filled in all the blanks correctly.">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Incorrect Message (optional)</label>
                        <input type="text" class="blanks-incorrect w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., Some answers need revision. Try again!">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Hints (one per line, optional)</label>
                        <textarea class="blanks-hints w-full p-3 border border-gray-300 rounded-lg" rows="3" placeholder="Think about the context&#10;Consider related terms"></textarea>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Points (optional)</label>
                        <input type="number" class="blanks-points w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., 15" min="0" max="100">
                    </div>
                    <div class="mb-4">
                        <label class="flex items-center text-gray-700 font-medium">
                            <input type="checkbox" class="blanks-case-sensitive mr-2 h-5 w-5 text-blue-600">
                            Case Sensitive
                        </label>
                    </div>
                    <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                        <p class="text-blue-800 font-medium">Enhanced Fill-in-the-Blanks Exercise</p>
                        <p class="text-blue-700 text-sm mt-1">This exercise now features improved input fields with real-time feedback and better visual design.</p>
                    </div>
                `;
                break;
                
            case 'matching':
                typeLabel.textContent = 'Matching Exercise';
                content.innerHTML = `
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Section Title</label>
                        <input type="text" class="section-title w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., Match the Items">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Instruction</label>
                        <input type="text" class="matching-instruction w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., Match each term with its correct definition:">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Pairs (term:definition, one per line)</label>
                        <textarea class="matching-pairs w-full p-3 border border-gray-300 rounded-lg" rows="6" placeholder="Term 1:Definition 1&#10;Term 2:Definition 2&#10;Term 3:Definition 3"></textarea>
                        <p class="text-sm text-gray-500 mt-1">Use colon (:) to separate terms from definitions</p>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Success Message (optional)</label>
                        <input type="text" class="matching-success w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., Great job! You've correctly matched all items.">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Incorrect Message (optional)</label>
                        <input type="text" class="matching-incorrect w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., Some matches are incorrect. Try again!">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Hints (one per line, optional)</label>
                        <textarea class="matching-hints w-full p-3 border border-gray-300 rounded-lg" rows="3" placeholder="Look for related concepts&#10;Consider the definitions carefully"></textarea>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Points (optional)</label>
                        <input type="number" class="matching-points w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., 10" min="0" max="100">
                    </div>
                    <div class="mb-4">
                        <label class="flex items-center text-gray-700 font-medium">
                            <input type="checkbox" class="matching-shuffle mr-2 h-5 w-5 text-blue-600" checked>
                            Shuffle Definitions
                        </label>
                    </div>
                    <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                        <p class="text-blue-800 font-medium">Enhanced Matching Exercise</p>
                        <p class="text-blue-700 text-sm mt-1">This exercise now features an interactive drag-and-drop interface where learners can connect terms with their definitions.</p>
                    </div>
                `;
                break;
                
            case 'ordering':
                typeLabel.textContent = 'Ordering Exercise';
                content.innerHTML = `
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Section Title</label>
                        <input type="text" class="section-title w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., Arrange in Order">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Instruction</label>
                        <input type="text" class="ordering-instruction w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., Arrange the following items in the correct order:">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Items (in correct order, one per line)</label>
                        <textarea class="ordering-items w-full p-3 border border-gray-300 rounded-lg" rows="6" placeholder="First item&#10;Second item&#10;Third item&#10;Fourth item"></textarea>
                    </div>
                    <div class="mb-4">
                        <label class="flex items-center text-gray-700 font-medium">
                            <input type="checkbox" class="ordering-shuffle mr-2 h-5 w-5 text-blue-600" checked>
                            Shuffle Items for Display
                        </label>
                    </div>
                `;
                break;
                
            case 'true-false':
                typeLabel.textContent = 'True/False Question';
                content.innerHTML = `
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Section Title</label>
                        <input type="text" class="section-title w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., True or False">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Statement</label>
                        <textarea class="tf-statement w-full p-3 border border-gray-300 rounded-lg" rows="3" placeholder="e.g., OSINT techniques always require specialized software."></textarea>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Correct Answer</label>
                        <select class="tf-correct w-full p-3 border border-gray-300 rounded-lg">
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Explanation</label>
                        <textarea class="tf-explanation w-full p-3 border border-gray-300 rounded-lg" rows="3" placeholder="Explanation of why the statement is true or false..."></textarea>
                    </div>
                `;
                break;
                
            case 'scenario':
                typeLabel.textContent = 'Scenario-Based Question';
                content.innerHTML = `
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Section Title</label>
                        <input type="text" class="section-title w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., Scenario Analysis">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Scenario Description</label>
                        <textarea class="scenario-text w-full p-3 border border-gray-300 rounded-lg" rows="4" placeholder="Describe a detailed scenario here..."></textarea>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Question</label>
                        <input type="text" class="scenario-question w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., What would be the best approach in this scenario?">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Options (one per line)</label>
                        <textarea class="scenario-options w-full p-3 border border-gray-300 rounded-lg" rows="4" placeholder="Option 1&#10;Option 2&#10;Option 3&#10;Option 4"></textarea>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Correct Answer</label>
                        <input type="text" class="scenario-correct w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., Option 2">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Explanation</label>
                        <textarea class="scenario-explanation w-full p-3 border border-gray-300 rounded-lg" rows="3" placeholder="Detailed explanation of the correct approach..."></textarea>
                    </div>
                    <div class="mb-4">
                        <label class="flex items-center text-gray-700 font-medium">
                            <input type="checkbox" class="scenario-shuffle mr-2 h-5 w-5 text-blue-600" checked>
                            Shuffle Options
                        </label>
                    </div>
                `;
                break;
                
            case 'short-answer':
                typeLabel.textContent = 'Short Answer Question';
                content.innerHTML = `
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Section Title</label>
                        <input type="text" class="section-title w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., Short Answer Question">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Question</label>
                        <textarea class="sa-question w-full p-3 border border-gray-300 rounded-lg" rows="3" placeholder="e.g., Explain how you would approach this OSINT challenge..."></textarea>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">Minimum Length (characters)</label>
                            <input type="number" class="sa-min-length w-full p-3 border border-gray-300 rounded-lg" value="100">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">Maximum Length (characters)</label>
                            <input type="number" class="sa-max-length w-full p-3 border border-gray-300 rounded-lg" value="1000">
                        </div>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Sample Answer</label>
                        <textarea class="sa-sample w-full p-3 border border-gray-300 rounded-lg" rows="4" placeholder="This is an example of what a good answer might include..."></textarea>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-medium mb-2">Key Elements (one per line)</label>
                        <textarea class="sa-key-elements w-full p-3 border border-gray-300 rounded-lg" rows="3" placeholder="key point 1&#10;key point 2&#10;key point 3"></textarea>
                        <p class="text-sm text-gray-500 mt-1">These are points that should be included in a good answer</p>
                    </div>
                `;
                break;
        }
        
        // Add hints section for all interactive types
        if (type !== 'content') {
            const hintsSection = document.createElement('div');
            hintsSection.className = 'mb-4';
            hintsSection.innerHTML = `
                <label class="block text-gray-700 font-medium mb-2">Hints (one per line, optional)</label>
                <textarea class="section-hints w-full p-3 border border-gray-300 rounded-lg" rows="3" placeholder="Hint 1&#10;Hint 2&#10;Hint 3"></textarea>
            `;
            content.appendChild(hintsSection);
            
            // Add success/incorrect messages for interactive elements
            const messagesSection = document.createElement('div');
            messagesSection.className = 'grid grid-cols-2 gap-4';
            messagesSection.innerHTML = `
                <div>
                    <label class="block text-gray-700 font-medium mb-2">Success Message</label>
                    <input type="text" class="success-message w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., Great job!">
                </div>
                <div>
                    <label class="block text-gray-700 font-medium mb-2">Incorrect Message</label>
                    <input type="text" class="incorrect-message w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g., Try again.">
                </div>
            `;
            content.appendChild(messagesSection);
        }
        
        sectionElement.appendChild(content);
        
        // Add move up/down buttons
        const moveButtons = document.createElement('div');
        moveButtons.className = 'flex justify-end mt-4 space-x-2';
        
        const moveUpButton = document.createElement('button');
        moveUpButton.className = 'px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition';
        moveUpButton.textContent = 'Move Up';
        moveUpButton.addEventListener('click', () => {
            const currentIndex = Array.from(sectionsContainer.children).indexOf(sectionElement);
            if (currentIndex > 0) {
                sectionsContainer.insertBefore(sectionElement, sectionsContainer.children[currentIndex - 1]);
            }
        });
        
        const moveDownButton = document.createElement('button');
        moveDownButton.className = 'px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition';
        moveDownButton.textContent = 'Move Down';
        moveDownButton.addEventListener('click', () => {
            const currentIndex = Array.from(sectionsContainer.children).indexOf(sectionElement);
            if (currentIndex < sectionsContainer.children.length - 1) {
                sectionsContainer.insertBefore(sectionElement, sectionsContainer.children[currentIndex + 2]);
            }
        });
        
        moveButtons.appendChild(moveUpButton);
        moveButtons.appendChild(moveDownButton);
        sectionElement.appendChild(moveButtons);
        
        // Add to container
        sectionsContainer.appendChild(sectionElement);
        
        // Store section type
        sectionElement.dataset.type = type;
    }
    
    // Preview the module
    function previewModule() {
        // Validate required fields
        if (!validateRequiredFields()) {
            return;
        }
        
        // Generate module data
        const moduleData = collectModuleData();
        
        // Create preview HTML
        let previewHtml = `
            <div class="mb-6">
                <h2 class="text-3xl font-bold text-blue-700 mb-2">${moduleData.title}</h2>
                <div class="flex items-center text-gray-600 mb-4">
                    <span class="inline-block px-2 py-1 text-xs font-semibold rounded badge-${moduleData.difficulty.toLowerCase()} mr-4">${moduleData.difficulty}</span>
                    <span>${moduleData.duration} min</span>
                </div>
                <p class="text-lg">${moduleData.description}</p>
            </div>
            <div class="border-t border-gray-200 pt-6">
                <h3 class="text-xl font-bold mb-4">Module Sections:</h3>
                <ol class="list-decimal pl-6 space-y-4">
        `;
        
        moduleData.sections.forEach(section => {
            previewHtml += `<li class="font-medium">${section.title}</li>`;
        });
        
        previewHtml += `
                </ol>
            </div>
        `;
        
        // Display preview
        previewContent.innerHTML = previewHtml;
        previewModal.classList.remove('hidden');
    }
    
    // Generate JSON for the module
    function generateJson() {
        // Validate required fields
        if (!validateRequiredFields()) {
            return;
        }
        
        // Generate module data
        const moduleData = collectModuleData();
        
        // Format JSON with indentation
        const json = JSON.stringify(moduleData, null, 2);
        
        // Display JSON
        jsonOutput.textContent = json;
        filenameDisplay.textContent = `${moduleData.id}.json`;
        jsonModal.classList.remove('hidden');
    }
    
    // Copy JSON to clipboard
    function copyJsonToClipboard() {
        const json = jsonOutput.textContent;
        navigator.clipboard.writeText(json).then(() => {
            copyJsonButton.textContent = 'Copied!';
            setTimeout(() => {
                copyJsonButton.textContent = 'Copy to Clipboard';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard. Please select and copy the text manually.');
        });
    }
    
    // Insert content template
    function insertContentTemplate(button) {
        // Find the closest content textarea
        const section = button.closest('.p-6');
        const textarea = section.querySelector('.section-content');
        
        if (!textarea) return;
        
        // Create template selection modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <h3 class="text-xl font-bold mb-4">Insert Content Template</h3>
                <div class="space-y-4">
                    <div class="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer template-item">
                        <h4 class="font-medium">Warning Box</h4>
                        <pre class="text-sm bg-gray-200 p-2 mt-2 rounded">[warning]Important warning message here. Be careful about this issue.[/warning]</pre>
                    </div>
                    
                    <div class="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer template-item">
                        <h4 class="font-medium">Tip Box</h4>
                        <pre class="text-sm bg-gray-200 p-2 mt-2 rounded">[tip]Here's a helpful tip that will make this task easier.[/tip]</pre>
                    </div>
                    
                    <div class="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer template-item">
                        <h4 class="font-medium">Note Box</h4>
                        <pre class="text-sm bg-gray-200 p-2 mt-2 rounded">[note]This is an important note to remember for later.[/note]</pre>
                    </div>
                    
                    <div class="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer template-item">
                        <h4 class="font-medium">Important Box</h4>
                        <pre class="text-sm bg-gray-200 p-2 mt-2 rounded">[important]This is critical information that you must understand.[/important]</pre>
                    </div>
                    
                    <div class="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer template-item">
                        <h4 class="font-medium">Example Box</h4>
                        <pre class="text-sm bg-gray-200 p-2 mt-2 rounded">[example]Here's an example that demonstrates this concept.[/example]</pre>
                    </div>
                    
                    <div class="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer template-item">
                        <h4 class="font-medium">Quote Box</h4>
                        <pre class="text-sm bg-gray-200 p-2 mt-2 rounded">[quote]This is a quotation from an important source.[/quote]</pre>
                    </div>
                    
                    <div class="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer template-item">
                        <h4 class="font-medium">Code Block</h4>
                        <pre class="text-sm bg-gray-200 p-2 mt-2 rounded">[code language="javascript"]
function example() {
    console.log("This is a code example");
}
[/code]</pre>
                    </div>
                    
                    <div class="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer template-item">
                        <h4 class="font-medium">Complete Section Template</h4>
                        <pre class="text-sm bg-gray-200 p-2 mt-2 rounded"><p>This is a standard paragraph of text.</p>

<h3>This is a subheading</h3>

<p>Here's another paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>

<ul>
    <li>First bullet point</li>
    <li>Second bullet point</li>
    <li>Third bullet point</li>
</ul>

[note]This is an important note to remember.[/note]

[tip]Here's a helpful tip that will make this task easier.[/tip]

[warning]Be careful about this potential issue.[/warning]

[code language="javascript"]
// Example code
function example() {
    console.log("Hello world");
}
[/code]</pre>
                    </div>
                </div>
                <div class="mt-6 flex justify-end">
                    <button class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition" id="close-template-modal">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle template selection
        const templateItems = modal.querySelectorAll('.template-item');
        templateItems.forEach(item => {
            item.addEventListener('click', () => {
                const pre = item.querySelector('pre');
                const templateText = pre.textContent;
                
                // Insert at cursor position or append
                if (textarea.selectionStart || textarea.selectionStart === 0) {
                    const startPos = textarea.selectionStart;
                    const endPos = textarea.selectionEnd;
                    textarea.value = textarea.value.substring(0, startPos) + templateText + textarea.value.substring(endPos);
                    textarea.selectionStart = startPos + templateText.length;
                    textarea.selectionEnd = startPos + templateText.length;
                } else {
                    textarea.value += templateText;
                }
                
                // Focus the textarea
                textarea.focus();
                
                // Close the modal
                document.body.removeChild(modal);
            });
        });
        
        // Close button
        const closeButton = modal.querySelector('#close-template-modal');
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    // Validate required fields
    function validateRequiredFields() {
        // Check basic module info
        if (!moduleId.value || !moduleTitle.value || !moduleDuration.value || !moduleDescription.value) {
            alert('Please fill in all required module information fields.');
            return false;
        }
        
        // Check if there are any sections
        if (sectionsContainer.children.length === 0 || sectionsContainer.querySelector('p.text-gray-500')) {
            alert('Please add at least one section to your module.');
            return false;
        }
        
        // Validate each section
        let valid = true;
        Array.from(sectionsContainer.children).forEach(section => {
            const titleInput = section.querySelector('.section-title');
            if (!titleInput || !titleInput.value) {
                alert('All sections must have a title.');
                valid = false;
                return;
            }
            
            const type = section.dataset.type;
            
            if (type === 'content') {
                const contentInput = section.querySelector('.section-content');
                if (!contentInput || !contentInput.value) {
                    alert(`Section "${titleInput.value}" must have content.`);
                    valid = false;
                    return;
                }
            } else if (type === 'quiz' || type === 'scenario') {
                const questionInput = section.querySelector('.quiz-question, .scenario-question');
                const optionsInput = section.querySelector('.quiz-options, .scenario-options');
                const correctInput = section.querySelector('.quiz-correct, .scenario-correct');
                
                if (!questionInput || !questionInput.value || !optionsInput || !optionsInput.value || !correctInput || !correctInput.value) {
                    alert(`Section "${titleInput.value}" is missing required fields.`);
                    valid = false;
                    return;
                }
                
                // Check if correct answer is in options
                const options = optionsInput.value.split('\n').filter(opt => opt.trim());
                if (!options.includes(correctInput.value)) {
                    alert(`In section "${titleInput.value}", the correct answer must be one of the options.`);
                    valid = false;
                    return;
                }
            } else if (type === 'fill-blanks') {
                const textInput = section.querySelector('.blanks-text');
                const answersInput = section.querySelector('.blanks-answers');
                
                if (!textInput || !textInput.value || !answersInput || !answersInput.value) {
                    alert(`Section "${titleInput.value}" is missing required fields.`);
                    valid = false;
                    return;
                }
                
                // Count blanks and answers
                const blankCount = (textInput.value.match(/\[blank\]/g) || []).length;
                const answers = answersInput.value.split('\n').filter(ans => ans.trim());
                
                if (blankCount !== answers.length) {
                    alert(`In section "${titleInput.value}", the number of [blank] placeholders (${blankCount}) must match the number of answers (${answers.length}).`);
                    valid = false;
                    return;
                }
            } else if (type === 'matching') {
                const pairsInput = section.querySelector('.matching-pairs');
                
                if (!pairsInput || !pairsInput.value) {
                    alert(`Section "${titleInput.value}" must have at least one pair.`);
                    valid = false;
                    return;
                }
                
                // Check pair format
                const pairs = pairsInput.value.split('\n').filter(pair => pair.trim());
                for (const pair of pairs) {
                    if (!pair.includes(':')) {
                        alert(`In section "${titleInput.value}", each pair must be in the format "Term:Definition".`);
                        valid = false;
                        return;
                    }
                }
            } else if (type === 'ordering') {
                const itemsInput = section.querySelector('.ordering-items');
                
                if (!itemsInput || !itemsInput.value || itemsInput.value.split('\n').filter(item => item.trim()).length < 2) {
                    alert(`Section "${titleInput.value}" must have at least two items.`);
                    valid = false;
                    return;
                }
            } else if (type === 'true-false') {
                const statementInput = section.querySelector('.tf-statement');
                const explanationInput = section.querySelector('.tf-explanation');
                
                if (!statementInput || !statementInput.value || !explanationInput || !explanationInput.value) {
                    alert(`Section "${titleInput.value}" is missing required fields.`);
                    valid = false;
                    return;
                }
            } else if (type === 'short-answer') {
                const questionInput = section.querySelector('.sa-question');
                const minLengthInput = section.querySelector('.sa-min-length');
                const maxLengthInput = section.querySelector('.sa-max-length');
                
                if (!questionInput || !questionInput.value || !minLengthInput || !maxLengthInput) {
                    alert(`Section "${titleInput.value}" is missing required fields.`);
                    valid = false;
                    return;
                }
                
                if (parseInt(minLengthInput.value) >= parseInt(maxLengthInput.value)) {
                    alert(`In section "${titleInput.value}", minimum length must be less than maximum length.`);
                    valid = false;
                    return;
                }
            }
        });
        
        return valid;
    }
    
    // Collect module data from form
    function collectModuleData() {
        const moduleData = {
            id: moduleId.value,
            title: moduleTitle.value,
            description: moduleDescription.value,
            difficulty: moduleDifficulty.value,
            duration: parseInt(moduleDuration.value),
            image: moduleImage.value || `images/${moduleId.value}.jpg`,
            sections: []
        };
        
        if (moduleFeatured.checked) {
            moduleData.featured = true;
        }
        
        // Collect sections data
        Array.from(sectionsContainer.children).forEach(sectionElement => {
            const type = sectionElement.dataset.type;
            const titleInput = sectionElement.querySelector('.section-title');
            const title = titleInput ? titleInput.value : '';
            
            let section = {
                title: title,
                type: type === 'content' ? undefined : type
            };
            
            // Collect section data based on type
            switch (type) {
                case 'content':
                    const contentInput = sectionElement.querySelector('.section-content');
                    section.content = contentInput ? contentInput.value : '';
                    break;
                    
                case 'quiz':
                    const questionInput = sectionElement.querySelector('.quiz-question');
                    const optionsInput = sectionElement.querySelector('.quiz-options');
                    const correctInput = sectionElement.querySelector('.quiz-correct');
                    const explanationInput = sectionElement.querySelector('.quiz-explanation');
                    const shuffleInput = sectionElement.querySelector('.quiz-shuffle');
                    
                    section.question = questionInput ? questionInput.value : '';
                    section.options = optionsInput ? optionsInput.value.split('\n').filter(opt => opt.trim()) : [];
                    section.correctAnswer = correctInput ? correctInput.value : '';
                    
                    if (explanationInput && explanationInput.value) {
                        section.explanation = explanationInput.value;
                    }
                    
                    if (shuffleInput) {
                        section.shuffle = shuffleInput.checked;
                    }
                    break;
                    
                case 'fill-blanks':
                    const instructionInput = sectionElement.querySelector('.blanks-instruction');
                    const textInput = sectionElement.querySelector('.blanks-text');
                    const answersInput = sectionElement.querySelector('.blanks-answers');
                    const alternativesInput = sectionElement.querySelector('.blanks-alternatives');
                    
                    section.instruction = instructionInput ? instructionInput.value : '';
                    section.text = textInput ? textInput.value : '';
                    section.blanks = answersInput ? answersInput.value.split('\n').filter(ans => ans.trim()) : [];
                    
                    if (alternativesInput && alternativesInput.value) {
                        section.acceptableAnswers = alternativesInput.value.split('\n')
                            .filter(line => line.trim())
                            .map(line => line.split(',').map(alt => alt.trim()));
                    }
                    break;
                    
                case 'matching':
                    const matchingInstructionInput = sectionElement.querySelector('.matching-instruction');
                    const pairsInput = sectionElement.querySelector('.matching-pairs');
                    const matchingShuffleInput = sectionElement.querySelector('.matching-shuffle');
                    
                    section.instruction = matchingInstructionInput ? matchingInstructionInput.value : '';
                    
                    if (pairsInput) {
                        section.pairs = pairsInput.value.split('\n')
                            .filter(pair => pair.trim() && pair.includes(':'))
                            .map(pair => {
                                const [term, definition] = pair.split(':').map(p => p.trim());
                                return { term, definition };
                            });
                    } else {
                        section.pairs = [];
                    }
                    
                    if (matchingShuffleInput) {
                        section.shuffle = matchingShuffleInput.checked;
                    }
                    break;
                    
                case 'ordering':
                    const orderingInstructionInput = sectionElement.querySelector('.ordering-instruction');
                    const itemsInput = sectionElement.querySelector('.ordering-items');
                    const orderingShuffleInput = sectionElement.querySelector('.ordering-shuffle');
                    
                    section.instruction = orderingInstructionInput ? orderingInstructionInput.value : '';
                    section.items = itemsInput ? itemsInput.value.split('\n').filter(item => item.trim()) : [];
                    section.correctOrder = Array.from(Array(section.items.length).keys());
                    
                    if (orderingShuffleInput) {
                        section.shuffle = orderingShuffleInput.checked;
                    }
                    break;
                    
                case 'true-false':
                    const statementInput = sectionElement.querySelector('.tf-statement');
                    const tfCorrectInput = sectionElement.querySelector('.tf-correct');
                    const tfExplanationInput = sectionElement.querySelector('.tf-explanation');
                    
                    section.statement = statementInput ? statementInput.value : '';
                    section.correctAnswer = tfCorrectInput ? tfCorrectInput.value === 'true' : false;
                    section.explanation = tfExplanationInput ? tfExplanationInput.value : '';
                    break;
                    
                case 'scenario':
                    const scenarioInput = sectionElement.querySelector('.scenario-text');
                    const scenarioQuestionInput = sectionElement.querySelector('.scenario-question');
                    const scenarioOptionsInput = sectionElement.querySelector('.scenario-options');
                    const scenarioCorrectInput = sectionElement.querySelector('.scenario-correct');
                    const scenarioExplanationInput = sectionElement.querySelector('.scenario-explanation');
                    const scenarioShuffleInput = sectionElement.querySelector('.scenario-shuffle');
                    
                    section.scenario = scenarioInput ? scenarioInput.value : '';
                    section.question = scenarioQuestionInput ? scenarioQuestionInput.value : '';
                    section.options = scenarioOptionsInput ? scenarioOptionsInput.value.split('\n').filter(opt => opt.trim()) : [];
                    section.correctAnswer = scenarioCorrectInput ? scenarioCorrectInput.value : '';
                    section.explanation = scenarioExplanationInput ? scenarioExplanationInput.value : '';
                    
                    if (scenarioShuffleInput) {
                        section.shuffle = scenarioShuffleInput.checked;
                    }
                    break;
                    
                case 'short-answer':
                    const saQuestionInput = sectionElement.querySelector('.sa-question');
                    const minLengthInput = sectionElement.querySelector('.sa-min-length');
                    const maxLengthInput = sectionElement.querySelector('.sa-max-length');
                    const sampleInput = sectionElement.querySelector('.sa-sample');
                    const keyElementsInput = sectionElement.querySelector('.sa-key-elements');
                    
                    section.question = saQuestionInput ? saQuestionInput.value : '';
                    section.minLength = minLengthInput ? parseInt(minLengthInput.value) : 100;
                    section.maxLength = maxLengthInput ? parseInt(maxLengthInput.value) : 1000;
                    
                    if (sampleInput && sampleInput.value) {
                        section.sampleAnswer = sampleInput.value;
                    }
                    
                    if (keyElementsInput && keyElementsInput.value) {
                        section.keyElements = keyElementsInput.value.split('\n').filter(el => el.trim());
                    }
                    break;
            }
            
            // Add hints for interactive sections
            if (type !== 'content') {
                const hintsInput = sectionElement.querySelector('.section-hints');
                if (hintsInput && hintsInput.value) {
                    section.hints = hintsInput.value.split('\n').filter(hint => hint.trim());
                }
                
                // Add success/incorrect messages
                const successInput = sectionElement.querySelector('.success-message');
                const incorrectInput = sectionElement.querySelector('.incorrect-message');
                
                if (successInput && successInput.value) {
                    section.successMessage = successInput.value;
                }
                
                if (incorrectInput && incorrectInput.value) {
                    section.incorrectMessage = incorrectInput.value;
                }
            }
            
            moduleData.sections.push(section);
        });
        
        return moduleData;
    }
});
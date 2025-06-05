/**
 * Module Templates for FreeOSINT.org
 * 
 * This file contains template generators for different types of interactive elements
 * that can be used in training modules.
 */

const ModuleTemplates = {
    /**
     * Generate a multiple choice question template
     * @param {Object} config - Configuration object
     * @returns {Object} Question template
     */
    multipleChoice: function(config = {}) {
        return {
            type: "quiz",
            title: config.title || "Multiple Choice Question",
            question: config.question || "What is the correct answer?",
            options: config.options || ["Option 1", "Option 2", "Option 3", "Option 4"],
            correctAnswer: config.correctAnswer || config.options?.[0] || "Option 1",
            explanation: config.explanation || "Explanation of the correct answer.",
            shuffle: config.shuffle !== undefined ? config.shuffle : true,
            points: config.points || 10,
            feedback: {
                correct: config.correctFeedback || "Great job! That's correct.",
                incorrect: config.incorrectFeedback || "That's not quite right. Try again."
            },
            hints: config.hints || []
        };
    },

    /**
     * Generate a fill-in-the-blanks question template
     * @param {Object} config - Configuration object
     * @returns {Object} Question template
     */
    fillBlanks: function(config = {}) {
        return {
            type: "fill-blanks",
            title: config.title || "Fill in the Blanks",
            instruction: config.instruction || "Fill in the blanks to complete the text:",
            text: config.text || "This is a [blank] with some [blank] to fill in.",
            blanks: config.blanks || ["word", "spaces"],
            acceptableAnswers: config.acceptableAnswers || [
                ["word", "term"], 
                ["spaces", "blanks", "gaps"]
            ],
            caseSensitive: config.caseSensitive !== undefined ? config.caseSensitive : false,
            points: config.points || 15,
            successMessage: config.successMessage || "Well done! You've filled in all the blanks correctly.",
            incorrectMessage: config.incorrectMessage || "Some answers need revision. Try again.",
            hints: config.hints || []
        };
    },

    /**
     * Generate a matching exercise template
     * @param {Object} config - Configuration object
     * @returns {Object} Question template
     */
    matching: function(config = {}) {
        return {
            type: "matching",
            title: config.title || "Matching Exercise",
            instruction: config.instruction || "Match the items in the left column with their corresponding items in the right column:",
            pairs: config.pairs || [
                { term: "Term 1", definition: "Definition 1" },
                { term: "Term 2", definition: "Definition 2" },
                { term: "Term 3", definition: "Definition 3" }
            ],
            shuffle: config.shuffle !== undefined ? config.shuffle : true,
            points: config.points || 20,
            successMessage: config.successMessage || "Great job! You've correctly matched all items.",
            incorrectMessage: config.incorrectMessage || "Some matches are incorrect. Try again.",
            hints: config.hints || []
        };
    },

    /**
     * Generate a drag-and-drop ordering exercise template
     * @param {Object} config - Configuration object
     * @returns {Object} Question template
     */
    ordering: function(config = {}) {
        return {
            type: "ordering",
            title: config.title || "Ordering Exercise",
            instruction: config.instruction || "Arrange the following items in the correct order:",
            items: config.items || ["First item", "Second item", "Third item", "Fourth item"],
            correctOrder: config.correctOrder || [0, 1, 2, 3],
            points: config.points || 15,
            successMessage: config.successMessage || "Perfect! You've arranged the items in the correct order.",
            incorrectMessage: config.incorrectMessage || "The order is not quite right. Try again.",
            hints: config.hints || []
        };
    },

    /**
     * Generate a code exercise template
     * @param {Object} config - Configuration object
     * @returns {Object} Question template
     */
    codeExercise: function(config = {}) {
        return {
            type: "code-exercise",
            title: config.title || "Code Exercise",
            instruction: config.instruction || "Complete the following code:",
            codeLanguage: config.codeLanguage || "javascript",
            codeTemplate: config.codeTemplate || "// Your code here\n",
            solutionCode: config.solutionCode || "// Solution code",
            requiredElements: config.requiredElements || ["required element 1", "required element 2"],
            testCases: config.testCases || [],
            points: config.points || 25,
            successMessage: config.successMessage || "Great job! Your code works correctly.",
            incorrectMessage: config.incorrectMessage || "Your code doesn't quite work yet. Try again.",
            hints: config.hints || []
        };
    },

    /**
     * Generate an image hotspot exercise template
     * @param {Object} config - Configuration object
     * @returns {Object} Question template
     */
    imageHotspot: function(config = {}) {
        return {
            type: "image-hotspot",
            title: config.title || "Image Hotspot Exercise",
            instruction: config.instruction || "Click on the correct areas in the image:",
            image: config.image || "images/default-hotspot.jpg",
            hotspots: config.hotspots || [
                { 
                    x: 150, 
                    y: 150, 
                    radius: 30, 
                    label: "Hotspot 1", 
                    description: "Description of hotspot 1" 
                }
            ],
            points: config.points || 15,
            successMessage: config.successMessage || "Well done! You've identified all the correct areas.",
            hints: config.hints || []
        };
    },

    /**
     * Generate a true/false question template
     * @param {Object} config - Configuration object
     * @returns {Object} Question template
     */
    trueFalse: function(config = {}) {
        return {
            type: "true-false",
            title: config.title || "True or False",
            statement: config.statement || "This statement is true.",
            correctAnswer: config.correctAnswer !== undefined ? config.correctAnswer : true,
            explanation: config.explanation || "Explanation of why the statement is true or false.",
            points: config.points || 5,
            successMessage: config.successMessage || "Correct!",
            incorrectMessage: config.incorrectMessage || "Incorrect. Try again.",
            hints: config.hints || []
        };
    },

    /**
     * Generate a scenario-based question template
     * @param {Object} config - Configuration object
     * @returns {Object} Question template
     */
    scenario: function(config = {}) {
        return {
            type: "scenario",
            title: config.title || "Scenario Analysis",
            scenario: config.scenario || "Describe a detailed scenario here...",
            question: config.question || "What would be the best approach in this scenario?",
            options: config.options || ["Option 1", "Option 2", "Option 3", "Option 4"],
            correctAnswer: config.correctAnswer || config.options?.[0] || "Option 1",
            explanation: config.explanation || "Detailed explanation of the correct approach and why others are less optimal.",
            points: config.points || 20,
            successMessage: config.successMessage || "Excellent analysis!",
            incorrectMessage: config.incorrectMessage || "Consider the scenario more carefully.",
            hints: config.hints || []
        };
    },

    /**
     * Generate a short answer question template
     * @param {Object} config - Configuration object
     * @returns {Object} Question template
     */
    shortAnswer: function(config = {}) {
        return {
            type: "short-answer",
            title: config.title || "Short Answer Question",
            question: config.question || "Provide a brief answer to the following question:",
            minLength: config.minLength || 20,
            maxLength: config.maxLength || 500,
            sampleAnswer: config.sampleAnswer || "This is an example of what a good answer might include...",
            keyElements: config.keyElements || ["key point 1", "key point 2", "key point 3"],
            points: config.points || 15,
            hints: config.hints || []
        };
    },

    /**
     * Generate a content section template (non-interactive)
     * @param {Object} config - Configuration object
     * @returns {Object} Content section template
     */
    content: function(config = {}) {
        return {
            type: "content",
            title: config.title || "Section Title",
            content: config.content || "<p>Content goes here...</p>",
            resources: config.resources || []
        };
    }
};

// Export the templates for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModuleTemplates;
}
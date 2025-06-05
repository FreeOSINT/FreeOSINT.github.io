# FreeOSINT.org

A modular, adaptive website for Open Source Intelligence (OSINT) training with advanced interactive learning modules.

## Project Overview

FreeOSINT.org is designed to provide accessible, high-quality OSINT education through a user-friendly website with automatically generated training modules. The site features:

- Responsive design using HTML, JavaScript, and Tailwind CSS
- Dynamic loading of training modules from JSON files
- Advanced interactive learning elements with multiple question types
- Built-in module creation tool for easy content generation
- Progress tracking for users
- Comprehensive OSINT training content

## Project Structure

```
FreeOSINT/
├── index.html             # Landing page
├── about.html             # About Us page
├── ethics.html            # Ethics page
├── training.html          # Training modules page
├── module-creator.html    # Module creation tool
├── css/
│   └── styles.css         # Custom styles
├── js/
│   ├── main.js            # Main JavaScript functionality
│   ├── training.js        # Training module functionality
│   ├── module-templates.js # Templates for interactive elements
│   └── module-creator.js  # Module creation tool functionality
├── modules/
│   ├── index.json         # List of all available modules
│   └── [module-id].json   # Individual module content files
└── images/
    └── *.jpg              # Images for modules and site
```

## Interactive Elements

The platform supports a wide range of interactive learning elements:

1. **Multiple Choice Questions** - Test knowledge with single-answer questions
2. **Fill-in-the-Blanks** - Complete sentences or paragraphs with missing words
3. **Matching Exercises** - Match items from two columns
4. **Ordering Exercises** - Arrange items in the correct sequence
5. **Image Hotspots** - Identify areas of interest in images
6. **True/False Questions** - Evaluate statements as true or false
7. **Scenario-Based Questions** - Apply knowledge to realistic scenarios
8. **Short Answer Questions** - Provide free-form responses with key element checking
9. **Code Exercises** - Practice coding with validation

## Module Creator Tool

The built-in module creator tool allows content creators to:

- Create new training modules without writing JSON manually
- Add various types of interactive elements with a user-friendly interface
- Preview modules before publishing
- Generate properly formatted JSON files
- Easily organize and reorder sections

## How to Add New Training Modules

There are two ways to create new training modules:

### Using the Module Creator Tool (Recommended)

1. Navigate to the "Create Module" page
2. Fill in the basic module information
3. Add content and interactive sections as needed
4. Generate the JSON file
5. Save the file to the `modules/` directory
6. Add an entry to `modules/index.json` (or update the existing file)

### Manual JSON Creation

1. Create a new JSON file in the `modules/` directory following the schema below
2. Add an entry to `modules/index.json` with basic module information

### Module JSON Schema

Each module consists of:

- Basic metadata (id, title, description, etc.)
- An array of sections that make up the module content

Example module structure:

```json
{
  "id": "module-id",
  "title": "Module Title",
  "description": "Module description",
  "difficulty": "Beginner",
  "duration": 45,
  "image": "images/module-image.jpg",
  "sections": [
    {
      "title": "Section Title",
      "content": "<p>HTML content goes here</p>"
    },
    {
      "title": "Quiz Section",
      "type": "quiz",
      "question": "Question text",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": "Option 2",
      "explanation": "Explanation of the correct answer",
      "hints": ["Hint 1", "Hint 2"]
    },
    {
      "title": "Fill in the Blanks",
      "type": "fill-blanks",
      "instruction": "Fill in the blanks:",
      "text": "OSINT stands for [blank] [blank] [blank].",
      "blanks": ["Open", "Source", "Intelligence"],
      "acceptableAnswers": [
        ["Open", "open"],
        ["Source", "source"],
        ["Intelligence", "intelligence"]
      ]
    }
    // Additional sections...
  ]
}
```

## Running the Project

This is a static website that can be served from any web server. For local development:

1. Clone the repository
2. Open the project in your preferred code editor
3. Use a local server to view the site (e.g., Live Server extension in VS Code)

## Browser Compatibility

The site is designed to work with modern browsers including:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License. See LICENSE for details.
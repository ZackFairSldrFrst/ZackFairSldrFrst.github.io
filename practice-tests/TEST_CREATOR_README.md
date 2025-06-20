# Practice Test Creator

A powerful tool for creating professional practice tests that match the exact formatting and functionality of the existing Practice Tests Hub platform.

## Overview

The Test Creator allows anyone to build custom practice tests with:
- **Multiple Question Types**: Standard multiple choice, most/least likely (situational judgment), and ranking questions
- **Professional Formatting**: Uses the same CSS and styling as existing tests
- **Export Functionality**: Generates ready-to-upload HTML and JavaScript files
- **Preview Feature**: See how your test will look before exporting

## How to Use

### 1. Access the Test Creator
Navigate to `test-creator.html` in your browser or click "Create Your Own Test" from the main page.

### 2. Configure Your Test
Fill in the basic test information:
- **Test Title**: Following the naming convention (e.g., "VR-05: Advanced Reasoning")
- **Category**: Choose from Verbal Reasoning, Numerical Reasoning, Situational Judgment, etc.
- **Difficulty**: Beginner, Intermediate, or Advanced
- **Time Limit**: How long users have to complete the test (5-120 minutes)
- **Test Code**: Auto-generated URL-friendly identifier (e.g., "vr-05-advanced")
- **Description**: Brief explanation of what the test assesses

### 3. Add Questions
Each question supports:
- **Question Type**: Multiple choice, most/least likely, or ranking
- **Passage/Scenario**: Optional background text for context
- **Question Text**: The main question being asked
- **Answer Options**: 2-10 possible answers
- **Correct Answer**: Specify which option(s) are correct
- **Explanation**: Detailed explanation of why the answer is correct

#### Question Types Explained

**Multiple Choice**
- Standard format with one correct answer
- Users select a single option
- Specify the correct answer by option number

**Most/Least Likely (Situational Judgment)**
- Users must select both the most likely and least likely responses
- Commonly used for workplace scenario questions
- Specify both most and least likely correct answers

**Ranking**
- Users drag and drop options to rank them from most to least effective
- Enter the correct order as comma-separated option indices (e.g., "2,1,0,3")
- Often used for prioritization and decision-making questions

### 4. Preview Your Test
Click "Preview Test" to see:
- How the test header will appear
- A sample question in the actual test format
- Test summary with question types and timing

### 5. Export Your Test
Click "Export Test Files" to download:
- **HTML file**: The test interface (e.g., "vr-05-advanced.html")
- **JavaScript file**: The test data and logic (e.g., "vr-05-advanced-script.js")

## File Structure for Upload

When you export a test, you'll get two files that need to be uploaded to the correct directory structure:

```
your-category/
├── your-test-code/
│   ├── index.html          (rename your exported HTML file to this)
│   └── script.js           (rename your exported JS file to this)
```

### Example Upload Process

1. **Create Directory**: If creating "VR-05: Advanced Reasoning"
   ```
   verbal-reasoning/
   └── vr-05/
   ```

2. **Upload Files**:
   - Rename `vr-05-advanced.html` → `index.html`
   - Rename `vr-05-advanced-script.js` → `script.js`
   - Upload both to the `verbal-reasoning/vr-05/` directory

3. **Update Main Index**: Add your test to the main `index.html` test library section:
   ```html
   <li class="test-item">
       <a href="verbal-reasoning/vr-05/index.html" class="test-link">
           <div class="test-info-section">
               <h4>VR-05: Advanced Reasoning</h4>
               <p>Your test description here</p>
           </div>
           <div class="test-meta">
               <span class="meta-tag">10 Questions</span>
               <span class="meta-tag">20 Minutes</span>
               <span class="difficulty advanced">Advanced</span>
           </div>
       </a>
   </li>
   ```

## Best Practices

### Writing Good Questions
1. **Clear and Concise**: Make questions easy to understand
2. **Relevant Options**: Ensure all answer choices are plausible
3. **Detailed Explanations**: Help users learn from their mistakes
4. **Consistent Difficulty**: Match the test's intended difficulty level

### Following Conventions
1. **Naming**: Use the established prefix system (VR-, NR-, SJ-, etc.)
2. **Timing**: Allow appropriate time per question (1-2 minutes typically)
3. **Length**: Keep tests focused (10-30 questions usually optimal)
4. **Categories**: Place tests in the correct category folder

### Quality Assurance
1. **Preview First**: Always preview before exporting
2. **Test Thoroughly**: Try your exported test to ensure it works
3. **Check Answers**: Verify all correct answers are properly set
4. **Proofread**: Review all text for spelling and grammar

## Technical Details

### Dependencies
The exported tests require:
- `../../css/styles.css` - Main stylesheet
- `../../js/test-core.js` - Core test functionality
- Inter font from Google Fonts
- Chart.js for results visualization

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive enhancement for older browsers

### File Format
- HTML5 compliant structure
- JavaScript ES6+ features
- JSON data format for questions
- CSS Grid and Flexbox for layout

## Troubleshooting

### Common Issues

**Test Won't Load**
- Check file paths in HTML (should point to `../../css/styles.css` and `../../js/test-core.js`)
- Ensure both HTML and JS files are in the same directory
- Verify the JS file is properly named in the HTML script tag

**Questions Not Displaying**
- Check that questions array in JS file is properly formatted
- Ensure all required fields (question, options, correctAnswer) are present
- Validate JSON syntax in the exported JS file

**Timer Not Working**
- Verify timeLimit is set in testConfig object
- Check that the time is specified in seconds (minutes × 60)

**Answers Not Saving**
- Ensure correctAnswer format matches question type
- For ranking questions, verify array format [2,1,0,3]
- For most/least questions, check object format {most: 1, least: 3}

### Getting Help
If you encounter issues:
1. Check the browser console for error messages
2. Compare your exported files with existing working tests
3. Verify the directory structure matches the examples
4. Test in a clean browser environment

## Advanced Features

### Custom Styling
You can add custom CSS to individual tests by including a `<style>` block in the HTML head section.

### Special Characters
The creator supports:
- Mathematical symbols
- International characters
- Basic HTML formatting in passages and explanations

### Data Export
The creator generates clean, readable JSON data that can be:
- Modified manually if needed
- Imported into other systems
- Backed up for version control

---

**Happy test creating!** 🎯

The Test Creator makes it easy to contribute high-quality practice tests to the platform while maintaining professional standards and user experience. 
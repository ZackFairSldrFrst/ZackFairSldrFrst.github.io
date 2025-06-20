class TestCreator {
    constructor() {
        this.questions = [];
        this.questionCounter = 0;
        this.autoSaveTimeout = null;
        this.hasUnsavedChanges = false;
        this.saveKey = 'practice-test-creator-draft';
        this.init();
    }
    
    init() {
        // Try to load saved data first
        this.loadSavedData();
        
        // If no saved data, add first question
        if (this.questions.length === 0) {
            this.addQuestion();
        }
        
        // Set up event listeners
        document.getElementById('testCategory').addEventListener('change', this.updateTestCode.bind(this));
        document.getElementById('testTitle').addEventListener('input', this.updateTestCode.bind(this));
        
        // Set up auto-save on all form inputs
        this.setupAutoSave();
        
        // Set up beforeunload warning
        window.addEventListener('beforeunload', (e) => {
            if (this.hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
                return e.returnValue;
            }
        });
        
        // Update save status display
        this.updateSaveStatus('ready');
    }
    
    updateTestCode() {
        const category = document.getElementById('testCategory').value;
        const title = document.getElementById('testTitle').value;
        
        if (category && title) {
            // Extract prefix and number from title if available
            const titleMatch = title.match(/([A-Z]{2})-(\d+)/);
            if (titleMatch) {
                const prefix = titleMatch[1].toLowerCase();
                const number = titleMatch[2];
                document.getElementById('testCode').value = `${prefix}-${number.padStart(2, '0')}`;
            } else {
                // Generate from category
                const prefixMap = {
                    'verbal-reasoning': 'vr',
                    'numerical-reasoning': 'nr',
                    'situational-judgment': 'sj',
                    'logical-reasoning': 'lr',
                    'diagrammatic-reasoning': 'dr',
                    'other': 'ot'
                };
                const prefix = prefixMap[category] || 'ot';
                document.getElementById('testCode').value = `${prefix}-01`;
            }
        }
    }
    
    addQuestion() {
        this.questionCounter++;
        const questionId = `question-${this.questionCounter}`;
        const questionType = document.getElementById('questionType').value;
        
        const questionHtml = this.createQuestionBuilder(questionId, this.questionCounter, questionType);
        
        const questionsContainer = document.getElementById('questionsContainer');
        questionsContainer.insertAdjacentHTML('beforeend', questionHtml);
        
        // Initialize question data
        this.questions.push({
            id: questionId,
            type: questionType,
            passage: '',
            scenario: '',
            question: '',
            options: ['', '', '', ''],
            correctAnswer: null,
            explanation: ''
        });
    }
    
    createQuestionBuilder(questionId, questionNumber, questionType) {
        let typeSpecificHtml = '';
        
        if (questionType === 'most-least') {
            typeSpecificHtml = `
                <div class="most-least-controls">
                    <div class="form-group">
                        <label>Most Likely Answer (Option Number)</label>
                        <select onchange="updateCorrectAnswer('${questionId}', 'most', this.value)">
                            <option value="">Select option...</option>
                            <option value="0">Option 1</option>
                            <option value="1">Option 2</option>
                            <option value="2">Option 3</option>
                            <option value="3">Option 4</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Least Likely Answer (Option Number)</label>
                        <select onchange="updateCorrectAnswer('${questionId}', 'least', this.value)">
                            <option value="">Select option...</option>
                            <option value="0">Option 1</option>
                            <option value="1">Option 2</option>
                            <option value="2">Option 3</option>
                            <option value="3">Option 4</option>
                        </select>
                    </div>
                </div>
            `;
        } else if (questionType === 'ranking') {
            typeSpecificHtml = `
                <div class="ranking-info">
                    <p><strong>Ranking Questions:</strong> Users will drag and drop options to rank them from 1 (most effective) to 4 (least effective). Enter the correct order as option numbers (0-3) separated by commas.</p>
                    <div class="form-group">
                        <label>Correct Ranking Order (e.g., 2,1,0,3)</label>
                        <input type="text" placeholder="Enter correct order as option indices" onchange="updateCorrectAnswer('${questionId}', 'ranking', this.value)">
                    </div>
                </div>
            `;
        } else {
            typeSpecificHtml = `
                <div class="correct-answer-selector">
                    <label>Correct Answer</label>
                    <select onchange="updateCorrectAnswer('${questionId}', 'single', this.value)">
                        <option value="">Select correct answer...</option>
                        <option value="0">Option 1</option>
                        <option value="1">Option 2</option>
                        <option value="2">Option 3</option>
                        <option value="3">Option 4</option>
                    </select>
                </div>
            `;
        }
        
        const typeLabels = {
            'multiple-choice': '📝 Multiple Choice',
            'most-least': '⚖️ Most/Least Likely', 
            'ranking': '📊 Ranking'
        };
        
        return `
            <div class="question-builder" id="${questionId}">
                <div class="question-header">
                    <div class="question-number">
                        Question ${questionNumber}
                        <span class="question-type-badge">${typeLabels[questionType]}</span>
                    </div>
                    <div class="question-actions">
                        <button type="button" class="btn btn-sm btn-danger" onclick="removeQuestion('${questionId}')">🗑️ Remove</button>
                    </div>
                </div>
                
                <div class="question-content">
                    <div class="form-group">
                        <label>Question Type</label>
                        <select onchange="updateQuestionType('${questionId}', this.value)">
                            <option value="multiple-choice" ${questionType === 'multiple-choice' ? 'selected' : ''}>📝 Multiple Choice</option>
                            <option value="most-least" ${questionType === 'most-least' ? 'selected' : ''}>⚖️ Most/Least Likely</option>
                            <option value="ranking" ${questionType === 'ranking' ? 'selected' : ''}>📊 Ranking</option>
                        </select>
                        <div class="help-text">Choose the appropriate question format for your assessment</div>
                    </div>
                    
                    <div class="form-group">
                        <label>Passage/Scenario <span class="label-help">(Optional)</span></label>
                        <textarea placeholder="Enter any background text, passage, or scenario that provides context for this question..." onchange="updateQuestionData('${questionId}', 'passage', this.value)"></textarea>
                        <div class="help-text">Add context, background information, or a scenario that students need to read before answering</div>
                    </div>
                    
                    <div class="form-group">
                        <label class="field-required">Question Text</label>
                        <textarea placeholder="Enter the main question that students will answer..." onchange="updateQuestionData('${questionId}', 'question', this.value)" required></textarea>
                        <div class="help-text">Write a clear, specific question that directly relates to your learning objectives</div>
                    </div>
                    
                    <div class="form-group">
                        <div class="options-header">
                            <label class="field-required">Answer Options</label>
                            <button type="button" class="btn btn-sm btn-primary" onclick="addOption('${questionId}')">➕ Add Option</button>
                        </div>
                        <div class="options-container" id="${questionId}-options">
                            <div class="option-input">
                                <div class="option-number">A</div>
                                <input type="text" placeholder="Enter first answer option..." onchange="updateOption('${questionId}', 0, this.value)">
                                <button type="button" class="btn btn-icon btn-danger" onclick="removeOption('${questionId}', 0)" style="display: none;">×</button>
                            </div>
                            <div class="option-input">
                                <div class="option-number">B</div>
                                <input type="text" placeholder="Enter second answer option..." onchange="updateOption('${questionId}', 1, this.value)">
                                <button type="button" class="btn btn-icon btn-danger" onclick="removeOption('${questionId}', 1)" style="display: none;">×</button>
                            </div>
                            <div class="option-input">
                                <div class="option-number">C</div>
                                <input type="text" placeholder="Enter third answer option..." onchange="updateOption('${questionId}', 2, this.value)">
                                <button type="button" class="btn btn-icon btn-danger" onclick="removeOption('${questionId}', 2)">×</button>
                            </div>
                            <div class="option-input">
                                <div class="option-number">D</div>
                                <input type="text" placeholder="Enter fourth answer option..." onchange="updateOption('${questionId}', 3, this.value)">
                                <button type="button" class="btn btn-icon btn-danger" onclick="removeOption('${questionId}', 3)">×</button>
                            </div>
                        </div>
                        <div class="help-text">Provide clear, distinct answer choices. Ensure incorrect options are plausible but clearly wrong.</div>
                    </div>
                    
                    ${typeSpecificHtml}
                    
                    <div class="form-group">
                        <label class="field-required">Explanation</label>
                        <textarea placeholder="Explain why the correct answer is right and why other options are incorrect. This helps students learn from their mistakes..." onchange="updateQuestionData('${questionId}', 'explanation', this.value)"></textarea>
                        <div class="help-text">Provide a detailed explanation that helps students understand the reasoning behind the correct answer</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    updateQuestionType(questionId, newType) {
        const questionIndex = this.questions.findIndex(q => q.id === questionId);
        if (questionIndex !== -1) {
            this.questions[questionIndex].type = newType;
            this.questions[questionIndex].correctAnswer = null;
            
            // Recreate the question builder with new type
            const questionElement = document.getElementById(questionId);
            const questionNumber = questionIndex + 1;
            questionElement.outerHTML = this.createQuestionBuilder(questionId, questionNumber, newType);
        }
    }
    
    updateQuestionData(questionId, field, value) {
        const questionIndex = this.questions.findIndex(q => q.id === questionId);
        if (questionIndex !== -1) {
            this.questions[questionIndex][field] = value;
            this.markUnsaved();
            this.triggerAutoSave();
        }
    }
    
    updateOption(questionId, optionIndex, value) {
        const questionIndex = this.questions.findIndex(q => q.id === questionId);
        if (questionIndex !== -1) {
            if (!this.questions[questionIndex].options) {
                this.questions[questionIndex].options = [];
            }
            this.questions[questionIndex].options[optionIndex] = value;
            this.markUnsaved();
            this.triggerAutoSave();
        }
    }
    
    addOption(questionId) {
        const questionIndex = this.questions.findIndex(q => q.id === questionId);
        if (questionIndex !== -1) {
            const optionsContainer = document.getElementById(`${questionId}-options`);
            const currentOptions = optionsContainer.querySelectorAll('.option-input');
            const newIndex = currentOptions.length;
            const optionLetter = String.fromCharCode(65 + newIndex); // A, B, C, D, E, etc.
            
            const optionHtml = `
                <div class="option-input">
                    <div class="option-number">${optionLetter}</div>
                    <input type="text" placeholder="Enter answer option..." onchange="updateOption('${questionId}', ${newIndex}, this.value)">
                    <button type="button" class="btn btn-icon btn-danger" onclick="removeOption('${questionId}', ${newIndex})">×</button>
                </div>
            `;
            
            optionsContainer.insertAdjacentHTML('beforeend', optionHtml);
            this.questions[questionIndex].options.push('');
        }
    }
    
    removeOption(questionId, optionIndex) {
        const questionIndex = this.questions.findIndex(q => q.id === questionId);
        if (questionIndex !== -1) {
            const optionsContainer = document.getElementById(`${questionId}-options`);
            const optionInputs = optionsContainer.querySelectorAll('.option-input');
            
            if (optionInputs.length > 2) { // Keep at least 2 options
                optionInputs[optionIndex].remove();
                this.questions[questionIndex].options.splice(optionIndex, 1);
                
                // Update remaining option indices and letters
                const remainingInputs = optionsContainer.querySelectorAll('.option-input');
                remainingInputs.forEach((input, index) => {
                    const optionNumber = input.querySelector('.option-number');
                    const inputField = input.querySelector('input');
                    const removeBtn = input.querySelector('.btn-danger');
                    
                    const optionLetter = String.fromCharCode(65 + index); // A, B, C, D, etc.
                    optionNumber.textContent = optionLetter;
                    inputField.setAttribute('onchange', `updateOption('${questionId}', ${index}, this.value)`);
                    removeBtn.setAttribute('onclick', `removeOption('${questionId}', ${index})`);
                });
            }
        }
    }
    
    removeQuestion(questionId) {
        const questionIndex = this.questions.findIndex(q => q.id === questionId);
        if (questionIndex !== -1 && this.questions.length > 1) {
            document.getElementById(questionId).remove();
            this.questions.splice(questionIndex, 1);
            
            // Update question numbers
            this.updateQuestionNumbers();
        }
    }
    
    updateQuestionNumbers() {
        const questionBuilders = document.querySelectorAll('.question-builder');
        questionBuilders.forEach((builder, index) => {
            const questionNumber = builder.querySelector('.question-number');
            questionNumber.textContent = `Question ${index + 1}`;
        });
    }
    
    updateCorrectAnswer(questionId, type, value) {
        const questionIndex = this.questions.findIndex(q => q.id === questionId);
        if (questionIndex !== -1) {
            const question = this.questions[questionIndex];
            
            if (type === 'single') {
                question.correctAnswer = parseInt(value);
            } else if (type === 'most' || type === 'least') {
                if (!question.correctAnswer) {
                    question.correctAnswer = {};
                }
                question.correctAnswer[type] = parseInt(value);
            } else if (type === 'ranking') {
                // Parse comma-separated values
                question.correctAnswer = value.split(',').map(v => parseInt(v.trim()));
            }
            
            this.markUnsaved();
            this.triggerAutoSave();
        }
    }
    
    previewTest() {
        const previewSection = document.getElementById('previewSection');
        const previewContent = document.getElementById('previewContent');
        
        // Collect form data
        const testData = this.collectTestData();
        
        // Generate preview HTML
        const previewHtml = this.generatePreviewHtml(testData);
        
        previewContent.innerHTML = previewHtml;
        previewSection.style.display = 'block';
        previewSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    collectTestData() {
        return {
            title: document.getElementById('testTitle').value,
            category: document.getElementById('testCategory').value,
            difficulty: document.getElementById('difficulty').value,
            timeLimit: parseInt(document.getElementById('timeLimit').value),
            testCode: document.getElementById('testCode').value,
            description: document.getElementById('testDescription').value,
            questions: this.questions.filter(q => q.question.trim() !== '')
        };
    }
    
    generatePreviewHtml(testData) {
        return `
            <div class="test-header">
                <h1>${testData.title}</h1>
                <p class="test-description">${testData.description}</p>
                <div class="test-info">
                    <span class="test-meta-item">${testData.questions.length} Questions</span>
                    <span class="test-meta-item">${testData.timeLimit} Minutes</span>
                    <span class="difficulty ${testData.difficulty}">${testData.difficulty.charAt(0).toUpperCase() + testData.difficulty.slice(1)}</span>
                </div>
            </div>
            <div class="question-preview">
                <h3>Sample Question Preview:</h3>
                ${testData.questions.length > 0 ? this.generateQuestionPreview(testData.questions[0]) : '<p>No questions added yet.</p>'}
            </div>
            <div class="test-summary">
                <h3>Test Summary:</h3>
                <ul>
                    <li><strong>Total Questions:</strong> ${testData.questions.length}</li>
                    <li><strong>Question Types:</strong> ${this.getQuestionTypeSummary(testData.questions)}</li>
                    <li><strong>Estimated Time:</strong> ${testData.timeLimit} minutes</li>
                    <li><strong>Category:</strong> ${testData.category}</li>
                </ul>
            </div>
        `;
    }
    
    generateQuestionPreview(question) {
        let optionsHtml = '';
        
        if (question.type === 'most-least') {
            optionsHtml = question.options.map((option, index) => `
                <div class="option">
                    <div class="option-content">${option}</div>
                    <div class="option-buttons">
                        <button class="most-btn">Most Likely</button>
                        <button class="least-btn">Least Likely</button>
                    </div>
                </div>
            `).join('');
        } else if (question.type === 'ranking') {
            optionsHtml = question.options.map((option, index) => `
                <div class="option">
                    <div class="rank-number">${index + 1}</div>
                    <div class="option-content">${option}</div>
                </div>
            `).join('');
        } else {
            optionsHtml = question.options.map((option, index) => `
                <div class="option">${option}</div>
            `).join('');
        }
        
        return `
            <div class="question-content">
                ${question.passage ? `<div class="passage">${question.passage}</div>` : ''}
                <div class="question-text">${question.question}</div>
                <div class="options ${question.type === 'most-least' ? 'most-least' : question.type === 'ranking' ? 'ranking' : ''}">
                    ${optionsHtml}
                </div>
            </div>
        `;
    }
    
    getQuestionTypeSummary(questions) {
        const types = {};
        questions.forEach(q => {
            types[q.type] = (types[q.type] || 0) + 1;
        });
        
        return Object.entries(types).map(([type, count]) => {
            const typeName = type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
            return `${typeName} (${count})`;
        }).join(', ');
    }
    
    exportTest() {
        const testData = this.collectTestData();
        
        if (!testData.title || !testData.testCode || testData.questions.length === 0) {
            alert('Please fill in all required fields and add at least one question before exporting.');
            return;
        }
        
        try {
            // Generate HTML file
            const htmlContent = this.generateTestHtml(testData);
            const jsContent = this.generateTestJs(testData);
            
            // Create and download HTML file first
            this.downloadFile(`${testData.testCode}.html`, htmlContent, 'text/html');
            
            // Delay JS file download to prevent browser blocking
            setTimeout(() => {
                this.downloadFile(`${testData.testCode}-script.js`, jsContent, 'text/javascript');
                
                // Show success message after both files
                setTimeout(() => {
                    alert(`Test files have been generated and downloaded!\n\n- ${testData.testCode}.html\n- ${testData.testCode}-script.js\n\nBoth files are needed to run your test.`);
                }, 100);
            }, 500);
            
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export test files. Please try again.');
        }
    }
    
    generateTestHtml(testData) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${testData.title} | Practice Tests Hub</title>
    <link rel="stylesheet" href="../../css/styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="container">
        <div class="test-header">
            <h1>${testData.title}</h1>
            <p class="test-description">${testData.description}</p>
            <div class="test-info">
                <span class="test-meta-item">${testData.questions.length} Questions</span>
                <span class="test-meta-item">${testData.timeLimit} Minutes</span>
                <span class="difficulty ${testData.difficulty}">${testData.difficulty.charAt(0).toUpperCase() + testData.difficulty.slice(1)}</span>
            </div>
            <div id="timer">Time Remaining: ${testData.timeLimit}:00</div>
        </div>
        
        <div class="progress-container">
            <div class="progress"></div>
        </div>
        
        <div id="questionContainer"></div>
        
        <div class="navigation">
            <button id="prevButton" class="nav-button" disabled>Previous</button>
            <button id="nextButton" class="nav-button" disabled>Next</button>
        </div>
        
        <div id="results" style="display: none;"></div>
    </div>
    
    <script src="../../js/test-core.js"></script>
    <script src="${testData.testCode}-script.js"></script>
</body>
</html>`;
    }
    
    generateTestJs(testData) {
        const questions = testData.questions.map(q => {
            const questionObj = {
                question: q.question,
                options: q.options.filter(opt => opt.trim() !== ''),
                correctAnswer: q.correctAnswer,
                explanation: q.explanation
            };
            
            if (q.type !== 'multiple-choice') {
                questionObj.type = q.type;
            }
            
            if (q.passage && q.passage.trim() !== '') {
                questionObj.passage = q.passage;
            }
            
            return questionObj;
        });
        
        return `const testConfig = {
    questions: ${JSON.stringify(questions, null, 8)},
    timeLimit: ${testData.timeLimit * 60} // ${testData.timeLimit} minutes in seconds
};

// Initialize the test
const testCore = new TestCore(testConfig);
testCore.start();`;
    }
    
    downloadFile(filename, content, mimeType) {
        try {
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            
            document.body.appendChild(a);
            a.click();
            
            // Clean up after a delay to ensure download starts
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            
            console.log(`Successfully created download for: ${filename}`);
            return true;
        } catch (error) {
            console.error(`Failed to download ${filename}:`, error);
            alert(`Failed to download ${filename}. Please try again.`);
            return false;
        }
    }
    
    // Auto-save functionality
    setupAutoSave() {
        // Set up auto-save on form inputs
        const form = document.getElementById('testCreatorForm');
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.markUnsaved();
                this.triggerAutoSave();
            });
            input.addEventListener('change', () => {
                this.markUnsaved();
                this.triggerAutoSave();
            });
        });
    }
    
    markUnsaved() {
        this.hasUnsavedChanges = true;
        // Add visual indicator to page title
        if (!document.title.includes('*')) {
            document.title = '* ' + document.title;
        }
    }
    
    markSaved() {
        this.hasUnsavedChanges = false;
        // Remove visual indicator from page title
        document.title = document.title.replace('* ', '');
    }
    
    triggerAutoSave() {
        // Clear existing timeout
        if (this.autoSaveTimeout) {
            clearTimeout(this.autoSaveTimeout);
        }
        
        // Set new timeout for 2 seconds
        this.autoSaveTimeout = setTimeout(() => {
            this.autoSave();
        }, 2000);
    }
    
    autoSave() {
        try {
            this.updateSaveStatus('saving');
            const saveData = this.collectSaveData();
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            this.markSaved();
            this.updateSaveStatus('saved');
            
            // Reset to ready status after 3 seconds
            setTimeout(() => {
                this.updateSaveStatus('ready');
            }, 3000);
        } catch (error) {
            console.error('Auto-save failed:', error);
            this.updateSaveStatus('error');
        }
    }
    
    collectSaveData() {
        return {
            timestamp: Date.now(),
            testConfig: {
                title: document.getElementById('testTitle').value,
                category: document.getElementById('testCategory').value,
                difficulty: document.getElementById('difficulty').value,
                timeLimit: document.getElementById('timeLimit').value,
                testCode: document.getElementById('testCode').value,
                description: document.getElementById('testDescription').value,
                questionType: document.getElementById('questionType').value
            },
            questions: this.questions,
            questionCounter: this.questionCounter
        };
    }
    
    loadSavedData() {
        try {
            const savedData = localStorage.getItem(this.saveKey);
            if (savedData) {
                const data = JSON.parse(savedData);
                
                // Ask user if they want to load saved data
                const shouldLoad = confirm(
                    `Found saved work from ${new Date(data.timestamp).toLocaleString()}. Would you like to continue where you left off?`
                );
                
                if (shouldLoad) {
                    this.restoreFromSave(data);
                    this.updateSaveStatus('loaded');
                    return true;
                } else {
                    // User chose not to load, clear the save
                    localStorage.removeItem(this.saveKey);
                }
            }
        } catch (error) {
            console.error('Failed to load saved data:', error);
            localStorage.removeItem(this.saveKey);
        }
        return false;
    }
    
    restoreFromSave(data) {
        // Restore test configuration
        if (data.testConfig) {
            document.getElementById('testTitle').value = data.testConfig.title || '';
            document.getElementById('testCategory').value = data.testConfig.category || '';
            document.getElementById('difficulty').value = data.testConfig.difficulty || '';
            document.getElementById('timeLimit').value = data.testConfig.timeLimit || '20';
            document.getElementById('testCode').value = data.testConfig.testCode || '';
            document.getElementById('testDescription').value = data.testConfig.description || '';
            document.getElementById('questionType').value = data.testConfig.questionType || 'multiple-choice';
        }
        
        // Restore questions
        if (data.questions && data.questions.length > 0) {
            this.questions = data.questions;
            this.questionCounter = data.questionCounter || data.questions.length;
            
            // Clear existing questions container
            document.getElementById('questionsContainer').innerHTML = '';
            
            // Recreate all questions
            this.questions.forEach((question, index) => {
                const questionHtml = this.createQuestionBuilder(question.id, index + 1, question.type);
                document.getElementById('questionsContainer').insertAdjacentHTML('beforeend', questionHtml);
                
                // Restore question data
                this.restoreQuestionData(question);
            });
        }
        
        this.markSaved();
    }
    
    restoreQuestionData(question) {
        // Restore passage/scenario
        const passageTextarea = document.querySelector(`#${question.id} textarea[onchange*="passage"]`);
        if (passageTextarea && question.passage) {
            passageTextarea.value = question.passage;
        }
        
        // Restore question text
        const questionTextarea = document.querySelector(`#${question.id} textarea[onchange*="question"]`);
        if (questionTextarea && question.question) {
            questionTextarea.value = question.question;
        }
        
        // Restore options
        if (question.options) {
            question.options.forEach((option, index) => {
                const optionInput = document.querySelector(`#${question.id}-options .option-input:nth-child(${index + 1}) input`);
                if (optionInput) {
                    optionInput.value = option;
                }
            });
        }
        
        // Restore correct answer based on type
        if (question.correctAnswer !== null && question.correctAnswer !== undefined) {
            if (question.type === 'most-least') {
                const mostSelect = document.querySelector(`#${question.id} select[onchange*="most"]`);
                const leastSelect = document.querySelector(`#${question.id} select[onchange*="least"]`);
                if (mostSelect && question.correctAnswer.most !== undefined) {
                    mostSelect.value = question.correctAnswer.most;
                }
                if (leastSelect && question.correctAnswer.least !== undefined) {
                    leastSelect.value = question.correctAnswer.least;
                }
            } else if (question.type === 'ranking') {
                const rankingInput = document.querySelector(`#${question.id} input[onchange*="ranking"]`);
                if (rankingInput && Array.isArray(question.correctAnswer)) {
                    rankingInput.value = question.correctAnswer.join(',');
                }
            } else {
                const correctSelect = document.querySelector(`#${question.id} select[onchange*="single"]`);
                if (correctSelect) {
                    correctSelect.value = question.correctAnswer;
                }
            }
        }
        
        // Restore explanation
        const explanationTextarea = document.querySelector(`#${question.id} textarea[onchange*="explanation"]`);
        if (explanationTextarea && question.explanation) {
            explanationTextarea.value = question.explanation;
        }
    }
    
    updateSaveStatus(status) {
        const saveIndicator = document.querySelector('.save-indicator');
        if (!saveIndicator) return;
        
        // Remove all status classes
        saveIndicator.classList.remove('saved', 'saving', 'error');
        
        switch (status) {
            case 'saving':
                saveIndicator.textContent = '💾 Saving...';
                saveIndicator.classList.add('saving');
                break;
            case 'saved':
                saveIndicator.textContent = '✅ Saved automatically';
                saveIndicator.classList.add('saved');
                break;
            case 'error':
                saveIndicator.textContent = '❌ Save failed';
                saveIndicator.classList.add('error');
                break;
            case 'loaded':
                saveIndicator.textContent = '📂 Work restored';
                saveIndicator.classList.add('saved');
                break;
            default:
                saveIndicator.textContent = '💾 Auto-save ready';
                break;
        }
    }
    
    manualSave() {
        this.autoSave();
    }
    
    startOver() {
        const confirmed = confirm(
            'Are you sure you want to start over? This will clear all your work and cannot be undone.'
        );
        
        if (confirmed) {
            // Clear localStorage
            localStorage.removeItem(this.saveKey);
            
            // Reset all form fields
            document.getElementById('testCreatorForm').reset();
            
            // Clear questions
            this.questions = [];
            this.questionCounter = 0;
            document.getElementById('questionsContainer').innerHTML = '';
            
            // Add first question
            this.addQuestion();
            
            // Hide preview
            document.getElementById('previewSection').style.display = 'none';
            
            // Reset save status
            this.markSaved();
            this.updateSaveStatus('ready');
            
            alert('Started over! All previous work has been cleared.');
        }
    }
}

// Global functions for HTML event handlers
let testCreator;

function addQuestion() {
    testCreator.addQuestion();
}

function removeQuestion(questionId) {
    testCreator.removeQuestion(questionId);
}

function updateQuestionType(questionId, newType) {
    testCreator.updateQuestionType(questionId, newType);
}

function updateQuestionData(questionId, field, value) {
    testCreator.updateQuestionData(questionId, field, value);
}

function updateOption(questionId, optionIndex, value) {
    testCreator.updateOption(questionId, optionIndex, value);
}

function addOption(questionId) {
    testCreator.addOption(questionId);
}

function removeOption(questionId, optionIndex) {
    testCreator.removeOption(questionId, optionIndex);
}

function updateCorrectAnswer(questionId, type, value) {
    testCreator.updateCorrectAnswer(questionId, type, value);
}

function previewTest() {
    testCreator.previewTest();
}

function exportTest() {
    testCreator.exportTest();
}

function manualSave() {
    testCreator.manualSave();
}

function loadFromSave() {
    testCreator.loadSavedData();
}

function startOver() {
    testCreator.startOver();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    testCreator = new TestCreator();
}); 
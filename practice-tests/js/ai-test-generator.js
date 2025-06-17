// AI Test Generator using DeepSeek API
const DEEPSEEK_API_KEY = 'sk-6ea3eba109d94e7d9238cf3a2232e06d';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Initialize the AI test generator
document.addEventListener('DOMContentLoaded', function() {
    const testTypeSelect = document.getElementById('testTypeSelect');
    const generateTestBtn = document.getElementById('generateTestBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const generatedTestContainer = document.getElementById('generatedTestContainer');
    const testCategories = document.querySelector('.test-categories');

    // Enable/disable generate button based on selection
    testTypeSelect.addEventListener('change', function() {
        generateTestBtn.disabled = !this.value;
    });

    // Handle test generation
    generateTestBtn.addEventListener('click', async function() {
        const testType = testTypeSelect.value;
        if (!testType) return;

        let countdownTimer;
        let countdownSeconds = 60;

        try {
            // Show loading indicator with countdown
            loadingIndicator.style.display = 'block';
            generateTestBtn.disabled = true;
            
            // Update loading text with countdown
            const updateCountdown = () => {
                const loadingText = document.querySelector('#loadingIndicator p');
                if (countdownSeconds > 0) {
                    loadingText.textContent = `🔄 Generating your personalized test... Estimated time: ${countdownSeconds}s remaining`;
                    countdownSeconds--;
                } else {
                    loadingText.textContent = `🔄 Almost ready... Please wait a moment longer.`;
                }
            };
            
            // Start countdown
            updateCountdown();
            countdownTimer = setInterval(updateCountdown, 1000);

            // Generate test questions
            const testData = await generateAITest(testType);
            
            // Clear countdown timer
            if (countdownTimer) {
                clearInterval(countdownTimer);
            }
            
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
            
            // Show generated test and hide main categories
            testCategories.style.display = 'none';
            generatedTestContainer.style.display = 'block';
            
            // Update test title and description
            document.getElementById('generatedTestTitle').textContent = `AI Generated ${formatTestType(testType)} Test`;
            document.getElementById('generatedTestDescription').textContent = `Test your ${testType.replace('-', ' ')} skills with AI-generated questions`;
            
            // Initialize the test with generated data using TestCore class
            window.testCore = new TestCore({
                questions: testData.questions,
                timeLimit: (testData.timeLimit || 15) * 60 // Convert minutes to seconds
            });
            window.testCore.start();
            
        } catch (error) {
            console.error('Error generating test:', error);
            alert('Failed to generate test. Please try again.');
            
            // Clear countdown timer on error
            if (countdownTimer) {
                clearInterval(countdownTimer);
            }
            
            loadingIndicator.style.display = 'none';
            generateTestBtn.disabled = false;
        }
    });
});

// Generate AI test using DeepSeek API
async function generateAITest(testType) {
    const prompt = createPromptForTestType(testType);
    
    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert test creator. Generate high-quality aptitude test questions in the exact JSON format requested. Ensure all questions are challenging, realistic, and properly formatted.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 4000
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        let content = data.choices[0].message.content;
        
        // Log the raw response for debugging
        console.log('Raw API Response:', content);
        
        // Clean up the content - remove markdown code blocks if present
        content = content.trim();
        if (content.startsWith('```json')) {
            content = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (content.startsWith('```')) {
            content = content.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        // Log cleaned content
        console.log('Cleaned content:', content);
        
        // Check if JSON is complete (ends with closing brace)
        if (!content.trim().endsWith('}')) {
            throw new Error('Incomplete JSON response - likely truncated due to token limit');
        }
        
        // Parse the JSON response
        let testData;
        try {
            testData = JSON.parse(content.trim());
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.error('Content that failed to parse:', content);
            
            // Try to fix common JSON issues
            let fixedContent = content.trim();
            
            // Remove any trailing commas
            fixedContent = fixedContent.replace(/,(\s*[}\]])/g, '$1');
            
            // Try to close incomplete JSON
            if (!fixedContent.endsWith('}')) {
                // Count opening and closing braces
                const openBraces = (fixedContent.match(/{/g) || []).length;
                const closeBraces = (fixedContent.match(/}/g) || []).length;
                const missingBraces = openBraces - closeBraces;
                
                for (let i = 0; i < missingBraces; i++) {
                    fixedContent += '}';
                }
            }
            
            console.log('Attempting to parse fixed content:', fixedContent);
            testData = JSON.parse(fixedContent);
        }
        
        // Validate the structure
        if (!testData.questions || !Array.isArray(testData.questions)) {
            throw new Error('Invalid test data structure');
        }
        
        // Ensure we have at least some questions
        if (testData.questions.length === 0) {
            throw new Error('No questions generated');
        }
        
        return testData;
        
    } catch (error) {
        console.error('DeepSeek API Error:', error);
        throw error;
    }
}

// Create prompt for specific test type
function createPromptForTestType(testType) {
    const basePrompt = `Generate a practice test with exactly 10 questions for ${formatTestType(testType)}. 

Return ONLY a valid JSON object in this exact format:

{
    "title": "AI Generated ${formatTestType(testType)} Test",
    "description": "Test your ${testType.replace('-', ' ')} skills with AI-generated questions",
    "timeLimit": 5,
    "questions": [
        {
            "passage": "A relevant passage or context for the question...",
            "question": "The question text?",
            "options": [
                "Option A",
                "Option B", 
                "Option C",
                "Option D"
            ],
            "correctAnswer": 0,
            "explanation": "Step 1: Explain why option A is correct or incorrect.\\nStep 2: Explain why option B is correct or incorrect.\\nStep 3: Explain why option C is correct or incorrect.\\nStep 4: Explain why option D is correct or incorrect."
        }
    ]
}

`;

    // Add specific instructions for each test type
    switch (testType) {
        case 'verbal-reasoning':
            return basePrompt + `
For verbal reasoning questions:
- Include passages about current events, business, science, or social issues
- Questions should test reading comprehension, logical inference, and critical analysis
- Each passage should be 100-200 words
- Questions should ask about main ideas, implications, assumptions, or conclusions
- Make questions challenging but fair`;

        case 'numerical-reasoning':
            return basePrompt + `
For numerical reasoning questions:
- Include data tables, charts, or mathematical scenarios
- Questions should test data interpretation, percentage calculations, ratios, and basic statistics
- Provide realistic business or academic contexts
- Include specific numbers and data in the passage
- Questions should require calculation or data analysis`;

        case 'logical-reasoning':
            return basePrompt + `
For logical reasoning questions:
- Include scenarios that test deductive and inductive reasoning
- Questions about arguments, assumptions, conclusions, and logical flaws
- Use philosophical, legal, or everyday reasoning contexts
- Test pattern recognition and logical sequence understanding
- Include syllogisms and conditional reasoning`;

        case 'abstract-reasoning':
            return basePrompt + `
For abstract reasoning questions:
- Describe visual patterns, sequences, or abstract relationships in text
- Questions about identifying patterns, missing elements, or logical progressions
- Use geometric shapes, number sequences, or symbolic patterns described in words
- Test spatial and pattern recognition abilities
- Focus on rule identification and application`;

        case 'critical-thinking':
            return basePrompt + `
For critical thinking questions:
- Include complex scenarios requiring analysis and evaluation
- Questions about evaluating arguments, identifying biases, and assessing evidence
- Use real-world contexts like business decisions, policy analysis, or research evaluation
- Test ability to distinguish facts from opinions and evaluate source credibility
- Include scenarios with multiple perspectives`;

        case 'reading-comprehension':
            return basePrompt + `
For reading comprehension questions:
- Include diverse passages from literature, science, history, or current affairs
- Questions should test literal comprehension, inference, and interpretation
- Vary passage difficulty and style (narrative, expository, argumentative)
- Test vocabulary in context and main idea identification
- Include questions about author's tone, purpose, and perspective`;

        case 'problem-solving':
            return basePrompt + `
For problem-solving questions:
- Include practical scenarios requiring step-by-step solutions
- Questions about resource allocation, scheduling, optimization, or process improvement
- Use workplace, academic, or everyday problem contexts
- Test analytical thinking and solution evaluation
- Include multi-step problems with clear logical progression`;

        case 'spatial-reasoning':
            return basePrompt + `
For spatial reasoning questions:
- Describe 3D objects, rotations, and spatial relationships in text
- Questions about mental rotation, spatial visualization, and geometric relationships
- Include map reading, direction following, and spatial orientation tasks
- Test ability to visualize objects from different perspectives
- Use clear textual descriptions of spatial scenarios`;

        default:
            return basePrompt + `Generate general aptitude questions that test analytical thinking and reasoning skills.`;
    }
}

// Format test type for display
function formatTestType(testType) {
    return testType
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Add CSS for the AI test generator to match existing page styling
const style = document.createElement('style');
style.textContent = `
.ai-test-generator {
    background: var(--bg-secondary);
    padding: 2rem;
    border-radius: var(--border-radius);
    text-align: center;
    margin-bottom: 3rem;
    box-shadow: var(--shadow-sm);
    transition: var(--transition);
    border: 2px solid transparent;
}

.ai-test-generator:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
    border-color: var(--accent-color);
}

.ai-test-generator h2 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
}

.ai-test-generator p {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    color: var(--text-secondary);
}

.ai-test-generator select {
    background: var(--bg-tertiary);
    border: 1px solid var(--accent-color);
    padding: 0.75rem 1rem;
    border-radius: var(--border-radius);
    font-size: 1rem;
    margin: 0 0.5rem;
    min-width: 200px;
    color: var(--text-primary);
    transition: var(--transition);
    box-shadow: var(--shadow-sm);
}

.ai-test-generator select:focus {
    outline: none;
    border-color: var(--accent-hover);
    box-shadow: 0 0 0 3px rgba(34, 139, 230, 0.1);
}

.ai-test-generator button {
    background: var(--accent-color);
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: var(--border-radius);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    box-shadow: var(--shadow-sm);
    margin-top: 1rem;
}

.ai-test-generator button:hover:not(:disabled) {
    background: var(--accent-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.ai-test-generator button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--text-secondary);
}

#loadingIndicator {
    margin-top: 1rem;
    padding: 1rem;
    background: var(--bg-tertiary);
    border-radius: var(--border-radius);
    border: 1px solid var(--accent-color);
}

#loadingIndicator p {
    margin: 0;
    font-style: italic;
    color: var(--text-secondary);
}

#generatedTestContainer {
    margin-top: 2rem;
}

#generatedTestContainer .test-header {
    background: var(--bg-secondary);
    color: var(--text-primary);
    padding: 2rem;
    border-radius: var(--border-radius);
    text-align: center;
    margin-bottom: 2rem;
    box-shadow: var(--shadow-sm);
}

#generatedTestContainer .test-header h1 {
    margin: 0 0 1rem 0;
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-primary);
}

#generatedTestContainer .test-description {
    margin: 0 0 1.5rem 0;
    font-size: 1.1rem;
    color: var(--text-secondary);
}

#generatedTestContainer .test-info {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

#generatedTestContainer .test-meta-item {
    background: var(--bg-tertiary);
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-primary);
    border: 1px solid var(--accent-color);
}

.difficulty {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.difficulty.intermediate {
    background: var(--accent-color);
    color: white;
}

#generatedTestContainer #timer {
    text-align: center;
    font-size: 1.2rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background: var(--bg-secondary);
    border-radius: var(--border-radius);
    color: var(--text-primary);
    box-shadow: var(--shadow-sm);
}
`;
document.head.appendChild(style); 
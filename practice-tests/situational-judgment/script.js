const questions = [
    {
        type: 'multiple-choice',
        question: "In a team meeting, a colleague presents an idea that you think could be improved. What is the best approach?",
        options: [
            "Immediately point out the flaws in their idea",
            "Wait until after the meeting to discuss improvements privately",
            "Suggest improvements during the meeting in a constructive way",
            "Keep quiet and implement your own version later"
        ],
        correct: 2,
        explanation: "The best approach is to suggest improvements during the meeting in a constructive way. This shows you're engaged and supportive while helping the team move forward together."
    },
    {
        type: 'true-false',
        question: "In a professional setting, it's always better to wait for your manager's approval before making any changes to a project.",
        options: ["True", "False"],
        correct: 1,
        explanation: "False. While some changes require manager approval, many day-to-day decisions can and should be made independently. It's important to use judgment and take initiative when appropriate."
    },
    {
        type: 'ranking',
        question: "Rank the following actions in order of priority when dealing with a customer complaint:",
        options: [
            "Apologize for the inconvenience",
            "Gather all relevant information",
            "Propose a solution",
            "Follow up after resolution"
        ],
        correct: [1, 0, 2, 3], // Correct order: Gather info, Apologize, Propose solution, Follow up
        explanation: "The correct order is: 1) Gather information to understand the issue fully, 2) Apologize sincerely, 3) Propose a solution, 4) Follow up to ensure satisfaction. This order ensures you have all the facts before taking action."
    },
    {
        type: 'multiple-choice',
        question: "You notice a significant error in a report that's due to be submitted to a client. The deadline is in 2 hours. What should you do?",
        options: [
            "Submit the report anyway and fix it later",
            "Inform your manager immediately and work on a solution",
            "Try to fix it yourself without telling anyone",
            "Ask for an extension without explaining why"
        ],
        correct: 1,
        explanation: "Informing your manager immediately is the best course of action. This allows for proper escalation and ensures the client receives accurate information."
    },
    {
        type: 'true-false',
        question: "It's acceptable to use company resources for personal projects as long as it's after work hours.",
        options: ["True", "False"],
        correct: 1,
        explanation: "False. Company resources should only be used for company business, regardless of the time. Using company resources for personal projects could violate company policies and potentially lead to disciplinary action."
    },
    {
        type: 'ranking',
        question: "Rank these steps in order of importance when starting a new project:",
        options: [
            "Set up the project timeline",
            "Define project goals and objectives",
            "Assign team roles and responsibilities",
            "Create a detailed budget"
        ],
        correct: [1, 0, 2, 3], // Correct order: Define goals, Set timeline, Assign roles, Create budget
        explanation: "The correct order is: 1) Define goals and objectives (establishes direction), 2) Set up timeline (creates structure), 3) Assign roles (distributes work), 4) Create budget (allocates resources)."
    },
    {
        type: 'multiple-choice',
        question: "Your team is behind schedule on a project. What is the most effective first step?",
        options: [
            "Work overtime to catch up",
            "Identify the specific bottlenecks causing delays",
            "Request additional team members",
            "Adjust the project deadline"
        ],
        correct: 1,
        explanation: "Identifying specific bottlenecks is crucial before taking any action. This helps address the root cause of delays rather than just treating symptoms."
    },
    {
        type: 'true-false',
        question: "In a professional email, it's better to use formal language even when communicating with close colleagues.",
        options: ["True", "False"],
        correct: 1,
        explanation: "False. While maintaining professionalism is important, the level of formality should match your relationship with the recipient and the context of the communication. Being overly formal with close colleagues can create unnecessary distance."
    },
    {
        type: 'ranking',
        question: "Rank these communication methods in order of appropriateness for delivering bad news to a team:",
        options: [
            "Group email",
            "One-on-one meeting",
            "Team meeting",
            "Instant message"
        ],
        correct: [1, 2, 0, 3], // Correct order: One-on-one, Team meeting, Email, IM
        explanation: "The correct order is: 1) One-on-one meeting (allows for personal support), 2) Team meeting (maintains transparency), 3) Group email (formal documentation), 4) Instant message (too casual for bad news)."
    },
    {
        type: 'multiple-choice',
        question: "A client requests a feature that would require significant changes to your project timeline. What's the best first response?",
        options: [
            "Immediately agree to accommodate the request",
            "Explain why it's not possible",
            "Ask for more details about their needs and priorities",
            "Suggest they look for another solution"
        ],
        correct: 2,
        explanation: "Asking for more details helps understand the client's underlying needs and priorities. This information is crucial for finding the best solution that balances client needs with project constraints."
    },
    {
        question: "You notice a colleague consistently taking credit for your work in team meetings. What's the best course of action?",
        options: [
            "Confront them immediately in front of the team",
            "Document your contributions and discuss privately with your manager",
            "Start taking credit for their work in retaliation",
            "Ignore it and focus on your own work"
        ],
        correct: 1
    },
    {
        question: "Your manager asks you to complete a task that you know will miss an important deadline. What do you do?",
        options: [
            "Accept the task without question",
            "Explain the deadline concern and propose a solution",
            "Refuse to take on the task",
            "Complete it partially and blame others for the delay"
        ],
        correct: 1
    },
    {
        question: "A team member is struggling with their workload. What's the most appropriate response?",
        options: [
            "Offer to help and suggest ways to prioritize tasks",
            "Report them to management for underperformance",
            "Ignore their struggles as it's not your problem",
            "Take over their work completely"
        ],
        correct: 0
    }
];

let currentQuestion = 0;
let answers = new Array(questions.length).fill(null);
let timeLeft = 30 * 60; // 30 minutes in seconds

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = 
        `Time Remaining: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (timeLeft <= 0) {
        endTest();
    } else {
        timeLeft--;
    }
}

function displayQuestion(index) {
    const question = questions[index];
    const container = document.getElementById('test-container');
    
    let optionsHTML = '';
    
    switch(question.type) {
        case 'ranking':
            optionsHTML = `
                <div class="options ranking-options">
                    ${question.options.map((option, i) => `
                        <div class="option ranking-option" draggable="true" data-index="${i}">
                            <span class="rank-number">${i + 1}</span>
                            ${option}
                        </div>
                    `).join('')}
                </div>
                <p class="ranking-instruction">Drag and drop to reorder the options</p>
            `;
            break;
            
        case 'true-false':
            optionsHTML = `
                <div class="options true-false-options">
                    ${question.options.map((option, i) => `
                        <div class="option ${answers[index] === i ? 'selected' : ''}" 
                             onclick="selectAnswer(${i})">
                            ${option}
                        </div>
                    `).join('')}
                </div>
            `;
            break;
            
        default: // multiple-choice
            optionsHTML = `
                <div class="options">
                    ${question.options.map((option, i) => `
                        <div class="option ${answers[index] === i ? 'selected' : ''}" 
                             onclick="selectAnswer(${i})">
                            ${option}
                        </div>
                    `).join('')}
                </div>
            `;
    }
    
    container.innerHTML = `
        <div class="question">
            <h3>Question ${index + 1} of ${questions.length}</h3>
            <p>${question.question}</p>
            ${optionsHTML}
        </div>
    `;

    if (question.type === 'ranking') {
        setupRankingDragAndDrop();
    }

    document.getElementById('prev-btn').disabled = index === 0;
    document.getElementById('next-btn').textContent = 
        index === questions.length - 1 ? 'Submit' : 'Next';
    
    updateProgress();
}

function setupRankingDragAndDrop() {
    const rankingOptions = document.querySelectorAll('.ranking-option');
    const optionsContainer = document.querySelector('.ranking-options');
    
    rankingOptions.forEach(option => {
        option.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', option.dataset.index);
            option.classList.add('dragging');
        });
        
        option.addEventListener('dragend', () => {
            option.classList.remove('dragging');
        });
    });
    
    optionsContainer.addEventListener('dragover', e => {
        e.preventDefault();
        const draggingOption = document.querySelector('.dragging');
        const siblings = [...optionsContainer.querySelectorAll('.ranking-option:not(.dragging)')];
        
        const nextSibling = siblings.find(sibling => {
            const box = sibling.getBoundingClientRect();
            const offset = e.clientY - box.top - box.height / 2;
            return offset < 0;
        });
        
        optionsContainer.insertBefore(draggingOption, nextSibling);
    });
    
    optionsContainer.addEventListener('drop', e => {
        e.preventDefault();
        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
        const toIndex = Array.from(optionsContainer.children).indexOf(document.querySelector('.dragging'));
        
        if (fromIndex !== toIndex) {
            const newOrder = Array.from(optionsContainer.children).map(option => 
                parseInt(option.dataset.index)
            );
            answers[currentQuestion] = newOrder;
            
            // Update rank numbers
            optionsContainer.querySelectorAll('.ranking-option').forEach((option, index) => {
                option.querySelector('.rank-number').textContent = index + 1;
            });
        }
    });
}

function selectAnswer(index) {
    answers[currentQuestion] = index;
    displayQuestion(currentQuestion);
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        displayQuestion(currentQuestion);
    } else {
        endTest();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion(currentQuestion);
    }
}

function endTest() {
    clearInterval(timerInterval);
    document.getElementById('timer').style.display = 'none';
    document.getElementById('test-container').style.display = 'none';
    document.querySelector('.navigation').style.display = 'none';
    
    const results = document.getElementById('results');
    results.style.display = 'block';
    
    const score = answers.reduce((acc, answer, index) => {
        const question = questions[index];
        if (question.type === 'ranking') {
            return acc + (JSON.stringify(answer) === JSON.stringify(question.correct) ? 1 : 0);
        } else {
            return acc + (answer === question.correct ? 1 : 0);
        }
    }, 0);
    
    // Calculate statistics
    const totalQuestions = questions.length;
    const correctAnswers = score;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Add Chart.js
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = () => {
        // Create chart container
        const chartContainer = document.createElement('div');
        chartContainer.className = 'results-chart';
        chartContainer.innerHTML = '<canvas id="resultsChart"></canvas>';
        results.insertBefore(chartContainer, document.getElementById('score'));
        
        // Create summary statistics
        const summaryContainer = document.createElement('div');
        summaryContainer.className = 'results-summary';
        summaryContainer.innerHTML = `
            <div class="summary-item">
                <h3>Total Questions</h3>
                <p>${totalQuestions}</p>
            </div>
            <div class="summary-item">
                <h3>Correct Answers</h3>
                <p>${correctAnswers}</p>
            </div>
            <div class="summary-item">
                <h3>Incorrect Answers</h3>
                <p>${incorrectAnswers}</p>
            </div>
            <div class="summary-item">
                <h3>Success Rate</h3>
                <p>${percentage}%</p>
            </div>
        `;
        results.insertBefore(summaryContainer, document.getElementById('score'));
        
        // Create pie chart
        const ctx = document.getElementById('resultsChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Correct', 'Incorrect'],
                datasets: [{
                    data: [correctAnswers, incorrectAnswers],
                    backgroundColor: [
                        'rgba(76, 175, 80, 0.8)',
                        'rgba(244, 67, 54, 0.8)'
                    ],
                    borderColor: [
                        'rgba(76, 175, 80, 1)',
                        'rgba(244, 67, 54, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            font: {
                                family: 'Inter',
                                size: 14
                            }
                        }
                    }
                }
            }
        });
    };
    document.head.appendChild(script);
    
    document.getElementById('score').textContent = `Score: ${score}/${questions.length}`;
    
    const explanationContainer = document.getElementById('explanation-container');
    questions.forEach((q, index) => {
        let answerText = '';
        if (q.type === 'ranking') {
            answerText = answers[index] ? 
                answers[index].map(i => q.options[i]).join(' → ') : 
                'Not answered';
            const correctOrder = q.correct.map(i => q.options[i]).join(' → ');
            explanationContainer.innerHTML += `
                <div class="explanation">
                    <h4>Question ${index + 1}</h4>
                    <p>${q.question}</p>
                    <p><strong>Your ranking:</strong> ${answerText}</p>
                    <p><strong>Correct ranking:</strong> ${correctOrder}</p>
                    <p><strong>Explanation:</strong> ${q.explanation}</p>
                </div>
            `;
        } else {
            answerText = answers[index] !== null ? q.options[answers[index]] : 'Not answered';
            explanationContainer.innerHTML += `
                <div class="explanation">
                    <h4>Question ${index + 1}</h4>
                    <p>${q.question}</p>
                    <p><strong>Your answer:</strong> ${answerText}</p>
                    <p><strong>Correct answer:</strong> ${q.options[q.correct]}</p>
                    <p><strong>Explanation:</strong> ${q.explanation}</p>
                </div>
            `;
        }
    });
}

// Event Listeners
document.getElementById('next-btn').addEventListener('click', nextQuestion);
document.getElementById('prev-btn').addEventListener('click', prevQuestion);

// Start the test
displayQuestion(0);
const timerInterval = setInterval(updateTimer, 1000); 
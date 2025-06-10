const questions = [
    {
        type: 'sequence',
        diagram: `
            <div class="sequence">
                <div class="box">□</div>
                <div class="box">◇</div>
                <div class="box">□</div>
                <div class="box">◇</div>
                <div class="box">?</div>
            </div>
        `,
        question: "What shape comes next in this sequence?",
        options: ["□", "◇", "△", "○"],
        correct: 0,
        explanation: "The sequence alternates between a square (□) and a diamond (◇). The next shape should be a square (□)."
    },
    {
        type: 'transformation',
        diagram: `
            <div class="transformation">
                <div class="box">□ → ◇</div>
                <div class="box">◇ → △</div>
                <div class="box">△ → □</div>
                <div class="box">◇ → ?</div>
            </div>
        `,
        question: "What is the result of transforming the diamond (◇)?",
        options: ["△", "□", "◇", "○"],
        correct: 0,
        explanation: "The transformation follows a cycle: square (□) becomes diamond (◇), diamond (◇) becomes triangle (△), and triangle (△) becomes square (□)."
    },
    {
        type: 'matrix',
        diagram: `
            <div class="matrix">
                <div class="row">
                    <div class="box">□</div>
                    <div class="box">◇</div>
                    <div class="box">□</div>
                </div>
                <div class="row">
                    <div class="box">◇</div>
                    <div class="box">□</div>
                    <div class="box">◇</div>
                </div>
                <div class="row">
                    <div class="box">□</div>
                    <div class="box">◇</div>
                    <div class="box">?</div>
                </div>
            </div>
        `,
        question: "What shape should replace the question mark?",
        options: ["□", "◇", "△", "○"],
        correct: 0,
        explanation: "The pattern alternates between square (□) and diamond (◇) in both rows and columns. The missing shape should be a square (□)."
    },
    {
        type: 'analogy',
        diagram: `
            <div class="analogy">
                <div class="pair">
                    <div class="box">□</div>
                    <div class="box">◇</div>
                </div>
                <div class="pair">
                    <div class="box">△</div>
                    <div class="box">?</div>
                </div>
            </div>
        `,
        question: "What shape completes the analogy?",
        options: ["□", "◇", "△", "○"],
        correct: 0,
        explanation: "The shapes are being rotated 45 degrees clockwise. Square (□) becomes diamond (◇), so triangle (△) should become square (□)."
    },
    {
        type: 'pattern',
        diagram: `
            <div class="pattern">
                <div class="box">□ → ◇ → △ → □ → ?</div>
            </div>
        `,
        question: "What shape comes next in this sequence?",
        options: ["◇", "△", "□", "○"],
        correct: 0,
        explanation: "The sequence follows a pattern of rotating shapes 45 degrees clockwise: square (□) → diamond (◇) → triangle (△) → square (□) → diamond (◇)."
    }
];

let currentQuestion = 0;
let answers = [];
let timeLeft = 30 * 60; // 30 minutes in seconds
let timerInterval;

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = `Time Remaining: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (timeLeft <= 0) {
        endTest();
    } else {
        timeLeft--;
    }
}

function displayQuestion() {
    const question = questions[currentQuestion];
    const questionContent = document.querySelector('.question-content');
    
    // Update diagram
    const diagramContainer = questionContent.querySelector('.diagram-container');
    diagramContainer.innerHTML = question.diagram;
    
    // Update question text
    const questionText = questionContent.querySelector('.question-text');
    questionText.textContent = question.question;
    
    // Update options
    const optionsContainer = questionContent.querySelector('.options');
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        if (answers[currentQuestion] === index) {
            optionElement.classList.add('selected');
        }
        optionElement.textContent = option;
        optionElement.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(optionElement);
    });
    
    // Update progress
    const progress = (currentQuestion / questions.length) * 100;
    document.querySelector('.progress').style.width = `${progress}%`;
    
    // Update navigation buttons
    document.querySelector('.back-button').disabled = currentQuestion === 0;
    document.querySelector('.next-button').textContent = currentQuestion === questions.length - 1 ? 'Finish' : 'Next';
}

function selectAnswer(index) {
    answers[currentQuestion] = index;
    const options = document.querySelectorAll('.option');
    options.forEach((option, i) => {
        option.classList.toggle('selected', i === index);
    });
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        displayQuestion();
    } else {
        endTest();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
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
        return acc + (answer === questions[index].correct ? 1 : 0);
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
                        'rgba(244, 67, 54, 1)
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
        const answerText = answers[index] !== null ? q.options[answers[index]] : 'Not answered';
        explanationContainer.innerHTML += `
            <div class="explanation">
                <h4>Question ${index + 1}</h4>
                <div class="diagram-container">${q.diagram}</div>
                <p><strong>Question:</strong> ${q.question}</p>
                <p><strong>Your answer:</strong> ${answerText}</p>
                <p><strong>Correct answer:</strong> ${q.options[q.correct]}</p>
                <p><strong>Explanation:</strong> ${q.explanation}</p>
            </div>
        `;
    });
}

function restartTest() {
    currentQuestion = 0;
    answers = [];
    timeLeft = 30 * 60;
    document.getElementById('timer').style.display = 'block';
    document.getElementById('test-container').style.display = 'block';
    document.querySelector('.navigation').style.display = 'flex';
    document.getElementById('results').style.display = 'none';
    document.getElementById('explanation-container').innerHTML = '';
    displayQuestion();
    timerInterval = setInterval(updateTimer, 1000);
}

// Initialize the test
displayQuestion();
timerInterval = setInterval(updateTimer, 1000); 
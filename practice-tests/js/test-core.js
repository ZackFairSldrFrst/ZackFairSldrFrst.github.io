class TestCore {
    constructor(config) {
        this.questions = config.questions;
        this.timeLimit = config.timeLimit || 30 * 60; // Default 30 minutes
        this.currentQuestion = 0;
        this.userAnswers = new Array(this.questions.length).fill(null);
        this.timeLeft = this.timeLimit;
        this.timerInterval = null;
        
        // Initialize UI elements
        this.questionContainer = document.getElementById('questionContainer');
        this.timer = document.getElementById('timer');
        this.progressBar = document.querySelector('.progress');
        this.navigation = document.querySelector('.navigation');
        this.results = document.getElementById('results');
        this.prevButton = document.getElementById('prevButton');
        this.nextButton = document.getElementById('nextButton');
        
        // Bind methods
        this.updateTimer = this.updateTimer.bind(this);
        this.displayQuestion = this.displayQuestion.bind(this);
        this.selectAnswer = this.selectAnswer.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.prevQuestion = this.prevQuestion.bind(this);
        this.endTest = this.endTest.bind(this);
        this.restartTest = this.restartTest.bind(this);
        
        // Initialize event listeners
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        this.prevButton.addEventListener('click', this.prevQuestion);
        this.nextButton.addEventListener('click', this.nextQuestion);
    }
    
    updateTimer() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timer.textContent = `Time Remaining: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (this.timeLeft <= 0) {
            this.endTest();
        } else {
            this.timeLeft--;
        }
    }
    
    displayQuestion() {
        const question = this.questions[this.currentQuestion];
        this.questionContainer.innerHTML = `
            <div class="question-content">
                ${question.passage ? `<div class="passage">${question.passage}</div>` : ''}
                ${question.scenario ? `<div class="scenario">${question.scenario}</div>` : ''}
                ${question.diagram ? `<div class="diagram-container">${question.diagram}</div>` : ''}
                <div class="question-text">${question.question}</div>
                <div class="options">
                    ${question.options.map((option, index) => `
                        <div class="option" onclick="testCore.selectAnswer(${index})">
                            ${option}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        this.updateProgress();
    }
    
    selectAnswer(index) {
        const options = document.querySelectorAll('.option');
        options.forEach(option => option.classList.remove('selected'));
        options[index].classList.add('selected');
        
        this.userAnswers[this.currentQuestion] = index;
        this.nextButton.disabled = false;
    }
    
    updateProgress() {
        const progress = (this.currentQuestion / this.questions.length) * 100;
        this.progressBar.style.width = `${progress}%`;
    }
    
    nextQuestion() {
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.displayQuestion();
            this.prevButton.disabled = false;
            if (this.currentQuestion === this.questions.length - 1) {
                this.nextButton.textContent = 'Finish';
            }
        } else {
            this.endTest();
        }
    }
    
    prevQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.displayQuestion();
            this.nextButton.textContent = 'Next';
            if (this.currentQuestion === 0) {
                this.prevButton.disabled = true;
            }
        }
    }
    
    endTest() {
        clearInterval(this.timerInterval);
        this.timer.style.display = 'none';
        this.questionContainer.style.display = 'none';
        this.navigation.style.display = 'none';
        this.results.style.display = 'block';
        
        let score = 0;
        let explanations = [];
        
        this.questions.forEach((question, index) => {
            if (this.userAnswers[index] === question.correctAnswer) {
                score++;
            }
            explanations.push({
                question: question.question,
                userAnswer: question.options[this.userAnswers[index]],
                correctAnswer: question.options[question.correctAnswer],
                explanation: question.explanation,
                isCorrect: this.userAnswers[index] === question.correctAnswer
            });
        });
        
        const percentage = (score / this.questions.length) * 100;
        
        this.results.innerHTML = `
            <h2>Test Results</h2>
            <div id="score">Your Score: ${score}/${this.questions.length} (${percentage.toFixed(1)}%)</div>
            <div class="results-chart">
                <canvas id="resultsChart"></canvas>
            </div>
            <div class="results-summary">
                <div class="summary-item">
                    <h3>Correct Answers</h3>
                    <p>${score}</p>
                </div>
                <div class="summary-item">
                    <h3>Incorrect Answers</h3>
                    <p>${this.questions.length - score}</p>
                </div>
                <div class="summary-item">
                    <h3>Accuracy</h3>
                    <p>${percentage.toFixed(1)}%</p>
                </div>
            </div>
            <div class="explanations">
                ${explanations.map((exp, index) => `
                    <div class="explanation">
                        <h4>Question ${index + 1}</h4>
                        <p><strong>Your answer:</strong> ${exp.userAnswer}</p>
                        <p><strong>Correct answer:</strong> ${exp.correctAnswer}</p>
                        <p>${exp.explanation}</p>
                    </div>
                `).join('')}
            </div>
            <button class="restart-button" onclick="testCore.restartTest()">Restart Test</button>
        `;
        
        // Create pie chart
        const ctx = document.getElementById('resultsChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Correct', 'Incorrect'],
                datasets: [{
                    data: [score, this.questions.length - score],
                    backgroundColor: ['#40c057', '#fa5252']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    restartTest() {
        // Reset test state
        this.currentQuestion = 0;
        this.userAnswers = new Array(this.questions.length).fill(null);
        
        // Reset timer
        this.timeLeft = this.timeLimit;
        this.updateTimer();
        this.timer.style.display = 'block';
        
        // Show question container and navigation
        this.questionContainer.style.display = 'block';
        this.navigation.style.display = 'flex';
        
        // Hide results
        this.results.style.display = 'none';
        
        // Reset progress bar
        this.updateProgress();
        
        // Display first question
        this.displayQuestion();
        
        // Reset navigation buttons
        this.prevButton.disabled = true;
        this.nextButton.disabled = true;
        
        // Start timer
        this.timerInterval = setInterval(this.updateTimer, 1000);
    }
    
    start() {
        this.displayQuestion();
        this.updateProgress();
        this.timerInterval = setInterval(this.updateTimer, 1000);
    }
} 
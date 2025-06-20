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
        this.selectMostLeast = this.selectMostLeast.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragOver = this.handleDragOver.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
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
        let optionsHtml = '';
        
        if (question.type === 'most-least') {
            optionsHtml = `
                <div class="options most-least">
                    ${question.options.map((option, index) => `
                        <div class="option" data-index="${index}">
                            <div class="option-content">${option}</div>
                            <div class="option-buttons">
                                <button class="most-btn" onclick="testCore.selectMostLeast(${index}, 'most')">Most Likely</button>
                                <button class="least-btn" onclick="testCore.selectMostLeast(${index}, 'least')">Least Likely</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (question.type === 'ranking') {
            optionsHtml = `
                <div class="options ranking">
                    ${question.options.map((option, index) => `
                        <div class="option" draggable="true" data-index="${index}">
                            <div class="rank-number">${index + 1}</div>
                            <div class="option-content">${option}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            optionsHtml = `
                <div class="options">
                    ${question.options.map((option, index) => `
                        <div class="option" onclick="testCore.selectAnswer(${index})">
                            ${option}
                        </div>
                    `).join('')}
                </div>
            `;
        }

        this.questionContainer.innerHTML = `
            <div class="question-content">
                ${question.passage ? `<div class="passage">${question.passage}</div>` : ''}
                ${question.scenario ? `<div class="scenario">${question.scenario}</div>` : ''}
                ${question.diagram ? `<div class="diagram-container">${question.diagram}</div>` : ''}
                <div class="question-text">${question.question}</div>
                ${question.image ? `<div class="question-image"><img src="images/${question.image}" alt="Question illustration" loading="lazy"></div>` : ''}
                ${optionsHtml}
            </div>
        `;

        if (question.type === 'ranking') {
            this.initializeDragAndDrop();
        }
        
        this.updateProgress();
    }
    
    selectAnswer(index) {
        const options = document.querySelectorAll('.option');
        options.forEach(option => option.classList.remove('selected'));
        options[index].classList.add('selected');
        
        this.userAnswers[this.currentQuestion] = index;
        this.nextButton.disabled = false;
    }
    
    selectMostLeast(index, type) {
        const option = document.querySelector(`.option[data-index="${index}"]`);
        const mostBtn = option.querySelector('.most-btn');
        const leastBtn = option.querySelector('.least-btn');
        
        // If selecting most likely
        if (type === 'most') {
            // If this option was previously selected as least likely, remove that selection
            if (this.userAnswers[this.currentQuestion]?.least === index) {
                const prevLeastOption = document.querySelector(`.option[data-index="${index}"]`);
                prevLeastOption.querySelector('.least-btn').classList.remove('selected');
                this.userAnswers[this.currentQuestion].least = null;
            }
            
            // Remove most likely selection from any other option
            document.querySelectorAll('.most-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Select this option as most likely
            mostBtn.classList.add('selected');
            leastBtn.classList.remove('selected');
        }
        // If selecting least likely
        else {
            // If this option was previously selected as most likely, remove that selection
            if (this.userAnswers[this.currentQuestion]?.most === index) {
                const prevMostOption = document.querySelector(`.option[data-index="${index}"]`);
                prevMostOption.querySelector('.most-btn').classList.remove('selected');
                this.userAnswers[this.currentQuestion].most = null;
            }
            
            // Remove least likely selection from any other option
            document.querySelectorAll('.least-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Select this option as least likely
            leastBtn.classList.add('selected');
            mostBtn.classList.remove('selected');
        }
        
        // Initialize the answer object if it doesn't exist
        if (!this.userAnswers[this.currentQuestion]) {
            this.userAnswers[this.currentQuestion] = { most: null, least: null };
        }
        
        // Update the answer
        this.userAnswers[this.currentQuestion][type] = index;
        
        // Enable next button if both most and least are selected
        if (this.userAnswers[this.currentQuestion].most !== null && 
            this.userAnswers[this.currentQuestion].least !== null) {
            this.nextButton.disabled = false;
        }
    }
    
    initializeDragAndDrop() {
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            option.addEventListener('dragstart', this.handleDragStart);
            option.addEventListener('dragover', this.handleDragOver);
            option.addEventListener('drop', this.handleDrop);
        });
    }
    
    handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.index);
        e.target.classList.add('dragging');
    }
    
    handleDragOver(e) {
        e.preventDefault();
    }
    
    handleDrop(e) {
        e.preventDefault();
        const draggedIndex = e.dataTransfer.getData('text/plain');
        const targetIndex = e.target.closest('.option').dataset.index;
        
        if (draggedIndex !== targetIndex) {
            const options = Array.from(document.querySelectorAll('.option'));
            const draggedOption = options[draggedIndex];
            const targetOption = options[targetIndex];
            
            // Swap the options
            const tempContent = draggedOption.innerHTML;
            draggedOption.innerHTML = targetOption.innerHTML;
            targetOption.innerHTML = tempContent;
            
            // Update the data-index attributes
            draggedOption.dataset.index = targetIndex;
            targetOption.dataset.index = draggedIndex;
            
            // Update the rank numbers
            options.forEach((option, index) => {
                option.querySelector('.rank-number').textContent = index + 1;
            });
            
            // Store the new order
            this.userAnswers[this.currentQuestion] = options.map(option => 
                parseInt(option.dataset.index)
            );
            
            this.nextButton.disabled = false;
        }
        
        e.target.classList.remove('dragging');
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
            const userAnswer = this.userAnswers[index];
            const isCorrect = Array.isArray(question.correctAnswer) 
                ? JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer)
                : JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer);
            
            if (isCorrect) {
                score++;
            }
            
            let userAnswerText;
            if (question.type === 'most-least') {
                const mostOption = userAnswer?.most !== undefined ? question.options[userAnswer.most] : 'Not selected';
                const leastOption = userAnswer?.least !== undefined ? question.options[userAnswer.least] : 'Not selected';
                userAnswerText = `Most Likely: ${mostOption}<br>Least Likely: ${leastOption}`;
            } else if (question.type === 'ranking') {
                userAnswerText = userAnswer ? userAnswer.map(i => question.options[i]).join('<br>') : 'Not ranked';
            } else {
                userAnswerText = userAnswer !== null ? question.options[userAnswer] : 'Not selected';
            }
            
            let correctAnswerText;
            if (question.type === 'most-least') {
                const mostOption = question.options[question.correctAnswer.most];
                const leastOption = question.options[question.correctAnswer.least];
                correctAnswerText = `Most Likely: ${mostOption}<br>Least Likely: ${leastOption}`;
            } else if (question.type === 'ranking') {
                correctAnswerText = question.correctAnswer.map(i => question.options[i]).join('<br>');
            } else {
                correctAnswerText = question.options[question.correctAnswer];
            }
            
            explanations.push({
                question: question.question,
                userAnswer: userAnswerText,
                correctAnswer: correctAnswerText,
                explanation: question.explanation,
                isCorrect: isCorrect
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
                    <div class="explanation ${exp.isCorrect ? 'correct' : 'incorrect'}">
                        <h4>Question ${index + 1}</h4>
                        <p><strong>Your answer:</strong><br>${exp.userAnswer}</p>
                        <p><strong>Correct answer:</strong><br>${exp.correctAnswer}</p>
                        <p><strong>Explanation:</strong><br>${exp.explanation}</p>
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
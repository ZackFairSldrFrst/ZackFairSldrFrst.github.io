const questions = [
    {
        type: 'multiple-choice',
        passage: "The music industry continues to be one of the fastest growing sectors of the British economy. This trend can be traced to the large range of media available, such as concerts and downloads, and the wide ranging target audience. For example, the music industry confidently boasts to be the only form of media enjoyed by both the youngest and oldest individuals in society.\n\nIn comparison, forms of media, such as gaming, are enjoyed by a marginal sector of society. However, statistics suggest that not all forms of music are enjoying this boom. Sales figures for operatic music continue to decrease steadily. In this way, it is feared that the dominance of the music industry, catering to popular culture, comes at the expense of long-standing art forms.",
        question: "Based on the passage, which of the following is true about the music industry?",
        options: [
            "It caters to a wide target audience.",
            "It is enjoyed by a marginal sector of society.",
            "It is a long-standing art form.",
            "Operatic music is finally dying out."
        ],
        correct: 0,
        explanation: "The passage states that the music industry is the fastest growing sector of the economy because it is enjoyed by both the youngest and oldest individuals in society. This suggests that it is enjoyed by a wide ranging target audience. Option 1 is the correct answer."
    },
    {
        type: 'multiple-choice',
        passage: "'Dumbards' champagne house, a company based in the south of France, employs local workers only. The reason behind this policy is that Dumbards promote their products as home-crafted, 'lovingly-made'. They believe that by employing local workers, their products appear more exclusive, and therefore, more expensive. In recruiting its workers, Dumbards place advertisements in the local newspaper and shop windows. They are heavily sceptical about the internet and refuse to advertise on it.\n\nAnother way in which Dumbards recruit their staff is via recommendations from current employees. In September last year, the company was taken over by an American businessman who is keen to rebrand the company. He wants Dumbards to be more metropolitan and intends to open the selection process to workers from other EU countries. This idea has been controversial and may lead to strike action by current employees.",
        question: "According to the passage, why does Dumbards only employ local workers?",
        options: [
            "Dumbards employ local workers as it is cheaper",
            "Dumbards refuse to use internet advertising due to bad experiences",
            "Dumbards rely exclusively on recommendations from current employees",
            "Dumbards only employ local workers to appear exclusive"
        ],
        correct: 3,
        explanation: "The passage identifies that 'Dumbards' only select local employees as it wishes to appear 'exclusive'."
    },
    {
        type: 'multiple-choice',
        passage: "The colour of a product's packaging often denotes what is inside of it. The most common example of this can be seen in the flavours of crisps. For example, the colour red commonly denotes ready salted whereas blue is often cheese and onion. The colour coding of product packaging can also be seen in cleaning products, with lemon yellow packaging or apple green.\n\nIn addition to the packaging of products, the choice of colour can also represent emotion (with red as sensual, or black for mourning), instructions (such as green for go), and gender (with blue and pink). In this way, the colour of the world around us can often be a helpful message. However, these 'colour codes' are often dependent on a particular culture they are formed in and may not be universal.",
        question: "Which of the following statements is incorrect?",
        options: [
            "The colour of packaging can indicate what the product is.",
            "The product's packaging colour may depend on culture",
            "The colour of a product's packaging tends to be universal.",
            "Colour coding is seen in foods, cleaning products and traffic signals."
        ],
        correct: 2,
        explanation: "The question asked you to identify which of the statements is incorrect, in other words, false. The passage identifies that the colouring of a product's packaging may be culturally dependent and are, therefore, not always universal. For this reason, this statement is incorrect. Based on the nature of the question, option c is the right answer."
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

function displayQuestion() {
    const question = questions[currentQuestion];
    const questionContainer = document.getElementById('questionContainer');
    
    questionContainer.innerHTML = `
        <div class="question-content">
            ${question.passage ? `<div class="passage">${question.passage}</div>` : ''}
            <div class="question-text">${question.question}</div>
            <div class="options">
                ${question.options.map((option, index) => `
                    <div class="option" onclick="selectAnswer(${index})">
                        ${option}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    updateProgress();
}

function selectAnswer(index) {
    const options = document.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected'));
    options[index].classList.add('selected');
    
    answers[currentQuestion] = index;
    document.getElementById('nextButton').disabled = false;
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        displayQuestion();
        document.getElementById('prev-btn').disabled = false;
        if (currentQuestion === questions.length - 1) {
            document.getElementById('next-btn').textContent = 'Finish';
        }
    } else {
        endTest();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
        document.getElementById('next-btn').textContent = 'Next';
        if (currentQuestion === 0) {
            document.getElementById('prev-btn').disabled = true;
        }
    }
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
}

function endTest() {
    clearInterval(timerInterval);
    document.getElementById('timer').style.display = 'none';
    const questionContainer = document.getElementById('questionContainer');
    const navigation = document.querySelector('.navigation');
    const results = document.getElementById('results');
    
    questionContainer.style.display = 'none';
    navigation.style.display = 'none';
    results.style.display = 'block';
    
    let score = 0;
    let explanations = [];
    
    questions.forEach((question, index) => {
        if (answers[index] === question.correct) {
            score++;
        }
        explanations.push({
            question: question.question,
            userAnswer: question.options[answers[index]],
            correctAnswer: question.options[question.correct],
            explanation: question.explanation,
            isCorrect: answers[index] === question.correct
        });
    });
    
    const percentage = (score / questions.length) * 100;
    
    results.innerHTML = `
        <h2>Test Results</h2>
        <div id="score">Your Score: ${score}/${questions.length} (${percentage.toFixed(1)}%)</div>
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
                <p>${questions.length - score}</p>
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
        <button class="restart-button" onclick="restartTest()">Restart Test</button>
    `;
    
    // Create pie chart
    const ctx = document.getElementById('resultsChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Correct', 'Incorrect'],
            datasets: [{
                data: [score, questions.length - score],
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

// Initialize the test
displayQuestion();
updateProgress();

// Set up event listeners
document.getElementById('prev-btn').addEventListener('click', prevQuestion);
document.getElementById('next-btn').addEventListener('click', nextQuestion);

// Start the timer
const timerInterval = setInterval(updateTimer, 1000); 
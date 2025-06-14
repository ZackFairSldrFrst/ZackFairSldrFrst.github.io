const testConfig = {
    title: "SJ-01: Customer Service & Teamwork",
    description: "Real-world scenarios from hospitality, sales, energy, and telecommunications sectors",
    timeLimit: 30,
    questions: [
        // Superluxe Hotels Scenario
        {
            passage: "You are a front desk manager at Superluxe Hotels, a high-end hotel chain. A guest approaches the front desk, visibly upset, complaining about noise from a renovation project in the room next to theirs. The guest demands an immediate room change, but the hotel is fully booked due to a major conference. The renovation is necessary maintenance that cannot be postponed, and the guest paid a premium rate for their current room.",
            question: "What is the most effective response in this situation?",
            options: [
                "Explain that the hotel is fully booked and they must stay in their current room",
                "Offer a partial refund and explain the situation while maintaining professionalism",
                "Immediately move them to a staff room temporarily",
                "Tell them to call the general manager to complain"
            ],
            correctAnswer: 1,
            explanation: "The most effective response is to acknowledge the guest's concerns, explain the situation professionally, and offer a partial refund as compensation. This shows empathy while maintaining the hotel's standards and finding a practical solution."
        },
        {
            passage: "You are a front desk manager at Superluxe Hotels, a high-end hotel chain. A guest approaches the front desk, visibly upset, complaining about noise from a renovation project in the room next to theirs. The guest demands an immediate room change, but the hotel is fully booked due to a major conference. The renovation is necessary maintenance that cannot be postponed, and the guest paid a premium rate for their current room.",
            question: "What is the least effective response in this situation?",
            options: [
                "Listen to the guest's concerns and offer a partial refund",
                "Explain the situation and offer alternative solutions",
                "Tell them to call the general manager to complain",
                "Apologize and offer a complimentary service"
            ],
            correctAnswer: 2,
            explanation: "Passing the complaint to the general manager is the least effective response as it shows a lack of initiative and problem-solving skills. A front desk manager should handle such situations directly."
        },
        {
            passage: "You are a front desk manager at Superluxe Hotels, a high-end hotel chain. A guest approaches the front desk, visibly upset, complaining about noise from a renovation project in the room next to theirs. The guest demands an immediate room change, but the hotel is fully booked due to a major conference. The renovation is necessary maintenance that cannot be postponed, and the guest paid a premium rate for their current room.",
            question: "Which competency is most important in handling this situation?",
            options: [
                "Technical knowledge of hotel operations",
                "Customer service and conflict resolution",
                "Financial management",
                "Staff supervision"
            ],
            correctAnswer: 1,
            explanation: "Customer service and conflict resolution are the most important competencies in this situation, as it requires handling a difficult customer interaction while maintaining professionalism and finding a satisfactory solution."
        },
        {
            passage: "You are a front desk manager at Superluxe Hotels, a high-end hotel chain. A guest approaches the front desk, visibly upset, complaining about noise from a renovation project in the room next to theirs. The guest demands an immediate room change, but the hotel is fully booked due to a major conference. The renovation is necessary maintenance that cannot be postponed, and the guest paid a premium rate for their current room.",
            question: "What would be the best long-term solution to prevent similar situations?",
            options: [
                "Stop all renovations during peak season",
                "Implement a policy of informing guests about ongoing renovations",
                "Increase room rates to cover potential refunds",
                "Hire more staff to handle complaints"
            ],
            correctAnswer: 1,
            explanation: "Implementing a policy of informing guests about ongoing renovations is the best long-term solution as it sets proper expectations and allows guests to make informed decisions about their stay."
        },
        // Handy Goods Ltd. Scenario
        {
            passage: "You are a sales manager at Handy Goods Ltd., a home improvement retailer. Your team has been underperforming for the last quarter, with sales 15% below target. The team consists of experienced salespeople who have previously met their targets. You've noticed that team morale is low, and there's been some tension between team members.",
            question: "What is the most effective first step to address this situation?",
            options: [
                "Implement stricter sales targets and monitoring",
                "Hold individual meetings to understand each team member's perspective",
                "Reorganize the team structure",
                "Offer financial incentives for better performance"
            ],
            correctAnswer: 1,
            explanation: "Holding individual meetings to understand each team member's perspective is the most effective first step as it helps identify the root causes of the performance issues and shows that you value their input."
        },
        {
            passage: "You are a sales manager at Handy Goods Ltd., a home improvement retailer. Your team has been underperforming for the last quarter, with sales 15% below target. The team consists of experienced salespeople who have previously met their targets. You've noticed that team morale is low, and there's been some tension between team members.",
            question: "What is the least effective approach to improve team performance?",
            options: [
                "Address interpersonal conflicts within the team",
                "Implement stricter sales targets and monitoring",
                "Provide additional training and support",
                "Recognize and reward good performance"
            ],
            correctAnswer: 1,
            explanation: "Implementing stricter sales targets and monitoring is the least effective approach as it may further demotivate the team and not address the underlying issues causing the performance problems."
        },
        {
            passage: "You are a sales manager at Handy Goods Ltd., a home improvement retailer. Your team has been underperforming for the last quarter, with sales 15% below target. The team consists of experienced salespeople who have previously met their targets. You've noticed that team morale is low, and there's been some tension between team members.",
            question: "Which leadership style would be most effective in this situation?",
            options: [
                "Autocratic leadership",
                "Democratic leadership",
                "Laissez-faire leadership",
                "Transactional leadership"
            ],
            correctAnswer: 1,
            explanation: "Democratic leadership would be most effective as it involves the team in decision-making, builds trust, and helps address the underlying issues affecting performance."
        },
        {
            passage: "You are a sales manager at Handy Goods Ltd., a home improvement retailer. Your team has been underperforming for the last quarter, with sales 15% below target. The team consists of experienced salespeople who have previously met their targets. You've noticed that team morale is low, and there's been some tension between team members.",
            question: "What would be the best way to measure improvement in team performance?",
            options: [
                "Focus only on sales numbers",
                "Track both sales numbers and team morale",
                "Compare performance with other teams",
                "Set new, higher targets"
            ],
            correctAnswer: 1,
            explanation: "Tracking both sales numbers and team morale is the best way to measure improvement as it provides a comprehensive view of the team's progress and ensures sustainable performance improvement."
        },
        // Greenwinds Energy Scenario
        {
            passage: "You are a team leader at Greenwinds Energy, a renewable energy company. Your team is responsible for installing solar panels in residential properties. A customer has complained about the quality of the installation, citing poor workmanship and delays. The customer is demanding a full refund and removal of the system.",
            question: "What is the most effective first response to the customer's complaint?",
            options: [
                "Immediately offer a full refund",
                "Listen to the customer's concerns and gather all relevant information",
                "Defend the team's work and explain the delays",
                "Refer the complaint to senior management"
            ],
            correctAnswer: 1,
            explanation: "Listening to the customer's concerns and gathering all relevant information is the most effective first response as it shows respect for the customer's experience and helps identify the specific issues that need to be addressed."
        },
        {
            passage: "You are a team leader at Greenwinds Energy, a renewable energy company. Your team is responsible for installing solar panels in residential properties. A customer has complained about the quality of the installation, citing poor workmanship and delays. The customer is demanding a full refund and removal of the system.",
            question: "What is the least effective approach to resolve this situation?",
            options: [
                "Conduct a thorough investigation of the installation",
                "Defend the team's work and explain the delays",
                "Offer to fix any issues identified",
                "Provide regular updates to the customer"
            ],
            correctAnswer: 1,
            explanation: "Defending the team's work and explaining the delays is the least effective approach as it may appear dismissive of the customer's concerns and could escalate the situation."
        },
        {
            passage: "You are a team leader at Greenwinds Energy, a renewable energy company. Your team is responsible for installing solar panels in residential properties. A customer has complained about the quality of the installation, citing poor workmanship and delays. The customer is demanding a full refund and removal of the system.",
            question: "Which quality management principle is most relevant to this situation?",
            options: [
                "Cost reduction",
                "Customer focus",
                "Process automation",
                "Employee training"
            ],
            correctAnswer: 1,
            explanation: "Customer focus is the most relevant quality management principle in this situation as it emphasizes understanding and meeting customer requirements and expectations."
        },
        {
            passage: "You are a team leader at Greenwinds Energy, a renewable energy company. Your team is responsible for installing solar panels in residential properties. A customer has complained about the quality of the installation, citing poor workmanship and delays. The customer is demanding a full refund and removal of the system.",
            question: "What would be the best way to prevent similar issues in the future?",
            options: [
                "Increase the number of installations per day",
                "Implement a quality control checklist and regular team training",
                "Reduce the price of installations",
                "Hire more team members"
            ],
            correctAnswer: 1,
            explanation: "Implementing a quality control checklist and regular team training is the best way to prevent similar issues as it ensures consistent quality and helps identify potential problems before they affect customers."
        },
        // JoinedUp Scenario
        {
            passage: "You are a customer service representative at JoinedUp, a telecommunications company. A customer calls to cancel their service due to poor network coverage in their area. The customer has been with the company for five years and has always paid on time. They mention that a competitor is offering better coverage in their area.",
            question: "What is the most effective response to the customer's request?",
            options: [
                "Process the cancellation immediately",
                "Acknowledge their concerns and explore retention options",
                "Explain that network coverage will improve soon",
                "Transfer them to the sales department"
            ],
            correctAnswer: 1,
            explanation: "Acknowledging their concerns and exploring retention options is the most effective response as it shows respect for their loyalty and may lead to a mutually beneficial solution."
        },
        {
            passage: "You are a customer service representative at JoinedUp, a telecommunications company. A customer calls to cancel their service due to poor network coverage in their area. The customer has been with the company for five years and has always paid on time. They mention that a competitor is offering better coverage in their area.",
            question: "What is the least effective approach to handle this situation?",
            options: [
                "Listen to the customer's concerns",
                "Process the cancellation immediately",
                "Offer alternative solutions",
                "Document the feedback for improvement"
            ],
            correctAnswer: 1,
            explanation: "Processing the cancellation immediately is the least effective approach as it doesn't attempt to understand the customer's needs or explore potential solutions to retain their business."
        },
        {
            passage: "You are a customer service representative at JoinedUp, a telecommunications company. A customer calls to cancel their service due to poor network coverage in their area. The customer has been with the company for five years and has always paid on time. They mention that a competitor is offering better coverage in their area.",
            question: "Which customer service skill is most important in this situation?",
            options: [
                "Technical knowledge of the network",
                "Active listening and problem-solving",
                "Sales techniques",
                "Data entry skills"
            ],
            correctAnswer: 1,
            explanation: "Active listening and problem-solving are the most important skills in this situation as they help understand the customer's needs and find appropriate solutions."
        },
        {
            passage: "You are a customer service representative at JoinedUp, a telecommunications company. A customer calls to cancel their service due to poor network coverage in their area. The customer has been with the company for five years and has always paid on time. They mention that a competitor is offering better coverage in their area.",
            question: "What would be the best way to improve customer retention in similar situations?",
            options: [
                "Lower prices for all customers",
                "Implement a proactive network coverage monitoring system",
                "Increase marketing efforts",
                "Hire more customer service representatives"
            ],
            correctAnswer: 1,
            explanation: "Implementing a proactive network coverage monitoring system is the best way to improve retention as it helps identify and address coverage issues before they lead to customer dissatisfaction."
        }
    ]
};

let currentQuestion = 0;
let userAnswers = [];

function initTest() {
    displayCurrentQuestion();
    updateNavigation();
    
    // Add event listeners for navigation buttons
    document.getElementById('prev-button').addEventListener('click', () => navigate('prev'));
    document.getElementById('next-button').addEventListener('click', () => navigate('next'));
    document.getElementById('submit-button').addEventListener('click', calculateScore);
}

function displayCurrentQuestion() {
    const question = testConfig.questions[currentQuestion];
    document.getElementById('passage').textContent = question.passage;
    document.getElementById('question-text').textContent = question.question;
    
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.onclick = () => selectOption(index);
        optionsContainer.appendChild(optionElement);
    });
    
    updateNavigation();
}

function selectOption(index) {
    userAnswers[currentQuestion] = index;
    const options = document.getElementsByClassName('option');
    for (let i = 0; i < options.length; i++) {
        options[i].classList.remove('selected');
    }
    options[index].classList.add('selected');
    updateNavigation();
}

function navigate(direction) {
    if (direction === 'prev' && currentQuestion > 0) {
        currentQuestion--;
        displayCurrentQuestion();
    } else if (direction === 'next' && currentQuestion < testConfig.questions.length - 1) {
        currentQuestion++;
        displayCurrentQuestion();
    }
}

function updateNavigation() {
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const submitButton = document.getElementById('submit-button');
    
    prevButton.style.display = currentQuestion === 0 ? 'none' : 'block';
    nextButton.style.display = currentQuestion === testConfig.questions.length - 1 ? 'none' : 'block';
    submitButton.style.display = currentQuestion === testConfig.questions.length - 1 ? 'block' : 'none';
}

function calculateScore() {
    let score = 0;
    const results = [];
    
    testConfig.questions.forEach((question, index) => {
        const isCorrect = userAnswers[index] === question.correctAnswer;
        if (isCorrect) score++;
        
        results.push({
            question: question.question,
            userAnswer: question.options[userAnswers[index]],
            correctAnswer: question.options[question.correctAnswer],
            explanation: question.explanation,
            isCorrect: isCorrect
        });
    });
    
    displayResults(score, results);
}

function displayResults(score, results) {
    const container = document.querySelector('.question-container');
    container.innerHTML = `
        <div class="results">
            <h2>Test Results</h2>
            <p>Your score: ${score} out of ${testConfig.questions.length}</p>
            <div class="results-details">
                ${results.map((result, index) => `
                    <div class="result-item ${result.isCorrect ? 'correct' : 'incorrect'}">
                        <h3>Question ${index + 1}</h3>
                        <p><strong>Your answer:</strong> ${result.userAnswer}</p>
                        <p><strong>Correct answer:</strong> ${result.correctAnswer}</p>
                        <p><strong>Explanation:</strong> ${result.explanation}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Initialize the test when the page loads
window.onload = initTest; 
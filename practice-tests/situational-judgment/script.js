// Test configuration
const testConfig = {
    questions: [
        {
            scenario: "You are a team leader in a software development project. One of your team members, who is usually reliable, has been missing deadlines and producing subpar work for the past two weeks. The project timeline is tight, and their work is critical for the next phase.",
            question: "What is the most appropriate first step to address this situation?",
            options: [
                "Immediately report the team member to upper management",
                "Have a private conversation to understand what's causing the performance issues",
                "Reassign their tasks to other team members",
                "Send a formal warning email about their performance"
            ],
            correctAnswer: 1,
            explanation: "The most appropriate first step is to have a private conversation to understand the situation. This shows respect for the team member and allows you to gather information before taking any disciplinary action."
        },
        {
            scenario: "During a team meeting, a colleague presents an idea that you believe has significant flaws. The idea is well-received by others, and the team is moving forward with it.",
            question: "What is the best way to handle this situation?",
            options: [
                "Stay quiet to avoid conflict",
                "Publicly point out all the flaws in the idea",
                "Schedule a private meeting with the colleague to discuss your concerns",
                "Go directly to the manager to express your concerns"
            ],
            correctAnswer: 2,
            explanation: "Scheduling a private meeting allows you to express your concerns professionally while maintaining team harmony. This approach shows respect for your colleague and the team's decision-making process."
        },
        {
            scenario: "You discover that a client has been overcharged for services. The overcharge is significant but not immediately noticeable in the billing system.",
            question: "What should you do in this situation?",
            options: [
                "Ignore it since the client hasn't noticed",
                "Report it to your supervisor and suggest a refund",
                "Wait to see if the client complains",
                "Adjust future bills to compensate for the overcharge"
            ],
            correctAnswer: 1,
            explanation: "Reporting the overcharge to your supervisor and suggesting a refund is the most ethical approach. It demonstrates integrity and maintains trust with the client."
        },
        {
            scenario: "You're working on a group project with a tight deadline. One team member consistently arrives late to meetings and doesn't complete their assigned tasks on time.",
            question: "What is the most effective way to address this issue?",
            options: [
                "Complete their tasks yourself to meet the deadline",
                "Confront them aggressively in the next team meeting",
                "Have a one-on-one discussion about the impact of their behavior",
                "Complain about them to other team members"
            ],
            correctAnswer: 2,
            explanation: "Having a one-on-one discussion allows you to address the issue directly while maintaining professionalism. It gives the team member a chance to explain and improve their behavior."
        },
        {
            scenario: "You receive an email from a client requesting changes to a project that would require significant additional work. The changes are not covered in the current contract.",
            question: "What is the best way to respond to this request?",
            options: [
                "Immediately agree to make the changes to keep the client happy",
                "Ignore the request since it's not in the contract",
                "Respond professionally, explaining the situation and proposing a solution",
                "Forward the email to your manager without comment"
            ],
            correctAnswer: 2,
            explanation: "Responding professionally and proposing a solution shows that you value the client's needs while maintaining business boundaries. This approach can lead to a mutually beneficial resolution."
        }
    ],
    timeLimit: 30 * 60 // 30 minutes
};

// Initialize the test
const testCore = new TestCore(testConfig);
testCore.start(); 
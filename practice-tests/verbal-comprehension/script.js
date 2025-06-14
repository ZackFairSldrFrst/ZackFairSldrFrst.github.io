// Test configuration
const testConfig = {
    questions: [
        {
            passage: "The rapid advancement of artificial intelligence has sparked intense debate about its potential impact on society. Proponents argue that AI will revolutionize healthcare, transportation, and education, while critics express concerns about job displacement and privacy issues. The truth likely lies somewhere in between, as the technology's impact will depend largely on how it is developed and implemented.",
            question: "Based on the passage, what is the main point about AI's impact on society?",
            options: [
                "AI will have an entirely positive impact on society",
                "AI will have an entirely negative impact on society",
                "The impact of AI will depend on how it is used",
                "AI's impact is impossible to predict"
            ],
            correctAnswer: 2,
            explanation: "The passage suggests that AI's impact will depend on how it is developed and implemented, indicating that the outcome is not predetermined but rather contingent on human choices."
        },
        {
            passage: "Climate change is a complex issue that requires global cooperation. While some countries have made significant progress in reducing emissions, others continue to increase their carbon footprint. The challenge lies in balancing economic development with environmental protection, particularly in developing nations.",
            question: "What is the main challenge mentioned in the passage?",
            options: [
                "Reducing emissions in developed countries",
                "Achieving global cooperation",
                "Balancing economic and environmental concerns",
                "Measuring carbon footprint"
            ],
            correctAnswer: 2,
            explanation: "The passage specifically mentions the challenge of balancing economic development with environmental protection, particularly in developing nations."
        },
        {
            passage: "The human brain is remarkably plastic, meaning it can adapt and change throughout life. This neuroplasticity allows us to learn new skills, form memories, and recover from injuries. Recent research suggests that even in adulthood, the brain can form new neural connections in response to learning and experience.",
            question: "What does the passage suggest about brain development?",
            options: [
                "Brain development stops in adulthood",
                "The brain can change and adapt throughout life",
                "Only children's brains are plastic",
                "Brain plasticity is a myth"
            ],
            correctAnswer: 1,
            explanation: "The passage explicitly states that the brain can adapt and change throughout life, and that even in adulthood, new neural connections can form."
        },
        {
            passage: "The rise of remote work has transformed the traditional office environment. While some companies have embraced this change, others struggle to maintain productivity and company culture. The key to successful remote work lies in effective communication, clear expectations, and appropriate technology infrastructure.",
            question: "According to the passage, what is essential for successful remote work?",
            options: [
                "Having a large office space",
                "Working longer hours",
                "Effective communication and clear expectations",
                "Reducing employee benefits"
            ],
            correctAnswer: 2,
            explanation: "The passage specifically identifies effective communication, clear expectations, and appropriate technology infrastructure as key elements for successful remote work."
        },
        {
            passage: "The concept of sustainable development emphasizes meeting present needs without compromising the ability of future generations to meet their own needs. This requires careful consideration of economic, social, and environmental factors. While progress has been made, many challenges remain in achieving truly sustainable practices.",
            question: "What is the main goal of sustainable development?",
            options: [
                "Maximizing current economic growth",
                "Meeting present needs while preserving future capabilities",
                "Eliminating all environmental impact",
                "Focusing only on environmental protection"
            ],
            correctAnswer: 1,
            explanation: "The passage defines sustainable development as meeting present needs without compromising future generations' ability to meet their own needs."
        }
    ],
    timeLimit: 30 * 60 // 30 minutes
};

// Initialize the test
const testCore = new TestCore(testConfig);
testCore.start(); 
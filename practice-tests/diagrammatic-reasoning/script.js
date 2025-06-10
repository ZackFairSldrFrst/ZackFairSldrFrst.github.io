// Test configuration
const testConfig = {
    questions: [
        {
            diagram: "⬡ → ⬢ → ⬡ → ⬢ → ?",
            question: "What shape comes next in the sequence?",
            options: ["⬡", "⬢", "⬣", "⬠"],
            correctAnswer: 0,
            explanation: "The sequence alternates between hexagon (⬡) and pentagon (⬢). Since the last shape is a pentagon, the next shape should be a hexagon."
        },
        {
            diagram: "⬡ → ⬢ → ⬣ → ⬠ → ?",
            question: "What shape comes next in the sequence?",
            options: ["⬡", "⬢", "⬣", "⬠"],
            correctAnswer: 0,
            explanation: "The sequence cycles through all four shapes in order: hexagon, pentagon, triangle, and star. Since the last shape is a star, the next shape should be a hexagon to start the cycle again."
        },
        {
            diagram: "⬡ → ⬢ → ⬡ → ⬢ → ⬡ → ?",
            question: "What shape comes next in the sequence?",
            options: ["⬡", "⬢", "⬣", "⬠"],
            correctAnswer: 1,
            explanation: "The sequence alternates between hexagon and pentagon. Since the last shape is a hexagon, the next shape should be a pentagon."
        },
        {
            diagram: "⬡ → ⬢ → ⬣ → ⬠ → ⬡ → ?",
            question: "What shape comes next in the sequence?",
            options: ["⬡", "⬢", "⬣", "⬠"],
            correctAnswer: 1,
            explanation: "The sequence cycles through all four shapes in order: hexagon, pentagon, triangle, and star. Since the last shape is a hexagon, the next shape should be a pentagon."
        },
        {
            diagram: "⬡ → ⬢ → ⬡ → ⬢ → ⬡ → ⬢ → ?",
            question: "What shape comes next in the sequence?",
            options: ["⬡", "⬢", "⬣", "⬠"],
            correctAnswer: 0,
            explanation: "The sequence alternates between hexagon and pentagon. Since the last shape is a pentagon, the next shape should be a hexagon."
        }
    ],
    timeLimit: 30 * 60 // 30 minutes
};

// Initialize the test
const testCore = new TestCore(testConfig);
testCore.start(); 
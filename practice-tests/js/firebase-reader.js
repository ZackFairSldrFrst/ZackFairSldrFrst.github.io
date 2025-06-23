// Firebase Reader Utility for Practice Tests Hub
// This utility fetches published tests from Firebase Firestore

class FirebaseTestReader {
    constructor() {
        this.db = null;
        this.tests = [];
        this.categories = new Set();
        this.isInitialized = false;
        this.lastError = null;
    }

    async initialize() {
        try {
            // Import Firebase modules
            const { initializeApp } = await import('https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js');
            const { getFirestore, collection, getDocs, query, where, orderBy } = await import('https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js');
            
            // Firebase configuration
            const firebaseConfig = {
                apiKey: "AIzaSyBOK-IcRemZPwYoF5ig6NVFVM5XuWJ9X2k",
                authDomain: "alfred-practice-tests.firebaseapp.com",
                projectId: "alfred-practice-tests",
                storageBucket: "alfred-practice-tests.firebasestorage.app",
                messagingSenderId: "481648587020",
                appId: "1:481648587020:web:5e90ce4638989928415929",
                measurementId: "G-V7WDEW1QXK"
            };

            // Initialize Firebase
            const app = initializeApp(firebaseConfig);
            this.db = getFirestore(app);
            this.isInitialized = true;
            
            console.log('Firebase Test Reader initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize Firebase Test Reader:', error);
            return false;
        }
    }

    async loadAllTests() {
        if (!this.isInitialized) {
            this.lastError = 'Firebase Test Reader not initialized';
            console.error('Firebase Test Reader not initialized');
            return [];
        }

        try {
            // Clear any previous errors
            this.lastError = null;
            
            const { collection, getDocs, query, where, orderBy } = await import('https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js');
            
            console.log('Attempting to load tests from Firestore...');
            
            const testsRef = collection(this.db, 'tests');
            console.log('Collection reference created:', testsRef);
            
            // First, try to get all documents without filters to see if basic access works
            console.log('Testing basic collection access...');
            const basicQuerySnapshot = await getDocs(testsRef);
            console.log(`Basic query successful. Found ${basicQuerySnapshot.size} total documents`);
            
            // Now try the filtered query
            console.log('Attempting filtered query for published tests...');
            const publishedTestsQuery = query(
                testsRef, 
                where('status', '==', 'published'),
                orderBy('createdAt', 'desc')
            );
            
            const querySnapshot = await getDocs(publishedTestsQuery);
            this.tests = [];
            this.categories.clear();
            
            querySnapshot.forEach((doc) => {
                const testData = doc.data();
                testData.id = doc.id; // Add document ID
                this.tests.push(testData);
                this.categories.add(testData.category);
                console.log(`Loaded test: ${testData.title} (${testData.testCode})`);
            });
            
            console.log(`Successfully loaded ${this.tests.length} published tests`);
            return this.tests;
        } catch (error) {
            this.lastError = error.message;
            console.error('Failed to load tests from Firebase:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            console.error('Full error object:', error);
            
            // Provide more specific error information
            if (error.code === 'permission-denied') {
                console.error('🔒 Permission denied. Check Firestore security rules.');
                console.error('Make sure your security rules allow read access to the tests collection.');
            } else if (error.code === 'unavailable') {
                console.error('🌐 Service unavailable. Check your internet connection.');
            } else if (error.code === 'not-found') {
                console.error('📁 Collection not found. Make sure the tests collection exists.');
            }
            
            return [];
        }
    }

    async loadTestsByCategory(category) {
        if (!this.isInitialized) {
            console.error('Firebase Test Reader not initialized');
            return [];
        }

        try {
            const { collection, getDocs, query, where, orderBy } = await import('https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js');
            
            const testsRef = collection(this.db, 'tests');
            const categoryTestsQuery = query(
                testsRef, 
                where('status', '==', 'published'),
                where('category', '==', category),
                orderBy('createdAt', 'desc')
            );
            
            const querySnapshot = await getDocs(categoryTestsQuery);
            const categoryTests = [];
            
            querySnapshot.forEach((doc) => {
                const testData = doc.data();
                testData.id = doc.id;
                categoryTests.push(testData);
            });
            
            return categoryTests;
        } catch (error) {
            console.error(`Failed to load tests for category ${category}:`, error);
            return [];
        }
    }

    async getTestByCode(testCode) {
        if (!this.isInitialized) {
            console.error('Firebase Test Reader not initialized');
            return null;
        }

        try {
            const { collection, getDocs, query, where } = await import('https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js');
            
            const testsRef = collection(this.db, 'tests');
            const testQuery = query(
                testsRef, 
                where('status', '==', 'published'),
                where('testCode', '==', testCode)
            );
            
            const querySnapshot = await getDocs(testQuery);
            
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const testData = doc.data();
                testData.id = doc.id;
                return testData;
            }
            
            return null;
        } catch (error) {
            console.error(`Failed to load test with code ${testCode}:`, error);
            return null;
        }
    }

    getCategories() {
        return Array.from(this.categories).sort();
    }

    getTests() {
        return this.tests;
    }

    // Helper method to convert Firebase test data to the format expected by TestCore
    convertToTestCoreFormat(firebaseTestData) {
        return {
            title: firebaseTestData.title,
            description: firebaseTestData.description,
            timeLimit: firebaseTestData.timeLimit * 60, // Convert to seconds
            questions: firebaseTestData.questions.map(q => ({
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
                type: q.type || 'multiple-choice',
                passage: q.passage,
                image: q.image
            }))
        };
    }

    // Method to generate test HTML from Firebase data
    generateTestHtmlFromFirebase(firebaseTestData) {
        const testConfig = this.convertToTestCoreFormat(firebaseTestData);
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${testConfig.title} | Practice Tests Hub</title>
    <link rel="stylesheet" href="../../css/styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="container">
        <div class="test-header">
            <h1>${testConfig.title}</h1>
            <p class="test-description">${testConfig.description}</p>
            <div class="test-info">
                <span class="test-meta-item">${testConfig.questions.length} Questions</span>
                <span class="test-meta-item">${Math.floor(testConfig.timeLimit / 60)} Minutes</span>
                <span class="difficulty ${firebaseTestData.difficulty}">${firebaseTestData.difficulty.charAt(0).toUpperCase() + firebaseTestData.difficulty.slice(1)}</span>
            </div>
            <div id="timer">Time Remaining: ${Math.floor(testConfig.timeLimit / 60)}:00</div>
        </div>
        
        <div class="progress-container">
            <div class="progress"></div>
        </div>
        
        <div id="questionContainer"></div>
        
        <div class="navigation">
            <button id="prevButton" class="nav-button" disabled>Previous</button>
            <button id="nextButton" class="nav-button" disabled>Next</button>
        </div>
        
        <div id="results" style="display: none;"></div>
    </div>
    
    <script src="../../js/test-core.js"></script>
    <script>
        const testConfig = {
            questions: ${JSON.stringify(testConfig.questions, null, 8)},
            timeLimit: ${testConfig.timeLimit}
        };

        // Initialize the test
        const testCore = new TestCore(testConfig);
        testCore.start();
    </script>
</body>
</html>`;
    }
}

// Create global instance
window.firebaseTestReader = new FirebaseTestReader(); 
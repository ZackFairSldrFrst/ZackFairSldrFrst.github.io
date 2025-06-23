// Firebase Reader Utility for Practice Tests Hub
// This utility fetches published tests from Firebase Firestore

class FirebaseTestReader {
    constructor() {
        this.db = null;
        this.tests = [];
        this.categories = new Set();
        this.isInitialized = false;
        this.lastError = null;
        this.staticTests = [];
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

    // Scan for static tests in existing folders
    async scanStaticTests() {
        console.log('Scanning for static tests...');
        this.staticTests = [];
        
        // Define the test categories and their folder structures
        const testCategories = [
            {
                category: 'verbal-comprehension',
                folder: 'verbal-comprehension',
                prefix: 'vc',
                displayName: '🔤 Verbal Comprehension'
            },
            {
                category: 'situational-judgment',
                folder: 'situational-judgment',
                prefix: 'sj',
                displayName: '🧠 Situational Judgment'
            }
        ];
        
        for (const category of testCategories) {
            try {
                const tests = await this.scanCategoryFolder(category);
                this.staticTests.push(...tests);
                console.log(`Found ${tests.length} static tests in ${category.category}`);
            } catch (error) {
                console.warn(`Failed to scan ${category.category}:`, error);
            }
        }
        
        console.log(`Total static tests found: ${this.staticTests.length}`);
        return this.staticTests;
    }
    
    async scanCategoryFolder(categoryInfo) {
        const tests = [];
        
        // Try to fetch the folder structure by making a request to the category folder
        try {
            const response = await fetch(`./${categoryInfo.folder}/`);
            if (response.ok) {
                const html = await response.text();
                
                // Extract test folders from the HTML (this is a simplified approach)
                // Look for patterns like vc-01, vc-02, sj-01, etc.
                const testFolderPattern = new RegExp(`${categoryInfo.prefix}-\\d+`, 'g');
                const matches = html.match(testFolderPattern);
                
                if (matches) {
                    for (const testCode of matches) {
                        try {
                            const testData = await this.loadStaticTest(categoryInfo, testCode);
                            if (testData) {
                                tests.push(testData);
                            }
                        } catch (error) {
                            console.warn(`Failed to load static test ${testCode}:`, error);
                        }
                    }
                }
            }
        } catch (error) {
            console.warn(`Failed to scan ${categoryInfo.folder}:`, error);
        }
        
        return tests;
    }
    
    async loadStaticTest(categoryInfo, testCode) {
        try {
            // Try to load the script.js file which contains the test configuration
            const scriptUrl = `./${categoryInfo.folder}/${testCode}/script.js`;
            const response = await fetch(scriptUrl);
            
            if (!response.ok) {
                return null;
            }
            
            const scriptContent = await response.text();
            
            // Extract test configuration from the script
            const testConfig = this.extractTestConfigFromScript(scriptContent);
            
            if (!testConfig) {
                return null;
            }
            
            // Create a standardized test object
            const testData = {
                id: `static-${testCode}`,
                title: testConfig.title || `${testCode.toUpperCase()}: Practice Test`,
                category: categoryInfo.category,
                categoryDisplayName: categoryInfo.displayName,
                difficulty: 'intermediate', // Default for static tests
                timeLimit: this.parseTimeLimit(testConfig.timeLimit),
                testCode: testCode,
                description: testConfig.description || `Static test from ${categoryInfo.displayName}`,
                questions: testConfig.questions || [],
                createdAt: new Date().toISOString(), // Use current date for static tests
                updatedAt: new Date().toISOString(),
                status: 'published',
                author: 'System',
                version: '1.0',
                source: 'static',
                url: `${categoryInfo.folder}/${testCode}/index.html`
            };
            
            return testData;
            
        } catch (error) {
            console.warn(`Failed to load static test ${testCode}:`, error);
            return null;
        }
    }
    
    extractTestConfigFromScript(scriptContent) {
        try {
            // Look for testConfig or testData object in the script
            const testConfigMatch = scriptContent.match(/const\s+(testConfig|testData)\s*=\s*({[\s\S]*?});/);
            
            if (testConfigMatch) {
                const configString = testConfigMatch[2]; // Use the second group (the object content)
                // Clean up the config string and evaluate it
                const cleanConfig = configString
                    .replace(/(\w+):/g, '"$1":') // Add quotes to property names
                    .replace(/'/g, '"') // Replace single quotes with double quotes
                    .replace(/,(\s*})/g, '$1'); // Remove trailing commas
                
                try {
                    const testConfig = JSON.parse(cleanConfig);
                    return testConfig;
                } catch (parseError) {
                    console.warn('Failed to parse test config:', parseError);
                    console.warn('Config string:', cleanConfig);
                    return null;
                }
            }
            
            return null;
        } catch (error) {
            console.warn('Failed to extract test config:', error);
            return null;
        }
    }

    async loadAllTests() {
        const allTests = [];
        
        // Load static tests first
        console.log('Loading static tests...');
        const staticTests = await this.scanStaticTests();
        allTests.push(...staticTests);
        
        // Load Firebase tests if available
        if (this.isInitialized) {
            console.log('Loading Firebase tests...');
            try {
                const firebaseTests = await this.loadFirebaseTests();
                allTests.push(...firebaseTests);
            } catch (error) {
                console.warn('Failed to load Firebase tests:', error);
            }
        }
        
        // Sort all tests by creation date (newest first)
        allTests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        this.tests = allTests;
        this.categories.clear();
        
        // Build categories set
        this.tests.forEach(test => {
            this.categories.add(test.category);
        });
        
        console.log(`Total tests loaded: ${this.tests.length} (${staticTests.length} static, ${allTests.length - staticTests.length} Firebase)`);
        return this.tests;
    }
    
    async loadFirebaseTests() {
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
            const firebaseTests = [];
            
            querySnapshot.forEach((doc) => {
                const testData = doc.data();
                testData.id = doc.id; // Add document ID
                testData.source = 'firebase'; // Mark as Firebase test
                firebaseTests.push(testData);
                console.log(`Loaded Firebase test: ${testData.title} (${testData.testCode})`);
            });
            
            console.log(`Successfully loaded ${firebaseTests.length} Firebase tests`);
            return firebaseTests;
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

    parseTimeLimit(timeLimit) {
        if (typeof timeLimit === 'number') {
            // If it's already a number, assume it's in minutes
            return timeLimit;
        } else if (typeof timeLimit === 'string') {
            // If it's a string, try to parse it as minutes
            const minutes = parseInt(timeLimit, 10);
            return isNaN(minutes) ? 20 : minutes; // Default to 20 minutes if parsing fails
        } else {
            // Default to 20 minutes if no valid time limit
            return 20;
        }
    }
}

// Create global instance
window.firebaseTestReader = new FirebaseTestReader(); 
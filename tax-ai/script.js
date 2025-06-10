const API_KEY = 'sk-c6a2dd0f53ff4b178134ec63f9eeb6b4';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');
const resultContent = document.querySelector('.result-content');

// Debug logging function
function debugLog(message, data = null) {
    console.log(`[Tax AI Debug] ${message}`, data || '');
}

// Function to show status message
function showStatus(message) {
    resultContent.innerHTML = `<div class="status-message">${message}</div>`;
    searchResults.classList.remove('hidden');
}

// Function to show results
function showResults() {
    searchResults.classList.remove('hidden');
}

// Function to hide results
function hideResults() {
    searchResults.classList.add('hidden');
    resultContent.innerHTML = ''; // Clear previous results
}

// Function to format the response
function formatResponse(text) {
    // Convert markdown headers to HTML
    text = text.replace(/^###### (.*)$/gm, '<h6>$1</h6>')
               .replace(/^##### (.*)$/gm, '<h5>$1</h5>')
               .replace(/^#### (.*)$/gm, '<h4>$1</h4>')
               .replace(/^### (.*)$/gm, '<h3>$1</h3>')
               .replace(/^## (.*)$/gm, '<h2>$1</h2>')
               .replace(/^# (.*)$/gm, '<h1>$1</h1>');

    // Convert bold and italic
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
               .replace(/__([^_]+)__/g, '<strong>$1</strong>')
               .replace(/\*([^*]+)\*/g, '<em>$1</em>')
               .replace(/_([^_]+)_/g, '<em>$1</em>');

    // Convert unordered lists (including nested)
    text = text.replace(/^(\s*)[-*] (.*)$/gm, function(match, spaces, item) {
        const indent = spaces.length / 2;
        return `${'  '.repeat(indent)}<li>${item}</li>`;
    });
    // Wrap list items in <ul>
    text = text.replace(/((?:<li>.*<\/li>\s*)+)/g, function(match) {
        return `<ul>${match}</ul>`;
    });

    // Convert ordered lists
    text = text.replace(/^(\s*)\d+\. (.*)$/gm, function(match, spaces, item) {
        const indent = spaces.length / 2;
        return `${'  '.repeat(indent)}<li>${item}</li>`;
    });
    // Wrap ordered list items in <ol>
    text = text.replace(/((?:<li>.*<\/li>\s*)+)/g, function(match) {
        // If already wrapped in <ul>, skip
        if (match.startsWith('<ul>')) return match;
        return `<ol>${match}</ol>`;
    });

    // Convert code blocks
    text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    // Convert inline code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Convert paragraphs (lines not already in a block element)
    text = text.replace(/^(?!<h\d>|<ul>|<ol>|<li>|<pre>|<\/ul>|<\/ol>|<\/li>|<\/pre>|<blockquote>|<\/blockquote>)([^\n]+)\n/gm, '<p>$1</p>\n');

    // Remove extra newlines
    text = text.replace(/\n{2,}/g, '\n');

    return text;
}

// Function to handle the search
async function handleSearch() {
    const query = searchInput.value.trim();
    
    if (!query) {
        alert('Please enter a question');
        return;
    }

    hideResults();
    showStatus('Searching tax database...');
    debugLog('Starting search with query:', query);

    try {
        // Simulate database search delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        showStatus('Gathering relevant tax information...');
        
        debugLog('Making API request to:', API_URL);
        
        const requestBody = {
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: 'You are a senior tax accountant with over 20 years of experience in public accounting. You specialize in providing detailed, technical tax advice and guidance. Your responses should include specific tax code references, relevant regulations, and practical examples. Focus on accuracy and compliance with current tax laws. When discussing tax strategies, always mention potential risks and compliance requirements. Include relevant IRS publications, tax code sections, and regulatory guidance in your responses. Your goal is to provide comprehensive, technically accurate tax information that helps accountants make informed decisions.'
                },
                {
                    role: 'user',
                    content: query
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
        };

        debugLog('Request body:', requestBody);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        debugLog('Response status:', response.status);
        debugLog('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            debugLog('Error response:', errorText);
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }

        showStatus('Analyzing tax regulations and preparing response...');
        await new Promise(resolve => setTimeout(resolve, 1000));

        const data = await response.json();
        debugLog('Response data:', data);

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid response format from API');
        }

        const answer = data.choices[0].message.content;
        debugLog('Extracted answer:', answer);
        
        // Format and display the response
        resultContent.innerHTML = formatResponse(answer);
        showResults();
    } catch (error) {
        console.error('Error:', error);
        debugLog('Error details:', error);
        
        let errorMessage = 'Sorry, there was an error processing your request. ';
        if (error.message.includes('Failed to fetch')) {
            errorMessage += 'Please check your internet connection and try again.';
        } else if (error.message.includes('401')) {
            errorMessage += 'API authentication failed. Please check the API key.';
        } else if (error.message.includes('404')) {
            errorMessage += 'API endpoint not found. Please check the API URL.';
        } else {
            errorMessage += 'Please try again later.';
        }
        
        resultContent.innerHTML = `<p class="error">${errorMessage}</p>`;
        showResults();
    }
}

// Event listeners
searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
}); 
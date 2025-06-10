const API_KEY = 'sk-c6a2dd0f53ff4b178134ec63f9eeb6b4';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultContent = document.querySelector('.result-content');

// Function to show loading state
function showLoading() {
    loadingSpinner.classList.remove('hidden');
    searchResults.classList.add('hidden');
}

// Function to hide loading state
function hideLoading() {
    loadingSpinner.classList.add('hidden');
    searchResults.classList.remove('hidden');
}

// Function to format the response
function formatResponse(text) {
    // Split the text into paragraphs
    const paragraphs = text.split('\n\n');
    
    // Create HTML for each paragraph
    return paragraphs.map(paragraph => {
        if (paragraph.startsWith('#')) {
            // Handle headers
            const level = paragraph.match(/^#+/)[0].length;
            const content = paragraph.replace(/^#+\s*/, '');
            return `<h${level}>${content}</h${level}>`;
        } else if (paragraph.startsWith('- ')) {
            // Handle bullet points
            return `<ul><li>${paragraph.replace(/^- /, '')}</li></ul>`;
        } else {
            // Regular paragraph
            return `<p>${paragraph}</p>`;
        }
    }).join('');
}

// Function to handle the search
async function handleSearch() {
    const query = searchInput.value.trim();
    
    if (!query) {
        alert('Please enter a question');
        return;
    }

    showLoading();

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful AI assistant specializing in accounting, entrepreneurship, and AI technology. Provide detailed, professional responses that help accountants understand how to leverage AI and grow their business.'
                    },
                    {
                        role: 'user',
                        content: query
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        const answer = data.choices[0].message.content;
        
        // Format and display the response
        resultContent.innerHTML = formatResponse(answer);
        hideLoading();
    } catch (error) {
        console.error('Error:', error);
        resultContent.innerHTML = '<p class="error">Sorry, there was an error processing your request. Please try again.</p>';
        hideLoading();
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
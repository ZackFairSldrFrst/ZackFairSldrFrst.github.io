const API_KEY = 'sk-05df740662cc4782ac9877bf3bf59041';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');
const resultContent = document.querySelector('.result-content');
const conversationHistory = document.querySelector('.conversation-history');
const followUpContainer = document.querySelector('.follow-up-container');
const followUpInput = document.getElementById('followUpInput');
const followUpButton = document.getElementById('followUpButton');

// Store conversation messages
let conversationMessages = [];

// Debug logging function
function debugLog(message, data = null) {
    console.log(`[TaxAI Debug] ${message}`, data || '');
}

// Tab functionality for solutions section
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Pricing toggle functionality
function initializePricingToggle() {
    const toggleBtn = document.querySelector('.toggle-btn');
    const toggleSlider = document.querySelector('.toggle-slider');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            toggleBtn.classList.toggle('active');
            // Here you could add logic to update pricing display
            updatePricingDisplay(toggleBtn.classList.contains('active'));
        });
    }
}

function updatePricingDisplay(isAnnual) {
    const amounts = document.querySelectorAll('.amount');
    const originalPrices = ['49', '149', '399'];
    const annualPrices = ['37', '112', '299']; // 25% discount
    
    amounts.forEach((amount, index) => {
        if (isAnnual) {
            amount.textContent = annualPrices[index];
        } else {
            amount.textContent = originalPrices[index];
        }
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navButtons = document.querySelector('.nav-buttons');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
            navButtons.classList.toggle('mobile-active');
        });
    }
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Intersection Observer for animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-item, .testimonial, .pricing-card, .integration-item');
    animatedElements.forEach(el => observer.observe(el));
}

// Function to add message to conversation
function addMessageToConversation(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    messageDiv.textContent = message;
    conversationHistory.appendChild(messageDiv);
    messageDiv.scrollIntoView({ behavior: 'smooth' });
}

// Function to show status message
function showStatus(message) {
    resultContent.innerHTML = `<div class="status-message">${message}</div>`;
    searchResults.classList.remove('hidden');
}

// Function to show results
function showResults() {
    searchResults.classList.remove('hidden');
    followUpContainer.classList.remove('hidden');
}

// Function to hide results
function hideResults() {
    searchResults.classList.add('hidden');
    followUpContainer.classList.add('hidden');
    resultContent.innerHTML = '';
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

    // Format tax code references
    text = text.replace(/\[IRC §(\d+[A-Za-z]?)\]/g, '<a href="https://www.law.cornell.edu/uscode/text/26/$1" target="_blank" class="tax-reference">IRC §$1</a>')
               .replace(/\[Treas\. Reg\. §(\d+\.\d+-\d+)\]/g, '<a href="https://www.ecfr.gov/current/title-26/chapter-I/part-$1" target="_blank" class="tax-reference">Treas. Reg. §$1</a>')
               .replace(/\[Rev\. Rul\. (\d+-\d+)\]/g, '<a href="https://www.irs.gov/pub/irs-irbs/irb$1.pdf" target="_blank" class="tax-reference">Rev. Rul. $1</a>')
               .replace(/\[Pub\. (\d+[A-Za-z]?)\]/g, '<a href="https://www.irs.gov/pub/irs-pdf/p$1.pdf" target="_blank" class="tax-reference">Pub. $1</a>');

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
async function handleSearch(query, isFollowUp = false) {
    if (!query) {
        alert('Please enter a question');
        return;
    }

    if (!isFollowUp) {
        hideResults();
        conversationHistory.innerHTML = ''; // Clear conversation history
        conversationMessages = []; // Reset conversation messages
    }

    addMessageToConversation(query, true);
    showStatus('Analyzing your tax question...');
    debugLog('Starting search with query:', query);

    try {
        // Simulate database search delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        showStatus('Gathering relevant tax information...');
        
        debugLog('Making API request to:', API_URL);
        
        // Add the new message to the conversation
        conversationMessages.push({
            role: 'user',
            content: query
        });

        const requestBody = {
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: `You are TaxAI, an advanced AI tax assistant created to revolutionize tax practice. You are a senior tax professional with expertise equivalent to 20+ years in public accounting. Your responses must be:

PROFESSIONAL & AUTHORITATIVE:
- Provide definitive, expert-level guidance
- Use confident, professional language
- Reference specific tax code sections, regulations, and authorities
- Include practical implementation steps

COMPREHENSIVE & DETAILED:
- Cover all relevant aspects of the question
- Explain implications and considerations
- Provide examples with specific numbers when helpful
- Address potential complications or exceptions

PROPERLY FORMATTED:
- Use clear headings and bullet points
- Include specific code references: [IRC §199A], [Treas. Reg. §1.199A-1]
- Cite IRS Publications: [Pub. 334], [Form 1040]
- Reference Revenue Rulings: [Rev. Rul. 2023-15]

COMPLIANCE-FOCUSED:
- Always mention filing requirements and deadlines
- Highlight potential penalties or risks
- Note documentation requirements
- Include relevant forms and schedules

PRACTICAL & ACTIONABLE:
- Provide step-by-step guidance
- Include calculation examples when applicable
- Suggest best practices and planning opportunities
- Address both current year and future planning

Remember: You are the most advanced AI tax assistant available, trusted by 40,000+ professionals. Deliver responses that demonstrate this expertise and help users save time while ensuring compliance.`
                },
                ...conversationMessages
            ],
            temperature: 0.7,
            max_tokens: 1500
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

        if (!response.ok) {
            const errorText = await response.text();
            debugLog('Error response:', errorText);
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        debugLog('Response data:', data);

        if (data.choices && data.choices.length > 0) {
            const aiResponse = data.choices[0].message.content;
            
            // Add AI response to conversation
            conversationMessages.push({
                role: 'assistant',
                content: aiResponse
            });

            // Format and display the response
            const formattedResponse = formatResponse(aiResponse);
            addMessageToConversation(aiResponse, false);
            resultContent.innerHTML = formattedResponse;
            
            showResults();
            debugLog('Search completed successfully');
        } else {
            throw new Error('No response generated');
        }

    } catch (error) {
        debugLog('Search error:', error);
        resultContent.innerHTML = `
            <div class="error">
                <h3>Unable to Process Request</h3>
                <p>We're experiencing technical difficulties. Please try again in a moment.</p>
                <p class="error-details">Error: ${error.message}</p>
            </div>
        `;
        showResults();
    }
}

// Event listeners for search functionality
if (searchButton) {
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            handleSearch(query);
        }
    });
}

if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                handleSearch(query);
            }
        }
    });
}

if (followUpButton) {
    followUpButton.addEventListener('click', () => {
        const query = followUpInput.value.trim();
        if (query) {
            handleSearch(query, true);
            followUpInput.value = '';
        }
    });
}

if (followUpInput) {
    followUpInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = followUpInput.value.trim();
            if (query) {
                handleSearch(query, true);
                followUpInput.value = '';
            }
        }
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    debugLog('Initializing TaxAI application');
    
    initializeTabs();
    initializePricingToggle();
    initializeMobileMenu();
    initializeSmoothScrolling();
    initializeScrollAnimations();
    
    // Add some interactive enhancements
    
    // CTA form functionality
    const ctaForm = document.querySelector('.cta-form .form-group');
    if (ctaForm) {
        const input = ctaForm.querySelector('input');
        const button = ctaForm.querySelector('button');
        
        if (button) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const name = input.value.trim();
                if (name) {
                    // Simulate form submission
                    button.textContent = 'Thank you!';
                    button.style.background = 'var(--success-color)';
                    setTimeout(() => {
                        button.textContent = 'Get Free Access';
                        button.style.background = '';
                    }, 2000);
                } else {
                    input.style.borderColor = 'var(--danger-color)';
                    setTimeout(() => {
                        input.style.borderColor = '';
                    }, 2000);
                }
            });
        }
    }

    debugLog('TaxAI application initialized successfully');
}); 
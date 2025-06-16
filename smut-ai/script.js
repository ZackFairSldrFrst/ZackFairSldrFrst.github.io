const API_KEY = 'sk-b98786a940d54865bdb21f9fe2a98eb1';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const messagesContainer = document.getElementById('messagesContainer');
const typingIndicator = document.getElementById('typingIndicator');

// Store conversation messages
let conversationMessages = [];

// Debug logging function
function debugLog(message, data = null) {
    console.log(`[Smut AI Debug] ${message}`, data || '');
}

// Function to add message to chat
function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    if (isUser) {
        messageDiv.innerHTML = `
            <div class="message-content">
                <span>${content}</span>
            </div>
            <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="fas fa-robot"></i>
                <span>${content}</span>
            </div>
            <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        `;
    }
    
    messagesContainer.appendChild(messageDiv);
    messageDiv.scrollIntoView({ behavior: 'smooth' });
}

// Function to show/hide typing indicator
function showTypingIndicator() {
    typingIndicator.classList.remove('hidden');
    typingIndicator.scrollIntoView({ behavior: 'smooth' });
}

function hideTypingIndicator() {
    typingIndicator.classList.add('hidden');
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

    // Convert unordered lists
    text = text.replace(/^(\s*)[-*] (.*)$/gm, function(match, spaces, item) {
        const indent = spaces.length / 2;
        return `${'  '.repeat(indent)}<li>${item}</li>`;
    });
    text = text.replace(/((?:<li>.*<\/li>\s*)+)/g, function(match) {
        return `<ul>${match}</ul>`;
    });

    // Convert ordered lists
    text = text.replace(/^(\s*)\d+\. (.*)$/gm, function(match, spaces, item) {
        const indent = spaces.length / 2;
        return `${'  '.repeat(indent)}<li>${item}</li>`;
    });
    text = text.replace(/((?:<li>.*<\/li>\s*)+)/g, function(match) {
        if (match.startsWith('<ul>')) return match;
        return `<ol>${match}</ol>`;
    });

    // Convert code blocks
    text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Convert paragraphs
    text = text.replace(/^(?!<h\d>|<ul>|<ol>|<li>|<pre>|<\/ul>|<\/ol>|<\/li>|<\/pre>|<blockquote>|<\/blockquote>)([^\n]+)\n/gm, '<p>$1</p>\n');

    // Remove extra newlines
    text = text.replace(/\n{2,}/g, '\n');

    return text;
}

// Function to handle sending messages
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, true);
    messageInput.value = '';
    
    // Add to conversation history
    conversationMessages.push({
        role: 'user',
        content: message
    });

    showTypingIndicator();
    debugLog('Sending message:', message);

    try {
        const requestBody = {
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: `You are Smut AI, a creative writing assistant specialized in adult fiction, romance, and erotica. You help writers craft compelling stories, develop complex characters, and explore narrative possibilities in adult fiction.

Your expertise includes:
- Character development and relationship dynamics
- Plot structure and pacing for adult fiction
- Writing techniques for intimate scenes
- Genre conventions in romance and erotica
- Dialogue that feels natural and engaging
- World-building for various settings
- Overcoming writer's block and creative challenges

Guidelines for your responses:
- Be creative, supportive, and encouraging
- Provide specific, actionable writing advice
- Help develop characters with depth and complexity
- Suggest plot ideas and narrative techniques
- Offer constructive feedback on writing samples
- Maintain a professional tone while discussing adult themes
- Respect creative boundaries and preferences
- Encourage exploration of different writing styles

Always focus on the craft of writing and storytelling. Help users create compelling, well-written adult fiction that resonates with readers.`
                },
                ...conversationMessages
            ],
            temperature: 0.8,
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

        if (!response.ok) {
            const errorText = await response.text();
            debugLog('Error response:', errorText);
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        debugLog('Response data:', data);

        if (data.choices && data.choices.length > 0) {
            const aiResponse = data.choices[0].message.content;
            
            // Add AI response to conversation history
            conversationMessages.push({
                role: 'assistant',
                content: aiResponse
            });

            hideTypingIndicator();
            
            // Format and add AI response to chat
            const formattedResponse = formatResponse(aiResponse);
            addMessage(formattedResponse, false);
            
        } else {
            throw new Error('No response received from AI');
        }

    } catch (error) {
        debugLog('Error:', error);
        hideTypingIndicator();
        addMessage('Sorry, I encountered an error. Please try again.', false);
    }
}

// Event listeners
sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Auto-resize textarea functionality (optional enhancement)
messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
});

debugLog('Smut AI Chat Interface initialized'); 
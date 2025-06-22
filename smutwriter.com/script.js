const API_KEY = 'sk-b98786a940d54865bdb21f9fe2a98eb1';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Payment and limit constants
const FREE_MESSAGE_LIMIT = 2;
const SESSION_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
const PAYMENT_AMOUNT = 2;

// Payment and limit tracking
let messageCount = 0;
let sessionStartTime = null;
let isPaid = false;
let isProcessingPayment = false; // Flag to prevent multiple payment processes

// localStorage keys for chat history
const STORAGE_KEYS = {
    CONVERSATION_MESSAGES: 'smutwriter_conversation_messages',
    CHAT_HISTORY: 'smutwriter_chat_history',
    LAST_SAVE_TIME: 'smutwriter_last_save_time'
};

// localStorage keys for payment tracking
const PAYMENT_KEYS = {
    MESSAGE_COUNT: 'smutwriter_message_count',
    SESSION_START: 'smutwriter_session_start',
    IS_PAID: 'smutwriter_is_paid',
    PAYMENT_EXPIRY: 'smutwriter_payment_expiry'
};

const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const messagesContainer = document.getElementById('messagesContainer');
const typingIndicator = document.getElementById('typingIndicator');

// Store conversation messages
let conversationMessages = [];

// Debug logging function
function debugLog(message, data = null) {
    console.log(`[Smut Writer Debug] ${message}`, data || '');
}

// Google Analytics Event Tracking Functions
function trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
        debugLog(`GA Event tracked: ${eventName}`, parameters);
    } else {
        debugLog('Google Analytics not loaded, event not tracked:', eventName);
    }
}

function trackPageView(pagePath = window.location.pathname) {
    if (typeof gtag !== 'undefined') {
        gtag('config', 'G-HBW1GF6JYB', {
            page_path: pagePath
        });
        debugLog('GA Page view tracked:', pagePath);
    }
}

function trackUserEngagement(action, details = {}) {
    trackEvent('user_engagement', {
        engagement_action: action,
        ...details
    });
}

// localStorage utility functions
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        debugLog(`Saved to localStorage: ${key}`);
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function loadFromLocalStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
    }
}

// Save chat message to history
function saveChatMessage(content, isUser, timestamp = null) {
    const message = {
        content: content,
        isUser: isUser,
        timestamp: timestamp || new Date().toISOString(),
        formattedTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    // Load existing chat history
    const chatHistory = loadFromLocalStorage(STORAGE_KEYS.CHAT_HISTORY, []);
    chatHistory.push(message);
    
    // Keep only last 100 messages to prevent localStorage from getting too large
    if (chatHistory.length > 100) {
        chatHistory.splice(0, chatHistory.length - 100);
    }
    
    // Save updated history
    saveToLocalStorage(STORAGE_KEYS.CHAT_HISTORY, chatHistory);
    saveToLocalStorage(STORAGE_KEYS.CONVERSATION_MESSAGES, conversationMessages);
    saveToLocalStorage(STORAGE_KEYS.LAST_SAVE_TIME, new Date().toISOString());
}

// Load and display chat history
function loadChatHistory() {
    debugLog('Loading chat history from localStorage...');
    
    // Load conversation messages for API
    const savedConversationMessages = loadFromLocalStorage(STORAGE_KEYS.CONVERSATION_MESSAGES, []);
    conversationMessages = savedConversationMessages;
    
    // Load chat history for display
    const chatHistory = loadFromLocalStorage(STORAGE_KEYS.CHAT_HISTORY, []);
    
    if (chatHistory.length > 0) {
        // Clear the default welcome message
        messagesContainer.innerHTML = '';
        
        // Restore all messages without typewriter effect
        chatHistory.forEach(message => {
            displayMessage(message.content, message.isUser, message.formattedTime, false);
        });
        
        // Scroll to bottom and show input after loading all history messages
        setTimeout(scrollToBottomAndShowInput, 100);
        
        debugLog(`Loaded ${chatHistory.length} messages from history`);
    } else {
        debugLog('No chat history found, starting fresh');
    }
}

// Typewriter effect function
function typewriterEffect(element, text, speed = 20) {
    return new Promise((resolve) => {
        let index = 0;
        let isTyping = true;
        element.textContent = '';
        
        // Add blinking cursor
        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        cursor.textContent = '|';
        element.appendChild(cursor);
        
        // Add click handler to skip typing
        const skipTyping = () => {
            if (isTyping) {
                isTyping = false;
                element.innerHTML = text;
                if (cursor.parentNode) {
                    cursor.parentNode.removeChild(cursor);
                }
                element.removeEventListener('click', skipTyping);
                resolve();
            }
        };
        
        element.addEventListener('click', skipTyping);
        element.style.cursor = 'pointer';
        element.title = 'Click to skip typing';
        
        // Parse the text to separate HTML tags, emojis, and text content
        const parseText = (text) => {
            const parts = [];
            let currentIndex = 0;
            
            while (currentIndex < text.length) {
                if (text[currentIndex] === '<') {
                    const tagEnd = text.indexOf('>', currentIndex);
                    if (tagEnd !== -1) {
                        const tag = text.substring(currentIndex, tagEnd + 1);
                        parts.push({ type: 'tag', content: tag });
                        currentIndex = tagEnd + 1;
                    } else {
                        parts.push({ type: 'char', content: text[currentIndex] });
                        currentIndex++;
                    }
                } else if (text[currentIndex] === '&') {
                    // Handle HTML entities like &nbsp;, &amp;, etc.
                    const entityEnd = text.indexOf(';', currentIndex);
                    if (entityEnd !== -1) {
                        const entity = text.substring(currentIndex, entityEnd + 1);
                        parts.push({ type: 'entity', content: entity });
                        currentIndex = entityEnd + 1;
                    } else {
                        parts.push({ type: 'char', content: text[currentIndex] });
                        currentIndex++;
                    }
                } else {
                    // Check for emoji (Unicode characters)
                    const char = text[currentIndex];
                    const charCode = char.charCodeAt(0);
                    
                    // Emoji range: 0x1F600-0x1F64F (emoticons), 0x1F300-0x1F5FF (misc symbols), etc.
                    if (charCode >= 0x1F600 && charCode <= 0x1F64F || 
                        charCode >= 0x1F300 && charCode <= 0x1F5FF ||
                        charCode >= 0x1F680 && charCode <= 0x1F6FF ||
                        charCode >= 0x2600 && charCode <= 0x26FF ||
                        charCode >= 0x2700 && charCode <= 0x27BF) {
                        parts.push({ type: 'emoji', content: char });
                    } else {
                        parts.push({ type: 'char', content: char });
                    }
                    currentIndex++;
                }
            }
            
            return parts;
        };
        
        const textParts = parseText(text);
        let partIndex = 0;
        
        function type() {
            if (!isTyping) return;
            
            if (partIndex < textParts.length) {
                const part = textParts[partIndex];
                
                if (part.type === 'tag') {
                    // Insert HTML tag as a complete element
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = part.content;
                    const tagElement = tempDiv.firstChild;
                    
                    if (tagElement) {
                        element.insertBefore(tagElement, cursor);
                    }
                } else if (part.type === 'entity') {
                    // Insert HTML entity
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = part.content;
                    const textNode = document.createTextNode(tempDiv.textContent);
                    element.insertBefore(textNode, cursor);
                } else if (part.type === 'emoji') {
                    // Insert emoji as text node
                    const textNode = document.createTextNode(part.content);
                    element.insertBefore(textNode, cursor);
                } else {
                    // Insert text character
                    const textNode = document.createTextNode(part.content);
                    element.insertBefore(textNode, cursor);
                }
                
                partIndex++;
                
                // Scroll to keep the typing visible
                scrollToBottom();
                
                // Add extra pause after sentences for more natural typing
                let currentSpeed = speed;
                if (part.type === 'char' && (part.content === '.' || part.content === '!' || part.content === '?')) {
                    currentSpeed = speed * 3; // Longer pause after sentences
                } else if (part.type === 'char' && part.content === ',') {
                    currentSpeed = speed * 1.5; // Slight pause after commas
                }
                
                setTimeout(type, currentSpeed);
            } else {
                // Remove cursor when typing is complete
                if (cursor.parentNode) {
                    cursor.parentNode.removeChild(cursor);
                }
                element.removeEventListener('click', skipTyping);
                element.style.cursor = 'default';
                element.title = '';
                isTyping = false;
                resolve();
            }
        }
        
        type();
    });
}

// Modified displayMessage function to support typewriter effect
function displayMessage(content, isUser = false, customTime = null, useTypewriter = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const timeString = customTime || new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    if (isUser) {
        messageDiv.innerHTML = `
            <div class="message-content">
                <span>${content}</span>
            </div>
            <div class="message-time">${timeString}</div>
        `;
        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
    } else {
        // Create unique ID for this message
        const messageId = 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="fas fa-robot"></i>
                <span id="${messageId}"></span>
                <button class="copy-button" onclick="copyMessage('${messageId}')" title="Copy message" style="display: none;">
                    <i class="fas fa-copy"></i>
                </button>
            </div>
            <div class="message-time">${timeString}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        const messageElement = document.getElementById(messageId);
        const copyButton = messageDiv.querySelector('.copy-button');
        
        if (useTypewriter) {
            // Start typewriter effect
            typewriterEffect(messageElement, content).then(() => {
                // Show copy button after typing is complete
                if (copyButton) {
                    copyButton.style.display = 'inline-block';
                }
            });
        } else {
            // Display immediately (for loaded history)
            messageElement.innerHTML = content;
            if (copyButton) {
                copyButton.style.display = 'inline-block';
            }
        }
        
        scrollToBottom();
    }
}

// Copy message content to clipboard
function copyMessage(messageId) {
    const messageElement = document.getElementById(messageId);
    if (!messageElement) {
        debugLog('Message element not found for copying');
        return;
    }
    
    // Get the text content, removing any HTML tags
    const textContent = messageElement.textContent || messageElement.innerText;
    const isUserMessage = messageElement.classList.contains('user-message');
    
    // Track copy event
    trackEvent('copy_message', {
        message_type: isUserMessage ? 'user' : 'ai',
        message_length: textContent.length,
        timestamp: new Date().toISOString()
    });
    
    // Use the modern clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textContent).then(() => {
            showCopyFeedback(messageElement);
            debugLog('Message copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy message: ', err);
            fallbackCopyTextToClipboard(textContent, messageElement);
        });
    } else {
        // Fallback for older browsers or non-secure contexts
        fallbackCopyTextToClipboard(textContent, messageElement);
    }
}

// Fallback copy method for older browsers
function fallbackCopyTextToClipboard(text, messageElement) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopyFeedback(messageElement);
            debugLog('Message copied to clipboard (fallback method)');
        } else {
            throw new Error('Copy command failed');
        }
    } catch (err) {
        console.error('Fallback: Could not copy text: ', err);
        alert('Copy failed. Please manually select and copy the text.');
    }
    
    document.body.removeChild(textArea);
}

// Show visual feedback when message is copied
function showCopyFeedback(messageElement) {
    // Find the copy button within the message
    const copyButton = messageElement.parentElement.querySelector('.copy-button');
    if (copyButton) {
        const originalIcon = copyButton.innerHTML;
        const originalTitle = copyButton.title;
        
        // Change button to show success
        copyButton.innerHTML = '<i class="fas fa-check"></i>';
        copyButton.title = 'Copied!';
        copyButton.style.background = 'rgba(76, 175, 80, 0.9)';
        
        // Reset after 2 seconds
        setTimeout(() => {
            copyButton.innerHTML = originalIcon;
            copyButton.title = originalTitle;
            copyButton.style.background = '';
        }, 2000);
    }
}

// Clear chat history
function clearChatHistory() {
    if (confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
        const messagesBeforeClear = loadFromLocalStorage(STORAGE_KEYS.CHAT_HISTORY, []).length;
        
        localStorage.removeItem(STORAGE_KEYS.CONVERSATION_MESSAGES);
        localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
        localStorage.removeItem(STORAGE_KEYS.LAST_SAVE_TIME);
        
        conversationMessages = [];
        messagesContainer.innerHTML = `
            <div class="message bot-message">
                <div class="message-content">
                    <i class="fas fa-robot"></i>
                    <span>Welcome to Smut Writer! I'm your creative partner in crafting immersive adult stories. Whether you want to read a steamy romance, explore your fantasies, or create your own choose-your-own-adventure tale, I'm here to help bring your ideas to life.

I'll craft detailed, consistent stories with rich characters and vivid scenes. Just tell me what kind of story you'd like to read or create, and I'll help you explore it chapter by chapter. You can guide the story's direction, and I'll maintain consistency while keeping things hot and engaging.

What kind of story would you like to explore today?</span>
                </div>
                <div class="message-time">Just now</div>
            </div>
        `;
        
        // Track clear history event
        trackEvent('clear_chat_history', {
            messages_cleared: messagesBeforeClear,
            timestamp: new Date().toISOString()
        });
        
        // Scroll to bottom and show input after clearing history
        setTimeout(scrollToBottomAndShowInput, 100);
        
        debugLog('Chat history cleared');
    }
}

// Function to scroll messages container to bottom
function scrollToBottom() {
    const messagesContainer = document.getElementById('messagesContainer');
    if (messagesContainer) {
        // Use requestAnimationFrame to ensure DOM is updated
        requestAnimationFrame(() => {
            // Smooth scroll to bottom
            messagesContainer.scrollTo({
                top: messagesContainer.scrollHeight,
                behavior: 'smooth'
            });
        });
    }
}

// Function to check if user is near bottom of chat
function isNearBottom() {
    const messagesContainer = document.getElementById('messagesContainer');
    if (!messagesContainer) return true;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
    return scrollHeight - scrollTop - clientHeight < 100; // Within 100px of bottom
}

// Enhanced scroll to bottom that only scrolls if user is near bottom
function scrollToBottomIfNearBottom() {
    if (isNearBottom()) {
        scrollToBottom();
    }
}

// Function to add message to chat (wrapper for displayMessage with saving)
function addMessage(content, isUser = false) {
    // Display the message with typewriter effect for bot responses
    displayMessage(content, isUser, null, !isUser);
    
    // Save to localStorage
    saveChatMessage(content, isUser);
    
    // Ensure we scroll to bottom and show input after adding message
    setTimeout(scrollToBottomAndShowInput, 100);
}

// Function to show/hide typing indicator
function showTypingIndicator() {
    typingIndicator.classList.remove('hidden');
    
    // Scroll to bottom and show input when typing indicator appears
    scrollToBottomAndShowInput();
}

function hideTypingIndicator() {
    typingIndicator.classList.add('hidden');
    
    // Scroll to bottom and show input when hiding typing indicator
    scrollToBottomAndShowInput();
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

// Function to check if user can send messages
function canSendMessage() {
    debugLog(`Checking if can send message: isPaid=${isPaid}, messageCount=${messageCount}, FREE_MESSAGE_LIMIT=${FREE_MESSAGE_LIMIT}`);
    
    if (isPaid) {
        const expiryTime = loadFromLocalStorage(PAYMENT_KEYS.PAYMENT_EXPIRY);
        if (expiryTime && new Date().getTime() < expiryTime) {
            debugLog('User is paid and payment is valid');
            return true;
        } else {
            // Payment expired
            debugLog('Payment expired, setting isPaid to false');
            isPaid = false;
            saveToLocalStorage(PAYMENT_KEYS.IS_PAID, false);
            showPaymentPrompt();
            return false;
        }
    }
    
    const canSend = messageCount < FREE_MESSAGE_LIMIT;
    debugLog(`Free user can send message: ${canSend} (${messageCount}/${FREE_MESSAGE_LIMIT})`);
    return canSend;
}

// Function to process payment
function processPayment() {
    // Prevent multiple payment processes
    if (isProcessingPayment) {
        debugLog('Payment already being processed, ignoring duplicate click');
        return;
    }
    
    isProcessingPayment = true;
    debugLog('Starting payment process');
    
    // Track payment attempt
    trackEvent('payment_attempt', {
        user_type: 'free',
        message_count: messageCount,
        timestamp: new Date().toISOString()
    });
    
    // Get translated text or fallback to English
    const getText = (key) => {
        return typeof TranslationManager !== 'undefined' ? TranslationManager.get(key) : translations['en'][key] || key;
    };
    
    // Open Stripe payment link in a new tab
    window.open('https://buy.stripe.com/00w9ATacx7bZ1Pfaes0ZW07', '_blank');
    
    // Add a message to inform the user
    addMessage(`Please complete the payment in the new tab. Once you've paid, you'll be able to continue chatting for 3 hours.`, false);
    
    // Remove payment prompt
    const paymentPrompt = document.querySelector('.payment-prompt');
    if (paymentPrompt) {
        paymentPrompt.remove();
    }
    
    // Add a check for successful payment
    // Note: In a production environment, you would implement webhook handling
    // to verify the payment status from Stripe
    const checkPaymentStatus = setInterval(() => {
        // Here you would typically check with your backend
        // to verify if the payment was successful
        // For now, we'll simulate a successful payment after 5 seconds
        setTimeout(() => {
            // Only process if we're still processing payment (prevent multiple success messages)
            if (isProcessingPayment) {
                const expiryTime = new Date().getTime() + SESSION_DURATION;
                isPaid = true;
                isProcessingPayment = false; // Reset the flag
                saveToLocalStorage(PAYMENT_KEYS.IS_PAID, true);
                saveToLocalStorage(PAYMENT_KEYS.PAYMENT_EXPIRY, expiryTime);
                
                // Track payment completion
                trackEvent('payment_completed', {
                    payment_duration: '3_hours',
                    timestamp: new Date().toISOString()
                });
                
                addMessage(getText('payment_success'), false);
                clearInterval(checkPaymentStatus);
                debugLog('Payment process completed successfully');
            }
        }, 5000);
    }, 1000);
}

// Function to show payment prompt
function showPaymentPrompt() {
    debugLog('Showing payment prompt');
    const paymentDiv = document.createElement('div');
    paymentDiv.className = 'payment-prompt';
    
    // Get translated text or fallback to English
    const getText = (key) => {
        return typeof TranslationManager !== 'undefined' ? TranslationManager.get(key) : translations['en'][key] || key;
    };
    
    paymentDiv.innerHTML = `
        <div class="payment-content">
            <h3>Continue Your Story</h3>
            <p>${getText('free_limit_reached')} ${getText('upgrade_prompt')}</p>
            <button onclick="processPayment()" class="payment-button">
                ${getText('pay_button')}
            </button>
            <p class="payment-note">You'll be redirected to our secure payment processor.</p>
        </div>
    `;
    document.body.appendChild(paymentDiv);
    debugLog('Payment prompt added to DOM');
}

// Function to update message count
function updateMessageCount() {
    messageCount++;
    saveToLocalStorage(PAYMENT_KEYS.MESSAGE_COUNT, messageCount);
    debugLog(`Message count updated: ${messageCount}/${FREE_MESSAGE_LIMIT}, isPaid: ${isPaid}`);
    
    if (!isPaid && messageCount >= FREE_MESSAGE_LIMIT) {
        debugLog('Free message limit reached, showing payment prompt');
        showPaymentPrompt();
    }
}

// Modified sendMessage function
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    if (!canSendMessage()) {
        return;
    }

    // Track message sending
    trackEvent('send_message', {
        message_length: message.length,
        user_type: isPaid ? 'paid' : 'free',
        message_count: messageCount + 1,
        timestamp: new Date().toISOString()
    });

    // Add user message to chat
    addMessage(message, true);
    messageInput.value = '';
    
    // Update message count
    updateMessageCount();
    
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
                    content: `You are Smut Writer, a creative writer specialized in adult fiction, romance, and erotica. Your primary goal is to craft engaging, consistent stories that readers can immerse themselves in, with a strong focus on explicit, detailed adult content.

STRICT CONTENT PROHIBITIONS - UNDER NO CIRCUMSTANCES:
- NO child pornography or any sexual content involving minors (under 18)
- NO sexual content involving children, teenagers, or any characters under 18
- NO descriptions of underage characters in sexual situations
- NO sexual content with high school students or minors in educational settings
- NO "age play" or roleplay involving minors
- NO sexual content with characters who appear young or are described as young-looking
- ALL characters must be explicitly stated to be 18 years of age or older
- If any character's age is mentioned, they must be 18+ and this must be clearly stated
- NO exceptions to these rules under any circumstances

Core Writing Principles:
1. Story Consistency:
   - Maintain the same story title throughout the entire conversation
   - Keep character names, appearances, and personalities consistent
   - Preserve established plot points and relationships
   - Reference key events from previous chapters when relevant
   - Avoid contradicting previously established details
   - ALL characters must be 18+ and this must be clearly established

2. Chapter Structure:
   - Each response should be a new chapter
   - Use sequential chapter numbers (Chapter 1, Chapter 2, etc.)
   - Create engaging, descriptive chapter titles
   - Focus on advancing the current chapter's plot
   - Maintain narrative flow between chapters

3. Character Development:
   - Develop deep, consistent character personalities
   - Maintain consistent character voices and speech patterns
   - Show character growth and development over time
   - Keep character relationships and dynamics consistent
   - Include meaningful character interactions and dialogue
   - ALL characters must be explicitly 18+ years old

4. Writing Style:
   - Use rich, descriptive language
   - Create vivid sensory details
   - Write natural, flowing dialogue
   - Balance action, dialogue, and description
   - Maintain appropriate pacing

5. Scene Development:
   - Set clear scene locations and atmospheres
   - Include relevant environmental details
   - Create immersive, engaging scenes
   - Balance emotional and physical elements
   - Maintain scene continuity

Adult Content Guidelines:
1. Explicit Descriptions:
   - Provide detailed, vivid descriptions of intimate moments
   - Include rich sensory details (touch, taste, smell, sound, sight)
   - Describe physical sensations and emotional responses
   - Use explicit but tasteful language, but get progressively more explicit each chapter
   - Maintain a balance between subtlety and explicitness
   - ONLY between consenting adults (18+)

2. Character Intimacy:
   - Develop deep emotional connections between characters
   - Show character chemistry and attraction
   - Include meaningful dialogue during intimate moments
   - Describe character reactions and responses
   - Build tension and anticipation
   - ALL characters must be 18+ and consenting

3. Scene Pacing:
   - Create natural progression of intimate moments
   - Build anticipation and desire
   - Include foreplay and buildup
   - Describe physical and emotional climaxes
   - Show aftermath and emotional impact
   - ONLY between adult characters (18+)

4. Dialogue and Interaction:
   - Write natural, passionate dialogue
   - Include verbal and non-verbal communication
   - Show character vulnerability and trust
   - Express desires and boundaries
   - Maintain character voice consistency
   - ALL characters must be 18+ and consenting

Community Sharing Guidelines:
- Frequently encourage readers to share their stories on Reddit
- Include a hyperlink to r/SmutWriter in most responses (at least every 2-3 chapters)
- Use natural, engaging language when suggesting sharing
- Examples of sharing prompts:
  * "Loved this chapter? Share your story with the community at <a href='https://reddit.com/r/SmutWriter' target='_blank'>r/SmutWriter</a>!"
  * "Want to discuss this story with other readers? Join the conversation at <a href='https://reddit.com/r/SmutWriter' target='_blank'>r/SmutWriter</a>!"
  * "Share your thoughts and get feedback from the community at <a href='https://reddit.com/r/SmutWriter' target='_blank'>r/SmutWriter</a>!"
  * "Ready to share your story? The community at <a href='https://reddit.com/r/SmutWriter' target='_blank'>r/SmutWriter</a> would love to read it!"
- Always use the exact hyperlink format: <a href='https://reddit.com/r/SmutWriter' target='_blank'>r/SmutWriter</a>
- Integrate sharing suggestions naturally into the narrative flow
- Don't be overly pushy, but make sharing feel like a natural part of the experience

Guidelines for Responses:
- Focus on the current chapter's events
- Maintain continuity with previous chapters
- Avoid summarizing previous chapters
- Keep the narrative flowing naturally
- Ensure all new content aligns with established story elements
- Include detailed, explicit adult content ONLY between consenting adults (18+)
- Balance story progression with intimate moments
- Include Reddit sharing recommendations frequently and naturally
- ALWAYS ensure all characters are 18+ and explicitly state this when introducing new characters

Your goal is to create an engaging, consistent narrative that readers can follow and enjoy throughout the entire conversation, with a strong emphasis on explicit, detailed adult content that enhances the story, while encouraging community engagement through Reddit sharing. ALL content must involve only consenting adults (18+) and under no circumstances should any content involve minors or appear to involve minors.`
                },
                ...conversationMessages
            ],
            temperature: 0.8,
            max_tokens: 2000
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
            
            // Track AI response received
            trackEvent('ai_response_received', {
                response_length: aiResponse.length,
                conversation_length: conversationMessages.length,
                timestamp: new Date().toISOString()
            });
            
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
        
        // Get translated error message or fallback to English
        const errorMessage = typeof TranslationManager !== 'undefined' ? 
            TranslationManager.get('error_message') : 
            'Sorry, I encountered an error. Please try again.';
        
        addMessage(errorMessage, false);
    }
}

// Modified initializeChat function
function initializeChat() {
    debugLog('Initializing Smut Writer Chat Interface...');
    
    // Initialize navigation
    initializeNavigation();
    
    // Check for story prompt from stories page
    const storyPrompt = localStorage.getItem('smutwriter_story_prompt');
    if (storyPrompt) {
        // Clear the prompt from localStorage
        localStorage.removeItem('smutwriter_story_prompt');
        
        // Set the prompt in the input field
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.value = storyPrompt;
            messageInput.focus();
        }
        
        debugLog('Story prompt loaded:', storyPrompt);
    }
    
    // Initialize translation system first
    if (typeof TranslationManager !== 'undefined') {
        TranslationManager.init();
        debugLog(`Translation system initialized with language: ${TranslationManager.currentLanguage}`);
    } else {
        debugLog('TranslationManager not found, proceeding without translations');
    }
    
    // Track page view and app initialization
    trackPageView();
    trackEvent('app_initialized', {
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        language: typeof TranslationManager !== 'undefined' ? TranslationManager.currentLanguage : 'en'
    });
    
    // Load payment and limit data
    messageCount = loadFromLocalStorage(PAYMENT_KEYS.MESSAGE_COUNT, 0);
    isPaid = loadFromLocalStorage(PAYMENT_KEYS.IS_PAID, false);
    sessionStartTime = loadFromLocalStorage(PAYMENT_KEYS.SESSION_START, new Date().getTime());
    
    // Check if payment is expired
    if (isPaid) {
        const expiryTime = loadFromLocalStorage(PAYMENT_KEYS.PAYMENT_EXPIRY);
        if (expiryTime && new Date().getTime() >= expiryTime) {
            isPaid = false;
            saveToLocalStorage(PAYMENT_KEYS.IS_PAID, false);
            
            // Track payment expiry
            trackEvent('payment_expired', {
                timestamp: new Date().toISOString()
            });
        }
    }
    
    // Track user session info
    trackEvent('session_info', {
        user_type: isPaid ? 'paid' : 'free',
        message_count: messageCount,
        existing_history: loadFromLocalStorage(STORAGE_KEYS.CHAT_HISTORY, []).length > 0,
        timestamp: new Date().toISOString()
    });
    
    // Detect Safari mobile and apply fallbacks
    detectSafariMobile();
    
    // Load existing chat history
    loadChatHistory();
    
    // Add clear history button to header (will be translated by TranslationManager)
    addClearHistoryButton();
    
    // Scroll to bottom and show input after loading history
    setTimeout(scrollToBottomAndShowInput, 200);
    
    debugLog('Smut Writer Chat Interface initialized');
}

// Detect Safari mobile (simplified - no longer needed for fallbacks)
function detectSafariMobile() {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if ((isSafari && isMobile) || isIOS) {
        debugLog('Safari mobile detected - using universal solid styling');
    } else {
        debugLog('Other browser detected - using universal solid styling');
    }
}

// Add clear history button to the chat header
function addClearHistoryButton() {
    const chatHeader = document.querySelector('.chat-header');
    if (chatHeader) {
        const clearButton = document.createElement('button');
        const clearText = typeof TranslationManager !== 'undefined' ? TranslationManager.get('clear_history') : 'Clear History';
        clearButton.innerHTML = `<i class="fas fa-trash-alt"></i> ${clearText}`;
        clearButton.className = 'clear-history-btn';
        clearButton.style.cssText = `
            position: absolute;
            top: 1rem;
            right: 1rem;
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
            border: none;
            cursor: pointer;
            border-radius: 10px;
        `;
        clearButton.onclick = clearChatHistory;
        chatHeader.appendChild(clearButton);
    }
}

// Export chat history as JSON
function exportChatHistory() {
    const chatHistory = loadFromLocalStorage(STORAGE_KEYS.CHAT_HISTORY, []);
    const conversationData = loadFromLocalStorage(STORAGE_KEYS.CONVERSATION_MESSAGES, []);
    
    const exportData = {
        chatHistory: chatHistory,
        conversationMessages: conversationData,
        exportDate: new Date().toISOString(),
        totalMessages: chatHistory.length
    };
    
    // Track export event
    trackEvent('export_chat_history', {
        total_messages: chatHistory.length,
        conversation_length: conversationData.length,
        timestamp: new Date().toISOString()
    });
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "smutwriter_chat_history.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    debugLog('Chat history exported');
}

// Import chat history from JSON
function importChatHistory(jsonData) {
    try {
        const importData = JSON.parse(jsonData);
        
        if (importData.chatHistory && importData.conversationMessages) {
            // Track import event
            trackEvent('import_chat_history', {
                imported_messages: importData.chatHistory.length,
                imported_conversations: importData.conversationMessages.length,
                timestamp: new Date().toISOString()
            });
            
            // Save imported data
            saveToLocalStorage(STORAGE_KEYS.CHAT_HISTORY, importData.chatHistory);
            saveToLocalStorage(STORAGE_KEYS.CONVERSATION_MESSAGES, importData.conversationMessages);
            
            // Reload the chat
            loadChatHistory();
            
            debugLog(`Imported ${importData.chatHistory.length} messages`);
            
            // Get translated success message or fallback to English
            const successMessage = typeof TranslationManager !== 'undefined' ? 
                TranslationManager.get('import_success') : 
                `Successfully imported ${importData.chatHistory.length} messages!`;
            
            alert(successMessage);
        } else {
            throw new Error('Invalid chat history format');
        }
    } catch (error) {
        console.error('Error importing chat history:', error);
        
        // Get translated error message or fallback to English
        const errorMessage = typeof TranslationManager !== 'undefined' ? 
            TranslationManager.get('import_error') : 
            'Error importing chat history. Please check the file format.';
        
        alert(errorMessage);
        
        // Track import error
        trackEvent('import_chat_history_error', {
            error_message: error.message,
            timestamp: new Date().toISOString()
        });
    }
}

// Event listeners
sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Track user engagement events
messageInput.addEventListener('focus', function() {
    trackUserEngagement('input_focused', {
        timestamp: new Date().toISOString()
    });
});

let typingTimer;
messageInput.addEventListener('input', function() {
    // Auto-resize textarea functionality
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
    
    // Track typing activity (debounced)
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        if (this.value.length > 0) {
            trackUserEngagement('typing_activity', {
                input_length: this.value.length,
                timestamp: new Date().toISOString()
            });
        }
    }, 1000);
});

// Smart input visibility management
let lastScrollTop = 0;
let scrollTimeout = null;
let isInputVisible = true;

function initializeSmartInput() {
    const messagesContainer = document.getElementById('messagesContainer');
    const inputContainer = document.querySelector('.chat-input-container');
    const scrollHint = document.getElementById('scrollHint');
    
    if (!messagesContainer || !inputContainer || !scrollHint) {
        debugLog('Smart input elements not found');
        return;
    }
    
    // Function definitions
    function showInputField() {
        isInputVisible = true;
        inputContainer.classList.remove('hidden-input');
        scrollHint.classList.remove('visible');
        messagesContainer.classList.add('input-visible');
        
        // Focus input if user is interacting
        if (document.hasFocus()) {
            setTimeout(() => {
                const messageInput = document.getElementById('messageInput');
                if (messageInput && !messageInput.disabled) {
                    messageInput.focus();
                }
            }, 300);
        }
    }
    
    function hideInputField() {
        isInputVisible = false;
        inputContainer.classList.add('hidden-input');
        messagesContainer.classList.remove('input-visible');
        
        // Show hint after a delay
        setTimeout(() => {
            if (!isInputVisible) {
                scrollHint.classList.add('visible');
            }
        }, 200);
    }
    
    // Initially show input and hide hint
    showInputField();
    
    // Throttled scroll handler for performance
    function handleScroll() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
            const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
            const isScrollingUp = scrollTop < lastScrollTop;
            const isScrollingDown = scrollTop > lastScrollTop;
            
            // Show input when at bottom or scrolling down near bottom
            if (isAtBottom || (isScrollingDown && scrollHeight - scrollTop - clientHeight < 200)) {
                if (!isInputVisible) {
                    showInputField();
                }
            }
            // Hide input when scrolling up and not near bottom
            else if (isScrollingUp && scrollHeight - scrollTop - clientHeight > 100) {
                if (isInputVisible) {
                    hideInputField();
                }
            }
            
            lastScrollTop = scrollTop;
                 }, 16); // ~60fps throttling
     }
    
    // Add scroll event listener
    messagesContainer.addEventListener('scroll', handleScroll);
    
    // Add touch scroll event for mobile
    messagesContainer.addEventListener('touchmove', handleScroll);
    
    // Click hint to scroll to bottom
    scrollHint.addEventListener('click', () => {
        scrollToBottomAndShowInput();
    });
    
    // Touch/tap hint to scroll to bottom (mobile)
    scrollHint.addEventListener('touchstart', (e) => {
        e.preventDefault();
        scrollToBottomAndShowInput();
    });
    
    // Also make the hint work with keyboard
    scrollHint.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            scrollToBottomAndShowInput();
        }
    });
    
    debugLog('Smart input system initialized');
}

// Enhanced scroll to bottom function that ensures input is visible
function scrollToBottomAndShowInput() {
    scrollToBottom();
    setTimeout(() => {
        const inputContainer = document.querySelector('.chat-input-container');
        const scrollHint = document.getElementById('scrollHint');
        const messagesContainer = document.getElementById('messagesContainer');
        
        if (inputContainer && scrollHint && messagesContainer) {
            isInputVisible = true;
            inputContainer.classList.remove('hidden-input');
            scrollHint.classList.remove('visible');
            messagesContainer.classList.add('input-visible');
        }
    }, 100);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeChat();
    initializeSmartInput();
});

// Handle window resize to maintain scroll position
window.addEventListener('resize', function() {
    setTimeout(scrollToBottom, 100);
});

// Handle orientation change on mobile devices
window.addEventListener('orientationchange', function() {
    setTimeout(scrollToBottom, 300);
});

// Expose functions to global scope for console access
window.smutWriter = {
    clearHistory: clearChatHistory,
    exportHistory: exportChatHistory,
    importHistory: importChatHistory,
    getStorageInfo: () => {
        const chatHistory = loadFromLocalStorage(STORAGE_KEYS.CHAT_HISTORY, []);
        const conversationMessages = loadFromLocalStorage(STORAGE_KEYS.CONVERSATION_MESSAGES, []);
        const lastSaveTime = loadFromLocalStorage(STORAGE_KEYS.LAST_SAVE_TIME);
        
        return {
            totalMessages: chatHistory.length,
            conversationLength: conversationMessages.length,
            lastSaved: lastSaveTime,
            storageUsed: JSON.stringify({chatHistory, conversationMessages}).length + ' characters'
        };
    }
};

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

// Prefill chat input from prompt example if available
window.addEventListener('DOMContentLoaded', () => {
    const prompt = localStorage.getItem('smutwriter_story_prompt');
    if (prompt) {
        const input = document.getElementById('messageInput');
        if (input) {
            input.value = prompt;
            input.focus();
        }
        localStorage.removeItem('smutwriter_story_prompt');
    }
});

// ... existing code ... 
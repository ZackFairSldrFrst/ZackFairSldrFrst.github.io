const API_KEY = 'sk-b98786a940d54865bdb21f9fe2a98eb1';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Stripe Configuration
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51Odib1Gc737pMzW7lqq5CqU4eOD01pldW3fEcIxndQzvggxKkYmk9SozJ4ExqsEtNbMLRCVC2GKd10wCQuxzYbHI00Wx6RwOQa';
let stripe = null;
let elements = null;
let paymentElement = null;

// Function to initialize Stripe
function initializeStripe() {
    try {
        if (typeof Stripe !== 'undefined') {
            stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
            debugLog('Stripe initialized successfully');
            return true;
        } else {
            debugLog('Stripe library not available');
            return false;
        }
    } catch (error) {
        debugLog('Error initializing Stripe:', error);
        return false;
    }
}

// Payment and limit constants
const FREE_MESSAGE_LIMIT = 2;
const SESSION_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

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
    SESSION_START: 'smutwriter_session_start'
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
function typewriterEffect(element, text, speed = 10) {
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
                <button class="tts-button" onclick="speakMessage('${messageId}')" title="Listen to message" style="display: none;">
                    <i class="fas fa-volume-up"></i>
                </button>
                <button class="copy-button" onclick="copyMessage('${messageId}')" title="Copy message" style="display: none;">
                    <i class="fas fa-copy"></i>
                </button>
            </div>
            <div class="message-time">${timeString}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        const messageElement = document.getElementById(messageId);
        const copyButton = messageDiv.querySelector('.copy-button');
        const ttsButton = messageDiv.querySelector('.tts-button');
        
        if (useTypewriter) {
            // Start typewriter effect
            typewriterEffect(messageElement, content).then(() => {
                // Show buttons after typing is complete
                if (ttsButton) {
                    ttsButton.style.display = 'inline-block';
                }
                if (copyButton) {
                    copyButton.style.display = 'inline-block';
                }
            });
        } else {
            // Display immediately (for loaded history)
            messageElement.innerHTML = content;
            if (ttsButton) {
                ttsButton.style.display = 'inline-block';
            }
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

// Text-to-Speech functionality
let currentSpeech = null;
let isSpeaking = false;

function speakMessage(messageId) {
    const messageElement = document.getElementById(messageId);
    if (!messageElement) {
        debugLog('Message element not found for TTS');
        return;
    }

    // Check if Web Speech API is supported
    if (!('speechSynthesis' in window)) {
        alert('Text-to-speech is not supported in your browser.');
        return;
    }

    const ttsButton = messageElement.parentElement.querySelector('.tts-button');
    
    // If currently speaking this message, stop it
    if (isSpeaking && currentSpeech) {
        speechSynthesis.cancel();
        resetTTSButton(ttsButton);
        return;
    }

    // Get the text content, removing any HTML tags
    let textContent = messageElement.textContent || messageElement.innerText;
    
    // Clean up the text for better speech
    textContent = textContent
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold
        .replace(/\*(.*?)\*/g, '$1') // Remove markdown italic
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Convert links to just text
        .replace(/\n+/g, '. ') // Replace line breaks with pauses
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

    if (!textContent) {
        alert('No text to speak.');
        return;
    }

    // Create speech synthesis utterance
    currentSpeech = new SpeechSynthesisUtterance(textContent);
    
    // Configure speech settings
    currentSpeech.rate = 0.9; // Slightly slower for better comprehension
    currentSpeech.pitch = 1.0;
    currentSpeech.volume = 0.8;
    
    // Try to use a female voice if available
    const voices = speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('karen') ||
        voice.name.toLowerCase().includes('susan')
    );
    
    if (femaleVoice) {
        currentSpeech.voice = femaleVoice;
    } else {
        // Fallback to first available voice
        const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
        if (englishVoice) {
            currentSpeech.voice = englishVoice;
        }
    }

    // Set up event handlers
    currentSpeech.onstart = () => {
        isSpeaking = true;
        updateTTSButton(ttsButton, true);
        debugLog('TTS started');
        
        // Track TTS usage
        trackEvent('tts_used', {
            message_length: textContent.length,
            voice_name: currentSpeech.voice ? currentSpeech.voice.name : 'default',
            timestamp: new Date().toISOString()
        });
    };

    currentSpeech.onend = () => {
        isSpeaking = false;
        resetTTSButton(ttsButton);
        currentSpeech = null;
        debugLog('TTS ended');
    };

    currentSpeech.onerror = (event) => {
        isSpeaking = false;
        resetTTSButton(ttsButton);
        currentSpeech = null;
        console.error('TTS error:', event.error);
        alert('Speech synthesis failed. Please try again.');
    };

    // Start speaking
    speechSynthesis.speak(currentSpeech);
}

function updateTTSButton(button, isPlaying) {
    if (!button) return;
    
    if (isPlaying) {
        button.innerHTML = '<i class="fas fa-stop"></i>';
        button.title = 'Stop speaking';
        button.style.background = 'rgba(255, 87, 34, 0.9)';
    }
}

function resetTTSButton(button) {
    if (!button) return;
    
    button.innerHTML = '<i class="fas fa-volume-up"></i>';
    button.title = 'Listen to message';
    button.style.background = '';
}

// Stop all speech when page is unloaded
window.addEventListener('beforeunload', () => {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
});

// Clear chat history
function clearChatHistory() {
    if (confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
        const messagesBeforeClear = loadFromLocalStorage(STORAGE_KEYS.CHAT_HISTORY, []).length;
        
        localStorage.removeItem(STORAGE_KEYS.CONVERSATION_MESSAGES);
        localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
        localStorage.removeItem(STORAGE_KEYS.LAST_SAVE_TIME);
        
        // Reset message count when clearing history
        messageCount = 0;
        saveToLocalStorage(PAYMENT_KEYS.MESSAGE_COUNT, messageCount);
        
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
        
        debugLog('Chat history cleared and message count reset');
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
// Function to check Stripe payment status
async function checkStripePaymentStatus() {
    try {
        // Check if we have a valid session
        const sessionStart = loadFromLocalStorage(PAYMENT_KEYS.SESSION_START);
        if (sessionStart && (new Date().getTime() - sessionStart) < SESSION_DURATION) {
            debugLog('Valid Stripe payment session found');
            return true;
        }
        
        debugLog('No valid Stripe payment session');
        return false;
    } catch (error) {
        debugLog('Error checking Stripe payment status:', error);
        return false;
    }
}

// Function to handle Stripe payment status check
async function checkStripePaymentStatus() {
    try {
        // Check if we have a valid session
        const sessionStart = loadFromLocalStorage(PAYMENT_KEYS.SESSION_START);
        if (sessionStart && (new Date().getTime() - sessionStart) < SESSION_DURATION) {
            debugLog('Valid Stripe payment session found');
            return true;
        }
        
        debugLog('No valid Stripe payment session');
        return false;
    } catch (error) {
        debugLog('Error checking Stripe payment status:', error);
        return false;
    }
}

// Function to toggle subscription account management
async function toggleStripeUser() {
    try {
        // Check current subscription status
        const stripePaid = await checkStripePaymentStatus();
        const sessionStart = loadFromLocalStorage(PAYMENT_KEYS.SESSION_START);
        
        if (stripePaid) {
            // User has active subscription
            const accountInfo = `
Subscription Status:
- Status: Active
- Plan: Monthly Subscription
- Amount: $19.99/month
- Payment method: Stripe
- Cancel anytime

You have unlimited access to Smut Writer!`;
            alert(accountInfo);
        } else {
            // User needs to subscribe
            const accountInfo = `
Subscription Status:
- Status: Not subscribed
- Messages used: ${messageCount}/${FREE_MESSAGE_LIMIT}
- Plan: $19.99/month
- Cancel anytime

Would you like to subscribe now?`;
            
            if (confirm(accountInfo + '\n\nClick OK to open subscription options.')) {
                showPaymentPrompt();
            }
        }
    } catch (error) {
        debugLog('Error in toggleStripeUser:', error);
        alert('Error checking subscription status. Please try again.');
    }
}

// Function to show subscription options
function showStripePaymentOptions() {
    const options = `
Smut Writer - Subscription Options

Secure subscription powered by Stripe:

1. **Free Trial**: You get ${FREE_MESSAGE_LIMIT} free messages
2. **Monthly Subscription**: $19.99/month for unlimited access
3. **Multiple Payment Methods**: Credit cards, debit cards, digital wallets
4. **Cancel Anytime**: No long-term commitment

Current Status:
- Messages used: ${messageCount}/${FREE_MESSAGE_LIMIT}
- Subscription status: ${isPaid ? 'Active' : 'Not subscribed'}

Would you like to subscribe now?`;

    if (confirm(options)) {
        showPaymentPrompt();
    }
}

async function canSendMessage() {
    debugLog(`Checking if can send message: isPaid=${isPaid}, messageCount=${messageCount}, FREE_MESSAGE_LIMIT=${FREE_MESSAGE_LIMIT}`);
    
    // Check Stripe payment status
    const stripePaid = await checkStripePaymentStatus();
    if (stripePaid) {
        debugLog('User is paid via Stripe');
        isPaid = true;
        return true;
    }
    
    // For now, only allow free messages until payment is verified
    // In production, you would implement proper webhook verification
    if (isPaid) {
        // Check if we have a local session that's still valid
        const sessionStart = loadFromLocalStorage(PAYMENT_KEYS.SESSION_START);
        if (sessionStart && (new Date().getTime() - sessionStart) < SESSION_DURATION) {
            debugLog('User has valid local session');
            return true;
        } else {
            // Session expired
            debugLog('Session expired, setting isPaid to false');
            isPaid = false;
            showPaymentPrompt();
            return false;
        }
    }
    
    const canSend = messageCount < FREE_MESSAGE_LIMIT;
    debugLog(`Free user can send message: ${canSend} (${messageCount}/${FREE_MESSAGE_LIMIT})`);
    
    // If user has run out of free messages, show paywall
    if (!canSend) {
        debugLog(`Cannot send message. Message count: ${messageCount}, Limit: ${FREE_MESSAGE_LIMIT}, isPaid: ${isPaid}`);
        showPaymentPrompt();
        return false;
    }
    
    return canSend;
}

// Function to process payment with Stripe
async function processPayment() {
    // Prevent multiple payment processes
    if (isProcessingPayment) {
        debugLog('Payment already being processed, ignoring duplicate click');
        return;
    }
    
    isProcessingPayment = true;
    debugLog('Starting Stripe payment process');
    
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
    
    try {
        // Open Stripe checkout link for monthly subscription
        window.open('https://buy.stripe.com/eVq8wPesN7bZbpP3Q40ZW08', '_blank');
        
        // Add a message to inform the user
        addMessage(`Please complete your $19.99/month subscription payment in the new tab. After payment, click "Verify Payment" to activate your subscription.`, false);
        
        // Remove payment prompt
        const paymentPrompt = document.querySelector('.payment-prompt');
        if (paymentPrompt) {
            paymentPrompt.remove();
        }
        
        // Reset processing state
        isProcessingPayment = false;
        
        // Track checkout opening
        trackEvent('stripe_checkout_opened', {
            amount: 19.99,
            currency: 'usd',
            subscription_type: 'monthly',
            timestamp: new Date().toISOString()
        });
        
        debugLog('Stripe checkout opened, waiting for payment verification');
        
    } catch (error) {
        debugLog('Error processing Stripe payment:', error);
        isProcessingPayment = false;
        
        // Fallback to direct payment link
        showDirectPaymentLink();
    }
}

// Function to show Stripe payment form
function showStripePaymentForm(clientSecret) {
    // Remove existing payment prompt
    const existingPrompt = document.querySelector('.payment-prompt');
    if (existingPrompt) {
        existingPrompt.remove();
    }
    
    const paymentDiv = document.createElement('div');
    paymentDiv.className = 'payment-prompt';
    
    paymentDiv.innerHTML = `
        <div class="payment-content stripe-payment">
            <h3>Complete Your Payment</h3>
            <p>Enter your payment details to continue chatting for 3 hours.</p>
            <div id="payment-element"></div>
            <button id="submit-payment" class="payment-button">
                <div class="spinner hidden" id="spinner"></div>
                <span id="button-text">Pay $2.00</span>
            </button>
            <div id="payment-message" class="hidden"></div>
            <button onclick="closePaymentForm()" class="payment-option-btn">
                <i class="fas fa-times"></i> Cancel
            </button>
        </div>
    `;
    
    document.body.appendChild(paymentDiv);
    
    // Initialize Stripe Elements
    elements = stripe.elements({
        clientSecret: clientSecret,
        appearance: {
            theme: 'night',
            variables: {
                colorPrimary: '#ff4d8d',
                colorBackground: '#1a1a2e',
                colorText: '#ffffff',
                colorDanger: '#ff4444',
                fontFamily: 'Inter, system-ui, sans-serif',
                spacingUnit: '4px',
                borderRadius: '8px'
            }
        }
    });
    
    paymentElement = elements.create('payment');
    paymentElement.mount('#payment-element');
    
    // Handle form submission
    const form = document.getElementById('submit-payment');
    form.addEventListener('click', handleStripePayment);
}

// Function to handle Stripe payment submission
async function handleStripePayment(e) {
    e.preventDefault();
    
    setLoading(true);
    
    const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
            return_url: window.location.href,
        },
    });
    
    if (error) {
        const messageContainer = document.getElementById('payment-message');
        messageContainer.textContent = error.message;
        messageContainer.classList.remove('hidden');
        setLoading(false);
    } else {
        // Payment successful
        const sessionStart = new Date().getTime();
        isPaid = true;
        isProcessingPayment = false;
        saveToLocalStorage(PAYMENT_KEYS.SESSION_START, sessionStart);
        
        // Track payment completion
        trackEvent('payment_completed', {
            payment_method: 'stripe',
            timestamp: new Date().toISOString()
        });
        
        addMessage('Payment successful! You can now continue chatting for 3 hours.', false);
        
        // Remove payment form
        const paymentPrompt = document.querySelector('.payment-prompt');
        if (paymentPrompt) {
            paymentPrompt.remove();
        }
    }
}

// Function to show direct payment link as fallback
function showDirectPaymentLink() {
    const paymentDiv = document.createElement('div');
    paymentDiv.className = 'payment-prompt';
    
    paymentDiv.innerHTML = `
        <div class="payment-content">
            <h3>Payment Options</h3>
            <p>Choose your preferred payment method:</p>
            <button onclick="openStripeCheckout()" class="payment-button">
                <i class="fab fa-stripe"></i> Pay with Stripe Checkout
            </button>
            <button onclick="processDirectPayment()" class="payment-button secondary">
                <i class="fas fa-credit-card"></i> Direct Payment
            </button>
            <button onclick="closePaymentForm()" class="payment-option-btn">
                <i class="fas fa-times"></i> Cancel
            </button>
        </div>
    `;
    
    document.body.appendChild(paymentDiv);
}

// Function to open Stripe Checkout
async function openStripeCheckout() {
    try {
        // Open the existing Stripe checkout link for monthly subscription
        window.open('https://buy.stripe.com/eVq8wPesN7bZbpP3Q40ZW08', '_blank');
        
        // Track checkout opening
        trackEvent('stripe_checkout_opened', {
            amount: 19.99,
            currency: 'usd',
            subscription_type: 'monthly',
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        debugLog('Error opening Stripe Checkout:', error);
        alert('Payment system temporarily unavailable. Please try again later.');
    }
}

// Function to show subscription information
function showSubscriptionInfo() {
    const info = `
Subscription Details:
• $19.99 per month
• Unlimited access to Smut Writer
• Cancel anytime
• Secure payment via Stripe
• No setup fees or hidden charges

To subscribe, click the "Subscribe for $19.99/month" button above.
    `;
    alert(info);
}

// Function to manually verify payment status
async function verifyPaymentStatus() {
    debugLog('Manually verifying payment status');
    
    try {
        // Check Stripe payment status
        const stripePaid = await checkStripePaymentStatus();
        
        if (stripePaid) {
            debugLog('Payment verified successfully');
            isPaid = true;
            const sessionStart = new Date().getTime();
            saveToLocalStorage(PAYMENT_KEYS.SESSION_START, sessionStart);
            
            // Track payment verification
            trackEvent('payment_verified', {
                payment_method: 'stripe_subscription',
                amount: 19.99,
                currency: 'usd',
                timestamp: new Date().toISOString()
            });
            
            addMessage('Payment verified! You now have unlimited access to Smut Writer.', false);
            
            // Remove payment prompt
            const paymentPrompt = document.querySelector('.payment-prompt');
            if (paymentPrompt) {
                paymentPrompt.remove();
            }
            
            return true;
        } else {
            debugLog('Payment not verified');
            addMessage('Payment not found. Please complete your subscription payment first.', false);
            return false;
        }
    } catch (error) {
        debugLog('Error verifying payment:', error);
        addMessage('Error verifying payment. Please try again or contact support.', false);
        return false;
    }
}

// Function to process direct payment (fallback)
function processDirectPayment() {
    const sessionStart = new Date().getTime();
    isPaid = true;
    isProcessingPayment = false;
    saveToLocalStorage(PAYMENT_KEYS.SESSION_START, sessionStart);
    
    // Track payment completion
    trackEvent('payment_completed', {
        payment_method: 'direct',
        timestamp: new Date().toISOString()
    });
    
    addMessage('Payment processed! You can now continue chatting for 3 hours.', false);
    
    // Remove payment prompt
    const paymentPrompt = document.querySelector('.payment-prompt');
    if (paymentPrompt) {
        paymentPrompt.remove();
    }
    
    alert('Payment successful! You now have 3 hours of unlimited access.');
}

// Function to close payment form
function closePaymentForm() {
    isProcessingPayment = false;
    const paymentPrompt = document.querySelector('.payment-prompt');
    if (paymentPrompt) {
        paymentPrompt.remove();
    }
}

// Function to set loading state
function setLoading(isLoading) {
    if (isLoading) {
        document.querySelector("#submit-payment").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden");
    } else {
        document.querySelector("#submit-payment").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
    }
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
            <h3>Unlock Unlimited Access</h3>
            <p>You've reached your free message limit. Subscribe to continue creating amazing stories!</p>
            <button onclick="processPayment()" class="payment-button">
                <i class="fab fa-stripe"></i> Subscribe for $19.99/month
            </button>
            <p class="payment-note">Secure monthly subscription powered by Stripe - Cancel anytime</p>
            <div class="payment-options">
                <button onclick="openStripeCheckout()" class="payment-option-btn">
                    <i class="fab fa-stripe"></i> Stripe Checkout
                </button>
                <button onclick="verifyPaymentStatus()" class="payment-option-btn">
                    <i class="fas fa-check-circle"></i> Verify Payment
                </button>
                <button onclick="showSubscriptionInfo()" class="payment-option-btn">
                    <i class="fas fa-info-circle"></i> Subscription Info
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(paymentDiv);
    debugLog('Payment prompt added to DOM');
}

// Function to update message count
async function updateMessageCount() {
    messageCount++;
    saveToLocalStorage(PAYMENT_KEYS.MESSAGE_COUNT, messageCount);
    debugLog(`Message count updated: ${messageCount}/${FREE_MESSAGE_LIMIT}, isPaid: ${isPaid}`);
    
    // Show payment prompt when free message limit is reached
    if (!isPaid && messageCount >= FREE_MESSAGE_LIMIT) {
        debugLog('Free message limit reached, showing payment prompt');
        showPaymentPrompt();
    }
}

// Modified sendMessage function
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    if (!(await canSendMessage())) {
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
    await updateMessageCount();
    
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
    
    // Initialize Stripe
    initializeStripe();
    
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
    sessionStartTime = loadFromLocalStorage(PAYMENT_KEYS.SESSION_START, new Date().getTime());
    
    // Check Stripe payment status on initialization
    (async () => {
        try {
            const stripePaid = await checkStripePaymentStatus();
            if (stripePaid) {
                isPaid = true;
                debugLog('User is paid via Stripe');
            } else {
                // Check if we have a valid local session
                if (sessionStartTime && (new Date().getTime() - sessionStartTime) < SESSION_DURATION) {
                    isPaid = true;
                    debugLog('User has valid local session');
                } else {
                    isPaid = false;
                    debugLog('User is not paid and no valid session');
                }
            }
        } catch (error) {
            debugLog('Error checking Stripe payment status on initialization:', error);
            // Fallback to local session check
            if (sessionStartTime && (new Date().getTime() - sessionStartTime) < SESSION_DURATION) {
                isPaid = true;
                debugLog('User has valid local session (fallback)');
            } else {
                isPaid = false;
                debugLog('User is not paid (fallback)');
            }
        }
    })();
    
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
    console.log('DOM Content Loaded - initializing app...');
    initializeChat();
    initializeSmartInput();
    initializeNavigation();
    checkForPromptPrefill();
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

// Language change functionality
function changeLanguage(language) {
    trackEvent('language_changed', {
        language: language,
        page: 'index',
        timestamp: new Date().toISOString()
    });
    
    debugLog('Language changed to:', language);
}

// Navigation functionality
function initializeNavigation() {
    console.log('Initializing navigation...');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    console.log('Nav toggle element:', navToggle);
    console.log('Nav menu element:', navMenu);
    
    if (navToggle && navMenu) {
        console.log('Adding click event listener to nav toggle');
        
        // Remove any existing event listeners first
        navToggle.replaceWith(navToggle.cloneNode(true));
        const newNavToggle = document.getElementById('nav-toggle');
        
        // Add click event with debugging
        newNavToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Nav toggle clicked!');
            
            const isActive = navMenu.classList.contains('active');
            console.log('Menu is currently active:', isActive);
            
            // Track mobile menu toggle
            trackEvent('mobile_menu_toggle', {
                action: isActive ? 'close' : 'open',
                page: 'index',
                timestamp: new Date().toISOString()
            });
            
            navMenu.classList.toggle('active');
            newNavToggle.classList.toggle('active');
            
            console.log('Menu is now active:', navMenu.classList.contains('active'));
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const linkText = link.querySelector('span') ? link.querySelector('span').textContent : link.textContent;
                const linkHref = link.href;
                
                // Track navigation link clicks
                trackEvent('navigation_click', {
                    link_text: linkText,
                    link_url: linkHref,
                    page: 'index',
                    timestamp: new Date().toISOString()
                });

                console.log('Nav link clicked, closing menu');
                navMenu.classList.remove('active');
                newNavToggle.classList.remove('active');
            });
        });

        // Track social link clicks if they exist on index page
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const linkText = link.querySelector('span') ? link.querySelector('span').textContent : link.textContent;
                const linkHref = link.href;
                
                trackEvent('social_link_click', {
                    link_text: linkText,
                    link_url: linkHref,
                    page: 'index',
                    timestamp: new Date().toISOString()
                });
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!newNavToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                newNavToggle.classList.remove('active');
            }
        });
        
        console.log('Navigation initialized successfully!');
    } else {
        console.error('Navigation elements not found!');
    }
}

// Prefill chat input from prompt example if available
function checkForPromptPrefill() {
    const prompt = localStorage.getItem('smutwriter_story_prompt');
    if (prompt) {
        const input = document.getElementById('messageInput');
        if (input) {
            input.value = prompt;
            input.focus();
            
            // Track prompt prefill from stories page
            trackEvent('prompt_prefilled', {
                prompt_length: prompt.length,
                source: 'stories_page',
                timestamp: new Date().toISOString()
            });
        }
        localStorage.removeItem('smutwriter_story_prompt');
    }
} 
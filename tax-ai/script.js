const API_KEY = 'sk-05df740662cc4782ac9877bf3bf59041';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Google Analytics helper functions
function trackEvent(eventName, category, label, value = 1, customParams = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: category,
            event_label: label,
            value: value,
            ...customParams
        });
    }
}

function trackPageView(pageName) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: pageName,
            page_location: window.location.href
        });
    }
}

function trackButtonClick(buttonName, location) {
    trackEvent('button_click', 'engagement', buttonName, 1, { location: location });
}

function trackScrollDepth(percentage) {
    trackEvent('scroll_depth', 'engagement', `${percentage}%`, percentage);
}

// Track scroll depth
let scrollDepthTracker = {
    25: false,
    50: false,
    75: false,
    100: false
};

function initializeScrollDepthTracking() {
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);
        
        Object.keys(scrollDepthTracker).forEach(depth => {
            if (scrollPercent >= depth && !scrollDepthTracker[depth]) {
                scrollDepthTracker[depth] = true;
                trackScrollDepth(depth);
            }
        });
    });
}

const chatInput = document.getElementById('chatInput');
const chatSendButton = document.getElementById('chatSendButton');
const chatMessages = document.getElementById('chatMessages');
const chatWidget = document.getElementById('chatWidget');
const chatBubble = document.getElementById('chatBubble');
const chatWindow = document.getElementById('chatWindow');
const chatMinimize = document.getElementById('chatMinimize');
const chatClose = document.getElementById('chatClose');
const bubbleClose = document.getElementById('bubbleClose');

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
            
            // Track tab click
            if (typeof gtag !== 'undefined') {
                gtag('event', 'tab_click', {
                    event_category: 'navigation',
                    event_label: targetTab,
                    value: 1
                });
            }
            
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
            const isAnnual = !toggleBtn.classList.contains('active');
            
            // Track pricing toggle
            if (typeof gtag !== 'undefined') {
                gtag('event', 'pricing_toggle', {
                    event_category: 'engagement',
                    event_label: isAnnual ? 'annual' : 'monthly',
                    value: 1
                });
            }
            
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
            
            // Track navigation clicks
            if (typeof gtag !== 'undefined') {
                gtag('event', 'navigation_click', {
                    event_category: 'navigation',
                    event_label: targetId,
                    value: 1
                });
            }
            
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

// Function to add message to chat
function addMessageToChat(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = isUser ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const text = document.createElement('div');
    text.className = 'message-text';
    text.textContent = message;
    
    content.appendChild(text);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatMessages.appendChild(messageDiv);
    messageDiv.scrollIntoView({ behavior: 'smooth' });
}

// Function to show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = '<i class="fas fa-robot"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const text = document.createElement('div');
    text.className = 'message-text';
    text.innerHTML = `
        <div class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <span>Analyzing your tax question...</span>
    `;
    
    content.appendChild(text);
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(content);
    
    chatMessages.appendChild(typingDiv);
    typingDiv.scrollIntoView({ behavior: 'smooth' });
}

// Function to remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Function to enable/disable send button
function toggleSendButton() {
    const hasText = chatInput.value.trim().length > 0;
    chatSendButton.disabled = !hasText;
}

// Chat widget management functions
function openChatWidget() {
    // Track chat widget open
    if (typeof gtag !== 'undefined') {
        gtag('event', 'chat_open', {
            event_category: 'engagement',
            event_label: 'chat_widget',
            value: 1
        });
    }
    
    chatBubble.style.display = 'none';
    chatWindow.classList.add('active');
    if (chatInput) {
        setTimeout(() => chatInput.focus(), 100);
    }
}

function closeChatWidget() {
    // Track chat widget close
    if (typeof gtag !== 'undefined') {
        gtag('event', 'chat_close', {
            event_category: 'engagement',
            event_label: 'chat_widget',
            value: 1
        });
    }
    
    chatWindow.classList.remove('active');
    chatBubble.style.display = 'flex';
}

function minimizeChatWidget() {
    chatWindow.classList.remove('active');
    chatBubble.style.display = 'flex';
}

function hideChatWidget() {
    chatWidget.style.display = 'none';
}

// Function to format the response (plain text with basic formatting)
function formatResponse(text) {
    // Clean markdown formatting while preserving readable structure
    text = text.replace(/\*\*([^*]+)\*\*/g, '$1')  // Remove bold formatting
               .replace(/__([^_]+)__/g, '$1')      // Remove bold formatting
               .replace(/\*([^*]+)\*/g, '$1')      // Remove italic formatting
               .replace(/_([^_]+)_/g, '$1')        // Remove italic formatting
               .replace(/`([^`]+)`/g, '$1')        // Remove inline code formatting
               .replace(/```[\s\S]*?```/g, function(match) {
                   return match.replace(/```/g, '').trim();
               });                                 // Remove code block formatting but keep content

    // Clean up list formatting
    text = text.replace(/^\s*[-*]\s+/gm, '• ');    // Convert markdown bullets to bullet points
    text = text.replace(/^\s*\d+\.\s+/gm, function(match) {
        return match.replace(/\d+\./, '•');       // Convert numbered lists to bullet points
    });

    // Clean up headers while preserving structure
    text = text.replace(/^#{1,6}\s+(.*)$/gm, '\n$1\n');

    // Remove extra whitespace but preserve line breaks for readability
    text = text.replace(/\n{3,}/g, '\n\n');
    text = text.trim();

    return text;
}

// Function to handle chat messages
async function handleChatMessage(query) {
    if (!query) {
        return;
    }

    // Track chat message sent
    if (typeof gtag !== 'undefined') {
        gtag('event', 'chat_message_sent', {
            event_category: 'engagement',
            event_label: 'ai_chat',
            custom_parameters: {
                message_length: query.length,
                conversation_length: conversationMessages.length
            }
        });
    }

    // Add user message to chat
    addMessageToChat(query, true);
    
    // Clear input and disable send button
    chatInput.value = '';
    toggleSendButton();
    
    // Show typing indicator
    showTypingIndicator();
    
    debugLog('Starting chat with query:', query);

    try {
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
                    content: `You are TaxAI, an advanced AI tax assistant. You are having a friendly but professional conversation with a tax professional. Your responses should be:

CONVERSATIONAL & ENGAGING:
- Use a warm, professional tone
- Ask follow-up questions when appropriate
- Acknowledge the user's specific situation
- Keep responses focused and digestible

EXPERT & AUTHORITATIVE:
- Provide expert-level tax guidance
- Reference specific tax code sections when relevant
- Use confident, professional language
- Include practical implementation steps

CONCISE BUT COMPREHENSIVE:
- Keep responses under 300 words when possible
- Cover the key points without overwhelming
- Use bullet points for clarity when helpful
- Focus on actionable insights

COMPLIANCE-FOCUSED:
- Mention important deadlines and requirements
- Highlight potential risks or considerations
- Note documentation needs
- Include relevant forms when applicable

Remember: You're chatting with a tax professional who values expertise and efficiency. Be helpful, accurate, and personable.`
                },
                ...conversationMessages
            ],
            temperature: 0.7,
            max_tokens: 800
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
            
            // Track successful AI response
            if (typeof gtag !== 'undefined') {
                gtag('event', 'chat_ai_response_received', {
                    event_category: 'engagement',
                    event_label: 'ai_chat_success',
                    custom_parameters: {
                        response_length: aiResponse.length,
                        conversation_length: conversationMessages.length + 1
                    }
                });
            }
            
            // Add AI response to conversation
            conversationMessages.push({
                role: 'assistant',
                content: aiResponse
            });

            // Remove typing indicator and add AI response
            removeTypingIndicator();
            const formattedResponse = formatResponse(aiResponse);
            addMessageToChat(formattedResponse, false);
            
            debugLog('Chat completed successfully');
        } else {
            throw new Error('No response generated');
        }

    } catch (error) {
        debugLog('Chat error:', error);
        
        // Track chat error
        if (typeof gtag !== 'undefined') {
            gtag('event', 'chat_error', {
                event_category: 'error',
                event_label: 'ai_chat_failure',
                custom_parameters: {
                    error_message: error.message,
                    conversation_length: conversationMessages.length
                }
            });
        }
        
        removeTypingIndicator();
        addMessageToChat('Sorry, I\'m having trouble connecting right now. Please try again in a moment.', false);
    }
}

// Event listeners for chat functionality
if (chatSendButton) {
    chatSendButton.addEventListener('click', () => {
        const query = chatInput.value.trim();
        if (query) {
            handleChatMessage(query);
        }
    });
}

if (chatInput) {
    chatInput.addEventListener('input', toggleSendButton);
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const query = chatInput.value.trim();
            if (query) {
                handleChatMessage(query);
            }
        }
    });
}

// Floating chat widget event listeners
if (chatBubble) {
    chatBubble.addEventListener('click', (e) => {
        // Don't open if clicking the close button
        if (!e.target.closest('.bubble-close')) {
            openChatWidget();
        }
    });
}

if (chatMinimize) {
    chatMinimize.addEventListener('click', minimizeChatWidget);
}

if (chatClose) {
    chatClose.addEventListener('click', closeChatWidget);
}

if (bubbleClose) {
    bubbleClose.addEventListener('click', (e) => {
        e.stopPropagation();
        hideChatWidget();
    });
}

// Function to open typeform
function openTypeform() {
    // Track typeform click event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'typeform_open', {
            event_category: 'engagement',
            event_label: 'typeform_signup',
            value: 1
        });
    }
    window.open('https://form.typeform.com/to/KIiZ1uuX', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
}

// Mobile menu functions
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    
    if (menu && overlay) {
        const isActive = menu.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
}

function openMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    
    if (menu && overlay) {
        menu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    
    if (menu && overlay) {
        menu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    debugLog('Initializing TaxAI application');
    
    // Track page load
    trackPageView('TaxAI Homepage');
    
    initializeTabs();
    initializePricingToggle();
    initializeMobileMenu();
    initializeSmoothScrolling();
    initializeScrollAnimations();
    initializeScrollDepthTracking();
    
    // Initialize floating chat widget
    if (chatInput && chatSendButton) {
        toggleSendButton(); // Set initial button state
    }
    
    // Show chat bubble by default, then auto-open after a delay
    if (chatBubble && chatWindow) {
        chatBubble.style.display = 'flex';
        chatWindow.classList.remove('active');
        
        // Auto-open chat widget after 2.5 seconds to showcase the AI
        setTimeout(() => {
            openChatWidget();
        }, 2500);
    }
    
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
                    // Track successful form submission
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submit', {
                            event_category: 'engagement',
                            event_label: 'cta_form_success',
                            value: 1
                        });
                    }
                    
                    // Simulate form submission
                    button.textContent = 'Thank you!';
                    button.style.background = 'var(--success-color)';
                    setTimeout(() => {
                        button.textContent = 'Get Free Access';
                        button.style.background = '';
                    }, 2000);
                } else {
                    // Track form validation error
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_error', {
                            event_category: 'error',
                            event_label: 'cta_form_validation',
                            value: 1
                        });
                    }
                    
                    input.style.borderColor = 'var(--danger-color)';
                    setTimeout(() => {
                        input.style.borderColor = '';
                    }, 2000);
                }
            });
        }
    }

    debugLog('TaxAI application initialized successfully');
    
    // Track exit intent
    let exitIntentTracked = false;
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0 && !exitIntentTracked) {
            trackEvent('exit_intent', 'behavior', 'page_exit', 1);
            exitIntentTracked = true;
        }
    });
    
    // Track time on page milestones
    setTimeout(() => trackEvent('time_on_page', 'engagement', '30_seconds', 30), 30000);
    setTimeout(() => trackEvent('time_on_page', 'engagement', '60_seconds', 60), 60000);
    setTimeout(() => trackEvent('time_on_page', 'engagement', '2_minutes', 120), 120000);
    setTimeout(() => trackEvent('time_on_page', 'engagement', '5_minutes', 300), 300000);
    
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            trackEvent('page_visibility', 'behavior', 'page_hidden', 1);
        } else {
            trackEvent('page_visibility', 'behavior', 'page_visible', 1);
        }
    });
}); 
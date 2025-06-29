// Chatbot functionality for Kevin Huizhang CPA
document.addEventListener('DOMContentLoaded', function() {
    // Create chatbot container
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'chatbot-container';
    chatbotContainer.innerHTML = `
        <div id="chatbot-toggle" class="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 z-50">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
        </div>
        
        <div id="chatbot-window" class="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 hidden z-50">
            <div class="bg-primary text-white p-4 rounded-t-lg">
                <div class="flex justify-between items-center">
                    <h3 class="font-semibold">Kevin Hui Zhang CPA</h3>
                    <button id="chatbot-close" class="text-white hover:text-gray-200">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <p class="text-sm opacity-90">How can I help you with your accounting needs?</p>
            </div>
            
            <div id="chatbot-messages" class="p-4 h-64 overflow-y-auto">
                <div class="bg-gray-100 rounded-lg p-3 mb-3">
                    <p class="text-sm text-gray-700">Hello! I'm here to help you with your accounting and tax questions. What would you like to know?</p>
                </div>
            </div>
            
            <div class="p-4 border-t border-gray-200">
                <div class="flex space-x-2">
                    <input type="text" id="chatbot-input" placeholder="Type your message..." class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    <button id="chatbot-send" class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(chatbotContainer);
    
    // Chatbot functionality
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    
    // Toggle chatbot window
    chatbotToggle.addEventListener('click', function() {
        chatbotWindow.classList.toggle('hidden');
        if (!chatbotWindow.classList.contains('hidden')) {
            chatbotInput.focus();
        }
    });
    
    // Close chatbot window
    chatbotClose.addEventListener('click', function() {
        chatbotWindow.classList.add('hidden');
    });
    
    // Send message function
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, 'user');
            chatbotInput.value = '';
            
            // Simulate bot response
            setTimeout(() => {
                const response = getBotResponse(message);
                addMessage(response, 'bot');
            }, 1000);
        }
    }
    
    // Add message to chat
    function addMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `mb-3 ${sender === 'user' ? 'text-right' : ''}`;
        
        const messageBubble = document.createElement('div');
        messageBubble.className = `inline-block p-3 rounded-lg max-w-xs text-sm ${
            sender === 'user' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700'
        }`;
        messageBubble.textContent = message;
        
        messageDiv.appendChild(messageBubble);
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Get bot response based on user input
    function getBotResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('tax') || lowerMessage.includes('taxes')) {
            return "We offer comprehensive tax services including personal and corporate tax returns, tax planning, and CRA representation. Would you like to schedule a consultation?";
        } else if (lowerMessage.includes('accounting') || lowerMessage.includes('bookkeeping')) {
            return "Our accounting services include bookkeeping, financial statements, payroll, and general ledger preparation. We can help set up accounting systems for new businesses too!";
        } else if (lowerMessage.includes('audit') || lowerMessage.includes('review')) {
            return "We provide audit, review, and compilation services for financial statements. These services help ensure accuracy and provide assurance to stakeholders.";
        } else if (lowerMessage.includes('consulting') || lowerMessage.includes('business')) {
            return "Our consulting services include business valuations, entity selection, buying/selling businesses, and estate planning. We help you make informed business decisions.";
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('appointment')) {
            return "You can reach us at 604-288-8171 or kevin@huizhangcpa.ca. We're located at #231 - 8680 Cambie Road, Richmond, BC. Would you like to schedule a consultation?";
        } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('fee')) {
            return "Our fees vary based on the complexity of your needs. We offer transparent pricing and can provide estimates after understanding your specific requirements. Would you like to discuss your needs?";
        } else {
            return "Thank you for your message! I can help you with tax services, accounting, audits, business consulting, and more. What specific service are you interested in?";
        }
    }
    
    // Event listeners
    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}); 
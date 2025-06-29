// Chatbot functionality for Kevin Hui Zhang CPA website
class CPAChatbot {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.apiKey = 'sk-44477fd533454d8c944bd138ceb5b919'; // DeepSeek API key
    this.websiteContext = `
        Kevin Hui Zhang CPA is a professional accounting firm located at 4788 Brentwood Dr, Burnaby, BC V5C 0C5.
        Phone: (236) 863-0386
        Email: kevin@huizhangcpa.ca
        
        Services offered:
        - Audit & Review Services: Financial statement audits, review engagements, compilation reports
        - Tax Services: Personal tax returns, corporate tax returns, GST/HST returns, tax planning
        - Accounting Services: Bookkeeping, financial statements, payroll services, CRA correspondence
        - Consulting Services: Business valuations, entity selection, buying/selling businesses, estate planning
        
        The firm specializes in helping small businesses, corporations, and individuals with their accounting and tax needs.
        Kevin Hui Zhang is a Chartered Professional Accountant with years of experience serving the Burnaby and Lower Mainland area.
    `;
    
    this.init();
  }

  init() {
    this.createChatbotHTML();
    this.bindEvents();
    this.addWelcomeMessage();
  }

  createChatbotHTML() {
    const chatbotHTML = `
        <div id="chatbot-container" class="fixed bottom-4 right-4 z-50">
            <!-- Chat Button -->
            <button id="chatbot-toggle" class="bg-primary hover:bg-opacity-90 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
            </button>

  <!-- Chat Window -->
            <div id="chatbot-window" class="hidden absolute bottom-16 right-0 w-96 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
      <!-- Header -->
            <div class="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
                <h3 class="font-semibold">Kevin Hui Zhang CPA</h3>
                <button id="chatbot-close" class="text-white hover:text-gray-200">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
            </div>

            <!-- Messages -->
            <div id="chatbot-messages" class="flex-1 p-4 overflow-y-auto space-y-4">
      <!-- Messages will be inserted here -->
            </div>

            <!-- Input -->
      <div class="p-4 border-t border-gray-200">
        <div class="flex space-x-2">
                    <input type="text" id="chatbot-input" placeholder="Ask about our services..." class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    <button id="chatbot-send" class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors duration-300">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
        </svg>
      </button>
                    </div>
      </div>
    </div>
  `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
  }

  bindEvents() {
    document.getElementById('chatbot-toggle').addEventListener('click', () => this.toggleChat());
    document.getElementById('chatbot-close').addEventListener('click', () => this.closeChat());
    document.getElementById('chatbot-send').addEventListener('click', () => this.sendMessage());
    document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    const window = document.getElementById('chatbot-window');
    if (this.isOpen) {
      window.classList.remove('hidden');
    } else {
      window.classList.add('hidden');
    }
  }

  closeChat() {
    this.isOpen = false;
    document.getElementById('chatbot-window').classList.add('hidden');
  }

  addWelcomeMessage() {
    this.addMessage('bot', 'Hello! I\'m here to help you with questions about Kevin Hui Zhang CPA\'s services. How can I assist you today?');
  }

  addMessage(sender, text) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`;
    
    const messageBubble = document.createElement('div');
    messageBubble.className = `max-w-xs px-4 py-2 rounded-lg ${
      sender === 'user' 
        ? 'bg-primary text-white' 
        : 'bg-gray-100 text-gray-800'
    }`;
    messageBubble.textContent = text;
    
    messageDiv.appendChild(messageBubble);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    this.messages.push({ sender, text });
  }

  async sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    if (!message) return;

    // Add user message
    this.addMessage('user', message);
    input.value = '';

    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'flex justify-start';
    typingDiv.innerHTML = '<div class="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">Typing...</div>';
    document.getElementById('chatbot-messages').appendChild(typingDiv);
    
    try {
      // Try to use DeepSeek API if key is provided
      if (this.apiKey && this.apiKey !== 'your-openai-api-key-here') {
        const response = await this.callDeepSeekAPI(message);
        document.getElementById('chatbot-messages').removeChild(typingDiv);
        this.addMessage('bot', response);
      } else {
        // Fallback to local responses
        document.getElementById('chatbot-messages').removeChild(typingDiv);
        const response = this.getLocalResponse(message);
        this.addMessage('bot', response);
      }
    } catch (error) {
      document.getElementById('chatbot-messages').removeChild(typingDiv);
      const response = this.getLocalResponse(message);
      this.addMessage('bot', response);
    }
  }

  async callDeepSeekAPI(message) {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant for Kevin Hui Zhang CPA. Use this context to answer questions: ${this.websiteContext}. Keep responses professional, friendly, and under 150 words.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  }

  getLocalResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Service-related questions
    if (lowerMessage.includes('service') || lowerMessage.includes('offer') || lowerMessage.includes('do')) {
      return "We offer comprehensive accounting services including audit & review, tax preparation, bookkeeping, and business consulting. Our services are tailored for small businesses, corporations, and individuals. Would you like to know more about a specific service?";
    }
    
    if (lowerMessage.includes('tax') || lowerMessage.includes('return')) {
      return "We provide complete tax services including personal and corporate tax returns, GST/HST returns, and tax planning. We help minimize your tax liability while ensuring compliance with CRA requirements.";
    }
    
    if (lowerMessage.includes('audit') || lowerMessage.includes('review')) {
      return "Our audit and review services include financial statement audits, review engagements, and compilation reports. We provide independent assurance for stakeholders and help maintain financial transparency.";
    }
    
    if (lowerMessage.includes('bookkeeping') || lowerMessage.includes('accounting')) {
      return "We offer comprehensive bookkeeping services including financial statement preparation, payroll processing, and CRA correspondence. We help maintain accurate financial records for your business.";
    }
    
    if (lowerMessage.includes('consulting') || lowerMessage.includes('business')) {
      return "Our consulting services include business valuations, entity selection, buying/selling businesses, and estate planning. We help you make informed business decisions.";
    }
    
    // Contact information
    if (lowerMessage.includes('contact') || lowerMessage.includes('appointment')) {
      return "You can reach us at (236) 863-0386 or kevin@huizhangcpa.ca. We're located at 4788 Brentwood Dr, Burnaby, BC. Would you like to schedule a consultation?";
    }
    
    if (lowerMessage.includes('address') || lowerMessage.includes('location')) {
      return "We're located at 4788 Brentwood Dr, Burnaby, BC V5C 0C5. We serve clients throughout the Lower Mainland area.";
    }
    
    if (lowerMessage.includes('phone') || lowerMessage.includes('call')) {
      return "You can call us at (236) 863-0386. We're available during business hours and can schedule consultations at your convenience.";
    }
    
    // Pricing and fees
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('fee')) {
      return "Our fees vary based on the complexity of your needs. We offer transparent pricing and can provide estimates after understanding your specific requirements. Would you like to discuss your needs?";
    }
    
    // Experience and qualifications
    if (lowerMessage.includes('experience') || lowerMessage.includes('qualification') || lowerMessage.includes('cpa')) {
      return "Kevin Hui Zhang is a Chartered Professional Accountant with years of experience serving businesses and individuals in the Burnaby and Lower Mainland area. We're committed to providing professional, reliable accounting services.";
    }
    
    // General questions
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! Thank you for your interest in Kevin Hui Zhang CPA. How can I help you with your accounting or tax needs today?";
    }
    
    if (lowerMessage.includes('thank')) {
      return "You're welcome! If you have any other questions about our services, feel free to ask. We're here to help!";
    }
    
    // Default response
    return "Thank you for your question. I'd be happy to help you with information about our accounting and tax services. Could you please provide more specific details about what you're looking for?";
  }
}

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', () => {
  new CPAChatbot();
}); 
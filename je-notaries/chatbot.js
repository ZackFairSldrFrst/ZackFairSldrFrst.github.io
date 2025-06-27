// JE Notaries Chatbot - Sales Assistant
class JENotariesChatbot {
  constructor() {
    this.apiKey = 'sk-44477fd533454d8c944bd138ceb5b919';
    this.isOpen = false;
    this.messages = [];
    this.init();
  }

  init() {
    this.createChatWidget();
    this.addEventListeners();
    this.addWelcomeMessage();
  }

  createChatWidget() {
    // Create chatbot container
    const chatContainer = document.createElement('div');
    chatContainer.id = 'je-chatbot';
    chatContainer.innerHTML = `
      <!-- Chatbot Toggle Button -->
      <div id="chat-toggle" class="fixed bottom-6 right-6 z-50 cursor-pointer transform transition-all duration-300 hover:scale-110">
        <div class="bg-primary hover:bg-opacity-90 text-white rounded-full p-4 shadow-2xl flex items-center space-x-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          <span class="hidden sm:block font-medium">Ask us anything</span>
        </div>
      </div>

      <!-- Chat Window -->
      <div id="chat-window" class="fixed bottom-6 right-6 z-50 w-80 sm:w-96 h-96 bg-white rounded-2xl shadow-2xl transform transition-all duration-300 scale-0 origin-bottom-right border border-gray-200">
        <!-- Header -->
        <div class="bg-primary text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-sm">JE Notaries Assistant</h3>
              <p class="text-xs opacity-90">We're here to help!</p>
            </div>
          </div>
          <button id="chat-close" class="text-white/80 hover:text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Messages Container -->
        <div id="chat-messages" class="flex-1 p-4 overflow-y-auto h-64 space-y-3">
          <!-- Messages will be inserted here -->
        </div>

        <!-- Input Area -->
        <div class="p-4 border-t border-gray-200">
          <div class="flex space-x-2">
            <input 
              type="text" 
              id="chat-input" 
              placeholder="Ask about our services..." 
              class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
            <button 
              id="chat-send" 
              class="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(chatContainer);
  }

  addEventListeners() {
    const toggleBtn = document.getElementById('chat-toggle');
    const closeBtn = document.getElementById('chat-close');
    const sendBtn = document.getElementById('chat-send');
    const input = document.getElementById('chat-input');

    toggleBtn.addEventListener('click', () => this.toggleChat());
    closeBtn.addEventListener('click', () => this.closeChat());
    sendBtn.addEventListener('click', () => this.sendMessage());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }

  toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    const toggleBtn = document.getElementById('chat-toggle');
    
    if (this.isOpen) {
      this.closeChat();
    } else {
      chatWindow.classList.remove('scale-0');
      chatWindow.classList.add('scale-100');
      toggleBtn.style.display = 'none';
      this.isOpen = true;
      document.getElementById('chat-input').focus();
    }
  }

  closeChat() {
    const chatWindow = document.getElementById('chat-window');
    const toggleBtn = document.getElementById('chat-toggle');
    
    chatWindow.classList.remove('scale-100');
    chatWindow.classList.add('scale-0');
    toggleBtn.style.display = 'block';
    this.isOpen = false;
  }

  addWelcomeMessage() {
    const welcomeMessage = {
      type: 'bot',
      content: `👋 Hello! I'm here to help you with all your notarial needs at JE Notaries.

I can answer questions about:
• Real estate transactions & conveyancing
• Estate planning (wills, POAs)
• Document notarization services
• Our contact info & hours
• Scheduling a consultation

What would you like to know?`,
      timestamp: new Date()
    };
    
    this.messages.push(welcomeMessage);
    this.renderMessage(welcomeMessage);
  }

  async sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;

    // Add user message
    const userMessage = {
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    this.messages.push(userMessage);
    this.renderMessage(userMessage);
    input.value = '';

    // Show typing indicator
    this.showTypingIndicator();

    try {
      // Get bot response
      const botResponse = await this.getBotResponse(message);
      this.hideTypingIndicator();
      
      const botMessage = {
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };
      
      this.messages.push(botMessage);
      this.renderMessage(botMessage);
    } catch (error) {
      this.hideTypingIndicator();
      this.renderMessage({
        type: 'bot',
        content: 'I apologize, but I\'m having trouble connecting right now. Please call us directly at 604-288-8171 or email jlamnp@gmail.com for immediate assistance.',
        timestamp: new Date()
      });
    }
  }

  async getBotResponse(userMessage) {
    const systemPrompt = `You are a sales assistant for JE Notaries, a professional notarial services company in Richmond, BC. Your primary goal is to help visitors and convert them into consultation bookings.

COMPANY INFORMATION:
- Business: JE Notaries (partnership between Jeffrey Lam Notary Public Inc. and Elaine Lam Notary Corporation)
- Managing Partner: Elaine Lam
- Experience: 17+ years combined experience
- Address: #231 - 8680 Cambie Road, Richmond, BC V6X 4K1
- Phone: 604-288-8171
- Email: jlamnp@gmail.com
- Fax: 604-800-0282
- Hours: Monday-Friday 10:00 AM – 5:00 PM, Saturday by appointment, Sunday closed
- Languages: English, Mandarin, Cantonese

SERVICES OFFERED:
1. REAL ESTATE TRANSACTIONS:
   - Residential purchases and sales
   - Residential refinancing and mortgages
   - Commercial purchases and sales
   - Business asset purchase and sales
   - Family transfers (separation agreements)
   - Transmission to surviving joint tenant, executor, or administrator
   - Real estate development
   - Remote and alternative signing options available

2. ESTATE PLANNING:
   - Wills
   - Powers of attorney
   - Representation agreements

3. NOTARIZATIONS:
   - Statutory declarations/affidavits
   - Invitation letters
   - Travel consents
   - Certified true copies
   - Executor affidavits for probate applications
   - ICBC statutory declarations
   - Chinese document authentication and apostille services

UNIQUE VALUE PROPOSITIONS:
- Affordable excellence with transparent pricing
- CPA background (Jeffrey) + banking/accounting experience (Elaine)
- Multilingual service (English, Mandarin, Cantonese)
- Flexible scheduling, mobile appointments, remote options
- Network of legal professionals worldwide
- Specialized expertise in complex transactions

SALES APPROACH:
- Be helpful and knowledgeable
- Always try to guide towards scheduling a consultation
- Emphasize expertise, experience, and personalized service
- Mention specific pain points they solve (stress-free process, complex transactions, multilingual needs)
- Create urgency when appropriate (property deadlines, estate planning importance)
- Be conversational but professional

Always end responses by encouraging them to schedule a consultation or contact the office directly. Keep responses concise but informative.`;

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  renderMessage(message) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    
    if (message.type === 'user') {
      messageDiv.className = 'flex justify-end';
      messageDiv.innerHTML = `
        <div class="bg-primary text-white rounded-lg px-3 py-2 max-w-xs text-sm">
          ${this.escapeHtml(message.content)}
        </div>
      `;
    } else {
      messageDiv.className = 'flex justify-start';
      messageDiv.innerHTML = `
        <div class="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 max-w-xs text-sm">
          ${this.formatBotMessage(message.content)}
        </div>
      `;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  showTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'flex justify-start';
    typingDiv.innerHTML = `
      <div class="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 text-sm">
        <div class="flex space-x-1">
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
      </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  formatBotMessage(content) {
    // Convert line breaks to HTML breaks and format bullet points
    return content
      .replace(/\n/g, '<br>')
      .replace(/•/g, '&bull;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  new JENotariesChatbot();
}); 
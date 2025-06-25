const API_KEY = 'sk-44477fd533454d8c944bd138ceb5b919';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

let currentChatId = null;
let isTyping = false;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Initialize chat history
    loadChatHistory();
    if (!currentChatId) {
        showEmptyState();
    }
    
    // Set up input event listener
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            const hasText = this.value.trim().length > 0;
            toggleSendButton(hasText && !isTyping);
        });
    }
});

// Auto-resize textarea
function autoResize(textarea) {
    textarea.style.height = 'auto';
    const maxHeight = window.innerWidth <= 768 ? 120 : 200; // Smaller max height on mobile
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
}

// Handle keyboard shortcuts
function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Use example prompt
function usePrompt(prompt) {
    document.getElementById('messageInput').value = prompt;
    document.getElementById('messageInput').focus();
}

// Start new chat
function startNewChat() {
    currentChatId = generateChatId();
    clearChatContainer();
    updateChatHistory();
    
    // Close sidebar on mobile after starting new chat
    if (window.innerWidth <= 768) {
        closeSidebar();
    }
    
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.focus();
    }
}

// Generate unique chat ID
function generateChatId() {
    return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Clear chat container
function clearChatContainer() {
    const container = document.getElementById('chatContainer');
    if (container) {
        container.innerHTML = '';
    }
    hideEmptyState();
}

// Show empty state
function showEmptyState() {
    const emptyState = document.getElementById('emptyState');
    if (emptyState) {
        emptyState.style.display = 'flex';
    }
}

// Hide empty state
function hideEmptyState() {
    const emptyState = document.getElementById('emptyState');
    if (emptyState) {
        emptyState.style.display = 'none';
    }
}

// Send message
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message || isTyping) return;

    if (!currentChatId) {
        startNewChat();
    }

    // Clear input and disable send button
    input.value = '';
    autoResize(input);
    toggleSendButton(false);

    // Add user message to chat
    addMessage('user', message);
    hideEmptyState();

    // Save user message
    saveMessage(message, 'user');

    // Show typing indicator
    const typingId = addTypingIndicator();
    isTyping = true;

    try {
        // Get chat history for context
        const chatData = getChatData(currentChatId);
        const messages = chatData ? chatData.messages : [];

        // Prepare messages for API
        const apiMessages = messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        // Add current message
        apiMessages.push({ role: 'user', content: message });

        // Call DeepSeek API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: apiMessages,
                temperature: 0.7,
                max_tokens: 2048
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const assistantMessage = data.choices[0].message.content;

        // Remove typing indicator
        removeTypingIndicator(typingId);

        // Add assistant response with typewriter effect
        addMessage('assistant', assistantMessage, true);
        saveMessage(assistantMessage, 'assistant');

        // Update chat title if this is the first exchange
        updateChatTitle(currentChatId, message);

    } catch (error) {
        console.error('Error:', error);
        removeTypingIndicator(typingId);
        addMessage('assistant', 'Sorry, I encountered an error. Please try again.', false);
    } finally {
        isTyping = false;
        toggleSendButton(true);
    }
}

// Toggle send button state
function toggleSendButton(enabled) {
    const button = document.getElementById('sendButton');
    if (button) {
        button.disabled = !enabled;
    }
}

// Add message to chat container
function addMessage(role, content, useTypewriter = false) {
    const container = document.getElementById('chatContainer');
    if (!container) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${role === 'user' ? 'U' : 'AI'}</div>
    `;
    messageDiv.appendChild(contentDiv);
    
    container.appendChild(messageDiv);
    
    if (useTypewriter && role === 'assistant') {
        typewriterEffect(contentDiv, content);
    } else {
        contentDiv.textContent = content;
    }
    
    container.scrollTop = container.scrollHeight;
}

// Typewriter effect for AI responses
function typewriterEffect(element, text) {
    element.textContent = '';
    element.classList.add('typewriter-cursor');
    let i = 0;
    const speed = 30; // milliseconds per character
    
    function typeChar() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            // Auto-scroll as text appears
            const container = document.getElementById('chatContainer');
            container.scrollTop = container.scrollHeight;
            setTimeout(typeChar, speed);
        } else {
            // Remove cursor when typing is complete
            element.classList.remove('typewriter-cursor');
        }
    }
    
    typeChar();
}

// Add typing indicator
function addTypingIndicator() {
    const container = document.getElementById('chatContainer');
    const typingDiv = document.createElement('div');
    const typingId = 'typing_' + Date.now();
    typingDiv.id = typingId;
    typingDiv.className = 'message assistant';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">AI</div>
        <div class="message-content loading">
            <span class="loading-dots"></span>
        </div>
    `;
    
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;
    return typingId;
}

// Remove typing indicator
function removeTypingIndicator(typingId) {
    const typingDiv = document.getElementById(typingId);
    if (typingDiv) {
        typingDiv.remove();
    }
}

// Save message to localStorage
function saveMessage(content, role) {
    const chats = JSON.parse(localStorage.getItem('antiworkgpt_chats') || '{}');
    
    if (!chats[currentChatId]) {
        chats[currentChatId] = {
            id: currentChatId,
            title: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
            messages: [],
            createdAt: new Date().toISOString()
        };
    }
    
    chats[currentChatId].messages.push({
        role,
        content,
        timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('antiworkgpt_chats', JSON.stringify(chats));
    updateChatHistory();
}

// Get chat data
function getChatData(chatId) {
    const chats = JSON.parse(localStorage.getItem('antiworkgpt_chats') || '{}');
    return chats[chatId];
}

// Update chat title
function updateChatTitle(chatId, firstMessage) {
    const chats = JSON.parse(localStorage.getItem('antiworkgpt_chats') || '{}');
    if (chats[chatId] && chats[chatId].messages.length <= 2) {
        chats[chatId].title = firstMessage.substring(0, 50) + (firstMessage.length > 50 ? '...' : '');
        localStorage.setItem('antiworkgpt_chats', JSON.stringify(chats));
        updateChatHistory();
    }
}

// Load chat history
function loadChatHistory() {
    const chats = JSON.parse(localStorage.getItem('antiworkgpt_chats') || '{}');
    const chatArray = Object.values(chats).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const historyDiv = document.getElementById('chatHistory');
    historyDiv.innerHTML = '';
    
    chatArray.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        if (chat.id === currentChatId) {
            chatItem.classList.add('active');
        }
        
        chatItem.innerHTML = `
            <span onclick="loadChat('${chat.id}')" style="flex: 1; overflow: hidden; text-overflow: ellipsis;">${chat.title}</span>
            <button class="delete-chat" onclick="deleteChat('${chat.id}', event)">×</button>
        `;
        
        historyDiv.appendChild(chatItem);
    });
}

// Load specific chat
function loadChat(chatId) {
    currentChatId = chatId;
    const chatData = getChatData(chatId);
    
    if (!chatData) return;
    
    clearChatContainer();
    
    // Load all messages
    chatData.messages.forEach(msg => {
        addMessage(msg.role, msg.content);
    });
    
    updateChatHistory();
    
    // Close sidebar on mobile after selecting a chat
    if (window.innerWidth <= 768) {
        closeSidebar();
    }
}

// Delete chat
function deleteChat(chatId, event) {
    event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this chat?')) {
        const chats = JSON.parse(localStorage.getItem('antiworkgpt_chats') || '{}');
        delete chats[chatId];
        localStorage.setItem('antiworkgpt_chats', JSON.stringify(chats));
        
        if (currentChatId === chatId) {
            currentChatId = null;
            clearChatContainer();
            showEmptyState();
        }
        
        updateChatHistory();
    }
}

// Update chat history display
function updateChatHistory() {
    loadChatHistory();
}

// Mobile sidebar functionality
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const hamburger = document.getElementById('hamburgerMenu');
    
    if (sidebar && overlay && hamburger) {
        const isOpen = sidebar.classList.contains('open');
        
        if (isOpen) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }
}

function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const hamburger = document.getElementById('hamburgerMenu');
    
    if (sidebar && overlay && hamburger) {
        sidebar.classList.add('open');
        overlay.classList.add('show');
        hamburger.classList.add('active');
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const hamburger = document.getElementById('hamburgerMenu');
    
    if (sidebar && overlay && hamburger) {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
        hamburger.classList.remove('active');
    }
}



 
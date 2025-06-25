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
function addMessage(role, content, useTypewriter = false, messageId = null) {
    const container = document.getElementById('chatContainer');
    if (!container) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    if (messageId) {
        messageDiv.setAttribute('data-message-id', messageId);
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'message-actions';
    
    if (role === 'user') {
        actionsDiv.innerHTML = `
            <button class="action-btn edit-btn" onclick="editMessage(this)" title="Edit message">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
            </button>
        `;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${role === 'user' ? 'U' : 'AI'}</div>
        `;
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(actionsDiv);
    } else {
        actionsDiv.innerHTML = `
            <button class="action-btn copy-btn" onclick="copyMessage(this)" title="Copy message">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
            </button>
        `;
        
        // For assistant messages, create a wrapper to hold content and actions
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'message-content-wrapper';
        contentWrapper.appendChild(contentDiv);
        contentWrapper.appendChild(actionsDiv);
        
        messageDiv.innerHTML = `
            <div class="message-avatar">AI</div>
        `;
        messageDiv.appendChild(contentWrapper);
    }
    
    container.appendChild(messageDiv);
    
    if (useTypewriter && role === 'assistant') {
        typewriterEffect(contentDiv, content);
    } else {
        if (role === 'assistant') {
            contentDiv.innerHTML = formatMarkdown(content);
        } else {
            contentDiv.textContent = content;
        }
    }
    
    container.scrollTop = container.scrollHeight;
    return messageDiv;
}

// Format markdown to HTML
function formatMarkdown(text) {
    // Escape HTML first
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
    // Convert markdown to HTML
    html = html
        // Code blocks (```code```)
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        // Inline code (`code`)
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Bold (**text** or __text__)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.*?)__/g, '<strong>$1</strong>')
        // Italic (*text* or _text_)
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/_(.*?)_/g, '<em>$1</em>')
        // Line breaks
        .replace(/\n/g, '<br>');
    
    return html;
}

// Typewriter effect for AI responses
function typewriterEffect(element, text) {
    element.innerHTML = '';
    element.classList.add('typewriter-cursor');
    let i = 0;
    const speed = 15; // milliseconds per character
    const formattedText = formatMarkdown(text);
    
    // Create a temporary element to get plain text for typing
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = formattedText;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    function typeChar() {
        if (i < plainText.length) {
            element.textContent += plainText.charAt(i);
            i++;
            // Auto-scroll as text appears
            const container = document.getElementById('chatContainer');
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
            setTimeout(typeChar, speed);
        } else {
            // Remove cursor and apply formatting when typing is complete
            element.classList.remove('typewriter-cursor');
            element.innerHTML = formattedText;
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

// Copy message functionality
function copyMessage(button) {
    const messageDiv = button.closest('.message');
    const contentDiv = messageDiv.querySelector('.message-content');
    const text = contentDiv.textContent || contentDiv.innerText;
    
    navigator.clipboard.writeText(text).then(() => {
        // Visual feedback
        const originalIcon = button.innerHTML;
        button.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
        `;
        button.style.color = '#10a37f';
        
        setTimeout(() => {
            button.innerHTML = originalIcon;
            button.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    });
}

// Edit message functionality
function editMessage(button) {
    const messageDiv = button.closest('.message');
    const contentDiv = messageDiv.querySelector('.message-content');
    const originalText = contentDiv.textContent || contentDiv.innerText;
    
    // Create textarea for editing
    const textarea = document.createElement('textarea');
    textarea.value = originalText;
    textarea.className = 'edit-textarea';
    textarea.style.cssText = `
        width: 100%;
        min-height: 60px;
        padding: 8px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-family: inherit;
        font-size: inherit;
        line-height: 1.5;
        resize: vertical;
    `;
    
    // Create action buttons
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'edit-actions';
    actionsDiv.style.cssText = `
        display: flex;
        gap: 8px;
        margin-top: 8px;
    `;
    
    actionsDiv.innerHTML = `
        <button class="edit-save-btn" style="
            background-color: #10a37f;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        ">Save & Resend</button>
        <button class="edit-cancel-btn" style="
            background-color: #6b7280;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        ">Cancel</button>
    `;
    
    // Replace content with edit interface
    const originalContent = contentDiv.innerHTML;
    contentDiv.innerHTML = '';
    contentDiv.appendChild(textarea);
    contentDiv.appendChild(actionsDiv);
    
    // Focus textarea
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    
    // Handle save
    actionsDiv.querySelector('.edit-save-btn').addEventListener('click', () => {
        const newText = textarea.value.trim();
        if (newText && newText !== originalText) {
            // Clear subsequent messages (assistant responses)
            clearMessagesAfter(messageDiv);
            
            // Update the message content
            contentDiv.textContent = newText;
            
            // Resend the message
            resendMessage(newText);
        } else {
            // Restore original content
            contentDiv.innerHTML = originalContent;
        }
    });
    
    // Handle cancel
    actionsDiv.querySelector('.edit-cancel-btn').addEventListener('click', () => {
        contentDiv.innerHTML = originalContent;
    });
    
    // Handle Enter key (save) and Escape key (cancel)
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            actionsDiv.querySelector('.edit-save-btn').click();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            actionsDiv.querySelector('.edit-cancel-btn').click();
        }
    });
}

// Clear messages after a specific message
function clearMessagesAfter(messageDiv) {
    let nextSibling = messageDiv.nextElementSibling;
    while (nextSibling) {
        const toRemove = nextSibling;
        nextSibling = nextSibling.nextElementSibling;
        toRemove.remove();
    }
}

// Resend message with new content
async function resendMessage(message) {
    if (isTyping) return;
    
    // Show typing indicator
    const typingId = addTypingIndicator();
    isTyping = true;
    
    try {
        // Get chat history for context (excluding the messages we just cleared)
        const chatData = getChatData(currentChatId);
        const messages = chatData ? chatData.messages : [];
        
        // Find the index of the edited message and remove subsequent messages
        const container = document.getElementById('chatContainer');
        const messageElements = container.querySelectorAll('.message');
        const editedMessageIndex = Array.from(messageElements).findIndex(el => 
            el.querySelector('.message-content').textContent.trim() === message
        );
        
        // Prepare messages for API (up to the edited message)
        const apiMessages = messages.slice(0, editedMessageIndex).map(msg => ({
            role: msg.role,
            content: msg.content
        }));
        
        // Add the edited message
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
        
        // Update localStorage
        updateChatWithEditedMessage(message, assistantMessage);

    } catch (error) {
        console.error('Error:', error);
        removeTypingIndicator(typingId);
        addMessage('assistant', 'Sorry, I encountered an error. Please try again.', false);
    } finally {
        isTyping = false;
        toggleSendButton(true);
    }
}

// Update chat in localStorage after editing
function updateChatWithEditedMessage(editedUserMessage, newAssistantMessage) {
    const chats = JSON.parse(localStorage.getItem('antiworkgpt_chats') || '{}');
    
    if (chats[currentChatId]) {
        // Find the edited message and update from there
        const container = document.getElementById('chatContainer');
        const messageElements = container.querySelectorAll('.message');
        const editedMessageIndex = Array.from(messageElements).findIndex(el => 
            el.classList.contains('user') && 
            el.querySelector('.message-content').textContent.trim() === editedUserMessage
        );
        
        // Update messages array
        const messages = chats[currentChatId].messages;
        
        // Remove messages after the edited one
        chats[currentChatId].messages = messages.slice(0, editedMessageIndex);
        
        // Add the edited user message and new assistant response
        chats[currentChatId].messages.push({
            role: 'user',
            content: editedUserMessage,
            timestamp: new Date().toISOString()
        });
        
        chats[currentChatId].messages.push({
            role: 'assistant',
            content: newAssistantMessage,
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem('antiworkgpt_chats', JSON.stringify(chats));
        updateChatHistory();
    }
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



 
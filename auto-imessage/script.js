// MessageFlow - Smart Text Message CRM
// Author: Assistant
// Description: A comprehensive demo SaaS platform for text message scheduling and CRM

class MessageFlow {
    constructor() {
        this.contacts = [];
        this.messages = [];
        this.currentTab = 'dashboard';
        this.init();
    }

    init() {
        this.initEventListeners();
        this.loadDemoData();
        this.updateDashboard();
        this.setMinDateTime();
    }

    // Event Listeners
    initEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Sidebar buttons
        document.getElementById('new-message-btn').addEventListener('click', () => this.openComposer());
        document.getElementById('ai-generate-btn').addEventListener('click', () => this.openAIModal());
        document.getElementById('add-contact-btn').addEventListener('click', () => this.openContactModal());

        // Header compose button
        document.getElementById('compose-btn').addEventListener('click', () => this.openComposer());
        document.getElementById('new-message-header-btn').addEventListener('click', () => this.openComposer());

        // Modal controls
        this.initModalControls();

        // Form controls
        this.initFormControls();

        // Filter controls
        document.getElementById('filter-btn').addEventListener('click', () => this.toggleFilter());
        document.getElementById('clear-filters').addEventListener('click', () => this.clearFilters());

        // Character counter for message content
        document.getElementById('message-content').addEventListener('input', (e) => {
            document.getElementById('char-count').textContent = e.target.value.length;
        });
    }

    initModalControls() {
        // Composer modal
        document.getElementById('composer-close').addEventListener('click', () => this.closeModal('composer-modal'));
        document.getElementById('composer-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeModal('composer-modal');
        });

        // AI modal
        document.getElementById('ai-modal-close').addEventListener('click', () => this.closeModal('ai-modal'));
        document.getElementById('ai-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeModal('ai-modal');
        });

        // Contact modal
        document.getElementById('contact-modal-close').addEventListener('click', () => this.closeModal('contact-modal'));
        document.getElementById('contact-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeModal('contact-modal');
        });
        document.getElementById('cancel-contact').addEventListener('click', () => this.closeModal('contact-modal'));
    }

    initFormControls() {
        // Message form
        document.getElementById('message-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });

        // Contact form
        document.getElementById('contact-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addContact();
        });

        // Schedule type radio buttons
        document.querySelectorAll('input[name="scheduleType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const scheduleGroup = document.getElementById('schedule-datetime-group');
                if (e.target.value === 'scheduled') {
                    scheduleGroup.style.display = 'block';
                } else {
                    scheduleGroup.style.display = 'none';
                }
            });
        });

        // AI Assistant
        document.getElementById('ai-assist-btn').addEventListener('click', () => this.openAIModal());
        document.getElementById('generate-ai-message').addEventListener('click', () => this.generateAIMessage());
        document.getElementById('regenerate-ai').addEventListener('click', () => this.generateAIMessage());
        document.getElementById('use-ai-message').addEventListener('click', () => this.useAIMessage());

        // AI template selection
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove selected class from all buttons
                document.querySelectorAll('.template-btn').forEach(b => b.classList.remove('selected'));
                // Add selected class to clicked button
                e.target.classList.add('selected');
                
                const template = e.target.dataset.template;
                const customInput = document.getElementById('custom-ai-input');
                
                if (template === 'custom') {
                    customInput.style.display = 'block';
                } else {
                    customInput.style.display = 'none';
                }
            });
        });

        // Save draft
        document.getElementById('save-draft-btn').addEventListener('click', () => this.saveDraft());
    }

    // Tab Management
    switchTab(tabName) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentTab = tabName;

        // Load tab-specific content
        this.loadTabContent(tabName);
    }

    loadTabContent(tabName) {
        switch (tabName) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'messages':
                this.loadMessages();
                break;
            case 'contacts':
                this.loadContacts();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
        }
    }

    // Dashboard
    updateDashboard() {
        // Update stats
        document.getElementById('total-messages').textContent = this.messages.length;
        document.getElementById('total-contacts').textContent = this.contacts.length;
        document.getElementById('scheduled-messages').textContent = 
            this.messages.filter(m => m.status === 'scheduled').length;

        // Update sidebar counts
        document.getElementById('scheduled-count').textContent = 
            this.messages.filter(m => m.status === 'scheduled').length;
        document.getElementById('sent-count').textContent = 
            this.messages.filter(m => m.status === 'sent').length;
        document.getElementById('failed-count').textContent = 
            this.messages.filter(m => m.status === 'failed').length;

        // Load upcoming messages
        this.loadUpcomingMessages();
        this.loadRecentActivity();
    }

    loadUpcomingMessages() {
        const upcomingContainer = document.getElementById('upcoming-messages');
        const upcomingMessages = this.messages
            .filter(m => m.status === 'scheduled')
            .sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime))
            .slice(0, 5);

        if (upcomingMessages.length === 0) {
            upcomingContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-alt"></i>
                    <h3>No upcoming messages</h3>
                    <p>Schedule your first message to get started!</p>
                </div>
            `;
            return;
        }

        upcomingContainer.innerHTML = upcomingMessages.map(message => `
            <div class="message-item">
                <div class="message-info">
                    <div class="message-recipient">${message.recipientName}</div>
                    <div class="message-preview">${message.content}</div>
                    <div class="message-meta">
                        <span>📅 ${this.formatDateTime(message.scheduledTime)}</span>
                    </div>
                </div>
                <div class="message-status ${message.status}">${message.status}</div>
            </div>
        `).join('');
    }

    loadRecentActivity() {
        const activityContainer = document.getElementById('recent-activity');
        const recentMessages = this.messages
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        if (recentMessages.length === 0) {
            activityContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <h3>No recent activity</h3>
                    <p>Your message activity will appear here.</p>
                </div>
            `;
            return;
        }

        activityContainer.innerHTML = recentMessages.map(message => `
            <div class="message-item">
                <div class="message-info">
                    <div class="message-recipient">${message.recipientName}</div>
                    <div class="message-preview">${message.content}</div>
                    <div class="message-meta">
                        <span>📅 ${this.formatDateTime(message.createdAt)}</span>
                    </div>
                </div>
                <div class="message-status ${message.status}">${message.status}</div>
            </div>
        `).join('');
    }

    // Messages
    loadMessages() {
        const container = document.getElementById('messages-container');
        
        if (this.messages.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-envelope"></i>
                    <h3>No messages yet</h3>
                    <p>Create your first message to get started!</p>
                    <button class="btn-primary" onclick="messageFlow.openComposer()">
                        <i class="fas fa-plus"></i> Create Message
                    </button>
                </div>
            `;
            return;
        }

        const sortedMessages = this.messages
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        container.innerHTML = sortedMessages.map(message => `
            <div class="message-item">
                <div class="message-info">
                    <div class="message-recipient">${message.recipientName}</div>
                    <div class="message-preview">${message.content}</div>
                    <div class="message-meta">
                        <span>📞 ${message.recipientPhone}</span>
                        <span>📅 ${this.formatDateTime(message.scheduledTime || message.createdAt)}</span>
                    </div>
                </div>
                <div class="message-status ${message.status}">${message.status}</div>
            </div>
        `).join('');
    }

    // Contacts
    loadContacts() {
        const container = document.getElementById('contacts-grid');
        
        if (this.contacts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-address-book"></i>
                    <h3>No contacts yet</h3>
                    <p>Add your first contact to start messaging!</p>
                    <button class="btn-primary" onclick="messageFlow.openContactModal()">
                        <i class="fas fa-plus"></i> Add Contact
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.contacts.map(contact => `
            <div class="contact-card">
                <div class="contact-header">
                    <h3>${contact.name}</h3>
                    <div class="contact-actions">
                        <button class="btn-secondary" onclick="messageFlow.messageContact('${contact.id}')">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
                <div class="contact-info">
                    <p><i class="fas fa-phone"></i> ${contact.phone}</p>
                    ${contact.email ? `<p><i class="fas fa-envelope"></i> ${contact.email}</p>` : ''}
                    ${contact.tags ? `<div class="contact-tags">${contact.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}</div>` : ''}
                </div>
                <div class="contact-stats">
                    <small>Messages sent: ${this.messages.filter(m => m.recipientId === contact.id).length}</small>
                </div>
            </div>
        `).join('');
    }

    // Analytics
    loadAnalytics() {
        // This would typically connect to real analytics data
        console.log('Loading analytics...');
    }

    // Modal Management
    openModal(modalId) {
        document.getElementById(modalId).classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset forms when closing
        if (modalId === 'composer-modal') {
            document.getElementById('message-form').reset();
            document.getElementById('char-count').textContent = '0';
            document.getElementById('schedule-datetime-group').style.display = 'none';
        }
        
        if (modalId === 'ai-modal') {
            document.querySelectorAll('.template-btn').forEach(btn => btn.classList.remove('selected'));
            document.getElementById('custom-ai-input').style.display = 'none';
            document.getElementById('ai-generated-content').style.display = 'none';
        }
        
        if (modalId === 'contact-modal') {
            document.getElementById('contact-form').reset();
        }
    }

    openComposer() {
        this.populateRecipientSelect();
        this.openModal('composer-modal');
    }

    openAIModal() {
        this.openModal('ai-modal');
    }

    openContactModal() {
        this.openModal('contact-modal');
    }

    messageContact(contactId) {
        const contact = this.contacts.find(c => c.id === contactId);
        if (contact) {
            this.populateRecipientSelect();
            document.getElementById('recipient-select').value = contactId;
            this.openModal('composer-modal');
        }
    }

    // Form Management
    populateRecipientSelect() {
        const select = document.getElementById('recipient-select');
        select.innerHTML = '<option value="">Select a contact</option>';
        
        this.contacts.forEach(contact => {
            const option = document.createElement('option');
            option.value = contact.id;
            option.textContent = `${contact.name} (${contact.phone})`;
            select.appendChild(option);
        });
    }

    sendMessage() {
        const formData = new FormData(document.getElementById('message-form'));
        const recipientId = document.getElementById('recipient-select').value;
        const content = document.getElementById('message-content').value;
        const scheduleType = formData.get('scheduleType');
        const scheduleDateTime = document.getElementById('schedule-datetime').value;

        if (!recipientId || !content) {
            alert('Please select a recipient and enter a message.');
            return;
        }

        const recipient = this.contacts.find(c => c.id === recipientId);
        const message = {
            id: this.generateId(),
            recipientId: recipientId,
            recipientName: recipient.name,
            recipientPhone: recipient.phone,
            content: content,
            status: scheduleType === 'now' ? 'sent' : 'scheduled',
            createdAt: new Date().toISOString(),
            scheduledTime: scheduleType === 'scheduled' ? scheduleDateTime : null
        };

        this.messages.push(message);
        this.closeModal('composer-modal');
        
        // Show success message
        this.showNotification(
            scheduleType === 'now' ? 'Message sent successfully!' : 'Message scheduled successfully!',
            'success'
        );

        // Update displays
        this.updateDashboard();
        if (this.currentTab === 'messages') {
            this.loadMessages();
        }
    }

    addContact() {
        const name = document.getElementById('contact-name').value;
        const phone = document.getElementById('contact-phone').value;
        const email = document.getElementById('contact-email').value;
        const tags = document.getElementById('contact-tags').value;

        if (!name || !phone) {
            alert('Please enter a name and phone number.');
            return;
        }

        const contact = {
            id: this.generateId(),
            name: name,
            phone: phone,
            email: email,
            tags: tags,
            createdAt: new Date().toISOString()
        };

        this.contacts.push(contact);
        this.closeModal('contact-modal');
        
        this.showNotification('Contact added successfully!', 'success');
        
        // Update displays
        this.updateDashboard();
        if (this.currentTab === 'contacts') {
            this.loadContacts();
        }
    }

    saveDraft() {
        const content = document.getElementById('message-content').value;
        if (!content) {
            alert('Please enter a message to save as draft.');
            return;
        }

        // In a real app, this would save to drafts
        this.showNotification('Draft saved successfully!', 'info');
    }

    // AI Message Generation
    generateAIMessage() {
        const selectedTemplate = document.querySelector('.template-btn.selected');
        if (!selectedTemplate) {
            alert('Please select a message template.');
            return;
        }

        const template = selectedTemplate.dataset.template;
        let prompt = '';
        let tone = 'friendly';

        if (template === 'custom') {
            prompt = document.getElementById('ai-prompt').value;
            tone = document.getElementById('ai-tone').value;
            
            if (!prompt) {
                alert('Please describe your custom message.');
                return;
            }
        }

        // Simulate AI generation with realistic delays and responses
        this.showAIGenerating();
        
        setTimeout(() => {
            const generatedMessage = this.getTemplateMessage(template, prompt, tone);
            this.showGeneratedMessage(generatedMessage);
        }, 1500);
    }

    getTemplateMessage(template, customPrompt, tone) {
        const messages = {
            birthday: [
                "🎉 Happy Birthday! Wishing you a fantastic day filled with joy and celebration!",
                "🎂 Another year of awesome! Hope your special day is as amazing as you are!",
                "🎈 Happy Birthday! May this new year bring you happiness, success, and wonderful memories!"
            ],
            followup: [
                "Hi! Just wanted to follow up on our conversation. Let me know if you have any questions!",
                "Hope you're doing well! Following up to see if you need any additional information.",
                "Thanks for your time today. Please don't hesitate to reach out if you need anything else!"
            ],
            reminder: [
                "⏰ Friendly reminder about your upcoming appointment tomorrow at 2 PM. See you there!",
                "📅 Don't forget about your scheduled meeting today. Looking forward to connecting!",
                "🔔 Just a quick reminder about your appointment. Please let us know if you need to reschedule."
            ],
            promotional: [
                "🎯 Special offer just for you! Get 20% off your next purchase. Limited time only!",
                "✨ Exclusive deal alert! Don't miss out on our latest promotion. Shop now and save!",
                "💰 Limited time offer: Save big on our best products. Offer ends soon!"
            ],
            "thank-you": [
                "Thank you so much for your business! We truly appreciate your support. 🙏",
                "We're grateful for customers like you! Thanks for choosing us. ❤️",
                "Your support means the world to us. Thank you for being amazing! 🌟"
            ]
        };

        if (template === 'custom') {
            // Simulate AI generation based on prompt and tone
            const toneWords = {
                friendly: "😊 ",
                professional: "",
                casual: "Hey! ",
                formal: "Dear recipient, ",
                enthusiastic: "🚀 "
            };
            
            return `${toneWords[tone]}${customPrompt.charAt(0).toUpperCase() + customPrompt.slice(1)}. Let me know if you have any questions!`;
        }

        const templateMessages = messages[template] || ["Generated message based on your selection."];
        return templateMessages[Math.floor(Math.random() * templateMessages.length)];
    }

    showAIGenerating() {
        const content = document.getElementById('ai-generated-content');
        content.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div class="spinner" style="margin: 0 auto 1rem;"></div>
                <p>AI is generating your message...</p>
            </div>
        `;
        content.style.display = 'block';
    }

    showGeneratedMessage(message) {
        const content = document.getElementById('ai-generated-content');
        document.getElementById('generated-message-content').textContent = message;
        content.innerHTML = `
            <h4>Generated Message:</h4>
            <div class="generated-message">${message}</div>
            <div class="form-actions">
                <button class="btn-secondary" id="regenerate-ai">
                    <i class="fas fa-redo"></i> Regenerate
                </button>
                <button class="btn-primary" id="use-ai-message">
                    Use This Message
                </button>
            </div>
        `;
        
        // Re-attach event listeners
        document.getElementById('regenerate-ai').addEventListener('click', () => this.generateAIMessage());
        document.getElementById('use-ai-message').addEventListener('click', () => this.useAIMessage());
    }

    useAIMessage() {
        const generatedMessage = document.getElementById('generated-message-content').textContent;
        document.getElementById('message-content').value = generatedMessage;
        document.getElementById('char-count').textContent = generatedMessage.length;
        this.closeModal('ai-modal');
        
        this.showNotification('AI message added to composer!', 'success');
    }

    // Filter Management
    toggleFilter() {
        const filterBar = document.getElementById('filter-bar');
        filterBar.style.display = filterBar.style.display === 'none' ? 'flex' : 'none';
    }

    clearFilters() {
        document.getElementById('status-filter').value = '';
        document.getElementById('date-filter').value = '';
        this.loadMessages();
    }

    // Utilities
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    setMinDateTime() {
        const now = new Date();
        const minDateTime = now.toISOString().slice(0, 16);
        document.getElementById('schedule-datetime').min = minDateTime;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#4f46e5'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 3000;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Load demo data
    loadDemoData() {
        // Demo contacts
        this.contacts = [
            {
                id: 'c1',
                name: 'Sarah Johnson',
                phone: '+1 (555) 123-4567',
                email: 'sarah@example.com',
                tags: 'customer, premium',
                createdAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: 'c2',
                name: 'Mike Chen',
                phone: '+1 (555) 987-6543',
                email: 'mike@example.com',
                tags: 'lead, prospect',
                createdAt: new Date(Date.now() - 172800000).toISOString()
            },
            {
                id: 'c3',
                name: 'Emily Davis',
                phone: '+1 (555) 456-7890',
                email: 'emily@example.com',
                tags: 'customer, vip',
                createdAt: new Date(Date.now() - 259200000).toISOString()
            }
        ];

        // Demo messages
        this.messages = [
            {
                id: 'm1',
                recipientId: 'c1',
                recipientName: 'Sarah Johnson',
                recipientPhone: '+1 (555) 123-4567',
                content: 'Thanks for your recent purchase! We hope you love your new product.',
                status: 'sent',
                createdAt: new Date(Date.now() - 3600000).toISOString(),
                scheduledTime: null
            },
            {
                id: 'm2',
                recipientId: 'c2',
                recipientName: 'Mike Chen',
                recipientPhone: '+1 (555) 987-6543',
                content: 'Hi Mike! Just following up on your interest in our premium package.',
                status: 'scheduled',
                createdAt: new Date(Date.now() - 7200000).toISOString(),
                scheduledTime: new Date(Date.now() + 86400000).toISOString()
            },
            {
                id: 'm3',
                recipientId: 'c3',
                recipientName: 'Emily Davis',
                recipientPhone: '+1 (555) 456-7890',
                content: '🎉 Happy Birthday Emily! Enjoy your special day!',
                status: 'scheduled',
                createdAt: new Date(Date.now() - 10800000).toISOString(),
                scheduledTime: new Date(Date.now() + 172800000).toISOString()
            }
        ];
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.messageFlow = new MessageFlow();
});

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .contact-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .contact-info {
        margin-bottom: 1rem;
    }
    
    .contact-info p {
        margin-bottom: 0.5rem;
        color: #64748b;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .contact-tags {
        margin-top: 0.5rem;
        display: flex;
        gap: 0.25rem;
        flex-wrap: wrap;
    }
    
    .tag {
        background: #ede9fe;
        color: #7c3aed;
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
    }
    
    .contact-stats {
        padding-top: 1rem;
        border-top: 1px solid #e2e8f0;
        color: #64748b;
    }
    
    .spinner {
        width: 20px;
        height: 20px;
        border: 2px solid #e2e8f0;
        border-top: 2px solid #4f46e5;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(notificationStyles); 
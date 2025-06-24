// MessageFlow - Smart Text Message CRM
// Author: Assistant
// Description: A comprehensive demo SaaS platform for text message scheduling and CRM

class MessageFlow {
    constructor() {
        this.contacts = [];
        this.messages = [];
        this.notificationPages = [];
        this.currentTab = 'dashboard';
        this.notificationsEnabled = false;
        this.currentPageId = null;
        this.storageKey = 'letterly_data';
        
        // DeepSeek AI configuration
        this.deepSeekApiKey = 'sk-73dc965fdfe84b098eef77575efe88c2';
        this.deepSeekApiUrl = 'https://api.deepseek.com/v1/chat/completions';
        this.lastGeneratedMessage = '';
        
        // Live Messages properties
        this.liveMessages = [];
        this.autoRefreshInterval = null;
        this.refreshIntervalTime = 5000; // 5 seconds default
        
        // Onboarding properties
        this.onboardingStep = 1;
        this.onboardingData = {
            recipient: '',
            sender: '',
            message: ''
        };
        
        // Message editing properties
        this.editingMessage = null;
        
        this.init();
    }

    init() {
        this.initEventListeners();
        this.loadSavedData();
        this.updateDashboard();
        this.setMinDateTime();
        this.checkForDirectPageAccess();
        this.processAnalytics();
        this.checkScheduledReminders();
        this.handleReplyParameters();
        
        // Set up periodic reminder checking
        setInterval(() => this.checkScheduledReminders(), 60000); // Check every minute
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
        document.getElementById('ai-generate-btn').addEventListener('click', () => this.openAIModal());
        document.getElementById('add-contact-btn').addEventListener('click', () => this.openContactModal());

        // Header compose button
        document.getElementById('compose-btn').addEventListener('click', () => this.openComposer());
        document.getElementById('new-message-header-btn').addEventListener('click', () => this.openComposer());
        
        // Settings
        document.getElementById('settings-btn').addEventListener('click', () => this.openSettings());

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

        // Live Messages controls
        document.getElementById('refresh-live-btn').addEventListener('click', () => this.refreshLiveMessages());
        document.getElementById('export-live-btn').addEventListener('click', () => this.exportLiveData());
        document.getElementById('auto-refresh-toggle').addEventListener('change', (e) => this.toggleAutoRefresh(e.target.checked));
        document.getElementById('refresh-interval').addEventListener('change', (e) => this.updateRefreshInterval(e.target.value));

        // Mobile menu controls
        document.getElementById('mobile-menu-btn').addEventListener('click', () => this.openMobileMenu());
        document.getElementById('mobile-menu-close').addEventListener('click', () => this.closeMobileMenu());
        document.getElementById('mobile-menu-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeMobileMenu();
        });

        // Mobile navigation links
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = link.dataset.tab;
                this.switchTab(tab);
                this.closeMobileMenu();
            });
        });
        
        // URL filters
        document.getElementById('url-status-filter').addEventListener('change', () => this.filterUrls());
        document.getElementById('url-sort').addEventListener('change', () => this.sortUrls());

        // Onboarding controls
        this.initOnboardingControls();
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

        // Page preview modal
        document.getElementById('page-preview-close').addEventListener('click', () => this.closeModal('page-preview-modal'));
        document.getElementById('page-preview-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeModal('page-preview-modal');
        });

        // Notification viewer modal
        document.getElementById('notification-viewer-close').addEventListener('click', () => this.closeModal('notification-viewer-modal'));
        document.getElementById('notification-viewer-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeModal('notification-viewer-modal');
        });
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

        // Page creation controls
        document.getElementById('preview-page-btn').addEventListener('click', () => this.previewPage());
        document.getElementById('copy-url-btn').addEventListener('click', () => this.copyPageUrl());

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

    // Mobile Menu Management
    openMobileMenu() {
        document.getElementById('mobile-menu-overlay').style.display = 'block';
        setTimeout(() => {
            document.getElementById('mobile-menu-overlay').classList.add('active');
        }, 10);
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        const overlay = document.getElementById('mobile-menu-overlay');
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
        document.body.style.overflow = '';
    }

    // Tab Management
    switchTab(tabName) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update mobile navigation
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const mobileLink = document.querySelector(`.mobile-nav-link[data-tab="${tabName}"]`);
        if (mobileLink) {
            mobileLink.classList.add('active');
        }

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
            case 'live-messages':
                this.loadLiveMessages();
                break;
            case 'contacts':
                this.loadContacts();
                break;

        }
    }

    // Dashboard
    updateDashboard() {
        const totalContacts = this.contacts.length;
        const totalMessages = this.messages.length;
        const scheduledReminders = this.messages.filter(m => m.status === 'scheduled').length;

        document.getElementById('total-contacts').textContent = totalContacts;
        document.getElementById('total-messages').textContent = totalMessages;
        document.getElementById('scheduled-reminders').textContent = scheduledReminders;

        // Update connection status
        this.updateConnectionStatus();

        // Update recent activity
        this.updateRecentActivity();
    }

    // Get total message count from localStorage
    async getTotalMessageCount() {
        return this.messages.length;
    }

    loadRecentActivity() {
        const container = document.getElementById('recent-activity');
        if (!container) return;

        // Get recent messages from all notification pages
        this.getAllMessages().then(allMessages => {
            const recentMessages = allMessages
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5);

            if (recentMessages.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-clock"></i>
                        <p>No recent activity</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = recentMessages.map(message => `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">${message.title || 'Untitled Message'}</div>
                        <div class="activity-meta">
                            <span>${message.recipientName || 'Unknown Recipient'}</span>
                            <span>${this.formatDateTime(message.createdAt)}</span>
                        </div>
                    </div>
                    <div class="activity-status ${message.status}">
                        <i class="fas fa-${message.status === 'sent' ? 'check' : 'clock'}"></i>
                    </div>
                </div>
            `).join('');
        });
    }

    loadUpcomingMessages() {
        const container = document.getElementById('upcoming-messages');
        if (!container) return;

        // Get scheduled messages from all notification pages
        this.getAllMessages().then(allMessages => {
            const now = new Date();
            const scheduledMessages = allMessages
                .filter(message => message.status === 'scheduled' && message.scheduledTime)
                .filter(message => new Date(message.scheduledTime) > now)
                .sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime))
                .slice(0, 5);

            if (scheduledMessages.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-calendar"></i>
                        <p>No upcoming messages</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = scheduledMessages.map(message => `
                <div class="upcoming-item">
                    <div class="upcoming-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="upcoming-content">
                        <div class="upcoming-title">${message.title || 'Untitled Message'}</div>
                        <div class="upcoming-meta">
                            <span>${message.recipientName || 'Unknown Recipient'}</span>
                            <span>${this.formatDateTime(message.scheduledTime)}</span>
                        </div>
                    </div>
                    <div class="upcoming-actions">
                        <button class="btn-small" onclick="messageFlow.previewMessage('${message.pageId}')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        });
    }

    // Messages
    loadMessages() {
        const container = document.getElementById('messages-container');
        if (!container) return;

        if (this.messages.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-envelope"></i>
                    <h3>No Messages Yet</h3>
                    <p>Create your first message to get started.</p>
                    <button class="btn-primary" onclick="messageFlow.openComposer()">
                        <i class="fas fa-plus"></i>
                        Create Message
                    </button>
                </div>
            `;
            return;
        }

        // Sort messages by creation time (newest first)
        const sortedMessages = [...this.messages].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        const messagesHTML = sortedMessages.map(message => {
            const createdAt = new Date(message.createdAt);
            const formattedDate = createdAt.toLocaleDateString() + ' ' + createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const statusClass = message.status === 'sent' ? 'sent' : 'scheduled';
            const statusIcon = message.status === 'sent' ? 'fas fa-check-circle' : 'fas fa-clock';

            return `
                <div class="message-card ${statusClass}">
                    <div class="message-header">
                        <div class="message-info">
                            <h4>${message.title}</h4>
                            <p class="message-recipient">
                                <i class="fas fa-user"></i> ${message.recipientName}
                            </p>
                            <p class="message-date">
                                <i class="fas fa-calendar"></i> ${formattedDate}
                            </p>
                        </div>
                        <div class="message-status">
                            <i class="${statusIcon}"></i>
                            <span>${message.status}</span>
                        </div>
                    </div>
                    <div class="message-content">
                        <p>${message.content}</p>
                    </div>
                    <div class="message-actions">
                        <button class="btn-small" onclick="messageFlow.copyMessageUrl('${message.pageUrl}')">
                            <i class="fas fa-link"></i> Copy URL
                        </button>
                        <button class="btn-small" onclick="messageFlow.previewMessage('${message.pageUrl}')">
                            <i class="fas fa-eye"></i> Preview
                        </button>
                        <button class="btn-small" onclick="messageFlow.editMessage('${message.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-small danger" onclick="messageFlow.deleteMessage('${message.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = messagesHTML;
    }

    // Get all messages from localStorage
    async getAllMessages() {
        return this.messages;
    }

    // Preview a message by opening its notification page
    previewMessage(pageUrl) {
        window.open(pageUrl, '_blank');
    }

    // Copy message URL to clipboard
    async copyMessageUrl(pageUrl) {
        try {
            await navigator.clipboard.writeText(pageUrl);
            this.showNotification('URL copied to clipboard!', 'success');
        } catch (error) {
            console.error('Failed to copy URL:', error);
            this.showNotification('Failed to copy URL', 'error');
        }
    }

    // Delete a message
    async deleteMessage(messageId) {
        if (!confirm('Are you sure you want to delete this message?')) {
            return;
        }

        try {
            // Remove from messages array
            this.messages = this.messages.filter(m => m.id !== messageId);
            
            // Save data
            this.saveData();
            this.loadMessages();
            this.updateDashboard();
            
            this.showNotification('Message deleted successfully!', 'success');
        } catch (error) {
            console.error('Failed to delete message:', error);
            this.showNotification('Failed to delete message', 'error');
        }
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

    async sendMessage() {
        const pageData = this.getPageFormData();
        if (!pageData) return;

        const scheduleType = document.querySelector('input[name="scheduleType"]:checked').value;
        const scheduleDateTime = document.getElementById('schedule-datetime').value;

        const recipient = this.contacts.find(c => c.id === pageData.recipientId);
        
        // Create notification page URL with parameters
        const pageUrl = this.createNotificationPageUrl(pageData);
        
        // Create message data
        const messageData = {
            id: this.generateId(),
            recipientId: pageData.recipientId,
            recipientName: recipient.name,
            recipientPhone: recipient.phone,
            content: pageData.content,
            title: pageData.title,
            theme: pageData.theme,
            pageUrl: pageUrl,
            status: scheduleType === 'now' ? 'sent' : 'scheduled',
            createdAt: new Date().toISOString(),
            scheduledTime: scheduleType === 'scheduled' ? scheduleDateTime : null,
            senderName: 'You'
        };

        // Store message in localStorage
        this.messages.push(messageData);

        // Handle immediate send or scheduling
        if (scheduleType === 'now') {
            messageData.status = 'sent';
            this.showNotification(
                `Message created! Share this URL: ${pageUrl}`,
                'success'
            );
        } else {
            this.showNotification(
                `Message scheduled! You'll be reminded to send the link at ${this.formatDateTime(scheduleDateTime)}`,
                'success'
            );
        }

        // Save data after creating message
        this.saveData();
        this.closeModal('composer-modal');

        // Update displays
        this.updateDashboard();
        if (this.currentTab === 'messages') {
            this.loadMessages();
        }
    }

    // Create notification page URL with parameters
    createNotificationPageUrl(pageData) {
        const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '') + '/notification-page.html';
        const params = new URLSearchParams({
            title: pageData.title,
            message: pageData.content,
            theme: pageData.theme,
            recipient: pageData.recipientName || '',
            sender: 'You'
        });
        
        return `${baseUrl}?${params.toString()}`;
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
    async generateAIMessage() {
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

        // Show generating state
        this.showAIGenerating();
        
        try {
            const generatedMessage = await this.callDeepSeekAPI(template, prompt, tone);
            this.showGeneratedMessage(generatedMessage);
        } catch (error) {
            console.error('AI generation failed:', error);
            // Fallback to template messages if API fails
            const fallbackMessage = this.getTemplateMessage(template, prompt, tone);
            this.showGeneratedMessage(fallbackMessage);
            this.showNotification('Using fallback message - AI service temporarily unavailable', 'warning');
        }
    }

    async callDeepSeekAPI(template, customPrompt, tone) {
        // Build the system prompt based on the template and tone
        let systemPrompt = this.buildSystemPrompt(template, tone);
        let userPrompt = this.buildUserPrompt(template, customPrompt);

        const requestBody = {
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: userPrompt
                }
            ],
            max_tokens: 150,
            temperature: 0.7,
            stream: false
        };

        const response = await fetch(this.deepSeekApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.deepSeekApiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content.trim();
        } else {
            throw new Error('No response from DeepSeek API');
        }
    }

    buildSystemPrompt(template, tone) {
        const basePrompt = `You are a helpful assistant that generates personalized messages for notifications. Always write in a ${tone} tone.`;
        
        const templateInstructions = {
            birthday: 'Generate a warm birthday message. Include birthday emojis and make it celebratory.',
            followup: 'Generate a professional follow-up message. Be polite and offer assistance.',
            reminder: 'Generate a friendly reminder message. Include relevant emojis and be clear about the reminder.',
            promotional: 'Generate an engaging promotional message. Make it exciting but not pushy.',
            'thank-you': 'Generate a heartfelt thank you message. Express genuine gratitude.',
            custom: 'Generate a message based on the user\'s specific request.'
        };

        return `${basePrompt} ${templateInstructions[template] || templateInstructions.custom} Keep the message concise (1-2 sentences) and appropriate for notifications.`;
    }

    buildUserPrompt(template, customPrompt) {
        if (template === 'custom') {
            return `Please write a message about: ${customPrompt}`;
        }
        
        const templatePrompts = {
            birthday: 'Write a birthday message',
            followup: 'Write a follow-up message',
            reminder: 'Write a reminder message',
            promotional: 'Write a promotional message',
            'thank-you': 'Write a thank you message'
        };

        return templatePrompts[template] || 'Write a general message';
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
            <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); padding: 2rem; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1); text-align: center;">
                <div class="spinner" style="margin: 0 auto 1rem; width: 40px; height: 40px; border: 4px solid rgba(255, 255, 255, 0.3); border-top: 4px solid rgba(102, 126, 234, 1); border-radius: 50%; animation: liquidSpin 1s linear infinite;"></div>
                <p style="color: rgba(255, 255, 255, 0.9); font-size: 1rem; margin: 0;">🤖 DeepSeek AI is generating your message...</p>
                <p style="color: rgba(255, 255, 255, 0.6); font-size: 0.875rem; margin-top: 0.5rem;">This may take a few seconds</p>
            </div>
        `;
        content.style.display = 'block';
    }

    showGeneratedMessage(message) {
        const content = document.getElementById('ai-generated-content');
        content.innerHTML = `
            <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1); margin-bottom: 1rem;">
                <h4 style="color: rgba(255, 255, 255, 0.9); margin-bottom: 1rem;">✨ Generated Message:</h4>
                <div class="generated-message" style="background: rgba(255, 255, 255, 0.08); padding: 1rem; border-radius: 8px; font-size: 1rem; line-height: 1.5; color: rgba(255, 255, 255, 0.95); margin-bottom: 1rem;">${message}</div>
                <div class="form-actions">
                    <button class="btn-secondary" id="regenerate-ai">
                        <i class="fas fa-redo"></i> Regenerate
                    </button>
                    <button class="btn-primary" id="use-ai-message">
                        <i class="fas fa-check"></i> Use This Message
                    </button>
                </div>
            </div>
        `;
        
        // Store the message for use
        this.lastGeneratedMessage = message;
        
        // Re-attach event listeners
        document.getElementById('regenerate-ai').addEventListener('click', () => this.generateAIMessage());
        document.getElementById('use-ai-message').addEventListener('click', () => this.useAIMessage());
    }

    useAIMessage() {
        const generatedMessage = this.lastGeneratedMessage || '';
        if (generatedMessage) {
            document.getElementById('message-content').value = generatedMessage;
            document.getElementById('char-count').textContent = generatedMessage.length;
            this.closeModal('ai-modal');
            
            this.showNotification('✨ AI message added to composer!', 'success');
        } else {
            this.showNotification('No message to use. Please generate a message first.', 'error');
        }
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
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                </div>
                <div class="notification-message">${message}</div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Settings Methods
    openSettings() {
        const settingsHtml = `
            <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); padding: 2rem; border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.2); margin: 1rem;">
                <h3 style="color: rgba(255, 255, 255, 0.9); margin-bottom: 1.5rem;">Cloud Storage Status</h3>
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                    <div class="status-dot ${this.firebaseInitialized ? 'connected' : 'disconnected'}" style="width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0;"></div>
                    <span style="color: rgba(255, 255, 255, 0.9);">${this.firebaseInitialized ? 'Connected to Firebase Cloud' : 'Using Local Storage'}</span>
                </div>
                <p style="color: rgba(255, 255, 255, 0.6); font-size: 0.875rem; margin-bottom: 1rem;">
                    User ID: ${this.userId}
                </p>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem;">
                    <span style="color: rgba(255, 255, 255, 0.8); font-size: 0.875rem;">Messages: ${this.messages.length}</span>
                    <span style="color: rgba(255, 255, 255, 0.8); font-size: 0.875rem;">Contacts: ${this.contacts.length}</span>
                    <span style="color: rgba(255, 255, 255, 0.8); font-size: 0.875rem;">Pages: ${this.notificationPages.length}</span>
                </div>
            </div>

            <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); padding: 2rem; border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.2); margin: 1rem;">
                <h3 style="color: rgba(255, 255, 255, 0.9); margin-bottom: 1.5rem;">Data Management</h3>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <button class="btn-secondary" onclick="letterly.exportData()">
                        <i class="fas fa-download"></i> Export Data
                    </button>
                    <button class="btn-secondary" onclick="letterly.clearAllData()" style="background: rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.3);">
                        <i class="fas fa-trash"></i> Clear All Data
                    </button>
                </div>
                <p style="color: rgba(255, 255, 255, 0.6); font-size: 0.875rem; margin-top: 1rem;">
                    Export your data for backup or clear all data to start fresh.
                </p>
            </div>
        `;
        
        // Create temporary modal
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-cog"></i> Settings</h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${settingsHtml}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }



    previewPage() {
        const formData = this.getPageFormData();
        if (!formData) return;

        const pageHtml = this.generateNotificationPageHtml(formData);
        document.getElementById('preview-frame').innerHTML = pageHtml;
        
        // Generate realistic URL
        const pageId = this.generateId();
        const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '');
        const pageUrl = `${baseUrl}/notification-page.html?id=${pageId}&title=${encodeURIComponent(formData.title)}&message=${encodeURIComponent(formData.content)}&theme=${formData.theme}`;
        document.getElementById('page-url').value = pageUrl;
        
        // Generate QR code (mock)
        this.generateQrCode(pageUrl);
        
        this.openModal('page-preview-modal');
    }

    getPageFormData() {
        const title = document.getElementById('page-title').value;
        const content = document.getElementById('message-content').value;
        const theme = document.querySelector('input[name="pageTheme"]:checked').value;
        const recipientId = document.getElementById('recipient-select').value;

        if (!title || !content || !recipientId) {
            alert('Please fill in all required fields');
            return null;
        }

        return {
            title,
            content,
            theme,
            recipientId,
            includeButton: document.getElementById('include-button').checked,
            buttonText: document.getElementById('button-text').value,
            buttonUrl: document.getElementById('button-url').value,
            includeImage: document.getElementById('include-image').checked,
            imageUrl: document.getElementById('image-url').value,
            includeCountdown: document.getElementById('include-countdown').checked,
            countdownDate: document.getElementById('countdown-date').value
        };
    }

    generateNotificationPageHtml(data) {
        let elementsHtml = '';

        if (data.includeImage && data.imageUrl) {
            elementsHtml += `<img src="${data.imageUrl}" alt="Notification Image" class="notification-image">`;
        }

        if (data.includeButton) {
            const buttonAction = data.buttonUrl ? `onclick="window.open('${data.buttonUrl}', '_blank')"` : 'onclick="this.style.opacity=0.5; this.textContent=\'✓ Acknowledged\'"';
            elementsHtml += `<button class="notification-button" ${buttonAction}>${data.buttonText}</button>`;
        }

        if (data.includeCountdown && data.countdownDate) {
            elementsHtml += `
                <div class="countdown-timer" id="countdown-display">
                    <div class="countdown-time">00:00:00:00</div>
                    <div class="countdown-label">Days : Hours : Minutes : Seconds</div>
                </div>
            `;
        }

        return `
            <div class="notification-page ${data.theme}">
                <div class="notification-content">
                    <h1 class="notification-title">${data.title}</h1>
                    <p class="notification-message">${data.content}</p>
                    ${elementsHtml}
                </div>
            </div>
            ${data.includeCountdown ? `<script>
                const countdownDate = new Date('${data.countdownDate}').getTime();
                const countdownTimer = setInterval(function() {
                    const now = new Date().getTime();
                    const distance = countdownDate - now;
                    
                    if (distance < 0) {
                        clearInterval(countdownTimer);
                        document.querySelector('.countdown-time').innerHTML = 'EXPIRED';
                        return;
                    }
                    
                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    
                    document.querySelector('.countdown-time').innerHTML = 
                        String(days).padStart(2, '0') + ':' +
                        String(hours).padStart(2, '0') + ':' +
                        String(minutes).padStart(2, '0') + ':' +
                        String(seconds).padStart(2, '0');
                }, 1000);
            </script>` : ''}
        `;
    }

    generateQrCode(url) {
        // Simple QR code placeholder - in production, use a QR code library
        const qrContainer = document.getElementById('qr-code');
        qrContainer.innerHTML = `
            <div style="width: 150px; height: 150px; background: #000; color: #fff; display: flex; align-items: center; justify-content: center; font-family: monospace; font-size: 10px; line-height: 1.2; text-align: center; word-break: break-all; padding: 10px;">
                QR CODE<br>${url.substring(0, 20)}...
            </div>
            <p style="margin-top: 0.5rem; font-size: 0.75rem; color: rgba(0,0,0,0.6);">Scan to open page</p>
        `;
    }

    async copyPageUrl() {
        const urlInput = document.getElementById('page-url');
        const url = urlInput.value;
        
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(url);
                this.showNotification('Page URL copied to clipboard!', 'success');
            } else {
                // Fallback for older browsers
                urlInput.select();
                urlInput.setSelectionRange(0, 99999);
                document.execCommand('copy');
                this.showNotification('Page URL copied to clipboard!', 'success');
            }
        } catch (error) {
            console.error('Failed to copy URL:', error);
            this.showNotification('Failed to copy URL. Please copy manually.', 'error');
        }
    }

    sendNotificationToUser(pageData, recipient) {
        if (!this.notificationsEnabled) {
            this.showNotification('Browser notifications not enabled', 'warning');
            return;
        }

        // Send browser notification
        new Notification(`New message from MessageFlow`, {
            body: `${pageData.title}: ${pageData.content.substring(0, 100)}...`,
            icon: '/favicon.ico',
            tag: pageData.id,
            requireInteraction: true,
            actions: [
                { action: 'view', title: 'View Page' },
                { action: 'dismiss', title: 'Dismiss' }
            ]
        });

        // In a real implementation, you might also:
        // - Send push notifications via service worker
        // - Send email notifications
        // - Save to a notification queue for offline users
    }

    createNotificationPage(pageData) {
        const pageId = this.generateId();
        const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '');
        const pageUrl = `${baseUrl}/notification-page.html?id=${pageId}`;
        
        const page = {
            id: pageId,
            url: pageUrl,
            ...pageData,
            createdAt: new Date().toISOString(),
            views: 0,
            clicks: 0,
            status: 'active'
        };

        this.notificationPages.push(page);
        this.updatePageStats();
        
        // Save data after creating page
        this.saveData();
        
        return page;
    }

    updatePageStats() {
        const activePages = this.notificationPages.filter(p => p.status === 'active').length;
        const totalViews = this.notificationPages.reduce((sum, p) => sum + p.views, 0);
        
        document.getElementById('active-pages-count').textContent = activePages;
        document.getElementById('total-views-count').textContent = totalViews;
    }

    getPageViews(pageId) {
        const page = this.notificationPages.find(p => p.id === pageId);
        return page ? page.views : 0;
    }

    getPageClicks(pageId) {
        const page = this.notificationPages.find(p => p.id === pageId);
        return page ? page.clicks : 0;
    }

    trackPageView(pageId) {
        const page = this.notificationPages.find(p => p.id === pageId);
        if (page) {
            const wasFirstView = page.views === 0;
            page.views++;
            page.lastViewedAt = new Date().toISOString();
            this.updatePageStats();
            this.saveData();
            
            // Send browser notification to creator when someone first views their page
            if (wasFirstView && this.notificationsEnabled) {
                this.sendCreatorNotification(`Someone viewed your notification page: "${page.title}"`);
            }
        }
    }

    trackButtonClick(pageId) {
        const page = this.notificationPages.find(p => p.id === pageId);
        if (page) {
            page.clicks++;
            page.lastClickedAt = new Date().toISOString();
            this.updatePageStats();
            this.saveData();
            
            // Send browser notification to creator when someone clicks their button
            if (this.notificationsEnabled) {
                this.sendCreatorNotification(`Someone clicked the button on: "${page.title}"`);
            }
        }
    }

    sendCreatorNotification(message) {
        if (!('Notification' in window) || Notification.permission !== 'granted') {
            return;
        }

        try {
            new Notification('Letterly Analytics', {
                body: message,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: 'letterly-analytics',
                requireInteraction: false,
                silent: false
            });
        } catch (error) {
            console.error('Failed to send notification:', error);
        }
    }



    processAnalytics() {
        try {
            const analyticsData = JSON.parse(localStorage.getItem('letterly_analytics') || '[]');
            
            if (analyticsData.length > 0) {
                analyticsData.forEach(event => {
                    if (event.type === 'pageView') {
                        this.trackPageView(event.pageId);
                    } else if (event.type === 'buttonClick') {
                        this.trackButtonClick(event.pageId);
                    }
                });
                
                // Clear processed analytics
                localStorage.removeItem('letterly_analytics');
                
                // Update displays if needed
                if (this.currentTab === 'messages') {
                    this.loadMessages();
                }
            }
        } catch (error) {
            console.error('Failed to process analytics:', error);
        }
    }

    // Generate user ID for localStorage
    generateUserId() {
        let userId = localStorage.getItem('letterly_user_id');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
            localStorage.setItem('letterly_user_id', userId);
        }
        return userId;
    }

    // Update cloud status to show localStorage
    updateCloudStatus(status, message) {
        const statusDot = document.getElementById('cloud-status-dot');
        const statusText = document.getElementById('cloud-status-text');

        if (statusDot && statusText) {
            statusText.textContent = 'Local Storage';
            statusDot.className = 'status-dot connected';
            statusText.style.cursor = 'default';
            statusText.title = '';
            statusText.onclick = null;
        }
    }

    // Update user ID display
    updateUserIdDisplay() {
        const userIdDisplay = document.getElementById('user-id-display');
        if (userIdDisplay) {
            const shortId = this.userId.replace('user_', '').substring(0, 8);
            userIdDisplay.textContent = `User: ${shortId}`;
        }
    }

    // Data Persistence Methods
    async saveData() {
        this.saveDataToLocalStorage();
    }

    saveDataToLocalStorage() {
        const data = {
            contacts: this.contacts,
            messages: this.messages,
            notificationPages: this.notificationPages,
            notificationsEnabled: this.notificationsEnabled,
            liveMessages: this.liveMessages,
            lastUpdated: new Date().toISOString()
        };
        
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            console.log('Data saved to localStorage successfully');
        } catch (error) {
            console.error('Failed to save data to localStorage:', error);
            this.showNotification('Failed to save data locally', 'error');
        }
    }

    async loadSavedData() {
        this.loadSavedDataFromLocalStorage();
    }

    loadSavedDataFromLocalStorage() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (savedData) {
                const data = JSON.parse(savedData);
                this.contacts = data.contacts || [];
                this.messages = data.messages || [];
                this.notificationPages = data.notificationPages || [];
                this.notificationsEnabled = data.notificationsEnabled || false;
                this.liveMessages = data.liveMessages || [];
                
                this.updatePageStats();
                console.log('Data loaded from localStorage successfully', data);
            } else {
                console.log('No saved data found, starting fresh');
                this.initializeWithSampleData();
            }
        } catch (error) {
            console.error('Failed to load saved data from localStorage:', error);
            this.showNotification('Failed to load saved data', 'error');
            this.initializeWithSampleData();
        }
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            localStorage.removeItem(this.storageKey);
            this.contacts = [];
            this.messages = [];
            this.notificationPages = [];
            this.updateDashboard();
            this.loadTabContent(this.currentTab);
            this.showNotification('All data cleared', 'info');
        }
    }

    exportData() {
        const data = {
            contacts: this.contacts,
            messages: this.messages,
            notificationPages: this.notificationPages,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `letterly-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Data exported successfully', 'success');
    }

    checkForDirectPageAccess() {
        const urlParams = new URLSearchParams(window.location.search);
        const pageId = urlParams.get('page');
        
        if (pageId) {
            // User is accessing a direct notification page
            this.displayNotificationPage(pageId);
        }
    }

    displayNotificationPage(pageId) {
        const page = this.notificationPages.find(p => p.id === pageId);
        
        if (page) {
            // Redirect to the standalone notification page with the page data
            const params = new URLSearchParams({
                id: page.id,
                title: page.title,
                message: page.content,
                theme: page.theme,
                buttonText: page.buttonText || 'Got it!',
                buttonUrl: page.buttonUrl || '',
                imageUrl: page.imageUrl || '',
                countdownDate: page.countdownDate || '',
                includeButton: page.includeButton || false,
                includeImage: page.includeImage || false,
                includeCountdown: page.includeCountdown || false
            });
            
            window.location.href = `notification-page.html?${params.toString()}`;
        } else {
            this.showNotification('Notification page not found', 'error');
        }
    }

    // Live Messages functionality
    loadLiveMessages() {
        const container = document.getElementById('live-messages-container');
        if (!container) return;

        // Get all messages from notification pages for live monitoring
        this.getAllMessages().then(allMessages => {
            // Filter for recent messages (last 24 hours)
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const recentMessages = allMessages.filter(message => 
                new Date(message.createdAt) > oneDayAgo
            );

            if (recentMessages.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-chart-line"></i>
                        <h3>No Recent Messages</h3>
                        <p>Messages from the last 24 hours will appear here.</p>
                    </div>
                `;
                return;
            }

            // Sort by creation time (newest first)
            recentMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            const messagesHTML = recentMessages.map(message => {
                const timeAgo = this.getTimeAgo(new Date(message.createdAt));
                const statusClass = message.status === 'sent' ? 'sent' : 'scheduled';
                const statusIcon = message.status === 'sent' ? 'fas fa-check-circle' : 'fas fa-clock';

                return `
                    <div class="live-message-item ${statusClass}">
                        <div class="live-message-header">
                            <div class="live-message-info">
                                <h4>${message.title || 'Untitled Message'}</h4>
                                <p class="live-message-recipient">
                                    <i class="fas fa-user"></i> ${message.recipientName || 'Unknown Recipient'}
                                </p>
                            </div>
                            <div class="live-message-time">
                                <i class="fas fa-clock"></i>
                                <span>${timeAgo}</span>
                            </div>
                        </div>
                        <div class="live-message-content">
                            <p>${message.content || message.title || 'No content'}</p>
                        </div>
                        <div class="live-message-status">
                            <i class="${statusIcon}"></i>
                            <span>${message.status}</span>
                        </div>
                        <div class="live-message-actions">
                            <button class="btn-small" onclick="messageFlow.previewMessage('${message.pageId}', '${message.pageUrl}')">
                                <i class="fas fa-eye"></i> View
                            </button>
                            <button class="btn-small" onclick="messageFlow.editMessage('${message.id}', '${message.pageId}')">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn-small" onclick="messageFlow.copyMessageUrl('${message.pageId}', '${message.pageUrl}')">
                                <i class="fas fa-link"></i> Copy URL
                            </button>
                            <button class="btn-small" onclick="messageFlow.deleteMessage('${message.id}', '${message.pageId}')">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

            container.innerHTML = messagesHTML;
        });
    }

    // Helper function to get time ago
    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) {
            return `${diffInSeconds}s ago`;
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes}m ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}h ago`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days}d ago`;
        }
    }

    toggleAutoRefresh(enabled) {
        if (enabled) {
            this.startAutoRefresh();
        } else {
            this.stopAutoRefresh();
        }
    }

    startAutoRefresh() {
        this.stopAutoRefresh(); // Clear any existing interval
        this.autoRefreshInterval = setInterval(() => {
            if (this.currentTab === 'live-messages') {
                this.loadLiveMessages();
            }
        }, this.refreshIntervalTime);
    }

    stopAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
            this.autoRefreshInterval = null;
        }
    }

    updateRefreshInterval(value) {
        this.refreshIntervalTime = parseInt(value);
        if (document.getElementById('auto-refresh-toggle').checked) {
            this.startAutoRefresh(); // Restart with new interval
        }
    }

    filterUrls() {
        // Implementation for URL filtering
        this.loadActiveUrls();
    }

    sortUrls() {
        // Implementation for URL sorting
        this.loadActiveUrls();
    }

    // Onboarding functionality
    initOnboardingControls() {
        // Check if we need to show onboarding
        const urlParams = new URLSearchParams(window.location.search);
        const recipient = urlParams.get('recipient');
        const sender = urlParams.get('sender');
        const message = urlParams.get('message');

        if (recipient && sender) {
            this.onboardingData = { recipient, sender, message: message || '' };
            this.showOnboarding();
        }

        // Onboarding navigation
        document.getElementById('onboarding-next').addEventListener('click', () => this.nextOnboardingStep());
        document.getElementById('onboarding-back').addEventListener('click', () => this.previousOnboardingStep());
        document.getElementById('onboarding-skip').addEventListener('click', () => this.skipOnboarding());
        document.getElementById('onboarding-enable-notifications').addEventListener('click', () => this.onboardingEnableNotifications());
        document.getElementById('onboarding-finish').addEventListener('click', () => this.finishOnboarding());
    }

    showOnboarding() {
        // Populate onboarding with data
        document.querySelectorAll('.recipient-name').forEach(el => {
            el.textContent = this.onboardingData.recipient;
        });
        document.querySelectorAll('.sender-name').forEach(el => {
            el.textContent = this.onboardingData.sender;
        });

        // Update greeting
        document.getElementById('onboarding-greeting').textContent = `Welcome, ${this.onboardingData.recipient}!`;
        
        // Show modal
        this.openModal('onboarding-modal');
        this.updateOnboardingProgress();
    }

    nextOnboardingStep() {
        if (this.onboardingStep < 3) {
            // Hide current step
            document.getElementById(`onboarding-step-${this.onboardingStep}`).style.display = 'none';
            
            // Show next step
            this.onboardingStep++;
            document.getElementById(`onboarding-step-${this.onboardingStep}`).style.display = 'block';
            
            this.updateOnboardingProgress();
            this.updateOnboardingButtons();
        }
    }

    previousOnboardingStep() {
        if (this.onboardingStep > 1) {
            // Hide current step
            document.getElementById(`onboarding-step-${this.onboardingStep}`).style.display = 'none';
            
            // Show previous step
            this.onboardingStep--;
            document.getElementById(`onboarding-step-${this.onboardingStep}`).style.display = 'block';
            
            this.updateOnboardingProgress();
            this.updateOnboardingButtons();
        }
    }

    updateOnboardingProgress() {
        const progress = (this.onboardingStep / 3) * 100;
        document.getElementById('onboarding-progress').style.width = `${progress}%`;
        document.getElementById('current-step').textContent = this.onboardingStep;
        document.getElementById('total-steps').textContent = 3;
    }

    updateOnboardingButtons() {
        const nextBtn = document.getElementById('onboarding-next');
        const backBtn = document.getElementById('onboarding-back');
        const enableBtn = document.getElementById('onboarding-enable-notifications');
        const finishBtn = document.getElementById('onboarding-finish');
        const skipBtn = document.getElementById('onboarding-skip');

        // Hide all buttons first
        [nextBtn, backBtn, enableBtn, finishBtn, skipBtn].forEach(btn => {
            btn.style.display = 'none';
        });

        // Show appropriate buttons based on step
        switch (this.onboardingStep) {
            case 1:
                nextBtn.style.display = 'inline-flex';
                skipBtn.style.display = 'inline-flex';
                break;
            case 2:
                backBtn.style.display = 'inline-flex';
                enableBtn.style.display = 'inline-flex';
                skipBtn.style.display = 'inline-flex';
                break;
            case 3:
                backBtn.style.display = 'inline-flex';
                finishBtn.style.display = 'inline-flex';
                break;
        }
    }

    async onboardingEnableNotifications() {
        try {
            if ('Notification' in window) {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    this.notificationsEnabled = true;
                    this.updateNotificationStatus('enabled');
                    this.showNotification('Notifications enabled successfully!', 'success');
                    this.nextOnboardingStep();
                } else {
                    this.showNotification('Notifications permission denied', 'error');
                }
            } else {
                this.showNotification('Notifications not supported in this browser', 'error');
            }
        } catch (error) {
            console.error('Error enabling notifications:', error);
            this.showNotification('Error enabling notifications', 'error');
        }
    }

    skipOnboarding() {
        this.finishOnboarding();
    }

    finishOnboarding() {
        this.closeModal('onboarding-modal');
        
        // If there's a page ID in the URL, show the notification page
        const urlParams = new URLSearchParams(window.location.search);
        const pageId = urlParams.get('page');
        
        if (pageId) {
            this.displayNotificationPage(pageId);
        } else {
            this.showNotification('Welcome to Letterly! Start exploring your messages.', 'success');
        }
    }

    // Initialize with minimal sample data for first-time users
    initializeWithSampleData() {
        // Add one sample contact to help users get started
        this.contacts = [
            {
                id: 'sample-contact',
                name: 'Sample Contact',
                phone: '+1 (555) 000-0000',
                email: 'sample@example.com',
                tags: 'example',
                createdAt: new Date().toISOString()
            }
        ];

        // Start with no messages - users will create their own
        this.messages = [];
        this.notificationPages = [];
        
        this.showNotification('Welcome to Letterly! Start by creating your first notification page.', 'info');
    }

    // Edit a message
    editMessage(messageId) {
        const message = this.messages.find(m => m.id === messageId);
        if (!message) {
            this.showNotification('Message not found', 'error');
            return;
        }

        // Open the composer modal with the message data
        this.openComposerForEdit(message);
    }

    // Open composer modal for editing
    openComposerForEdit(message) {
        // Populate the form with existing message data
        document.getElementById('message-title').value = message.title || '';
        document.getElementById('message-content').value = message.content || '';
        
        // Set the recipient
        const recipientSelect = document.getElementById('recipient-select');
        if (recipientSelect) {
            // Find the contact by name or create a temporary option
            const contact = this.contacts.find(c => c.name === message.recipientName);
            if (contact) {
                recipientSelect.value = contact.id;
            } else {
                // Create a temporary option for the recipient
                const option = document.createElement('option');
                option.value = 'temp_' + message.recipientId;
                option.textContent = message.recipientName;
                recipientSelect.appendChild(option);
                recipientSelect.value = option.value;
            }
        }

        // Set the theme
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect && message.theme) {
            themeSelect.value = message.theme;
        }

        // Set schedule type to "now" by default for editing
        const nowRadio = document.querySelector('input[name="scheduleType"][value="now"]');
        if (nowRadio) {
            nowRadio.checked = true;
            document.getElementById('schedule-datetime-group').style.display = 'none';
        }

        // Update character count
        const charCount = document.getElementById('char-count');
        if (charCount) {
            charCount.textContent = message.content ? message.content.length : 0;
        }

        // Store editing context
        this.editingMessage = {
            originalMessageId: message.id,
            originalMessage: message
        };

        // Update modal title and button
        const modalTitle = document.querySelector('#composer-modal .modal-header h2');
        if (modalTitle) {
            modalTitle.innerHTML = '<i class="fas fa-edit"></i> Edit Message';
        }

        const submitButton = document.querySelector('#message-form button[type="submit"]');
        if (submitButton) {
            submitButton.innerHTML = '<i class="fas fa-save"></i> Update Message';
        }

        // Open the modal
        this.openModal('composer-modal');
    }

    // Update existing message (simplified for localStorage)
    async updateExistingMessage(pageData, scheduleType, scheduleDateTime) {
        try {
            const recipient = this.contacts.find(c => c.id === pageData.recipientId);
            const originalMessage = this.editingMessage.originalMessage;

            // Create updated message data
            const updatedMessageData = {
                ...originalMessage,
                recipientId: pageData.recipientId,
                recipientName: recipient ? recipient.name : originalMessage.recipientName,
                recipientPhone: recipient ? recipient.phone : originalMessage.recipientPhone,
                content: pageData.content,
                title: pageData.title,
                theme: pageData.theme,
                status: scheduleType === 'now' ? 'sent' : 'scheduled',
                scheduledTime: scheduleType === 'scheduled' ? scheduleDateTime : null,
                updatedAt: new Date().toISOString(),
                isUpdated: true
            };

            // Update the message in the main messages array
            const messageIndex = this.messages.findIndex(m => m.id === this.editingMessage.originalMessageId);
            if (messageIndex !== -1) {
                this.messages[messageIndex] = updatedMessageData;
            }

            // Handle immediate send or scheduling
            if (scheduleType === 'now') {
                this.showNotification(
                    `Message updated and sent! Share this URL: ${updatedMessageData.pageUrl}`,
                    'success'
                );
            } else {
                this.showNotification(
                    `Message updated and scheduled for ${this.formatDateTime(scheduleDateTime)}`,
                    'success'
                );
            }

            // Clear editing context
            this.editingMessage = null;

            // Reset modal
            this.resetComposerModal();

            // Save data and close modal
            this.saveData();
            this.closeModal('composer-modal');

            // Update displays
            this.updateDashboard();
            if (this.currentTab === 'messages') {
                this.loadMessages();
            }
            if (this.currentTab === 'live-messages') {
                this.loadLiveMessages();
            }

        } catch (error) {
            console.error('Failed to update message:', error);
            this.showNotification('Failed to update message', 'error');
        }
    }

    // Simplified notification function
    async notifyRecipientOfUpdate(messageData) {
        // In a real app, this would send a notification to the recipient
        // For now, we'll just log it
        console.log('Recipient would be notified of message update:', messageData.recipientName);
    }

    // Reset composer modal to original state
    resetComposerModal() {
        // Reset form
        document.getElementById('message-form').reset();
        
        // Reset character count
        const charCount = document.getElementById('char-count');
        if (charCount) {
            charCount.textContent = '0';
        }

        // Reset modal title and button
        const modalTitle = document.querySelector('#composer-modal .modal-header h2');
        if (modalTitle) {
            modalTitle.innerHTML = '<i class="fas fa-plus"></i> Create Message';
        }

        const submitButton = document.querySelector('#message-form button[type="submit"]');
        if (submitButton) {
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }

        // Clear editing context
        this.editingMessage = null;
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
        
        // Save data after adding contact
        this.saveData();
        
        this.showNotification('Contact added successfully!', 'success');
        
        // Update displays
        this.updateDashboard();
        if (this.currentTab === 'contacts') {
            this.loadContacts();
        }
    }

    // Data Persistence Methods - localStorage only
    saveData() {
        this.saveDataToLocalStorage();
    }

    saveDataToLocalStorage() {
        const data = {
            contacts: this.contacts,
            messages: this.messages,
            notificationPages: this.notificationPages,
            notificationsEnabled: this.notificationsEnabled,
            liveMessages: this.liveMessages,
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem(this.storageKey, JSON.stringify(data));
        console.log('Data saved to localStorage');
    }

    loadSavedData() {
        this.loadSavedDataFromLocalStorage();
    }

    loadSavedDataFromLocalStorage() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (savedData) {
                const data = JSON.parse(savedData);
                this.contacts = data.contacts || [];
                this.messages = data.messages || [];
                this.notificationPages = data.notificationPages || [];
                this.notificationsEnabled = data.notificationsEnabled || false;
                this.liveMessages = data.liveMessages || [];
                console.log('Data loaded from localStorage');
            } else {
                // Initialize with sample data if no saved data exists
                this.initializeWithSampleData();
            }
        } catch (error) {
            console.error('Failed to load data from localStorage:', error);
            this.initializeWithSampleData();
        }
    }

    // Check for scheduled reminders
    checkScheduledReminders() {
        const now = new Date();
        const scheduledMessages = this.messages.filter(m => 
            m.status === 'scheduled' && 
            m.scheduledTime && 
            new Date(m.scheduledTime) <= now
        );

        scheduledMessages.forEach(message => {
            this.showScheduledReminder(message);
            // Mark as sent after showing reminder
            message.status = 'sent';
        });

        if (scheduledMessages.length > 0) {
            this.saveData();
            this.updateDashboard();
            if (this.currentTab === 'messages') {
                this.loadMessages();
            }
        }
    }

    // Show scheduled reminder
    showScheduledReminder(message) {
        const reminderMessage = `Time to send your message to ${message.recipientName}! 
        
Message: ${message.title}
URL: ${message.pageUrl}

Click "Copy URL" to copy the link and send it to your recipient.`;

        // Show browser notification if enabled
        if (this.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
            new Notification('Message Reminder', {
                body: `Time to send your message to ${message.recipientName}!`,
                icon: '/favicon.ico',
                tag: 'message-reminder'
            });
        }

        // Show in-app notification
        this.showNotification(reminderMessage, 'info');
    }

    // Update connection status display
    updateConnectionStatus() {
        const statusElement = document.getElementById('connection-status');
        if (statusElement) {
            statusElement.innerHTML = '<i class="fas fa-check-circle"></i> Local Storage';
            statusElement.className = 'status-indicator connected';
        }
    }

    // Show help modal (simplified without Firebase)
    showHelp() {
        const helpContent = `
            <div style="max-width: 600px; margin: 0 auto;">
                <h3 style="color: rgba(255, 255, 255, 0.9); margin-bottom: 1.5rem;">📱 Letterly Help</h3>
                
                <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <h4 style="color: rgba(255, 255, 255, 0.8); margin-bottom: 0.5rem;">How to Use Letterly</h4>
                    <ol style="color: rgba(255, 255, 255, 0.7); line-height: 1.6;">
                        <li><strong>Add Contacts:</strong> Go to Contacts tab and add recipient information</li>
                        <li><strong>Create Messages:</strong> Use the composer to create notification pages</li>
                        <li><strong>Set Reminders:</strong> Schedule when you want to be reminded to send the link</li>
                        <li><strong>Share Links:</strong> Copy the generated URL and send it to your recipient</li>
                        <li><strong>Track Activity:</strong> Monitor message status and recipient engagement</li>
                    </ol>
                </div>
                
                <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 8px;">
                    <h4 style="color: rgba(255, 255, 255, 0.8); margin-bottom: 0.5rem;">Data Storage</h4>
                    <p style="color: rgba(255, 255, 255, 0.7); line-height: 1.6;">
                        All your data is stored locally in your browser using localStorage. 
                        This means your data stays private and works offline, but it won't sync across devices.
                    </p>
                </div>
            </div>
        `;
        
        this.showModal('help-modal', 'Help', helpContent);
    }

    // Handle reply parameters from notification page
    handleReplyParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const replyRecipient = urlParams.get('recipient');
        const isReply = urlParams.get('reply');
        
        if (isReply === 'true' && replyRecipient) {
            // Clear URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // Open composer with recipient pre-filled
            this.openComposerForReply(replyRecipient);
        }
    }

    // Open composer for reply
    openComposerForReply(recipientName) {
        // Find or create contact for the recipient
        let contact = this.contacts.find(c => c.name === recipientName);
        
        if (!contact) {
            // Create a temporary contact
            contact = {
                id: this.generateId(),
                name: recipientName,
                phone: '',
                email: '',
                tags: 'reply',
                createdAt: new Date().toISOString()
            };
            this.contacts.push(contact);
            this.saveData();
        }
        
        // Open composer
        this.openComposer();
        
        // Pre-fill recipient
        setTimeout(() => {
            const recipientSelect = document.getElementById('recipient-select');
            if (recipientSelect) {
                recipientSelect.value = contact.id;
            }
            
            // Update modal title
            const modalTitle = document.querySelector('#composer-modal .modal-header h2');
            if (modalTitle) {
                modalTitle.innerHTML = '<i class="fas fa-reply"></i> Send Reply';
            }
        }, 100);
    }

    // Copy message URL to clipboard
    async copyMessageUrl(pageUrl) {
        try {
            await navigator.clipboard.writeText(pageUrl);
            this.showNotification('URL copied to clipboard!', 'success');
        } catch (error) {
            console.error('Failed to copy URL:', error);
            this.showNotification('Failed to copy URL', 'error');
        }
    }

    // Preview message in new tab
    previewMessage(pageUrl) {
        window.open(pageUrl, '_blank');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.letterly = new MessageFlow();
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
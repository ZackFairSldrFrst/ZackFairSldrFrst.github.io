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
        
        // Firebase properties
        this.firebaseInitialized = false;
        this.userId = this.generateUserId();
        this.db = null;
        
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
        
        this.init();
    }

    init() {
        this.initEventListeners();
        this.initFirebase();
        this.updateDashboard();
        this.setMinDateTime();
        this.checkForDirectPageAccess();
        this.processAnalytics();
        
        // Set up periodic analytics processing
        setInterval(() => this.processAnalytics(), 5000); // Check every 5 seconds
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
            case 'live-messages':
                this.loadLiveMessages();
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
                        ${message.pageUrl ? `<span>🔗 <a href="${message.pageUrl}" target="_blank" style="color: rgba(255, 255, 255, 0.8); text-decoration: none;">View Page</a></span>` : ''}
                        ${message.theme ? `<span class="theme-indicator ${message.theme}">
                            <i class="fas fa-palette"></i>
                            ${message.theme.charAt(0).toUpperCase() + message.theme.slice(1)}
                        </span>` : ''}
                        ${message.pageId ? `<span>📊 Views: ${this.getPageViews(message.pageId)} | Clicks: ${this.getPageClicks(message.pageId)}</span>` : ''}
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

    async sendMessage() {
        const pageData = this.getPageFormData();
        if (!pageData) return;

        const scheduleType = document.querySelector('input[name="scheduleType"]:checked').value;
        const scheduleDateTime = document.getElementById('schedule-datetime').value;

        const recipient = this.contacts.find(c => c.id === pageData.recipientId);
        
        // Create notification page
        const page = this.createNotificationPage(pageData);
        
        const message = {
            id: this.generateId(),
            recipientId: pageData.recipientId,
            recipientName: recipient.name,
            recipientPhone: recipient.phone,
            content: pageData.content,
            title: pageData.title,
            theme: pageData.theme,
            pageUrl: page.url,
            pageId: page.id,
            status: scheduleType === 'now' ? 'sent' : 'scheduled',
            createdAt: new Date().toISOString(),
            scheduledTime: scheduleType === 'scheduled' ? scheduleDateTime : null
        };

        this.messages.push(message);

        // Send notification immediately if not scheduled
        if (scheduleType === 'now') {
            message.status = 'sent';
            this.showNotification(
                `Notification page created! Share this URL: ${page.url}`,
                'success'
            );
        } else {
            this.showNotification(
                'Notification page created and scheduled successfully!',
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
        if (this.currentTab === 'live-messages') {
            this.loadLiveMessages();
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
        
        // Save data after adding contact
        this.saveData();
        
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

    // Firebase Methods
    generateUserId() {
        // Generate a unique user ID for this browser session
        let userId = localStorage.getItem('letterly_user_id');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
            localStorage.setItem('letterly_user_id', userId);
        }
        return userId;
    }

    async initFirebase() {
        try {
            this.updateCloudStatus('connecting', 'Connecting to cloud...');
            
            // Wait for Firebase to be available
            await this.waitForFirebase();
            
            this.db = window.firebaseDb;
            this.firebaseInitialized = true;
            
            console.log('Firebase initialized in MessageFlow');
            this.updateCloudStatus('connected', 'Connected to cloud');
            
            // Update user ID display
            this.updateUserIdDisplay();
            
            // Load data from Firebase
            await this.loadSavedData();
            
            // Set up real-time listeners
            this.setupRealtimeListeners();
            
        } catch (error) {
            console.error('Failed to initialize Firebase:', error);
            this.updateCloudStatus('disconnected', 'Using local storage');
            this.showNotification('Failed to connect to cloud storage, using local storage', 'warning');
            // Fallback to localStorage
            this.loadSavedDataFromLocalStorage();
        }
    }

    waitForFirebase() {
        return new Promise((resolve, reject) => {
            const checkFirebase = () => {
                if (window.firebaseDb && window.firestore) {
                    resolve();
                } else {
                    setTimeout(checkFirebase, 100);
                }
            };
            checkFirebase();
            
            // Timeout after 10 seconds
            setTimeout(() => reject(new Error('Firebase initialization timeout')), 10000);
        });
    }

    setupRealtimeListeners() {
        if (!this.firebaseInitialized) return;

        try {
            const userDocRef = window.firestore.doc(this.db, 'users', this.userId);
            
            // Listen for real-time updates
            window.firestore.onSnapshot(userDocRef, (doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    this.updateFromFirebaseData(data);
                }
            });
        } catch (error) {
            console.error('Failed to set up real-time listeners:', error);
        }
    }

    updateFromFirebaseData(data) {
        // Update local data with Firebase data
        this.contacts = data.contacts || [];
        this.messages = data.messages || [];
        this.notificationPages = data.notificationPages || [];
        this.notificationsEnabled = data.notificationsEnabled || false;
        this.liveMessages = data.liveMessages || [];
        
        // Update UI
        this.updateDashboard();
        if (this.currentTab !== 'dashboard') {
            this.loadTabContent(this.currentTab);
        }
        this.updatePageStats();
        
        console.log('Data updated from Firebase');
    }

    updateCloudStatus(status, message) {
        const statusDot = document.getElementById('cloud-status-dot');
        const statusText = document.getElementById('cloud-status-text');

        if (statusDot && statusText) {
            statusText.textContent = message;
            statusDot.className = `status-dot ${status}`;
        }
    }

    updateUserIdDisplay() {
        const userIdDisplay = document.getElementById('user-id-display');
        if (userIdDisplay) {
            const shortId = this.userId.replace('user_', '').substring(0, 8);
            userIdDisplay.textContent = `User: ${shortId}`;
        }
    }

    // Data Persistence Methods
    async saveData() {
        if (this.firebaseInitialized) {
            await this.saveDataToFirebase();
        } else {
            this.saveDataToLocalStorage();
        }
    }

    async saveDataToFirebase() {
        const data = {
            contacts: this.contacts,
            messages: this.messages,
            notificationPages: this.notificationPages,
            notificationsEnabled: this.notificationsEnabled,
            liveMessages: this.liveMessages,
            lastUpdated: window.firestore.serverTimestamp(),
            userId: this.userId
        };
        
        try {
            const userDocRef = window.firestore.doc(this.db, 'users', this.userId);
            await window.firestore.setDoc(userDocRef, data);
            console.log('Data saved to Firebase successfully');
            
            // Also save to localStorage as backup
            this.saveDataToLocalStorage();
        } catch (error) {
            console.error('Failed to save data to Firebase:', error);
            this.showNotification('Failed to save to cloud, saved locally', 'warning');
            // Fallback to localStorage
            this.saveDataToLocalStorage();
        }
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
        if (this.firebaseInitialized) {
            await this.loadSavedDataFromFirebase();
        } else {
            this.loadSavedDataFromLocalStorage();
        }
    }

    async loadSavedDataFromFirebase() {
        try {
            const userDocRef = window.firestore.doc(this.db, 'users', this.userId);
            const docSnap = await window.firestore.getDoc(userDocRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                this.contacts = data.contacts || [];
                this.messages = data.messages || [];
                this.notificationPages = data.notificationPages || [];
                this.notificationsEnabled = data.notificationsEnabled || false;
                this.liveMessages = data.liveMessages || [];
                
                this.updatePageStats();
                console.log('Data loaded from Firebase successfully', data);
                this.showNotification('Data synced from cloud', 'success');
            } else {
                console.log('No Firebase data found, checking localStorage');
                // Try to load from localStorage as fallback
                this.loadSavedDataFromLocalStorage();
                
                // If localStorage has data, save it to Firebase
                if (this.contacts.length > 0 || this.messages.length > 0) {
                    await this.saveDataToFirebase();
                } else {
                    this.initializeWithSampleData();
                }
            }
        } catch (error) {
            console.error('Failed to load data from Firebase:', error);
            this.showNotification('Failed to load from cloud, using local data', 'warning');
            // Fallback to localStorage
            this.loadSavedDataFromLocalStorage();
        }
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
        this.updateLiveStats();
        this.loadLiveMessageStream();
        this.loadActiveUrls();
        
        // Start auto-refresh if enabled
        if (document.getElementById('auto-refresh-toggle').checked) {
            this.startAutoRefresh();
        }
    }

    updateLiveStats() {
        const today = new Date().toDateString();
        const todayMessages = this.messages.filter(msg => 
            new Date(msg.createdAt).toDateString() === today
        );
        
        const totalUrls = this.notificationPages.length;
        const totalViews = this.notificationPages.reduce((sum, page) => 
            sum + (page.views || 0), 0
        );
        const totalClicks = this.notificationPages.reduce((sum, page) => 
            sum + (page.clicks || 0), 0
        );

        document.getElementById('live-total-sent').textContent = todayMessages.length;
        document.getElementById('live-total-urls').textContent = totalUrls;
        document.getElementById('live-total-views').textContent = totalViews;
        document.getElementById('live-total-clicks').textContent = totalClicks;
    }

    loadLiveMessageStream() {
        const liveList = document.getElementById('live-messages-list');
        
        if (this.messages.length === 0) {
            liveList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-stream"></i>
                    <h3>No Messages Yet</h3>
                    <p>Messages will appear here in real-time as they are sent</p>
                </div>
            `;
            return;
        }

        // Sort messages by timestamp (newest first)
        const sortedMessages = [...this.messages].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        liveList.innerHTML = sortedMessages.map(message => {
            const recipient = this.contacts.find(c => c.id === message.recipientId);
            const pageUrl = message.pageId ? `${window.location.origin}${window.location.pathname}?page=${message.pageId}` : '';
            const isNew = Date.now() - new Date(message.createdAt).getTime() < 60000; // New if less than 1 minute old

            return `
                <div class="live-message-item ${isNew ? 'new' : ''}">
                    <div class="message-status-dot ${message.status}"></div>
                    <div class="live-message-content">
                        <div class="live-message-recipient">${recipient ? recipient.name : 'Unknown Contact'}</div>
                        <div class="live-message-preview">${message.content.substring(0, 100)}${message.content.length > 100 ? '...' : ''}</div>
                        ${pageUrl ? `<a href="${pageUrl}" class="live-message-url" target="_blank">${pageUrl}</a>` : ''}
                    </div>
                    <div class="live-message-time">${this.formatDateTime(message.createdAt)}</div>
                </div>
            `;
        }).join('');
    }

    loadActiveUrls() {
        const urlsGrid = document.getElementById('live-urls-grid');
        
        if (this.notificationPages.length === 0) {
            urlsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-link"></i>
                    <h3>No Active URLs</h3>
                    <p>Notification page URLs will appear here once created</p>
                </div>
            `;
            return;
        }

        urlsGrid.innerHTML = this.notificationPages.map(page => {
            const pageUrl = `${window.location.origin}${window.location.pathname}?page=${page.id}`;
            const isExpired = page.countdownDate && new Date(page.countdownDate) < new Date();
            
            return `
                <div class="url-card">
                    <div class="url-card-header">
                        <h4 class="url-card-title">${page.title}</h4>
                        <span class="url-status-badge ${isExpired ? 'expired' : 'active'}">
                            ${isExpired ? 'Expired' : 'Active'}
                        </span>
                    </div>
                    <a href="${pageUrl}" class="url-card-url" target="_blank">${pageUrl}</a>
                    <div class="url-card-stats">
                        <span><i class="fas fa-eye"></i> ${page.views || 0} views</span>
                        <span><i class="fas fa-mouse-pointer"></i> ${page.clicks || 0} clicks</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    refreshLiveMessages() {
        this.loadLiveMessages();
        this.showNotification('Live messages refreshed', 'success');
    }

    exportLiveData() {
        const data = {
            messages: this.messages,
            urls: this.notificationPages,
            exportDate: new Date().toISOString(),
            stats: {
                totalMessages: this.messages.length,
                totalUrls: this.notificationPages.length,
                totalViews: this.notificationPages.reduce((sum, page) => sum + (page.views || 0), 0),
                totalClicks: this.notificationPages.reduce((sum, page) => sum + (page.clicks || 0), 0)
            }
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `letterly-live-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Live data exported successfully', 'success');
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
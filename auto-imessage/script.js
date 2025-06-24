import { firebaseAuth, firebaseDB, publicDB, firebaseUtils } from './firebase-config.js';

class Letterly {
    constructor() {
        this.currentUser = null;
        this.contacts = [];
        this.messages = [];
        this.notificationPages = [];
        this.currentTab = 'dashboard';
        this.notificationsEnabled = false;
        this.currentPageId = null;
        this.unsubscribers = []; // Store Firebase listeners for cleanup
        
        this.init();
    }

    async init() {
        this.showLoadingScreen();
        
        // Set up auth state listener
        firebaseAuth.onAuthStateChanged((user) => {
            if (user) {
                this.handleUserSignedIn(user);
            } else {
                this.handleUserSignedOut();
            }
        });

        this.initEventListeners();
        this.setMinDateTime();
        this.hideLoadingScreen();
    }

    showLoadingScreen() {
        document.getElementById('loading-screen').classList.add('active');
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'none';
    }

    hideLoadingScreen() {
        document.getElementById('loading-screen').classList.remove('active');
    }

    async handleUserSignedIn(user) {
        this.currentUser = user;
        this.hideLoadingScreen();
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        
        // Update user UI
        this.updateUserUI(user);
        
        // Load user data
        await this.loadUserData();
        
        // Set up real-time listeners
        this.setupRealtimeListeners();
        
        // Update dashboard
        this.updateDashboard();
        this.loadTabContent('dashboard');
    }

    handleUserSignedOut() {
        this.currentUser = null;
        this.contacts = [];
        this.messages = [];
        this.notificationPages = [];
        
        // Clean up listeners
        this.cleanupListeners();
        
        this.hideLoadingScreen();
        document.getElementById('main-app').style.display = 'none';
        document.getElementById('auth-screen').style.display = 'flex';
    }

    updateUserUI(user) {
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');
        
        userAvatar.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=4f46e5&color=fff`;
        userName.textContent = user.displayName || user.email.split('@')[0];
    }

    async loadUserData() {
        if (!this.currentUser) return;

        try {
            // Load contacts
            const contactsResult = await firebaseDB.contacts.getAll(this.currentUser.uid);
            if (contactsResult.success) {
                this.contacts = contactsResult.data;
                this.populateRecipientSelect();
            }

            // Load pages
            const pagesResult = await firebaseDB.pages.getAll(this.currentUser.uid);
            if (pagesResult.success) {
                this.notificationPages = pagesResult.data;
            }

            // Load messages
            const messagesResult = await firebaseDB.messages.getAll(this.currentUser.uid);
            if (messagesResult.success) {
                this.messages = messagesResult.data;
            }

        } catch (error) {
            console.error('Error loading user data:', error);
            this.showNotification('Failed to load your data', 'error');
        }
    }

    setupRealtimeListeners() {
        if (!this.currentUser) return;

        // Listen to contacts changes
        const contactsUnsubscriber = firebaseDB.contacts.listen(this.currentUser.uid, (contacts) => {
            this.contacts = contacts;
            this.populateRecipientSelect();
            if (this.currentTab === 'contacts') {
                this.loadContacts();
            }
            this.updateDashboard();
        });

        // Listen to pages changes
        const pagesUnsubscriber = firebaseDB.pages.listen(this.currentUser.uid, (pages) => {
            this.notificationPages = pages;
            if (this.currentTab === 'messages') {
                this.loadMessages();
            }
            this.updateDashboard();
        });

        // Listen to messages changes
        const messagesUnsubscriber = firebaseDB.messages.listen(this.currentUser.uid, (messages) => {
            this.messages = messages;
            if (this.currentTab === 'messages') {
                this.loadMessages();
            }
            this.updateDashboard();
        });

        this.unsubscribers = [contactsUnsubscriber, pagesUnsubscriber, messagesUnsubscriber];
    }

    cleanupListeners() {
        this.unsubscribers.forEach(unsubscriber => {
            if (typeof unsubscriber === 'function') {
                unsubscriber();
            }
        });
        this.unsubscribers = [];
    }

    // Authentication Methods
    initEventListeners() {
        // Auth tabs
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
                
                e.target.classList.add('active');
                const formId = e.target.dataset.tab === 'signin' ? 'signin-form' : 'signup-form';
                document.getElementById(formId).classList.add('active');
            });
        });

        // Auth forms
        document.getElementById('signin-form').addEventListener('submit', this.handleSignIn.bind(this));
        document.getElementById('signup-form').addEventListener('submit', this.handleSignUp.bind(this));
        document.getElementById('google-signin').addEventListener('click', this.handleGoogleSignIn.bind(this));
        document.getElementById('google-signup').addEventListener('click', this.handleGoogleSignIn.bind(this));

        // User menu
        document.getElementById('user-menu-btn').addEventListener('click', this.toggleUserMenu.bind(this));
        document.getElementById('user-signout').addEventListener('click', this.handleSignOut.bind(this));

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = e.target.closest('.nav-link').dataset.tab;
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
        
        // Settings and notifications
        document.getElementById('settings-btn').addEventListener('click', () => this.openSettings());
        document.getElementById('test-notification-btn').addEventListener('click', () => this.testNotification());
        document.getElementById('enable-notifications-btn').addEventListener('click', () => this.enableNotifications());

        // Modal controls
        this.initModalControls();

        // Form controls
        this.initFormControls();

        // Character counter for message content
        const messageContent = document.getElementById('message-content');
        if (messageContent) {
            messageContent.addEventListener('input', (e) => {
                document.getElementById('char-count').textContent = e.target.value.length;
            });
        }
    }

    async handleSignIn(e) {
        e.preventDefault();
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;
        
        const result = await firebaseAuth.signIn(email, password);
        if (!result.success) {
            this.showNotification(result.error, 'error');
        }
    }

    async handleSignUp(e) {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
        const result = await firebaseAuth.signUp(email, password, name);
        if (!result.success) {
            this.showNotification(result.error, 'error');
        }
    }

    async handleGoogleSignIn() {
        const result = await firebaseAuth.signInWithGoogle();
        if (!result.success) {
            this.showNotification(result.error, 'error');
        }
    }

    async handleSignOut() {
        const result = await firebaseAuth.signOut();
        if (!result.success) {
            this.showNotification(result.error, 'error');
        }
    }

    toggleUserMenu() {
        const dropdown = document.getElementById('user-dropdown');
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }

    // Modal and Form Controls
    initModalControls() {
        // Composer modal
        const composerClose = document.getElementById('composer-close');
        if (composerClose) {
            composerClose.addEventListener('click', () => this.closeModal('composer-modal'));
        }

        // AI modal
        const aiModalClose = document.getElementById('ai-modal-close');
        if (aiModalClose) {
            aiModalClose.addEventListener('click', () => this.closeModal('ai-modal'));
        }

        // Contact modal
        const contactModalClose = document.getElementById('contact-modal-close');
        if (contactModalClose) {
            contactModalClose.addEventListener('click', () => this.closeModal('contact-modal'));
        }

        // Preview modal
        const previewClose = document.getElementById('page-preview-close');
        if (previewClose) {
            previewClose.addEventListener('click', () => this.closeModal('page-preview-modal'));
        }

        // Close on background click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    initFormControls() {
        // Message form
        const messageForm = document.getElementById('message-form');
        if (messageForm) {
            messageForm.addEventListener('submit', this.sendMessage.bind(this));
        }

        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.addContact.bind(this));
        }

        // Page elements toggles
        document.getElementById('include-button')?.addEventListener('change', (e) => {
            document.getElementById('button-config').style.display = e.target.checked ? 'block' : 'none';
        });

        document.getElementById('include-image')?.addEventListener('change', (e) => {
            document.getElementById('image-config').style.display = e.target.checked ? 'block' : 'none';
        });

        document.getElementById('include-countdown')?.addEventListener('change', (e) => {
            document.getElementById('countdown-config').style.display = e.target.checked ? 'block' : 'none';
        });

        // Schedule type radio buttons
        document.querySelectorAll('input[name="scheduleType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const scheduleGroup = document.getElementById('schedule-datetime-group');
                if (scheduleGroup) {
                    scheduleGroup.style.display = e.target.value === 'scheduled' ? 'block' : 'none';
                }
            });
        });

        // Preview and save buttons
        document.getElementById('preview-page-btn')?.addEventListener('click', () => this.previewPage());
        document.getElementById('save-draft-btn')?.addEventListener('click', () => this.saveDraft());

        // AI Assistant
        document.getElementById('generate-ai-message')?.addEventListener('click', () => this.generateAIMessage());

        // AI template selection
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.template-btn').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                
                const template = e.target.dataset.template;
                const customInput = document.getElementById('custom-ai-input');
                if (customInput) {
                    customInput.style.display = template === 'custom' ? 'block' : 'none';
                }
            });
        });
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
        document.getElementById('total-messages').textContent = this.notificationPages.length;
        document.getElementById('total-contacts').textContent = this.contacts.length;
        
        const totalViews = this.notificationPages.reduce((sum, page) => sum + (page.views || 0), 0);
        const totalClicks = this.notificationPages.reduce((sum, page) => sum + (page.clicks || 0), 0);
        
        document.getElementById('total-views-count').textContent = totalViews;
        document.getElementById('total-clicks-count').textContent = totalClicks;

        // Update sidebar counts
        document.getElementById('scheduled-count').textContent = this.notificationPages.length;
        document.getElementById('sent-count').textContent = totalViews;
        document.getElementById('failed-count').textContent = totalClicks;

        this.loadRecentActivity();
    }

    loadRecentActivity() {
        const container = document.getElementById('recent-activity');
        if (!container) return;

        const activities = [];
        
        // Add recent pages
        this.notificationPages.slice(0, 5).forEach(page => {
            activities.push({
                icon: 'fas fa-file-alt',
                text: `Created page "${page.title}"`,
                time: firebaseUtils.formatTimestamp(page.createdAt),
                type: 'page'
            });
        });

        // Add recent contacts
        this.contacts.slice(0, 3).forEach(contact => {
            activities.push({
                icon: 'fas fa-user-plus',
                text: `Added contact ${contact.name}`,
                time: firebaseUtils.formatTimestamp(contact.createdAt),
                type: 'contact'
            });
        });

        // Sort by time
        activities.sort((a, b) => new Date(b.time) - new Date(a.time));

        container.innerHTML = activities.length > 0 
            ? activities.slice(0, 10).map(activity => `
                <div class="activity-item">
                    <i class="${activity.icon}"></i>
                    <div class="activity-content">
                        <p>${activity.text}</p>
                        <span class="activity-time">${activity.time}</span>
                    </div>
                </div>
            `).join('')
            : '<p class="empty-state">No recent activity</p>';
    }

    // Messages/Pages Management
    loadMessages() {
        const container = document.getElementById('messages-list');
        if (!container) return;

        if (this.notificationPages.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-alt"></i>
                    <h3>No notification pages yet</h3>
                    <p>Create your first beautiful notification page to get started!</p>
                    <button class="btn-primary" onclick="letterly.openComposer()">
                        <i class="fas fa-plus"></i> Create Page
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.notificationPages.map(page => `
            <div class="message-card">
                <div class="message-header">
                    <h3>${page.title}</h3>
                    <span class="status-badge ${page.status}">${page.status}</span>
                </div>
                <div class="message-content">
                    <p>${page.content}</p>
                </div>
                <div class="message-meta">
                    <span>📊 Views: ${page.views || 0} | Clicks: ${page.clicks || 0}</span>
                    <span>🎨 Theme: ${page.theme}</span>
                    <span>📅 ${firebaseUtils.formatTimestamp(page.createdAt)}</span>
                </div>
                <div class="message-actions">
                    <button class="btn-secondary" onclick="letterly.copyPageUrl('${page.id}')">
                        <i class="fas fa-copy"></i> Copy URL
                    </button>
                    <button class="btn-secondary" onclick="letterly.editPage('${page.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Contacts Management
    loadContacts() {
        const container = document.getElementById('contacts-list');
        if (!container) return;

        if (this.contacts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>No contacts yet</h3>
                    <p>Add your first contact to start sending beautiful notification pages!</p>
                    <button class="btn-primary" onclick="letterly.openContactModal()">
                        <i class="fas fa-user-plus"></i> Add Contact
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.contacts.map(contact => `
            <div class="contact-card">
                <div class="contact-header">
                    <h3>${contact.name}</h3>
                    <button class="btn-secondary" onclick="letterly.messageContact('${contact.id}')">
                        <i class="fas fa-paper-plane"></i> Send Page
                    </button>
                </div>
                <div class="contact-info">
                    <p><i class="fas fa-phone"></i> ${contact.phone}</p>
                    ${contact.email ? `<p><i class="fas fa-envelope"></i> ${contact.email}</p>` : ''}
                    ${contact.tags ? `<div class="contact-tags">
                        ${contact.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
                    </div>` : ''}
                </div>
                <div class="contact-actions">
                    <button class="btn-secondary" onclick="letterly.editContact('${contact.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-secondary" onclick="letterly.deleteContact('${contact.id}')" style="color: #ef4444;">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Analytics
    loadAnalytics() {
        const totalViews = this.notificationPages.reduce((sum, page) => sum + (page.views || 0), 0);
        const totalClicks = this.notificationPages.reduce((sum, page) => sum + (page.clicks || 0), 0);
        const clickRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0;

        document.getElementById('analytics-views').textContent = totalViews;
        document.getElementById('analytics-clicks').textContent = totalClicks;
        document.getElementById('analytics-rate').textContent = `${clickRate}%`;
    }

    // Page Creation and Management
    async sendMessage() {
        if (!this.currentUser) {
            this.showNotification('Please sign in to create pages', 'error');
            return;
        }

        const recipientId = document.getElementById('recipient').value;
        const title = document.getElementById('page-title').value;
        const content = document.getElementById('message-content').value;
        const theme = document.getElementById('page-theme').value;
        const scheduleType = document.querySelector('input[name="scheduleType"]:checked').value;
        const scheduleDateTime = document.getElementById('schedule-datetime').value;

        if (!recipientId || !title || !content) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        const recipient = this.contacts.find(c => c.id === recipientId);
        if (!recipient) {
            this.showNotification('Please select a valid recipient', 'error');
            return;
        }

        // Get page elements
        const includeButton = document.getElementById('include-button').checked;
        const includeImage = document.getElementById('include-image').checked;
        const includeCountdown = document.getElementById('include-countdown').checked;

        const pageData = {
            title,
            content,
            theme,
            recipientId,
            recipientName: recipient.name,
            recipientPhone: recipient.phone,
            includeButton,
            includeImage,
            includeCountdown,
            status: 'active',
            views: 0,
            clicks: 0
        };

        if (includeButton) {
            pageData.buttonText = document.getElementById('button-text').value || 'Got it!';
            pageData.buttonUrl = document.getElementById('button-url').value || '';
        }

        if (includeImage) {
            pageData.imageUrl = document.getElementById('image-url').value || '';
        }

        if (includeCountdown) {
            pageData.countdownDate = document.getElementById('countdown-date').value || '';
        }

        try {
            // Create page in Firebase
            const pageResult = await firebaseDB.pages.add(this.currentUser.uid, pageData);
            if (!pageResult.success) {
                throw new Error(pageResult.error);
            }

            // Create message record
            const messageData = {
                pageId: pageResult.id,
                title,
                content,
                recipientId,
                recipientName: recipient.name,
                recipientPhone: recipient.phone,
                theme,
                status: scheduleType === 'now' ? 'sent' : 'scheduled',
                scheduledTime: scheduleType === 'scheduled' ? scheduleDateTime : null
            };

            const messageResult = await firebaseDB.messages.add(this.currentUser.uid, messageData);
            if (!messageResult.success) {
                throw new Error(messageResult.error);
            }

            // Generate shareable URL
            const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '');
            const pageUrl = `${baseUrl}/notification-page.html?id=${pageResult.id}`;

            this.showNotification(
                scheduleType === 'now' 
                    ? `Notification page created! Share this URL: ${pageUrl}`
                    : 'Notification page created and scheduled successfully!',
                'success'
            );

            this.closeModal('composer-modal');
            this.clearForm();

        } catch (error) {
            console.error('Error creating page:', error);
            this.showNotification('Failed to create notification page', 'error');
        }
    }

    async addContact() {
        if (!this.currentUser) {
            this.showNotification('Please sign in to add contacts', 'error');
            return;
        }

        const name = document.getElementById('contact-name').value;
        const phone = document.getElementById('contact-phone').value;
        const email = document.getElementById('contact-email').value;
        const tags = document.getElementById('contact-tags').value;

        if (!name || !phone) {
            this.showNotification('Please enter a name and phone number', 'error');
            return;
        }

        const contactData = {
            name,
            phone,
            email,
            tags
        };

        try {
            const result = await firebaseDB.contacts.add(this.currentUser.uid, contactData);
            if (result.success) {
                this.showNotification('Contact added successfully!', 'success');
                this.closeModal('contact-modal');
                document.getElementById('contact-form').reset();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error adding contact:', error);
            this.showNotification('Failed to add contact', 'error');
        }
    }

    // Utility Methods
    openModal(modalId) {
        document.getElementById(modalId).classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        document.body.style.overflow = '';
    }

    openComposer() {
        this.populateRecipientSelect();
        this.openModal('composer-modal');
    }

    openContactModal() {
        this.openModal('contact-modal');
    }

    openAIModal() {
        this.openModal('ai-modal');
    }

    openSettings() {
        this.showNotification('Settings panel coming soon!', 'info');
    }

    populateRecipientSelect() {
        const select = document.getElementById('recipient');
        if (!select) return;

        select.innerHTML = '<option value="">Select a contact</option>' +
            this.contacts.map(contact => 
                `<option value="${contact.id}">${contact.name} (${contact.phone})</option>`
            ).join('');
    }

    clearForm() {
        document.getElementById('message-form').reset();
        document.getElementById('char-count').textContent = '0';
        document.querySelectorAll('.element-config').forEach(config => {
            config.style.display = 'none';
        });
        document.getElementById('schedule-datetime-group').style.display = 'none';
    }

    messageContact(contactId) {
        const contact = this.contacts.find(c => c.id === contactId);
        if (contact) {
            this.openComposer();
            document.getElementById('recipient').value = contactId;
        }
    }

    async copyPageUrl(pageId) {
        const page = this.notificationPages.find(p => p.id === pageId);
        if (!page) return;

        const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '');
        const pageUrl = `${baseUrl}/notification-page.html?id=${pageId}`;

        try {
            await navigator.clipboard.writeText(pageUrl);
            this.showNotification('Page URL copied to clipboard!', 'success');
        } catch (error) {
            this.showNotification('Failed to copy URL', 'error');
        }
    }

    previewPage() {
        // Implementation for page preview
        this.showNotification('Preview feature coming soon!', 'info');
    }

    saveDraft() {
        this.showNotification('Draft saved locally!', 'info');
    }

    generateAIMessage() {
        this.showNotification('AI message generation coming soon!', 'info');
    }

    async enableNotifications() {
        if (!('Notification' in window)) {
            this.showNotification('Your browser does not support notifications', 'error');
            return;
        }

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            this.notificationsEnabled = true;
            this.showNotification('Notifications enabled!', 'success');
        } else {
            this.showNotification('Notification permission denied', 'error');
        }
    }

    testNotification() {
        if (!('Notification' in window)) {
            this.showNotification('Your browser does not support notifications', 'error');
            return;
        }

        if (Notification.permission === 'granted') {
            new Notification('Letterly Test', {
                body: 'This is a test notification. Your notification system is working!',
                icon: '/favicon.ico'
            });
            this.showNotification('Test notification sent!', 'success');
        } else {
            this.showNotification('Please enable notifications first', 'info');
        }
    }

    setMinDateTime() {
        const scheduleInput = document.getElementById('schedule-datetime');
        if (scheduleInput) {
            const now = new Date();
            const minDateTime = now.toISOString().slice(0, 16);
            scheduleInput.min = minDateTime;
        }
    }

    showNotification(message, type = 'info') {
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
            max-width: 400px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.letterly = new Letterly();
});

// Add required CSS animations
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
    
    .loading-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .loading-screen.active {
        opacity: 1;
        visibility: visible;
    }
    
    .loading-content {
        text-align: center;
        color: white;
    }
    
    .loading-icon {
        font-size: 4rem;
        margin-bottom: 2rem;
        animation: pulse 2s infinite;
    }
    
    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(255,255,255,0.3);
        border-top: 4px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 2rem auto;
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .auth-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .auth-container {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 3rem;
        width: 100%;
        max-width: 400px;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .auth-header {
        text-align: center;
        margin-bottom: 2rem;
        color: white;
    }
    
    .auth-header i {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    
    .auth-tabs {
        display: flex;
        margin-bottom: 2rem;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.1);
        padding: 4px;
    }
    
    .auth-tab {
        flex: 1;
        padding: 0.75rem;
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.7);
        border-radius: 8px;
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .auth-tab.active {
        background: rgba(255, 255, 255, 0.2);
        color: white;
    }
    
    .auth-form {
        display: none;
    }
    
    .auth-form.active {
        display: block;
    }
    
    .auth-form .form-group {
        margin-bottom: 1.5rem;
    }
    
    .auth-form label {
        display: block;
        margin-bottom: 0.5rem;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 500;
    }
    
    .auth-form input {
        width: 100%;
        padding: 1rem;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        backdrop-filter: blur(10px);
    }
    
    .auth-form input::placeholder {
        color: rgba(255, 255, 255, 0.6);
    }
    
    .auth-divider {
        text-align: center;
        margin: 1.5rem 0;
        position: relative;
        color: rgba(255, 255, 255, 0.7);
    }
    
    .auth-divider::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background: rgba(255, 255, 255, 0.3);
    }
    
    .auth-divider span {
        background: inherit;
        padding: 0 1rem;
    }
    
    .user-menu {
        position: relative;
    }
    
    .user-avatar {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 10px;
        transition: background 0.3s ease;
    }
    
    .user-avatar:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    
    .user-avatar img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
    }
    
    .user-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        padding: 0.5rem 0;
        min-width: 200px;
        display: none;
        z-index: 1000;
    }
    
    .user-dropdown a {
        display: block;
        padding: 0.75rem 1rem;
        color: rgba(255, 255, 255, 0.9);
        text-decoration: none;
        transition: background 0.3s ease;
    }
    
    .user-dropdown a:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    
    .user-dropdown hr {
        border: none;
        height: 1px;
        background: rgba(255, 255, 255, 0.2);
        margin: 0.5rem 0;
    }
    
    .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        color: rgba(255, 255, 255, 0.7);
    }
    
    .empty-state i {
        font-size: 4rem;
        margin-bottom: 1rem;
        color: rgba(255, 255, 255, 0.5);
    }
    
    .empty-state h3 {
        margin-bottom: 1rem;
        color: rgba(255, 255, 255, 0.9);
    }
`;
document.head.appendChild(notificationStyles); 
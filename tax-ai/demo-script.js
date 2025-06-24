// Platform Demo JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializePlatform();
    initializeAnimations();
    initializeInteractivity();
});

function initializePlatform() {
    // Initialize sidebar navigation
    const navItems = document.querySelectorAll('.nav-item[data-section]');
    const sections = document.querySelectorAll('.platform-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.dataset.section;
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Update active section
            sections.forEach(section => section.classList.remove('active'));
            const targetElement = document.getElementById(`${targetSection}-section`);
            if (targetElement) {
                targetElement.classList.add('active');
            }
            
            // Trigger section-specific animations
            triggerSectionAnimations(targetSection);
        });
    });
    
    // Initialize global search
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
        globalSearch.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        globalSearch.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    }
    
    // Initialize notification bell
    const notificationBell = document.querySelector('.notification-bell');
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            showNotificationDropdown();
        });
    }
    
    // Initialize user profile dropdown
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.addEventListener('click', function() {
            showUserDropdown();
        });
    }
}

function initializeAnimations() {
    // Animate stat counters
    animateStatCounters();
    
    // Animate chart bars
    animateChartBars();
    
    // Animate activity list
    animateActivityList();
    
    // Animate usage meter
    animateUsageMeter();
}

function animateStatCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const isDecimal = target.toString().includes('.');
        const increment = isDecimal ? target / 50 : Math.ceil(target / 50);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
                clearInterval(timer);
            } else {
                counter.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();
            }
        }, 40);
    });
}

function animateChartBars() {
    const chartBars = document.querySelectorAll('.chart-bar');
    
    chartBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.animation = 'chartBarGrow 0.6s ease-out forwards';
        }, index * 100);
        
        bar.addEventListener('mouseenter', function() {
            this.querySelector('.bar-value').style.opacity = '1';
        });
        
        bar.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.querySelector('.bar-value').style.opacity = '0';
            }
        });
    });
}

function animateActivityList() {
    const activityItems = document.querySelectorAll('.activity-item');
    
    activityItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
        
        // Set initial state
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.3s ease';
    });
}

function animateUsageMeter() {
    const usageFill = document.querySelector('.usage-fill');
    if (usageFill) {
        setTimeout(() => {
            usageFill.style.width = '65%';
        }, 500);
        usageFill.style.width = '0%';
    }
}

function initializeInteractivity() {
    // Initialize chat functionality
    initializeChat();
    
    // Initialize TaxScan functionality
    initializeTaxScan();
    
    // Initialize widget interactions
    initializeWidgets();
    
    // Initialize tooltips and popovers
    initializeTooltips();
}

function initializeChat() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.querySelector('.send-btn');
    const chatMessages = document.querySelector('.chat-messages');
    
    if (chatInput && sendBtn) {
        function sendMessage() {
            const message = chatInput.value.trim();
            if (!message) return;
            
            // Add user message
            addChatMessage(message, 'user');
            chatInput.value = '';
            
            // Simulate AI response
            setTimeout(() => {
                addChatMessage('I\'m analyzing your question. This is a demo response showing how the AI would provide detailed tax research with relevant code sections and case law.', 'ai');
            }, 1500);
        }
        
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Chat history interaction
        const chatHistoryItems = document.querySelectorAll('.chat-history-item');
        chatHistoryItems.forEach(item => {
            item.addEventListener('click', function() {
                chatHistoryItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                // Load chat history would go here in real app
            });
        });
    }
}

function addChatMessage(text, sender) {
    const chatMessages = document.querySelector('.chat-messages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-time">${timeString}</div>
            </div>
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-actions">
                    <button class="message-action">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                    <button class="message-action">
                        <i class="fas fa-bookmark"></i> Save
                    </button>
                    <button class="message-action">
                        <i class="fas fa-share"></i> Share
                    </button>
                </div>
                <div class="message-time">${timeString}</div>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Animate new message
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(20px)';
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 100);
}

function initializeTaxScan() {
    const uploadZone = document.querySelector('.upload-zone');
    const uploadBtn = document.querySelector('.upload-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Upload zone interactions
    if (uploadZone) {
        uploadZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        uploadZone.addEventListener('dragleave', function() {
            this.classList.remove('dragover');
        });
        
        uploadZone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            simulateFileUpload();
        });
        
        uploadZone.addEventListener('click', function() {
            // Simulate file picker
            simulateFileUpload();
        });
    }
    
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            simulateFileUpload();
        });
    }
    
    // Tab functionality
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${targetTab}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Alert action buttons
    const alertBtns = document.querySelectorAll('.alert-btn');
    alertBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            showActionFeedback(action);
        });
    });
}

function simulateFileUpload() {
    // Create upload feedback
    const uploadZone = document.querySelector('.upload-zone');
    if (!uploadZone) return;
    
    const originalContent = uploadZone.innerHTML;
    
    uploadZone.innerHTML = `
        <div class="upload-progress">
            <i class="fas fa-spinner fa-spin" style="font-size: 48px; color: #00d9ff; margin-bottom: 16px;"></i>
            <h4>Uploading and analyzing...</h4>
            <p>Processing Form 1120S - Corporate Tax Return</p>
            <div class="progress-bar" style="width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; margin: 16px 0;">
                <div class="progress-fill" style="height: 100%; background: #00d9ff; border-radius: 4px; width: 0%; transition: width 2s ease;"></div>
            </div>
        </div>
    `;
    
    // Animate progress
    setTimeout(() => {
        const progressFill = uploadZone.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = '100%';
        }
    }, 100);
    
    // Complete upload
    setTimeout(() => {
        uploadZone.innerHTML = `
            <div class="upload-complete">
                <i class="fas fa-check-circle" style="font-size: 48px; color: #22c55e; margin-bottom: 16px;"></i>
                <h4>Analysis Complete!</h4>
                <p>Found 2 critical alerts and 8 optimization opportunities</p>
                <button class="btn-primary" onclick="resetUploadZone()">Upload Another Document</button>
            </div>
        `;
        
        // Highlight scan results
        const scanResults = document.querySelector('.scan-results');
        if (scanResults) {
            scanResults.style.transform = 'scale(1.02)';
            scanResults.style.boxShadow = '0 8px 32px rgba(0, 217, 255, 0.2)';
            setTimeout(() => {
                scanResults.style.transform = 'scale(1)';
                scanResults.style.boxShadow = 'none';
            }, 1000);
        }
    }, 2500);
}

function resetUploadZone() {
    const uploadZone = document.querySelector('.upload-zone');
    if (!uploadZone) return;
    
    uploadZone.innerHTML = `
        <div class="upload-icon">
            <i class="fas fa-cloud-upload-alt"></i>
        </div>
        <h4>Upload Tax Documents</h4>
        <p>Drag & drop or click to upload 1040, 1065, 1120, 1120-S returns</p>
        <button class="upload-btn">Choose Files</button>
        <div class="upload-formats">
            Supported: PDF, JPG, PNG, TIFF (Max 10MB each)
        </div>
    `;
    
    // Re-initialize upload functionality
    initializeTaxScan();
}

function initializeWidgets() {
    // Widget action buttons
    const widgetBtns = document.querySelectorAll('.widget-btn');
    widgetBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            // Show tooltip or perform action
            showTooltip(this, 'Widget action');
        });
    });
    
    // Schedule items
    const scheduleItems = document.querySelectorAll('.schedule-item');
    scheduleItems.forEach(item => {
        item.addEventListener('click', function() {
            if (!this.classList.contains('current')) {
                showScheduleDetails(this);
            }
        });
    });
    
    // Activity items
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach(item => {
        item.addEventListener('click', function() {
            showActivityDetails(this);
        });
    });
}

function initializeTooltips() {
    // Simple tooltip implementation
    const tooltipElements = document.querySelectorAll('[title]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            showTooltip(e.target, e.target.getAttribute('title'));
            e.target.removeAttribute('title');
        });
    });
}

function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    
    setTimeout(() => tooltip.style.opacity = '1', 10);
    
    setTimeout(() => {
        tooltip.style.opacity = '0';
        setTimeout(() => tooltip.remove(), 200);
    }, 2000);
}

function showNotificationDropdown() {
    // Create notification dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'notification-dropdown';
    dropdown.innerHTML = `
        <div class="notification-header">
            <h4>Notifications</h4>
            <button class="mark-all-read">Mark all read</button>
        </div>
        <div class="notification-list">
            <div class="notification-item unread">
                <i class="fas fa-file-alt"></i>
                <div>
                    <div class="notification-title">New TaxScan analysis complete</div>
                    <div class="notification-time">2 minutes ago</div>
                </div>
            </div>
            <div class="notification-item unread">
                <i class="fas fa-calendar"></i>
                <div>
                    <div class="notification-title">Meeting reminder: Johnson & Associates</div>
                    <div class="notification-time">5 minutes ago</div>
                </div>
            </div>
            <div class="notification-item">
                <i class="fas fa-users"></i>
                <div>
                    <div class="notification-title">New connection request</div>
                    <div class="notification-time">1 hour ago</div>
                </div>
            </div>
        </div>
    `;
    
    // Position and show dropdown
    const bell = document.querySelector('.notification-bell');
    const rect = bell.getBoundingClientRect();
    
    dropdown.style.cssText = `
        position: fixed;
        top: ${rect.bottom + 8}px;
        right: ${window.innerWidth - rect.right}px;
        width: 320px;
        background: rgba(15, 15, 25, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 16px;
        z-index: 1001;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.2s ease;
    `;
    
    document.body.appendChild(dropdown);
    
    setTimeout(() => {
        dropdown.style.opacity = '1';
        dropdown.style.transform = 'translateY(0)';
    }, 10);
    
    // Close on outside click
    setTimeout(() => {
        document.addEventListener('click', function closeDropdown(e) {
            if (!dropdown.contains(e.target) && !bell.contains(e.target)) {
                dropdown.style.opacity = '0';
                dropdown.style.transform = 'translateY(-10px)';
                setTimeout(() => dropdown.remove(), 200);
                document.removeEventListener('click', closeDropdown);
            }
        });
    }, 100);
}

function showUserDropdown() {
    // Create user dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'user-dropdown';
    dropdown.innerHTML = `
        <div class="user-info">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMwMGQ5ZmYiLz4KPHN2ZyB4PSI4IiB5PSI2IiB3aWR0aD0iMTYiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0id2hpdGUiPgo8cGF0aCBkPSJNOCAxYzEuMSAwIDIgLjkgMiAycy0uOSAyLTIgMi0yLS45LTItMiAuOS0yIDItMnptNSAxMmgtMnYtMmgtMnYySDd2LTJjMC0xLjMzIDIuNjctMiAzLTIgLjMzIDAgMyAuNjcgMyAydjJ6Ii8+Cjwvc3ZnPgo8L3N2Zz4=" alt="Profile">
            <div>
                <div class="user-name">Sarah Chen</div>
                <div class="user-role">Senior Tax Manager</div>
            </div>
        </div>
        <div class="user-menu">
            <a href="#" class="menu-item">
                <i class="fas fa-user"></i>
                Profile Settings
            </a>
            <a href="#" class="menu-item">
                <i class="fas fa-cog"></i>
                Preferences
            </a>
            <a href="#" class="menu-item">
                <i class="fas fa-bell"></i>
                Notifications
            </a>
            <a href="#" class="menu-item">
                <i class="fas fa-question-circle"></i>
                Help & Support
            </a>
            <div class="menu-divider"></div>
            <a href="index.html" class="menu-item">
                <i class="fas fa-sign-out-alt"></i>
                Exit Demo
            </a>
        </div>
    `;
    
    // Position and show dropdown
    const profile = document.querySelector('.user-profile');
    const rect = profile.getBoundingClientRect();
    
    dropdown.style.cssText = `
        position: fixed;
        top: ${rect.bottom + 8}px;
        right: ${window.innerWidth - rect.right}px;
        width: 240px;
        background: rgba(15, 15, 25, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 16px;
        z-index: 1001;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.2s ease;
    `;
    
    document.body.appendChild(dropdown);
    
    setTimeout(() => {
        dropdown.style.opacity = '1';
        dropdown.style.transform = 'translateY(0)';
    }, 10);
    
    // Close on outside click
    setTimeout(() => {
        document.addEventListener('click', function closeDropdown(e) {
            if (!dropdown.contains(e.target) && !profile.contains(e.target)) {
                dropdown.style.opacity = '0';
                dropdown.style.transform = 'translateY(-10px)';
                setTimeout(() => dropdown.remove(), 200);
                document.removeEventListener('click', closeDropdown);
            }
        });
    }, 100);
}

function showActionFeedback(action) {
    const feedback = document.createElement('div');
    feedback.className = 'action-feedback';
    feedback.textContent = `${action} completed successfully`;
    feedback.style.cssText = `
        position: fixed;
        top: 80px;
        right: 24px;
        background: rgba(34, 197, 94, 0.9);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 1000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.style.opacity = '1';
        feedback.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        feedback.style.opacity = '0';
        feedback.style.transform = 'translateX(100%)';
        setTimeout(() => feedback.remove(), 300);
    }, 3000);
}

function showScheduleDetails(item) {
    const title = item.querySelector('.schedule-title').textContent;
    const type = item.querySelector('.schedule-type').textContent;
    
    showActionFeedback(`Opening ${type} with ${title}`);
}

function showActivityDetails(item) {
    const title = item.querySelector('.activity-title').textContent;
    showActionFeedback(`Opening: ${title}`);
}

function triggerSectionAnimations(section) {
    // Trigger section-specific animations when switching
    switch(section) {
        case 'dashboard':
            setTimeout(() => {
                animateStatCounters();
                animateChartBars();
            }, 100);
            break;
        case 'chat':
            // Animate chat messages
            const messages = document.querySelectorAll('#chat-section .message');
            messages.forEach((msg, index) => {
                setTimeout(() => {
                    msg.style.opacity = '1';
                    msg.style.transform = 'translateY(0)';
                }, index * 100);
                msg.style.opacity = '0';
                msg.style.transform = 'translateY(20px)';
                msg.style.transition = 'all 0.3s ease';
            });
            break;
        case 'taxscan':
            // Animate scan results
            const summaryCards = document.querySelectorAll('.summary-card');
            summaryCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'all 0.3s ease';
            });
            break;
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for global search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const search = document.getElementById('globalSearch');
        if (search) {
            search.focus();
        }
    }
    
    // Escape to clear search
    if (e.key === 'Escape') {
        const search = document.getElementById('globalSearch');
        if (search && search === document.activeElement) {
            search.blur();
            search.value = '';
        }
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes chartBarGrow {
        from {
            transform: scaleY(0);
            transform-origin: bottom;
        }
        to {
            transform: scaleY(1);
            transform-origin: bottom;
        }
    }
    
    .notification-dropdown, .user-dropdown {
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    }
    
    .notification-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .notification-header h4 {
        margin: 0;
        color: #ffffff;
        font-size: 16px;
    }
    
    .mark-all-read {
        background: none;
        border: none;
        color: #00d9ff;
        font-size: 12px;
        cursor: pointer;
    }
    
    .notification-item {
        display: flex;
        gap: 12px;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 8px;
        transition: background 0.2s ease;
    }
    
    .notification-item:hover {
        background: rgba(255, 255, 255, 0.05);
    }
    
    .notification-item.unread {
        background: rgba(0, 217, 255, 0.05);
        border-left: 2px solid #00d9ff;
    }
    
    .notification-item i {
        color: #00d9ff;
        width: 16px;
        flex-shrink: 0;
        margin-top: 2px;
    }
    
    .notification-title {
        color: #ffffff;
        font-size: 14px;
        margin-bottom: 4px;
    }
    
    .notification-time {
        color: #6b7280;
        font-size: 12px;
    }
    
    .user-info {
        display: flex;
        gap: 12px;
        align-items: center;
        padding: 12px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        margin-bottom: 16px;
    }
    
    .user-info img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
    
    .user-name {
        color: #ffffff;
        font-weight: 600;
        margin-bottom: 2px;
    }
    
    .user-role {
        color: #6b7280;
        font-size: 12px;
    }
    
    .menu-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        color: #d1d5db;
        text-decoration: none;
        border-radius: 6px;
        transition: background 0.2s ease;
        margin-bottom: 4px;
    }
    
    .menu-item:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #ffffff;
        text-decoration: none;
    }
    
    .menu-item i {
        width: 16px;
        text-align: center;
    }
    
    .menu-divider {
        height: 1px;
        background: rgba(255, 255, 255, 0.1);
        margin: 12px 0;
    }
    
    .upload-zone.dragover {
        border-color: rgba(0, 217, 255, 0.8);
        background: rgba(0, 217, 255, 0.1);
        transform: scale(1.02);
    }
`;
document.head.appendChild(style); 
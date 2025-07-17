/**
 * AI Sales Agent Widget - Frontend JavaScript
 */

(function($) {
    'use strict';
    
    class AISalesAgentWidget {
        constructor() {
            this.isOpen = false;
            this.isMinimized = false;
            this.conversationHistory = [];
            this.currentAudio = null;
            this.isPlaying = false;
            
            this.init();
        }
        
        init() {
            this.bindEvents();
            this.setupWidget();
            
            // Auto-start if enabled
            if (aiSalesAgent.settings.auto_start) {
                setTimeout(() => {
                    this.openChat();
                }, 2000);
            }
        }
        
        bindEvents() {
            // Toggle button
            $(document).on('click', '.ai-sales-agent-toggle', () => {
                this.toggleWidget();
            });
            
            // Close button
            $(document).on('click', '.ai-sales-agent-close', () => {
                this.closeChat();
            });
            
            // Send message
            $(document).on('click', '.ai-sales-agent-send', () => {
                this.sendMessage();
            });
            
            // Enter key in input
            $(document).on('keypress', '.ai-sales-agent-text-input', (e) => {
                if (e.which === 13) {
                    this.sendMessage();
                }
            });
            
            // Lead form submission
            $(document).on('submit', '.ai-sales-agent-lead-form-content', (e) => {
                e.preventDefault();
                this.submitLead();
            });
            
            // Cancel lead form
            $(document).on('click', '.ai-sales-agent-cancel', () => {
                this.hideLeadForm();
            });
            
            // Play audio button
            $(document).on('click', '.ai-sales-agent-play-audio', (e) => {
                e.preventDefault();
                this.playAudio($(e.currentTarget).data('audio-url'));
            });
        }
        
        setupWidget() {
            // Add typing indicator
            this.addTypingIndicator();
            
            // Add welcome message
            if (aiSalesAgent.settings.welcome_message) {
                this.addMessage('assistant', aiSalesAgent.settings.welcome_message);
            }
        }
        
        toggleWidget() {
            if (this.isOpen) {
                this.closeChat();
            } else {
                this.openChat();
            }
        }
        
        openChat() {
            $('.ai-sales-agent-widget').addClass('open');
            this.isOpen = true;
            
            // Focus on input
            setTimeout(() => {
                $('.ai-sales-agent-text-input').focus();
            }, 300);
        }
        
        closeChat() {
            $('.ai-sales-agent-widget').removeClass('open');
            this.isOpen = false;
            
            // Stop any playing audio
            this.stopAudio();
        }
        
        sendMessage() {
            const input = $('.ai-sales-agent-text-input');
            const message = input.val().trim();
            
            if (!message) {
                return;
            }
            
            // Clear input
            input.val('');
            
            // Add user message
            this.addMessage('user', message);
            
            // Show typing indicator
            this.showTypingIndicator();
            
            // Send to server
            this.processMessage(message);
        }
        
        processMessage(message) {
            $.ajax({
                url: aiSalesAgent.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'ai_sales_agent_chat',
                    nonce: aiSalesAgent.nonce,
                    message: message,
                    history: this.conversationHistory
                },
                success: (response) => {
                    this.hideTypingIndicator();
                    
                    try {
                        const data = typeof response === 'string' ? JSON.parse(response) : response;
                        
                        if (data.error) {
                            this.addMessage('assistant', data.error);
                            return;
                        }
                        
                        // Add assistant response
                        this.addMessage('assistant', data.text, data.speech_url);
                        
                        // Update conversation history
                        this.conversationHistory.push({
                            user: message,
                            assistant: data.text
                        });
                        
                        // Show lead form if suggested
                        if (data.suggest_lead_form) {
                            setTimeout(() => {
                                this.showLeadForm();
                            }, 1000);
                        }
                        
                    } catch (e) {
                        this.addMessage('assistant', aiSalesAgent.strings.error);
                    }
                },
                error: () => {
                    this.hideTypingIndicator();
                    this.addMessage('assistant', aiSalesAgent.strings.error);
                }
            });
        }
        
        addMessage(type, text, audioUrl = null) {
            const messagesContainer = $('.ai-sales-agent-messages');
            const messageClass = type === 'user' ? 'user-message' : 'assistant-message';
            
            let audioButton = '';
            if (audioUrl && type === 'assistant') {
                audioButton = `
                    <button type="button" class="ai-sales-agent-play-audio" data-audio-url="${audioUrl}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 5v14l11-7z" fill="currentColor"/>
                        </svg>
                    </button>
                `;
            }
            
            const messageHtml = `
                <div class="ai-sales-agent-message ${messageClass}">
                    <div class="ai-sales-agent-message-content">
                        <div class="ai-sales-agent-message-text">${this.escapeHtml(text)}</div>
                        ${audioButton}
                    </div>
                    <div class="ai-sales-agent-message-time">${this.getCurrentTime()}</div>
                </div>
            `;
            
            messagesContainer.append(messageHtml);
            this.scrollToBottom();
        }
        
        addTypingIndicator() {
            const messagesContainer = $('.ai-sales-agent-messages');
            const typingHtml = `
                <div class="ai-sales-agent-typing" style="display: none;">
                    <div class="ai-sales-agent-typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div class="ai-sales-agent-typing-text">${aiSalesAgent.strings.typing}</div>
                </div>
            `;
            
            messagesContainer.append(typingHtml);
        }
        
        showTypingIndicator() {
            $('.ai-sales-agent-typing').show();
            this.scrollToBottom();
        }
        
        hideTypingIndicator() {
            $('.ai-sales-agent-typing').hide();
        }
        
        scrollToBottom() {
            const messagesContainer = $('.ai-sales-agent-messages');
            messagesContainer.scrollTop(messagesContainer[0].scrollHeight);
        }
        
        playAudio(audioUrl) {
            // Stop any currently playing audio
            this.stopAudio();
            
            this.currentAudio = new Audio(audioUrl);
            this.isPlaying = true;
            
            // Update button state
            const button = $(`.ai-sales-agent-play-audio[data-audio-url="${audioUrl}"]`);
            button.addClass('playing');
            
            this.currentAudio.addEventListener('ended', () => {
                this.isPlaying = false;
                button.removeClass('playing');
            });
            
            this.currentAudio.addEventListener('error', () => {
                this.isPlaying = false;
                button.removeClass('playing');
                console.error('Audio playback error');
            });
            
            this.currentAudio.play().catch((error) => {
                console.error('Audio playback failed:', error);
                this.isPlaying = false;
                button.removeClass('playing');
            });
        }
        
        stopAudio() {
            if (this.currentAudio) {
                this.currentAudio.pause();
                this.currentAudio = null;
                this.isPlaying = false;
                $('.ai-sales-agent-play-audio').removeClass('playing');
            }
        }
        
        showLeadForm() {
            $('.ai-sales-agent-chat').hide();
            $('.ai-sales-agent-lead-form').show();
        }
        
        hideLeadForm() {
            $('.ai-sales-agent-lead-form').hide();
            $('.ai-sales-agent-chat').show();
        }
        
        submitLead() {
            const form = $('.ai-sales-agent-lead-form-content');
            const formData = new FormData(form[0]);
            
            // Add current page URL
            formData.append('page_url', window.location.href);
            
            // Disable submit button
            const submitBtn = form.find('.ai-sales-agent-submit');
            const originalText = submitBtn.text();
            submitBtn.prop('disabled', true).text(aiSalesAgent.strings.submit + '...');
            
            $.ajax({
                url: aiSalesAgent.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'ai_sales_agent_submit_lead',
                    nonce: aiSalesAgent.nonce,
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    company: formData.get('company'),
                    message: formData.get('message'),
                    page_url: window.location.href
                },
                success: (response) => {
                    try {
                        const data = typeof response === 'string' ? JSON.parse(response) : response;
                        
                        if (data.success) {
                            // Show success message
                            this.hideLeadForm();
                            this.addMessage('assistant', data.message);
                            
                            // Reset form
                            form[0].reset();
                        } else {
                            alert(data.error || aiSalesAgent.strings.error);
                        }
                    } catch (e) {
                        alert(aiSalesAgent.strings.error);
                    }
                },
                error: () => {
                    alert(aiSalesAgent.strings.error);
                },
                complete: () => {
                    // Re-enable submit button
                    submitBtn.prop('disabled', false).text(originalText);
                }
            });
        }
        
        getCurrentTime() {
            const now = new Date();
            return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    }
    
    // Initialize widget when DOM is ready
    $(document).ready(() => {
        if (typeof aiSalesAgent !== 'undefined') {
            new AISalesAgentWidget();
        }
    });
    
})(jQuery); 
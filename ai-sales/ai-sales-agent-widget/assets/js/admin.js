/**
 * AI Sales Agent Widget - Admin JavaScript
 */

(function($) {
    'use strict';
    
    class AISalesAgentAdmin {
        constructor() {
            this.init();
        }
        
        init() {
            this.bindEvents();
        }
        
        bindEvents() {
            // Test API connection
            $(document).on('click', '#test-api', (e) => {
                e.preventDefault();
                this.testApiConnection();
            });
            
            // Load available voices
            $(document).on('click', '#load-voices', (e) => {
                e.preventDefault();
                this.loadAvailableVoices();
            });
            
            // Lead status change
            $(document).on('change', '.lead-status', (e) => {
                this.updateLeadStatus($(e.currentTarget));
            });
            
            // View lead details
            $(document).on('click', '.view-lead', (e) => {
                e.preventDefault();
                this.viewLeadDetails($(e.currentTarget).data('lead-id'));
            });
            
            // Modal close
            $(document).on('click', '.ai-sales-agent-modal-close', () => {
                this.closeModal();
            });
            
            // Close modal when clicking outside
            $(document).on('click', '.ai-sales-agent-modal', (e) => {
                if (e.target === e.currentTarget) {
                    this.closeModal();
                }
            });
            
            // Export leads
            $(document).on('click', '.export-leads', (e) => {
                e.preventDefault();
                this.exportLeads();
            });
        }
        
        testApiConnection() {
            const button = $('#test-api');
            const statusDiv = $('#api-status');
            const originalText = button.text();
            
            // Update button state
            button.prop('disabled', true).text(aiSalesAgentAdmin.strings.testing);
            
            $.ajax({
                url: aiSalesAgentAdmin.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'ai_sales_agent_test_api',
                    nonce: aiSalesAgentAdmin.nonce
                },
                success: (response) => {
                    try {
                        const data = typeof response === 'string' ? JSON.parse(response) : response;
                        
                        if (data.success) {
                            statusDiv.html(`
                                <div class="notice notice-success">
                                    <p><strong>${aiSalesAgentAdmin.strings.success}</strong> ${data.message}</p>
                                </div>
                            `);
                        } else {
                            statusDiv.html(`
                                <div class="notice notice-error">
                                    <p><strong>${aiSalesAgentAdmin.strings.error}</strong> ${data.error}</p>
                                </div>
                            `);
                        }
                    } catch (e) {
                        statusDiv.html(`
                            <div class="notice notice-error">
                                <p><strong>${aiSalesAgentAdmin.strings.error}</strong> Invalid response from server.</p>
                            </div>
                        `);
                    }
                },
                error: () => {
                    statusDiv.html(`
                        <div class="notice notice-error">
                            <p><strong>${aiSalesAgentAdmin.strings.error}</strong> Failed to connect to server.</p>
                        </div>
                    `);
                },
                complete: () => {
                    button.prop('disabled', false).text(originalText);
                }
            });
        }
        
        loadAvailableVoices() {
            const button = $('#load-voices');
            const voicesList = $('#voices-list');
            const originalText = button.text();
            
            // Update button state
            button.prop('disabled', true).text(aiSalesAgentAdmin.strings.loading);
            voicesList.html('<p>Loading voices...</p>');
            
            $.ajax({
                url: aiSalesAgentAdmin.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'ai_sales_agent_get_voices',
                    nonce: aiSalesAgentAdmin.nonce
                },
                success: (response) => {
                    try {
                        const data = typeof response === 'string' ? JSON.parse(response) : response;
                        
                        if (data.error) {
                            voicesList.html(`
                                <div class="notice notice-error">
                                    <p><strong>${aiSalesAgentAdmin.strings.error}</strong> ${data.error}</p>
                                </div>
                            `);
                            return;
                        }
                        
                        if (data.voices && data.voices.length > 0) {
                            let voicesHtml = '<div class="voices-list">';
                            voicesHtml += '<h4>Available Voices:</h4>';
                            voicesHtml += '<div class="voices-grid">';
                            
                            data.voices.forEach(voice => {
                                voicesHtml += `
                                    <div class="voice-item" data-voice-id="${voice.voice_id}">
                                        <div class="voice-info">
                                            <strong>${voice.name}</strong>
                                            <small>${voice.voice_id}</small>
                                        </div>
                                        <button type="button" class="button select-voice" data-voice-id="${voice.voice_id}">
                                            Select
                                        </button>
                                    </div>
                                `;
                            });
                            
                            voicesHtml += '</div></div>';
                            voicesList.html(voicesHtml);
                            
                            // Bind voice selection
                            $(document).on('click', '.select-voice', (e) => {
                                const voiceId = $(e.currentTarget).data('voice-id');
                                $('input[name="ai_sales_agent_settings[voice_id]"]').val(voiceId);
                            });
                        } else {
                            voicesList.html('<p>No voices found. Please check your API key.</p>');
                        }
                    } catch (e) {
                        voicesList.html(`
                            <div class="notice notice-error">
                                <p><strong>${aiSalesAgentAdmin.strings.error}</strong> Invalid response from server.</p>
                            </div>
                        `);
                    }
                },
                error: () => {
                    voicesList.html(`
                        <div class="notice notice-error">
                            <p><strong>${aiSalesAgentAdmin.strings.error}</strong> Failed to load voices.</p>
                        </div>
                    `);
                },
                complete: () => {
                    button.prop('disabled', false).text(originalText);
                }
            });
        }
        
        updateLeadStatus(selectElement) {
            const leadId = selectElement.data('lead-id');
            const newStatus = selectElement.val();
            
            $.ajax({
                url: aiSalesAgentAdmin.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'ai_sales_agent_update_lead_status',
                    nonce: aiSalesAgentAdmin.nonce,
                    lead_id: leadId,
                    status: newStatus
                },
                success: (response) => {
                    try {
                        const data = typeof response === 'string' ? JSON.parse(response) : response;
                        
                        if (data.success) {
                            // Show success message
                            this.showNotice('Lead status updated successfully.', 'success');
                        } else {
                            this.showNotice('Failed to update lead status.', 'error');
                            // Revert the select
                            selectElement.val(selectElement.data('original-status'));
                        }
                    } catch (e) {
                        this.showNotice('Invalid response from server.', 'error');
                        selectElement.val(selectElement.data('original-status'));
                    }
                },
                error: () => {
                    this.showNotice('Failed to update lead status.', 'error');
                    selectElement.val(selectElement.data('original-status'));
                }
            });
        }
        
        viewLeadDetails(leadId) {
            const modal = $('#lead-modal');
            const detailsDiv = $('#lead-details');
            
            detailsDiv.html('<p>Loading lead details...</p>');
            modal.show();
            
            $.ajax({
                url: aiSalesAgentAdmin.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'ai_sales_agent_get_lead_details',
                    nonce: aiSalesAgentAdmin.nonce,
                    lead_id: leadId
                },
                success: (response) => {
                    try {
                        const data = typeof response === 'string' ? JSON.parse(response) : response;
                        
                        if (data.success && data.lead) {
                            const lead = data.lead;
                            const detailsHtml = `
                                <h3>Lead Details</h3>
                                <div class="lead-details-grid">
                                    <div class="detail-item">
                                        <label>Name:</label>
                                        <span>${this.escapeHtml(lead.name)}</span>
                                    </div>
                                    <div class="detail-item">
                                        <label>Email:</label>
                                        <span>${this.escapeHtml(lead.email)}</span>
                                    </div>
                                    <div class="detail-item">
                                        <label>Phone:</label>
                                        <span>${this.escapeHtml(lead.phone || 'N/A')}</span>
                                    </div>
                                    <div class="detail-item">
                                        <label>Company:</label>
                                        <span>${this.escapeHtml(lead.company || 'N/A')}</span>
                                    </div>
                                    <div class="detail-item">
                                        <label>Status:</label>
                                        <span class="status-${lead.status}">${this.capitalizeFirst(lead.status)}</span>
                                    </div>
                                    <div class="detail-item">
                                        <label>Date:</label>
                                        <span>${new Date(lead.created_at).toLocaleString()}</span>
                                    </div>
                                    <div class="detail-item full-width">
                                        <label>Message:</label>
                                        <div class="message-content">${this.escapeHtml(lead.message || 'No message provided')}</div>
                                    </div>
                                    <div class="detail-item">
                                        <label>Page URL:</label>
                                        <span><a href="${this.escapeHtml(lead.page_url)}" target="_blank">View Page</a></span>
                                    </div>
                                    <div class="detail-item">
                                        <label>IP Address:</label>
                                        <span>${this.escapeHtml(lead.ip_address)}</span>
                                    </div>
                                </div>
                                <div class="lead-actions">
                                    <button type="button" class="button delete-lead" data-lead-id="${lead.id}">Delete Lead</button>
                                </div>
                            `;
                            detailsDiv.html(detailsHtml);
                            
                            // Bind delete action
                            $(document).on('click', '.delete-lead', (e) => {
                                if (confirm('Are you sure you want to delete this lead?')) {
                                    this.deleteLead($(e.currentTarget).data('lead-id'));
                                }
                            });
                        } else {
                            detailsDiv.html('<p>Failed to load lead details.</p>');
                        }
                    } catch (e) {
                        detailsDiv.html('<p>Invalid response from server.</p>');
                    }
                },
                error: () => {
                    detailsDiv.html('<p>Failed to load lead details.</p>');
                }
            });
        }
        
        deleteLead(leadId) {
            $.ajax({
                url: aiSalesAgentAdmin.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'ai_sales_agent_delete_lead',
                    nonce: aiSalesAgentAdmin.nonce,
                    lead_id: leadId
                },
                success: (response) => {
                    try {
                        const data = typeof response === 'string' ? JSON.parse(response) : response;
                        
                        if (data.success) {
                            this.closeModal();
                            this.showNotice('Lead deleted successfully.', 'success');
                            // Reload the page to refresh the leads list
                            setTimeout(() => {
                                location.reload();
                            }, 1000);
                        } else {
                            this.showNotice('Failed to delete lead.', 'error');
                        }
                    } catch (e) {
                        this.showNotice('Invalid response from server.', 'error');
                    }
                },
                error: () => {
                    this.showNotice('Failed to delete lead.', 'error');
                }
            });
        }
        
        closeModal() {
            $('#lead-modal').hide();
        }
        
        exportLeads() {
            // This will trigger a download, so we just show a loading message
            this.showNotice('Preparing export...', 'info');
        }
        
        showNotice(message, type = 'info') {
            const noticeClass = `notice-${type}`;
            const notice = $(`
                <div class="notice ${noticeClass} is-dismissible">
                    <p>${message}</p>
                    <button type="button" class="notice-dismiss">
                        <span class="screen-reader-text">Dismiss this notice.</span>
                    </button>
                </div>
            `);
            
            // Insert at the top of the page
            $('.wrap h1').after(notice);
            
            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                notice.fadeOut(() => notice.remove());
            }, 5000);
            
            // Manual dismiss
            notice.on('click', '.notice-dismiss', () => {
                notice.fadeOut(() => notice.remove());
            });
        }
        
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
        capitalizeFirst(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
    }
    
    // Initialize admin when DOM is ready
    $(document).ready(() => {
        if (typeof aiSalesAgentAdmin !== 'undefined') {
            new AISalesAgentAdmin();
        }
    });
    
})(jQuery); 
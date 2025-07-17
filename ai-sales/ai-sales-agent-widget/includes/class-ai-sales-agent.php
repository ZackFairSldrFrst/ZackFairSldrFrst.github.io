<?php
/**
 * Main AI Sales Agent Class
 */

if (!defined('ABSPATH')) {
    exit;
}

class AI_Sales_Agent {
    
    public function __construct() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('wp_footer', array($this, 'render_widget'));
        add_action('wp_ajax_ai_sales_agent_chat', array($this, 'handle_chat_request'));
        add_action('wp_ajax_nopriv_ai_sales_agent_chat', array($this, 'handle_chat_request'));
        add_action('wp_ajax_ai_sales_agent_submit_lead', array($this, 'handle_lead_submission'));
        add_action('wp_ajax_nopriv_ai_sales_agent_submit_lead', array($this, 'handle_lead_submission'));
    }
    
    /**
     * Enqueue scripts and styles
     */
    public function enqueue_scripts() {
        $settings = get_option('ai_sales_agent_settings');
        
        wp_enqueue_script(
            'ai-sales-agent-widget',
            AI_SALES_AGENT_PLUGIN_URL . 'assets/js/widget.js',
            array('jquery'),
            AI_SALES_AGENT_VERSION,
            true
        );
        
        wp_enqueue_style(
            'ai-sales-agent-widget',
            AI_SALES_AGENT_PLUGIN_URL . 'assets/css/widget.css',
            array(),
            AI_SALES_AGENT_VERSION
        );
        
        // Localize script with settings and AJAX URL
        wp_localize_script('ai-sales-agent-widget', 'aiSalesAgent', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('ai_sales_agent_nonce'),
            'settings' => $settings,
            'strings' => array(
                'typing' => __('Typing...', 'ai-sales-agent-widget'),
                'error' => __('Sorry, something went wrong. Please try again.', 'ai-sales-agent-widget'),
                'submit' => __('Submit', 'ai-sales-agent-widget'),
                'cancel' => __('Cancel', 'ai-sales-agent-widget'),
            )
        ));
    }
    
    /**
     * Render the widget HTML
     */
    public function render_widget() {
        $settings = get_option('ai_sales_agent_settings');
        $position = isset($settings['widget_position']) ? $settings['widget_position'] : 'bottom-right';
        $color = isset($settings['widget_color']) ? $settings['widget_color'] : '#007cba';
        $auto_start = isset($settings['auto_start']) ? $settings['auto_start'] : false;
        
        ?>
        <div id="ai-sales-agent-widget" class="ai-sales-agent-widget ai-sales-agent-<?php echo esc_attr($position); ?>" 
             data-auto-start="<?php echo esc_attr($auto_start ? 'true' : 'false'); ?>"
             style="--widget-color: <?php echo esc_attr($color); ?>;">
            
            <!-- Widget Toggle Button -->
            <div class="ai-sales-agent-toggle">
                <div class="ai-sales-agent-toggle-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9ZM19 9H14V4H5V21H19V9Z" fill="currentColor"/>
                    </svg>
                </div>
                <span class="ai-sales-agent-toggle-text"><?php echo esc_html($settings['widget_title']); ?></span>
            </div>
            
            <!-- Chat Interface -->
            <div class="ai-sales-agent-chat">
                <div class="ai-sales-agent-header">
                    <div class="ai-sales-agent-avatar">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9ZM19 9H14V4H5V21H19V9Z" fill="currentColor"/>
                        </svg>
                    </div>
                    <div class="ai-sales-agent-info">
                        <h3><?php echo esc_html($settings['widget_title']); ?></h3>
                        <p><?php echo esc_html($settings['welcome_message']); ?></p>
                    </div>
                    <button class="ai-sales-agent-close" type="button">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>
                
                <div class="ai-sales-agent-messages">
                    <!-- Messages will be dynamically added here -->
                </div>
                
                <div class="ai-sales-agent-input">
                    <div class="ai-sales-agent-input-wrapper">
                        <input type="text" class="ai-sales-agent-text-input" placeholder="<?php esc_attr_e('Type your message...', 'ai-sales-agent-widget'); ?>">
                        <button type="button" class="ai-sales-agent-send">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Lead Capture Form -->
            <div class="ai-sales-agent-lead-form" style="display: none;">
                <div class="ai-sales-agent-lead-header">
                    <h3><?php esc_html_e('Get More Information', 'ai-sales-agent-widget'); ?></h3>
                    <p><?php esc_html_e('Please provide your details so we can follow up with you.', 'ai-sales-agent-widget'); ?></p>
                </div>
                
                <form class="ai-sales-agent-lead-form-content">
                    <div class="ai-sales-agent-form-group">
                        <label for="lead-name"><?php esc_html_e('Full Name *', 'ai-sales-agent-widget'); ?></label>
                        <input type="text" id="lead-name" name="name" required>
                    </div>
                    
                    <div class="ai-sales-agent-form-group">
                        <label for="lead-email"><?php esc_html_e('Email Address *', 'ai-sales-agent-widget'); ?></label>
                        <input type="email" id="lead-email" name="email" required>
                    </div>
                    
                    <div class="ai-sales-agent-form-group">
                        <label for="lead-phone"><?php esc_html_e('Phone Number', 'ai-sales-agent-widget'); ?></label>
                        <input type="tel" id="lead-phone" name="phone">
                    </div>
                    
                    <div class="ai-sales-agent-form-group">
                        <label for="lead-company"><?php esc_html_e('Company', 'ai-sales-agent-widget'); ?></label>
                        <input type="text" id="lead-company" name="company">
                    </div>
                    
                    <div class="ai-sales-agent-form-group">
                        <label for="lead-message"><?php esc_html_e('Additional Information', 'ai-sales-agent-widget'); ?></label>
                        <textarea id="lead-message" name="message" rows="3"></textarea>
                    </div>
                    
                    <div class="ai-sales-agent-form-actions">
                        <button type="button" class="ai-sales-agent-cancel"><?php esc_html_e('Cancel', 'ai-sales-agent-widget'); ?></button>
                        <button type="submit" class="ai-sales-agent-submit"><?php esc_html_e('Submit', 'ai-sales-agent-widget'); ?></button>
                    </div>
                </form>
            </div>
        </div>
        <?php
    }
    
    /**
     * Handle chat requests
     */
    public function handle_chat_request() {
        check_ajax_referer('ai_sales_agent_nonce', 'nonce');
        
        $message = sanitize_textarea_field($_POST['message']);
        $conversation_history = isset($_POST['history']) ? $_POST['history'] : array();
        
        if (empty($message)) {
            wp_die(json_encode(array('error' => 'Message is required')));
        }
        
        $api = new AI_Sales_Agent_API();
        $response = $api->process_message($message, $conversation_history);
        
        wp_die(json_encode($response));
    }
    
    /**
     * Handle lead submission
     */
    public function handle_lead_submission() {
        check_ajax_referer('ai_sales_agent_nonce', 'nonce');
        
        $lead_data = array(
            'name' => sanitize_text_field($_POST['name']),
            'email' => sanitize_email($_POST['email']),
            'phone' => sanitize_text_field($_POST['phone']),
            'company' => sanitize_text_field($_POST['company']),
            'message' => sanitize_textarea_field($_POST['message']),
            'ip_address' => $_SERVER['REMOTE_ADDR'],
            'user_agent' => $_SERVER['HTTP_USER_AGENT'],
            'page_url' => $_POST['page_url'],
            'created_at' => current_time('mysql')
        );
        
        $leads = new AI_Sales_Agent_Leads();
        $result = $leads->save_lead($lead_data);
        
        if ($result) {
            // Send notification email
            $this->send_lead_notification($lead_data);
            wp_die(json_encode(array('success' => true, 'message' => 'Thank you! We\'ll be in touch soon.')));
        } else {
            wp_die(json_encode(array('error' => 'Failed to save lead information')));
        }
    }
    
    /**
     * Send lead notification email
     */
    private function send_lead_notification($lead_data) {
        $settings = get_option('ai_sales_agent_settings');
        $to = $settings['lead_notification_email'];
        $subject = 'New Lead from AI Sales Agent - ' . $lead_data['name'];
        
        $message = "A new lead has been captured through the AI Sales Agent widget:\n\n";
        $message .= "Name: " . $lead_data['name'] . "\n";
        $message .= "Email: " . $lead_data['email'] . "\n";
        $message .= "Phone: " . $lead_data['phone'] . "\n";
        $message .= "Company: " . $lead_data['company'] . "\n";
        $message .= "Message: " . $lead_data['message'] . "\n";
        $message .= "Page URL: " . $lead_data['page_url'] . "\n";
        $message .= "Date: " . $lead_data['created_at'] . "\n";
        
        wp_mail($to, $subject, $message);
    }
} 
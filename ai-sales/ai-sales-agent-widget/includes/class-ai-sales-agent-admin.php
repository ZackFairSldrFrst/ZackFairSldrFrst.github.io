<?php
/**
 * AI Sales Agent Admin Class - Handles admin interface
 */

if (!defined('ABSPATH')) {
    exit;
}

class AI_Sales_Agent_Admin {
    
    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'init_settings'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        add_action('wp_ajax_ai_sales_agent_test_api', array($this, 'test_api_connection'));
        add_action('wp_ajax_ai_sales_agent_get_voices', array($this, 'get_available_voices'));
        add_action('wp_ajax_ai_sales_agent_export_leads', array($this, 'export_leads'));
        add_action('wp_ajax_ai_sales_agent_update_lead_status', array($this, 'update_lead_status_ajax'));
        add_action('wp_ajax_ai_sales_agent_get_lead_details', array($this, 'get_lead_details_ajax'));
        add_action('wp_ajax_ai_sales_agent_delete_lead', array($this, 'delete_lead_ajax'));
    }
    
    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_menu_page(
            __('AI Sales Agent', 'ai-sales-agent-widget'),
            __('AI Sales Agent', 'ai-sales-agent-widget'),
            'manage_options',
            'ai-sales-agent',
            array($this, 'admin_page'),
            'dashicons-admin-comments',
            30
        );
        
        add_submenu_page(
            'ai-sales-agent',
            __('Settings', 'ai-sales-agent-widget'),
            __('Settings', 'ai-sales-agent-widget'),
            'manage_options',
            'ai-sales-agent',
            array($this, 'admin_page')
        );
        
        add_submenu_page(
            'ai-sales-agent',
            __('Leads', 'ai-sales-agent-widget'),
            __('Leads', 'ai-sales-agent-widget'),
            'manage_options',
            'ai-sales-agent-leads',
            array($this, 'leads_page')
        );
    }
    
    /**
     * Initialize settings
     */
    public function init_settings() {
        register_setting('ai_sales_agent_settings', 'ai_sales_agent_settings', array($this, 'sanitize_settings'));
        
        add_settings_section(
            'ai_sales_agent_general',
            __('General Settings', 'ai-sales-agent-widget'),
            array($this, 'general_section_callback'),
            'ai_sales_agent_settings'
        );
        
        add_settings_field(
            'widget_title',
            __('Widget Title', 'ai-sales-agent-widget'),
            array($this, 'text_field_callback'),
            'ai_sales_agent_settings',
            'ai_sales_agent_general',
            array('field' => 'widget_title')
        );
        
        add_settings_field(
            'welcome_message',
            __('Welcome Message', 'ai-sales-agent-widget'),
            array($this, 'textarea_field_callback'),
            'ai_sales_agent_settings',
            'ai_sales_agent_general',
            array('field' => 'welcome_message')
        );
        
        add_settings_field(
            'business_info',
            __('Business Information', 'ai-sales-agent-widget'),
            array($this, 'textarea_field_callback'),
            'ai_sales_agent_settings',
            'ai_sales_agent_general',
            array('field' => 'business_info')
        );
        
        add_settings_section(
            'ai_sales_agent_elevenlabs',
            __('ElevenLabs API Settings', 'ai-sales-agent-widget'),
            array($this, 'elevenlabs_section_callback'),
            'ai_sales_agent_settings'
        );
        
        add_settings_field(
            'elevenlabs_api_key',
            __('API Key', 'ai-sales-agent-widget'),
            array($this, 'password_field_callback'),
            'ai_sales_agent_settings',
            'ai_sales_agent_elevenlabs',
            array('field' => 'elevenlabs_api_key')
        );
        
        add_settings_field(
            'voice_id',
            __('Voice ID', 'ai-sales-agent-widget'),
            array($this, 'voice_select_callback'),
            'ai_sales_agent_settings',
            'ai_sales_agent_elevenlabs',
            array('field' => 'voice_id')
        );
        
        add_settings_section(
            'ai_sales_agent_appearance',
            __('Appearance Settings', 'ai-sales-agent-widget'),
            array($this, 'appearance_section_callback'),
            'ai_sales_agent_settings'
        );
        
        add_settings_field(
            'widget_position',
            __('Widget Position', 'ai-sales-agent-widget'),
            array($this, 'select_field_callback'),
            'ai_sales_agent_settings',
            'ai_sales_agent_appearance',
            array(
                'field' => 'widget_position',
                'options' => array(
                    'bottom-right' => __('Bottom Right', 'ai-sales-agent-widget'),
                    'bottom-left' => __('Bottom Left', 'ai-sales-agent-widget'),
                    'top-right' => __('Top Right', 'ai-sales-agent-widget'),
                    'top-left' => __('Top Left', 'ai-sales-agent-widget')
                )
            )
        );
        
        add_settings_field(
            'widget_color',
            __('Widget Color', 'ai-sales-agent-widget'),
            array($this, 'color_field_callback'),
            'ai_sales_agent_settings',
            'ai_sales_agent_appearance',
            array('field' => 'widget_color')
        );
        
        add_settings_field(
            'auto_start',
            __('Auto Start Chat', 'ai-sales-agent-widget'),
            array($this, 'checkbox_field_callback'),
            'ai_sales_agent_settings',
            'ai_sales_agent_appearance',
            array('field' => 'auto_start')
        );
        
        add_settings_section(
            'ai_sales_agent_notifications',
            __('Notification Settings', 'ai-sales-agent-widget'),
            array($this, 'notifications_section_callback'),
            'ai_sales_agent_settings'
        );
        
        add_settings_field(
            'lead_notification_email',
            __('Lead Notification Email', 'ai-sales-agent-widget'),
            array($this, 'email_field_callback'),
            'ai_sales_agent_settings',
            'ai_sales_agent_notifications',
            array('field' => 'lead_notification_email')
        );
    }
    
    /**
     * Enqueue admin scripts
     */
    public function enqueue_admin_scripts($hook) {
        if (strpos($hook, 'ai-sales-agent') === false) {
            return;
        }
        
        wp_enqueue_script(
            'ai-sales-agent-admin',
            AI_SALES_AGENT_PLUGIN_URL . 'assets/js/admin.js',
            array('jquery'),
            AI_SALES_AGENT_VERSION,
            true
        );
        
        wp_localize_script('ai-sales-agent-admin', 'aiSalesAgentAdmin', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('ai_sales_agent_admin_nonce'),
            'strings' => array(
                'testing' => __('Testing...', 'ai-sales-agent-widget'),
                'success' => __('Success!', 'ai-sales-agent-widget'),
                'error' => __('Error!', 'ai-sales-agent-widget'),
                'loading' => __('Loading...', 'ai-sales-agent-widget')
            )
        ));
        
        wp_enqueue_style(
            'ai-sales-agent-admin',
            AI_SALES_AGENT_PLUGIN_URL . 'assets/css/admin.css',
            array(),
            AI_SALES_AGENT_VERSION
        );
    }
    
    /**
     * Main admin page
     */
    public function admin_page() {
        $settings = get_option('ai_sales_agent_settings');
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            
            <div class="ai-sales-agent-admin-container">
                <div class="ai-sales-agent-admin-main">
                    <form method="post" action="options.php">
                        <?php
                        settings_fields('ai_sales_agent_settings');
                        do_settings_sections('ai_sales_agent_settings');
                        submit_button();
                        ?>
                    </form>
                </div>
                
                <div class="ai-sales-agent-admin-sidebar">
                    <div class="ai-sales-agent-admin-box">
                        <h3><?php _e('Quick Stats', 'ai-sales-agent-widget'); ?></h3>
                        <?php
                        $leads = new AI_Sales_Agent_Leads();
                        $stats = $leads->get_statistics();
                        ?>
                        <ul>
                            <li><strong><?php _e('Total Leads:', 'ai-sales-agent-widget'); ?></strong> <?php echo esc_html($stats['total']); ?></li>
                            <li><strong><?php _e('New Leads (7 days):', 'ai-sales-agent-widget'); ?></strong> <?php echo esc_html($stats['recent']); ?></li>
                        </ul>
                        <p><a href="<?php echo admin_url('admin.php?page=ai-sales-agent-leads'); ?>" class="button"><?php _e('View All Leads', 'ai-sales-agent-widget'); ?></a></p>
                    </div>
                    
                    <div class="ai-sales-agent-admin-box">
                        <h3><?php _e('API Status', 'ai-sales-agent-widget'); ?></h3>
                        <div id="api-status">
                            <p><?php _e('Click "Test Connection" to check your ElevenLabs API status.', 'ai-sales-agent-widget'); ?></p>
                            <button type="button" id="test-api" class="button"><?php _e('Test Connection', 'ai-sales-agent-widget'); ?></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }
    
    /**
     * Leads management page
     */
    public function leads_page() {
        $leads = new AI_Sales_Agent_Leads();
        $page = isset($_GET['paged']) ? max(1, intval($_GET['paged'])) : 1;
        $status = isset($_GET['status']) ? sanitize_text_field($_GET['status']) : null;
        $search = isset($_GET['s']) ? sanitize_text_field($_GET['s']) : '';
        
        if (!empty($search)) {
            $leads_data = $leads->search_leads($search, $page);
        } else {
            $leads_data = $leads->get_leads($page, 20, $status);
        }
        
        $stats = $leads->get_statistics();
        ?>
        <div class="wrap">
            <h1><?php _e('AI Sales Agent Leads', 'ai-sales-agent-widget'); ?></h1>
            
            <div class="ai-sales-agent-leads-header">
                <div class="ai-sales-agent-leads-stats">
                    <span class="stat-item">
                        <strong><?php _e('Total:', 'ai-sales-agent-widget'); ?></strong> <?php echo esc_html($stats['total']); ?>
                    </span>
                    <span class="stat-item">
                        <strong><?php _e('New:', 'ai-sales-agent-widget'); ?></strong> <?php echo esc_html(isset($stats['by_status']['new']) ? $stats['by_status']['new'] : 0); ?>
                    </span>
                    <span class="stat-item">
                        <strong><?php _e('Contacted:', 'ai-sales-agent-widget'); ?></strong> <?php echo esc_html(isset($stats['by_status']['contacted']) ? $stats['by_status']['contacted'] : 0); ?>
                    </span>
                </div>
                
                <div class="ai-sales-agent-leads-actions">
                    <form method="get" class="search-form">
                        <input type="hidden" name="page" value="ai-sales-agent-leads">
                        <input type="search" name="s" value="<?php echo esc_attr($search); ?>" placeholder="<?php esc_attr_e('Search leads...', 'ai-sales-agent-widget'); ?>">
                        <input type="submit" class="button" value="<?php esc_attr_e('Search', 'ai-sales-agent-widget'); ?>">
                    </form>
                    
                    <a href="<?php echo admin_url('admin-ajax.php?action=ai_sales_agent_export_leads&nonce=' . wp_create_nonce('ai_sales_agent_export_nonce')); ?>" class="button"><?php _e('Export CSV', 'ai-sales-agent-widget'); ?></a>
                </div>
            </div>
            
            <div class="ai-sales-agent-leads-filters">
                <a href="<?php echo admin_url('admin.php?page=ai-sales-agent-leads'); ?>" class="<?php echo empty($status) ? 'current' : ''; ?>"><?php _e('All', 'ai-sales-agent-widget'); ?></a>
                <a href="<?php echo admin_url('admin.php?page=ai-sales-agent-leads&status=new'); ?>" class="<?php echo $status === 'new' ? 'current' : ''; ?>"><?php _e('New', 'ai-sales-agent-widget'); ?></a>
                <a href="<?php echo admin_url('admin.php?page=ai-sales-agent-leads&status=contacted'); ?>" class="<?php echo $status === 'contacted' ? 'current' : ''; ?>"><?php _e('Contacted', 'ai-sales-agent-widget'); ?></a>
                <a href="<?php echo admin_url('admin.php?page=ai-sales-agent-leads&status=qualified'); ?>" class="<?php echo $status === 'qualified' ? 'current' : ''; ?>"><?php _e('Qualified', 'ai-sales-agent-widget'); ?></a>
                <a href="<?php echo admin_url('admin.php?page=ai-sales-agent-leads&status=converted'); ?>" class="<?php echo $status === 'converted' ? 'current' : ''; ?>"><?php _e('Converted', 'ai-sales-agent-widget'); ?></a>
            </div>
            
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th><?php _e('Name', 'ai-sales-agent-widget'); ?></th>
                        <th><?php _e('Email', 'ai-sales-agent-widget'); ?></th>
                        <th><?php _e('Phone', 'ai-sales-agent-widget'); ?></th>
                        <th><?php _e('Company', 'ai-sales-agent-widget'); ?></th>
                        <th><?php _e('Status', 'ai-sales-agent-widget'); ?></th>
                        <th><?php _e('Date', 'ai-sales-agent-widget'); ?></th>
                        <th><?php _e('Actions', 'ai-sales-agent-widget'); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($leads_data['leads'])): ?>
                        <tr>
                            <td colspan="7"><?php _e('No leads found.', 'ai-sales-agent-widget'); ?></td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($leads_data['leads'] as $lead): ?>
                            <tr>
                                <td><?php echo esc_html($lead['name']); ?></td>
                                <td><?php echo esc_html($lead['email']); ?></td>
                                <td><?php echo esc_html($lead['phone']); ?></td>
                                <td><?php echo esc_html($lead['company']); ?></td>
                                <td>
                                    <select class="lead-status" data-lead-id="<?php echo esc_attr($lead['id']); ?>">
                                        <option value="new" <?php selected($lead['status'], 'new'); ?>><?php _e('New', 'ai-sales-agent-widget'); ?></option>
                                        <option value="contacted" <?php selected($lead['status'], 'contacted'); ?>><?php _e('Contacted', 'ai-sales-agent-widget'); ?></option>
                                        <option value="qualified" <?php selected($lead['status'], 'qualified'); ?>><?php _e('Qualified', 'ai-sales-agent-widget'); ?></option>
                                        <option value="converted" <?php selected($lead['status'], 'converted'); ?>><?php _e('Converted', 'ai-sales-agent-widget'); ?></option>
                                        <option value="lost" <?php selected($lead['status'], 'lost'); ?>><?php _e('Lost', 'ai-sales-agent-widget'); ?></option>
                                    </select>
                                </td>
                                <td><?php echo esc_html(date('M j, Y', strtotime($lead['created_at']))); ?></td>
                                <td>
                                    <button type="button" class="button view-lead" data-lead-id="<?php echo esc_attr($lead['id']); ?>"><?php _e('View', 'ai-sales-agent-widget'); ?></button>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
            
            <?php if ($leads_data['pages'] > 1): ?>
                <div class="tablenav">
                    <div class="tablenav-pages">
                        <?php
                        $page_links = paginate_links(array(
                            'base' => add_query_arg('paged', '%#%'),
                            'format' => '',
                            'prev_text' => __('&laquo;'),
                            'next_text' => __('&raquo;'),
                            'total' => $leads_data['pages'],
                            'current' => $page
                        ));
                        echo $page_links;
                        ?>
                    </div>
                </div>
            <?php endif; ?>
        </div>
        
        <!-- Lead Detail Modal -->
        <div id="lead-modal" class="ai-sales-agent-modal" style="display: none;">
            <div class="ai-sales-agent-modal-content">
                <span class="ai-sales-agent-modal-close">&times;</span>
                <div id="lead-details"></div>
            </div>
        </div>
        <?php
    }
    
    // Settings field callbacks
    public function text_field_callback($args) {
        $settings = get_option('ai_sales_agent_settings');
        $field = $args['field'];
        $value = isset($settings[$field]) ? $settings[$field] : '';
        ?>
        <input type="text" name="ai_sales_agent_settings[<?php echo esc_attr($field); ?>]" value="<?php echo esc_attr($value); ?>" class="regular-text">
        <?php
    }
    
    public function textarea_field_callback($args) {
        $settings = get_option('ai_sales_agent_settings');
        $field = $args['field'];
        $value = isset($settings[$field]) ? $settings[$field] : '';
        ?>
        <textarea name="ai_sales_agent_settings[<?php echo esc_attr($field); ?>]" rows="3" class="large-text"><?php echo esc_textarea($value); ?></textarea>
        <?php
    }
    
    public function password_field_callback($args) {
        $settings = get_option('ai_sales_agent_settings');
        $field = $args['field'];
        $value = isset($settings[$field]) ? $settings[$field] : '';
        ?>
        <input type="password" name="ai_sales_agent_settings[<?php echo esc_attr($field); ?>]" value="<?php echo esc_attr($value); ?>" class="regular-text">
        <?php
    }
    
    public function email_field_callback($args) {
        $settings = get_option('ai_sales_agent_settings');
        $field = $args['field'];
        $value = isset($settings[$field]) ? $settings[$field] : '';
        ?>
        <input type="email" name="ai_sales_agent_settings[<?php echo esc_attr($field); ?>]" value="<?php echo esc_attr($value); ?>" class="regular-text">
        <?php
    }
    
    public function select_field_callback($args) {
        $settings = get_option('ai_sales_agent_settings');
        $field = $args['field'];
        $options = $args['options'];
        $value = isset($settings[$field]) ? $settings[$field] : '';
        ?>
        <select name="ai_sales_agent_settings[<?php echo esc_attr($field); ?>]">
            <?php foreach ($options as $key => $label): ?>
                <option value="<?php echo esc_attr($key); ?>" <?php selected($value, $key); ?>><?php echo esc_html($label); ?></option>
            <?php endforeach; ?>
        </select>
        <?php
    }
    
    public function color_field_callback($args) {
        $settings = get_option('ai_sales_agent_settings');
        $field = $args['field'];
        $value = isset($settings[$field]) ? $settings[$field] : '#007cba';
        ?>
        <input type="color" name="ai_sales_agent_settings[<?php echo esc_attr($field); ?>]" value="<?php echo esc_attr($value); ?>">
        <?php
    }
    
    public function checkbox_field_callback($args) {
        $settings = get_option('ai_sales_agent_settings');
        $field = $args['field'];
        $value = isset($settings[$field]) ? $settings[$field] : false;
        ?>
        <input type="checkbox" name="ai_sales_agent_settings[<?php echo esc_attr($field); ?>]" value="1" <?php checked($value, true); ?>>
        <?php
    }
    
    public function voice_select_callback($args) {
        $settings = get_option('ai_sales_agent_settings');
        $field = $args['field'];
        $value = isset($settings[$field]) ? $settings[$field] : '';
        ?>
        <input type="text" name="ai_sales_agent_settings[<?php echo esc_attr($field); ?>]" value="<?php echo esc_attr($value); ?>" class="regular-text" placeholder="Voice ID">
        <button type="button" id="load-voices" class="button"><?php _e('Load Available Voices', 'ai-sales-agent-widget'); ?></button>
        <div id="voices-list"></div>
        <?php
    }
    
    // Section callbacks
    public function general_section_callback() {
        echo '<p>' . __('Configure the basic settings for your AI sales agent widget.', 'ai-sales-agent-widget') . '</p>';
    }
    
    public function elevenlabs_section_callback() {
        echo '<p>' . __('Configure your ElevenLabs API settings for voice generation.', 'ai-sales-agent-widget') . '</p>';
    }
    
    public function appearance_section_callback() {
        echo '<p>' . __('Customize the appearance and behavior of the widget.', 'ai-sales-agent-widget') . '</p>';
    }
    
    public function notifications_section_callback() {
        echo '<p>' . __('Configure email notifications for new leads.', 'ai-sales-agent-widget') . '</p>';
    }
    
    // AJAX handlers
    public function test_api_connection() {
        check_ajax_referer('ai_sales_agent_admin_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        
        $api = new AI_Sales_Agent_API();
        $result = $api->test_api_connection();
        
        wp_die(json_encode($result));
    }
    
    public function get_available_voices() {
        check_ajax_referer('ai_sales_agent_admin_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        
        $api = new AI_Sales_Agent_API();
        $voices = $api->get_available_voices();
        
        wp_die(json_encode($voices));
    }
    
    public function export_leads() {
        check_ajax_referer('ai_sales_agent_export_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        
        $leads = new AI_Sales_Agent_Leads();
        $status = isset($_GET['status']) ? sanitize_text_field($_GET['status']) : null;
        $leads->export_leads_csv($status);
    }
    
    /**
     * Sanitize settings
     */
    public function sanitize_settings($input) {
        $sanitized = array();
        
        $sanitized['widget_title'] = sanitize_text_field($input['widget_title']);
        $sanitized['welcome_message'] = sanitize_textarea_field($input['welcome_message']);
        $sanitized['business_info'] = sanitize_textarea_field($input['business_info']);
        $sanitized['elevenlabs_api_key'] = sanitize_text_field($input['elevenlabs_api_key']);
        $sanitized['voice_id'] = sanitize_text_field($input['voice_id']);
        $sanitized['widget_position'] = sanitize_text_field($input['widget_position']);
        $sanitized['widget_color'] = sanitize_hex_color($input['widget_color']);
        $sanitized['auto_start'] = isset($input['auto_start']) ? true : false;
        $sanitized['lead_notification_email'] = sanitize_email($input['lead_notification_email']);
        
        return $sanitized;
    }
    
    /**
     * AJAX handler for updating lead status
     */
    public function update_lead_status_ajax() {
        check_ajax_referer('ai_sales_agent_admin_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        
        $lead_id = intval($_POST['lead_id']);
        $status = sanitize_text_field($_POST['status']);
        
        $leads = new AI_Sales_Agent_Leads();
        $result = $leads->update_lead_status($lead_id, $status);
        
        if ($result) {
            wp_die(json_encode(array('success' => true)));
        } else {
            wp_die(json_encode(array('success' => false, 'error' => 'Failed to update lead status')));
        }
    }
    
    /**
     * AJAX handler for getting lead details
     */
    public function get_lead_details_ajax() {
        check_ajax_referer('ai_sales_agent_admin_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        
        $lead_id = intval($_POST['lead_id']);
        
        $leads = new AI_Sales_Agent_Leads();
        $lead = $leads->get_lead($lead_id);
        
        if ($lead) {
            wp_die(json_encode(array('success' => true, 'lead' => $lead)));
        } else {
            wp_die(json_encode(array('success' => false, 'error' => 'Lead not found')));
        }
    }
    
    /**
     * AJAX handler for deleting lead
     */
    public function delete_lead_ajax() {
        check_ajax_referer('ai_sales_agent_admin_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        
        $lead_id = intval($_POST['lead_id']);
        
        $leads = new AI_Sales_Agent_Leads();
        $result = $leads->delete_lead($lead_id);
        
        if ($result) {
            wp_die(json_encode(array('success' => true)));
        } else {
            wp_die(json_encode(array('success' => false, 'error' => 'Failed to delete lead')));
        }
    }
} 
<?php
/**
 * Plugin Name: AI Sales Agent Widget
 * Plugin URI: https://yourwebsite.com/ai-sales-agent-widget
 * Description: An AI-powered sales agent widget using ElevenLabs API that provides business information, answers questions, and captures leads.
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://yourwebsite.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: ai-sales-agent-widget
 * Domain Path: /languages
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('AI_SALES_AGENT_VERSION', '1.0.0');
define('AI_SALES_AGENT_PLUGIN_URL', plugin_dir_url(__FILE__));
define('AI_SALES_AGENT_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('AI_SALES_AGENT_PLUGIN_BASENAME', plugin_basename(__FILE__));

// Include required files
require_once AI_SALES_AGENT_PLUGIN_PATH . 'includes/class-ai-sales-agent.php';
require_once AI_SALES_AGENT_PLUGIN_PATH . 'includes/class-ai-sales-agent-admin.php';
require_once AI_SALES_AGENT_PLUGIN_PATH . 'includes/class-ai-sales-agent-api.php';
require_once AI_SALES_AGENT_PLUGIN_PATH . 'includes/class-ai-sales-agent-leads.php';

// Initialize the plugin
function ai_sales_agent_init() {
    new AI_Sales_Agent();
    
    // Initialize admin only in admin area
    if (is_admin()) {
        new AI_Sales_Agent_Admin();
    }
}
add_action('plugins_loaded', 'ai_sales_agent_init');

// Activation hook
register_activation_hook(__FILE__, 'ai_sales_agent_activate');
function ai_sales_agent_activate() {
    // Create database tables
    AI_Sales_Agent_Leads::create_tables();
    
    // Set default options
    $default_options = array(
        'widget_title' => 'AI Sales Assistant',
        'welcome_message' => 'Hello! I\'m your AI sales assistant. How can I help you today?',
        'business_info' => 'We provide innovative solutions to help your business grow.',
        'elevenlabs_api_key' => '',
        'voice_id' => 'pNInz6obpgDQGcFmaJgB', // Default voice ID
        'widget_position' => 'bottom-right',
        'widget_color' => '#007cba',
        'auto_start' => false,
        'lead_notification_email' => get_option('admin_email'),
    );
    
    add_option('ai_sales_agent_settings', $default_options);
}

// Deactivation hook
register_deactivation_hook(__FILE__, 'ai_sales_agent_deactivate');
function ai_sales_agent_deactivate() {
    // Clean up if needed
}

// Uninstall hook
register_uninstall_hook(__FILE__, 'ai_sales_agent_uninstall');
function ai_sales_agent_uninstall() {
    // Remove options and tables
    delete_option('ai_sales_agent_settings');
    AI_Sales_Agent_Leads::drop_tables();
} 
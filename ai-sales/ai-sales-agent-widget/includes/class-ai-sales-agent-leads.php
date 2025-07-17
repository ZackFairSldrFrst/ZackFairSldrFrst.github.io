<?php
/**
 * AI Sales Agent Leads Class - Handles lead storage and management
 */

if (!defined('ABSPATH')) {
    exit;
}

class AI_Sales_Agent_Leads {
    
    private $table_name;
    
    public function __construct() {
        global $wpdb;
        $this->table_name = $wpdb->prefix . 'ai_sales_agent_leads';
    }
    
    /**
     * Create database tables
     */
    public static function create_tables() {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'ai_sales_agent_leads';
        
        $charset_collate = $wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            name varchar(100) NOT NULL,
            email varchar(100) NOT NULL,
            phone varchar(20),
            company varchar(100),
            message text,
            ip_address varchar(45),
            user_agent text,
            page_url varchar(500),
            status varchar(20) DEFAULT 'new',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY email (email),
            KEY status (status),
            KEY created_at (created_at)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
    
    /**
     * Drop database tables
     */
    public static function drop_tables() {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'ai_sales_agent_leads';
        $wpdb->query("DROP TABLE IF EXISTS $table_name");
    }
    
    /**
     * Save a new lead
     */
    public function save_lead($lead_data) {
        global $wpdb;
        
        $defaults = array(
            'name' => '',
            'email' => '',
            'phone' => '',
            'company' => '',
            'message' => '',
            'ip_address' => '',
            'user_agent' => '',
            'page_url' => '',
            'status' => 'new'
        );
        
        $lead_data = wp_parse_args($lead_data, $defaults);
        
        // Validate required fields
        if (empty($lead_data['name']) || empty($lead_data['email'])) {
            return false;
        }
        
        // Validate email
        if (!is_email($lead_data['email'])) {
            return false;
        }
        
        $result = $wpdb->insert(
            $this->table_name,
            array(
                'name' => $lead_data['name'],
                'email' => $lead_data['email'],
                'phone' => $lead_data['phone'],
                'company' => $lead_data['company'],
                'message' => $lead_data['message'],
                'ip_address' => $lead_data['ip_address'],
                'user_agent' => $lead_data['user_agent'],
                'page_url' => $lead_data['page_url'],
                'status' => $lead_data['status']
            ),
            array('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')
        );
        
        if ($result === false) {
            return false;
        }
        
        return $wpdb->insert_id;
    }
    
    /**
     * Get leads with pagination
     */
    public function get_leads($page = 1, $per_page = 20, $status = null) {
        global $wpdb;
        
        $offset = ($page - 1) * $per_page;
        
        $where_clause = '';
        if ($status) {
            $where_clause = $wpdb->prepare("WHERE status = %s", $status);
        }
        
        $sql = "SELECT * FROM {$this->table_name} $where_clause ORDER BY created_at DESC LIMIT %d OFFSET %d";
        $sql = $wpdb->prepare($sql, $per_page, $offset);
        
        $leads = $wpdb->get_results($sql, ARRAY_A);
        
        // Get total count
        $count_sql = "SELECT COUNT(*) FROM {$this->table_name} $where_clause";
        if ($status) {
            $count_sql = $wpdb->prepare($count_sql, $status);
        }
        $total = $wpdb->get_var($count_sql);
        
        return array(
            'leads' => $leads,
            'total' => $total,
            'pages' => ceil($total / $per_page),
            'current_page' => $page
        );
    }
    
    /**
     * Get a single lead by ID
     */
    public function get_lead($id) {
        global $wpdb;
        
        $sql = $wpdb->prepare("SELECT * FROM {$this->table_name} WHERE id = %d", $id);
        return $wpdb->get_row($sql, ARRAY_A);
    }
    
    /**
     * Update lead status
     */
    public function update_lead_status($id, $status) {
        global $wpdb;
        
        $valid_statuses = array('new', 'contacted', 'qualified', 'converted', 'lost');
        
        if (!in_array($status, $valid_statuses)) {
            return false;
        }
        
        $result = $wpdb->update(
            $this->table_name,
            array('status' => $status),
            array('id' => $id),
            array('%s'),
            array('%d')
        );
        
        return $result !== false;
    }
    
    /**
     * Delete a lead
     */
    public function delete_lead($id) {
        global $wpdb;
        
        $result = $wpdb->delete(
            $this->table_name,
            array('id' => $id),
            array('%d')
        );
        
        return $result !== false;
    }
    
    /**
     * Get lead statistics
     */
    public function get_statistics() {
        global $wpdb;
        
        $stats = array();
        
        // Total leads
        $stats['total'] = $wpdb->get_var("SELECT COUNT(*) FROM {$this->table_name}");
        
        // Leads by status
        $status_counts = $wpdb->get_results("
            SELECT status, COUNT(*) as count 
            FROM {$this->table_name} 
            GROUP BY status
        ", ARRAY_A);
        
        $stats['by_status'] = array();
        foreach ($status_counts as $status_count) {
            $stats['by_status'][$status_count['status']] = $status_count['count'];
        }
        
        // Leads by month (last 12 months)
        $monthly_stats = $wpdb->get_results("
            SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count 
            FROM {$this->table_name} 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY month 
            ORDER BY month DESC
        ", ARRAY_A);
        
        $stats['monthly'] = $monthly_stats;
        
        // Recent leads (last 7 days)
        $stats['recent'] = $wpdb->get_var("
            SELECT COUNT(*) 
            FROM {$this->table_name} 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        ");
        
        return $stats;
    }
    
    /**
     * Export leads to CSV
     */
    public function export_leads_csv($status = null) {
        global $wpdb;
        
        $where_clause = '';
        if ($status) {
            $where_clause = $wpdb->prepare("WHERE status = %s", $status);
        }
        
        $sql = "SELECT * FROM {$this->table_name} $where_clause ORDER BY created_at DESC";
        $leads = $wpdb->get_results($sql, ARRAY_A);
        
        if (empty($leads)) {
            return false;
        }
        
        $filename = 'ai-sales-agent-leads-' . date('Y-m-d') . '.csv';
        
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        
        $output = fopen('php://output', 'w');
        
        // Add headers
        fputcsv($output, array('ID', 'Name', 'Email', 'Phone', 'Company', 'Message', 'Status', 'Page URL', 'IP Address', 'Created At'));
        
        // Add data
        foreach ($leads as $lead) {
            fputcsv($output, array(
                $lead['id'],
                $lead['name'],
                $lead['email'],
                $lead['phone'],
                $lead['company'],
                $lead['message'],
                $lead['status'],
                $lead['page_url'],
                $lead['ip_address'],
                $lead['created_at']
            ));
        }
        
        fclose($output);
        exit;
    }
    
    /**
     * Search leads
     */
    public function search_leads($search_term, $page = 1, $per_page = 20) {
        global $wpdb;
        
        $offset = ($page - 1) * $per_page;
        
        $search_term = '%' . $wpdb->esc_like($search_term) . '%';
        
        $sql = $wpdb->prepare("
            SELECT * FROM {$this->table_name} 
            WHERE name LIKE %s OR email LIKE %s OR company LIKE %s OR message LIKE %s
            ORDER BY created_at DESC 
            LIMIT %d OFFSET %d
        ", $search_term, $search_term, $search_term, $search_term, $per_page, $offset);
        
        $leads = $wpdb->get_results($sql, ARRAY_A);
        
        // Get total count
        $count_sql = $wpdb->prepare("
            SELECT COUNT(*) FROM {$this->table_name} 
            WHERE name LIKE %s OR email LIKE %s OR company LIKE %s OR message LIKE %s
        ", $search_term, $search_term, $search_term, $search_term);
        
        $total = $wpdb->get_var($count_sql);
        
        return array(
            'leads' => $leads,
            'total' => $total,
            'pages' => ceil($total / $per_page),
            'current_page' => $page
        );
    }
} 
<?php
// Prevent direct access to this file
if (!defined('SECURE_ACCESS') && !isset($_SERVER['HTTP_X_REQUESTED_WITH']) && 
    (!isset($_SERVER['REQUEST_URI']) || strpos($_SERVER['REQUEST_URI'], '/api/') === false)) {
    header('HTTP/1.0 403 Forbidden');
    exit('Direct access denied.');
}

// Store API keys securely
// In production, consider using environment variables or a proper secrets management system
$DEEPSEEK_API_KEY = 'sk-0b80a5a0456b49ce9a3c5ad512c2d8dfZGxvYmFsdmFy'; // Replace with actual key

// Additional security in case this file is accidentally exposed
// Set appropriate file permissions (600) on this file in production
?> 
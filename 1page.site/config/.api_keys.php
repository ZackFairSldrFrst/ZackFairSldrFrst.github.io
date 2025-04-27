<?php
/**
 * SECURE API KEY STORAGE
 * 
 * IMPORTANT: This file should:
 * 1. Be stored outside the web root if possible
 * 2. Have restricted file permissions (chmod 600)
 * 3. Never be committed to version control
 */

// Prevent direct access to this file
if (!defined('SECURE_ACCESS')) {
    header('HTTP/1.0 403 Forbidden');
    exit('Access denied');
}

// DeepSeek API key
$DEEPSEEK_API_KEY = '';

// Function to mask API key for logging/debugging
function getMaskedKey($key) {
    if (strlen($key) <= 8) return '********';
    return substr($key, 0, 4) . '...' . substr($key, -4);
}

// Log access to this file for security monitoring
if (function_exists('error_log')) {
    $access_source = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'unknown';
    $script = isset($_SERVER['SCRIPT_NAME']) ? $_SERVER['SCRIPT_NAME'] : 'unknown';
    error_log("API key file accessed by: $script from: $access_source");
}
?> 
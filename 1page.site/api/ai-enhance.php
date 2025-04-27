<?php
// Set headers for API response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // For development - restrict in production
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Define secure access constant to allow config file inclusion
define('SECURE_ACCESS', true);

// Check user authentication - temporarily bypassed for testing
// In production, uncomment this
/*
session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Authentication required']);
    exit;
}
*/

// Load API keys from secure configuration file
$config_file = __DIR__ . '/../config/.api_keys.php';
if (!file_exists($config_file)) {
    http_response_code(500);
    error_log("API key configuration file not found");
    echo json_encode(['error' => 'Server configuration error']);
    exit;
}
require_once $config_file;

// Process incoming data
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Validate input
if (!$data || !isset($data['business_name']) || !isset($data['business_type'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request data']);
    exit;
}

// Extract business information
$business_name = htmlspecialchars($data['business_name']);
$business_type = htmlspecialchars($data['business_type']);
$business_description = isset($data['business_description']) ? htmlspecialchars($data['business_description']) : '';
$services = isset($data['services']) ? $data['services'] : [];
$features = isset($data['features']) ? $data['features'] : [];

// Debug info
// error_log("Processing AI request for: $business_name, $business_type");

// Format services and features for the prompt
$services_text = "";
if (!empty($services)) {
    $services_text = "The business offers these services:\n";
    foreach ($services as $service) {
        if (is_string($service)) {
            $services_text .= "- " . htmlspecialchars($service) . "\n";
        }
    }
}

$features_text = "";
if (!empty($features)) {
    $features_text = "The website should include these features:\n";
    foreach ($features as $feature) {
        if (is_string($feature)) {
            $features_text .= "- " . htmlspecialchars($feature) . "\n";
        }
    }
}

// Create prompt for AI
$prompt = "Create compelling website content for a $business_type business named \"$business_name\". 
Business description: $business_description
$services_text
$features_text

Create the following:
1. A compelling headline for the website (max 8 words)
2. An engaging intro paragraph (max 2-3 sentences)
3. Three key benefits/reasons to choose this business (with title and description for each)

Format the response as structured JSON with these exact keys only:
{
  \"headline\": \"...\",
  \"intro\": \"...\",
  \"benefits\": [
    {\"title\": \"...\", \"description\": \"...\"},
    {\"title\": \"...\", \"description\": \"...\"},
    {\"title\": \"...\", \"description\": \"...\"}
  ]
}";

// Call the DeepSeek API
try {
    // API configuration
    $api_url = 'https://api.deepseek.com/v1/chat/completions';
    $model = 'deepseek-chat';
    
    $request_data = [
        'model' => $model,
        'messages' => [
            [
                'role' => 'system',
                'content' => 'You are a professional copywriter who creates concise, compelling website content.'
            ],
            [
                'role' => 'user',
                'content' => $prompt
            ]
        ],
        'temperature' => 0.7,
        'max_tokens' => 600,
        'response_format' => ['type' => 'json_object']
    ];
    
    // Initialize cURL session
    $ch = curl_init($api_url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($request_data),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $DEEPSEEK_API_KEY
        ],
        CURLOPT_TIMEOUT => 30
    ]);
    
    // Execute the request
    $response = curl_exec($ch);
    $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);
    curl_close($ch);
    
    // Check for errors
    if ($status_code !== 200 || !$response) {
        throw new Exception("API request failed with status $status_code: $curl_error");
    }
    
    // Process the response
    $api_response = json_decode($response, true);
    if (!isset($api_response['choices'][0]['message']['content'])) {
        throw new Exception('Invalid API response format');
    }
    
    // Extract the generated content
    $content_json = $api_response['choices'][0]['message']['content'];
    $content = json_decode($content_json, true);
    
    if (!$content || !isset($content['headline']) || !isset($content['intro']) || !isset($content['benefits'])) {
        throw new Exception('Invalid content structure in API response');
    }
    
    // Determine color scheme based on business type
    $color_scheme = getColorSchemeForBusinessType($business_type);
    
    // Format and return the result
    echo json_encode([
        'content' => $content,
        'design_suggestions' => [
            'color_scheme' => $color_scheme,
            'font_suggestion' => getFontSuggestion($business_type),
            'image_style' => getImageStyleSuggestion($business_type)
        ],
        'business_type' => $business_type,
        'business_name' => $business_name
    ]);
    
} catch (Exception $e) {
    // Log the error
    error_log('AI enhancement error: ' . $e->getMessage());
    
    // Return a friendly error to the client
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to generate content',
        'message' => 'The AI service is currently unavailable. Using default content instead.'
    ]);
}

// Helper functions for design suggestions
function getColorSchemeForBusinessType($type) {
    $type = strtolower($type);
    
    // Food and restaurant businesses
    if (strpos($type, 'restaurant') !== false || strpos($type, 'cafe') !== false || 
        strpos($type, 'food') !== false || strpos($type, 'bakery') !== false) {
        return [
            'primary' => '#D32F2F',     // Warm red
            'secondary' => '#8BC34A',   // Fresh green
            'accent' => '#FFD54F'       // Warm yellow
        ];
    }
    
    // Beauty and style businesses
    if (strpos($type, 'salon') !== false || strpos($type, 'spa') !== false || 
        strpos($type, 'beauty') !== false || strpos($type, 'style') !== false) {
        return [
            'primary' => '#9C27B0',     // Purple
            'secondary' => '#E1BEE7',   // Light purple
            'accent' => '#FF80AB'       // Pink
        ];
    }
    
    // Education
    if (strpos($type, 'school') !== false || strpos($type, 'education') !== false || 
        strpos($type, 'tutor') !== false || strpos($type, 'learn') !== false) {
        return [
            'primary' => '#1565C0',     // Deep blue
            'secondary' => '#BBDEFB',   // Light blue
            'accent' => '#FFA000'       // Gold/orange
        ];
    }
    
    // Professional services
    if (strpos($type, 'service') !== false || strpos($type, 'consult') !== false || 
        strpos($type, 'agency') !== false || strpos($type, 'professional') !== false) {
        return [
            'primary' => '#0288D1',     // Business blue
            'secondary' => '#B3E5FC',   // Light blue
            'accent' => '#FF5722'       // Orange accent
        ];
    }
    
    // Default color scheme for other business types
    return [
        'primary' => '#455A64',     // Blue grey
        'secondary' => '#CFD8DC',   // Light blue grey
        'accent' => '#009688'       // Teal
    ];
}

function getFontSuggestion($type) {
    $type = strtolower($type);
    
    // Food and restaurant businesses
    if (strpos($type, 'restaurant') !== false || strpos($type, 'cafe') !== false || 
        strpos($type, 'food') !== false) {
        return 'Playfair Display for headings, Montserrat for body text';
    }
    
    // Beauty and style businesses
    if (strpos($type, 'salon') !== false || strpos($type, 'spa') !== false || 
        strpos($type, 'beauty') !== false) {
        return 'Cormorant Garamond for headings, Quicksand for body text';
    }
    
    // Education
    if (strpos($type, 'school') !== false || strpos($type, 'education') !== false || 
        strpos($type, 'learn') !== false) {
        return 'Merriweather for headings, Open Sans for body text';
    }
    
    // Default for other businesses
    return 'Poppins for headings, Roboto for body text';
}

function getImageStyleSuggestion($type) {
    $type = strtolower($type);
    
    // Food and restaurant businesses
    if (strpos($type, 'restaurant') !== false || strpos($type, 'cafe') !== false || 
        strpos($type, 'food') !== false) {
        return 'High-quality food photography with warm lighting and appealing presentation';
    }
    
    // Beauty and style businesses
    if (strpos($type, 'salon') !== false || strpos($type, 'spa') !== false || 
        strpos($type, 'beauty') !== false) {
        return 'Elegant, minimalist imagery with soft lighting and clean backgrounds';
    }
    
    // Education
    if (strpos($type, 'school') !== false || strpos($type, 'education') !== false || 
        strpos($type, 'learn') !== false) {
        return 'Bright, engaging images showing learning environments and student interactions';
    }
    
    // Default for other businesses
    return 'Professional imagery that clearly shows your products or services with good lighting';
}
?> 
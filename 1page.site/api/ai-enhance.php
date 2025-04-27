<?php
// Set headers for API response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://1page.site'); // Adjust as needed
header('Access-Control-Allow-Methods: POST');

// Define secure access constant to allow config file inclusion
define('SECURE_ACCESS', true);

// Check user authentication
session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Authentication required']);
    exit;
}

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
if (!$data || !isset($data['business_type']) || !isset($data['business_name']) || !isset($data['business_description'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request data']);
    exit;
}

// Prepare a prompt for generating content
$business_type = htmlspecialchars($data['business_type']);
$business_name = htmlspecialchars($data['business_name']);
$business_description = htmlspecialchars($data['business_description']);
$services = isset($data['services']) ? $data['services'] : [];

$services_text = "";
if (!empty($services)) {
    $services_text = "The business offers these services:\n";
    foreach ($services as $service) {
        $services_text .= "- " . htmlspecialchars($service) . "\n";
    }
}

$prompt = "Generate compelling website content for a $business_type business named \"$business_name\". 
Business description: $business_description
$services_text
Create a persuasive headline, engaging intro paragraph, and 3 key benefits of choosing this business.
Format the response as structured JSON with keys: headline, intro, benefits (array of 3 objects with title and description).";

// Set up the API request to DeepSeek
$api_url = 'https://api.deepseek.com/v1/chat/completions';

$request_data = [
    'model' => 'deepseek-chat',
    'messages' => [
        [
            'role' => 'system',
            'content' => 'You are a professional copywriter and web content specialist who creates compelling, concise website content.'
        ],
        [
            'role' => 'user',
            'content' => $prompt
        ]
    ],
    'temperature' => 0.7,
    'max_tokens' => 800
];

$headers = [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $DEEPSEEK_API_KEY
];

// Make the API request
$ch = curl_init($api_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($request_data));
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$response = curl_exec($ch);
$http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
curl_close($ch);

// Process the API response
if ($http_status != 200 || !$response) {
    http_response_code(500);
    error_log("API request failed with status $http_status: $curl_error");
    echo json_encode(['error' => 'Failed to generate content']);
    exit;
}

$api_response = json_decode($response, true);

// Extract the generated content
$content = null;
if (isset($api_response['choices'][0]['message']['content'])) {
    $generated_text = $api_response['choices'][0]['message']['content'];
    
    // Try to extract JSON from the response
    preg_match('/\{.*\}/s', $generated_text, $matches);
    
    if (!empty($matches)) {
        $content = json_decode($matches[0], true);
    }
}

if (!$content) {
    http_response_code(500);
    error_log("Failed to parse content from API response");
    echo json_encode(['error' => 'Failed to process generated content']);
    exit;
}

// Add design suggestions based on business type
$design_suggestions = [];

switch (strtolower($business_type)) {
    case 'restaurant':
    case 'cafe':
    case 'bakery':
    case 'food':
        $design_suggestions = [
            'color_scheme' => ['primary' => '#E57373', 'secondary' => '#81C784', 'accent' => '#FFF176'],
            'font_suggestion' => 'Montserrat or Playfair Display',
            'image_style' => 'High-quality food photography with warm lighting'
        ];
        break;
    case 'salon':
    case 'spa':
    case 'beauty':
        $design_suggestions = [
            'color_scheme' => ['primary' => '#CE93D8', 'secondary' => '#90CAF9', 'accent' => '#F8BBD0'],
            'font_suggestion' => 'Quicksand or Cormorant Garamond',
            'image_style' => 'Elegant, minimalist imagery with soft lighting'
        ];
        break;
    default:
        $design_suggestions = [
            'color_scheme' => ['primary' => '#64B5F6', 'secondary' => '#81C784', 'accent' => '#FFD54F'],
            'font_suggestion' => 'Roboto or Open Sans',
            'image_style' => 'Professional, clean imagery that showcases your business'
        ];
}

// Return the enhanced content
$result = [
    'content' => $content,
    'design_suggestions' => $design_suggestions,
    'business_type' => $business_type
];

echo json_encode($result);
exit;

// Error handling function
function logError($message, $data = null) {
    error_log(date('Y-m-d H:i:s') . " - $message");
    if ($data) {
        error_log(print_r($data, true));
    }
}
?> 
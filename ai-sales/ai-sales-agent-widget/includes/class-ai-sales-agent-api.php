<?php
/**
 * AI Sales Agent API Class - Handles ElevenLabs API integration
 */

if (!defined('ABSPATH')) {
    exit;
}

class AI_Sales_Agent_API {
    
    private $api_key;
    private $voice_id;
    private $business_info;
    
    public function __construct() {
        $settings = get_option('ai_sales_agent_settings');
        $this->api_key = $settings['elevenlabs_api_key'];
        $this->voice_id = $settings['voice_id'];
        $this->business_info = $settings['business_info'];
    }
    
    /**
     * Process user message and generate AI response
     */
    public function process_message($message, $conversation_history = array()) {
        // Check if API key is configured
        if (empty($this->api_key)) {
            return array(
                'error' => 'ElevenLabs API key not configured. Please contact the administrator.',
                'type' => 'error'
            );
        }
        
        // Generate AI response
        $ai_response = $this->generate_ai_response($message, $conversation_history);
        
        if (isset($ai_response['error'])) {
            return $ai_response;
        }
        
        // Generate speech using ElevenLabs
        $speech_url = $this->generate_speech($ai_response['text']);
        
        if (isset($speech_url['error'])) {
            // Return text response even if speech generation fails
            return array(
                'text' => $ai_response['text'],
                'type' => 'text',
                'suggest_lead_form' => $ai_response['suggest_lead_form']
            );
        }
        
        return array(
            'text' => $ai_response['text'],
            'speech_url' => $speech_url,
            'type' => 'speech',
            'suggest_lead_form' => $ai_response['suggest_lead_form']
        );
    }
    
    /**
     * Generate AI response using business context
     */
    private function generate_ai_response($message, $conversation_history) {
        // Create a context-aware prompt
        $system_prompt = $this->create_system_prompt();
        
        // Build conversation context
        $conversation = $this->build_conversation_context($conversation_history, $message);
        
        // For now, we'll use a simple response system
        // In a production environment, you might want to integrate with OpenAI, Claude, or another LLM
        $response = $this->generate_simple_response($message, $system_prompt);
        
        return $response;
    }
    
    /**
     * Create system prompt with business information
     */
    private function create_system_prompt() {
        $settings = get_option('ai_sales_agent_settings');
        
        $prompt = "You are an AI sales assistant for a business. ";
        $prompt .= "Business Information: " . $this->business_info . "\n\n";
        $prompt .= "Your role is to:\n";
        $prompt .= "1. Provide helpful information about the business\n";
        $prompt .= "2. Answer questions about products/services\n";
        $prompt .= "3. Be friendly and professional\n";
        $prompt .= "4. When appropriate, suggest that the user provide their contact information for follow-up\n";
        $prompt .= "5. Keep responses concise and engaging\n";
        $prompt .= "6. If the user seems interested in the business, offer to collect their information\n\n";
        $prompt .= "Always be helpful and professional. If someone asks about pricing, services, or seems interested, offer to collect their contact information.";
        
        return $prompt;
    }
    
    /**
     * Build conversation context
     */
    private function build_conversation_context($history, $current_message) {
        $context = "";
        
        foreach ($history as $exchange) {
            $context .= "User: " . $exchange['user'] . "\n";
            $context .= "Assistant: " . $exchange['assistant'] . "\n";
        }
        
        $context .= "User: " . $current_message . "\n";
        $context .= "Assistant: ";
        
        return $context;
    }
    
    /**
     * Generate simple response (placeholder for LLM integration)
     */
    private function generate_simple_response($message, $system_prompt) {
        $message_lower = strtolower($message);
        
        // Simple keyword-based responses
        if (strpos($message_lower, 'hello') !== false || strpos($message_lower, 'hi') !== false) {
            return array(
                'text' => "Hello! I'm here to help you learn more about our business. What would you like to know?",
                'suggest_lead_form' => false
            );
        }
        
        if (strpos($message_lower, 'price') !== false || strpos($message_lower, 'cost') !== false) {
            return array(
                'text' => "I'd be happy to discuss pricing options with you. To provide you with the most accurate information, could I get your contact details so our team can reach out with a personalized quote?",
                'suggest_lead_form' => true
            );
        }
        
        if (strpos($message_lower, 'service') !== false || strpos($message_lower, 'product') !== false) {
            return array(
                'text' => $this->business_info . " Would you like to learn more about our specific offerings? I can have someone from our team contact you with detailed information.",
                'suggest_lead_form' => true
            );
        }
        
        if (strpos($message_lower, 'contact') !== false || strpos($message_lower, 'email') !== false || strpos($message_lower, 'phone') !== false) {
            return array(
                'text' => "Great! I'd be happy to connect you with our team. Could you please provide your contact information so we can follow up with you?",
                'suggest_lead_form' => true
            );
        }
        
        if (strpos($message_lower, 'thank') !== false) {
            return array(
                'text' => "You're welcome! Is there anything else I can help you with today?",
                'suggest_lead_form' => false
            );
        }
        
        // Default response
        return array(
            'text' => "Thank you for your message! " . $this->business_info . " Is there anything specific you'd like to know about our business? I'm here to help!",
            'suggest_lead_form' => false
        );
    }
    
    /**
     * Generate speech using ElevenLabs API
     */
    private function generate_speech($text) {
        if (empty($this->api_key) || empty($this->voice_id)) {
            return array('error' => 'API key or voice ID not configured');
        }
        
        $url = "https://api.elevenlabs.io/v1/text-to-speech/" . $this->voice_id;
        
        $data = array(
            'text' => $text,
            'model_id' => 'eleven_monolingual_v1',
            'voice_settings' => array(
                'stability' => 0.5,
                'similarity_boost' => 0.5
            )
        );
        
        $args = array(
            'method' => 'POST',
            'headers' => array(
                'Accept' => 'audio/mpeg',
                'Content-Type' => 'application/json',
                'xi-api-key' => $this->api_key
            ),
            'body' => json_encode($data),
            'timeout' => 30
        );
        
        $response = wp_remote_post($url, $args);
        
        if (is_wp_error($response)) {
            return array('error' => 'Failed to generate speech: ' . $response->get_error_message());
        }
        
        $response_code = wp_remote_retrieve_response_code($response);
        
        if ($response_code !== 200) {
            $body = wp_remote_retrieve_body($response);
            return array('error' => 'ElevenLabs API error: ' . $response_code . ' - ' . $body);
        }
        
        // Save audio file to WordPress uploads directory
        $audio_data = wp_remote_retrieve_body($response);
        $upload_dir = wp_upload_dir();
        $filename = 'ai-sales-agent-' . time() . '.mp3';
        $file_path = $upload_dir['path'] . '/' . $filename;
        $file_url = $upload_dir['url'] . '/' . $filename;
        
        if (file_put_contents($file_path, $audio_data)) {
            return $file_url;
        } else {
            return array('error' => 'Failed to save audio file');
        }
    }
    
    /**
     * Get available voices from ElevenLabs
     */
    public function get_available_voices() {
        if (empty($this->api_key)) {
            return array('error' => 'API key not configured');
        }
        
        $url = "https://api.elevenlabs.io/v1/voices";
        
        $args = array(
            'headers' => array(
                'Accept' => 'application/json',
                'xi-api-key' => $this->api_key
            ),
            'timeout' => 30
        );
        
        $response = wp_remote_get($url, $args);
        
        if (is_wp_error($response)) {
            return array('error' => 'Failed to fetch voices: ' . $response->get_error_message());
        }
        
        $response_code = wp_remote_retrieve_response_code($response);
        
        if ($response_code !== 200) {
            $body = wp_remote_retrieve_body($response);
            return array('error' => 'ElevenLabs API error: ' . $response_code . ' - ' . $body);
        }
        
        $body = wp_remote_retrieve_body($response);
        $voices = json_decode($body, true);
        
        return $voices;
    }
    
    /**
     * Test API connection
     */
    public function test_api_connection() {
        if (empty($this->api_key)) {
            return array('error' => 'API key not configured');
        }
        
        $voices = $this->get_available_voices();
        
        if (isset($voices['error'])) {
            return $voices;
        }
        
        return array('success' => true, 'message' => 'API connection successful');
    }
} 
import random
import re
import logging
from datetime import datetime
import openai
from config import Config

class ResponseGenerator:
    def __init__(self):
        self.openai_api_key = Config.OPENAI_API_KEY
        if self.openai_api_key:
            openai.api_key = self.openai_api_key
            self.ai_enabled = True
            logging.info("AI response generation enabled")
        else:
            self.ai_enabled = False
            logging.info("Using template-based response generation")
    
    def generate_response(self, comment_text, video_context=None, user_context=None):
        """
        Generate an appropriate response to a comment
        """
        # First, check if we should respond at all
        if not self._should_respond(comment_text):
            return None
        
        # Check for keyword-based responses first
        keyword_response = self._get_keyword_response(comment_text)
        if keyword_response:
            return keyword_response
        
        # Try AI response if available
        if self.ai_enabled:
            ai_response = self._generate_ai_response(comment_text, video_context, user_context)
            if ai_response:
                return ai_response
        
        # Fall back to template response
        return self._get_template_response(comment_text)
    
    def _should_respond(self, comment_text):
        """
        Determine if we should respond to this comment
        """
        comment_lower = comment_text.lower().strip()
        
        # Don't respond to very short comments
        if len(comment_lower) < 3:
            return False
        
        # Don't respond to spam-like comments
        for spam_keyword in Config.SPAM_KEYWORDS:
            if spam_keyword.lower() in comment_lower:
                logging.info(f"Skipping spam comment: {comment_text[:50]}")
                return False
        
        # Don't respond to other bots or automated comments
        bot_indicators = ['bot', 'automated', 'script', '🤖']
        for indicator in bot_indicators:
            if indicator in comment_lower:
                return False
        
        # Don't respond to very long comments (might be spam)
        if len(comment_text) > 500:
            return False
        
        return True
    
    def _get_keyword_response(self, comment_text):
        """
        Check if comment contains keywords that trigger specific responses
        """
        comment_lower = comment_text.lower()
        
        for keyword, response in Config.KEYWORD_RESPONSES.items():
            if keyword in comment_lower:
                logging.info(f"Using keyword response for: {keyword}")
                return response
        
        return None
    
    def _generate_ai_response(self, comment_text, video_context=None, user_context=None):
        """
        Generate AI-powered response using OpenAI
        """
        try:
            # Construct prompt for AI
            prompt = self._build_ai_prompt(comment_text, video_context, user_context)
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": self._get_system_prompt()},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=50,  # Keep responses short
                temperature=0.7,
                timeout=30
            )
            
            ai_response = response.choices[0].message.content.strip()
            
            # Ensure response isn't too long
            if len(ai_response) > Config.MAX_RESPONSE_LENGTH:
                ai_response = ai_response[:Config.MAX_RESPONSE_LENGTH-3] + "..."
            
            logging.info(f"Generated AI response: {ai_response}")
            return ai_response
            
        except openai.error.RateLimitError:
            logging.warning("OpenAI rate limit exceeded, falling back to templates")
            return None
        except openai.error.APIError as e:
            logging.error(f"OpenAI API error: {e}")
            return None
        except Exception as e:
            logging.error(f"AI response generation error: {e}")
            return None
    
    def _build_ai_prompt(self, comment_text, video_context=None, user_context=None):
        """
        Build prompt for AI response generation
        """
        prompt = f"Generate a friendly, engaging response to this TikTok comment: '{comment_text}'"
        
        if video_context:
            prompt += f"\nVideo context: {video_context}"
        
        if user_context:
            prompt += f"\nCreator context: {user_context}"
        
        prompt += "\nResponse should be:"
        prompt += "\n- Short and casual (under 150 characters)"
        prompt += "\n- Friendly and engaging"
        prompt += "\n- Include relevant emojis"
        prompt += "\n- Encourage further engagement"
        prompt += "\n- Be authentic and not overly promotional"
        
        return prompt
    
    def _get_system_prompt(self):
        """
        Get system prompt for AI
        """
        return """You are a friendly TikTok creator responding to comments on your videos. 
        Your responses should be warm, engaging, and authentic. Use emojis appropriately. 
        Keep responses short and conversational. Avoid being overly promotional or salesy.
        Focus on building community and encouraging positive interactions."""
    
    def _get_template_response(self, comment_text):
        """
        Get a template-based response
        """
        comment_lower = comment_text.lower()
        
        # Categorize the comment and choose appropriate response
        if any(word in comment_lower for word in ['love', 'amazing', 'great', 'awesome', 'fantastic']):
            responses = [
                "Thank you so much! 😊❤️",
                "Aww, you're the best! 🥰",
                "This made my day! Thank you! ✨",
                "You're too kind! 💕"
            ]
        elif any(word in comment_lower for word in ['how', 'tutorial', 'teach', 'learn']):
            responses = [
                "I'll make a tutorial soon! 📚✨",
                "Great idea! Will do a how-to next! 🎥",
                "Check my highlights for tutorials! 💡",
                "Tutorial coming up! Stay tuned! 🔥"
            ]
        elif any(word in comment_lower for word in ['funny', 'hilarious', 'lol', '😂']):
            responses = [
                "Glad I made you laugh! 😂",
                "Comedy is my specialty! 🎭",
                "Happy to brighten your day! ☀️",
                "More funny content coming! 😄"
            ]
        elif any(word in comment_lower for word in ['question', '?']):
            responses = [
                "Great question! Let me think... 🤔",
                "I'll answer this in my next video! 📹",
                "DM me for more details! 💬",
                "Thanks for asking! 🙏"
            ]
        else:
            # Default responses
            responses = Config.RESPONSE_TEMPLATES
        
        selected_response = random.choice(responses)
        logging.info(f"Using template response: {selected_response}")
        return selected_response
    
    def _add_personality_touch(self, response, comment_sentiment=None):
        """
        Add personality-based modifications to responses
        """
        # Add time-based variations
        hour = datetime.now().hour
        if 6 <= hour < 12:
            if random.random() < 0.1:  # 10% chance
                response += " Hope you have a great morning! ☀️"
        elif 18 <= hour < 22:
            if random.random() < 0.1:
                response += " Have a wonderful evening! 🌙"
        
        return response
    
    def validate_response(self, response):
        """
        Validate that a response is appropriate before sending
        """
        if not response or len(response.strip()) == 0:
            return False
        
        if len(response) > Config.MAX_RESPONSE_LENGTH:
            return False
        
        # Check for inappropriate content (basic filter)
        inappropriate_words = ['spam', 'scam', 'fake', 'hate']
        response_lower = response.lower()
        for word in inappropriate_words:
            if word in response_lower:
                return False
        
        return True 
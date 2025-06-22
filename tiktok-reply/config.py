import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # TikTok API Configuration
    TIKTOK_ACCESS_TOKEN = os.getenv('TIKTOK_ACCESS_TOKEN')
    TIKTOK_APP_ID = os.getenv('TIKTOK_APP_ID')
    TIKTOK_APP_SECRET = os.getenv('TIKTOK_APP_SECRET')
    
    # OpenAI Configuration (for AI responses)
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    
    # Database Configuration
    DATABASE_NAME = 'tiktok_replies.db'
    
    # Response Configuration
    MAX_RESPONSE_LENGTH = 150  # TikTok comment character limit
    RESPONSE_DELAY_MIN = 30    # Minimum seconds between responses
    RESPONSE_DELAY_MAX = 300   # Maximum seconds between responses
    
    # Response Templates (fallback if AI is not available)
    RESPONSE_TEMPLATES = [
        "Thanks for watching! 🎉",
        "Appreciate your comment! ❤️",
        "Thanks for the support! 🙏",
        "Great point! Thanks for sharing! 💯",
        "Love this comment! Keep them coming! 🔥"
    ]
    
    # Keywords that trigger specific responses
    KEYWORD_RESPONSES = {
        'tutorial': "Check out my other tutorials for more tips! 📚",
        'music': "The song is in the description! 🎵",
        'filter': "Filter details are in my bio! ✨",
        'recipe': "Full recipe is in my highlights! 👨‍🍳",
        'product': "Link is in my bio! 🛍️"
    }
    
    # Comments to avoid responding to (spam indicators)
    SPAM_KEYWORDS = [
        'follow back', 'f4f', 'check my profile', 'dm me', 
        'click my link', 'free money', 'contest', 'giveaway scam'
    ]
    
    # Rate limiting
    MAX_RESPONSES_PER_HOUR = 50
    MAX_RESPONSES_PER_DAY = 500 
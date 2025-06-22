# 🎵 TikTok Auto-Reply System

An intelligent system that automatically responds to comments on your TikTok videos using AI-powered or template-based responses.

## ✨ Features

- **Automated Comment Detection**: Monitors your TikTok videos for new comments
- **Smart Response Generation**: Uses OpenAI GPT or customizable templates
- **Rate Limiting**: Respects TikTok's API limits and prevents spam
- **Spam Protection**: Filters out spam and inappropriate comments
- **Web Dashboard**: Beautiful interface to monitor and control the bot
- **Database Tracking**: Prevents duplicate responses and tracks analytics
- **Keyword Responses**: Custom responses for specific keywords
- **Scheduled Operation**: Runs continuously with configurable intervals

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- TikTok Developer Account
- OpenAI API Key (optional, for AI responses)

### Installation

1. **Clone and setup**:
```bash
git clone <your-repo>
cd tiktok-reply
pip install -r requirements.txt
```

2. **Configure API credentials**:
```bash
cp env_example.txt .env
# Edit .env with your API keys
```

3. **Run the system**:
```bash
# Start the bot
python main.py

# Or run with dashboard
python dashboard.py
```

## 🔧 Configuration

### API Setup

#### TikTok API
1. Visit [TikTok Developer Portal](https://developers.tiktok.com/)
2. Create a new app and get your credentials
3. Add credentials to `.env` file

#### OpenAI API (Optional)
1. Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add to `.env` file for AI-powered responses

### Environment Variables

Create a `.env` file with:

```env
TIKTOK_ACCESS_TOKEN=your_token_here
TIKTOK_APP_ID=your_app_id_here  
TIKTOK_APP_SECRET=your_app_secret_here
OPENAI_API_KEY=your_openai_key_here
TIKTOK_USERNAME=your_username_here
```

## 🎯 Usage

### Command Line

```bash
# Run continuously
python main.py

# Run once for testing
python main.py --once

# Show statistics
python main.py --stats

# Enable debug logging
python main.py --debug
```

### Web Dashboard

```bash
# Start dashboard
python dashboard.py

# Access at http://localhost:5000
```

The dashboard provides:
- Real-time bot status
- Response statistics
- Recent activity log
- Start/stop controls
- Settings management

## ⚙️ Configuration Options

### Response Settings

Edit `config.py` to customize:

```python
# Rate limiting
MAX_RESPONSES_PER_HOUR = 50
MAX_RESPONSES_PER_DAY = 500

# Response delays (seconds)  
RESPONSE_DELAY_MIN = 30
RESPONSE_DELAY_MAX = 300

# Comment character limit
MAX_RESPONSE_LENGTH = 150
```

### Response Templates

Customize default responses:

```python
RESPONSE_TEMPLATES = [
    "Thanks for watching! 🎉",
    "Appreciate your comment! ❤️",
    "Thanks for the support! 🙏"
]
```

### Keyword Responses

Set up keyword-triggered responses:

```python
KEYWORD_RESPONSES = {
    'tutorial': "Check out my other tutorials! 📚",
    'music': "Song details in description! 🎵",
    'recipe': "Full recipe in highlights! 👨‍🍳"
}
```

## 🔍 How It Works

1. **Video Monitoring**: Fetches your recent TikTok videos
2. **Comment Detection**: Scans for new comments on each video  
3. **Response Generation**: Creates appropriate responses using:
   - Keyword matching for specific triggers
   - AI generation for contextual responses
   - Template selection for general comments
4. **Spam Filtering**: Filters out inappropriate or spam comments
5. **Rate Limiting**: Ensures compliance with API limits
6. **Database Tracking**: Prevents duplicate responses

## 📊 Analytics

The system tracks:
- Total responses sent
- Comments processed  
- Response success/failure rates
- Daily/hourly activity
- Most active videos

View analytics via:
- Web dashboard
- Command line: `python main.py --stats`
- Database queries

## 🛡️ Safety Features

### Rate Limiting
- Configurable hourly/daily limits
- Automatic cooldown periods
- API quota management

### Spam Protection
- Keyword-based spam detection
- Length-based filtering
- Bot detection
- Duplicate prevention

### Content Safety
- Response validation
- Inappropriate content filtering
- Manual review capabilities

## 🔧 Advanced Usage

### Custom Response Logic

Extend `ResponseGenerator` class:

```python
class CustomResponseGenerator(ResponseGenerator):
    def generate_response(self, comment_text, video_context=None):
        # Your custom logic here
        return super().generate_response(comment_text, video_context)
```

### Database Queries

Direct database access:

```python
from database import DatabaseManager

db = DatabaseManager()
stats = db.get_response_stats(days=7)
```

### API Integration

Use TikTok API directly:

```python
from tiktok_api import TikTokAPI

api = TikTokAPI()
videos = api.get_user_videos()
comments = api.get_video_comments(video_id)
```

## 📝 Logging

Logs are written to:
- `tiktok_bot.log` (file)
- Console output
- Web dashboard

Log levels:
- INFO: General operation
- WARNING: Rate limits, skipped comments  
- ERROR: API failures, processing errors
- DEBUG: Detailed operation info

## 🚨 Troubleshooting

### Common Issues

**API Connection Failed**
- Check credentials in `.env`
- Verify TikTok Developer app status
- Check internet connection

**No Comments Found**
- Ensure videos are public
- Check TikTok API permissions
- Verify account has recent videos

**Rate Limit Exceeded**
- Adjust limits in `config.py`
- Check current usage with `--stats`
- Wait for reset period

**AI Responses Not Working**
- Verify OpenAI API key
- Check API quota/billing
- Falls back to templates automatically

### Debug Mode

Enable detailed logging:

```bash
python main.py --debug
```

## 📋 Requirements

- Python 3.8+
- TikTok API access
- Required packages (see `requirements.txt`)
- Optional: OpenAI API key

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new features
4. Submit pull request

## ⚖️ Legal & Ethics

- Respect TikTok's Terms of Service
- Follow API rate limits
- Don't spam or harass users
- Be authentic in responses
- Monitor bot behavior regularly

## 🎯 Future Enhancements

- [ ] Sentiment analysis for better responses
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Comment moderation tools
- [ ] Integration with other social platforms
- [ ] Machine learning response optimization

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review logs for error details
3. Open an issue with details

---

**⚠️ Important**: Always comply with TikTok's Terms of Service and API guidelines. This tool is for legitimate engagement enhancement only. 
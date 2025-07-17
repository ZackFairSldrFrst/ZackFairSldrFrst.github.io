# AI Sales Agent Widget - Quick Installation Guide

## Prerequisites

- WordPress 5.0 or higher
- PHP 7.4 or higher
- ElevenLabs API account and key

## Installation Steps

### 1. Upload the Plugin

1. Download the `ai-sales-agent-widget` folder
2. Upload it to your WordPress site's `/wp-content/plugins/` directory
3. Go to **WordPress Admin > Plugins**
4. Find "AI Sales Agent Widget" and click **Activate**

### 2. Configure ElevenLabs API

1. Sign up at [ElevenLabs](https://elevenlabs.io/)
2. Get your API key from your account settings
3. Go to **AI Sales Agent > Settings** in WordPress admin
4. Enter your ElevenLabs API key
5. Click "Test Connection" to verify it works

### 3. Customize Your Widget

1. **General Settings**
   - Set your widget title
   - Add your welcome message
   - Enter your business information

2. **Appearance Settings**
   - Choose widget position (bottom-right, bottom-left, etc.)
   - Set your brand color
   - Enable/disable auto-start

3. **Notification Settings**
   - Set email for lead notifications

### 4. Test the Widget

1. Visit your website's frontend
2. Look for the AI Sales Agent widget button
3. Click it to start a conversation
4. Test asking questions about your business
5. Try the lead capture form

## Quick Configuration

### Essential Settings

```php
// Minimum required settings
Widget Title: "AI Sales Assistant"
Welcome Message: "Hello! How can I help you today?"
Business Information: "We provide [your services/products]"
ElevenLabs API Key: [your-api-key]
Widget Position: "bottom-right"
Lead Notification Email: [your-email]
```

### Recommended Settings

```php
// Enhanced configuration
Widget Color: #007cba (or your brand color)
Auto Start: false (let users initiate)
Voice ID: pNInz6obpgDQGcFmaJgB (default voice)
```

## Troubleshooting

### Widget Not Appearing?
- Check if plugin is activated
- Clear browser cache
- Check for JavaScript errors in browser console

### Voice Not Working?
- Verify ElevenLabs API key is correct
- Test API connection in admin
- Check ElevenLabs account for usage limits

### Leads Not Saving?
- Check database permissions
- Verify email settings
- Check WordPress error logs

## Support

- Check the main README.md for detailed documentation
- Enable WordPress debug mode for error details
- Verify all settings are configured correctly

## Next Steps

1. **Customize Responses**: Modify the AI response logic in `class-ai-sales-agent-api.php`
2. **Add Integrations**: Connect with your CRM or email marketing tools
3. **Monitor Performance**: Check the leads page for conversion tracking
4. **Optimize**: Adjust settings based on user interactions

---

**Need Help?** Check the main README.md file for comprehensive documentation and troubleshooting guides. 
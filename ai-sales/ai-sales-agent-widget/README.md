# AI Sales Agent Widget for WordPress

A powerful WordPress plugin that creates an AI-powered sales agent widget using ElevenLabs API for voice generation. The widget provides business information, answers customer questions, and captures leads automatically.

## Features

### 🤖 AI-Powered Sales Agent
- Intelligent conversation handling with context awareness
- Business information integration
- Automatic lead qualification and capture
- Voice generation using ElevenLabs API

### 🎨 Customizable Widget
- Multiple positioning options (bottom-right, bottom-left, top-right, top-left)
- Customizable colors and branding
- Responsive design for mobile devices
- Auto-start functionality

### 📊 Lead Management
- Complete lead capture system
- Lead status tracking (New, Contacted, Qualified, Converted, Lost)
- Email notifications for new leads
- CSV export functionality
- Search and filter capabilities

### 🎵 Voice Integration
- ElevenLabs API integration for natural-sounding voice responses
- Multiple voice options
- Audio playback controls
- Fallback to text-only mode if voice generation fails

### ⚙️ Admin Dashboard
- Easy-to-use settings panel
- API connection testing
- Voice selection interface
- Lead management interface
- Statistics and analytics

## Installation

1. **Download the Plugin**
   - Download the plugin files to your computer
   - Extract the ZIP file if necessary

2. **Upload to WordPress**
   - Go to your WordPress admin panel
   - Navigate to **Plugins > Add New > Upload Plugin**
   - Choose the plugin ZIP file and click **Install Now**
   - Activate the plugin

3. **Configure Settings**
   - Go to **AI Sales Agent** in your admin menu
   - Enter your ElevenLabs API key
   - Configure your business information
   - Customize the widget appearance

## Configuration

### ElevenLabs API Setup

1. **Get an API Key**
   - Sign up at [ElevenLabs](https://elevenlabs.io/)
   - Navigate to your profile settings
   - Copy your API key

2. **Configure the Plugin**
   - Go to **AI Sales Agent > Settings**
   - Enter your ElevenLabs API key
   - Test the connection using the "Test Connection" button
   - Select your preferred voice using "Load Available Voices"

### Widget Customization

- **Widget Title**: Set the title displayed on the widget button
- **Welcome Message**: Customize the initial greeting
- **Business Information**: Add details about your business for the AI to reference
- **Position**: Choose where the widget appears on your site
- **Color**: Customize the widget's color scheme
- **Auto Start**: Enable automatic chat opening

### Lead Capture Settings

- **Notification Email**: Set the email address for lead notifications
- **Form Fields**: The widget captures name, email, phone, company, and additional message
- **Lead Status**: Track leads through your sales pipeline

## Usage

### Frontend Widget

The widget appears as a floating button on your website. Users can:

1. **Start a Conversation**: Click the widget button to open the chat
2. **Ask Questions**: Type questions about your business, products, or services
3. **Get Voice Responses**: Listen to AI-generated voice responses
4. **Submit Information**: Provide contact details when prompted
5. **Receive Follow-up**: Get contacted by your sales team

### Admin Management

#### Settings Page
- Configure all widget settings
- Test API connections
- Select voice options
- Customize appearance

#### Leads Page
- View all captured leads
- Update lead status
- Search and filter leads
- Export lead data
- View detailed lead information

## API Integration

### ElevenLabs API

The plugin integrates with ElevenLabs for voice generation:

- **Text-to-Speech**: Converts AI responses to natural-sounding speech
- **Voice Selection**: Choose from multiple available voices
- **Error Handling**: Graceful fallback to text-only mode
- **Audio Management**: Automatic audio file cleanup

### Future Enhancements

The plugin is designed for easy integration with additional AI services:

- OpenAI GPT integration for more advanced conversations
- Claude API integration
- Custom AI model support
- Multi-language support

## Customization

### CSS Customization

You can customize the widget appearance by adding CSS to your theme:

```css
/* Custom widget colors */
.ai-sales-agent-widget {
    --widget-color: #your-brand-color;
    --widget-hover-color: #your-hover-color;
}

/* Custom positioning */
.ai-sales-agent-widget {
    bottom: 30px;
    right: 30px;
}
```

### JavaScript Extensions

The plugin provides hooks for custom functionality:

```javascript
// Listen for lead submissions
$(document).on('ai_sales_agent_lead_submitted', function(event, leadData) {
    // Custom lead handling
    console.log('New lead:', leadData);
});

// Listen for chat messages
$(document).on('ai_sales_agent_message_sent', function(event, messageData) {
    // Custom message handling
    console.log('Message sent:', messageData);
});
```

## Troubleshooting

### Common Issues

1. **Widget Not Appearing**
   - Check if the plugin is activated
   - Verify the widget is enabled in settings
   - Check for JavaScript errors in browser console

2. **Voice Not Working**
   - Verify your ElevenLabs API key is correct
   - Test the API connection in admin settings
   - Check your ElevenLabs account for usage limits

3. **Leads Not Saving**
   - Check database permissions
   - Verify email settings
   - Check for PHP errors in error logs

4. **Styling Issues**
   - Clear browser cache
   - Check for CSS conflicts with your theme
   - Verify the CSS files are loading correctly

### Debug Mode

Enable WordPress debug mode to see detailed error messages:

```php
// Add to wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

## Security

The plugin includes several security features:

- **Nonce Verification**: All AJAX requests are protected with WordPress nonces
- **Input Sanitization**: All user inputs are properly sanitized
- **SQL Prepared Statements**: Database queries use prepared statements
- **Capability Checks**: Admin functions require proper user capabilities
- **XSS Protection**: Output is properly escaped

## Performance

### Optimization Tips

1. **Caching**: The plugin works well with caching plugins
2. **CDN**: Audio files are stored in WordPress uploads directory
3. **Database**: Efficient database queries with proper indexing
4. **Assets**: CSS and JS files are minified and optimized

### Resource Usage

- **Memory**: Minimal memory footprint
- **Database**: Small database table for leads
- **API Calls**: Only when users interact with the widget
- **Storage**: Audio files are automatically cleaned up

## Support

### Documentation

- Check this README for basic setup and usage
- Review the code comments for technical details
- Check the WordPress admin help sections

### Getting Help

1. **Check the FAQ**: Common questions and solutions
2. **Review Settings**: Ensure all settings are configured correctly
3. **Test API**: Verify your ElevenLabs API key is working
4. **Check Logs**: Enable debug mode for detailed error information

## Changelog

### Version 1.0.0
- Initial release
- ElevenLabs API integration
- Lead capture system
- Admin dashboard
- Responsive widget design
- Voice generation capabilities

## License

This plugin is licensed under the GPL v2 or later.

## Credits

- **ElevenLabs**: Voice generation API
- **WordPress**: Plugin framework
- **jQuery**: JavaScript library
- **Modern CSS**: Responsive design patterns

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Roadmap

### Planned Features

- **Multi-language Support**: Internationalization and localization
- **Advanced AI Integration**: OpenAI GPT and Claude API support
- **Analytics Dashboard**: Detailed conversation and lead analytics
- **Custom Voice Training**: Upload custom voice samples
- **Integration APIs**: CRM and email marketing integrations
- **Mobile App**: Companion mobile application
- **Advanced Lead Scoring**: AI-powered lead qualification
- **Conversation Templates**: Pre-built conversation flows

### Version 1.1.0
- Enhanced AI responses
- Better error handling
- Performance improvements
- Additional customization options

### Version 1.2.0
- Multi-language support
- Advanced analytics
- CRM integrations
- Mobile optimization

---

**Note**: This plugin requires a valid ElevenLabs API key to function properly. Voice generation features will not work without an active API key. 
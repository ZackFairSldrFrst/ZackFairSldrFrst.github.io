# AI Message Scheduler for iOS

A web application that uses DeepSeek AI to generate personalized messages and creates iOS shortcuts to schedule them automatically.

## Features

- 🤖 **AI-Powered Messages**: Uses DeepSeek API to generate personalized messages based on occasion, tone, and recipient
- 📱 **iOS Shortcuts Integration**: Creates downloadable iOS shortcuts that can schedule messages
- ⏰ **Smart Scheduling**: Set specific times for messages to be sent
- 🎨 **Beautiful UI**: Modern, responsive design with smooth animations
- 📱 **Mobile-Friendly**: Works great on both desktop and mobile devices

## How It Works

1. **Enter Details**: Fill in the recipient's name, phone number, and select an occasion
2. **Choose Tone**: Pick the tone for your message (friendly, formal, romantic, etc.)
3. **Set Schedule**: Choose when you want the message to be sent
4. **Generate**: Click the generate button to create an AI message and iOS shortcut
5. **Download**: Get the shortcut on your iPhone via QR code or direct download

## Setup

1. Clone or download this repository
2. Open `index.html` in a web browser
3. The app uses the DeepSeek API - the API key is already configured

## Usage

### For iPhone Users
- Scan the generated QR code with your iPhone
- The shortcut will open in the Shortcuts app
- Run the shortcut to schedule your message

### For Other Devices
- Download the generated shortcut file
- Transfer it to your iPhone (via AirDrop, email, etc.)
- Open the file on your iPhone to import into Shortcuts app

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **AI API**: DeepSeek Chat API
- **QR Generation**: QRCode.js library
- **Design**: Modern gradient UI with Inter font
- **iOS Integration**: Native Shortcuts app format

## Message Types Supported

- Birthday messages
- Anniversary wishes
- Holiday greetings
- Friendly reminders
- Good morning/night messages
- Check-in messages
- Custom occasions

## File Structure

```
├── index.html              # Main web page
├── styles.css              # Styling and animations
├── script.js               # Main application logic
├── shortcut-generator.js   # iOS shortcut creation
└── README.md              # This file
```

## API Configuration

The app is pre-configured with a DeepSeek API key. If you need to use your own key, update the `DEEPSEEK_API_KEY` constant in `script.js`.

## Browser Compatibility

- Chrome/Safari (recommended for iOS device detection)
- Firefox
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Privacy & Security

- All processing happens client-side
- No data is stored on servers
- Messages are generated using DeepSeek AI
- Phone numbers and personal data stay on your device

## Contributing

Feel free to fork this project and submit pull requests for improvements!

## License

This project is open source and available under the MIT License. 
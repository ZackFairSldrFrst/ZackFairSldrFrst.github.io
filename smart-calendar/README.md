# Smart Calendar - Complete Business Booking Solution

A comprehensive React-based web application that provides a complete appointment booking solution for businesses. Features AI-powered availability suggestions using DeepSeek, calendar synchronization, business profile management, and shareable booking links.

## Features

### 🎯 Core Business Functionality
- **Business Dashboard**: Overview of bookings, availability, and synced events
- **Availability Management**: Set weekly schedules with custom time ranges
- **Business Profile**: Customize your business information and booking page
- **Calendar Sync**: Connect Google Calendar to avoid double bookings
- **Shareable Links**: Generate unique booking URLs for clients
- **Client Booking Interface**: Professional booking page for your clients

### 🤖 AI-Powered Features
- **DeepSeek Integration**: Advanced AI model for natural language understanding
- **Natural Language Processing**: Ask questions like "When are you free this week?"
- **Intelligent Suggestions**: AI analyzes availability and suggests optimal times
- **Clickable Recommendations**: Click on any AI-suggested time slot to book immediately
- **Context Awareness**: Understands day names, time preferences, and scheduling patterns

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Professional Interface**: Clean, modern design suitable for business use
- **Intuitive Navigation**: Six main sections: Dashboard, Bookings, Availability, AI Assistant, Profile, and Calendar Sync
- **Real-time Updates**: Instant booking confirmation and schedule updates
- **Interactive Elements**: Clickable time slots and smooth transitions

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager
- DeepSeek API key (optional - fallback key provided)

### Installation

1. **Clone or download the project files**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up API key (optional)**:
   Create a `.env` file in the root directory and add:
   ```
   REACT_APP_DEEPSEEK_API_KEY=your_deepseek_api_key_here
   ```
   If no API key is provided, the app will use a demo key.

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

## How to Use

### 1. Business Setup
- **Dashboard**: Start here to see an overview of your business metrics
- **Business Profile**: Set up your business information, contact details, and custom booking URL
- **Availability**: Configure your weekly schedule and working hours
- **Calendar Sync**: Connect your Google Calendar to sync existing events

### 2. Client Booking Process
- **Share Your Link**: Use the generated booking URL (e.g., `http://localhost:3000/book/your-business`)
- **Client Experience**: Clients see a professional booking page with your business info
- **Easy Booking**: Clients can select dates, times, and fill out contact information
- **Confirmation**: Automatic booking confirmation with appointment details

### 3. AI Assistant (DeepSeek)
- **Natural Queries**: Ask questions about availability using natural language
- **Smart Suggestions**: Get AI-powered time slot recommendations
- **Clickable Slots**: Click on suggested times to book immediately
- **Context Understanding**: AI understands preferences and constraints

### 4. Management Features
- **View All Bookings**: See all appointments in one place
- **Real-time Updates**: Bookings appear instantly across all views
- **Calendar Integration**: Sync with external calendars to avoid conflicts
- **Business Analytics**: Track booking metrics and availability

## Business Workflow

### For Business Owners:
1. **Set up your profile** with business information
2. **Configure availability** for each day of the week
3. **Connect your calendar** to sync existing events
4. **Share your booking link** with clients
5. **Use AI assistant** to help with scheduling queries
6. **Manage bookings** from the dashboard

### For Clients:
1. **Visit the booking link** shared by the business
2. **View business information** and description
3. **Select a date** from the calendar
4. **Choose an available time slot**
5. **Fill out contact information**
6. **Receive booking confirmation**

## AI Integration Details

### DeepSeek API
The app uses DeepSeek's advanced language model to:
- Understand natural language queries
- Analyze availability patterns
- Generate contextual responses
- Format clickable time slot suggestions

### Clickable Time Slots
When the AI suggests times, they appear as clickable buttons that:
- Display the formatted time (e.g., "Monday, Dec 16:09:00")
- Automatically switch to the booking interface when clicked
- Pre-select the suggested date and time
- Streamline the booking process

## Project Structure

```
src/
├── components/
│   ├── AvailabilityManager.js    # Manage weekly availability
│   ├── BookingInterface.js       # Internal booking management
│   ├── AIAssistant.js           # DeepSeek AI integration
│   ├── BusinessProfile.js       # Business profile management
│   ├── CalendarSync.js          # Google Calendar integration
│   └── ClientBookingPage.js     # Client-facing booking page
├── App.js                       # Main application component
├── index.js                     # React entry point
└── index.css                    # Global styles with Tailwind
```

## Technology Stack

- **React 18**: Modern React with hooks and functional components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **date-fns**: Date manipulation and formatting
- **Lucide React**: Beautiful icon library
- **DeepSeek API**: Advanced AI language model
- **Local Storage**: Client-side data persistence (no server required)

## Business Features

### Dashboard
- **Overview Metrics**: Total bookings, available days, synced events
- **Quick Actions**: Direct access to all main features
- **Recent Bookings**: Latest appointments at a glance

### Business Profile
- **Company Information**: Name, email, phone, location, website
- **Custom URL**: Generate unique booking links
- **Business Description**: Tell clients about your services
- **Share Options**: Copy or share booking links

### Calendar Sync
- **Google Calendar Integration**: Connect multiple calendars
- **Event Synchronization**: Import existing appointments
- **Conflict Prevention**: Block times with existing events
- **Auto-sync Settings**: Keep calendars updated automatically

### Client Booking Page
- **Professional Design**: Clean, branded booking interface
- **Business Information**: Display company details and description
- **Easy Navigation**: Intuitive date and time selection
- **Contact Forms**: Collect client information
- **Confirmation**: Success page with appointment details

## Customization

### Styling
- Modify `tailwind.config.js` to customize colors and theme
- Update component styles in individual files
- Add custom CSS classes as needed

### Business Logic
- Enhance the system prompt in `AIAssistant.js`
- Add more sophisticated natural language processing
- Implement additional time preference detection
- Customize the response format for time slots

### Features
- Add email notifications (requires backend)
- Implement recurring appointments
- Add more calendar integrations (Outlook, Apple Calendar)
- Include video conferencing links
- Add payment processing
- Implement booking reminders

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Development

### Available Scripts

- `npm start`: Runs the app in development mode
- `npm build`: Builds the app for production
- `npm test`: Launches the test runner
- `npm eject`: Ejects from Create React App (not recommended)

### Adding New Features

1. Create new components in the `src/components/` directory
2. Update the main `App.js` to include new functionality
3. Add any new dependencies to `package.json`
4. Test thoroughly across different devices and browsers

## Future Enhancements

- **Backend Integration**: Add server-side storage and user authentication
- **Email Notifications**: Send confirmation emails for bookings
- **Advanced Calendar Sync**: Support for Outlook, Apple Calendar
- **Payment Processing**: Integrate payment gateways
- **Advanced AI**: Implement more sophisticated NLP and machine learning
- **Mobile App**: Create native mobile applications
- **Multi-language Support**: Add internationalization
- **Voice Integration**: Add voice-to-text for AI queries
- **Analytics Dashboard**: Advanced business insights and reporting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

---

**Note**: This is a client-side only application. All data is stored locally in the browser and will be lost when the page is refreshed. For production use, consider adding a backend server and database for data persistence. 
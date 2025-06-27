# Google Calendar Integration Setup Guide

This guide will walk you through setting up Google Calendar integration for your Smart Calendar app.

## Prerequisites

- A Google account
- Access to Google Cloud Console
- Basic understanding of web development

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" at the top of the page
3. Click "New Project"
4. Enter a project name (e.g., "Smart Calendar App")
5. Click "Create"

## Step 2: Enable Google Calendar API

1. In your Google Cloud project, go to the [APIs & Services > Library](https://console.cloud.google.com/apis/library)
2. Search for "Google Calendar API"
3. Click on "Google Calendar API"
4. Click "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to [APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials)
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: "Smart Calendar"
   - User support email: Your email
   - Developer contact information: Your email
   - Save and continue through the remaining steps

4. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: "Smart Calendar Web Client"
   - Authorized JavaScript origins: 
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   - Click "Create"

5. Note down your **Client ID** - you'll need this for the app

## Step 4: Create API Key

1. In the same Credentials page, click "Create Credentials" > "API key"
2. Copy the generated API key
3. (Optional) Click "Restrict key" to limit its usage to Google Calendar API

## Step 5: Configure the App

1. Open `src/services/googleCalendar.js`
2. Replace the placeholder values with your actual credentials:

```javascript
const CLIENT_ID = 'YOUR_ACTUAL_CLIENT_ID_HERE';
const API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
```

3. Save the file

## Step 6: Test the Integration

1. Start your development server: `npm start`
2. Go to the "Calendar Sync" section
3. Click "Connect Google Calendar"
4. You should see a Google OAuth popup
5. Grant the necessary permissions
6. Your calendars should appear in the list

## Troubleshooting

### Common Issues

1. **"Failed to initialize Google Calendar"**
   - Check that your API key is correct
   - Ensure Google Calendar API is enabled
   - Verify your domain is in authorized origins

2. **"Failed to connect to Google Calendar"**
   - Check that your Client ID is correct
   - Ensure your domain is in authorized redirect URIs
   - Clear browser cache and try again

3. **"Failed to load calendars"**
   - Check that you've granted calendar permissions
   - Ensure you have calendars in your Google account
   - Try disconnecting and reconnecting

### Security Best Practices

1. **Restrict API Key**: Limit your API key to only Google Calendar API
2. **Use Environment Variables**: Store credentials in environment variables
3. **HTTPS Only**: Use HTTPS in production
4. **Regular Review**: Regularly review and rotate your credentials

## Environment Variables Setup

For better security, you can use environment variables:

1. Create a `.env` file in your project root:

```env
REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here
REACT_APP_GOOGLE_API_KEY=your_api_key_here
```

2. Update `src/services/googleCalendar.js`:

```javascript
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
```

## Production Deployment

When deploying to production:

1. Update your OAuth credentials with your production domain
2. Add your production domain to authorized origins and redirect URIs
3. Use environment variables for credentials
4. Ensure your domain uses HTTPS

## API Quotas and Limits

Google Calendar API has the following limits:
- 1,000,000 queries per day per user
- 10,000 queries per 100 seconds per user
- 1,000 queries per 100 seconds per project

For most small to medium businesses, these limits are sufficient.

## Support

If you encounter issues:

1. Check the [Google Calendar API documentation](https://developers.google.com/calendar/api)
2. Review the [Google Cloud Console](https://console.cloud.google.com/) for error logs
3. Check browser console for JavaScript errors
4. Verify your credentials are correct

## Next Steps

Once Google Calendar integration is working:

1. Test booking creation in Google Calendar
2. Set up automatic sync intervals
3. Configure event blocking for synced events
4. Test with multiple calendars
5. Set up email notifications (requires backend)

---

**Note**: This integration uses the Google Calendar API v3. For the most up-to-date information, always refer to the [official Google Calendar API documentation](https://developers.google.com/calendar/api). 
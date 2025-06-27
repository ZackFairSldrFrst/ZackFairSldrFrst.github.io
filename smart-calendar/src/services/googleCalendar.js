// Google Calendar API configuration
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your actual Google Client ID
const API_KEY = 'YOUR_GOOGLE_API_KEY'; // Replace with your actual Google API Key
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events';

class GoogleCalendarService {
  constructor() {
    this.tokenClient = null;
    this.gapiInited = false;
    this.gisInited = false;
    this.accessToken = null;
  }

  async initialize() {
    try {
      // Load the Google API client library
      await this.loadGapi();
      await this.loadGis();
      return true;
    } catch (error) {
      console.error('Failed to initialize Google Calendar:', error);
      return false;
    }
  }

  async loadGapi() {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        this.gapiInited = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client', async () => {
          try {
            await window.gapi.client.init({
              apiKey: API_KEY,
              discoveryDocs: [DISCOVERY_DOC],
            });
            this.gapiInited = true;
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async loadGis() {
    return new Promise((resolve, reject) => {
      if (window.google) {
        this.gisInited = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => {
        this.tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: (tokenResponse) => {
            this.accessToken = tokenResponse.access_token;
            this.onTokenReceived();
          },
        });
        this.gisInited = true;
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  onTokenReceived() {
    // Store the token in localStorage for persistence
    localStorage.setItem('google_calendar_token', this.accessToken);
    // Trigger any callbacks that were waiting for authentication
    if (this.onAuthSuccess) {
      this.onAuthSuccess(this.accessToken);
    }
  }

  async authenticate() {
    if (!this.gapiInited || !this.gisInited) {
      throw new Error('Google APIs not initialized');
    }

    // Check if we already have a valid token
    const storedToken = localStorage.getItem('google_calendar_token');
    if (storedToken) {
      this.accessToken = storedToken;
      return storedToken;
    }

    // Request new token
    return new Promise((resolve, reject) => {
      this.onAuthSuccess = resolve;
      this.tokenClient.requestAccessToken();
    });
  }

  async getCalendars() {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await window.gapi.client.calendar.calendarList.list();
      return response.result.items.map(calendar => ({
        id: calendar.id,
        name: calendar.summary,
        color: calendar.backgroundColor,
        primary: calendar.primary || false
      }));
    } catch (error) {
      console.error('Error fetching calendars:', error);
      throw error;
    }
  }

  async getEvents(calendarId, timeMin, timeMax) {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await window.gapi.client.calendar.events.list({
        calendarId: calendarId,
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      });

      return response.result.items.map(event => ({
        id: event.id,
        title: event.summary,
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        calendar: calendarId,
        description: event.description,
        location: event.location
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  async createEvent(calendarId, event) {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await window.gapi.client.calendar.events.insert({
        calendarId: calendarId,
        resource: {
          summary: event.title,
          description: event.description,
          start: {
            dateTime: event.start,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          end: {
            dateTime: event.end,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          attendees: event.attendees ? event.attendees.map(email => ({ email })) : []
        }
      });

      return response.result;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  async deleteEvent(calendarId, eventId) {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      await window.gapi.client.calendar.events.delete({
        calendarId: calendarId,
        eventId: eventId
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  logout() {
    this.accessToken = null;
    localStorage.removeItem('google_calendar_token');
    if (window.google && window.google.accounts.oauth2) {
      window.google.accounts.oauth2.revoke(this.accessToken);
    }
  }

  isAuthenticated() {
    return !!this.accessToken;
  }
}

// Create a singleton instance
const googleCalendarService = new GoogleCalendarService();
export default googleCalendarService; 
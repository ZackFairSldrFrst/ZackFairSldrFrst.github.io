import React, { useState, useEffect } from 'react';
import { Calendar, RefreshCw, CheckCircle, XCircle, ExternalLink, Settings, AlertCircle } from 'lucide-react';
import googleCalendarService from '../services/googleCalendar';
import storageService from '../services/storage';
import toast from 'react-hot-toast';

const CalendarSync = ({ onSync, syncedEvents = [] }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectedCalendars, setConnectedCalendars] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    autoSync: false,
    blockSyncedEvents: true,
    syncInterval: 15
  });

  useEffect(() => {
    initializeGoogleCalendar();
    loadSettings();
  }, []);

  const initializeGoogleCalendar = async () => {
    try {
      const success = await googleCalendarService.initialize();
      setIsInitialized(success);
      
      if (success && googleCalendarService.isAuthenticated()) {
        await loadCalendars();
      }
    } catch (error) {
      console.error('Failed to initialize Google Calendar:', error);
      setError('Failed to initialize Google Calendar. Please check your internet connection.');
    }
  };

  const loadSettings = async () => {
    try {
      const savedSettings = await storageService.getSettings();
      if (savedSettings) {
        setSettings(savedSettings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await storageService.saveSettings(newSettings);
      setSettings(newSettings);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    }
  };

  const connectGoogleCalendar = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      await googleCalendarService.authenticate();
      await loadCalendars();
      toast.success('Successfully connected to Google Calendar');
    } catch (error) {
      console.error('Failed to connect to Google Calendar:', error);
      setError('Failed to connect to Google Calendar. Please try again.');
      toast.error('Failed to connect to Google Calendar');
    } finally {
      setIsConnecting(false);
    }
  };

  const loadCalendars = async () => {
    try {
      const calendars = await googleCalendarService.getCalendars();
      setConnectedCalendars(calendars);
    } catch (error) {
      console.error('Failed to load calendars:', error);
      setError('Failed to load calendars');
    }
  };

  const syncCalendarEvents = async () => {
    setIsSyncing(true);
    setError(null);
    
    try {
      const allEvents = [];
      const now = new Date();
      const twoWeeksFromNow = new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000));
      
      for (const calendar of connectedCalendars) {
        try {
          const events = await googleCalendarService.getEvents(calendar.id, now, twoWeeksFromNow);
          allEvents.push(...events);
        } catch (error) {
          console.error(`Failed to sync calendar ${calendar.name}:`, error);
        }
      }
      
      await storageService.saveSyncedEvents(allEvents);
      onSync(allEvents);
      toast.success(`Successfully synced ${allEvents.length} events`);
    } catch (error) {
      console.error('Failed to sync events:', error);
      setError('Failed to sync calendar events');
      toast.error('Failed to sync calendar events');
    } finally {
      setIsSyncing(false);
    }
  };

  const disconnectCalendar = async (calendarId) => {
    try {
      setConnectedCalendars(prev => prev.filter(cal => cal.id !== calendarId));
      toast.success('Calendar disconnected');
    } catch (error) {
      console.error('Failed to disconnect calendar:', error);
      toast.error('Failed to disconnect calendar');
    }
  };

  const disconnectAll = async () => {
    try {
      googleCalendarService.logout();
      setConnectedCalendars([]);
      await storageService.saveSyncedEvents([]);
      onSync([]);
      toast.success('Disconnected from all calendars');
    } catch (error) {
      console.error('Failed to disconnect all calendars:', error);
      toast.error('Failed to disconnect calendars');
    }
  };

  const formatEventTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isInitialized) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <RefreshCw className="h-8 w-8 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Initializing Google Calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Calendar className="h-6 w-6 text-primary-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Calendar Sync</h2>
        </div>
        <button
          onClick={syncCalendarEvents}
          disabled={isSyncing || connectedCalendars.length === 0}
          className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Connection Status */}
      <div className="mb-6">
        {connectedCalendars.length === 0 ? (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Google Calendar</h3>
                <p className="text-gray-600 mb-4">
                  Sync your existing calendar events to avoid double bookings and see your current schedule.
                </p>
                <div className="text-sm text-gray-500">
                  <p>• View all your Google Calendars</p>
                  <p>• Sync events to prevent conflicts</p>
                  <p>• Automatic blocking of busy times</p>
                </div>
              </div>
              <button
                onClick={connectGoogleCalendar}
                disabled={isConnecting}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect Google Calendar
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <h3 className="text-lg font-medium text-green-900">Connected to Google Calendar</h3>
                  <p className="text-green-700">
                    {connectedCalendars.length} calendar{connectedCalendars.length > 1 ? 's' : ''} connected
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={syncCalendarEvents}
                  disabled={isSyncing}
                  className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing...' : 'Sync Events'}
                </button>
                <button
                  onClick={disconnectAll}
                  className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors"
                >
                  Disconnect All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Connected Calendars */}
      {connectedCalendars.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Connected Calendars</h3>
          <div className="space-y-3">
            {connectedCalendars.map((calendar) => (
              <div key={calendar.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: calendar.color }}
                  ></div>
                  <span className="text-gray-900">{calendar.name}</span>
                  {calendar.primary && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Primary
                    </span>
                  )}
                </div>
                <button
                  onClick={() => disconnectCalendar(calendar.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Synced Events */}
      {syncedEvents.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Synced Events</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {syncedEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3 bg-red-500"></div>
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-600">
                      {formatEventDate(event.start)} at {formatEventTime(event.start)} - {formatEventTime(event.end)}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {event.calendar}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sync Settings */}
      <div className="pt-6 border-t">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sync Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Auto-sync every {settings.syncInterval} minutes</p>
              <p className="text-sm text-gray-600">Keep your calendar up to date automatically</p>
            </div>
            <button 
              onClick={() => saveSettings({ ...settings, autoSync: !settings.autoSync })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoSync ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.autoSync ? 'translate-x-6' : 'translate-x-1'
              }`}></span>
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Block synced events</p>
              <p className="text-sm text-gray-600">Prevent bookings during existing calendar events</p>
            </div>
            <button 
              onClick={() => saveSettings({ ...settings, blockSyncedEvents: !settings.blockSyncedEvents })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.blockSyncedEvents ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.blockSyncedEvents ? 'translate-x-6' : 'translate-x-1'
              }`}></span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Sync interval</p>
              <p className="text-sm text-gray-600">How often to automatically sync</p>
            </div>
            <select
              value={settings.syncInterval}
              onChange={(e) => saveSettings({ ...settings, syncInterval: parseInt(e.target.value) })}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value={5}>5 minutes</option>
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarSync; 
import localforage from 'localforage';

// Configure localForage
localforage.config({
  name: 'SmartCalendar',
  storeName: 'smart_calendar_data'
});

class StorageService {
  constructor() {
    this.initialize();
  }

  async initialize() {
    try {
      await localforage.ready();
    } catch (error) {
      console.error('Failed to initialize storage:', error);
    }
  }

  // Business Profile
  async saveBusinessProfile(profile) {
    try {
      await localforage.setItem('businessProfile', profile);
      return true;
    } catch (error) {
      console.error('Error saving business profile:', error);
      return false;
    }
  }

  async getBusinessProfile() {
    try {
      const profile = await localforage.getItem('businessProfile');
      return profile || {
        name: 'Your Business Name',
        email: 'your@email.com',
        phone: '',
        location: '',
        website: '',
        slug: 'your-business',
        description: 'Professional services and consultations'
      };
    } catch (error) {
      console.error('Error getting business profile:', error);
      return null;
    }
  }

  // Availability
  async saveAvailability(availability) {
    try {
      await localforage.setItem('availability', availability);
      return true;
    } catch (error) {
      console.error('Error saving availability:', error);
      return false;
    }
  }

  async getAvailability() {
    try {
      const availability = await localforage.getItem('availability');
      return availability || {
        monday: { start: '09:00', end: '17:00', available: true },
        tuesday: { start: '09:00', end: '17:00', available: true },
        wednesday: { start: '09:00', end: '17:00', available: true },
        thursday: { start: '09:00', end: '17:00', available: true },
        friday: { start: '09:00', end: '17:00', available: true },
        saturday: { start: '10:00', end: '15:00', available: false },
        sunday: { start: '10:00', end: '15:00', available: false },
      };
    } catch (error) {
      console.error('Error getting availability:', error);
      return null;
    }
  }

  // Bookings
  async saveBookings(bookings) {
    try {
      await localforage.setItem('bookings', bookings);
      return true;
    } catch (error) {
      console.error('Error saving bookings:', error);
      return false;
    }
  }

  async getBookings() {
    try {
      const bookings = await localforage.getItem('bookings');
      return bookings || [];
    } catch (error) {
      console.error('Error getting bookings:', error);
      return [];
    }
  }

  async addBooking(booking) {
    try {
      const bookings = await this.getBookings();
      const newBooking = { ...booking, id: Date.now() };
      bookings.push(newBooking);
      await this.saveBookings(bookings);
      return newBooking;
    } catch (error) {
      console.error('Error adding booking:', error);
      return null;
    }
  }

  async updateBooking(bookingId, updates) {
    try {
      const bookings = await this.getBookings();
      const index = bookings.findIndex(booking => booking.id === bookingId);
      if (index !== -1) {
        bookings[index] = { ...bookings[index], ...updates };
        await this.saveBookings(bookings);
        return bookings[index];
      }
      return null;
    } catch (error) {
      console.error('Error updating booking:', error);
      return null;
    }
  }

  async deleteBooking(bookingId) {
    try {
      const bookings = await this.getBookings();
      const filteredBookings = bookings.filter(booking => booking.id !== bookingId);
      await this.saveBookings(filteredBookings);
      return true;
    } catch (error) {
      console.error('Error deleting booking:', error);
      return false;
    }
  }

  // Synced Events
  async saveSyncedEvents(events) {
    try {
      await localforage.setItem('syncedEvents', events);
      return true;
    } catch (error) {
      console.error('Error saving synced events:', error);
      return false;
    }
  }

  async getSyncedEvents() {
    try {
      const events = await localforage.getItem('syncedEvents');
      return events || [];
    } catch (error) {
      console.error('Error getting synced events:', error);
      return [];
    }
  }

  // Settings
  async saveSettings(settings) {
    try {
      await localforage.setItem('settings', settings);
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }

  async getSettings() {
    try {
      const settings = await localforage.getItem('settings');
      return settings || {
        autoSync: false,
        blockSyncedEvents: true,
        syncInterval: 15, // minutes
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      return null;
    }
  }

  // Export/Import
  async exportData() {
    try {
      const data = {
        businessProfile: await this.getBusinessProfile(),
        availability: await this.getAvailability(),
        bookings: await this.getBookings(),
        syncedEvents: await this.getSyncedEvents(),
        settings: await this.getSettings(),
        exportDate: new Date().toISOString()
      };
      return data;
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  }

  async importData(data) {
    try {
      if (data.businessProfile) await this.saveBusinessProfile(data.businessProfile);
      if (data.availability) await this.saveAvailability(data.availability);
      if (data.bookings) await this.saveBookings(data.bookings);
      if (data.syncedEvents) await this.saveSyncedEvents(data.syncedEvents);
      if (data.settings) await this.saveSettings(data.settings);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Clear all data
  async clearAll() {
    try {
      await localforage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }
}

// Create a singleton instance
const storageService = new StorageService();
export default storageService; 
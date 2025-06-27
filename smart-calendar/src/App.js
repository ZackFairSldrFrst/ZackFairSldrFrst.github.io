import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Users, Settings, MessageSquare, User, RefreshCw } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import AvailabilityManager from './components/AvailabilityManager';
import BookingInterface from './components/BookingInterface';
import AIAssistant from './components/AIAssistant';
import BusinessProfile from './components/BusinessProfile';
import CalendarSync from './components/CalendarSync';
import ClientBookingPage from './components/ClientBookingPage';
import storageService from './services/storage';

// Main business dashboard component
function BusinessDashboard() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [availability, setAvailability] = useState({
    monday: { start: '09:00', end: '17:00', available: true },
    tuesday: { start: '09:00', end: '17:00', available: true },
    wednesday: { start: '09:00', end: '17:00', available: true },
    thursday: { start: '09:00', end: '17:00', available: true },
    friday: { start: '09:00', end: '17:00', available: true },
    saturday: { start: '10:00', end: '15:00', available: false },
    sunday: { start: '10:00', end: '15:00', available: false },
  });

  const [bookings, setBookings] = useState([]);
  const [syncedEvents, setSyncedEvents] = useState([]);
  const [businessProfile, setBusinessProfile] = useState({
    name: 'Your Business Name',
    email: 'your@email.com',
    phone: '',
    location: '',
    website: '',
    slug: 'your-business',
    description: 'Professional services and consultations'
  });

  const [isLoading, setIsLoading] = useState(true);

  // Load data from storage on component mount
  useEffect(() => {
    loadDataFromStorage();
  }, []);

  const loadDataFromStorage = async () => {
    try {
      const [profile, avail, bookingsData, events] = await Promise.all([
        storageService.getBusinessProfile(),
        storageService.getAvailability(),
        storageService.getBookings(),
        storageService.getSyncedEvents()
      ]);

      if (profile) setBusinessProfile(profile);
      if (avail) setAvailability(avail);
      if (bookingsData) setBookings(bookingsData);
      if (events) setSyncedEvents(events);
    } catch (error) {
      console.error('Failed to load data from storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addBooking = async (booking) => {
    try {
      const newBooking = await storageService.addBooking(booking);
      if (newBooking) {
        setBookings(prev => [...prev, newBooking]);
        // In a real app, you'd also create the event in Google Calendar
        // await googleCalendarService.createEvent('primary', {
        //   title: `Appointment with ${booking.name}`,
        //   start: `${booking.date}T${booking.time}:00`,
        //   end: `${booking.date}T${booking.time}:00`,
        //   description: booking.notes
        // });
      }
    } catch (error) {
      console.error('Failed to add booking:', error);
    }
  };

  const handleTimeSlotClick = (date, time) => {
    setCurrentView('booking');
    console.log(`AI suggested booking: ${date} at ${time}`);
  };

  const handleProfileSave = async (profile) => {
    try {
      await storageService.saveBusinessProfile(profile);
      setBusinessProfile(profile);
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const handleAvailabilityChange = async (newAvailability) => {
    try {
      await storageService.saveAvailability(newAvailability);
      setAvailability(newAvailability);
    } catch (error) {
      console.error('Failed to save availability:', error);
    }
  };

  const handleCalendarSync = async (events) => {
    try {
      await storageService.saveSyncedEvents(events);
      setSyncedEvents(events);
    } catch (error) {
      console.error('Failed to save synced events:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-primary-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading your calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-primary-600" />
              <h1 className="ml-2 text-xl font-semibold text-gray-900">Smart Calendar</h1>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'dashboard'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('booking')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'booking'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users className="h-4 w-4 mr-1" />
                Bookings
              </button>
              <button
                onClick={() => setCurrentView('availability')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'availability'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Settings className="h-4 w-4 mr-1" />
                Availability
              </button>
              <button
                onClick={() => setCurrentView('ai')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'ai'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                AI Assistant
              </button>
              <button
                onClick={() => setCurrentView('profile')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'profile'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <User className="h-4 w-4 mr-1" />
                Profile
              </button>
              <button
                onClick={() => setCurrentView('sync')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'sync'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Calendar Sync
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-primary-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                    <p className="text-2xl font-semibold text-gray-900">{bookings.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Available Days</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {Object.values(availability).filter(day => day.available).length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <RefreshCw className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Synced Events</p>
                    <p className="text-2xl font-semibold text-gray-900">{syncedEvents.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setCurrentView('booking')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Users className="h-6 w-6 text-primary-600 mb-2" />
                  <h3 className="font-medium text-gray-900">View Bookings</h3>
                  <p className="text-sm text-gray-600">See all appointments</p>
                </button>
                
                <button
                  onClick={() => setCurrentView('availability')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Settings className="h-6 w-6 text-primary-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Set Availability</h3>
                  <p className="text-sm text-gray-600">Manage your schedule</p>
                </button>
                
                <button
                  onClick={() => setCurrentView('profile')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <User className="h-6 w-6 text-primary-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Business Profile</h3>
                  <p className="text-sm text-gray-600">Update your info</p>
                </button>
                
                <button
                  onClick={() => setCurrentView('sync')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <RefreshCw className="h-6 w-6 text-primary-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Calendar Sync</h3>
                  <p className="text-sm text-gray-600">Connect calendars</p>
                </button>
              </div>
            </div>

            {/* Recent Bookings */}
            {bookings.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h2>
                <div className="space-y-3">
                  {bookings.slice(-5).reverse().map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{booking.name}</p>
                        <p className="text-sm text-gray-600">
                          {booking.date} at {booking.time}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">{booking.email}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {currentView === 'booking' && (
          <BookingInterface 
            availability={availability} 
            bookings={bookings}
            onBooking={addBooking}
          />
        )}
        
        {currentView === 'availability' && (
          <AvailabilityManager 
            availability={availability} 
            setAvailability={handleAvailabilityChange}
          />
        )}
        
        {currentView === 'ai' && (
          <AIAssistant 
            availability={availability}
            bookings={bookings}
            onTimeSlotClick={handleTimeSlotClick}
          />
        )}
        
        {currentView === 'profile' && (
          <BusinessProfile 
            profile={businessProfile}
            setProfile={setBusinessProfile}
            onSave={handleProfileSave}
          />
        )}
        
        {currentView === 'sync' && (
          <CalendarSync 
            onSync={handleCalendarSync}
            syncedEvents={syncedEvents}
          />
        )}
      </main>
    </div>
  );
}

// Client booking page component
function ClientBookingRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  const [businessProfile, setBusinessProfile] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBusinessData();
  }, [location.pathname]);

  const loadBusinessData = async () => {
    try {
      const slug = location.pathname.replace('/book/', '');
      const [profile, avail, bookingsData] = await Promise.all([
        storageService.getBusinessProfile(),
        storageService.getAvailability(),
        storageService.getBookings()
      ]);

      if (profile && profile.slug === slug) {
        setBusinessProfile(profile);
        setAvailability(avail);
        setBookings(bookingsData);
      } else {
        // Handle case where business doesn't exist
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to load business data:', error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = async (booking) => {
    try {
      await storageService.addBooking(booking);
      setBookings(prev => [...prev, booking]);
    } catch (error) {
      console.error('Failed to create booking:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-primary-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading booking page...</p>
        </div>
      </div>
    );
  }

  if (!businessProfile || !availability) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Business not found</p>
        </div>
      </div>
    );
  }

  return (
    <ClientBookingPage
      businessProfile={businessProfile}
      availability={availability}
      bookings={bookings}
      onBooking={handleBooking}
      onBack={() => navigate('/')}
    />
  );
}

// Main App component with routing
function App() {
  return (
    <Router>
      <div>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<BusinessDashboard />} />
          <Route path="/book/:slug" element={<ClientBookingRoute />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 
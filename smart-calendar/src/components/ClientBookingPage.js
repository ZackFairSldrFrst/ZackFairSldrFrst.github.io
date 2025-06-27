import React, { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, CheckCircle, ArrowLeft } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';

const ClientBookingPage = ({ businessProfile, availability, bookings, onBooking, onBack }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [bookingStep, setBookingStep] = useState('calendar'); // 'calendar', 'form', 'confirmation'

  // Generate available time slots for the selected date
  const generateTimeSlots = (date) => {
    const dayName = format(date, 'EEEE').toLowerCase();
    const dayAvailability = availability[dayName];
    
    if (!dayAvailability.available) return [];

    const slots = [];
    const startTime = new Date(date);
    const [startHour, startMinute] = dayAvailability.start.split(':');
    startTime.setHours(parseInt(startHour), parseInt(startMinute), 0);

    const endTime = new Date(date);
    const [endHour, endMinute] = dayAvailability.end.split(':');
    endTime.setHours(parseInt(endHour), parseInt(endMinute), 0);

    // Generate 30-minute slots
    const currentTime = new Date(startTime);
    while (currentTime < endTime) {
      const timeString = format(currentTime, 'HH:mm');
      const isBooked = bookings.some(booking => 
        format(new Date(booking.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') &&
        booking.time === timeString
      );
      
      slots.push({
        time: timeString,
        available: !isBooked
      });
      
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    return slots;
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Start from Monday
    
    for (let i = 0; i < 7; i++) {
      const day = addDays(start, i);
      const dayName = format(day, 'EEEE').toLowerCase();
      const isAvailable = availability[dayName]?.available;
      
      days.push({
        date: day,
        dayName: format(day, 'EEE'),
        dayNumber: format(day, 'd'),
        isAvailable,
        isSelected: format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
      });
    }
    
    return days;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setShowForm(false);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setShowForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const booking = {
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      ...bookingForm
    };
    onBooking(booking);
    setBookingStep('confirmation');
  };

  const timeSlots = generateTimeSlots(selectedDate);
  const calendarDays = generateCalendarDays();

  if (bookingStep === 'confirmation') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your appointment with {businessProfile.name} has been scheduled successfully.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Appointment Details</h3>
              <p className="text-gray-600">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime}
              </p>
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
            >
              Book Another Appointment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-primary-600" />
              <h1 className="ml-2 text-xl font-semibold text-gray-900">Book with {businessProfile.name}</h1>
            </div>
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Business Info */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{businessProfile.name}</h2>
              {businessProfile.location && (
                <p className="text-gray-600">{businessProfile.location}</p>
              )}
              {businessProfile.description && (
                <p className="text-gray-600 mt-2">{businessProfile.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Select Date</h2>
              <Calendar className="h-5 w-5 text-primary-600" />
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => handleDateSelect(day.date)}
                  className={`p-2 text-sm rounded-md transition-colors ${
                    day.isSelected
                      ? 'bg-primary-600 text-white'
                      : day.isAvailable
                      ? 'hover:bg-gray-100 text-gray-900'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!day.isAvailable}
                >
                  {day.dayNumber}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Clock className="h-5 w-5 text-primary-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Available Times</h2>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </p>
            
            {timeSlots.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No available times for this date</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                    disabled={!slot.available}
                    className={`p-3 text-sm rounded-md border transition-colors ${
                      slot.available
                        ? selectedTime === slot.time
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'hover:bg-gray-50 border-gray-200'
                        : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Booking Form */}
        {showForm && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 text-primary-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Book Appointment</h2>
            </div>
            
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Selected:</strong> {format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime}
              </p>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={bookingForm.email}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Any additional information..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Booking
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default ClientBookingPage; 
import React, { useState } from 'react';
import { Calendar, Clock, User, CheckCircle } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';

const BookingInterface = ({ availability, bookings, onBooking }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [showForm, setShowForm] = useState(false);

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
    setBookingForm({ name: '', email: '', phone: '', notes: '' });
    setShowForm(false);
    setSelectedTime(null);
  };

  const timeSlots = generateTimeSlots(selectedDate);
  const calendarDays = generateCalendarDays();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
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
      <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
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

      {/* Booking Form */}
      {showForm && (
        <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
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
    </div>
  );
};

export default BookingInterface; 
import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const AvailabilityManager = ({ availability, setAvailability }) => {
  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

  const handleDayToggle = (day) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        available: !prev[day].available
      }
    }));
  };

  const handleTimeChange = (day, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-6">
        <Clock className="h-6 w-6 text-primary-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Set Your Availability</h2>
      </div>
      
      <div className="space-y-4">
        {days.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center">
              <button
                onClick={() => handleDayToggle(key)}
                className={`flex items-center justify-center w-6 h-6 rounded-full mr-3 ${
                  availability[key].available
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {availability[key].available ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
              </button>
              <span className="font-medium text-gray-900">{label}</span>
            </div>
            
            {availability[key].available && (
              <div className="flex items-center space-x-2">
                <input
                  type="time"
                  value={availability[key].start}
                  onChange={(e) => handleTimeChange(key, 'start', e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="time"
                  value={availability[key].end}
                  onChange={(e) => handleTimeChange(key, 'end', e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Quick Tips:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click the circle icon to toggle availability for each day</li>
          <li>• Set your preferred start and end times for each available day</li>
          <li>• Your availability will be used by the AI assistant to suggest optimal booking times</li>
        </ul>
      </div>
    </div>
  );
};

export default AvailabilityManager; 
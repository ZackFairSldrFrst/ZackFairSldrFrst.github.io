import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Globe, Copy, Share2, Settings, Calendar } from 'lucide-react';

const BusinessProfile = ({ profile, setProfile, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  const handleSave = () => {
    setProfile(tempProfile);
    onSave(tempProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const copyBookingLink = () => {
    const bookingUrl = `${window.location.origin}/book/${profile.slug}`;
    navigator.clipboard.writeText(bookingUrl);
    // You could add a toast notification here
    alert('Booking link copied to clipboard!');
  };

  const shareBookingLink = () => {
    const bookingUrl = `${window.location.origin}/book/${profile.slug}`;
    if (navigator.share) {
      navigator.share({
        title: `Book with ${profile.name}`,
        text: `Schedule an appointment with ${profile.name}`,
        url: bookingUrl
      });
    } else {
      copyBookingLink();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <User className="h-6 w-6 text-primary-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Business Profile</h2>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <Settings className="h-4 w-4 mr-1" />
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name *
            </label>
            <input
              type="text"
              value={tempProfile.name}
              onChange={(e) => setTempProfile(prev => ({ ...prev, name: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Your business name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={tempProfile.email}
              onChange={(e) => setTempProfile(prev => ({ ...prev, email: e.target.value }))}
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
              value={tempProfile.phone}
              onChange={(e) => setTempProfile(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={tempProfile.location}
              onChange={(e) => setTempProfile(prev => ({ ...prev, location: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="City, State or Remote"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              value={tempProfile.website}
              onChange={(e) => setTempProfile(prev => ({ ...prev, website: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Booking URL Slug *
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                {window.location.origin}/book/
              </span>
              <input
                type="text"
                value={tempProfile.slug}
                onChange={(e) => setTempProfile(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                className="flex-1 border border-gray-300 rounded-r-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="your-business-name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={tempProfile.description}
              onChange={(e) => setTempProfile(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Tell clients about your services..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
            >
              Save Profile
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Profile Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{profile.name}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{profile.phone}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{profile.location}</span>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 text-gray-400 mr-2" />
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                      {profile.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Link</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Share this link with clients:</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={`${window.location.origin}/book/${profile.slug}`}
                    readOnly
                    className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                  <button
                    onClick={copyBookingLink}
                    className="p-2 text-gray-500 hover:text-gray-700"
                    title="Copy link"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={shareBookingLink}
                    className="p-2 text-gray-500 hover:text-gray-700"
                    title="Share link"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {profile.description && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">About</h3>
              <p className="text-gray-700">{profile.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BusinessProfile; 
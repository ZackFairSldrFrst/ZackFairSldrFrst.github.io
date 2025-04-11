// Global variables
let currentLocation;
let map;
let mapMarkers = [];
let favorites = [];
let currentRestaurants = [];
let currentFilters = {
  cuisineType: 'restaurant',
  distance: 3000,
  minRating: 4,
  priceLevel: '',
  openNow: true
};

// Original variables
let currentCardIndex = 0;
const shortlist = [];

// Set default filters
const defaultFilters = {
  type: 'restaurant',
  rating: 4,
  closingTime: '',  // Empty means 'open now'
  price: ''
};

// UI Helper Functions
function showLoadingOverlay(message = 'Loading...') {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    const messageEl = overlay.querySelector('.loading-message');
    if (messageEl) {
      messageEl.textContent = message;
    }
    overlay.classList.add('active');
  }
}

function hideLoadingOverlay() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}

function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `
    <i class="fas fa-exclamation-circle"></i>
    <span>${message}</span>
  `;
  document.body.appendChild(errorDiv);
  
  setTimeout(() => {
    errorDiv.classList.add('fade-out');
    setTimeout(() => {
      errorDiv.remove();
    }, 300);
  }, 5000);
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  // Set up initial UI elements
  setupUIElements();
  
  // Load favorites from localStorage
  loadFavorites();
});

// Setup UI Elements
function setupUIElements() {
  // Only set up event listeners for elements that exist
  const findRestaurantsBtn = document.getElementById('find-restaurants');
  if (findRestaurantsBtn) {
    findRestaurantsBtn.addEventListener('click', () => {
      if (currentLocation) {
        findRestaurants();
      } else {
        requestLocationAndFindRestaurants();
      }
    });
  }

  const toggleFavoritesBtn = document.getElementById('toggle-favorites');
  if (toggleFavoritesBtn) {
    toggleFavoritesBtn.addEventListener('click', toggleFavoritesView);
  }

  const toggleMapBtn = document.getElementById('toggle-map');
  if (toggleMapBtn) {
    toggleMapBtn.addEventListener('click', toggleMapView);
  }

  const openFiltersBtn = document.getElementById('open-filters');
  if (openFiltersBtn) {
    openFiltersBtn.addEventListener('click', openFiltersPanel);
  }

  const closeFiltersBtn = document.getElementById('close-filters');
  if (closeFiltersBtn) {
    closeFiltersBtn.addEventListener('click', closeFiltersPanel);
  }

  const filtersForm = document.getElementById('filters-form');
  if (filtersForm) {
    filtersForm.addEventListener('submit', function(e) {
      e.preventDefault();
      applyFilters();
    });
  }

  // Set up other UI elements and event listeners
  setupFilterControls();
}

// Initialize the app (called by Google Maps callback)
window.initializeApp = function() {
  showLoadingOverlay('Initializing...');
  
  // Set up initial filter values
  updateStarRating(currentFilters.minRating);
  if (currentFilters.priceLevel) {
    const priceBtn = document.querySelector(`.price-btn[data-value="${currentFilters.priceLevel}"]`);
    if (priceBtn) {
      priceBtn.classList.add('active');
    }
  }

  const distanceSlider = document.getElementById('distance');
  if (distanceSlider) {
    distanceSlider.value = currentFilters.distance;
    const output = document.querySelector('output[for="distance"]');
    if (output) {
      output.value = (currentFilters.distance / 1000) + ' km';
    }
  }

  // Start location request
  requestLocationAndFindRestaurants();
};

// Event listener for finding restaurants
document.getElementById('find-restaurants').addEventListener('click', function() {
  const settings = getSettings();
  findRestaurants(settings);
});

// Event listener for opening and closing settings menu
document.getElementById('open-settings').addEventListener('click', function() {
  const settingsContainer = document.getElementById('settings');
  const resultsContainer = document.getElementById('results');
  settingsContainer.classList.toggle('hidden');

  if (settingsContainer.classList.contains('hidden')) {
    resultsContainer.classList.remove('hidden');
  } else {
    resultsContainer.classList.add('hidden');
  }
});

// Event listener for applying filters from the settings menu
document.getElementById('settings-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const settings = getSettings();
  findRestaurants(settings);
  document.getElementById('settings').classList.add('hidden');
  document.getElementById('results').classList.remove('hidden');
});

// Function to get settings values from the form
function getSettings() {
  return {
    type: document.getElementById('type').value,
    rating: parseFloat(document.getElementById('rating').value) || 4.5,
    closingTime: document.getElementById('closing-time').value,
    price: document.getElementById('price').value || ''
  };
}

// Apply default filters to settings form
function applyDefaultFilters() {
  document.getElementById('type').value = defaultFilters.type;
  document.getElementById('rating').value = defaultFilters.rating;
  document.getElementById('closing-time').value = defaultFilters.closingTime;
  document.getElementById('price').value = defaultFilters.price;
}

// Function to find and display restaurants based on filters
function findRestaurants(filters) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const location = new google.maps.LatLng(lat, lng);

      const service = new google.maps.places.PlacesService(document.createElement('div'));
      const request = {
        location: location,
        radius: 3000, // Default radius
        type: [filters.type]
      };

      service.nearbySearch(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          const filteredResults = results.filter(result => {
            return (filters.rating ? result.rating >= filters.rating : true) &&
                   (filters.price ? result.price_level === parseInt(filters.price) : true);
          });

          displayResults(filteredResults, filters.closingTime);
        } else {
          console.error('Places API request failed:', status);
          alert('Error fetching data. Please check the console for details.');
        }
      });
    }, function(error) {
      console.error('Error getting location:', error);
      alert(`Could not get your location. Error: ${error.message}`);
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

// Function to display search results
function displayResults(results, closingTime) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';

  if (!results || results.length === 0) {
    resultsContainer.innerHTML = '<p>No restaurants found.</p>';
    return;
  }

  results.forEach((result) => {
    const card = document.createElement('div');
    card.className = 'card active card-enter';
    card.dataset.placeId = result.place_id;

    const request = {
      placeId: result.place_id,
      fields: ['name', 'vicinity', 'photos', 'reviews', 'rating', 'opening_hours']
    };

    const service = new google.maps.places.PlacesService(document.createElement('div'));
    service.getDetails(request, function(placeResult, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        const isOpen = !closingTime || isRestaurantOpen(placeResult.opening_hours, closingTime);

        if (isOpen) {
          card.innerHTML = `
            <img src="${placeResult.photos ? placeResult.photos[0].getUrl() : 'https://via.placeholder.com/400x300'}" alt="${placeResult.name}">
            <div class="card-content">
              <h3>${placeResult.name}</h3>
              <p>${placeResult.vicinity}</p>
              <p>Rating: ${placeResult.rating || 'N/A'}</p>
              <p>${placeResult.reviews ? placeResult.reviews[0].text : 'No reviews available.'}</p>
            </div>
          `;
          resultsContainer.appendChild(card);

          handleSwipes(card, placeResult);
          handleExpandCard(card, placeResult);
        }
      }
    });
  });
}

// Function to check if restaurant is open based on closing time
function isRestaurantOpen(openingHours, closingTime) {
  if (!openingHours || !openingHours.periods) return false;

  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 100 + now.getMinutes();

  for (const period of openingHours.periods) {
    if (period.open.day === currentDay) {
      const closeHour = parseInt(closingTime.replace(':', ''), 10);
      const closePeriod = period.close ? parseInt(period.close.time, 10) : closeHour;
      return currentTime <= closePeriod;
    }
  }
  return false;
}

// Function to handle swipe gestures on cards
function handleSwipes(card, placeResult) {
  let startX, startY;

  card.classList.add('card-enter');
  setTimeout(() => card.classList.remove('card-enter'), 300);

  card.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    card.classList.add('tilt');
  });

  card.addEventListener('touchmove', function(e) {
    const deltaX = e.touches[0].clientX - startX;
    const deltaY = e.touches[0].clientY - startY;

    const tiltAmount = Math.min(15, Math.abs(deltaX) / 10);

    card.style.transform = `translateX(${deltaX}px) rotate(${deltaX > 0 ? tiltAmount : -tiltAmount}deg)`;
  });

  card.addEventListener('touchend', function(e) {
    const deltaX = e.changedTouches[0].clientX - startX;

    if (Math.abs(deltaX) > 100) {
      if (deltaX > 0) {
        card.classList.add('right');
        shortlist.push(placeResult);
        updateShortlist();
      } else {
        card.classList.add('left');
      }
      setTimeout(() => {
        card.remove();
        if (document.querySelectorAll('.card').length > 0) {
          currentCardIndex = Math.min(currentCardIndex, document.querySelectorAll('.card').length - 1);
          document.querySelectorAll('.card')[currentCardIndex].classList.add('active');
        }
      }, 300);
    } else {
      card.classList.remove('active');
    }

    card.classList.remove('tilt');
    card.style.transform = '';
  });
}

// Function to handle expanding and collapsing of cards
function handleExpandCard(card, placeResult) {
  card.addEventListener('click', function() {
    const expandedView = document.getElementById('expanded-view');
    const expandedContent = document.getElementById('expanded-content');

    expandedContent.innerHTML = `
      <h2>${placeResult.name}</h2>
      <p>${placeResult.vicinity}</p>
      <p>Rating: ${placeResult.rating || 'N/A'}</p>
      <div class="expanded-images">
        ${placeResult.photos ? placeResult.photos.map(photo => `<img src="${photo.getUrl()}" alt="${placeResult.name}">`).join('') : 'No images available.'}
      </div>
      <div class="expanded-reviews">
        ${placeResult.reviews ? placeResult.reviews.map(review => `<p>${review.text}</p>`).join('') : 'No reviews available.'}
      </div>
    `;
    expandedView.classList.remove('hidden');
    document.getElementById('results').classList.add('hidden');

    document.getElementById('close-expanded-view').addEventListener('click', function() {
      expandedView.classList.add('hidden');
      document.getElementById('results').classList.remove('hidden');
    });
  });
}

// Function to update and display the shortlist
function updateShortlist() {
  const shortlistContainer = document.getElementById('shortlist');
  shortlistContainer.innerHTML = '';

  if (shortlist.length === 0) {
    shortlistContainer.innerHTML = '<p>No restaurants in your shortlist.</p>';
    return;
  }

  shortlist.forEach((place) => {
    const item = document.createElement('div');
    item.className = 'shortlist-item';
    item.innerHTML = `
      <img src="${place.photos ? place.photos[0].getUrl() : 'https://via.placeholder.com/80x60'}" alt="${place.name}">
      <div>
        <h3>${place.name}</h3>
        <p>${place.vicinity}</p>
        <p>Rating: ${place.rating || 'N/A'}</p>
        <p>${place.reviews ? place.reviews[0].text : 'No reviews available.'}</p>
      </div>
    `;
    shortlistContainer.appendChild(item);
  });

  shortlistContainer.classList.remove('hidden');
}

// Toggle visibility of the shortlist
document.getElementById('toggle-shortlist').addEventListener('click', function() {
  const resultsContainer = document.getElementById('results');
  const shortlistContainer = document.getElementById('shortlist');
  
  if (shortlistContainer.classList.contains('hidden')) {
    shortlistContainer.classList.remove('hidden');
    resultsContainer.classList.add('hidden');
    this.textContent = 'Hide Shortlist';
  } else {
    shortlistContainer.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    this.textContent = 'Show Shortlist';
  }
});

// Function to get directions
function getDirections(place) {
  if (place.geometry) {
    let lat, lng;
    if (place.geometry.location) {
      lat = typeof place.geometry.location.lat === 'function' ? 
        place.geometry.location.lat() : place.geometry.location.lat;
      lng = typeof place.geometry.location.lng === 'function' ? 
        place.geometry.location.lng() : place.geometry.location.lng;
    } else if (place.lat && place.lng) {
      lat = place.lat;
      lng = place.lng;
    } else {
      alert('Unable to get location for directions');
      return;
    }
    
    // Open Google Maps with directions
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, '_blank');
  }
}

// Get distance between two points in meters
function getDistance(point1, point2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = point1.lat * Math.PI / 180;
  const φ2 = point2.lat * Math.PI / 180;
  const Δφ = (point2.lat - point1.lat) * Math.PI / 180;
  const Δλ = (point2.lng - point1.lng) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Format distance for display
function formatDistance(distance) {
  if (distance < 1000) {
    return `${Math.round(distance)} m`;
  } else {
    return `${(distance / 1000).toFixed(1)} km`;
  }
}

// Get price level string
function getPriceLevel(level) {
  if (!level) return 'N/A';
  return '$'.repeat(level);
}

// Get cuisine types from place types
function getCuisineTypes(types) {
  if (!types) return [];
  
  // Filter out generic types
  const genericTypes = ['point_of_interest', 'establishment', 'food'];
  const cuisineTypes = types.filter(type => !genericTypes.includes(type));
  
  // Format type names
  return cuisineTypes.map(type => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  });
}

// Get star rating HTML
function getStarRatingHtml(rating) {
  if (!rating) return '';
  
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  let html = '';
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    html += '<i class="fas fa-star"></i>';
  }
  
  // Half star
  if (halfStar) {
    html += '<i class="fas fa-star-half-alt"></i>';
  }
  
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    html += '<i class="far fa-star"></i>';
  }
  
  return html;
}

// Add CSS for error messages
const errorStyles = document.createElement('style');
errorStyles.innerHTML = `
  .error-message {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #ff6b6b;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 10000;
    animation: slide-up 0.3s ease;
  }
  
  .error-message.fade-out {
    animation: fade-out 0.3s ease forwards;
  }
  
  @keyframes slide-up {
    from { bottom: -50px; opacity: 0; }
    to { bottom: 20px; opacity: 1; }
  }
  
  @keyframes fade-out {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;
document.head.appendChild(errorStyles);

// Update the getCurrentLocation function
function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    showLoadingOverlay('Requesting location access...');

    // First check if geolocation is supported
    if (!navigator.geolocation) {
      hideLoadingOverlay();
      showError('Geolocation is not supported by your browser. Please use a modern browser with location services.');
      reject(new Error('Geolocation not supported'));
      return;
    }

    // Check for permissions first
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' })
        .then(permission => {
          if (permission.state === 'denied') {
            hideLoadingOverlay();
            showError('Location access is blocked. Please enable location services in your browser settings and refresh the page.');
            reject(new Error('Location permission denied'));
            return;
          }
          requestLocation();
        });
    } else {
      requestLocation();
    }

    function requestLocation() {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        // Success callback
        position => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          resolve(location);
        },
        // Error callback
        error => {
          hideLoadingOverlay();
          let errorMessage;
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access was denied. Please enable location services in your browser settings and refresh the page.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please check your device settings and try again.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please check your internet connection and try again.';
              break;
            default:
              errorMessage = 'An unknown error occurred while trying to get your location. Please try again.';
          }
          
          showError(errorMessage);
          reject(error);
        },
        options
      );
    }
  });
}

// New function to handle location request and restaurant search
function requestLocationAndFindRestaurants() {
  showLoadingOverlay('Requesting location access...');
  
  getCurrentLocation()
    .then(location => {
      currentLocation = location;
      showLoadingOverlay('Finding delicious options near you...');
      return findRestaurants();
    })
    .catch(error => {
      console.error('Location error:', error);
      hideLoadingOverlay();
      
      // Show error message with retry button
      const errorContainer = document.getElementById('results');
      errorContainer.innerHTML = `
        <div class="error-container">
          <i class="fas fa-map-marker-alt" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 15px;"></i>
          <h3>Location Access Required</h3>
          <p>${error.message || 'We need your location to find restaurants near you.'}</p>
          <button onclick="requestLocationAndFindRestaurants()" class="primary-btn" style="margin-top: 15px;">
            <i class="fas fa-redo"></i> Try Again
          </button>
        </div>
      `;
    });
}

// Add these styles to your CSS
const locationStyles = document.createElement('style');
locationStyles.innerHTML = `
  .error-container {
    text-align: center;
    padding: 40px 20px;
    background: white;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
  }

  .error-container h3 {
    margin-bottom: 10px;
    color: var(--text-color);
  }

  .error-container p {
    color: var(--text-light);
    margin-bottom: 20px;
  }

  #retry-location {
    display: none;
  }

  #loading-overlay.show-retry #retry-location {
    display: inline-flex;
  }
`;
document.head.appendChild(locationStyles);

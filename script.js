// Original variables
let currentCardIndex = 0;
const shortlist = [];

// Set default filters
const defaultFilters = {
  type: 'restaurant',
  rating: 4.5,
  closingTime: '',  // Empty means 'open now'
  price: ''
};

// Initialize with default filters on page load
document.addEventListener('DOMContentLoaded', function() {
  applyDefaultFilters();
  findRestaurants(defaultFilters);
});

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

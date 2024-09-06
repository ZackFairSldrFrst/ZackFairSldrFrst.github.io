document.getElementById('find-restaurants').addEventListener('click', function() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const location = new google.maps.LatLng(lat, lng);

          const service = new google.maps.places.PlacesService(document.createElement('div'));
          const request = {
              location: location,
              radius: '5000',
              type: ['restaurant']
          };

          service.nearbySearch(request, function(results, status) {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                  displayResults(results);
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
});

let currentCardIndex = 0;
const shortlist = [];

function displayResults(results) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';

  if (!results || results.length === 0) {
      resultsContainer.innerHTML = '<p>No restaurants found.</p>';
      return;
  }

  results.forEach((result) => {
      const card = document.createElement('div');
      card.className = 'card active card-enter';

      const request = {
          placeId: result.place_id,
          fields: ['name', 'vicinity', 'photos', 'reviews', 'rating']
      };

      const service = new google.maps.places.PlacesService(document.createElement('div'));
      service.getDetails(request, function(placeResult, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
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
          }
      });
  });
}

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
              currentCardIndex++;
              if (currentCardIndex < document.querySelectorAll('.card').length) {
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
}

// Toggle shortlist visibility
document.getElementById('toggle-shortlist').addEventListener('click', function() {
  const shortlistContainer = document.getElementById('shortlist');
  if (shortlistContainer.classList.contains('hidden')) {
      shortlistContainer.classList.remove('hidden');
      this.textContent = 'Hide Shortlist';
  } else {
      shortlistContainer.classList.add('hidden');
      this.textContent = 'Show Shortlist';
  }
});

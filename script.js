document.getElementById('find-restaurants').addEventListener('click', function() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const location = new google.maps.LatLng(lat, lng);

          // Create a Places service instance
          const service = new google.maps.places.PlacesService(document.createElement('div'));
          const request = {
              location: location,
              radius: '5000', // 5 km radius
              type: ['restaurant'] // Type of places to search
          };

          // Perform the nearby search
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

function displayResults(results) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';

  if (!results || results.length === 0) {
      resultsContainer.innerHTML = '<p>No restaurants found.</p>';
      return;
  }

  results.forEach((result, index) => {
      const card = document.createElement('div');
      card.className = 'card active';
      
      // Fetch details to include image, reviews, etc.
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

              // Handle swipe functionality
              handleSwipes(card);
          }
      });
  });
}

function handleSwipes(card) {
  let startX, startY, endX, endY;

  card.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
  });

  card.addEventListener('touchend', function(e) {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;

      const deltaX = endX - startX;
      const deltaY = endY - startY;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 100) {
          if (deltaX > 0) {
              card.classList.add('right');
          } else {
              card.classList.add('left');
          }
          setTimeout(() => card.remove(), 300); // Remove card after animation
      } else {
          card.classList.remove('active'); // Reset card position if swipe is not detected
      }
  });
}

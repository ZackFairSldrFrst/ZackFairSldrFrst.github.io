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
                  alert('Error fetching data. Please check console for details.');
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

  results.forEach(result => {
      const resultDiv = document.createElement('div');
      resultDiv.className = 'restaurant';
      resultDiv.innerHTML = `
          <h3><a href="${result.place_id}" target="_blank">${result.name}</a></h3>
          <p>${result.vicinity}</p>
      `;
      resultsContainer.appendChild(resultDiv);
  });
}

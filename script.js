document.getElementById('find-restaurants').addEventListener('click', function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        const apiKey = 'AIzaSyBLVKhhZwlSmeKUAQ8J9cQNbz0E7yichiA';
        const radius = 5000; // 5 km radius
  
        fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&key=${apiKey}`)
          .then(response => response.json())
          .then(data => {
            displayResults(data.results);
          })
          .catch(error => console.error('Error fetching data:', error));
      }, function(error) {
        console.error('Error getting location:', error);
        alert('Could not get your location. Please enable location services.');
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  });
  
  function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
  
    if (results.length === 0) {
      resultsContainer.innerHTML = '<p>No restaurants found.</p>';
      return;
    }
  
    results.forEach(restaurant => {
      const restaurantDiv = document.createElement('div');
      restaurantDiv.className = 'restaurant';
      restaurantDiv.innerHTML = `
        <h3>${restaurant.name}</h3>
        <p>${restaurant.vicinity}</p>
      `;
      resultsContainer.appendChild(restaurantDiv);
    });
  }
  
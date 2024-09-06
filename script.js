document.getElementById('find-restaurants').addEventListener('click', function() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Construct a search query using location data
          const query = `restaurants near ${lat},${lng}`;
          const cx = '11edd75b3cc154a50'; // Replace with your Custom Search Engine ID
          const apiKey = 'AIzaSyBLVKhhZwlSmeKUAQ8J9cQNbz0E7yichiA'; // Your Google Custom Search API Key

          // Encode the query parameter properly
          const encodedQuery = encodeURIComponent(query);

          // Fetch request to Google Custom Search Engine with API Key
          fetch(`https://www.googleapis.com/customsearch/v1?q=${encodedQuery}&cx=${cx}&key=${apiKey}`)
              .then(response => {
                  if (!response.ok) {
                      throw new Error(`HTTP error! status: ${response.status}`);
                  }
                  return response.json();
              })
              .then(data => {
                  console.log('API Response:', data); // Log the full response for debugging

                  if (data.items) {
                      displayResults(data.items);
                  } else {
                      console.error('No items found in the response:', data);
                      alert('No restaurants found.');
                  }
              })
              .catch(error => {
                  console.error('Error fetching data:', error);
                  alert('Error fetching data. Please check console for details.');
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
          <h3><a href="${result.link}" target="_blank">${result.title}</a></h3>
          <p>${result.snippet}</p>
      `;
      resultsContainer.appendChild(resultDiv);
  });
}

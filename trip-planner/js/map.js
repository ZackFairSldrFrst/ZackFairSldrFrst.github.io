let map;
let placesService;
let markers = [];

function initMap() {
    // Initialize the map centered on a default location
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 },
        zoom: 2,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    });

    // Initialize Places service
    placesService = new google.maps.places.PlacesService(map);

    // Try to get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setCenter(pos);
                map.setZoom(13);
            },
            () => {
                console.log('Error: The Geolocation service failed.');
            }
        );
    }

    // Set up search box
    const searchInput = document.getElementById('place-search');
    const searchBox = new google.maps.places.SearchBox(searchInput);

    searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();

        if (places.length === 0) return;

        // Clear existing markers
        clearMarkers();

        // For each place, get the icon, name and location.
        const bounds = new google.maps.LatLngBounds();
        
        places.forEach(place => {
            if (!place.geometry || !place.geometry.location) return;

            // Create a marker for the place
            addMarker(place);

            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });

        map.fitBounds(bounds);
        displayPlacesList(places);
    });
}

function addMarker(place) {
    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name
    });

    markers.push(marker);
}

function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

function displayPlacesList(places) {
    const placesList = document.getElementById('places-list');
    placesList.innerHTML = '';

    places.forEach(place => {
        const placeCard = document.createElement('div');
        placeCard.className = 'place-card';
        placeCard.innerHTML = `
            <h3>${place.name}</h3>
            <p>${place.formatted_address || ''}</p>
            <div class="place-actions">
                <button onclick="savePlace('${place.place_id}')">
                    <span class="material-icons">favorite_border</span>
                </button>
                <button onclick="addToTrip('${place.place_id}')">
                    <span class="material-icons">add_circle_outline</span>
                </button>
            </div>
        `;
        placesList.appendChild(placeCard);
    });
} 
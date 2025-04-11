// Store trips and saved places in localStorage for now
const storage = {
    trips: JSON.parse(localStorage.getItem('trips') || '[]'),
    savedPlaces: JSON.parse(localStorage.getItem('savedPlaces') || '[]')
};

function savePlace(placeId) {
    // First get the full place details
    const request = {
        placeId: placeId,
        fields: ['name', 'formatted_address', 'geometry', 'photos', 'rating']
    };

    placesService.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            const savedPlace = {
                id: placeId,
                name: place.name,
                address: place.formatted_address,
                location: {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                },
                rating: place.rating,
                photo: place.photos ? place.photos[0].getUrl() : null
            };

            storage.savedPlaces.push(savedPlace);
            localStorage.setItem('savedPlaces', JSON.stringify(storage.savedPlaces));
            
            // Show confirmation to user
            alert(`${place.name} has been saved!`);
        }
    });
}

function addToTrip(placeId) {
    // This is a placeholder for trip creation functionality
    alert('Trip creation feature coming soon!');
} 
// Main application logic
let currentView = 'explore';

// DOM Elements
const views = {
    explore: document.getElementById('explore-view'),
    trips: document.getElementById('trips-view'),
    saved: document.getElementById('saved-view')
};

const navButtons = document.querySelectorAll('.nav-btn');

// Navigation handling
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const viewName = button.dataset.view;
        switchView(viewName);
    });
});

function switchView(viewName) {
    // Update navigation buttons
    navButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    // Show selected view, hide others
    Object.entries(views).forEach(([name, element]) => {
        element.classList.toggle('hidden', name !== viewName);
    });

    currentView = viewName;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initial view
    switchView('explore');
}); 
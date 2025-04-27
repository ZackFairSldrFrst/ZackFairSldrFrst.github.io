document.addEventListener('DOMContentLoaded', function() {
    // Sample website data - in a real app, this would come from a database
    const websiteData = [
        {
            id: 1,
            name: "My Coffee Shop",
            url: "mycoffeeshop.1page.site",
            status: "published",
            thumbnail: "img/sample-site1.jpg",
            visits: 1245,
            lastUpdated: "2023-07-15"
        },
        {
            id: 2,
            name: "Fitness Studio",
            url: "fitnessstudio.1page.site",
            status: "published",
            thumbnail: "img/sample-site2.jpg",
            visits: 857,
            lastUpdated: "2023-08-02"
        },
        {
            id: 3,
            name: "Tech Blog",
            url: "techblog.1page.site",
            status: "draft",
            thumbnail: "img/sample-site3.jpg",
            visits: 0,
            lastUpdated: "2023-08-10"
        }
    ];

    // Populate websites grid
    const websitesGrid = document.querySelector('.websites-grid');
    if (websitesGrid) {
        // Remove loading placeholder if it exists
        const placeholder = websitesGrid.querySelector('.placeholder');
        if (placeholder) {
            websitesGrid.removeChild(placeholder);
        }

        // Add each website card
        websiteData.forEach(site => {
            const websiteCard = createWebsiteCard(site);
            websitesGrid.insertBefore(websiteCard, websitesGrid.querySelector('.website-card.add-new'));
        });
    }

    // Setup dropdown toggles
    const menuToggles = document.querySelectorAll('.menu-toggle');
    menuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.nextElementSibling;
            
            // Close all other dropdowns first
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdown) {
                    menu.style.display = 'none';
                }
            });
            
            // Toggle this dropdown
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            
            // Close when clicking outside
            document.addEventListener('click', function closeDropdown(event) {
                if (!toggle.contains(event.target) && !dropdown.contains(event.target)) {
                    dropdown.style.display = 'none';
                    document.removeEventListener('click', closeDropdown);
                }
            });
        });
    });

    // Setup counts for dashboard stats
    updateDashboardStats();

    // Setup event listeners for quick action buttons
    setupQuickActionListeners();
});

// Create website card element from data
function createWebsiteCard(site) {
    const card = document.createElement('div');
    card.className = 'website-card';
    card.innerHTML = `
        <div class="website-preview">
            <img src="${site.thumbnail}" alt="${site.name}">
            <div class="website-status ${site.status}">
                <i class="fas fa-${site.status === 'published' ? 'globe' : 'clock'}"></i>
                ${site.status === 'published' ? 'Published' : 'Draft'}
            </div>
        </div>
        <div class="website-info">
            <h3>${site.name}</h3>
            <p class="website-url">${site.url}</p>
            <div class="website-meta">
                <span><i class="fas fa-eye"></i> ${site.visits} visits</span>
                <span><i class="fas fa-clock"></i> Updated ${formatDate(site.lastUpdated)}</span>
            </div>
        </div>
        <div class="website-actions">
            <a href="editor.html?id=${site.id}" class="btn btn-primary btn-sm">Edit Site</a>
            <a href="https://${site.url}" target="_blank" class="btn btn-outline btn-sm">View Site</a>
            <button class="btn btn-icon menu-toggle">
                <i class="fas fa-ellipsis-v"></i>
            </button>
            <div class="dropdown-menu">
                <a href="#" class="dropdown-item">
                    <i class="fas fa-chart-bar"></i> Analytics
                </a>
                <a href="#" class="dropdown-item">
                    <i class="fas fa-cog"></i> Settings
                </a>
                <a href="#" class="dropdown-item">
                    <i class="fas fa-copy"></i> Duplicate
                </a>
                <a href="#" class="dropdown-item text-danger">
                    <i class="fas fa-trash-alt"></i> Delete
                </a>
            </div>
        </div>
    `;
    return card;
}

// Format date to relative time (e.g., "2 days ago")
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
        const months = Math.floor(diffDays / 30);
        return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
}

// Update dashboard statistics
function updateDashboardStats() {
    // Get stats elements
    const activeWebsites = document.querySelector('#active-websites');
    const monthlyVisitors = document.querySelector('#monthly-visitors');
    const daysActive = document.querySelector('#days-active');
    
    if (activeWebsites) {
        // Count published websites
        const publishedCount = document.querySelectorAll('.website-status.published').length;
        activeWebsites.textContent = publishedCount;
    }
    
    if (monthlyVisitors) {
        // Calculate total visits (in a real app, this would be from analytics)
        let totalVisits = 0;
        document.querySelectorAll('.website-meta span:first-child').forEach(span => {
            const visits = parseInt(span.textContent.match(/\d+/)[0]);
            totalVisits += visits;
        });
        monthlyVisitors.textContent = totalVisits.toLocaleString();
    }
    
    if (daysActive) {
        // For demo purposes, use a random number of days
        const randomDays = Math.floor(Math.random() * 90) + 30;
        daysActive.textContent = randomDays;
    }
}

// Setup event listeners for quick action buttons
function setupQuickActionListeners() {
    const quickActionButtons = document.querySelectorAll('.action-card .btn');
    
    quickActionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.closest('.action-card').querySelector('h3').textContent;
            alert(`Action "${action}" would be performed here.`);
        });
    });
    
    // New website button
    const addNewButton = document.querySelector('.website-card.add-new .btn');
    if (addNewButton) {
        addNewButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'ai-generator.html';
        });
    }
} 
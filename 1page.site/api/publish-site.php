<?php
// Headers for API response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // For development - restrict in production
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Define secure access constant to allow config file inclusion
define('SECURE_ACCESS', true);

// For debugging
error_log("Publish site request received");

// Check user authentication - temporarily bypassed for development
// In production, uncomment this
/*
session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authentication required']);
    exit;
}
*/

// Process incoming data
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Validate input
if (!$data || !isset($data['site_data']) || !isset($data['publish_path'])) {
    http_response_code(400);
    error_log("Invalid publish request data: " . print_r($data, true));
    echo json_encode(['success' => false, 'message' => 'Invalid request data']);
    exit;
}

try {
    // Extract site data
    $site_data = $data['site_data'];
    $template = $data['template'] ?? 'business';
    $publish_path = $data['publish_path'];
    
    // Get business info
    $business_name = htmlspecialchars($site_data['businessName'] ?? 'My Business');
    $business_description = htmlspecialchars($site_data['description'] ?? '');
    $headline = htmlspecialchars($site_data['headline'] ?? "Welcome to $business_name");
    $enhanced_description = htmlspecialchars($site_data['enhancedDescription'] ?? $business_description);
    
    // Get design info
    $colors = $site_data['colors'] ?? [
        'primary' => '#4a6cf7',
        'secondary' => '#f25f5c',
        'accent' => '#ffb347'
    ];
    
    // Create directory for published site
    $published_dir = __DIR__ . '/../published';
    if (!file_exists($published_dir)) {
        mkdir($published_dir, 0755, true);
    }
    
    // Create site directory
    $site_dir = $published_dir . '/' . $publish_path;
    if (!file_exists($site_dir)) {
        mkdir($site_dir, 0755, true);
    }
    
    // Generate the HTML content
    $html = generateHTML($site_data, $template);
    
    // Write the HTML file
    $index_file = $site_dir . '/index.html';
    file_put_contents($index_file, $html);
    
    // Create necessary directories
    $css_dir = $site_dir . '/css';
    $js_dir = $site_dir . '/js';
    $img_dir = $site_dir . '/img';
    
    if (!file_exists($css_dir)) mkdir($css_dir, 0755, true);
    if (!file_exists($js_dir)) mkdir($js_dir, 0755, true);
    if (!file_exists($img_dir)) mkdir($img_dir, 0755, true);
    
    // Copy CSS files
    copyFile('../css/styles.css', $css_dir . '/styles.css');
    
    // Create template CSS
    createTemplateCSS($css_dir . '/template.css', $colors);
    
    // Copy JS files
    copyFile('../js/main.js', $js_dir . '/main.js');
    
    // Copy placeholder images
    copyFile('../img/placeholder-hero.jpg', $img_dir . '/hero.jpg');
    copyFile('../img/placeholder-about.jpg', $img_dir . '/about.jpg');
    
    // Create a basic .htaccess file for the site
    createHTAccess($site_dir);
    
    // Return success
    echo json_encode([
        'success' => true,
        'url' => '1page.site/' . $publish_path,
        'message' => 'Site published successfully',
        'file_path' => $index_file
    ]);
    
} catch (Exception $e) {
    error_log("Publish error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Error publishing site: ' . $e->getMessage()
    ]);
}

// Helper function to generate HTML
function generateHTML($site_data, $template) {
    // Get business info
    $business_name = htmlspecialchars($site_data['businessName'] ?? 'My Business');
    $business_description = htmlspecialchars($site_data['description'] ?? '');
    $headline = htmlspecialchars($site_data['headline'] ?? "Welcome to $business_name");
    $enhanced_description = htmlspecialchars($site_data['enhancedDescription'] ?? $business_description);
    
    // Get contact info
    $contact = $site_data['contact'] ?? [];
    $phone = htmlspecialchars($contact['phone'] ?? '');
    $email = htmlspecialchars($contact['email'] ?? '');
    $address = htmlspecialchars($contact['address'] ?? '');
    $hours = htmlspecialchars($contact['hours'] ?? '');
    
    // Create HTML for benefits/features
    $benefits_html = '';
    if (isset($site_data['benefits']) && is_array($site_data['benefits'])) {
        foreach ($site_data['benefits'] as $benefit) {
            $benefit_title = htmlspecialchars($benefit['title'] ?? '');
            $benefit_desc = htmlspecialchars($benefit['description'] ?? '');
            
            $benefits_html .= <<<HTML
            <div class="benefit-card">
                <div class="benefit-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>{$benefit_title}</h3>
                <p>{$benefit_desc}</p>
            </div>
HTML;
        }
    }
    
    // Create HTML for services
    $services_html = '';
    if (isset($site_data['services']) && is_array($site_data['services'])) {
        foreach ($site_data['services'] as $service) {
            if (is_string($service)) {
                // Handle simple string services
                $service_html = htmlspecialchars($service);
                $services_html .= <<<HTML
                <div class="service-card">
                    <div class="service-icon">
                        <i class="fas fa-star"></i>
                    </div>
                    <h3>Service</h3>
                    <p>{$service_html}</p>
                </div>
HTML;
            }
        }
    }
    
    // If no services were added, create a placeholder
    if (empty($services_html)) {
        $services_html = <<<HTML
        <div class="service-card">
            <div class="service-icon">
                <i class="fas fa-star"></i>
            </div>
            <h3>Quality Service</h3>
            <p>We provide top-quality services to meet your needs.</p>
        </div>
        <div class="service-card">
            <div class="service-icon">
                <i class="fas fa-heart"></i>
            </div>
            <h3>Customer Satisfaction</h3>
            <p>Your satisfaction is our priority.</p>
        </div>
HTML;
    }
    
    // Build full HTML
    $html = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{$business_name}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css">
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/template.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="template-{$template}">
    <!-- Header Section -->
    <header>
        <div class="container">
            <div class="logo">
                <h1>{$business_name}</h1>
            </div>
            <nav>
                <ul class="nav-links">
                    <li><a href="#about">About</a></li>
                    <li><a href="#services">Services</a></li>
                    <li><a href="#benefits">Benefits</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
                <button class="hamburger" aria-label="Toggle menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </nav>
        </div>
    </header>
    
    <!-- Hero Section -->
    <section id="hero">
        <div class="container">
            <div class="hero-content">
                <h2>{$headline}</h2>
                <p>{$enhanced_description}</p>
                <div class="cta-buttons">
                    <a href="#contact" class="btn btn-primary">Contact Us</a>
                    <a href="#services" class="btn btn-outline">Our Services</a>
                </div>
            </div>
        </div>
    </section>
    
    <!-- About Section -->
    <section id="about">
        <div class="container">
            <h2>About Us</h2>
            <div class="about-content">
                <div class="about-text">
                    <p>{$business_description}</p>
                </div>
                <div class="about-image">
                    <img src="img/about.jpg" alt="About {$business_name}">
                </div>
            </div>
        </div>
    </section>
    
    <!-- Services Section -->
    <section id="services">
        <div class="container">
            <h2>Our Services</h2>
            <div class="services-grid">
                {$services_html}
            </div>
        </div>
    </section>
    
    <!-- Benefits Section -->
    <section id="benefits">
        <div class="container">
            <h2>Why Choose Us</h2>
            <div class="benefits-grid">
                {$benefits_html}
            </div>
        </div>
    </section>
    
    <!-- Contact Section -->
    <section id="contact">
        <div class="container">
            <h2>Contact Us</h2>
            <div class="contact-layout">
                <div class="contact-info">
                    <div class="contact-detail">
                        <i class="fas fa-phone"></i>
                        <p>{$phone}</p>
                    </div>
                    <div class="contact-detail">
                        <i class="fas fa-envelope"></i>
                        <p>{$email}</p>
                    </div>
                    <div class="contact-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <p>{$address}</p>
                    </div>
                    <div class="contact-detail">
                        <i class="fas fa-clock"></i>
                        <p>{$hours}</p>
                    </div>
                </div>
                
                <div class="contact-form">
                    <form id="contact-form">
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="message">Message</label>
                            <textarea id="message" name="message" rows="4" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-logo">
                    <h3>{$business_name}</h3>
                </div>
                <div class="footer-links">
                    <ul>
                        <li><a href="#about">About</a></li>
                        <li><a href="#services">Services</a></li>
                        <li><a href="#benefits">Benefits</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 {$business_name}. All rights reserved.</p>
                <p class="powered-by">Powered by <a href="https://1page.site" target="_blank">1page.site</a></p>
            </div>
        </div>
    </footer>
    
    <script src="js/main.js"></script>
</body>
</html>
HTML;

    return $html;
}

// Helper function to copy files
function copyFile($source, $destination) {
    $source_file = __DIR__ . '/' . $source;
    if (file_exists($source_file)) {
        copy($source_file, $destination);
    } else {
        // Create an empty file if source doesn't exist
        file_put_contents($destination, '/* Placeholder file */');
    }
}

// Helper function to create template CSS
function createTemplateCSS($target_file, $colors) {
    $primary_color = $colors['primary'] ?? '#4a6cf7';
    $secondary_color = $colors['secondary'] ?? '#f25f5c';
    $accent_color = $colors['accent'] ?? '#ffb347';
    
    $css = <<<CSS
:root {
    --primary-color: {$primary_color};
    --secondary-color: {$secondary_color};
    --accent-color: {$accent_color};
    --text-color: #333333;
    --light-color: #ffffff;
    --dark-color: #1a1a1a;
    --grey-color: #f5f5f5;
}

/* Reset some basic elements */
body, h1, h2, h3, p, ul, li {
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Poppins', sans-serif;
    line-height: 1.6;
    color: var(--text-color);
}

.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header Styles */
header {
    background-color: var(--light-color);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: fixed;
    width: 100%;
    z-index: 1000;
}

header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
}

.logo h1 {
    font-size: 1.8rem;
    color: var(--primary-color);
}

.nav-links {
    display: flex;
    list-style: none;
}

.nav-links li {
    margin-left: 30px;
}

.nav-links a {
    text-decoration: none;
    color: var(--text-color);
    font-weight: 500;
    transition: color 0.3s;
}

.nav-links a:hover {
    color: var(--primary-color);
}

.hamburger {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
}

.hamburger span {
    display: block;
    width: 25px;
    height: 3px;
    background-color: var(--text-color);
    margin: 5px 0;
    transition: transform 0.3s, opacity 0.3s;
}

/* Hero Section */
#hero {
    padding: 120px 0 60px;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    color: var(--light-color);
    text-align: center;
}

#hero h2 {
    font-size: 2.5rem;
    margin-bottom: 20px;
}

#hero p {
    font-size: 1.2rem;
    max-width: 800px;
    margin: 0 auto 30px;
}

.cta-buttons {
    display: flex;
    justify-content: center;
    gap: 15px;
}

.btn {
    display: inline-block;
    padding: 12px 24px;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s;
    cursor: pointer;
}

.btn-primary {
    background-color: var(--accent-color);
    color: var(--dark-color);
    border: 2px solid var(--accent-color);
}

.btn-outline {
    background-color: transparent;
    color: var(--light-color);
    border: 2px solid var(--light-color);
}

.btn-primary:hover {
    background-color: transparent;
    color: var(--accent-color);
}

.btn-outline:hover {
    background-color: var(--light-color);
    color: var(--primary-color);
}

/* About Section */
#about {
    padding: 80px 0;
    background-color: var(--light-color);
}

#about h2, #services h2, #benefits h2, #contact h2 {
    text-align: center;
    margin-bottom: 40px;
    color: var(--primary-color);
    font-size: 2rem;
}

.about-content {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 30px;
}

.about-text {
    flex: 1;
    min-width: 300px;
}

.about-image {
    flex: 1;
    min-width: 300px;
}

.about-image img {
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* Services Section */
#services {
    padding: 80px 0;
    background-color: var(--grey-color);
}

.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
}

.service-card {
    background-color: var(--light-color);
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s;
}

.service-card:hover {
    transform: translateY(-5px);
}

.service-icon {
    margin-bottom: 20px;
    font-size: 2rem;
    color: var(--primary-color);
}

.service-card h3 {
    margin-bottom: 15px;
    color: var(--primary-color);
}

/* Benefits Section */
#benefits {
    padding: 80px 0;
    background-color: var(--light-color);
}

.benefits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
}

.benefit-card {
    background-color: var(--grey-color);
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.benefit-icon {
    margin-bottom: 20px;
    font-size: 2rem;
    color: var(--accent-color);
}

.benefit-card h3 {
    margin-bottom: 15px;
    color: var(--primary-color);
}

/* Contact Section */
#contact {
    padding: 80px 0;
    background-color: var(--grey-color);
}

.contact-layout {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
}

.contact-info, .contact-form {
    flex: 1;
    min-width: 300px;
}

.contact-detail {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.contact-detail i {
    font-size: 1.5rem;
    color: var(--primary-color);
    margin-right: 15px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
}

.form-group input, .form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: inherit;
}

/* Footer */
footer {
    background-color: var(--dark-color);
    color: var(--light-color);
    padding: 60px 0 20px;
}

.footer-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 40px;
}

.footer-logo h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
}

.footer-links ul {
    list-style: none;
}

.footer-links li {
    margin-bottom: 10px;
}

.footer-links a {
    color: var(--light-color);
    text-decoration: none;
    transition: color 0.3s;
}

.footer-links a:hover {
    color: var(--accent-color);
}

.footer-bottom {
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.powered-by {
    font-size: 0.9rem;
    margin-top: 10px;
    opacity: 0.7;
}

.powered-by a {
    color: var(--accent-color);
    text-decoration: none;
}

/* Responsive Styles */
@media (max-width: 768px) {
    .hamburger {
        display: block;
    }
    
    .nav-links {
        display: none;
        position: absolute;
        top: 70px;
        left: 0;
        right: 0;
        background-color: var(--light-color);
        flex-direction: column;
        padding: 20px;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    }
    
    .nav-links.active {
        display: flex;
    }
    
    .nav-links li {
        margin: 10px 0;
    }
    
    #hero {
        padding: 100px 0 50px;
    }
    
    #hero h2 {
        font-size: 2rem;
    }
}

@media (max-width: 480px) {
    .cta-buttons {
        flex-direction: column;
        gap: 10px;
    }
    
    #hero h2 {
        font-size: 1.8rem;
    }
}
CSS;

    file_put_contents($target_file, $css);
}

// Helper function to create .htaccess file
function createHTAccess($site_dir) {
    $htaccess = <<<HTACCESS
# Enable rewriting
RewriteEngine On

# Handle 404 errors
ErrorDocument 404 /index.html

# Prevent directory listing
Options -Indexes

# Security headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-XSS-Protection "1; mode=block"
    Header set X-Frame-Options "SAMEORIGIN"
</IfModule>

# Caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType text/x-javascript "access plus 1 month"
    ExpiresByType text/html "access plus 1 day"
    ExpiresDefault "access plus 2 days"
</IfModule>
HTACCESS;

    file_put_contents($site_dir . '/.htaccess', $htaccess);
}
?> 
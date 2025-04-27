document.addEventListener('DOMContentLoaded', function() {
    // Form step navigation
    const form = document.getElementById('ai-generator-form');
    const steps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    
    // Preview device controls
    const deviceButtons = document.querySelectorAll('.preview-device-btn');
    const previewIframe = document.getElementById('preview-iframe');
    
    // File upload UI
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    // Site data storage (would connect to backend in production)
    let generatedSiteData = {
        template: '',
        businessName: '',
        category: '',
        description: '',
        colors: {
            primary: '#4a6cf7',
            secondary: '#f25f5c'
        },
        contact: {},
        logo: null,
        images: [],
        sections: [],
        features: [],
        published: false,
        domain: '',
        lastEdited: null
    };
    
    // Next button event listeners
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get current active step
            const activeStep = document.querySelector('.form-step.active');
            const currentIndex = Array.from(steps).indexOf(activeStep);
            
            // Basic validation
            const inputs = activeStep.querySelectorAll('input[required], select[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    
                    // Remove error class on input
                    input.addEventListener('input', function() {
                        if (input.value.trim()) {
                            input.classList.remove('error');
                        }
                    }, { once: true });
                }
            });
            
            if (!isValid) return;
            
            // Save form data at each step
            collectFormData(currentIndex);
            
            // Hide current step
            activeStep.classList.remove('active');
            
            // Show next step
            steps[currentIndex + 1].classList.add('active');
            
            // Simulate progress for demo purposes
            if (currentIndex === 2) {
                simulateFormProgress();
            }
            
            // Scroll to top of form
            form.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Collect form data at each step
    function collectFormData(stepIndex) {
        switch(stepIndex) {
            case 0: // Business Information
                generatedSiteData.businessName = document.getElementById('business-name').value;
                generatedSiteData.category = document.getElementById('business-category').value;
                generatedSiteData.description = document.getElementById('business-description').value;
                generatedSiteData.template = generatedSiteData.category || 'food';
                break;
                
            case 1: // Contact & Location
                generatedSiteData.contact = {
                    phone: document.getElementById('business-phone').value,
                    email: document.getElementById('business-email').value,
                    address: document.getElementById('business-address').value,
                    hours: document.getElementById('business-hours').value
                };
                break;
                
            case 2: // Visual Assets
                if (!document.getElementById('auto-color').checked) {
                    generatedSiteData.colors = {
                        primary: document.getElementById('primary-color').value,
                        secondary: document.getElementById('secondary-color').value
                    };
                }
                // Note: In a real implementation, we'd process file uploads here
                break;
                
            case 3: // Additional Information
                generatedSiteData.services = document.getElementById('services-products').value;
                generatedSiteData.additionalNotes = document.getElementById('additional-notes').value;
                
                // Collect checked features
                generatedSiteData.features = [];
                document.querySelectorAll('#step-4 .form-check input[type="checkbox"]:checked').forEach(checkbox => {
                    generatedSiteData.features.push(checkbox.id.replace('feature-', ''));
                });
                break;
        }
        
        // Save to localStorage for demo purposes
        localStorage.setItem('generatedSiteData', JSON.stringify(generatedSiteData));
    }
    
    // Previous button event listeners
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get current active step
            const activeStep = document.querySelector('.form-step.active');
            const currentIndex = Array.from(steps).indexOf(activeStep);
            
            // Hide current step
            activeStep.classList.remove('active');
            
            // Show previous step
            steps[currentIndex - 1].classList.add('active');
            
            // Scroll to top of form
            form.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Device preview buttons
    deviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            deviceButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update preview based on device
            const device = this.dataset.device;
            
            switch(device) {
                case 'desktop':
                    previewIframe.style.width = '100%';
                    break;
                case 'tablet':
                    previewIframe.style.width = '768px';
                    break;
                case 'mobile':
                    previewIframe.style.width = '375px';
                    break;
            }
        });
    });
    
    // File upload UI
    fileInputs.forEach(input => {
        const fileInfo = input.parentElement.querySelector('.file-info');
        
        input.addEventListener('change', function() {
            if (this.files.length === 0) {
                fileInfo.textContent = 'No file chosen';
                return;
            }
            
            if (this.files.length === 1) {
                fileInfo.textContent = this.files[0].name;
            } else {
                fileInfo.textContent = `${this.files.length} files selected`;
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect data from final step
        collectFormData(3);
        
        // Show processing UI
        const generatorDemo = document.querySelector('.generator-demo');
        const processingUI = document.querySelector('.ai-generation-process');
        const resultActions = document.querySelector('.generated-website-actions');
        
        generatorDemo.style.display = 'none';
        processingUI.style.display = 'block';
        
        // Simulate AI processing
        simulateAIProcessing();
    });
    
    // For demonstration purposes: simulate progress in form preview
    function simulateFormProgress() {
        const businessName = document.getElementById('business-name').value || 'Your Business';
        const category = document.getElementById('business-category').value || 'food';
        
        // Show simple placeholder preview after 1 second
        setTimeout(() => {
            const previewPlaceholder = document.querySelector('.preview-placeholder');
            const previewFrame = document.querySelector('.preview-frame');
            
            if (previewPlaceholder && previewFrame) {
                previewPlaceholder.style.display = 'none';
                previewFrame.style.display = 'flex';
                
                // Create placeholder content
                const iframe = document.getElementById('preview-iframe');
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                
                // Get the primary color from the form or use default
                const primaryColor = document.getElementById('auto-color').checked 
                    ? '#4a6cf7' 
                    : document.getElementById('primary-color').value;
                
                iframeDoc.open();
                iframeDoc.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { 
                                font-family: 'Poppins', sans-serif; 
                                margin: 0; 
                                padding: 0;
                                color: #333;
                            }
                            header {
                                background-color: ${primaryColor};
                                color: white;
                                padding: 20px;
                                text-align: center;
                            }
                            .content {
                                padding: 20px;
                                text-align: center;
                            }
                            .placeholder {
                                background-color: #f0f4ff;
                                border-radius: 8px;
                                height: 150px;
                                margin: 20px 0;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: ${primaryColor};
                            }
                            .description {
                                max-width: 600px;
                                margin: 0 auto 30px auto;
                                line-height: 1.6;
                            }
                        </style>
                    </head>
                    <body>
                        <header>
                            <h1>${businessName}</h1>
                            <p>Preliminary Layout Preview</p>
                        </header>
                        <div class="content">
                            <p class="description">${document.getElementById('business-description').value || 'Your business description will appear here.'}</p>
                            <div class="placeholder">Hero Image Area</div>
                            <div class="placeholder">About Section</div>
                            <div class="placeholder">Services/Products Section</div>
                            <div class="placeholder">Contact Section</div>
                        </div>
                    </body>
                    </html>
                `);
                iframeDoc.close();
            }
        }, 1000);
    }
    
    // Simulate AI processing for demonstration
    function simulateAIProcessing() {
        const processSteps = document.querySelectorAll('.process-step');
        const progressBar = document.querySelector('.progress');
        const progressText = document.querySelector('.progress-text');
        const processingUI = document.querySelector('.ai-generation-process');
        const resultActions = document.querySelector('.generated-website-actions');
        
        let currentStep = 0;
        const totalSteps = processSteps.length;
        
        const interval = setInterval(() => {
            // Update current step status
            if (currentStep > 0) {
                processSteps[currentStep - 1].querySelector('i').classList.remove('fa-spinner', 'fa-spin');
                processSteps[currentStep - 1].querySelector('i').classList.add('fa-check-circle');
            }
            
            // If all steps complete
            if (currentStep >= totalSteps) {
                clearInterval(interval);
                
                // Generate the final preview
                generateFinalPreview();
                
                // Show final actions after 1 second
                setTimeout(() => {
                    processingUI.style.display = 'none';
                    resultActions.style.display = 'block';
                    
                    // Setup action buttons
                    setupActionButtons();
                    
                    // Scroll to results
                    resultActions.scrollIntoView({ behavior: 'smooth' });
                }, 1000);
                
                return;
            }
            
            // Update next step
            processSteps[currentStep].classList.add('active');
            processSteps[currentStep].querySelector('i').classList.remove('fa-clock');
            processSteps[currentStep].querySelector('i').classList.add('fa-spinner', 'fa-spin');
            
            // Update progress bar
            const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
            progressBar.style.width = `${progressPercentage}%`;
            progressText.textContent = `${Math.round(progressPercentage)}% Complete`;
            
            currentStep++;
        }, 2000); // Each step takes 2 seconds for demonstration
    }
    
    // Generate final preview with all collected data
    function generateFinalPreview() {
        // In a real implementation, this would call to the server
        // to generate the final website. For demo, we'll create a more 
        // complete preview based on the template selected
        
        const data = JSON.parse(localStorage.getItem('generatedSiteData'));
        const template = data.template || 'food';
        
        // Generate a path format URL based on business name
        const randomId = Math.random().toString(36).substring(2, 5);
        data.domain = `1page.site/${data.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${randomId}`;
        localStorage.setItem('generatedSiteData', JSON.stringify(data));
        
        // For a real implementation, we'd redirect to the template with the data
        // or build it dynamically server-side
    }
    
    // Setup action buttons for the final step
    function setupActionButtons() {
        const data = JSON.parse(localStorage.getItem('generatedSiteData'));
        const publishBtn = document.querySelector('.generated-website-actions .btn-primary');
        const adjustBtn = document.querySelector('.generated-website-actions .btn-outline');
        const downloadBtn = document.querySelector('.generated-website-actions .btn-outline:last-child');
        
        // Update publish button
        publishBtn.textContent = data.published ? 'View Live Website' : 'Publish Website';
        publishBtn.href = data.published ? `//${data.domain}` : '#publish-modal';
        
        if (!data.published) {
            publishBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showPublishModal();
            });
        }
        
        // Setup adjustment button
        adjustBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = `editor.html?site=${encodeURIComponent(data.domain)}`;
        });
        
        // Setup download button
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            simulateDownload();
        });
    }
    
    // Show publish modal
    function showPublishModal() {
        // Create publish modal if it doesn't exist
        if (!document.getElementById('publish-modal')) {
            const data = JSON.parse(localStorage.getItem('generatedSiteData'));
            const modal = document.createElement('div');
            modal.id = 'publish-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>Publish Your Single-Page Website</h2>
                    <p>Your website is ready to go live! Choose your domain option:</p>
                    
                    <div class="domain-options">
                        <div class="domain-option">
                            <input type="radio" id="subdomain" name="domain-type" checked>
                            <label for="subdomain">
                                <strong>Default URL</strong>
                                <div class="domain-preview">${data.domain}</div>
                                <p>Included with your plan</p>
                            </label>
                        </div>
                        
                        <div class="domain-option">
                            <input type="radio" id="custom-domain" name="domain-type">
                            <label for="custom-domain">
                                <strong>Custom Domain</strong>
                                <div class="domain-input-container">
                                    <input type="text" id="custom-domain-input" placeholder="yourbusiness.com">
                                </div>
                                <p>Already have a domain? Use it with your site.</p>
                            </label>
                        </div>
                    </div>
                    
                    <div class="publish-actions">
                        <button id="complete-publish" class="btn btn-primary">Publish Now</button>
                        <button class="btn btn-outline modal-cancel">Cancel</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Modal interactions
            document.querySelector('#publish-modal .close').addEventListener('click', closeModal);
            document.querySelector('#publish-modal .modal-cancel').addEventListener('click', closeModal);
            document.querySelector('#complete-publish').addEventListener('click', completePublish);
            
            // Domain type toggle
            document.getElementById('subdomain').addEventListener('change', toggleDomainInput);
            document.getElementById('custom-domain').addEventListener('change', toggleDomainInput);
        }
        
        // Show the modal
        document.getElementById('publish-modal').style.display = 'flex';
    }
    
    function closeModal() {
        document.getElementById('publish-modal').style.display = 'none';
    }
    
    function toggleDomainInput() {
        const customInput = document.getElementById('custom-domain-input');
        customInput.disabled = document.getElementById('subdomain').checked;
        customInput.parentElement.style.opacity = document.getElementById('subdomain').checked ? 0.5 : 1;
    }
    
    function completePublish() {
        // Show publishing spinner
        const publishBtn = document.getElementById('complete-publish');
        const originalText = publishBtn.textContent;
        publishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing...';
        publishBtn.disabled = true;
        
        // Get site data
        const data = JSON.parse(localStorage.getItem('generatedSiteData'));
        
        // Check if using custom domain
        if (document.getElementById('custom-domain').checked) {
            const customDomain = document.getElementById('custom-domain-input').value.trim();
            if (customDomain) {
                data.domain = customDomain;
            }
        }
        
        // In a real implementation with Hostinger, we would:
        // 1. Generate the static HTML file based on the template and user data
        // 2. Upload it to the appropriate directory on the server
        // 3. Configure any needed DNS settings for custom domains
        
        // Simulate this process with AJAX call to a server endpoint
        const publishData = {
            siteData: data,
            template: data.template || 'food',
            publishPath: data.domain.replace('1page.site/', '')
        };
        
        // This would be a real AJAX call in production
        simulateServerPublish(publishData)
            .then(response => {
                // Update site data
                data.published = true;
                data.publishDate = new Date().toISOString();
                data.publishedUrl = response.url || data.domain;
                localStorage.setItem('generatedSiteData', JSON.stringify(data));
                
                // Close modal
                closeModal();
                
                // Show success message
                showPublishSuccess(data.domain);
                
                // Update publish button
                const mainPublishBtn = document.querySelector('.generated-website-actions .btn-primary');
                mainPublishBtn.textContent = 'View Live Website';
                mainPublishBtn.href = `//${data.domain}`;
                
                // Remove the click event handler
                const newPublishBtn = mainPublishBtn.cloneNode(true);
                mainPublishBtn.parentNode.replaceChild(newPublishBtn, mainPublishBtn);
            })
            .catch(error => {
                // Show error message
                publishBtn.innerHTML = originalText;
                publishBtn.disabled = false;
                alert('Publishing failed: ' + (error.message || 'Unknown error'));
            });
    }
    
    // Simulate the server-side publishing process
    // In a real implementation, this would be an actual AJAX call to a server endpoint
    function simulateServerPublish(publishData) {
        return new Promise((resolve, reject) => {
            // Create FormData for file uploads
            const formData = new FormData();
            formData.append('siteData', JSON.stringify(publishData.siteData));
            formData.append('template', publishData.template);
            formData.append('publishPath', publishData.publishPath);
            
            // In production, this would be a real AJAX call to the server
            // Example AJAX implementation:
            /*
            fetch('/api/publish-site', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    resolve(data);
                } else {
                    reject(data);
                }
            })
            .catch(error => {
                reject({ success: false, message: 'Network error' });
            });
            */
            
            // For demonstration, we'll simulate the server response
            setTimeout(() => {
                try {
                    // This simulates what would happen server-side on Hostinger
                    resolve({
                        success: true,
                        url: publishData.siteData.domain,
                        message: 'Site published successfully'
                    });
                } catch (error) {
                    reject({
                        success: false,
                        message: error.message || 'Error publishing site'
                    });
                }
            }, 3000);
        });
    }
    
    // This function would generate the actual HTML content for the published site
    // In a real implementation, this would be done server-side with proper templating
    function generateSiteHTML(publishData) {
        const { siteData, template } = publishData;
        
        // This is a simplified example - in reality, you would use a proper templating system
        // and include all the necessary CSS and JavaScript files
        
        let htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${siteData.businessName}</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css">
                <link rel="stylesheet" href="/css/styles.css">
                <link rel="stylesheet" href="/css/${template}-template.css">
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            </head>
            <body class="template-${template}">
                <!-- Header Section -->
                <header>
                    <div class="container">
                        <div class="logo">
                            <h1>${siteData.businessName}</h1>
                        </div>
                        <nav>
                            <ul class="nav-links">
                                <li><a href="#about">About</a></li>
                                <li><a href="#services">Services</a></li>
                                <li><a href="#gallery">Gallery</a></li>
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
                            <h2>Welcome to ${siteData.businessName}</h2>
                            <p>${siteData.description || 'Description would appear here'}</p>
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
                        <p>${siteData.description || 'About content would appear here'}</p>
                    </div>
                </section>
                
                <!-- Services Section -->
                <section id="services">
                    <div class="container">
                        <h2>Our Services</h2>
                        <div class="services-grid">
                            ${generateServicesHTML(siteData)}
                        </div>
                    </div>
                </section>
                
                <!-- Contact Section -->
                <section id="contact">
                    <div class="container">
                        <h2>Contact Us</h2>
                        <div class="contact-info">
                            ${siteData.contact ? `
                                <div class="contact-detail">
                                    <i class="fas fa-phone"></i>
                                    <p>${siteData.contact.phone || 'Phone number'}</p>
                                </div>
                                <div class="contact-detail">
                                    <i class="fas fa-envelope"></i>
                                    <p>${siteData.contact.email || 'Email address'}</p>
                                </div>
                                <div class="contact-detail">
                                    <i class="fas fa-map-marker-alt"></i>
                                    <p>${siteData.contact.address || 'Address'}</p>
                                </div>
                                <div class="contact-detail">
                                    <i class="fas fa-clock"></i>
                                    <p>${siteData.contact.hours || 'Business hours'}</p>
                                </div>
                            ` : 'Contact information would appear here'}
                        </div>
                        
                        <div class="contact-form">
                            <form>
                                <div class="form-group">
                                    <label for="name">Name</label>
                                    <input type="text" id="name" required>
                                </div>
                                <div class="form-group">
                                    <label for="email">Email</label>
                                    <input type="email" id="email" required>
                                </div>
                                <div class="form-group">
                                    <label for="message">Message</label>
                                    <textarea id="message" rows="4" required></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary">Send Message</button>
                            </form>
                        </div>
                    </div>
                </section>
                
                <!-- Footer -->
                <footer>
                    <div class="container">
                        <div class="footer-content">
                            <div class="footer-logo">
                                <h3>${siteData.businessName}</h3>
                            </div>
                            <div class="footer-links">
                                <ul>
                                    <li><a href="#about">About</a></li>
                                    <li><a href="#services">Services</a></li>
                                    <li><a href="#gallery">Gallery</a></li>
                                    <li><a href="#contact">Contact</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="footer-bottom">
                            <p>&copy; ${new Date().getFullYear()} ${siteData.businessName}. All rights reserved.</p>
                            <p class="powered-by">Powered by <a href="https://1page.site" target="_blank">1page.site</a></p>
                        </div>
                    </div>
                </footer>
                
                <script src="/js/main.js"></script>
                <script src="/js/${template}-template.js"></script>
            </body>
            </html>
        `;
        
        return htmlContent;
    }
    
    // Helper function to generate HTML for services
    function generateServicesHTML(siteData) {
        if (!siteData.services) {
            return '<p>Services content would appear here</p>';
        }
        
        // Simple parsing of service items - assumes format like "Service Name: Description"
        const serviceItems = siteData.services.split('\n').filter(item => item.trim() !== '');
        
        if (serviceItems.length === 0) {
            return '<p>Services content would appear here</p>';
        }
        
        let servicesHTML = '';
        serviceItems.forEach((item, index) => {
            let serviceName = `Service ${index + 1}`;
            let serviceDesc = item;
            
            // Try to extract name: description format
            const colonPos = item.indexOf(':');
            if (colonPos > 0) {
                serviceName = item.substring(0, colonPos).trim();
                serviceDesc = item.substring(colonPos + 1).trim();
            }
            
            servicesHTML += `
                <div class="service-card">
                    <div class="service-icon">
                        <i class="fas fa-star"></i>
                    </div>
                    <h3>${serviceName}</h3>
                    <p>${serviceDesc}</p>
                </div>
            `;
        });
        
        return servicesHTML;
    }
    
    function showPublishSuccess(domain) {
        const successDiv = document.createElement('div');
        successDiv.className = 'publish-success';
        successDiv.innerHTML = `
            <div class="success-icon"><i class="fas fa-check-circle"></i></div>
            <h3>Single-Page Website Published Successfully!</h3>
            <p>Your website is now live at <a href="//${domain}" target="_blank">${domain}</a></p>
            <button class="btn btn-outline dismiss-success">Dismiss</button>
        `;
        
        document.querySelector('.generated-website-actions').appendChild(successDiv);
        
        // Dismiss button
        document.querySelector('.dismiss-success').addEventListener('click', function() {
            successDiv.remove();
        });
    }
    
    function simulateDownload() {
        // In a real implementation, this would generate a zip file with the website files
        // For the demo, we'll just show a message
        
        // Create download modal
        const modal = document.createElement('div');
        modal.id = 'download-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Download Your Website</h2>
                <div class="download-progress">
                    <div class="progress-bar">
                        <div class="progress" style="width: 0%"></div>
                    </div>
                    <p class="progress-text">Preparing files...</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Show the modal
        modal.style.display = 'flex';
        
        // Close button
        document.querySelector('#download-modal .close').addEventListener('click', function() {
            modal.remove();
        });
        
        // Simulate download progress
        const progressBar = document.querySelector('#download-modal .progress');
        const progressText = document.querySelector('#download-modal .progress-text');
        let progress = 0;
        
        const interval = setInterval(() => {
            progress += 10;
            progressBar.style.width = `${progress}%`;
            
            if (progress < 50) {
                progressText.textContent = 'Generating HTML and CSS...';
            } else if (progress < 80) {
                progressText.textContent = 'Optimizing images...';
            } else {
                progressText.textContent = 'Finalizing download...';
            }
            
            if (progress >= 100) {
                clearInterval(interval);
                progressText.textContent = 'Download ready!';
                
                // Change modal content
                setTimeout(() => {
                    document.querySelector('#download-modal .modal-content').innerHTML = `
                        <span class="close">&times;</span>
                        <h2>Download Complete</h2>
                        <p>Your website files have been downloaded. The zip file contains all HTML, CSS, JavaScript, and image files needed to host your site anywhere.</p>
                        <div class="download-info">
                            <div class="file-info">
                                <i class="fas fa-file-archive"></i>
                                <span>website-files.zip (2.4MB)</span>
                            </div>
                        </div>
                        <div class="modal-actions">
                            <button class="btn btn-outline modal-close">Close</button>
                        </div>
                    `;
                    
                    // Close button
                    document.querySelector('#download-modal .close').addEventListener('click', function() {
                        modal.remove();
                    });
                    
                    document.querySelector('#download-modal .modal-close').addEventListener('click', function() {
                        modal.remove();
                    });
                }, 1000);
            }
        }, 300);
    }
    
    // Color picker toggle for auto/manual
    const autoColorCheckbox = document.getElementById('auto-color');
    const colorPickers = document.querySelectorAll('input[type="color"]');
    
    autoColorCheckbox.addEventListener('change', function() {
        colorPickers.forEach(picker => {
            picker.disabled = this.checked;
            picker.parentElement.style.opacity = this.checked ? '0.5' : '1';
        });
    });
    
    // Initialize color pickers state
    colorPickers.forEach(picker => {
        picker.disabled = autoColorCheckbox.checked;
        picker.parentElement.style.opacity = autoColorCheckbox.checked ? '0.5' : '1';
    });

    // This is just a demonstration of how the AI enhancement would be triggered
    // The actual API key handling happens securely server-side
    function enhanceWithAI(publishData) {
        // Show AI processing UI
        showAIProcessingUI();
        
        // Create data for AI enhancement request
        const enhancementData = {
            businessType: publishData.siteData.category,
            businessName: publishData.siteData.businessName,
            businessDescription: publishData.siteData.description,
            services: publishData.siteData.services,
            template: publishData.template
        };
        
        // Make request to your secure backend API
        // IMPORTANT: API keys are never used client-side
        fetch('/api/ai-enhance.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(enhancementData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update the preview with AI-enhanced content
                updatePreviewWithEnhancedContent(data.enhancedContent);
                showAISuccessMessage();
            } else {
                showAIErrorMessage(data.message);
            }
        })
        .catch(error => {
            console.error('AI enhancement error:', error);
            showAIErrorMessage('Failed to enhance content');
        })
        .finally(() => {
            hideAIProcessingUI();
        });
    }

    // Add this to the UI enhancement section of the code where applicable
    function updatePreviewWithEnhancedContent(enhancedContent) {
        // Get the preview iframe
        const previewIframe = document.getElementById('preview-iframe');
        if (!previewIframe) return;
        
        // Get the iframe document
        const iframeDoc = previewIframe.contentDocument || previewIframe.contentWindow.document;
        
        // Update headline
        if (enhancedContent.content.headline) {
            const headline = iframeDoc.querySelector('h2');
            if (headline) headline.textContent = enhancedContent.content.headline;
        }
        
        // Update subheadline
        if (enhancedContent.content.subheadline) {
            const subheadline = iframeDoc.querySelector('.hero-content p');
            if (subheadline) subheadline.textContent = enhancedContent.content.subheadline;
        }
        
        // Update about section
        if (enhancedContent.content.about) {
            const aboutSection = iframeDoc.querySelector('#about p');
            if (aboutSection) aboutSection.textContent = enhancedContent.content.about;
        }
        
        // Update services
        if (enhancedContent.content.services && enhancedContent.content.services.length) {
            const servicesContainer = iframeDoc.querySelector('.services-grid');
            if (servicesContainer) {
                servicesContainer.innerHTML = '';
                
                enhancedContent.content.services.forEach(service => {
                    const serviceCard = document.createElement('div');
                    serviceCard.className = 'service-card';
                    serviceCard.innerHTML = `
                        <div class="service-icon">
                            <i class="fas fa-star"></i>
                        </div>
                        <h3>${service.title}</h3>
                        <p>${service.description}</p>
                    `;
                    servicesContainer.appendChild(serviceCard);
                });
            }
        }
        
        // Update design if available
        if (enhancedContent.design) {
            if (enhancedContent.design.colors) {
                // Apply color scheme
                const root = iframeDoc.documentElement;
                if (enhancedContent.design.colors.primary) {
                    root.style.setProperty('--primary-color', enhancedContent.design.colors.primary);
                }
                if (enhancedContent.design.colors.secondary) {
                    root.style.setProperty('--secondary-color', enhancedContent.design.colors.secondary);
                }
                if (enhancedContent.design.colors.accent) {
                    root.style.setProperty('--accent-color', enhancedContent.design.colors.accent);
                }
            }
        }
    }

    // Helper UI functions
    function showAIProcessingUI() {
        // Show AI processing indicator in the UI
        const aiProcessingElement = document.querySelector('.ai-processing');
        if (aiProcessingElement) {
            aiProcessingElement.style.display = 'block';
        }
    }

    function hideAIProcessingUI() {
        // Hide AI processing indicator
        const aiProcessingElement = document.querySelector('.ai-processing');
        if (aiProcessingElement) {
            aiProcessingElement.style.display = 'none';
        }
    }

    function showAISuccessMessage() {
        // Display success message for AI enhancement
        alert('AI has enhanced your website content and design!');
    }

    function showAIErrorMessage(message) {
        // Display error message for AI enhancement
        alert('AI enhancement error: ' + message);
    }
}); 

/*
 * HOSTINGER IMPLEMENTATION GUIDE
 * 
 * To implement the publishing functionality on Hostinger, follow these steps:
 *
 * 1. DIRECTORY STRUCTURE
 *    /public_html/            - Main site files (index.html, etc.)
 *    /public_html/css/        - Global CSS files
 *    /public_html/js/         - Global JS files  
 *    /public_html/templates/  - HTML templates for each vertical
 *    /public_html/published/  - Contains all the published sites
 *      /public_html/published/coffee-shop-abc/
 *      /public_html/published/fitness-studio-xyz/
 *      /public_html/published/etc...
 *    /public_html/api/        - Server-side scripts (PHP)
 *
 * 2. HTACCESS CONFIGURATION
 *    Create an .htaccess file in the root directory with the following content:
 *
 *    # Enable URL rewriting
 *    RewriteEngine On
 *    
 *    # Handle path-based URLs (1page.site/site-name)
 *    # Skip API requests and assets
 *    RewriteCond %{REQUEST_URI} !^/(css|js|img|images|api|templates|admin)/
 *    RewriteCond %{REQUEST_URI} !^/index.html
 *    RewriteCond %{REQUEST_URI} !^/dashboard.html
 *    RewriteCond %{REQUEST_URI} !^/editor.html
 *    RewriteCond %{REQUEST_URI} !^/ai-generator.html
 *    RewriteCond %{REQUEST_URI} !^/published/
 *    
 *    # Redirect all other requests to the published site directory
 *    RewriteRule ^([a-zA-Z0-9\-]+)/?$ /published/$1/index.html [L]
 *    RewriteRule ^([a-zA-Z0-9\-]+)/(.*)$ /published/$1/$2 [L]
 *
 * 3. PHP SERVER-SIDE IMPLEMENTATION
 *    Create a file at /public_html/api/publish-site.php:
 *
 *    <?php
 *    // Headers for API response
 *    header('Content-Type: application/json');
 *    
 *    // Verify user is authenticated (implement your authentication logic)
 *    session_start();
 *    if (!isset($_SESSION['user_id'])) {
 *        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
 *        exit;
 *    }
 *    
 *    // Get post data
 *    $siteData = json_decode($_POST['siteData'], true);
 *    $template = $_POST['template'];
 *    $publishPath = $_POST['publishPath'];
 *    
 *    // Validate publish path (alphanumeric, dashes only)
 *    if (!preg_match('/^[a-z0-9\-]+$/', $publishPath)) {
 *        echo json_encode(['success' => false, 'message' => 'Invalid publish path']);
 *        exit;
 *    }
 *    
 *    try {
 *        // Create directory if it doesn't exist
 *        $siteDirectory = $_SERVER['DOCUMENT_ROOT'] . '/published/' . $publishPath;
 *        if (!file_exists($siteDirectory)) {
 *            mkdir($siteDirectory, 0755, true);
 *        }
 *        
 *        // Generate HTML content using template system
 *        $html = generateHTML($siteData, $template);
 *        
 *        // Write the HTML file
 *        $indexFile = $siteDirectory . '/index.html';
 *        file_put_contents($indexFile, $html);
 *        
 *        // Copy necessary template CSS and JS files
 *        copyTemplateAssets($template, $siteDirectory);
 *        
 *        // Process and save uploaded images
 *        processImages($_FILES, $siteDirectory);
 *        
 *        // Update database with publishing information
 *        updateDatabase($siteData, $publishPath);
 *        
 *        // For custom domains: Create .htaccess redirects if needed
 *        if (isset($siteData['customDomain']) && !empty($siteData['customDomain'])) {
 *            createDomainRedirects($siteData['customDomain'], $publishPath);
 *        }
 *        
 *        // Return success
 *        echo json_encode([
 *            'success' => true, 
 *            'url' => '1page.site/' . $publishPath,
 *            'message' => 'Site published successfully'
 *        ]);
 *        
 *    } catch (Exception $e) {
 *        // Log the error server-side
 *        error_log('Site publishing error: ' . $e->getMessage());
 *        
 *        // Return error to client
 *        echo json_encode([
 *            'success' => false,
 *            'message' => 'Error publishing site: ' . $e->getMessage()
 *        ]);
 *    }
 *    
 *    // Helper function to generate HTML
 *    function generateHTML($siteData, $template) {
 *        // Load base template
 *        $templateFile = $_SERVER['DOCUMENT_ROOT'] . '/templates/' . $template . '.html';
 *        $html = file_get_contents($templateFile);
 *        
 *        // Replace placeholders with actual data
 *        $html = str_replace('{{BUSINESS_NAME}}', $siteData['businessName'], $html);
 *        $html = str_replace('{{DESCRIPTION}}', $siteData['description'], $html);
 *        // Add more replacements for each section
 *        
 *        return $html;
 *    }
 *    
 *    // Helper function to copy template assets
 *    function copyTemplateAssets($template, $siteDirectory) {
 *        // Create css and js directories
 *        $cssDir = $siteDirectory . '/css';
 *        $jsDir = $siteDirectory . '/js';
 *        
 *        if (!file_exists($cssDir)) mkdir($cssDir, 0755, true);
 *        if (!file_exists($jsDir)) mkdir($jsDir, 0755, true);
 *        
 *        // Copy template CSS
 *        copy($_SERVER['DOCUMENT_ROOT'] . '/css/' . $template . '-template.css', 
 *             $cssDir . '/' . $template . '-template.css');
 *        
 *        // Copy template JS
 *        copy($_SERVER['DOCUMENT_ROOT'] . '/js/' . $template . '-template.js',
 *             $jsDir . '/' . $template . '-template.js');
 *        
 *        // Copy base styles and JS
 *        copy($_SERVER['DOCUMENT_ROOT'] . '/css/styles.css', $cssDir . '/styles.css');
 *        copy($_SERVER['DOCUMENT_ROOT'] . '/js/main.js', $jsDir . '/main.js');
 *    }
 *    
 *    // Helper function to process uploaded images
 *    function processImages($files, $siteDirectory) {
 *        // Create images directory
 *        $imgDir = $siteDirectory . '/img';
 *        if (!file_exists($imgDir)) mkdir($imgDir, 0755, true);
 *        
 *        // Process logo
 *        if (isset($files['logo']) && $files['logo']['error'] === UPLOAD_ERR_OK) {
 *            $logoPath = $imgDir . '/logo.' . pathinfo($files['logo']['name'], PATHINFO_EXTENSION);
 *            move_uploaded_file($files['logo']['tmp_name'], $logoPath);
 *        }
 *        
 *        // Process other images
 *        if (isset($files['images'])) {
 *            $count = count($files['images']['name']);
 *            for ($i = 0; $i < $count; $i++) {
 *                if ($files['images']['error'][$i] === UPLOAD_ERR_OK) {
 *                    $imagePath = $imgDir . '/image-' . ($i+1) . '.' . 
 *                        pathinfo($files['images']['name'][$i], PATHINFO_EXTENSION);
 *                    move_uploaded_file($files['images']['tmp_name'][$i], $imagePath);
 *                }
 *            }
 *        }
 *    }
 *    
 *    // Helper function for custom domains
 *    function createDomainRedirects($customDomain, $publishPath) {
 *        // Add rule to the main .htaccess file
 *        $htaccessPath = $_SERVER['DOCUMENT_ROOT'] . '/.htaccess';
 *        $customDomainRule = "
 *    # Custom domain for {$customDomain} -> {$publishPath}
 *    RewriteCond %{HTTP_HOST} ^{$customDomain}$ [NC]
 *    RewriteRule ^(.*)$ /published/{$publishPath}/$1 [L]
 *    ";
 *        
 *        // Append the rule to the .htaccess file
 *        file_put_contents($htaccessPath, $customDomainRule, FILE_APPEND);
 *    }
 *    ?>
 *
 * 4. CLIENT-SIDE INTEGRATION
 *    Update the simulateServerPublish function in ai-generator.js to make a real AJAX call:
 *
 *    function publishWebsite(publishData) {
 *        // Show publishing spinner
 *        showPublishingSpinner();
 *        
 *        // Create FormData for file uploads
 *        const formData = new FormData();
 *        formData.append('siteData', JSON.stringify(publishData.siteData));
 *        formData.append('template', publishData.template);
 *        formData.append('publishPath', publishData.publishPath);
 *        
 *        // Add file uploads if available
 *        if (publishData.logo) {
 *            formData.append('logo', publishData.logo);
 *        }
 *        
 *        if (publishData.images && publishData.images.length) {
 *            for (let i = 0; i < publishData.images.length; i++) {
 *                formData.append('images[]', publishData.images[i]);
 *            }
 *        }
 *        
 *        // Make the AJAX call to the server
 *        fetch('/api/publish-site.php', {
 *            method: 'POST',
 *            body: formData
 *        })
 *        .then(response => response.json())
 *        .then(data => {
 *            if (data.success) {
 *                // Update site data
 *                updateSiteData(data);
 *                // Show success message
 *                showSuccessMessage(data.url);
 *            } else {
 *                // Show error message
 *                showErrorMessage(data.message);
 *            }
 *        })
 *        .catch(error => {
 *            showErrorMessage('Network error. Please try again.');
 *            console.error('Publishing error:', error);
 *        })
 *        .finally(() => {
 *            hidePublishingSpinner();
 *        });
 *    }
 */ 
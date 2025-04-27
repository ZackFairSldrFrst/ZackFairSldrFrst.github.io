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
        
        // Generate a random subdomain for the demo
        const randomId = Math.random().toString(36).substring(2, 8);
        data.domain = `${data.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${randomId}.1page.site`;
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
        // Create modal if it doesn't exist
        if (!document.getElementById('publish-modal')) {
            const data = JSON.parse(localStorage.getItem('generatedSiteData'));
            const modal = document.createElement('div');
            modal.id = 'publish-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>Publish Your Website</h2>
                    <p>Your website is ready to go live! Choose your domain option:</p>
                    
                    <div class="domain-options">
                        <div class="domain-option">
                            <input type="radio" id="subdomain" name="domain-type" checked>
                            <label for="subdomain">
                                <strong>Free Subdomain</strong>
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
        
        // In a real implementation, this would call to the server to publish the site
        setTimeout(() => {
            // Update site data
            const data = JSON.parse(localStorage.getItem('generatedSiteData'));
            
            // Check if using custom domain
            if (document.getElementById('custom-domain').checked) {
                const customDomain = document.getElementById('custom-domain-input').value.trim();
                if (customDomain) {
                    data.domain = customDomain;
                }
            }
            
            data.published = true;
            data.publishDate = new Date().toISOString();
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
        }, 3000);
    }
    
    function showPublishSuccess(domain) {
        const successDiv = document.createElement('div');
        successDiv.className = 'publish-success';
        successDiv.innerHTML = `
            <div class="success-icon"><i class="fas fa-check-circle"></i></div>
            <h3>Website Published Successfully!</h3>
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
}); 
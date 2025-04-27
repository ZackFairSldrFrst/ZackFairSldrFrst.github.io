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
        
        // Add AI enhancement notice to UI
        const aiEnhancementStep = document.querySelector('.process-step:nth-child(2) h4');
        if (aiEnhancementStep) {
            aiEnhancementStep.textContent = 'Enhancing Content with AI';
            const aiDesc = aiEnhancementStep.nextElementSibling;
            if (aiDesc) {
                aiDesc.textContent = 'Creating compelling copy and design recommendations';
            }
        }
        
        // Simulate AI processing - but with real AI enhancement
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
        
        // Collect all the business data for AI enhancement
        const formData = collectAllFormData();
        
        // Start the generation process
        updateProcessingStep(currentStep, 'Analyzing business information', true);
        
        // First step - Analyze business information (simulated)
        setTimeout(() => {
            currentStep++;
            updateProgressBar(currentStep, totalSteps);
            updateProcessingStep(currentStep, 'Enhancing content with AI', true);
            
            // Second step - Use real AI to enhance content
            enhanceWithAI(formData, () => {
                // Success callback after AI enhancement
                setTimeout(() => {
                    currentStep++;
                    updateProgressBar(currentStep, totalSteps);
                    updateProcessingStep(currentStep, 'Generating design & layout', true);
                    
                    // Third step - Generate layout (simulated)
                    setTimeout(() => {
                        currentStep++;
                        updateProgressBar(currentStep, totalSteps);
                        updateProcessingStep(currentStep, 'Finalizing website', true);
                        
                        // Final step - Complete the process
                        setTimeout(() => {
                            updateProcessingStep(currentStep, 'Website complete', false);
                            updateProgressBar(totalSteps, totalSteps);
                            
                            // Generate the final preview
                            generateFinalPreview();
                            
                            // Show final actions
                            processingUI.style.display = 'none';
                            resultActions.style.display = 'block';
                            
                            // Setup action buttons
                            setupActionButtons();
                            
                            // Scroll to results
                            resultActions.scrollIntoView({ behavior: 'smooth' });
                        }, 1500);
                    }, 2000);
                }, 1000);
            });
        }, 1500);
    }
    
    // Helper functions for AI processing UI
    function updateProcessingStep(stepIndex, statusText = null, isActive = true) {
        const processSteps = document.querySelectorAll('.process-step');
        
        // Update previous step to completed
        if (stepIndex > 0) {
            const prevStep = processSteps[stepIndex - 1];
            prevStep.querySelector('i').classList.remove('fa-spinner', 'fa-spin');
            prevStep.querySelector('i').classList.add('fa-check-circle');
        }
        
        // Update current step
        if (stepIndex < processSteps.length) {
            const currentStep = processSteps[stepIndex];
            currentStep.classList.add('active');
            
            // Update icon
            const icon = currentStep.querySelector('i');
            icon.classList.remove('fa-clock');
            
            if (isActive) {
                icon.classList.add('fa-spinner', 'fa-spin');
            } else {
                icon.classList.add('fa-check-circle');
            }
            
            // Update status text if provided
            if (statusText && currentStep.querySelector('h4')) {
                currentStep.querySelector('h4').textContent = statusText;
            }
        }
    }
    
    function updateProgressBar(current, total) {
        const progressBar = document.querySelector('.progress');
        const progressText = document.querySelector('.progress-text');
        
        const progressPercentage = ((current) / total) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `${Math.round(progressPercentage)}% Complete`;
    }
    
    // Collect all form data for AI processing
    function collectAllFormData() {
        // Get business name
        const businessName = document.getElementById('business-name').value;
        
        // Get business category
        const category = document.getElementById('business-category').value;
        let businessType = "business";
        switch (category) {
            case 'food': businessType = 'restaurant or cafe'; break;
            case 'style': businessType = 'beauty or style'; break;
            case 'services': businessType = 'local service'; break;
            case 'learn': businessType = 'education'; break;
            case 'events': businessType = 'event planning'; break;
        }
        
        // Get description
        const description = document.getElementById('business-description').value;
        
        // Get contact info
        const phone = document.getElementById('business-phone').value;
        const email = document.getElementById('business-email').value;
        const address = document.getElementById('business-address').value;
        
        // Get services/products
        const services = document.getElementById('services-products').value;
        const servicesList = services.split('\n').filter(item => item.trim() !== '');
        
        // Get color preferences
        const useAutoColors = document.getElementById('auto-color').checked;
        const primaryColor = document.getElementById('primary-color').value;
        const secondaryColor = document.getElementById('secondary-color').value;
        
        // Get selected features
        const selectedFeatures = [];
        document.querySelectorAll('#step-4 .form-check input[type="checkbox"]:checked').forEach(checkbox => {
            selectedFeatures.push(checkbox.id.replace('feature-', ''));
        });
        
        // Get additional notes
        const additionalNotes = document.getElementById('additional-notes').value;
        
        // Combine all data
        return {
            businessName: businessName,
            businessType: businessType,
            category: category,
            description: description,
            contact: {
                phone: phone,
                email: email,
                address: address
            },
            services: servicesList,
            colors: {
                auto: useAutoColors,
                primary: primaryColor,
                secondary: secondaryColor
            },
            features: selectedFeatures,
            additionalNotes: additionalNotes
        };
    }
    
    // Use AI to enhance the website content
    function enhanceWithAI(formData, callback) {
        // Prepare data for the API request
        const aiRequestData = {
            business_name: formData.businessName,
            business_type: formData.businessType,
            business_description: formData.description,
            services: formData.services,
            features: formData.features
        };
        
        // Log the data being sent (for debugging)
        console.log('Sending to AI:', aiRequestData);
        
        // Make the API request - use relative path for easier deployment
        fetch('api/ai-enhance.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(aiRequestData)
        })
        .then(response => {
            console.log('AI API response status:', response.status);
            if (!response.ok) {
                throw new Error(`API response error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('AI enhancement successful:', data);
            
            // Store the AI-generated content for later use
            localStorage.setItem('ai_enhanced_content', JSON.stringify(data));
            
            // Apply some of the content to the preview immediately
            updatePreviewWithAIContent(data);
            
            // Continue with the process
            if (callback) callback();
        })
        .catch(error => {
            // Log the error but continue with default content
            console.error('AI enhancement error:', error);
            
            // Create default content
            const defaultContent = createDefaultContent(formData);
            localStorage.setItem('ai_enhanced_content', JSON.stringify(defaultContent));
            
            // Continue with the process
            if (callback) callback();
        });
    }
    
    // Create default content when AI fails
    function createDefaultContent(formData) {
        return {
            content: {
                headline: `Welcome to ${formData.businessName}`,
                intro: formData.description || `We provide high-quality ${formData.businessType} services.`,
                benefits: [
                    {
                        title: "Professional Service",
                        description: "We pride ourselves on our professionalism and attention to detail."
                    },
                    {
                        title: "Customer Satisfaction",
                        description: "Your satisfaction is our top priority."
                    },
                    {
                        title: "Years of Experience",
                        description: "With our experience, you can trust us to deliver exceptional results."
                    }
                ]
            },
            design_suggestions: {
                color_scheme: {
                    primary: formData.colors.primary,
                    secondary: formData.colors.secondary,
                    accent: '#FFD700'
                },
                font_suggestion: 'Roboto or Open Sans',
                image_style: 'Professional imagery that showcases your business'
            }
        };
    }
    
    // Update the preview with AI-generated content
    function updatePreviewWithAIContent(aiData) {
        const previewIframe = document.getElementById('preview-iframe');
        if (!previewIframe) return;
        
        // Get the iframe document
        const iframeDoc = previewIframe.contentDocument || previewIframe.contentWindow.document;
        if (!iframeDoc) return;
        
        try {
            // Update the preview with the AI-generated content
            const content = aiData.content;
            
            // Create basic preview HTML with AI content
            iframeDoc.open();
            iframeDoc.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        :root {
                            --primary-color: ${aiData.design_suggestions.color_scheme.primary};
                            --secondary-color: ${aiData.design_suggestions.color_scheme.secondary};
                            --accent-color: ${aiData.design_suggestions.color_scheme.accent};
                        }
                        body { 
                            font-family: 'Poppins', sans-serif; 
                            margin: 0; 
                            padding: 0;
                            color: #333;
                        }
                        header {
                            background-color: var(--primary-color);
                            color: white;
                            padding: 20px;
                            text-align: center;
                        }
                        .hero {
                            padding: 40px 20px;
                            text-align: center;
                            background-color: #f8f9fa;
                        }
                        .content {
                            padding: 20px;
                            max-width: 1200px;
                            margin: 0 auto;
                        }
                        .benefits {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 20px;
                            margin-top: 30px;
                        }
                        .benefit-card {
                            flex: 1;
                            min-width: 250px;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                            background-color: white;
                        }
                        h1 { color: white; margin: 0; }
                        h2 { color: var(--primary-color); }
                        .benefit-card h3 { color: var(--primary-color); }
                    </style>
                </head>
                <body>
                    <header>
                        <h1>${content.headline || aiData.business_name}</h1>
                    </header>
                    <section class="hero">
                        <p>${content.intro || "Welcome to our business"}</p>
                    </section>
                    <section class="content">
                        <h2>Why Choose Us</h2>
                        <div class="benefits">
                            ${content.benefits ? content.benefits.map(benefit => `
                                <div class="benefit-card">
                                    <h3>${benefit.title}</h3>
                                    <p>${benefit.description}</p>
                                </div>
                            `).join('') : '<p>Loading benefits...</p>'}
                        </div>
                    </section>
                </body>
                </html>
            `);
            iframeDoc.close();
        } catch (error) {
            console.error('Failed to update preview with AI content:', error);
        }
    }
    
    // Generate final preview with AI-enhanced content
    function generateFinalPreview() {
        // Get the site data
        const siteData = JSON.parse(localStorage.getItem('generatedSiteData'));
        if (!siteData) return;
        
        // Get AI enhanced content
        const aiData = localStorage.getItem('ai_enhanced_content');
        let enhancedContent = null;
        
        try {
            if (aiData) {
                enhancedContent = JSON.parse(aiData);
            }
        } catch (e) {
            console.error('Error parsing AI data:', e);
        }
        
        // Generate a path format URL based on business name
        const randomId = Math.random().toString(36).substring(2, 5);
        siteData.domain = `1page.site/${siteData.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${randomId}`;
        
        // Enhance the site data with AI content
        if (enhancedContent) {
            siteData.aiEnhanced = true;
            
            // Only override if AI content exists
            if (enhancedContent.content) {
                if (enhancedContent.content.headline) {
                    siteData.headline = enhancedContent.content.headline;
                }
                
                if (enhancedContent.content.intro) {
                    siteData.enhancedDescription = enhancedContent.content.intro;
                }
                
                if (enhancedContent.content.benefits) {
                    siteData.benefits = enhancedContent.content.benefits;
                }
            }
            
            // Apply design suggestions if auto colors are enabled or not specified
            if (enhancedContent.design_suggestions && 
                (!siteData.colors || siteData.colors.auto)) {
                
                // Create colors object if it doesn't exist
                if (!siteData.colors) {
                    siteData.colors = {};
                }
                
                // Apply color scheme
                if (enhancedContent.design_suggestions.color_scheme) {
                    siteData.colors.primary = enhancedContent.design_suggestions.color_scheme.primary;
                    siteData.colors.secondary = enhancedContent.design_suggestions.color_scheme.secondary;
                    siteData.colors.accent = enhancedContent.design_suggestions.color_scheme.accent;
                }
                
                // Apply font suggestion
                if (enhancedContent.design_suggestions.font_suggestion) {
                    siteData.fontSuggestion = enhancedContent.design_suggestions.font_suggestion;
                }
                
                // Apply image style suggestion
                if (enhancedContent.design_suggestions.image_style) {
                    siteData.imageStyleSuggestion = enhancedContent.design_suggestions.image_style;
                }
            }
        }
        
        // Save the updated data
        localStorage.setItem('generatedSiteData', JSON.stringify(siteData));
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
        const siteData = JSON.parse(localStorage.getItem('generatedSiteData'));
        
        // Check if using custom domain
        if (document.getElementById('custom-domain').checked) {
            const customDomain = document.getElementById('custom-domain-input').value.trim();
            if (customDomain) {
                siteData.customDomain = customDomain;
            }
        }
        
        // Prepare data for server
        const publishData = {
            site_data: siteData,
            ai_enhanced: true,
            template: siteData.category || 'business',
            publish_path: siteData.domain.replace('1page.site/', '')
        };
        
        // Make the actual publish request to the server
        fetch('api/publish-site.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(publishData)
        })
        .then(response => {
            console.log('Publish response status:', response.status);
            if (!response.ok) {
                throw new Error(`Publish failed with status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log('Site published successfully:', data);
                
                // Update site data
                siteData.published = true;
                siteData.publishDate = new Date().toISOString();
                siteData.publishedUrl = data.url || siteData.domain;
                localStorage.setItem('generatedSiteData', JSON.stringify(siteData));
                
                // Close modal
                closeModal();
                
                // Show success message
                showPublishSuccess(siteData.domain);
                
                // Update publish button
                const mainPublishBtn = document.querySelector('.generated-website-actions .btn-primary');
                mainPublishBtn.textContent = 'View Live Website';
                mainPublishBtn.href = `//${siteData.domain}`;
                
                // Remove the click event handler
                const newPublishBtn = mainPublishBtn.cloneNode(true);
                mainPublishBtn.parentNode.replaceChild(newPublishBtn, mainPublishBtn);
                
            } else {
                // Show error message
                publishBtn.innerHTML = originalText;
                publishBtn.disabled = false;
                alert('Publishing failed: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Publishing error:', error);
            publishBtn.innerHTML = originalText;
            publishBtn.disabled = false;
            alert('Publishing failed. Please try again.');
        });
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
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
                                background-color: #4a6cf7;
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
                                height: 200px;
                                margin: 20px 0;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: #4a6cf7;
                            }
                        </style>
                    </head>
                    <body>
                        <header>
                            <h1>${businessName}</h1>
                            <p>Preliminary Layout Preview</p>
                        </header>
                        <div class="content">
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
                
                // Show final actions after 1 second
                setTimeout(() => {
                    processingUI.style.display = 'none';
                    resultActions.style.display = 'block';
                    
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